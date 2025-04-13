import { afterEach, beforeEach, expect, test } from "vitest";
import { dirAsync, existsAsync, remove } from "fs-jetpack";
import { COLLECTION_NAME, DIRNAME_MOCK, FILENAME_MOCK, USERS_MOCK } from "../constants-test";
import { NaroFiler } from "../../../src/manage/files/NaroFiler";

beforeEach(() => remove(DIRNAME_MOCK), 1000);
afterEach(() => remove(DIRNAME_MOCK), 1000);

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

test("readBinaryFile returns decoded data when file exists", async () => {
  const filePath = `${DIRNAME_MOCK}/${COLLECTION_NAME}/${FILENAME_MOCK}`;
  const data = [...USERS_MOCK];
  await NaroFiler.writeBinaryFile(filePath, data);
  const result = await NaroFiler.readBinaryFile(filePath);
  expect(result).toEqual(data);
});

test("readBinaryFile returns empty array when file does not exist", async () => {
  const filePath = `${DIRNAME_MOCK}/nonexistent-file`;
  const result = await NaroFiler.readBinaryFile(filePath);
  expect(result).toEqual([]);
});

test("listDirectories", async () => {
  const subDir1 = `${DIRNAME_MOCK}/subdir1`;
  const subDir2 = `${DIRNAME_MOCK}/subdir2`;
  await dirAsync(subDir1);
  await dirAsync(subDir2);
  const result = await NaroFiler.listDirectories(DIRNAME_MOCK);
  expect(result).toEqual(["subdir1", "subdir2"]);
});
