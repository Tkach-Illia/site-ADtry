import { Document } from "mongoose";
import { Cell } from "./Cell";

export interface IGame extends Document {
  grid: Cell[][];
  ips: string[];
}
