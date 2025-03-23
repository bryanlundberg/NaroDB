import fs from "fs-extra";
import msgpack from "msgpack-lite";
import { NaroFiler } from "../manage/files/NaroFiler";

export class Core {
  private readonly rootPath: string;
  private collections: { [key: string]: any } = {};
  private logFileName: string = "data.bin";

  constructor(rootPath: string) {
    this.rootPath = rootPath;
    NaroFiler.ensureDirectory(this.rootPath);
    this.loadCollections();
    return this;
  }

  getStore() {
    return this.collections;
  }

  loadCollections() {
    NaroFiler.listDirectories(this.rootPath).forEach((folderName) => {
      const folderPath = `${this.rootPath}/${folderName}`;
      const dataPath = `${folderPath}/${this.logFileName}`;
      if (fs.existsSync(dataPath)) {
        const binaryData = NaroFiler.readBinaryFile(dataPath);
        this.collections[folderName] = msgpack.decode(binaryData);
      } else {
        this.collections[folderName] = [];
      }
    });
  }

  getCollection(name: string): any[] {
    if (!this.collections[name]) {
      this.collections[name] = [];
    }
    return this.collections[name];
  }

  updateCollection(name: string, data: any[]) {
    this.collections[name] = data;
  }

  saveCollections() {
    Object.keys(this.collections).forEach((collectionName) => {
      const collectionPath = `${this.rootPath}/${collectionName}`;
      NaroFiler.ensureDirectory(collectionPath);
      const dataPath = `${collectionPath}/${this.logFileName}`;
      NaroFiler.writeBinaryFile(dataPath, this.collections[collectionName]);
    });
  }
}
