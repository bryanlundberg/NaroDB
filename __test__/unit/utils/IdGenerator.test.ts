import { describe, test, expect } from "vitest";
import { NaroId } from "../../../src/utils/IdGenerator";

describe("IdGenerator", () => {
  test("generate", () => {
    expect(NaroId.generate()).toMatch(/^[a-z0-9]{17}$/);
  })
})
