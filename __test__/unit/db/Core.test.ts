import { beforeEach, describe, expect, test } from "vitest";
import { Core } from "../../../src/db/Core";
import { COLLECTION_NAME, DIRNAME_MOCK, FILENAME_MOCK, USERS_MOCK } from "../../../src/constants/constants-test";
import { ensureFileSync, removeSync } from "fs-extra";
import { NaroFiler } from "../../../src";

beforeEach(() => removeSync(DIRNAME_MOCK));

describe("Core", () => {

  const createFilePath = (collectionSuffix: string) =>
    `${DIRNAME_MOCK}/${COLLECTION_NAME}${collectionSuffix}/${FILENAME_MOCK}`;

  test("loadCollections should load data from all existing base collections", () => {
    const files = [
      { path: createFilePath("1"), data: [...USERS_MOCK] },
      { path: createFilePath("2"), data: [USERS_MOCK[0], USERS_MOCK[2]] }
    ];

    files.forEach(({ path, data }) => {
      ensureFileSync(path);
      NaroFiler.writeBinaryFile(path, data);
    });

    const core = new Core(DIRNAME_MOCK);
    expect(core.getStructuredCollections()).toStrictEqual({
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

    files.forEach(({ path, data }) => {
      ensureFileSync(path);
      NaroFiler.writeBinaryFile(path, data);
    });

    const core = new Core(DIRNAME_MOCK);
    core.writeCollections();

    files.forEach(({ path, data }) => {
      const decodedData = NaroFiler.readBinaryFile(path);
      expect(decodedData).toEqual(data);
    });
  });

  test("getCollection should return an empty array", () => {
    const core = new Core(DIRNAME_MOCK);
    expect(core.getCollection("non-existing-collection")).toEqual([]);
  });

  test("getCollection should return an existing collection", () => {
    const data = [...USERS_MOCK];
    const path = `${DIRNAME_MOCK}/${COLLECTION_NAME}/${FILENAME_MOCK}`;

    ensureFileSync(path);
    NaroFiler.writeBinaryFile(path, data);

    const core = new Core(DIRNAME_MOCK);
    expect(core.getCollection(COLLECTION_NAME)).toStrictEqual(data);
  });

});
