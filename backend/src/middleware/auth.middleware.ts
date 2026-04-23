import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";

export interface AuthRequest extends Request {
  user?: any;
}

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        error: "No token provided"
      });
    }

    const token = authHeader.split(" ")[1] || authHeader;
    const decoded = verifyToken(token);

    req.user = decoded;

    next();

  } catch (err) {
    return res.status(401).json({
      success: false,
      error: "Invalid token"
    });
  }
};