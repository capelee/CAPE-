import React from "react";
import { motion } from "framer-motion";
import { DecorWrapper } from "./DecorWrapper";
import { getCategoryTheme, ThemeMode } from "./themeConfig";

interface DecorProps {
  theme: ThemeMode;
}

const CATEGORY = "平面海報廣告設計";

export const PrintPosterDecor: React.FC<DecorProps> = ({ theme }) => {
  const { strokeColor, textColor } = getCategoryTheme(CATEGORY, theme);

  const badge = (
    <div className="absolute top-3 right-4 sm:top-6 sm:right-8 flex items-center gap-2 font-mono text-[10px] sm:text-xs">
      <div className="w-2 h-2 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
      <span className={`font-bold tracking-widest ${textColor}`}>SWISS GRID SYSTEM</span>
      <span className={`hidden md:inline px-1.5 py-0.5 rounded text-[9px] border border-blue-500/30 bg-blue-500/10 font-mono ${textColor}`}>
        300 DPI CROP MARKS
      </span>
    </div>
  );

  const svgDefs = (
    <linearGradient id="blueGridGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor={strokeColor} stopOpacity="0.1" />
      <stop offset="50%" stopColor={strokeColor} stopOpacity="0.8" />
      <stop offset="100%" stopColor="#60A5FA" stopOpacity="0.1" />
    </linearGradient>
  );

  const svgContent = (
    <>
      {[100, 180, 260, 340, 420, 500, 580, 660, 740, 820, 900, 980, 1060, 1140].map((x, i) => (
        <line
          key={`col-${i}`}
          x1={x}
          y1="0"
          x2={x}
          y2="400"
          stroke={strokeColor}
          strokeWidth="0.8"
          strokeDasharray={i % 3 === 0 ? "none" : "2 4"}
          opacity={i % 3 === 0 ? "0.4" : "0.2"}
        />
      ))}

      <line x1="0" y1="80" x2="1200" y2="80" stroke={strokeColor} strokeWidth="1" strokeDasharray="4 4" opacity="0.3" />
      <line x1="0" y1="230" x2="1200" y2="230" stroke={strokeColor} strokeWidth="1.5" filter="url(#neonGlowBlue)" opacity="0.6" />
      <line x1="0" y1="320" x2="1200" y2="320" stroke={strokeColor} strokeWidth="1" strokeDasharray="4 4" opacity="0.3" />

      {/* Crop marks */}
      {[
        { x: 120, y: 50 },
        { x: 1080, y: 50 },
        { x: 120, y: 350 },
        { x: 1080, y: 350 }
      ].map((pt, i) => (
        <g key={`crop-${i}`} stroke={strokeColor} strokeWidth="1" opacity="0.7">
          <circle cx={pt.x} cy={pt.y} r="8" fill="none" />
          <line x1={pt.x - 14} y1={pt.y} x2={pt.x + 14} y2={pt.y} />
          <line x1={pt.x} y1={pt.y - 14} x2={pt.x} y2={pt.y + 14} />
        </g>
      ))}

      {/* Ruler ticks */}
      <g stroke={strokeColor} strokeWidth="1" opacity="0.4">
        {[...Array(40)].map((_, i) => (
          <line key={`ruler-${i}`} x1={100 + i * 25} y1="0" x2={100 + i * 25} y2={i % 5 === 0 ? "12" : "6"} />
        ))}
      </g>

      <text x="130" y="45" fill={strokeColor} fontSize="8" fontFamily="monospace" opacity="0.8">A1 POSTER BLEED [3mm]</text>
      <text x="1000" y="45" fill={strokeColor} fontSize="8" fontFamily="monospace" opacity="0.8">300 DPI CMYK</text>
      <text x="130" y="222" fill={strokeColor} fontSize="8" fontFamily="monospace" opacity="0.8">GOLDEN RATIO AXIS [1.618]</text>
    </>
  );

  return (
    <DecorWrapper
      category={CATEGORY}
      theme={theme}
      topRightBadge={badge}
      bottomIndicatorText="SWISS GRAPHIC POSTER & AD LAYOUT"
      svgViewBox="0 0 1200 400"
      svgDefs={svgDefs}
      svgContent={svgContent}
    >
      {/* Floating Poster (Moved to Center-Right Gap to avoid text overlap) */}
      <motion.div
        className="absolute left-[46%] lg:left-[48%] xl:left-[50%] top-[12%] sm:top-[10%] w-26 sm:w-34 h-32 sm:h-40 rounded-2xl border border-blue-500/30 bg-blue-950/20 backdrop-blur-[1px] p-2 flex flex-col justify-between shadow-[0_0_25px_rgba(59,130,246,0.15)] hidden lg:flex opacity-75 hover:opacity-100 transition-opacity will-change-transform z-10"
        style={{ transform: "translateZ(0)", willChange: "transform" }}
        animate={{ y: [0, -6, 0], rotate: [0, -2, 0] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="flex items-center justify-between border-b border-blue-500/20 pb-1">
          <span className="font-mono text-[8px] text-blue-300 font-bold tracking-widest">SWISS POSTER</span>
          <span className="font-mono text-[7px] text-blue-400">700x1000mm</span>
        </div>

        <div className="flex-1 my-2 flex flex-col justify-between border border-blue-500/15 p-1.5 rounded bg-blue-500/5">
          <div className="space-y-1">
            <div className="w-full h-4 bg-blue-400/30 rounded-sm" />
            <div className="w-3/4 h-2 bg-blue-400/20 rounded-sm" />
          </div>

          <div className="w-12 h-12 rounded-full border border-blue-400/40 bg-gradient-to-br from-blue-500/20 to-transparent flex items-center justify-center self-end">
            <div className="w-6 h-6 rounded-full border border-blue-300/60" />
          </div>

          <div className="space-y-0.5">
            <div className="w-full h-1 bg-blue-300/30 rounded-sm" />
            <div className="w-1/2 h-1 bg-blue-300/20 rounded-sm" />
          </div>
        </div>

        <div className="flex items-center gap-1 font-mono text-[7px] text-blue-300/80">
          <div className="w-3 h-2 bg-cyan-400 rounded-xs" />
          <div className="w-3 h-2 bg-pink-500 rounded-xs" />
          <div className="w-3 h-2 bg-yellow-400 rounded-xs" />
          <div className="w-3 h-2 bg-slate-900 border border-blue-400/40 rounded-xs" />
          <span className="ml-auto text-[7px]">CMYK 100%</span>
        </div>
      </motion.div>

      {/* Adobe Photoshop-style Vertical Toolbox (工具箱 - Gutter safe zone) */}
      <motion.div
        className="absolute left-[38%] md:left-[41%] lg:left-[43%] xl:left-[45%] top-[10%] sm:top-[12%] w-8 py-2 rounded-lg border border-blue-500/30 bg-blue-950/20 backdrop-blur-[2px] flex flex-col gap-1.5 items-center hidden xl:flex opacity-75 hover:opacity-100 transition-opacity z-10 shadow-[0_0_20px_rgba(59,130,246,0.1)]"
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="w-5 h-5 rounded bg-blue-500/30 text-blue-200 flex items-center justify-center cursor-pointer" title="Move Tool (V)">
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="5 9 2 12 5 15" />
            <polyline points="9 5 12 2 15 5" />
            <polyline points="15 19 12 22 9 19" />
            <polyline points="19 9 22 12 19 15" />
            <line x1="2" y1="12" x2="22" y2="12" />
            <line x1="12" y1="2" x2="12" y2="22" />
          </svg>
        </div>
        <div className="w-5 h-5 text-blue-400/60 hover:text-blue-300 flex items-center justify-center cursor-pointer" title="Marquee Tool (M)">
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="1" stroke="currentColor" strokeWidth="2" strokeDasharray="2 2" fill="none" />
          </svg>
        </div>
        <div className="w-5 h-5 text-blue-400/60 hover:text-blue-300 flex items-center justify-center cursor-pointer" title="Lasso Tool (L)">
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2c6.1 0 11 4.9 11 11s-4.9 11-11 11-11-4.9-11-11c0-2.4.8-4.6 2.1-6.4" strokeDasharray="2 2" />
          </svg>
        </div>
        <div className="w-5 h-5 text-blue-400/60 hover:text-blue-300 flex items-center justify-center cursor-pointer" title="Crop Tool (C)">
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6.13 1L6 16a2 2 0 0 0 2 2h15" />
            <path d="M1 6.13L16 6a2 2 0 0 1 2 2v15" />
          </svg>
        </div>
        <div className="w-5 h-5 text-blue-400/60 hover:text-blue-300 flex items-center justify-center cursor-pointer" title="Eyedropper Tool (I)">
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 22L2 14" />
            <path d="M19 11l-8 8M16 8l-8 8" />
            <path d="M17 3a2.82 2.82 0 1 1 4 4L9 19l-4 1 1-4Z" />
          </svg>
        </div>
        <div className="w-5 h-5 text-blue-400/60 hover:text-blue-300 flex items-center justify-center cursor-pointer" title="Brush Tool (B)">
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
          </svg>
        </div>
        <div className="w-5 h-5 text-blue-400/60 hover:text-blue-300 flex items-center justify-center cursor-pointer" title="Pen Tool (P)">
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
        </div>
        <div className="w-5 h-5 text-blue-400/60 hover:text-blue-300 flex items-center justify-center cursor-pointer" title="Horizontal Type Tool (T)">
          <span className="font-serif font-bold text-xs select-none">T</span>
        </div>
      </motion.div>

      {/* Adobe Photoshop-style Layers Panel (圖層面板 - Center-Right Zone) */}
      <motion.div
        className="absolute right-[18%] lg:right-[20%] xl:right-[22%] top-[10%] sm:top-[12%] w-36 sm:w-44 h-38 sm:h-44 rounded-xl border border-blue-500/30 bg-blue-950/20 backdrop-blur-[2px] p-2 flex flex-col justify-between hidden xl:flex opacity-70 hover:opacity-100 transition-opacity z-10 shadow-[0_0_25px_rgba(59,130,246,0.12)]"
        animate={{ y: [0, -5, 0], rotate: [0, -0.5, 0] }}
        transition={{ duration: 5.8, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
      >
        <div className="flex items-center justify-between border-b border-blue-500/20 pb-1">
          <span className="font-mono text-[8px] text-blue-300 font-bold tracking-wider">LAYERS (圖層)</span>
          <span className="font-mono text-[7px] text-blue-400">Normal / 100%</span>
        </div>
        
        <div className="flex-1 my-1.5 space-y-1 overflow-hidden font-mono text-[7px] text-blue-200">
          <div className="flex items-center gap-1.5 p-0.5 rounded bg-blue-500/10 border border-blue-500/15">
            <span className="text-[8px] opacity-80">👁️</span>
            <span className="w-2.5 h-2 border border-blue-400/30 bg-blue-400/20 rounded-xs" />
            <span className="truncate">Title Text (標題文字)</span>
          </div>
          <div className="flex items-center gap-1.5 p-0.5 rounded hover:bg-blue-500/5">
            <span className="text-[8px] opacity-80">👁️</span>
            <span className="w-2.5 h-2 border border-blue-400/30 bg-pink-400/20 rounded-xs" />
            <span className="truncate">Poster Art (海報主視覺)</span>
          </div>
          <div className="flex items-center gap-1.5 p-0.5 rounded hover:bg-blue-500/5">
            <span className="text-[8px] opacity-80">👁️</span>
            <span className="w-2.5 h-2 border border-blue-400/30 bg-yellow-400/20 rounded-xs" />
            <span className="truncate">Grid Marks (格線輔助)</span>
          </div>
          <div className="flex items-center gap-1.5 p-0.5 rounded hover:bg-blue-500/5">
            <span className="text-[8px] opacity-80">👁️</span>
            <span className="w-2.5 h-2 border border-blue-400/30 bg-slate-400/20 rounded-xs" />
            <span className="truncate">Background (背景)</span>
          </div>
        </div>

        <div className="flex justify-between items-center border-t border-blue-500/20 pt-1 text-[6px] text-blue-400">
          <span>4 Layers</span>
          <div className="flex gap-1.5">
            <span>fx</span>
            <span>🔗</span>
            <span>🗑️</span>
          </div>
        </div>
      </motion.div>

      {/* Adobe Photoshop-style CMYK Color Panel (色彩色票面板 - Far-Right Zone) */}
      <motion.div
        className="absolute right-[2%] sm:right-[4%] top-[10%] sm:top-[12%] w-30 sm:w-36 h-28 sm:h-34 rounded-xl border border-blue-500/30 bg-blue-950/20 backdrop-blur-[1px] p-2 flex flex-col justify-between hidden lg:flex opacity-70 hover:opacity-100 transition-opacity z-10 shadow-[0_0_25px_rgba(59,130,246,0.12)]"
        animate={{ y: [0, 5, 0], rotate: [0, 0.5, 0] }}
        transition={{ duration: 6.2, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
      >
        <div className="flex items-center justify-between border-b border-blue-500/20 pb-1">
          <span className="font-mono text-[8px] text-blue-300 font-bold tracking-wider">CMYK COLOR</span>
          <span className="font-mono text-[7px] text-blue-400">32-Bit</span>
        </div>

        <div className="my-1 space-y-0.5 font-mono text-[7px]">
          <div className="flex items-center gap-1">
            <span className="w-2 text-cyan-400 font-bold">C</span>
            <div className="flex-1 h-1.5 bg-cyan-950 rounded-xs overflow-hidden border border-cyan-500/25 relative">
              <div className="absolute left-0 top-0 h-full w-[65%] bg-cyan-400" />
            </div>
            <span className="w-4 text-right text-cyan-300">65%</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 text-pink-400 font-bold">M</span>
            <div className="flex-1 h-1.5 bg-pink-950 rounded-xs overflow-hidden border border-pink-500/25 relative">
              <div className="absolute left-0 top-0 h-full w-[45%] bg-pink-500" />
            </div>
            <span className="w-4 text-right text-pink-300">45%</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 text-yellow-400 font-bold">Y</span>
            <div className="flex-1 h-1.5 bg-yellow-950 rounded-xs overflow-hidden border border-yellow-500/25 relative">
              <div className="absolute left-0 top-0 h-full w-[15%] bg-yellow-400" />
            </div>
            <span className="w-4 text-right text-yellow-300">15%</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 text-slate-400 font-bold">K</span>
            <div className="flex-1 h-1.5 bg-slate-900 rounded-xs overflow-hidden border border-slate-500/25 relative">
              <div className="absolute left-0 top-0 h-full w-[5%] bg-slate-400" />
            </div>
            <span className="w-4 text-right text-slate-300">5%</span>
          </div>
        </div>

        <div className="flex gap-1.5 border-t border-blue-500/20 pt-1">
          <div className="w-3.5 h-3.5 bg-cyan-400 border border-white/20 rounded-xs" />
          <div className="w-3.5 h-3.5 bg-pink-500 border border-white/20 rounded-xs -ml-2.5 mt-0.5 z-10" />
          <div className="ml-auto flex gap-1 items-center">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            <span className="text-[6px] text-blue-400 font-mono">SWATCHES</span>
          </div>
        </div>
      </motion.div>

      {/* Floating Alignment Card (Bottom-Right Safe Zone) */}
      <motion.div
        className="absolute right-[2%] sm:right-[5%] bottom-[3%] sm:bottom-[5%] w-32 sm:w-40 h-20 sm:h-24 rounded-xl border border-blue-500/30 bg-blue-950/20 backdrop-blur-[1px] p-2.5 flex flex-col justify-between hidden xl:flex opacity-70 hover:opacity-100 transition-opacity shadow-[0_0_25px_rgba(59,130,246,0.15)] z-10"
        animate={{ y: [0, 6, 0], rotate: [0, 1.5, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
      >
        <div className="flex items-center justify-between border-b border-blue-500/20 pb-1">
          <span className="font-mono text-[9px] text-blue-300 font-bold tracking-wider">ALIGNMENT GUIDE</span>
          <span className="w-2 h-2 rounded-full bg-blue-400" />
        </div>

        <div className="flex items-center gap-2 my-1">
          <svg className="w-5 h-5 text-blue-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="9" />
            <line x1="12" y1="1" x2="12" y2="23" />
            <line x1="1" y1="12" x2="23" y2="12" />
          </svg>
          <div className="font-mono text-[8px] text-blue-200/90 leading-tight">
            <div className="font-bold text-blue-300">GRID MATCHED</div>
            <div className="text-blue-400/80">BASELINE: 12pt</div>
          </div>
        </div>

        <div className="w-full flex items-center justify-between font-mono text-[7px] text-blue-400/70">
          <span>KERNING: METRIC</span>
          <span>TRACKING: +25</span>
        </div>
      </motion.div>
    </DecorWrapper>
  );
};
