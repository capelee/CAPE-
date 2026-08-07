import React from "react";
import { motion } from "framer-motion";
import { DecorWrapper } from "./DecorWrapper";
import { getCategoryTheme, ThemeMode } from "./themeConfig";

interface DecorProps {
  theme: ThemeMode;
}

const CATEGORY = "商務印刷品設計";

export const BusinessPrintDecor: React.FC<DecorProps> = ({ theme }) => {
  const { strokeColor, textColor } = getCategoryTheme(CATEGORY, theme);

  const badge = (
    <div className="absolute top-3 right-4 sm:top-6 sm:right-8 flex items-center gap-2 font-mono text-[10px] sm:text-xs">
      <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
      <span className={`font-bold tracking-widest ${textColor}`}>BUSINESS PRINT & FOIL</span>
      <span className={`hidden md:inline px-1.5 py-0.5 rounded text-[9px] border border-emerald-500/30 bg-emerald-500/10 font-mono ${textColor}`}>
        350GSM COTTON PAPER
      </span>
    </div>
  );

  const svgDefs = (
    <>
      <pattern id="halftonePattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
        <circle cx="2" cy="2" r="1.2" fill={strokeColor} opacity="0.3" />
        <circle cx="12" cy="12" r="1.8" fill={strokeColor} opacity="0.4" />
        <circle cx="12" cy="2" r="0.8" fill={strokeColor} opacity="0.2" />
        <circle cx="2" cy="12" r="1" fill={strokeColor} opacity="0.25" />
      </pattern>

      <linearGradient id="emeraldGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor={strokeColor} stopOpacity="0.1" />
        <stop offset="50%" stopColor={strokeColor} stopOpacity="0.8" />
        <stop offset="100%" stopColor="#34D399" stopOpacity="0.1" />
      </linearGradient>
    </>
  );

  const svgContent = (
    <>
      <rect x="0" y="0" width="1200" height="400" fill="url(#halftonePattern)" opacity="0.6" />

      {/* Crease & Score Lines */}
      <g stroke={strokeColor} fill="none" opacity="0.5">
        <line x1="400" y1="20" x2="400" y2="380" strokeWidth="1.5" strokeDasharray="6 3" />
        <line x1="800" y1="20" x2="800" y2="380" strokeWidth="1.5" strokeDasharray="6 3" />
        {/* Merged arrows */}
        <path d="M 390 200 L 400 190 L 410 200 M 790 200 L 800 210 L 810 200" strokeWidth="1" />
      </g>

      <g fill="none" stroke={strokeColor} opacity="0.4">
        <rect x="480" y="100" width="240" height="140" rx="6" transform="rotate(-6, 600, 170)" strokeWidth="1" strokeDasharray="3 2" />
        <rect x="490" y="110" width="240" height="140" rx="6" transform="rotate(3, 610, 180)" strokeWidth="1.5" />
      </g>

      {/* Registration Mark & CMYK Patches */}
      <g stroke={strokeColor} strokeWidth="1" opacity="0.7">
        <circle cx="600" cy="360" r="10" fill="none" />
        <path d="M 585 360 L 615 360 M 600 345 L 600 375" />

        <rect x="520" y="375" width="12" height="12" fill="#00FFFF" opacity="0.8" />
        <rect x="536" y="375" width="12" height="12" fill="#FF00FF" opacity="0.8" />
        <rect x="552" y="375" width="12" height="12" fill="#FFFF00" opacity="0.8" />
        <rect x="568" y="375" width="12" height="12" fill="#000000" opacity="0.8" />
        <rect x="620" y="375" width="12" height="12" fill={strokeColor} opacity="0.8" />
        <rect x="636" y="375" width="12" height="12" fill="#34D399" opacity="0.8" />
        <rect x="652" y="375" width="12" height="12" fill="#D1FAE5" opacity="0.8" />
        <rect x="668" y="375" width="12" height="12" fill="#065F46" opacity="0.8" />
      </g>

      <text x="410" y="45" fill={strokeColor} fontSize="8" fontFamily="monospace" opacity="0.8">SCORE LINE 01 [FOLD INSIDE]</text>
      <text x="810" y="45" fill={strokeColor} fontSize="8" fontFamily="monospace" opacity="0.8">SCORE LINE 02 [FOLD OUTSIDE]</text>
      <text x="600" y="335" fill={strokeColor} fontSize="8" fontFamily="monospace" textAnchor="middle" opacity="0.8">PASS 01: HOT FOIL STAMP [GOLD 100%]</text>
    </>
  );

  return (
    <DecorWrapper
      category={CATEGORY}
      theme={theme}
      topRightBadge={badge}
      bottomIndicatorText="CMYK PRINTING & FOIL STAMPING SPECIFICATION"
      svgViewBox="0 0 1200 400"
      svgDefs={svgDefs}
      svgContent={svgContent}
    >
      {/* Floating Business Card (Top-Left Safe Zone) */}
      <motion.div
        className="absolute left-[2%] sm:left-[4%] top-[3%] sm:top-[5%] w-30 sm:w-38 h-20 sm:h-26 rounded-2xl border border-emerald-500/30 bg-emerald-950/20 backdrop-blur-[1px] p-2.5 flex flex-col justify-between shadow-[0_0_25px_rgba(16,185,129,0.15)] hidden lg:flex opacity-75 hover:opacity-100 transition-opacity will-change-transform z-10"
        style={{ transform: "translateZ(0)", willChange: "transform" }}
        animate={{ y: [0, -6, 0], rotate: [0, -2, 0] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <svg className="w-5 h-5 text-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.8)]" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="12,2 22,8.5 12,15 2,8.5" />
              <polygon points="12,15 22,8.5 22,17.5 12,22" opacity="0.7" />
              <polygon points="12,15 2,8.5 2,17.5 12,22" opacity="0.85" />
            </svg>
            <span className="font-mono text-[9px] text-emerald-200 font-bold tracking-widest">EXECUTIVE</span>
          </div>
          <span className="font-mono text-[7px] text-amber-400 border border-amber-400/40 bg-amber-400/10 px-1 rounded">HOT FOIL</span>
        </div>

        <div className="space-y-1 my-1">
          <div className="w-3/4 h-1.5 bg-emerald-300/40 rounded" />
          <div className="w-1/2 h-1 bg-emerald-400/25 rounded" />
        </div>

        <div className="flex justify-between items-center font-mono text-[7px] text-emerald-300/70 pt-1 border-t border-emerald-500/20">
          <span>350GSM COTTON</span>
          <span>SPOT UV</span>
        </div>
      </motion.div>

      {/* Floating Spec Card (Bottom-Right Safe Zone) */}
      <motion.div
        className="absolute right-[2%] sm:right-[5%] bottom-[3%] sm:bottom-[5%] w-32 sm:w-40 h-20 sm:h-24 rounded-xl border border-emerald-500/30 bg-emerald-950/20 backdrop-blur-[1px] p-2.5 flex flex-col justify-between hidden xl:flex opacity-70 hover:opacity-100 transition-opacity shadow-[0_0_25px_rgba(16,185,129,0.15)] z-10"
        animate={{ y: [0, 6, 0], rotate: [0, 1.5, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
      >
        <div className="flex items-center justify-between border-b border-emerald-500/20 pb-1">
          <span className="font-mono text-[9px] text-emerald-300 font-bold tracking-wider">PAPER SPEC</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
        </div>

        <div className="flex items-center gap-2 my-1">
          <svg className="w-5 h-5 text-emerald-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
          </svg>
          <div className="font-mono text-[8px] text-emerald-200/90 leading-tight">
            <div className="font-bold text-emerald-300">COTTON TEXTURE</div>
            <div className="text-emerald-400/80">BLEED: 2.0MM</div>
          </div>
        </div>

        <div className="w-full flex items-center justify-between font-mono text-[7px] text-emerald-400/70">
          <span>PANTONE: 7724 C</span>
          <span>DENSITY: 1.45</span>
        </div>
      </motion.div>
    </DecorWrapper>
  );
};
