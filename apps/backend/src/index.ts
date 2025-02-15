import "./types/express-augmentations";
import express, { Request, Response } from "express";
import { createServer } from "http";
import cors from "cors";
import userRoutes from "./routes/userRoutes";
import roomRoutes from "./routes/roomRoutes";
import { initWebSocket } from "./wsHandler";

const app = express();

const allowedOrigins = [
  "https://excali-sketch-frontend.vercel.app",
  "http://localhost:3000", // For local development
];
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  })
);
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.json({ msg: "hello there" });
});

app.use("/user", userRoutes);
app.use("/room", roomRoutes);

const PORT: number = parseInt(process.env.PORT ?? "5000", 10);
const server = createServer(app);

// Initialize the WebSocket logic on the shared HTTP server
initWebSocket(server);

server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
