export interface NaroDocument {
  id: string;
  createdAt: number;
  path: string;
  [key: string]: string | number | boolean | null | Record<string, unknown> | Array<unknown>;
}
