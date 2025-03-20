export class NaroPath {
  static validate(path: string): {
    collectionName: string;
    collectionId: string;
    subCollectionName?: string;
    subCollectionId?: string;
  } {
    const pathParts = path.split('/');
    if (pathParts.length <= 1) {
      throw new Error("Invalid path format. Ensure the path is in the format 'collectionName/id'.");
    }
    if (pathParts.length === 3 || pathParts.length >= 5) {
      throw new Error("Invalid path format. Ensure the path is in the format 'collectionName/id/subCollectionName/id'.");
    }
    return {
      collectionName: pathParts[0],
      collectionId: pathParts[1],
      subCollectionName: pathParts[2],
      subCollectionId: pathParts[3]
    };
  }
}
