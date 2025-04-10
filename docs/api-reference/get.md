# API reference

## get

Retrieves a document from the given path.

### Parameters

| Prop    | Type                 | Default |
|---------|----------------------|---------|
| `path`    | `string`               |         |

### Returns

- Returns a promise that resolves to the document if found, or `null` if not found.

## Example

```js{3}
const db = new Naro("myDatabase");

const user = await db.get("users/123");
console.log(user);
// Output: { id: "123", createdAt: 1696872345000, name: "John Doe", age: 30 } (if found)
```


