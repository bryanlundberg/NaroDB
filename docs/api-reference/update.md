# API reference

## update

Updates a document within a specified collection.

### Parameters

| Prop   | Type     | Description                                                               |
|--------|----------|---------------------------------------------------------------------------|
| `path` | `string` | The path to the document, which includes collection name and document ID. |
| `data` | `any`    | The new data to merge with the existing document.                         |

### Returns

- Returns a promise that resolves to the updated document.

## Example

```js{2}
const initialUser = await db.add("users", { name: "John Doe", age: 25 });
const updatedUser = await db.update(`users/${initialUser.id}`, { age: 30 });
console.log(updatedUser);
// Output: { id: "generated-id", createdAt: 1696872345000, name: "John Doe", age: 30 }
```

