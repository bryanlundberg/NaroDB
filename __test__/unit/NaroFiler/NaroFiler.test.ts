import { afterEach, describe, expect, test } from "vitest";
import { ensureDirSync, pathExistsSync, removeSync, writeFileSync } from "fs-extra";
import { NaroFiler } from "../../../src/config/NaroFiler";

const dirName = "./mock-db";
const fileName = "data.bin";

afterEach(() => {
  removeSync(dirName);
});

describe("NaroFiler", () => {
  test("ensureDirectory", () => {
    NaroFiler.ensureDirectory(dirName);
    expect(pathExistsSync(dirName)).toBe(true);
  });

  test("writeBinaryFile", () => {
    const filePath = `${dirName}/${fileName}`;
    const data = Buffer.from([0x01, 0x02, 0x03]);
    ensureDirSync(dirName);
    NaroFiler.writeBinaryFile(filePath, data);
    expect(pathExistsSync(filePath)).toBe(true);
  })

  test("readBinaryFile", () => {
    const filePath = `${dirName}/${fileName}`;
    const data = Buffer.from([0x01, 0x02, 0x03]);
    ensureDirSync(dirName);
    writeFileSync(filePath, data);
    const result = NaroFiler.readBinaryFile(filePath);
    expect(result).toEqual(data);
  });

  test("listDirectories", () => {
    const subDir1 = `${dirName}/subdir1`;
    const subDir2 = `${dirName}/subdir2`;
    ensureDirSync(subDir1);
    ensureDirSync(subDir2);
    const result = NaroFiler.listDirectories(dirName);
    expect(result).toEqual(["subdir1", "subdir2"]);
  });
});
