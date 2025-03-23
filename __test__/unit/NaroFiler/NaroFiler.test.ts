import { beforeEach, describe, expect, test } from "vitest";
import { ensureDirSync, pathExistsSync, removeSync, writeFileSync } from "fs-extra";
import { NaroFiler } from "../../../src";
import { DIRNAME_MOCK, FILENAME_MOCK, USERS_MOCK } from "../../../src/constants/constants-test";
import msgpack from "msgpack-lite";

beforeEach(() => {
  removeSync(DIRNAME_MOCK);
});

describe("NaroFiler", () => {
  test("ensureDirectory", () => {
    NaroFiler.ensureDirectory(DIRNAME_MOCK);
    expect(pathExistsSync(DIRNAME_MOCK)).toBe(true);
  });

  test("writeBinaryFile", () => {
    const filePath = `${DIRNAME_MOCK}/${FILENAME_MOCK}`;
    const data = Buffer.from([0x01, 0x02, 0x03]);
    ensureDirSync(DIRNAME_MOCK);
    NaroFiler.writeBinaryFile(filePath, data);
    expect(pathExistsSync(filePath)).toBe(true);
  });

  test("readBinaryFile", () => {
    const filePath = `${DIRNAME_MOCK}/${FILENAME_MOCK}`;
    const data = msgpack.encode([...USERS_MOCK]);
    ensureDirSync(DIRNAME_MOCK);
    writeFileSync(filePath, data);
    const result = NaroFiler.readBinaryFile(filePath);
    expect(result).toEqual([...USERS_MOCK]);
  });

  test("listDirectories", () => {
    const subDir1 = `${DIRNAME_MOCK}/subdir1`;
    const subDir2 = `${DIRNAME_MOCK}/subdir2`;
    ensureDirSync(subDir1);
    ensureDirSync(subDir2);
    const result = NaroFiler.listDirectories(DIRNAME_MOCK);
    expect(result).toEqual(["subdir1", "subdir2"]);
  });
});
