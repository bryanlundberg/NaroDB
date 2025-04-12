import { describe, test, expect } from "vitest";
import { NaroId } from "../../../src/utils/IdGenerator";

describe("IdGenerator", () => {
  test("generate produces unique IDs", () => {
    const id1 = NaroId.generate();
    const id2 = NaroId.generate();
    expect(id1).not.toEqual(id2);
  });

  test("generate produces IDs of correct length", () => {
    const id = NaroId.generate();
    expect(id.length).toBe(17);
  });

  test("generate handles edge case of rapid consecutive calls", () => {
    const ids = Array.from({ length: 1000 }, () => NaroId.generate());
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });
});
