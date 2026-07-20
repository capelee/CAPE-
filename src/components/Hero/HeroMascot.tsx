import React from 'react';
import { motion, AnimatePresence, MotionValue } from 'motion/react';
import { TutorialTooltip } from '../TutorialTooltip';
import { Instagram, Sparkles, FolderOpen } from 'lucide-react';

interface HeroMascotProps {
  theme: "dark" | "light" | "sepia";
  mascotRef: React.RefObject<HTMLDivElement>;
  mascotY: MotionValue<number>;
  glowY: MotionValue<number>;
  elementsY: MotionValue<number>;
  elementsY2: MotionValue<number>;
  rotateElement1: MotionValue<number>;
  rotateElement2: MotionValue<number>;
  heroParticles: any[];
  setHeroParticles: React.Dispatch<React.SetStateAction<any[]>>;
  isMagicTransformed: boolean;
  isHeroSpeaking: boolean;
  showHeroDialogue: boolean;
  displayedDialogue: string;
  handleHeroClick: () => void;
  scrollToElement: (id: string) => void;
  setCategory: (cat: string) => void;
  tutorialStep: number;
  tutorialDismissed5: boolean;
  setTutorialDismissed5: (val: boolean) => void;
  nextTutorialStep: () => void;
}

export const HeroMascot: React.FC<HeroMascotProps> = ({
  theme,
  mascotRef,
  mascotY,
  glowY,
  elementsY,
  elementsY2,
  rotateElement1,
  rotateElement2,
  heroParticles,
  setHeroParticles,
  isMagicTransformed,
  isHeroSpeaking,
  showHeroDialogue,
  displayedDialogue,
  handleHeroClick,
  scrollToElement,
  setCategory,
  tutorialStep,
  tutorialDismissed5,
  setTutorialDismissed5,
  nextTutorialStep
}) => {
  return (
    <div className="w-full lg:w-auto shrink-0 flex items-center justify-center overflow-visible p-4 relative z-50">
      {/* Parallax Floating Elements */}
      <motion.div style={{ y: elementsY, rotate: rotateElement1 }} className="absolute top-10 -left-6 sm:-left-12 text-3xl opacity-20 pointer-events-none z-0 select-none will-change-transform">✨</motion.div>
      <motion.div style={{ y: elementsY2, rotate: rotateElement2 }} className="absolute bottom-12 -right-4 sm:-right-8 text-4xl opacity-10 pointer-events-none z-0 select-none will-change-transform">🐾</motion.div>
      
      <motion.div
        ref={mascotRef}
        style={{ y: mascotY }}
        initial={{ opacity: 0, x: 40, rotate: 5, scale: 0.95 }}
        animate={{ opacity: 1, x: 0, rotate: 0, scale: 1 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.93, scaleY: 0.88, scaleX: 1.05 }}
        transition={{ type: "spring", bounce: 0.15, duration: 1.2, delay: 0.1 }}
        onClick={handleHeroClick}
        className="w-full max-w-[280px] sm:max-w-[360px] lg:max-w-[420px] aspect-square relative flex items-center justify-center overflow-visible cursor-pointer group select-none will-change-transform"
      >
        <motion.div style={{ y: glowY }} className="absolute inset-4 bg-amber-500/8 rounded-full blur-[50px] -z-10 animate-pulse duration-[6000ms] will-change-transform" />
        
        <AnimatePresence>
          {heroParticles.map((p) => (
            <motion.span
              key={p.id}
              initial={{ opacity: 1, scale: 0.4, x: p.x - 12, y: p.y - 12, rotate: 0 }}
              animate={{ opacity: 0, scale: 1.6, y: p.y - 110, x: p.x - 12 + (Math.random() * 80 - 40), rotate: Math.random() * 120 - 60 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.85, ease: "easeOut" }}
              onAnimationComplete={() => {
                setHeroParticles((prev) => prev.filter((item) => item.id !== p.id));
              }}
              className="absolute pointer-events-none select-none text-2xl z-40"
              style={{ left: 0, top: 0 }}
            >
              {p.emoji}
            </motion.span>
          ))}
        </AnimatePresence>

        {/* 魔法少女版裝飾：精靈之羽 & 魔法配飾 */}
        <AnimatePresence>
          {isMagicTransformed && (
            <>
              {/* 左翅膀 */}
              <motion.div
                initial={{ opacity: 0, scale: 0, x: -20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0, x: -20 }}
                className="absolute -left-[45px] sm:-left-[60px] top-[25%] -z-10 flex items-center justify-center pointer-events-none"
                style={{ transformOrigin: "right center" }}
              >
                <motion.div
                  animate={{
                    scale: [1, 1.15, 1],
                    rotate: [-10, -22, -10],
                    x: [0, -6, 0],
                    y: [0, -4, 0]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="relative"
                >
                  <div className="absolute w-24 h-24 rounded-full bg-gradient-to-tr from-pink-400/35 via-white/50 to-pink-300/25 blur-xl animate-pulse" />
                  <div className="absolute text-pink-300 text-xs translate-y-[-24px] translate-x-[-24px] animate-bounce">✨</div>
                  <div className="absolute text-pink-400 text-xs translate-y-[24px] translate-x-[-12px] animate-ping">💖</div>
                  <span className="text-6xl sm:text-7xl filter drop-shadow-[0_0_15px_rgba(236,72,153,0.85)] select-none block rotate-[-45deg] scale-x-[-1]">🪶</span>
                </motion.div>
              </motion.div>

              {/* 右翅膀 */}
              <motion.div
                initial={{ opacity: 0, scale: 0, x: 20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0, x: 20 }}
                className="absolute -right-[45px] sm:-right-[60px] top-[25%] -z-10 flex items-center justify-center pointer-events-none"
                style={{ transformOrigin: "left center" }}
              >
                <motion.div
                  animate={{
                    scale: [1, 1.15, 1],
                    rotate: [10, 22, 10],
                    x: [0, 6, 0],
                    y: [0, -4, 0]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="relative"
                >
                  <div className="absolute w-24 h-24 rounded-full bg-gradient-to-tl from-pink-400/35 via-white/50 to-pink-300/25 blur-xl animate-pulse" />
                  <div className="absolute text-pink-300 text-xs translate-y-[-24px] translate-x-[24px] animate-bounce">✨</div>
                  <div className="absolute text-pink-400 text-xs translate-y-[24px] translate-x-[12px] animate-ping">💖</div>
                  <span className="text-6xl sm:text-7xl filter drop-shadow-[0_0_15px_rgba(236,72,153,0.85)] select-none block rotate-[45deg]">🪶</span>
                </motion.div>
              </motion.div>

              {/* 頭部左側大蝴蝶結髮夾（🎀） */}
              <motion.div
                initial={{ opacity: 0, scale: 0, y: -20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0, y: -20 }}
                className="absolute left-[12%] sm:left-[15%] top-[12%] z-30 pointer-events-none"
              >
                <motion.div
                  animate={{
                    y: [0, -8, 0],
                    rotate: [-5, 8, -5],
                    scale: [1, 1.12, 1]
                  }}
                  transition={{
                    duration: 1.2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <span className="text-4xl sm:text-5xl filter drop-shadow-[0_4px_8px_rgba(236,72,153,0.6)] select-none">🎀</span>
                </motion.div>
              </motion.div>

              {/* 右側懸浮魔法杖（🪄） */}
              <motion.div
                initial={{ opacity: 0, scale: 0, x: 20, y: 20 }}
                animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
                exit={{ opacity: 0, scale: 0, x: 20, y: 20 }}
                className="absolute right-[5%] sm:right-[8%] bottom-[20%] z-30 pointer-events-none"
              >
                <motion.div
                  animate={{
                    y: [0, -15, 0],
                    x: [0, -8, 0],
                    rotate: [-15, 5, -15]
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="relative"
                >
                  <div className="absolute -inset-4 bg-pink-400/20 rounded-full blur-md animate-pulse" />
                  <span className="text-5xl sm:text-6xl filter drop-shadow-[0_0_12px_rgba(244,114,182,0.9)] select-none block -scale-x-100">🪄</span>
                </motion.div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {tutorialStep === 5 && !tutorialDismissed5 && (
          <TutorialTooltip 
            key={`tutorial-step-5-${tutorialStep}`}
            step={5}
            text="點擊姆貓互動看看吧！"
            theme={theme}
            onClick={() => { setTutorialDismissed5(true); nextTutorialStep(); }}
            pointerDirection="right"
            className="absolute top-1/2 -translate-y-1/2 left-0 sm:-left-16 z-[100]"
          />
        )}
        <motion.div
          initial={{ y: 45, scale: 0.98, opacity: 0 }}
          animate={{ y: 0, scale: 1, opacity: 1 }}
          transition={{ duration: 1.25, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
          className={`w-full h-auto relative overflow-visible transition-all duration-500 ease-out ${
            isMagicTransformed 
              ? "mumao-rainbow-glow scale-105" 
              : "filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.08)] dark:drop-shadow-[0_15px_35px_rgba(0,0,0,0.6)]"
          } ${
            isHeroSpeaking 
              ? "mumao-speaking" 
              : "mumao-idle group-hover:mumao-playful"
          }`}
        >
          {/* Embedded smooth mouth & body animations */}

          {/* 1. 閉嘴版 (Base / Default) */}
          <img
            src="https://drive.google.com/thumbnail?sz=w1000&id=1WGZs1SZI8NTKaF6M_-IpvD5EjGFll3Ri"
            alt="Cape Lee mascot closed mouth"
            referrerPolicy="no-referrer"
            className={`w-full h-auto object-contain relative z-10 select-none pointer-events-none ${
              isHeroSpeaking ? "mumao-anim-closed" : "opacity-100"
            }`}
          />
          {/* 2. 說話版1 (中開) */}
          <img
            src="https://drive.google.com/thumbnail?sz=w1000&id=1ZhhZ25s_ADm5iFcAO_I-YxglQlFlcsjk"
            alt="Cape Lee mascot speaking 1"
            referrerPolicy="no-referrer"
            className={`w-full h-auto object-contain absolute inset-0 select-none pointer-events-none ${
              isHeroSpeaking ? "mumao-anim-medium z-20" : "opacity-0 pointer-events-none z-0"
            }`}
          />
          {/* 3. 說話版2 (大開) */}
          <img
            src="https://drive.google.com/thumbnail?sz=w1000&id=1Q7naVG-GPyr6s5X57rYiKlSofgb8hpBh"
            alt="Cape Lee mascot speaking 2"
            referrerPolicy="no-referrer"
            className={`w-full h-auto object-contain absolute inset-0 select-none pointer-events-none ${
              isHeroSpeaking ? "mumao-anim-open z-20" : "opacity-0 pointer-events-none z-0"
            }`}
          />
        
        </motion.div>
      </motion.div>
      
      {/* Dialogue Bubble */}
      <AnimatePresence>
        {showHeroDialogue && displayedDialogue && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 12, rotate: 0 }}
            animate={{ opacity: 1, scale: 1, y: 0, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 12, rotate: 0, transition: { duration: 0.2, ease: "easeIn" } }}
            transition={{ type: "spring", bounce: 0.4, duration: 0.6 }}
            className="absolute z-50 pointer-events-none w-max max-w-[calc(100vw-32px)] origin-bottom -top-16 sm:-top-12 left-1/2 -translate-x-1/2 lg:origin-right lg:top-8 lg:left-auto lg:right-[75%] lg:-translate-x-0"
          >
            <div className={`pointer-events-auto relative px-4 py-3 sm:px-5 sm:py-3.5 rounded-2xl max-w-[240px] sm:max-w-[280px] shadow-xl border ${
              theme === "dark" 
                ? "bg-zinc-800/95 border-zinc-700/50 text-white" 
                : theme === "sepia"
                  ? "bg-[#e2d5c5]/95 border-[#d0bfa8] text-[#5c4a3d]"
                  : "bg-white/95 border-amber-200/50 text-zinc-800"
            } backdrop-blur-md`}>
              {/* Bubble Tail */}
              <div className={`absolute w-4 h-4 rotate-45 border-r border-b lg:border-b-0 lg:border-t ${
                theme === "dark" 
                  ? "bg-zinc-800/95 border-zinc-700/50" 
                  : theme === "sepia"
                    ? "bg-[#e2d5c5]/95 border-[#d0bfa8]"
                    : "bg-white/95 border-amber-200/50"
              } -bottom-2 left-1/2 -translate-x-1/2 lg:bottom-auto lg:left-auto lg:-translate-x-0 lg:top-1/2 lg:-translate-y-1/2 lg:-right-2`} />
              
                            <p className="text-sm sm:text-[15px] font-medium leading-relaxed tracking-wide break-words">
                {displayedDialogue}
              </p>

                            {/* Instagram Link Button for specific dialogue */}
              {(displayedDialogue.includes("IG") || displayedDialogue.includes("Instagram") || displayedDialogue.includes("這隻白貓是我的原創")) && (
                <a
                  href="https://www.instagram.com/mumao1_the_cat_religion?igsh=MXF2a3N1bm45ajhkaw=="
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 w-full mt-2.5 py-1.5 px-2.5 rounded-lg text-[11px] font-bold text-white bg-gradient-to-r from-pink-500 via-red-500 to-amber-500 hover:brightness-110 active:scale-95 transition-all shadow-md cursor-pointer pointer-events-auto"
                >
                  <Instagram className="h-3.5 w-3.5 shrink-0" />
                  <span>追蹤 姆貓教主 IG 🐾</span>
                </a>
              )}

                            {/* Fortune Teller Button */}
              {displayedDialogue.includes("今日姆貓運勢") && (
                <button
                  onClick={() => {
                    document.getElementById("footer-fortune")?.scrollIntoView({ behavior: "smooth" });
                    document.getElementById("btn_mumu_fortune_ema")?.click();
                  }}
                  className="flex items-center justify-center gap-1.5 w-full mt-2.5 py-1.5 px-2.5 rounded-lg text-[11px] font-bold text-white bg-gradient-to-r from-amber-500 to-orange-500 hover:brightness-110 active:scale-95 transition-all shadow-md cursor-pointer pointer-events-auto"
                >
                  <Sparkles className="h-3.5 w-3.5 shrink-0" />
                  <span>前往求籤開運 ⛩️</span>
                </button>
              )}

              {/* Portfolio Link Button for specific dialogue */}
              {displayedDialogue.includes("看作品") && (
                <button
                  onClick={() => {
                    scrollToElement("portfolio-grid");
                  }}
                  className={`flex items-center justify-center gap-1.5 w-full mt-2.5 py-1.5 px-2.5 rounded-lg text-[11px] font-bold text-white hover:brightness-110 active:scale-95 transition-all shadow-md cursor-pointer pointer-events-auto ${
                    theme === "sepia"
                      ? "bg-[#A05C2C]"
                      : theme === "light"
                      ? "bg-amber-600"
                      : "bg-amber-500"
                  }`}
                >
                  <FolderOpen className="h-3.5 w-3.5 shrink-0" />
                  <span>點我解鎖精彩作品 ✨</span>
                </button>
              )}

              {/* Dino Button */}
              {displayedDialogue.includes("12 隻專業恐龍") && (
                <button
                  onClick={() => {
                    setCategory("角色IP&插畫與貼圖");
                    scrollToElement("portfolio-grid");
                  }}
                  className={`flex items-center justify-center gap-1.5 w-full mt-2.5 py-1.5 px-2.5 rounded-lg text-[11px] font-bold text-white hover:brightness-110 active:scale-95 transition-all shadow-md cursor-pointer pointer-events-auto ${
                    theme === "sepia"
                      ? "bg-[#A05C2C]"
                      : theme === "light"
                      ? "bg-amber-600"
                      : "bg-amber-500"
                  }`}
                >
                  <FolderOpen className="h-3.5 w-3.5 shrink-0" />
                  <span>找專業恐龍戰隊聊天 🦕</span>
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
