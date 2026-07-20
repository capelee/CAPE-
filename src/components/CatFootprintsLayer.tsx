import React, { useEffect, useRef } from "react";
import { playPawPopSound } from "../utils/audioEffects";

interface CatFootprint {
  id: number;
  pageX: number;
  pageY: number;
  angle: number;
  scale: number;
  createdAt: number;
}

export function CatFootprintsLayer() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const footprintsRef = useRef<CatFootprint[]>([]);
  const animationFrameIdRef = useRef<number | null>(null);

  // Track cursor movement for mousemove footprints
  const lastMousePosRef = useRef<{ pageX: number; pageY: number; time: number } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Handle high DPI displays for crisp drawing
    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      const width = window.innerWidth;
      const height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // 100% smooth drawing loop
    const render = () => {
      const currentCtx = canvas.getContext("2d");
      if (!currentCtx) return;

      const width = window.innerWidth;
      const height = window.innerHeight;

      // Clear with correct context dimensions
      currentCtx.clearRect(0, 0, width, height);

      const now = Date.now();
      const scrollX = window.scrollX;
      const scrollY = window.scrollY;
      const duration = 3500;

      // Filter and draw active footprints
      footprintsRef.current = footprintsRef.current.filter((fp) => {
        const elapsed = now - fp.createdAt;
        if (elapsed >= duration) return false;

        const p = elapsed / duration;

        // Replicate original CSS opacity curves precisely
        let opacity = 0;
        if (p < 0.08) {
          opacity = (p / 0.08) * 0.75;
        } else if (p < 0.8) {
          opacity = 0.75;
        } else {
          opacity = ((1 - p) / 0.2) * 0.75;
        }

        // Replicate original CSS scale curves precisely
        let currentScale = fp.scale;
        if (p < 0.08) {
          currentScale = 0.2 + (fp.scale - 0.2) * (p / 0.08);
        } else if (p < 0.8) {
          currentScale = fp.scale;
        } else {
          currentScale = fp.scale - (fp.scale * 0.1) * ((p - 0.8) / 0.2);
        }

        // Calculate viewport coordinates so footprints scroll with content
        const drawX = fp.pageX - scrollX;
        const drawY = fp.pageY - scrollY;

        // Only draw if visible within the viewport
        if (drawX >= -32 && drawX <= width + 32 && drawY >= -32 && drawY <= height + 32) {
          currentCtx.save();
          currentCtx.translate(drawX, drawY);
          currentCtx.rotate(fp.angle);
          currentCtx.scale(currentScale, currentScale);

          // Apply soft drop-shadow
          currentCtx.shadowColor = "rgba(244, 63, 94, 0.2)";
          currentCtx.shadowBlur = 3;
          currentCtx.shadowOffsetY = 1.5;

          // Cute pink paw color (#fda4af) with dynamic opacity
          currentCtx.fillStyle = `rgba(253, 164, 175, ${opacity})`;

          // Draw the main paw pad (gorgeous bean shape matching the vector reference)
          currentCtx.beginPath();
          // Start at bottom-center notch
          currentCtx.moveTo(0, 4);
          // Curve down and out to bottom-left lobe
          currentCtx.bezierCurveTo(-4, 5, -8, 6, -9, 3);
          // Curve up along the outer-left edge to top-left
          currentCtx.bezierCurveTo(-10, 0, -6, -4, -4, -5);
          // Smoothly arch over the top peak
          currentCtx.bezierCurveTo(-2, -6, 2, -6, 4, -5);
          // Curve down along the outer-right edge to bottom-right lobe
          currentCtx.bezierCurveTo(6, -4, 10, 0, 9, 3);
          // Curve back to bottom-center notch
          currentCtx.bezierCurveTo(8, 6, 4, 5, 0, 4);
          currentCtx.closePath();
          currentCtx.fill();

          // Draw the 4 adorable toes (perfect circles, perfectly spaced to match the vector reference)
          currentCtx.beginPath();
          // Far-left toe
          currentCtx.arc(-11, -6, 2.8, 0, Math.PI * 2);
          currentCtx.closePath();
          currentCtx.fill();

          currentCtx.beginPath();
          // Inner-left toe
          currentCtx.arc(-5, -12, 3.5, 0, Math.PI * 2);
          currentCtx.closePath();
          currentCtx.fill();

          currentCtx.beginPath();
          // Inner-right toe
          currentCtx.arc(5, -12, 3.5, 0, Math.PI * 2);
          currentCtx.closePath();
          currentCtx.fill();

          currentCtx.beginPath();
          // Far-right toe
          currentCtx.arc(11, -6, 2.8, 0, Math.PI * 2);
          currentCtx.closePath();
          currentCtx.fill();

          currentCtx.restore();
        }

        return true;
      });

      // If no footprints are left, stop the animation loop to save battery and CPU cycles!
      if (footprintsRef.current.length > 0) {
        animationFrameIdRef.current = requestAnimationFrame(render);
      } else {
        animationFrameIdRef.current = null;
      }
    };

    // Helper to start the animation loop if not already running
    const startLoop = () => {
      if (animationFrameIdRef.current === null) {
        animationFrameIdRef.current = requestAnimationFrame(render);
      }
    };

    const handleGlobalClick = (e: MouseEvent) => {
      let target = e.target as HTMLElement | null;

      const isInteractive = (el: HTMLElement | null): boolean => {
        if (!el) return false;
        const tagName = el.tagName.toLowerCase();
        if (["button", "a", "input", "select", "textarea", "iframe"].includes(tagName)) return true;
        if (el.getAttribute("role") === "button") return true;
        if (el.classList.contains("cursor-pointer") || el.classList.contains("interactive-tap")) return true;
        if (el.closest("#modal-multimedia-menu") || el.closest(".fixed.z-50") || el.closest(".fixed.z-40")) return true;
        return isInteractive(el.parentElement);
      };

      if (isInteractive(target)) {
        playPawPopSound();
        return;
      }

      // Add a clean click footprint with random rotation
      const newFootprint: CatFootprint = {
        id: Math.random(),
        pageX: e.pageX,
        pageY: e.pageY,
        angle: (-35 + Math.random() * 70) * (Math.PI / 180),
        scale: 0.75 + Math.random() * 0.4,
        createdAt: Date.now(),
      };

      footprintsRef.current.push(newFootprint);
      
      // Update last position to prevent click+move duplicates from overlapping
      lastMousePosRef.current = { pageX: e.pageX, pageY: e.pageY, time: Date.now() };

      startLoop();
    };

    window.addEventListener("click", handleGlobalClick, { passive: true });

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("click", handleGlobalClick);
      if (animationFrameIdRef.current !== null) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0 animate-fade-in"
      style={{ mixBlendMode: "normal" }}
    />
  );
}
