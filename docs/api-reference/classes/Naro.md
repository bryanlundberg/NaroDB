[**narodb**](../../README.md)

***

[narodb](../../README.md) / [index](../README.md) / Naro

# Class: Naro

Defined in: [base/Naro.ts:19](https://github.com/bryanlundberg/NaroDB/blob/52f9f594188cb90bbec73d09caa3bb35c5da0d8b/src/base/Naro.ts#L19)

The Naro class provides methods to manage and manipulate collections
of documents stored in the root `./data` folder.

## Example

```ts
const db = new Naro("database-name");

// Use separate database names for production and development environments
const db = new Naro(process.env.NODE_ENV === "production" ? "prod-database-name" : "dev-database-name");
```

## Constructors

### Constructor

> **new Naro**(`dbName`): `Naro`

Defined in: [base/Naro.ts:23](https://github.com/bryanlundberg/NaroDB/blob/52f9f594188cb90bbec73d09caa3bb35c5da0d8b/src/base/Naro.ts#L23)

#### Parameters

##### dbName

`string`

#### Returns

`Naro`

## Methods

### add()

> **add**(`collectionName`, `data`): `Promise`\<[`NaroDocument`](../interfaces/NaroDocument.md)\>

Defined in: [base/Naro.ts:56](https://github.com/bryanlundberg/NaroDB/blob/52f9f594188cb90bbec73d09caa3bb35c5da0d8b/src/base/Naro.ts#L56)

Adds a new document to the specified collection.

#### Parameters

##### collectionName

`string`

The name of the collection to add the data to.

##### data

[`DocData`](../-internal-/interfaces/DocData.md)

The data to be added as a new document.

#### Returns

`Promise`\<[`NaroDocument`](../interfaces/NaroDocument.md)\>

A promise that resolves to the newly added document.

#### Example

```ts
const db = new Naro("myDatabase");

const newUser = await db.add("users", { name: "John Doe", age: 30 });
console.log(newUser);
// Output: { id: "generated-id", createdAt: 1696872345000, name: "John Doe", age: 30 }
```

***

### delete()

> **delete**(`path`): `Promise`\<`void`\>

Defined in: [base/Naro.ts:180](https://github.com/bryanlundberg/NaroDB/blob/52f9f594188cb90bbec73d09caa3bb35c5da0d8b/src/base/Naro.ts#L180)

Deletes an item from the specified collection based on the given path.
If the ID does not exist, the method does nothing.

#### Parameters

##### path

`string`

The path identifying the collection and the item to delete.

#### Returns

`Promise`\<`void`\>

A promise that resolves when the deletion is complete.

#### Example

```ts
const db = new Naro("myDatabase");

// Adding a new user
const user = await db.add("users", { name: "Jane Doe", age: 28 });
console.log(await db.getAll("users")); // Output: [{ id: "generated-id", name: "Jane Doe", age: 28, createdAt: 1696872345000 }]

// Deleting the user
await db.delete(`users/${user.id}`);
console.log(await db.getAll("users")); // Output: []
```

***

### get()

> **get**(`path`): `Promise`\<`undefined` \| [`NaroDocument`](../interfaces/NaroDocument.md)\>

Defined in: [base/Naro.ts:131](https://github.com/bryanlundberg/NaroDB/blob/52f9f594188cb90bbec73d09caa3bb35c5da0d8b/src/base/Naro.ts#L131)

Retrieves a document from the given path.

#### Parameters

##### path

`string`

The path of the document to retrieve.

#### Returns

`Promise`\<`undefined` \| [`NaroDocument`](../interfaces/NaroDocument.md)\>

A promise that resolves to the retrieved document
or undefined if the document is not found.

#### Example

```ts
const db = new Naro("myDatabase");

const user = await db.get("users/123");
console.log(user);
// Output: { id: "123", createdAt: 1696872345000, name: "John Doe", age: 30 } (if found)
```

***

### getAll()

> **getAll**(`collectionName`, `options?`): `Promise`\<[`NaroDocument`](../interfaces/NaroDocument.md)[]\>

Defined in: [base/Naro.ts:81](https://github.com/bryanlundberg/NaroDB/blob/52f9f594188cb90bbec73d09caa3bb35c5da0d8b/src/base/Naro.ts#L81)

Retrieves all documents from a specified collection, optionally applying filters and limits.

#### Parameters

##### collectionName

`string`

The name of the collection to retrieve documents from.

##### options?

[`Options`](../-internal-/interfaces/Options.md) = `{}`

Options to filter and limit the retrieval of documents.

#### Returns

`Promise`\<[`NaroDocument`](../interfaces/NaroDocument.md)[]\>

A promise that resolves to an array of documents matching the specified filters and limits.

#### Throws

If the specified collection does not exist.

#### Example

```ts
const users = await db.getAll("users", {
  filters: [{ field: "age", operator: ">=", value: 18 }],
  limit: 10
});
console.log(users); // Logs up to 10 users aged 18 or older
```

***

### update()

> **update**(`path`, `data`): `Promise`\<[`NaroDocument`](../interfaces/NaroDocument.md)\>

Defined in: [base/Naro.ts:152](https://github.com/bryanlundberg/NaroDB/blob/52f9f594188cb90bbec73d09caa3bb35c5da0d8b/src/base/Naro.ts#L152)

Updates a document within a specified collection.

#### Parameters

##### path

`string`

The path to the document, which includes collection name and document ID.

##### data

`any`

The new data to merge with the existing document.

#### Returns

`Promise`\<[`NaroDocument`](../interfaces/NaroDocument.md)\>

A promise that resolves to the updated document.

#### Example

```ts
const db = new Naro("myDatabase");

const initialUser = await db.add("users", { name: "John Doe", age: 25 });
const updatedUser = await db.update(`users/${initialUser.id}`, { age: 30 });
console.log(updatedUser);
// Output: { id: "generated-id", createdAt: 1696872345000, name: "John Doe", age: 30 }
```

***

### writeToDisk()

> **writeToDisk**(): `Promise`\<`void`\>

Defined in: [base/Naro.ts:38](https://github.com/bryanlundberg/NaroDB/blob/52f9f594188cb90bbec73d09caa3bb35c5da0d8b/src/base/Naro.ts#L38)

Writes the current collections data to disk storage.

#### Returns

`Promise`\<`void`\>

A promise that resolves when the write operation completes successfully.
