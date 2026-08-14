import React from "react";
import { motion } from "motion/react";

interface MumaoCatIconProps {
  className?: string;
  size?: number | string;
  showPinkEars?: boolean;
  isPurring?: boolean;
  whiskerColor?: string;
}

export function MumaoCatIcon({ 
  className = "w-6 h-6", 
  size, 
  showPinkEars = true,
  isPurring = false,
  whiskerColor = "#437596"
}: MumaoCatIconProps) {
  const sizeStyle = size ? { width: size, height: size } : undefined;

  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={sizeStyle}
    >
      {/* 1. Cat Head Main Outline (White fill + Dark stroke) */}
      <path
        d="M 22 45 
           C 16 26, 20 10, 36 12 
           C 40 18, 42 22, 45 22 
           C 46 17, 48 15, 50 20 
           C 52 15, 54 17, 55 22 
           C 58 22, 60 18, 64 12 
           C 80 10, 84 26, 78 45 
           C 85 68, 70 92, 50 92 
           C 30 92, 15 68, 22 45 Z"
        fill="#FFFFFF"
        stroke="#121212"
        strokeWidth="3.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* 2. Inner Ear Pink Fill (Left & Right) */}
      {showPinkEars && (
        <>
          {/* Left Inner Ear */}
          <path
            d="M 26 26 C 24 19, 27 16, 32 17 C 34 22, 33 26, 30 28 Z"
            fill="#E8829C"
          />
          {/* Right Inner Ear */}
          <path
            d="M 74 26 C 76 19, 73 16, 68 17 C 66 22, 67 26, 70 28 Z"
            fill="#E8829C"
          />
        </>
      )}

      {/* Ear Inner Stroke Outlines */}
      <path
        d="M 24 30 C 23 20, 26 15, 33 16"
        stroke="#121212"
        strokeWidth="2.8"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M 76 30 C 77 20, 74 15, 67 16"
        stroke="#121212"
        strokeWidth="2.8"
        strokeLinecap="round"
        fill="none"
      />

      {/* 3. Forehead Hair Tufts (3 spikes / ш-shape) */}
      <path
        d="M 44 23 L 46 16 L 48 21 L 50 14 L 52 21 L 54 16 L 56 23"
        stroke="#121212"
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* 4. Slanted Cool Eyes (Left & Right) */}
      {/* Left Eye */}
      <path
        d="M 30 46 C 36 41, 41 45, 42 50 C 38 54, 32 52, 30 46 Z"
        fill="#121212"
      />
      {/* Right Eye */}
      <path
        d="M 70 46 C 64 41, 59 45, 58 50 C 62 54, 68 52, 70 46 Z"
        fill="#121212"
      />

      {/* 5. Nose & Smile Mouth */}
      {/* Nose */}
      <path
        d="M 47 58 C 47 56, 53 56, 53 58 L 50 62 Z"
        fill="#121212"
      />
      {/* Cat Smile Mouth */}
      <path
        d="M 50 62 C 50 67, 44 68, 41 64 M 50 62 C 50 67, 56 68, 59 64"
        stroke="#121212"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />

      {/* 6. Signature Soundwave Whiskers (湛藍波浪/音波鬍子) */}
      {/* Left Soundwave Whisker */}
      <motion.path
        d="M 38 68 L 32 62 L 26 72 L 20 62 L 14 72 L 8 62 L 2 70"
        stroke={whiskerColor}
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        animate={
          isPurring
            ? {
                d: [
                  "M 38 68 L 32 62 L 26 72 L 20 62 L 14 72 L 8 62 L 2 70",
                  "M 38 68 L 32 59 L 26 75 L 20 59 L 14 75 L 8 59 L 2 70",
                  "M 38 68 L 32 64 L 26 70 L 20 64 L 14 70 L 8 64 L 2 70",
                  "M 38 68 L 32 62 L 26 72 L 20 62 L 14 72 L 8 62 L 2 70",
                ],
                stroke: ["#437596", "#E8829C", "#437596"],
              }
            : undefined
        }
        transition={{ repeat: Infinity, duration: 0.5, ease: "easeInOut" }}
      />

      {/* Right Soundwave Whisker */}
      <motion.path
        d="M 62 68 L 68 62 L 74 72 L 80 62 L 86 72 L 92 62 L 98 70"
        stroke={whiskerColor}
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        animate={
          isPurring
            ? {
                d: [
                  "M 62 68 L 68 62 L 74 72 L 80 62 L 86 72 L 92 62 L 98 70",
                  "M 62 68 L 68 59 L 74 75 L 80 59 L 86 75 L 92 59 L 98 70",
                  "M 62 68 L 68 64 L 74 70 L 80 64 L 86 70 L 92 64 L 98 70",
                  "M 62 68 L 68 62 L 74 72 L 80 62 L 86 72 L 92 62 L 98 70",
                ],
                stroke: ["#437596", "#E8829C", "#437596"],
              }
            : undefined
        }
        transition={{ repeat: Infinity, duration: 0.5, ease: "easeInOut" }}
      />
    </svg>
  );
}
