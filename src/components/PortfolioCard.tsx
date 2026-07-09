interface PortfolioCardProps {
  item: PortfolioItem;
  onClick: () => void;
  key?: React.Key;
  priority?: boolean;
  index: number;
  prevVisibleCount: number;
  theme: "dark" | "light" | "sepia";
  showAllDetails: boolean;
}

import React, { useState } from "react";
import { X, Sparkles, ArrowUpRight, ArrowUp, Image as ImageIcon, QrCode, Download, Eye, ExternalLink } from "lucide-react";
import { motion } from "motion/react";
import { PortfolioItem } from "../types";
import { ImageWithFallback } from "./ImageWithFallback";
import { getCategoryColor } from "../categoryColors";
import { EXISTING_OPTIMIZED_IMAGES } from "../existingImages";


export const PortfolioCard = React.memo(function PortfolioCard({ 
  item, 
  onClick, 
  priority = false,
  index,
  prevVisibleCount,
  theme,
  showAllDetails
}: PortfolioCardProps) {
  const catColor = getCategoryColor(item.category);
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const cardInnerRef = React.useRef<HTMLDivElement>(null);
  const glareRef = React.useRef<HTMLDivElement>(null);
  const isTouchDeviceRef = React.useRef(false);
  const hasMovedRef = React.useRef(false);

  const isCardFlipped = isTouchDeviceRef.current ? isFlipped : (isHovered || isFlipped);

  const isSepia = theme === "sepia";
  const isLight = theme === "light";

  const defaultShadow = item.isHighlight 
    ? (isSepia ? "0 10px 20px -8px rgba(115, 76, 34, 0.22)" : isLight ? "0 10px 20px -8px rgba(217, 119, 6, 0.15)" : catColor.highlightShadowDark)
    : (isSepia ? catColor.normalShadowSepia : isLight ? catColor.normalShadowLight : catColor.normalShadowDark);

  const themeContainerClass = isSepia
    ? item.isHighlight
      ? "bg-[#FCF5E3] bg-gradient-to-b from-[#FCF5E3] to-[#EDE2CA] border-[2.5px] border-amber-600 hover:border-amber-700"
      : `${catColor.normalBgSepia} ${catColor.normalBorderSepia}`
    : isLight
    ? item.isHighlight
      ? "bg-[#FCF8EE] bg-gradient-to-b from-[#FCF8EE] via-[#FCF8EE] to-[#FAF4E5] border-[2.5px] border-amber-500 hover:border-amber-600"
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
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: "580px 0px 580px 0px", // Expanded sentinel envelope for rapid modern scrolling safety
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
  }, [priority, index]);

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

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (inertiaFrameRef.current) {
      cancelAnimationFrame(inertiaFrameRef.current);
      inertiaFrameRef.current = null;
    }
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
    setIsPressed(true);
    isTouchDeviceRef.current = true;
    hasMovedRef.current = false;
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!touchStartRef.current) return;
    const touch = e.touches[0];
    const diffX = Math.abs(touch.clientX - touchStartRef.current.x);
    const diffY = Math.abs(touch.clientY - touchStartRef.current.y);

    // 當偵測到用戶正在進行頁面滾動（位移大於 10 pixel），立即釋放卡片焦點與縮小反饋，完整交回給瀏覽器原生滚动並標記為已滑動
    if (diffX > 10 || diffY > 10) {
      hasMovedRef.current = true;
      touchStartRef.current = null;
      setIsPressed(false);
    }
  };

  const handleTouchEnd = () => {
    touchStartRef.current = null;
    setIsPressed(false);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (inertiaFrameRef.current) {
      cancelAnimationFrame(inertiaFrameRef.current);
      inertiaFrameRef.current = null;
    }
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Smooth subtle tilt (-6 to 6 degrees maximum for premium look)
    const rotateX = ((y - centerY) / centerY) * -6;
    const rotateY = ((x - centerX) / centerX) * 6;
    
    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;

    const baseFlipped = isCardFlipped;

    if (cardInnerRef.current) {
      const baseRotateY = baseFlipped ? 180 : 0;
      const adjustedRotateY = baseRotateY + (baseFlipped ? -rotateY : rotateY);
      cardInnerRef.current.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${adjustedRotateY}deg) scale3d(${isPressed ? 0.955 : 1.025}, ${isPressed ? 0.955 : 1.025}, 1)`;
      cardInnerRef.current.style.boxShadow = `0 25px 50px -12px rgba(0,0,0,0.85), 0 0 25px 3px rgba(${catColor.rgbaGlow}, 0.22)`;
    }
    if (glareRef.current) {
      glareRef.current.style.opacity = "1";
      glareRef.current.style.background = `radial-gradient(circle 160px at ${glareX}% ${glareY}%, rgba(${catColor.rgbaGlow}, 0.14) 0%, transparent 100%)`;
    }
    if (!isHovered) {
      setIsHovered(true);
    }
  };

  const handleMouseLeave = () => {
    setIsPressed(false);
    setIsHovered(false);
    setIsFlipped(false);
    if (cardInnerRef.current) {
      cardInnerRef.current.style.transform = "";
      cardInnerRef.current.style.boxShadow = defaultShadow;
    }
    if (glareRef.current) {
      glareRef.current.style.opacity = "0";
    }
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
    }
  };

  const staggerIndex = index - prevVisibleCount;
  const delay = prevVisibleCount === 0 
    ? Math.min(index, 6) * 0.045
    : Math.min(staggerIndex, 12) * 0.045;

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, scale: 0.88, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.88, y: -20 }}
      transition={{ 
        opacity: { duration: 0.22, ease: "easeOut", delay },
        scale: { duration: 0.22, ease: "easeOut", delay },
        y: { duration: 0.22, ease: "easeOut", delay }
      }}
      className="h-full scroll-mt-24"
    >
      {!isVisible ? (
        <div
          style={{
            minHeight: "365px",
          }}
          className={`relative flex flex-col rounded-2xl overflow-hidden h-full transition-all duration-300 ${
            theme === "sepia"
              ? "bg-[#FAF4E5]/40 border-[#EADECC]/45"
              : theme === "light"
              ? "bg-zinc-100/50 border-zinc-200/40"
              : "bg-[#0E0E0E]/40 border-white/5"
          } animate-pulse items-center justify-center`}
        >
          <div className="flex flex-col items-center gap-1.5 opacity-20">
            <div className={`w-10 h-10 border rounded-lg flex items-center justify-center text-xs ${
              theme === "sepia" ? "border-amber-700/10" : theme === "light" ? "border-zinc-200" : "border-white/10"
            }`}>
              🎨
            </div>
            <span className={`text-[9px] font-mono tracking-widest ${
              theme === "sepia" ? "text-amber-900" : theme === "light" ? "text-zinc-600" : "text-zinc-400"
            }`}>SHOWCASE</span>
          </div>
        </div>
      ) : (
        <div
          ref={cardInnerRef}
          id={`portfolio_item_card_${item.id}`}
          onClick={handleCardClick}
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
          style={{
            transformStyle: "preserve-3d",
            transform: isCardFlipped 
              ? `perspective(1200px) rotateY(180deg) scale3d(${isPressed ? 0.97 : isHovered ? 1.025 : 1}, ${isPressed ? 0.97 : isHovered ? 1.025 : 1}, 1)` 
              : `perspective(1200px) rotateY(0deg) scale3d(${isPressed ? 0.97 : isHovered ? 1.025 : 1}, ${isPressed ? 0.97 : isHovered ? 1.025 : 1}, 1)`,
            transition: isCardFlipped || isHovered || isPressed 
              ? "transform 0.7s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.4s cubic-bezier(0.25, 1, 0.5, 1), border-color 0.4s ease, background-color 0.4s ease" 
              : "transform 0.7s cubic-bezier(0.25, 1, 0.5, 1)",
            boxShadow: defaultShadow,
          }}
          className="group relative flex flex-col rounded-2xl cursor-pointer h-full"
        >
          {/* Front Face of the Card */}
          <div
            className={`w-full h-full flex flex-col rounded-2xl overflow-hidden transition-[background-color,border-color,color] duration-500 ${themeContainerClass}`}
            style={{
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              transform: "rotateY(0deg) translateZ(1px)",
            }}
          >
            {/* 3D Border Glow Reflection Halo (Glow Overlay) */}
            {!isSepia && !isLight && (
              <div 
                ref={glareRef}
                className="absolute inset-0 pointer-events-none transition-opacity duration-300 rounded-2xl"
                style={{
                  opacity: 0,
                  background: `radial-gradient(circle 160px at 50% 50%, rgba(${catColor.rgbaGlow}, 0.14) 0%, transparent 100%)`,
                  border: `1px solid rgba(${catColor.rgbaGlow}, 0.22)`,
                  mixBlendMode: "screen",
                  zIndex: 10,
                }}
              />
            )}

            {/* Card Edge & Face Shimmer Sweep Effect */}
            <div className="shimmer-line pointer-events-none absolute inset-0 z-20 rounded-2xl" />

            {/* 卡片封面圖 */}
            <div className={`relative ${showAllDetails ? "aspect-[4/3]" : "aspect-square"} overflow-hidden ${isSepia ? "bg-[#EADECC]/45" : "bg-zinc-950"}`} style={{ transform: "translateZ(8px)" }}>
              <ImageWithFallback
                src={item.imageUrl || (item.images && item.images.length > 0 ? item.images[0] : '')}
                alt={item.title}
                referrerPolicy="no-referrer"
                fallbackTheme={item.colorTheme}
                categoryName={item.category}
                titleText={item.title}
                optimizeSize={360}
                className={`w-full h-full object-cover transform transition-all duration-700 ease-out ${
                  isHovered ? "scale-105" : "scale-100"
                }`}
                lazy={!priority}
                priority={priority}
                theme={theme}
              />
              
              {/* 背景霓虹光澤 */}
              <div className={`absolute inset-0 bg-gradient-to-t ${
                isSepia 
                  ? "from-[#433422]/90 via-[#433422]/15 to-transparent" 
                  : "from-black/85 via-black/10 to-transparent"
              }`}></div>

              {/* 卡片類別浮章 */}
              {showAllDetails && (
                <div className="absolute top-4 left-4" style={{ transform: "translateZ(12px)" }}>
                  <span 
                    className={`px-3 py-0.5 md:px-3.5 md:py-1 text-[11px] font-medium tracking-wide rounded-full shadow-md flex items-center justify-center text-center whitespace-nowrap shrink-0 border transition-all duration-400 ease-in-out ${
                      isSepia
                        ? "bg-[#FAF4E5] border-[#E2D2B3]"
                        : isLight
                        ? "bg-white border-zinc-150"
                        : "bg-zinc-950/95 border-white/5"
                    }`}
                    style={{
                      borderColor: isHovered
                        ? `rgba(${catColor.rgbaGlow}, ${isSepia || isLight ? '0.75' : '0.85'})`
                        : `rgba(${catColor.rgbaGlow}, ${isSepia || isLight ? '0.35' : '0.25'})`,
                      color: isHovered
                        ? `rgb(${catColor.rgbaGlow})`
                        : `rgba(${catColor.rgbaGlow}, ${isSepia || isLight ? '0.9' : '0.85'})`,
                      boxShadow: isHovered
                        ? `0 0 12px 2px rgba(${catColor.rgbaGlow}, ${isSepia || isLight ? '0.25' : '0.45'})`
                        : `0 2px 4px rgba(${catColor.rgbaGlow}, ${isSepia || isLight ? '0.04' : '0.08'})`,
                      textShadow: isHovered
                        ? `0 0 6px rgba(${catColor.rgbaGlow}, ${isSepia || isLight ? '0.4' : '0.6'})`
                        : "0 0 0px rgba(0, 0, 0, 0)",
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
                      <span 
                        className="relative z-10"
                        style={{
                          textShadow: isSepia 
                            ? "0px 0.75px 1.5px rgba(255, 255, 255, 0.75), 0px -0.25px 0.5px rgba(255, 255, 255, 0.4)" 
                            : isLight 
                            ? "0px 0.75px 1.5px rgba(255, 255, 255, 0.8), 0px -0.25px 0.5px rgba(255, 255, 255, 0.4)" 
                            : "0px 0.5px 1px rgba(255, 255, 255, 0.35)"
                        }}
                      >
                        精選亮點
                      </span>
                    )}
                  </span>
                </div>
              )}
            </div>

            {/* 內容描述區 (可透過上方按鈕開關) */}
            {showAllDetails && (
              <div 
                className={`flex-1 flex flex-col p-5 md:p-6 space-y-4 relative overflow-hidden transition-all duration-500 ease-out z-10 ${isHovered ? hoverOverlayClass : ""}`} 
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
                  <p className={`text-[10px] font-mono tracking-widest uppercase opacity-90 transition-all duration-400 ${isHovered ? "opacity-100" : "opacity-90"} ${titleEnClassValue}`}>{item.titleEn}</p>
                  <h3 className={`text-base font-display font-semibold transition-colors duration-400 line-clamp-1 flex items-center gap-1 ${titleClassValue}`}>
                    <span className="truncate">{item.title}</span>
                    <span className={`transition-all duration-400 text-sm font-semibold shrink-0 ${
                      isHovered ? "opacity-100 translate-x-1" : "opacity-0 translate-x-0"
                    }`}>→</span>
                  </h3>
                </div>

                <p 
                  className={`text-xs leading-relaxed font-sans font-light flex-1 line-clamp-3 transition-all duration-400 ease-out ${
                    isHovered ? "translate-y-[-3px]" : "translate-y-0"
                  } ${descriptionClassValue}`}
                >
                  {item.philosophy}
                </p>

                {/* 工具 Tags */}
                <div className={`pt-3.5 border-t flex flex-wrap gap-1.5 transform transition-all duration-400 ease-out ${
                  isHovered ? "translate-y-[-1.2px]" : "translate-y-0"
                } ${dividerClassValue}`}>
                  {item.tools.map((tech) => (
                    <span 
                      key={tech} 
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-medium transition-all duration-300 border ${
                        isSepia
                          ? item.isHighlight
                            ? "bg-[#F3DFBD] text-[#3E250A] border-amber-600/30 hover:border-amber-600/50"
                            : "bg-[#EDE2CA] text-[#433422] border-amber-900/10 hover:border-amber-900/20"
                          : isLight
                          ? item.isHighlight
                            ? "bg-[#FFF2D4] text-[#78350F] border-amber-500/25 hover:border-amber-500/40"
                            : "bg-zinc-100 text-zinc-600 border-zinc-200/80 hover:bg-zinc-200 hover:border-zinc-300 hover:text-zinc-900"
                          : `bg-white/5 text-zinc-300 hover:text-white border-white/5 group-hover:bg-white/[0.08] group-hover:border-${catColor.accent}/30`
                      }`}
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
            className={`absolute inset-0 w-full h-full flex flex-col rounded-2xl overflow-hidden p-5 md:p-6 justify-between transition-[background-color,border-color,color] duration-500 ${themeContainerClass}`}
            style={{
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              transform: "rotateY(180deg) translateZ(1px)",
              zIndex: 5,
            }}
          >
            {/* Ambient Background Glow inside the back face */}
            <div 
              className="absolute inset-0 transition-opacity duration-500 pointer-events-none opacity-20"
              style={{
                background: `radial-gradient(circle at 50% 50%, rgba(${catColor.rgbaGlow}, 0.15) 0%, transparent 80%)`
              }}
            />

            <div className="relative z-10 flex flex-col h-full justify-between space-y-3">
              {/* Header: Category & ID */}
              <div className="flex items-center justify-between">
                <span 
                  className={`px-2.5 py-0.5 text-[9px] font-medium tracking-wide rounded-full border shadow-sm transition-all duration-300 ${
                    isSepia
                      ? "bg-[#FAF4E5] border-[#E2D2B3]"
                      : isLight
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
                <span className={`text-[9px] font-mono tracking-wider ${isSepia ? 'text-[#734C22]/60' : isLight ? 'text-zinc-400' : 'text-zinc-500'}`}>
                  #{item.id}
                </span>
              </div>

              {/* Title Block */}
              <div className="space-y-1">
                <p className={`text-[10px] font-mono tracking-widest uppercase truncate ${titleEnClassValue}`}>
                  {item.titleEn}
                </p>
                <h3 className={`text-sm md:text-base font-display font-semibold leading-snug line-clamp-2 ${titleClassValue}`}>
                  {item.title}
                </h3>
              </div>

              {/* Footer CTA */}
              <div className={`pt-2.5 border-t flex items-center justify-between text-[10px] font-medium ${dividerClassValue}`}>
                <span className={`font-sans tracking-wide ${isSepia ? 'text-[#734C22]/80' : isLight ? 'text-zinc-500' : 'text-zinc-400'}`}>
                  點擊展開專案多媒體
                </span>
                <span className={`px-2 py-1 rounded-lg text-[9px] font-bold tracking-wider text-black bg-gradient-to-r ${catColor.gradientClass || 'from-amber-400 to-amber-500'} flex items-center gap-1 shadow-sm`}>
                  <span>展開</span>
                  <ArrowUpRight className="h-2 w-2 stroke-[2.5]" />
                </span>
              </div>
          </div>
        </div>
      </div>
    )}
    </motion.div>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.item.id === nextProps.item.id &&
    prevProps.priority === nextProps.priority &&
    prevProps.index === nextProps.index &&
    prevProps.prevVisibleCount === nextProps.prevVisibleCount &&
    prevProps.theme === nextProps.theme &&
    prevProps.showAllDetails === nextProps.showAllDetails
  );
});