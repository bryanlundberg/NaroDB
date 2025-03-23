import { afterEach, describe, expect, test } from "vitest";
import { Core } from "../../../src/db/Core";
import { COLLECTION_NAME, DIRNAME_MOCK, FILENAME_MOCK, USERS_MOCK } from "../../../src/constants/constants-test";
import { ensureFileSync, removeSync } from "fs-extra";
import { NaroFiler } from "../../../src";
import msgpack from "msgpack-lite";

afterEach(() => removeSync(DIRNAME_MOCK));

describe("Core", () => {

  const createFilePath = (collectionSuffix: string) =>
    `${DIRNAME_MOCK}/${COLLECTION_NAME}${collectionSuffix}/${FILENAME_MOCK}`;

  test("loadCollections should load data from all existing base collections", () => {
    const filePaths = [
      { path: createFilePath("1"), data: [...USERS_MOCK] },
      { path: createFilePath("2"), data: [USERS_MOCK[0], USERS_MOCK[2]] }
    ];

    filePaths.forEach(({ path, data }) => {
      ensureFileSync(path);
      NaroFiler.writeBinaryFile(path, data);
    });

    const core = new Core(DIRNAME_MOCK);

    expect(core.getStructuredCollections()).toEqual({
      [COLLECTION_NAME + "1"]: filePaths[0].data,
      [COLLECTION_NAME + "2"]: filePaths[1].data
    });
  });

  test("getStructuredCollections should return an empty object if the database is empty", () => {
    const core = new Core(DIRNAME_MOCK);
    expect(core.getStructuredCollections()).toEqual({});
  });

  test("writeCollections should write all collections to disk", () => {
    const filePaths = [
      { path: createFilePath("1"), data: [...USERS_MOCK] },
      { path: createFilePath("2"), data: [USERS_MOCK[0], USERS_MOCK[2]] }
    ];

    filePaths.forEach(({ path, data }) => {
      ensureFileSync(path);
      NaroFiler.writeBinaryFile(path, data);
    });

    const core = new Core(DIRNAME_MOCK);
    core.writeCollections();

    filePaths.forEach(({ path, data }) => {
      const fileData = NaroFiler.readBinaryFile(path);
      const decodedData = msgpack.decode(fileData);
      expect(decodedData).toEqual(data);
    });
  });
});
