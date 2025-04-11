# Types Reference

## Filter

Filters are used to narrow down the results based on specific criteria.

| Prop       | Type     | Default                                                               |
|------------|----------|-----------------------------------------------------------------------|
| `field`    | `string` | The field to filter by (e.g., "age", "name").   |
| `operator` | `string` | The comparison operator to apply (e.g., "==", ">=", "<"). |
| `value`    | `any`    | The value to compare the field against.       |


## Example
```js
const filters = [
  { field: "age", operator: ">=", value: 18 },
  { field: "name", operator: "==", value: "John Doe" }
];

const users = await db.getAll("users", { filters });

console.log(users); // Logs up to 10 users aged 18 or older with the name "John Doe"
```
