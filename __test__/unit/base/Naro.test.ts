import { describe, expect, test } from "vitest";
import { Naro } from "../../../src";
import { faker } from "@faker-js/faker/locale/en";

const root = "temp";

describe("Naro", () => {
  test("add, should add a new document to the users collection", async () => {
    const db = new Naro(root);
    const newUser = await db.add("users", { name: faker.person.fullName(), phone: faker.phone.number() });
    expect(newUser).toHaveProperty("id");
  })
  test("getAll, should return all documents in the users collection (empty array)", async () => {
    const db = new Naro(root);
    const users = db.getAll("users");
    console.log(users);
  })
  test("getAll, should return all documents in the users collection (with data)", async () => {
    const db = new Naro(root);
    for (let i = 0; i < 5; i++) {
      await db.add("users", { name: faker.person.fullName(), phone: faker.phone.number() });
    }
    const users = db.getAll("users");
    expect(users).toHaveLength(5);
  })
});
