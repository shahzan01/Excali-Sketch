import dotenv from "dotenv";
import path from "path";
dotenv.config({
  path: path.resolve(__dirname, ".env"),
});
export const BACKEND_URL =
  process.env.BACKEND_URL || "https://excali-sketch-api.onrender.com";
export const WS_URL =
  process.env.WS_URL || "https://excali-sketch-api.onrender.com";
