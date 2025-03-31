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
  test("getAll, should return an empty array if collection is empty", async () => {
    const db = new Naro(root);
    const users = db.getAll("users");
    expect(users).toHaveLength(0);
  })
  test("getAll, should return all documents in the users collection (with data)", async () => {
    const db = new Naro(root);
    for (let i = 0; i < 5; i++) {
      await db.add("users", { name: faker.person.fullName(), phone: faker.phone.number() });
    }
    const users = db.getAll("users");
    expect(users).toHaveLength(5);
  })
  test("get, should return a document from the users collection", async () => {
    const db = new Naro(root);
    const newUser = await db.add("users", { name: faker.person.fullName(), phone: faker.phone.number() });
    const user = await db.get(`users/${newUser.id}`);
    expect(user).toHaveProperty("id");
  })
  test("get, should return undefined if document is not found", async () => {
    const db = new Naro(root);
    const user = await db.get("users/123");
    expect(user).toBeUndefined();
  })
  test("update, should update a document in the users collection", async () => {
    const db = new Naro(root);
    const initialUser = await db.add("users", { name: faker.person.fullName(), phone: faker.phone.number() });
    const afterUser = await db.update(`users/${initialUser.id}`, { name: "John Doe" });
    expect(afterUser).toHaveProperty("name", "John Doe");
  })
  test("update, should throw an error if document is not found", async () => {
    const db = new Naro(root);
    try {
      await db.update("users/123", { name: "John Doe" });
    } catch (error) {
      expect(error).toHaveProperty("message", "Item not found");
    }
  })
  test("delete, should delete a document from the users collection", async () => {
    const db = new Naro(root);
    const newUser = await db.add("users", { name: faker.person.fullName(), phone: faker.phone.number() });
    expect(db.getAll("users")).toHaveLength(1);
    await db.delete(`users/${newUser.id}`);
    expect(db.getAll("users")).toHaveLength(0);
  })
  test("delete, should silently ignore if document is not found", async () => {
    const db = new Naro(root);
    await db.delete("users/123");
    expect(db.getAll("users")).toHaveLength(0);
  })
});
