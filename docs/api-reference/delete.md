# API reference

## delete

Deletes an item from the specified collection based on the given path.  
If the ID does not exist, the method does nothing.

### Parameters

| Prop   | Type     | Description                                                 |
|--------|----------|-------------------------------------------------------------|
| `path` | `string` | The path identifying the collection and the item to delete. |

### Returns

- Returns a promise that resolves when the deletion is complete.

## Example

```js{9}
const db = new Naro("myDatabase");

// Adding a new user
const user = await db.add("users", { name: "Jane Doe", age: 28 });
console.log(await db.getAll("users")); 
// Output: [{ id: "generated-id", name: "Jane Doe", age: 28, createdAt: 1696872345000 }]

// Deleting the user
await db.delete(`users/${user.id}`);
console.log(await db.getAll("users")); 
// Output: []
```

