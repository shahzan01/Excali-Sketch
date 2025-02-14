import dotenv from "dotenv";
import path from "path";

dotenv.config();

export const BACKEND_URL =
  (process.env.NEXT_PUBLIC_BACKEND_URL as string) || "http://localhost:5000";
export const WS_URL =
  (process.env.NEXT_PUBLIC_BACKEND_URL as string) || "http://localhost:5000";
