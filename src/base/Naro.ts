import _ from 'lodash';
import { Core } from "../core/Core";
import { NaroPath } from "../manage/paths/NaroPath";
import { NaroId } from "../utils/IdGenerator";
import { NaroDocument } from "./interfaces/NaroDocument";

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

  async add(collectionName: string, item: Item): Promise<NaroDocument> {
    const collection = this.core.getCollection(collectionName);
    const newItem: NaroDocument = { ...item, id: NaroId.generate() };
    collection.push(newItem);
    this.core.updateCollection(collectionName, collection);
    return structuredClone(newItem);
  }

  async getAll(collectionName: string): Promise<NaroDocument[]> {
    return this.core.getCollection(collectionName);
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
