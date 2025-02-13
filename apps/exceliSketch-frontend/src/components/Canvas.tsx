// src/components/Canvas.tsx
"use client";
import React, { useRef, useEffect } from "react";
import { Shape } from "../models/shape";
import { drawCurrentShape, drawExistingShapes } from "../utils/drawUtils";
import TextInputOverlay from "./TextInputOverlay";

interface CanvasProps {
  color: string;
  ref?: React.Ref<HTMLCanvasElement>;
  shapes: Shape[];
  currentShape: Shape | null;
  selectedShape: number | null;
  onMouseDown: React.MouseEventHandler<HTMLCanvasElement>;
  onMouseMove: React.MouseEventHandler<HTMLCanvasElement>;
  onMouseUp: React.MouseEventHandler<HTMLCanvasElement>;
  cursor?: string;
  x: number;
  y: number;
  text: string;
  onChange: (value: string) => void;
  onCommit: (ctx: CanvasRenderingContext2D) => void;
  isTextEditing: boolean;
}

const Canvas: React.FC<CanvasProps> = ({
  color,
  ref,
  shapes,
  currentShape,
  selectedShape,
  onMouseDown,
  onMouseMove,
  onMouseUp,
  x,
  y,
  text,
  onChange,
  onCommit,
  isTextEditing,
  cursor = "default",
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const internalRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (ref) {
      if (typeof ref === "function") {
        ref(internalRef.current);
      } else {
        (ref as React.MutableRefObject<HTMLCanvasElement>).current =
          internalRef.current!;
      }
    }
  }, []);

  const updateCanvasSize = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const width = window.innerWidth;
    const height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    draw(); // Redraw after updating the canvas size.
  };

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear the canvas.
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // IMPORTANT: Draw existing shapes first...
    drawExistingShapes(ctx, shapes, selectedShape);

    // ...and then draw the current shape on top.

    drawCurrentShape(ctx, currentShape);
  };

  function handleCommit() {
    const ctx = canvasRef.current?.getContext("2d") as CanvasRenderingContext2D;
    onCommit(ctx);
  }
  // Update canvas size (and redraw) when any of these change.
  useEffect(() => {
    updateCanvasSize();
    window.addEventListener("resize", updateCanvasSize);
    return () => window.removeEventListener("resize", updateCanvasSize);
  }, [shapes, currentShape, selectedShape]);

  // Whenever shapes, currentShape, or selectedShape change, redraw the canvas.
  useEffect(() => {
    draw();
  }, [shapes, currentShape, selectedShape]);

  return (
    <div>
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full z-10"
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
      />
      {isTextEditing && (
        <TextInputOverlay
          x={x}
          y={y}
          text={text}
          onChange={onChange}
          onCommit={handleCommit}
          canvasElement={canvasRef.current}
          color={color}
        />
      )}
    </div>
  );
};

export default Canvas;
