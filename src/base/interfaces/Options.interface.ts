import { Query } from "./Query.interface";
import { Limit} from "../types/Limit.type";

export interface Options {
  filters?: Query[];
  limit?: Limit;
}
