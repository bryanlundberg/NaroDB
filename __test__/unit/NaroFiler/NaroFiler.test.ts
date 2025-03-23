import { afterEach, beforeEach, describe, expect, test } from "vitest";
import fs from "fs-extra";
import { NaroFiler } from "../../../src";
import { COLLECTION_NAME, DIRNAME_MOCK, FILENAME_MOCK, USERS_MOCK } from "../../../src/constants/constants-test";

beforeEach(() => fs.removeSync(DIRNAME_MOCK), 1000);
afterEach(() => fs.removeSync(DIRNAME_MOCK), 1000);

describe("NaroFiler", () => {
  test("ensureDirectory", async () => {
    await NaroFiler.ensureDirectory(DIRNAME_MOCK);
    expect(await fs.pathExists(DIRNAME_MOCK)).toBe(true);
  });

  test("writeBinaryFile", async () => {
    const filePath = `${DIRNAME_MOCK}/${COLLECTION_NAME}/${FILENAME_MOCK}`;
    const data = [USERS_MOCK[3]];

    await NaroFiler.writeBinaryFile(filePath, data);
    expect(await NaroFiler.readBinaryFile(filePath)).toEqual(data);
  });

  test("readBinaryFile", async () => {
    const filePath = `${DIRNAME_MOCK}/${COLLECTION_NAME}/${FILENAME_MOCK}`;
    const data = [...USERS_MOCK];
    await NaroFiler.writeBinaryFile(filePath, data);
    expect(await NaroFiler.readBinaryFile(filePath)).toEqual([...USERS_MOCK]);
  });

  test("listDirectories", async () => {
    const subDir1 = `${DIRNAME_MOCK}/subdir1`;
    const subDir2 = `${DIRNAME_MOCK}/subdir2`;
    await fs.ensureDir(subDir1);
    await fs.ensureDir(subDir2);
    const result = await NaroFiler.listDirectories(DIRNAME_MOCK);
    expect(result).toEqual(["subdir1", "subdir2"]);
  });
});
