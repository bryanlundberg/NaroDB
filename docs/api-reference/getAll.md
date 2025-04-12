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
const users = await db.getAll("users", {
  filters: [{ field: "age", operator: ">=", value: 18 }],
  limit: 10
});
console.log(users); // Logs up to 10 users aged 18 or older
```

