import msgpack from "notepack.io";
import { dirAsync, inspectTreeAsync, readAsync, writeAsync } from "fs-jetpack";

export class NaroFiler {
  static async ensureDirectory(path: string): Promise<void> {
    await dirAsync(path);
  }

  static async readBinaryFile(path: string): Promise<any[]> {
    const data = await readAsync(path, "buffer");
    return data ? msgpack.decode(data) : [];
  }

  static async writeBinaryFile(path: string, data: any[]): Promise<void> {
    return await writeAsync(path, msgpack.encode(data));
  }

  static async listDirectories(path: string) {
    const directory = await inspectTreeAsync(path);
    if (!directory) return [];
    return directory.children.filter((child) => child.type === "dir").map((child) => child.name);
  }
}
