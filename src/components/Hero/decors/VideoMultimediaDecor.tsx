import React from "react";
import { motion } from "framer-motion";
import { DecorWrapper } from "./DecorWrapper";
import { getCategoryTheme, ThemeMode } from "./themeConfig";

interface DecorProps {
  theme: ThemeMode;
}

const CATEGORY = "影音與多媒體設計";

// Generate merged timeline tick mark path (25 ticks in 1 path)
const TIMELINE_TICKS_PATH = (() => {
  const segments: string[] = ["M 5% 92% L 95% 92%"];
  for (let i = 0; i < 25; i++) {
    const x = 5 + i * 3.75;
    const isMajor = i % 5 === 0;
    const y1 = isMajor ? "88%" : "90%";
    segments.push(`M ${x}% ${y1} L ${x}% 92%`);
  }
  return segments.join(" ");
})();

export const VideoMultimediaDecor: React.FC<DecorProps> = ({ theme }) => {
  const { strokeColor, textColor } = getCategoryTheme(CATEGORY, theme);

  const badge = (
    <div className="absolute top-3 right-4 sm:top-6 sm:right-8 flex items-center gap-2 font-mono text-[10px] sm:text-xs">
      <motion.div
        animate={{ opacity: [1, 0.2, 1] }}
        transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
        className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]"
      />
      <span className={`font-bold tracking-widest ${textColor}`}>REC 00:04:28:12</span>
      <span className={`hidden md:inline px-1.5 py-0.5 rounded text-[9px] border border-purple-500/30 bg-purple-500/10 font-mono ${textColor}`}>
        4K RAW 60FPS
      </span>
    </div>
  );

  const svgDefs = (
    <linearGradient id="waveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stopColor={strokeColor} stopOpacity="0.1" />
      <stop offset="30%" stopColor={strokeColor} stopOpacity="0.8" />
      <stop offset="70%" stopColor="#C084FC" stopOpacity="0.9" />
      <stop offset="100%" stopColor={strokeColor} stopOpacity="0.1" />
    </linearGradient>
  );

  const svgContent = (
    <>
      <motion.path
        d="M 0 160 Q 150 110, 300 160 T 600 160 T 900 160 T 1200 160 T 1600 160"
        fill="none"
        stroke="url(#waveGrad)"
        strokeWidth="2.5"
        strokeDasharray="6 4"
        filter="url(#neonGlowPurple)"
        animate={{
          d: [
            "M 0 160 Q 150 110, 300 160 T 600 160 T 900 160 T 1200 160 T 1600 160",
            "M 0 160 Q 150 210, 300 160 T 600 160 T 900 160 T 1200 160 T 1600 160",
            "M 0 160 Q 150 110, 300 160 T 600 160 T 900 160 T 1200 160 T 1600 160"
          ]
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Consolidated timeline line & ticks path */}
      <path
        d={TIMELINE_TICKS_PATH}
        stroke={strokeColor}
        strokeWidth="1"
        strokeDasharray="2 2"
        opacity="0.6"
        fill="none"
      />
    </>
  );

  return (
    <DecorWrapper
      category={CATEGORY}
      theme={theme}
      topRightBadge={badge}
      bottomIndicatorText="TIMELINE PLAYHEAD"
      preserveAspectRatio="none"
      svgOpacityClass="opacity-35 dark:opacity-50"
      svgDefs={svgDefs}
      svgContent={svgContent}
    >
      {/* Viewfinder Corners */}
      <div className="absolute inset-2 sm:inset-6 md:inset-8 border border-transparent">
        <svg className="absolute top-0 left-0 w-8 h-8 sm:w-12 sm:h-12 opacity-40 dark:opacity-60" viewBox="0 0 40 40">
          <path d="M0 14 V0 H14" fill="none" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" />
          <circle cx="4" cy="4" r="1.5" fill={strokeColor} />
        </svg>
        <svg className="absolute top-0 right-0 w-8 h-8 sm:w-12 sm:h-12 opacity-40 dark:opacity-60" viewBox="0 0 40 40">
          <path d="M40 14 V0 H26" fill="none" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" />
          <circle cx="36" cy="4" r="1.5" fill={strokeColor} />
        </svg>
        <svg className="absolute bottom-0 left-0 w-8 h-8 sm:w-12 sm:h-12 opacity-40 dark:opacity-60" viewBox="0 0 40 40">
          <path d="M0 26 V40 H14" fill="none" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" />
          <circle cx="4" cy="36" r="1.5" fill={strokeColor} />
        </svg>
        <svg className="absolute bottom-0 right-0 w-8 h-8 sm:w-12 sm:h-12 opacity-40 dark:opacity-60" viewBox="0 0 40 40">
          <path d="M40 26 V40 H26" fill="none" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" />
          <circle cx="36" cy="36" r="1.5" fill={strokeColor} />
        </svg>
      </div>

      {/* Central Audio Waveform Equalizer */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-32 flex items-center justify-between px-8 opacity-25 dark:opacity-35 pointer-events-none">
        {[
          18, 35, 62, 28, 85, 45, 95, 70, 30, 80, 50, 90, 100, 65, 40, 85, 55, 75,
          35, 90, 60, 40, 70, 25, 80, 95, 50, 30, 65, 45, 88, 72, 38, 52, 20
        ].map((heightPct, idx) => (
          <motion.div
            key={`eq-bar-${idx}`}
            className="w-1 md:w-1.5 rounded-full bg-gradient-to-t from-purple-600/40 via-purple-500 to-purple-400 will-change-transform"
            style={{ height: `${heightPct}%`, transform: 'translateZ(0)', willChange: 'transform' }}
            animate={{
              scaleY: [1, 0.3 + (idx % 5) * 0.15, 1.1, 0.4, 1],
              opacity: [0.4, 0.9, 0.5, 0.8, 0.4]
            }}
            transition={{
              duration: 1.8 + (idx % 7) * 0.2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: (idx * 0.05) % 1
            }}
          />
        ))}
      </div>

      {/* Floating Play Button Frame (Top-Left Safe Zone) */}
      <motion.div
        className="absolute left-[2%] sm:left-[4%] top-[3%] sm:top-[5%] w-20 h-20 sm:w-28 sm:h-28 rounded-2xl border border-purple-500/30 bg-purple-500/5 backdrop-blur-[1px] flex items-center justify-center p-3 shadow-[0_0_25px_rgba(168,85,247,0.15)] hidden lg:flex opacity-75 hover:opacity-100 transition-opacity will-change-transform z-10"
        style={{ transform: 'translateZ(0)', willChange: 'transform' }}
        animate={{ y: [0, -6, 0], rotate: [0, -3, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        <motion.div
          className="absolute inset-1.5 rounded-xl border border-dashed border-purple-400/40 will-change-transform"
          style={{ transform: 'translateZ(0)', willChange: 'transform' }}
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
        <svg className="w-8 h-8 text-purple-400 ml-0.5 drop-shadow-[0_0_6px_rgba(168,85,247,0.6)]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M8 5v14l11-7z" />
        </svg>
      </motion.div>

      {/* Floating Film Frame Window (Bottom-Right Safe Zone) */}
      <motion.div
        className="absolute right-[2%] sm:right-[5%] bottom-[3%] sm:bottom-[5%] w-32 sm:w-40 h-20 sm:h-24 rounded-xl border border-purple-500/35 bg-purple-950/20 backdrop-blur-[2px] p-2 flex flex-col justify-between hidden xl:flex opacity-70 hover:opacity-100 transition-opacity will-change-transform z-10"
        style={{ transform: 'translateZ(0)', willChange: 'transform' }}
        animate={{ y: [0, 6, 0], rotate: [0, 1.5, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      >
        <div className="flex justify-between items-center px-1">
          {[1, 2, 3, 4, 5, 6].map((k) => (
            <div key={`sprocket-top-${k}`} className="w-1.5 h-1 rounded-[1px] bg-purple-400/60" />
          ))}
        </div>
        <div className="flex-1 my-1 border border-purple-500/25 rounded bg-purple-500/10 flex items-center justify-between px-2 relative overflow-hidden">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-400/20 to-transparent will-change-transform"
            style={{ transform: 'translateZ(0)', willChange: 'transform' }}
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          />
          <span className="font-mono text-[8px] text-purple-200 font-bold tracking-wider z-10">SEQ_01</span>
          <span className="font-mono text-[6px] text-purple-300 font-semibold bg-purple-500/20 px-1 py-0.5 rounded border border-purple-500/30 z-10">4K RAW</span>
        </div>
        <div className="flex justify-between items-center px-1">
          {[1, 2, 3, 4, 5, 6].map((k) => (
            <div key={`sprocket-bot-${k}`} className="w-1.5 h-1 rounded-[1px] bg-purple-400/60" />
          ))}
        </div>
      </motion.div>
    </DecorWrapper>
  );
};
