import { NextFunction, Response, Request } from "express";
import { Types } from "mongoose";
import { BAD_REQUEST } from "./util";
import User from "./models/User";

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


  export const expireChallengesMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      // Find all users with active challenges
      const users = await User.find({ activeChallenges: { $exists: true, $ne: [] } }).populate(
        "activeChallenges"
      );
  
      for (const user of users) {
        // Filter out expired challenges
        user.activeChallenges = user.activeChallenges.filter((challenge: any) => {
          const isExpired =
            new Date().getTime() - new Date(challenge.createdAt).getTime() >
            7 * 24 * 60 * 60 * 1000; // 1 week in milliseconds
          return !isExpired;
        });
  
        await user.save();
      }
  
      next();
    } catch (error) {
      console.error("Error expiring challenges:", error);
      next(error); // Pass the error to the error-handling middleware
    }
  };