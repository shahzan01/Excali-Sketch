"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

export default function HeroBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas dimensions
    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.scale(dpr, dpr);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
    };

    // Mouse position
    let mouseX = 0;
    let mouseY = 0;
    const mouseRadius = 150;

    // Track mouse position
    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    // Touch position
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouseX = e.touches[0].clientX;
        mouseY = e.touches[0].clientY;
      }
    };

    // Grid class
    class Grid {
      cols: number;
      rows: number;
      points: Point[][];

      constructor() {
        this.cols = Math.floor(window.innerWidth / 40) + 2;
        this.rows = Math.floor(window.innerHeight / 40) + 2;
        this.points = [];

        this.createGrid();
      }

      createGrid() {
        this.points = [];
        for (let i = 0; i < this.cols; i++) {
          this.points[i] = [];
          for (let j = 0; j < this.rows; j++) {
            const x = i * 40;
            const y = j * 40;
            this.points[i][j] = new Point(x, y);
          }
        }
      }

      draw() {
        // Draw connections
        ctx.strokeStyle = getComputedStyle(document.documentElement)
          .getPropertyValue("--primary")
          .trim();
        ctx.lineWidth = 0.5;

        for (let i = 0; i < this.cols; i++) {
          for (let j = 0; j < this.rows; j++) {
            const point = this.points[i][j];

            // Connect to right point
            if (i < this.cols - 1) {
              const rightPoint = this.points[i + 1][j];
              const distance = Math.sqrt(
                Math.pow(point.x - rightPoint.x, 2) +
                  Math.pow(point.y - rightPoint.y, 2)
              );

              const opacity = Math.max(0, 1 - distance / 100);
              ctx.strokeStyle = `rgba(59, 130, 246, ${opacity * 0.3})`;

              ctx.beginPath();
              ctx.moveTo(point.x, point.y);
              ctx.lineTo(rightPoint.x, rightPoint.y);
              ctx.stroke();
            }

            // Connect to bottom point
            if (j < this.rows - 1) {
              const bottomPoint = this.points[i][j + 1];
              const distance = Math.sqrt(
                Math.pow(point.x - bottomPoint.x, 2) +
                  Math.pow(point.y - bottomPoint.y, 2)
              );

              const opacity = Math.max(0, 1 - distance / 100);
              ctx.strokeStyle = `rgba(59, 130, 246, ${opacity * 0.3})`;

              ctx.beginPath();
              ctx.moveTo(point.x, point.y);
              ctx.lineTo(bottomPoint.x, bottomPoint.y);
              ctx.stroke();
            }
          }
        }

        // Draw points
        for (let i = 0; i < this.cols; i++) {
          for (let j = 0; j < this.rows; j++) {
            this.points[i][j].draw();
          }
        }
      }

      update() {
        for (let i = 0; i < this.cols; i++) {
          for (let j = 0; j < this.rows; j++) {
            this.points[i][j].update();
          }
        }
      }
    }

    // Point class
    class Point {
      originalX: number;
      originalY: number;
      x: number;
      y: number;
      vx: number;
      vy: number;

      constructor(x: number, y: number) {
        this.originalX = x;
        this.originalY = y;
        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 0;
      }

      draw() {
        // Calculate distance from mouse
        const dx = this.x - mouseX;
        const dy = this.y - mouseY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Determine point size and color based on mouse proximity
        let size = 1;
        let opacity = 0.3;

        if (distance < mouseRadius) {
          size = 2 + (1 - distance / mouseRadius) * 3;
          opacity = 0.3 + (1 - distance / mouseRadius) * 0.7;
        }

        ctx.fillStyle = `rgba(59, 130, 246, ${opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, size, 0, Math.PI * 2);
        ctx.fill();
      }

      update() {
        // Calculate distance from mouse
        const dx = this.x - mouseX;
        const dy = this.y - mouseY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Apply force if within mouse radius
        if (distance < mouseRadius) {
          const force = (mouseRadius - distance) / mouseRadius;
          const angle = Math.atan2(dy, dx);
          const fx = Math.cos(angle) * force * 0.5;
          const fy = Math.sin(angle) * force * 0.5;

          this.vx += fx;
          this.vy += fy;
        }

        // Spring force back to original position
        this.vx += (this.originalX - this.x) * 0.05;
        this.vy += (this.originalY - this.y) * 0.05;

        // Damping
        this.vx *= 0.9;
        this.vy *= 0.9;

        // Update position
        this.x += this.vx;
        this.y += this.vy;
      }
    }

    // Create grid
    let grid = new Grid();

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      grid.update();
      grid.draw();

      requestAnimationFrame(animate);
    };

    // Initialize
    resizeCanvas();
    animate();

    // Event listeners
    window.addEventListener("resize", () => {
      resizeCanvas();
      grid = new Grid();
    });

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove);

    // Cleanup
    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, []);

  return (
    <>
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-300/30 to-purple-300/30 dark:from-blue-900/30 dark:to-purple-900/30 z-0" />

      {/* Interactive grid canvas */}
      <motion.canvas
        ref={canvasRef}
        className="absolute inset-0 z-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
      />

      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {/* Top right blob */}
        <motion.div
          className="absolute -top-20 -right-20 w-64 h-64 bg-blue-400/10 dark:bg-blue-600/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 10, 0],
            opacity: [0.5, 0.7, 0.5],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />

        {/* Bottom left blob */}
        <motion.div
          className="absolute -bottom-32 -left-32 w-96 h-96 bg-purple-400/10 dark:bg-purple-600/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, -10, 0],
            opacity: [0.5, 0.7, 0.5],
          }}
          transition={{
            duration: 10,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 1,
          }}
        />

        {/* Center blob */}
        <motion.div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-400/5 dark:bg-indigo-600/5 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.4, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 12,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 2,
          }}
        />
      </div>
    </>
  );
}
