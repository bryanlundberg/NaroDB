export class NaroPath {
  static validate(path: string): {
    collectionName: string;
    collectionId: string;
    subCollectionName?: string;
    subCollectionId?: string;
  } {
    const invalidChars = /[^a-zA-Z0-9/_-]/;
    if (invalidChars.test(path)) throw new Error("Path contains invalid characters.");
    if (path.endsWith('/')) throw new Error("Path should not end with a '/'.");
    if (!path) throw new Error("Empty path provided.");
    const pathParts = path.split('/');
    if (pathParts.length < 1) throw new Error("Invalid path format. Ensure the path is in the format 'collectionName/id'.");
    if (pathParts.length > 4) throw new Error("Invalid path format. Ensure the path is in the format 'collectionName/id/subCollectionName/id'.");

    return {
      collectionName: pathParts[0],
      collectionId: pathParts[1],
      subCollectionName: pathParts[2],
      subCollectionId: pathParts[3]
    };
  }
}
