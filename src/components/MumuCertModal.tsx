import React, { useState, forwardRef, useImperativeHandle, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  X, Award, Clock, Palette, Sparkles, BookOpen, Heart, Share2, Crown, Zap, FileText, GraduationCap, Wind 
} from "lucide-react";
import { playMeowSound } from "../utils/audioEffects";

export interface MumuCertModalRef {
  open: () => void;
}

interface MumuCertModalProps {
  theme: "dark" | "light" | "sepia";
  interactionCount: number;
  midnightUnlocked: boolean;
  visitedThemes: string[];
  fortuneCount: number;
  viewedProjects: string[];
  zenUnlocked: boolean;
  socialUnlocked: boolean;
  slackerUnlocked: boolean;
  aiWizardUnlocked: boolean;
  premiumCanUnlocked: boolean;
  balloonUnlocked: boolean;
  magicMumuUnlocked: boolean;
  gravityRestoreUnlocked: boolean;
  pdfUnlocked: boolean;
  tutorialAchUnlocked: boolean;
  windStormUnlocked: boolean;
  setHeroParticles: React.Dispatch<React.SetStateAction<any[]>>;
  setTitleBounceTrigger: React.Dispatch<React.SetStateAction<number>>;
}

export const MumuCertModal = forwardRef<MumuCertModalRef, MumuCertModalProps>((props, ref) => {
  const {
    theme,
    interactionCount,
    midnightUnlocked,
    visitedThemes,
    fortuneCount,
    viewedProjects,
    zenUnlocked,
    socialUnlocked,
    slackerUnlocked,
    aiWizardUnlocked,
    premiumCanUnlocked,
    balloonUnlocked,
    magicMumuUnlocked,
    gravityRestoreUnlocked,
    pdfUnlocked,
    tutorialAchUnlocked,
    windStormUnlocked,
    setHeroParticles,
    setTitleBounceTrigger,
  } = props;

  const [isOpen, setIsOpen] = useState(false);
  const certModalRef = useRef<HTMLDivElement>(null);

  useImperativeHandle(ref, () => ({
    open: () => {
      setIsOpen(true);
    }
  }));

  // Handle ESC key press to close the Mumu Certified Omamori modal
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      // Auto focus the modal wrapper to guarantee that Esc can always be captured in iframes
      setTimeout(() => {
        if (certModalRef.current) {
          certModalRef.current.focus();
        }
      }, 50);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const totalAchievements = 15;
  const unlockedCount = [
    midnightUnlocked,
    visitedThemes.length >= 3,
    fortuneCount >= 3,
    viewedProjects.length >= 5,
    zenUnlocked,
    socialUnlocked,
    slackerUnlocked,
    aiWizardUnlocked,
    premiumCanUnlocked,
    balloonUnlocked,
    magicMumuUnlocked,
    gravityRestoreUnlocked,
    pdfUnlocked,
    tutorialAchUnlocked,
    windStormUnlocked
  ].filter(Boolean).length;

  return (
    <AnimatePresence>
      {isOpen && (
        <div 
          ref={certModalRef}
          tabIndex={-1}
          className="fixed inset-0 z-[999999] flex items-center justify-center p-4 outline-none"
        >
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Certificate Card Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ type: "spring", damping: 25, stiffness: 220 }}
            style={{
              clipPath: "polygon(15% 0%, 85% 0%, 100% 8%, 100% 100%, 0% 100%, 0% 8%)"
            }}
            className={`relative w-full max-w-lg p-6 sm:p-8 pt-10 sm:pt-12 rounded-t-3xl border shadow-2xl overflow-hidden flex flex-col items-center text-center ${
              theme === "sepia"
                ? "bg-gradient-to-b from-[#8C231A] to-[#59110B] border-[#EAD09D]/40 text-[#FCF8EE] shadow-black/60"
                : theme === "light"
                ? "bg-gradient-to-b from-[#FDF2F4] via-[#FCE4E6] to-[#F5CBD0] border-pink-400/30 text-pink-950 shadow-pink-200/50"
                : "bg-gradient-to-b from-[#1C112B] to-[#0A0512] border-amber-500/35 text-amber-100/90 shadow-black/80"
            }`}
          >
            {/* Hanging Silk Cord and Traditional Kano Knot (二重叶結び) */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none z-20">
              <div className={`w-[2px] h-6 sm:h-7 ${
                theme === "sepia" ? "bg-[#EAD09D]" : theme === "light" ? "bg-pink-500" : "bg-amber-400"
              }`} />
              <div className="w-10 h-6 -mt-1 flex items-center justify-center">
                <svg viewBox="0 0 24 12" className={`w-full h-full fill-none ${
                  theme === "sepia" ? "stroke-[#EAD09D]" : theme === "light" ? "stroke-pink-600" : "stroke-amber-400"
                }`} strokeWidth="2">
                  <path d="M12,4 C6,0 4,8 12,6 C20,8 18,0 12,4 Z" />
                  <path d="M12,6 L8,12 M12,6 L16,12" />
                </svg>
              </div>
            </div>

            {/* Decorative Dashed Inner Border */}
            <div 
              style={{ 
                clipPath: "polygon(15% 0%, 85% 0%, 100% 8%, 100% 100%, 0% 100%, 0% 8%)",
                inset: "6px"
              }}
              className={`absolute border-2 border-dashed pointer-events-none rounded-t-2xl ${
                theme === "sepia"
                  ? "border-[#EAD09D]/20"
                  : theme === "light"
                  ? "border-pink-300/40"
                  : "border-amber-400/15"
              }`}
            />

            {/* Background patterns */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-white/5 via-transparent to-transparent pointer-events-none" />

            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              type="button"
              className={`absolute top-6 right-6 p-1 rounded-lg border transition-all duration-300 cursor-pointer z-30 ${
                theme === "sepia"
                  ? "border-[#EAD09D]/20 text-[#EAD09D]/70 hover:bg-[#EAD09D]/10"
                  : theme === "light"
                  ? "border-pink-300/30 text-pink-700 hover:text-pink-900 hover:bg-pink-50/50"
                  : "border-white/10 text-amber-400/60 hover:text-amber-400 hover:bg-white/5"
              }`}
            >
              <X className="h-4 w-4" />
            </button>

            {/* Elegant header */}
            <div className="flex flex-col items-center gap-1.5 mb-3.5 relative z-10 mt-2">
              <div className={`p-2.5 rounded-full border mb-1.5 ${
                theme === "sepia"
                  ? "bg-amber-500/10 border-amber-500/30 text-amber-300"
                  : theme === "light"
                  ? "bg-pink-100 border-pink-400/20 text-pink-600"
                  : "bg-amber-400/15 border-amber-400/30 text-amber-400"
              }`}>
                <Award className="h-7 w-7 animate-bounce" style={{ animationDuration: "2.5s" }} />
              </div>
              <h3 className={`text-lg sm:text-xl font-bold tracking-widest font-serif ${
                theme === "sepia" ? "text-[#EAD09D]" : theme === "light" ? "text-pink-800" : "text-amber-400"
              }`}>
                ⛩️ 姆貓教特別認證御守 🐾
              </h3>
              <div className={`h-[1.5px] w-28 bg-gradient-to-r ${
                theme === "sepia"
                  ? "from-transparent via-[#EAD09D]/50 to-transparent"
                  : theme === "light"
                  ? "from-transparent via-pink-400/50 to-transparent"
                  : "from-transparent via-amber-500/50 to-transparent"
              }`} />
              <span className={`text-[9px] font-serif tracking-[0.25em] uppercase opacity-60 font-bold ${
                theme === "sepia" ? "text-[#EAD09D]" : theme === "light" ? "text-pink-600" : "text-amber-400"
              }`}>
                MUMU BLESSED OMAMORI
              </span>
            </div>

            {/* Certificate content */}
            <div className="space-y-3.5 relative z-10 mb-4 text-center max-w-md">
              <p className={`text-xs sm:text-sm font-medium leading-relaxed ${
                theme === "sepia" ? "text-zinc-100" : theme === "light" ? "text-zinc-800" : "text-zinc-200"
              }`}>
                特此證明您與姆貓教主已累積互動達 <strong className={`text-base sm:text-lg mx-1 font-bold ${
                  theme === "sepia" ? "text-[#EAD09D]" : theme === "light" ? "text-pink-600" : "text-amber-400"
                }`}>{interactionCount}</strong> 次，展現了無與倫比的虔誠與喜愛！
              </p>
              
              <p className={`text-[11px] sm:text-xs leading-relaxed border-t border-b py-2 px-3 mb-2 rounded-lg italic ${
                theme === "sepia"
                  ? "border-[#EAD09D]/20 text-[#EAD09D]/90 bg-black/25"
                  : theme === "light"
                  ? "border-pink-300/30 text-pink-900/95 bg-white/40"
                  : "border-white/5 text-zinc-300 bg-white/2"
              }`}>
                「本教主授予此御守，特許您獲得『每日摸魚特權、開運招財加薪、諸事順遂』之終身守護魔法祝福！😻✨🐾」
              </p>
            </div>

            {/* 榮譽成就清單 (Honorable Achievements List) */}
            <div className="w-full relative z-10 mb-4 text-left space-y-2">
              <h4 className={`text-xs font-bold tracking-widest uppercase flex items-center gap-1.5 px-1 font-serif ${
                theme === "sepia" ? "text-[#EAD09D]" : theme === "light" ? "text-pink-800" : "text-amber-400"
              }`}>
                🏆 神社神格成就進度
              </h4>
              
              <div className="space-y-1.5 max-h-[220px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-zinc-700/50">
                {/* 成就 1: 深夜擼貓者 */}
                <div className={`p-2 rounded-xl border flex gap-2.5 transition-all duration-300 ${
                  midnightUnlocked
                    ? theme === "sepia"
                      ? "bg-black/30 border-[#EAD09D]/30 shadow-inner"
                      : theme === "light"
                      ? "bg-white/60 border-pink-400/30 shadow-sm"
                      : "bg-amber-500/5 border-amber-500/25 shadow-inner"
                    : "opacity-40 bg-transparent border-dashed border-zinc-200/20 dark:border-zinc-800/20"
                }`}>
                  <div className={`p-1.5 rounded-lg flex-shrink-0 flex items-center justify-center h-8 w-8 ${
                    midnightUnlocked 
                      ? "bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-sm"
                      : "bg-zinc-800/40 text-zinc-500"
                  }`}>
                    <Clock className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-bold tracking-wide ${
                        theme === "sepia" ? "text-white" : ""
                      }`}>
                        {midnightUnlocked ? "「深夜擼貓者」🐾" : "「深夜擼貓者」🔒"}
                      </span>
                      {midnightUnlocked && (
                        <span className="text-[8px] font-bold text-indigo-400 uppercase tracking-wider bg-indigo-500/10 px-1 py-0.5 rounded">
                          已解鎖
                        </span>
                      )}
                    </div>
                    <p className="text-[9px] leading-relaxed mt-0.5 opacity-75">
                      {midnightUnlocked
                        ? "「夜深了本教主特賜好眠魔法～✨踩腳印祝福送達！」"
                        : "（於深夜 11 點至凌晨 4 點間點擊 Hero 貓咪或吉祥物）"}
                    </p>
                  </div>
                </div>

                {/* 成就 2: 時空穿梭大師 */}
                {(() => {
                  const isThemeUnlocked = visitedThemes.length >= 3;
                  return (
                    <div className={`p-2 rounded-xl border flex gap-2.5 transition-all duration-300 ${
                      isThemeUnlocked
                        ? theme === "sepia"
                          ? "bg-black/30 border-[#EAD09D]/30 shadow-inner"
                          : theme === "light"
                          ? "bg-white/60 border-pink-400/30 shadow-sm"
                          : "bg-amber-500/5 border-amber-500/25 shadow-inner"
                        : "opacity-40 bg-transparent border-dashed border-zinc-200/20 dark:border-zinc-800/20"
                    }`}>
                      <div className={`p-1.5 rounded-lg flex-shrink-0 flex items-center justify-center h-8 w-8 ${
                        isThemeUnlocked 
                          ? "bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-sm"
                          : "bg-zinc-800/40 text-zinc-500"
                      }`}>
                        <Palette className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className={`text-[10px] font-bold tracking-wide ${
                            theme === "sepia" ? "text-white" : ""
                          }`}>
                            {isThemeUnlocked ? "「時空穿梭大師」🎨" : "「時空穿梭大師」🔒"}
                          </span>
                          {isThemeUnlocked ? (
                            <span className="text-[8px] font-bold text-emerald-400 uppercase tracking-wider bg-emerald-500/10 px-1 py-0.5 rounded">
                              已解鎖
                            </span>
                          ) : (
                            <span className="text-[8px] opacity-65 font-mono">
                              ({visitedThemes.length}/3)
                            </span>
                          )}
                        </div>
                        <p className="text-[9px] leading-relaxed mt-0.5 opacity-75">
                          {isThemeUnlocked
                            ? "「成功解鎖三大神學配色，美感感知力永久加持！」"
                            : "（完整切換並體驗三種視覺主題配色）"}
                        </p>
                      </div>
                    </div>
                  );
                })()}

                {/* 成就 3: 命運之友 */}
                {(() => {
                  const isFortuneUnlocked = fortuneCount >= 3;
                  return (
                    <div className={`p-2 rounded-xl border flex gap-2.5 transition-all duration-300 ${
                      isFortuneUnlocked
                        ? theme === "sepia"
                          ? "bg-black/30 border-[#EAD09D]/30 shadow-inner"
                          : theme === "light"
                          ? "bg-white/60 border-pink-400/30 shadow-sm"
                          : "bg-amber-500/5 border-amber-500/25 shadow-inner"
                        : "opacity-40 bg-transparent border-dashed border-zinc-200/20 dark:border-zinc-800/20"
                    }`}>
                      <div className={`p-1.5 rounded-lg flex-shrink-0 flex items-center justify-center h-8 w-8 ${
                        isFortuneUnlocked 
                          ? "bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-sm"
                          : "bg-zinc-800/40 text-zinc-500"
                      }`}>
                        <Sparkles className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className={`text-[10px] font-bold tracking-wide ${
                            theme === "sepia" ? "text-white" : ""
                          }`}>
                            {isFortuneUnlocked ? "「命運之友」🔮" : "「命運之友」🔒"}
                          </span>
                          {isFortuneUnlocked ? (
                            <span className="text-[8px] font-bold text-amber-400 uppercase tracking-wider bg-amber-500/10 px-1 py-0.5 rounded">
                              已解鎖
                            </span>
                          ) : (
                            <span className="text-[8px] opacity-65 font-mono">
                              ({fortuneCount}/3)
                            </span>
                          )}
                        </div>
                        <p className="text-[9px] leading-relaxed mt-0.5 opacity-75">
                          {isFortuneUnlocked
                            ? "「與神社占卜達成了神聖靈魂連結，今日好運翻倍！」"
                            : "（於底部神社內進行運勢諮詢或求籤達 3 次）"}
                        </p>
                      </div>
                    </div>
                  );
                })()}

                {/* 成就 4: 作品鑑賞家 */}
                {(() => {
                  const isPortfolioUnlocked = viewedProjects.length >= 5;
                  return (
                    <div className={`p-2 rounded-xl border flex gap-2.5 transition-all duration-300 ${
                      isPortfolioUnlocked
                        ? theme === "sepia"
                          ? "bg-black/30 border-[#EAD09D]/30 shadow-inner"
                          : theme === "light"
                          ? "bg-white/60 border-pink-400/30 shadow-sm"
                          : "bg-amber-500/5 border-amber-500/25 shadow-inner"
                        : "opacity-40 bg-transparent border-dashed border-zinc-200/20 dark:border-zinc-800/20"
                    }`}>
                      <div className={`p-1.5 rounded-lg flex-shrink-0 flex items-center justify-center h-8 w-8 ${
                        isPortfolioUnlocked 
                          ? "bg-gradient-to-br from-rose-500 to-pink-600 text-white shadow-sm"
                          : "bg-zinc-800/40 text-zinc-500"
                      }`}>
                        <BookOpen className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className={`text-[10px] font-bold tracking-wide ${
                            theme === "sepia" ? "text-white" : ""
                          }`}>
                            {isPortfolioUnlocked ? "「作品鑑賞家」📖" : "「作品鑑賞家」🔒"}
                          </span>
                          {isPortfolioUnlocked ? (
                            <span className="text-[8px] font-bold text-rose-400 uppercase tracking-wider bg-rose-500/10 px-1 py-0.5 rounded">
                              已解鎖
                            </span>
                          ) : (
                            <span className="text-[8px] opacity-65 font-mono">
                              ({viewedProjects.length}/5)
                            </span>
                          )}
                        </div>
                        <p className="text-[9px] leading-relaxed mt-0.5 opacity-75">
                          {isPortfolioUnlocked
                            ? "「深入體悟了設計結晶，創意爆棚與你同在！」"
                            : "（深入閱讀並打開 5 個不同的作品展示卡片）"}
                        </p>
                      </div>
                    </div>
                  );
                })()}

                {/* 成就 5: 靜心禪修者 */}
                <div className={`p-2 rounded-xl border flex gap-2.5 transition-all duration-300 ${
                  zenUnlocked
                    ? theme === "sepia"
                      ? "bg-black/30 border-[#EAD09D]/30 shadow-inner"
                      : theme === "light"
                      ? "bg-white/60 border-pink-400/30 shadow-sm"
                      : "bg-amber-500/5 border-amber-500/25 shadow-inner"
                    : "opacity-40 bg-transparent border-dashed border-zinc-200/20 dark:border-zinc-800/20"
                }`}>
                  <div className={`p-1.5 rounded-lg flex-shrink-0 flex items-center justify-center h-8 w-8 ${
                    zenUnlocked 
                      ? "bg-gradient-to-br from-[#A855F7] to-[#EC4899] text-white shadow-sm"
                      : "bg-zinc-800/40 text-zinc-500"
                  }`}>
                    <Heart className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-bold tracking-wide ${
                        theme === "sepia" ? "text-white" : ""
                      }`}>
                        {zenUnlocked ? "「靜心禪修者」🧘‍♀️" : "「靜心禪修者」🔒"}
                      </span>
                      {zenUnlocked && (
                        <span className="text-[8px] font-bold text-[#EC4899] uppercase tracking-wider bg-[#EC4899]/10 px-1 py-0.5 rounded">
                          已解鎖
                        </span>
                      )}
                    </div>
                    <p className="text-[9px] leading-relaxed mt-0.5 opacity-75">
                      {zenUnlocked
                        ? "「靜心陪伴本教主，美學感知與專注度已達全新禪境。」"
                        : "（於網頁停留、賞析作品滿 3 分鐘以上）"}
                    </p>
                  </div>
                </div>

                {/* 成就 6: 社交宣傳使者 */}
                <div className={`p-2 rounded-xl border flex gap-2.5 transition-all duration-300 ${
                  socialUnlocked
                    ? theme === "sepia"
                      ? "bg-black/30 border-[#EAD09D]/30 shadow-inner"
                      : theme === "light"
                      ? "bg-white/60 border-pink-400/30 shadow-sm"
                      : "bg-amber-500/5 border-amber-500/25 shadow-inner"
                    : "opacity-40 bg-transparent border-dashed border-zinc-200/20 dark:border-zinc-800/20"
                }`}>
                  <div className={`p-1.5 rounded-lg flex-shrink-0 flex items-center justify-center h-8 w-8 ${
                    socialUnlocked 
                      ? "bg-gradient-to-br from-[#3B82F6] to-[#06B6D4] text-white shadow-sm"
                      : "bg-zinc-800/40 text-zinc-500"
                  }`}>
                    <Share2 className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-bold tracking-wide ${
                        theme === "sepia" ? "text-white" : ""
                      }`}>
                        {socialUnlocked ? "「社交宣傳使者」🐾" : "「社交宣傳使者」🔒"}
                      </span>
                      {socialUnlocked && (
                        <span className="text-[8px] font-bold text-[#06B6D4] uppercase tracking-wider bg-[#06B6D4]/10 px-1 py-0.5 rounded">
                          已解鎖
                        </span>
                      )}
                    </div>
                    <p className="text-[9px] leading-relaxed mt-0.5 opacity-75">
                      {socialUnlocked
                        ? "「宣揚我教！特賜你『人緣爆棚、貴人相助』之神社福報！」"
                        : "（點擊 IG 或社群連結宣揚本教萌光與美學）"}
                    </p>
                  </div>
                </div>

                {/* 成就 7: 極意摸魚之神 */}
                <div className={`p-2 rounded-xl border flex gap-2.5 transition-all duration-300 ${
                  slackerUnlocked
                    ? theme === "sepia"
                      ? "bg-black/30 border-[#EAD09D]/30 shadow-inner"
                      : theme === "light"
                      ? "bg-white/60 border-pink-400/30 shadow-sm"
                      : "bg-amber-500/5 border-amber-500/25 shadow-inner"
                    : "opacity-40 bg-transparent border-dashed border-zinc-200/20 dark:border-zinc-800/20"
                }`}>
                  <div className={`p-1.5 rounded-lg flex-shrink-0 flex items-center justify-center h-8 w-8 ${
                    slackerUnlocked 
                      ? "bg-gradient-to-br from-[#F59E0B] to-[#EF4444] text-white shadow-sm"
                      : "bg-zinc-800/40 text-zinc-500"
                  }`}>
                    <Crown className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-bold tracking-wide ${
                        theme === "sepia" ? "text-white" : ""
                      }`}>
                        {slackerUnlocked ? "「極意摸魚之神」👑" : "「極意摸魚之神」🔒"}
                      </span>
                      {slackerUnlocked ? (
                        <span className="text-[8px] font-bold text-[#F59E0B] uppercase tracking-wider bg-[#F59E0B]/10 px-1 py-0.5 rounded">
                          已解鎖
                        </span>
                      ) : (
                        <span className="text-[8px] opacity-65 font-mono">
                          ({interactionCount}/100)
                        </span>
                      )}
                    </div>
                    <p className="text-[9px] leading-relaxed mt-0.5 opacity-75">
                      {slackerUnlocked
                        ? "「特許你獲得最高榮譽：『終極無罪摸魚特權』，絕不被抓！」"
                        : "（與網頁上的貓咪或吉祥物互動累計達 100 次）"}
                    </p>
                  </div>
                </div>

                {/* 成就 8: AI 協同巫師 */}
                <div className={`p-2 rounded-xl border flex gap-2.5 transition-all duration-300 ${
                  aiWizardUnlocked
                    ? theme === "sepia"
                      ? "bg-black/30 border-[#EAD09D]/30 shadow-inner"
                      : theme === "light"
                      ? "bg-white/60 border-pink-400/30 shadow-sm"
                      : "bg-amber-500/5 border-amber-500/25 shadow-inner"
                    : "opacity-40 bg-transparent border-dashed border-zinc-200/20 dark:border-zinc-800/20"
                }`}>
                  <div className={`p-1.5 rounded-lg flex-shrink-0 flex items-center justify-center h-8 w-8 ${
                    aiWizardUnlocked 
                      ? "bg-gradient-to-br from-[#10B981] to-[#059669] text-white shadow-sm"
                      : "bg-zinc-800/40 text-zinc-500"
                  }`}>
                    <Zap className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-bold tracking-wide ${
                        theme === "sepia" ? "text-white" : ""
                      }`}>
                        {aiWizardUnlocked ? "「AI 協同巫師」✨" : "「AI 協同巫師」🔒"}
                      </span>
                      {aiWizardUnlocked && (
                        <span className="text-[8px] font-bold text-[#10B981] uppercase tracking-wider bg-[#10B981]/10 px-1 py-0.5 rounded">
                          已解鎖
                        </span>
                      )}
                    </div>
                    <p className="text-[9px] leading-relaxed mt-0.5 opacity-75">
                      {aiWizardUnlocked
                        ? "「掌握人機協同神力，提案必過、設計效率雙倍加持！」"
                        : "（打開並閱讀『AI 設計輔助工作流』彈出視窗）"}
                    </p>
                  </div>
                </div>

                {/* 成就 9: 極致奢華罐罐奉納 */}
                <div className={`p-2 rounded-xl border flex gap-2.5 transition-all duration-300 ${
                  premiumCanUnlocked
                    ? theme === "sepia"
                      ? "bg-black/30 border-[#EAD09D]/30 shadow-inner"
                      : theme === "light"
                      ? "bg-white/60 border-pink-400/30 shadow-sm"
                      : "bg-amber-500/5 border-amber-500/25 shadow-inner"
                    : "opacity-40 bg-transparent border-dashed border-zinc-200/20 dark:border-zinc-800/20"
                }`}>
                  <div className={`p-1.5 rounded-lg flex-shrink-0 flex items-center justify-center h-8 w-8 ${
                    premiumCanUnlocked 
                      ? "bg-gradient-to-br from-rose-500 to-pink-600 text-white shadow-sm"
                      : "bg-zinc-800/40 text-zinc-500"
                  }`}>
                    <Award className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-bold tracking-wide ${
                        theme === "sepia" ? "text-white" : ""
                      }`}>
                        {premiumCanUnlocked ? "「極致奢華罐罐奉納」🥫" : "「極致奢華罐罐奉納」🔒"}
                      </span>
                      {premiumCanUnlocked && (
                        <span className="text-[8px] font-bold text-rose-500 uppercase tracking-wider bg-rose-500/10 px-1 py-0.5 rounded">
                          已解鎖
                        </span>
                      )}
                    </div>
                    <p className="text-[9px] leading-relaxed mt-0.5 opacity-75">
                      {premiumCanUnlocked
                        ? "「成功奉納頂級奢華罐罐！本教主神格超凡昇華，特賜予你『一世富貴、衣食無憂』之終極加冕！」"
                        : "（將畫面角落的金色貓罐罐 🥫 拖曳至白貓 MuMㄠ 姆貓的頭上）"}
                    </p>
                  </div>
                </div>

                {/* 成就 10: 飛天姆貓 */}
                <div className={`p-2 rounded-xl border flex gap-2.5 transition-all duration-300 ${
                  balloonUnlocked
                    ? theme === "sepia"
                      ? "bg-black/30 border-[#EAD09D]/30 shadow-inner"
                      : theme === "light"
                      ? "bg-white/60 border-pink-400/30 shadow-sm"
                      : "bg-amber-500/5 border-amber-500/25 shadow-inner"
                    : "opacity-40 bg-transparent border-dashed border-zinc-200/20 dark:border-zinc-800/20"
                }`}>
                  <div className={`p-1.5 rounded-lg flex-shrink-0 flex items-center justify-center h-8 w-8 ${
                    balloonUnlocked 
                      ? "bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-sm"
                      : "bg-zinc-800/40 text-zinc-500"
                  }`}>
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-bold tracking-wide ${
                        theme === "sepia" ? "text-white" : ""
                      }`}>
                        {balloonUnlocked ? "「飛天姆貓」🎈" : "「飛天姆貓」🔒"}
                      </span>
                      {balloonUnlocked && (
                        <span className="text-[8px] font-bold text-purple-400 uppercase tracking-wider bg-purple-500/10 px-1 py-0.5 rounded">
                          已解鎖
                        </span>
                      )}
                    </div>
                    <p className="text-[9px] leading-relaxed mt-0.5 opacity-75">
                      {balloonUnlocked
                        ? "「噗咻——！姆貓升空！獲得教主親授『高空俯瞰、視界大開』之靈感飛昇護佑！」"
                        : "（快速連擊導覽列或履歷面板的姆貓 MuMㄠ 頭像，使其像氣球一樣漏氣飛走）"}
                    </p>
                  </div>
                </div>

                {/* 成就 11: 魔法姆貓 */}
                <div className={`p-2 rounded-xl border flex gap-2.5 transition-all duration-300 ${
                  magicMumuUnlocked
                    ? theme === "sepia"
                      ? "bg-black/30 border-[#EAD09D]/30 shadow-inner"
                      : theme === "light"
                      ? "bg-white/60 border-pink-400/30 shadow-sm"
                      : "bg-amber-500/5 border-amber-500/25 shadow-inner"
                    : "opacity-40 bg-transparent border-dashed border-zinc-200/20 dark:border-zinc-800/20"
                }`}>
                  <div className={`p-1.5 rounded-lg flex-shrink-0 flex items-center justify-center h-8 w-8 ${
                    magicMumuUnlocked 
                      ? "bg-gradient-to-br from-pink-500 to-amber-500 text-white shadow-sm"
                      : "bg-zinc-800/40 text-zinc-500"
                  }`}>
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-bold tracking-wide ${
                        theme === "sepia" ? "text-white" : ""
                      }`}>
                        {magicMumuUnlocked ? "「魔法姆貓」🪄" : "「魔法姆貓」🔒"}
                      </span>
                      {magicMumuUnlocked && (
                        <span className="text-[8px] font-bold text-amber-500 uppercase tracking-wider bg-amber-500/10 px-1 py-0.5 rounded">
                          已解鎖
                        </span>
                      )}
                    </div>
                    <p className="text-[9px] leading-relaxed mt-0.5 opacity-75">
                      {magicMumuUnlocked
                        ? "「噗哩噗哩——變身！解鎖神秘隱藏的魔法姆貓姿態，獲得夢幻幸運加持！」"
                        : "（快速連擊 HERO 頁面的白貓 MuMㄠ 姆貓，解鎖變身姿態）"}
                    </p>
                  </div>
                </div>

                {/* 成就 12: 重力掌控者 */}
                <div className={`p-2 rounded-xl border flex gap-2.5 transition-all duration-300 ${
                  gravityRestoreUnlocked
                    ? theme === "sepia"
                      ? "bg-black/30 border-[#EAD09D]/30 shadow-inner"
                      : theme === "light"
                      ? "bg-white/60 border-pink-400/30 shadow-sm"
                      : "bg-amber-500/5 border-amber-500/25 shadow-inner"
                    : "opacity-40 bg-transparent border-dashed border-zinc-200/20 dark:border-zinc-800/20"
                }`}>
                  <div className={`p-1.5 rounded-lg flex-shrink-0 flex items-center justify-center h-8 w-8 ${
                    gravityRestoreUnlocked 
                      ? "bg-gradient-to-br from-cyan-500 to-indigo-600 text-white shadow-sm"
                      : "bg-zinc-800/40 text-zinc-500"
                  }`}>
                    <Zap className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-bold tracking-wide ${
                        theme === "sepia" ? "text-white" : ""
                      }`}>
                        {gravityRestoreUnlocked ? "「重力掌控者」🌌" : "「重力掌控者」🔒"}
                      </span>
                      {gravityRestoreUnlocked && (
                        <span className="text-[8px] font-bold text-cyan-400 uppercase tracking-wider bg-cyan-500/10 px-1 py-0.5 rounded">
                          已解鎖
                        </span>
                      )}
                    </div>
                    <p className="text-[9px] leading-relaxed mt-0.5 opacity-75">
                      {gravityRestoreUnlocked
                        ? "「重建崩塌的世界！成功解鎖『扭轉乾坤、重塑秩序』之神聖履歷治癒護佑！」"
                        : "（點擊履歷右上角進行 [重力測試]，再點擊 [魔法復原] 重建履歷）"}
                    </p>
                  </div>
                </div>

                {/* 成就 13: 傳統派讀者 */}
                <div className={`p-2 rounded-xl border flex gap-2.5 transition-all duration-300 ${
                  pdfUnlocked
                    ? theme === "sepia"
                      ? "bg-black/30 border-[#EAD09D]/30 shadow-inner"
                      : theme === "light"
                      ? "bg-white/60 border-pink-400/30 shadow-sm"
                      : "bg-amber-500/5 border-amber-500/25 shadow-inner"
                    : "opacity-40 bg-transparent border-dashed border-zinc-200/20 dark:border-zinc-800/20"
                }`}>
                  <div className={`p-1.5 rounded-lg flex-shrink-0 flex items-center justify-center h-8 w-8 ${
                    pdfUnlocked 
                      ? "bg-gradient-to-br from-orange-400 to-amber-600 text-white shadow-sm"
                      : "bg-zinc-800/40 text-zinc-500"
                  }`}>
                    <FileText className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-bold tracking-wide ${
                        theme === "sepia" ? "text-white" : ""
                      }`}>
                        {pdfUnlocked ? "「傳統派讀者」📖" : "「傳統派讀者」🔒"}
                      </span>
                      {pdfUnlocked && (
                        <span className="text-[8px] font-bold text-orange-400 uppercase tracking-wider bg-orange-500/10 px-1 py-0.5 rounded">
                          已解鎖
                        </span>
                      )}
                    </div>
                    <p className="text-[9px] leading-relaxed mt-0.5 opacity-75">
                      {pdfUnlocked
                        ? "「返璞歸真！雖然網頁很炫，但你依然沒忘記下載 PDF 版本，本教主賜予你『穩健務實』之力！」"
                        : "（點擊首頁的 [PDF 作品集] 開啟傳統格式履歷）"}
                    </p>
                  </div>
                </div>

                {/* 成就 14: 新手上路 */}
                <div className={`p-2 rounded-xl border flex gap-2.5 transition-all duration-300 ${
                  tutorialAchUnlocked
                    ? theme === "sepia"
                      ? "bg-black/30 border-[#EAD09D]/30 shadow-inner"
                      : theme === "light"
                      ? "bg-white/60 border-pink-400/30 shadow-sm"
                      : "bg-amber-500/5 border-amber-500/25 shadow-inner"
                    : "opacity-40 bg-transparent border-dashed border-zinc-200/20 dark:border-zinc-800/20"
                }`}>
                  <div className={`p-1.5 rounded-lg flex-shrink-0 flex items-center justify-center h-8 w-8 ${
                    tutorialAchUnlocked 
                      ? "bg-gradient-to-br from-blue-400 to-indigo-600 text-white shadow-sm"
                      : "bg-zinc-800/40 text-zinc-500"
                  }`}>
                    <GraduationCap className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-bold tracking-wide ${
                        theme === "sepia" ? "text-white" : ""
                      }`}>
                        {tutorialAchUnlocked ? "「新手上路」🎓" : "「新手上路」🔒"}
                      </span>
                      {tutorialAchUnlocked && (
                        <span className="text-[8px] font-bold text-blue-400 uppercase tracking-wider bg-blue-500/10 px-1 py-0.5 rounded">
                          已解鎖
                        </span>
                      )}
                    </div>
                    <p className="text-[9px] leading-relaxed mt-0.5 opacity-75">
                      {tutorialAchUnlocked
                        ? "「恭喜你完成新手教學！現在你已經掌握了瀏覽這個網站的精髓，本教主賜予你『無畏探索』之力！」"
                        : "（完成前三個新手教學步驟即可解鎖）"}
                    </p>
                  </div>
                </div>

                {/* 成就 15: 御風神官 */}
                <div className={`p-2 rounded-xl border flex gap-2.5 transition-all duration-300 ${
                  windStormUnlocked
                    ? theme === "sepia"
                      ? "bg-black/30 border-[#EAD09D]/30 shadow-inner"
                      : theme === "light"
                      ? "bg-white/60 border-pink-400/30 shadow-sm"
                      : "bg-amber-500/5 border-amber-500/25 shadow-inner"
                    : "opacity-40 bg-transparent border-dashed border-zinc-200/20 dark:border-zinc-800/20"
                }`}>
                  <div className={`p-1.5 rounded-lg flex-shrink-0 flex items-center justify-center h-8 w-8 ${
                    windStormUnlocked 
                      ? "bg-gradient-to-br from-cyan-400 to-blue-500 text-white shadow-sm"
                      : "bg-zinc-800/40 text-zinc-500"
                  }`}>
                    <Wind className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-bold tracking-wide ${
                        theme === "sepia" ? "text-white" : ""
                      }`}>
                        {windStormUnlocked ? "「御風神官」🌬️" : "「御風神官」🔒"}
                      </span>
                      {windStormUnlocked && (
                        <span className="text-[8px] font-bold text-cyan-400 uppercase tracking-wider bg-cyan-500/10 px-1 py-0.5 rounded">
                          已解鎖
                        </span>
                      )}
                    </div>
                    <p className="text-[9px] leading-relaxed mt-0.5 opacity-75">
                      {windStormUnlocked
                        ? "「你在亮點卡片召喚了 6 層以上的狂風！其他卡片皆隨風飛散，風暴召喚特權永久覺醒！」"
                        : "（在亮點卡片上快速翻頁，疊加風力至 6 層即可解鎖）"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Blessing Button (Ema styled button) */}
            <div className="w-full space-y-2 relative z-10">
              <button
                onClick={() => {
                  try {
                    playMeowSound();
                  } catch (e) {}
                  
                  const newParticles = Array.from({ length: 20 }).map((_, i) => ({
                    id: Date.now() + Math.random() + i,
                    x: window.innerWidth / 2 + (Math.random() * 260 - 130),
                    y: window.innerHeight / 2 + (Math.random() * 260 - 130),
                    emoji: ["✨", "💖", "🐾", "🏆", "🌟", "🐱", "😻", "🎀"][Math.floor(Math.random() * 8)],
                  }));
                  setHeroParticles((prev) => [...prev, ...newParticles].slice(-50));
                  
                  setTitleBounceTrigger((prev) => prev + 1);
                }}
                className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm tracking-widest shadow-lg active:scale-95 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer font-serif ${
                  theme === "sepia"
                    ? "bg-[#EAD09D] text-[#59110B] hover:bg-[#F3DFB6] shadow-black/45"
                    : theme === "light"
                    ? "bg-pink-600 text-white hover:bg-pink-700 shadow-pink-500/20"
                    : "bg-amber-400 text-zinc-950 hover:bg-amber-300 shadow-amber-500/20"
                }`}
              >
                <Sparkles className="h-4 w-4 fill-current animate-spin" style={{ animationDuration: "3.5s" }} />
                召喚教主守護御守・滿願成就！🐾
              </button>

              <p className={`text-[9px] tracking-wide font-mono opacity-60 ${
                theme === "sepia" ? "text-[#EAD09D]" : ""
              }`}>
                虔誠信仰值：{interactionCount} | 已結緣登錄於本地瀏覽器
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
});

MumuCertModal.displayName = "MumuCertModal";
