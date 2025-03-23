import { afterAll, describe, expect, test } from "vitest";
import { Core } from "../../../src/db/Core";
import { COLLECTION_NAME, DIRNAME_MOCK, FILENAME_MOCK, USERS_MOCK } from "../../../src/constants/constants-test";
import { ensureFileSync, removeSync } from "fs-extra";
import { NaroFiler } from "../../../src";

afterAll(() => removeSync(DIRNAME_MOCK))

describe("Core", () => {
  test("loadCollections should correctly load data from all existing folders into memory", () => {
    const createFilePath = (collectionSuffix: string) =>
      `${DIRNAME_MOCK}/${COLLECTION_NAME}${collectionSuffix}/${FILENAME_MOCK}`;

    const filePaths = [
      { path: createFilePath("1"), data: [...USERS_MOCK] },
      { path: createFilePath("2"), data: [USERS_MOCK[0], USERS_MOCK[2]] }
    ];

    filePaths.forEach(({ path, data }) => {
      ensureFileSync(path);
      NaroFiler.writeBinaryFile(path, data);
    });

    const core = new Core(DIRNAME_MOCK);

    expect(core.getStore()).toEqual({
      [COLLECTION_NAME + "1"]: filePaths[0].data,
      [COLLECTION_NAME + "2"]: filePaths[1].data
    });
  });
});
