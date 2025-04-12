# API reference

## populateCollection

Populates the specified fields within a collection of documents.

### Parameters

| Prop             | Type                                                  | Description                                                                                  |
|------------------|-------------------------------------------------------|----------------------------------------------------------------------------------------------|
| `collection`     | [NaroDocument[]](../types-reference/naro-document.md) | The collection of documents to be populated.                                                 |
| `populateFields` | `string[]`                                            | The fields to populate within each document. If undefined or empty, no fields are populated. |

### Returns

- Returns a promise resolving to the collection of documents with the specified fields populated.
- If no fields are specified or if the collection is empty, the original collection is returned.

## Example

```js{7}
const db = new Naro("myDatabase");

const profile = await db.add("profiles", { bio: "Engineer", skills: ["JavaScript", "TypeScript"] });
const user1 = await db.add("users", { name: "Alice", profile: `profiles/${profile.id}` });
const user2 = await db.add("users", { name: "Bob", profile: `profiles/${profile.id}` });

const populatedUsers = await db.populateCollection([user1, user2], ["profile"]);
console.log(populatedUsers);
// Output:
// [
//   {
//     id: "generated-id",
//     createdAt: 1696872345000,
//     name: "Alice",
//     profile: {
//       id: "generated-id",
//       createdAt: 1696872345000,
//       bio: "Engineer",
//       skills: ["JavaScript", "TypeScript"],
//       path: "profiles/generated-id"
//     }
//     path: "users/generated-id"
//   },
//   {
//     id: "generated-id",
//     createdAt: 1696872345000,
//     name: "Bob",
//     profile: {
//       id: "generated-id",
//       createdAt: 1696872345000,
//       bio: "Engineer",
//       skills: ["JavaScript", "TypeScript"],
//       path: "profiles/generated-id"
//     },
//     path: "users/generated-id"
//   }
// ]
```
