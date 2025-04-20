# Types Reference

## NaroDocument

### Properties

The `NaroDocument` type represents a document in the Naro system. It includes a unique identifier, a creation timestamp, and any additional properties that may be associated with the document.

| Name            | Type      | Description                                  |
|-----------------|-----------|----------------------------------------------|
| `id`            | `string`  | The unique identifier for the document.      |
| `createdAt`     | `number`  | The timestamp when the document was created. |
| `path`          | `string`  | The path where the document is stored.       |
| `[key: string]` | `unknown` | Any additional properties of the document.   |
