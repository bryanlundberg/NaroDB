# API reference

## add

Adds a new document to the specified collection.

### Parameters

| Prop             | Type      | Description                          |
|------------------|-----------|--------------------------------------|
| `collectionName` | `string`  | The name of the collection to add to |
| `data`           | `DocData` | The document data to be added        |

### Returns

- Returns a promise that resolves to the newly added document: `NaroDocument`


## Example

```js{3}
const db = new Naro("myDatabase");

const newUser = await db.add("users", { name: "John Doe", age: 30 });
console.log(newUser);
// Output: { id: "generated-id", createdAt: 1696872345000, name: "John Doe", age: 30 }
```
