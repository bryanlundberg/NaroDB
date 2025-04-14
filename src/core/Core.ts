import { NaroFiler } from "../manage/files/NaroFiler";
import { file } from "fs-jetpack";
import { cloneDeep } from "lodash";

export class Core {
  private readonly rootPath: string;
  private collections: { [key: string]: any } = {};
  private logFileName: string = "data.bin";

  constructor(rootPath: string) {
    this.rootPath = rootPath;
  }

  initialize() {
    NaroFiler.ensureDirectory(this.rootPath);
    this.loadCollections();
  }

  getStructuredCollections() {
    return this.collections;
  }

  loadCollections() {
    const directories = NaroFiler.listDirectories(this.rootPath);
    for (const folderName of directories) {
      const folderPath = `${this.rootPath}/${folderName}`;
      const dataPath = `${folderPath}/${this.logFileName}`;
      file(dataPath);
      this.collections[folderName] = NaroFiler.readBinaryFile(dataPath);
    }
    return this.collections;
  }

  getCollection(name: string): any[] {
    if (!this.collections[name]) return this.collections[name] = [];
    return this.collections[name];
  }

  updateCollection(name: string, data: any[]) {
    this.collections[name] = cloneDeep(data);
  }

  writeCollections() {
    Object.keys(this.collections).forEach((collectionName) => {
      const collectionPath = `${this.rootPath}/${collectionName}`;
      NaroFiler.ensureDirectory(collectionPath);
      const dataPath = `${collectionPath}/${this.logFileName}`;
      NaroFiler.writeBinaryFile(dataPath, this.collections[collectionName]);
    });
  }

  async writeCollection(path: string) {
    const collectionPath = `${this.rootPath}/${path}`;
    await NaroFiler.ensureDirectory(collectionPath);
    const dataPath = `${collectionPath}/${this.logFileName}`;
    await NaroFiler.writeBinaryFile(dataPath, this.collections[path]);
  }
}
