import fs from 'fs-extra';
import { ObjectId } from "bson";
import { findIndex, find } from 'lodash';

export class AquaBase {
  private rootPath: string = "./data";
  private readonly dbName: string;
  private readonly logFileName: string = "data.json";
  private collections: { [key: string]: any } = {};

  constructor(dbName: string) {
    if (dbName.includes('/')) throw new Error("dbName cannot contain '/'");
    this.dbName = dbName;
    this.initializeDir(this.getPathToDB());
    this.preloader();
  }

  private initializeDir(path: string) {
    fs.ensureDirSync(path);
  }

  private preloader() {
    const collectionsDir = this.getPathToDB();
    fs.readdirSync(collectionsDir).forEach(folderName => {
      const folderPath = `${collectionsDir}/${folderName}`;
      if (fs.lstatSync(folderPath).isDirectory()) {
        const dataPath = `${folderPath}/${this.logFileName}`;
        if (fs.existsSync(dataPath)) {
          this.collections[folderName] = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
        } else {
          this.collections[folderName] = [];
        }
      }
    });
  }

  private getPathToDB() {
    return `${this.rootPath}/${this.dbName}`;
  }

  add(collectionName: string, data: any) {
    const newItem = { ...data, id: new ObjectId().toHexString() };
    this.collections[collectionName].push(newItem);
    return structuredClone(newItem);
  }

  getAll(collectionName: string) {
    return this.collections[collectionName];
  }

  get(path: string) {
    const { collectionName, collectionId } = this.validatePath(path);
    // TODO: Implement subCollection support
    return find(this.collections[collectionName] || [], (item: any) => item.id === collectionId) || undefined;
  }

  private validatePath(path: string) {
    const pathParts = path.split('/');
    if (pathParts.length <= 1) throw new Error("Invalid path format. Ensure the path is in the format 'collectionName/id'.");
    if (pathParts.length === 3 || pathParts.length >= 5) throw new Error("Invalid path format. Ensure the path is in the format 'collectionName/id/subCollectionName/id'.");
    return {
      collectionName: pathParts[0],
      collectionId: pathParts[1],
      subCollectionName: pathParts[2],
      subCollectionId: pathParts[3]
    };
  }

  update(path: string, data: any) {
    const { collectionName, collectionId } = this.validatePath(path);
    const collection = this.collections[collectionName];
    if (!collection) throw new Error("Collection not found");

    const itemIndex = findIndex(collection, (item: any) => item.id === collectionId);
    if (itemIndex === -1) throw new Error("Item not found");

    collection[itemIndex] = { ...collection[itemIndex], ...data };
  }

  delete(path: string) {
    const { collectionName, collectionId } = this.validatePath(path);
    const collection = this.collections[collectionName];
    if (!collection) throw new Error("Collection not found");

    const itemIndex = findIndex(collection, (item: any) => item.id === collectionId);
    if (itemIndex === -1) throw new Error("Item not found");

    collection.splice(itemIndex, 1);
  }

  writeToFile() {
    Object.keys(this.collections).forEach(collectionName => {
      const dataPath = `${this.getPathToDB()}/${collectionName}/${this.logFileName}`;
      fs.writeFileSync(dataPath, JSON.stringify(this.collections[collectionName]));
    });
  }
}
