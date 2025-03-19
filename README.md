## Overview

<img src=".github/logo_light.png">

**AquaBase** is an experimental project designed to simplify databases usage.

Principles:

- Must be extremely easy to use and understand.
- Must use paths for access, similar to file systems and most API core concepts.
    - Basic collection:  `#db/users -> [...users]`
    - Sub-collections:   `#db/users/:userId/logs/:logId -> { userId : [...logs] } -> [...logs]`
- Must initialize and maintain a data clone in memory.
- Must allow any type of data to be stored and replaced (responsibility relies on the user's use of
  types/interfaces/schemas).

## Performance tests

- `db.add` to a collection with 1,000,000 documents: [4.73ms]
- `db.getAll` from a collection with 1,000,000 documents: [6.27ms]
- `db.get` from a collection with 1,000,000 documents: [20.83ms]
- `db.update` from a collection with 1,000,000 documents: [0.53ms]
- `db.delete` from a collection with 1,000,000 documents: [4.46ms]
- `db.writeToFile` from a collection with 1,000,000 documents: [0.523ms]

## Sample

```javascript
import { AquaBase } from 'aquabase';

// Initialize the database
const db = new AquaBase();

// Basic usage
await db.add('users', { name: 'John Doe', age: 30 })
// Output: { id: t9y7ee2xvpr5fq99mkuj name: 'John Doe', age: 30 }

await db.getAll('users')
// Output:  [
// { id: "t9y7ee2xvpr5fq99", "name": "John Doe", "age": 30 },
// { id: "vbn87wsjiqk34u5p", "name": "Jane Doe", "age": 25 }
// ]

await db.get('users/t9y7ee2xvpr5fq99mkuj')
// Output: { id: t9y7ee2xvpr5fq99mkuj name: 'John Doe', age: 30 }

await db.update("users/t9y7ee2xvpr5fq99mkuj", { age: 31 });
// Output: { id: t9y7ee2xvpr5fq99mkuj name: 'John Doe', age: 31 }

await db.delete("users/t9y7ee2xvpr5fq99mkuj");
// Output: { id: t9y7ee2xvpr5fq99mkuj name: 'John Doe', age: 31 }
```

## License

This project is licensed under the Server Side Public License. For more details, check
the [LICENSE](https://github.com/bryanlundberg/AquaBase/blob/main/LICENSE.txt) file.
