import { Router } from "express";
import authMiddleware from "../middlewares/authMiddleware";
import { UserController } from "../controllers/userController";
import { validateInput } from "../middlewares/validateInput";
import { userLoginSchema, userSignupSchema } from "./../schema/userSchema";
const router: Router = Router();

router.post("/signup", validateInput(userSignupSchema), UserController.signup);
router.post("/login", validateInput(userLoginSchema), UserController.login);
router.get("/rooms", authMiddleware, UserController.getRooms);

export default router;
