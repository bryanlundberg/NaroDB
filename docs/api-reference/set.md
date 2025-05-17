# API reference

## set

Overwrite a document in the specified collection using the provided data.

> [!IMPORTANT]
> This method is particularly useful for customizing default NaroDB IDs. However, it should be used with caution as it
> can be risky.

### Parameters

| Prop   | Type      | Description                                                                                |
|--------|-----------|--------------------------------------------------------------------------------------------|
| `path` | `string`  | The collection name where the data will be set.                                            |
| `data` | `DocData` | The document data to set. <br/> Note: The `id` property is mandatory in the provided data. |

### Returns

- Returns a promise that resolves to the newly document: [NaroDocument](../types-reference/naro-document.md).

## Example

```js
const newDoc = await db.set("users", { 
  id: "123",
  name: "Jane Doe", age: 28 
});

console.log(newDoc);
// Output: { id: "123", createdAt: 1696872345000, name: "Jane Doe", age: 28 }
```
