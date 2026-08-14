import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, useSpring } from "motion/react";
import { MumaoCatIcon } from "./MumaoCatIcon";

interface InteractiveHeroWhiskersProps {
  children?: React.ReactNode;
  isDark?: boolean;
  isSepia?: boolean;
  isPurring?: boolean;
  onWhiskersTickle?: () => void;
  className?: string;
}

/**
 * 互動式音波鬍鬚區域 (Interactive Hero Soundwave Whiskers)
 * 當滑鼠接近 Hero 標題區時，動態展示類似姆貓鬍鬚的細微擺動與波動路徑
 */
export const InteractiveHeroWhiskers = React.memo(function InteractiveHeroWhiskers({
  children,
  isDark = false,
  isSepia = false,
  isPurring = false,
  onWhiskersTickle,
  className = "",
}: InteractiveHeroWhiskersProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isTickled, setIsTickled] = useState(false);
  const [mouseDist, setMouseDist] = useState({ x: 0, y: 0, dist: 999 });
  const [sparkles, setSparkles] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const sparkleIdRef = useRef(0);

  // Smooth spring values for mouse tracking
  const springX = useSpring(0, { stiffness: 120, damping: 15 });
  const springY = useSpring(0, { stiffness: 120, damping: 15 });

  const primaryColor = isDark ? "#6CA4C8" : isSepia ? "#2B5573" : "#437596";
  const pinkAccent = "#E8829C";

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const clientX = e.clientX;
      const clientY = e.clientY;

      if (rafRef.current) cancelAnimationFrame(rafRef.current);

      rafRef.current = requestAnimationFrame(() => {
        if (!containerRef.current) return;
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const dx = clientX - centerX;
        const dy = clientY - centerY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        setMouseDist({ x: dx, y: dy, dist });
        springX.set(dx / 8);
        springY.set(dy / 8);

        // Random micro-sparkle when moving close (throttled frequency)
        if (dist < 180 && Math.random() < 0.12) {
          const id = ++sparkleIdRef.current;
          const newSparkle = {
            id,
            x: clientX - rect.left,
            y: clientY - rect.top,
          };
          setSparkles((prev) => [...prev.slice(-4), newSparkle]);
          setTimeout(() => {
            setSparkles((prev) => prev.filter((s) => s.id !== id));
          }, 800);
        }
      });
    },
    [springX, springY]
  );

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setMouseDist({ x: 0, y: 0, dist: 999 });
    springX.set(0);
    springY.set(0);
  };

  const handleTickle = () => {
    setIsTickled(true);
    if (onWhiskersTickle) onWhiskersTickle();
    setTimeout(() => setIsTickled(false), 900);
  };

  // Generate dynamic soundwave path based on mouse proximity
  const getDynamicWhiskerPath = (isLeft: boolean) => {
    const influence = isHovered ? Math.max(0, 1 - mouseDist.dist / 350) : 0;
    const yOffset = (mouseDist.y / 20) * influence;
    const xOffset = ((isLeft ? -mouseDist.x : mouseDist.x) / 25) * influence;

    if (isLeft) {
      // Left whisker: starts at X=50, Y=15 near title, extends left to X=2, Y=15
      const x1 = 42 + xOffset, y1 = 6 + yOffset;
      const x2 = 34 + xOffset * 0.8, y2 = 24 - yOffset;
      const x3 = 26 + xOffset * 0.6, y3 = 6 + yOffset * 1.2;
      const x4 = 18 + xOffset * 0.4, y4 = 24 - yOffset * 0.8;
      const x5 = 10 + xOffset * 0.2, y5 = 6 + yOffset * 1.5;

      return `M 50 15 C 46 15, 46 ${y1}, ${x1} ${y1} C 38 ${y1}, 38 ${y2}, ${x2} ${y2} C 30 ${y2}, 30 ${y3}, ${x3} ${y3} C 22 ${y3}, 22 ${y4}, ${x4} ${y4} C 14 ${y4}, 14 ${y5}, ${x5} ${y5} C 6 ${y5}, 6 15, 2 15`;
    } else {
      // Right whisker: starts at X=2, Y=15 near title, extends right to X=50, Y=15
      const x1 = 10 + xOffset * 0.2, y1 = 6 + yOffset * 1.5;
      const x2 = 18 + xOffset * 0.4, y2 = 24 - yOffset * 0.8;
      const x3 = 26 + xOffset * 0.6, y3 = 6 + yOffset * 1.2;
      const x4 = 34 + xOffset * 0.8, y4 = 24 - yOffset;
      const x5 = 42 + xOffset, y5 = 6 + yOffset;

      return `M 2 15 C 6 15, 6 ${y1}, ${x1} ${y1} C 14 ${y1}, 14 ${y2}, ${x2} ${y2} C 22 ${y2}, 22 ${y3}, ${x3} ${y3} C 30 ${y3}, 30 ${y4}, ${x4} ${y4} C 38 ${y4}, 38 ${y5}, ${x5} ${y5} C 46 ${y5}, 46 15, 50 15`;
    }
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleTickle}
      className={`relative select-none group cursor-pointer transition-all duration-300 ${className}`}
      title="接近或點擊互動：觸發姆貓音波鬍鬚擺動"
    >
      {/* Interactive Micro Sparkles */}
      {sparkles.map((sp) => (
        <motion.div
          key={sp.id}
          initial={{ opacity: 0.9, scale: 0.4, y: 0 }}
          animate={{ opacity: 0, scale: 1.2, y: -16 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          style={{ left: sp.x, top: sp.y }}
          className="absolute pointer-events-none z-30"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path
              d="M 7 1 L 8.5 5.5 L 13 7 L 8.5 8.5 L 7 13 L 5.5 8.5 L 1 7 L 5.5 5.5 Z"
              fill={pinkAccent}
            />
          </svg>
        </motion.div>
      ))}

      {/* Main Content Layout with Flanking Interactive Whiskers */}
      <div className="flex items-center gap-2 sm:gap-4 justify-start">
        {/* Left Interactive Whisker */}
        <div className="relative hidden sm:flex items-center">
          <svg
            viewBox="0 0 52 30"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-12 md:w-16 h-8 overflow-visible transition-all"
          >
            {/* Ambient Background Wave Ghost */}
            <path
              d={getDynamicWhiskerPath(true)}
              stroke={isDark ? "#6CA4C8" : "#437596"}
              strokeWidth="6"
              strokeOpacity="0.15"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Primary Interactive Soundwave */}
            <motion.path
              d={getDynamicWhiskerPath(true)}
              stroke={isTickled || isPurring ? pinkAccent : primaryColor}
              strokeWidth={isHovered ? 3.5 : 2.8}
              strokeLinecap="round"
              strokeLinejoin="round"
              animate={
                isTickled || isPurring
                  ? {
                      scaleY: [1, 1.4, 0.7, 1.3, 1],
                      stroke: [primaryColor, pinkAccent, primaryColor],
                    }
                  : isHovered
                  ? {
                      y: [0, -1.5, 1.5, 0],
                    }
                  : undefined
              }
              transition={
                isTickled
                  ? { duration: 0.4, repeat: 2 }
                  : { duration: 1.2, repeat: Infinity, ease: "easeInOut" }
              }
            />
          </svg>
        </div>

        {/* Center Child (Main Title / Heading) */}
        <div className="relative z-10 flex items-center gap-2">
          {children}

          {/* Interactive Mini Whisker Badge on Mobile */}
          <div className="sm:hidden flex items-center">
            <svg
              viewBox="0 0 40 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-8 h-4 overflow-visible"
            >
              <path
                d="M 2 9 C 5 9, 5 3, 8 3 C 11 3, 11 15, 14 15 C 17 15, 17 3, 20 3 C 23 3, 23 15, 26 15 C 29 15, 29 3, 32 3 C 35 3, 35 9, 38 9"
                stroke={isTickled || isPurring ? pinkAccent : primaryColor}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        {/* Right Interactive Whisker */}
        <div className="relative hidden sm:flex items-center">
          <svg
            viewBox="0 0 52 30"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-12 md:w-16 h-8 overflow-visible transition-all"
          >
            {/* Ambient Background Wave Ghost */}
            <path
              d={getDynamicWhiskerPath(false)}
              stroke={isDark ? "#6CA4C8" : "#437596"}
              strokeWidth="6"
              strokeOpacity="0.15"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Primary Interactive Soundwave */}
            <motion.path
              d={getDynamicWhiskerPath(false)}
              stroke={isTickled || isPurring ? pinkAccent : primaryColor}
              strokeWidth={isHovered ? 3.5 : 2.8}
              strokeLinecap="round"
              strokeLinejoin="round"
              animate={
                isTickled || isPurring
                  ? {
                      scaleY: [1, 1.4, 0.7, 1.3, 1],
                      stroke: [primaryColor, pinkAccent, primaryColor],
                    }
                  : isHovered
                  ? {
                      y: [0, 1.5, -1.5, 0],
                    }
                  : undefined
              }
              transition={
                isTickled
                  ? { duration: 0.4, repeat: 2 }
                  : { duration: 1.2, repeat: Infinity, ease: "easeInOut", delay: 0.1 }
              }
            />
          </svg>
        </div>
      </div>

      {/* Hover Status Hint Tooltip */}
      <div
        className={`absolute -bottom-5 left-0 text-[10px] font-mono transition-all duration-300 pointer-events-none flex items-center gap-1.5 ${
          isHovered ? "opacity-90 translate-y-0" : "opacity-0 -translate-y-1"
        } ${isDark ? "text-[#6CA4C8]" : "text-[#437596]"}`}
      >
        <span className="w-1 h-1 rounded-full bg-[#E8829C] inline-block animate-ping"></span>
        <span>{isTickled ? "WHISKER OSCILLATION ACTIVATED" : "WAVEFORM WHISKER INTERACTIVE"}</span>
      </div>
    </div>
  );
});
