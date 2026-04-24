import express from "express";
import { addError, getHistory, getById } from "../modules/error/error.controller";
import { register, login } from "../modules/auth/auth.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = express.Router();

router.post("/auth/register", register);
router.post("/auth/login", login);

// Error routes
router.post("/errors", authMiddleware, addError);
router.get("/errors", authMiddleware, getHistory);
router.get("/errors/:id", authMiddleware, getById);

// Protected route
router.get("/profile", authMiddleware, (req: any, res) => {
  res.json({
    success: true,
    data: req.user
  });
});

export default router;