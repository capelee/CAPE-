import React from "react";
import { motion } from "framer-motion";
import { DecorWrapper } from "./DecorWrapper";
import { getCategoryTheme, ThemeMode } from "./themeConfig";

interface DecorProps {
  theme: ThemeMode;
}

const CATEGORY = "角色 IP & 插畫與貼圖";

export const IpIllustrationDecor: React.FC<DecorProps> = ({ theme }) => {
  const { strokeColor, textColor } = getCategoryTheme(CATEGORY, theme);

  const badge = (
    <div className="absolute top-3 right-4 sm:top-6 sm:right-8 flex items-center gap-2 font-mono text-[10px] sm:text-xs">
      <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
      <span className={`font-bold tracking-widest ${textColor}`}>CHARACTER IP & ILLUSTRATION</span>
      <span className={`hidden md:inline px-1.5 py-0.5 rounded text-[9px] border border-cyan-500/30 bg-cyan-500/10 font-mono ${textColor}`}>
        PRESSURE 8192 LEVELS
      </span>
    </div>
  );

  const svgDefs = (
    <linearGradient id="cyanBrush" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor={strokeColor} stopOpacity="0.1" />
      <stop offset="40%" stopColor={strokeColor} stopOpacity="0.8" />
      <stop offset="80%" stopColor="#22D3EE" stopOpacity="0.9" />
      <stop offset="100%" stopColor={strokeColor} stopOpacity="0.1" />
    </linearGradient>
  );

  const svgContent = (
    <>
      <path
        d="M 150,80 Q 280,20 400,120 T 650,140 Q 800,260 950,180 T 1150,220"
        fill="none"
        stroke={strokeColor}
        strokeWidth="1.5"
        strokeDasharray="6 4"
        opacity="0.4"
      />

      <motion.path
        d="M 80,280 C 250,100 450,360 650,180 C 850,0 1000,260 1120,140"
        fill="none"
        stroke="url(#cyanBrush)"
        strokeWidth="3"
        filter="url(#neonGlowCyan)"
        animate={{
          d: [
            "M 80,280 C 250,100 450,360 650,180 C 850,0 1000,260 1120,140",
            "M 80,250 C 250,140 450,320 650,210 C 850,40 1000,230 1120,180",
            "M 80,280 C 250,100 450,360 650,180 C 850,0 1000,260 1120,140"
          ]
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Speech Bubble in SVG Background */}
      <path
        d="M 520,100 C 520,60 680,60 680,100 C 680,140 600,140 580,170 C 570,140 520,140 520,100 Z"
        fill="rgba(6, 182, 212, 0.08)"
        stroke={strokeColor}
        strokeWidth="1.5"
        strokeDasharray="4 2"
        opacity="0.6"
      />

      {/* Sparkle Stars */}
      {[
        { cx: 220, cy: 100, scale: 1 },
        { cx: 480, cy: 260, scale: 0.8 },
        { cx: 780, cy: 80, scale: 1.2 },
        { cx: 1020, cy: 300, scale: 0.9 }
      ].map((star, idx) => (
        <motion.path
          key={`star-${idx}`}
          d={`M ${star.cx} ${star.cy - 12 * star.scale} Q ${star.cx} ${star.cy} ${star.cx + 12 * star.scale} ${star.cy} Q ${star.cx} ${star.cy} ${star.cx} ${star.cy + 12 * star.scale} Q ${star.cx} ${star.cy} ${star.cx - 12 * star.scale} ${star.cy} Q ${star.cx} ${star.cy} ${star.cx} ${star.cy - 12 * star.scale}`}
          fill={strokeColor}
          opacity="0.7"
          animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.4, 0.9, 0.4] }}
          transition={{ duration: 2 + idx, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}

      <text x="545" y="102" fill={strokeColor} fontSize="11" fontFamily="monospace" fontWeight="bold" opacity="0.9">
        KAWAII IP!
      </text>
    </>
  );

  return (
    <DecorWrapper
      category={CATEGORY}
      theme={theme}
      topRightBadge={badge}
      bottomIndicatorText="CHARACTER IP & STICKER ARTWORK"
      svgViewBox="0 0 1200 400"
      svgDefs={svgDefs}
      svgContent={svgContent}
    >
      {/* Floating Cat Character Avatar (Top-Left Safe Zone) */}
      <motion.div
        className="absolute left-[2%] sm:left-[4%] top-[3%] sm:top-[5%] w-24 h-24 sm:w-28 sm:h-28 rounded-full border-2 border-dashed border-cyan-400 bg-cyan-950/20 backdrop-blur-[1px] flex items-center justify-center p-2 shadow-[0_0_25px_rgba(6,182,212,0.18)] hidden lg:flex opacity-75 hover:opacity-100 transition-opacity z-10"
        style={{ transform: "translateZ(0)", willChange: "transform" }}
        animate={{ y: [0, -6, 0], rotate: [0, -2, 0] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg className="w-14 h-14 text-cyan-300 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]" viewBox="0 0 64 64" fill="none">
          <path d="M 12 26 L 16 8 C 17 6, 21 8, 25 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="rgba(6,182,212,0.2)" />
          <path d="M 52 26 L 48 8 C 47 6, 43 8, 39 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="rgba(6,182,212,0.2)" />
          <path d="M 12 26 C 8 36, 12 54, 32 54 C 52 54, 56 36, 52 26 C 45 20, 39 16, 32 16 C 25 16, 19 20, 12 26 Z" fill="rgba(6,182,212,0.15)" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <ellipse cx="23" cy="33" rx="3" ry="4" fill="currentColor" />
          <ellipse cx="41" cy="33" rx="3" ry="4" fill="currentColor" />
          <circle cx="24" cy="32" r="1" fill="#fff" />
          <circle cx="42" cy="32" r="1" fill="#fff" />
          <path d="M 30.5 38.5 L 33.5 38.5 L 32 40.5 Z" fill="#F43F5E" />
          <path d="M 28 42.5 Q 30 44.5 32 42.5 Q 34 44.5 36 42.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
          <circle cx="16" cy="38" r="4" fill="rgba(244,63,94,0.4)" />
          <circle cx="48" cy="38" r="4" fill="rgba(244,63,94,0.4)" />
        </svg>
      </motion.div>

      {/* Floating Window: Stylus Pressure & Digital Illustration Palette (Bottom-Right Safe Zone) */}
      <motion.div
        className="absolute right-[2%] sm:right-[5%] bottom-[3%] sm:bottom-[5%] w-34 sm:w-42 h-22 sm:h-26 rounded-xl border border-cyan-500/35 bg-cyan-950/20 backdrop-blur-[2px] p-2 flex flex-col justify-between hidden xl:flex opacity-70 hover:opacity-100 transition-opacity z-10"
        animate={{ y: [0, 6, 0], rotate: [0, 1.5, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
      >
        <div className="flex items-center justify-between border-b border-cyan-500/20 pb-1">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
            <span className="font-mono text-[8px] text-cyan-200 font-bold tracking-wider">STYLUS PRESSURE</span>
          </div>
          <span className="font-mono text-[7px] text-cyan-300">
            PROCREATE
          </span>
        </div>

        <div className="flex items-center gap-2 my-0.5">
          <div className="w-6 h-6 rounded-lg border border-cyan-400/40 bg-cyan-500/20 flex items-center justify-center shrink-0">
            <svg className="w-4 h-4 text-cyan-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 19l7-7 3 3-7 7-3-3z" />
              <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
            </svg>
          </div>
          <div className="font-mono text-[8px] text-cyan-200/90 leading-tight">
            <div className="font-bold text-cyan-300">8192 感壓階段</div>
          </div>
        </div>

        <div className="space-y-1">
          <div className="w-full h-1 bg-cyan-950 rounded-full overflow-hidden border border-cyan-500/20">
            <motion.div
              className="h-full bg-gradient-to-r from-cyan-400 to-teal-300 rounded-full"
              animate={{ width: ["10%", "90%", "35%", "100%", "10%"] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        </div>
      </motion.div>
    </DecorWrapper>
  );
};
