import { Query } from "./Query.interface";
import { Limit} from "./Limit.type";

export interface Options {
  filters?: Query[];
  limit?: Limit;
  populate?: string[];
  offset?: number;
}
