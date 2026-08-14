import React from 'react';
import { motion, AnimatePresence, MotionValue, useMotionValue, useTransform, useDragControls } from 'motion/react';
import { TutorialTooltip } from '../TutorialTooltip';
import { Instagram, Sparkles, FolderOpen } from 'lucide-react';
import { playCanClinkSound, playRareDropSound, playRareClickSound } from '../../utils/audioEffects';

interface HeroMascotProps {
  theme: "dark" | "light" | "sepia";
  isEcoMode?: boolean;
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
  onMascotDrag?: () => void;
  scrollToElement: (id: string) => void;
  setCategory: (cat: string) => void;
  tutorialStep: number;
  tutorialDismissed5: boolean;
  setTutorialDismissed5: (val: boolean) => void;
  nextTutorialStep: () => void;
  onRandomProject?: () => void;
  onMagicPaletteClick?: (clientX: number, clientY: number) => void;
}

export const HeroMascot: React.FC<HeroMascotProps> = ({
  theme,
  isEcoMode = false,
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
  onMascotDrag,
  scrollToElement,
  setCategory,
  tutorialStep,
  tutorialDismissed5,
  setTutorialDismissed5,
  nextTutorialStep,
  onRandomProject,
  onMagicPaletteClick
}) => {
  // 拖曳位移 MotionValue
  const dragX = useMotionValue(0);
  const dragY = useMotionValue(0);
  const dragControls = useDragControls();

  // 拖曳狀態
  const [isDragging, setIsDragging] = React.useState(false);
  const [isHolding, setIsHolding] = React.useState(false);
  const [isReadyToDrag, setIsReadyToDrag] = React.useState(false);
  const holdTimerRef = React.useRef<NodeJS.Timeout | null>(null);
  const startPosRef = React.useRef<{ x: number; y: number } | null>(null);

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsHolding(true);
    setIsReadyToDrag(false);
    startPosRef.current = { x: e.clientX, y: e.clientY };
    holdTimerRef.current = setTimeout(() => {
      setIsReadyToDrag(true);
      dragControls.start(e);
      try {
        if (navigator.vibrate) navigator.vibrate(50);
      } catch (e) {}
    }, 200);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (holdTimerRef.current && startPosRef.current) {
      const dx = Math.abs(e.clientX - startPosRef.current.x);
      const dy = Math.abs(e.clientY - startPosRef.current.y);
      if (dx > 10 || dy > 10) {
        clearTimeout(holdTimerRef.current);
        holdTimerRef.current = null;
        setIsHolding(false);
        setIsReadyToDrag(false);
      }
    }
  };

  const handlePointerUpOrLeave = () => {
    setIsHolding(false);
    setIsReadyToDrag(false);
    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }
    startPosRef.current = null;
  };

  // 掉落物介面與狀態
  interface FallingItem {
    id: string;
    emoji: string;
    startX: number;
    startY: number;
    driftX: number;
    targetRotate: number;
    landY: number;
    isRare?: boolean;
    rareType?: 'amulet' | 'star' | 'apple' | 'palette' | 'ig';
  }
  const [fallingItems, setFallingItems] = React.useState<FallingItem[]>([]);
  const lastSpawnTimeRef = React.useRef(0);
 
  const handleRareItemClick = (item: FallingItem, e?: React.MouseEvent) => {
    try {
      playRareClickSound();
    } catch (e) {}
 
    // 移除當前點擊的稀有物品
    setFallingItems((prev) => prev.filter((f) => f.id !== item.id));
 
    if (item.rareType === 'star') {
      // 方案 B：🌟 掉落「閃耀星星」 ➜ 觸發「隨機精選作品傳送門」
      if (onRandomProject) {
        onRandomProject();
      }
    } else if (item.rareType === 'apple') {
      // 方案 C：🍎 掉落「重力蘋果」 ➜ 跳到履歷頁面並觸發重力測試
      scrollToElement("designer-bento");
 
      // 延遲 700ms 觸發重力測試
      setTimeout(() => {
        const gravityBtn = document.getElementById("btn_mumu_bento_gravity");
        if (gravityBtn) {
          gravityBtn.click();
        }
      }, 700);
    } else if (item.rareType === 'palette') {
      // 方案 D：🎨 掉落「幻彩調色盤」 ➜ 觸發色彩漣漪與切換主題
      if (onMagicPaletteClick && e) {
        onMagicPaletteClick(e.clientX, e.clientY);
      } else if (onMagicPaletteClick) {
        // Fallback if click event is missing
        onMagicPaletteClick(window.innerWidth / 2, window.innerHeight / 2);
      }
    } else if (item.rareType === 'ig') {
      // 方案 E：📸 掉落「IG 相機」 ➜ 點擊跳轉到 IG
      window.open("https://www.instagram.com/mumao1_the_cat_religion/", "_blank", "noopener,noreferrer");
    } else {
      // 方案 A：🧧 掉落「御守」 ➜ 觸發「姆貓神社求籤」
      // 平滑滾動到神社
      scrollToElement("footer-fortune");
 
      // 延遲 600ms 自動觸發神社求籤
      setTimeout(() => {
        const emaBtn = document.getElementById("btn_mumu_fortune_ema");
        if (emaBtn) {
          emaBtn.click();
        }
      }, 600);
    }
  };
 
  const spawnFallingItem = () => {
    // 8% 機率噴出高級稀有物品，92% 機率噴出普通隨機物品
    const isRare = Math.random() < 0.08;
    let emoji = '';
    let rareType: 'amulet' | 'star' | 'apple' | 'palette' | 'ig' | undefined = undefined;
 
    if (isRare) {
      // 均分機率：御守 🧧 (20%)、閃耀星星 🌟 (20%)、重力蘋果 🍎 (20%)、幻彩調色盤 🎨 (20%)、IG 相機 📸 (20%)
      const rand = Math.random();
      if (rand < 0.2) {
        emoji = '🧧';
        rareType = 'amulet';
      } else if (rand < 0.4) {
        emoji = '🌟';
        rareType = 'star';
      } else if (rand < 0.6) {
        emoji = '🍎';
        rareType = 'apple';
      } else if (rand < 0.8) {
        emoji = '🎨';
        rareType = 'palette';
      } else {
        emoji = '📸';
        rareType = 'ig';
      }
    } else {
      emoji = ['🥫', '🐟', '🪙', '✨', '🐾', '🍪', '🐠', '🍬', '🍖', '🍩'][Math.floor(Math.random() * 10)];
    }
    
    // 取得當前姆貓被拖曳的即時位置，作為噴出的起點
    const currentX = dragX.get();
    const currentY = dragY.get();
    
    const randomOffset = Math.random() * 40 - 20; // 微調隨機偏移
    const driftX = Math.random() * 180 - 90; // 水平飄移
    const targetRotate = Math.random() * 720 - 360; // 旋轉角度

    // 依據不同螢幕大小計算合適的落地 Y 座標（相對於外層正方形容器中心點）
    const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 1024;
    const baseLandY = screenWidth < 640 ? 110 : screenWidth < 1024 ? 150 : 185;
    // 微小的垂直堆疊波動，做出高低交錯的可愛堆積感
    const landY = baseLandY + (Math.random() * 20 - 10);

    const newItem: FallingItem = {
      id: `${Date.now()}-${Math.random()}`,
      emoji,
      startX: currentX + randomOffset,
      startY: currentY + randomOffset,
      driftX,
      targetRotate,
      landY,
      isRare,
      rareType
    };

    if (isRare && rareType) {
      try {
        window.dispatchEvent(new CustomEvent("rare-item-spawned", { detail: { rareType } }));
      } catch (e) {}
    }

    setFallingItems(prev => {
      const nextList = [...prev, newItem];
      // 限制畫面底部最多保留 45 個掉落物，既可愛又確保效能順暢
      if (nextList.length > 45) {
        return nextList.slice(nextList.length - 45);
      }
      return nextList;
    });

    // 非稀有物品在噴出後直接消失，1.2 秒後從狀態中移除
    if (!isRare) {
      setTimeout(() => {
        setFallingItems(prev => prev.filter(f => f.id !== newItem.id));
      }, 1200);
    } else {
      // 稀有物品停留畫面 10 秒後自動緩緩消失
      setTimeout(() => {
        setFallingItems(prev => prev.filter(f => f.id !== newItem.id));
      }, 10000);
    }
    
    // 播放可愛的落物聲/稀有聲
    try {
      if (isRare) {
        playRareDropSound();
      } else {
        playCanClinkSound();
      }
    } catch (e) {
      // 靜音容錯
    }
  };

  // 配合拖拽位移產生 3D/2D 傾斜與拉伸
  const rotateX = useTransform(dragY, [-120, 120], [15, -15]);
  const rotateY = useTransform(dragX, [-120, 120], [-15, 15]);
  const rotateZ = useTransform(dragX, [-120, 120], [-8, 8]);

  return (
    <div className="w-full lg:w-auto shrink-0 flex items-center justify-center overflow-visible p-4 mt-[4.5rem] lg:mt-0 relative z-50">
      {/* Parallax Floating Elements */}
      <motion.div style={{ y: elementsY, rotate: rotateElement1 }} className="absolute top-10 -left-6 sm:-left-12 text-3xl opacity-20 pointer-events-none z-0 select-none will-change-transform">✨</motion.div>
      <motion.div style={{ y: elementsY2, rotate: rotateElement2 }} className="absolute bottom-12 -right-4 sm:-right-8 text-4xl opacity-10 pointer-events-none z-0 select-none will-change-transform">🐾</motion.div>
      
      {/* Outer container solely for parallax scroll */}
      <motion.div
        ref={mascotRef}
        style={{ y: mascotY }}
        className="w-full max-w-[280px] sm:max-w-[360px] lg:max-w-[420px] aspect-square relative flex items-center justify-center overflow-visible select-none"
      >


        {/* 拖曳就緒提示橫幅 */}
        <AnimatePresence>
          {isReadyToDrag && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 10 }}
              className="absolute -bottom-14 left-1/2 -translate-x-1/2 whitespace-nowrap bg-indigo-600/90 text-white text-[11px] font-medium px-3 py-1.5 rounded-full shadow-lg pointer-events-none z-45 flex items-center gap-1.5 backdrop-blur-sm border border-indigo-300/40 animate-pulse"
            >
              <span>✨ 已解鎖拖曳！快速移動掉落驚喜小物</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Inner container for absolute dragging, hover, tap, and click gestures */}
        <motion.div
          drag={true}
          dragListener={false}
          dragControls={dragControls}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUpOrLeave}
          onPointerCancel={handlePointerUpOrLeave}
          onPointerLeave={handlePointerUpOrLeave}
          dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
          dragElastic={0.65}
          dragTransition={{ bounceStiffness: 220, bounceDamping: 14 }}
          style={{ 
            x: dragX, 
            y: dragY, 
            rotateX, 
            rotateY, 
            rotate: rotateZ,
            perspective: 1200,
            touchAction: "pan-y"
          }}
          initial={{ opacity: 0, x: 40, rotate: 5, scale: 0.95 }}
          animate={{ 
            opacity: 1, 
            x: 0, 
            rotate: 0, 
            scale: isHolding ? 0.96 : 1,
            scaleY: isHolding ? 0.92 : 1,
            scaleX: isHolding ? 1.06 : 1
          }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.93, scaleY: 0.88, scaleX: 1.05 }}
          transition={{ type: "spring", bounce: 0.15, duration: 0.4 }}
          onClick={handleHeroClick}
          title="試著長按0.2秒拖曳我，看看會掉落什麼驚喜！"
          onDragStart={() => {
            setIsDragging(true);
            setIsHolding(false);
            if (onMascotDrag) {
              onMascotDrag();
            }
          }}
          onDragEnd={() => {
            setIsDragging(false);
            setIsReadyToDrag(false);
          }}
          onDrag={(event, info) => {
            const vx = info.velocity.x;
            const vy = info.velocity.y;
            const speed = Math.sqrt(vx * vx + vy * vy);
            if (speed > 1100) {
              const now = Date.now();
              if (now - lastSpawnTimeRef.current > 120) {
                lastSpawnTimeRef.current = now;
                spawnFallingItem();
              }
            }
          }}
          className="w-full max-w-[280px] sm:max-w-[360px] lg:max-w-[420px] aspect-square relative flex items-center justify-center overflow-visible cursor-grab active:cursor-grabbing group select-none will-change-transform"
        >
        <motion.div 
          style={{ y: glowY }} 
          className={`absolute inset-4 rounded-full blur-[50px] -z-10 will-change-transform transition-all duration-300 ${
            isHolding ? "bg-amber-500/25 scale-110 animate-ping" : "bg-amber-500/8 animate-pulse duration-[6000ms]"
          }`} 
        />
        
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
          className={`w-full h-auto relative overflow-visible transition-[filter] duration-500 ease-out ${
            isMagicTransformed 
              ? "mumao-rainbow-glow scale-105" 
              : "filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.08)] dark:drop-shadow-[0_15px_35px_rgba(0,0,0,0.6)]"
          } ${
            isDragging || isHeroSpeaking 
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
              isDragging ? "opacity-0" : isHeroSpeaking ? "mumao-anim-closed" : "opacity-100"
            }`}
          />
          {/* 2. 說話版1 (中開) */}
          <img
            src="https://drive.google.com/thumbnail?sz=w1000&id=1ZhhZ25s_ADm5iFcAO_I-YxglQlFlcsjk"
            alt="Cape Lee mascot speaking 1"
            referrerPolicy="no-referrer"
            className={`w-full h-auto object-contain absolute inset-0 select-none pointer-events-none ${
              isDragging ? "opacity-0 pointer-events-none z-0" : isHeroSpeaking ? "mumao-anim-medium z-20" : "opacity-0 pointer-events-none z-0"
            }`}
          />
          {/* 3. 說話版2 (大開) */}
          <img
            src="https://drive.google.com/thumbnail?sz=w1000&id=1Q7naVG-GPyr6s5X57rYiKlSofgb8hpBh"
            alt="Cape Lee mascot speaking 2"
            referrerPolicy="no-referrer"
            className={`w-full h-auto object-contain absolute inset-0 select-none pointer-events-none ${
              isDragging ? "opacity-100 z-20" : isHeroSpeaking ? "mumao-anim-open z-20" : "opacity-0 pointer-events-none z-0"
            }`}
          />
        
        </motion.div>
        </motion.div>

        {/* 掉落物渲染（改置於外層固定容器，使其下落後靜止留在畫面底部，不隨拖曳而晃動） */}
        <AnimatePresence>
          {fallingItems.map((item) => (
            <motion.div
              key={item.id}
              initial={{ 
                opacity: 1, 
                scale: 0.5, 
                x: item.startX, 
                y: item.startY, 
                rotate: 0 
              }}
              animate={{ 
                opacity: item.isRare ? 1 : [1, 1, 0], 
                scale: item.isRare ? [0.5, 1.4, 1.2] : [0.5, 1.2, 0], 
                y: [item.startY, item.startY - 60, item.landY], // 向上反彈，隨後下墜並靜止在 landY
                x: [item.startX, item.startX + item.driftX * 0.4, item.startX + item.driftX], 
                rotate: [0, item.targetRotate * 0.4, item.targetRotate] 
              }}
              exit={{
                opacity: 0,
                scale: 0,
                transition: { duration: 0.4, ease: "easeIn" }
              }}
              transition={{ 
                duration: 1.2, 
                times: [0, 0.25, 1],
                ease: "easeOut"
              }}
              onClick={(e) => {
                if (item.isRare) {
                  handleRareItemClick(item, e);
                }
              }}
              className={`absolute select-none z-45 filter drop-shadow-[0_4px_6px_rgba(0,0,0,0.15)] dark:drop-shadow-[0_4px_10px_rgba(0,0,0,0.4)] ${
                item.isRare 
                  ? "pointer-events-auto cursor-pointer group active:scale-95" 
                  : "pointer-events-none"
              }`}
              style={{ left: "calc(50% - 18px)", top: "calc(50% - 18px)" }}
            >
              <div className="relative flex flex-col items-center justify-center">
                {/* 稀有御守金光背景與呼吸動畫 */}
                {item.isRare && (
                  <>
                    {/* 呼吸感金光圈 */}
                    <div className="absolute w-12 h-12 bg-amber-400/20 rounded-full blur-md animate-pulse pointer-events-none" />
                    <div className="absolute w-10 h-10 border-2 border-amber-300/40 rounded-full animate-ping pointer-events-none [animation-duration:2.5s]" />
                    
                    {/* 點擊求籤精緻氣泡提示 */}
                    <span className="absolute -top-7 bg-amber-500/90 text-white font-serif font-bold text-[9px] leading-none px-2 py-1 rounded-md border border-amber-300 shadow-md whitespace-nowrap scale-0 group-hover:scale-100 origin-bottom transition-transform duration-200 z-50">
                      {item.rareType === 'star' ? "🌟 欣賞作品 🌟" : item.rareType === 'apple' ? "🌌 重力測試 🌌" : item.rareType === 'palette' ? "🎨 奇幻色盤 🎨" : item.rareType === 'ig' ? "📸 追蹤 IG 📸" : "⛩️ 點擊求籤 ⛩️"}
                    </span>
                  </>
                )}
                
                <span className={`${item.isRare ? "text-4xl animate-bounce" : "text-3xl"}`}>
                  {item.emoji}
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
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
