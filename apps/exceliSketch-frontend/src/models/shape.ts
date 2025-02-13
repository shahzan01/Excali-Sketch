// src/models/Shape.ts
export type Tool =
  | "select"
  | "rectangle"
  | "ellipse"
  | "line"
  | "draw"
  | "text"
  | "arrow"
  | "eraser"
  | "diamond";

export interface Shape {
  id: number;
  type:
    | "rectangle"
    | "ellipse"
    | "line"
    | "draw"
    | "text"
    | "arrow"
    | "diamond";
  color: string;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  rotation?: number; // in radians
  controlX?: number; // for line bending
  controlY?: number;
  path?: { x: number; y: number }[]; // for draw drawing
  text?: string; // for text shapes
}
