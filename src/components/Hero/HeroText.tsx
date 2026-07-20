import React from 'react';
import { motion } from 'motion/react';
import { FileText } from 'lucide-react';
import { ScrambleText } from '../ScrambleText';

interface HeroTextProps {
  theme: "dark" | "light" | "sepia";
  titleBounceTrigger: number;
  profile: any;
  incrementInteraction: () => void;
  handlePdfClick: () => void;
  scrollToElement: (id: string) => void;
}

export const HeroText: React.FC<HeroTextProps> = ({
  theme,
  titleBounceTrigger,
  profile,
  incrementInteraction,
  handlePdfClick,
  scrollToElement
}) => {
  return (
    <div className="flex-1 max-w-2xl text-left overflow-visible relative flex flex-col justify-center">
      {/* 1. Tag Wrapper (above the line, slides UP) */}
      <div className="overflow-hidden pb-1">
        <motion.div
          initial={{ y: "110%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1], delay: 0.35 }}
        >
          <ScrambleText text="視覺設計 · 平面設計" className={`text-[11px] sm:text-xs font-mono font-bold uppercase block ${
            theme === "sepia" 
              ? "text-[#A05C2C]" 
              : theme === "light" 
              ? "text-amber-600" 
              : "text-amber-400"
          }`} />
        </motion.div>
      </div>

      {/* 2. The Anchor Line itself (scales horizontally from left) */}
      <div className="relative py-1 overflow-visible">
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          style={{ transformOrigin: "left" }}
          className={`h-[1px] w-full ${
            theme === "sepia" 
              ? "bg-[#DFCFA0]" 
              : theme === "light" 
              ? "bg-zinc-200" 
              : "bg-white/10"
          }`}
        />
      </div>

      {/* 3. Text and Buttons Wrapper (below the line, slides DOWN) */}
      <div className="overflow-hidden pt-2">
        <motion.div
          initial={{ y: "-110%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.45 }}
          className="space-y-6"
        >
          <h1 className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-sans font-extrabold tracking-tight leading-[1.1] transition-colors duration-350 select-none ${
            theme === "sepia" 
              ? "text-[#2B1B0C]" 
              : theme === "light" 
              ? "text-zinc-950" 
              : "text-white"
          }`}>
            {"Cape Lee".split("").map((char, index) => {
              if (char === " ") {
                return (
                  <span key={index} className="inline-block">
                    &nbsp;
                  </span>
                );
              }
              return (
                <motion.span
                  key={`${index}-${titleBounceTrigger}`}
                  className="inline-block origin-bottom"
                  initial={{ y: 0 }}
                  animate={titleBounceTrigger > 0 ? { y: [0, -20, 3, 0] } : { y: 0 }}
                  transition={{
                    duration: 0.55,
                    ease: "easeOut",
                    delay: index * 0.04,
                  }}
                >
                  {char}
                </motion.span>
              );
            })}
          </h1>

          <p className={`text-sm sm:text-md md:text-[17px] font-light leading-relaxed transition-colors duration-350 ${
            theme === "sepia" 
              ? "text-[#5C4D3C]" 
              : theme === "light" 
              ? "text-zinc-650" 
              : "text-zinc-300"
          }`}>
            5 ~ 6 年品牌商業整合設計實戰經驗，作品橫跨電商視覺、品牌識別與原創角色 IP。
          </p>

          <div className="flex flex-wrap items-center gap-3.5 pt-1 pb-1">
            <button
              onClick={() => scrollToElement("portfolio-grid")}
              className={`px-6 py-3 font-semibold rounded-xl text-xs sm:text-sm transition-all duration-300 shadow-md active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer ${
                theme === "sepia"
                  ? "bg-[#A05C2C] hover:bg-[#854B22] text-[#FCF8EE] shadow-amber-950/20"
                  : theme === "light"
                  ? "bg-amber-600 hover:bg-amber-700 text-white shadow-amber-600/20"
                  : "bg-amber-500 hover:bg-amber-400 text-zinc-950 shadow-amber-500/20"
              }`}
            >
              看作品
            </button>
            
            <button
              onClick={() => scrollToElement("designer-bento")}
              className={`px-6 py-3 font-medium rounded-xl text-xs sm:text-sm transition-all duration-300 border backdrop-blur active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer ${
                theme === "sepia"
                  ? "border-[#DFCFA0] hover:bg-[#EADECC]/40 text-[#4F3C28]"
                  : theme === "light"
                  ? "border-zinc-200 hover:bg-zinc-50 text-zinc-700"
                  : "border-white/10 hover:bg-white/5 text-zinc-300"
              }`}
            >
              履歷
            </button>

            {profile.pdfPortfolioUrl && (
              <a
                href={profile.pdfPortfolioUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  incrementInteraction();
                  handlePdfClick();
                }}
                className={`relative group px-6 py-3 font-medium rounded-xl text-xs sm:text-sm transition-all duration-300 border backdrop-blur active:scale-95 flex items-center justify-center gap-1.5 ${
                  theme === "sepia"
                    ? "border-[#DFCFA0] hover:bg-[#EADECC]/40 text-[#4F3C28]"
                    : theme === "light"
                    ? "border-zinc-200 hover:bg-zinc-50 text-zinc-700"
                    : "border-white/10 hover:bg-white/5 text-zinc-300"
                }`}
                title="開啟雲端儲存的傳統 PDF 作品集"
              >
                {/* 姆貓偷看 (Peek-a-boo Mascot) */}
                <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-[-3px] pointer-events-none transition-all duration-300 ease-out opacity-0 translate-y-3 scale-75 group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-100 group-hover:rotate-[-6deg] z-20 flex flex-col items-center">
                  {/* 姆貓小氣泡 */}
                  <div className={`px-2 py-0.5 rounded-full text-[10px] whitespace-nowrap shadow-md mb-1 border font-bold animate-bounce ${
                    theme === "sepia"
                      ? "bg-[#FCF8EE] border-[#EAD09D] text-[#382B1D]"
                      : theme === "light"
                      ? "bg-white border-zinc-200 text-zinc-700"
                      : "bg-zinc-800 border-zinc-700 text-zinc-200"
                  }`}>
                    看我！🐾
                  </div>
                  {/* 姆貓頭像縮圖 */}
                  <img 
                    src="https://drive.google.com/thumbnail?sz=w1000&id=1eqi9X536nUrXqj-gv6kqjNMfpiC1YumX" 
                    alt="姆貓偷看"
                    className="w-10 h-10 object-contain drop-shadow-md select-none"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <FileText className="w-4 h-4 text-amber-500 shrink-0" />
                <span>PDF 作品集</span>
              </a>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};
