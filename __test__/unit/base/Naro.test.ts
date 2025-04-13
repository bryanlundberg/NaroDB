import { expect, test } from "vitest";
import { Naro } from "../../../src";
import { faker } from "@faker-js/faker/locale/en";
import { Core } from "../../../src/core/Core";
import { remove } from "fs-jetpack";

const root = "temp";

test("add, should add a new document to the users collection", async () => {
  const db = new Naro(root);
  const newUser = await db.add("users", { name: faker.person.fullName(), phone: faker.phone.number() });
  expect(newUser).toHaveProperty("id");
});

test("getAll, should return an empty array if collection is empty", async () => {
  const db = new Naro(root);
  const users = await db.getAll("users");
  expect(users).toHaveLength(0);
});

test("getAll, should return all documents in the users collection (with data)", async () => {
  const db = new Naro(root);
  for (let i = 0; i < 5; i++) {
    await db.add("users", { name: faker.person.fullName(), phone: faker.phone.number() });
  }
  const users = await db.getAll("users");
  expect(users).toHaveLength(5);
});

test("getAll, should return all documents in the users collection (with filter ==)", async () => {
  const db = new Naro(root);

  await db.add("users", { name: faker.person.fullName(), phone: faker.phone.number() });
  await db.add("users", { name: faker.person.fullName(), phone: faker.phone.number(), age: 30 });
  await db.add("users", { name: faker.person.fullName(), phone: faker.phone.number() });

  const users = await db.getAll("users", { filters: [{ field: "age", operator: "==", value: 30 }] });
  expect(users).toHaveLength(1);
});

test("getAll, should return all documents in the users collection (with filter !=)", async () => {
  const db = new Naro(root);

  await db.add("users", { name: faker.person.fullName(), phone: faker.phone.number() });
  await db.add("users", { name: faker.person.fullName(), phone: faker.phone.number(), age: 30 });
  await db.add("users", { name: faker.person.fullName(), phone: faker.phone.number() });

  const users = await db.getAll("users", { filters: [{ field: "age", operator: "!=", value: 30 }] });
  expect(users).toHaveLength(2);
});

test("getAll, should return all documents in the users collection (with filter <)", async () => {
  const db = new Naro(root);

  await db.add("users", { name: faker.person.fullName(), phone: faker.phone.number() });
  await db.add("users", { name: faker.person.fullName(), phone: faker.phone.number(), age: 30 });
  await db.add("users", { name: faker.person.fullName(), phone: faker.phone.number() });

  const users = await db.getAll("users", { filters: [{ field: "age", operator: "<", value: 30 }] });
  expect(users).toHaveLength(0);
});

test("getAll, should return all documents in the users collection (with filter <=)", async () => {
  const db = new Naro(root);

  await db.add("users", { name: faker.person.fullName(), phone: faker.phone.number() });
  await db.add("users", { name: faker.person.fullName(), phone: faker.phone.number(), age: 30 });
  await db.add("users", { name: faker.person.fullName(), phone: faker.phone.number() });

  const users = await db.getAll("users", { filters: [{ field: "age", operator: "<=", value: 30 }] });
  expect(users).toHaveLength(1);
});

test("getAll, should return all documents in the users collection (with filter >)", async () => {
  const db = new Naro(root);

  await db.add("users", { name: faker.person.fullName(), phone: faker.phone.number() });
  await db.add("users", { name: faker.person.fullName(), phone: faker.phone.number(), age: 30 });
  await db.add("users", { name: faker.person.fullName(), phone: faker.phone.number() });

  const users = await db.getAll("users", { filters: [{ field: "age", operator: ">", value: 30 }] });
  expect(users).toHaveLength(0);
});

test("getAll, should return all documents in the users collection (with filter >=)", async () => {
  const db = new Naro(root);

  await db.add("users", { name: faker.person.fullName(), phone: faker.phone.number() });
  await db.add("users", { name: faker.person.fullName(), phone: faker.phone.number(), age: 30 });
  await db.add("users", { name: faker.person.fullName(), phone: faker.phone.number() });

  const users = await db.getAll("users", { filters: [{ field: "age", operator: ">=", value: 30 }] });
  expect(users).toHaveLength(1);
});

test("getAll, should return all documents in the users collection (with limit)", async () => {
  const db = new Naro(root);
  for (let i = 0; i < 5; i++) {
    await db.add("users", { name: faker.person.fullName(), phone: faker.phone.number() });
  }
  const users = await db.getAll("users", { limit: 2 });
  expect(users).toHaveLength(2);
});

test("getAll, should return all documents in the users collection (with populate)", async () => {
  const db = new Naro(root);
  const user = await db.add("users", { name: faker.person.fullName(), phone: faker.phone.number() });
  await db.add("products", {
    name: faker.commerce.productName(),
    price: faker.commerce.price(),
    owner: `users/${user.id}`
  });
  const products = await db.getAll("products", {
    populate: ["owner"]
  });
  expect(products).toEqual([
    {
      name: expect.any(String),
      price: expect.any(String),
      owner: {
        name: expect.any(String),
        phone: expect.any(String),
        id: expect.any(String),
        createdAt: expect.any(Number),
        path: expect.any(String)
      },
      id: expect.any(String),
      createdAt: expect.any(Number),
      path: expect.any(String)
    }
  ]);
});

test("count, should return the number of documents in the users collection", async () => {
  const db = new Naro(root);
  for (let i = 0; i < 5; i++) {
    await db.add("users", { name: faker.person.fullName(), phone: faker.phone.number() });
  }
  const count = await db.count("users");
  expect(count).toBe(5);
});

test("count, should return 0 if the collection is empty", async () => {
  const db = new Naro(root);
  const count = await db.count("users");
  expect(count).toBe(0);
});

test("count, should throw an error if the collection does not exist", async () => {
  const db = new Naro(root);
  try {
    await db.count("nonexistent");
  } catch (error) {
    expect(error).toHaveProperty("message", "Collection nonexistent does not exist");
  }
});

test("exists, should return true if the document exists", async () => {
  const db = new Naro(root);
  const newUser = await db.add("users", { name: faker.person.fullName(), phone: faker.phone.number() });
  const exists = await db.exists(`users/${newUser.id}`);
  expect(exists).toBe(true);
});

test("exists, should return false if the document does not exist", async () => {
  const db = new Naro(root);
  await db.add("users", { name: faker.person.fullName(), phone: faker.phone.number() });
  const exists = await db.exists("users/123");
  expect(exists).toBe(false);
});

test("exists, should return false if the collection does not exist", async () => {
  const db = new Naro(root);
  const exists = await db.exists("nonexistent/123");
  expect(exists).toBe(false);
});

test("get, should return a document from the users collection", async () => {
  const db = new Naro(root);
  const newUser = await db.add("users", { name: faker.person.fullName(), phone: faker.phone.number() });
  const user = await db.get(`users/${newUser.id}`);
  expect(user).toHaveProperty("id");
});

test("get, should return undefined if document is not found", async () => {
  const db = new Naro(root);
  const user = await db.get("users/123");
  expect(user).toBeUndefined();
});

test("update, should update a document in the users collection", async () => {
  const db = new Naro(root);
  const initialUser = await db.add("users", { name: faker.person.fullName(), phone: faker.phone.number() });
  const afterUser = await db.update(`users/${initialUser.id}`, { name: "John Doe" });
  expect(afterUser).toHaveProperty("name", "John Doe");
});

test("update, should throw an error if document is not found", async () => {
  const db = new Naro(root);
  try {
    await db.update("users/123", { name: "John Doe" });
  } catch (error) {
    expect(error).toHaveProperty("message", "Item not found");
  }
});

test("delete, should delete a document from the users collection", async () => {
  const db = new Naro(root);
  const newUser = await db.add("users", { name: faker.person.fullName(), phone: faker.phone.number() });
  expect(await db.getAll("users")).toHaveLength(1);
  await db.delete(`users/${newUser.id}`);
  expect(await db.getAll("users")).toHaveLength(0);
});

test("delete, should silently ignore if document is not found", async () => {
  const db = new Naro(root);
  await db.delete("users/123");
  expect(await db.getAll("users")).toHaveLength(0);
});

test("writeToDisk, should write a single collection to disk", async () => {
  remove(`./data`);
  const db = new Naro(root);
  await db.add("users", { name: faker.person.fullName(), phone: faker.phone.number() });
  expect(async () => await db.writeToDisk()).not.toThrow();
  const core = new Core("./data/" + root);
  await core.initialize();
  const collections = await core.loadCollections();
  expect(collections).toEqual({ users: expect.anything() });
});

test("writeToDisk, should write multiple collections to disk", async () => {
  remove(`./data`);
  const db = new Naro(root);
  await db.add("users", { name: faker.person.fullName(), phone: faker.phone.number() });
  await db.add("products", { name: faker.commerce.productName(), price: faker.commerce.price() });
  expect(async () => await db.writeToDisk()).not.toThrow();
  const core = new Core("./data/" + root);
  await core.initialize();
  const collections = await core.loadCollections();
  expect(collections).toEqual({
    users: expect.anything(),
    products: expect.anything()
  });
});

