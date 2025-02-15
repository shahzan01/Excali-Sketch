import { Request, Response, Router } from "express";
import authMiddleware from "../middlewares/authMiddleware";
import { roomControler } from "../controllers/roomController";
import { createRoomSchema } from "./../schema/roomSchema";
import { validateInput } from "../middlewares/validateInput";
const router: Router = Router();

router.post(
  "/create/:slug",
  validateInput(createRoomSchema, "params"),
  authMiddleware,
  roomControler.create
);
router.post(
  "/join/:slug",

  authMiddleware,
  roomControler.join
);
router.get("/:roomId", authMiddleware, roomControler.getChats);
router.delete("/:roomId", authMiddleware, roomControler.delete);
export default router;
