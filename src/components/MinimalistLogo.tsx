import React from "react";
import { motion } from "motion/react";

interface MinimalistLogoProps {
  className?: string;
  size?: number;
  theme?: "dark" | "light" | "sepia";
}

export function MinimalistLogo({ className = "", size = 36, theme = "dark" }: MinimalistLogoProps) {
  // Color configuration based on theme
  const strokeColor = 
    theme === "light" 
      ? "#1F2937" // Cool gray-800
      : theme === "sepia"
      ? "#433422" // Warm sepia-800
      : "#F3F4F6"; // Dark-theme off-white

  const accentColor1 = "#F59E0B"; // Amber-500
  const accentColor2 = "#6366F1"; // Indigo-500

  return (
    <motion.div
      className={`relative flex items-center justify-center select-none cursor-pointer ${className}`}
      style={{ width: size, height: size }}
      whileHover="hover"
      initial="initial"
    >
      {/* Outer ambient glow */}
      <div 
        className="absolute inset-0 rounded-full blur-[10px] opacity-20 transition-all duration-500 group-hover:opacity-40"
        style={{
          background: `radial-gradient(circle, ${accentColor1} 0%, ${accentColor2} 100%)`
        }}
      />

      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full relative z-10"
      >
        {/* Definition for elegant gradients */}
        <defs>
          <linearGradient id="logoAccentGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={accentColor1} />
            <stop offset="100%" stopColor={accentColor2} />
          </linearGradient>
          <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={accentColor1} stopOpacity="0.8" />
            <stop offset="100%" stopColor={accentColor1} stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* 1. Outer Orbiting Symmetrical Circle (Precision Grid) */}
        <motion.circle
          cx="50"
          cy="50"
          r="45"
          stroke={strokeColor}
          strokeWidth="1"
          strokeOpacity="0.2"
          strokeDasharray="4 4"
          variants={{
            hover: { rotate: 360 }
          }}
          transition={{ duration: 25, ease: "linear", repeat: Infinity }}
        />

        {/* 2. Primary Outer Solid Geometric Ring (Stability) */}
        <motion.circle
          cx="50"
          cy="50"
          r="40"
          stroke={strokeColor}
          strokeWidth="1.2"
          strokeOpacity="0.7"
          variants={{
            hover: { scale: 0.96 }
          }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />

        {/* 3. Concentric Inner Circle */}
        <motion.circle
          cx="50"
          cy="50"
          r="28"
          stroke={strokeColor}
          strokeWidth="0.8"
          strokeOpacity="0.4"
          strokeDasharray="20 10"
          variants={{
            hover: { rotate: -180 }
          }}
          transition={{ duration: 15, ease: "linear", repeat: Infinity }}
        />

        {/* 4. Interactive Outer Golden Triangle (Creativity) */}
        <motion.polygon
          points="50,15 80,68 20,68"
          stroke="url(#logoAccentGradient)"
          strokeWidth="1.5"
          strokeLinejoin="round"
          strokeOpacity="0.9"
          variants={{
            hover: { 
              scale: 1.05,
              rotate: 15,
              strokeWidth: 2
            }
          }}
          transition={{ duration: 0.6, ease: "backOut" }}
          style={{ transformOrigin: "50px 50px" }}
        />

        {/* 5. Precision Diamond/Square Inside (Symmetry) */}
        <motion.rect
          x="35"
          y="35"
          width="30"
          height="30"
          stroke={strokeColor}
          strokeWidth="1"
          strokeOpacity="0.6"
          variants={{
            hover: { 
              rotate: -45,
              scale: 0.85
            }
          }}
          transition={{ duration: 0.6, ease: "backOut" }}
          style={{ transformOrigin: "50px 50px" }}
        />

        {/* 6. Intersecting Precision Lines (Mathematical Grid Alignment) */}
        <motion.line
          x1="50"
          y1="10"
          x2="50"
          y2="90"
          stroke={strokeColor}
          strokeWidth="0.5"
          strokeOpacity="0.3"
          variants={{
            hover: { strokeOpacity: 0.5 }
          }}
        />
        <motion.line
          x1="10"
          y1="50"
          x2="90"
          y2="50"
          stroke={strokeColor}
          strokeWidth="0.5"
          strokeOpacity="0.3"
          variants={{
            hover: { strokeOpacity: 0.5 }
          }}
        />

        {/* 7. Center Focal Node (The Glowing Core of Innovation) */}
        <circle
          cx="50"
          cy="50"
          r="6"
          fill="url(#centerGlow)"
          className="animate-pulse"
        />
        <motion.circle
          cx="50"
          cy="50"
          r="3"
          fill={accentColor1}
          variants={{
            hover: { 
              scale: 1.5,
              fill: accentColor2
            }
          }}
          transition={{ duration: 0.3 }}
        />
      </svg>
    </motion.div>
  );
}
