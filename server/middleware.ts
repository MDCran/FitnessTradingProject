import { NextFunction, Response, Request } from "express";
import { Types } from "mongoose";
import { BAD_REQUEST } from "./util";

type RequestInfo = "body" | "params" | "query";

export const isInfoSupplied =
  (reqInfoType: RequestInfo, ...fields: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const information = req[reqInfoType];
    for (const field of fields) {
      if (!information[field]) {
        return res.status(BAD_REQUEST).json({
          error: `field '${field}' not supplied in ${reqInfoType}`,
        });
      }
    }
    next();
  };

export const ensureInteger = (
  reqInfoType: RequestInfo,
  ...fields: string[]
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const information = req[reqInfoType];
    for (const field of fields) {
      const value = information[field];
      if (value && isNaN(parseInt(value))) {
        return res.status(BAD_REQUEST).json({
          error: `field '${field}' is not an integer in ${reqInfoType}`,
        });
      }
    }
    next();
  };
};

export const isInfoValidId =
  (reqInfoType: RequestInfo, ...fields: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const information = req[reqInfoType];
    for (const field of fields) {
      if (!Types.ObjectId.isValid(information[field])) {
        return res.status(BAD_REQUEST).json({
          error: `field '${field}' is not a valid 12-byte Mongo ID in req.${reqInfoType}`,
        });
      }
    }
    next();
  };
