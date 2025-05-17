import * as _ from 'lodash';
import { Core } from "../core/Core";
import { NaroPath } from "../manage/paths/NaroPath";
import { NaroId } from "../utils/IdGenerator";
import { NaroDocument } from "../types/NaroDocument.interface";
import { Options } from "../types/Options.interface";
import { Query } from "../types/Query.interface";
import axios from "redaxios";
import { DocData } from "../types/DocData.interface";

/**
 * The Naro class provides methods to manage and manipulate collections
 * of documents stored in the root `./data` folder.
 *
 * @example
 * const db = new Naro("database-name");
 *
 * // Use separate database names for production and development environments
 * const db = new Naro(process.env.NODE_ENV === "production" ? "prod-database-name" : "dev-database-name");
 */
export class Naro {
  private readonly dbName!: string;
  private readonly core!: Core;
  private readonly host!: string;
  private readonly orgId!: string;
  private readonly projectId!: string;

  constructor(dbName: string, options?: { URI?: string }) {
    if (options?.URI) {
      const [baseUrl, orgId, projectId] = options.URI.split(';');
      this.host = baseUrl;
      this.orgId = orgId;
      this.projectId = projectId;
      if (!this.host || !this.orgId || !this.projectId) throw new Error("Invalid URI format.");
      return;
    }

    if (dbName.includes('/')) throw new Error("dbName cannot contain '/'");
    this.dbName = dbName;
    const rootPath = `${process.cwd()}/data/${this.dbName}`;
    this.core = new Core(rootPath);
    this.core.initialize();
    this.registerProcessListeners();
  }

  private registerProcessListeners() {
    const cleanUpAndExit = async (exitCode?: number) => {
      this.core.writeCollections();
      process.removeAllListeners('exit');
      process.removeAllListeners('SIGINT');
      process.removeAllListeners('SIGTERM');
      if (exitCode !== undefined) process.exit(exitCode);
    };

    process.setMaxListeners(Infinity);
    process.on('exit', cleanUpAndExit);
    process.on('SIGINT', () => cleanUpAndExit(0));
    process.on('SIGTERM', () => cleanUpAndExit(0));
  }

  /**
   * Writes the current collections data to disk storage.
   *
   * @return {Promise<void>} A promise that resolves when the write operation completes successfully.
   */
  async writeToDisk(): Promise<void> {
    this.core.writeCollections();
  }

  /**
   * Adds a new document to the specified collection.
   *
   * @param {string} path - The name of the collection to add the data to.
   * @param {DocData} data - The data to be added as a new document.
   * @return {Promise<NaroDocument>} A promise that resolves to the newly added document.
   *
   * @example
   * const db = new Naro("myDatabase");
   *
   * const newUser = await db.add("users", { name: "John Doe", age: 30 });
   * console.log(newUser);
   * // Output: { id: "generated-id", createdAt: 1696872345000, name: "John Doe", age: 30 }
   */
  async add(path: string, data: DocData): Promise<NaroDocument> {
    const { collectionName } = NaroPath.validate(path);
    if (this.host) return await this.serverRequest("add", [path, data]);
    const collection = this.core.getCollection(collectionName);
    const id = NaroId.generate();
    const source = { id, createdAt: Date.now(), path: `${collectionName}/${id}` };
    const newItem: NaroDocument = Object.assign(data, source);
    collection.push(newItem);
    this.core.updateCollection(collectionName, collection);
    return _.cloneDeep(newItem);
  }

  /**
   * Sends a request to the server using the specified method and parameters.
   *
   * @param {string} method - The name of the method to be invoked on the server.
   * @param {any[]} params - The parameters to be sent with the request.
   * @return {Promise<any>} A promise that resolves to the response data from the server.
   *
   * @throws {Error} If the request fails, an error will be thrown by `axios.post`.
   *
   * @example
   * // Example usage:
   * const response = await this.serverRequest("add", ["users", { name: "John Doe", age: 30 }]);
   * console.log(response);
   * // Output: { success: true, result: {
   * //   name: 'John Doe',
   * //   age: 30,
   * //   id: 'mamhun2et7dhc03xx',
   * //   createdAt: 1747139672390,
   * //   path: 'users/mamhun2et7dhc03xx'
   * // } }
   */
  private async serverRequest(method: string, params: any[]): Promise<any> {
    const response = await axios.post(this.host, {
      orgId: this.orgId,
      projectId: this.projectId,
      method,
      params
    });

    return response.data;
  }

  /**
   * Overwrite a document in the specified collection using the provided data.
   *
   * @param {string} path - The name of the collection to set the data in.
   * @param {DocData} data - The data to be set as a document.
   * @return {Promise<NaroDocument>} A promise that resolves to the newly set document.
   *
   * @example
   * const db = new Naro("myDatabase");
   *
   * const updatedUser = await db.set("users", { id: "123", createdAt: Date.now(), name: "Jane Doe", age: 28 });
   * console.log(updatedUser);
   * // Output: { id: "123", createdAt: 1696872345000, name: "Jane Doe", age: 28 }
   */
  async set(path: string, data: DocData): Promise<NaroDocument> {
    const { collectionName, collectionId, subCollectionName, subCollectionId } = NaroPath.validate(path);
    if (!collectionId) throw new Error("Collection ID is required");
    if (subCollectionName) throw new Error("Sub-collection is not supported in set method");
    if (subCollectionId) throw new Error("Sub-collection ID is not supported in set method");
    if (this.host) return await this.serverRequest("set", [path, data]);
    const collection = this.core.getCollection(collectionName);
    const source = { path: `${collectionName}/${collectionId}`, createdAt: Date.now(), id: collectionId };
    const newItem: NaroDocument = Object.assign(data, source);
    const existingIndex = _.findIndex(collection, (item) => item.id === collectionId);
    existingIndex !== -1 ? collection[existingIndex] = newItem : collection.push(newItem);
    this.core.updateCollection(collectionName, collection);
    return _.cloneDeep(newItem);
  }

  /**
   * Retrieves all documents from a specified collection, optionally applying filters and limits,
   * and populates specified fields with referenced documents from other collections.
   *
   * @param {string} path - The name of the collection to retrieve documents from.
   * @param {Options} [options={}] - Options to filter and limit the retrieval of documents.
   * @param {Query[]} [options.filters] - An array of filter conditions to apply to the documents.
   * @param {number} [options.limit] - Maximum number of documents to retrieve.
   * @param {string[]} [options.populate] - An array of fields to populate.
   * @param {number} [options.offset] - Number of documents to skip before starting to collect the result set.
   * @return {Promise<NaroDocument[]>} A promise that resolves to an array of documents matching the specified filters and limits, with populated fields.
   * @throws {Error} If the specified collection or referenced collection does not exist.
   *
   * @example
   * const users = await db.getAll("users", {
   *   filters: [{ field: "age", operator: ">=", value: 18 }],
   *   limit: 10,
   *   populate: ["profile"]
   * });
   * console.log(users); // Logs up to 10 users aged 18 or older with populated "profile" field
   */
  async getAll(path: string, options: Options = {}): Promise<NaroDocument[]> {
    const { collectionName } = NaroPath.validate(path);
    if (this.host) return await this.serverRequest("getAll", [path, options]);
    const collection = _.cloneDeep(this.core.getCollection(collectionName));
    const { filters, limit, populate, offset = 0 } = options;

    let filteredCollection = collection;

    filteredCollection = this.filterCollection(filteredCollection, filters || []);
    filteredCollection = filteredCollection.slice(offset);
    filteredCollection = this.limitDocuments(filteredCollection, limit);
    filteredCollection = await this.populateCollection(filteredCollection, populate);

    return filteredCollection;
  }

  /**
   * Filters a collection of `NaroDocument` objects based on the specified query filters.
   *
   * @param {NaroDocument[]} docs - The array of `NaroDocument` objects to be filtered.
   * @param {Query[]} filters - An array of query objects, each containing `field`, `operator`, and `value`,
   *                             which define the filter criteria.
   * @return {NaroDocument[]} A new array of `NaroDocument` objects that satisfy all the specified filters.
   */
  private filterCollection(docs: NaroDocument[], filters: Query[]): NaroDocument[] {
    if (!filters.every(q => ["==", "!=", "<", "<=", ">", ">="].includes(q.operator))) throw new Error("Invalid operator in filter");
    return docs.filter(doc =>
      filters.every((q: Query) => {
        const { field, operator, value } = q;
        const docValue = doc[field];
        switch (operator) {
          case "==":
            return docValue == value;
          case "!=":
            return docValue != value;
          case "<":
            return typeof docValue === "number" && typeof value === "number" && !Number.isNaN(docValue) && !Number.isNaN(value) && docValue < value;
          case "<=":
            return typeof docValue === "number" && typeof value === "number" && !Number.isNaN(docValue) && !Number.isNaN(value) && docValue <= value;
          case ">":
            return typeof docValue === "number" && typeof value === "number" && !Number.isNaN(docValue) && !Number.isNaN(value) && docValue > value;
          case ">=":
            return typeof docValue === "number" && typeof value === "number" && !Number.isNaN(docValue) && !Number.isNaN(value) && docValue >= value;
        }
      })
    );
  }

  /**
   * Populates the specified fields of a document with their corresponding referenced documents.
   *
   * @param {NaroDocument} doc - The document to be populated.
   * @param {string[] | undefined} populateFields - An array of field names to populate, or undefined if no fields are specified.
   * @return {Promise<NaroDocument>} A promise that resolves to the populated document.
   *
   * @example
   * const db = new Naro("myDatabase");
   *
   * const profile = await db.add("profiles", { bio: "Software Developer", skills: ["TypeScript", "Node.js"] });
   * const user = await db.add("users", { name: "John Doe", profile: `profiles/${profile.id}` });
   *
   * const populatedUser = await db.populate(user, ["profile"]);
   * console.log(populatedUser);
   * // Output:
   * // {
   * //   id: "generated-id",
   * //   createdAt: 1696872345000,
   * //   name: "John Doe",
   * //   profile: {
   * //     id: "generated-id",
   * //     createdAt: 1696872345000,
   * //     bio: "Software Developer",
   * //     skills: ["TypeScript", "Node.js"]
   * //     path: "profiles/generated-id"
   * //   },
   * //     path: "users/generated-id"
   * // }
   */
  async populate(doc: NaroDocument, populateFields: string[] | undefined): Promise<NaroDocument> {
    if (!populateFields) return doc;
    if (!populateFields.length) throw new Error("Populate fields cannot be an empty array");
    if (this.host) return await this.serverRequest("populate", [doc, populateFields]);

    await Promise.all(populateFields.map(async (field) => {
      const refPath = doc[field];
      if (typeof refPath === "string") {
        const refDoc = await this.get(refPath);
        if (refDoc) {
          doc[field] = refDoc;
        }
      }
    }));

    return _.cloneDeep(doc);
  }

  /**
   * Populates the specified fields within a collection of documents.
   *
   * @param {NaroDocument[]} docs - The collection of documents to be populated.
   * @param {string[] | undefined} populateFields - The fields to populate within each document. If undefined or empty, no fields are populated.
   * @return {Promise<NaroDocument[]>} A promise resolving to the collection of documents with the specified fields populated.
   *
   * @example
   * const db = new Naro("myDatabase");
   *
   * const profile = await db.add("profiles", { bio: "Engineer", skills: ["JavaScript", "TypeScript"] });
   * const user1 = await db.add("users", { name: "Alice", profile: `profiles/${profile.id}` });
   * const user2 = await db.add("users", { name: "Bob", profile: `profiles/${profile.id}` });
   *
   * const populatedUsers = await db.populateCollection([user1, user2], ["profile"]);
   * console.log(populatedUsers);
   * // Output:
   * // [
   * //   {
   * //     id: "generated-id",
   * //     createdAt: 1696872345000,
   * //     name: "Alice",
   * //     profile: {
   * //       id: "generated-id",
   * //       createdAt: 1696872345000,
   * //       bio: "Engineer",
   * //       skills: ["JavaScript", "TypeScript"],
   * //       path: "profiles/generated-id"
   * //     }
   * //     path: "users/generated-id"
   * //   },
   * //   {
   * //     id: "generated-id",
   * //     createdAt: 1696872345000,
   * //     name: "Bob",
   * //     profile: {
   * //       id: "generated-id",
   * //       createdAt: 1696872345000,
   * //       bio: "Engineer",
   * //       skills: ["JavaScript", "TypeScript"],
   * //       path: "profiles/generated-id"
   * //     },
   * //     path: "users/generated-id"
   * //   }
   * // ]
   */
  async populateCollection(docs: NaroDocument[], populateFields: string[] | undefined): Promise<NaroDocument[]> {
    if (!populateFields || populateFields.length === 0) return docs;
    return Promise.all(docs.map(doc => this.populate(doc, populateFields)));
  }

  /**
   * Limits the number of documents in a collection to the specified limit.
   *
   * @param {NaroDocument[]} collection - The collection of documents to limit.
   * @param {number} [limit] - The maximum number of documents to include. If undefined, the entire collection is returned.
   * @return {NaroDocument[]} A new array containing up to the specified number of documents.
   *
   * @example
   * const documents = [
   *   { id: "1", createdAt: 1696872345000, path: "items/1" },
   *   { id: "2", createdAt: 1696872346000, path: "items/2" },
   *   { id: "3", createdAt: 1696872347000, path: "items/3" }
   * ];
   *
   * const limitedDocuments = limitDocuments(documents, 2);
   * console.log(limitedDocuments);
   * // Output:
   * // [
   * //   { id: "1", createdAt: 1696872345000, path: "items/1" },
   * //   { id: "2", createdAt: 1696872346000, path: "items/2" }
   * // ]
   */
  private limitDocuments(collection: NaroDocument[], limit?: number): NaroDocument[] {
    if (limit === undefined) return collection;
    return collection.slice(0, limit);
  }

  /**
   * Retrieves a document from the given path.
   *
   * @param {string} path - The path of the document to retrieve.
   * @return {Promise<NaroDocument | undefined>} A promise that resolves to the retrieved document
   * or undefined if the document is not found.
   *
   * @example
   * const db = new Naro("myDatabase");
   *
   * const user = await db.get("users/123");
   * console.log(user);
   * // Output: { id: "123", createdAt: 1696872345000, name: "John Doe", age: 30 } (if found)
   */
  async get(path: string): Promise<NaroDocument | undefined> {
    const { collectionName, collectionId } = NaroPath.validate(path);
    if (this.host) return await this.serverRequest("get", [path]);
    const collection = this.core.getCollection(collectionName);
    return _.find(collection, (item: any) => item.id === collectionId) || undefined;
  }

  /**
   * Updates a document within a specified collection.
   *
   * @param {string} path - The path to the document, which includes collection name and document ID.
   * @param {any} data - The new data to merge with the existing document.
   * @return {Promise<NaroDocument>} A promise that resolves to the updated document.
   *
   * @example
   * const db = new Naro("myDatabase");
   *
   * const initialUser = await db.add("users", { name: "John Doe", age: 25 });
   * const updatedUser = await db.update(`users/${initialUser.id}`, { age: 30 });
   * console.log(updatedUser);
   * // Output: { id: "generated-id", createdAt: 1696872345000, name: "John Doe", age: 30 }
   */
  async update(path: string, data: any): Promise<NaroDocument> {
    const { collectionName, collectionId } = NaroPath.validate(path);
    if (!collectionId) throw new Error("Collection ID is required");
    if (this.host) return await this.serverRequest("update", [path, data]);
    const collection = this.core.getCollection(collectionName);
    const itemIndex = _.findIndex(collection, (item: any) => item.id === collectionId);
    if (itemIndex === -1) throw new Error("Item not found");
    collection[itemIndex] = { ...collection[itemIndex], ...data };
    this.core.updateCollection(collectionName, collection);
    return collection[itemIndex];
  }

  /**
   * Deletes an item from the specified collection based on the given path.
   * If the ID does not exist, the method does nothing.
   *
   * @param {string} path - The path identifying the collection and the item to delete.
   * @return {Promise<void>} A promise that resolves when the deletion is complete.
   *
   * @example
   * const db = new Naro("myDatabase");
   *
   * // Adding a new user
   * const user = await db.add("users", { name: "Jane Doe", age: 28 });
   * console.log(await db.getAll("users")); // Output: [{ id: "generated-id", name: "Jane Doe", age: 28, createdAt: 1696872345000 }]
   *
   * // Deleting the user
   * await db.delete(`users/${user.id}`);
   * console.log(await db.getAll("users")); // Output: []
   */
  async delete(path: string): Promise<void> {
    const { collectionName, collectionId } = NaroPath.validate(path);
    if (!collectionId) throw new Error("Collection ID is required");
    if (this.host) return await this.serverRequest("delete", [path]);
    const collection = this.core.getCollection(collectionName);
    const itemIndex = _.findIndex(collection, (item: any) => item.id === collectionId);
    if (itemIndex === -1 || !collection[itemIndex]) return;
    collection.splice(itemIndex, 1);
    this.core.updateCollection(collectionName, collection);
  }

  /**
   * Checks if a document exists in the specified collection based on the given path.
   *
   * @param {string} path - The path to the document, which includes the collection name and document ID.
   *                        The path should follow the format: 'collectionName/id'.
   * @return {Promise<boolean>} A promise that resolves to `true` if the document exists, or `false` otherwise.
   *
   * @example
   * const db = new Naro("myDatabase");
   *
   * const exists = await db.exists("users/123");
   * console.log(exists); // Output: true or false
   */
  async exists(path: string): Promise<boolean> {
    const { collectionName, collectionId } = NaroPath.validate(path);
    if (!collectionId) throw new Error("Collection ID is required");
    if (this.host) return await this.serverRequest("exists", [path]);
    const collection = this.core.getCollection(collectionName);
    return _.some(collection, (item: any) => item.id === collectionId);
  }

  /**
   * Counts the number of documents in a specified collection.
   *
   * @param {string} path - The name of the collection to count documents in.
   * @return {Promise<number>} A promise that resolves to the number of documents in the collection.
   *
   * @example
   * const db = new Naro("myDatabase");
   *
   * const count = await db.count("users");
   * console.log(count); // Output: 5 (if there are 5 documents in the "users" collection)
   */
  async count(path: string): Promise<number> {
    const { collectionName } = NaroPath.validate(path);
    if (this.host) return await this.serverRequest("count", [path]);
    const collection = this.core.getCollection(collectionName);
    return collection.length;
  }

  /**
   * Deletes all documents in a specified collection.
   *
   * @param {string} path - The name of the collection to clear.
   * @return {Promise<void>} A promise that resolves when the collection is cleared.
   *
   * @example
   * const db = new Naro("myDatabase");
   *
   * await db.clear("users");
   * console.log(await db.getAll("users")); // Output: []
   */
  async clear(path: string): Promise<void> {
    const { collectionName, collectionId } = NaroPath.validate(path);
    if (collectionId) throw new Error("Collection ID detected. Use delete method instead.");
    if (this.host) return await this.serverRequest("clear", [path]);
    this.core.removeCollection(collectionName);
  }

  /**
   * Retrieves all collections in the database as a structured object.
   * Each key in the returned object represents a collection name,
   * and the value is an array of documents within that collection.
   *
   * @return {Record<string, NaroDocument[]>} An object containing all collections
   * and their respective documents.
   */
  async getStructuredCollections(): Promise<Record<string, NaroDocument[]>> {
    if (this.host) return this.serverRequest("getStructuredCollections", []);
    return this.core.getStructuredCollections();
  }
}




