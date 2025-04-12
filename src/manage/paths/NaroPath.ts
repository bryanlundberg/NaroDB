export class NaroPath {
  /**
   * Validates a given path string and extracts its components.
   *
   * @param {string} path - The path string to validate. It should follow the format:
   *                        'collectionName/id' or 'collectionName/id/subCollectionName/id'.
   *
   * @returns {Object} An object containing the extracted components of the path:
   *                   - `collectionName` (string): The name of the collection.
   *                   - `collectionId` (string): The ID of the collection.
   *                   - `subCollectionName` (string | undefined): The name of the sub-collection (if present).
   *                   - `subCollectionId` (string | undefined): The ID of the sub-collection (if present).
   *
   * @throws {Error} If the path contains invalid characters.
   * @throws {Error} If the path ends with a '/'.
   * @throws {Error} If the path is empty.
   * @throws {Error} If the path format is invalid (e.g., too few or too many parts).
   */
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
