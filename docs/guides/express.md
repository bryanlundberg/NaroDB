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

::: code-group
```js {2,10-30} [app.js]
const express = require("express");
const { Naro } = require("@narodb/naro");
const app = express();
const port = 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize NaroDB
const naro = new Naro("expressDatabase");

// Routes
app.post("/users", async (req, res) => {
  try {
    const newUser = await naro.add("users", req.body);
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/users", async (req, res) => {
  try {
    const users = await naro.getAll("users");
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
```

```ts {2,10-30} [app.ts]
import express from "express";
import { Naro } from "@narodb/naro";
const app = express();
const port = 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize NaroDB
const naro = new Naro("expressDatabase");

// Routes
app.post("/users", async (req, res) => {
  try {
    const newUser = await naro.add("users", req.body);
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/users", async (req, res) => {
  try {
    const users = await naro.getAll("users");
    res.json(users);
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

## Organizing Your Code

For larger applications, it's better to organize your code into separate files:

### Database Configuration

::: code-group
```js [db.js]
const { Naro } = require("@narodb/naro");

const db = new Naro("expressDatabase");

module.exports = db;
```
:::

### Routes

::: code-group
```js [routes/users.js]
const express = require("express");
const router = express.Router();
const db = require("../db");

// Create a new user
router.post("/", async (req, res) => {
  try {
    const newUser = await db.add("users", req.body);
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all users
router.get("/", async (req, res) => {
  try {
    const users = await db.getAll("users");
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
```
:::

### Main Application File

::: code-group
```js [app.js]
const express = require("express");
const usersRoutes = require("./routes/users");
const app = express();
const port = 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/users", usersRoutes);

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
```
:::

In this guide, we explored how to set up and integrate Express.js with NaroDB to create a simple application for
managing data.

Happy coding!

## Official Documentation

For more information, refer to the official Express.js documentation: [Express.js](https://expressjs.com/)

For NaroDB documentation, see the [API Reference](/api-reference/get).
