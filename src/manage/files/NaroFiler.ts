import fs from "fs-extra";
import msgpack from "notepack.io";

export class NaroFiler {
  static async ensureDirectory(path: string): Promise<void> {
    await fs.ensureDir(path);
  }

  static async readBinaryFile(path: string): Promise<any[]> {
    try {
      if (!(await fs.pathExists(path))) {
        await this.writeBinaryFile(path, []);
      }

      const decode = await fs.readFile(path);
      return msgpack.decode(decode);

    } catch (error) {
      throw new Error(`Failed to read binary file at ${path}: ${(error as Error).message}`);
    }
  }

  static async writeBinaryFile(path: string, data: any[]): Promise<void> {
    await fs.outputFile(path, msgpack.encode(data || []), {
      encoding: "binary"
    });
  }

  static async listDirectories(path: string): Promise<string[]> {
    const entries = await fs.readdir(path);
    const directories: string[] = [];
    for (const subPath of entries) {
      const fullPath = `${path}/${subPath}`;
      if ((await (fs.lstat(fullPath))).isDirectory()) {
        directories.push(subPath);
      }
    }

    return directories;
  }
}
