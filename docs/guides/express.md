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
npm install express narodb
```

## Setting Up Middleware

For a complete Express.js application with NaroDB, you'll need to set up middleware for parsing JSON requests:

```javascript
const express = require("express");
const app = express();
const port = 3000;

// Middleware for parsing JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
```

## Integrating NaroDB with Express.js

### Basic Integration

Here's how to integrate NaroDB with Express.js:

```javascript
const express = require("express");
const { Naro } = require("narodb");
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

app.get("/users/:id", async (req, res) => {
  try {
    const user = await naro.get(`users/${req.params.id}`);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put("/users/:id", async (req, res) => {
  try {
    const updatedUser = await naro.update(`users/${req.params.id}`, req.body);
    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/users/:id", async (req, res) => {
  try {
    await naro.delete(`users/${req.params.id}`);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
```

## Organizing Your Code

For larger applications, it's better to organize your code into separate files:

### Database Configuration

```javascript
// db.js
const { Naro } = require("narodb");

const db = new Naro("expressDatabase");

module.exports = db;
```

### Routes

```javascript
// routes/users.js
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

// Get a specific user
router.get("/:id", async (req, res) => {
  try {
    const user = await db.get(`users/${req.params.id}`);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a user
router.put("/:id", async (req, res) => {
  try {
    const updatedUser = await db.update(`users/${req.params.id}`, req.body);
    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a user
router.delete("/:id", async (req, res) => {
  try {
    await db.delete(`users/${req.params.id}`);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
```

### Main Application File

```javascript
// app.js
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

## Advanced Features

### Using Filters and Limits

```javascript
// Get users with filters
router.get("/filtered", async (req, res) => {
  try {
    const users = await db.getAll("users", {
      filters: [
        { field: "age", operator: ">=", value: 18 },
        { field: "active", operator: "==", value: true }
      ],
      limit: 10
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

### Using Populate for Related Data

```javascript
// Get user with populated profile
router.get("/:id/with-profile", async (req, res) => {
  try {
    const user = await db.get(`users/${req.params.id}`);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const populatedUser = await db.populate(user, ["profile"]);
    res.json(populatedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

## Best Practices

1. **Error Handling**: Always wrap database operations in try-catch blocks
2. **Input Validation**: Validate user input before saving to the database
3. **Route Organization**: Group related routes together
4. **Environment Variables**: Use environment variables for database names and other configuration
5. **Middleware**: Use middleware for common operations like authentication
6. **Async/Await**: Use async/await for cleaner asynchronous code

## Official Documentation

For more information, refer to the official Express.js documentation: [Express.js](https://expressjs.com/)

For NaroDB documentation, see the [API Reference](/api-reference/get).
