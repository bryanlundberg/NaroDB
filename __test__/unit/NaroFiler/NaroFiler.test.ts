import { afterEach, beforeEach, expect, test } from "vitest";
import { dirAsync, exists, remove } from "fs-jetpack";
import { COLLECTION_NAME, DIRNAME_MOCK, FILENAME_MOCK, USERS_MOCK } from "../constants-test";
import { NaroFiler } from "../../../src/manage/files/NaroFiler";

beforeEach(() => remove(DIRNAME_MOCK), 1000);
afterEach(() => remove(DIRNAME_MOCK), 1000);

test("ensureDirectory", () => {
  NaroFiler.ensureDirectory(DIRNAME_MOCK);
  const existsDir = exists(DIRNAME_MOCK);
  expect(existsDir).toBe("dir");
});

test("writeBinaryFile", () => {
  const filePath = `${DIRNAME_MOCK}/${COLLECTION_NAME}/${FILENAME_MOCK}`;
  const data = [USERS_MOCK[3]];

  NaroFiler.writeBinaryFile(filePath, data);
  expect(NaroFiler.readBinaryFile(filePath)).toEqual(data);
});

test("readBinaryFile returns decoded data when file exists", () => {
  const filePath = `${DIRNAME_MOCK}/${COLLECTION_NAME}/${FILENAME_MOCK}`;
  const data = [...USERS_MOCK];
  NaroFiler.writeBinaryFile(filePath, data);
  const result = NaroFiler.readBinaryFile(filePath);
  expect(result).toEqual(data);
});

test("readBinaryFile returns empty array when file does not exist", () => {
  const filePath = `${DIRNAME_MOCK}/nonexistent-file`;
  const result = NaroFiler.readBinaryFile(filePath);
  expect(result).toEqual([]);
});

test("listDirectories", async () => {
  const subDir1 = `${DIRNAME_MOCK}/subdir1`;
  const subDir2 = `${DIRNAME_MOCK}/subdir2`;
  await dirAsync(subDir1);
  await dirAsync(subDir2);
  const result = NaroFiler.listDirectories(DIRNAME_MOCK);
  expect(result).toEqual(["subdir1", "subdir2"]);
});

test("removeDirectory", async () => {
  const subDir = `${DIRNAME_MOCK}/subdir`;
  await dirAsync(subDir);
  NaroFiler.removeDirectory(subDir);
  const existsDir = exists(subDir);
  expect(existsDir).toBe(false);
});
