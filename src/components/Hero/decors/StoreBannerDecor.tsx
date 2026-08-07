import React from "react";
import { motion } from "framer-motion";
import { DecorWrapper } from "./DecorWrapper";
import { getCategoryTheme, ThemeMode } from "./themeConfig";

interface DecorProps {
  theme: ThemeMode;
}

const CATEGORY = "賣場 Banner 橫幅廣告";

export const StoreBannerDecor: React.FC<DecorProps> = ({ theme }) => {
  const { strokeColor, textColor } = getCategoryTheme(CATEGORY, theme);

  const badge = (
    <div className="absolute top-3 right-4 sm:top-6 sm:right-8 flex items-center gap-2 font-mono text-[10px] sm:text-xs">
      <div className="w-2 h-2 rounded-full bg-pink-400 shadow-[0_0_8px_rgba(236,72,153,0.8)]" />
      <span className={`font-bold tracking-widest ${textColor}`}>FLASH SALE BANNER</span>
      <span className={`hidden md:inline px-1.5 py-0.5 rounded text-[9px] border border-pink-500/30 bg-pink-500/10 font-mono ${textColor}`}>
        CONVERSION CTR +350%
      </span>
    </div>
  );

  const svgDefs = (
    <linearGradient id="pinkSpeedGrad" x1="0%" y1="0%" x2="100%" y2="50%">
      <stop offset="0%" stopColor={strokeColor} stopOpacity="0.1" />
      <stop offset="50%" stopColor={strokeColor} stopOpacity="0.8" />
      <stop offset="100%" stopColor="#F472B6" stopOpacity="0.1" />
    </linearGradient>
  );

  const svgContent = (
    <>
      {[
        { y1: -50, y2: 450, x1: 100, x2: 400 },
        { y1: -50, y2: 450, x1: 250, x2: 550 },
        { y1: -50, y2: 450, x1: 400, x2: 700 },
        { y1: -50, y2: 450, x1: 550, x2: 850 },
        { y1: -50, y2: 450, x1: 700, x2: 1000 },
        { y1: -50, y2: 450, x1: 850, x2: 1150 }
      ].map((line, idx) => (
        <motion.line
          key={`speed-${idx}`}
          x1={line.x1}
          y1={line.y1}
          x2={line.x2}
          y2={line.y2}
          stroke="url(#pinkSpeedGrad)"
          strokeWidth={idx % 2 === 0 ? "2" : "1"}
          strokeDasharray="12 6"
          filter="url(#neonGlowPink)"
          animate={{ strokeDashoffset: [0, -120] }}
          transition={{ duration: 4 + idx * 0.8, repeat: Infinity, ease: "linear" }}
        />
      ))}

      {[
        { cx: 280, cy: 110, rInner: 12, rOuter: 28, points: 8 },
        { cx: 920, cy: 290, rInner: 10, rOuter: 24, points: 10 },
        { cx: 1060, cy: 90, rInner: 8, rOuter: 18, points: 6 }
      ].map((star, idx) => {
        const pts = [];
        for (let i = 0; i < star.points * 2; i++) {
          const r = i % 2 === 0 ? star.rOuter : star.rInner;
          const angle = (i * Math.PI) / star.points;
          const x = star.cx + r * Math.sin(angle);
          const y = star.cy - r * Math.cos(angle);
          pts.push(`${x},${y}`);
        }
        return (
          <motion.polygon
            key={`burst-${idx}`}
            points={pts.join(" ")}
            fill="rgba(236, 72, 153, 0.12)"
            stroke={strokeColor}
            strokeWidth="1.5"
            filter="url(#neonGlowPink)"
            animate={{
              scale: [0.9, 1.15, 0.9],
              rotate: [0, 180, 360],
              opacity: [0.4, 0.9, 0.4]
            }}
            transition={{ duration: 8 + idx * 2, repeat: Infinity, ease: "easeInOut" }}
          />
        );
      })}

      <text x="315" y="125" fill={strokeColor} fontSize="8" fontFamily="monospace" opacity="0.8">MEGA SALE 50%</text>
      <text x="895" y="285" fill={strokeColor} fontSize="8" fontFamily="monospace" opacity="0.8">HOT ITEM</text>
    </>
  );

  return (
    <DecorWrapper
      category={CATEGORY}
      theme={theme}
      topRightBadge={badge}
      bottomIndicatorText="HIGH-CONVERSION PROMO BANNER GRAPHIC"
      svgViewBox="0 0 1200 400"
      svgDefs={svgDefs}
      svgContent={svgContent}
    >
      {/* Floating E-Commerce Store Banner Preview (Top-Left Safe Zone) */}
      <motion.div
        className="absolute left-[2%] sm:left-[4%] top-[3%] sm:top-[5%] w-34 sm:w-46 h-28 sm:h-38 rounded-2xl border border-pink-500/30 bg-pink-950/20 backdrop-blur-[1px] p-2 flex flex-col justify-between shadow-[0_0_25px_rgba(236,72,153,0.15)] hidden lg:flex opacity-75 hover:opacity-100 transition-opacity will-change-transform z-10"
        style={{ transform: "translateZ(0)", willChange: "transform" }}
        animate={{ y: [0, -6, 0], rotate: [0, -2, 0] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="flex items-center justify-between border-b border-pink-500/20 pb-1.5">
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-pink-400 animate-ping" />
            <span className="font-mono text-[9px] text-pink-300 font-bold tracking-wider">DOUBLE 11 BANNER</span>
          </div>
          <span className="font-mono text-[8px] bg-pink-500/20 text-pink-300 border border-pink-500/30 px-1 rounded">50% OFF</span>
        </div>

        <div className="flex-1 my-1.5 flex items-center justify-between gap-2 border border-pink-500/15 p-1.5 rounded bg-pink-500/5">
          <div className="w-12 h-12 rounded-lg border border-pink-400/40 bg-pink-500/20 flex flex-col items-center justify-center shrink-0">
            <span className="font-mono text-[10px] text-pink-300 font-extrabold leading-none">50%</span>
            <span className="font-mono text-[7px] text-pink-200 uppercase mt-0.5">DISCOUNT</span>
          </div>

          <div className="flex-1 flex flex-col justify-center space-y-1">
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4 text-pink-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              <span className="font-mono text-[8px] text-pink-200 font-bold truncate">FLASH SALE ITEM</span>
            </div>
            <div className="w-full h-1 bg-pink-950 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-pink-500 to-amber-300"
                animate={{ width: ["20%", "90%", "40%", "100%", "20%"] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between font-mono text-[7px] text-pink-300/80 border-t border-pink-500/20 pt-1">
          <span>CTR: 8.4%</span>
          <span>CLICK-THROUGH HIGH</span>
        </div>
      </motion.div>

      {/* Floating CTA Card (Bottom-Right Safe Zone) */}
      <motion.div
        className="absolute right-[2%] sm:right-[5%] bottom-[3%] sm:bottom-[5%] w-32 sm:w-40 h-20 sm:h-24 rounded-xl border border-pink-500/30 bg-pink-950/20 backdrop-blur-[1px] p-2.5 flex flex-col justify-between hidden xl:flex opacity-70 hover:opacity-100 transition-opacity shadow-[0_0_25px_rgba(236,72,153,0.15)] z-10"
        animate={{ y: [0, 6, 0], rotate: [0, 1.5, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
      >
        <div className="flex items-center justify-between border-b border-pink-500/20 pb-1">
          <span className="font-mono text-[9px] text-pink-300 font-bold tracking-wider">CTA BUTTON</span>
          <span className="w-2 h-2 rounded-full bg-pink-400" />
        </div>

        <div className="bg-gradient-to-r from-pink-500 to-rose-500 rounded py-1 px-2 flex items-center justify-between my-1">
          <span className="font-mono text-[8px] text-white font-extrabold tracking-wider">SHOP NOW</span>
          <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        <div className="w-full flex items-center justify-between font-mono text-[7px] text-pink-400/70">
          <span>AB TEST: A</span>
          <span>CONVERSION OPTIMIZED</span>
        </div>
      </motion.div>
    </DecorWrapper>
  );
};
