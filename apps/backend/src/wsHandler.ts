import { WebSocketServer, WebSocket } from "ws";
import jwt from "jsonwebtoken";

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import dotenv from "dotenv";

dotenv.config();

interface DecodedToken {
  userId: string;
  exp?: number;
}

interface Data {
  type: "message" | "join_room" | "leave_room" | "auth";
  roomId: number;
  message?: string;
  db?: boolean;
}
const TOKEN_AUTH_TIMEOUT = 5000;

function checkUser(token: string): string | null {
  try {
    const decoded = jwt.verify(
      token,
      process.env.USER_JWT_SECRET as string
    ) as { userId: string };
    return decoded?.userId ?? null;
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      console.error(`JWT Error: ${error.message}`); // Log the error message
    } else {
      console.error("JWT verification failed:", error);
    }
    return null;
  }
}

function getToken(url: string): string | undefined {
  try {
    const queryParams = new URLSearchParams(url.split("?")[1]);
    return queryParams.get("token") ?? undefined;
  } catch (error) {
    console.error("Failed to parse token from URL:", error);
    return undefined;
  }
}

function joinRoom(socket: WebSocket, userId: string, roomId: number): boolean {
  try {
    const existingUsers = roomMap.get(roomId) || [];
    if (
      existingUsers.some(
        (user) => user.userId === userId && user.socket === socket
      )
    ) {
      socket.send(JSON.stringify({ msg: `You are already in room ${roomId}` }));
      return false;
    }

    // Join the room
    const roomUsers = roomMap.get(roomId) || [];
    roomUsers.push({ userId, socket });
    roomMap.set(roomId, roomUsers);

    // Update the user map
    const userSockets = userMap.get(userId) || new Set<WebSocket>();
    userSockets.add(socket); // Add the current socket to the user's set
    userMap.set(userId, userSockets);

    socket.send(JSON.stringify({ msg: `Joined room ${roomId} successfully.` }));

    return true;
  } catch (error) {
    console.error("Error in joinRoom:", error);
    socket.send(JSON.stringify({ msg: "Error while joining room." }));
    return false;
  }
}

function leaveRoom(socket: WebSocket, userId: string, roomId: number): boolean {
  try {
    const roomUsers = roomMap.get(roomId) || [];
    const updatedRoomUsers = roomUsers.filter((user) => user.socket !== socket);

    if (updatedRoomUsers.length === roomUsers.length) {
      socket.send(JSON.stringify({ msg: `You are not in room ${roomId}` }));
      return false;
    }

    roomMap.set(roomId, updatedRoomUsers);

    // Update the user map
    const userSockets = userMap.get(userId);
    if (userSockets) {
      userSockets.delete(socket);
      if (userSockets.size === 0) {
        userMap.delete(userId);
      } else {
        userMap.set(userId, userSockets);
      }
    }
    socket.send(JSON.stringify({ msg: `Left room ${roomId} successfully.` }));
    return true;
  } catch (error) {
    console.error("Error in leaveRoom:", error);
    socket.send(JSON.stringify({ msg: "Error while leaving room." }));
    return false;
  }
}

async function sendMessageToRoom(
  roomId: number,
  userId: string,
  message: string,
  socket: WebSocket
): Promise<void> {
  try {
    const roomUsers = roomMap.get(roomId);
    roomUsers?.forEach((user) => {
      if (user.socket != socket) {
        const data = { message: message };
        user.socket.send(JSON.stringify(data));
      }
    });
  } catch (error) {
    console.error("Error in sendMessageToRoom:", error);
  }
}

async function sendStateToDB(roomId: number, message: string) {
  try {
    const roomstate: string[] = [];
    const data: string[] = JSON.parse(message);

    data.forEach((s) => {
      roomstate.push(JSON.stringify(s));
    });

    const res = await prisma.roomState.upsert({
      where: { roomId: roomId },
      create: { shapes: roomstate, roomId: roomId },
      update: { shapes: roomstate },
    });
  } catch (e) {
    console.error(e);
  }
}
// Map for rooms to their users (roomId -> [{email, socket}, ...])
const roomMap: Map<number, { userId: string; socket: WebSocket }[]> = new Map();

// Map for users to the sockets they are connected from (email -> Set<WebSocket>)
const userMap: Map<string, Set<WebSocket>> = new Map();
export const initWebSocket = (server: any): void => {
  const wss = new WebSocketServer({ server });

  wss.on("connection", (socket, req) => {
    let isAuthenticated = false;
    let userId: string | null = null;
    let currentRoomId: number | null = null;

    const authTimeout = setTimeout(() => {
      if (!isAuthenticated) {
        socket.send(JSON.stringify({ error: "Authentication timeout" }));
        socket.close();
      }
    }, TOKEN_AUTH_TIMEOUT);

    socket.once("message", (message) => {
      try {
        const authData = JSON.parse(message.toString());

        if (authData.type !== "auth" || !authData.token) {
          socket.send(
            JSON.stringify({ error: "Invalid authentication message" })
          );
          return socket.close();
        }

        const userId = checkUser(authData.token);
        if (!userId) {
          socket.send(JSON.stringify({ error: "Invalid or expired token" }));
          return socket.close();
        }

        isAuthenticated = true;
        clearTimeout(authTimeout);
        socket.send(
          JSON.stringify({ msg: "Authenticated successfully", userId })
        );

        socket.on("message", (msg) => {
          try {
            const data: Data = JSON.parse(msg.toString());

            if (data.type === "join_room" && data.roomId) {
              const success = joinRoom(socket, userId!, data.roomId);
              if (success) {
                currentRoomId = data.roomId;
              }
            } else if (data.type === "leave_room") {
              if (currentRoomId !== null) {
                leaveRoom(socket, userId!, currentRoomId);
                currentRoomId = null; // Reset current room
              } else {
                socket.send(
                  JSON.stringify({ msg: "You are not in any room." })
                );
              }
            } else if (data.type === "message") {
              if (
                currentRoomId === null ||
                !userMap.get(userId!)?.has(socket)
              ) {
                socket.send(JSON.stringify({ msg: "Room not joined." }));
                return;
              }

              sendMessageToRoom(
                currentRoomId,
                userId!,
                data.message || "",
                socket
              );

              if (data.db === true) {
                sendStateToDB(currentRoomId, data.message || "");
              }
            } else {
              socket.send(JSON.stringify({ msg: "Invalid message type." }));
            }
          } catch (error) {
            console.error("Error while parsing message:", error);
            socket.send(
              JSON.stringify({ msg: "Error while processing the message." })
            );
          }
        });
      } catch (error) {
        console.error("Error processing authentication message:", error);
        socket.send(
          JSON.stringify({ error: "Error processing authentication" })
        );
        return socket.close();
      }
    });

    socket.on("close", () => {
      try {
        if (currentRoomId !== null && userId != null) {
          leaveRoom(socket, userId, currentRoomId);
        }
      } catch (error) {
        console.error("Error during socket close:", error);
      }
    });

    socket.on("error", (err) => {
      console.error("Socket error:", err);
      try {
        if (currentRoomId !== null && userId != null) {
          leaveRoom(socket, userId, currentRoomId);
        }
      } catch (error) {
        console.error("Error during socket error handling:", error);
      }
    });
  });

  const shutdown = () => {
    console.log("Shutting down WebSocket server...");
    wss.close(() => {
      console.log("WebSocket server closed");
      process.exit(0);
    });
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
};
