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
export const SoundwaveWhisker = React.memo(function SoundwaveWhisker({
  className = "",
  color = "#437596",
  isAnimated = false,
  direction = "both",
  strokeWidth = 3,
  width = 64,
  height = 18,
}: SoundwaveWhiskerProps) {
  const leftPath = "M 38 9 C 35 9, 35 3, 32 3 C 29 3, 29 15, 26 15 C 23 15, 23 3, 20 3 C 17 3, 17 15, 14 15 C 11 15, 11 3, 8 3 C 5 3, 5 9, 2 9";
  const rightPath = "M 2 9 C 5 9, 5 3, 8 3 C 11 3, 11 15, 14 15 C 17 15, 17 3, 20 3 C 23 3, 23 15, 26 15 C 29 15, 29 3, 32 3 C 35 3, 35 9, 38 9";

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
                  scaleY: [1, 1.25, 0.8, 1],
                  stroke: ["#437596", "#E8829C", "#437596"],
                }
              : undefined
          }
          transition={{ repeat: Infinity, duration: 0.8, ease: "easeInOut" }}
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
                  scaleY: [1, 1.25, 0.8, 1],
                  stroke: ["#437596", "#E8829C", "#437596"],
                }
              : undefined
          }
          transition={{ repeat: Infinity, duration: 0.8, ease: "easeInOut" }}
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
        d="M 40 12 C 37 12, 37 5, 34 5 C 31 5, 31 19, 28 19 C 25 19, 25 5, 22 5 C 19 5, 19 19, 16 19 C 13 19, 13 5, 10 5 C 6 5, 6 12, 2 12"
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
        transition={{ repeat: Infinity, duration: 0.8, ease: "easeInOut" }}
      />
      <circle cx="50" cy="12" r="2.5" fill={color} />
      <motion.path
        d="M 60 12 C 63 12, 63 5, 66 5 C 69 5, 69 19, 72 19 C 75 19, 75 5, 78 5 C 81 5, 81 19, 84 19 C 87 19, 87 5, 90 5 C 94 5, 94 12, 98 12"
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
        transition={{ repeat: Infinity, duration: 0.8, ease: "easeInOut" }}
      />
    </svg>
  );
});

interface SoundwaveDividerProps {
  className?: string;
  color?: string;
  isDark?: boolean;
}

/**
 * 章節聲波分割線 (Waveform Section Divider)
 * 俐落的音浪波形線條，取代生硬的直線
 */
export const SoundwaveDivider = React.memo(function SoundwaveDivider({
  className = "",
  color = "#437596",
  isDark = false,
}: SoundwaveDividerProps) {
  const hoverColor = isDark ? "#F49BB2" : "#E8829C";

  return (
    <motion.div
      className={`w-full flex items-center gap-3 overflow-hidden py-2 select-none cursor-pointer group ${className}`}
      initial="initial"
      whileHover="hover"
    >
      <div className={`h-[1px] flex-1 transition-all duration-300 ${isDark ? "bg-[#6CA4C8]/20 group-hover:bg-[#F49BB2]/40" : "bg-[#C8DCE8] group-hover:bg-[#E8829C]/50"}`} />
      <motion.div
        className="flex items-center gap-1"
        animate={{
          y: [-2.5, 2.5, -2.5],
          scaleY: [1, 1.12, 0.9, 1],
          opacity: [0.8, 1, 0.8],
        }}
        variants={{
          hover: {
            scale: 1.18,
            opacity: 1,
          },
        }}
        transition={{
          duration: 3.2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <svg
          viewBox="0 0 120 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-3.5 w-28 shrink-0 overflow-visible"
        >
          <motion.path
            d="M 0 8 L 20 8 C 25 8, 25 14, 30 14 C 35 14, 35 2, 40 2 C 45 2, 45 14, 50 14 C 55 14, 55 2, 60 2 C 65 2, 65 14, 70 14 C 75 14, 75 2, 80 2 C 85 2, 85 14, 90 14 C 95 14, 95 8, 100 8 L 120 8"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            variants={{
              hover: {
                stroke: hoverColor,
                strokeWidth: 3.2,
              },
            }}
            transition={{
              duration: 0.3,
            }}
          />
        </svg>
      </motion.div>
      <div className={`h-[1px] flex-1 transition-all duration-300 ${isDark ? "bg-[#6CA4C8]/20 group-hover:bg-[#F49BB2]/40" : "bg-[#C8DCE8] group-hover:bg-[#E8829C]/50"}`} />
    </motion.div>
  );
});

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
export const SoundwavePillBadge = React.memo(function SoundwavePillBadge({
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
});
