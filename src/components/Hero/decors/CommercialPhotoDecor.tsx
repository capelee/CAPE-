import React from "react";
import { motion } from "framer-motion";
import { DecorWrapper } from "./DecorWrapper";
import { PerspectiveGrid } from "./PerspectiveGrid";
import { getCategoryTheme, ThemeMode } from "./themeConfig";

interface DecorProps {
  theme: ThemeMode;
}

const CATEGORY = "商業視覺攝影";

export const CommercialPhotoDecor: React.FC<DecorProps> = ({ theme }) => {
  const { strokeColor, textColor } = getCategoryTheme(CATEGORY, theme);

  const badge = (
    <div className="absolute top-3 right-4 sm:top-6 sm:right-8 flex items-center gap-2 font-mono text-[10px] sm:text-xs">
      <div className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.8)]" />
      <span className={`font-bold tracking-widest ${textColor}`}>CAMERA VIEWFINDER HUD</span>
      <span className={`hidden md:inline px-1.5 py-0.5 rounded text-[9px] border border-rose-500/30 bg-rose-500/10 font-mono ${textColor}`}>
        RAW 14-BIT PROPHOTO
      </span>
    </div>
  );

  const svgDefs = (
    <linearGradient id="roseFlareGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor={strokeColor} stopOpacity="0.1" />
      <stop offset="50%" stopColor={strokeColor} stopOpacity="0.8" />
      <stop offset="100%" stopColor="#FB7185" stopOpacity="0.1" />
    </linearGradient>
  );

  const svgContent = (
    <>
      <PerspectiveGrid
        strokeColor={strokeColor}
        horizontalLines={["133px", "266px"]}
        verticalLines={["400px", "800px"]}
        strokeWidth={1}
        strokeDasharray="4 4"
        opacity={0.3}
      />

      {[
        { x: 400, y: 133 },
        { x: 800, y: 133 },
        { x: 400, y: 266 },
        { x: 800, y: 266 }
      ].map((pt, i) => (
        <g key={`focal-${i}`} stroke={strokeColor} strokeWidth="1.2" opacity="0.8">
          <path d={`M ${pt.x - 12},${pt.y - 6} L ${pt.x - 12},${pt.y - 12} L ${pt.x - 6},${pt.y - 12}`} fill="none" />
          <path d={`M ${pt.x + 6},${pt.y - 12} L ${pt.x + 12},${pt.y - 12} L ${pt.x + 12},${pt.y - 6}`} fill="none" />
          <path d={`M ${pt.x - 12},${pt.y + 6} L ${pt.x - 12},${pt.y + 12} L ${pt.x - 6},${pt.y + 12}`} fill="none" />
          <path d={`M ${pt.x + 6},${pt.y + 12} L ${pt.x + 12},${pt.y + 12} L ${pt.x + 12},${pt.y + 6}`} fill="none" />
          <circle cx={pt.x} cy={pt.y} r="2" fill={strokeColor} />
        </g>
      ))}

      <g stroke={strokeColor} strokeWidth="1" opacity="0.7">
        <circle cx="600" cy="200" r="45" fill="none" strokeDasharray="3 3" />
        <circle cx="600" cy="200" r="18" fill="none" />
        <circle cx="600" cy="200" r="3" fill={strokeColor} />
        <path d="M 540 200 L 575 200 M 625 200 L 660 200 M 600 140 L 600 175 M 600 225 L 600 260" />
      </g>

      <motion.g
        transform="translate(600, 200)"
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        opacity="0.4"
      >
        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, idx) => (
          <polygon
            key={`aperture-blade-${idx}`}
            points="0,0 80,-30 110,20 20,40"
            fill="none"
            stroke={strokeColor}
            strokeWidth="1"
            transform={`rotate(${deg})`}
          />
        ))}
      </motion.g>

      <path
        d="M 100,380 Q 600,80 1100,320"
        fill="none"
        stroke="url(#roseFlareGrad)"
        strokeWidth="2.5"
        filter="url(#neonGlowRose)"
        opacity="0.8"
      />

      <g transform="translate(800, 133)">
        <motion.circle
          cx="0"
          cy="0"
          r="30"
          fill="rgba(244, 63, 94, 0.15)"
          stroke={strokeColor}
          strokeWidth="1.5"
          animate={{ scale: [0.8, 1.8, 0.8], opacity: [0.2, 0.8, 0.2] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        />
      </g>

      <text x="410" y="125" fill={strokeColor} fontSize="8" fontFamily="monospace" opacity="0.8">AF-POINT [EYE-TRACKING]</text>
      <text x="810" y="125" fill={strokeColor} fontSize="8" fontFamily="monospace" opacity="0.8">STROBE READY 100%</text>
      <text x="560" y="260" fill={strokeColor} fontSize="9" fontFamily="monospace" opacity="0.9">f/1.4 1/8000s ISO 100</text>
    </>
  );

  return (
    <DecorWrapper
      category={CATEGORY}
      theme={theme}
      topRightBadge={badge}
      bottomIndicatorText="COMMERCIAL PHOTOGRAPHY & STUDIO LIGHTING"
      svgViewBox="0 0 1200 400"
      svgDefs={svgDefs}
      svgContent={svgContent}
    >
      {/* Floating Lens Spec Card (Top-Left Safe Zone) */}
      <motion.div
        className="absolute left-[2%] sm:left-[4%] top-[3%] sm:top-[5%] w-30 sm:w-40 h-24 sm:h-30 rounded-2xl border border-rose-500/30 bg-rose-950/20 backdrop-blur-[1px] p-2 flex flex-col justify-between shadow-[0_0_25px_rgba(244,63,94,0.15)] hidden lg:flex opacity-75 hover:opacity-100 transition-opacity will-change-transform z-10"
        style={{ transform: "translateZ(0)", willChange: "transform" }}
        animate={{ y: [0, -6, 0], rotate: [0, -2, 0] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="flex items-center justify-between border-b border-rose-500/20 pb-1.5">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            <span className="font-mono text-[9px] text-rose-300 font-bold tracking-wider">50MM F/1.2 PRIME</span>
          </div>
          <span className="font-mono text-[8px] bg-rose-500/20 text-rose-300 border border-rose-500/30 px-1 rounded">STUDIO</span>
        </div>

        <div className="flex-1 my-1.5 flex items-center justify-between gap-2 border border-rose-500/15 p-1.5 rounded bg-rose-500/5">
          <div className="w-10 h-10 rounded-lg border border-rose-400/40 bg-rose-500/20 flex items-center justify-center shrink-0">
            <svg className="w-5 h-5 text-rose-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
              <circle cx="12" cy="13" r="4" />
            </svg>
          </div>

          <div className="flex-1 font-mono text-[8px] text-rose-200/90 leading-tight space-y-0.5">
            <div className="font-bold text-rose-300">AV: f/1.4</div>
            <div className="text-rose-400/80">TV: 1/8000s</div>
            <div className="text-rose-400/80">ISO: 100 [NATURAL]</div>
          </div>
        </div>

        <div className="flex items-center justify-between font-mono text-[7px] text-rose-400/70 border-t border-rose-500/20 pt-1">
          <span>FULL FRAME 35MM</span>
          <span>PROPHOTO RGB</span>
        </div>
      </motion.div>

      {/* Floating Focus Lock Card (Bottom-Right Safe Zone) */}
      <motion.div
        className="absolute right-[2%] sm:right-[5%] bottom-[3%] sm:bottom-[5%] w-32 sm:w-40 h-22 sm:h-26 rounded-xl border border-rose-500/30 bg-rose-950/20 backdrop-blur-[1px] p-2.5 flex flex-col justify-between hidden xl:flex opacity-70 hover:opacity-100 transition-opacity shadow-[0_0_25px_rgba(244,63,94,0.15)] z-10"
        animate={{ y: [0, 6, 0], rotate: [0, 1.5, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
      >
        <div className="flex items-center justify-between border-b border-rose-500/20 pb-1">
          <span className="font-mono text-[9px] text-rose-300 font-bold tracking-wider">FOCUS & LIGHTING</span>
          <svg className="w-3.5 h-3.5 text-rose-400" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
          </svg>
        </div>

        <div className="flex items-center gap-2 my-1">
          <div className="w-8 h-8 rounded-full border border-rose-400/50 bg-rose-500/20 flex items-center justify-center shrink-0">
            <svg className="w-4 h-4 text-rose-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="9" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </div>

          <div className="font-mono text-[8px] text-rose-200/90 leading-tight">
            <div className="font-bold text-rose-300">EYE-AF LOCK</div>
            <div className="text-rose-400/80">FLASH: 5600K STROBE</div>
          </div>
        </div>

        <div className="w-full flex items-center justify-between font-mono text-[7px] text-rose-400/70">
          <span>BIT DEPTH: 14-BIT</span>
          <span>SHADOW: -0.3EV</span>
        </div>
      </motion.div>
    </DecorWrapper>
  );
};
