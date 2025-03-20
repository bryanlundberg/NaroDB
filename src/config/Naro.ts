import _ from 'lodash';
import { CollectionManager } from "./CollectionManager.ts";
import { NaroPath } from "./NaroPath.ts";

export class Naro {
  private readonly dbName: string;
  private readonly collectionManager: CollectionManager;

  constructor(dbName: string) {
    if (dbName.includes('/')) {
      throw new Error("dbName cannot contain '/'");
    }
    this.dbName = dbName;
    const rootPath = `./data/${this.dbName}`;
    this.collectionManager = new CollectionManager(rootPath);
    this.collectionManager.loadCollections();
    console.log(this.collectionManager)
  }

  add(collectionName: string, data: any) {
    const collection = this.collectionManager.getCollection(collectionName);
    const newItem = { ...data, id: this.generateId() };
    collection.push(newItem);
    this.collectionManager.updateCollection(collectionName, collection);
    return structuredClone(newItem);
  }

  getAll(collectionName: string) {
    return this.collectionManager.getCollection(collectionName);
  }

  get(path: string) {
    const { collectionName, collectionId } = NaroPath.validate(path);
    const collection = this.collectionManager.getCollection(collectionName);
    return _.find(collection, (item: any) => item.id === collectionId) || undefined;
  }

  update(path: string, data: any) {
    const { collectionName, collectionId } = NaroPath.validate(path);
    const collection = this.collectionManager.getCollection(collectionName);
    const itemIndex = _.findIndex(collection, (item: any) => item.id === collectionId);
    if (itemIndex === -1) throw new Error("Item not found");
    collection[itemIndex] = { ...collection[itemIndex], ...data };
    this.collectionManager.updateCollection(collectionName, collection);
  }

  delete(path: string) {
    const { collectionName, collectionId } = NaroPath.validate(path);
    const collection = this.collectionManager.getCollection(collectionName);
    const itemIndex = _.findIndex(collection, (item: any) => item.id === collectionId);
    if (itemIndex === -1) throw new Error("Item not found");
    collection.splice(itemIndex, 1);
    this.collectionManager.updateCollection(collectionName, collection);
  }

  writeToFile() {
    this.collectionManager.saveCollections();
  }

  private generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
  }
}
