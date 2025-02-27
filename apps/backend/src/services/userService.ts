import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { ServiceResponse } from "./../types/types"; // Import types

dotenv.config();
const prisma = new PrismaClient();

export class UserService {
  static async signup(data: {
    name: string;
    email: string;
    password: string;
  }): Promise<ServiceResponse> {
    try {
      const existingUser = await prisma.user.findUnique({
        where: { email: data.email },
      });

      if (existingUser) {
        return { success: false, message: "User already exists" };
      }

      const hashedPassword = await bcrypt.hash(data.password, 10);
      const newUser = await prisma.user.create({
        data: { name: data.name, email: data.email, password: hashedPassword },
      });

      return {
        success: true,
        message: "Signup successful",
        data: { id: newUser.id, name: newUser.name, email: newUser.email },
      };
    } catch (error) {
      const err = error as Error;
      return { success: false, message: "Signup error", error: err.message };
    }
  }

  static async login(data: {
    email: string;
    password: string;
  }): Promise<ServiceResponse<{ token: string; user: object }>> {
    try {
      const user = await prisma.user.findUnique({
        where: { email: data.email },
      });
      if (!user)
        return {
          success: false,
          message: "User does not exists.Sign Up first.",
        };

      const isPasswordValid = await bcrypt.compare(
        data.password,
        user.password
      );
      if (!isPasswordValid)
        return { success: false, message: "Invalid email or password" };

      const token = jwt.sign(
        { userId: user.id },
        process.env.USER_JWT_SECRET as string,
        { expiresIn: "24h" }
      );

      return {
        success: true,
        message: "Login successful",
        data: {
          token,
          user: { id: user.id, name: user.name, email: user.email },
        },
      };
    } catch (error) {
      const err = error as Error;
      return { success: false, message: "Login error", error: err.message };
    }
  }

  static async getRooms(
    userId: string
  ): Promise<ServiceResponse<{ rooms: any[] }>> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          rooms: {
            where: { isDeleted: false },
            omit: { isDeleted: true, adminId: true },
          },
        },
      });
      if (!user) return { success: false, message: "User not found" };

      return {
        success: true,
        message: "Rooms fetched successfully",
        data: { rooms: user.rooms },
      };
    } catch (error) {
      const err = error as Error;
      return {
        success: false,
        message: "Error fetching rooms",
        error: err.message,
      };
    }
  }
}
