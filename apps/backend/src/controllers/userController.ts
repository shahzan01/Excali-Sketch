import { Request, Response } from "express";
import { UserService } from "../services/userService";
import { ServiceResponse } from "./../types/types"; // Import types

export class UserController {
  static async signup(req: Request, res: Response) {
    try {
      const result: ServiceResponse = await UserService.signup(req.body);
      res.status(result.success ? 201 : 400).json(result);
    } catch (error) {
      const err = error as Error;
      res.status(500).json({
        success: false,
        message: "Server error",
        error: err.message,
      });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const result: ServiceResponse = await UserService.login(req.body);
      res.status(result.success ? 200 : 400).json(result);
    } catch (error) {
      const err = error as Error;
      res.status(500).json({
        success: false,
        message: "Server error",
        error: err.message,
      });
    }
  }

  static async getRooms(req: Request, res: Response) {
    try {
      const userId = req.user?.userId as string;
      if (!userId) {
        res.status(401).json({
          success: false,
          message: "Unauthorized: User not authenticated",
        });
        return;
      }

      const result: ServiceResponse = await UserService.getRooms(userId);
      res.status(result.success ? 200 : 400).json(result.data);
    } catch (error) {
      const err = error as Error;
      res.status(500).json({
        success: false,
        message: "Server error",
        error: err.message,
      });
    }
  }
}
