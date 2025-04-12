# API reference

## populate

Populates the specified fields of a document with their corresponding referenced documents.

### Parameters

| Prop             | Type                | Description                                                      |
|------------------|---------------------|------------------------------------------------------------------|
| `doc`            | `NaroDocument`      | The document to be populated.                                    |
| `populateFields` | `string[] \| undefined` | An array of field names to populate, or undefined if no fields are specified. |

### Returns

- Returns a promise that resolves to the populated document.
- If no fields are specified or if the document doesn't contain the specified fields, the original document is returned.

## Example

```js{6}
const db = new Naro("myDatabase");

const profile = await db.add("profiles", { bio: "Software Developer", skills: ["TypeScript", "Node.js"] });
const user = await db.add("users", { name: "John Doe", profile: `profiles/${profile.id}` });

const populatedUser = await db.populate(user, ["profile"]);
console.log(populatedUser);
// Output:
// {
//   id: "generated-id",
//   createdAt: 1696872345000,
//   name: "John Doe",
//   profile: {
//     id: "generated-id",
//     createdAt: 1696872345000,
//     bio: "Software Developer",
//     skills: ["TypeScript", "Node.js"]
//     path: "profiles/generated-id"
//   },
//     path: "users/generated-id"
// }
```
