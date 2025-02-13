import { Request, Response } from "express";
import { UserService } from "../services/userService";

export class UserController {
  static async signup(
    req: Request<{}, {}, { email: string; password: string; name: string }>,
    res: Response
  ) {
    try {
      const user = await UserService.signup(req.body);
      res.status(201).json(user);
    } catch (error) {
      res.status(400).json({ error: error });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const token = await UserService.login(req.body);
      res.status(200).json({ token });
    } catch (error) {
      res.status(400).json({ error: error });
    }
  }

  static async getRooms(req: Request, res: Response) {
    try {
      const data = { userId: req.user?.userId as string };
      if (!data || data.userId == "") {
        throw new Error("Unauthorized");
      }
      const rooms = await UserService.getRooms(data);
      res.status(200).json(rooms);
    } catch (error) {
      res.status(400).json({ error: error });
    }
  }
}
