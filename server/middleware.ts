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


const jwt = require("jsonwebtoken");
function verifyToken(req: Request, res: Response, next: NextFunction){
  const token = req.header("Authorization");
  if (!token) return res.status(401).json("Access Denied");
  try{
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    req.userID = decoded.userID;
    next();
  }
  catch(err){
    res.status(400).json("Invalid Token");
  }
};

module.exports = verifyToken;