import { NextFunction, Response, Request } from "express";
import { Types } from "mongoose";
import { BAD_REQUEST } from "./util";
import User from "./models/User";
import Challenge from "./models/Challenge"; // Import Challenge model

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
      const currentDate = new Date();
  
      // Find all users with active challenges
      const users = await User.find({ activeChallenges: { $exists: true, $ne: [] } }).populate(
        "activeChallenges"
      );
  
      for (const user of users) {
        // Filter out expired challenges from activeChallenges
        user.activeChallenges = user.activeChallenges.filter((challenge: any) => {
          const expiresAt = new Date(challenge.expiresAt); // Use the expiresAt field
          return expiresAt > currentDate; // Keep only non-expired challenges
        });
  
        await user.save(); // Save the updated user document
      }
  
      // Remove expired challenges from the database (optional)
      await Challenge.deleteMany({ expiresAt: { $lte: currentDate } });
  
      next(); // Proceed to the next middleware or route handler
    } catch (error) {
      console.error("Error expiring challenges:", error);
      next(error); // Pass the error to the error-handling middleware
    }
  };