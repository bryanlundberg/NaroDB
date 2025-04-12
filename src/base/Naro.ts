import _, { cloneDeep } from 'lodash';
import { Core } from "../core/Core";
import { NaroPath } from "../manage/paths/NaroPath";
import { NaroId } from "../utils/IdGenerator";
import { NaroDocument } from "./interfaces/NaroDocument.interface";
import { Options } from "./interfaces/Options.interface";
import { Query } from "./interfaces/Query.interface";

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
  private readonly dbName: string;
  private readonly core: Core;

  constructor(dbName: string) {
    if (dbName.includes('/')) throw new Error("dbName cannot contain '/'");
    this.dbName = dbName;
    const rootPath = `./data/${this.dbName}`;
    this.core = new Core(rootPath);
    this.core.initialize().catch(error => {
      throw new Error(`Failed to initialize core: ${error.message}`);
    });
  }

  /**
   * Writes the current collections data to disk storage.
   *
   * @return {Promise<void>} A promise that resolves when the write operation completes successfully.
   */
  async writeToDisk(): Promise<void> {
    await this.core.writeCollections();
  }

  /**
   * Adds a new document to the specified collection.
   *
   * @param {string} collectionName - The name of the collection to add the data to.
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
  async add(collectionName: string, data: DocData): Promise<NaroDocument> {
    const collection = this.core.getCollection(collectionName);
    const id = NaroId.generate();
    const source = { id, createdAt: Date.now(), path: `${collectionName}/${id}` };
    const newItem: NaroDocument = Object.assign(data, source);
    collection.push(newItem);
    this.core.updateCollection(collectionName, collection);
    return newItem;
  }

  /**
   * Retrieves all documents from a specified collection, optionally applying filters and limits,
   * and populates specified fields with referenced documents from other collections.
   *
   * @param {string} collectionName - The name of the collection to retrieve documents from.
   * @param {Options} [options={}] - Options to filter and limit the retrieval of documents.
   * @param {Query[]} [options.filters] - An array of filter conditions to apply to the documents.
   * @param {number} [options.limit] - Maximum number of documents to retrieve.
   * @param {string[]} [options.populate] - An array of fields to populate.
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
  async getAll(collectionName: string, options: Options = {}): Promise<NaroDocument[]> {
    const collection = cloneDeep(this.core.getCollection(collectionName));
    if (!collection) throw new Error(`Collection ${collectionName} does not exist`);
    const { filters, limit, populate } = options;

    let filteredCollection = collection;

    if (filters) {
      filteredCollection = filteredCollection.filter(document =>
        filters.every((q: Query) => {
          const { field, operator, value } = q;
          const docValue = document[field];
          switch (operator) {
            case "==":
              return docValue == value;
            case "!=":
              return docValue != value;
            case "<":
              return docValue < value;
            case "<=":
              return docValue <= value;
            case ">":
              return docValue > value;
            case ">=":
              return docValue >= value;
            default:
              return false;
          }
        })
      );
    }

    filteredCollection = this.limitDocuments(filteredCollection, limit);
    filteredCollection = await this.populateCollection(filteredCollection, populate);

    return filteredCollection;
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
    if (!populateFields?.length) return doc;
    const populatedDoc = cloneDeep(doc);

    await Promise.all(populateFields.map(async (field) => {
      const refPath = populatedDoc[field];
      if (typeof refPath === "string") {
        const refDoc = await this.get(refPath);
        if (refDoc) {
          populatedDoc[field] = refDoc;
        }
      }
    }));

    return populatedDoc;
  }

  /**
   * Populates the specified fields within a collection of documents.
   *
   * @param {NaroDocument[]} collection - The collection of documents to be populated.
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
  async populateCollection(collection: NaroDocument[], populateFields: string[] | undefined): Promise<NaroDocument[]> {
    if (!populateFields || populateFields.length === 0) return collection;

    return Promise.all(collection.map(doc => this.populate(doc, populateFields)));
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
    const collection = this.core.getCollection(collectionName);
    const itemIndex = _.findIndex(collection, (item: any) => item.id === collectionId);
    if (itemIndex === -1 || !collection[itemIndex]) return;
    collection.splice(itemIndex, 1);
    this.core.updateCollection(collectionName, collection);
  }
}




