import React from "react";
import { motion } from "framer-motion";
import { DecorWrapper } from "./DecorWrapper";
import { PerspectiveGrid } from "./PerspectiveGrid";
import { getCategoryTheme, ThemeMode } from "./themeConfig";

interface DecorProps {
  theme: ThemeMode;
}

const CATEGORY = "網站產品瀑布頁";

export const LandingWaterfallDecor: React.FC<DecorProps> = ({ theme }) => {
  const { strokeColor, textColor } = getCategoryTheme(CATEGORY, theme);

  const badge = (
    <div className="absolute top-3 right-4 sm:top-6 sm:right-8 flex items-center gap-2 font-mono text-[10px] sm:text-xs">
      <div className="w-2 h-2 rounded-full bg-teal-400 shadow-[0_0_8px_rgba(20,184,166,0.8)] animate-pulse" />
      <span className={`font-bold tracking-widest ${textColor}`}>MASONRY WATERFALL & DISCUSSIONS</span>
      <span className={`hidden md:inline px-1.5 py-0.5 rounded text-[9px] border border-teal-500/30 bg-teal-500/10 font-mono ${textColor}`}>
        LIVE FEED 120 FPS
      </span>
    </div>
  );

  const svgDefs = (
    <>
      <linearGradient id="tealStream" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor={strokeColor} stopOpacity="0.05" />
        <stop offset="40%" stopColor={strokeColor} stopOpacity="0.8" />
        <stop offset="70%" stopColor="#2DD4BF" stopOpacity="0.95" />
        <stop offset="100%" stopColor={strokeColor} stopOpacity="0.05" />
      </linearGradient>

      <linearGradient id="waterfallWaveGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor={strokeColor} stopOpacity="0.15" />
        <stop offset="50%" stopColor="#14B8A6" stopOpacity="0.35" />
        <stop offset="100%" stopColor={strokeColor} stopOpacity="0.05" />
      </linearGradient>
    </>
  );

  const svgContent = (
    <>
      {/* Background Waterfall Flow Wave Vectors */}
      <motion.path
        d="M -50,40 Q 250,180 550,60 T 1150,140"
        fill="none"
        stroke="url(#waterfallWaveGrad)"
        strokeWidth="3"
        filter="url(#neonGlowTeal)"
        animate={{
          d: [
            "M -50,40 Q 250,180 550,60 T 1150,140",
            "M -50,80 Q 250,120 550,100 T 1150,180",
            "M -50,40 Q 250,180 550,60 T 1150,140"
          ]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.path
        d="M -50,220 Q 300,320 650,200 T 1250,280"
        fill="none"
        stroke="url(#waterfallWaveGrad)"
        strokeWidth="2"
        strokeDasharray="6 4"
        animate={{
          d: [
            "M -50,220 Q 300,320 650,200 T 1250,280",
            "M -50,180 Q 300,260 650,240 T 1250,220",
            "M -50,220 Q 300,320 650,200 T 1250,280"
          ]
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Vertical Downward Cascading Stream Lines (Waterfall Effect) */}
      {[8, 22, 38, 54, 70, 86].map((pct, idx) => (
        <g key={`stream-group-${idx}`}>
          <motion.line
            x1={`${pct}%`}
            y1="0"
            x2={`${pct}%`}
            y2="100%"
            stroke="url(#tealStream)"
            strokeWidth={idx % 2 === 0 ? "2" : "1.2"}
            strokeDasharray="18 12"
            filter="url(#neonGlowTeal)"
            animate={{ strokeDashoffset: [0, -120] }}
            transition={{
              duration: 4.5 + idx * 0.7,
              repeat: Infinity,
              ease: "linear"
            }}
          />
          <motion.circle
            cx={`${pct}%`}
            r={idx % 2 === 0 ? "3.5" : "2.5"}
            fill="#5EEAD4"
            filter="url(#neonGlowTeal)"
            animate={{ cy: ["0%", "100%"], opacity: [0, 0.9, 0] }}
            transition={{
              duration: 3.5 + idx * 0.6,
              repeat: Infinity,
              ease: "easeInOut",
              delay: idx * 0.4
            }}
          />
        </g>
      ))}

      {/* Cascading Card Outlines in Background (Waterfall Masonry Wireframes) */}
      <g stroke={strokeColor} strokeWidth="1" fill="rgba(20, 184, 166, 0.03)" opacity="0.35">
        <rect x="80" y="30" width="110" height="140" rx="8" strokeDasharray="4 2" />
        <rect x="80" y="185" width="110" height="160" rx="8" strokeDasharray="4 2" />

        <rect x="1010" y="40" width="120" height="170" rx="8" strokeDasharray="4 2" />
        <rect x="1010" y="225" width="120" height="130" rx="8" strokeDasharray="4 2" />
      </g>

      {/* Grid Overlay */}
      <PerspectiveGrid
        strokeColor={strokeColor}
        horizontalLines={["20%", "50%", "80%"]}
        strokeWidth={0.8}
        strokeDasharray="4 4"
        opacity={0.2}
      />

      {/* Text annotations in SVG background */}
      <text x="85" y="22" fill={strokeColor} fontSize="8" fontFamily="monospace" opacity="0.7">
        CASCADE COL_01
      </text>
      <text x="1015" y="32" fill={strokeColor} fontSize="8" fontFamily="monospace" opacity="0.7">
        CASCADE COL_03 [LIVE COMMENTS]
      </text>
      <text x="600" y="380" fill={strokeColor} fontSize="9" fontFamily="monospace" textAnchor="middle" opacity="0.8">
        WATERFALL PRODUCT FEED & REAL-TIME USER DISCUSSIONS
      </text>
    </>
  );

  return (
    <DecorWrapper
      category={CATEGORY}
      theme={theme}
      topRightBadge={badge}
      bottomIndicatorText="SMOOTH MASONRY PRODUCT FEED & REAL-TIME DISCUSSIONS"
      preserveAspectRatio="none"
      svgOpacityClass="opacity-35 dark:opacity-50"
      svgDefs={svgDefs}
      svgContent={svgContent}
    >
      {/* Left Floating Discussion & User Reviews Card (Top-Left Safe Zone) */}
      <motion.div
        className="absolute left-[2%] sm:left-[4%] top-[3%] sm:top-[5%] w-34 sm:w-46 rounded-2xl border border-teal-500/35 bg-teal-950/20 backdrop-blur-[1px] p-2 flex flex-col justify-between hidden lg:flex opacity-75 hover:opacity-100 transition-opacity z-10"
        style={{ transform: "translateZ(0)", willChange: "transform" }}
        animate={{ y: [0, -6, 0], rotate: [0, -1.5, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="flex items-center justify-between border-b border-teal-500/25 pb-1 px-1">
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
            <span className="font-mono text-[8px] text-teal-200 font-bold tracking-wider">即時討論與評價</span>
          </div>
          <span className="font-mono text-[7px] text-teal-300">★ 4.9</span>
        </div>

        {/* Floating Discussion Comment Bubbles */}
        <div className="space-y-1 my-1.5">
          <motion.div
            className="p-1 rounded-lg border border-teal-500/20 bg-teal-900/30 flex items-start gap-1"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <span className="text-[8px] shrink-0">💬</span>
            <div className="font-mono text-[7px] text-teal-100 leading-snug">
              <span className="text-teal-300 font-bold">討論：</span>
              「RWD 體驗順暢！」
            </div>
          </motion.div>

          <motion.div
            className="p-1 rounded-lg border border-teal-500/20 bg-teal-900/30 flex items-start gap-1"
            animate={{ opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          >
            <span className="text-[8px] shrink-0">⭐</span>
            <div className="font-mono text-[7px] text-teal-100 leading-snug">
              <span className="text-teal-300 font-bold">實測：</span>
              「層次分明，載入快速。」
            </div>
          </motion.div>
        </div>

        <div className="flex items-center justify-between font-mono text-[7px] text-teal-300/80 border-t border-teal-500/20 pt-1">
          <span>好評率 99.4%</span>
        </div>
      </motion.div>

      {/* Center Masonry Feed Container (Top-Right Safe Zone) */}
      <motion.div
        className="absolute right-[18%] sm:right-[22%] top-[3%] sm:top-[5%] w-44 sm:w-60 h-32 sm:h-44 rounded-xl border border-teal-500/35 bg-teal-950/20 backdrop-blur-[2px] p-2 flex flex-col justify-between hidden xl:flex opacity-70 hover:opacity-100 transition-opacity overflow-hidden z-10"
        animate={{ y: [0, -6, 0], rotate: [0, -1, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="flex items-center justify-between border-b border-teal-500/25 pb-1 px-1 shrink-0">
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-red-400/80" />
            <div className="w-1.5 h-1.5 rounded-full bg-yellow-400/80" />
            <div className="w-1.5 h-1.5 rounded-full bg-green-400/80" />
          </div>
          <div className="flex-1 max-w-[100px] sm:max-w-[140px] bg-teal-900/40 rounded px-1 text-[7px] font-mono text-teal-300/90 truncate text-center border border-teal-500/20">
            product-waterfall
          </div>
          <span className="font-mono text-[6px] text-teal-400 font-bold px-1 rounded bg-teal-500/20">
            MASONRY
          </span>
        </div>

        <div className="flex items-center gap-1 my-1 px-0.5 shrink-0">
          <span className="px-1 py-0.5 rounded-full text-[6px] font-mono font-bold bg-teal-400 text-teal-950">全部</span>
          <span className="px-1 py-0.5 rounded-full text-[6px] font-mono text-teal-300/80 border border-teal-500/20">熱門</span>
          <span className="px-1 py-0.5 rounded-full text-[6px] font-mono text-teal-300/80 border border-teal-500/20">最新</span>
          <span className="ml-auto text-[6px] font-mono text-teal-400/80">★ 4.9</span>
        </div>

        <div className="flex-1 my-0.5 grid grid-cols-3 gap-1.5 overflow-hidden relative">
          {/* Column 1 */}
          <motion.div
            className="flex flex-col gap-1.5"
            animate={{ y: ["0%", "-30%", "0%"] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="border border-teal-500/25 bg-teal-500/10 rounded-lg p-1 flex flex-col justify-between shadow-sm">
              <div className="w-full h-8 bg-gradient-to-br from-teal-400/30 to-teal-600/10 rounded flex items-center justify-between p-0.5">
                <span className="text-[6px] font-mono bg-teal-400 text-teal-950 font-bold px-1 rounded">$120</span>
                <span className="text-[6px] font-mono text-teal-300">💬 128條討論</span>
              </div>
              <div className="mt-1 w-3/4 h-1 bg-teal-300/50 rounded" />
              <div className="mt-0.5 w-1/2 h-1 bg-teal-400/30 rounded" />
            </div>
            <div className="border border-teal-500/25 bg-teal-500/10 rounded-lg p-1 flex flex-col justify-between shadow-sm">
              <div className="w-full h-5 bg-teal-400/20 rounded flex items-center justify-between p-0.5">
                <span className="text-[6px] font-mono text-teal-300">熱銷爆款</span>
                <span className="text-[6px] font-mono text-teal-400">★ 5.0</span>
              </div>
              <div className="mt-1 w-2/3 h-1 bg-teal-300/40 rounded" />
            </div>
          </motion.div>

          {/* Column 2 */}
          <motion.div
            className="flex flex-col gap-1.5"
            animate={{ y: ["-20%", "20%", "-20%"] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="border border-teal-500/30 bg-teal-500/15 rounded-lg p-1 flex flex-col justify-between shadow-sm">
              <div className="w-full h-10 bg-gradient-to-br from-teal-300/30 to-emerald-500/20 rounded flex items-center justify-between p-0.5">
                <span className="text-[6px] font-mono bg-emerald-400 text-teal-950 font-bold px-1 rounded">NEW</span>
                <span className="text-[6px] font-mono text-teal-200">💬 85則評價</span>
              </div>
              <div className="mt-1 w-4/5 h-1 bg-teal-300/60 rounded" />
              <div className="mt-0.5 w-2/5 h-1 bg-teal-400/30 rounded" />
            </div>
            <div className="border border-teal-500/25 bg-teal-500/10 rounded-lg p-1 flex flex-col justify-between shadow-sm">
              <div className="w-full h-7 bg-teal-400/20 rounded flex items-center justify-center p-0.5">
                <span className="text-[6px] font-mono text-teal-300">💬「質感非常高」</span>
              </div>
              <div className="mt-1 w-1/2 h-1 bg-teal-300/40 rounded" />
            </div>
          </motion.div>

          {/* Column 3 */}
          <motion.div
            className="flex flex-col gap-1.5"
            animate={{ y: ["10%", "-25%", "10%"] }}
            transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="border border-teal-500/25 bg-teal-500/10 rounded-lg p-1 flex flex-col justify-between shadow-sm">
              <div className="w-full h-6 bg-teal-400/20 rounded flex items-center justify-between p-0.5">
                <span className="text-[6px] font-mono text-teal-300">$64</span>
                <span className="text-[6px] font-mono text-teal-200">💬 42則</span>
              </div>
              <div className="mt-1 w-full h-1 bg-teal-300/40 rounded" />
            </div>
            <div className="border border-teal-500/25 bg-teal-500/10 rounded-lg p-1 flex flex-col justify-between shadow-sm">
              <div className="w-full h-9 bg-gradient-to-br from-teal-400/25 to-teal-500/10 rounded flex items-center justify-between p-0.5">
                <span className="text-[6px] font-mono text-teal-300">★ 5.0</span>
                <span className="text-[6px] font-mono text-teal-200">好評回購</span>
              </div>
              <div className="mt-1 w-3/4 h-1 bg-teal-300/50 rounded" />
              <div className="mt-0.5 w-1/2 h-1 bg-teal-400/30 rounded" />
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Floating Masonry & Discussion Stats Card (Bottom-Right Safe Zone) */}
      <motion.div
        className="absolute right-[2%] sm:right-[5%] bottom-[3%] sm:bottom-[5%] w-32 sm:w-40 h-24 sm:h-28 rounded-xl border border-teal-500/30 bg-teal-950/20 backdrop-blur-[2px] p-2.5 flex flex-col justify-between hidden xl:flex opacity-70 hover:opacity-100 transition-opacity shadow-[0_0_25px_rgba(20,184,166,0.14)] z-10"
        animate={{ y: [0, 6, 0], rotate: [0, 1.5, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
      >
        <div className="w-full flex items-center justify-between border-b border-teal-500/20 pb-1">
          <span className="font-mono text-[9px] text-teal-300 font-bold tracking-wider">瀑布流與討論數據</span>
          <span className="font-mono text-[8px] text-teal-400 font-bold">120 FPS</span>
        </div>

        <div className="flex flex-col gap-1 my-0.5 font-mono text-[8px] text-teal-200/80">
          <div className="flex justify-between">
            <span>版面流速</span>
            <span className="text-teal-300 font-semibold">3-COL STAGGERED</span>
          </div>
          <div className="flex justify-between">
            <span>即時留言</span>
            <span className="text-teal-400 font-semibold">120 COMMENTS/MIN</span>
          </div>
          <div className="flex justify-between">
            <span>使用者留存</span>
            <span className="text-teal-300 font-semibold">+68% ENGAGEMENT</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex-1 h-1 bg-teal-950 rounded-full overflow-hidden border border-teal-500/20">
            <motion.div
              className="h-full bg-gradient-to-r from-teal-400 to-emerald-300 rounded-full"
              animate={{ width: ["15%", "95%", "40%", "100%", "15%"] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
          <motion.div animate={{ y: [0, 3, 0] }} transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}>
            <svg className="w-3.5 h-3.5 text-teal-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 5v14M19 12l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.div>
        </div>
      </motion.div>

      {/* Right Edge Window Scrollbar */}
      <div className="absolute right-2 top-1/4 bottom-1/4 w-1.5 rounded-full bg-teal-950/40 border border-teal-500/20 hidden md:block overflow-hidden">
        <motion.div
          className="w-full bg-gradient-to-b from-teal-400 to-teal-600 rounded-full shadow-[0_0_8px_rgba(45,212,191,0.8)]"
          style={{ height: "30%" }}
          animate={{ y: ["0%", "230%", "60%", "200%", "0%"] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
    </DecorWrapper>
  );
};
