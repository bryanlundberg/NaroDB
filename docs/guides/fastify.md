# Guide to Fastify

## Installing Fastify and NaroDB

1. Ensure you have **Node.js** and **npm** installed.
2. Create a new project directory and initialize it:

```bash
mkdir fastify-narodb-app
cd fastify-narodb-app
npm init -y
```

3. Install Fastify and NaroDB:

```bash
npm install fastify @narodb/naro
```

## Basic Integration

Here's how to integrate NaroDB with Fastify:

### Database Configuration

::: code-group

```ts [ESM]
// db.js
import { Naro } from "@narodb/naro";
const db = new Naro("fastifyDatabase");
export default db;
```

```js [CJS]
// db.js
const { Naro } = require("@narodb/naro");
const db = new Naro("fastifyDatabase");
module.exports = db;
```
:::

### Fastify Server Setup


::: code-group
```js {9} [EMS]
import Fastify from 'fastify'
import db from './db.js'

const fastify = Fastify({
  logger: true
})

fastify.get('/', async (request, reply) => {
  const newDoc = await db.add("test", { name: "test" })
  return newDoc;
})

/**
 * Run the server!
 */
const start = async () => {
  try {
    await fastify.listen({ port: 3000 })
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()
```

In this guide, we explored how to set up and integrate Fastify with NaroDB to create a simple application for
managing data.


## Official Documentation

For more information, refer to the official Fastify documentation: [Fastify](https://fastify.dev/)

For NaroDB documentation, see the [API Reference](/api-reference/get).
