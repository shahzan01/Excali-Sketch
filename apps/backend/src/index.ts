import "./types/express-augmentations";
import express, { Request, Response } from "express";
import { createServer } from "http";
import cors from "cors";
import userRoutes from "./routes/userRoutes";
import roomRoutes from "./routes/roomRoutes";
import { initWebSocket } from "./wsHandler";
import morgan from "morgan";
import path from "path";
const rfs = require("rotating-file-stream");

const app = express();

//logs
const logDir = path.join(__dirname, "logs");

const logStream = rfs.createStream("requestLogs.log", {
  interval: "1d",
  path: logDir,
});
app.use(morgan("common", { stream: logStream }));

//cors
const allowedOrigins = [
  "https://excali-sketch-frontend.vercel.app",
  "http://localhost:3000",
];
app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        "https://excali-sketch-frontend.vercel.app",
        "http://localhost:3000",
      ];
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ msg: "hello there" });
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
