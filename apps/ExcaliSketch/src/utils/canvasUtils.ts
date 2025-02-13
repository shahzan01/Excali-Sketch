// src/utils/canvasUtils.ts
import { Shape } from "../models/shape";

export const rotatePoint = (
  point: { x: number; y: number },
  center: { x: number; y: number },
  angle: number
) => {
  const dx = point.x - center.x;
  const dy = point.y - center.y;
  return {
    x: center.x + dx * Math.cos(angle) - dy * Math.sin(angle),
    y: center.y + dx * Math.sin(angle) + dy * Math.cos(angle),
  };
};

export const inverseRotatePoint = (
  point: { x: number; y: number },
  center: { x: number; y: number },
  angle: number
) => {
  const dx = point.x - center.x;
  const dy = point.y - center.y;
  return {
    x: center.x + dx * Math.cos(angle) + dy * Math.sin(angle),
    y: center.y - dx * Math.sin(angle) + dy * Math.cos(angle),
  };
};

export const getBoundingBox = (shape: Shape) => {
  if (shape.type === "text") {
    const width =
      shape.endX !== shape.startX ? Math.abs(shape.endX - shape.startX) : 200;
    const height =
      shape.endY !== shape.startY ? Math.abs(shape.endY - shape.startY) : 40;
    return {
      left: shape.startX,
      top: shape.startY,
      right: shape.startX + width,
      bottom: shape.startY + height,
    };
  }
  const left = Math.min(shape.startX, shape.endX);
  const right = Math.max(shape.startX, shape.endX);
  const top = Math.min(shape.startY, shape.endY);
  const bottom = Math.max(shape.startY, shape.endY);
  return { left, top, right, bottom };
};

export const getRotatedCorners = (shape: Shape) => {
  const bbox = getBoundingBox(shape);
  const center = {
    x: (bbox.left + bbox.right) / 2,
    y: (bbox.top + bbox.bottom) / 2,
  };
  return {
    tl: rotatePoint({ x: bbox.left, y: bbox.top }, center, shape.rotation || 0),
    tr: rotatePoint(
      { x: bbox.right, y: bbox.top },
      center,
      shape.rotation || 0
    ),
    bl: rotatePoint(
      { x: bbox.left, y: bbox.bottom },
      center,
      shape.rotation || 0
    ),
    br: rotatePoint(
      { x: bbox.right, y: bbox.bottom },
      center,
      shape.rotation || 0
    ),
  };
};

export const getResizeHandleAtPoint = (
  x: number,
  y: number,
  shape: Shape
): "tl" | "tr" | "bl" | "br" | null => {
  const threshold = 6;
  if (shape.rotation) {
    const corners = getRotatedCorners(shape);
    for (const key in corners) {
      const corner = corners[key as "tl" | "tr" | "bl" | "br"];
      if (Math.hypot(x - corner.x, y - corner.y) < threshold) {
        return key as "tl" | "tr" | "bl" | "br";
      }
    }
    return null;
  } else {
    const bbox = getBoundingBox(shape);
    const handles = {
      tl: { x: bbox.left, y: bbox.top },
      tr: { x: bbox.right, y: bbox.top },
      bl: { x: bbox.left, y: bbox.bottom },
      br: { x: bbox.right, y: bbox.bottom },
    };
    for (const key in handles) {
      const pos = handles[key as "tl" | "tr" | "bl" | "br"];
      if (Math.hypot(x - pos.x, y - pos.y) < threshold) {
        return key as "tl" | "tr" | "bl" | "br";
      }
    }
    return null;
  }
};

export const getRotationHandle = (shape: Shape) => {
  if (shape.rotation) {
    const corners = getRotatedCorners(shape);
    const topCenter = {
      x: (corners.tl.x + corners.tr.x) / 2,
      y: (corners.tl.y + corners.tr.y) / 2,
    };
    const dx = corners.tr.x - corners.tl.x;
    const dy = corners.tr.y - corners.tl.y;
    const len = Math.sqrt(dx * dx + dy * dy) || 1;
    const nx = -dy / len;
    const ny = dx / len;
    return { x: topCenter.x + nx * 30, y: topCenter.y + ny * 30 };
  } else {
    const bbox = getBoundingBox(shape);
    return { x: (bbox.left + bbox.right) / 2, y: bbox.top - 30 };
  }
};

export const getBendHandle = (shape: Shape) => {
  if (shape.controlX !== undefined && shape.controlY !== undefined) {
    return { x: shape.controlX, y: shape.controlY };
  }
  return {
    x: (shape.startX + shape.endX) / 2,
    y: (shape.startY + shape.endY) / 2,
  };
};
