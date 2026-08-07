import React from "react";
import { motion } from "framer-motion";
import { DecorWrapper } from "./DecorWrapper";
import { getCategoryTheme, ThemeMode } from "./themeConfig";

interface DecorProps {
  theme: ThemeMode;
}

const CATEGORY = "社群行銷小編圖文";

export const SocialMarketingDecor: React.FC<DecorProps> = ({ theme }) => {
  const { strokeColor, textColor } = getCategoryTheme(CATEGORY, theme);

  const badge = (
    <div className="absolute top-3 right-4 sm:top-6 sm:right-8 flex items-center gap-2 font-mono text-[10px] sm:text-xs">
      <div className="w-2 h-2 rounded-full bg-orange-400 shadow-[0_0_8px_rgba(251,146,60,0.8)] animate-pulse" />
      <span className={`font-bold tracking-widest ${textColor}`}>VIRAL MARKETING & GROWTH</span>
      <span className={`hidden md:inline px-1.5 py-0.5 rounded text-[9px] border border-orange-500/30 bg-orange-500/10 font-mono ${textColor}`}>
        ROAS 4.8x | CTR +248%
      </span>
    </div>
  );

  const svgDefs = (
    <>
      <linearGradient id="orangeViralGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor={strokeColor} stopOpacity="0.8" />
        <stop offset="50%" stopColor="#FDBA74" stopOpacity="0.4" />
        <stop offset="100%" stopColor={strokeColor} stopOpacity="0.1" />
      </linearGradient>

      <linearGradient id="growthFillGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor={strokeColor} stopOpacity="0.35" />
        <stop offset="100%" stopColor={strokeColor} stopOpacity="0.0" />
      </linearGradient>

      <filter id="neonGlowOrange" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="3" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </>
  );

  const svgContent = (
    <>
      {/* Background Growth Trend Chart (行銷成效成長曲線圖) */}
      <motion.path
        d="M 120,320 L 250,280 L 400,290 L 550,210 L 700,230 L 850,140 L 1000,90 L 1120,60"
        fill="none"
        stroke={strokeColor}
        strokeWidth="3"
        filter="url(#neonGlowOrange)"
        animate={{
          d: [
            "M 120,320 L 250,280 L 400,290 L 550,210 L 700,230 L 850,140 L 1000,90 L 1120,60",
            "M 120,320 L 250,290 L 400,270 L 550,230 L 700,190 L 850,160 L 1000,80 L 1120,50",
            "M 120,320 L 250,280 L 400,290 L 550,210 L 700,230 L 850,140 L 1000,90 L 1120,60"
          ]
        }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />

      <path
        d="M 120,320 L 250,280 L 400,290 L 550,210 L 700,230 L 850,140 L 1000,90 L 1120,60 L 1120,360 L 120,360 Z"
        fill="url(#growthFillGrad)"
        opacity="0.6"
      />

      {/* Growth Data Points */}
      {[
        { x: 250, y: 280, label: "+45%" },
        { x: 550, y: 210, label: "+120%" },
        { x: 850, y: 140, label: "+210%" },
        { x: 1000, y: 90, label: "+350%" }
      ].map((pt, idx) => (
        <g key={`data-pt-${idx}`} stroke={strokeColor} fill="none">
          <circle cx={pt.x} cy={pt.y} r="4" fill={strokeColor} />
          <circle cx={pt.x} cy={pt.y} r="8" strokeWidth="1" opacity="0.6" />
          <line x1={pt.x} y1={pt.y} x2={pt.x} y2="360" strokeDasharray="3 3" opacity="0.3" />
          <text x={pt.x - 12} y={pt.y - 12} fill={strokeColor} fontSize="8" fontFamily="monospace" opacity="0.85">
            {pt.label}
          </text>
        </g>
      ))}

      {/* Marketing Funnel Representation (行銷轉換漏斗) in Center Background */}
      <g stroke={strokeColor} fill="none" opacity="0.35" transform="translate(600, 160)">
        <polygon points="-80,-60 80,-60 50,-20 -50,-20" strokeWidth="1.5" fill="rgba(251, 146, 60, 0.08)" />
        <polygon points="-50,-15 50,-15 30,25 -30,25" strokeWidth="1.5" fill="rgba(251, 146, 60, 0.12)" />
        <polygon points="-30,30 30,30 15,65 -15,65" strokeWidth="1.5" fill="rgba(251, 146, 60, 0.18)" />

        <text x="0" y="-36" fill={strokeColor} fontSize="7" fontFamily="monospace" textAnchor="middle" opacity="0.9">
          1. 觸及曝光 (AWARENESS)
        </text>
        <text x="0" y="8" fill={strokeColor} fontSize="7" fontFamily="monospace" textAnchor="middle" opacity="0.9">
          2. 點擊互動 (ENGAGEMENT)
        </text>
        <text x="0" y="52" fill={strokeColor} fontSize="7" fontFamily="monospace" textAnchor="middle" opacity="0.9">
          3. 下單轉化 (CONVERSION)
        </text>
      </g>

      {/* Megaphone (擴音器 / 訊息傳播意象) on Left-Center */}
      <motion.g
        transform="translate(380, 140)"
        animate={{ scale: [0.95, 1.05, 0.95], rotate: [-2, 2, -2] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <path d="M -30,-10 L -10,-20 L -10,20 L -30,10 Z" fill="none" stroke={strokeColor} strokeWidth="1.5" />
        <path d="M -10,-20 L 30,-35 L 30,35 L -10,20 Z" fill="rgba(251, 146, 60, 0.12)" stroke={strokeColor} strokeWidth="2" />
        <ellipse cx="30" cy="0" rx="6" ry="35" fill="none" stroke={strokeColor} strokeWidth="1.5" />
        <path d="M -15,18 L -20,40 L -10,40 L -8,21" fill="none" stroke={strokeColor} strokeWidth="1.5" />

        {/* Viral Waves broadcasting from Megaphone */}
        <motion.path
          d="M 45,-20 A 30,30 0 0,1 45,20"
          fill="none"
          stroke={strokeColor}
          strokeWidth="2"
          strokeLinecap="round"
          filter="url(#neonGlowOrange)"
          animate={{ opacity: [0.2, 1, 0.2] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.path
          d="M 60,-35 A 50,50 0 0,1 60,35"
          fill="none"
          stroke={strokeColor}
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="4 2"
          animate={{ opacity: [0.1, 0.8, 0.1] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
        />
      </motion.g>

      {/* Floating Social Hearts & Likes Floating Upwards (社群病毒式點讚擴散) */}
      {[
        { x: 420, delay: 0, scale: 0.8 },
        { x: 460, delay: 1.2, scale: 1.1 },
        { x: 720, delay: 0.6, scale: 0.9 },
        { x: 780, delay: 2.0, scale: 1.2 }
      ].map((heart, idx) => (
        <motion.g
          key={`viral-heart-${idx}`}
          transform={`translate(${heart.x}, 220)`}
          animate={{ y: [0, -90, -140], opacity: [0, 0.9, 0], scale: [heart.scale * 0.7, heart.scale, heart.scale * 0.8] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "easeOut", delay: heart.delay }}
        >
          <path
            d="M 0,-5 C -3,-10 -10,-10 -10,-4 C -10,2 0,8 0,12 C 0,8 10,2 10,-4 C 10,-10 3,-10 0,-5 Z"
            fill="rgba(251, 146, 60, 0.25)"
            stroke={strokeColor}
            strokeWidth="1.2"
          />
        </motion.g>
      ))}

      {/* Story Carousel Frame Lines */}
      <g stroke={strokeColor} strokeWidth="1" opacity="0.35" fill="none">
        <rect x="140" y="40" width="140" height="260" rx="16" strokeDasharray="4 2" />
        <line x1="170" y1="52" x2="250" y2="52" strokeWidth="2" />
        <rect x="940" y="40" width="140" height="260" rx="16" strokeDasharray="4 2" />
        <line x1="970" y1="52" x2="1050" y2="52" strokeWidth="2" />
      </g>

      {/* SVG Monospace Labels */}
      <text x="145" y="315" fill={strokeColor} fontSize="8" fontFamily="monospace" opacity="0.8">
        STORY CAROUSEL 1080x1920
      </text>
      <text x="945" y="315" fill={strokeColor} fontSize="8" fontFamily="monospace" opacity="0.8">
        REELS VIRAL CAMPAIGN
      </text>
      <text x="600" y="380" fill={strokeColor} fontSize="9" fontFamily="monospace" textAnchor="middle" opacity="0.85">
        VIRAL MARKETING CONTENT • FUNNEL OPTIMIZATION • HIGH ENGAGEMENT
      </text>
    </>
  );

  return (
    <DecorWrapper
      category={CATEGORY}
      theme={theme}
      topRightBadge={badge}
      bottomIndicatorText="VIRAL MARKETING CONTENT & SOCIAL GROWTH FUNNEL"
      svgViewBox="0 0 1200 400"
      svgDefs={svgDefs}
      svgContent={svgContent}
    >
      {/* Floating Social Media Post Card (Top-Left Safe Zone) */}
      <motion.div
        className="absolute left-[2%] sm:left-[4%] top-[3%] sm:top-[5%] w-34 sm:w-46 h-30 sm:h-38 rounded-2xl border border-orange-500/30 bg-orange-950/20 backdrop-blur-[1px] p-2 flex flex-col justify-between shadow-[0_0_25px_rgba(251,146,60,0.15)] hidden lg:flex opacity-75 hover:opacity-100 transition-opacity z-10"
        style={{ transform: "translateZ(0)", willChange: "transform" }}
        animate={{ y: [0, -6, 0], rotate: [0, -2, 0] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="flex items-center justify-between border-b border-orange-500/20 pb-1.5">
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-full border border-orange-400 bg-orange-500/20 flex items-center justify-center font-mono text-[8px] text-orange-300 font-bold">
              IG
            </div>
            <span className="font-mono text-[9px] text-orange-200 font-bold tracking-wider">@SOCIAL_EDITOR</span>
          </div>
          <span className="font-mono text-[8px] bg-orange-500/20 text-orange-300 border border-orange-500/30 px-1 rounded">
            SPONSORED
          </span>
        </div>

        <div className="flex-1 my-1.5 border border-orange-500/15 p-1.5 rounded bg-orange-500/5 flex flex-col justify-between">
          <div className="w-full h-3 bg-orange-400/20 rounded-xs" />
          <div className="flex items-center justify-between text-orange-300">
            <span className="font-mono text-[8px] font-bold">社群爆款圖文排版策略</span>
            <span className="font-mono text-[7px] text-orange-400">CAROUSEL 1/5</span>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-orange-500/20 pt-1 font-mono text-[8px] text-orange-300">
          <div className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5 text-orange-400 fill-orange-400/30" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            <span>24.8K</span>
          </div>

          <div className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5 text-orange-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
            </svg>
            <span>1.2K</span>
          </div>

          <div className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5 text-orange-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="18" cy="5" r="3" />
              <circle cx="6" cy="12" r="3" />
              <circle cx="18" cy="19" r="3" />
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
            </svg>
            <span>4.8K</span>
          </div>
        </div>
      </motion.div>

      {/* Center Marketing ROI & Growth Funnel Card (Top-Right Safe Zone) */}
      <motion.div
        className="absolute right-[18%] sm:right-[22%] top-[3%] sm:top-[5%] w-36 sm:w-48 h-26 sm:h-34 rounded-xl border border-orange-500/30 bg-orange-950/20 backdrop-blur-[2px] p-2 flex flex-col justify-between hidden xl:flex opacity-70 hover:opacity-100 transition-opacity z-10"
        animate={{ y: [0, -6, 0], rotate: [0, 1, 0] }}
        transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="flex items-center justify-between border-b border-orange-500/20 pb-1">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
            <span className="font-mono text-[9px] text-orange-200 font-bold tracking-wider">CAMPAIGN</span>
          </div>
          <span className="font-mono text-[7px] text-orange-300 bg-orange-500/20 px-1 py-0.5 rounded border border-orange-500/30">
            ROAS 4.8x
          </span>
        </div>

        <div className="grid grid-cols-2 gap-1.5 my-1">
          <div className="bg-orange-500/10 border border-orange-500/20 p-1.5 rounded-lg flex flex-col justify-between">
            <span className="font-mono text-[7px] text-orange-300">CTR</span>
            <span className="font-mono text-[10px] font-extrabold text-orange-200">8.4%</span>
          </div>
          <div className="bg-orange-500/10 border border-orange-500/20 p-1.5 rounded-lg flex flex-col justify-between">
            <span className="font-mono text-[7px] text-orange-300">互動</span>
            <span className="font-mono text-[10px] font-extrabold text-orange-200">128.4K</span>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-orange-500/20 pt-1 font-mono text-[7px] text-orange-300/80">
          <span>ROI 320%</span>
        </div>
      </motion.div>

      {/* Floating Hashtag Card (Bottom-Right Safe Zone) */}
      <motion.div
        className="absolute right-[2%] sm:right-[5%] bottom-[3%] sm:bottom-[5%] w-32 sm:w-40 h-22 sm:h-26 rounded-xl border border-orange-500/30 bg-orange-950/20 backdrop-blur-[1px] p-2.5 flex flex-col justify-between hidden xl:flex opacity-70 hover:opacity-100 transition-opacity shadow-[0_0_25px_rgba(251,146,60,0.15)] z-10"
        animate={{ y: [0, 6, 0], rotate: [0, 1.5, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
      >
        <div className="flex items-center justify-between border-b border-orange-500/20 pb-1">
          <span className="font-mono text-[9px] text-orange-300 font-bold tracking-wider">TOP HASHTAG</span>
          <span className="w-2 h-2 rounded-full bg-orange-400 animate-ping" />
        </div>

        <div className="flex items-center gap-2 my-1">
          <div className="w-8 h-8 rounded-full border border-orange-400/50 bg-orange-500/20 flex items-center justify-center shrink-0">
            <span className="font-mono text-xs font-black text-orange-300">#</span>
          </div>

          <div className="font-mono text-[8px] text-orange-200/90 leading-tight">
            <div className="font-bold text-orange-300">#小編實用懶人包</div>
            <div className="text-orange-400/80">REACH: 180K IMPRESSIONS</div>
          </div>
        </div>

        <div className="w-full flex items-center justify-between font-mono text-[7px] text-orange-400/70">
          <span>SAVE RATE: 14.2%</span>
          <span>VIRAL SCORE: 98</span>
        </div>
      </motion.div>
    </DecorWrapper>
  );
};
