import React from "react";
import { motion } from "framer-motion";
import { DecorWrapper } from "./DecorWrapper";
import { getCategoryTheme, ThemeMode } from "./themeConfig";

interface DecorProps {
  theme: ThemeMode;
}

const CATEGORY = "商品周邊企業禮贈品";

export const MerchandiseGiftsDecor: React.FC<DecorProps> = ({ theme }) => {
  const { strokeColor, textColor } = getCategoryTheme(CATEGORY, theme);

  const badge = (
    <div className="absolute top-3 right-4 sm:top-6 sm:right-8 flex items-center gap-2 font-mono text-[10px] sm:text-xs">
      <div className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.8)]" />
      <span className={`font-bold tracking-widest ${textColor}`}>DIE-CUT PACKAGING</span>
      <span className={`hidden md:inline px-1.5 py-0.5 rounded text-[9px] border border-amber-500/30 bg-amber-500/10 font-mono ${textColor}`}>
        CRAFT GIFT v2.0
      </span>
    </div>
  );

  const svgDefs = (
    <linearGradient id="amberRibbon" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stopColor={strokeColor} stopOpacity="0.1" />
      <stop offset="40%" stopColor={strokeColor} stopOpacity="0.8" />
      <stop offset="70%" stopColor="#FCD34D" stopOpacity="0.9" />
      <stop offset="100%" stopColor={strokeColor} stopOpacity="0.1" />
    </linearGradient>
  );

  const svgContent = (
    <>
      <g stroke={strokeColor} fill="none" opacity="0.4">
        <rect x="520" y="140" width="160" height="120" strokeWidth="1.5" />
        <rect x="520" y="60" width="160" height="80" strokeWidth="1" strokeDasharray="3 3" />
        <rect x="520" y="260" width="160" height="80" strokeWidth="1" strokeDasharray="3 3" />
        <rect x="420" y="140" width="100" height="120" strokeWidth="1" strokeDasharray="3 3" />
        <rect x="680" y="140" width="100" height="120" strokeWidth="1" strokeDasharray="3 3" />

        {/* Merged corner cut markers */}
        <path
          d="M 400 140 L 420 120 M 780 120 L 800 140 M 400 260 L 420 280 M 780 280 L 800 260"
          strokeWidth="1"
        />
      </g>

      <motion.path
        d="M 100,320 C 300,120 500,380 700,160 C 900,-20 1050,280 1200,200"
        fill="none"
        stroke="url(#amberRibbon)"
        strokeWidth="2.5"
        strokeDasharray="8 4"
        filter="url(#neonGlowAmber)"
        animate={{
          d: [
            "M 100,320 C 300,120 500,380 700,160 C 900,-20 1050,280 1200,200",
            "M 100,280 C 300,160 500,320 700,200 C 900,20 1050,240 1200,240",
            "M 100,320 C 300,120 500,380 700,160 C 900,-20 1050,280 1200,200"
          ]
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

      <text x="525" y="132" fill={strokeColor} fontSize="9" fontFamily="monospace" opacity="0.8">WIDTH: 160mm</text>
      <text x="685" y="205" fill={strokeColor} fontSize="9" fontFamily="monospace" opacity="0.8">DEPTH: 100mm</text>
      <text x="525" y="275" fill={strokeColor} fontSize="9" fontFamily="monospace" opacity="0.8">FOLD LINE [0.8pt]</text>
    </>
  );

  return (
    <DecorWrapper
      category={CATEGORY}
      theme={theme}
      topRightBadge={badge}
      bottomIndicatorText="DIE-CUT PACKAGING & MERCHANDISE CRAFT"
      svgViewBox="0 0 1200 400"
      svgDefs={svgDefs}
      svgContent={svgContent}
    >
      {/* Floating Gift Box (Top-Left Safe Zone) */}
      <motion.div
        className="absolute left-[2%] sm:left-[4%] top-[3%] sm:top-[5%] w-20 h-20 sm:w-28 sm:h-28 rounded-2xl border border-amber-500/30 bg-amber-950/20 backdrop-blur-[1px] flex items-center justify-center p-2 shadow-[0_0_25px_rgba(245,158,11,0.15)] hidden lg:flex opacity-75 hover:opacity-100 transition-opacity will-change-transform z-10"
        style={{ transform: "translateZ(0)", willChange: "transform" }}
        animate={{ y: [0, -6, 0], rotate: [0, -2, 0] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg className="w-12 h-12 text-amber-400 drop-shadow-[0_0_10px_rgba(245,158,11,0.5)]" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M32 6 L56 18 L32 30 L8 18 Z" fill="rgba(245, 158, 11, 0.15)" strokeLinejoin="round" />
          <path d="M8 18 L32 30 L32 58 L8 46 Z" fill="rgba(245, 158, 11, 0.08)" strokeLinejoin="round" />
          <path d="M56 18 L32 30 L32 58 L56 46 Z" fill="rgba(245, 158, 11, 0.2)" strokeLinejoin="round" />
          <path d="M32 6 L32 58" stroke="#FCD34D" strokeWidth="2" />
          <path d="M8 18 L56 46" stroke="#FCD34D" strokeWidth="1.5" strokeDasharray="3 2" />
          <path d="M56 18 L8 46" stroke="#FCD34D" strokeWidth="1.5" strokeDasharray="3 2" />
        </svg>
      </motion.div>

      {/* Floating Stamp Badge (Bottom-Right Safe Zone) */}
      <motion.div
        className="absolute right-[2%] sm:right-[5%] bottom-[3%] sm:bottom-[5%] w-32 sm:w-40 h-20 sm:h-24 rounded-xl border border-amber-500/30 bg-amber-950/20 backdrop-blur-[1px] p-2.5 flex items-center gap-3 hidden xl:flex opacity-70 hover:opacity-100 transition-opacity shadow-[0_0_25px_rgba(245,158,11,0.15)] z-10"
        animate={{ y: [0, 6, 0], rotate: [0, 1.5, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
      >
        <div className="w-10 h-10 rounded-full border-2 border-dashed border-amber-400 flex items-center justify-center shrink-0 bg-amber-500/10">
          <svg className="w-5 h-5 text-amber-400" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l2.4 5 5.6.8-4 4 1 5.6-5-2.6-5 2.6 1-5.6-4-4 5.6-.8z" />
          </svg>
        </div>

        <div className="font-mono text-[8px] text-amber-200/90 leading-tight">
          <div className="font-bold text-amber-300 tracking-wider">PREMIUM QUALITY</div>
          <div className="text-amber-400/80 mt-0.5">CERTIFIED CRAFT</div>
          <div className="text-[7px] text-amber-500/70 mt-1">100% TAILOR MADE</div>
        </div>
      </motion.div>
    </DecorWrapper>
  );
};
