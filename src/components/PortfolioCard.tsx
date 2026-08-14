interface PortfolioCardProps {
  item: PortfolioItem;
  onClick: () => void;
  key?: React.Key;
  priority?: boolean;
  index: number;
  prevVisibleCount: number;
  theme: "dark" | "light" | "sepia";
  showAllDetails: boolean;
  onNearBottom?: () => void;
  isFirst?: boolean;
  selectedCategory?: string;
  isEcoMode?: boolean;
}

import React, { useState } from "react";
import { X, MousePointerClick, Sparkles, ArrowUpRight, ArrowUp, Image as ImageIcon, QrCode, Download, Eye, ExternalLink, PawPrint } from "lucide-react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, useMotionTemplate, useReducedMotion } from "motion/react";
import { PortfolioItem } from "../types";
import { ImageWithFallback } from "./ImageWithFallback";
import { getCategoryColor } from "../categoryColors";
import { EXISTING_OPTIMIZED_IMAGES } from "../existingImages";

const getToolStyle = (tool: string, theme: "dark" | "light" | "sepia") => {
  const t = tool.toLowerCase().trim();

  // Categories: Graphic, Video/Motion, Code/Programming, Branding/Concept
  let category: "graphic" | "video" | "programming" | "branding";

  if (
    t.includes("ai") ||
    t.includes("photoshop") ||
    t.includes("procreate") ||
    t.includes("插畫") ||
    t.includes("向量") ||
    t.includes("貼圖") ||
    t.includes("手繪") ||
    t.includes("3d") ||
    t.includes("模型") ||
    t.includes("渲染") ||
    t.includes("幾何") ||
    t.includes("圖像") ||
    t.includes("海報") ||
    t.includes("字體") ||
    t.includes("視覺") ||
    t.includes("繪製")
  ) {
    category = "graphic";
  } else if (
    t.includes("ae") ||
    t.includes("premiere") ||
    t.includes("剪輯") ||
    t.includes("動態") ||
    t.includes("分鏡") ||
    t.includes("動畫") ||
    t.includes("影片") ||
    t.includes("特效") ||
    t.includes("音效") ||
    t.includes("配樂") ||
    t.includes("多媒體") ||
    t.includes("影音")
  ) {
    category = "video";
  } else if (
    t.includes("html") ||
    t.includes("css") ||
    t.includes("react") ||
    t.includes("typescript") ||
    t.includes("javascript") ||
    t.includes("vue") ||
    t.includes("next") ||
    t.includes("d3") ||
    t.includes("recharts") ||
    t.includes("rwd") ||
    t.includes("網頁") ||
    t.includes("程式") ||
    t.includes("排版") ||
    t.includes("網格") ||
    t.includes("code") ||
    t.includes("前端") ||
    t.includes("資料") ||
    t.includes("互動") ||
    t.includes("開發")
  ) {
    category = "programming";
  } else {
    category = "branding";
  }

  if (theme === "sepia") {
    switch (category) {
      case "graphic":
        return "bg-[#EAE0CA] text-[#4F3824] border-[#DECFA9] hover:bg-[#E3D7BB] hover:border-[#D0C098]";
      case "video":
        return "bg-[#ECDAC3] text-[#693E1B] border-[#E1C5A6] hover:bg-[#E2CEB4] hover:border-[#D5B593]";
      case "programming":
        return "bg-[#DFE9D4] text-[#22441F] border-[#CFDCBF] hover:bg-[#D5E1C8] hover:border-[#BFCDAD]";
      case "branding":
      default:
        return "bg-[#DAE7EC] text-[#1D3E4F] border-[#C7D9E0] hover:bg-[#CFDEE4] hover:border-[#B5CBD4]";
    }
  } else if (theme === "light") {
    switch (category) {
      case "graphic":
        return "bg-indigo-50/80 text-indigo-700 border-indigo-200/60 hover:bg-indigo-100 hover:text-indigo-800 hover:border-indigo-300";
      case "video":
        return "bg-rose-50/80 text-rose-700 border-rose-200/60 hover:bg-rose-100 hover:text-rose-800 hover:border-rose-300";
      case "programming":
        return "bg-emerald-50/80 text-emerald-700 border-emerald-200/60 hover:bg-emerald-100 hover:text-emerald-800 hover:border-emerald-300";
      case "branding":
      default:
        return "bg-sky-50/80 text-sky-700 border-sky-200/60 hover:bg-sky-100 hover:text-sky-800 hover:border-sky-300";
    }
  } else {
    // dark theme
    switch (category) {
      case "graphic":
        return "bg-indigo-500/10 text-indigo-300 border-indigo-500/20 hover:bg-indigo-500/20 hover:border-indigo-500/40 hover:text-indigo-200";
      case "video":
        return "bg-rose-500/10 text-rose-300 border-rose-500/20 hover:bg-rose-500/20 hover:border-rose-500/40 hover:text-rose-200";
      case "programming":
        return "bg-emerald-500/10 text-emerald-300 border-emerald-500/20 hover:bg-emerald-500/20 hover:border-emerald-500/40 hover:text-emerald-200";
      case "branding":
      default:
        return "bg-sky-500/10 text-sky-300 border-sky-500/20 hover:bg-sky-500/20 hover:border-sky-500/40 hover:text-sky-200";
    }
  }
};


const CatFootprintsSkeleton = ({ theme }: { theme: "dark" | "light" | "sepia" }) => {
  const color = theme === "sepia" ? "text-[#EADECC]/60" : theme === "light" ? "text-zinc-300" : "text-white/10";
  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none">
       <div className="relative w-32 h-32 flex items-center justify-center transform -rotate-12 scale-75 md:scale-100">
          <motion.div
             initial={{ opacity: 0, scale: 0.8 }}
             animate={{ opacity: [0, 1, 0], scale: [0.8, 1, 0.9] }}
             transition={{ duration: 2.4, repeat: Infinity, delay: 0, ease: "easeInOut" }}
             className={`absolute bottom-2 left-4 ${color}`}
          >
             <PawPrint className="w-6 h-6 -rotate-[15deg]" />
          </motion.div>
          <motion.div
             initial={{ opacity: 0, scale: 0.8 }}
             animate={{ opacity: [0, 1, 0], scale: [0.8, 1, 0.9] }}
             transition={{ duration: 2.4, repeat: Infinity, delay: 0.6, ease: "easeInOut" }}
             className={`absolute bottom-10 left-14 ${color}`}
          >
             <PawPrint className="w-6 h-6 -rotate-6" />
          </motion.div>
          <motion.div
             initial={{ opacity: 0, scale: 0.8 }}
             animate={{ opacity: [0, 1, 0], scale: [0.8, 1, 0.9] }}
             transition={{ duration: 2.4, repeat: Infinity, delay: 1.2, ease: "easeInOut" }}
             className={`absolute top-6 left-24 ${color}`}
          >
             <PawPrint className="w-6 h-6 rotate-6" />
          </motion.div>
       </div>
    </div>
  );
};

const isTouchDevice = typeof window !== "undefined" && window.matchMedia("(pointer: coarse) and (hover: none)").matches;

// Global timestamp tracking when the selected category was last updated
let lastCategoryChangeTime = Date.now();
let lastSelectedCategory = "";

export const PortfolioCard = React.memo(function PortfolioCard({ 
  item, 
  onClick, 
  priority = false,
  index,
  prevVisibleCount,
  theme,
  showAllDetails,
  onNearBottom,
  isFirst = false,
  selectedCategory,
  isEcoMode = false
}: PortfolioCardProps) {
  const catColor = React.useMemo(() => getCategoryColor(item.category), [item.category]);
  const { mainImgSrc, leftImgSrc, rightImgSrc } = React.useMemo(() => {
    const main = item.imageUrl || (item.images && item.images.length > 0 ? item.images[0] : '');
    const left = (item.images && item.images.length > 1 ? item.images[1] : main) || main;
    const right = (item.images && item.images.length > 2 ? item.images[2] : (item.images && item.images.length > 1 ? item.images[0] : main)) || main;
    return { mainImgSrc: main, leftImgSrc: left, rightImgSrc: right };
  }, [item.imageUrl, item.images]);

  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showFirstPulse, setShowFirstPulse] = useState(isFirst);

  const [shuffleOffset, setShuffleOffset] = useState({ x: 0, y: 0, rotate: 0, scale: 1, opacity: 1 });

  const [rippleOffset, setRippleOffset] = useState({ y: 0, rotate: 0, scale: 1 });

  React.useEffect(() => {
    const handleGlobalFlip = (e: Event) => {
      const customEvent = e as CustomEvent<{ index: number; timestamp: number }>;
      const { index: clickedIndex } = customEvent.detail;
      
      if (clickedIndex === index) return;
      
      const diff = index - clickedIndex;
      const distance = Math.abs(diff);
      
      // 只讓鄰近的卡片受到波動影響
      if (distance > 8) return;
      
      // 依距離產生時間差的骨牌漣漪效應
      const delay = distance * 45; 
      const distanceFactor = Math.max(0, 1 - distance * 0.12);
      
      const timeoutId = setTimeout(() => {
        const direction = diff > 0 ? 1 : -1;
        const yOffset = - (14 * distanceFactor);
        const rotateOffset = direction * (3.5 * distanceFactor);
        const scaleOffset = Math.max(0.96, 1 - (distance * 0.015));
        
        setRippleOffset({ y: yOffset, rotate: rotateOffset, scale: scaleOffset });
        
        // 短暫彈起後迅速恢復原位
        setTimeout(() => {
           setRippleOffset({ y: 0, rotate: 0, scale: 1 });
        }, 280);
      }, delay);
    };
    
    window.addEventListener("portfolio-card-flipped", handleGlobalFlip);
    return () => window.removeEventListener("portfolio-card-flipped", handleGlobalFlip);
  }, [index]);

  React.useEffect(() => {
    if (selectedCategory !== lastSelectedCategory) {
      lastSelectedCategory = selectedCategory || "";
      lastCategoryChangeTime = Date.now();
    }
  }, [selectedCategory]);

  React.useEffect(() => {
    // 模擬從牌堆中飛出：定義隨機且富有秩序感的初始散落/收集座標與傾斜角度
    // 只在類別剛切換的 1.5 秒內才發揮排卡 Stagger 動畫，常規滾動時不應有延遲與空白感
    const isRecentCategoryChange = Date.now() - lastCategoryChangeTime < 1500;

    if (isEcoMode || !isRecentCategoryChange) {
      setShuffleOffset({
        x: 0,
        y: 0,
        rotate: 0,
        scale: 1,
        opacity: 1
      });
      return;
    }

    const originX = (index % 2 === 0 ? -60 : 60) + (index % 3) * 20;
    const originY = 100 + (index % 4) * 15;
    const originRotate = (index % 2 === 0 ? -10 : 10) + (index % 3) * 3;

    // 瞬間將卡片收攏至牌堆，並呈微縮放與淡出狀態
    setShuffleOffset({
      x: originX,
      y: originY,
      rotate: originRotate,
      scale: 0.8,
      opacity: 0
    });

    // 依據卡片 index 進行有層次的分批發牌 (Staggered deal-in waves)
    const dealDelay = Math.min(index, 12) * 55 + 30;
    const dealTimer = setTimeout(() => {
      setShuffleOffset({
        x: 0,
        y: 0,
        rotate: 0,
        scale: 1,
        opacity: 1
      });
    }, dealDelay);

    return () => clearTimeout(dealTimer);
  }, [selectedCategory, index, isEcoMode]);
  
  
  const shouldReduceMotion = useReducedMotion();

  const isTouchDeviceRef = React.useRef(false);
  const hasMovedRef = React.useRef(false);

  const isCardFlipped = isTouchDeviceRef.current || isTouchDevice ? isFlipped : (isHovered || isFlipped);
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const dragX = useMotionValue(0);
  const dragY = useMotionValue(0);

  const springConfig = { stiffness: 220, damping: 18, mass: 0.6 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  const tiltX = useTransform(springY, [0, 1], [18, -18]);
  const tiltY = useTransform(springX, [0, 1], [-18, 18]);

  const dragRotateX = useTransform(dragY, [-80, 80], [12, -12]);
  const dragRotateY = useTransform(dragX, [-80, 80], [-12, 12]);

  const flipSpring = useSpring(0, { stiffness: 160, damping: 14, mass: 0.9 });
  React.useEffect(() => {
    flipSpring.set(isCardFlipped ? 180 : 0);
  }, [isCardFlipped, flipSpring]);

  React.useEffect(() => {
    if (cardRef.current && cardRef.current.parentElement) {
      const parent = cardRef.current.parentElement;
      if (isCardFlipped) {
        parent.style.zIndex = "50";
      } else if (isHovered) {
        parent.style.zIndex = "30";
      } else {
        parent.style.zIndex = "1";
      }
    }
  }, [isCardFlipped, isHovered]);

  const rotateX = useTransform([tiltX, dragRotateX, flipSpring], ([rx, drx, flip]) => {
    if (isEcoMode) return 0;
    const isFlippedNow = ((flip as number) || 0) > 90;
    const rxVal = (rx as number) || 0;
    const drxVal = (drx as number) || 0;
    const totalRx = rxVal + drxVal;
    return isFlippedNow ? -totalRx : totalRx;
  });

  const rotateY = useTransform([tiltY, dragRotateY, flipSpring], ([ry, dry, flip]) => {
    const flipVal = (flip as number) || 0;
    if (isEcoMode) return flipVal;
    const ryVal = (ry as number) || 0;
    const dryVal = (dry as number) || 0;
    const totalRy = ryVal + dryVal;
    const isFlippedNow = flipVal > 90;
    return flipVal + (isFlippedNow ? -totalRy : totalRy);
  });

  const glareX = useTransform(springX, [0, 1], [0, 100]);
  const glareY = useTransform(springY, [0, 1], [0, 100]);
  
  const glareOpacity = useSpring((isHovered && !isTouchDevice && !isEcoMode) ? 1 : 0, { stiffness: 200, damping: 20 });
  
  const glareBackground = useTransform(
    [glareX, glareY],
    ([x, y]) => `radial-gradient(circle 250px at ${x}% ${y}%, rgba(${catColor.rgbaGlow}, 0.35) 0%, rgba(${catColor.rgbaGlow}, 0.08) 40%, transparent 100%)`
  );

  const themeStyles = React.useMemo(() => {
    const isSepia = theme === "sepia";
    const isLight = theme === "light";

    const defaultShadow = item.isHighlight 
      ? (isSepia ? "0 10px 20px -8px rgba(115, 76, 34, 0.22)" : isLight ? "0 10px 20px -8px rgba(217, 119, 6, 0.15)" : catColor.highlightShadowDark)
      : (isSepia ? catColor.normalShadowSepia : isLight ? catColor.normalShadowLight : catColor.normalShadowDark);

    const themeContainerClass = isSepia
      ? item.isHighlight
        ? `bg-[#FCF5E3] bg-gradient-to-b from-[#FCF5E3] to-[#EDE2CA] border ${catColor.highlightBorderSepia}`
        : `${catColor.normalBgSepia} ${catColor.normalBorderSepia}`
      : isLight
      ? item.isHighlight
        ? `bg-[#FCF8EE] bg-gradient-to-b from-[#FCF8EE] via-[#FCF8EE] to-[#FAF4E5] border ${catColor.highlightBorderLight}`
        : `${catColor.normalBgLight} ${catColor.normalBorderLight}`
      : item.isHighlight
      ? `${catColor.highlightBgDark} ${catColor.highlightBorderDark}`
      : `${catColor.normalBgDark} ${catColor.normalBorderDark}`;

    const titleEnClassValue = isSepia
      ? item.isHighlight
        ? "text-amber-900 font-extrabold tracking-wider"
        : "text-amber-800/80 font-semibold"
      : isLight
      ? item.isHighlight
        ? "text-amber-800 font-extrabold tracking-wider"
        : "text-zinc-500 font-semibold"
      : `${catColor.textClass}`;

    const titleClassValue = isSepia
      ? item.isHighlight
        ? `text-[#2B1B0C] font-bold ${isHovered ? "text-amber-700" : ""}`
        : `text-[#382B1D] ${isHovered ? "text-amber-800" : ""}`
      : isLight
      ? item.isHighlight
        ? `text-[#2B1B0C] font-bold ${isHovered ? "text-amber-600" : ""}`
        : `text-zinc-900 ${isHovered ? "text-amber-600" : ""}`
      : `text-white/90 ${isHovered ? "text-white" : ""}`;

    const backTitleEnClassValue = isSepia
      ? "text-amber-800/80 font-semibold"
      : isLight
      ? "text-zinc-500 font-semibold"
      : `${catColor.textClass}`;

    const backTitleClassValue = isSepia
      ? `text-[#382B1D] ${isHovered ? "text-amber-800" : ""}`
      : isLight
      ? `text-zinc-900 ${isHovered ? "text-amber-600" : ""}`
      : `text-white/90 ${isHovered ? "text-white" : ""}`;

    const descriptionClassValue = isSepia
      ? item.isHighlight
        ? `text-[#4F3C28] ${isHovered ? "text-[#2B1B0C]" : ""}`
        : `text-[#5C4D3C] ${isHovered ? "text-[#382B1D]" : ""}`
      : isLight
      ? item.isHighlight
        ? `text-[#4F3C28] ${isHovered ? "text-[#18181B]" : ""}`
        : `text-zinc-600 ${isHovered ? "text-[#18181B]" : ""}`
      : `text-zinc-400 ${isHovered ? "text-zinc-200" : ""}`;

    const dividerClassValue = isSepia
      ? item.isHighlight
        ? `border-amber-500/20 ${isHovered ? "border-amber-500/35" : ""}`
        : `border-[#EADECC]/70 ${isHovered ? "border-[#EADECC]" : ""}`
      : isLight
      ? item.isHighlight
        ? `border-amber-500/20 ${isHovered ? "border-amber-500/35" : ""}`
        : `border-zinc-200 ${isHovered ? "border-zinc-300" : ""}`
      : `border-white/5 ${isHovered ? "border-white/10" : ""}`;

    const hoverOverlayClass = isSepia
      ? item.isHighlight
        ? "bg-amber-500/[0.02]"
        : "bg-[#433422]/[0.01]"
      : isLight
      ? item.isHighlight
        ? "bg-amber-500/[0.02]"
        : "bg-black/[0.01]"
      : "bg-white/[0.01]";

    return {
      isSepia,
      isLight,
      defaultShadow,
      themeContainerClass,
      titleEnClassValue,
      titleClassValue,
      backTitleEnClassValue,
      backTitleClassValue,
      descriptionClassValue,
      dividerClassValue,
      hoverOverlayClass
    };
  }, [theme, item.isHighlight, catColor, isHovered]);

  const touchStartRef = React.useRef<{ x: number; y: number } | null>(null);

  // Deceleration inertia physics references for touch interactions
  const inertiaFrameRef = React.useRef<number | null>(null);
  
  const velocityRef = React.useRef<{ vx: number; vy: number }>({ vx: 0, vy: 0 });
  const lastTouchRef = React.useRef<{ x: number; y: number; time: number } | null>(null);
  const currentRotationRef = React.useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Virtualized List Optimization: IntersectionObserver
  const [isVisible, setIsVisible] = useState(priority || index < 12);
  const cardRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (priority || index < 12) {
      setIsVisible(true);
      // Still trigger onNearBottom if initially loaded and near bottom (handled by index match)
      if (onNearBottom) {
        onNearBottom();
      }
      return;
    }

    // Keep card loaded once visible to prevent reloads when scrolling back up
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (onNearBottom) {
            onNearBottom();
          }
          observer.disconnect();
        }
      },
      {
        rootMargin: "800px 0px 800px 0px", // Expanded sentinel envelope for rapid modern scrolling safety
        threshold: 0.001,
      }
    );

    const el = cardRef.current;
    if (el) {
      observer.observe(el);
    }

    return () => {
      observer.disconnect();
    };
  }, [priority, index, onNearBottom]);

  React.useEffect(() => {
    return () => {
      if (inertiaFrameRef.current) {
        cancelAnimationFrame(inertiaFrameRef.current);
      }
    };
  }, []);

  React.useEffect(() => {
    if (!isFlipped) return;

    const handleDocumentClick = (e: MouseEvent) => {
      const el = cardRef.current;
      if (el && !el.contains(e.target as Node)) {
        setIsFlipped(false);
      }
    };

    const timer = setTimeout(() => {
      document.addEventListener("click", handleDocumentClick);
    }, 10);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("click", handleDocumentClick);
    };
  }, [isFlipped]);

  
  // --- Physics Event Handlers ---
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (showFirstPulse) setShowFirstPulse(false);
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
    setIsPressed(true);
    isTouchDeviceRef.current = true;
    hasMovedRef.current = false;

    if (!isTouchDevice) {
      // Initial physical interaction center
      const card = e.currentTarget;
      const rect = card.getBoundingClientRect();
      const x = (touch.clientX - rect.left) / rect.width;
      const y = (touch.clientY - rect.top) / rect.height;
      mouseX.set(x);
      mouseY.set(y);
    } else {
      mouseX.set(0.5);
      mouseY.set(0.5);
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!touchStartRef.current) return;
    const touch = e.touches[0];
    const diffX = Math.abs(touch.clientX - touchStartRef.current.x);
    const diffY = Math.abs(touch.clientY - touchStartRef.current.y);
    
    if (!isTouchDevice) {
      // Apply physical damping before scroll threshold
      const card = e.currentTarget;
      const rect = card.getBoundingClientRect();
      const x = (touch.clientX - rect.left) / rect.width;
      const y = (touch.clientY - rect.top) / rect.height;
      mouseX.set(x);
      mouseY.set(y);
    }

    if (diffX > 10 || diffY > 10) {
      hasMovedRef.current = true;
      touchStartRef.current = null;
      setIsPressed(false);
      mouseX.set(0.5);
      mouseY.set(0.5);
    }
  };

  const handleTouchEnd = () => {
    touchStartRef.current = null;
    setIsPressed(false);
    mouseX.set(0.5);
    mouseY.set(0.5);
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    if (showFirstPulse) setShowFirstPulse(false);
    setIsHovered(true);
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (showFirstPulse) setShowFirstPulse(false);
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    
    mouseX.set(x);
    mouseY.set(y);
    
    if (!isHovered) {
      setIsHovered(true);
    }
  };

  const handleMouseLeave = () => {
    setIsPressed(false);
    setIsHovered(false);
    setIsFlipped(false);
    mouseX.set(0.5);
    mouseY.set(0.5);
  };

  const handleCardClick = (e: React.MouseEvent) => {
    if (hasMovedRef.current) {
      hasMovedRef.current = false;
      return;
    }
    if (isCardFlipped) {
      onClick();
    } else {
      setIsFlipped(true);
      
      // 發送全局事件，觸發周圍卡片的漣漪起伏效應
      const event = new CustomEvent("portfolio-card-flipped", {
        detail: { index, timestamp: Date.now() }
      });
      window.dispatchEvent(event);
    }
  };

  const staggerIndex = index - prevVisibleCount;
  const delay = prevVisibleCount === 0 
    ? Math.min(index, 6) * 0.045
    : Math.min(staggerIndex, 12) * 0.045;

  return (
    <motion.div
      ref={cardRef}
      layout={isEcoMode ? undefined : "position"}
      animate={{ 
        opacity: shuffleOffset.opacity, 
        scale: isEcoMode ? 1 : shuffleOffset.scale * rippleOffset.scale, 
        x: isEcoMode ? 0 : shuffleOffset.x,
        y: isEcoMode ? 0 : shuffleOffset.y + rippleOffset.y,
        rotate: isEcoMode ? 0 : shuffleOffset.rotate + rippleOffset.rotate
      }}
      transition={{ 
        type: "spring",
        stiffness: 170, // 紙牌特有的俐落剛性與彈性
        damping: 16,
        mass: 0.8,
        layout: { type: "spring", stiffness: 180, damping: 18 } // 平滑、有機的佈局移動軌跡
      }}
      className="h-full scroll-mt-16 md:scroll-mt-20 relative"
      style={{
        zIndex: isCardFlipped ? 50 : isHovered ? 30 : 1,
      }}
    >
      {!isVisible ? (
        <div
          className={`relative flex flex-col rounded-2xl overflow-hidden h-full transition-all duration-300 border ${
            theme === "sepia"
              ? "bg-[#FCF5E3]/40 border-[#EADECC]/60"
              : theme === "light"
              ? "bg-white/40 border-zinc-200/60"
              : "bg-[#0A0A0A]/40 border-white/5"
          } animate-pulse`}
          style={{ minHeight: "365px" }}
        >
          {/* Image Placeholder */}
          <div className={`w-full relative flex items-center justify-center overflow-hidden ${showAllDetails ? "aspect-[4/3]" : "aspect-square"} ${
            theme === "sepia" ? "bg-[#EADECC]/20" : theme === "light" ? "bg-zinc-200/40" : "bg-white/5"
          }`}>
             <CatFootprintsSkeleton theme={theme} />
          </div>
          
          {/* Details Placeholder */}
          {showAllDetails && (
            <div className="flex-1 flex flex-col p-5 md:p-6 space-y-4">
              <div className="space-y-2.5">
                {/* Title En Placeholder */}
                <div className={`h-2.5 w-1/3 rounded-full ${
                  theme === "sepia" ? "bg-[#EADECC]/40" : theme === "light" ? "bg-zinc-200/60" : "bg-white/10"
                }`} />
                {/* Title Placeholder */}
                <div className={`h-4 w-3/4 rounded-full ${
                  theme === "sepia" ? "bg-[#EADECC]/60" : theme === "light" ? "bg-zinc-300/60" : "bg-white/15"
                }`} />
              </div>
              
              {/* Tags Placeholder */}
              <div className={`pt-3.5 border-t flex gap-2 ${
                theme === "sepia" ? "border-[#EADECC]/30" : theme === "light" ? "border-zinc-200/50" : "border-white/5"
              }`}>
                <div className={`h-5 w-12 rounded ${
                  theme === "sepia" ? "bg-[#EADECC]/30" : theme === "light" ? "bg-zinc-200/50" : "bg-white/10"
                }`} />
                <div className={`h-5 w-16 rounded ${
                  theme === "sepia" ? "bg-[#EADECC]/30" : theme === "light" ? "bg-zinc-200/50" : "bg-white/10"
                }`} />
              </div>
            </div>
          )}
        </div>
      ) : (
        <div
          id={`portfolio_item_card_${item.id}`}
          onClick={handleCardClick}
          onMouseEnter={handleMouseEnter}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onMouseDown={() => {
            setIsPressed(true);
          }}
          onMouseUp={() => {
            setIsPressed(false);
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={handleTouchEnd}
          className="group relative w-full h-full cursor-pointer"
          style={{
            perspective: "1200px",
            transformStyle: "preserve-3d",
            zIndex: isCardFlipped ? 40 : isHovered ? 20 : 1,
          }}
        >
          <motion.div
            style={{
              x: dragX,
              y: dragY,
              transformStyle: "preserve-3d",
              rotateX,
              rotateY,
            }}
            drag={!isTouchDevice}
            dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
            dragElastic={0.25}
            dragSnapToOrigin={true}
            dragTransition={{ bounceStiffness: 220, bounceDamping: 15 }}
            onDragStart={() => {
              setIsPressed(true);
              if (showFirstPulse) setShowFirstPulse(false);
            }}
            onDrag={(_, info) => {
              if (Math.hypot(info.offset.x, info.offset.y) > 5) {
                hasMovedRef.current = true;
              }
            }}
            onDragEnd={() => {
              setIsPressed(false);
            }}
            animate={{
              scale: isPressed ? 0.955 : isHovered ? 1.025 : 1,
              boxShadow: isHovered 
                ? `0 25px 50px -12px rgba(0,0,0,0.85), 0 0 25px 3px rgba(${catColor.rgbaGlow}, 0.22)`
                : themeStyles.defaultShadow,
            }}
            transition={{
              scale: { type: "spring", stiffness: 250, damping: 20 },
              boxShadow: { duration: 0.3 }
            }}
            className="relative flex flex-col rounded-2xl w-full h-full"
          >
          {showFirstPulse && (
            <div className={`absolute -inset-[3px] rounded-[1.2rem] z-[-1] animate-[pulse_2s_ease-in-out_infinite] ${
              theme === 'sepia' ? 'bg-[#A05C2C]/30' : theme === 'light' ? 'bg-amber-500/30' : 'bg-amber-400/40'
            }`} />
          )}
          {/* Front Face of the Card */}
          <div
            className={`w-full h-full flex flex-col rounded-2xl overflow-hidden transition-[background-color,border-color,color] duration-500 subpixel-antialiased ${themeStyles.themeContainerClass}`}
            style={{
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              transform: "rotateY(0deg) translateZ(1px)",
              textRendering: "geometricPrecision",
            }}
          >
            {/* 3D Border Glow Reflection Halo (Glow Overlay) */}
            {!themeStyles.isSepia && !themeStyles.isLight && (
              <motion.div 
                className="absolute inset-0 pointer-events-none rounded-2xl"
                style={{
                  opacity: glareOpacity,
                  background: glareBackground,
                  border: `1px solid rgba(${catColor.rgbaGlow}, 0.25)`,
                  mixBlendMode: "color-dodge",
                  zIndex: 10,
                }}
              />
            )}

            {/* Card Edge & Face Shimmer Sweep Effect */}
            <div className="shimmer-line pointer-events-none absolute inset-0 z-20 rounded-2xl" />

            {/* 卡片封面圖 */}
            <div className={`relative ${showAllDetails ? "aspect-[4/3] rounded-t-2xl" : "aspect-square rounded-2xl"} overflow-hidden ${themeStyles.isSepia ? catColor.highlightBgSepia : themeStyles.isLight ? catColor.highlightBgLight : catColor.highlightBgDark}`} style={{ transform: "translateZ(8px)" }}>
              <ImageWithFallback
                src={item.imageUrl || (item.images && item.images.length > 0 ? item.images[0] : '')}
                alt={item.title}
                referrerPolicy="no-referrer"
                fallbackTheme={item.colorTheme}
                categoryName={item.category}
                titleText={item.title}
                optimizeSize={400}
                className={`w-full h-full object-cover transform transition-all duration-700 ease-out ${
                  isHovered ? "scale-105" : "scale-100"
                }`}
                lazy={!priority}
                priority={priority}
                theme={theme}
              />
              

              {/* 卡片類別浮章 */}
              {showAllDetails && (
                <div className="absolute top-4 left-4" style={{ transform: "translateZ(12px)" }}>
                  <span 
                    className={`px-3 py-0.5 md:px-3.5 md:py-1 text-[11px] font-medium tracking-wide rounded-full shadow-md flex items-center justify-center text-center whitespace-nowrap shrink-0 border transition-all duration-400 ease-in-out ${
                      themeStyles.isSepia
                        ? "bg-[#FAF4E5] border-[#E2D2B3]"
                        : themeStyles.isLight
                        ? "bg-white border-zinc-150"
                        : "bg-zinc-950/95 border-white/5"
                    }`}
                    style={{
                      borderColor: isHovered
                        ? `rgba(${catColor.rgbaGlow}, ${themeStyles.isSepia || themeStyles.isLight ? '0.75' : '0.85'})`
                        : `rgba(${catColor.rgbaGlow}, ${themeStyles.isSepia || themeStyles.isLight ? '0.35' : '0.25'})`,
                      color: isHovered
                        ? `rgb(${catColor.rgbaGlow})`
                        : `rgba(${catColor.rgbaGlow}, ${themeStyles.isSepia || themeStyles.isLight ? '0.9' : '0.85'})`,
                      boxShadow: isHovered
                        ? `0 0 12px 2px rgba(${catColor.rgbaGlow}, ${themeStyles.isSepia || themeStyles.isLight ? '0.25' : '0.45'})`
                        : `0 2px 4px rgba(${catColor.rgbaGlow}, ${themeStyles.isSepia || themeStyles.isLight ? '0.04' : '0.08'})`,
                      boxSizing: "border-box"
                    }}
                  >
                    {item.category}
                  </span>
                </div>
              )}

              {/* 亮點卡片勳章 */}
              {item.isHighlight && (
                <div className="absolute top-4 right-4 z-20" style={{ transform: "translateZ(12px)" }}>
                  <span className={`py-1 text-[10px] font-sans font-bold tracking-wider text-black bg-gradient-to-r from-amber-400 to-amber-500 rounded-full shadow-lg flex items-center border border-amber-300/30 transition-shadow duration-300 overflow-hidden relative group/badge ${catColor.glowClass} ${showAllDetails ? "px-2.5 gap-1" : "px-2 justify-center"}`}>
                    {/* 動態光流遮罩 (Dynamic light sweep) - hover 時才流動 */}
                    <span className="absolute inset-x-0 inset-y-0 -translate-x-full bg-gradient-to-r from-transparent via-white/70 to-transparent group-hover/badge:animate-skeleton-shimmer pointer-events-none scale-y-150 rotate-12" />
                    
                    <Sparkles className="h-3 w-3 fill-black text-black animate-hover-bounce-icon relative z-10" />
                    {showAllDetails && (
                      <span className="relative z-10">
                        精選亮點
                      </span>
                    )}
                  </span>
                </div>
              )}
              {/* 外部連結小圖示 */}
              {item.link && (
                <div className="absolute bottom-4 right-4 z-20" style={{ transform: "translateZ(12px)" }}>
                  <span 
                    className={`h-7 w-7 rounded-full flex items-center justify-center border backdrop-blur-md shadow-lg transition-all duration-300 ${
                      themeStyles.isSepia
                        ? "bg-[#FCF5E3]/85 text-amber-900 border-[#EADECC]/80 hover:bg-[#FCF5E3] hover:scale-110"
                        : themeStyles.isLight
                        ? "bg-white/85 text-zinc-800 border-zinc-200/50 hover:bg-white hover:scale-110"
                        : "bg-black/60 text-zinc-100 border-white/10 hover:bg-black/80 hover:scale-110"
                    }`}
                    title="含有外部連結"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </span>
                </div>
              )}
            </div>

            {/* 內容描述區 (可透過上方按鈕開關) */}
            {showAllDetails && (
              <div 
                className={`flex-1 flex flex-col p-5 md:p-6 space-y-4 relative overflow-hidden transition-all duration-500 ease-out z-10 ${isHovered ? themeStyles.hoverOverlayClass : ""}`} 
                style={{ transform: "translateZ(4px)" }}
              >
                {/* 微焦點放大焦點背景遮罩 (含微妙發光) */}
                <div 
                  className={`absolute inset-0 transition-opacity duration-500 pointer-events-none ${
                    isHovered ? "opacity-100" : "opacity-0"
                  }`}
                  style={{
                    background: `radial-gradient(circle 120px at 50% 50%, rgba(${catColor.rgbaGlow}, 0.05) 0%, transparent 100%)`
                  }}
                />

                {/* 內容文字微幅浮起與提亮 (提升對比度與專注力) */}
                <div className={`space-y-1 transform transition-all duration-300 ease-out ${
                  isHovered ? "translate-y-[-2px] scale-[1.005]" : "translate-y-0 scale-100"
                }`}>
                  <p className={`text-[10px] font-mono tracking-widest uppercase opacity-90 transition-all duration-400 ${isHovered ? "opacity-100" : "opacity-90"} ${themeStyles.titleEnClassValue}`}>{item.titleEn}</p>
                  <h3 className={`text-base font-display font-semibold transition-colors duration-400 line-clamp-1 flex items-center gap-1 ${themeStyles.titleClassValue}`}>
                    <span className="truncate">{item.title}</span>
                    <span className={`transition-all duration-400 text-sm font-semibold shrink-0 ${
                      isHovered ? "opacity-100 translate-x-1" : "opacity-0 translate-x-0"
                    }`}>→</span>
                  </h3>
                </div>

                {/* 工具 Tags */}
                <div className={`pt-3.5 border-t flex flex-wrap gap-1.5 transform transition-all duration-400 ease-out ${
                  isHovered ? "translate-y-[-1.2px]" : "translate-y-0"
                } ${themeStyles.dividerClassValue}`}>
                  {item.tools.map((tech) => (
                    <span 
                      key={tech} 
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-medium transition-all duration-300 border ${getToolStyle(tech, theme)}`}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
 
          {/* Back Face of the Card */}
          <div
            className="absolute inset-0 w-full h-full rounded-2xl overflow-visible subpixel-antialiased"
            style={{
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              transform: "rotateY(180deg) translateZ(1px)",
              zIndex: 5,
              textRendering: "geometricPrecision",
            }}
          >
            {/* 撲克牌綻開 - 左翼作品照片卡牌 (動態負 z-index 管理，位於中間卡片後方) */}
            <motion.div
              className={`absolute inset-0 rounded-2xl overflow-hidden border pointer-events-none transition-colors duration-500 ${
                themeStyles.isSepia
                  ? "bg-[#FAF2E1] border-[#E8D9BF]"
                  : themeStyles.isLight
                  ? "bg-white border-zinc-200"
                  : "bg-zinc-900 border-white/15"
              }`}
              animate={{
                x: isCardFlipped ? 34 : 0,
                y: isCardFlipped ? -6 : 0,
                rotate: isCardFlipped ? 9 : 0,
                opacity: isCardFlipped ? 0.95 : 0,
                scale: isCardFlipped ? 0.96 : 0.9,
                boxShadow: isCardFlipped
                  ? "-10px 14px 24px -4px rgba(0, 0, 0, 0.35)"
                  : "0px 0px 0px 0px rgba(0, 0, 0, 0)",
              }}
              transition={{
                type: "spring",
                stiffness: 240,
                damping: 18,
                mass: 0.8,
                delay: isCardFlipped ? (isFlipped ? 0.05 : 0.3) : 0,
              }}
              style={{
                transformOrigin: "bottom center",
                zIndex: isCardFlipped ? -1 : -10,
                willChange: "transform, opacity",
              }}
            >
              <ImageWithFallback
                src={leftImgSrc}
                alt={`${item.title} 綻開預覽圖 1`}
                referrerPolicy="no-referrer"
                fallbackTheme={item.colorTheme}
                categoryName={item.category}
                titleText={item.title}
                optimizeSize={300}
                className="w-full h-full object-cover"
                lazy={!priority}
                priority={priority}
                theme={theme}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/10 p-3.5 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-black/70 text-amber-300 border border-amber-400/30 backdrop-blur-md shadow-sm">
                    ♠ Photo 01
                  </span>
                  <Sparkles className="w-3.5 h-3.5 text-amber-300 drop-shadow-md" />
                </div>
                <div className="text-[10px] font-medium text-white/95 line-clamp-1 drop-shadow-md">
                  {item.title}
                </div>
              </div>
            </motion.div>

            {/* 撲克牌綻開 - 右翼作品照片卡牌 (動態負 z-index 管理，位於中間卡片後方) */}
            <motion.div
              className={`absolute inset-0 rounded-2xl overflow-hidden border pointer-events-none transition-colors duration-500 ${
                themeStyles.isSepia
                  ? "bg-[#FAF2E1] border-[#E8D9BF]"
                  : themeStyles.isLight
                  ? "bg-white border-zinc-200"
                  : "bg-zinc-900 border-white/15"
              }`}
              animate={{
                x: isCardFlipped ? -34 : 0,
                y: isCardFlipped ? -6 : 0,
                rotate: isCardFlipped ? -9 : 0,
                opacity: isCardFlipped ? 0.95 : 0,
                scale: isCardFlipped ? 0.96 : 0.9,
                boxShadow: isCardFlipped
                  ? "10px 14px 24px -4px rgba(0, 0, 0, 0.35)"
                  : "0px 0px 0px 0px rgba(0, 0, 0, 0)",
              }}
              transition={{
                type: "spring",
                stiffness: 240,
                damping: 18,
                mass: 0.8,
                delay: isCardFlipped ? (isFlipped ? 0.1 : 0.38) : 0,
              }}
              style={{
                transformOrigin: "bottom center",
                zIndex: isCardFlipped ? -2 : -10,
                willChange: "transform, opacity",
              }}
            >
              <ImageWithFallback
                src={rightImgSrc}
                alt={`${item.title} 綻開預覽圖 2`}
                referrerPolicy="no-referrer"
                fallbackTheme={item.colorTheme}
                categoryName={item.category}
                titleText={item.title}
                optimizeSize={300}
                className="w-full h-full object-cover"
                lazy={!priority}
                priority={priority}
                theme={theme}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/10 p-3.5 flex flex-col justify-between">
                <div className="flex items-center justify-between text-right">
                  <PawPrint className="w-3.5 h-3.5 text-amber-300 drop-shadow-md -rotate-12" />
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-black/70 text-amber-300 border border-amber-400/30 backdrop-blur-md shadow-sm">
                    Photo 02 ♦
                  </span>
                </div>
                <div className="text-[10px] font-medium text-white/95 line-clamp-1 text-right drop-shadow-md">
                  {item.category}
                </div>
              </div>
            </motion.div>

            {/* 中間主卡片 (Front surface of back face, z-10 with solid theme background) */}
            <div 
              className={`relative z-10 w-full h-full flex flex-col rounded-2xl overflow-hidden ${showAllDetails ? "p-5 md:p-6" : "p-4"} justify-between transition-[background-color,border-color,color] duration-500 shadow-2xl ${themeStyles.themeContainerClass}`}
              style={{ zIndex: 10 }}
            >
              {/* Ambient Background Glow inside the main back face */}
              <div 
                className="absolute inset-0 transition-opacity duration-500 pointer-events-none opacity-20 rounded-2xl overflow-hidden"
                style={{
                  background: `radial-gradient(circle at 50% 50%, rgba(${catColor.rgbaGlow}, 0.15) 0%, transparent 80%)`,
                }}
              />

            <div className={`relative z-10 flex flex-col h-full justify-between ${showAllDetails ? "space-y-3" : "space-y-1.5"}`}>
              {/* Header: Category & ID */}
              <div className="flex items-center justify-between">
                <span 
                  className={`px-2.5 py-0.5 text-[9px] font-medium tracking-wide rounded-full border shadow-sm transition-all duration-300 ${
                    themeStyles.isSepia
                      ? "bg-[#FAF4E5] border-[#E2D2B3]"
                      : themeStyles.isLight
                      ? "bg-white border-zinc-150"
                      : "bg-zinc-950/95 border-white/5"
                  }`}
                  style={{
                    borderColor: `rgba(${catColor.rgbaGlow}, 0.45)`,
                    color: `rgb(${catColor.rgbaGlow})`,
                  }}
                >
                  {item.category}
                </span>
              </div>

              {/* Title Block */}
              <div className="space-y-0.5">
                <p className={`text-[10px] font-mono tracking-widest uppercase line-clamp-1 md:line-clamp-2 ${themeStyles.backTitleEnClassValue}`}>
                  {item.titleEn}
                </p>
                <h3 className={`text-sm md:text-base font-display font-semibold leading-snug line-clamp-2 md:line-clamp-3 ${themeStyles.backTitleClassValue}`}>
                  {item.title}
                </h3>
              </div>

              {/* 工具標籤區 */}
              {item.tools && item.tools.length > 0 && (
                <div className="flex flex-wrap gap-1.5 py-1">
                  {item.tools.slice(0, 3).map((tool) => (
                    <span
                      key={tool}
                      className={`px-2 py-0.5 rounded text-[9px] font-mono font-medium border ${getToolStyle(tool, theme)}`}
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              )}

              {/* Spacer to push footer to bottom when tags are removed */}
              <div className="flex-1" />

              {/* Footer CTA */}
              <div className={`${showAllDetails ? "pt-2.5" : "pt-1.5"} border-t flex items-center justify-end text-[10px] font-medium ${themeStyles.dividerClassValue}`}>
                <span className={`px-2 py-1 rounded-lg text-[9px] font-bold tracking-wider text-black bg-gradient-to-r ${catColor.gradientClass || 'from-amber-400 to-amber-500'} flex items-center gap-1 shadow-sm`}>
                  <span>{(item.id === "mumao-cat-religion-ip" || item.title.includes("MuMㄠ")) ? "開啟 IP 專題 Case Study" : "展開"}</span>
                  <ArrowUpRight className="h-2 w-2 stroke-[2.5]" />
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
    )}
    </motion.div>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.item.id === nextProps.item.id &&
    prevProps.item === nextProps.item &&
    prevProps.priority === nextProps.priority &&
    prevProps.index === nextProps.index &&
    prevProps.prevVisibleCount === nextProps.prevVisibleCount &&
    prevProps.theme === nextProps.theme &&
    prevProps.showAllDetails === nextProps.showAllDetails &&
    prevProps.onNearBottom === nextProps.onNearBottom &&
    prevProps.selectedCategory === nextProps.selectedCategory &&
    prevProps.isEcoMode === nextProps.isEcoMode &&
    prevProps.isFirst === nextProps.isFirst
  );
});