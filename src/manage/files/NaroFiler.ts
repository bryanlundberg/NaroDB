import msgpack from "notepack.io";
import { dir, inspectTree, read, write } from "fs-jetpack";

export class NaroFiler {
  static ensureDirectory(path: string): void {
    dir(path);
  }

  static readBinaryFile(path: string): any[] {
    const data = read(path, "buffer");
    return data ? msgpack.decode(data) : [];
  }

  static writeBinaryFile(path: string, data: any[]): void {
    return write(path, msgpack.encode(data));
  }

  static listDirectories(path: string): string[] {
    const directory = inspectTree(path);
    if (!directory) return [];
    return directory.children.filter((child) => child.type === "dir").map((child) => child.name);
  }
}
