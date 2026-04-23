import express from "express";
import { register, login } from "../modules/auth/auth.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = express.Router();

router.post("/auth/register", register);
router.post("/auth/login", login);

// Protected route
router.get("/profile", authMiddleware, (req: any, res) => {
  res.json({
    success: true,
    data: req.user
  });
});

export default router;