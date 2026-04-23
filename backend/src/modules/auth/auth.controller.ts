import { Request, Response } from "express";
import { registerUser, loginUser } from "./auth.service";

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await registerUser(email, password);

    res.json({
      success: true,
      data: user
    });

  } catch (err: any) {
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const result = await loginUser(email, password);

    res.json({
      success: true,
      data: result
    });

  } catch (err: any) {
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
};