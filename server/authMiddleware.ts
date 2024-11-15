import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';


interface CustomRequest extends Request {
  userID?: string;
}

export const auth = async (req: CustomRequest, res: Response, next: NextFunction) => {
  const SECRET_KEY = process.env.JWT_SECRET!;
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).send('No token provided');
    }

    console.log("Token is:", token);
    console.log("JWT Secret:", SECRET_KEY);

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
      if (err) {
        console.error("JWT verification error:", err);
        return res.status(401).send('Invalid token');
      }

      console.log("Decoded token:", decoded);
      const userID = (decoded as JwtPayload).id as string;
      req.userID = userID;

      next();
    });
  } catch (err) {
    console.error("Authentication error:", err);
    res.status(401).send('Please authenticate');
  }
};
