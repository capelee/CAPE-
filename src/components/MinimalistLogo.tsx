import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Instagram, X } from "lucide-react";

// 可愛氣球充氣嗶嗶聲 (Balloon Inflation Squeak)
const playBalloonSqueakSound = () => {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    // 每次點擊都帶有向上微幅變調的橡膠捏合嗶嗶聲
    osc.frequency.setValueAtTime(550, now);
    osc.frequency.exponentialRampToValueAtTime(1250, now + 0.08);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.1);
  } catch (e) {
    // Safety fallback
  }
};

// 漏氣 "噗咻——" 飛行尖嘯與洩氣音效 (Balloon Leaking Air & Flight whistle)
const playBalloonLeakSound = () => {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const now = ctx.currentTime;

    // 1. 噴氣摩擦白噪音 (Air Hissing Noise)
    const bufferSize = ctx.sampleRate * 2.2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(1100, now);
    filter.frequency.exponentialRampToValueAtTime(120, now + 2.0);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.14, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 2.0);

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(ctx.destination);

    // 2. 飛天打轉口哨哨音 (Frenetic Whistle)
    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();

    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(950, now);
    
    // 透過迴圈動態建立音高的高頻波動，模擬洩氣氣球在空中瘋狂打轉噴飛的顫音效果
    for (let t = 0; t < 22; t++) {
      const timeOffset = t * 0.1;
      const baseFreq = 950 - t * 40;
      osc.frequency.setValueAtTime(baseFreq + (t % 2 === 0 ? 90 : -90), now + timeOffset);
    }
    osc.frequency.exponentialRampToValueAtTime(90, now + 2.1);

    const whistleFilter = ctx.createBiquadFilter();
    whistleFilter.type = "lowpass";
    whistleFilter.frequency.setValueAtTime(1300, now);

    oscGain.gain.setValueAtTime(0.09, now);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + 2.1);

    osc.connect(whistleFilter);
    whistleFilter.connect(oscGain);
    oscGain.connect(ctx.destination);

    noise.start(now);
    osc.start(now);

    noise.stop(now + 2.2);
    osc.stop(now + 2.2);
  } catch (e) {
    // Safety fallback
  }
};

interface MinimalistLogoProps {
  className?: string;
  size?: number;
  theme?: "dark" | "light" | "sepia";
  showInteractiveBubble?: boolean;
  bubbleDirection?: "top" | "bottom";
  externalDialogue?: string;
  showExternalBubble?: boolean;
  onCloseExternalBubble?: () => void;
}

export function MinimalistLogo({ 
  className = "", 
  size, 
  theme = "dark", 
  showInteractiveBubble = true, 
  bubbleDirection = "top",
  externalDialogue,
  showExternalBubble,
  onCloseExternalBubble
}: MinimalistLogoProps) {
  const normalImageUrl = "https://drive.google.com/thumbnail?sz=w1000&id=18ega279ty4XVeShySlEkSzJXUz2pOcep";
  const winkImageUrl = "https://drive.google.com/thumbnail?sz=w1000&id=1eqi9X536nUrXqj-gv6kqjNMfpiC1YumX";

  interface LogoParticle {
    id: number;
    char: string;
    initialX: number;
    initialY: number;
    targetX: number;
    targetY: number;
    targetRotate: number;
    scale: number;
  }

  const [isWinking, setIsWinking] = useState<boolean>(false);
  const [isWiggling, setIsWiggling] = useState<boolean>(false);
  const [showBubble, setShowBubble] = useState<boolean>(false);
  const [particles, setParticles] = useState<LogoParticle[]>([]);
  const bubbleRef = useRef<HTMLDivElement>(null);

  // 姆貓氣球連擊互動狀態
  const [balloonClickCount, setBalloonClickCount] = useState<number>(0);
  const [lastBalloonClickTime, setLastBalloonClickTime] = useState<number>(0);
  const [isLeaking, setIsLeaking] = useState<boolean>(false);
  const [isBalloonDialogue, setIsBalloonDialogue] = useState<boolean>(false);

  // Preload the wink image to prevent flickering on first click
  useEffect(() => {
    const img = new Image();
    img.src = winkImageUrl;
  }, []);

  // Idle ambient wink & love-beam heart particle effect
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const scheduleNextIdleWink = () => {
      // Randomize idle interval between 5 to 9 seconds
      const nextDelay = 5000 + Math.random() * 4000;
      timeoutId = setTimeout(() => {
        // Trigger idle event ONLY if no user interaction is currently active
        if (!isWinking && !isWiggling && balloonClickCount === 0 && !isLeaking) {
          setIsWinking(true);

          // Spawn 1 or 2 loving hearts floating out from eye regions towards the right
          const heartCount = 1 + Math.floor(Math.random() * 2);
          const heartEmojis = ["💖", "❤️", "💕"];
          const newHearts: LogoParticle[] = Array.from({ length: heartCount }).map((_, idx) => {
            const isLeft = idx === 0;
            return {
              id: Date.now() + idx + Math.random(),
              char: heartEmojis[Math.floor(Math.random() * heartEmojis.length)],
              initialX: isLeft ? -14 : 14, // Left/Right eye positions
              initialY: -6,
              // Move strongly to the right (positive targetX for both)
              targetX: 60 + Math.random() * 45,
              targetY: -20 - Math.random() * 25, // Gentle rise
              targetRotate: 30 + Math.random() * 60,
              scale: 0.9 + Math.random() * 0.35,
            };
          });

          setParticles((prev) => [...prev, ...newHearts]);

          // Hold the wink state briefly (500ms) then release
          setTimeout(() => {
            setIsWinking(false);
          }, 500);
        }
        // Recursively trigger next loop
        scheduleNextIdleWink();
      }, nextDelay);
    };

    scheduleNextIdleWink();

    return () => {
      clearTimeout(timeoutId);
    };
  }, [isWinking, isWiggling, balloonClickCount, isLeaking]);

  // Trigger wink and wiggle when external dialogue starts/changes to make the cat look like it is speaking/reacting
  useEffect(() => {
    if (showExternalBubble && externalDialogue) {
      setIsWinking(true);
      setIsWiggling(true);
      const timer = setTimeout(() => {
        setIsWinking(false);
        setIsWiggling(false);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [showExternalBubble, externalDialogue]);

  // Auto-scroll when the dialogue bubble is opened to avoid it going off-screen/being cut off at the top
  useEffect(() => {
    if (showBubble && bubbleDirection === "top") {
      const timer = setTimeout(() => {
        if (bubbleRef.current) {
          const rect = bubbleRef.current.getBoundingClientRect();
          const isMobile = window.innerWidth < 640;
          // Set safety offset: 64px for mobile header, 90px for desktop to leave comfortable breathing space
          const headerOffset = isMobile ? 64 : 90;
          const elementPosition = rect.top + window.scrollY;
          const offsetPosition = elementPosition - headerOffset;

          window.scrollTo({
            top: Math.max(0, offsetPosition),
            behavior: "smooth"
          });
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [showBubble, bubbleDirection]);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isLeaking) return; // 漏氣暴走動畫進行中，暫停普通點擊

    const now = Date.now();
    let newCount = 1;

    // 1.5 秒內的點擊都計入連擊
    if (now - lastBalloonClickTime < 1500) {
      newCount = balloonClickCount + 1;
    }

    setBalloonClickCount(newCount);
    setLastBalloonClickTime(now);

    // 達到第 15 次連擊，觸發漏氣大洩洪「噗咻——」飛行旋轉縮回動畫
    if (newCount >= 15) {
      setIsLeaking(true);
      setIsBalloonDialogue(true);
      setShowBubble(true);
      playBalloonLeakSound();

      if (typeof navigator !== "undefined" && navigator.vibrate) {
        try {
          navigator.vibrate([80, 40, 80, 40, 150, 40, 200, 80, 350]);
        } catch (vErr) {
          // Fallback
        }
      }

      // 釋放一堆瘋狂的粉色氣球、雲霧與旋轉粒子！
      const emojis = ["🎈", "💨", "✨", "🐾", "💫", "💖", "⚡️"];
      const leakParticles: LogoParticle[] = Array.from({ length: 22 }).map((_, idx) => {
        const angle = (idx * (360 / 22) + Math.random() * 15) * (Math.PI / 180);
        const distance = 90 + Math.random() * 90;
        return {
          id: Date.now() + idx + Math.random(),
          char: emojis[Math.floor(Math.random() * emojis.length)],
          initialX: 0,
          initialY: 0,
          targetX: Math.cos(angle) * distance,
          targetY: Math.sin(angle) * distance - 40,
          targetRotate: Math.random() * 360 - 180,
          scale: 0.85 + Math.random() * 0.65,
        };
      });
      setParticles((prev) => [...prev, ...leakParticles]);

      // 2.4 秒後完整洩氣重置
      setTimeout(() => {
        setIsLeaking(false);
        setBalloonClickCount(0);
        setIsBalloonDialogue(false);
        setShowBubble(false);
      }, 2400);

      return;
    }

    // 普通連擊：播放嗶嗶嗶可愛橡膠拉伸聲，並微調頭部形變
    playBalloonSqueakSound();
    setIsWinking(true);
    setIsWiggling(true);

    if (showInteractiveBubble) {
      setShowBubble(true);
    }

    if (typeof navigator !== "undefined" && navigator.vibrate) {
      try {
        navigator.vibrate(30);
      } catch (vErr) {
        // Fallback
      }
    }

    // 產生對應膨脹的氣泡/愛心/氣球粒子
    const emojis = ["🎈", "✨", "🐾", "💖", "💨"];
    const particleCount = 4 + Math.floor(Math.random() * 3); // 4 to 6 particles
    const newParticles: LogoParticle[] = Array.from({ length: particleCount }).map((_, idx) => {
      const isLeft = idx % 2 === 0;
      return {
        id: Date.now() + idx + Math.random(),
        char: emojis[Math.floor(Math.random() * emojis.length)],
        initialX: isLeft ? -10 : 10,
        initialY: 0,
        targetX: isLeft ? -45 - Math.random() * 45 : 45 + Math.random() * 45,
        targetY: -70 - Math.random() * 65,
        targetRotate: (isLeft ? -1 : 1) * (45 + Math.random() * 90),
        scale: 0.85 + Math.random() * 0.45,
      };
    });

    setParticles((prev) => [...prev, ...newParticles]);

    // 重置單次點擊的眨眼與微弱震動狀態
    setTimeout(() => {
      setIsWinking(false);
      setIsWiggling(false);
    }, 600);
  };

  // 當前膨脹比率 (點擊數越多，比率越大。每擊增加 8% 體積，第 14 擊可達 2.12 倍膨脹)
  const balloonScale = 1 + (balloonClickCount * 0.08);

  return (
    <div className={`relative overflow-visible ${className}`} style={size !== undefined ? { width: size, height: size } : undefined}>
      {/* 噴發粒子圖層：溢出可見，層級置頂但點擊穿透 */}
      <div className="absolute inset-0 pointer-events-none overflow-visible flex items-center justify-center select-none z-30">
        <AnimatePresence>
          {particles.map((p) => (
            <motion.span
              key={p.id}
              className="absolute text-sm sm:text-base md:text-lg pointer-events-none select-none"
              initial={{
                opacity: 0,
                scale: 0,
                x: p.initialX,
                y: p.initialY,
                rotate: 0,
              }}
              animate={{
                opacity: [0, 1, 1, 0],
                scale: [0.3, p.scale, p.scale, 0],
                x: [p.initialX, p.initialX + (p.targetX - p.initialX) * 0.45, p.targetX],
                y: [p.initialY, p.targetY * 0.55, p.targetY],
                rotate: p.targetRotate,
              }}
              transition={{
                duration: 0.95,
                ease: "easeOut",
              }}
              onAnimationComplete={() => {
                setParticles((prev) => prev.filter((item) => item.id !== p.id));
              }}
            >
              {p.char}
            </motion.span>
          ))}
        </AnimatePresence>
      </div>
 
      {/* 眨眼與搖晃動畫頭像 */}
      <motion.div
        className="relative w-full h-full flex items-center justify-center select-none cursor-pointer"
        onClick={handleClick}
        whileHover={{ scale: isLeaking ? 1 : balloonScale * 1.06 }}
        whileTap={{ scale: isLeaking ? 1 : balloonScale * 0.94 }}
        animate={
          isLeaking
            ? {
                // 放掉洩氣氣球時在空中畫出大弧形、亂竄打轉的軌跡！
                x: [0, -110, 130, -160, 80, -40, 0],
                y: [0, -170, -320, 140, -230, 60, 0],
                rotate: [0, 360, -720, 1440, -1080, 720, 0],
                // 從極膨脹状态，隨著噗咻洩氣急速降回原定比例
                scale: [
                  balloonScale,
                  balloonScale * 0.8,
                  balloonScale * 0.5,
                  1.3,
                  0.7,
                  1.0
                ]
              }
            : isWiggling
            ? {
                rotate: [0, -15, 12, -8, 6, 0],
                y: [0, -4, 2, -1, 0],
                scale: balloonScale
              }
            : {
                rotate: 0,
                y: 0,
                scale: balloonScale
              }
        }
        transition={
          isLeaking
            ? { duration: 2.3, ease: "easeInOut" }
            : isWiggling
            ? { duration: 0.6, ease: "easeInOut" }
            : { duration: 0.3 }
        }
      >
        <img
          src={isWinking ? winkImageUrl : normalImageUrl}
          alt="Cape Lee Logo (MuMㄠ)"
          referrerPolicy="no-referrer"
          className="w-full h-full object-contain transition-all duration-150"
        />
      </motion.div>

      {/* 互動對話泡泡 */}
      <AnimatePresence>
        {(showBubble || showExternalBubble) && (
          <motion.div
            ref={bubbleRef}
            initial={{ opacity: 0, scale: 0.85, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 10 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
            className={`absolute z-50 w-[220px] sm:w-[240px] p-3 rounded-xl shadow-xl border text-xs font-medium leading-relaxed
              left-[-12px] ${bubbleDirection === "bottom" ? "top-[115%]" : "bottom-[115%]" }
              ${
                theme === "sepia"
                  ? "bg-[#FCF8EE] border-[#EAD09D] text-[#382B1D]"
                  : theme === "light"
                  ? "bg-white border-zinc-200 text-zinc-800"
                  : "bg-zinc-950/95 border-zinc-800 text-zinc-100 shadow-black/60"
              }
            `}
          >
            {/* 關閉按鈕 */}
            {!isLeaking && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (showExternalBubble && onCloseExternalBubble) {
                    onCloseExternalBubble();
                  } else {
                    setShowBubble(false);
                  }
                }}
                className="absolute top-1.5 right-1.5 p-0.5 rounded-md opacity-60 hover:opacity-100 hover:bg-zinc-100/10 transition-colors cursor-pointer"
              >
                <X className="h-3 w-3" />
              </button>
            )}

            {/* 三角形指引指標 */}
            <div className={`absolute w-2.5 h-2.5 rotate-45 left-[44px]
              ${bubbleDirection === "bottom"
                ? "top-[-6px] border-l border-t"
                : "bottom-[-6px] border-r border-b"
              }
              ${
                theme === "sepia"
                  ? "bg-[#FCF8EE] border-[#EAD09D]"
                  : theme === "light"
                  ? "bg-white border-zinc-200"
                  : "bg-zinc-950 border-zinc-800"
              }
            `} />

            <div className="space-y-2">
              <p className="pr-3 leading-relaxed tracking-wide text-left text-[11px] sm:text-xs">
                {showExternalBubble && externalDialogue ? (
                  <span className="font-bold text-amber-600 dark:text-amber-400 block">
                    {externalDialogue}
                  </span>
                ) : isBalloonDialogue ? (
                  <span className="font-bold text-amber-500 animate-pulse block">
                    哎呀！再戳本教主就要胖成貓咪氣球飛走啦！🎈 救喵啊～ 💨
                  </span>
                ) : (
                  <span>喵～🐾 歡迎追蹤 MuMㄠ（姆貓教）的原創 IP 插畫音樂祭粉專喔！🎸✨</span>
                )}
              </p>
              
              {!isBalloonDialogue && !showExternalBubble && (
                <a
                  href="https://www.instagram.com/mumao1_the_cat_religion?igsh=MXF2a3N1bm45ajhkaw=="
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 w-full py-1.5 px-2.5 rounded-lg text-[10px] font-bold text-white bg-gradient-to-r from-pink-500 via-red-500 to-amber-500 hover:brightness-110 active:scale-95 transition-all shadow-md cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowBubble(false);
                  }}
                >
                  <Instagram className="h-3 w-3 shrink-0" />
                  <span>追蹤 姆貓教主 IG 🐾</span>
                </a>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
