import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export class UserService {
  static async signup(data: { name: string; email: string; password: string }) {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const newUser = await prisma.user.create({
      data: { name: data.name, email: data.email, password: hashedPassword },
    });
    return newUser;
  }

  static async login(data: { name: string; email: string; password: string }) {
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });
    if (!user) {
      throw new Error("Invalid credentials");
    }
    const verifyPassword = await bcrypt.compare(data.password, user?.password);
    if (!verifyPassword) {
      throw new Error("Invalid credentials");
    }

    const token = jwt.sign(
      { userId: user.id },
      process.env.USER_JWT_SECRET as string,
      {
        expiresIn: "24h",
      }
    );

    return token;
  }

  static async getRooms(data: { userId: string }) {
    const userdata = await prisma.user.findUnique({
      where: { id: data.userId },
      include: { rooms: true },
    });
    if (!userdata) {
      throw new Error("Invalid credentials");
    }
    return userdata.rooms;
  }
}
