import { afterEach, beforeEach, expect, test } from "vitest";
import { Core } from "../../../src/core/Core";
import { COLLECTION_NAME, DIRNAME_MOCK, FILENAME_MOCK, USERS_MOCK } from "../constants-test";
import { remove } from "fs-jetpack";
import { NaroFiler } from "../../../src/manage/files/NaroFiler";

beforeEach(() => remove(DIRNAME_MOCK), 1000);
afterEach(() => remove(DIRNAME_MOCK), 1000);

const createFilePath = (collectionSuffix: string) =>
  `${DIRNAME_MOCK}/${COLLECTION_NAME}${collectionSuffix}/${FILENAME_MOCK}`;

test("loadCollections should load data from all existing base collections", () => {
  const files = [
    { path: createFilePath("1"), data: [...USERS_MOCK] },
    { path: createFilePath("2"), data: [USERS_MOCK[0], USERS_MOCK[2]] }
  ];

  for (const { path, data } of files) {
    NaroFiler.writeBinaryFile(path, data);
  }

  const core = new Core(DIRNAME_MOCK);
  core.initialize();

  expect(core.getStructuredCollections()).toEqual({
    [COLLECTION_NAME + "1"]: files[0].data,
    [COLLECTION_NAME + "2"]: files[1].data
  });
});

test("getStructuredCollections should return an empty object if the database is empty", () => {
  const core = new Core(DIRNAME_MOCK);
  expect(core.getStructuredCollections()).toEqual({});
});

test("writeCollections should write all collections to disk", () => {
  const files = [
    { path: createFilePath("1"), data: [...USERS_MOCK] },
    { path: createFilePath("2"), data: [USERS_MOCK[0], USERS_MOCK[2]] }
  ];

  for (const { path, data } of files) {
    NaroFiler.writeBinaryFile(path, data);
  }

  const core = new Core(DIRNAME_MOCK);
  core.writeCollections();

  for (const { path, data } of files) {
    const decodedData = NaroFiler.readBinaryFile(path);
    expect(decodedData).toEqual(data);
  }
});

test("getCollection should return an empty array", () => {
  const core = new Core(DIRNAME_MOCK);
  core.initialize();
  expect(core.getCollection("non-existing-collection")).toEqual([]);
});

test("getCollection should return an existing collection", () => {
  const data = [...USERS_MOCK];
  const path = `${DIRNAME_MOCK}/${COLLECTION_NAME}/${FILENAME_MOCK}`;

  NaroFiler.writeBinaryFile(path, data);

  const core = new Core(DIRNAME_MOCK);
  core.initialize();
  expect(core.getCollection(COLLECTION_NAME)).toStrictEqual(data);
});

test("writeCollection creates directory and writes data to the correct path", () => {
  const core = new Core(DIRNAME_MOCK);
  const collectionName = "testCollection";
  const data = [...USERS_MOCK];
  core.updateCollection(collectionName, data);

  core.writeCollection(collectionName);

  const filePath = `${DIRNAME_MOCK}/${collectionName}/${FILENAME_MOCK}`;
  const writtenData = NaroFiler.readBinaryFile(filePath);
  expect(writtenData).toEqual(data);
});

test("writeCollection overwrites existing data in the collection", () => {
  const core = new Core(DIRNAME_MOCK);
  const collectionName = "testCollection";
  const initialData = [USERS_MOCK[0]];
  const updatedData = [...USERS_MOCK];

  core.updateCollection(collectionName, initialData);
  core.writeCollection(collectionName);

  core.updateCollection(collectionName, updatedData);
  core.writeCollection(collectionName);

  const filePath = `${DIRNAME_MOCK}/${collectionName}/${FILENAME_MOCK}`;
  const writtenData = NaroFiler.readBinaryFile(filePath);
  expect(writtenData).toEqual(updatedData);
});

test("removeCollection removes the collection directory", () => {
  const core = new Core(DIRNAME_MOCK);
  const collectionName = "testCollection";
  const data = [...USERS_MOCK];

  core.updateCollection(collectionName, data);
  core.writeCollection(collectionName);

  core.removeCollection(collectionName);

  const filePath = `${DIRNAME_MOCK}/${collectionName}`;
  expect(NaroFiler.listDirectories(DIRNAME_MOCK)).not.toContain(filePath);
});
