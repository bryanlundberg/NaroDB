# Guide to Express.js

## Installing Express.js and NaroDB

1. Ensure you have **Node.js** and **npm** installed.
2. Create a new project directory and initialize it:

```bash
mkdir express-narodb-app
cd express-narodb-app
npm init -y
```

3. Install Express.js and NaroDB:

```bash
npm install express @narodb/naro
```

## Basic Integration

Here's how to integrate NaroDB with Express.js:


### Database Configuration

::: code-group

```ts [ESM]
// db.js
import { Naro } from "@narodb/naro";
const db = new Naro("expressDatabase");
export default db;
```

```js [CJS]
// db.js
const { Naro } = require("@narodb/naro");
const db = new Naro("expressDatabase");
module.exports = db;
```
:::

### Express Server Setup


::: code-group
```ts {2, 8} [ESM]
import express from "express";
import db from "./db.js";
const app = express();
const port = 3000;

app.post("/users", async (req, res) => {
  try {
    const newUser = await db.add("users", { name: "John Doe", age: 30 });
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
```
```js {2, 8} [CJS]
const express = require("express");
const db = require("./db.js");
const app = express();
const port = 3000;

app.post("/users", async (req, res) => {
  try {
    const newUser = await db.add("users", { name: "John Doe", age: 30 });
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
```
:::

In this guide, we explored how to set up and integrate Express.js with NaroDB to create a simple application for
managing data.


## Official Documentation

For more information, refer to the official Express.js documentation: [Express.js](https://expressjs.com/)

For NaroDB documentation, see the [API Reference](/api-reference/get).
