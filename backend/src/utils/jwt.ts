import jwt, { SignOptions } from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET as string;

export const generateToken = (payload: object, expiresIn: SignOptions["expiresIn"] = "1h") => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, JWT_SECRET);
};