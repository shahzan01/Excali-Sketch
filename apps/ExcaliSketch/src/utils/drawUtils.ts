// src/utils/drawUtils.ts

import {
  getBoundingBox,
  getRotatedCorners,
  getRotationHandle,
  getBendHandle,
} from "./canvasUtils";
import { Shape } from "@/models/shape";

/**
 * Draw all shapes that are already saved on the canvas.
 *
 * @param ctx - The canvas rendering context.
 * @param shapes - An array of shapes to draw.
 * @param selectedShape - The ID of the currently selected shape (if any).
 */
export const drawExistingShapes = (
  ctx: CanvasRenderingContext2D,
  shapes: Shape[] | null,
  selectedShape: number | null
) => {
  if (shapes == null) return;

  shapes.forEach((shape) => {
    drawShape(ctx, shape);

    // If the shape is selected, draw its overlays and handles.
    if (selectedShape === shape.id) {
      drawSelectionOverlay(ctx, shape);
    }
  });
};

/**
 * Draw the shape that is currently being created.
 *
 * @param ctx - The canvas rendering context.
 * @param currentShape - The shape that is in progress.
 */

const lineWidth = 1;
const shapeLineWidth = 4;
export const drawCurrentShape = (
  ctx: CanvasRenderingContext2D,
  currentShape: Shape | null
) => {
  if (currentShape == null) return;

  ctx.strokeStyle = currentShape.color;
  ctx.lineWidth = shapeLineWidth;
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  ctx.beginPath();

  switch (currentShape.type) {
    case "rectangle": {
      // Ensure proper direction regardless of drawing direction.
      const x = Math.min(currentShape.startX, currentShape.endX);
      const y = Math.min(currentShape.startY, currentShape.endY);
      const width = Math.abs(currentShape.endX - currentShape.startX);
      const height = Math.abs(currentShape.endY - currentShape.startY);
      const radius = Math.min(width, height) * 0.15;
      if (currentShape.rotation && currentShape.rotation !== 0) {
        const bbox = getBoundingBox(currentShape);
        const center = {
          x: (bbox.left + bbox.right) / 2,
          y: (bbox.top + bbox.bottom) / 2,
        };
        ctx.save();

        ctx.translate(center.x, center.y);
        ctx.rotate(currentShape.rotation);
        drawRoundedRect(ctx, -width / 2, -height / 2, width, height, radius);
        ctx.restore();
      } else {
        drawRoundedRect(ctx, x, y, width, height, radius);
      }
      break;
    }
    case "ellipse":
      ctx.ellipse(
        (currentShape.startX + currentShape.endX) / 2,
        (currentShape.startY + currentShape.endY) / 2,
        Math.abs(currentShape.endX - currentShape.startX) / 2,
        Math.abs(currentShape.endY - currentShape.startY) / 2,
        0,
        0,
        2 * Math.PI
      );
      ctx.stroke();
      break;
    case "line":
      ctx.moveTo(currentShape.startX, currentShape.startY);
      if (
        currentShape.controlX !== undefined &&
        currentShape.controlY !== undefined
      ) {
        ctx.quadraticCurveTo(
          currentShape.controlX,
          currentShape.controlY,
          currentShape.endX,
          currentShape.endY
        );
      } else {
        ctx.lineTo(currentShape.endX, currentShape.endY);
      }
      ctx.stroke();
      break;
    case "draw":
      if (currentShape.path) {
        currentShape.path.forEach((point, index) => {
          if (index === 0) ctx.moveTo(point.x, point.y);
          else ctx.lineTo(point.x, point.y);
        });
        ctx.stroke();
      }
      break;
    case "text":
      // For text, simply render without rounded edges.
      ctx.font = "16px 'Comic Sans MS'";
      ctx.fillStyle = currentShape.color;
      ctx.fillText(
        currentShape.text || "",
        currentShape.startX,
        currentShape.startY
      );
      ctx.restore();
      break;
    case "diamond": {
      // Calculate bounding box values
      const x = Math.min(currentShape.startX, currentShape.endX);
      const y = Math.min(currentShape.startY, currentShape.endY);
      const width = Math.abs(currentShape.endX - currentShape.startX);
      const height = Math.abs(currentShape.endY - currentShape.startY);
      const centerX = x + width / 2;
      const centerY = y + height / 2;
      const points = [
        { x: centerX, y: y }, // Top
        { x: x + width, y: centerY }, // Right
        { x: centerX, y: y + height }, // Bottom
        { x: x, y: centerY }, // Left
      ];
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
      }
      ctx.closePath();
      ctx.stroke();
      break;
    }
    case "arrow": {
      // Draw the main arrow line (stroke only)
      ctx.strokeStyle = currentShape.color;
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(currentShape.startX, currentShape.startY);
      ctx.lineTo(currentShape.endX, currentShape.endY);
      ctx.stroke();

      // Calculate arrowhead parameters.
      const dx = currentShape.endX - currentShape.startX;
      const dy = currentShape.endY - currentShape.startY;
      const angle = Math.atan2(dy, dx);
      // Set arrowhead length as 15% of line length, capped to a maximum (e.g., 15px)
      const arrowLength = Math.min(Math.hypot(dx, dy) * 0.15, 15);
      const arrowAngle = Math.PI / 8; // ~22.5 degrees

      // Compute the two arrowhead line endpoints.
      const arrowX1 =
        currentShape.endX - arrowLength * Math.cos(angle - arrowAngle);
      const arrowY1 =
        currentShape.endY - arrowLength * Math.sin(angle - arrowAngle);
      const arrowX2 =
        currentShape.endX - arrowLength * Math.cos(angle + arrowAngle);
      const arrowY2 =
        currentShape.endY - arrowLength * Math.sin(angle + arrowAngle);

      ctx.beginPath();
      ctx.moveTo(currentShape.endX, currentShape.endY);
      ctx.lineTo(arrowX1, arrowY1);
      ctx.moveTo(currentShape.endX, currentShape.endY);
      ctx.lineTo(arrowX2, arrowY2);
      ctx.stroke();

      break;
    }
    default:
      break;
  }
};

/**
 * Helper function to draw a rectangle with rounded corners.
 *
 * @param ctx - The canvas rendering context.
 * @param x - The x-coordinate of the rectangle’s top-left corner.
 * @param y - The y-coordinate of the rectangle’s top-left corner.
 * @param width - The width of the rectangle.
 * @param height - The height of the rectangle.
 * @param radius - The radius for the rounded corners.
 */
const drawRoundedRect = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) => {
  ctx.beginPath();

  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
  ctx.lineWidth = shapeLineWidth;
  ctx.stroke();
};

/**
 * Draw a single shape on the canvas.
 *
 * @param ctx - The canvas rendering context.
 * @param shape - The shape to draw.
 */
const drawShape = (ctx: CanvasRenderingContext2D, shape: Shape) => {
  if (shape.type === "rectangle") {
    // Use proper min/max for rectangle coordinates
    const x = Math.min(shape.startX, shape.endX);
    const y = Math.min(shape.startY, shape.endY);
    const width = Math.abs(shape.endX - shape.startX);
    const height = Math.abs(shape.endY - shape.startY);
    const radius = Math.min(width, height) * 0.15;

    ctx.strokeStyle = shape.color;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    if (shape.rotation && shape.rotation !== 0) {
      const bbox = getBoundingBox(shape);
      const center = {
        x: (bbox.left + bbox.right) / 2,
        y: (bbox.top + bbox.bottom) / 2,
      };
      ctx.save();

      ctx.translate(center.x, center.y);
      ctx.rotate(shape.rotation);

      drawRoundedRect(ctx, -width / 2, -height / 2, width, height, radius);

      ctx.restore();
    } else {
      drawRoundedRect(ctx, x, y, width, height, radius);
    }
  } else if (shape.type === "ellipse") {
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = shape.color;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.ellipse(
      (shape.startX + shape.endX) / 2,
      (shape.startY + shape.endY) / 2,
      Math.abs(shape.endX - shape.startX) / 2,
      Math.abs(shape.endY - shape.startY) / 2,
      0,
      0,
      2 * Math.PI
    );
    ctx.lineWidth = shapeLineWidth;
    ctx.stroke();
  } else if (shape.type === "line") {
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = shape.color;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.beginPath();
    if (shape.rotation && shape.rotation !== 0) {
      const center = {
        x: (shape.startX + shape.endX) / 2,
        y: (shape.startY + shape.endY) / 2,
      };
      ctx.save();
      ctx.translate(center.x, center.y);
      ctx.rotate(shape.rotation);
      ctx.moveTo(shape.startX - center.x, shape.startY - center.y);
      if (shape.controlX !== undefined && shape.controlY !== undefined) {
        ctx.quadraticCurveTo(
          shape.controlX - center.x,
          shape.controlY - center.y,
          shape.endX - center.x,
          shape.endY - center.y
        );
      } else {
        ctx.lineTo(shape.endX - center.x, shape.endY - center.y);
      }

      ctx.stroke();
      ctx.restore();
    } else {
      ctx.moveTo(shape.startX, shape.startY);
      if (shape.controlX !== undefined && shape.controlY !== undefined) {
        ctx.quadraticCurveTo(
          shape.controlX,
          shape.controlY,
          shape.endX,
          shape.endY
        );
      } else {
        ctx.lineTo(shape.endX, shape.endY);
      }
      ctx.lineWidth = shapeLineWidth;
      ctx.stroke();
    }
  } else if (shape.type === "draw" && shape.path) {
    ctx.lineWidth = shapeLineWidth;
    ctx.strokeStyle = shape.color;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.beginPath();
    shape.path.forEach((point, index) => {
      if (index === 0) ctx.moveTo(point.x, point.y);
      else ctx.lineTo(point.x, point.y);
    });
    ctx.stroke();
  } else if (shape.type === "text") {
    const bbox = getBoundingBox(shape);
    ctx.save();
    if (shape.rotation) {
      const center = {
        x: (bbox.left + bbox.right) / 2,
        y: (bbox.top + bbox.bottom) / 2,
      };
      ctx.translate(center.x, center.y);
      ctx.rotate(shape.rotation);
      ctx.textAlign = "left";
      ctx.textBaseline = "top";
      const width = bbox.right - bbox.left;
      const height = bbox.bottom - bbox.top;
      const fontSize = height * 0.8;
      ctx.fillStyle = shape.color;
      ctx.font = `${fontSize}px 'Comic Sans MS'`;
      ctx.fillText(shape.text || "", -width / 2, -height / 2, width);
    } else {
      ctx.textAlign = "left";
      ctx.textBaseline = "top";
      const width = bbox.right - bbox.left;
      const height = bbox.bottom - bbox.top;
      const fontSize = height * 0.8;
      ctx.fillStyle = shape.color;
      ctx.font = `${fontSize}px 'Comic Sans MS'`;
      ctx.fillText(shape.text || "", bbox.left, bbox.top, width);
    }
    ctx.restore();
  } else if (shape.type === "diamond") {
    ctx.lineWidth = lineWidth;
    const width = shape.endX - shape.startX;
    const height = shape.endY - shape.startY;
    const centerX = shape.startX + width / 2;
    const centerY = shape.startY + height / 2;

    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(shape.rotation || 0);
    ctx.translate(-centerX, -centerY);

    ctx.beginPath();
    ctx.moveTo(centerX, shape.startY); // Top
    ctx.lineTo(shape.endX, centerY); // Right
    ctx.lineTo(centerX, shape.endY); // Bottom
    ctx.lineTo(shape.startX, centerY); // Left
    ctx.closePath();
    ctx.fillStyle = shape.color;
    ctx.strokeStyle = shape.color;
    ctx.lineWidth = 4; // Adjust line thickness if needed
    ctx.stroke();

    ctx.restore();
  } else if (shape.type === "arrow") {
    // Draw the main arrow line (stroke only)
    ctx.strokeStyle = shape.color;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(shape.startX, shape.startY);
    ctx.lineTo(shape.endX, shape.endY);
    ctx.lineWidth = shapeLineWidth;
    ctx.stroke();

    // Calculate arrowhead parameters.
    const dx = shape.endX - shape.startX;
    const dy = shape.endY - shape.startY;
    const angle = Math.atan2(dy, dx);
    // Set arrowhead length as 15% of line length, capped to a maximum (e.g., 15px)
    const arrowLength = Math.min(Math.hypot(dx, dy) * 0.15, 15);
    const arrowAngle = Math.PI / 8; // ~22.5 degrees

    // Compute the two arrowhead line endpoints.
    const arrowX1 = shape.endX - arrowLength * Math.cos(angle - arrowAngle);
    const arrowY1 = shape.endY - arrowLength * Math.sin(angle - arrowAngle);
    const arrowX2 = shape.endX - arrowLength * Math.cos(angle + arrowAngle);
    const arrowY2 = shape.endY - arrowLength * Math.sin(angle + arrowAngle);

    ctx.beginPath();
    ctx.moveTo(shape.endX, shape.endY);
    ctx.lineTo(arrowX1, arrowY1);
    ctx.moveTo(shape.endX, shape.endY);
    ctx.lineTo(arrowX2, arrowY2);
    ctx.lineWidth = shapeLineWidth;
    ctx.stroke();
  }
};

/**
 * Draw selection overlays (bounding boxes, handles, etc.) for a given shape.
 *
 * @param ctx - The canvas rendering context.
 * @param shape - The shape for which to draw the overlay.
 */
const drawSelectionOverlay = (ctx: CanvasRenderingContext2D, shape: Shape) => {
  if (
    (shape.type === "rectangle" ||
      shape.type === "ellipse" ||
      shape.type === "line" ||
      shape.type === "text" ||
      shape.type === "diamond" ||
      shape.type === "arrow") &&
    shape.rotation
  ) {
    const corners = getRotatedCorners(shape);

    ctx.strokeStyle = "#A19EE4";
    ctx.beginPath();
    ctx.moveTo(corners.tl.x, corners.tl.y);
    ctx.lineTo(corners.tr.x, corners.tr.y);
    ctx.lineTo(corners.br.x, corners.br.y);
    ctx.lineTo(corners.bl.x, corners.bl.y);
    ctx.closePath();
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.setLineDash([]);
    for (const key in corners) {
      const corner = corners[key as "tl" | "tr" | "bl" | "br"];
      ctx.fillStyle = "#A19EE4";
      ctx.lineWidth = 1;
      ctx.fillRect(corner.x - 3, corner.y - 3, 6, 6);
    }
    const rotHandle = getRotationHandle(shape);
    ctx.fillStyle = "#A19EE4";
    ctx.beginPath();
    ctx.arc(rotHandle.x, rotHandle.y, 6, 0, 2 * Math.PI);
    ctx.fill();
  } else {
    const bbox = getBoundingBox(shape);

    ctx.strokeStyle = "#A19EE4";
    ctx.lineWidth = 1;
    ctx.strokeRect(
      bbox.left - 5,
      bbox.top - 5,
      bbox.right - bbox.left + 10,
      bbox.bottom - bbox.top + 10
    );
    ctx.setLineDash([]);
    if (shape.type !== "text") {
      const handles = {
        tl: { x: bbox.left, y: bbox.top },
        tr: { x: bbox.right, y: bbox.top },
        bl: { x: bbox.left, y: bbox.bottom },
        br: { x: bbox.right, y: bbox.bottom },
      };
      for (const key in handles) {
        const pos = handles[key as "tl" | "tr" | "bl" | "br"];
        ctx.fillStyle = "#A19EE4";
        ctx.fillRect(pos.x - 3, pos.y - 3, 6, 6);
      }
      const rotHandle = getRotationHandle(shape);
      ctx.fillStyle = "#A19EE4";
      ctx.beginPath();
      ctx.arc(rotHandle.x, rotHandle.y, 6, 0, 2 * Math.PI);
      ctx.fill();
    }
  }
  if (shape.type === "line") {
    const bendHandle = getBendHandle(shape);
    ctx.fillStyle = "green";
    ctx.fillRect(bendHandle.x - 4, bendHandle.y - 4, 8, 8);
  }
  ctx.restore();
};
