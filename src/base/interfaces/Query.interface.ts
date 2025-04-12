import { Operator } from "../types/Operator.type";

export interface Query {
  field: string;
  operator: Operator;
  value: string | number;
}
