import { Request, Response, Router } from "express";
import authMiddleware from "../middlewares/authMiddleware";
import { roomControler } from "../controllers/roomController";
import { createRoomSchema } from "@repo/common/roomSchema";
import { validateInput } from "../middlewares/validateInput";
const router: Router = Router();

router.post(
  "/create/:slug",
  authMiddleware,
  validateInput(createRoomSchema, "params"),
  roomControler.create
);
router.post("/join/:slug", authMiddleware, roomControler.join);
router.get("/:roomId", authMiddleware, roomControler.getChats);
router.delete("/:roomId", authMiddleware, roomControler.delete);
export default router;
