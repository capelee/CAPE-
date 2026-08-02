import { useTutorial } from '../context/TutorialContext';
import { TutorialTooltip } from './TutorialTooltip';
import React, { useState, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Video, 
  Maximize2, 
  Minimize2, 
  ExternalLink 
} from "lucide-react";
import { PortfolioItem } from "../types";
import { ImageWithFallback } from "./ImageWithFallback";
import { StitchImageObserver } from "./StitchImageObserver";

interface PortfolioDetailModalProps {
  activeModalItem: PortfolioItem | null;
  onClose: () => void;
  filteredItems: PortfolioItem[];
  onPrevItem: () => void;
  onNextItem: () => void;
}

// Extract YouTube ID from robust URLs
function getYouTubeEmbedUrl(url?: string): string | null {
  if (!url) return null;
  // Robust support for YouTube Shorts URLs
  if (url.includes("/shorts/")) {
    const parts = url.split("/shorts/");
    const idPart = parts[1]?.split(/[?&#]/)[0];
    if (idPart && idPart.length === 11) {
      return `https://www.youtube.com/embed/${idPart}?autoplay=1&rel=0&showinfo=0&modestbranding=1`;
    }
  }
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  if (match && match[2].length === 11) {
    return `https://www.youtube.com/embed/${match[2]}?autoplay=1&rel=0&showinfo=0&modestbranding=1`;
  }
  return null;
}

export const PortfolioDetailModal: React.FC<PortfolioDetailModalProps> = ({
  activeModalItem,
  onClose,
  filteredItems,
  onPrevItem,
  onNextItem,
}) => {
  const { tutorialStep, nextTutorialStep } = useTutorial();

  if (!activeModalItem) return null;

  const [activeImageUrl, setActiveImageUrl] = useState<string | null>(null);
  const [isVideoActive, setIsVideoActive] = useState<boolean>(false);
  const [waterfallMode, setWaterfallMode] = useState<"stitch" | "single">(
    activeModalItem && (activeModalItem.category === "網站產品瀑布頁" || activeModalItem.category === "企業LOGO與CIS設計")
      ? "stitch"
      : "single"
  );
  const [isMaximized, setIsMaximized] = useState<boolean>(false);
  const [stitchScrollProgress, setStitchScrollProgress] = useState<number>(0);

  const stitchScrollContainerRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  // Reset states when item changes
  useEffect(() => {
    setActiveImageUrl(null);
    setIsVideoActive(false);
    setWaterfallMode(
      activeModalItem.category === "網站產品瀑布頁" || activeModalItem.category === "企業LOGO與CIS設計"
        ? "stitch"
        : "single"
    );
    setIsMaximized(false);
    setStitchScrollProgress(0);
    if (stitchScrollContainerRef.current) {
      stitchScrollContainerRef.current.scrollTop = 0;
    }
  }, [activeModalItem]);

  // Compute media list for current item
  const modalMediaList = useMemo(() => {
    if (!activeModalItem) return [];
    const list: Array<{ type: "video" | "image"; url: string }> = [];
    if (activeModalItem.videoUrl) {
      list.push({ type: "video", url: activeModalItem.videoUrl });
    }
    if (activeModalItem.images && activeModalItem.images.length > 0) {
      activeModalItem.images.forEach((img) => {
        list.push({ type: "image", url: img });
      });
    } else if (activeModalItem.imageUrl) {
      list.push({ type: "image", url: activeModalItem.imageUrl });
    }
    return list;
  }, [activeModalItem]);

  // Find index of current media
  const currentMediaIndex = useMemo(() => {
    if (modalMediaList.length === 0) return -1;
    if (isVideoActive) {
      return modalMediaList.findIndex((m) => m.type === "video");
    }
    const currentUrl = activeImageUrl || (activeModalItem ? activeModalItem.imageUrl : null);
    return modalMediaList.findIndex((m) => m.type === "image" && m.url === currentUrl);
  }, [modalMediaList, isVideoActive, activeImageUrl, activeModalItem]);

  const handlePrevSlide = () => {
    if (modalMediaList.length <= 1) return;
    const newIndex = (currentMediaIndex - 1 + modalMediaList.length) % modalMediaList.length;
    const target = modalMediaList[newIndex];
    if (target.type === "video") {
      setIsVideoActive(true);
    } else {
      setIsVideoActive(false);
      setActiveImageUrl(target.url);
    }
  };

  const handleNextSlide = () => {
    if (modalMediaList.length <= 1) return;
    const newIndex = (currentMediaIndex + 1) % modalMediaList.length;
    const target = modalMediaList[newIndex];
    if (target.type === "video") {
      setIsVideoActive(true);
    } else {
      setIsVideoActive(false);
      setActiveImageUrl(target.url);
    }
  };

  // Touch Swipe Handlers (supports sliding left/right on mobile detail pages to switch between images or items)
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartX.current = touch.clientX;
    touchStartY.current = touch.clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (tutorialStep === 3) nextTutorialStep();
    if (touchStartX.current === null || touchStartY.current === null) return;
    const touch = e.changedTouches[0];
    const diffX = touch.clientX - touchStartX.current;
    const diffY = touch.clientY - touchStartY.current;

    // Trigger swipe if horizontal movement is dominant and > 50px
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
      if (diffX > 0) {
        // Swipe Right (Go Prev)
        if (waterfallMode !== "stitch") {
          if (modalMediaList.length > 1 && currentMediaIndex > 0) {
            handlePrevSlide();
          } else {
            onPrevItem();
          }
        }
      } else {
        // Swipe Left (Go Next)
        if (waterfallMode !== "stitch") {
          if (modalMediaList.length > 1 && currentMediaIndex < modalMediaList.length - 1) {
            handleNextSlide();
          } else {
            onNextItem();
          }
        }
      }
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeElement = document.activeElement;
      if (
        activeElement &&
        (activeElement.tagName === "INPUT" ||
          activeElement.tagName === "TEXTAREA" ||
          (activeElement as HTMLElement).isContentEditable)
      ) {
        return;
      }

      if (e.key === "Escape" || e.key === "Esc") {
        onClose();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        onPrevItem();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        onNextItem();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose, onPrevItem, onNextItem]);

  // 當彈窗開啟時，對主頁內容 (main) 套用 CSS 濾鏡 backdrop-filter: blur(8px) 與 filter: blur(8px) 進行模糊處理，確保焦點完全鎖定在模態框上
  useEffect(() => {
    if (!activeModalItem) return;

    const mainElement = document.querySelector("main");
    if (mainElement) {
      mainElement.style.transition = "filter 0.3s ease, backdrop-filter 0.3s ease";
      mainElement.style.filter = "blur(8px)";
      (mainElement.style as any).backdropFilter = "blur(8px)";
      (mainElement.style as any).WebkitBackdropFilter = "blur(8px)";
    }

    return () => {
      if (mainElement) {
        mainElement.style.filter = "";
        (mainElement.style as any).backdropFilter = "";
        (mainElement.style as any).WebkitBackdropFilter = "";
      }
    };
  }, [activeModalItem]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-[9999] bg-black/85 backdrop-blur-[8px] flex items-center justify-center p-4 overflow-y-auto"
      style={{
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
      }}
    >
      <motion.div 
        initial={{ scale: 0.95, y: 15 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 15 }}
        transition={{ type: "spring", duration: 0.4 }}
        onClick={(e) => e.stopPropagation()}
        className={`bg-[#0E0E0E] border border-white/10 shadow-2xl relative my-auto transition-all duration-300 z-[10000] ${
          activeModalItem && (activeModalItem.category === "網站產品瀑布頁" || activeModalItem.category === "企業LOGO與CIS設計") && isMaximized
            ? "max-w-full md:max-w-6xl w-full h-[95vh] md:h-[92vh] flex flex-col rounded-2xl"
            : "max-w-4xl w-full rounded-2xl"
        }`}
      >
        
        {/* 關閉按鈕 */}
        <button
          type="button"
          id="btn_modal_close"
          onClick={onClose}
          className="absolute top-4 right-4 z-[35] p-2 rounded-lg bg-black/70 hover:bg-black text-zinc-400 hover:text-white transition-colors border border-white/10 cursor-pointer"
          title="關閉明細"
        >
          <X className="h-5 w-5" />
        </button>

        {/* 上一張 / 下一張左右滑鎖 */}
        {filteredItems.length > 1 && !isMaximized && (
          <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 lg:-left-16 lg:-right-16 xl:-left-20 xl:-right-20 flex justify-between lg:px-0 px-2 pointer-events-none hidden lg:flex">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onPrevItem();
              }}
              className="p-3 rounded-full bg-black/85 hover:bg-black text-zinc-300 hover:text-amber-400 border border-white/10 hover:border-amber-500/30 pointer-events-auto transition active:scale-90 cursor-pointer"
              title="前一個作品"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onNextItem();
              }}
              className="p-3 rounded-full bg-black/85 hover:bg-black text-zinc-300 hover:text-amber-400 border border-white/10 hover:border-amber-500/30 pointer-events-auto transition active:scale-90 cursor-pointer"
              title="下一個作品"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        )}

        <div className={`grid grid-cols-1 md:grid-cols-12 ${isMaximized && (activeModalItem.category === "網站產品瀑布頁" || activeModalItem.category === "企業LOGO與CIS設計") ? "h-full flex-grow overflow-hidden" : ""}`}>
          
          {/* 左側大圖 */}
          <div className={`bg-zinc-950 relative overflow-hidden flex flex-col justify-between border border-white/5 transition-all duration-300 ${
            (activeModalItem.category === "網站產品瀑布頁" || activeModalItem.category === "企業LOGO與CIS設計") && isMaximized 
              ? "col-span-12 md:col-span-12 h-full flex-grow" 
              : "md:col-span-7 h-[330px] sm:h-[450px] md:h-[500px]"
          }`}>
            {tutorialStep === 3 && (
              <TutorialTooltip 
                key="tutorial-step-3"
                step={3}
                text={waterfallMode === "stitch" ? "向下瀏覽或點擊完成步驟" : "點擊圖片或滑動來切換"}
                theme="dark"
                vertical={false}
                onClick={() => { nextTutorialStep(); if (waterfallMode !== "stitch") handleNextSlide(); }}
                pointerDirection="bottom"
                className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[150]"
              />
            )}
            <div 
              ref={stitchScrollContainerRef}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              onScroll={(e) => {
                if ((activeModalItem.category === "網站產品瀑布頁" || activeModalItem.category === "企業LOGO與CIS設計") && waterfallMode === "stitch") {
                  const target = e.currentTarget;
                  const totalScroll = target.scrollHeight - target.clientHeight;
                  if (totalScroll > 0) {
                    setStitchScrollProgress((target.scrollTop / totalScroll) * 100);
                  } else {
                    setStitchScrollProgress(0);
                  }
                }
              }}
              className={`relative w-full flex-grow bg-black/40 min-h-[200px] md:min-h-[280px] ${
                (activeModalItem.category === "網站產品瀑布頁" || activeModalItem.category === "企業LOGO與CIS設計") && waterfallMode === "stitch" 
                  ? `overflow-y-auto block ${isMaximized ? "h-[calc(95vh-140px)] md:h-[calc(92vh-100px)]" : "h-[500px]"} waterfall-scrollbar` 
                  : `overflow-hidden flex items-center justify-center ${(activeModalItem.category === "網站產品瀑布頁" || activeModalItem.category === "企業LOGO與CIS設計") && isMaximized ? "h-[calc(95vh-140px)] md:h-[calc(92vh-100px)]" : "md:h-[500px]"}`
              }`}
            >
              {(activeModalItem.category === "網站產品瀑布頁" || activeModalItem.category === "企業LOGO與CIS設計") && waterfallMode === "stitch" ? (
                <div className="w-full flex flex-col select-none bg-[#050505]">
                  {/* 頂部操作列 / 提示 */}
                  <div className="sticky top-0 z-20 bg-black/90 backdrop-blur-md px-4 py-2.5 border-b border-white/10 flex items-center justify-between text-[11.5px] font-sans text-zinc-400">
                    <div></div>
                    
                    {/* 右側：回到頂端按鈕 */}
                    {stitchScrollProgress > 8 && (
                      <button
                        type="button"
                        onClick={() => {
                          stitchScrollContainerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        className="flex items-center gap-1 px-2 py-0.5 rounded bg-amber-500/10 hover:bg-amber-500 text-amber-400 hover:text-black border border-amber-500/25 hover:border-amber-400 text-[10px] font-medium tracking-wide transition-all duration-200 cursor-pointer active:scale-95"
                        title="回到頂端"
                      >
                        <span>回到頂端 ↑</span>
                      </button>
                    )}
                    
                    {/* 滾動進度條 (Scroll Progress Indicator) */}
                    <div 
                      className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-amber-500 to-amber-400 transition-all duration-75 shadow-[0_1px_4px_rgba(245,158,11,0.4)]" 
                      style={{ width: `${stitchScrollProgress}%` }}
                    ></div>
                  </div>
                  
                  {/* 拼裝大圖 */}
                  <div className="flex flex-col gap-0 w-full overflow-hidden bg-[#050505]">
                    {activeModalItem.images && activeModalItem.images.map((imgUrl, idx) => (
                      <div key={idx} className="w-full block bg-[#050505] p-0 m-0 border-0 leading-[0]">
                        <StitchImageObserver 
                          src={imgUrl}
                          alt={`${activeModalItem.title} - 拼接第 ${idx + 1} 節`}
                          fallbackTheme={activeModalItem.colorTheme}
                          categoryName={activeModalItem.category}
                          titleText={activeModalItem.title}
                          idx={idx}
                          optimizeSize={800}
                        />
                      </div>
                    ))}
                  </div>
                  
                  <div className="py-8 text-center text-[10px] font-mono tracking-wider text-zinc-500 border-t border-white/5 bg-black/50 uppercase">
                    • END OF WATERFALL DETAIL PAGE •
                  </div>
                </div>
              ) : (
                <>
                  {isVideoActive && getYouTubeEmbedUrl(activeModalItem.videoUrl) ? (
                    <div className="absolute inset-0 z-10 w-full h-full bg-[#050505] flex items-center justify-center">
                      <iframe
                        src={getYouTubeEmbedUrl(activeModalItem.videoUrl)!}
                        title={activeModalItem.title}
                        className="w-full h-full border-0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                      ></iframe>
                    </div>
                  ) : (
                    <>
                      

                      <ImageWithFallback 
                        src={activeImageUrl || activeModalItem.imageUrl || (activeModalItem.images && activeModalItem.images.length > 0 ? activeModalItem.images[0] : '')}
                        alt={activeModalItem.title}
                        referrerPolicy="no-referrer"
                        fallbackTheme={activeModalItem.colorTheme}
                        categoryName={activeModalItem.category}
                        titleText={activeModalItem.title}
                        optimizeSize={1200}
                        className="w-full h-full object-contain transition-all duration-300"
                        zoomable={true}
                      />
                      {activeModalItem.videoUrl && !((activeModalItem.videoUrl ? 1 : 0) + (activeModalItem.images?.length || 0) > 1) && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30 bg-opacity-40">
                          <button
                            type="button"
                            onClick={() => setIsVideoActive(true)}
                            className="p-5 rounded-full bg-amber-500 hover:bg-amber-400 text-black hover:scale-110 active:scale-95 transition-all shadow-xl shadow-amber-500/20 cursor-pointer flex items-center justify-center gap-2 group"
                            title="播放產品宣傳影片"
                          >
                            <Video className="h-6 w-6 fill-black/10 text-black" />
                            <span className="text-xs font-semibold uppercase tracking-wider pr-1">播放宣傳影片</span>
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </>
              )}
              
              {waterfallMode !== "stitch" && (
                <div className="absolute inset-0 bg-gradient-to-t from-[#0E0E0E] via-transparent to-transparent pointer-events-none"></div>
              )}

              {/* 左右切換媒體 (含影片與細節照片) */}
              {waterfallMode !== "stitch" && modalMediaList.length > 1 && (
                <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none z-20">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePrevSlide();
                    }}
                    className="p-2 rounded-full bg-black/70 hover:bg-black/90 text-zinc-300 hover:text-white border border-white/10 shadow-lg pointer-events-auto transition active:scale-90 cursor-pointer"
                    title="上一個媒體內容"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNextSlide();
                    }}
                    className="p-2 rounded-full bg-black/70 hover:bg-black/90 text-zinc-300 hover:text-white border border-white/10 shadow-lg pointer-events-auto transition active:scale-90 cursor-pointer"
                    title="下一個媒體內容"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              )}
              
              {/* 分類浮水印標籤 */}
              {waterfallMode !== "stitch" && (
                <div className="absolute bottom-4 left-4 z-10">
                  <span className="px-3 py-1 text-xs font-semibold tracking-wide text-amber-400 bg-black/80 backdrop-blur-md rounded-md border border-amber-500/20 shadow-md">
                    {activeModalItem.category}
                  </span>
                </div>
              )}
            </div>

            {/* Thumbnail gallery selector */}
            {(activeModalItem.category === "網站產品瀑布頁" || activeModalItem.category === "企業LOGO與CIS設計") && waterfallMode === "stitch" ? (
              <div className="relative z-10 w-full bg-[#090909] px-4 py-3 border-t border-white/10 shrink-0 select-none">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div className="space-y-0.5">
                    {isMaximized && (
                      <span className="bg-amber-400/20 text-amber-400 text-[9px] px-1.5 py-0.5 rounded font-mono font-bold tracking-wider border border-amber-400/30">
                        FULL SCREEN READ MODE
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <button
                      type="button"
                      onClick={() => setIsMaximized(!isMaximized)}
                      className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-black rounded-lg text-xs font-bold tracking-wide flex items-center gap-1.5 transition active:scale-95 duration-200 shadow-md cursor-pointer shrink-0"
                    >
                      {isMaximized ? (
                        <>
                          <Minimize2 className="h-3.5 w-3.5 animate-pulse" />
                          <span>還原正常視窗</span>
                        </>
                      ) : (
                        <>
                          <Maximize2 className="h-3.5 w-3.5" />
                          <span>全螢幕沉浸閱讀</span>
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => setWaterfallMode("single")}
                      className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white hover:text-amber-400 rounded-lg border border-white/10 text-xs font-semibold transition cursor-pointer shrink-0"
                    >
                      切換單頁 🖼️
                    </button>
                  </div>
                </div>
              </div>
            ) : ((activeModalItem.videoUrl ? 1 : 0) + (activeModalItem.images?.length || 0) > 1) ? (
              <div id="modal-multimedia-menu" className="relative z-10 w-full bg-[#0E0E0E] px-4 py-3 border-t border-white/10 shrink-0">
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                  
                  {/* 影片專屬切換小圖 */}
                  {activeModalItem.videoUrl && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsVideoActive(true);
                      }}
                      className={`relative h-12 w-12 rounded-md overflow-hidden shrink-0 border-2 transition-all cursor-pointer flex flex-col items-center justify-center bg-[#07090c] border-dashed ${
                        isVideoActive
                          ? "border-amber-400 scale-[1.05] shadow-md shadow-amber-500/10"
                          : "border-zinc-800 hover:border-zinc-500 opacity-60 hover:opacity-100"
                      }`}
                      title="播放影片"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-red-500/5 flex flex-col items-center justify-center">
                        <Video className="h-5 w-5 text-amber-400" />
                        <span className="text-[7px] text-zinc-400 mt-0.5 tracking-wider font-mono font-bold">PLAY</span>
                      </div>
                      <span className="absolute bottom-0 inset-x-0 bg-amber-500 text-black text-[7px] font-bold text-center py-0.5 uppercase">影片</span>
                    </button>
                  )}

                  {activeModalItem.images && activeModalItem.images.map((imgUrl, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setIsVideoActive(false);
                        setActiveImageUrl(imgUrl);
                      }}
                      className={`relative h-12 w-12 rounded-md overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                        (!isVideoActive && (activeImageUrl || activeModalItem.imageUrl) === imgUrl)
                          ? "border-amber-400 scale-[1.05] shadow-md shadow-amber-500/10"
                          : "border-transparent hover:border-zinc-500 opacity-60 hover:opacity-100"
                      }`}
                    >
                      <ImageWithFallback
                        src={imgUrl}
                        alt={`${activeModalItem.title} - ${idx + 1}`}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                        optimizeSize={120}
                      />
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          {/* 右側資訊 */}
          {!((activeModalItem.category === "網站產品瀑布頁" || activeModalItem.category === "企業LOGO與CIS設計") && isMaximized) && (
            <div className="md:col-span-5 p-6 lg:p-8 flex flex-col md:h-[500px] border-t md:border-t-0 md:border-l border-white/5">
              
              {/* 標題 (靜態不滾動) */}
              <div className="space-y-1 pb-4 shrink-0">
                <p className="text-[10px] font-mono tracking-widest text-amber-500 font-semibold uppercase">{activeModalItem.titleEn}</p>
                <h3 className="text-xl lg:text-2xl font-display font-medium text-white tracking-tight">
                  {activeModalItem.title}
                </h3>
              </div>

              {/* 可滾動主體 (包含設計理念與工具) */}
              <div className="flex-1 overflow-y-auto pr-1 py-1 space-y-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent min-h-0">
                {/* 設計思考核心觀點 */}
                <div className="space-y-2">
                  <p className="text-[11px] font-mono text-zinc-500 uppercase tracking-widest">Design Philosophy / 設計理念</p>
                  <p className="text-zinc-300 text-xs leading-relaxed font-light font-sans">
                    {activeModalItem.philosophy}
                  </p>
                </div>

                {/* 使用工具與技術疊量 */}
                <div className="space-y-2 pt-1">
                  <p className="text-[11px] font-mono text-zinc-500 uppercase tracking-widest">Technologies & Tools</p>
                  <div className="flex flex-wrap gap-1.5">
                    {activeModalItem.tools.map((tech) => (
                      <span key={tech} className="px-2.5 py-1 rounded text-[11px] font-mono bg-white/5 text-zinc-300 border border-white/5">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* 底部行動 (靜態不滾動) */}
              <div className="pt-4 mt-4 border-t border-white/5 flex items-center justify-end gap-3 shrink-0">
                <div className="flex items-center gap-2">
                  {activeModalItem.link && (
                    <a
                      href={activeModalItem.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-1.5 text-xs font-semibold text-black bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 rounded-lg transition duration-200 flex items-center gap-1 cursor-pointer"
                    >
                      <span>前往作品</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-1.5 text-xs font-medium text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition border border-white/5 cursor-pointer"
                  >
                    關閉回列表
                  </button>
                </div>
              </div>

            </div>
          )}

        </div>
        
        {/* 手機版前後控制項 */}
        {!isMaximized && (
          <div className="flex justify-between items-center bg-zinc-950 p-3 lg:hidden border-t border-white/5">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onPrevItem();
              }}
              className="flex items-center gap-1 text-xs text-zinc-400 hover:text-white px-3 py-1 cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>上一件</span>
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onNextItem();
              }}
              className="flex items-center gap-1 text-xs text-zinc-400 hover:text-white px-3 py-1 cursor-pointer"
            >
              <span>下一件</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}

      </motion.div>
    </motion.div>
  );
};
