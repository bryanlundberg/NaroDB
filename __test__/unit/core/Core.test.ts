import { afterEach, beforeEach, describe, expect, test } from "vitest";
import { Core } from "../../../src/core/Core";
import { COLLECTION_NAME, DIRNAME_MOCK, FILENAME_MOCK, USERS_MOCK } from "../constants-test";
import { remove } from "fs-jetpack";
import { NaroFiler } from "../../../src/manage/files/NaroFiler";

beforeEach(() => remove(DIRNAME_MOCK), 1000);
afterEach(() => remove(DIRNAME_MOCK), 1000);

describe("Core", () => {
  const createFilePath = (collectionSuffix: string) =>
    `${DIRNAME_MOCK}/${COLLECTION_NAME}${collectionSuffix}/${FILENAME_MOCK}`;

  test("loadCollections should load data from all existing base collections", async () => {
    const files = [
      { path: createFilePath("1"), data: [...USERS_MOCK] },
      { path: createFilePath("2"), data: [USERS_MOCK[0], USERS_MOCK[2]] }
    ];

    for (const { path, data } of files) {
      await NaroFiler.writeBinaryFile(path, data);
    }

    const core = new Core(DIRNAME_MOCK);
    await core.initialize();

    expect(core.getStructuredCollections()).toEqual({
      [COLLECTION_NAME + "1"]: files[0].data,
      [COLLECTION_NAME + "2"]: files[1].data
    });

  });

  test("getStructuredCollections should return an empty object if the database is empty", () => {
    const core = new Core(DIRNAME_MOCK);
    expect(core.getStructuredCollections()).toEqual({});
  });

  test("writeCollections should write all collections to disk", async () => {
    const files = [
      { path: createFilePath("1"), data: [...USERS_MOCK] },
      { path: createFilePath("2"), data: [USERS_MOCK[0], USERS_MOCK[2]] }
    ];

    for (const { path, data } of files) {
      await NaroFiler.writeBinaryFile(path, data);
    }

    const core = new Core(DIRNAME_MOCK);
    await core.writeCollections();

    for (const { path, data } of files) {
      const decodedData = await NaroFiler.readBinaryFile(path);
      expect(decodedData).toEqual(data);
    }
  });

  test("getCollection should return an empty array", async () => {
    const core = new Core(DIRNAME_MOCK);
    await core.initialize();
    expect(core.getCollection("non-existing-collection")).toEqual([]);
  });

  test("getCollection should return an existing collection", async () => {
    const data = [...USERS_MOCK];
    const path = `${DIRNAME_MOCK}/${COLLECTION_NAME}/${FILENAME_MOCK}`;

    await NaroFiler.writeBinaryFile(path, data);

    const core = new Core(DIRNAME_MOCK);
    await core.initialize();
    expect(core.getCollection(COLLECTION_NAME)).toStrictEqual(data);
  });

});
