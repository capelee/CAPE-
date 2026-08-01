import { useTutorial } from './context/TutorialContext';
import { TutorialTooltip } from './components/TutorialTooltip';
import { ScrambleText } from './components/ScrambleText';
import React, { useState, useMemo } from "react";
import { createPortal } from "react-dom";
import { 
  Plus, 
  Tag, 
  Layers, 
  ExternalLink, 
  X,
  User,
  Mail,
  Briefcase,
  GraduationCap,
  Award,
  Zap,
  Clock,
  Palette,
  BookOpen,
  Globe,
  Printer,
  Camera,
  Heart,
  Crown,
  Share2,
  Video,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Copy,
  Check,
  CheckCircle2,
  Sparkles,
  ArrowUpRight, MousePointerClick,
  ShieldAlert,
  ZoomIn,
  ZoomOut,
  Sun,
  Moon,
  Eye,
  Monitor,
  Instagram,
  ArrowUp,
  Maximize2,
  Minimize2,
  Search,
  Image as ImageIcon,
  QrCode,
  Download,
  SlidersHorizontal,
  FileText, RotateCcw
} from "lucide-react";
import { motion, AnimatePresence, useDragControls, useMotionValue, useSpring, animate, useScroll, useTransform } from "motion/react";
import { PortfolioItem, MascotCharacter } from "./types";
import { HeroSection, HeroSectionRef } from './components/Hero';
import { categoryMascotMap } from "./utils/mascotData";
import { FLAVOR_PHYSICS } from "./utils/flavorPhysics";
import { EXISTING_OPTIMIZED_IMAGES } from "./existingImages";

import { YT_THUMBNAIL_CACHE, DRIVE_THUMBNAIL_CACHE, saveYtCacheToStorage, saveDriveCacheToStorage, extractYoutubeId, extractDriveId, getOptimizedGoogleUrl, resolveImageUrl, sanitizePortfolioItem } from "./utils";
import { animaleseSynth } from "./utils/animalese";
import { playMeowSound, playCanClinkSound, catPurr, audioContextManager, playCardFlipSound, playPawPopSound, playRareClickSound } from "./utils/audioEffects";

import { categoryColors, getCategoryColor, defaultCategoryColor } from './categoryColors';

interface CategoryButtonProps {
  cat: string;
  isActive: boolean;
  onClick: () => void;
  key?: React.Key;
  theme: "dark" | "light" | "sepia";
}

function CategoryButton({ cat, isActive, onClick, theme }: CategoryButtonProps) {
  const [isHovered, setIsHovered] = React.useState(false);
  const catColor = getCategoryColor(cat);
  
  const isDark = theme === "dark";
  const isSepia = theme === "sepia";
  const isLight = theme === "light";

  return (
    <button
      type="button"
      id={`cat_filter_btn_${cat}`}
      data-cat={cat}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="px-2.5 sm:px-4.5 py-1.5 sm:py-2 text-[11px] sm:text-xs font-medium rounded-full border transition-all duration-300 font-sans cursor-pointer relative overflow-hidden flex items-center justify-center whitespace-nowrap shrink-0"
      style={{
        backgroundColor: isActive 
          ? `rgba(${catColor.rgbaGlow}, ${isSepia ? 0.8 : isLight ? 0.9 : 1})` 
          : isHovered 
            ? `rgba(${catColor.rgbaGlow}, ${isSepia ? 0.15 : isLight ? 0.12 : 0.1})` 
            : isSepia 
              ? "rgba(67, 52, 34, 0.04)" 
              : isLight 
                ? "rgba(0, 0, 0, 0.03)" 
                : "rgba(255, 255, 255, 0.02)",
        borderColor: isActive 
          ? `rgba(${catColor.rgbaGlow}, ${isSepia ? 0.6 : isLight ? 0.7 : 0.8})` 
          : isHovered 
            ? `rgba(${catColor.rgbaGlow}, ${isSepia ? 0.4 : isLight ? 0.35 : 0.35})` 
            : isSepia 
              ? "rgba(67, 52, 34, 0.1)" 
              : isLight 
                ? "rgba(0, 0, 0, 0.08)" 
                : "rgba(255, 255, 255, 0.05)",
        color: isActive 
          ? (isSepia ? "#2B1B0C" : isLight ? "#ffffff" : "#000000") 
          : isHovered 
            ? (isSepia ? "#433422" : isLight ? "#18181B" : "#ffffff") 
            : (isSepia ? "#8C7B69" : isLight ? "#52525B" : "#a1a1aa"),
        boxShadow: isActive 
          ? `0 10px 20px -5px rgba(${catColor.rgbaGlow}, ${isSepia ? 0.25 : isLight ? 0.3 : 0.4}), 0 0 15px 1px rgba(${catColor.rgbaGlow}, ${isSepia ? 0.1 : isLight ? 0.15 : 0.15})` 
          : isHovered 
            ? `0 4px 12px -2px rgba(${catColor.rgbaGlow}, ${isSepia ? 0.1 : isLight ? 0.1 : 0.15})` 
            : "none"
      }}
    >
      <span className="relative z-10">
        {cat === "All" ? "全部精選展示" : cat}
      </span>
    </button>
  );
}



import { ImageWithFallback } from "./components/ImageWithFallback";
import { StitchImageObserver } from "./components/StitchImageObserver";

import { InteractiveMascot } from "./components/InteractiveMascot";



import { PortfolioCard } from "./components/PortfolioCard";
import { MinimalistLogo } from "./components/MinimalistLogo";
import { DesignerBento } from "./components/DesignerBento";
const AIWorkflowModal = React.lazy(() => import("./components/AIWorkflowModal").then(module => ({ default: module.AIWorkflowModal })));
const ContactModal = React.lazy(() => import("./components/ContactModal").then(module => ({ default: module.ContactModal })));
const PortfolioDetailModal = React.lazy(() => import("./components/PortfolioDetailModal").then(module => ({ default: module.PortfolioDetailModal })));
const CatFortuneTeller = React.lazy(() => import("./components/CatFortuneTeller").then(module => ({ default: module.CatFortuneTeller })));
import { CatFootprintsLayer } from "./components/CatFootprintsLayer";
import { MumuCertModal, MumuCertModalRef } from "./components/MumuCertModal";

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

function extractDriveIdsFromHtml(html: string, folderId: string): string[] {
  if (!html) return [];

  // Unescape standard HTML characters in Google Drive's embedded JSON payload
  const cleanHtml = html
    .replace(/\\x22/g, '"')
    .replace(/\\x27/g, "'")
    .replace(/\\x5b/g, '[')
    .replace(/\\x5d/g, ']')
    .replace(/\\x2c/g, ',');

  // Find file arrays of the shape: ["FILE_ID", ["FOLDER_ID"], "FILENAME", "MIME_TYPE"
  const fileArrayRegex = /"([a-zA-Z0-9_-]{28,45})"\s*,\s*\[\s*"([a-zA-Z0-9_-]{28,45})"\s*\]\s*,\s*"([^"]+)"\s*,\s*"([^"]+)"/g;
  const results: Array<{ id: string; name: string }> = [];
  const seenIds = new Set<string>();

  let match;
  while ((match = fileArrayRegex.exec(cleanHtml)) !== null) {
    const [_, fileId, parentFolderId, fileName] = match;
    if (parentFolderId === folderId && !seenIds.has(fileId)) {
      seenIds.add(fileId);
      results.push({ id: fileId, name: fileName });
    }
  }

  // Fallback 1: Match single-quoted JSON format if double-quoted didn't find anything
  if (results.length === 0) {
    const singleQuoteRegex = /'([a-zA-Z0-9_-]{28,45})'\s*,\s*\[\s*'([a-zA-Z0-9_-]{28,45})'\s*\]\s*,\s*'([^']+)'\s*,\s*'([^']+)'/g;
    let matchSingle;
    while ((matchSingle = singleQuoteRegex.exec(cleanHtml)) !== null) {
      const [_, fileId, parentFolderId, fileName] = matchSingle;
      if (parentFolderId === folderId && !seenIds.has(fileId)) {
        seenIds.add(fileId);
        results.push({ id: fileId, name: fileName });
      }
    }
  }

  // Fallback 2: Legacy fallback matching /file/d/ links
  if (results.length === 0) {
    const fileIdRegex = /\/file\/d\/([a-zA-Z0-9_-]{28,45})/g;
    let matchLegacy;
    while ((matchLegacy = fileIdRegex.exec(cleanHtml)) !== null) {
      const fileId = matchLegacy[1];
      if (fileId && !seenIds.has(fileId)) {
        if (fileId !== folderId && fileId.length >= 28) {
          seenIds.add(fileId);
          results.push({ id: fileId, name: `file_${fileId}` });
        }
      }
    }
  }

  // Sort results by filename numerically so slides are rendered in order
  results.sort((a, b) => {
    return a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' });
  });

  return results.map(r => `https://drive.google.com/thumbnail?sz=w1000&id=${r.id}`);
}

async function fetchFolderImages(folderId: string): Promise<string[]> {
  const targetUrl = `https://drive.google.com/drive/folders/${folderId}`;
  
  // Try Proxy 1: AllOrigins
  try {
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(targetUrl)}`;
    const response = await fetch(proxyUrl);
    if (response.ok) {
      const data = await response.json();
      const html = data.contents;
      if (html) {
        const images = extractDriveIdsFromHtml(html, folderId);
        if (images.length > 0) return images;
      }
    }
  } catch (err) {
    console.warn("AllOrigins proxy error, attempting fallback...", err);
  }

  // Try Proxy 2: CorsProxy.io
  try {
    const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(targetUrl)}`;
    const response = await fetch(proxyUrl);
    if (response.ok) {
      const html = await response.text();
      if (html) {
        const images = extractDriveIdsFromHtml(html, folderId);
        if (images.length > 0) return images;
      }
    }
  } catch (err) {
    console.warn("CorsProxy backup error:", err);
  }

  return [];
}

// 『叮！』魔法施法聲效 (Magic Ding Casting Sound)
const playMagicDingSound = () => {
  try {
    const ctx = audioContextManager.getOrCreateContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    // A beautiful, warm, and gentle bell/chime chord with soft attack and lingering decay
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const osc3 = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc1.type = "sine";
    osc1.frequency.setValueAtTime(659.25, now); // E5 note
    osc1.frequency.exponentialRampToValueAtTime(523.25, now + 0.8); // gentle slide down to C5

    osc2.type = "sine";
    osc2.frequency.setValueAtTime(783.99, now); // G5 note
    osc2.frequency.exponentialRampToValueAtTime(659.25, now + 0.6); // gentle slide down to E5

    osc3.type = "sine"; // Change triangle to sine to avoid piercing odd harmonics
    osc3.frequency.setValueAtTime(987.77, now); // B5 note
    osc3.frequency.exponentialRampToValueAtTime(783.99, now + 0.7); // gentle slide down to G5

    gainNode.gain.setValueAtTime(0.001, now);
    gainNode.gain.linearRampToValueAtTime(0.07, now + 0.08); // softer, slightly slower attack (80ms instead of 50ms)
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 1.2); // smooth lingering decay

    osc1.connect(gainNode);
    osc2.connect(gainNode);
    osc3.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc3.start(now);
    osc1.stop(now + 1.3);
    osc2.stop(now + 1.3);
    osc3.stop(now + 1.3);
  } catch (e) {
    // Safety fallback
  }
};

const HighlightItem: React.FC<{ highlight: any, index: number, theme: string }> = ({ highlight, index, theme }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const cardRef = React.useRef<HTMLDivElement>(null);
  const hasDemonstrated = React.useRef(false);
  const timeoutsRef = React.useRef<{ toBack?: NodeJS.Timeout; toFront?: NodeJS.Timeout }>({});

  React.useEffect(() => {
    let activeScrollListener: (() => void) | null = null;

    const triggerFlipDemo = () => {
      hasDemonstrated.current = true;
      // 滾動感應：波浪式依序翻轉示範 (Staggered auto-flip demo)
      timeoutsRef.current.toBack = setTimeout(() => {
        setIsFlipped(true);
        
        // 翻轉展示 1.4 秒後，平滑翻回正面
        timeoutsRef.current.toFront = setTimeout(() => {
          setIsFlipped(false);
        }, 1400);
      }, index * 220 + 350); // 精緻的間隔延遲，展現律動感
    };

    const observerOptions = {
      root: null,
      // 縮減觀測區域，上下各扣除 35% 的視窗高度，使卡片必須滾動到畫面接近中央的黃金區域（中段 30%）時才啟動自動示範
      rootMargin: "-35% 0px -35% 0px",
      threshold: 0.05,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !hasDemonstrated.current) {
          if (window.scrollY > 40) {
            // 已向下滾動，且當前卡片進入畫面中央，立即觸發翻轉展示
            triggerFlipDemo();
          } else {
            // 如果還在網頁最頂部（scrollY <= 40），為防止一進網站就翻轉，
            // 我們註冊監聽，等使用者確實往下滾動超過 40px 後才開始觸發示範
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

    // 延遲 800 毫秒後啟動監聽，確保頁面佈局載入完成
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

  // 草稿紙粒子介面定義
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

  const [particles, setParticles] = useState<DraftParticle[]>([]);
  const lastSpawnRef = React.useRef({ x: 0, y: 0 });
  const particleIdRef = React.useRef(0);

  const spawnParticle = (x: number, y: number) => {
    const types: ("grid" | "sketch" | "text" | "blueprint")[] = ["grid", "sketch", "text", "blueprint"];
    const randomType = types[Math.floor(Math.random() * types.length)];
    
    const texts = ["SKETCH", "CONCEPT", "GRID", "1.618", "DRAFT", "GUIDE", "LAYOUT", "DESIGN"];
    const randomText = texts[Math.floor(Math.random() * texts.length)];

    const width = Math.floor(Math.random() * 20) + 38; // 38px to 58px
    const height = Math.floor(Math.random() * 12) + 26; // 26px to 38px

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

  // 配合拖拽位移 (或是風吹引起的 dragX/Y 位移) 產生實體感十足的 3D 慣性傾斜
  // 上下拖拽對應 X 軸轉角，左右拖拽對應 Y 軸與微幅 Z 軸旋轉
  const rotateX = useTransform(dragY, [-140, 140], [15, -15]);
  const rotateY = useTransform(dragX, [-140, 140], [-15, 15]);
  const rotateZ = useTransform(dragX, [-140, 140], [-6, 6]);

  const [windOffset, setWindOffset] = useState({ scale: 1, opacity: 1 });
  const globalLastFlipRef = React.useRef<{ time: number; count: number }>({ time: 0, count: 0 });

  React.useEffect(() => {
    const handleGlobalFlip = (e: Event) => {
      const customEvent = e as CustomEvent<{ clickedIndex: number; timestamp: number }>;
      const { clickedIndex, timestamp } = customEvent.detail;

      // 如果是自己被翻轉，就完全不套用「被吹走」效果，維持在原本的軸心進行旋轉
      if (clickedIndex === index) {
        animate(dragX, 0, { type: "spring", stiffness: 220, damping: 14 });
        animate(dragY, 0, { type: "spring", stiffness: 220, damping: 14 });
        setWindOffset({ scale: 1, opacity: 1 });
        return;
      }

      // 計算連續快速點擊頻率 (Streak counter)
      const prevTime = globalLastFlipRef.current.time;
      let count = globalLastFlipRef.current.count;
      
      if (timestamp - prevTime < 450) {
        count = Math.min(count + 1, 8); // 最高疊加 8 層風力，避免卡片飛出螢幕
        if (count >= 6) {
          window.dispatchEvent(new CustomEvent("trigger-wind-storm-ach"));
        }
      } else {
        count = 1; // 超過時間未點擊則重置風力
      }
      globalLastFlipRef.current = { time: timestamp, count };

      // 根據 clickedIndex 與目前 card index 的相對位置計算吹動方向與強度 (Physics-based direction & distance factor)
      const diff = index - clickedIndex;
      const direction = diff > 0 ? 1 : -1;
      const distanceFactor = 1 / Math.sqrt(Math.abs(diff)); // 鄰近卡片承受更大的風浪傳導

      // 計算實體偏移數值 (橫向偏移、向上升流)
      const xOffset = direction * (18 + count * 9) * distanceFactor;
      const yOffset = - (10 + count * 6) * distanceFactor;
      const scaleOffset = Math.max(0.85, 1 - (count * 0.02) * distanceFactor);
      const opacityOffset = Math.max(0.65, 1 - (count * 0.045) * distanceFactor);

      // 直接硬體加速驅動 dragX 與 dragY 的 MotionValue
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

      // 經過 320ms 後，更迅速且有彈性地飄回原位
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
    // 凡是使用者主動點擊，即刻清除自動定時器，避免干擾使用者的閱讀體驗
    if (timeoutsRef.current.toBack) clearTimeout(timeoutsRef.current.toBack);
    if (timeoutsRef.current.toFront) clearTimeout(timeoutsRef.current.toFront);
    setIsFlipped(prev => !prev);

    // 發送翻轉事件，觸發其他卡片被風吹走的連鎖反應 (Propagate custom wind event)
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
              x: p.x + (Math.random() * 120 - 60) + 160, // 隨機向右上方吹去
              y: p.y - 180 - Math.random() * 120,       // 向上漂移
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
                // 動畫結束後移除，釋放記憶體
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
            {/* 斑駁的手繪草稿感：對角線裝飾線或撕扯感邊緣 */}
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
        onDrag={(event, info) => {
          const x = dragX.get();
          const y = dragY.get();
          const last = lastSpawnRef.current;
          const dist = Math.hypot(x - last.x, y - last.y);
          if (dist > 10) { // 當拖動位移超過 10px 時，生成一片新草稿紙
            spawnParticle(x, y);
            lastSpawnRef.current = { x, y };
          }
        }}
        onDragEnd={(event, info) => {
          // 當拖拽釋放時，所有累積的草稿紙碎片隨風飄散、漸隱消失
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
                {/* Subtle Outer Glow */}
                <div className={`absolute inset-0 rounded-[1rem] blur-xl opacity-40 group-hover:opacity-80 transition-opacity duration-500 ${highlight.color.replace('text-', 'bg-')}`} />
                
                {/* Glass/Metallic Box */}
                <div className={`relative p-3 rounded-[1rem] flex items-center justify-center overflow-hidden border ${
                  theme === "sepia" 
                    ? "bg-gradient-to-br from-[#FCF8EE] to-[#F3E8D0] border-[#E8DCC0] shadow-[0_2px_10px_rgba(200,160,100,0.15),inset_0_1px_0_rgba(255,255,255,0.9)]" 
                    : theme === "light" 
                    ? "bg-gradient-to-br from-white to-zinc-50/80 border-zinc-200/80 shadow-[0_2px_10px_rgba(0,0,0,0.05),inset_0_1px_0_rgba(255,255,255,1)]" 
                    : "bg-gradient-to-br from-zinc-800 to-zinc-900 border-zinc-700/80 shadow-[0_4px_15px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.1)]"
                }`}>
                  {/* Color tint layer */}
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
            {/* Decorative Background Icon */}
            <highlight.Icon 
              strokeWidth={1}
              className={`absolute -right-6 -bottom-6 w-32 h-32 rotate-12 transition-all duration-700 group-hover:scale-110 group-hover:-rotate-6 ${
                theme === "sepia" ? "text-[#8A5A32] opacity-[0.08]" 
                : theme === "light" ? "text-zinc-500 opacity-[0.06]" 
                : "text-white opacity-[0.05]"
              }`} 
            />
  
            {/* Accent Indicator */}
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

export default function App() {
  const [mounted, setMounted] = useState<boolean>(false);
  const { scrollY } = useScroll();
  
  // 使用 useSpring 對原始滾動值進行平滑插值，徹底消除滑鼠滾輪一格一格的頓挫感，使 Parallax 動畫如絲般順滑
  const smoothScrollY = useSpring(scrollY, {
    stiffness: 85,    // 優雅的物理剛度，帶來流暢的跟隨感
    damping: 26,      // 高阻尼防抖，保證不產生多餘的物理回彈
    mass: 0.5,        // 較輕的質量使滾動反應極速且流滑
    restDelta: 0.01
  });
  
  // Parallax transform values (基於平滑後的 smoothScrollY)
  const mascotY = useTransform(smoothScrollY, [0, 800], [0, 80]);
  const glowY = useTransform(smoothScrollY, [0, 800], [0, 160]);
  const elementsY = useTransform(smoothScrollY, [0, 800], [0, -100]);
  const elementsY2 = useTransform(smoothScrollY, [0, 800], [0, -150]);
  const rotateElement1 = useTransform(smoothScrollY, [0, 800], [0, 90]);
  const rotateElement2 = useTransform(smoothScrollY, [0, 800], [0, -90]);

  const [items, setItems] = useState<PortfolioItem[]>([]);
  const initialDataRef = React.useRef<PortfolioItem[]>([]);
  
  React.useEffect(() => {
    setMounted(true);
    return () => {
      audioContextManager.destroy();
    };
  }, []);
  
  // Synchronized scrolling properties to prevent redundant state triggering on low-end processors or high-speed networks
  const scrollTrackerRef = React.useRef({
    isScrolled: false,
    showScrollTop: false,
    showHeader: true,
    isMascotVisible: false,
  });
  
  React.useEffect(() => {
    // Helper to fetch folder images for Google Drive integration
    const setupFolderImages = (portfolioItems: PortfolioItem[]) => {
      portfolioItems.forEach(item => {
        if (item.driveFolderId && (!item.images || item.images.length === 0)) {
          fetchFolderImages(item.driveFolderId).then(images => {
            if (images && images.length > 0) {
              const currentImagesCount = item.images ? item.images.length : 0;
              if (images.length > currentImagesCount) {
                const updateItem = (prevList: PortfolioItem[]) =>
                  prevList.map(p => {
                    if (p.id === item.id) {
                      return {
                        ...p,
                        imageUrl: images[0],
                        images: images
                      };
                    }
                    return p;
                  });
                setItems(prev => updateItem(prev));
                initialDataRef.current = updateItem(initialDataRef.current);
              }
            }
          }).catch(() => {
            // Silently catch fetch failures to prevent unhandled rejections
          });
        }
      });
    };

    const loadLocalData = () => {
      import("./data").then(module => {
        const sanitized = module.initialPortfolioData.map(sanitizePortfolioItem);
        initialDataRef.current = sanitized;
        setItems(sanitized);
        setupFolderImages(sanitized);
      });
    };

    // Try live API first to support direct hot updates without static module cache issues
    fetch(`/api/portfolio?t=${Date.now()}`)
      .then(res => {
        if (res.ok) return res.json();
        throw new Error("API not ready");
      })
      .then(res => {
        if (res.success && res.data && res.data.length > 0) {
          const sanitized = res.data.map(sanitizePortfolioItem);
          initialDataRef.current = sanitized;
          setItems(sanitized);
          setupFolderImages(sanitized);
        } else {
          loadLocalData();
        }
      })
      .catch(() => {
        loadLocalData();
      });
  }, []);

  // Theme preference: "dark" | "light" | "sepia" | "system"
  // 預設為 "system" (依照系統設定)，若無儲存之設定，則進入 system 判斷流程
  const [themePreference, setThemePreference] = useState<"dark" | "light" | "sepia" | "system">(() => {
    try {
      const saved = localStorage.getItem("capelee_theme");
      if (saved === "light" || saved === "dark" || saved === "sepia" || saved === "system") {
        return saved;
      }
      return "system";
    } catch {
      return "system";
    }
  });

  // 系統顏色模式偵測：若無系統預設 (或不支援) 則指定白色顏色模式 ("light")
  const [systemTheme, setSystemTheme] = useState<"dark" | "light">(() => {
    if (typeof window !== "undefined" && window.matchMedia) {
      const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const isLight = window.matchMedia("(prefers-color-scheme: light)").matches;
      if (isDark) return "dark";
      if (isLight) return "light";
      return "light"; // 無系統預設則指定白色顏色模式
    }
    return "light";
  });

  React.useEffect(() => {
    if (typeof window !== "undefined" && window.matchMedia) {
      const mediaQueryDark = window.matchMedia("(prefers-color-scheme: dark)");
      const mediaQueryLight = window.matchMedia("(prefers-color-scheme: light)");
      
      const updateTheme = () => {
        if (mediaQueryDark.matches) {
          setSystemTheme("dark");
        } else if (mediaQueryLight.matches) {
          setSystemTheme("light");
        } else {
          setSystemTheme("light"); // 無系統預設則指定白色顏色模式
        }
      };

      updateTheme();

      // 監聽系統顏色變更
      if (mediaQueryDark.addEventListener) {
        mediaQueryDark.addEventListener("change", updateTheme);
        mediaQueryLight.addEventListener("change", updateTheme);
        return () => {
          mediaQueryDark.removeEventListener("change", updateTheme);
          mediaQueryLight.removeEventListener("change", updateTheme);
        };
      } else {
        mediaQueryDark.addListener(updateTheme);
        mediaQueryLight.addListener(updateTheme);
        return () => {
          mediaQueryDark.removeListener(updateTheme);
          mediaQueryLight.removeListener(updateTheme);
        };
      }
    }
  }, []);

  const theme = themePreference === "system" ? systemTheme : themePreference;

  const deferredTheme = React.useDeferredValue(theme);

  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState<boolean>(false);
  const themeMenuRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (themeMenuRef.current && !themeMenuRef.current.contains(event.target as Node)) {
        setIsThemeMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const changeTheme = (newPref: "dark" | "light" | "sepia" | "system") => {
    setThemePreference(newPref);
    try {
      localStorage.setItem("capelee_theme", newPref);
    } catch (e) {
      console.error(e);
    }
    setIsThemeMenuOpen(false);
  };

  const toggleTheme = () => {
    const nextTheme = themePreference === "dark" ? "light" : themePreference === "light" ? "sepia" : themePreference === "sepia" ? "system" : "dark";
    changeTheme(nextTheme);
  };

  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);
  const [magicAlert, setMagicAlert] = useState<boolean>(false);
  const [magicAlertTimeoutId, setMagicAlertTimeoutId] = useState<any>(null);

  const handleMagicPaletteClick = React.useCallback((clientX: number, clientY: number) => {
    try {
      playRareClickSound();
    } catch (e) {}

    const newRipple = {
      id: Date.now() + Math.random(),
      x: clientX,
      y: clientY
    };
    setRipples(prev => [...prev, newRipple]);

    // 隨機選擇一個與當前不同的主題Preference (dark, light, sepia, system)
    const availableThemes: ("dark" | "light" | "sepia" | "system")[] = ["dark", "light", "sepia", "system"];
    const otherThemes = availableThemes.filter(t => t !== themePreference);
    const nextTheme = otherThemes[Math.floor(Math.random() * otherThemes.length)];
    changeTheme(nextTheme);

    setMagicAlert(true);
    if (magicAlertTimeoutId) {
      clearTimeout(magicAlertTimeoutId);
    }
    const timer = setTimeout(() => {
      setMagicAlert(false);
    }, 4500);
    setMagicAlertTimeoutId(timer);

    const newParticles = Array.from({ length: 25 }).map((_, i) => ({
      id: Date.now() + i + Math.random(),
      x: clientX + (Math.random() * 200 - 100),
      y: clientY + (Math.random() * 200 - 100),
      emoji: ["🎨", "🔮", "🌈", "✨", "💎", "🎪", "🎭"][Math.floor(Math.random() * 7)],
    }));
    heroSectionRef.current?.setHeroParticles((prev: any[]) => [...prev, ...newParticles].slice(-60));
  }, [themePreference, changeTheme, magicAlertTimeoutId]);

  const [selectedCategory, setSelectedCategory] = useState<string>("亮點設計");
  const [activeSection, setActiveSection] = useState<"portfolio" | "resume" | null>(null);
  const { tutorialStep, nextTutorialStep } = useTutorial();

  const handleCategoryClick = React.useCallback((cat: string) => {
    setSelectedCategory(cat);
    if (tutorialStep === 1) {
      nextTutorialStep();
    }
  }, [tutorialStep, nextTutorialStep]);

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [tutorialDismissed5, setTutorialDismissed5] = useState(false);
  const [tutorialDismissed6, setTutorialDismissed6] = useState(false);
  const [tutorialDismissed7, setTutorialDismissed7] = useState(false);
  const [tutorialDismissed8, setTutorialDismissed8] = useState(false);
  const [searchInputVal, setSearchInputVal] = useState<string>("");
  const [visibleCount, setVisibleCount] = useState<number>(50);
  const [prevVisibleCount, setPrevVisibleCount] = useState<number>(0);

  // Keep searchInputVal in sync with searchQuery if changed externally (e.g., cleared)
  React.useEffect(() => {
    setSearchInputVal(searchQuery);
  }, [searchQuery]);

  // Debounce the input value so filtering only updates after typing pauses
  React.useEffect(() => {
    const handler = setTimeout(() => {
      if (searchInputVal !== searchQuery) {
        setSearchQuery(searchInputVal);
      }
    }, 180);
    return () => clearTimeout(handler);
  }, [searchInputVal, searchQuery]);

  // Automatically reset visibleCount when category or search query is changed to improve rendering load
  React.useEffect(() => {
    setVisibleCount(50);
    setPrevVisibleCount(0);
  }, [selectedCategory, searchQuery]);

  // Dynamically inject Schema.org JSON-LD structured data (CreativeWork) for SEO
  React.useEffect(() => {
    try {
      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      const schemaData = {
        "@context": "https://schema.org",
        "@graph": items.map((item) => ({
          "@type": "CreativeWork",
          "@id": `${origin}/#project-${item.id}`,
          "name": item.title,
          "alternateName": item.titleEn,
          "description": item.philosophy,
          "image": item.imageUrl,
          "genre": item.category,
          "creator": {
            "@type": "Person",
            "name": "李凱博 (Cape Lee)",
            "alternateName": "Cape Lee",
            "email": "capelee0715@gmail.com",
            "jobTitle": "Designer & Creative Specialist"
          },
          "publisher": {
            "@type": "ProfilePage",
            "name": "李凱博 (Cape Lee) - Creative Showcase",
            "url": origin
          },
          "keywords": item.tools.join(", "),
          "thumbnailUrl": item.imageUrl
        }))
      };

      let scriptTag = document.getElementById("portfolio-creative-work-jsonld") as HTMLScriptElement;
      if (!scriptTag) {
        scriptTag = document.createElement("script");
        scriptTag.id = "portfolio-creative-work-jsonld";
        scriptTag.type = "application/ld+json";
        document.head.appendChild(scriptTag);
      }
      scriptTag.text = JSON.stringify(schemaData);
    } catch (e) {
      console.error("Failed to inject JSON-LD structured data:", e);
    }

    return () => {
      const el = document.getElementById("portfolio-creative-work-jsonld");
      if (el) {
        el.remove();
      }
    };
  }, [items]);

  const currentMascot = useMemo(() => {
    return categoryMascotMap[selectedCategory] || categoryMascotMap["All"];
  }, [selectedCategory]);

  const [loadingProgress, setLoadingProgress] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // 全局觸覺震動回饋 (navigator.vibrate) 監聽器，針對對按鈕、連結、卡片等成功互動點擊
  React.useEffect(() => {
    const triggerHaptic = (e: Event) => {
      const target = e.target as HTMLElement;
      if (!target) return;
      // 搜尋最近的互動父容器（如 button, a, 具有 role='button' 或 cursor-pointer 類別的元素）
      const interactive = target.closest("button, a, [role='button'], .cursor-pointer");
      
      if (interactive && typeof navigator !== "undefined" && navigator.vibrate) {
        // 提供手持裝置極細微的實體確認回饋（12毫秒），點擊成立時才執行，避免滑動時誤觸
        navigator.vibrate(12);
      }
    };

    window.addEventListener("click", triggerHaptic, { passive: true });

    return () => {
      window.removeEventListener("click", triggerHaptic);
    };
  }, []);

  // Preloading coordinator using refs to prevent stale closure and double-triggers
  const preloadStateRef = React.useRef({
    isLoadingStarted: false,
    loadedWeight: 10,
    loadedUrls: new Set<string>(),
    portfolioMetaLoaded: false,
    topImagesQueued: false,
    safetyTimeoutId: 0,
    completionTimeoutId: 0
  });

  React.useEffect(() => {
    return () => {
      // Clear safety and completion timeouts on true unmount
      if (preloadStateRef.current.safetyTimeoutId) {
        window.clearTimeout(preloadStateRef.current.safetyTimeoutId);
      }
      if (preloadStateRef.current.completionTimeoutId) {
        window.clearTimeout(preloadStateRef.current.completionTimeoutId);
      }
    };
  }, []);

  React.useEffect(() => {
    const state = preloadStateRef.current;
    
    // 1. Initialize core mascot images preloading on mount
    if (!state.isLoadingStarted) {
      state.isLoadingStarted = true;
      setIsLoading(true);
      setLoadingProgress(10);

      const criticalMascots = [
        "https://drive.google.com/thumbnail?sz=w1000&id=1WGZs1SZI8NTKaF6M_-IpvD5EjGFll3Ri",
        "https://drive.google.com/thumbnail?sz=w1000&id=1ZhhZ25s_ADm5iFcAO_I-YxglQlFlcsjk",
        "https://drive.google.com/thumbnail?sz=w1000&id=1Q7naVG-GPyr6s5X57rYiKlSofgb8hpBh",
        "https://drive.google.com/thumbnail?sz=w1000&id=1eqi9X536nUrXqj-gv6kqjNMfpiC1YumX"
      ];

      const addWeight = (weight: number) => {
        state.loadedWeight += weight;
        const target = Math.min(state.loadedWeight, 100);
        setLoadingProgress(prev => (target > prev ? target : prev));
        if (target >= 100) {
          triggerComplete();
        }
      };

      const triggerComplete = () => {
        setLoadingProgress(100);
        if (state.completionTimeoutId) window.clearTimeout(state.completionTimeoutId);
        state.completionTimeoutId = window.setTimeout(() => {
          setIsLoading(false);
        }, 200);
      };

      // 2.5 seconds safety timeout to force loading screen completion on slow networks
      state.safetyTimeoutId = window.setTimeout(() => {
        console.log("[True Resource Loading] Safety timeout reached, forcing finish.");
        triggerComplete();
      }, 2500);

      // Start preloading critical mascot images (worth 15% progress each = 60% total)
      criticalMascots.forEach(url => {
        const img = new Image();
        img.src = url;
        const done = () => {
          if (!state.loadedUrls.has(url)) {
            state.loadedUrls.add(url);
            addWeight(15);
          }
        };
        img.onload = done;
        img.onerror = done; // continue on error to avoid blocks
      });
    }

    // 2. When portfolio items are loaded, trigger metadata milestone and preload top images
    if (items.length > 0 && !state.portfolioMetaLoaded) {
      state.portfolioMetaLoaded = true;
      
      const addWeight = (weight: number) => {
        state.loadedWeight += weight;
        const target = Math.min(state.loadedWeight, 100);
        setLoadingProgress(prev => (target > prev ? target : prev));
        if (target >= 100) {
          triggerComplete();
        }
      };

      const triggerComplete = () => {
        setLoadingProgress(100);
        if (state.completionTimeoutId) window.clearTimeout(state.completionTimeoutId);
        state.completionTimeoutId = window.setTimeout(() => {
          setIsLoading(false);
        }, 200);
      };

      // Milestone 1: Metadata list loaded (worth 15%)
      addWeight(15);

      // Milestone 2: Preload top 2 portfolio images (worth 7.5% each = 15%)
      if (!state.topImagesQueued) {
        state.topImagesQueued = true;
        const topImages = items
          .map(item => item.imageUrl)
          .filter((url): url is string => !!url)
          .slice(0, 2);

        topImages.forEach(url => {
          const img = new Image();
          img.src = url;
          const done = () => {
            if (!state.loadedUrls.has(url)) {
              state.loadedUrls.add(url);
              addWeight(7.5);
            }
          };
          img.onload = done;
          img.onerror = done;
        });
      }
    }
  }, [items]);

  const [activeModalItem, setActiveModalItem] = useState<PortfolioItem | null>(null);
  const [isWorkflowOpen, setIsWorkflowOpen] = useState<boolean>(false);
  const [isContactCardOpen, setIsContactCardOpen] = useState<boolean>(false);
  
  const isJumpingToBentoRef = React.useRef<boolean>(false);

  // 當開啟作品細節 Lightbox Modal、我的工作流 Modal 或聯絡資訊 Modal 時，對 Body 進行滾動鎖定，確保手持裝置體驗如 Native App 般精確穩定
  React.useEffect(() => {
    if (activeModalItem || isWorkflowOpen || isContactCardOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [activeModalItem, isWorkflowOpen, isContactCardOpen]);
  
  // Custom states for interactive highlights
  const [copiedEmail, setCopiedEmail] = useState<boolean>(false);
  const [copiedPromptId, setCopiedPromptId] = useState<string | null>(null);

  const copyPromptToClipboard = (prompt: string, id: string) => {
    navigator.clipboard.writeText(prompt);
    setCopiedPromptId(id);
    setTimeout(() => {
      setCopiedPromptId(null);
    }, 2000);
  };

  const lastSoundTime = React.useRef<number>(0);
  const lastPawPos = React.useRef<{ x: number; y: number; isLeft: boolean }>({ x: 0, y: 0, isLeft: false });
  const [dragPawprints, setDragPawprints] = useState<{ id: number; x: number; y: number; rotate: number }[]>([]);
  const pendingPawprintsRef = React.useRef<{ x: number; y: number; rotate: number }[]>([]);
  const dragRafIdRef = React.useRef<number | null>(null);

  const handleCanDrag = (event: any, info: any) => {
    const now = performance.now();
    
    // 1. Play clinking sound throttled to 200ms and scheduled within requestAnimationFrame
    if (now - lastSoundTime.current > 200) {
      lastSoundTime.current = now;
      requestAnimationFrame(() => {
        try {
          playCanClinkSound();
        } catch (e) {}
      });
    }

    // 2. Add soft drag pawprints
    const px = info.point.x;
    const py = info.point.y;
    
    // If it's the first coordinate, just record it
    if (lastPawPos.current.x === 0 && lastPawPos.current.y === 0) {
      lastPawPos.current = { x: px, y: py, isLeft: false };
      return;
    }

    const dx = px - lastPawPos.current.x;
    const dy = py - lastPawPos.current.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist > 28) {
      const nextIsLeft = !lastPawPos.current.isLeft;
      const angle = nextIsLeft ? -15 : 15;
      const newRotate = angle + (Math.random() * 8 - 4);
      
      lastPawPos.current = { x: px, y: py, isLeft: nextIsLeft };

      // Buffer pawprint coordinates instead of updating React state synchronously
      pendingPawprintsRef.current.push({
        x: px,
        y: py,
        rotate: newRotate
      });

      // Schedule high-performance state update on next render frame
      if (dragRafIdRef.current === null) {
        dragRafIdRef.current = requestAnimationFrame(() => {
          if (pendingPawprintsRef.current.length > 0) {
            const nowTime = Date.now();
            const newItems = pendingPawprintsRef.current.map((p, idx) => ({
              id: nowTime + Math.random() + idx,
              x: p.x,
              y: p.y,
              rotate: p.rotate
            }));
            pendingPawprintsRef.current = [];

            setDragPawprints((prev) => [
              ...prev,
              ...newItems
            ].slice(-15)); // Optimized limit to 15 to significantly reduce DOM weight and GC pressure
          }
          dragRafIdRef.current = null;
        });
      }
    }
  };

  // Hero white cat character interaction states
  const [isHeroSpeaking, setIsHeroSpeaking] = useState<boolean>(false);
  const [showHeroDialogue, setShowHeroDialogue] = useState<boolean>(false);
  const [heroDialogue, setHeroDialogue] = useState<string>("");
  const heroDialogueIndexRef = React.useRef<number>(0);
  const [displayedDialogue, setDisplayedDialogue] = useState<string>("");
  const heroSectionRef = React.useRef<HeroSectionRef>(null);

  // Refs for managing timers/intervals cleanly
  const heroAutoCloseTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const heroTypingIntervalRef = React.useRef<NodeJS.Timeout | null>(null);

  // NAV bar logo mascot interaction states
  const [navDialogue, setNavDialogue] = useState<string>("");
  const [showNavDialogue, setShowNavDialogue] = useState<boolean>(false);
  const [displayedNavDialogue, setDisplayedNavDialogue] = useState<string>("");

  // Email copy flying particles state
  interface MailParticle {
    id: number;
    emoji: string;
    angle: number;
    distance: number;
    delay: number;
  }
  const [mailParticles, setMailParticles] = useState<MailParticle[]>([]);

  // 魔法變身互動狀態
  const [magicClickTimes, setMagicClickTimes] = useState<number[]>([]);
  const [isMagicTransformed, setIsMagicTransformed] = useState<boolean>(false);
  const [showRainbowFlash, setShowRainbowFlash] = useState<boolean>(false);

  // 姆貓互動統計狀態（輕量級狀態管理與 LocalStorage 持久化）
  const [interactionCount, setInteractionCount] = useState<number>(() => {
    try {
      const saved = localStorage.getItem("mumu_interaction_count");
      return saved ? parseInt(saved, 10) : 0;
    } catch {
      return 0;
    }
  });
  const certModalRef = React.useRef<MumuCertModalRef>(null);

  React.useEffect(() => {
    try {
      localStorage.setItem("mumu_interaction_count", interactionCount.toString());
    } catch (e) {
      // ignore
    }
  }, [interactionCount]);

  // 榮譽成就解鎖狀態管理
  const [midnightUnlocked, setMidnightUnlocked] = useState<boolean>(() => {
    try {
      return localStorage.getItem("mumu_ach_midnight") === "true";
    } catch {
      return false;
    }
  });

  const [visitedThemes, setVisitedThemes] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("mumu_visited_themes");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
      return [theme]; // 預設加入目前主題
    } catch {
      return [theme];
    }
  });

  const [fortuneCount, setFortuneCount] = useState<number>(() => {
    try {
      const saved = localStorage.getItem("mumu_fortune_count");
      return saved ? parseInt(saved, 10) : 0;
    } catch {
      return 0;
    }
  });

  const [viewedProjects, setViewedProjects] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("mumu_viewed_projects");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
      return [];
    } catch {
      return [];
    }
  });

  const [zenUnlocked, setZenUnlocked] = useState<boolean>(() => {
    try {
      return localStorage.getItem("mumu_ach_zen") === "true";
    } catch {
      return false;
    }
  });

  const [socialUnlocked, setSocialUnlocked] = useState<boolean>(() => {
    try {
      return localStorage.getItem("mumu_ach_social") === "true";
    } catch {
      return false;
    }
  });

  const [slackerUnlocked, setSlackerUnlocked] = useState<boolean>(() => {
    try {
      return localStorage.getItem("mumu_ach_slacker") === "true";
    } catch {
      return false;
    }
  });

  const [aiWizardUnlocked, setAiWizardUnlocked] = useState<boolean>(() => {
    try {
      return localStorage.getItem("mumu_ach_ai_wizard") === "true";
    } catch {
      return false;
    }
  });

  const [premiumCanUnlocked, setPremiumCanUnlocked] = useState<boolean>(() => {
    try {
      return localStorage.getItem("mumu_ach_premium_can") === "true";
    } catch {
      return false;
    }
  });
  const [fedFlavors, setFedFlavors] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem("mumu_ach_fed_flavors");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [balloonUnlocked, setBalloonUnlocked] = useState<boolean>(() => {
    try {
      return localStorage.getItem("mumu_ach_balloon") === "true";
    } catch {
      return false;
    }
  });

  const [magicMumuUnlocked, setMagicMumuUnlocked] = useState<boolean>(() => {
    try {
      return localStorage.getItem("mumu_ach_magic_mumu") === "true";
    } catch {
      return false;
    }
  });

  const [gravityRestoreUnlocked, setGravityRestoreUnlocked] = useState<boolean>(() => {
    try {
      return localStorage.getItem("mumu_ach_gravity_restore") === "true";
    } catch {
      return false;
    }
  });

  const [pdfUnlocked, setPdfUnlocked] = useState<boolean>(() => {
    try {
      return localStorage.getItem("mumu_ach_pdf") === "true";
    } catch {
      return false;
    }
  });

  const [tutorialAchUnlocked, setTutorialAchUnlocked] = useState<boolean>(() => {
    try {
      return localStorage.getItem("mumu_ach_tutorial") === "true";
    } catch {
      return false;
    }
  });

  const [windStormUnlocked, setWindStormUnlocked] = useState<boolean>(() => {
    try {
      return localStorage.getItem("mumu_ach_wind_storm") === "true";
    } catch {
      return false;
    }
  });

  const [spawnedRareTypes, setSpawnedRareTypes] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("mumu_spawned_rare_types");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
      return [];
    } catch {
      return [];
    }
  });

  const [rareCollectorUnlocked, setRareCollectorUnlocked] = useState<boolean>(() => {
    try {
      return localStorage.getItem("mumu_ach_rare_collector") === "true";
    } catch {
      return false;
    }
  });

  const canX = useMotionValue(0);
  const canY = useMotionValue(0);
  const canRotate = useMotionValue(0);
  const mascotRef = React.useRef<HTMLDivElement>(null);
  const canRef = React.useRef<HTMLDivElement>(null);
  const canPhysicsId = React.useRef<number | null>(null);

  const [canFlavor, setCanFlavor] = useState<"tuna" | "chicken" | "luxury">("luxury");
  const [mumuClickCount, setMumuClickCount] = useState<number>(0);


  const handleCanDragStart = () => {
    if (tutorialStep >= 4 && tutorialStep <= 8 && !tutorialDismissed6) {
      setTutorialDismissed6(true);
      nextTutorialStep();
    }
    if (canPhysicsId.current !== null) {
      cancelAnimationFrame(canPhysicsId.current);
      canPhysicsId.current = null;
    }
  };

  const handleCanTap = () => {
    // Cycle flavor: tuna -> chicken -> luxury -> tuna
    setCanFlavor(prev => {
      if (prev === "tuna") return "chicken";
      if (prev === "chicken") return "luxury";
      return "tuna";
    });
  };



  const triggerPremiumCanUnlock = () => {
    try {
      playMeowSound();
      setTimeout(() => {
        try {
          playMeowSound();
        } catch (e) {}
      }, 150);
      setTimeout(() => {
        try {
          playMeowSound();
        } catch (e) {}
      }, 300);
    } catch (e) {}

    // Trigger cat purr sound for satisfied Mumao
    try {
      catPurr.start();
      setTimeout(() => {
        try {
          catPurr.stop();
        } catch (err) {}
      }, 3500);
    } catch (e) {}

    const explosionParticles = Array.from({ length: 55 }).map((_, i) => ({
      id: Date.now() + i + Math.random(),
      x: 180 + (Math.random() * 200 - 100),
      y: 180 + (Math.random() * 200 - 100),
      emoji: ["🥫", "🐟", "🐾", "✨", "💖", "⭐️", "👑", "🌈", "😻"][Math.floor(Math.random() * 9)],
    }));
    heroSectionRef.current?.setHeroParticles((prev: any[]) => [...prev, ...explosionParticles].slice(-100));

    const newFedFlavors = [...new Set([...fedFlavors, canFlavor])];
    if (newFedFlavors.length > fedFlavors.length) {
      setFedFlavors(newFedFlavors);
      try {
        localStorage.setItem("mumu_ach_fed_flavors", JSON.stringify(newFedFlavors));
      } catch (e) {}
    }

    if (!premiumCanUnlocked && newFedFlavors.length >= 3) {
      setPremiumCanUnlocked(true);
      try {
        localStorage.setItem("mumu_ach_premium_can", "true");
      } catch (e) {}
      triggerAchievementUnlock("極致奢華罐罐奉納 🥫");
      setHeroDialogue("喵嗚！太美味了吧！你居然集齊了三種口味的罐罐奉納！😻🥫✨ 本教主心情大好，特許你擁有無上福報、諸願成就！🐾");
    } else if (!premiumCanUnlocked) {
      const remaining = 3 - newFedFlavors.length;
      setHeroDialogue(`喵嗚～美味的${FLAVOR_PHYSICS[canFlavor].name}！🤤 再餵我 ${remaining} 種不同口味的罐罐，我就大發慈悲賜予你祝福！🐾`);
    } else {
      setHeroDialogue(`喵嗚！是${FLAVOR_PHYSICS[canFlavor].name}！太美味了吧！😻🥫✨ 本教主心情大好！🐾`);
    }

    setIsHeroSpeaking(true);
    setShowHeroDialogue(true);
  };

  const handleCanDragEnd = (event: any, info: any) => {
    // Reset paw track
    lastPawPos.current = { x: 0, y: 0, isLeft: false };

    if (!canRef.current) return;

    // Check if it hit the mascot
    if (mascotRef.current) {
      const rect = mascotRef.current.getBoundingClientRect();
      const px = info.point.x;
      const py = info.point.y;
      
      const padding = 15;
      if (
        px >= rect.left - padding &&
        px <= rect.right + padding &&
        py >= rect.top - padding &&
        py <= rect.bottom + padding
      ) {
        triggerPremiumCanUnlock();
        animate(canX, 0, { type: "spring", stiffness: 200, damping: 18 });
        animate(canY, 0, { type: "spring", stiffness: 200, damping: 18 });
        return;
      }
    }

    // Custom Physics Loop for bouncing off the edge of screen with angular momentum
    const flavorConfig = FLAVOR_PHYSICS[canFlavor];
    const elasticity = flavorConfig.elasticity;
    const rotFactor = flavorConfig.rotationalInertia;

    const rect = canRef.current.getBoundingClientRect();
    const curX = canX.get();
    const curY = canY.get();
    const curRot = canRotate.get();
    
    // Original (0, 0) position of the can in viewport coordinates
    const startX = rect.left - curX;
    const startY = rect.top - curY;
    const canWidth = rect.width || 48;
    const canHeight = rect.height || 48;

    // Get velocity from framer-motion (pixels per second)
    const vx = info.velocity.x;
    const vy = info.velocity.y;

    // Convert from px/sec to px/frame (assuming ~60fps)
    let velX = vx / 60;
    let velY = vy / 60;

    // Initial angular velocity (deg per frame) based on throw speed
    let rotVel = velX * 0.55 * rotFactor;

    let posX = curX;
    let posY = curY;
    let posRot = curRot;

    // If initial velocity is extremely small, we don't start animation loop
    if (Math.sqrt(velX * velX + velY * velY) < 1.0) {
      return;
    }

    let lastFrameTime = performance.now();

    const updatePhysics = (timestamp: number) => {
      const dt = Math.min((timestamp - lastFrameTime) / 16.666, 3); // cap deltaTime
      lastFrameTime = timestamp;

      posX += velX * dt;
      posY += velY * dt;
      posRot += rotVel * dt;

      // Viewport boundaries relative to start position
      const margin = 10;
      const minX = -startX + margin;
      const maxX = window.innerWidth - startX - canWidth - margin;
      const minY = -startY + margin;
      const maxY = window.innerHeight - startY - canHeight - margin;

      let bounced = false;

      // When bouncing off walls, surface friction translates linear speed into rotation (angular momentum)
      if (posX < minX) {
        posX = minX;
        velX = -velX * elasticity; // rebound elastic coefficient
        rotVel += velY * 1.5 * rotFactor; // roll downward/upward based on vertical velocity
        bounced = true;
      } else if (posX > maxX) {
        posX = maxX;
        velX = -velX * elasticity;
        rotVel -= velY * 1.5 * rotFactor; // opposite direction friction on right side
        bounced = true;
      }

      if (posY < minY) {
        posY = minY;
        velY = -velY * elasticity;
        rotVel -= velX * 1.5 * rotFactor; // roll left/right based on horizontal velocity
        bounced = true;
      } else if (posY > maxY) {
        posY = maxY;
        velY = -velY * elasticity;
        rotVel += velX * 1.5 * rotFactor;
        bounced = true;
      }

      if (bounced) {
        try {
          playCanClinkSound();
        } catch (e) {}
      }

      canX.set(posX);
      canY.set(posY);
      canRotate.set(posRot);

      // Apply drag friction (damping) for linear and angular speed
      velX *= Math.pow(0.965, dt);
      velY *= Math.pow(0.965, dt);
      rotVel *= Math.pow(0.955, dt); // rotational decay

      // Stop loop if it has slowed down significantly
      const linearSpeed = Math.sqrt(velX * velX + velY * velY);
      const angularSpeed = Math.abs(rotVel);
      if (linearSpeed > 0.18 || angularSpeed > 0.18) {
        canPhysicsId.current = requestAnimationFrame(updatePhysics);
      } else {
        canPhysicsId.current = null;
      }
    };

    if (canPhysicsId.current !== null) {
      cancelAnimationFrame(canPhysicsId.current);
    }
    canPhysicsId.current = requestAnimationFrame(updatePhysics);
  };

  const [unlockedAchToast, setUnlockedAchToast] = useState<string | null>(null);
  const toastTimeoutRef = React.useRef<any>(null);

  const triggerAchievementUnlock = (name: string) => {
    setUnlockedAchToast(name);
    try {
      playMeowSound();
    } catch (e) {}

    // 產生華麗的慶祝粒子
    const newParticles = Array.from({ length: 20 }).map((_, i) => ({
      id: Date.now() + i + Math.random(),
      x: window.innerWidth / 2 + (Math.random() * 320 - 160),
      y: window.innerHeight / 2 + (Math.random() * 320 - 160),
      emoji: ["✨", "🏆", "🌟", "🐾", "🎉", "👑", "💖"][Math.floor(Math.random() * 7)],
    }));
    heroSectionRef.current?.setHeroParticles((prev: any[]) => [...prev, ...newParticles].slice(-60));

    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    toastTimeoutRef.current = setTimeout(() => {
      setUnlockedAchToast(null);
    }, 4500);
  };

  const incrementInteraction = () => {
    setInteractionCount((prev) => {
      const next = prev + 1;
      
      // 1. 檢測深夜擼貓者條件
      const hour = new Date().getHours();
      // 深夜時間：23:00 - 04:00 (即 hour >= 23 或是 hour < 4)
      if (hour >= 23 || hour < 4) {
        if (!midnightUnlocked) {
          setMidnightUnlocked(true);
          try {
            localStorage.setItem("mumu_ach_midnight", "true");
          } catch (e) {}
          triggerAchievementUnlock("深夜擼貓者 🐾");
        }
      }

      return next;
    });
  };

  // 檢測極意摸魚之神條件 (累計達 100 次以上)
  React.useEffect(() => {
    if (interactionCount >= 100 && !slackerUnlocked) {
      setSlackerUnlocked(true);
      try {
        localStorage.setItem("mumu_ach_slacker", "true");
      } catch (e) {}
      triggerAchievementUnlock("極意摸魚之神 👑");
    }
  }, [interactionCount, slackerUnlocked]);

  // 檢測靜心禪修者條件 (停留滿 3 分鐘)
  React.useEffect(() => {
    if (zenUnlocked) return;
    const timer = setTimeout(() => {
      setZenUnlocked(true);
      try {
        localStorage.setItem("mumu_ach_zen", "true");
      } catch (e) {}
      triggerAchievementUnlock("靜心禪修者 🧘‍♀️");
    }, 180000); // 180,000ms = 3 minutes
    return () => clearTimeout(timer);
  }, [zenUnlocked]);

  // 檢測 AI 協同巫師條件 (打開並詳細閱讀 AI 設計輔助工作流)
  React.useEffect(() => {
    if (isWorkflowOpen && !aiWizardUnlocked) {
      setAiWizardUnlocked(true);
      try {
        localStorage.setItem("mumu_ach_ai_wizard", "true");
      } catch (e) {}
      triggerAchievementUnlock("AI 協同巫師 ✨");
    }
  }, [isWorkflowOpen, aiWizardUnlocked]);

  // 社交宣傳使者觸發
  const handleSocialClick = () => {
    if (!socialUnlocked) {
      setSocialUnlocked(true);
      try {
        localStorage.setItem("mumu_ach_social", "true");
      } catch (e) {}
      triggerAchievementUnlock("社交宣傳使者 🐾");
    }
  };

  // 傳統派讀者觸發
  const handlePdfClick = () => {
    if (!pdfUnlocked) {
      setPdfUnlocked(true);
      try {
        localStorage.setItem("mumu_ach_pdf", "true");
      } catch (e) {}
      triggerAchievementUnlock("傳統派讀者 📖");
    }
  };

  // 飛天姆貓成就觸發
  const triggerBalloonAchievement = () => {
    if (!balloonUnlocked) {
      setBalloonUnlocked(true);
      try {
        localStorage.setItem("mumu_ach_balloon", "true");
      } catch (e) {}
      triggerAchievementUnlock("飛天姆貓 🎈");
    }
  };

  // 檢測新手上路成就條件 (完成前三個教學，tutorialStep >= 4)
  React.useEffect(() => {
    if (tutorialStep >= 4 && !tutorialAchUnlocked) {
      setTutorialAchUnlocked(true);
      try {
        localStorage.setItem("mumu_ach_tutorial", "true");
      } catch (e) {}
      triggerAchievementUnlock("新手上路 🎓");
    }
  }, [tutorialStep, tutorialAchUnlocked]);

  // 檢測御風神官成就條件 (亮點卡片風力達 6 層)
  React.useEffect(() => {
    const handleWindStormAch = () => {
      if (!windStormUnlocked) {
        setWindStormUnlocked(true);
        try {
          localStorage.setItem("mumu_ach_wind_storm", "true");
        } catch (e) {}
        triggerAchievementUnlock("御風神官 🌬️");
      }
    };
    window.addEventListener("trigger-wind-storm-ach", handleWindStormAch);
    return () => {
      window.removeEventListener("trigger-wind-storm-ach", handleWindStormAch);
    };
  }, [windStormUnlocked]);

  // 檢測集齊五種稀有物品成就
  React.useEffect(() => {
    const handleRareSpawned = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail && detail.rareType) {
        const type = detail.rareType as string;
        setSpawnedRareTypes((prev) => {
          if (prev.includes(type)) return prev;
          const next = [...prev, type];
          try {
            localStorage.setItem("mumu_spawned_rare_types", JSON.stringify(next));
          } catch (err) {}
          return next;
        });
      }
    };
    window.addEventListener("rare-item-spawned", handleRareSpawned);
    return () => {
      window.removeEventListener("rare-item-spawned", handleRareSpawned);
    };
  }, []);

  React.useEffect(() => {
    const required = ["amulet", "star", "apple", "palette", "ig"];
    const hasAll = required.every((t) => spawnedRareTypes.includes(t));
    if (hasAll && !rareCollectorUnlocked) {
      setRareCollectorUnlocked(true);
      try {
        localStorage.setItem("mumu_ach_rare_collector", "true");
      } catch (e) {}
      triggerAchievementUnlock("奇蹟之物收集雅士 💎");
    }
  }, [spawnedRareTypes, rareCollectorUnlocked]);

  // 2. 檢測時空穿梭大師條件 (體驗完所有主題)
  React.useEffect(() => {
    if (!visitedThemes.includes(theme)) {
      const updated = [...visitedThemes, theme];
      setVisitedThemes(updated);
      try {
        localStorage.setItem("mumu_visited_themes", JSON.stringify(updated));
      } catch (e) {}
      
      // 如果完整體驗了 3 個主題，則解鎖成就
      if (updated.length === 3) {
        const alreadyThemeUnlocked = localStorage.getItem("mumu_ach_theme") === "true";
        if (!alreadyThemeUnlocked) {
          try {
            localStorage.setItem("mumu_ach_theme", "true");
          } catch (e) {}
          triggerAchievementUnlock("時空穿梭大師 🎨");
        }
      }
    }
  }, [theme, visitedThemes]);

  // 3. 檢測命運之友條件 (占卜/求籤達 3 次)
  const handleFortuneConsult = React.useCallback(() => {
    setFortuneCount((prev) => {
      const next = prev + 1;
      try {
        localStorage.setItem("mumu_fortune_count", next.toString());
      } catch (e) {}
      
      if (next === 3) {
        const alreadyFortuneUnlocked = localStorage.getItem("mumu_ach_fortune") === "true";
        if (!alreadyFortuneUnlocked) {
          try {
            localStorage.setItem("mumu_ach_fortune", "true");
          } catch (e) {}
          triggerAchievementUnlock("命運之友 🔮");
        }
      }
      return next;
    });
  }, []);

  // 4. 檢測作品鑑賞家條件 (點擊並深入閱讀 5 個以上作品詳細卡片)
  const handleProjectView = (projectId: string) => {
    if (!viewedProjects.includes(projectId)) {
      const updated = [...viewedProjects, projectId];
      setViewedProjects(updated);
      try {
        localStorage.setItem("mumu_viewed_projects", JSON.stringify(updated));
      } catch (e) {}
      
      if (updated.length === 5) {
        const alreadyPortfolioUnlocked = localStorage.getItem("mumu_ach_portfolio") === "true";
        if (!alreadyPortfolioUnlocked) {
          try {
            localStorage.setItem("mumu_ach_portfolio", "true");
          } catch (e) {}
          triggerAchievementUnlock("作品鑑賞家 📖");
        }
      }
    }
  };

  // 監聽詳細卡片開啟，自動觸發閱讀進度
  React.useEffect(() => {
    if (activeModalItem?.id) {
      handleProjectView(activeModalItem.id);
    }
  }, [activeModalItem]);

  // 控制台（F12）隱藏罐罐彩蛋 🥫
  React.useEffect(() => {
    console.log(
      "%c" +
      "   /\\___/\\   \n" +
      "  (=`o_o`=)  \n" +
      "    (u u) 🐾 🥫\n",
      "color: #fda4af; font-weight: bold; font-size: 20px; font-family: monospace; line-height: 1.4; text-shadow: 0 0 5px rgba(251, 113, 133, 0.4);"
    );
    console.log(
      "%c喵！被你發現控制台了！送你一個隱藏罐罐 🥫！",
      "color: #fb7185; font-weight: bold; font-size: 16px; font-family: system-ui, sans-serif; background: rgba(253, 164, 175, 0.1); padding: 8px 12px; border-left: 4px solid #f43f5e; border-radius: 4px; margin-bottom: 8px;"
    );
    console.log(
      "%c這是一個專門為技術人員與面試官準備的暖心彩蛋。喜歡這份細節與互動體驗嗎？歡迎隨時與我交流、聯繫！✨🐾",
      "color: #8c7b69; font-size: 12px; font-family: system-ui, sans-serif;"
    );
  }, []);

  // Handle typewriter effect for lively dialog popups
  React.useEffect(() => {
    if (heroTypingIntervalRef.current) {
      clearInterval(heroTypingIntervalRef.current);
      heroTypingIntervalRef.current = null;
    }

    if (!showHeroDialogue || !heroDialogue) {
      setDisplayedDialogue("");
      return;
    }

    setDisplayedDialogue("");
    let currentText = "";
    let i = 0;
    const chars = Array.from(heroDialogue);
    
    heroTypingIntervalRef.current = setInterval(() => {
      if (i < chars.length) {
        currentText += chars[i];
        setDisplayedDialogue(currentText);
        i++;
      } else {
        if (heroTypingIntervalRef.current) {
          clearInterval(heroTypingIntervalRef.current);
          heroTypingIntervalRef.current = null;
        }
      }
    }, 35); // 35ms per character is highly responsive and synced with cute audio blips

    return () => {
      if (heroTypingIntervalRef.current) {
        clearInterval(heroTypingIntervalRef.current);
        heroTypingIntervalRef.current = null;
      }
    };
  }, [showHeroDialogue, heroDialogue]);

  // When dialogue completes speaking/typing, keep it visible for exactly 2 seconds and auto-close
  React.useEffect(() => {
    if (displayedDialogue && heroDialogue && displayedDialogue === heroDialogue) {
      if (heroAutoCloseTimeoutRef.current) {
        clearTimeout(heroAutoCloseTimeoutRef.current);
      }
      
      const autoCloseDelay = (heroDialogue.includes("IG") || heroDialogue.includes("Instagram") || heroDialogue.includes("今日姆貓運勢") || heroDialogue.includes("看作品") || heroDialogue.includes("這隻白貓是我的原創") || heroDialogue.includes("12 隻專業恐龍")) ? 8000 : 2000;
      heroAutoCloseTimeoutRef.current = setTimeout(() => {
        setIsHeroSpeaking(false);
        setShowHeroDialogue(false);
      }, autoCloseDelay);
    }
  }, [displayedDialogue, heroDialogue]);

  // Handle typewriter effect for NAV bar dialogue popups
  React.useEffect(() => {
    if (!showNavDialogue || !navDialogue) {
      setDisplayedNavDialogue("");
      return;
    }

    setDisplayedNavDialogue("");
    let currentText = "";
    let i = 0;
    const chars = Array.from(navDialogue);
    
    const interval = setInterval(() => {
      if (i < chars.length) {
        currentText += chars[i];
        setDisplayedNavDialogue(currentText);
        i++;
      } else {
        clearInterval(interval);
      }
    }, 35); // 35ms per character is highly responsive

    return () => {
      clearInterval(interval);
    };
  }, [showNavDialogue, navDialogue]);

  const heroDialogues = useMemo(() => [
    "哈囉！我是 Cape Lee 👋 歡迎來到我的視覺與品牌整合設計宇宙！",
    "點選左下角的『看作品』，就能解鎖我經手的所有精彩作品喔！✨",
    "每一像素都承載著設計的溫度與堅持。希望你今天逛得開心！💖",
    "這隻白貓是我的原創 IP 角色 MuMㄠ 喔！試試看長按我 0.2 秒再拖曳，會掉落驚喜小物喔！🐾✨",
    "在右下角還有我們的 12 隻專業恐龍與吉祥物戰隊，也可以找他們聊天喔！🦖",
    "我的原創 IP 插畫音樂祭粉專開張囉！長按我拖曳可以掉落道具，也別忘了追蹤 MuMㄠ（姆貓教）的 IG 吧！🎸🐾",
    "對本教主「快速連續點擊 15 次」，就能解鎖神秘隱藏的「魔法姆貓」夢幻變身姿態喔！✨🪄🐾",
    "想要測測今天的運勢與求籤開運嗎？長按拖曳我有機會掉落奇蹟之物，或點擊下方按鈕前往「今日姆貓運勢」！⛩️🥫🔮"
  ], []);

  const lastHeroClickTimeRef = React.useRef<number>(0);

  const triggerHeroSpeaking = () => {
    // Select next sequential index and rotate
    const currentIdx = heroDialogueIndexRef.current % heroDialogues.length;
    heroDialogueIndexRef.current = (heroDialogueIndexRef.current + 1) % heroDialogues.length;
    
    // Clear any existing auto-close timeout when trigger speaking
    if (heroAutoCloseTimeoutRef.current) {
      clearTimeout(heroAutoCloseTimeoutRef.current);
      heroAutoCloseTimeoutRef.current = null;
    }
    
    // Clear typing interval too
    if (heroTypingIntervalRef.current) {
      clearInterval(heroTypingIntervalRef.current);
      heroTypingIntervalRef.current = null;
    }

    setHeroDialogue(heroDialogues[currentIdx]);
    setIsHeroSpeaking(true);
    setShowHeroDialogue(true);
  };

  // Automatically trigger the first dialogue when users enter the webpage (mounts)
  React.useEffect(() => {
    const timer = setTimeout(() => {
      triggerHeroSpeaking();
    }, 1200); // 1.2s delay for maximum cinematic entrance polish
    return () => clearTimeout(timer);
  }, []);

  const triggerMascotDialogue = (dialogue: string) => {
    setNavDialogue(dialogue);
    setShowNavDialogue(true);
  };

  const openAndScrollToProject = React.useCallback((item: PortfolioItem) => {
    // If the category doesn't include the item, switch to "All"
    if (selectedCategory !== "All" && selectedCategory !== item.category && !(selectedCategory === "亮點設計" && item.isHighlight)) {
      setSelectedCategory("All");
    }
    
    // Smooth scroll to portfolio grid
    const grid = document.getElementById("portfolio-grid");
    if (grid) {
      const header = document.querySelector("header");
      const headerHeight = header ? header.offsetHeight : 64;
      const elementPosition = grid.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: elementPosition - headerHeight - 20,
        behavior: "smooth"
      });
    }

    // Open modal
    setTimeout(() => {
      setActiveModalItem(item);
    }, 500); // Wait a bit for scroll
  }, [selectedCategory]);

  const handleRandomProject = React.useCallback(() => {
    const randomItem = items[Math.floor(Math.random() * items.length)];
    openAndScrollToProject(randomItem);
  }, [items, openAndScrollToProject]);

  const handleHighlightProject = React.useCallback(() => {
    const highlights = items.filter(i => i.isHighlight);
    if (highlights.length > 0) {
      const randomHighlight = highlights[Math.floor(Math.random() * highlights.length)];
      openAndScrollToProject(randomHighlight);
    }
  }, [items, openAndScrollToProject]);

  console.log("Current tutorialStep:", tutorialStep);
  const handleChangeCategory = React.useCallback(() => {
    if (tutorialStep === 1) nextTutorialStep();
    const availableCategories = ["亮點設計", "All", ...Array.from(new Set(items.map(item => item.category)))];
    const otherCategories = availableCategories.filter(c => c !== selectedCategory);
    if (otherCategories.length > 0) {
      const nextCat = otherCategories[Math.floor(Math.random() * otherCategories.length)];
      setSelectedCategory(nextCat);
      
      const grid = document.getElementById("portfolio-grid");
      if (grid) {
        const header = document.querySelector("header");
        const headerHeight = header ? header.offsetHeight : 64;
        const elementPosition = grid.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({
          top: elementPosition - headerHeight - 20,
          behavior: "smooth"
        });
      }
    }
  }, [items, selectedCategory]);

  const handleHeroClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // 統計使用者在 Hero Section 的互動次數
    incrementInteraction();

    // 累積點擊姆貓次數，滿 5 次解鎖罐罐
    setMumuClickCount(prev => {
      const nextCount = prev + 1;
      if (nextCount === 5) {
        try {
          playMagicDingSound();
          playCanClinkSound();
        } catch (err) {}
        setHeroDialogue("喵嗚！被你發現了！罐罐奉納模式啟動！🥫✨ 拖曳罐罐到我頭上餵我吧！🐾");
        setIsHeroSpeaking(true);
      }
      return nextCount;
    });

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // 變身期間有更華麗、夢幻的點擊粒子
    const emojis = isMagicTransformed
      ? ["✨", "💖", "🎀", "⭐️", "🪄", "🌈", "🌸", "🦄"]
      : ["✨", "💖", "🐾", "🎨", "💬", "⭐", "🎵", "😻", "🎀"];
    const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];

    const newParticle = {
      id: Date.now() + Math.random(),
      x,
      y,
      emoji: randomEmoji,
    };

    // Particles remain 100% instantaneous on every tap for tactile, responsive feedback
    heroSectionRef.current?.setHeroParticles((prev: any[]) => [...prev, newParticle].slice(-20));

    // 魔法變身快速點擊計數：3 秒內點擊 15 次
    const now = Date.now();
    const updatedClicks = [...magicClickTimes, now].filter((t) => now - t <= 3000);
    setMagicClickTimes(updatedClicks);

    if (updatedClicks.length >= 15 && !isMagicTransformed) {
      setIsMagicTransformed(true);
      setShowRainbowFlash(true);
      setMagicClickTimes([]);
      playMagicDingSound();

      if (!magicMumuUnlocked) {
        setMagicMumuUnlocked(true);
        try {
          localStorage.setItem("mumu_ach_magic_mumu", "true");
        } catch (e) {}
        triggerAchievementUnlock("魔法姆貓 🪄");
      }

      // 彩虹光芒包裹 1.2 秒後淡出
      setTimeout(() => {
        setShowRainbowFlash(false);
      }, 1200);

      // 持續 5 秒後自動變回原樣，並加上一句台詞
      setTimeout(() => {
        setIsMagicTransformed(false);
        setHeroDialogue("哎呀！被發現本教主的魔法形態了，這可是秘密喔！✨");
        setIsHeroSpeaking(true);
      }, 5000);
      return;
    }

    // Check if currently typing
    const isCurrentlyTyping = isHeroSpeaking && showHeroDialogue && displayedDialogue.length < heroDialogue.length;

    if (isCurrentlyTyping) {
      // Clear typing interval to stop character-by-character animation
      if (heroTypingIntervalRef.current) {
        clearInterval(heroTypingIntervalRef.current);
        heroTypingIntervalRef.current = null;
      }
      // Finish typing instantly
      setDisplayedDialogue(heroDialogue);
    } else {
      // Not speaking/typing or dialog closed, trigger a new dialogue
      triggerHeroSpeaking();
    }

    // Always trigger subtle header and card micro-bounce feedback for responsive clicking
    heroSectionRef.current?.setTitleBounceTrigger((prev: number) => prev + 1);
  };

  const handleMascotDrag = () => {
    // 統計使用者在 Hero Section 的互動次數
    incrementInteraction();

    const dragDialogues = [
      "哇！別拉我呀～本教主快被你拉走了！🐾",
      "放開我～我要去吃罐罐！🐈",
      "哎呀！被抓住了！不要拽著我不放嘛～🌀",
      "好暈好暈～被你甩來甩去的！💫",
      "喵嗚！好彈好晃！本教主身手很矯健吧！✨",
      "放手～等一下罐罐要被打翻了啦！🥫"
    ];

    const randomDialogue = dragDialogues[Math.floor(Math.random() * dragDialogues.length)];
    
    // 播放可愛的波波聲音與喵喵聲
    playPawPopSound();
    if (Math.random() > 0.6) {
      playMeowSound();
    }

    if (heroAutoCloseTimeoutRef.current) {
      clearTimeout(heroAutoCloseTimeoutRef.current);
      heroAutoCloseTimeoutRef.current = null;
    }
    if (heroTypingIntervalRef.current) {
      clearInterval(heroTypingIntervalRef.current);
      heroTypingIntervalRef.current = null;
    }

    setHeroDialogue(randomDialogue);
    setIsHeroSpeaking(true);
    setShowHeroDialogue(true);
    setDisplayedDialogue(randomDialogue);

    // 觸發標題微彈回饋
    heroSectionRef.current?.setTitleBounceTrigger((prev: number) => prev + 1);
  };

  React.useEffect(() => {
    let dialogDelayTimeout: NodeJS.Timeout | null = null;

    if (isHeroSpeaking) {
      // 一開始對話框先隱藏 (或重設)
      setShowHeroDialogue(false);

      // 播放動物森友會風格的語音 (根據對話內容，最長播放 4.5 秒)
      if (heroDialogue) {
        animaleseSynth.play(heroDialogue, 4500);
      }

      // 嘴部動作開始 300ms 後，對話框才同步出現，使表情與講話節奏更立體生動
      dialogDelayTimeout = setTimeout(() => {
        setShowHeroDialogue(true);
      }, 300);

      // 12 秒後自動閉嘴的安全機制 (Safety fallback)
      if (heroAutoCloseTimeoutRef.current) {
        clearTimeout(heroAutoCloseTimeoutRef.current);
      }
      heroAutoCloseTimeoutRef.current = setTimeout(() => {
        setIsHeroSpeaking(false);
        setShowHeroDialogue(false);
      }, 12000);
    } else {
      setShowHeroDialogue(false);
      animaleseSynth.stop();
    }

    return () => {
      if (dialogDelayTimeout) clearTimeout(dialogDelayTimeout);
      if (heroAutoCloseTimeoutRef.current) {
        clearTimeout(heroAutoCloseTimeoutRef.current);
        heroAutoCloseTimeoutRef.current = null;
      }
      animaleseSynth.stop();
    };
  }, [isHeroSpeaking, heroDialogue]);

  // Mascot visibility based on scrolling sections
  const [isMascotVisibleByScroll, setIsMascotVisibleByScroll] = useState<boolean>(false);

  // Scroll to top and navbar transition support
  const [showScrollTop, setShowScrollTop] = useState<boolean>(false);
  const [showHeader, setShowHeader] = useState<boolean>(true);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  
  const categoriesRef = React.useRef<HTMLDivElement>(null);
  const [showCategoriesLeftMask, setShowCategoriesLeftMask] = useState<boolean>(false);
  const [showCategoriesRightMask, setShowCategoriesRightMask] = useState<boolean>(false);
  const [isMobileExpanded, setIsMobileExpanded] = useState<boolean>(false);

  const checkCategoriesScroll = React.useCallback(() => {
    if (categoriesRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = categoriesRef.current;
      setShowCategoriesLeftMask(scrollLeft > 0);
      setShowCategoriesRightMask(Math.ceil(scrollLeft + clientWidth) < scrollWidth - 1);
    }
  }, []);

  const isProgrammaticScrollRef = React.useRef<boolean>(false);
  const categoryScrollTimeoutRef = React.useRef<number | null>(null);

  const centerSelectedCategory = React.useCallback((onlyIfNotVisible = false) => {
    if (categoriesRef.current) {
      const container = categoriesRef.current;
      const activeButton = container.querySelector(`button[data-cat="${selectedCategory}"]`) as HTMLElement;
      
      if (activeButton) {
        const containerRect = container.getBoundingClientRect();
        const buttonRect = activeButton.getBoundingClientRect();
        
        // Calculate if the button is fully visible inside the container
        const isVisible = (buttonRect.left >= containerRect.left) && (buttonRect.right <= containerRect.right);
        
        if (onlyIfNotVisible && isVisible) {
          return; // Button is already visible, no need to auto center
        }

        // Calculate the relative position to center the button
        const scrollTarget = container.scrollLeft + (buttonRect.left - containerRect.left) - (containerRect.width / 2) + (buttonRect.width / 2);
          
        isProgrammaticScrollRef.current = true;
        container.scrollTo({
          left: scrollTarget,
          behavior: 'smooth'
        });
        
        // Reset the programmatic scroll flag after a short delay for animation
        setTimeout(() => {
          isProgrammaticScrollRef.current = false;
        }, 800);
      }
    }
  }, [selectedCategory]);

  const handleCategoriesScroll = React.useCallback(() => {
    checkCategoriesScroll();
    
    // Ignore scroll events generated by auto centering
    if (isProgrammaticScrollRef.current) {
      return;
    }
    
    if (categoryScrollTimeoutRef.current) {
      window.clearTimeout(categoryScrollTimeoutRef.current);
    }
    
    categoryScrollTimeoutRef.current = window.setTimeout(() => {
      centerSelectedCategory(true);
    }, 3000);
  }, [checkCategoriesScroll, centerSelectedCategory]);

  // Clean up timeout on unmount
  React.useEffect(() => {
    return () => {
      if (categoryScrollTimeoutRef.current) {
        window.clearTimeout(categoryScrollTimeoutRef.current);
      }
    };
  }, []);

  // Center the selected category in the mobile scroll menu when it changes
  React.useEffect(() => {
    centerSelectedCategory();
  }, [centerSelectedCategory]);

  React.useEffect(() => {
    checkCategoriesScroll();
    // Re-check after short paint delay to handle mobile layout renders correctly
    const initId = window.setTimeout(checkCategoriesScroll, 250);
    const initId2 = window.setTimeout(checkCategoriesScroll, 800);
    
    let timeoutId: number;
    const handleResize = () => {
      window.clearTimeout(timeoutId);
      timeoutId = window.setTimeout(checkCategoriesScroll, 100);
    };
    window.addEventListener('resize', handleResize, { passive: true });
    return () => {
      window.removeEventListener('resize', handleResize);
      window.clearTimeout(timeoutId);
      window.clearTimeout(initId);
      window.clearTimeout(initId2);
    };
  }, [checkCategoriesScroll]);

  React.useEffect(() => {
    let lastY = window.scrollY;
    let ticking = false;
    document.documentElement.style.setProperty('--scroll-y', `${lastY}px`);

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          
          // Update high-performance CSS variable directly to drive parallax under 0 React re-renders
          document.documentElement.style.setProperty('--scroll-y', `${currentScrollY}px`);

          const scrolled = currentScrollY > 20;
          if (scrollTrackerRef.current.isScrolled !== scrolled) {
            scrollTrackerRef.current.isScrolled = scrolled;
            setIsScrolled(scrolled);
          }

          const showScroll = currentScrollY > 300;
          if (scrollTrackerRef.current.showScrollTop !== showScroll) {
            scrollTrackerRef.current.showScrollTop = showScroll;
            setShowScrollTop(showScroll);
          }

          // Check scroll-based visibility for interactive mascot:
          // It should show up ONLY in the portfolio works area (i.e. once the top of #portfolio-grid is scrolled into view or has passed,
          // and retracted when we go back to the top or down to the bottom resume section (#designer-bento)).
          const portfolioGrid = document.getElementById("portfolio-grid");
          const designerBento = document.getElementById("designer-bento");
          
          let mascotVisible = false;
          if (portfolioGrid) {
            const portfolioRect = portfolioGrid.getBoundingClientRect();
            // Start showing once the top of portfolio grid has entered the lower portion of the viewport
            const enteredPortfolio = portfolioRect.top < window.innerHeight * 0.7;
            
            let reachedResume = false;
            if (designerBento) {
              const bentoRect = designerBento.getBoundingClientRect();
              // Hide once the designer bento resume section has entered the viewport (e.g. 60% of screen height)
              reachedResume = bentoRect.top < window.innerHeight * 0.6;
            }
            
            mascotVisible = enteredPortfolio && !reachedResume;
          }

          if (scrollTrackerRef.current.isMascotVisible !== mascotVisible) {
            scrollTrackerRef.current.isMascotVisible = mascotVisible;
            setIsMascotVisibleByScroll(mascotVisible);
          }

          // Always keep top navbar visible and do not trigger show/hide state updates
          scrollTrackerRef.current.showHeader = true;

          lastY = currentScrollY;
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 滾動感應：偵測目前畫面的區塊並動態切換 Active Indicator (作品/履歷)
  React.useEffect(() => {
    const portfolioEl = document.getElementById("portfolio-grid");
    const bentoEl = document.getElementById("designer-bento");

    const checkActiveSection = () => {
      if (window.scrollY < 120) {
        setActiveSection(null);
        return;
      }

      let currentActive: "portfolio" | "resume" | null = null;
      let maxIntersectionHeight = 0;

      [portfolioEl, bentoEl].forEach(el => {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        // 計算元素在目前視窗中的真實可見高度
        const visibleHeight = Math.max(0, Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0));
        if (visibleHeight > maxIntersectionHeight && visibleHeight > 100) {
          maxIntersectionHeight = visibleHeight;
          currentActive = el.id === "portfolio-grid" ? "portfolio" : "resume";
        }
      });

      setActiveSection(currentActive);
    };

    // 使用 requestAnimationFrame 進行滾動節流 (Throttling)，避免頻繁觸發 getBoundingClientRect 導致 Layout Thrashing (瀏覽器卡頓)
    let ticking = false;
    const handleScrollCheck = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          checkActiveSection();
          ticking = false;
        });
        ticking = true;
      }
    };

    // 使用 IntersectionObserver 作為輔助，當區塊進出時主動校正
    const observerOptions = {
      root: null,
      rootMargin: "-15% 0px -25% 0px",
      threshold: [0, 0.1, 0.2]
    };

    const observer = new IntersectionObserver(() => {
      handleScrollCheck();
    }, observerOptions);

    if (portfolioEl) observer.observe(portfolioEl);
    if (bentoEl) observer.observe(bentoEl);

    window.addEventListener("scroll", handleScrollCheck, { passive: true });
    // 初始校正一次
    checkActiveSection();

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScrollCheck);
    };
  }, []);

  const headerBg = React.useMemo(() => {
    if (!isScrolled) {
      return "rgba(0, 0, 0, 0)";
    }
    if (theme === "light") {
      return "rgba(255, 255, 255, 0.72)";
    } else if (theme === "sepia") {
      return "rgba(250, 244, 229, 0.75)";
    } else {
      return "rgba(7, 7, 7, 0.65)";
    }
  }, [isScrolled, theme]);

  const headerBlur = React.useMemo(() => {
    if (!isScrolled) {
      return "blur(0px)";
    }
    return "blur(16px)";
  }, [isScrolled]);

  const headerShadow = React.useMemo(() => {
    if (!isScrolled) {
      return "none";
    }
    if (theme === "light") {
      return "0 8px 32px 0 rgba(0, 0, 0, 0.04), 0 1px 2px 0 rgba(0, 0, 0, 0.02)";
    } else if (theme === "sepia") {
      return "0 8px 32px 0 rgba(67, 52, 34, 0.05), 0 1px 2px 0 rgba(67, 52, 34, 0.02)";
    } else {
      return "0 8px 32px 0 rgba(0, 0, 0, 0.35), 0 1px 2px 0 rgba(0, 0, 0, 0.2)";
    }
  }, [isScrolled, theme]);

  const headerBorderColor = React.useMemo(() => {
    if (!isScrolled) {
      return "transparent";
    }
    if (theme === "light") {
      return "rgba(0, 0, 0, 0.05)";
    } else if (theme === "sepia") {
      return "rgba(67, 52, 34, 0.06)";
    } else {
      return "rgba(255, 255, 255, 0.05)";
    }
  }, [isScrolled, theme]);

  const brandingTextClass = theme === "sepia"
    ? "text-[#433422]"
    : theme === "light"
    ? "text-zinc-900"
    : "text-white";

  const brandingBarTextClass = theme === "sepia"
    ? "text-amber-800/60"
    : theme === "light"
    ? "text-zinc-500"
    : "text-zinc-500";

  const navLinkClass = theme === "sepia"
    ? "text-[#5C4D3C] hover:text-[#382B1D] transition-colors duration-200"
    : theme === "light"
    ? "text-zinc-550 hover:text-zinc-900 transition-colors duration-200"
    : "text-zinc-400 hover:text-white transition-colors duration-200";

  const navSlashClass = theme === "sepia"
    ? "text-[#EDE2CA]/70"
    : theme === "light"
    ? "text-zinc-300"
    : "text-zinc-700";

  const workflowBtnClass = theme === "sepia"
    ? "text-[#4F3C28] hover:text-[#2B1B0C] bg-[#EDE2CA]/95 border-[#DFCFA0]/80 hover:bg-[#E2D5B9] hover:border-amber-600/40"
    : theme === "light"
    ? "text-zinc-750 hover:text-zinc-950 bg-zinc-100 border-zinc-200/80 hover:bg-zinc-200/80 hover:border-amber-500/30"
    : "text-zinc-300 hover:text-white bg-amber-500/10 border-amber-500/20 hover:bg-amber-500/20";

  const themeToggleClass = theme === "sepia"
    ? "p-1 flex items-center justify-center transition-all duration-250 transform active:scale-95 hover:scale-110 shrink-0 text-[#7A6B58] hover:text-[#433422] cursor-pointer"
    : theme === "light"
    ? "p-1 flex items-center justify-center transition-all duration-250 transform active:scale-95 hover:scale-110 shrink-0 text-zinc-400 hover:text-zinc-800 cursor-pointer"
    : "p-1 flex items-center justify-center transition-all duration-250 transform active:scale-95 hover:scale-110 shrink-0 text-zinc-550 hover:text-zinc-200 cursor-pointer";

  const copyEmailClass = theme === "sepia"
    ? "text-xs sm:text-sm font-sans font-normal text-[#7A6B58] hover:text-[#433422] transition-all duration-250 flex items-center gap-1.5 relative group cursor-pointer hover:scale-105 active:scale-95"
    : theme === "light"
    ? "text-xs sm:text-sm font-sans font-normal text-zinc-400 hover:text-zinc-650 transition-all duration-250 flex items-center gap-1.5 relative group cursor-pointer hover:scale-105 active:scale-95"
    : "text-xs sm:text-sm font-sans font-normal text-zinc-500 hover:text-zinc-300 transition-all duration-250 flex items-center gap-1.5 relative group cursor-pointer hover:scale-105 active:scale-95";

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  const scrollToElement = (id: string) => {
    const element = document.getElementById(id);
    if (!element) return;

    if (id === "designer-bento") {
      isJumpingToBentoRef.current = true;
    }

    // Get actual header height dynamically
    const header = document.querySelector("header");
    const headerHeight = header ? header.offsetHeight : 64;

    // Elegant offset gap (16px)
    const extraOffset = 16;

    const elementPosition = element.getBoundingClientRect().top + window.scrollY;
    const offsetPosition = elementPosition - headerHeight - extraOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth"
    });

    if (id === "designer-bento") {
      // 1. First scroll phase check (350ms) - Adjust smoothly if slight layout shifts happened during load
      setTimeout(() => {
        const updatedElement = document.getElementById(id);
        if (updatedElement) {
          const updatedPosition = updatedElement.getBoundingClientRect().top + window.scrollY - headerHeight - extraOffset;
          if (Math.abs(window.scrollY - updatedPosition) > 4) {
            window.scrollTo({
              top: updatedPosition,
              behavior: "smooth"
            });
          }
        }
      }, 350);

      // 2. Second final compensation check (850ms) - instant precise lock-in
      setTimeout(() => {
        const updatedElement = document.getElementById(id);
        if (updatedElement) {
          const updatedPosition = updatedElement.getBoundingClientRect().top + window.scrollY - headerHeight - extraOffset;
          if (Math.abs(window.scrollY - updatedPosition) > 1) {
            window.scrollTo({
              top: updatedPosition,
              behavior: "auto"
            });
          }
        }
        isJumpingToBentoRef.current = false;
      }, 850);
    } else {
      // For portfolio-grid or other sections, a single standard correction at 350ms is perfect
      setTimeout(() => {
        const updatedElement = document.getElementById(id);
        if (updatedElement) {
          const updatedPosition = updatedElement.getBoundingClientRect().top + window.scrollY - headerHeight - extraOffset;
          if (Math.abs(window.scrollY - updatedPosition) > 4) {
            window.scrollTo({
              top: updatedPosition,
              behavior: "smooth"
            });
          }
        }
      }, 350);
    }
  };



  // Profile data
  const profile = {
    name: "李凱博 (Cape Lee)",
    engName: "capelee",
    title: "特約專案設計師",
    company: "立陽鴻企業禮贈品",
    school: "環球科技大學",
    dept: "創意商品設計學系 畢業",
    experience: "6 年以上品牌商業整合設計實戰經驗",
    desireTitle: "視覺設計師 / 平面設計師",
    email: "capelee0715@gmail.com",
    portfolioUrl: "https://drive.google.com/file/d/1rjJsddL0kOvYSL-1T-bBxmwn5iZcX-pO/view?usp=drive_link", 
    pdfPortfolioUrl: "https://drive.google.com/file/d/1rjJsddL0kOvYSL-1T-bBxmwn5iZcX-pO/view?usp=drive_link", 
    intro: "擁有 6 年以上品牌商業整合設計實戰經驗，致力於探索生成藝術與當代視覺的深度融合。我擅長以 AI 技術為核心，將生成式工作流無縫導入平面設計、影音製作與品牌識別，展現獨特觀點與豐沛的創作能量。經手超過百個品牌專案，涵蓋破萬銷量電商視覺至原創 IP 開發。在此次臺北生成藝術節，我期待透過實際運用 AI 工具，讓大眾親身體驗生成藝術如何為當代創作注入嶄新活力，推動藝術與科技的深度交融，共同邁向生成藝術共創的未來。",
    education: [
      { school: "環球科技大學", dept: "創意商品設計學系", info: "大學畢業", activities: ["系學會會長", "系學會美宣長", "畢籌會美宣長"] },
      { school: "復興美工", dept: "美工科設計組", info: "經典設計本科學府", activities: ["畢業展全校總成績第三名"] }
    ],
    certificates: [
      { name: "Adobe Certified Professional in Visual Design", issuer: "Ps & Ai 專業雙認證" },
      { name: "AutoCAD 2011、2012 Certified Professional", issuer: "Autodesk 國際認證人員" },
      { name: "TQC+ 影像處理、電腦圖像編輯製作 專業人員", issuer: "中華民國電腦技能基金會" },
      { name: "視覺傳達設計丙級技術士", issuer: "中華民國勞動部國家技術士證" }
    ],
    experienceList: [
      { title: "特約專案設計師", company: "立陽鴻企業禮贈品", badge: "現任" },
      { title: "整合行銷設計師", company: "歡喜媛媛有限公司 / 巴迪醫療器材有限公司", badge: "曾任" },
      { title: "電商品牌視覺設計師", company: "得速科技有限公司", badge: "曾任" },
      { title: "設計助理", company: "二十五點創意製作有限公司", badge: "曾任" },
      { title: "美編設計助理", company: "程祺互動資訊有限公司 / 程意文創有限公司", badge: "曾任" }
    ],
    scopes: [
      { id: "s1", title: "視覺設計", desc: "平面排版、廣告 Banner、社群圖案、EDM、網頁一頁式 Landing Page 視覺製作與流程企劃，注重轉化效益。", badge: "Visual" },
      { id: "s2", title: "品牌識別", desc: "LOGO 商標設計、CIS 企業識別系統規劃、名片、衍生周邊與會場大型輸出物料完稿製作。", badge: "Identity" },
      { id: "s3", title: "商業攝影", desc: "商品高品質棚拍、材質精修、食品風格情境攝影、人物形象肖像拍攝與後期像素級精細修圖。", badge: "Photo" },
      { id: "s4", title: "影音製作", desc: "影片腳本企劃、現場拍攝與導演、後期剪輯、特效字卡、AI配音輔助及多媒體影像後期整合。", badge: "Video" },
      { id: "s5", title: "印刷完稿", desc: "專業各式紙質印刷品版面設計、精確上色、印前拆版及輸出檔案管理，熟悉複雜印刷工藝。", badge: "Print" },
      { id: "s6", title: "IP 與周邊開發", desc: "品牌授權 IP 商品視覺造型設計、原創潮流角色開發與實體周邊公仔製作流程監測。", badge: "IP Dev" },
      { id: "s7", title: "AI 輔助工作流", desc: "熟練掌握 GPTImage , Firefly , Nano Bananana 等 AIGC 繪圖工具，能極速產出高品質創意底稿。", badge: "AIGC Flow" },
      { id: "s8", title: "禮贈品專屬規劃", desc: "企業客製化高質感禮贈品視覺排版設計，包含金屬徽章、特殊烤漆獎牌、提袋完稿工藝。", badge: "Gifts" }
    ]
  };

  // Categories extraction
  const categories = useMemo(() => {
    const list = new Set(items.map(item => item.category));
    // Always ensure "賣場Banner橫幅廣告" is included in the available filters
    if (!list.has("賣場Banner橫幅廣告")) {
      list.add("賣場Banner橫幅廣告");
    }
    return ["亮點設計", "All", ...Array.from(list)];
  }, [items]);

  // Split categories evenly into 2 fixed lines/rows
  const { row1, row2 } = useMemo(() => {
    const half = Math.ceil(categories.length / 2);
    return {
      row1: categories.slice(0, half),
      row2: categories.slice(half)
    };
  }, [categories]);

  React.useEffect(() => {
    checkCategoriesScroll();
  }, [categories, checkCategoriesScroll]);

  // Filter items
  const filteredItems = useMemo(() => {
    let list;

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      list = items.filter(item => 
        item.title.toLowerCase().includes(q) ||
        item.titleEn.toLowerCase().includes(q) ||
        item.philosophy.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.tools.some(tool => tool.toLowerCase().includes(q))
      );
    } else {
      if (selectedCategory === "All") {
        list = items;
      } else if (selectedCategory === "亮點設計") {
        list = items.filter(item => item.isHighlight);
      } else {
        list = items.filter(item => item.category === selectedCategory);
      }
    }
    
    // Sort: isHighlight === true projects go to the front
    return [...list].sort((a, b) => {
      const aVal = a.isHighlight ? 1 : 0;
      const bVal = b.isHighlight ? 1 : 0;
      return bVal - aVal;
    });
  }, [items, selectedCategory, searchQuery]);

  const visibleItems = useMemo(() => {
    return filteredItems.slice(0, visibleCount);
  }, [filteredItems, visibleCount]);

  const handleLoadMore = React.useCallback(() => {
    setVisibleCount(prev => Math.min(prev + 50, filteredItems.length));
  }, [filteredItems.length]);

  // Performance Optimization: Preload the cover images (360px-600px width) of the active category and upcoming predictive batch dynamically.
  // This avoids overwhelming the browser and Google Drive API, resolving rate limits, lag, and black screen failures.
  React.useEffect(() => {
    if (!filteredItems || filteredItems.length === 0) return;
    
    // Limits preloading to currently visible items + predictive next batch of 12 items to prevent network saturation while staying ahead of scrolling.
    const endRange = Math.min(visibleCount + 20, filteredItems.length);
    const itemsToPreload = filteredItems.slice(0, endRange);
    itemsToPreload.forEach(item => {
      const coverUrl = item.imageUrl || (item.images && item.images.length > 0 ? item.images[0] : "");
      if (coverUrl) {
        const optimizedUrl = resolveImageUrl(coverUrl, 360);
        const img = new Image();
        img.referrerPolicy = "no-referrer";
        img.src = optimizedUrl;
      }
    });
  }, [selectedCategory, filteredItems, visibleCount]);

  // Performance Optimization: Preload the slider and detail images (1200px / 120px) only when a modal is opened.
  React.useEffect(() => {
    if (!activeModalItem) return;
    
    // Preload current item's high-res slide images in the background so sliding and thumb rendering is instant
    if (activeModalItem.images) {
      activeModalItem.images.slice(0, 6).forEach(imgUrl => {
        if (imgUrl) {
          // Preload detail view (800 px) and thumbnail item select menu (120 px)
          [800, 120].forEach(size => {
            const optimizedUrl = resolveImageUrl(imgUrl, size);
            const img = new Image();
            img.referrerPolicy = "no-referrer";
            img.src = optimizedUrl;
          });
        }
      });
    }
  }, [activeModalItem]);

  const copyEmailToClipboard = React.useCallback(() => {
    navigator.clipboard.writeText(profile.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);

    // 觸發導航列姆貓對話吐槽與提示
    setNavDialogue("喵嗚！聯絡信箱已成功複製到你的剪貼簿囉！💌 歡迎隨時來信！🐾");
    setShowNavDialogue(true);

    // 產生從信件按鈕炸開的可愛特效粒子（信封、愛心、閃爍、小肉掌、貓罐罐）
    const emojis = ["✉️", "💌", "✨", "💖", "🐾", "🥫"];
    const newParticles: MailParticle[] = Array.from({ length: 8 }).map((_, i) => ({
      id: Date.now() + i + Math.random(),
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
      angle: Math.random() * 360,
      distance: 40 + Math.random() * 75,
      delay: Math.random() * 0.1,
    }));
    setMailParticles((prev) => [...prev, ...newParticles]);

    // 動畫結束後自動清理粒子
    setTimeout(() => {
      setMailParticles((prev) => prev.filter(p => !newParticles.find(np => np.id === p.id)));
    }, 1500);
  }, [profile.email]);

  // vCard details and download handler
  const vCardText = useMemo(() => {
    return [
      "BEGIN:VCARD",
      "VERSION:3.0",
      `FN:${profile.name}`,
      "N:李;凱博;;;",
      `TITLE:${profile.title}`,
      `ORG:${profile.company}`,
      `EMAIL;TYPE=INTERNET,WORK:${profile.email}`,
      `URL:${profile.portfolioUrl}`,
      `NOTE:${profile.intro.substring(0, 100)}...`,
      "END:VCARD"
    ].join("\r\n");
  }, [profile]);

  const downloadVCard = React.useCallback(() => {
    const file = new Blob([vCardText], { type: "text/vcard;charset=utf-8" });
    const element = document.createElement("a");
    const objectUrl = URL.createObjectURL(file);
    element.href = objectUrl;
    element.download = `${profile.name}_${profile.engName}.vcf`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    URL.revokeObjectURL(objectUrl);
  }, [vCardText, profile.name, profile.engName]);

  const handlePrevModalItem = React.useCallback(() => {
    const idx = filteredItems.findIndex(i => i.id === activeModalItem?.id);
    if (idx > 0) {
      setActiveModalItem(filteredItems[idx - 1]);
    } else {
      setActiveModalItem(filteredItems[filteredItems.length - 1]);
    }
  }, [filteredItems, activeModalItem]);

  const handleNextModalItem = React.useCallback(() => {
    const idx = filteredItems.findIndex(i => i.id === activeModalItem?.id);
    if (idx < filteredItems.length - 1) {
      setActiveModalItem(filteredItems[idx + 1]);
    } else {
      setActiveModalItem(filteredItems[0]);
    }
  }, [filteredItems, activeModalItem]);

  return (
    <div className={`min-h-screen flex flex-col font-sans relative overflow-x-hidden transition-colors duration-500 ${
      theme === "light" 
        ? "light-theme text-[#1F2937] selection:bg-amber-500/20 selection:text-amber-800" 
        : theme === "sepia"
        ? "sepia-theme text-[#433422] selection:bg-amber-500/20 selection:text-amber-900"
        : "bg-[#070707] text-[#E5E7EB] selection:bg-amber-500/20 selection:text-amber-300"
    }`}>
      
      {/* 拖曳罐罐時產生的淡雅貓掌印軌跡 */}
      <AnimatePresence>
        {dragPawprints.map((p) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0.5, scale: 0.5 }}
            animate={{ opacity: [0.5, 0.45, 0], scale: [0.5, 0.75, 0.45] }}
            exit={{ opacity: 0, scale: 0.3 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            onAnimationComplete={() => {
              setDragPawprints((prev) => prev.filter((item) => item.id !== p.id));
            }}
            className="fixed pointer-events-none z-[9999] text-pink-400/40 select-none text-2xl flex items-center justify-center"
            style={{
              left: p.x,
              top: p.y,
              transform: `translate(-50%, -50%) rotate(${p.rotate}deg)`,
              width: 24,
              height: 24
            }}
          >
            🐾
          </motion.div>
        ))}
      </AnimatePresence>

      {/* 全域 Loading Bar */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-amber-500 via-amber-400 to-indigo-600 z-50 pointer-events-none"
          >
            <motion.div 
              className="h-full bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.6)]"
              initial={{ width: "0%" }}
              animate={{ width: `${loadingProgress}%` }}
              transition={{ ease: "easeOut", duration: 0.25 }}
            />
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* 頂部裝飾背景微光 */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1400px] h-[550px] pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-250px] left-1/4 w-[45%] aspect-square rounded-full bg-amber-500/4 blur-[80px]" style={{ willChange: "transform, opacity" }}></div>
        <div className="absolute top-[-200px] right-1/4 w-[40%] aspect-square rounded-full bg-indigo-500/4 blur-[80px]" style={{ willChange: "transform, opacity" }}></div>
      </div>



      {/* 頂部導航列 (Branding Bar) */}
      <motion.header
        initial={{ y: 0 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 280, damping: 30 }}
        style={{
          "--header-bg": headerBg,
          "--header-blur": headerBlur,
          backgroundColor: headerBg,
          backdropFilter: headerBlur,
          WebkitBackdropFilter: headerBlur,
          borderBottomColor: headerBorderColor,
          boxShadow: headerShadow,
          transition: "background-color 0.4s ease, backdrop-filter 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease"
        } as any}
        className="fixed top-0 left-0 right-0 z-40 border-b py-2 md:py-2.5 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-7xl xl:max-w-[1400px] 2xl:max-w-[1600px] mx-auto flex items-center justify-between">
          <div
            role="button"
            tabIndex={0}
            onClick={scrollToTop}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                scrollToTop();
              }
            }}
            className="flex items-center gap-2 sm:gap-3 cursor-pointer group/brand select-none hover:opacity-90 active:scale-[0.98] transition-all duration-200 text-left outline-none"
          >
            <MinimalistLogo 
              theme={theme} 
              showInteractiveBubble={true} 
              bubbleDirection="bottom" 
              className="w-[30px] h-[30px] md:w-[36px] md:h-[36px] shrink-0 group-hover/brand:scale-105 transition-transform duration-300" 
              externalDialogue={displayedNavDialogue || navDialogue}
              showExternalBubble={showNavDialogue}
              onCloseExternalBubble={() => {
                setShowNavDialogue(false);
              }}
              onInteract={incrementInteraction}
              onBalloonFlyAway={triggerBalloonAchievement}
            />
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className={`font-display font-semibold tracking-tight text-xs sm:text-sm md:text-md transition-colors duration-300 ${brandingTextClass}`}>Cape Lee</span>
              </div>
              <p className="hidden sm:block text-[10px] font-mono text-zinc-500 tracking-wider">CREATIVE VISUAL PORTFOLIO</p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4 md:gap-6">
            {/* 導航文字連結：作品 & 履歷 */}
            <div className="flex items-center gap-4 sm:gap-6 mr-1 sm:mr-2">
              <button
                type="button"
                onClick={() => scrollToElement("portfolio-grid")}
                className={`relative py-1 px-1.5 text-xs sm:text-sm font-sans transition-all duration-250 cursor-pointer hover:scale-105 active:scale-95 outline-none ${
                  activeSection === "portfolio"
                    ? theme === "sepia"
                      ? "text-[#433422] font-semibold"
                      : theme === "light"
                      ? "text-zinc-950 font-semibold"
                      : "text-white font-semibold"
                    : navLinkClass
                }`}
              >
                <span>作品</span>
                {activeSection === "portfolio" && (
                  <motion.div
                    layoutId="activeNavIndicator"
                    className={`absolute bottom-0 left-0 right-0 h-[2.5px] rounded-full ${
                      theme === "sepia"
                        ? "bg-[#8A5A32] shadow-[0_0_6px_rgba(138,90,50,0.4)]"
                        : theme === "light"
                        ? "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]"
                        : "bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.6)]"
                    }`}
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
              <button
                type="button"
                onClick={() => scrollToElement("designer-bento")}
                className={`relative py-1 px-1.5 text-xs sm:text-sm font-sans transition-all duration-250 cursor-pointer hover:scale-105 active:scale-95 outline-none ${
                  activeSection === "resume"
                    ? theme === "sepia"
                      ? "text-[#433422] font-semibold"
                      : theme === "light"
                      ? "text-zinc-950 font-semibold"
                      : "text-white font-semibold"
                    : navLinkClass
                }`}
              >
                <span>履歷</span>
                {activeSection === "resume" && (
                  <motion.div
                    layoutId="activeNavIndicator"
                    className={`absolute bottom-0 left-0 right-0 h-[2.5px] rounded-full ${
                      theme === "sepia"
                        ? "bg-[#8A5A32] shadow-[0_0_6px_rgba(138,90,50,0.4)]"
                        : theme === "light"
                        ? "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]"
                        : "bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.6)]"
                    }`}
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">

              {/* 電子郵件點擊複製 */}
              <button
                type="button"
                id="btn_header_copy_email"
                onClick={copyEmailToClipboard}
                className={`transition-colors duration-300 ${copyEmailClass}`}
                title="點擊複製聯絡信箱"
              >
                {/* 複製郵件飛行粒子 */}
                <AnimatePresence>
                  {mailParticles.map((p) => {
                    const radians = (p.angle * Math.PI) / 180;
                    const xDest = Math.cos(radians) * p.distance;
                    const yDest = Math.sin(radians) * p.distance;
                    return (
                      <motion.span
                        key={p.id}
                        initial={{ opacity: 1, scale: 0.3, x: 0, y: 0 }}
                        animate={{ 
                          opacity: [1, 1, 0], 
                          scale: [0.3, 1.2, 0.6], 
                          x: xDest, 
                          y: yDest, 
                          rotate: p.angle * 1.5 
                        }}
                        exit={{ opacity: 0 }}
                        transition={{ 
                          duration: 0.9, 
                          delay: p.delay, 
                          ease: "easeOut" 
                        }}
                        className="absolute pointer-events-none select-none text-base z-50 left-1/2 top-1/2 -ml-2 -mt-2"
                      >
                        {p.emoji}
                      </motion.span>
                    );
                  })}
                </AnimatePresence>

                {copiedEmail ? (
                  <>
                     <Check className="h-3.5 w-3.5 text-green-400" />
                     <span className="hidden sm:inline text-green-400 text-xs sm:text-sm font-normal font-sans">已複製信箱</span>
                  </>
                ) : (
                  <>
                     <Mail className={`h-3.5 w-3.5 transition-colors ${
                       theme === 'sepia' 
                         ? 'text-[#8C7B69]/80 group-hover:text-[#433422]' 
                         : theme === 'light' 
                         ? 'text-zinc-400 group-hover:text-zinc-600' 
                         : 'text-zinc-500 group-hover:text-zinc-350'
                     }`} />
                     <span className="hidden sm:inline">capelee0715@gmail.com</span>
                  </>
                )}
              </button>

              {/* 主題切換按鈕 (選單形式) - 往右移 */}
              <div className="relative" ref={themeMenuRef}>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9, rotate: isThemeMenuOpen ? -12 : 12 }}
                  transition={{ type: "spring", stiffness: 400, damping: 15 }}
                  type="button"
                  id="btn_theme_toggle"
                  onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}
                  className={themeToggleClass}
                  title="選擇主題配色"
                >
                  {themePreference === "dark" ? (
                    <Moon className="h-4 w-4 text-indigo-400" />
                  ) : themePreference === "light" ? (
                    <Sun className="h-4 w-4 text-[#D97706]" />
                  ) : themePreference === "sepia" ? (
                    <Eye className="h-4 w-4 text-amber-700" />
                  ) : (
                    <Monitor className="h-4 w-4 text-zinc-500" />
                  )}
                </motion.button>

                <AnimatePresence>
                  {isThemeMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.82, y: -12, rotate: -2 }}
                      animate={{ opacity: 1, scale: 1, y: 0, rotate: 0 }}
                      exit={{ opacity: 0, scale: 0.82, y: -12, rotate: -2 }}
                      transition={{ 
                        type: "spring", 
                        stiffness: 380, 
                        damping: 18, 
                        mass: 0.9 
                      }}
                      className={`absolute right-0 mt-2 w-28 rounded-xl border p-1 z-50 shadow-lg origin-top-right ${
                        theme === "sepia"
                          ? "bg-[#F4EAD4] border-[#DFCFA0]/80 text-[#4F3C28]"
                          : theme === "light"
                          ? "bg-white border-zinc-150 text-zinc-800"
                          : "bg-[#18181b] border-white/10 text-zinc-200"
                      }`}
                    >
                      {/* 淺色選項 */}
                      <motion.button
                        whileHover={{ scale: 1.02, x: 2 }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ type: "spring", stiffness: 400, damping: 20 }}
                        type="button"
                        onClick={() => changeTheme("light")}
                        className={`flex items-center justify-between w-full px-2.5 py-1.5 text-xs font-sans rounded-lg transition-all duration-200 cursor-pointer ${
                          themePreference === "light"
                            ? theme === "sepia"
                              ? "bg-[#E2D5B9] text-[#4F3C28] font-medium"
                              : theme === "light"
                              ? "bg-zinc-100 text-zinc-950 font-medium"
                              : "bg-white/10 text-white font-medium"
                            : theme === "sepia"
                            ? "hover:bg-[#E2D5B9]/40 text-[#7A6B58]"
                            : theme === "light"
                            ? "hover:bg-zinc-100/50 text-zinc-650"
                            : "hover:bg-white/5 text-zinc-400"
                        }`}
                      >
                        <div className="flex items-center gap-1.5">
                          <Sun className="h-3.5 w-3.5 text-[#D97706]" />
                          <span>淺色</span>
                        </div>
                        {themePreference === "light" && (
                          <span className="h-1.5 w-1.5 rounded-full bg-[#D97706]" />
                        )}
                      </motion.button>

                      {/* 深色選項 */}
                      <motion.button
                        whileHover={{ scale: 1.02, x: 2 }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ type: "spring", stiffness: 400, damping: 20 }}
                        type="button"
                        onClick={() => changeTheme("dark")}
                        className={`flex items-center justify-between w-full px-2.5 py-1.5 text-xs font-sans rounded-lg transition-all duration-200 cursor-pointer mt-0.5 ${
                          themePreference === "dark"
                            ? theme === "sepia"
                              ? "bg-[#E2D5B9] text-[#4F3C28] font-medium"
                              : theme === "light"
                              ? "bg-zinc-100 text-zinc-950 font-medium"
                              : "bg-white/10 text-white font-medium"
                            : theme === "sepia"
                            ? "hover:bg-[#E2D5B9]/40 text-[#7A6B58]"
                            : theme === "light"
                            ? "hover:bg-zinc-100/50 text-zinc-650"
                            : "hover:bg-white/5 text-zinc-400"
                        }`}
                      >
                        <div className="flex items-center gap-1.5">
                          <Moon className="h-3.5 w-3.5 text-indigo-400" />
                          <span>深色</span>
                        </div>
                        {themePreference === "dark" && (
                          <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                        )}
                      </motion.button>

                      {/* 暖沙選項 */}
                      <motion.button
                        whileHover={{ scale: 1.02, x: 2 }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ type: "spring", stiffness: 400, damping: 20 }}
                        type="button"
                        onClick={() => changeTheme("sepia")}
                        className={`flex items-center justify-between w-full px-2.5 py-1.5 text-xs font-sans rounded-lg transition-all duration-200 cursor-pointer mt-0.5 ${
                          themePreference === "sepia"
                            ? theme === "sepia"
                              ? "bg-[#E2D5B9] text-[#4F3C28] font-medium"
                              : theme === "light"
                              ? "bg-zinc-100 text-zinc-950 font-medium"
                              : "bg-white/10 text-white font-medium"
                            : theme === "sepia"
                            ? "hover:bg-[#E2D5B9]/40 text-[#7A6B58]"
                            : theme === "light"
                            ? "hover:bg-zinc-100/50 text-zinc-650"
                            : "hover:bg-white/5 text-zinc-400"
                        }`}
                      >
                        <div className="flex items-center gap-1.5">
                          <Eye className="h-3.5 w-3.5 text-amber-700" />
                          <span>暖沙</span>
                        </div>
                        {themePreference === "sepia" && (
                          <span className="h-1.5 w-1.5 rounded-full bg-amber-600" />
                        )}
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Instagram 按鈕 */}
              <a
                href="https://www.instagram.com/mumao1_the_cat_religion/"
                target="_blank"
                rel="noopener noreferrer"
                className={themeToggleClass}
                title="訪問 Instagram (姆貓教)"
                onClick={handleSocialClick}
              >
                <Instagram className={`h-4 w-4 ${
                  theme === "sepia" 
                    ? "text-[#4F3C28] hover:text-[#E1306C]" 
                    : theme === "light" 
                    ? "text-zinc-550 hover:text-[#E1306C]" 
                    : "text-zinc-400 hover:text-[#E1306C]"
                } transition-colors`} />
              </a>

            </div>
          </div>
        </div>
      </motion.header>

      {/* 主要展示區 */}
      <main className="flex-1 w-full max-w-7xl xl:max-w-[1400px] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-10 md:pt-24 md:pb-12 z-10 space-y-12 md:space-y-16">
        
        {/* 極簡頂部 Hero Section */}
        <HeroSection
          ref={heroSectionRef}
          theme={theme}
          profile={profile}
          incrementInteraction={incrementInteraction}
          handlePdfClick={handlePdfClick}
          scrollToElement={scrollToElement}
        setCategory={setSelectedCategory}
          mascotRef={mascotRef}
          mascotY={mascotY}
          glowY={glowY}
          elementsY={elementsY}
          elementsY2={elementsY2}
          rotateElement1={rotateElement1}
          rotateElement2={rotateElement2}
          isMagicTransformed={isMagicTransformed}
          isHeroSpeaking={isHeroSpeaking}
          showHeroDialogue={showHeroDialogue}
          displayedDialogue={displayedDialogue}
          handleHeroClick={handleHeroClick}
          onMascotDrag={handleMascotDrag}
          tutorialStep={tutorialStep}
          tutorialDismissed5={tutorialDismissed5}
          setTutorialDismissed5={setTutorialDismissed5}
          tutorialDismissed6={tutorialDismissed6}
          setTutorialDismissed6={setTutorialDismissed6}
          nextTutorialStep={nextTutorialStep}
          canRef={canRef}
          canX={canX}
          canY={canY}
          canRotate={canRotate}
          canFlavor={canFlavor}
          handleCanDragStart={handleCanDragStart}
          handleCanDrag={handleCanDrag}
          handleCanDragEnd={handleCanDragEnd}
          handleCanTap={handleCanTap}
          onRandomProject={handleRandomProject}
          onMagicPaletteClick={handleMagicPaletteClick}
          showCan={mumuClickCount >= 5}
        />

        {/* 特色亮點區域 (Highlights Section) - 快速展示履歷重點 */}
        <section className="w-full relative z-20 pb-4 md:pb-8">
          <div className="w-full">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
              {[
                { 
                  label: "6+ 年實戰經驗", 
                  sub: "破百品牌視覺操刀", 
                  Icon: Award, 
                  color: "text-amber-500", 
                  bg: "bg-amber-500/10",
                  content: "從前端品牌規劃到後端視覺執行，擁有豐富的電商、醫療、文創等多元產業實戰經驗。精準掌握各類型商業目標，並轉化為高轉換率的視覺方案。"
                },
                { 
                  label: "AI 藝術生成", 
                  sub: "前瞻藝術科技融合", 
                  Icon: Sparkles, 
                  color: "text-purple-500", 
                  bg: "bg-purple-500/10",
                  content: "熟練運用 GPT Image & Nano Banana 等生成式 AI 工具，探索當代生成藝術新邊界。將最新科技無縫整合至實體與數位設計工作流中，打破傳統創作框架。"
                },
                { 
                  label: "全方位視覺整合", 
                  sub: "平面、影音、攝影", 
                  Icon: Palette, 
                  color: "text-blue-500", 
                  bg: "bg-blue-500/10",
                  content: "具備商業攝影、影音剪輯、2D/3D 動態設計與平面排版的全端設計能力。一條龍掌握每個視覺細節，確保品牌調性在多媒體間高度一致。"
                },
                { 
                  label: "商業與原創兼具", 
                  sub: "精準行銷與藝術 IP 開發", 
                  Icon: Zap, 
                  color: "text-emerald-500", 
                  bg: "bg-emerald-500/10",
                  content: "不僅打造過月銷破萬的爆款商業視覺，亦能從零到一開發具有靈魂的原創角色 IP (如 MuMㄠ)。完美平衡商業需求轉換與感性原創藝術性。"
                }
              ].map((highlight, index) => (
                <HighlightItem key={index} highlight={highlight} index={index} theme={theme} />
              ))}
            </div>
          </div>
        </section>

        {/* 區塊標題 & 卡片過濾器 */}
        <section id="portfolio-grid" className="space-y-8 scroll-mt-[48px] md:scroll-mt-[58px]">
          {/* 標題與分類選單緊湊排版包裝器 */}
          <div className="space-y-1 md:space-y-1.5 flex flex-col items-center w-full">
            <div className="max-w-3xl mx-auto text-center space-y-2 md:space-y-3">
              <h2 className={`text-3xl md:text-4xl font-display font-medium tracking-tight ${
                theme === "sepia" ? "text-[#2B1B0C]" : theme === "light" ? "text-zinc-900" : "text-white"
              }`}>
                探索設計作品
              </h2>
              <div className="flex flex-col items-center gap-3 pt-1">
                <div className="h-[2px] w-12 bg-amber-500 rounded-full"></div>
                <div className={`text-[12px] sm:text-[13px] font-medium tracking-wider flex items-center justify-center gap-2 sm:gap-3 ${
                  theme === "sepia" ? "text-[#8A5A32]/90" : theme === "light" ? "text-zinc-500" : "text-zinc-400"
                }`}>
                  <span className="flex items-center gap-1.5"><SlidersHorizontal className="w-3.5 h-3.5" /> 切換分類</span>
                  <span className="opacity-30">|</span>
                  <span className="flex items-center gap-1.5"><MousePointerClick className="w-3.5 h-3.5" /> 點擊卡片查看詳細資訊</span>
                </div>
              </div>
            </div>



            {/* 各類作品過濾選項 (電腦版精緻呈現，手機版優化為橫向滑動選單與二列極簡格狀面板) */}
            <div className={`w-full flex flex-col items-center gap-4 sticky top-[56px] md:top-[64px] z-30 py-2 sm:py-3 backdrop-blur-md transition-colors duration-300 ${
              theme === "sepia" ? "bg-[#FAF4E5]/80" : theme === "light" ? "bg-[#FAFAFA]/80" : "bg-[#0A0A0A]/80"
            }`}>
              <AnimatePresence>
                {tutorialStep === 1 && (
                  <TutorialTooltip 
                    key="tutorial-step-1"
                    step={1}
                    text="按此切換作品分類"
                    theme={theme}
                    onClick={() => { handleChangeCategory(); }}
                    pointerDirection="top"
                    className="bottom-[-50px] md:bottom-[-60px] left-1/2 -translate-x-1/2"
                  />
                )}
              </AnimatePresence>
            {/* 電腦版：雙行精緻置中選單 (md 尺寸及以上顯示) */}
            <div className="hidden md:flex w-full max-w-5xl flex-col items-center gap-2.5 sm:gap-3 px-4">
              {/* 第一行 */}
              <div className="w-full flex flex-wrap justify-center gap-1.5 sm:gap-2.5 py-0.5">
                {row1.map((cat) => (
                  <CategoryButton
                    key={cat}
                    cat={cat}
                    theme={theme}
                    isActive={selectedCategory === cat}
                    onClick={() => handleCategoryClick(cat)}
                  />
                ))}
              </div>
              
              {/* 第二行 */}
              <div className="w-full flex flex-wrap justify-center gap-1.5 sm:gap-2.5 py-0.5">
                {row2.map((cat) => (
                  <CategoryButton
                    key={cat}
                    cat={cat}
                    theme={theme}
                    isActive={selectedCategory === cat}
                    onClick={() => handleCategoryClick(cat)}
                  />
                ))}
              </div>
            </div>

            {/* 手機版：整合式橫向滑軌 + 摺疊網格快速選單 (md 尺寸以下顯示) */}
            <div className="w-full px-4 flex flex-col gap-3 md:hidden relative">
              <div className="flex items-center gap-2 w-full">
                {/* 左右微淡出遮罩 + 左右滑動選單軌道 */}
                <div className="relative flex-grow overflow-hidden rounded-full">
                  {/* 左側漸變淡出 */}
                  <div 
                    className={`absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r ${
                      theme === "sepia" 
                        ? "from-[#FAF4E5]" 
                        : theme === "light" 
                        ? "from-[#FAFAFA]" 
                        : "from-[#0A0A0A]"
                    } to-transparent z-10 pointer-events-none transition-opacity duration-300 ${
                      showCategoriesLeftMask ? "opacity-100" : "opacity-0"
                    }`} 
                  />
                  
                  {/* 滑動軌道本體 */}
                  <div 
                    ref={categoriesRef}
                    onScroll={handleCategoriesScroll}
                    className="flex gap-2 overflow-x-auto scrollbar-none py-1.5 px-4 w-full flex-nowrap whitespace-nowrap scroll-smooth relative"
                  >
                    {categories.map((cat) => (
                      <CategoryButton
                        key={cat}
                        cat={cat}
                        theme={theme}
                        isActive={selectedCategory === cat}
                        onClick={() => handleCategoryClick(cat)}
                      />
                    ))}
                  </div>

                  {/* 右側漸變淡出 & 橫向滑動暗示 */}
                  <div 
                    className={`absolute right-0 top-0 bottom-0 w-12 flex items-center justify-end pr-1.5 bg-gradient-to-l ${
                      theme === "sepia" 
                        ? "from-[#FAF4E5] via-[#FAF4E5]/80" 
                        : theme === "light" 
                        ? "from-[#FAFAFA] via-[#FAFAFA]/80" 
                        : "from-[#0A0A0A] via-[#0A0A0A]/80"
                    } to-transparent z-10 pointer-events-none transition-opacity duration-300 ${
                      showCategoriesRightMask ? "opacity-100" : "opacity-0"
                    }`} 
                  >
                    <ChevronRight className={`w-4 h-4 animate-pulse ${
                      theme === "sepia" ? "text-[#A05C2C]" : theme === "light" ? "text-zinc-500" : "text-zinc-400"
                    }`} />
                  </div>
                </div>

                {/* 網格展開 & 下拉清單按鈕 */}
                <button
                  type="button"
                  onClick={() => setIsMobileExpanded(!isMobileExpanded)}
                  className={`p-2.5 rounded-full border flex items-center justify-center shrink-0 transition-all duration-300 hover:scale-105 active:scale-95 ${
                    isMobileExpanded 
                      ? theme === "sepia"
                        ? "bg-[#C8A97A]/20 border-[#C8A97A] text-[#433422]"
                        : theme === "light"
                        ? "bg-amber-100 border-amber-300 text-amber-700"
                        : "bg-amber-500/20 border-amber-500/40 text-amber-400"
                      : theme === "sepia"
                        ? "bg-[#FAF4E5] border-[#EADECC] text-[#8C7B69] hover:bg-[#F3DFBD]"
                        : theme === "light"
                        ? "bg-white border-zinc-200 text-zinc-500 hover:bg-zinc-50"
                        : "bg-white/5 border-white/10 text-zinc-400 hover:bg-white/10"
                  }`}
                  title={isMobileExpanded ? "摺疊分類目錄" : "展開網格目錄"}
                >
                  <SlidersHorizontal className={`w-4 h-4 transition-transform duration-300 ${isMobileExpanded ? "rotate-90" : "rotate-0"}`} />
                </button>
              </div>

              {/* 手機版：展開的二列極簡格狀面板 */}
              <AnimatePresence>
                {isMobileExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, y: -8 }}
                    animate={{ opacity: 1, height: "auto", y: 0 }}
                    exit={{ opacity: 0, height: 0, y: -8 }}
                    className="overflow-hidden w-full z-10"
                    transition={{ duration: 0.25, ease: "easeOut" }}
                  >
                    <div className={`p-4 rounded-2xl border grid grid-cols-2 gap-2 shadow-2xl ${
                      theme === "sepia"
                        ? "bg-[#FAF4E5]/95 border-[#EADECC]/60 text-[#433422]"
                        : theme === "light"
                        ? "bg-white/95 border-zinc-200/60 text-zinc-800 shadow-zinc-200/50"
                        : "bg-zinc-900/90 backdrop-blur-md border-white/5 text-white"
                    }`}>
                      <div className="col-span-2 flex items-center justify-between px-1 mb-1 border-b border-white/5 pb-1.5 opacity-60">
                        <span className="text-[10px] uppercase tracking-wider font-mono">
                          🔍 快速篩選分類
                        </span>
                        <span className="text-[10px] font-sans">共 {categories.length} 個維度</span>
                      </div>
                      {categories.map((cat) => {
                        const isActive = selectedCategory === cat;
                        const catColor = getCategoryColor(cat);
                        return (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => {
                              handleCategoryClick(cat);
                              setIsMobileExpanded(false); // 點選後自動摺疊
                            }}
                            className={`w-full text-left py-2.5 px-3 rounded-xl text-xs font-medium border transition-all duration-200 flex items-center justify-between ${
                              isActive
                                ? theme === "sepia"
                                  ? "bg-[#F3DFBD] border-[#C8A97A] text-[#433422] font-semibold"
                                  : theme === "light"
                                  ? "bg-amber-100 border-amber-300 text-amber-800 font-semibold"
                                  : "bg-amber-500/25 border-amber-500/40 text-amber-400 font-semibold shadow-[0_0_12px_rgba(245,158,11,0.15)]"
                                : theme === "sepia"
                                  ? "bg-transparent border-[#EADECC]/45 text-[#8C7B69] hover:bg-[#FAF4E5]"
                                  : theme === "light"
                                  ? "bg-transparent border-zinc-200/50 text-zinc-600 hover:bg-zinc-100"
                                  : "bg-white/[0.02] border-white/5 text-zinc-400 hover:bg-white/[0.05]"
                            }`}
                          >
                            <span className="truncate">{cat === "All" ? "全部精選展示" : cat}</span>
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>
          </div>

          {/* 即時文字搜尋框 (完美支援黑/白/暖沙主題) */}
          <div className="max-w-md mx-auto px-4 sm:px-6">
            <div className={`relative group transition-all duration-500 ease-out transform focus-within:scale-[1.035] rounded-xl ${
              theme === "sepia"
                ? "focus-within:shadow-[0_12px_24px_-8px_rgba(115,76,34,0.18)]"
                : theme === "light"
                ? "focus-within:shadow-[0_12px_24px_-8px_rgba(217,119,6,0.12)]"
                : "focus-within:shadow-[0_12px_24px_-8px_rgba(245,158,11,0.225)]"
            }`}>
              {/* 微發光背景光暈效果 */}
              <div className={`absolute -inset-1 rounded-xl opacity-20 blur-sm transition-all duration-300 group-hover:opacity-30 ${
                theme === "sepia" 
                  ? "bg-amber-500/10 group-focus-within:bg-amber-500/20" 
                  : theme === "light" 
                  ? "bg-amber-500/10 group-focus-within:bg-amber-500/20" 
                  : "bg-amber-500/15 group-focus-within:bg-amber-500/30"
              }`} />
              
              <div className="relative flex items-center">
                <Search className={`absolute left-3.5 h-4 w-4 transition-colors duration-300 ${
                  theme === "sepia" 
                    ? "text-[#8C7B69] group-focus-within:text-amber-700"
                    : theme === "light" 
                    ? "text-zinc-400 group-focus-within:text-amber-500"
                    : "text-zinc-500 group-focus-within:text-amber-400"
                }`} />
                
                <input
                  type="text"
                  value={searchInputVal}
                  onChange={(e) => setSearchInputVal(e.target.value)}
                  placeholder="輸入名稱、工具或關鍵字進行模糊搜尋..."
                  className={`w-full pl-10 pr-24 py-2.5 rounded-xl border-2 text-xs font-sans tracking-wide transition-all duration-300 focus:outline-none focus:ring-0 ${
                    theme === "sepia"
                      ? "bg-[#FCF8EE] border-[#FAF4E5]/50 focus:border-amber-700/30 text-[#433422] placeholder-[#8C7B69]"
                      : theme === "light"
                      ? "bg-zinc-50 border-zinc-200/80 focus:border-amber-500/30 text-zinc-800 placeholder-zinc-400"
                      : "bg-zinc-900/80 border-white/5 focus:border-amber-500/20 text-zinc-100 placeholder-zinc-500"
                  }`}
                />

                {/* 右側清除功能與搜尋結果計數 badge */}
                <div className="absolute right-3 flex items-center gap-2">
                  {searchInputVal && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchInputVal("");
                        setSearchQuery("");
                      }}
                      className={`p-1 rounded-full transition-colors duration-200 cursor-pointer ${
                        theme === "sepia"
                          ? "hover:bg-[#FAF4E5] text-[#8C7B69] hover:text-amber-800"
                          : theme === "light"
                          ? "hover:bg-zinc-100 text-zinc-400 hover:text-zinc-700"
                          : "hover:bg-white/5 text-zinc-500 hover:text-white"
                      }`}
                      title="清除搜尋"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                  
                  {searchQuery.trim() && (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold transition-all duration-300 ${
                      theme === "sepia"
                        ? "bg-amber-500/10 text-amber-900"
                        : theme === "light"
                        ? "bg-amber-500/10 text-amber-800"
                        : "bg-amber-500/15 text-amber-400"
                    }`}>
                      {filteredItems.length}
                    </span>
                  )}
                </div>
              </div>


          </div>
          </div>



          {/* 作品卡片 RWD 呈現 */}
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3.5 sm:gap-6 lg:gap-8 min-h-[300px]">
            <AnimatePresence>
              {visibleItems.map((item, index) => {
                return (
                  
                  <motion.div 
                    layout="position" 
                    className="relative" 
                    key={item.id}
                    transition={{
                      type: "spring",
                      stiffness: 180,
                      damping: 18,
                      mass: 0.8
                    }}
                  >
                    {index === 0 && (tutorialStep === 1 || tutorialStep === 2) && (
                      <TutorialTooltip 
                        key={`tutorial-step-2-${tutorialStep}`}
                        step={2}
                        text="點開看詳情"
                        theme={deferredTheme}
                        onClick={() => { if (tutorialStep === 1) { nextTutorialStep(); nextTutorialStep(); } else { nextTutorialStep(); } setActiveModalItem(item); }}
                        pointerDirection="top"
                        className="-bottom-14 md:-bottom-16 left-1/2 -translate-x-1/2 z-[100]"
                      />
                    )}
                    <PortfolioCard
                      key={item.id}
                      item={item}
                      onClick={() => {
                        if (index === 0) {
                          if (tutorialStep === 1) {
                            nextTutorialStep();
                            nextTutorialStep();
                          } else if (tutorialStep === 2) {
                            nextTutorialStep();
                          }
                        }
                        setActiveModalItem(item);
                      }}
                      priority={index < 6}
                      index={index}
                      prevVisibleCount={prevVisibleCount}
                      theme={deferredTheme}
                      showAllDetails={false}
                      isFirst={index === 0}
                      selectedCategory={selectedCategory}
                    />
                  </motion.div>

                );
              })}
            </AnimatePresence>
          </div>

          {/* 手動載入更多按鈕與狀態顯示 */}
          <div className="w-full py-4 flex flex-col items-center justify-center gap-3 shrink-0">
            <AnimatePresence mode="wait">
              {filteredItems.length > visibleCount ? (
                <motion.div
                  key="load-more"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col items-center gap-4 w-full"
                >
                  <div className="flex justify-center w-full py-2">
                    <button
                      onClick={handleLoadMore}
                      className={`px-6 py-2.5 rounded-full text-xs font-medium tracking-widest transition-all duration-300 border flex items-center gap-2 active:scale-95 ${
                        theme === "light"
                          ? "bg-white hover:bg-zinc-50 text-zinc-600 border-zinc-200 shadow-sm"
                          : theme === "sepia"
                          ? "bg-[#FAF4E5] hover:bg-[#F0E6D2] text-[#8C7B69] border-[#EADECC]"
                          : "bg-[#1A1A1A] hover:bg-[#222] text-zinc-300 border-white/10 shadow-black/30"
                      }`}
                    >
                      <span>載入更多作品...</span>
                      <span className="opacity-50">({visibleCount} / {filteredItems.length})</span>
                    </button>
                  </div>
                </motion.div>
              ) : filteredItems.length > 0 ? (
                <motion.div
                  key="all-loaded"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col items-center gap-2 py-4"
                >
                  <div className={`h-px w-24 ${theme === 'dark' ? 'bg-white/5' : theme === 'sepia' ? 'bg-amber-900/10' : 'bg-zinc-200'}`} />
                  <span className={`text-[10px] uppercase font-mono tracking-widest ${theme === 'sepia' ? 'text-[#8C7B69]/60' : 'text-zinc-500'}`}>
                    ✦ 已顯示全數 {filteredItems.length} 項作品 • 感謝您的細緻賞析 ✦
                  </span>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>

          {filteredItems.length === 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 15, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -15, scale: 0.98 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className={`text-center py-20 px-6 rounded-2xl border transition-colors duration-300 relative overflow-hidden backdrop-blur-xs ${
                theme === "dark" 
                  ? "bg-[#0E0E0E]/50 border-white/5 text-zinc-100 shadow-xl shadow-black/25" 
                  : theme === "sepia" 
                  ? "bg-[#FCF5E3]/40 border-[#EADECC]/70 text-[#433422] shadow-xl shadow-amber-900/5" 
                  : "bg-zinc-50/75 border-zinc-200/80 text-zinc-900 shadow-xl shadow-zinc-200/20"
              }`}
            >
              {searchQuery.trim() ? (
                <>
                  <div className="relative mb-6">
                    {/* Animated Ripple Effects around Search Icon */}
                    <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-center pointer-events-none">
                      <div className="w-16 h-16 rounded-full bg-amber-500/10 animate-ping absolute duration-1000" />
                      <div className="w-24 h-24 rounded-full bg-amber-500/5 animate-pulse absolute duration-1000" />
                    </div>
                    <div className={`relative h-14 w-14 rounded-full flex items-center justify-center mx-auto shadow-md transition-all ${
                      theme === "dark" 
                        ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" 
                        : theme === "sepia"
                        ? "bg-[#EDE2CA]/95 text-amber-800 border border-[#DFCFA0]"
                        : "bg-amber-50 text-amber-600 border border-amber-200/80"
                    }`}>
                      <Search className="h-6 w-6 animate-pulse" />
                    </div>
                  </div>

                  <h4 className="font-display font-semibold text-lg mb-2 tracking-wide">
                    未找到與「{searchQuery.trim()}」相符的設計作品
                  </h4>
                  <p className={`text-xs max-w-md mx-auto leading-relaxed mb-6 font-light ${
                    theme === "dark" ? "text-[#8E8E93]" : theme === "sepia" ? "text-[#8C7B69]" : "text-zinc-500"
                  }`}>
                    找不到包含此關鍵字的展示。建議您精簡字詞、更換熱門推薦關鍵字，或點擊下方按鈕一鍵清除搜尋並重新探索。
                  </p>
                  
                  <div className="flex flex-wrap gap-3.5 justify-center">
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className={`inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all shadow-md active:scale-95 cursor-pointer border ${
                        theme === "dark"
                          ? "bg-amber-500 text-black hover:bg-amber-400 border-amber-400/20 shadow-amber-500/10"
                          : theme === "sepia"
                          ? "bg-amber-700 text-white hover:bg-amber-800 border-amber-850/20 shadow-amber-750/10"
                          : "bg-zinc-900 text-white hover:bg-zinc-800 border-zinc-805/20 shadow-zinc-900/10"
                      }`}
                    >
                      <X className="h-3.5 w-3.5" />
                      <span>清除搜尋條件</span>
                    </button>
                    {selectedCategory !== "All" && (
                      <button
                        type="button"
                        onClick={() => {
                          setSearchQuery("");
                          setSelectedCategory("All");
                        }}
                        className={`inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all active:scale-95 cursor-pointer border ${
                          theme === "dark"
                            ? "bg-zinc-950 border-white/5 hover:bg-zinc-900 text-zinc-300"
                            : theme === "sepia"
                            ? "bg-[#EDE2CA]/90 border-[#DFCFA0]/80 hover:bg-[#E2D5B9] text-[#4F3C28]"
                            : "bg-white border-zinc-250 hover:bg-zinc-100 text-zinc-650"
                        }`}
                      >
                        <span>回到全部分類</span>
                      </button>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div className="relative mb-5">
                    <div className={`h-14 w-14 rounded-full flex items-center justify-center mx-auto shadow-sm ${
                      theme === "dark" 
                        ? "bg-zinc-900 text-zinc-500 border border-white/5" 
                        : theme === "sepia"
                        ? "bg-[#EDE2CA]/90 text-[#8C7B69] border border-[#DFCFA0]/50"
                        : "bg-zinc-100 text-zinc-400 border border-zinc-200"
                    }`}>
                      <ShieldAlert className="h-6 w-6" />
                    </div>
                  </div>
                  <h4 className="font-display font-semibold text-sm mb-2">此特定類別下尚未登錄 core 作品</h4>
                  <p className={`text-xs max-w-sm mx-auto mb-5 leading-relaxed ${
                    theme === "sepia" ? "text-[#8C7B69]" : "text-zinc-500"
                  }`}>
                    在這個特定的維度中尚未建立作品，您可以秒速回到精彩的全版塊展示。
                  </p>
                  <button
                    type="button"
                    onClick={() => setSelectedCategory("All")}
                    className="inline-flex items-center gap-1 text-xs text-amber-500 hover:text-amber-600 font-medium cursor-pointer py-1.5 px-4 rounded-full border border-amber-500/20 hover:border-amber-500/40 transition-all uppercase font-mono tracking-wider bg-amber-500/5 hover:bg-amber-500/10 active:scale-95"
                  >
                    <span>返回展示全部類別</span>
                  </button>
                </>
              )}
            </motion.div>
          )}
        </section>

        {/* 設計師個人簡介 Bento 板塊 */}
        <DesignerBento 
          theme={theme} 
          profile={profile} 
          setIsContactCardOpen={setIsContactCardOpen} 
          onCopyEmail={copyEmailToClipboard} 
          setIsWorkflowOpen={setIsWorkflowOpen}
          triggerMascotSpeech={triggerMascotDialogue}
          onInteract={incrementInteraction}
          onBalloonFlyAway={triggerBalloonAchievement}
          onGravityRestore={() => {
            if (!gravityRestoreUnlocked) {
              setGravityRestoreUnlocked(true);
              try {
                localStorage.setItem("mumu_ach_gravity_restore", "true");
              } catch (e) {}
              triggerAchievementUnlock("重力掌控者 🌌");
            }
          }}
        />

        {/* 回到最上方與重置教學按鈕 */}
        <div id="section_scroll_to_top_bottom" className="flex justify-center pt-0 !mt-10 md:!mt-12 gap-3 sm:gap-4">
          <button
            type="button"
            id="btn_scroll_to_top_bottom"
            onClick={scrollToTop}
            className={`group px-6 py-3 rounded-full font-semibold text-xs transition-all duration-300 border flex items-center gap-2 shadow-lg cursor-pointer active:scale-95 ${
              theme === "light"
                ? "bg-white hover:bg-amber-500 text-zinc-650 hover:text-white border-zinc-200 hover:border-amber-400 shadow-sm hover:shadow-amber-500/10"
                : "bg-[#0E0E0E] hover:bg-amber-500 text-zinc-400 hover:text-black border-white/5 hover:border-amber-400 shadow-black/50 hover:shadow-amber-500/10"
            }`}
            title="回到最上方"
          >
            <ArrowUp className="h-4 w-4 transition-transform group-hover:-translate-y-0.5" />
            <span>回到頁面頂端</span>
          </button>

          <button
            type="button"
            onClick={() => {
              sessionStorage.setItem("mumu_tutorial_step", "1");
              window.location.reload();
            }}
            className={`group px-6 py-3 rounded-full font-semibold text-xs transition-all duration-300 border flex items-center gap-2 shadow-lg cursor-pointer active:scale-95 ${
              theme === "light"
                ? "bg-white hover:bg-amber-500 text-zinc-650 hover:text-white border-zinc-200 hover:border-amber-400 shadow-sm hover:shadow-amber-500/10"
                : "bg-[#0E0E0E] hover:bg-amber-500 text-zinc-400 hover:text-black border-white/5 hover:border-amber-400 shadow-black/50 hover:shadow-amber-500/10"
            }`}
            title="重新開始教學"
          >
            <RotateCcw className="h-4 w-4 transition-transform group-hover:-rotate-90" />
            <span>重新教學</span>
          </button>
        </div>

      </main>

      {/* 底部靜態版權聲明 - 典雅日式和風神社風格 */}
      <footer 
        id="footer-fortune"
        className={`mt-0 relative transition-all duration-300 border-t ${
          theme === "dark" 
            ? "bg-[#09090A] border-zinc-900 text-[#D4C4A8]" 
            : theme === "sepia"
            ? "bg-[#FAF6F0] border-[#DFCFA0]/60 text-[#3E2715]"
            : "bg-[#FCFAF7] border-zinc-200 text-[#18181B]"
        }`}
      >
        {/* 朱泥欄柵御簾 (Vermilion Shrine Fence Accent) */}
        <div className="h-1.5 w-full bg-[#D33F33] relative flex items-center justify-around overflow-hidden">
          {/* 金色卡榫節點 (Golden Joint Nodes) */}
          <div className="absolute inset-0 flex justify-around pointer-events-none opacity-30">
            {Array.from({ length: 16 }).map((_, i) => (
              <div key={i} className="w-1 h-full bg-[#C5A059]" />
            ))}
          </div>
        </div>

        {/* 左側：神社鳥居抽象線條剪影 (Abstract Torii Gate Vector Watermark) */}
        <svg 
          className={`absolute left-4 sm:left-10 md:left-16 bottom-0 h-28 sm:h-36 w-auto pointer-events-none select-none transition-all duration-300 z-0 ${
            theme === "dark" 
              ? "text-[#D33F33] opacity-[0.25]" 
              : theme === "sepia"
              ? "text-[#D33F33] opacity-[0.28]"
              : "text-[#D33F33] opacity-[0.20]"
          }`} 
          viewBox="0 0 120 120" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="1.5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <path d="M 10,25 Q 60,32 110,25" />
          <path d="M 12,20 Q 60,27 108,20" />
          <path d="M 20,40 L 100,40" />
          <path d="M 35,40 L 30,110" />
          <path d="M 85,40 L 90,110" />
          <path d="M 60,28 L 60,40" />
          <path d="M 25,110 L 35,110" />
          <path d="M 85,110 L 95,110" />
        </svg>

        {/* 右側：日式石燈籠抽象線條剪影 (Abstract Toro Lantern Vector Watermark) */}
        <svg 
          className={`absolute right-4 sm:right-10 md:right-16 bottom-0 h-28 sm:h-36 w-auto pointer-events-none select-none transition-all duration-300 z-0 ${
            theme === "dark" 
              ? "text-[#C5A059] opacity-[0.25]" 
              : theme === "sepia"
              ? "text-[#8C7B69] opacity-[0.28]"
              : "text-[#C5A059] opacity-[0.20]"
          }`} 
          viewBox="0 0 100 120" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="1.5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <path d="M 50,15 C 47,22 47,25 50,28 C 53,25 53,22 50,15 Z" />
          <path d="M 32,45 Q 50,32 68,45" />
          <path d="M 30,45 L 70,45" />
          <path d="M 30,45 L 35,40 L 65,40 L 70,45" />
          <rect x="38" y="45" width="24" height="24" rx="1" />
          <line x1="45" y1="45" x2="45" y2="69" />
          <line x1="55" y1="45" x2="55" y2="69" />
          <line x1="38" y1="57" x2="62" y2="57" />
          <path d="M 34,69 L 66,69 L 62,75 L 38,75 Z" />
          <path d="M 44,75 L 44,105 L 56,105 L 56,75 Z" />
          <path d="M 36,105 L 64,105 L 68,115 L 32,115 Z" />
        </svg>

        {/* 神社和紙纖維底紋與御神光 */}
        <div className="absolute inset-0 opacity-[0.012] pointer-events-none bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:12px_12px]" />
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: theme === "dark"
              ? "radial-gradient(circle at 50% 50%, rgba(211, 63, 51, 0.04) 0%, transparent 60%)"
              : "radial-gradient(circle at 50% 50%, rgba(197, 160, 89, 0.05) 0%, transparent 70%)"
          }}
        />

        <div className="max-w-7xl xl:max-w-[1400px] 2xl:max-w-[1600px] mx-auto px-6 sm:px-8 py-10 grid grid-cols-1 md:grid-cols-3 items-center gap-8 md:gap-4 relative z-30">
          
          {/* 左側：和風簽名與落款印章 */}
          <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4 text-center sm:text-left">
            {/* 朱泥落款印章 (Japanese Hanko Style Stamp) */}
            <div className="flex-shrink-0 flex items-center justify-center">
              <div 
                className="font-serif border-2 border-[#D33F33] text-[#D33F33] bg-[#D33F33]/5 font-black text-[12px] p-1 rounded-sm shadow-inner select-none flex items-center justify-center transition-transform hover:scale-105 duration-300"
                style={{ width: "42px", height: "42px" }}
              >
                <div className="grid grid-cols-2 gap-x-1 gap-y-0.5 leading-none font-bold text-center">
                  <span>博</span>
                  <span>李</span>
                  <span>印</span>
                  <span>凱</span>
                </div>
              </div>
            </div>
            <div>
              <h5 className="font-serif font-bold text-xs tracking-[0.15em] mb-1">
                李凱博 視覺與品牌整合手札
              </h5>
              <p className={`font-mono text-[10px] tracking-wide ${
                theme === "dark" ? "text-zinc-500" : theme === "sepia" ? "text-[#8C7B69]/80" : "text-zinc-400"
              }`}>
                Cape Lee © 2026 Portfolio
              </p>
            </div>
          </div>
          
          {/* 中間：神社運勢御神籤 (Fortune Teller) & 姆貓成就御守 (Omamori) */}
          <div 
            style={{ background: "transparent", backgroundColor: "transparent", boxShadow: "none", border: "none" }}
            className="flex flex-col items-center justify-center gap-4 relative z-50 bg-transparent"
          >
            <div 
              style={{ background: "transparent", backgroundColor: "transparent", boxShadow: "none", border: "none" }}
              className="flex items-end gap-10 md:gap-14 justify-center bg-transparent"
            >
              {/* 神社運勢御神籤 */}
              <div 
                style={{ background: "transparent", backgroundColor: "transparent", boxShadow: "none", border: "none" }}
                className="flex flex-col items-center gap-1.5 relative z-50 bg-transparent"
              >
                {tutorialStep >= 4 && tutorialStep <= 8 && !tutorialDismissed7 && (
                  <TutorialTooltip 
                    key={`tutorial-step-7-${tutorialStep}`}
                    step={7}
                    text="試試今天手氣"
                    theme={theme}
                    vertical={true}
                    onClick={() => { setTutorialDismissed7(true); nextTutorialStep(); document.getElementById("btn_mumu_fortune_ema")?.click(); }}
                    pointerDirection="right"
                    className="absolute right-full mr-3 sm:mr-4 top-1/2 -translate-y-1/2"
                  />
                )}
                <React.Suspense fallback={<div className="w-[56px] h-[94px] flex items-center justify-center"><div className="w-4 h-4 rounded-full border border-amber-500/30 border-t-amber-500 animate-spin" /></div>}>
                  <CatFortuneTeller theme={theme} onConsult={handleFortuneConsult} />
                </React.Suspense>
                <span className={`text-[8px] font-serif tracking-[0.25em] uppercase opacity-35 select-none`}>
                  御神籤
                </span>
              </div>
              
              {/* 姆貓成就御守 */}
              <div 
                style={{ background: "transparent", backgroundColor: "transparent", boxShadow: "none", border: "none" }}
                className="flex flex-col items-center gap-1.5 relative z-50 bg-transparent"
              >
                {(() => {
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
                    tutorialAchUnlocked
                  ].filter(Boolean).length;
                  
                  return (
                    <>
                      {tutorialStep >= 4 && tutorialStep <= 8 && !tutorialDismissed8 && (
                        <TutorialTooltip 
                          key={`tutorial-step-8-${tutorialStep}`}
                          step={8}
                          text="蒐集專屬成就"
                          theme={theme}
                          vertical={true}
                          onClick={() => { setTutorialDismissed8(true); nextTutorialStep(); certModalRef.current?.open(); }}
                          pointerDirection="left"
                          className="absolute left-full ml-3 sm:mr-4 top-1/2 -translate-y-1/2"
                        />
                      )}
                      <motion.button
                        onClick={() => {
                          if (tutorialStep >= 4 && tutorialStep <= 8 && !tutorialDismissed8) {
                            setTutorialDismissed8(true);
                            nextTutorialStep();
                          }
                          certModalRef.current?.open();
                          try {
                            playMeowSound();
                          } catch (e) {}
                        }}
                        style={{ 
                          transformOrigin: "top center", 
                          background: "transparent", 
                          backgroundColor: "transparent", 
                          border: "none", 
                          outline: "none", 
                          boxShadow: "none" 
                        }}
                        whileHover={{ 
                          rotate: [0, -8, 6, -5, 4, 0],
                          scale: 1.05,
                          transition: { duration: 1.2, ease: "easeInOut" }
                        }}
                        whileTap={{ scale: 0.95 }}
                        type="button"
                        id="btn_mumu_certified_badge"
                        className="relative cursor-pointer group flex flex-col items-center bg-transparent border-0 p-0 outline-none shadow-none z-50"
                      >
                        {/* 完美和風御守本體 */}
                        <div 
                          style={{ background: "transparent", backgroundColor: "transparent" }}
                          className="w-14 h-[94px] relative flex flex-col items-center justify-center pb-2 pt-[22px] gap-2.5 px-1.5 bg-transparent border-0"
                        >
                          {/* 背景 SVG */}
                          <svg 
                            width="56" 
                            height="94" 
                            viewBox="0 0 56 94" 
                            style={{ background: "transparent", backgroundColor: "transparent" }}
                            className="absolute inset-0 w-full h-full pointer-events-none drop-shadow-[0_3px_5px_rgba(0,0,0,0.15)] dark:drop-shadow-[0_4px_8px_rgba(0,0,0,0.45)] bg-transparent"
                          >
                            <defs>
                              <linearGradient id="omamori-sepia" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#A04035" />
                                <stop offset="100%" stopColor="#732219" />
                              </linearGradient>
                              <linearGradient id="omamori-light" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#FDF2F4" />
                                <stop offset="100%" stopColor="#F5D6DA" />
                              </linearGradient>
                              <linearGradient id="omamori-dark" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#1C1625" />
                                <stop offset="100%" stopColor="#0D0A12" />
                              </linearGradient>
                            </defs>

                            <line 
                              x1="28" 
                              y1="2" 
                              x2="28" 
                              y2="14" 
                              stroke={
                                theme === "sepia" 
                                  ? "#E8D4A2" 
                                  : theme === "light" 
                                  ? "rgba(244, 63, 94, 0.85)" 
                                  : "rgba(245, 158, 11, 0.8)"
                              } 
                              strokeWidth="1.5" 
                              strokeLinecap="round" 
                            />
                            
                            <circle 
                              cx="28" 
                              cy="2" 
                              r="1.5" 
                              fill={
                                theme === "sepia" 
                                  ? "#EAD09D" 
                                  : theme === "light" 
                                  ? "#F43F5E" 
                                  : "#FBBF24"
                              } 
                            />

                            <polygon 
                              points="11.2,14 44.8,14 56,30 56,94 0,94 0,30" 
                              fill={
                                theme === "sepia"
                                  ? "url(#omamori-sepia)"
                                  : theme === "light"
                                  ? "url(#omamori-light)"
                                  : "url(#omamori-dark)"
                              }
                              stroke={
                                theme === "sepia"
                                  ? "rgba(232, 212, 162, 0.25)"
                                  : theme === "light"
                                  ? "rgba(244, 143, 177, 0.25)"
                                  : "rgba(245, 158, 11, 0.15)"
                              }
                              strokeWidth="1"
                            />

                            <polygon 
                              points="11.6,16 44.4,16 54,30.4 54,92 2,92 2,30.4" 
                              fill="none"
                              stroke={
                                theme === "sepia"
                                  ? "#E8D4A2"
                                  : theme === "light"
                                  ? "#F472B6"
                                  : "#F59E0B"
                              }
                              strokeWidth="1"
                              strokeDasharray="3,2"
                              strokeOpacity={
                                theme === "sepia" ? 0.35 : theme === "light" ? 0.45 : 0.25
                              }
                            />
                          </svg>

                          {/* 結繩裝飾 */}
                          <div className="w-6 h-3 flex items-center justify-center relative z-10">
                            <svg viewBox="0 0 24 12" className={`w-full h-full fill-none ${
                              theme === "sepia" ? "stroke-[#E8D4A2]" : theme === "light" ? "stroke-pink-500" : "stroke-amber-400"
                            }`} strokeWidth="1.5">
                              <path d="M12,4 C6,0 4,8 12,6 C20,8 18,0 12,4 Z" />
                              <path d="M12,6 L9,11 M12,6 L15,11" />
                            </svg>
                          </div>

                          {/* 直式文字：姆貓御守 */}
                          <div className={`flex flex-col items-center leading-[1.1] tracking-[0.05em] font-serif relative z-10 -mt-1 font-extrabold text-[10px] ${
                            theme === "sepia" ? "text-[#FCF8EE]" : theme === "light" ? "text-pink-700" : "text-amber-400"
                          }`}>
                            <span>御</span>
                            <span>守</span>
                          </div>

                        </div>
                      </motion.button>
                    </>
                  );
                })()}
                <span className={`text-[8px] font-serif tracking-[0.25em] uppercase opacity-35 select-none`}>
                  姆貓御守
                </span>
              </div>
            </div>
            
            <span className={`text-[9px] font-serif tracking-[0.2em] uppercase opacity-40 mt-1 select-none`}>
              ◆ 神社祝願 · 諸事亨通 ◆
            </span>
          </div>

          {/* 右側：傳統神社歲時記與祝福語 */}
          <div className="flex flex-col items-center md:items-end justify-center text-center md:text-right gap-1 font-serif select-none">
            <div className="flex items-center gap-2 text-xs font-bold text-[#D33F33]">
              <span>⛩️</span>
              <span className="tracking-[0.25em]">厄除開運 · 諸願成就</span>
              <span>🐾</span>
            </div>
            <p className={`text-[10px] tracking-[0.15em] mt-1 ${
              theme === "dark" ? "text-zinc-500" : theme === "sepia" ? "text-[#8C7B69]" : "text-zinc-500"
            }`}>
              令和八年 丙午年 盛夏 誌
            </p>
            <span className={`text-[8px] font-sans tracking-[0.1em] opacity-45 uppercase ${
              theme === "dark" ? "text-zinc-600" : theme === "sepia" ? "text-[#8C7B69]/60" : "text-zinc-400"
            }`}>
              Mumiao Shrine Ritual Center
            </span>
          </div>

        </div>
      </footer>

      {/* 全域作品亮點彈出 Lightbox (Lightbox Modal with motion) */}
      <AnimatePresence>
        {activeModalItem && (
          <React.Suspense fallback={null}>
            <PortfolioDetailModal
              activeModalItem={activeModalItem}
              onClose={() => setActiveModalItem(null)}
              filteredItems={filteredItems}
              onPrevItem={handlePrevModalItem}
              onNextItem={handleNextModalItem}
            />
          </React.Suspense>
        )}
      </AnimatePresence>

      {/* AI 設計輔助工作流彈出框 (Workflow Bottom Sheet / Modal) */}
      <React.Suspense fallback={null}>
        <AIWorkflowModal
          isOpen={isWorkflowOpen}
          onClose={() => setIsWorkflowOpen(false)}
          theme={theme}
        />
      </React.Suspense>

      {/* 傳統 vCard 數位名片與 QR Code 彈出視窗 */}
      <React.Suspense fallback={null}>
        <ContactModal
          isOpen={isContactCardOpen}
          onClose={() => setIsContactCardOpen(false)}
          theme={theme}
          profile={profile}
          downloadVCard={downloadVCard}
          vCardText={vCardText}
        />
      </React.Suspense>

      {/* 角色插畫類別配置：右下角生動彈出裝飾（極高解析度 GPU 隔離渲染） */}
      {(tutorialStep === 0 || tutorialStep >= 4) && (
        <InteractiveMascot 
          currentMascot={currentMascot}
          theme={deferredTheme}
          activeModalItem={activeModalItem}
          isWorkflowOpen={isWorkflowOpen}
          isContactCardOpen={isContactCardOpen}
          scrollSectionVisible={isMascotVisibleByScroll}
          onInteract={incrementInteraction}
          onRandomProject={handleRandomProject}
          onHighlightProject={handleHighlightProject}
          onChangeCategory={handleChangeCategory}
        />
      )}

      {/* 懸浮回到最上方按鈕 */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            onClick={scrollToTop}
            type="button"
            id="btn_scroll_to_top_floating"
            className={`fixed bottom-6 left-6 md:left-auto md:right-6 z-40 p-3 rounded-full transition-all duration-300 shadow-2xl flex items-center justify-center cursor-pointer border group active:scale-90 ${
              theme === "light"
                ? "bg-white hover:bg-amber-500 text-zinc-650 hover:text-white border-zinc-200 hover:border-amber-400 shadow-md hover:shadow-amber-500/15"
                : "bg-[#0E0E0E] hover:bg-amber-500 text-zinc-300 hover:text-black border-white/5 hover:border-amber-400 shadow-black/85 hover:shadow-amber-500/25"
            }`}
            title="回到最上方"
          >
            <ArrowUp className="h-5 w-5 transition-transform group-hover:-translate-y-0.5" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* 姆貓認證證書 Modal */}
      <MumuCertModal 
        ref={certModalRef}
        theme={theme}
        interactionCount={interactionCount}
        midnightUnlocked={midnightUnlocked}
        visitedThemes={visitedThemes}
        fortuneCount={fortuneCount}
        viewedProjects={viewedProjects}
        zenUnlocked={zenUnlocked}
        socialUnlocked={socialUnlocked}
        slackerUnlocked={slackerUnlocked}
        aiWizardUnlocked={aiWizardUnlocked}
        premiumCanUnlocked={premiumCanUnlocked}
        balloonUnlocked={balloonUnlocked}
        magicMumuUnlocked={magicMumuUnlocked}
        gravityRestoreUnlocked={gravityRestoreUnlocked}
        pdfUnlocked={pdfUnlocked}
        tutorialAchUnlocked={tutorialAchUnlocked}
        windStormUnlocked={windStormUnlocked}
        rareCollectorUnlocked={rareCollectorUnlocked}
        spawnedRareTypes={spawnedRareTypes}
        setHeroParticles={(action) => heroSectionRef.current?.setHeroParticles(action)}
        setTitleBounceTrigger={(action) => heroSectionRef.current?.setTitleBounceTrigger(action)}
      />

      {/* 榮譽成就解鎖通知 (Achievement Unlocked Toast) */}
      <AnimatePresence>
        {unlockedAchToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.85 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9, transition: { duration: 0.2 } }}
            onClick={() => {
              certModalRef.current?.open();
              setUnlockedAchToast(null);
            }}
            className={`fixed bottom-6 right-6 z-[999999] p-4 rounded-xl border shadow-2xl flex items-center gap-3.5 max-w-xs cursor-pointer hover:scale-[1.02] active:scale-95 transition-transform duration-200 ${
              theme === "sepia"
                ? "bg-[#FCF8EE] border-[#A05C2C]/30 text-[#4F3C28]"
                : theme === "light"
                ? "bg-white border-amber-500/35 text-zinc-800 shadow-amber-500/15"
                : "bg-[#121212]/95 border-amber-500/40 text-zinc-100 shadow-amber-500/30 backdrop-blur-md"
            }`}
          >
            <div className="p-2.5 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-lg text-zinc-950 shadow-md flex-shrink-0 animate-bounce" style={{ animationDuration: "2s" }}>
              <Award className="h-5 w-5" />
            </div>
            <div className="flex-1 text-left">
              <span className="block text-[9px] font-bold tracking-wider text-amber-500 uppercase">榮譽成就解鎖！</span>
              <h4 className="text-xs font-bold tracking-wide mt-0.5">{unlockedAchToast}</h4>
              <p className="text-[10px] opacity-75 mt-0.5 leading-relaxed">
                恭喜獲得特別榮譽！點擊此處立即查看您的成就御守。
              </p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setUnlockedAchToast(null);
              }}
              className="text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer self-start p-1"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 炫彩色彩漣漪 (Color Ripple) */}
      <AnimatePresence>
        {ripples.map((ripple) => (
          <div
            key={ripple.id}
            className="fixed inset-0 pointer-events-none z-[99999]"
            style={{ overflow: "hidden" }}
          >
            {/* Concentric expanding color wave 1 */}
            <motion.div
              initial={{ 
                position: "absolute",
                left: ripple.x,
                top: ripple.y,
                x: "-50%",
                y: "-50%",
                width: 0,
                height: 0,
                opacity: 1,
                borderRadius: "9999px",
                background: "radial-gradient(circle, rgba(236,72,153,0.6) 0%, rgba(139,92,246,0.4) 50%, rgba(59,130,246,0) 70%)"
              }}
              animate={{ 
                width: "350vmax",
                height: "350vmax",
                opacity: 0
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.6, ease: "easeOut" }}
              onAnimationComplete={() => {
                setRipples((prev) => prev.filter((r) => r.id !== ripple.id));
              }}
            />
            {/* Concentric expanding color wave 2 (delayed slightly for prism shimmer) */}
            <motion.div
              initial={{ 
                position: "absolute",
                left: ripple.x,
                top: ripple.y,
                x: "-50%",
                y: "-50%",
                width: 0,
                height: 0,
                opacity: 0.8,
                borderRadius: "9999px",
                background: "radial-gradient(circle, rgba(251,191,36,0.5) 0%, rgba(236,72,153,0.3) 40%, rgba(16,185,129,0) 70%)"
              }}
              animate={{ 
                width: "300vmax",
                height: "300vmax",
                opacity: 0
              }}
              transition={{ duration: 1.4, delay: 0.15, ease: "easeOut" }}
            />
          </div>
        ))}
      </AnimatePresence>

      {/* 隱藏奇幻領域提示 (Magic Palette Hidden Realm Alert) */}
      <AnimatePresence>
        {magicAlert && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: -50, x: "-50%" }}
            animate={{ opacity: 1, scale: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, scale: 0.8, y: -20, x: "-50%", transition: { duration: 0.25 } }}
            className={`fixed top-8 left-1/2 -translate-x-1/2 z-[100000] px-6 py-4 rounded-2xl border shadow-2xl flex items-center gap-3.5 max-w-sm backdrop-blur-md animate-pulse [animation-duration:3s] ${
              theme === "sepia"
                ? "bg-[#FCF8EE]/95 border-[#A05C2C]/40 text-[#4F3C28] shadow-[#A05C2C]/20"
                : theme === "light"
                ? "bg-white/95 border-amber-400/40 text-zinc-800 shadow-amber-500/20"
                : "bg-zinc-900/95 border-purple-500/40 text-zinc-100 shadow-purple-500/35"
            }`}
          >
            {/* Prismatic gradient glowing border */}
            <div className="absolute inset-0 rounded-2xl border-2 border-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 opacity-30 -z-10 blur-sm pointer-events-none" />
            
            <div className="p-2.5 bg-gradient-to-br from-purple-500 via-pink-500 to-yellow-500 rounded-xl text-white shadow-md flex-shrink-0">
              <Sparkles className="h-5 w-5 animate-spin" style={{ animationDuration: "3s" }} />
            </div>
            <div className="flex-1 text-left">
              <span className="block text-[10px] font-bold tracking-wider text-purple-500 dark:text-purple-400 uppercase font-sans">🔮 系統提示 🔮</span>
              <h4 className="text-sm font-bold tracking-wide mt-1">您已暫時進入隱藏奇幻領域！</h4>
              <p className="text-[11px] opacity-80 mt-1 leading-relaxed">
                幻彩調色盤釋放了被封印的色彩魔法，網頁主題已隨機切換。
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
