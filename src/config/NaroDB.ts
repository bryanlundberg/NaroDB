import fs from 'fs-extra';
import _ from 'lodash';
import msgpack from "msgpack-lite";

export class NaroDB {
  private rootPath: string = "./data";
  private readonly dbName: string;
  private readonly logFileName: string = "data.bin";
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
          const binaryData = fs.readFileSync(dataPath);
          this.collections[folderName] = msgpack.decode(binaryData);
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
    const newItem = { ...data, id: this.generateId() };
    this.collections[collectionName].push(newItem);
    return structuredClone(newItem);
  }

  private generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
  }

  getAll(collectionName: string) {
    return this.collections[collectionName];
  }

  get(path: string) {
    const { collectionName, collectionId } = this.validatePath(path);
    // TODO: Implement subCollection support
    return _.find(this.collections[collectionName] || [], (item: any) => item.id === collectionId) || undefined;
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

    const itemIndex = _.findIndex(collection, (item: any) => item.id === collectionId);
    if (itemIndex === -1) throw new Error("Item not found");

    collection[itemIndex] = { ...collection[itemIndex], ...data };
  }

  delete(path: string) {
    const { collectionName, collectionId } = this.validatePath(path);
    const collection = this.collections[collectionName];
    if (!collection) throw new Error("Collection not found");

    const itemIndex = _.findIndex(collection, (item: any) => item.id === collectionId);
    if (itemIndex === -1) throw new Error("Item not found");

    collection.splice(itemIndex, 1);
  }

  writeToFile() {
    Object.keys(this.collections).forEach(collectionName => {
      const dataPath = `${this.getPathToDB()}/${collectionName}/${this.logFileName}`;
      const binaryData = msgpack.encode(this.collections[collectionName]);
      fs.writeFileSync(dataPath, binaryData);
    });
  }
}
