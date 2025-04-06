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

  async writeToDisk(): Promise<void> {
    await this.core.writeCollections();
  }

  async add(collectionName: string, data: DocData): Promise<NaroDocument> {
    const collection = this.core.getCollection(collectionName);
    const newItem: NaroDocument = { ...data, id: NaroId.generate() };
    collection.push(newItem);
    this.core.updateCollection(collectionName, collection);
    return structuredClone(newItem);
  }

  /**
   * Retrieves all documents from a specified collection, optionally applying filters and limits.
   *
   * @param {string} collectionName - The name of the collection to retrieve documents from.
   * @param {Options} [options={}] - Options to filter and limit the retrieval of documents.
   * @param {Query[]} [options.filters] - An array of filter conditions to apply to the documents.
   * @param {number} [options.limit] - Maximum number of documents to retrieve.
   * @return {Promise<NaroDocument[]>} A promise that resolves to an array of documents matching the specified filters and limits.
   * @throws {Error} If the specified collection does not exist.
   *
   * @example
   * const users = await db.getAll("users", {
   *   filters: [{ field: "age", operator: ">=", value: 18 }],
   *   limit: 10
   * });
   * console.log(users); // Logs up to 10 users aged 18 or older
   */
  async getAll(collectionName: string, options: Options = {}): Promise<NaroDocument[]> {
    const collection = cloneDeep(this.core.getCollection(collectionName));
    if (!collection) throw new Error(`Collection ${collectionName} does not exist`);
    const { filters, limit } = options;

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

    if (limit !== undefined) filteredCollection = filteredCollection.slice(0, limit);
    return filteredCollection;
  }

  async get(path: string): Promise<NaroDocument | undefined> {
    const { collectionName, collectionId } = NaroPath.validate(path);
    const collection = this.core.getCollection(collectionName);
    return _.find(collection, (item: any) => item.id === collectionId) || undefined;
  }

  async update(path: string, data: any): Promise<NaroDocument> {
    const { collectionName, collectionId } = NaroPath.validate(path);
    const collection = this.core.getCollection(collectionName);
    const itemIndex = _.findIndex(collection, (item: any) => item.id === collectionId);
    if (itemIndex === -1) throw new Error("Item not found");
    collection[itemIndex] = { ...collection[itemIndex], ...data };
    this.core.updateCollection(collectionName, collection);
    return collection[itemIndex]
  }

  async delete(path: string): Promise<void> {
    const { collectionName, collectionId } = NaroPath.validate(path);
    const collection = this.core.getCollection(collectionName);
    const itemIndex = _.findIndex(collection, (item: any) => item.id === collectionId);
    if (itemIndex === -1) return;
    collection.splice(itemIndex, 1);
    this.core.updateCollection(collectionName, collection);
  }
}




