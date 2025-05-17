# API reference

## getAll

Retrieves all documents from a specified collection, optionally applying filters and limits.

### Parameters

| Prop      | Type                                     | Description                                            |
|-----------|------------------------------------------|--------------------------------------------------------|
| `path`    | `string`                                 | The name of the collection to retrieve documents from. |
| `options` | [Options](../types-reference/options.md) | Additional options for filtering and limiting results. |

### Returns

- Returns a promise that resolves to an array of documents from the specified collection.
- If no documents are found, it resolves to an empty array.

## Example

```js
const users = await db.getAll("users");
console.log(users);

// Output: 
[
  { id: "generated-id-1", 
    name: "John Doe", 
    age: 30, 
    createdAt: 1696872345000, 
    path: "users/generated-id-1" 
  },
  { id: "generated-id-2", 
    name: "Jane Smith", 
    age: 25, 
    createdAt: 1696872345000, 
    path: "users/generated-id-2" 
  },
  ...
]
```

