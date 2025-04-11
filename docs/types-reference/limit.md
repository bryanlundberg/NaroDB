# Types Reference

## Limit

Limits are used to narrow down the results based on specific range.


## Example

```js
const users = await db.getAll("users", { limit: 10 });

console.log(users); // Returns the first 10 records from the collection.
```
