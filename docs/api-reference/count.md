# API reference

## count

Counts the number of documents in a specified collection.

### Parameters

| Prop   | Type     | Description                                       |
|--------|----------|---------------------------------------------------|
| `path` | `string` | The name of the collection to count documents in. |

### Returns

- A promise that resolves to the number of documents in the collection.

## Example

```js{3}
const db = new Naro("myDatabase");

const count = await db.count("users");
console.log(count); // Output: 5 (if there are 5 documents in the "users" collection)
```

