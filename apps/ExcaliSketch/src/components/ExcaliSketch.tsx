// src/components/ExcaliSketch.tsx
"use client";
import { wsData } from "@/models/wsData";
import React, { use, useEffect, useReducer, useRef, useState } from "react";
import { Shape, Tool } from "../models/shape";
import Toolbar from "./Toolbar";
import Canvas from "./Canvas";
import TextInputOverlay from "./TextInputOverlay";
import {
  getBoundingBox,
  getRotationHandle,
  getResizeHandleAtPoint,
  getBendHandle,
  inverseRotatePoint,
} from "../utils/canvasUtils";
import { useSocket } from "../hooks/useSocket";
import { getCursorStyle } from "@/lib/utils";
import { useAuth } from "@/lib/auth";
import { routeModule } from "next/dist/build/templates/pages";
import { useRouter } from "next/navigation";
import axios from "axios";
import { BACKEND_URL } from "@/app/config";
const ExcaliSketch: React.FC<{ roomId: number }> = ({ roomId }) => {
  // App state
  const { token, setToken } = useAuth();
  const router = useRouter();
  const [isTextEditing, setIsTextEditing] = useState(false);
  const [textContent, setTextContent] = useState("");
  const [textPosition, setTextPosition] = useState({ x: 0, y: 0 });
  const [tempRotation, setTempRotation] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { socket, loading, setLoading } = useSocket();
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [currentShape, setCurrentShape] = useState<Shape | null>(null);
  const [tool, setTool] = useState<Tool>("select");
  const [color, setColor] = useState("#D3D3D3");
  const [selectedShape, setSelectedShape] = useState<number | null>(null);
  // Editing state
  const [isDrawing, setIsDrawing] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const [moveOffset, setMoveOffset] = useState<{
    offsetX: number;
    offsetY: number;
  } | null>(null);
  const [lockMode, setLockMode] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeHandle, setResizeHandle] = useState<
    "tl" | "tr" | "bl" | "br" | null
  >(null);
  const [isRotating, setIsRotating] = useState(false);
  const [rotationStartAngle, setRotationStartAngle] = useState(0);
  const [rotationInitial, setRotationInitial] = useState(0);
  const [isBending, setIsBending] = useState(false);
  const isManualUpdate = useRef<boolean>(false);
  const sendToDB = useRef<boolean>(false);
  // Text input overlay state
  const [textInputData, setTextInputData] = useState<{
    x: number;
    y: number;
    value: string;
    shapeId: number;
  } | null>(null);
  const [textEditing, setTextEditing] = useState<{
    active: boolean;
    x: number;
    y: number;
    text: string;
  }>({ active: false, x: 0, y: 0, text: "" });

  const shapesRef = useRef<Shape[]>(shapes);
  const currentShapeRef = useRef<Shape | null>(currentShape);

  useEffect(() => {
    let data: string[] = [];
    async function getShapesFroDB() {
      try {
        setLoading(true);
        const url = `${BACKEND_URL}/room/${roomId}`;
        const res = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        });

        data = res.data;

        if (!data || data.length == 0) {
          return;
        }

        const newshapes: Shape[] = [];
        data.forEach((s) => {
          newshapes.push(JSON.parse(s));
        });
        setShapes(newshapes);
        setLoading(false);
      } catch (e: any) {
        setLoading(false);
        if (e.status == 404) {
          router.push("/dashboard");
          alert("Room does not exists");
        }
        if (e.status == 400) {
          router.push("/dashboard");
          alert("Invalid Room Id");
        }
      }
    }
    getShapesFroDB();
  }, []);

  useEffect(() => {
    const hasReloaded = sessionStorage.getItem("hasReloaded");

    if (hasReloaded == "false") {
      sessionStorage.setItem("hasReloaded", "true");
      window.location.reload();
    }
  }, []);

  useEffect(() => {
    const eventHandler = (e: KeyboardEvent) => {
      const key = e.key;
      switch (key) {
        case "0":
          break;
        case "1":
          setTool("select");
          break;
        case "2":
          setTool("rectangle");

          break;
        case "3":
          setTool("diamond");
          break;
        case "4":
          setTool("ellipse");
          break;
        case "5":
          setTool("arrow");
          break;
        case "6":
          setTool("line");
          break;
        case "7":
          setTool("draw");
          break;
        case "8":
          setTool("text");
          break;
        case "9":
          setTool("eraser");
          break;
        default:
      }
    };

    window.addEventListener("keydown", eventHandler);

    return () => {
      window.removeEventListener("keydown", eventHandler);
    };
  }, []);

  useEffect(() => {
    if (token == null) {
      router.push("/auth/sign-in");
    }
  }, [token, setToken]);

  useEffect(() => {
    if (!loading && socket) {
      const data = { type: "join_room", roomId: roomId };
      socket?.send(JSON.stringify(data));
      socket.onmessage = (e) => {
        const data = e.data;
        const parsedData = JSON.parse(e.data);

        if (parsedData.message != null) {
          setShapes(JSON.parse(parsedData.message));
        }
      };
    }
  }, [loading, socket]);

  useEffect(() => {
    shapesRef.current = shapes;
  }, [shapes]);

  useEffect(() => {
    currentShapeRef.current = currentShape;
  }, [currentShape]);

  useEffect(() => {
    if (isManualUpdate.current) {
      sendMessage();
      isManualUpdate.current = false;
    }
  }, [shapes]);

  async function sendMessage() {
    if (!loading && socket) {
      const temp: wsData = {
        type: "message",
        message: JSON.stringify(shapes),
        roomId: roomId,
      };
      temp.db = sendToDB.current;

      sendToDB.current = false;
      socket.send(JSON.stringify(temp));
    }
  }

  // useEffect(() => {
  //   localStorage.setItem("shapes", JSON.stringify(shapes));
  // }, [shapes]);

  const getMousePos = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = e.currentTarget;
    const rect = canvas.getBoundingClientRect();

    // Get actual rendered dimensions
    const cssWidth = rect.width;
    const cssHeight = rect.height;

    // Set canvas resolution to match display size
    if (canvas.width !== cssWidth) canvas.width = cssWidth;
    if (canvas.height !== cssHeight) canvas.height = cssHeight;

    // Calculate scale factors
    const scaleX = canvas.width / cssWidth;
    const scaleY = canvas.height / cssHeight;

    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const commitText = (ctx: CanvasRenderingContext2D) => {
    // Define the font size & family
    const fontSize = 30;
    const fontFamily = "'Comic Sans MS', cursive"; // Example font
    ctx.font = `${fontSize}px ${fontFamily}`;

    // Measure text width based on the font
    const textMetrics = ctx.measureText(textContent);
    const textWidth = textMetrics.width;

    // Approximate text height using font size (adjust multiplier if needed)
    const textHeight = fontSize * 1.2; // Factor accounts for font descenders

    const newShape: Shape = {
      id: Date.now(),
      type: "text",
      color,
      startX: textPosition.x,
      startY: textPosition.y,
      endX: textPosition.x + textWidth,
      endY: textPosition.y + textHeight,
      rotation: tempRotation,
      text: textContent,
    };

    isManualUpdate.current = true;
    setShapes((s) => [...s, newShape]);

    setIsTextEditing(false);
  };

  const [textActive, setTextActive] = useState(false);

  // New activation handler
  const activateTextMode = () => {
    setTextActive(true);
    setTool("text");
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const { x, y } = getMousePos(e);
    if (tool === "text") {
      setIsTextEditing(true);
      setTextPosition({ x, y });
      setTextContent("");
      setTool("select");
      return;
    }
    if (tool === "eraser") {
      setIsDrawing(true);
      sendToDB.current = true;
      setShapes((prevShapes) =>
        prevShapes.filter((shape) => {
          const bbox = getBoundingBox(shape);

          return !(
            x >= bbox.left &&
            x <= bbox.right &&
            y >= bbox.top &&
            y <= bbox.bottom
          );
        })
      );
      return;
    }

    if (tool === "select") {
      if (selectedShape !== null) {
        const shape = shapes.find((s) => s.id === selectedShape);
        if (shape) {
          const rotHandle = getRotationHandle(shape);
          if (Math.hypot(x - rotHandle.x, y - rotHandle.y) < 10) {
            setIsRotating(true);
            setRotationInitial(shape.rotation || 0);
            const bbox = getBoundingBox(shape);
            const center = {
              x: (bbox.left + bbox.right) / 2,
              y: (bbox.top + bbox.bottom) / 2,
            };
            setRotationStartAngle(Math.atan2(y - center.y, x - center.x));
            return;
          }
          const rHandle = getResizeHandleAtPoint(x, y, shape);
          if (rHandle) {
            setResizeHandle(rHandle);
            setIsResizing(true);
            return;
          }
          if (shape.type === "line") {
            const bendHandle = getBendHandle(shape);
            if (Math.hypot(x - bendHandle.x, y - bendHandle.y) < 10) {
              setIsBending(true);
              return;
            }
          }
          const bbox = getBoundingBox(shape);
          const center = {
            x: (bbox.left + bbox.right) / 2,
            y: (bbox.top + bbox.bottom) / 2,
          };
          if (
            x >= bbox.left &&
            x <= bbox.right &&
            y >= bbox.top &&
            y <= bbox.bottom
          ) {
            setIsMoving(true);
            setMoveOffset({ offsetX: x - center.x, offsetY: y - center.y });
            return;
          }
        }
      }
      const clickedShape = shapes
        .slice()
        .reverse()
        .find((shape) => {
          const bbox = getBoundingBox(shape);
          return (
            x >= bbox.left &&
            x <= bbox.right &&
            y >= bbox.top &&
            y <= bbox.bottom
          );
        });
      if (clickedShape) {
        setSelectedShape(clickedShape.id);
        const bbox = getBoundingBox(clickedShape);
        const center = {
          x: (bbox.left + bbox.right) / 2,
          y: (bbox.top + bbox.bottom) / 2,
        };
        setIsMoving(true);
        setMoveOffset({ offsetX: x - center.x, offsetY: y - center.y });
      } else {
        setSelectedShape(null);
      }
    } else {
      setIsDrawing(true);
      setSelectedShape(null);
      if (tool === "draw") {
        setCurrentShape({
          id: Date.now(),
          type: "draw",
          color,
          startX: x,
          startY: y,
          endX: x,
          endY: y,
          path: [{ x, y }],
        });
      } else {
        setCurrentShape({
          id: Date.now(),
          type: tool as
            | "rectangle"
            | "ellipse"
            | "line"
            | "text"
            | "arrow"
            | "diamond",
          color,
          startX: x,
          startY: y,
          endX: x,
          endY: y,
          rotation: 0,
        });
      }
    }
  };

  const sendDirectUpdate = (tempShapes: (Shape | null)[]) => {
    if (!socket || loading) return;

    socket.send(
      JSON.stringify({
        type: "message",
        message: JSON.stringify(tempShapes),
        roomId,
      })
    );
  };
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const { x, y } = getMousePos(e);

    if (tool === "eraser" && isDrawing) {
      sendToDB.current = true;
      isManualUpdate.current = true;
      setShapes((prevShapes) =>
        prevShapes.filter((shape) => {
          const bbox = getBoundingBox(shape);
          return !(
            x >= bbox.left &&
            x <= bbox.right &&
            y >= bbox.top &&
            y <= bbox.bottom
          );
        })
      );
      return;
    }

    if (isRotating && selectedShape !== null) {
      isManualUpdate.current = true;
      setShapes((prev) =>
        prev.map((shape) =>
          shape.id === selectedShape
            ? {
                ...shape,
                rotation:
                  rotationInitial +
                  (Math.atan2(
                    y -
                      (getBoundingBox(shape).top +
                        getBoundingBox(shape).bottom) /
                        2,
                    x -
                      (getBoundingBox(shape).left +
                        getBoundingBox(shape).right) /
                        2
                  ) -
                    rotationStartAngle),
              }
            : shape
        )
      );
      return;
    }
    if (isResizing && selectedShape !== null && resizeHandle) {
      isManualUpdate.current = true;
      setShapes((prev) =>
        prev.map((shape) => {
          if (shape.id === selectedShape) {
            // If the shape is rotated, handle resizing in the shape’s local space.
            if (shape.rotation) {
              const localTopLeft = {
                x: Math.min(shape.startX, shape.endX),
                y: Math.min(shape.startY, shape.endY),
              };
              const localBottomRight = {
                x: Math.max(shape.startX, shape.endX),
                y: Math.max(shape.startY, shape.endY),
              };
              const center = {
                x: (localTopLeft.x + localBottomRight.x) / 2,
                y: (localTopLeft.y + localBottomRight.y) / 2,
              };
              // Convert mouse position to local space.
              const localMouse = inverseRotatePoint(
                { x, y },
                center,
                shape.rotation
              );
              let newLocalTopLeft = { ...localTopLeft };
              let newLocalBottomRight = { ...localBottomRight };

              if (resizeHandle === "tl") {
                newLocalTopLeft = { x: localMouse.x, y: localMouse.y };
              } else if (resizeHandle === "tr") {
                newLocalTopLeft.y = localMouse.y;
                newLocalBottomRight.x = localMouse.x;
              } else if (resizeHandle === "bl") {
                newLocalTopLeft.x = localMouse.x;
                newLocalBottomRight.y = localMouse.y;
              } else if (resizeHandle === "br") {
                newLocalBottomRight = { x: localMouse.x, y: localMouse.y };
              }

              // Normalize local coordinates:
              const finalLocalMinX = Math.min(
                newLocalTopLeft.x,
                newLocalBottomRight.x
              );
              const finalLocalMinY = Math.min(
                newLocalTopLeft.y,
                newLocalBottomRight.y
              );
              const finalLocalMaxX = Math.max(
                newLocalTopLeft.x,
                newLocalBottomRight.x
              );
              const finalLocalMaxY = Math.max(
                newLocalTopLeft.y,
                newLocalBottomRight.y
              );
              newLocalTopLeft = { x: finalLocalMinX, y: finalLocalMinY };
              newLocalBottomRight = { x: finalLocalMaxX, y: finalLocalMaxY };

              return {
                ...shape,
                startX: newLocalTopLeft.x,
                startY: newLocalTopLeft.y,
                endX: newLocalBottomRight.x,
                endY: newLocalBottomRight.y,
              };
            } else {
              // For non-rotated shapes, update the coordinate according to the active handle.
              let newShape = { ...shape };
              if (resizeHandle === "tl") {
                newShape.startX = x;
                newShape.startY = y;
              } else if (resizeHandle === "tr") {
                newShape.endX = x;
                newShape.startY = y;
              } else if (resizeHandle === "bl") {
                newShape.startX = x;
                newShape.endY = y;
              } else if (resizeHandle === "br") {
                newShape.endX = x;
                newShape.endY = y;
              }

              // Normalize coordinates so that start is top-left and end is bottom-right.
              const finalMinX = Math.min(newShape.startX, newShape.endX);
              const finalMinY = Math.min(newShape.startY, newShape.endY);
              const finalMaxX = Math.max(newShape.startX, newShape.endX);
              const finalMaxY = Math.max(newShape.startY, newShape.endY);
              newShape.startX = finalMinX;
              newShape.startY = finalMinY;
              newShape.endX = finalMaxX;
              newShape.endY = finalMaxY;

              return newShape;
            }
          }
          return shape;
        })
      );
      return;
    }

    if (isBending && selectedShape !== null) {
      isManualUpdate.current = true;
      setShapes((prev) =>
        prev.map((shape) =>
          shape.id === selectedShape && shape.type === "line"
            ? { ...shape, controlX: x, controlY: y }
            : shape
        )
      );
      return;
    }
    if (isMoving && selectedShape !== null && moveOffset) {
      isManualUpdate.current = true;
      setShapes((prev) =>
        prev.map((shape) => {
          if (shape.id === selectedShape) {
            const bbox = getBoundingBox(shape);
            const oldCenter = {
              x: (bbox.left + bbox.right) / 2,
              y: (bbox.top + bbox.bottom) / 2,
            };
            const newCenter = {
              x: x - moveOffset.offsetX,
              y: y - moveOffset.offsetY,
            };
            const deltaX = newCenter.x - oldCenter.x;
            const deltaY = newCenter.y - oldCenter.y;
            const updatedShape: Shape = {
              ...shape,
              startX: shape.startX + deltaX,
              startY: shape.startY + deltaY,
              endX: shape.endX + deltaX,
              endY: shape.endY + deltaY,
            };
            if (
              shape.type === "line" &&
              shape.controlX !== undefined &&
              shape.controlY !== undefined
            ) {
              updatedShape.controlX = shape.controlX + deltaX;
              updatedShape.controlY = shape.controlY + deltaY;
            }
            return updatedShape;
          }
          return shape;
        })
      );
      return;
    }
    if (isDrawing && currentShape) {
      if (tool === "draw" && currentShape.path) {
        setCurrentShape((prev) =>
          prev
            ? {
                ...prev,
                endX: x,
                endY: y,
                path: [...(prev.path || []), { x, y }],
              }
            : null
        );
      } else {
        setCurrentShape((prev) =>
          prev ? { ...prev, endX: x, endY: y } : null
        );
      }

      const tempShapes: (Shape | null)[] = [
        ...shapesRef.current,
        currentShapeRef.current,
      ];

      sendDirectUpdate(tempShapes);
    }
  };

  const handleMouseUp = () => {
    if (isDrawing && currentShape) {
      setShapes((prev) => [...prev, currentShape]);
      sendToDB.current = true;
      isManualUpdate.current = true;
      setCurrentShape(null);
      if (!lockMode && tool != "eraser" && tool != "draw") {
        setTool("select");
      }
    }

    // Reset interaction flags
    setIsDrawing(false);
    setIsMoving(false);
    setIsResizing(false);
    setIsRotating(false);
    setIsBending(false);
    setResizeHandle(null);
    setMoveOffset(null);
  };

  const clearShapes = () => {
    sendToDB.current = true;
    isManualUpdate.current = true;
    setShapes([]);
  };

  return (
    <>
      {loading ? (
        <div className="min-h-screen flex items-center justify-center ">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary border-black"></div>
        </div>
      ) : (
        <div
          className="relative w-screen h-screen bg-neutral-900"
          style={{ cursor: getCursorStyle(tool) }}
        >
          <Toolbar
            lockMode={lockMode}
            setLockMode={setLockMode}
            tool={tool}
            setTool={setTool}
            color={color}
            activateText={activateTextMode}
            setColor={setColor}
            clear={clearShapes}
          />
          <Canvas
            ref={canvasRef}
            shapes={shapes}
            currentShape={currentShape}
            selectedShape={selectedShape}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            cursor="text"
            x={textPosition.x}
            y={textPosition.y}
            text={textContent}
            onChange={setTextContent}
            onCommit={commitText}
            color={color}
            isTextEditing={isTextEditing}
          />
        </div>
      )}
    </>
  );
};

export default ExcaliSketch;
