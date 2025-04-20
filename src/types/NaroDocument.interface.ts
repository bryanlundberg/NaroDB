export interface NaroDocument {
  id: string;
  createdAt: number;
  path: string;
  [key: string]: unknown;
}
