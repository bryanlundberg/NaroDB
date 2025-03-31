import { NaroFiler } from "../manage/files/NaroFiler";
import { fileAsync } from "fs-jetpack";
import { cloneDeep } from "lodash";

export class Core {
  private readonly rootPath: string;
  private collections: { [key: string]: any } = {};
  private logFileName: string = "data.bin";

  constructor(rootPath: string) {
    this.rootPath = rootPath;
  }

  async initialize() {
    await NaroFiler.ensureDirectory(this.rootPath);
    await this.loadCollections();
  }

  getStructuredCollections() {
    return this.collections;
  }

 async loadCollections() {
    const directories = await NaroFiler.listDirectories(this.rootPath);
    for (const folderName of directories) {
      const folderPath = `${this.rootPath}/${folderName}`;
      const dataPath = `${folderPath}/${this.logFileName}`;
      await fileAsync(dataPath);
      this.collections[folderName] = await NaroFiler.readBinaryFile(dataPath);
    }
    return this.collections;
  }

  getCollection(name: string): any[] {
    if (!this.collections[name]) return this.collections[name] = [];
    return this.collections[name];
  }

  updateCollection(name: string, data: any[]) {
    this.collections[name] = cloneDeep(data)
  }

  async writeCollections() {
    Object.keys(this.collections).forEach((collectionName) => {
      const collectionPath = `${this.rootPath}/${collectionName}`;
      NaroFiler.ensureDirectory(collectionPath);
      const dataPath = `${collectionPath}/${this.logFileName}`;
      NaroFiler.writeBinaryFile(dataPath, this.collections[collectionName]);
    });
  }
}
