# Guide to Using NaroDB with URI Service

## Understanding URI Service

NaroDB can operate in two modes:
1. **Local mode** - Data is stored locally in files (default)
2. **Remote mode** - Data is stored and managed by a remote NaroDB service

The URI service allows you to connect to a remote NaroDB instance, enabling you to:
- Store data on a remote server
- Access your database from multiple applications
- Share database access across different environments

## Connecting to a Remote NaroDB Service

To connect to a remote NaroDB service, initialize the Naro class with a URI option:

::: code-group
```js [app.js]
const { Naro } = require("@narodb/naro");

// Connect to a remote NaroDB service
const db = new Naro("connect", {
  URI: process.env.NARO_URI
});

// Use the database as usual
async function main() {
  // Add a document
  const user = await db.add("users", { name: "John Doe", age: 30 });
  console.log(user);
  
  // Get all documents
  const allUsers = await db.getAll("users");
  console.log(allUsers);
}

main().catch(console.error);
```

```ts [app.ts]
import { Naro } from "@narodb/naro";

// Connect to a remote NaroDB service
const db = new Naro("connect", {
  URI: process.env.NARO_URI
});

// Use the database as usual
async function main() {
  // Add a document
  const user = await db.add("users", { name: "John Doe", age: 30 });
  console.log(user);
  
  // Get all documents
  const allUsers = await db.getAll("users");
  console.log(allUsers);
}

main().catch(console.error);
```
:::

## Benefits of Using the URI Service

1. **Centralized Data Storage**: Store your data in a central location accessible from multiple applications
2. **Simplified Deployment**: No need to manage local data files in your application
3. **Scalability**: The remote service can handle scaling as your data grows
4. **Cross-Environment Access**: Access the same database from development, staging, and production environments


For more information on NaroDB's API, see the [API Reference](/api-reference/get).
