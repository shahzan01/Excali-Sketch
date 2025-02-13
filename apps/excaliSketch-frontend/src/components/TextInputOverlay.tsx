// src/components/TextInputOverlay.tsx
"use client";
import React, { useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import styles from "./TextInputOverlay.module.css";

interface TextInputOverlayProps {
  x: number;
  color: string;
  y: number;
  text: string;
  onChange: (value: string) => void;
  onCommit: () => void;
  canvasElement: HTMLCanvasElement | null;
}

const TextInputOverlay: React.FC<TextInputOverlayProps> = ({
  x,
  y,
  color,
  text,
  onChange,
  onCommit,
  canvasElement,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  // If canvasElement is not provided, do not render the overlay.

  // Auto-focus and select text when the input mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
        inputRef.current.select();
      }
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (inputRef.current && !inputRef.current.contains(e.target as Node)) {
        onCommit();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onCommit]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onCommit();
    }
  };

  // Calculate the canvas's bounding rectangle.

  if (!canvasElement) {
    return null;
  }

  const canvasRect = canvasElement.getBoundingClientRect();

  // Convert canvas-relative coordinates (x, y) to viewport coordinates.
  const computedTop = canvasRect.top + y + window.scrollY;
  const computedLeft = canvasRect.left + x + window.scrollX;

  return ReactDOM.createPortal(
    <input
      ref={inputRef}
      autoFocus
      type="text"
      value={text}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={handleKeyDown}
      title="Enter text"
      className={`${styles.inputOverlay} ${styles.textInput}   absolute bg-transparent border-none outline-none caret-white  w-full`}
      style={
        {
          color: color,
          "--input-top": `${computedTop}px`,
          "--input-left": `${computedLeft}px`,
        } as React.CSSProperties
      }
    />,
    document.body
  );
};

export default TextInputOverlay;
