# Brief Usage

Designed to be simple and easy to use. Below are some common examples of how to use it.

## Initialize the Database

Create a single NaroDB instance and export it for use throughout your application:

```javascript
// db.js
import { Naro } from '@narodb/naro';

// Initialize once
const db = new Naro("my-database-name");

// Export as singleton
export default db;
```

Then import this instance wherever needed:

```javascript
// other-file.js
import db from './db.js';

// Use the shared instance
const users = await db.getAll('users');
```

::::: warning
Creating multiple Naro instances with the same database name can lead to:
- Data inconsistency
- Race conditions
- Unexpected data overwrites
- Performance issues

Always create one instance and export it for reuse.
:::::

---

## Add a Record to a Collection

```javascript
// Add a record to the 'users' collection
await db.add('users', { name: 'John Doe', age: 30 });
// Output: { id: "t9y7ee2xvpr5fq99mkuj", name: 'John Doe', age: 30 }
```

**Explanation:**

- **Root:** The root of all operations starts with the database instance `db`.
- **Collection:** `'users'` represents the collection where records are stored.
- **Element ID:** Each record automatically gets a unique ID such as `"t9y7ee2xvpr5fq99mkuj"`.

---

## Retrieve All Records from a Collection

```javascript
// Get all records from the 'users' collection
await db.getAll('users');
// Output:
// [
//   { id: "t9y7ee2xvpr5fq99", name: "John Doe", age: 30 },
//   { id: "vbn87wsjiqk34u5p", name: "Jane Doe", age: 25 }
// ]
```

**Explanation:**

- **Root:** The request starts with `db.getAll()`.
- **Collection:** Specifying `'users'` requests all records under that collection.

---

## Retrieve a Specific Record by ID

```javascript
// Get a specific record by its ID
await db.get('users/t9y7ee2xvpr5fq99mkuj');
// Output: { id: "t9y7ee2xvpr5fq99mkuj", name: 'John Doe', age: 30 }
```

**Explanation:**

- **Root:** Requests begin from `db.get()`.
- **Collection:** `'users'` represents the collection.
- **Element ID:** `"t9y7ee2xvpr5fq99mkuj"` specifies the unique record to retrieve.

---

## Update a Record

```javascript
// Update the age of a specific record
await db.update("users/t9y7ee2xvpr5fq99mkuj", { age: 31 });
// Output: { id: "t9y7ee2xvpr5fq99mkuj", name: 'John Doe', age: 31 }
```

**Explanation:**

- **Root:** Update operations start with `db.update()`.
- **Collection:** `'users'` holds the record.
- **Element ID:** `"t9y7ee2xvpr5fq99mkuj"` identifies the record to update.

---

## Delete a Record

```javascript
// Delete a specific record by its ID
await db.delete("users/t9y7ee2xvpr5fq99mkuj");
// Output: { id: "t9y7ee2xvpr5fq99mkuj", name: 'John Doe', age: 31 }
```

**Explanation:**

- **Root:** Removal actions start with `db.delete()`.
- **Collection:** `'users'` is the collection to remove the record from.
- **Element ID:** `"t9y7ee2xvpr5fq99mkuj"` specifies the record to delete.