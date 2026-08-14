import React from "react";
import { motion } from "motion/react";

interface SoundwaveWhiskerProps {
  className?: string;
  color?: string;
  isAnimated?: boolean;
  direction?: "left" | "right" | "both";
  strokeWidth?: number;
  width?: number | string;
  height?: number | string;
}

/**
 * 獨立音波鬍鬚 SVG 符號 (Soundwave Whisker Super Graphic)
 * 結合貓鬚與音樂祭音浪振幅特徵
 */
export function SoundwaveWhisker({
  className = "",
  color = "#437596",
  isAnimated = false,
  direction = "both",
  strokeWidth = 3,
  width = 64,
  height = 18,
}: SoundwaveWhiskerProps) {
  const leftPath = "M 38 9 L 32 3 L 26 15 L 20 3 L 14 15 L 8 3 L 2 11";
  const rightPath = "M 2 9 L 8 3 L 14 15 L 20 3 L 26 15 L 32 3 L 38 11";

  if (direction === "left") {
    return (
      <svg
        viewBox="0 0 40 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`${className} ${isAnimated ? "animate-pulse" : ""}`}
        style={{ width, height }}
      >
        <motion.path
          d={leftPath}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          animate={
            isAnimated
              ? {
                  d: [
                    "M 38 9 L 32 3 L 26 15 L 20 3 L 14 15 L 8 3 L 2 11",
                    "M 38 9 L 32 1 L 26 17 L 20 1 L 14 17 L 8 1 L 2 11",
                    "M 38 9 L 32 5 L 26 13 L 20 5 L 14 13 L 8 5 L 2 11",
                    "M 38 9 L 32 3 L 26 15 L 20 3 L 14 15 L 8 3 L 2 11",
                  ],
                  stroke: ["#437596", "#E8829C", "#437596"],
                }
              : undefined
          }
          transition={{ repeat: Infinity, duration: 0.6, ease: "easeInOut" }}
        />
      </svg>
    );
  }

  if (direction === "right") {
    return (
      <svg
        viewBox="0 0 40 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`${className} ${isAnimated ? "animate-pulse" : ""}`}
        style={{ width, height }}
      >
        <motion.path
          d={rightPath}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          animate={
            isAnimated
              ? {
                  d: [
                    "M 2 9 L 8 3 L 14 15 L 20 3 L 26 15 L 32 3 L 38 11",
                    "M 2 9 L 8 1 L 14 17 L 20 1 L 26 17 L 32 1 L 38 11",
                    "M 2 9 L 8 5 L 14 13 L 20 5 L 26 13 L 32 5 L 38 11",
                    "M 2 9 L 8 3 L 14 15 L 20 3 L 26 15 L 32 3 L 38 11",
                  ],
                  stroke: ["#437596", "#E8829C", "#437596"],
                }
              : undefined
          }
          transition={{ repeat: Infinity, duration: 0.6, ease: "easeInOut" }}
        />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 100 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} ${isAnimated ? "animate-pulse" : ""}`}
      style={{ width, height }}
    >
      <motion.path
        d="M 40 12 L 34 5 L 28 19 L 22 5 L 16 19 L 10 5 L 3 14"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        animate={
          isAnimated
            ? {
                stroke: ["#437596", "#E8829C", "#437596"],
                scaleY: [1, 1.3, 0.8, 1],
              }
            : undefined
        }
        transition={{ repeat: Infinity, duration: 0.5, ease: "easeInOut" }}
      />
      <circle cx="50" cy="12" r="2.5" fill={color} />
      <motion.path
        d="M 60 12 L 66 5 L 72 19 L 78 5 L 84 19 L 90 5 L 97 14"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        animate={
          isAnimated
            ? {
                stroke: ["#437596", "#E8829C", "#437596"],
                scaleY: [1, 1.3, 0.8, 1],
              }
            : undefined
        }
        transition={{ repeat: Infinity, duration: 0.5, ease: "easeInOut" }}
      />
    </svg>
  );
}

interface SoundwaveDividerProps {
  className?: string;
  color?: string;
  isDark?: boolean;
}

/**
 * 章節聲波分割線 (Waveform Section Divider)
 * 俐落的音浪波形線條，取代生硬的直線
 */
export function SoundwaveDivider({
  className = "",
  color = "#437596",
  isDark = false,
}: SoundwaveDividerProps) {
  return (
    <div className={`w-full flex items-center gap-3 overflow-hidden py-1 select-none pointer-events-none ${className}`}>
      <div className={`h-[1px] flex-1 ${isDark ? "bg-[#6CA4C8]/20" : "bg-[#C8DCE8]"}`} />
      <div className="flex items-center gap-1 opacity-70">
        <svg
          viewBox="0 0 120 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-3 w-28 shrink-0"
        >
          <path
            d="M 0 8 L 15 8 L 22 2 L 30 14 L 38 2 L 46 14 L 54 2 L 62 14 L 70 2 L 78 14 L 85 8 L 120 8"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div className={`h-[1px] flex-1 ${isDark ? "bg-[#6CA4C8]/20" : "bg-[#C8DCE8]"}`} />
    </div>
  );
}

interface SoundwavePillBadgeProps {
  label: string;
  code?: string;
  isDark?: boolean;
  isSepia?: boolean;
  isAnimated?: boolean;
  className?: string;
}

/**
 * 帶有音波鬍鬚特徵的品牌標籤徽章 (Soundwave Whisker Pill Badge)
 */
export function SoundwavePillBadge({
  label,
  code,
  isDark = false,
  isSepia = false,
  isAnimated = false,
  className = "",
}: SoundwavePillBadgeProps) {
  const badgeColor = isDark ? "#6CA4C8" : isSepia ? "#2B5573" : "#437596";

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-mono font-bold transition-all shadow-xs ${
        isDark
          ? "bg-[#6CA4C8]/10 border-[#6CA4C8]/30 text-[#6CA4C8]"
          : isSepia
          ? "bg-[#FAF4E5] border-[#437596]/30 text-[#2B5573]"
          : "bg-[#EBF3F8] border-[#C8DCE8] text-[#437596]"
      } ${className}`}
    >
      <SoundwaveWhisker
        direction="left"
        width={18}
        height={10}
        strokeWidth={2.5}
        color={badgeColor}
        isAnimated={isAnimated}
      />
      <span>{code ? `${code} ${label}` : label}</span>
      <SoundwaveWhisker
        direction="right"
        width={18}
        height={10}
        strokeWidth={2.5}
        color={badgeColor}
        isAnimated={isAnimated}
      />
    </div>
  );
}
