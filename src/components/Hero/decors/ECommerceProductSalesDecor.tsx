import React from "react";
import { motion } from "framer-motion";
import { DecorWrapper } from "./DecorWrapper";
import { getCategoryTheme, ThemeMode } from "./themeConfig";

interface DecorProps {
  theme: ThemeMode;
}

const CATEGORY = "電商產品銷售圖";

export const ECommerceProductSalesDecor: React.FC<DecorProps> = ({ theme }) => {
  const { strokeColor, textColor } = getCategoryTheme(CATEGORY, theme);

  const badge = (
    <div className="absolute top-3 right-4 sm:top-6 sm:right-8 flex items-center gap-2 font-mono text-[10px] sm:text-xs">
      <div className="w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.8)] animate-pulse" />
      <span className={`font-bold tracking-widest ${textColor}`}>PRODUCT HERO & CONVERSION DETAIL</span>
      <span className={`hidden md:inline px-1.5 py-0.5 rounded text-[9px] border border-orange-500/30 bg-orange-500/10 font-mono ${textColor}`}>
        SALES PAGE +88% CONVERSION
      </span>
    </div>
  );

  const svgDefs = (
    <linearGradient id="orangePodiumGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor={strokeColor} stopOpacity="0.8" />
      <stop offset="50%" stopColor="#FB923C" stopOpacity="0.4" />
      <stop offset="100%" stopColor={strokeColor} stopOpacity="0.1" />
    </linearGradient>
  );

  const svgContent = (
    <>
      <g transform="translate(600, 260)" stroke={strokeColor} fill="none">
        <ellipse rx="260" ry="65" strokeWidth="1" strokeDasharray="6 3" opacity="0.4" />
        <ellipse rx="180" ry="45" strokeWidth="1.5" opacity="0.7" />
        <ellipse rx="120" ry="30" strokeWidth="2" fill="rgba(249, 115, 22, 0.08)" filter="url(#neonGlowBrightOrange)" />
        <line x1="-180" y1="0" x2="-180" y2="25" strokeWidth="1" opacity="0.5" />
        <line x1="180" y1="0" x2="180" y2="25" strokeWidth="1" opacity="0.5" />
        <path d="M -180,25 A 180,45 0 0,0 180,25" strokeWidth="1" opacity="0.5" />
      </g>

      <g transform="translate(600, 180)">
        <motion.ellipse
          cx="0"
          cy="0"
          rx="140"
          ry="35"
          fill="none"
          stroke="url(#orangePodiumGrad)"
          strokeWidth="2"
          filter="url(#neonGlowBrightOrange)"
          animate={{
            y: [-10, 10, -10],
            scaleX: [0.96, 1.04, 0.96],
            opacity: [0.4, 0.9, 0.4]
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
      </g>

      <g transform="translate(380, 120)">
        <motion.g
          animate={{ rotate: [-2, 2, -2], y: [0, -4, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        >
          <circle cx="0" cy="0" r="32" fill="rgba(249, 115, 22, 0.1)" stroke={strokeColor} strokeWidth="2" filter="url(#neonGlowBrightOrange)" />
          <circle cx="0" cy="0" r="26" fill="none" stroke={strokeColor} strokeWidth="1" strokeDasharray="3 2" opacity="0.8" />
          <line x1="22" y1="22" x2="48" y2="48" stroke={strokeColor} strokeWidth="3" strokeLinecap="round" />
          <line x1="-10" y1="0" x2="10" y2="0" stroke={strokeColor} strokeWidth="1" opacity="0.7" />
          <line x1="0" y1="-10" x2="0" y2="10" stroke={strokeColor} strokeWidth="1" opacity="0.7" />
          <text x="-16" y="38" fill={strokeColor} fontSize="7" fontFamily="monospace" opacity="0.8">300% ZOOM</text>
        </motion.g>
      </g>

      <g stroke={strokeColor} strokeWidth="1" fill="none" opacity="0.75">
        <circle cx="480" cy="220" r="3" fill={strokeColor} />
        <path d="M 480 220 L 420 200 L 330 200" strokeDasharray="3 2" />

        <circle cx="720" cy="180" r="3" fill={strokeColor} />
        <path d="M 720 180 L 780 150 L 860 150" strokeDasharray="3 2" />

        <circle cx="680" cy="240" r="3" fill={strokeColor} />
        <path d="M 680 240 L 750 270 L 850 270" strokeDasharray="3 2" />
      </g>

      <g transform="translate(600, 80)">
        <rect x="-80" y="-16" width="160" height="32" rx="16" fill="rgba(249, 115, 22, 0.12)" stroke={strokeColor} strokeWidth="1" />
        {[-52, -26, 0, 26, 52].map((xOffset, idx) => (
          <path
            key={`star-rating-${idx}`}
            d={`M ${xOffset},${-6} L ${xOffset + 2},${-2} L ${xOffset + 7},${-1} L ${xOffset + 3.5},${3} L ${xOffset + 4.5},${8} L ${xOffset},${5.5} L ${xOffset - 4.5},${8} L ${xOffset - 3.5},${3} L ${xOffset - 7},${-1} L ${xOffset - 2},${-2} Z`}
            fill={strokeColor}
            opacity="0.9"
          />
        ))}
      </g>

      <text x="560" y="52" fill={strokeColor} fontSize="8" fontFamily="monospace" opacity="0.9">5.0 EXCELLENT REVIEWS (2,840+)</text>
      <text x="320" y="192" fill={strokeColor} fontSize="8" fontFamily="monospace" opacity="0.8">DETAIL: NANO-TEXTURE</text>
      <text x="865" y="145" fill={strokeColor} fontSize="8" fontFamily="monospace" opacity="0.8">SPEC: 100% ORGANIC</text>
      <text x="855" y="265" fill={strokeColor} fontSize="8" fontFamily="monospace" opacity="0.8">BENEFIT: CLINICAL PROVEN</text>
    </>
  );

  return (
    <DecorWrapper
      category={CATEGORY}
      theme={theme}
      topRightBadge={badge}
      bottomIndicatorText="E-COMMERCE PRODUCT SALES VISUALS & CONVERSION HIGHLIGHTS"
      svgViewBox="0 0 1200 400"
      svgDefs={svgDefs}
      svgContent={svgContent}
    >
      {/* Floating Product Highlight Feature Card (Top-Left Safe Zone) */}
      <motion.div
        className="absolute left-[2%] sm:left-[4%] top-[3%] sm:top-[5%] w-30 sm:w-40 h-24 sm:h-30 rounded-2xl border border-orange-500/30 bg-orange-950/20 backdrop-blur-[1px] p-2 flex flex-col justify-between shadow-[0_0_25px_rgba(249,115,22,0.15)] hidden lg:flex opacity-75 hover:opacity-100 transition-opacity will-change-transform z-10"
        style={{ transform: "translateZ(0)", willChange: "transform" }}
        animate={{ y: [0, -6, 0], rotate: [0, -2, 0] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="flex items-center justify-between border-b border-orange-500/20 pb-1.5">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping" />
            <span className="font-mono text-[9px] text-orange-300 font-bold tracking-wider">PRODUCT FEATURE</span>
          </div>
          <span className="font-mono text-[8px] bg-orange-500/20 text-orange-300 border border-orange-500/30 px-1 rounded">HOT ITEM</span>
        </div>

        <div className="flex-1 my-1.5 border border-orange-500/15 p-1.5 rounded bg-orange-500/5 flex items-center gap-2">
          <div className="w-10 h-10 rounded-lg border border-orange-400/40 bg-orange-500/20 flex items-center justify-center shrink-0">
            <svg className="w-5 h-5 text-orange-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
              <line x1="11" y1="8" x2="11" y2="14" />
              <line x1="8" y1="11" x2="14" y2="11" />
            </svg>
          </div>
          <div className="font-mono text-[8px] text-orange-200/90 leading-tight space-y-0.5">
            <div className="font-bold text-orange-300">微距特寫與成份標註</div>
          </div>
        </div>

        <div className="flex items-center justify-between font-mono text-[7px] text-orange-400/70 border-t border-orange-500/20 pt-1">
          <span>RATING: ★★★★★</span>
        </div>
      </motion.div>

      {/* Floating Conversion Matrix Card (Bottom-Right Safe Zone) */}
      <motion.div
        className="absolute right-[2%] sm:right-[5%] bottom-[3%] sm:bottom-[5%] w-32 sm:w-40 h-22 sm:h-26 rounded-xl border border-orange-500/30 bg-orange-950/20 backdrop-blur-[1px] p-2.5 flex flex-col justify-between hidden xl:flex opacity-70 hover:opacity-100 transition-opacity z-10"
        animate={{ y: [0, 6, 0], rotate: [0, 1.5, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
      >
        <div className="flex items-center justify-between border-b border-orange-500/20 pb-1">
          <span className="font-mono text-[9px] text-orange-300 font-bold tracking-wider">CONVERSION</span>
          <span className="w-2 h-2 rounded-full bg-orange-400" />
        </div>

        <div className="flex items-center gap-2 my-1">
          <div className="w-8 h-8 rounded-full border border-orange-400/50 bg-orange-500/20 flex items-center justify-center shrink-0">
            <svg className="w-4 h-4 text-orange-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <path d="M9 12l2 2 4-4" />
            </svg>
          </div>

          <div className="font-mono text-[8px] text-orange-200/90 leading-tight">
            <div className="font-bold text-orange-300">商品賣點解構圖</div>
          </div>
        </div>

        <div className="w-full flex items-center justify-between font-mono text-[7px] text-orange-400/70">
          <span>ORDER CONV: High</span>
        </div>
      </motion.div>
    </DecorWrapper>
  );
};
