# Usage

Designed to be simple and easy to use. Below are some common examples of how to use it.

## Initialize the Database

```javascript
import { NaroDB } from 'narodb';

// Initialize the database
const db = new NaroDB("my-database-name");
```

---

#### Add a Record to a Collection

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

#### Retrieve All Records from a Collection

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

#### Retrieve a Specific Record by ID

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

#### Update a Record

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

#### Delete a Record

```javascript
// Delete a specific record by its ID
await db.delete("users/t9y7ee2xvpr5fq99mkuj");
// Output: { id: "t9y7ee2xvpr5fq99mkuj", name: 'John Doe', age: 31 }
```

**Explanation:**

- **Root:** Removal actions start with `db.delete()`.
- **Collection:** `'users'` is the collection to remove the record from.
- **Element ID:** `"t9y7ee2xvpr5fq99mkuj"` specifies the record to delete.
