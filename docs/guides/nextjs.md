# Guide to Next.js

## Installing Next.js and NaroDB

1. Init a new Next.js project:

```bash
npx create-next-app@latest
```

3. Install NaroDB:

```bash
npm install @narodb/naro
```

## Basic Integration

Here's how to integrate NaroDB with Next.js:

### Database Configuration

::: code-group

```ts [ESM]
// src/db/db.js
import { Naro } from "@narodb/naro";
const db = new Naro("nextjsDatabase");
export default db;
```
:::

### Next.js server setup  (App Router)

::: code-group
```js{1,6,15} [src/app/api/users/route.js]
import db from "@/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const data = await db.getAll("users");
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST() {
  try {
    const newDoc = await db.add("user", { name: "John Doe", age: 30, });
    return NextResponse.json(newData);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
```
:::

```bash
curl -X POST http://localhost:3000/api/users \
-H "Content-Type: application/json" \
```


The above code sets up a basic API route in Next.js that interacts with NaroDB. The `GET` method retrieves all records
from the "test" collection, while the `POST` method adds a new record.

## Official Documentation

For more information, refer to the official Next.js documentation: [Next.js](https://nextjs.org/)

For NaroDB documentation, see the [API Reference](/api-reference/get).

