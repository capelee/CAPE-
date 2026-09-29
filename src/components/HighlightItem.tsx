import React, { useState } from "react";
import { MousePointerClick } from "lucide-react";
import { motion, useMotionValue, useTransform, animate } from "motion/react";
import { playCardFlipSound } from "../utils/audioEffects";

export interface HighlightItemProps {
  highlight: {
    label: string;
    sub: string;
    content: React.ReactNode;
    color: string;
    bg: string;
    Icon: React.ComponentType<{ className?: string; strokeWidth?: number; style?: React.CSSProperties }>;
  };
  index: number;
  theme: "dark" | "light" | "sepia";
  isEcoMode?: boolean;
}

interface DraftParticle {
  id: number;
  x: number;
  y: number;
  rotate: number;
  scale: number;
  width: number;
  height: number;
  type: "grid" | "sketch" | "text" | "blueprint";
  text?: string;
  isBlown: boolean;
}

export const HighlightItem: React.FC<HighlightItemProps> = ({
  highlight,
  index,
  theme,
  isEcoMode = false
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const cardRef = React.useRef<HTMLDivElement>(null);
  const hasDemonstrated = React.useRef(false);
  const timeoutsRef = React.useRef<{ toBack?: NodeJS.Timeout; toFront?: NodeJS.Timeout }>({});

  React.useEffect(() => {
    let activeScrollListener: (() => void) | null = null;

    const triggerFlipDemo = () => {
      hasDemonstrated.current = true;
      timeoutsRef.current.toBack = setTimeout(() => {
        setIsFlipped(true);
        timeoutsRef.current.toFront = setTimeout(() => {
          setIsFlipped(false);
        }, 1400);
      }, index * 220 + 350);
    };

    const observerOptions = {
      root: null,
      rootMargin: "-35% 0px -35% 0px",
      threshold: 0.05,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !hasDemonstrated.current) {
          if (window.scrollY > 40) {
            triggerFlipDemo();
          } else {
            const handleScroll = () => {
              if (window.scrollY > 40 && !hasDemonstrated.current) {
                triggerFlipDemo();
                window.removeEventListener("scroll", handleScroll);
                activeScrollListener = null;
              }
            };
            window.addEventListener("scroll", handleScroll, { passive: true });
            activeScrollListener = handleScroll;
          }
        }
      });
    }, observerOptions);

    const mountDelayTimeout = setTimeout(() => {
      if (cardRef.current) {
        observer.observe(cardRef.current);
      }
    }, 800);

    return () => {
      clearTimeout(mountDelayTimeout);
      observer.disconnect();
      if (activeScrollListener) {
        window.removeEventListener("scroll", activeScrollListener);
      }
      if (timeoutsRef.current.toBack) clearTimeout(timeoutsRef.current.toBack);
      if (timeoutsRef.current.toFront) clearTimeout(timeoutsRef.current.toFront);
    };
  }, [index]);

  const [isDraggable, setIsDraggable] = useState(typeof window !== 'undefined' ? window.innerWidth >= 768 : false);
  React.useEffect(() => {
    const handleResize = () => {
      setIsDraggable(window.innerWidth >= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const dragX = useMotionValue(0);
  const dragY = useMotionValue(0);

  const [particles, setParticles] = useState<DraftParticle[]>([]);
  const lastSpawnRef = React.useRef({ x: 0, y: 0 });
  const particleIdRef = React.useRef(0);

  const spawnParticle = (x: number, y: number) => {
    const types: ("grid" | "sketch" | "text" | "blueprint")[] = ["grid", "sketch", "text", "blueprint"];
    const randomType = types[Math.floor(Math.random() * types.length)];
    
    const texts = ["SKETCH", "CONCEPT", "GRID", "1.618", "DRAFT", "GUIDE", "LAYOUT", "DESIGN"];
    const randomText = texts[Math.floor(Math.random() * texts.length)];

    const width = Math.floor(Math.random() * 20) + 38;
    const height = Math.floor(Math.random() * 12) + 26;

    const newId = particleIdRef.current++;
    setParticles(prev => [
      ...prev,
      {
        id: newId,
        x,
        y,
        rotate: Math.random() * 40 - 20,
        scale: Math.random() * 0.25 + 0.85,
        width,
        height,
        type: randomType,
        text: randomText,
        isBlown: false
      }
    ]);
  };

  const rotateX = useTransform(dragY, [-140, 140], [15, -15]);
  const rotateY = useTransform(dragX, [-140, 140], [-15, 15]);
  const rotateZ = useTransform(dragX, [-140, 140], [-6, 6]);

  const [windOffset, setWindOffset] = useState({ scale: 1, opacity: 1 });
  const globalLastFlipRef = React.useRef<{ time: number; count: number }>({ time: 0, count: 0 });

  React.useEffect(() => {
    const handleGlobalFlip = (e: Event) => {
      const customEvent = e as CustomEvent<{ clickedIndex: number; timestamp: number }>;
      const { clickedIndex, timestamp } = customEvent.detail;

      if (clickedIndex === index) {
        animate(dragX, 0, { type: "spring", stiffness: 220, damping: 14 });
        animate(dragY, 0, { type: "spring", stiffness: 220, damping: 14 });
        setWindOffset({ scale: 1, opacity: 1 });
        return;
      }

      const prevTime = globalLastFlipRef.current.time;
      let count = globalLastFlipRef.current.count;
      
      if (timestamp - prevTime < 450) {
        count = Math.min(count + 1, 8);
        if (count >= 6) {
          window.dispatchEvent(new CustomEvent("trigger-wind-storm-ach"));
        }
      } else {
        count = 1;
      }
      globalLastFlipRef.current = { time: timestamp, count };

      const diff = index - clickedIndex;
      const direction = diff > 0 ? 1 : -1;
      const distanceFactor = 1 / Math.sqrt(Math.abs(diff));

      const xOffset = direction * (18 + count * 9) * distanceFactor;
      const yOffset = - (10 + count * 6) * distanceFactor;
      const scaleOffset = Math.max(0.85, 1 - (count * 0.02) * distanceFactor);
      const opacityOffset = Math.max(0.65, 1 - (count * 0.045) * distanceFactor);

      animate(dragX, xOffset, {
        type: "spring",
        stiffness: 180,
        damping: 15,
        mass: 0.6
      });
      animate(dragY, yOffset, {
        type: "spring",
        stiffness: 180,
        damping: 15,
        mass: 0.6
      });

      setWindOffset({
        scale: scaleOffset,
        opacity: opacityOffset,
      });

      const restoreTimeout = setTimeout(() => {
        animate(dragX, 0, {
          type: "spring",
          stiffness: 180,
          damping: 15,
          mass: 0.6
        });
        animate(dragY, 0, {
          type: "spring",
          stiffness: 180,
          damping: 15,
          mass: 0.6
        });
        setWindOffset({ scale: 1, opacity: 1 });
      }, 320);

      return () => clearTimeout(restoreTimeout);
    };

    window.addEventListener("highlight-card-flipped", handleGlobalFlip);
    return () => {
      window.removeEventListener("highlight-card-flipped", handleGlobalFlip);
    };
  }, [index, dragX, dragY]);

  const isFirstRender = React.useRef(true);
  React.useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    playCardFlipSound();
  }, [isFlipped]);

  const handleCardClick = () => {
    if (timeoutsRef.current.toBack) clearTimeout(timeoutsRef.current.toBack);
    if (timeoutsRef.current.toFront) clearTimeout(timeoutsRef.current.toFront);
    setIsFlipped(prev => !prev);

    window.dispatchEvent(new CustomEvent("highlight-card-flipped", {
      detail: { clickedIndex: index, timestamp: Date.now() }
    }));
  };

  return (
    <div className="relative min-h-[200px] sm:min-h-[220px] lg:min-h-[240px] w-full h-full overflow-visible">
      {/* 草稿紙粒子背景層 */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-visible">
        {particles.map(p => (
          <motion.div
            key={p.id}
            initial={{ 
              x: p.x, 
              y: p.y, 
              rotate: p.rotate, 
              scale: 0.1, 
              opacity: 0 
            }}
            animate={p.isBlown ? {
              x: p.x + (Math.random() * 120 - 60) + 160,
              y: p.y - 180 - Math.random() * 120,
              rotate: p.rotate + (Math.random() * 180 - 90),
              scale: 0.3,
              opacity: 0,
            } : {
              x: p.x,
              y: p.y,
              rotate: p.rotate,
              scale: p.scale,
              opacity: 0.8,
            }}
            transition={{
              type: "spring",
              stiffness: p.isBlown ? 45 : 140,
              damping: p.isBlown ? 12 : 14,
              mass: p.isBlown ? 0.4 : 0.6
            }}
            onAnimationComplete={() => {
              if (p.isBlown) {
                setParticles(prev => prev.filter(item => item.id !== p.id));
              }
            }}
            className={`absolute pointer-events-none rounded border shadow-sm flex items-center justify-center p-1.5 font-mono text-[8px] select-none ${
              theme === "sepia"
                ? "bg-[#FCF8EE]/90 border-[#DFCFA0]/60 text-[#8A5A32]/60"
                : theme === "light"
                ? "bg-white/90 border-zinc-200 text-zinc-400"
                : "bg-zinc-800/95 border-zinc-700/80 text-zinc-400"
            }`}
            style={{
              width: p.width,
              height: p.height,
              transformOrigin: "center",
              left: "50%",
              top: "50%",
              marginTop: -p.height / 2,
              marginLeft: -p.width / 2,
            }}
          >
            {p.type === 'text' && <span className="font-bold tracking-tight">{p.text}</span>}
            {p.type === 'grid' && (
              <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 opacity-15">
                {[...Array(9)].map((_, i) => <div key={i} className="border-[0.5px] border-current" />)}
              </div>
            )}
            {p.type === 'sketch' && (
              <svg className="w-full h-full opacity-25" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                <circle cx="12" cy="12" r="8" strokeDasharray="1.5,1.5" />
                <line x1="4" y1="12" x2="20" y2="12" strokeDasharray="1,1" />
                <line x1="12" y1="4" x2="12" y2="20" strokeDasharray="1,1" />
              </svg>
            )}
            {p.type === 'blueprint' && (
              <div className="absolute inset-0 flex flex-col justify-between p-0.5 opacity-35 text-[7px] leading-none">
                <div className="flex justify-between border-b border-current pb-0.5 opacity-50">
                  <span>dx:{Math.round(p.x)}</span>
                  <span>dy:{Math.round(p.y)}</span>
                </div>
                <div className="text-[6px] text-center font-semibold">Concept</div>
              </div>
            )}
            <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-current opacity-30" />
            <div className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b border-r border-current opacity-30" />
          </motion.div>
        ))}
      </div>
  
      <motion.div 
        ref={cardRef}
        key={index}
        initial={{ opacity: 0, y: 20 }}
        animate={{ 
          opacity: windOffset.opacity, 
          scale: windOffset.scale
        }}
        style={{ 
          perspective: 1000,
          x: dragX,
          y: dragY,
          rotateX: rotateX,
          rotateY: rotateY,
          rotate: rotateZ,
          touchAction: isDraggable ? "none" : "auto"
        }}
        drag={isDraggable}
        dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
        dragElastic={0.4}
        dragTransition={{ bounceStiffness: 220, bounceDamping: 11 }}
        onTap={handleCardClick}
        onDrag={(_event, _info) => {
          if (isEcoMode) return;
          const x = dragX.get();
          const y = dragY.get();
          const last = lastSpawnRef.current;
          const dist = Math.hypot(x - last.x, y - last.y);
          if (dist > 10) {
            spawnParticle(x, y);
            lastSpawnRef.current = { x, y };
          }
        }}
        onDragEnd={(_event, _info) => {
          setParticles(prev => prev.map(p => ({ ...p, isBlown: true })));
        }}
        className={`relative w-full h-full group will-change-transform transform-gpu ${isDraggable ? 'cursor-grab active:cursor-grabbing' : ''} select-none z-10`}
      >
        <motion.div
          className="w-full h-full relative cursor-pointer will-change-transform transform-gpu"
          style={{ transformStyle: "preserve-3d" }}
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
        >
          {/* Front Face */}
          <div 
            className={`absolute inset-0 w-full h-full p-5 lg:p-7 rounded-[1.25rem] border backdrop-blur-md flex flex-col justify-start items-start overflow-hidden transition-colors duration-500 group ${
              theme === "sepia" 
                ? "bg-[#FCF8EE]/80 border-[#DFCFA0]/50 hover:bg-white shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)]" 
                : theme === "light" 
                ? "bg-white/70 border-zinc-200/60 hover:bg-white shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)]" 
                : "bg-zinc-900/50 border-white/5 hover:bg-zinc-800/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.2)]"
            }`}
            style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}
          >
            {/* 背景光暈點綴 */}
            <div className={`absolute -right-8 -top-8 w-32 h-32 rounded-full blur-[32px] opacity-30 transition-opacity duration-700 group-hover:opacity-60 ${highlight.bg.replace('/10', '')}`} />
            
            {/* Decorative Large Icon (Watermark) */}
            <highlight.Icon 
              strokeWidth={1}
              className={`absolute -right-4 -bottom-4 w-32 h-32 rotate-12 transition-all duration-700 group-hover:scale-110 group-hover:-rotate-6 ${
                theme === "sepia" ? "text-[#8A5A32] opacity-[0.04] group-hover:opacity-[0.08]" 
                : theme === "light" ? "text-zinc-500 opacity-[0.03] group-hover:opacity-[0.06]" 
                : "text-white opacity-[0.02] group-hover:opacity-[0.05]"
              }`} 
            />
  
            {/* Action Hint Icon */}
            <div className={`absolute top-4 right-4 p-1.5 md:p-2 rounded-full transition-all duration-500 ${
              theme === "sepia" ? "bg-[#DFCFA0]/60 md:bg-[#DFCFA0]/40 text-[#A05C2C]" : theme === "light" ? "bg-zinc-200/80 md:bg-zinc-100 text-zinc-600" : "bg-white/20 md:bg-white/10 text-white/90 md:text-white/80"
            }`}>
              <MousePointerClick className="w-3.5 h-3.5 md:w-4 md:h-4 animate-pulse md:animate-none" strokeWidth={2.5} />
            </div>
  
            <div className="flex flex-col items-start gap-3 w-full h-full relative z-10">
              {/* Premium Icon Container */}
              <div className="relative shrink-0 transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6">
                <div className={`absolute inset-0 rounded-[1rem] blur-xl opacity-40 group-hover:opacity-80 transition-opacity duration-500 ${highlight.color.replace('text-', 'bg-')}`} />
                
                <div className={`relative p-3 rounded-[1rem] flex items-center justify-center overflow-hidden border ${
                  theme === "sepia" 
                    ? "bg-gradient-to-br from-[#FCF8EE] to-[#F3E8D0] border-[#E8DCC0] shadow-[0_2px_10px_rgba(200,160,100,0.15),inset_0_1px_0_rgba(255,255,255,0.9)]" 
                    : theme === "light" 
                    ? "bg-gradient-to-br from-white to-zinc-50/80 border-zinc-200/80 shadow-[0_2px_10px_rgba(0,0,0,0.05),inset_0_1px_0_rgba(255,255,255,1)]" 
                    : "bg-gradient-to-br from-zinc-800 to-zinc-900 border-zinc-700/80 shadow-[0_4px_15px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.1)]"
                }`}>
                  <div className={`absolute inset-0 opacity-[0.08] ${highlight.color.replace('text-', 'bg-')}`} />
                  
                  <highlight.Icon 
                    className={`w-5 h-5 md:w-6 md:h-6 relative z-10 ${highlight.color}`} 
                    strokeWidth={2} 
                    style={{ filter: theme === 'dark' ? 'drop-shadow(0px 2px 4px rgba(0,0,0,0.5))' : 'drop-shadow(0px 2px 4px rgba(0,0,0,0.1))' }} 
                  />
                </div>
              </div>
              
              <div className="space-y-1.5 mt-auto w-full">
                <h3 className={`text-[14px] lg:text-[16px] font-bold tracking-tight transition-colors duration-300 ${
                  theme === "sepia" ? "text-[#2B1B0C]" : theme === "light" ? "text-zinc-900" : "text-white"
                }`}>{highlight.label}</h3>
                <div className="flex items-center justify-between gap-2 w-full">
                  <p className={`text-[10px] lg:text-[11px] font-semibold tracking-wider uppercase ${
                    theme === "sepia" ? "text-[#A05C2C]" : theme === "light" ? "text-zinc-500" : "text-zinc-400"
                  }`}>{highlight.sub}</p>
                  <span className={`text-[9px] lg:text-[10px] font-mono tracking-widest uppercase opacity-0 group-hover:opacity-70 transition-all duration-300 ease-out translate-x-2 group-hover:translate-x-0 shrink-0 ${
                    theme === "sepia" ? "text-[#8A5A32]" : theme === "light" ? "text-zinc-400" : "text-zinc-500"
                  }`}>
                    VIEW DETAIL →
                  </span>
                </div>
              </div>
            </div>
          </div>
  
          {/* Back Face */}
          <div 
            className={`absolute inset-0 w-full h-full p-4 sm:p-5 lg:p-6 rounded-[1.25rem] border backdrop-blur-md flex flex-col justify-start items-start overflow-hidden ${
              theme === "sepia" 
                ? "bg-[#FCF8EE]/95 border-[#D0B87A] shadow-[0_8px_30px_-4px_rgba(200,160,100,0.15)]" 
                : theme === "light" 
                ? "bg-white/95 border-zinc-300 shadow-[0_8px_30px_-4px_rgba(0,0,0,0.06)]" 
                : "bg-zinc-800/95 border-white/10 shadow-[0_8px_30px_-4px_rgba(255,255,255,0.03)]"
            }`}
            style={{ 
              backfaceVisibility: "hidden", 
              WebkitBackfaceVisibility: "hidden",
              transform: "rotateY(180deg)" 
            }}
          >
            <highlight.Icon 
              strokeWidth={1}
              className={`absolute -right-6 -bottom-6 w-32 h-32 rotate-12 transition-all duration-700 group-hover:scale-110 group-hover:-rotate-6 ${
                theme === "sepia" ? "text-[#8A5A32] opacity-[0.08]" 
                : theme === "light" ? "text-zinc-500 opacity-[0.06]" 
                : "text-white opacity-[0.05]"
              }`} 
            />
  
            <div className={`w-8 h-1 rounded-full mb-2.5 lg:mb-3 shrink-0 ${highlight.color.replace('text-', 'bg-')}`} />
  
            <h4 className={`text-[14px] sm:text-[15px] lg:text-[16px] font-bold tracking-tight mb-1.5 lg:mb-2 relative z-10 ${
              theme === "sepia" ? "text-[#2B1B0C]" : theme === "light" ? "text-zinc-900" : "text-white"
            }`}>
              {highlight.label}
            </h4>
  
            <div className={`text-[12px] sm:text-[13px] md:text-[14px] leading-[1.6] sm:leading-relaxed font-medium relative z-10 ${
              theme === "sepia" ? "text-[#5A3A22]" : theme === "light" ? "text-zinc-600" : "text-zinc-300"
            }`}>
              {highlight.content}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};
