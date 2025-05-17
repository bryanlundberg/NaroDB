# API reference

## add

Adds a new document to the specified collection.

### Parameters

| Prop   | Type                      | Description                          |
|--------|---------------------------|--------------------------------------|
| `path` | `string`                  | The name of the collection to add to |
| `data` | `Record<string, unknown>` | The document data to be added        |

### Returns

- Returns a promise that resolves to the newly added document: [NaroDocument](../types-reference/naro-document.md).

## Example

```js
const newUser = await db.add("users", { name: "John Doe", age: 30 });
console.log(newUser);

// Output: 
{ 
  name: "John Doe", 
  age: 30,
  id: "generated-id", 
  createdAt: 1696872345000,
  path: "users/generated-id",
}
```
