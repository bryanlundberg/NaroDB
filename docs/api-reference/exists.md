# API reference

## exists

Checks if a document exists in the specified collection based on the given path.

### Parameters

| Prop   | Type     | Description                                                                                                                                |
|--------|----------|--------------------------------------------------------------------------------------------------------------------------------------------|
| `path` | `string` | The path to the document, which includes the collection name and document ID. <br/>The path should follow the format: 'collectionName/id'. |

### Returns

- A promise that resolves to `true` if the document exists, or `false` otherwise.

## Example

```js{3}
const db = new Naro("myDatabase");

const exists = await db.exists("users/generated-id");
console.log(exists); // Output: true or false
```

