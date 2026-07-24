import { useTutorial } from '../context/TutorialContext';
import { TutorialTooltip } from './TutorialTooltip';
import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence, useDragControls, useMotionValue, useSpring } from "motion/react";
import { PortfolioItem } from "../types";
import { playMeowSound, catPurr, audioContextManager } from "../utils/audioEffects";

interface InteractiveMascotProps {
  currentMascot: {
    name: string;
    role: string;
    imageDriveId: string;
    imageDriveIdSpeaking?: string;
    imageDriveIdSpeakingFrames?: string[];
    glowColor: string;
    dialogues: string[];
    idles: string[];
  };
  theme: "dark" | "light" | "sepia";
  activeModalItem: any;
  isWorkflowOpen: boolean;
  isContactCardOpen: boolean;
  scrollSectionVisible: boolean;
  onInteract?: () => void;
  onRandomProject?: () => void;
  onHighlightProject?: () => void;
  onChangeCategory?: () => void;
}


export const InteractiveMascot = React.memo(function InteractiveMascot({
  currentMascot,
  theme,
  activeModalItem,
  isWorkflowOpen,
  isContactCardOpen,
  scrollSectionVisible,
  onInteract,
  onRandomProject,
  onHighlightProject,
  onChangeCategory
}: InteractiveMascotProps) {
  const [tutorialDismissed5, setTutorialDismissed5] = useState(false);
  const { tutorialStep, nextTutorialStep } = useTutorial();
  const [mascotDialogue, setMascotDialogue] = useState<string>("");
  const [showMascotDialogue, setShowMascotDialogue] = useState<boolean>(false);
  const [isTouched, setIsTouched] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [isImageLoaded, setIsImageLoaded] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [currentFrameIndex, setCurrentFrameIndex] = useState<number>(0);
  
  const [currentAction, setCurrentAction] = useState<{ label: string; action: string; icon: string } | null>(null);

  useEffect(() => {
    if (showMascotDialogue) {
      const actions = [
        { label: "隨機看一張作品", action: "random", icon: "🎲" },
        { label: "帶我看精選專案", action: "highlight", icon: "✨" },
        { label: "隨機切換分類", action: "category", icon: "🏷️" }
      ];
      // 75% chance to show an action button for fun
      if (Math.random() < 0.75) {
        setCurrentAction(actions[Math.floor(Math.random() * actions.length)]);
      } else {
        setCurrentAction(null);
      }
    } else {
      setCurrentAction(null);
    }
  }, [showMascotDialogue, mascotDialogue]);
  
  // Cat Chase (快速連續點擊躲避) 互動狀態
  const [clickCount, setClickCount] = useState<number>(0);
  const [lastClickTime, setLastClickTime] = useState<number>(0);
  const [isChasing, setIsChasing] = useState<boolean>(false);

  // Cat Purr Hover states
  const hoverTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [isPurring, setIsPurring] = useState<boolean>(false);

  const handleMouseEnter = () => {
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    hoverTimerRef.current = setTimeout(() => {
      catPurr.start();
      setIsPurring(true);
    }, 1000);
  };

  const handleMouseLeave = () => {
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
    if (isPurring) {
      catPurr.stop();
      setIsPurring(false);
    }
  };

  useEffect(() => {
    return () => {
      if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
      catPurr.stop();
    };
  }, []);
  
  // 雙指縮放狀態
  const [mascotScale, setMascotScale] = useState<number>(1);
  const initialDistanceRef = React.useRef<number | null>(null);
  const currentScaleRef = React.useRef<number>(1);
  
  const dragControls = useDragControls();
  const hasDraggedRef = useRef<boolean>(false);
  const holdTimerRefMascot = useRef<NodeJS.Timeout | null>(null);
  const startPosRefMascot = useRef<{ x: number; y: number } | null>(null);

  const handlePointerDownMascot = (e: React.PointerEvent) => {
    hasDraggedRef.current = false;
    startPosRefMascot.current = { x: e.clientX, y: e.clientY };
    holdTimerRefMascot.current = setTimeout(() => {
      hasDraggedRef.current = true;
      dragControls.start(e);
      try {
        if (navigator.vibrate) navigator.vibrate(50);
      } catch (err) {}
    }, 500);
  };

  const handlePointerMoveMascot = (e: React.PointerEvent) => {
    if (holdTimerRefMascot.current && startPosRefMascot.current) {
      const dx = Math.abs(e.clientX - startPosRefMascot.current.x);
      const dy = Math.abs(e.clientY - startPosRefMascot.current.y);
      if (dx > 10 || dy > 10) {
        clearTimeout(holdTimerRefMascot.current);
        holdTimerRefMascot.current = null;
      }
    }
  };

  const handlePointerUpMascot = () => {
    if (holdTimerRefMascot.current) {
      clearTimeout(holdTimerRefMascot.current);
      holdTimerRefMascot.current = null;
    }
    startPosRefMascot.current = null;
  };

  // 當對話框打開或更換對話時，觸發嘴巴開合動畫 (若有提供說話圖片或多幀)
  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;
    let timeoutId: NodeJS.Timeout | null = null;
    
    if (showMascotDialogue && (currentMascot.imageDriveIdSpeaking || currentMascot.imageDriveIdSpeakingFrames)) {
      setIsSpeaking(true);
      setCurrentFrameIndex(0);

      const intervalMs = currentMascot.imageDriveIdSpeakingFrames ? 140 : 220;

      intervalId = setInterval(() => {
        if (currentMascot.imageDriveIdSpeakingFrames && currentMascot.imageDriveIdSpeakingFrames.length > 0) {
          setCurrentFrameIndex((prev) => (prev + 1) % currentMascot.imageDriveIdSpeakingFrames!.length);
        } else {
          setIsSpeaking((prev) => !prev);
        }
      }, intervalMs);

      // 說話持續 2.8 秒後自動閉口回到靜態
      timeoutId = setTimeout(() => {
        if (intervalId) clearInterval(intervalId);
        setIsSpeaking(false);
        setCurrentFrameIndex(0);
      }, 2800);
    } else {
      setIsSpeaking(false);
      setCurrentFrameIndex(0);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [showMascotDialogue, mascotDialogue, currentMascot.imageDriveIdSpeaking, currentMascot.imageDriveIdSpeakingFrames]);

  // 建立滑鼠/指標跟蹤角度邏輯及其平滑彈性曲線 (Motion values)
  const containerRef = React.useRef<HTMLDivElement>(null);
  const rotateValue = useMotionValue(-5);
  const smoothRotate = useSpring(rotateValue, { damping: 25, stiffness: 180 });

  // 監聽全球 pointermove 計算與吉祥物的相對角度，達成靈活動態跟隨效果
  React.useEffect(() => {
    let animationFrameId: number | null = null;
    let targetX = 0;
    let targetY = 0;

    const updateRotation = () => {
      animationFrameId = null;
      if (!isImageLoaded || !containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const dx = targetX - centerX;
      const dy = targetY - centerY;
      const distance = Math.hypot(dx, dy);
      const triggerDistance = 250; // 觸發距離設定為 250px
      
      if (distance < triggerDistance) {
        // 指向性夾角計算
        const angleRad = Math.atan2(dy, dx);
        const angleDeg = angleRad * (180 / Math.PI);
        
        // 吉祥物頭部朝上為基準 (-90)，所以加 90 以使插畫指向指標
        let targetRotate = angleDeg + 90;
        
        // 限制傾斜角度範圍在 [-15, 15] 之間，既生動又不易與對話框重疊遮擋
        targetRotate = Math.max(-15, Math.min(15, targetRotate));
        
        // 基於接近程度進行平滑漸變 (從接觸邊緣 250px 的 0 到重心的 1)
        const t = (triggerDistance - distance) / triggerDistance;
        const interpolatedRotate = -5 + (targetRotate - (-5)) * t;
        
        rotateValue.set(interpolatedRotate);
      } else {
        // 距離超過 250px 時，平滑回復預設 -5 度偏斜
        rotateValue.set(-5);
      }
    };

    const handlePointerMove = (e: PointerEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      if (!animationFrameId) {
        animationFrameId = window.requestAnimationFrame(updateRotation);
      }
    };

    const handlePointerLeave = () => {
      // 滑鼠移出視窗或離開時，平滑回復預設 -5 度偏斜
      rotateValue.set(-5);
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    document.addEventListener("pointerleave", handlePointerLeave, { passive: true });
    
    return () => {
      if (animationFrameId) window.cancelAnimationFrame(animationFrameId);
      window.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, [isImageLoaded, rotateValue]);

  // 當常駐代言吉祥物改變時，自動重置並介紹
  React.useEffect(() => {
    setIsImageLoaded(false);
    if (currentMascot && currentMascot.dialogues.length > 0) {
      setMascotDialogue(currentMascot.dialogues[0]);
      setShowMascotDialogue(false);
      setIsVisible(true);
    }
  }, [currentMascot]);

  // 當滾動區間能見度變為可見時，自動重置手動隱藏狀態，讓吉祥物再次彈出
  React.useEffect(() => {
    if (scrollSectionVisible) {
      setIsVisible(true);
    }
  }, [scrollSectionVisible]);

  // 當圖片載入完成時，顯示吉祥物對話框
  React.useEffect(() => {
    // 確保留有一點彈出緩衝時間，不至於卡頓
    let timer: NodeJS.Timeout;
    if (isImageLoaded) {
      timer = setTimeout(() => setShowMascotDialogue(true), 250);
    }
    return () => clearTimeout(timer);
  }, [isImageLoaded]);

  // 觸發趣味貓咪躲避與瞬移逃跑動畫 (Cat Chase Interaction)
  const triggerCatChase = () => {
    setIsChasing(true);
    setClickCount(0);

    const CHASE_DIALOGUES = [
      "喵呀！你點太快了！🐾 本教主走位逃跑中！💨",
      "別、別抓了！再點要漏電（喵叫）了！⚡️ 咻～",
      "幻影貓步！✨ 你點不到我～ 罐罐都被你點飛啦！🥫",
      "喵嗚！啟動超光速摸魚閃避模式！🚀 咻～",
      "被追到了！💦 溜了溜了，本教主要隱身 1 秒鐘！🐾"
    ];

    const randomChaseDialogue = CHASE_DIALOGUES[Math.floor(Math.random() * CHASE_DIALOGUES.length)];
    setMascotDialogue(randomChaseDialogue);
    setShowMascotDialogue(true);

    // 震動回饋 (如果支援)
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      try {
        navigator.vibrate([100, 50, 100, 50, 100]);
      } catch (err) {
        // Safe catch
      }
    }

    // 播放趣味加速滑音
    try {
      const ctx = audioContextManager.getOrCreateContext();
      if (ctx) {
        const now = ctx.currentTime;
        
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.exponentialRampToValueAtTime(1000, now + 0.8); // Warmer ceiling frequency (1000Hz instead of 1800Hz)
        
        gain.gain.setValueAtTime(0.05, now); // Softer gain (0.05 instead of 0.12)
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.8);
      }
    } catch (e) {
      // Ignored
    }

    // 1.5 秒後恢復
    setTimeout(() => {
      setIsChasing(false);
    }, 1500);
  };

  // 點擊吉祥物時隨機切換台詞 (且不影響 App.tsx 渲染)
  const handleNextMascot = (isFromMascot: boolean = false) => {
    if (tutorialStep >= 4 && tutorialStep <= 8 && !tutorialDismissed5) {
      setTutorialDismissed5(true);
      nextTutorialStep();
    }
    if (isChasing) return; // 動畫中禁止重複點擊觸發

    // Trigger parent callback to track overall interactions
    if (onInteract) {
      onInteract();
    }

    if (isFromMascot) {
      const now = Date.now();
      if (now - lastClickTime < 900) {
        const newCount = clickCount + 1;
        setClickCount(newCount);
        if (newCount >= 4) {
          triggerCatChase();
          return;
        }
      } else {
        setClickCount(1);
      }
      setLastClickTime(now);
    }

    if (currentMascot && currentMascot.dialogues.length > 0) {
      // Play meow sound
      playMeowSound();

      const candidates = currentMascot.dialogues.filter(item => item !== mascotDialogue);
      const chosen = candidates.length > 0
        ? candidates[Math.floor(Math.random() * candidates.length)]
        : currentMascot.dialogues[0];
      setMascotDialogue(chosen);
      setShowMascotDialogue(true);
    }
  };

  // 7.5 秒自動播放常駐吉祥物的閒聊 (採元件內部定時，0% 全局 App re-render 開銷)
  React.useEffect(() => {
    const interval = setInterval(() => {
      if (currentMascot && currentMascot.idles.length > 0) {
        const randomIdle = currentMascot.idles[Math.floor(Math.random() * currentMascot.idles.length)];
        setMascotDialogue(randomIdle);
      }
    }, 7500);

    return () => clearInterval(interval);
  }, [currentMascot, mascotDialogue]);

  // 手機震動反饋與極速觸摸響應 & 雙指縮放
  const handleTouchStart = (e: React.TouchEvent<HTMLButtonElement | HTMLDivElement>) => {
    if (e.touches && e.touches.length === 2) {
      // 雙指觸控開始
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const dist = Math.hypot(touch1.clientX - touch2.clientX, touch1.clientY - touch2.clientY);
      initialDistanceRef.current = dist;
      currentScaleRef.current = mascotScale;
    } else if (e.touches && e.touches.length === 1) {
      setIsTouched(true);
      if (typeof window !== "undefined" && window.navigator && window.navigator.vibrate) {
        try {
          window.navigator.vibrate(15);
        } catch (err) {
          // Safe catch for iframe / permission constraints
        }
      }
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLButtonElement | HTMLDivElement>) => {
    // 檢查是否有進行拖曳 (framermotion drag 會有些攔截，但如果是 2 指，則嘗試計算縮放)
    if (e.touches && e.touches.length === 2 && initialDistanceRef.current !== null) {
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const dist = Math.hypot(touch1.clientX - touch2.clientX, touch1.clientY - touch2.clientY);
      const ratio = dist / initialDistanceRef.current;
      const newScale = Math.min(Math.max(currentScaleRef.current * ratio, 0.5), 2.5); // 限制縮放範圍在 0.5 到 2.5 倍
      setMascotScale(newScale);
    }
  };

  const handleTouchEnd = () => {
    setIsTouched(false);
    initialDistanceRef.current = null;
  };

  return (
    <AnimatePresence>
      {isVisible && scrollSectionVisible && !activeModalItem && !isWorkflowOpen && !isContactCardOpen && (
        <motion.div
          ref={containerRef}
          initial={{ y: "100%", opacity: 0 }}
          animate={
            isChasing
              ? {
                  x: [0, -220, 220, -50, 0],
                  y: [0, -80, 180, -20, 0],
                }
              : isImageLoaded
              ? { x: 0, y: 0, opacity: 1 }
              : { x: 0, y: "100%", opacity: 0 }
          }
          exit={{ y: "150%", opacity: 0 }}
          transition={
            isChasing
              ? { duration: 1.5, ease: "easeInOut" }
              : { type: "spring", bounce: 0.6, duration: 0.8, delay: 0.1 }
          }
          className="fixed bottom-0 -right-2 md:right-12 z-[45] pointer-events-none origin-bottom flex flex-col items-center w-[150px] sm:w-[200px] md:w-[250px]"
          style={{ touchAction: "none" }}
          drag
          dragControls={dragControls}
          dragListener={false}
          dragMomentum={false}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={handleTouchEnd}
        >
          {/* 互動對話氣泡 */}
          <AnimatePresence>
            {showMascotDialogue && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                onClick={() => handleNextMascot(false)}
                onPointerDown={(e) => dragControls.start(e)}
                className={`${
                  theme === "light"
                    ? "bg-white border-amber-500/50 shadow-[0_4px_25px_rgba(245,158,11,0.18)]"
                    : theme === "sepia"
                    ? "bg-[#FCF8EE] border-amber-600/40 shadow-[0_4px_25px_rgba(180,83,9,0.18)]"
                    : "bg-[#0b0b0c] border-amber-500/40 shadow-[0_0_20px_rgba(245,158,11,0.22)]"
                } border p-3 pt-3.5 rounded-2xl mb-2.5 relative flex flex-col items-center justify-center pointer-events-auto max-w-[145px] sm:max-w-[190px] md:max-w-[240px] overflow-hidden cursor-pointer transition-colors group`}
                style={{ touchAction: "pan-y" }}
                title="點擊對話，長按可自由拖曳！🐾"
              >
                {/* 關閉對話框的 X 按鈕 */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowMascotDialogue(false);
                    setIsVisible(false);
                  }}
                  className={`absolute top-0 right-0 z-10 p-2 rounded-full transition-colors cursor-pointer ${
                    theme === "light"
                      ? "text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100"
                      : theme === "sepia"
                      ? "text-[#433422]/60 hover:text-[#433422] hover:bg-[#E2D5B9]"
                      : "text-zinc-400 hover:text-white hover:bg-white/10"
                  }`}
                  aria-label="Close dialogue"
                  title="關閉對話框"
                >
                  <svg className="w-[17px] h-[17px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                <div className={`${
                  theme === "light"
                    ? "text-zinc-800 font-semibold group-hover:text-amber-600"
                    : theme === "sepia"
                    ? "text-[#433422] font-bold group-hover:text-[#B45309]"
                    : "text-zinc-100 font-semibold group-hover:text-amber-200"
                } text-[11px] sm:text-xs text-center leading-relaxed font-sans px-1 select-none whitespace-normal break-words transition-colors min-h-[30px] sm:min-h-[34px] flex flex-col items-center justify-center subpixel-antialiased`}
                style={{ textRendering: "geometricPrecision" }}>
                  
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={mascotDialogue}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.18, ease: "easeInOut" }}
                      className="block leading-relaxed subpixel-antialiased font-semibold tracking-wide"
                    >
                      {mascotDialogue}
                    </motion.span>
                  </AnimatePresence>

                  <AnimatePresence>
                    {currentAction && (
                      <motion.div
                        initial={{ opacity: 0, y: -5, height: 0 }}
                        animate={{ opacity: 1, y: 0, height: "auto" }}
                        exit={{ opacity: 0, y: -5, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="mt-3 overflow-hidden"
                      >
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (currentAction.action === "random" && onRandomProject) onRandomProject();
                            if (currentAction.action === "highlight" && onHighlightProject) onHighlightProject();
                            if (currentAction.action === "category" && onChangeCategory) onChangeCategory();
                            setShowMascotDialogue(false);
                          }}
                          className={`w-full py-1.5 px-2 rounded-xl text-[11px] sm:text-xs font-bold flex items-center justify-center gap-1.5 sm:gap-2 transition-all active:scale-95 border whitespace-nowrap ${
                            theme === "light"
                              ? "bg-amber-100/50 text-amber-700 hover:bg-amber-100 border-amber-200"
                              : theme === "sepia"
                              ? "bg-[#EADECC]/40 text-[#8A5A32] hover:bg-[#EADECC]/60 border-[#D2B48C]/50"
                              : "bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 border-amber-500/20"
                          }`}
                        >
                          <span className="text-[13px] sm:text-sm md:text-base">{currentAction.icon}</span>
                          <span>{currentAction.label}</span>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <div className={`absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 border-r border-b rotate-45 ${
                  theme === "light"
                    ? "bg-white border-amber-500/50"
                    : theme === "sepia"
                    ? "bg-[#FCF8EE] border-amber-600/40"
                    : "bg-black/95 border-amber-500/40"
                }`} />
              </motion.div>
            )}
          </AnimatePresence>
          
          
          
          <motion.button
            drag={true}
            dragListener={false}
            dragControls={dragControls}
            dragConstraints={{ left: -300, right: 300, top: -400, bottom: 400 }}
            dragElastic={0.2}
            onClick={() => {
              if (!hasDraggedRef.current) {
                handleNextMascot(true);
              }
            }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onTouchCancel={handleTouchEnd}
            onPointerDown={handlePointerDownMascot}
            onPointerMove={handlePointerMoveMascot}
            onPointerUp={handlePointerUpMascot}
            onPointerCancel={handlePointerUpMascot}
            onPointerLeave={handlePointerUpMascot}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            type="button"
            whileHover={{ 
              scale: 1.05 * mascotScale,
              transition: { duration: 0.2 }
            }}
            whileTap={{ scale: 0.95 * mascotScale }}
            animate={
              isChasing
                ? {
                    y: [0, -6, 0],
                    scale: [mascotScale, mascotScale * 0.4, mascotScale * 1.5, 0.2, mascotScale]
                  }
                : {
                    y: [0, -6, 0],
                    scale: isTouched ? 0.95 * mascotScale : mascotScale
                  }
            }
            transition={{
              y: {
                repeat: Infinity,
                duration: 3,
                ease: "easeInOut"
              },
              scale: {
                duration: 0.12,
                ease: "easeOut"
              }
            }}
            className="relative w-23 md:w-28 lg:w-32 pointer-events-auto cursor-pointer group focus:outline-none"
            title="點我互動！(長按1秒可拖曳)"
            style={{ willChange: "transform", touchAction: "pan-y", rotate: smoothRotate }}
          >
            {/* 動態背景彩色發光暈圈 */}
            <div 
              className={`absolute inset-4 -z-10 rounded-full blur-[40px] opacity-[0.06] group-hover:opacity-100 group-hover:scale-125 transition-all duration-700 ease-out bg-gradient-to-tr ${
                currentMascot.glowColor
              } pointer-events-none`}
              style={{ willChange: "transform, opacity" }}
            />
            
            <AnimatePresence mode="wait">
              <motion.img 
                key={currentMascot.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                src={(() => {
                  let currentId = currentMascot.imageDriveId;
                  
                  if (isSpeaking) {
                    if (currentMascot.imageDriveIdSpeakingFrames && currentMascot.imageDriveIdSpeakingFrames.length > 0) {
                      currentId = currentMascot.imageDriveIdSpeakingFrames[currentFrameIndex];
                    } else if (currentMascot.imageDriveIdSpeaking) {
                      currentId = currentMascot.imageDriveIdSpeaking;
                    }
                  }

                  if (!currentId) return "";
                  if (currentId.startsWith("/") || currentId.startsWith("http") || currentId.startsWith("data:")) {
                    return currentId;
                  }
                  return `https://drive.google.com/thumbnail?sz=w800&id=${currentId}`;
                })()}
                alt={currentMascot.name} 
                draggable={false}
                className="w-full h-auto object-contain filter drop-shadow-[0_15px_25px_rgba(0,0,0,0.85)] brightness-110 group-hover:brightness-125 transition-all duration-300 pointer-events-none select-none"
                onLoad={() => setIsImageLoaded(true)}
                onError={(e) => {
                  setIsImageLoaded(true); // 失敗也照常觸發顯示對話框
                  e.currentTarget.src = "https://drive.google.com/thumbnail?sz=w800&id=16RO9RvE_GrYhKKb_umrUJ8oFpmig40CI";
                }}
              />
            </AnimatePresence>

            {/* 收納狀態提示小紅點 (呼吸燈效果) */}
            <AnimatePresence>
              {!showMascotDialogue && isImageLoaded && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  className="absolute -top-1 right-2 w-3.5 h-3.5 bg-red-500 rounded-full border-2 border-white/20 shadow-[0_0_10px_rgba(239,68,68,0.8)] z-10"
                >
                  <div className="absolute inset-0 rounded-full animate-ping bg-red-400 opacity-75" />
                </motion.div>
              )}
            </AnimatePresence>

            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-black/75 border border-white/10 text-[9px] text-zinc-300 px-2 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap shadow-lg">
              💬 點擊跟我對話吧！
            </div>
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

