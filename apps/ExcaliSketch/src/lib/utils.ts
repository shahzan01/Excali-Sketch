import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import { Tool } from "@/models/shape";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// This function maps the current tool to a CSS cursor style.
const eraserCursor =
  "url(\"data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20width='10'%20height='10'%20viewBox='0%200%2032%2032'%3E%3Ccircle%20cx='16'%20cy='16'%20r='15'%20fill='none'%20stroke='white'%20stroke-width='4'/%3E%3C/svg%3E\") 16 16, auto";
export const getCursorStyle = (tool: Tool): string => {
  switch (tool) {
    case "select":
      return "default"; // or "pointer" if you prefer
    case "draw":
    case "rectangle":
    case "ellipse":
    case "line":
    case "diamond":
    case "arrow":
      return "crosshair";
    case "text":
      return "text";
    case "eraser":
      return eraserCursor;
    default:
      return "default";
  }
};
