import { afterEach, beforeEach, describe, expect, test } from "vitest";
import { remove, existsAsync, dirAsync } from "fs-jetpack";
import { NaroFiler } from "../../../src";
import { COLLECTION_NAME, DIRNAME_MOCK, FILENAME_MOCK, USERS_MOCK } from "../../../src/constants/constants-test";

beforeEach(() => remove(DIRNAME_MOCK), 1000);
afterEach(() => remove(DIRNAME_MOCK), 1000);

describe("NaroFiler", () => {
  test("ensureDirectory", async () => {
    await NaroFiler.ensureDirectory(DIRNAME_MOCK);
    const existsDir = await existsAsync(DIRNAME_MOCK);
    expect(existsDir).toBe("dir");
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
    await dirAsync(subDir1);
    await dirAsync(subDir2);
    const result = await NaroFiler.listDirectories(DIRNAME_MOCK);
    expect(result).toEqual(["subdir1", "subdir2"]);
  });
});
