# API reference

## clear

Deletes all documents in a specified collection.

### Parameters

| Prop   | Type      | Description                                |
|--------|-----------|-------------------------------------------|
| `path` | `string`  | The name of the collection to clear.      |

### Returns

- Returns a promise that resolves when the collection is cleared.

## Example

```js
const db = new Naro("myDatabase");

await db.clear("users");
console.log(await db.getAll("users")); // Output: []
```