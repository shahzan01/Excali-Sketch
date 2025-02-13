import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

interface decodedString {
  userId: string;
}

interface AuthRequest extends Request {
  user?: any; // Replace `any` with the actual user type if known
}
const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    res.status(401).json({ error: "Access denied ,No token provided." });
    return;
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.USER_JWT_SECRET as string
    ) as decodedString;

    if (!decoded) {
      res.status(401).json({ error: "Access denied, Invalid jwt token." });
    }
    req.user = { userId: decoded.userId };
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid or expired token." });
  }
};

export default authMiddleware;
