# API reference

## get

Retrieves a document from the given path.

### Parameters

| Prop   | Type   | Description        |
|--------|--------|--------------------|
| `path` | string | The document path. |

### Returns

- Returns a promise that resolves to the document if found, or `null` if not found.

## Example

```js{3}
const db = new Naro("myDatabase");

const user = await db.get("users/generated-id");
console.log(user);

// Output:
{ 
  id: "generated-id", 
  createdAt: 1696872345000,
  path: "users/generated-id",
  age: 30 
}
```


