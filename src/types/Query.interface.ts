import { Operator } from "./Operator.type";

export interface Query {
  field: string;
  operator: Operator;
  value: string | number;
}
