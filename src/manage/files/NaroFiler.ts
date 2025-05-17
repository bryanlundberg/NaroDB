import { decode, encode } from "notepack.io";
import jetpack from "fs-jetpack";

export class NaroFiler {
  static ensureDirectory(path: string): void {
    jetpack.dir(path);
  }

  static readBinaryFile(path: string): any[] {
    const data = jetpack.read(path, "buffer");
    return data ? decode(data) : [];
  }

  static writeBinaryFile(path: string, data: any[]): void {
    return jetpack.write(path, encode(data));
  }

  static listDirectories(path: string): string[] {
    const directory = jetpack.inspectTree(path);
    if (!directory) return [];
    return directory.children.filter((child) => child.type === "dir").map((child) => child.name);
  }

  static removeDirectory(path: string): void {
    return jetpack.remove(path);
  }
}
