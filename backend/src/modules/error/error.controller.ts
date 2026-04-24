import { Response } from "express";
import { AuthRequest } from "../../middleware/auth.middleware";
import * as errorService from "./error.service";

export const addError = async (req: AuthRequest, res: Response) => {
  try {
    const { errorMessage } = req.body;
    const userId = req.user.id;

    if (!errorMessage) {
      return res.status(400).json({ success: false, error: "errorMessage is required" });
    }

    const log = await errorService.processError(userId, errorMessage);

    res.json({
      success: true,
      data: log
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const getHistory = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const keyword = req.query.keyword as string;

    const history = await errorService.getHistory(userId, page, limit, keyword);

    res.json({
      success: true,
      data: history
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const getById = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.id;
    const id = parseInt(req.params.id as string);

    const log = await errorService.getById(userId, id);

    if (!log) {
      return res.status(404).json({ success: false, error: "Error log not found" });
    }

    res.json({
      success: true,
      data: log
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
};
