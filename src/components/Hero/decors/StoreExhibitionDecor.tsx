import React from "react";
import { motion } from "framer-motion";
import { DecorWrapper } from "./DecorWrapper";
import { getCategoryTheme, ThemeMode } from "./themeConfig";

interface DecorProps {
  theme: ThemeMode;
}

const CATEGORY = "實體店面與展覽";

export const StoreExhibitionDecor: React.FC<DecorProps> = ({ theme }) => {
  const { strokeColor, textColor } = getCategoryTheme(CATEGORY, theme);

  const badge = (
    <div className="absolute top-3 right-4 sm:top-6 sm:right-8 flex items-center gap-2 font-mono text-[10px] sm:text-xs">
      <div className="w-2 h-2 rounded-full bg-sky-400 shadow-[0_0_8px_rgba(14,165,233,0.8)]" />
      <span className={`font-bold tracking-widest ${textColor}`}>EXHIBITION FLOOR PLAN</span>
      <span className={`hidden md:inline px-1.5 py-0.5 rounded text-[9px] border border-sky-500/30 bg-sky-500/10 font-mono ${textColor}`}>
        SPATIAL MAPPING 3D
      </span>
    </div>
  );

  const svgDefs = (
    <linearGradient id="lightConeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stopColor={strokeColor} stopOpacity="0.8" />
      <stop offset="100%" stopColor={strokeColor} stopOpacity="0.0" />
    </linearGradient>
  );

  const svgContent = (
    <>
      <g stroke={strokeColor} strokeWidth="1" opacity="0.3">
        {[0, 150, 300, 450, 600, 750, 900, 1050, 1200].map((x, i) => (
          <line key={`pgrid-${i}`} x1="600" y1="40" x2={x} y2="400" strokeDasharray="3 3" />
        ))}
        {[100, 160, 230, 310, 380].map((y, i) => (
          <line key={`p rung-${i}`} x1="100" y1={y} x2="1100" y2={y} strokeDasharray="2 2" />
        ))}
      </g>

      <polygon points="350,20 280,240 420,240" fill="url(#lightConeGrad)" opacity="0.25" />
      <polygon points="850,20 780,260 920,260" fill="url(#lightConeGrad)" opacity="0.25" />

      <g stroke={strokeColor} fill="none" opacity="0.6">
        <rect x="260" y="220" width="160" height="110" strokeWidth="1.5" />
        <rect x="780" y="230" width="160" height="100" strokeWidth="1.5" />
        <path d="M 260 270 L 220 270 M 420 270 L 460 270" strokeWidth="1" strokeDasharray="2 2" />
      </g>

      <motion.circle
        cx="340"
        cy="275"
        r="8"
        fill="none"
        stroke={strokeColor}
        strokeWidth="1.5"
        animate={{ r: [6, 14, 6], opacity: [0.9, 0.2, 0.9] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
      />
      <circle cx="340" cy="275" r="3" fill={strokeColor} />

      <text x="265" y="212" fill={strokeColor} fontSize="9" fontFamily="monospace" opacity="0.8">BOOTH ZONE A [6m x 4m]</text>
      <text x="785" y="222" fill={strokeColor} fontSize="9" fontFamily="monospace" opacity="0.8">EXHIBIT ZONE B [PRIMARY]</text>
    </>
  );

  return (
    <DecorWrapper
      category={CATEGORY}
      theme={theme}
      topRightBadge={badge}
      bottomIndicatorText="PHYSICAL STORE & SPATIAL EXHIBITION"
      svgViewBox="0 0 1200 400"
      svgDefs={svgDefs}
      svgContent={svgContent}
    >
      {/* Floating Display Stand (Top-Left Safe Zone) */}
      <motion.div
        className="absolute left-[2%] sm:left-[4%] top-[3%] sm:top-[5%] w-20 h-20 sm:w-28 sm:h-28 rounded-2xl border border-sky-500/30 bg-sky-950/20 backdrop-blur-[1px] flex flex-col items-center justify-center p-2 shadow-[0_0_25px_rgba(14,165,233,0.15)] hidden lg:flex opacity-75 hover:opacity-100 transition-opacity will-change-transform z-10"
        style={{ transform: "translateZ(0)", willChange: "transform" }}
        animate={{ y: [0, -6, 0], rotate: [0, -2, 0] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg className="w-12 h-12 text-sky-400 drop-shadow-[0_0_10px_rgba(14,165,233,0.5)]" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5">
          <line x1="8" y1="10" x2="56" y2="10" strokeWidth="2" />
          <circle cx="20" cy="10" r="2" fill="currentColor" />
          <circle cx="44" cy="10" r="2" fill="currentColor" />
          <path d="M20 12 L12 42 M20 12 L28 42" strokeDasharray="2 2" opacity="0.6" />
          <path d="M44 12 L36 42 M44 12 L52 42" strokeDasharray="2 2" opacity="0.6" />
          <polygon points="12,54 52,54 44,42 20,42" fill="rgba(14, 165, 233, 0.15)" />
          <rect x="20" y="42" width="24" height="12" strokeWidth="1" />
        </svg>
      </motion.div>

      {/* Floating Spot Pin Card (Bottom-Right Safe Zone) */}
      <motion.div
        className="absolute right-[2%] sm:right-[5%] bottom-[3%] sm:bottom-[5%] w-32 sm:w-40 h-20 sm:h-24 rounded-xl border border-sky-500/30 bg-sky-950/20 backdrop-blur-[1px] p-2.5 flex flex-col justify-between hidden xl:flex opacity-70 hover:opacity-100 transition-opacity shadow-[0_0_25px_rgba(14,165,233,0.15)] z-10"
        animate={{ y: [0, 6, 0], rotate: [0, 1.5, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
      >
        <div className="flex items-center justify-between border-b border-sky-500/20 pb-1">
          <span className="font-mono text-[9px] text-sky-300 font-bold tracking-wider">SPATIAL SPOT</span>
          <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
        </div>

        <div className="flex items-center gap-2 my-1">
          <svg className="w-5 h-5 text-sky-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          <div className="font-mono text-[8px] text-sky-200/90 leading-tight">
            <div className="font-bold text-sky-300">BOOTH A-08</div>
            <div className="text-sky-400/80">SPOTLIGHT: 3500K</div>
          </div>
        </div>

        <div className="w-full flex items-center justify-between font-mono text-[7px] text-sky-400/70">
          <span>LUX: 1200</span>
          <span>ANGLE: 45°</span>
        </div>
      </motion.div>
    </DecorWrapper>
  );
};
