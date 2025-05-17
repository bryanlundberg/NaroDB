# API reference

## writeToDisk

Writes the current collections data to disk storage.

### Parameters

This method does not take any parameters.

### Returns

- Returns a promise that resolves when the write operation completes successfully.

## Example

```js{6}
// Add some data to the database
await db.add("users", { name: "John Doe", age: 30 });
await db.add("users", { name: "Jane Doe", age: 28 });

// Write the data to disk
await db.writeToDisk();
console.log("Data has been written to disk");
```

> [!NOTE]
> This method is automatically called when the application exits normally. You only need to call it explicitly if you want to ensure data is written to disk at a specific point in your application.
