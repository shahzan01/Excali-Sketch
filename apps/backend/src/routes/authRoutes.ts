import express, { Request, Response, Router } from "express";
import authMiddleware from "../middlewares/authMiddleware";

const router: Router = express.Router();

router.get("/me", authMiddleware, (req: Request, res: Response) => {
  res.json({ user: req.user });
});

router.post("/logout", (req: Request, res: Response) => {
  res.cookie("token", null, { httpOnly: true, sameSite: "none" });
  res.json({ message: "Logged out successfully" });
});

export default router;
