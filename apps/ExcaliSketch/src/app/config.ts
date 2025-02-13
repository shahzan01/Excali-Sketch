import dotenv from "dotenv";
import path from "path";
dotenv.config({
  path: path.resolve(__dirname, ".env"),
});
export const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:5000";
export const WS_URL = process.env.WS_URL || "ws://localhost:8000";
