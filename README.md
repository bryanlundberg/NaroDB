## Overview

<img src=".github/logo_light.png">

**AquaBase** is an experimental project designed to simplify databases usage.

Principles:

- Must be extremely easy to use and understand.
- Must use paths for access, similar to file systems and most API core concepts.
    - Basic collection:  `#db/users/data.json`
    - Sub-collections:   `#db/users/:userId/logs/data.json`
- Must initialize and maintain a data clone in memory.
- Must allow any type of data to be stored and replaced (responsibility relies on the user's use of
  types/interfaces/schemas).

## Sample

```javascript
import { AquaBase } from 'aquabase';

// Initialize the database
const db = new AquaBase();

// Basic usage
await db.add('users', { name: 'John Doe', age: 30 })
// Output: { aid: t9y7ee2xvpr5fq99mkuj name: 'John Doe', age: 30 }

await db.getAll('users')
// Output:  [
// { aid: "t9y7ee2xvpr5fq99", "name": "John Doe", "age": 30 },
// { aid: "vbn87wsjiqk34u5p", "name": "Jane Doe", "age": 25 }
// ]

await db.get('users/t9y7ee2xvpr5fq99mkuj')
// Output: { aid: t9y7ee2xvpr5fq99mkuj name: 'John Doe', age: 30 }

await db.update("users/t9y7ee2xvpr5fq99mkuj", { age: 31 });
// Output: { aid: t9y7ee2xvpr5fq99mkuj name: 'John Doe', age: 31 }

await db.delete("users/t9y7ee2xvpr5fq99mkuj");
// Output: { aid: t9y7ee2xvpr5fq99mkuj name: 'John Doe', age: 31 }
```

## License

This project is licensed under the Server Side Public License. For more details, check
the [LICENSE](https://github.com/bryanlundberg/AquaBase/blob/main/LICENSE.txt) file.
