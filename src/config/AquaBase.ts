import fs from 'fs-extra'

export class AquaBase {
  private rootPath: string;
  private logFile: string = 'data.json';

  constructor(rootPath: string = './data') {
    this.rootPath = rootPath;
    this.initializeRoot()
  }

  private initializeRoot() {
    fs.ensureDirSync(this.rootPath);
    return;
  }

  public createDatabase(dbName: string) {
    const dbPath = `${this.rootPath}/${dbName}`
    fs.ensureDirSync(dbPath)
    return this
  }

  public createCollection(dbName: string, collectionName: string) {
    const collectionPath = `${this.rootPath}/${dbName}/${collectionName}`
    const logFilePath = `${this.rootPath}/${dbName}/${collectionName}/${this.logFile}`
    fs.ensureFileSync(collectionPath)

    if (!fs.pathExistsSync(logFilePath)) {
      fs.writeJsonSync(collectionPath, {})
    }
  }
}


