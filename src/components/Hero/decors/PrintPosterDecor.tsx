import React from "react";
import { motion } from "framer-motion";
import { DecorWrapper } from "./DecorWrapper";
import { getCategoryTheme, ThemeMode } from "./themeConfig";

interface DecorProps {
  theme: ThemeMode;
}

const CATEGORY = "平面海報廣告設計";

export const PrintPosterDecor: React.FC<DecorProps> = ({ theme }) => {
  const { strokeColor, textColor } = getCategoryTheme(CATEGORY, theme);

  const badge = (
    <div className="absolute top-3 right-4 sm:top-6 sm:right-8 flex items-center gap-2 font-mono text-[10px] sm:text-xs">
      <div className="w-2 h-2 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
      <span className={`font-bold tracking-widest ${textColor}`}>SWISS GRID SYSTEM</span>
      <span className={`hidden md:inline px-1.5 py-0.5 rounded text-[9px] border border-blue-500/30 bg-blue-500/10 font-mono ${textColor}`}>
        300 DPI CROP MARKS
      </span>
    </div>
  );

  const svgDefs = (
    <linearGradient id="blueGridGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor={strokeColor} stopOpacity="0.1" />
      <stop offset="50%" stopColor={strokeColor} stopOpacity="0.8" />
      <stop offset="100%" stopColor="#60A5FA" stopOpacity="0.1" />
    </linearGradient>
  );

  const svgContent = (
    <>
      {[100, 180, 260, 340, 420, 500, 580, 660, 740, 820, 900, 980, 1060, 1140].map((x, i) => (
        <line
          key={`col-${i}`}
          x1={x}
          y1="0"
          x2={x}
          y2="400"
          stroke={strokeColor}
          strokeWidth="0.8"
          strokeDasharray={i % 3 === 0 ? "none" : "2 4"}
          opacity={i % 3 === 0 ? "0.4" : "0.2"}
        />
      ))}

      <line x1="0" y1="80" x2="1200" y2="80" stroke={strokeColor} strokeWidth="1" strokeDasharray="4 4" opacity="0.3" />
      <line x1="0" y1="230" x2="1200" y2="230" stroke={strokeColor} strokeWidth="1.5" filter="url(#neonGlowBlue)" opacity="0.6" />
      <line x1="0" y1="320" x2="1200" y2="320" stroke={strokeColor} strokeWidth="1" strokeDasharray="4 4" opacity="0.3" />

      {/* Crop marks */}
      {[
        { x: 120, y: 50 },
        { x: 1080, y: 50 },
        { x: 120, y: 350 },
        { x: 1080, y: 350 }
      ].map((pt, i) => (
        <g key={`crop-${i}`} stroke={strokeColor} strokeWidth="1" opacity="0.7">
          <circle cx={pt.x} cy={pt.y} r="8" fill="none" />
          <line x1={pt.x - 14} y1={pt.y} x2={pt.x + 14} y2={pt.y} />
          <line x1={pt.x} y1={pt.y - 14} x2={pt.x} y2={pt.y + 14} />
        </g>
      ))}

      {/* Ruler ticks */}
      <g stroke={strokeColor} strokeWidth="1" opacity="0.4">
        {[...Array(40)].map((_, i) => (
          <line key={`ruler-${i}`} x1={100 + i * 25} y1="0" x2={100 + i * 25} y2={i % 5 === 0 ? "12" : "6"} />
        ))}
      </g>

      <text x="130" y="45" fill={strokeColor} fontSize="8" fontFamily="monospace" opacity="0.8">A1 POSTER BLEED [3mm]</text>
      <text x="1000" y="45" fill={strokeColor} fontSize="8" fontFamily="monospace" opacity="0.8">300 DPI CMYK</text>
      <text x="130" y="222" fill={strokeColor} fontSize="8" fontFamily="monospace" opacity="0.8">GOLDEN RATIO AXIS [1.618]</text>
    </>
  );

  return (
    <DecorWrapper
      category={CATEGORY}
      theme={theme}
      topRightBadge={badge}
      bottomIndicatorText="SWISS GRAPHIC POSTER & AD LAYOUT"
      svgViewBox="0 0 1200 400"
      svgDefs={svgDefs}
      svgContent={svgContent}
    >
      {/* Floating Poster (Top-Left Safe Zone) */}
      <motion.div
        className="absolute left-[2%] sm:left-[4%] top-[3%] sm:top-[5%] w-26 sm:w-34 h-32 sm:h-40 rounded-2xl border border-blue-500/30 bg-blue-950/20 backdrop-blur-[1px] p-2 flex flex-col justify-between shadow-[0_0_25px_rgba(59,130,246,0.15)] hidden lg:flex opacity-75 hover:opacity-100 transition-opacity will-change-transform z-10"
        style={{ transform: "translateZ(0)", willChange: "transform" }}
        animate={{ y: [0, -6, 0], rotate: [0, -2, 0] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="flex items-center justify-between border-b border-blue-500/20 pb-1">
          <span className="font-mono text-[8px] text-blue-300 font-bold tracking-widest">SWISS POSTER</span>
          <span className="font-mono text-[7px] text-blue-400">700x1000mm</span>
        </div>

        <div className="flex-1 my-2 flex flex-col justify-between border border-blue-500/15 p-1.5 rounded bg-blue-500/5">
          <div className="space-y-1">
            <div className="w-full h-4 bg-blue-400/30 rounded-sm" />
            <div className="w-3/4 h-2 bg-blue-400/20 rounded-sm" />
          </div>

          <div className="w-12 h-12 rounded-full border border-blue-400/40 bg-gradient-to-br from-blue-500/20 to-transparent flex items-center justify-center self-end">
            <div className="w-6 h-6 rounded-full border border-blue-300/60" />
          </div>

          <div className="space-y-0.5">
            <div className="w-full h-1 bg-blue-300/30 rounded-sm" />
            <div className="w-1/2 h-1 bg-blue-300/20 rounded-sm" />
          </div>
        </div>

        <div className="flex items-center gap-1 font-mono text-[7px] text-blue-300/80">
          <div className="w-3 h-2 bg-cyan-400 rounded-xs" />
          <div className="w-3 h-2 bg-pink-500 rounded-xs" />
          <div className="w-3 h-2 bg-yellow-400 rounded-xs" />
          <div className="w-3 h-2 bg-slate-900 border border-blue-400/40 rounded-xs" />
          <span className="ml-auto text-[7px]">CMYK 100%</span>
        </div>
      </motion.div>

      {/* Floating Alignment Card (Bottom-Right Safe Zone) */}
      <motion.div
        className="absolute right-[2%] sm:right-[5%] bottom-[3%] sm:bottom-[5%] w-32 sm:w-40 h-20 sm:h-24 rounded-xl border border-blue-500/30 bg-blue-950/20 backdrop-blur-[1px] p-2.5 flex flex-col justify-between hidden xl:flex opacity-70 hover:opacity-100 transition-opacity shadow-[0_0_25px_rgba(59,130,246,0.15)] z-10"
        animate={{ y: [0, 6, 0], rotate: [0, 1.5, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
      >
        <div className="flex items-center justify-between border-b border-blue-500/20 pb-1">
          <span className="font-mono text-[9px] text-blue-300 font-bold tracking-wider">ALIGNMENT GUIDE</span>
          <span className="w-2 h-2 rounded-full bg-blue-400" />
        </div>

        <div className="flex items-center gap-2 my-1">
          <svg className="w-5 h-5 text-blue-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="9" />
            <line x1="12" y1="1" x2="12" y2="23" />
            <line x1="1" y1="12" x2="23" y2="12" />
          </svg>
          <div className="font-mono text-[8px] text-blue-200/90 leading-tight">
            <div className="font-bold text-blue-300">GRID MATCHED</div>
            <div className="text-blue-400/80">BASELINE: 12pt</div>
          </div>
        </div>

        <div className="w-full flex items-center justify-between font-mono text-[7px] text-blue-400/70">
          <span>KERNING: METRIC</span>
          <span>TRACKING: +25</span>
        </div>
      </motion.div>
    </DecorWrapper>
  );
};
