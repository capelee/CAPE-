import React from "react";
import { motion } from "framer-motion";
import { DecorWrapper } from "./DecorWrapper";
import { PerspectiveGrid } from "./PerspectiveGrid";
import { getCategoryTheme, ThemeMode } from "./themeConfig";

interface DecorProps {
  theme: ThemeMode;
}

const CATEGORY = "企業LOGO與CIS設計";

export const GOLDEN_SPIRAL_PATH = (() => {
  const points: string[] = [];
  const totalTurns = 3.7;
  const maxAngle = totalTurns * 2 * Math.PI;
  const steps = 240;
  const a = 2.5;
  const b = 0.185;

  for (let i = 0; i <= steps; i++) {
    const theta = (i / steps) * maxAngle;
    const r = a * Math.exp(b * theta);
    const x = (600 + r * Math.cos(theta)).toFixed(2);
    const y = (200 + r * Math.sin(theta)).toFixed(2);
    points.push(`${i === 0 ? "M" : "L"} ${x} ${y}`);
  }
  return points.join(" ");
})();

export const CisLogoDecor: React.FC<DecorProps> = ({ theme }) => {
  const { strokeColor, textColor } = getCategoryTheme(CATEGORY, theme);

  const badge = (
    <div className="absolute top-3 right-4 sm:top-6 sm:right-8 flex items-center gap-2 font-mono text-[10px] sm:text-xs">
      <div className="w-2 h-2 rounded-sm bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
      <span className={`font-bold tracking-widest ${textColor}`}>CIS SPEC v3.2</span>
      <span className={`hidden md:inline px-1.5 py-0.5 rounded text-[9px] border border-indigo-500/30 bg-indigo-500/10 font-mono ${textColor}`}>
        GOLDEN RATIO 1:1.618
      </span>
    </div>
  );

  const svgDefs = (
    <linearGradient id="indigoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor={strokeColor} stopOpacity="0.2" />
      <stop offset="50%" stopColor={strokeColor} stopOpacity="0.8" />
      <stop offset="100%" stopColor="#818CF8" stopOpacity="0.2" />
    </linearGradient>
  );

  const svgContent = (
    <>
      {/* Concentric Circles & Axis Path Merging */}
      <PerspectiveGrid
        strokeColor={strokeColor}
        centerCircles={[180, 111, 68, 42]}
        centerPos={{ cx: 600, cy: 200 }}
      />

      {/* Merged Alignment Axes */}
      <path
        d="M 200 200 L 1000 200 M 600 20 L 600 380 M 350 50 L 850 350"
        stroke={strokeColor}
        strokeWidth="1"
        strokeDasharray="4 4"
        opacity="0.35"
        fill="none"
      />

      {/* Fibonacci Golden Spiral Curve */}
      <motion.g
        style={{ transformOrigin: "600px 200px" }}
        animate={{ scale: [0.98, 1.02, 0.98], opacity: [0.85, 1, 0.85] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        <motion.path
          d={GOLDEN_SPIRAL_PATH}
          fill="none"
          stroke="url(#indigoGrad)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#neonGlowIndigo)"
          animate={{
            pathLength: [0.2, 1, 0.2],
            opacity: [0.45, 0.95, 0.45]
          }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.g>

      {/* Bezier Anchor Points & Control Handles */}
      <path
        d="M 380,120 C 480,40 720,360 820,280"
        fill="none"
        stroke={strokeColor}
        strokeWidth="1.5"
        strokeDasharray="4 2"
        opacity="0.8"
      />

      {/* Merged Control Handle lines */}
      <path
        d="M 380 120 L 480 40 M 820 280 L 720 360"
        stroke={strokeColor}
        strokeWidth="1"
        opacity="0.6"
        fill="none"
      />
      <circle cx="480" cy="40" r="3.5" fill={strokeColor} />
      <circle cx="720" cy="360" r="3.5" fill={strokeColor} />

      <rect x="375" y="115" width="10" height="10" fill="#818CF8" stroke="#1E1B4B" strokeWidth="1.5" />
      <rect x="815" y="275" width="10" height="10" fill="#818CF8" stroke="#1E1B4B" strokeWidth="1.5" />

      <text x="395" y="110" fill={strokeColor} fontSize="10" fontFamily="monospace" opacity="0.8">P1 [X: 380, Y: 120]</text>
      <text x="835" y="295" fill={strokeColor} fontSize="10" fontFamily="monospace" opacity="0.8">P2 [X: 820, Y: 280]</text>
      <text x="615" y="190" fill={strokeColor} fontSize="9" fontFamily="monospace" opacity="0.7">Φ = 1.6180339...</text>
    </>
  );

  return (
    <DecorWrapper
      category={CATEGORY}
      theme={theme}
      topRightBadge={badge}
      bottomIndicatorText="BRAND IDENTITY BLUEPRINT"
      svgViewBox="0 0 1200 400"
      svgDefs={svgDefs}
      svgContent={svgContent}
    >
      {/* Floating Cat Head Logo (Top-Left Safe Zone) */}
      <motion.div
        className="absolute left-[2%] sm:left-[4%] top-[3%] sm:top-[5%] w-20 h-20 sm:w-28 sm:h-28 rounded-2xl border border-indigo-500/30 bg-indigo-950/20 backdrop-blur-[1px] flex items-center justify-center p-2 shadow-[0_0_25px_rgba(99,102,241,0.15)] hidden lg:flex opacity-75 hover:opacity-100 transition-opacity will-change-transform z-10"
        style={{ transform: 'translateZ(0)', willChange: 'transform' }}
        animate={{ y: [0, -6, 0], rotate: [0, -2, 0] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg className="w-14 h-14 sm:w-18 sm:h-18 text-indigo-400 drop-shadow-[0_0_10px_rgba(99,102,241,0.5)]" viewBox="0 0 64 64" fill="none">
          <circle cx="32" cy="34" r="24" stroke="currentColor" strokeWidth="0.8" strokeDasharray="2 2" opacity="0.3" />
          <path d="M 32 4 L 32 60 M 4 34 L 60 34" stroke="currentColor" strokeWidth="0.8" strokeDasharray="2 2" opacity="0.25" />

          <path d="M 12 26 L 16 8 C 17 6, 21 8, 25 15 Z" fill="rgba(99, 102, 241, 0.15)" />
          <path d="M 52 26 L 48 8 C 47 6, 43 8, 39 15 Z" fill="rgba(99, 102, 241, 0.15)" />

          <path d="M 12 26 C 8 36, 12 54, 32 54 C 52 54, 56 36, 52 26 C 45 20, 39 16, 32 16 C 25 16, 19 20, 12 26 Z" fill="rgba(99, 102, 241, 0.12)" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />

          <path d="M 16 22 L 18 12 C 18.5 11, 21 12, 23 17 Z" fill="rgba(236, 72, 153, 0.35)" />
          <path d="M 48 22 L 46 12 C 45.5 11, 43 12, 41 17 Z" fill="rgba(236, 72, 153, 0.35)" />

          <path d="M 12 26 L 16 8 C 17 6, 21 8, 25 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <path d="M 52 26 L 48 8 C 47 6, 43 8, 39 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />

          <path d="M 19 28 Q 24 25 27 29" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M 45 28 Q 40 25 37 29" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />

          <ellipse cx="23" cy="33" rx="2.5" ry="3.5" fill="currentColor" />
          <ellipse cx="41" cy="33" rx="2.5" ry="3.5" fill="currentColor" />

          <path d="M 30.5 38.5 L 33.5 38.5 L 32 40.5 Z" fill="currentColor" />
          <path d="M 28 42.5 Q 30 44.5 32 42.5 Q 34 44.5 36 42.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" fill="none" />

          <path d="M 6 39 Q 8 36 10 39 T 14 39 T 18 39 T 22 39" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <path d="M 58 39 Q 56 36 54 39 T 50 39 T 46 39 T 42 39" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />

          <circle cx="16" cy="8" r="1.5" fill="#38BDF8" />
          <circle cx="48" cy="8" r="1.5" fill="#38BDF8" />
          <circle cx="32" cy="54" r="1.5" fill="#38BDF8" />
        </svg>
      </motion.div>

      {/* Floating Pen Tool Interface Card (Bottom-Right Safe Zone) */}
      <motion.div
        className="absolute right-[2%] sm:right-[5%] bottom-[3%] sm:bottom-[5%] w-32 sm:w-40 h-18 sm:h-22 rounded-xl border border-indigo-500/30 bg-indigo-950/20 backdrop-blur-[1px] p-2.5 flex flex-col justify-between hidden xl:flex opacity-70 hover:opacity-100 transition-opacity will-change-transform z-10"
        style={{ transform: 'translateZ(0)', willChange: 'transform' }}
        animate={{ y: [0, 6, 0], rotate: [0, 1.5, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
      >
        <div className="flex items-center justify-between border-b border-indigo-500/20 pb-1">
          <span className="font-mono text-[9px] text-indigo-300 font-bold tracking-wider">VECTOR NODE</span>
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-ping" />
        </div>

        <div className="flex items-center gap-2 my-1">
          <svg className="w-4 h-4 text-indigo-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 19l7-7 3 3-7 7-3-3z" />
            <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
            <circle cx="11" cy="11" r="2" />
          </svg>
          <div className="font-mono text-[8px] text-indigo-200/80 leading-tight">
            <div>SMOOTH ANCHOR</div>
            <div className="text-indigo-400 font-semibold">DX: +12.4 | DY: -8.2</div>
          </div>
        </div>

        <div className="w-full h-1 bg-indigo-950 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-indigo-500 to-indigo-300 will-change-transform"
            style={{ transform: 'translateZ(0)', willChange: 'transform' }}
            animate={{ width: ["20%", "85%", "40%", "100%", "20%"] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </motion.div>
    </DecorWrapper>
  );
};
