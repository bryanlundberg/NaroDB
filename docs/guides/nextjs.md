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

::: code-group
```js [src/app/api/users/route.js]

import { Naro } from "@narodb/naro";
import { NextResponse } from "next/server";

const naro = new Naro("nextjsDatabase");

export async function GET() {
  try {
    const data = await naro.getAll("users");
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const newData = await naro.add("user", body);
    return NextResponse.json(newData, { status: 201 });
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

