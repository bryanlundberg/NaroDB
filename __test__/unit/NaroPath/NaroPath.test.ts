import { expect, test } from "vitest";
import { COLLECTION_NAME, SUB_COLLECTION_NAME } from "../constants-test";
import { NaroPath } from "../../../src/manage/paths/NaroPath";

test("Should throw error if path is empty", () => {
  expect(() => NaroPath.validate("")).toThrowError();
});

test("Should accept 'collectionName' as path ", () => {
  const { collectionName, collectionId, subCollectionName, subCollectionId } = NaroPath.validate(COLLECTION_NAME);
  expect(collectionName).toBe(COLLECTION_NAME);
  expect(collectionId).toBeUndefined();
  expect(subCollectionName).toBeUndefined();
  expect(subCollectionId).toBeUndefined();
});

test("Should accept 'collectionName/id' as path ", () => {
  const {
    collectionName,
    collectionId,
    subCollectionName,
    subCollectionId
  } = NaroPath.validate(`${COLLECTION_NAME}/1234`);
  expect(collectionName).toBe(COLLECTION_NAME);
  expect(collectionId).toBe("1234");
  expect(subCollectionName).toBeUndefined();
  expect(subCollectionId).toBeUndefined();
});

test("Should accept 'collectionName/id/subCollectionName' as path ", () => {
  const {
    collectionName,
    collectionId,
    subCollectionName,
    subCollectionId
  } = NaroPath.validate(`${COLLECTION_NAME}/1234/${SUB_COLLECTION_NAME}`);
  expect(collectionName).toBe(COLLECTION_NAME);
  expect(collectionId).toBe("1234");
  expect(subCollectionName).toBe(SUB_COLLECTION_NAME);
  expect(subCollectionId).toBeUndefined();
});

test("Should accept 'collectionName/id/subCollectionName/id' as path ", () => {
  const {
    collectionName,
    collectionId,
    subCollectionName,
    subCollectionId
  } = NaroPath.validate(`${COLLECTION_NAME}/1234/${SUB_COLLECTION_NAME}/5678`);
  expect(collectionName).toBe(COLLECTION_NAME);
  expect(collectionId).toBe("1234");
  expect(subCollectionName).toBe(SUB_COLLECTION_NAME);
  expect(subCollectionId).toBe("5678");
});

test("Should throw error if path is not well structured collection/id/sub-collection/id/extra", () => {
  expect(() => NaroPath.validate(`${COLLECTION_NAME}/1234/${SUB_COLLECTION_NAME}/5678/extra`)).toThrowError();
});

test("Should throw error if path is not well structured collection/id/sub-collection/id/extra/sub", () => {
  expect(() => NaroPath.validate(`${COLLECTION_NAME}/1234/${SUB_COLLECTION_NAME}/5678/extra/sub`)).toThrowError();
});

test("Should throw error if path ends with / as collection/id/sub-collection/id/", () => {
  expect(() => NaroPath.validate(`${COLLECTION_NAME}/1234/${SUB_COLLECTION_NAME}/5678/`)).toThrowError();
});

test("Should throw error if path ends with / as collection/id/sub-collection/", () => {
  expect(() => NaroPath.validate(`${COLLECTION_NAME}/1234/${SUB_COLLECTION_NAME}/5678/`)).toThrowError();
});

test("Should throw error if path ends with / as collection/id/", () => {
  expect(() => NaroPath.validate(`${COLLECTION_NAME}/1234/${SUB_COLLECTION_NAME}/5678/`)).toThrowError();
});

test("Should throw error if path ends with / as collection/", () => {
  expect(() => NaroPath.validate(`${COLLECTION_NAME}/1234/${SUB_COLLECTION_NAME}/5678/`)).toThrowError();
});

test("Throws error if path contains only slashes", () => {
  expect(() => NaroPath.validate("////")).toThrowError();
});

test("Throws error if path contains invalid characters", () => {
  expect(() => NaroPath.validate("collectionName/1234/!@#$%^&*()")).toThrowError();
});

test("Throws error if a path ends with a slash", () => {
  expect(() => NaroPath.validate("collectionName/")).toThrowError();
  expect(() => NaroPath.validate("collectionName/1234/")).toThrowError();
  expect(() => NaroPath.validate("collectionName/1234/subCollectionName/")).toThrowError();
  expect(() => NaroPath.validate("collectionName/1234/subCollectionName/5678/")).toThrowError();
});

test("Handles path with mixed case correctly", () => {
  const {
    collectionName,
    collectionId,
    subCollectionName,
    subCollectionId
  } = NaroPath.validate("CollectionName/1234/SubCollectionName/5678");
  expect(collectionName).toBe("CollectionName");
  expect(collectionId).toBe("1234");
  expect(subCollectionName).toBe("SubCollectionName");
  expect(subCollectionId).toBe("5678");
});

test("Throws error if path contains spaces", () => {
  expect(() => NaroPath.validate("collection name/1234")).toThrowError();
});

test("Handles path with hyphens correctly", () => {
  const {
    collectionName,
    collectionId,
    subCollectionName,
    subCollectionId
  } = NaroPath.validate("collection-name/1234/sub-collection-name/5678");
  expect(collectionName).toBe("collection-name");
  expect(collectionId).toBe("1234");
  expect(subCollectionName).toBe("sub-collection-name");
  expect(subCollectionId).toBe("5678");
});

test("Throws error if path contains consecutive slashes", () => {
  expect(() => NaroPath.validate("collectionName//1234")).toThrowError();
});

test("Handles path with underscores correctly", () => {
  const {
    collectionName,
    collectionId,
    subCollectionName,
    subCollectionId
  } = NaroPath.validate("collection_name/1234/sub_collection_name/5678");
  expect(collectionName).toBe("collection_name");
  expect(collectionId).toBe("1234");
  expect(subCollectionName).toBe("sub_collection_name");
  expect(subCollectionId).toBe("5678");
});

test("Throws error if path has more parts than allowed", () => {
  expect(() => NaroPath.validate("collectionName/1234/subCollectionName/5678/extraPart")).toThrowError();
});

test("Throws error if path is empty", () => {
  expect(() => NaroPath.validate("")).toThrowError();
});
