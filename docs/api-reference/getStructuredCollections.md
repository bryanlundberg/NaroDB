# API reference

## getStructuredCollections

Retrieves all collections in the database as a structured object. Each key in the returned object represents a collection name, and the value is an array of documents within that collection.

### Parameters

This method does not take any parameters.

### Returns

- Returns a promise that resolves to an object containing all collections and their respective documents. The object has the format `Record<string, NaroDocument[]>`.

## Example

```js
const db = new Naro("myDatabase");

// Add some documents to different collections
await db.add("users", { name: "John Doe", age: 30 });
await db.add("users", { name: "Jane Doe", age: 28 });
await db.add("products", { name: "Laptop", price: 1200 });

const collections = await db.getStructuredCollections();
console.log(collections);
// Output:
// {
//   "users": [
//     { id: "generated-id1", createdAt: 1696872345000, name: "John Doe", age: 30, path: "users/generated-id1" },
//     { id: "generated-id2", createdAt: 1696872346000, name: "Jane Doe", age: 28, path: "users/generated-id2" }
//   ],
//   "products": [
//     { id: "generated-id3", createdAt: 1696872347000, name: "Laptop", price: 1200, path: "products/generated-id3" }
//   ]
// }
```