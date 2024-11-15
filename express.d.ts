// types.d.ts
import { Request } from "express";

declare module "express" {
  export interface Request {
    userID?: string; // Define the structure of `userID` as needed
  }
}
