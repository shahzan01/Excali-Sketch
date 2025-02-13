import { Request, Response } from "express";
import { roomServices } from "../services/roomService";
export class roomControler {
  static async create(req: Request, res: Response) {
    const slug = req.params.slug;
    if (!slug) {
      throw new Error("Invalid room Id");
    }
    try {
      if (!req.user?.userId) {
        throw new Error("Invalid user Id");
      }
      const data = { slug: slug, userId: req.user?.userId };

      const room = await roomServices.create(data);
      res
        .status(200)
        .json({ msg: `Room created sucessfully ${room.id}`, room: room });
    } catch (e) {
      res.status(400).json({ error: e });
    }
  }

  static async join(req: Request, res: Response) {
    const slug = req.params.slug;
    if (!slug) {
      throw new Error("Invalid room Id");
    }
    try {
      const data = { slug: slug };
      const room = await roomServices.join(data);
      res.status(200).json({
        msg: `Room joined sucessfully ${room.id}`,
        room: { id: room.id, slug: room.slug },
      });
    } catch (e) {
      if (e instanceof Error) {
        res.status(400).json({ error: e.message });
      } else {
        res.status(400).json({ error: "An unknown error occurred" });
      }
    }
  }
  static async getChats(req: Request, res: Response) {
    try {
      const roomId = req.params.roomId;
      if (!roomId || !isParsableNumber(roomId)) {
        res.status(400).json({ error: "Invalid room Id" });
        return;
      }
      const data = { roomId: parseInt(roomId) };
      const chats = (await roomServices.getChats(data)) as any;

      if (chats.msg === "Room not Found") {
        res.status(404).json({ error: "Room not Found" });
        return;
      }
      res.status(200).json(chats.chats);
    } catch (e) {
      console.error(e);
    }
  }
  static async delete(req: Request, res: Response) {
    const roomId = req.params.roomId;
    if (!roomId) {
      throw new Error("Invalid RoomId");
    }
    const data = {
      roomId: parseInt(roomId),
      admin: req.user?.userId as string,
    };
    const response = (await roomServices.delete(data)) as any;
    if (response.msg === "Room not found ") {
      res.status(404).json(response);
      return;
    }
    res.status(200).json(response);
  }
}

function isParsableNumber(str: string): boolean {
  return !isNaN(Number(str)) && str.trim() !== "";
}
