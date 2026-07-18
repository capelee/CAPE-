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
  ArrowUpRight,
  ShieldAlert,
  ZoomIn,
  ZoomOut,
  Sun,
  Moon,
  Eye,
  Instagram,
  ArrowUp,
  Maximize2,
  Minimize2,
  Search,
  Image as ImageIcon,
  QrCode,
  Download,
  SlidersHorizontal,
  FileText
} from "lucide-react";
import { motion, AnimatePresence, useDragControls, useMotionValue, useSpring, animate } from "motion/react";
import { PortfolioItem, MascotCharacter } from "./types";
import { categoryMascotMap } from "./utils/mascotData";
import { EXISTING_OPTIMIZED_IMAGES } from "./existingImages";

import { YT_THUMBNAIL_CACHE, DRIVE_THUMBNAIL_CACHE, saveYtCacheToStorage, saveDriveCacheToStorage, extractYoutubeId, extractDriveId, getOptimizedGoogleUrl, resolveImageUrl } from "./utils";
import { animaleseSynth } from "./utils/animalese";
import { playMeowSound, playCanClinkSound, catPurr } from "./utils/audioEffects";

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
import { AIWorkflowModal } from "./components/AIWorkflowModal";
import { ContactModal } from "./components/ContactModal";
import { PortfolioDetailModal } from "./components/PortfolioDetailModal";
import { CatFortuneTeller } from "./components/CatFortuneTeller";
import { CatFootprintsLayer } from "./components/CatFootprintsLayer";

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
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const now = ctx.currentTime;

    // A beautiful complex bell/chime chime with sharp attack and lingering decay
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const osc3 = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc1.type = "sine";
    osc1.frequency.setValueAtTime(987.77, now); // B5 note
    osc1.frequency.exponentialRampToValueAtTime(1975.53, now + 0.12); // slides upward beautifully

    osc2.type = "sine";
    osc2.frequency.setValueAtTime(1318.51, now); // E6 note for a pleasant chord
    osc2.frequency.exponentialRampToValueAtTime(2637.02, now + 0.12);

    osc3.type = "triangle";
    osc3.frequency.setValueAtTime(1567.98, now); // G6 note
    osc3.frequency.exponentialRampToValueAtTime(3135.96, now + 0.15);

    gainNode.gain.setValueAtTime(0.001, now);
    gainNode.gain.linearRampToValueAtTime(0.25, now + 0.05); // sharp magical attack
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 1.4); // lingering magical chime decay

    osc1.connect(gainNode);
    osc2.connect(gainNode);
    osc3.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc3.start(now);
    osc1.stop(now + 1.5);
    osc2.stop(now + 1.5);
    osc3.stop(now + 1.5);
  } catch (e) {
    // Safety fallback
  }
};

export default function App() {
  const [mounted, setMounted] = useState<boolean>(false);
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const initialDataRef = React.useRef<PortfolioItem[]>([]);
  
  React.useEffect(() => {
    setMounted(true);
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
        if (item.driveFolderId) {
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
          }).catch(err => {
            console.error(`Failed to dynamically fetch images for folder ${item.driveFolderId}:`, err);
          });
        }
      });
    };

    const loadLocalData = () => {
      import("./data").then(module => {
        const initialItems = module.initialPortfolioData;
        initialDataRef.current = initialItems;
        setItems(initialItems);
        setupFolderImages(initialItems);
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
          initialDataRef.current = res.data;
          setItems(res.data);
          setupFolderImages(res.data);
        } else {
          loadLocalData();
        }
      })
      .catch(() => {
        loadLocalData();
      });
  }, []);

  // Theme state: "dark" | "light" | "sepia" (stores user preference in localStorage)
  const [theme, setTheme] = useState<"dark" | "light" | "sepia">(() => {
    try {
      const saved = localStorage.getItem("capelee_theme");
      if (saved === "light" || saved === "dark" || saved === "sepia") {
        return saved;
      }

      // 根據使用者系統偏好自動設定初始主題，若無偏好則維持預設的護眼暖沙 (sepia)
      if (typeof window !== "undefined" && window.matchMedia) {
        if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
          return "dark";
        } else if (window.matchMedia("(prefers-color-scheme: light)").matches) {
          return "light";
        }
      }
      return "sepia";
    } catch {
      return "sepia";
    }
  });

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

  const changeTheme = (newTheme: "dark" | "light" | "sepia") => {
    setTheme(newTheme);
    try {
      localStorage.setItem("capelee_theme", newTheme);
    } catch (e) {
      console.error(e);
    }
    setIsThemeMenuOpen(false);
  };

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : theme === "light" ? "sepia" : "dark";
    changeTheme(nextTheme);
  };

  const [selectedCategory, setSelectedCategory] = useState<string>("亮點設計");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchInputVal, setSearchInputVal] = useState<string>("");
  const [visibleCount, setVisibleCount] = useState<number>(12);
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
    setVisibleCount(12);
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
            "name": "李品賢 (Cape Lee)",
            "alternateName": "Cape Lee",
            "email": "capelee0715@gmail.com",
            "jobTitle": "Designer & Creative Specialist"
          },
          "publisher": {
            "@type": "ProfilePage",
            "name": "李品賢 (Cape Lee) - Creative Showcase",
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
  const [isLoading, setIsLoading] = useState<boolean>(false);

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

  React.useEffect(() => {
    setIsLoading(true);
    setLoadingProgress(15);
    
    // Set up sequential timers to simulate a super crisp loading bar
    const t1 = setTimeout(() => setLoadingProgress(45), 80);
    const t2 = setTimeout(() => setLoadingProgress(75), 180);
    const t3 = setTimeout(() => {
      setLoadingProgress(100);
      const t4 = setTimeout(() => {
        setIsLoading(false);
      }, 200);
    }, 300);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  const [activeModalItem, setActiveModalItem] = useState<PortfolioItem | null>(null);
  const [isWorkflowOpen, setIsWorkflowOpen] = useState<boolean>(false);
  const [isContactCardOpen, setIsContactCardOpen] = useState<boolean>(false);
  const loaderRef = React.useRef<HTMLDivElement | null>(null);
  const isJumpingToBentoRef = React.useRef<boolean>(false);

  // 當開啟作品細節 Lightbox Modal、我的工作流 Modal 或聯絡資訊 Modal 時，對 Body 進行滾動鎖定，確保手持裝置體驗如 Native App 般精確穩定
  React.useEffect(() => {
    if (activeModalItem || isWorkflowOpen || isContactCardOpen) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
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
  const [heroDialogueIndex, setHeroDialogueIndex] = useState<number>(0);
  const [displayedDialogue, setDisplayedDialogue] = useState<string>("");
  const [heroParticles, setHeroParticles] = useState<{ id: number; x: number; y: number; emoji: string }[]>([]);
  const [titleBounceTrigger, setTitleBounceTrigger] = useState<number>(0);

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
  const [isCertModalOpen, setIsCertModalOpen] = useState<boolean>(false);

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

  const canX = useMotionValue(0);
  const canY = useMotionValue(0);
  const canRotate = useMotionValue(0);
  const mascotRef = React.useRef<HTMLDivElement>(null);
  const canRef = React.useRef<HTMLDivElement>(null);
  const canPhysicsId = React.useRef<number | null>(null);

  const [canFlavor, setCanFlavor] = useState<"tuna" | "chicken" | "luxury">("luxury");

  const FLAVOR_PHYSICS = {
    tuna: {
      name: "鮮嫩鮪魚罐",
      emoji: "🐟",
      elasticity: 0.76,
      rotationalInertia: 1.45,
      topLidFill: "#3B82F6",
      topLidStroke: "#1D4ED8",
      innerLidFill: "#60A5FA",
      bodyGradient: "metallicBlueGradient",
      labelFill: "#2563EB",
      labelPatternFill: "#EFF6FF"
    },
    chicken: {
      name: "香嫩雞肉罐",
      emoji: "🐓",
      elasticity: 0.52,
      rotationalInertia: 0.85,
      topLidFill: "#EF4444",
      topLidStroke: "#B91C1C",
      innerLidFill: "#F87171",
      bodyGradient: "metallicRedGradient",
      labelFill: "#DC2626",
      labelPatternFill: "#FEF2F2"
    },
    luxury: {
      name: "極致豪華罐",
      emoji: "👑",
      elasticity: 0.88,
      rotationalInertia: 2.3,
      topLidFill: "#FBBF24",
      topLidStroke: "#D97706",
      innerLidFill: "#FCD34D",
      bodyGradient: "metallicGoldGradient",
      labelFill: "#F59E0B",
      labelPatternFill: "#FEF3C7"
    }
  };

  const handleCanDragStart = () => {
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
    setHeroParticles((prev) => [...prev, ...explosionParticles].slice(-100));

    if (!premiumCanUnlocked) {
      setPremiumCanUnlocked(true);
      try {
        localStorage.setItem("mumu_ach_premium_can", "true");
      } catch (e) {}
      triggerAchievementUnlock("極致奢華罐罐奉納 🥫");
    }

    setHeroDialogue("喵嗚！太美味了吧！這就是極致奢華的貓罐罐奉納嗎？😻🥫✨ 本教主心情大好，特許你擁有無上福報、諸願成就！🐾");
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
    setHeroParticles((prev) => [...prev, ...newParticles].slice(-60));

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
  const handleFortuneConsult = () => {
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
  };

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
    
    heroTypingIntervalRef.current = setInterval(() => {
      if (i < heroDialogue.length) {
        currentText += heroDialogue[i];
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
      
      heroAutoCloseTimeoutRef.current = setTimeout(() => {
        setIsHeroSpeaking(false);
        setShowHeroDialogue(false);
      }, 2000); // 2 seconds
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
    
    const interval = setInterval(() => {
      if (i < navDialogue.length) {
        currentText += navDialogue[i];
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
    "這隻白貓是我的原創 IP 角色 MuMㄠ 喔！是不是很可愛呢？🐾",
    "在右下角還有我們的 12 隻專業恐龍與吉祥物戰隊，也可以找他們聊天喔！🦖",
    "我的原創 IP 插畫音樂祭粉專開張囉！歡迎點擊氣泡下方的前往按鈕追蹤 MuMㄠ（姆貓教）的 IG 吧！🎸🐾",
    "對本教主「快速連續點擊 15 次」，就能解鎖神秘隱藏的「魔法姆貓」夢幻變身姿態喔！✨🪄🐾",
    "想要測測今天的運勢與求籤開運嗎？點選下方按鈕可以直接導引至最底下的「今日姆貓運勢」求得吉籤喔！⛩️🥫🔮"
  ], []);

  const lastHeroClickTimeRef = React.useRef<number>(0);

  const triggerHeroSpeaking = () => {
    // Select next sequential index and rotate
    const currentIdx = heroDialogueIndex % heroDialogues.length;
    setHeroDialogueIndex((prev) => (prev + 1) % heroDialogues.length);
    
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

  const handleHeroClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // 統計使用者在 Hero Section 的互動次數
    incrementInteraction();

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
    setHeroParticles((prev) => [...prev, newParticle].slice(-20));

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
    setTitleBounceTrigger((prev) => prev + 1);
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

  const headerBg = React.useMemo(() => {
    if (!isScrolled) {
      if (theme === "light") {
        return "rgba(255, 255, 255, 0.8)";
      } else if (theme === "sepia") {
        return "rgba(250, 244, 229, 0.8)";
      } else {
        return "rgba(7, 7, 7, 0.8)";
      }
    }
    if (theme === "light") {
      return "rgba(255, 255, 255, 0.98)";
    } else if (theme === "sepia") {
      return "rgba(250, 244, 229, 0.98)";
    } else {
      return "rgba(7, 7, 7, 0.98)";
    }
  }, [isScrolled, theme]);

  const headerBlur = React.useMemo(() => {
    if (!isScrolled) {
      return "blur(8px)";
    }
    return "blur(24px)";
  }, [isScrolled]);

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
    name: "Cape Lee",
    engName: "capelee",
    title: "特約專案設計師",
    company: "立陽鴻企業禮贈品",
    school: "環球科技大學",
    dept: "創意商品設計學系 畢業",
    experience: "5 ~ 6 年品牌商業整合設計實戰經驗",
    desireTitle: "視覺設計師 / 平面設計師",
    email: "capelee0715@gmail.com",
    portfolioUrl: "https://drive.google.com/file/d/1rjJsddL0kOvYSL-1T-bBxmwn5iZcX-pO/view?usp=drive_link", 
    pdfPortfolioUrl: "https://drive.google.com/file/d/1rjJsddL0kOvYSL-1T-bBxmwn5iZcX-pO/view?usp=drive_link", 
    intro: "擁有 6 年以上品牌商業整合設計實戰經驗，經手超過百個品牌、逾千件商品視覺製作，熟悉電商、醫療、文創等多元產業。具備視覺設計、商業攝影、品牌識別、影音製作與生成式 AI 工作流整合之全方位能力，作品涵蓋月銷破萬電商視覺、客家電視台邀約插畫、個人原創 IP 角色開發及企業 CIS 規劃，致力於將品牌價值轉化為最精準、最具張力的視覺語言。",
    education: [
      { school: "環球科技大學", dept: "創意商品設計學系", info: "大學畢業", activities: ["系學會會長", "系學會美宣長", "畢籌會美宣長"] },
      { school: "復興美工", dept: "美工科設計組", info: "經典設計本科學府", activities: ["畢業展全校總成績第三名"] }
    ],
    certificates: [
      { name: "Adobe Certified Professional in Visual Design", issuer: "Photoshop & Illustrator 專業雙認證" },
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
      { id: "s7", title: "AI 輔助工作流", desc: "熟練掌握 Midjourney, Firefly, Stable Diffusion 等 AIGC 繪圖工具，能極速產出高品質創意底稿。", badge: "AIGC Flow" },
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
    if (selectedCategory === "All") {
      list = items;
    } else if (selectedCategory === "亮點設計") {
      list = items.filter(item => item.isHighlight);
    } else {
      list = items.filter(item => item.category === selectedCategory);
    }
    
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      list = list.filter(item => 
        item.title.toLowerCase().includes(q) ||
        item.titleEn.toLowerCase().includes(q) ||
        item.philosophy.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.tools.some(tool => tool.toLowerCase().includes(q))
      );
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

  const preloadThresholdIndex = useMemo(() => {
    return Math.max(0, Math.floor(visibleItems.length * 0.8));
  }, [visibleItems.length]);

  const handlePreloadNextBatch = React.useCallback(() => {
    if (filteredItems.length > visibleCount && !isJumpingToBentoRef.current) {
      setPrevVisibleCount(visibleCount);
      setVisibleCount((prev) => Math.min(prev + 12, filteredItems.length));
    }
  }, [filteredItems.length, visibleCount]);

  // Infinite scroll loader using Intersection Observer to detect the viewport boundary and trigger pagination
  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && filteredItems.length > visibleCount && !isJumpingToBentoRef.current) {
          setPrevVisibleCount(visibleCount);
          setVisibleCount((prev) => Math.min(prev + 12, filteredItems.length));
        }
      },
      {
        root: null,
        rootMargin: "250px", // Pre-fetch slightly before entering the viewport for seamless buttery-smooth scrolling
        threshold: 0.1,
      }
    );

    const currentLoader = loaderRef.current;
    if (currentLoader) {
      observer.observe(currentLoader);
    }

    return () => {
      if (currentLoader) {
        observer.unobserve(currentLoader);
      }
    };
  }, [filteredItems.length, visibleCount]);

  // Performance Optimization: Preload the cover images (360px-600px width) of the active category and upcoming predictive batch dynamically.
  // This avoids overwhelming the browser and Google Drive API, resolving rate limits, lag, and black screen failures.
  React.useEffect(() => {
    if (!filteredItems || filteredItems.length === 0) return;
    
    // Limits preloading to currently visible items + predictive next batch of 12 items to prevent network saturation while staying ahead of scrolling.
    const endRange = Math.min(visibleCount + 12, filteredItems.length);
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

  const copyEmailToClipboard = () => {
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
  };

  // vCard details and download handler
  const vCardText = useMemo(() => {
    return [
      "BEGIN:VCARD",
      "VERSION:3.0",
      `FN:${profile.name}`,
      "N:Lee;Cape;;;",
      `TITLE:${profile.title}`,
      `ORG:${profile.company}`,
      `EMAIL;TYPE=INTERNET,WORK:${profile.email}`,
      `URL:${profile.portfolioUrl}`,
      `NOTE:${profile.intro.substring(0, 100)}...`,
      "END:VCARD"
    ].join("\r\n");
  }, [profile]);

  const downloadVCard = () => {
    const file = new Blob([vCardText], { type: "text/vcard;charset=utf-8" });
    const element = document.createElement("a");
    const objectUrl = URL.createObjectURL(file);
    element.href = objectUrl;
    element.download = `${profile.name}_${profile.engName}.vcf`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    URL.revokeObjectURL(objectUrl);
  };

  const handlePrevModalItem = () => {
    const idx = filteredItems.findIndex(i => i.id === activeModalItem?.id);
    if (idx > 0) {
      setActiveModalItem(filteredItems[idx - 1]);
    } else {
      setActiveModalItem(filteredItems[filteredItems.length - 1]);
    }
  };

  const handleNextModalItem = () => {
    const idx = filteredItems.findIndex(i => i.id === activeModalItem?.id);
    if (idx < filteredItems.length - 1) {
      setActiveModalItem(filteredItems[idx + 1]);
    } else {
      setActiveModalItem(filteredItems[0]);
    }
  };

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
          borderBottomColor: !isScrolled
            ? "transparent"
            : theme === "light"
            ? "rgba(0, 0, 0, 0.06)"
            : theme === "sepia"
            ? "rgba(67, 52, 34, 0.08)"
            : "rgba(255, 255, 255, 0.05)"
        } as any}
        className="fixed top-0 left-0 right-0 z-40 border-b py-2 md:py-2.5 px-4 sm:px-6 lg:px-8 transition-colors duration-300"
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
            <div className="flex items-center gap-3.5 sm:gap-5 mr-1 sm:mr-2">
              <button
                type="button"
                onClick={() => scrollToElement("portfolio-grid")}
                className={`text-xs sm:text-sm font-sans font-normal transition-colors duration-250 cursor-pointer hover:scale-105 active:scale-95 ${navLinkClass}`}
              >
                作品
              </button>
              <button
                type="button"
                onClick={() => scrollToElement("designer-bento")}
                className={`text-xs sm:text-sm font-sans font-normal transition-colors duration-250 cursor-pointer hover:scale-105 active:scale-95 ${navLinkClass}`}
              >
                履歷
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
                <button
                  type="button"
                  id="btn_theme_toggle"
                  onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}
                  className={themeToggleClass}
                  title="選擇主題配色"
                >
                  {theme === "dark" ? (
                    <Moon className="h-4 w-4 text-indigo-400" />
                  ) : theme === "light" ? (
                    <Sun className="h-4 w-4 text-[#D97706]" />
                  ) : (
                    <Eye className="h-4 w-4 text-amber-700" />
                  )}
                </button>

                <AnimatePresence>
                  {isThemeMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -8 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -8 }}
                      transition={{ duration: 0.15 }}
                      className={`absolute right-0 mt-2 w-28 rounded-xl border p-1 z-50 shadow-lg ${
                        theme === "sepia"
                          ? "bg-[#F4EAD4] border-[#DFCFA0]/80 text-[#4F3C28]"
                          : theme === "light"
                          ? "bg-white border-zinc-150 text-zinc-800"
                          : "bg-[#18181b] border-white/10 text-zinc-200"
                      }`}
                    >
                      {/* 淺色選項 */}
                      <button
                        type="button"
                        onClick={() => changeTheme("light")}
                        className={`flex items-center justify-between w-full px-2.5 py-1.5 text-xs font-sans rounded-lg transition-all duration-200 cursor-pointer ${
                          theme === "light"
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
                        {theme === "light" && (
                          <span className="h-1.5 w-1.5 rounded-full bg-[#D97706]" />
                        )}
                      </button>

                      {/* 深色選項 */}
                      <button
                        type="button"
                        onClick={() => changeTheme("dark")}
                        className={`flex items-center justify-between w-full px-2.5 py-1.5 text-xs font-sans rounded-lg transition-all duration-200 cursor-pointer mt-0.5 ${
                          theme === "dark"
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
                        {theme === "dark" && (
                          <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                        )}
                      </button>

                      {/* 暖沙選項 */}
                      <button
                        type="button"
                        onClick={() => changeTheme("sepia")}
                        className={`flex items-center justify-between w-full px-2.5 py-1.5 text-xs font-sans rounded-lg transition-all duration-200 cursor-pointer mt-0.5 ${
                          theme === "sepia"
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
                        {theme === "sepia" && (
                          <span className="h-1.5 w-1.5 rounded-full bg-amber-600" />
                        )}
                      </button>
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
        <section id="hero-minimalist" className="relative pt-4 pb-8 md:pt-10 md:pb-14 overflow-visible flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12 border-b border-zinc-150/50 dark:border-white/5 scroll-mt-[48px] md:scroll-mt-[58px]">
          <div className="flex-1 max-w-2xl text-left overflow-visible relative flex flex-col justify-center">
            {/* 1. Tag Wrapper (above the line, slides UP) */}
            <div className="overflow-hidden pb-1">
              <motion.div
                initial={{ y: "110%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1], delay: 0.35 }}
              >
                <span className={`text-[11px] sm:text-xs font-mono tracking-[0.2em] font-bold uppercase block ${
                  theme === "sepia" 
                    ? "text-[#A05C2C]" 
                    : theme === "light" 
                    ? "text-amber-600" 
                    : "text-amber-400"
                }`}>
                  視覺設計 · 平面設計
                </span>
              </motion.div>
            </div>

            {/* 2. The Anchor Line itself (scales horizontally from left) */}
            <div className="relative py-1 overflow-visible">
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
                style={{ transformOrigin: "left" }}
                className={`h-[1px] w-full ${
                  theme === "sepia" 
                    ? "bg-[#DFCFA0]" 
                    : theme === "light" 
                    ? "bg-zinc-200" 
                    : "bg-white/10"
                }`}
              />
            </div>

            {/* 3. Text and Buttons Wrapper (below the line, slides DOWN) */}
            <div className="overflow-hidden pt-2">
              <motion.div
                initial={{ y: "-110%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.45 }}
                className="space-y-6"
              >
                <h1 className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-sans font-extrabold tracking-tight leading-[1.1] transition-colors duration-350 select-none ${
                  theme === "sepia" 
                    ? "text-[#2B1B0C]" 
                    : theme === "light" 
                    ? "text-zinc-950" 
                    : "text-white"
                }`}>
                  {"Cape Lee".split("").map((char, index) => {
                    if (char === " ") {
                      return (
                        <span key={index} className="inline-block">
                          &nbsp;
                        </span>
                      );
                    }
                    return (
                      <motion.span
                        key={`${index}-${titleBounceTrigger}`}
                        className="inline-block origin-bottom"
                        initial={{ y: 0 }}
                        animate={titleBounceTrigger > 0 ? { y: [0, -20, 3, 0] } : { y: 0 }}
                        transition={{
                          duration: 0.55,
                          ease: "easeOut",
                          delay: index * 0.04,
                        }}
                      >
                        {char}
                      </motion.span>
                    );
                  })}
                </h1>

                <p className={`text-sm sm:text-md md:text-[17px] font-light leading-relaxed transition-colors duration-350 ${
                  theme === "sepia" 
                    ? "text-[#5C4D3C]" 
                    : theme === "light" 
                    ? "text-zinc-650" 
                    : "text-zinc-300"
                }`}>
                  5 ~ 6 年品牌商業整合設計實戰經驗，作品橫跨電商視覺、品牌識別與原創角色 IP。
                </p>

                <div className="flex flex-wrap items-center gap-3.5 pt-1 pb-1">
                  <button
                    onClick={() => scrollToElement("portfolio-grid")}
                    className={`px-6 py-3 font-semibold rounded-xl text-xs sm:text-sm transition-all duration-300 shadow-md active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer ${
                      theme === "sepia"
                        ? "bg-[#A05C2C] hover:bg-[#854B22] text-[#FCF8EE] shadow-amber-950/20"
                        : theme === "light"
                        ? "bg-amber-600 hover:bg-amber-700 text-white shadow-amber-600/20"
                        : "bg-amber-500 hover:bg-amber-400 text-zinc-950 shadow-amber-500/20"
                    }`}
                  >
                    看作品
                  </button>
                  
                  <button
                    onClick={() => scrollToElement("designer-bento")}
                    className={`px-6 py-3 font-medium rounded-xl text-xs sm:text-sm transition-all duration-300 border backdrop-blur active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer ${
                      theme === "sepia"
                        ? "border-[#DFCFA0] hover:bg-[#EADECC]/40 text-[#4F3C28]"
                        : theme === "light"
                        ? "border-zinc-200 hover:bg-zinc-50 text-zinc-700"
                        : "border-white/10 hover:bg-white/5 text-zinc-300"
                    }`}
                  >
                    履歷
                  </button>

                  {profile.pdfPortfolioUrl && (
                    <a
                      href={profile.pdfPortfolioUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={incrementInteraction}
                      className={`relative group px-6 py-3 font-medium rounded-xl text-xs sm:text-sm transition-all duration-300 border backdrop-blur active:scale-95 flex items-center justify-center gap-1.5 ${
                        theme === "sepia"
                          ? "border-[#DFCFA0] hover:bg-[#EADECC]/40 text-[#4F3C28]"
                          : theme === "light"
                          ? "border-zinc-200 hover:bg-zinc-50 text-zinc-700"
                          : "border-white/10 hover:bg-white/5 text-zinc-300"
                      }`}
                      title="開啟雲端儲存的傳統 PDF 作品集"
                    >
                      {/* 姆貓偷看 (Peek-a-boo Mascot) */}
                      <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-[-3px] pointer-events-none transition-all duration-300 ease-out opacity-0 translate-y-3 scale-75 group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-100 group-hover:rotate-[-6deg] z-20 flex flex-col items-center">
                        {/* 姆貓小氣泡 */}
                        <div className={`px-2 py-0.5 rounded-full text-[10px] whitespace-nowrap shadow-md mb-1 border font-bold animate-bounce ${
                          theme === "sepia"
                            ? "bg-[#FCF8EE] border-[#EAD09D] text-[#382B1D]"
                            : theme === "light"
                            ? "bg-white border-zinc-200 text-zinc-700"
                            : "bg-zinc-800 border-zinc-700 text-zinc-200"
                        }`}>
                          看我！🐾
                        </div>
                        {/* 姆貓頭像縮圖 */}
                        <img 
                          src="https://drive.google.com/thumbnail?sz=w1000&id=1eqi9X536nUrXqj-gv6kqjNMfpiC1YumX" 
                          alt="姆貓偷看"
                          className="w-10 h-10 object-contain drop-shadow-md select-none"
                          referrerPolicy="no-referrer"
                        />
                      </div>

                      <FileText className="w-4 h-4 text-amber-500 shrink-0" />
                      <span>PDF 作品集</span>
                    </a>
                  )}
                </div>
              </motion.div>
            </div>
          </div>

          {/* Right Mascot column */}
          <div className="w-full lg:w-auto shrink-0 flex items-center justify-center overflow-visible p-4 relative z-50">
            <motion.div
              ref={mascotRef}
              initial={{ opacity: 0, x: 40, rotate: 5, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, rotate: 0, scale: 1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.93, scaleY: 0.88, scaleX: 1.05 }}
              transition={{ type: "spring", bounce: 0.15, duration: 1.2, delay: 0.1 }}
              onClick={handleHeroClick}
              className="w-full max-w-[280px] sm:max-w-[360px] lg:max-w-[420px] aspect-square relative flex items-center justify-center overflow-visible cursor-pointer group select-none"
            >
              <div className="absolute inset-4 bg-amber-500/8 rounded-full blur-[50px] -z-10 animate-pulse duration-[6000ms]" />
              
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
                        {/* Wing Base Spectrum & Glow */}
                        <div className="absolute w-24 h-24 rounded-full bg-gradient-to-tr from-pink-400/35 via-white/50 to-pink-300/25 blur-xl animate-pulse" />
                          {/* Cute Pink Particles/Stars around wing */}
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
                          {/* Wing Base Spectrum & Glow */}
                          <div className="absolute w-24 h-24 rounded-full bg-gradient-to-tl from-pink-400/35 via-white/50 to-pink-300/25 blur-xl animate-pulse" />
                          {/* Cute Pink Particles/Stars around wing */}
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
                          <span className="text-4xl sm:text-5xl filter drop-shadow-[0_4px_10px_rgba(244,63,94,0.6)] select-none block">🎀</span>
                        </motion.div>
                      </motion.div>

                      {/* 頭部右側高頻閃爍金黃幸運星（⭐️） */}
                      <motion.div
                        initial={{ opacity: 0, scale: 0, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0, y: -20 }}
                        className="absolute right-[12%] sm:right-[15%] top-[10%] z-30 pointer-events-none"
                      >
                        <motion.div
                          animate={{
                            opacity: [0.3, 1, 0.3],
                            scale: [0.9, 1.3, 0.9],
                            rotate: [0, 360]
                          }}
                          transition={{
                            opacity: { duration: 0.25, repeat: Infinity, ease: "linear" },
                            scale: { duration: 0.25, repeat: Infinity, ease: "linear" },
                            rotate: { duration: 3, repeat: Infinity, ease: "linear" }
                          }}
                        >
                          <span className="text-4xl sm:text-5xl filter drop-shadow-[0_0_12px_rgba(251,191,36,0.95)] select-none block">⭐️</span>
                        </motion.div>
                      </motion.div>

                      {/* 右下角浮空環繞施展魔力的魔杖（🪄） */}
                      <motion.div
                        initial={{ opacity: 0, scale: 0, x: 20 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0, x: 20 }}
                        className="absolute right-[2%] sm:right-[5%] bottom-[15%] sm:bottom-[18%] z-30 pointer-events-none"
                      >
                        <motion.div
                          animate={{
                            x: [0, 15, 0, -15, 0],
                            y: [0, -15, -25, -10, 0],
                            rotate: [15, 45, 15, -15, 15]
                          }}
                          transition={{
                            duration: 2.2,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                          className="relative"
                        >
                          {/* Magic trails / sparkles */}
                          <div className="absolute -top-4 -left-4 text-amber-300 text-[10px] animate-ping">✨</div>
                          <div className="absolute top-4 right-4 text-pink-300 text-xs animate-pulse">⭐</div>
                          <span className="text-5xl sm:text-6xl filter drop-shadow-[0_0_15px_rgba(168,85,247,0.75)] select-none block">🪄</span>
                        </motion.div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>

                {/* 瞬間彩虹光芒包裹 (Rainbow Burst Effect) */}
                <AnimatePresence>
                  {showRainbowFlash && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.7 }}
                      animate={{ opacity: [0, 1, 1, 0], scale: [0.7, 1.25, 1.25, 0.95] }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 1.2, ease: "easeInOut" }}
                      className="absolute inset-0 z-40 rounded-3xl mix-blend-screen bg-gradient-to-tr from-pink-500 via-red-500 via-yellow-400 via-green-400 via-blue-500 to-purple-500 opacity-80 blur-sm flex items-center justify-center pointer-events-none"
                    >
                      {/* Bursting glowing core */}
                      <div className="absolute inset-4 bg-white rounded-full blur-xl animate-ping duration-700" />
                      <div className="text-white font-extrabold text-3xl sm:text-4xl tracking-widest animate-bounce drop-shadow-[0_0_12px_rgba(255,255,255,0.95)] select-none">
                        ✨ MAGIC! ✨
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

              {/* Hover indicator tooltip */}
              {!isHeroSpeaking && (
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:-translate-y-1 pointer-events-none z-20">
                  <div className={`px-2.5 py-1 text-[11px] font-medium rounded-full shadow-md flex items-center gap-1 backdrop-blur border whitespace-nowrap ${
                    theme === "sepia"
                      ? "bg-[#FCF8EE] border-[#DFCFA0] text-[#4F3C28]"
                      : theme === "light"
                      ? "bg-white border-zinc-200 text-zinc-800"
                      : "bg-zinc-900 border-zinc-800 text-zinc-200"
                  }`}>
                    點我說話 💬
                  </div>
                </div>
              )}

              {/* Dialogue Bubble */}
              <AnimatePresence>
                {showHeroDialogue && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8, x: -10 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.8, x: -10 }}
                    transition={{ type: "spring", stiffness: 300, damping: 22 }}
                    onClick={(e) => e.stopPropagation()}
                    className={`hidden md:block absolute z-50 w-[280px] lg:w-[320px] p-5 rounded-2xl shadow-xl border text-xs sm:text-sm font-medium leading-relaxed
                      ${
                        theme === "sepia"
                          ? "bg-[#FAF4E5] border-[#EAD09D] text-[#382B1D] shadow-[#382B1D]/5"
                          : theme === "light"
                          ? "bg-white border-zinc-150 text-zinc-800 shadow-zinc-200/50"
                          : "bg-zinc-950/95 border-zinc-800/80 text-zinc-100 shadow-black/40"
                      }
                      md:right-[102%] lg:right-[106%] md:-translate-x-0 md:top-[15%] md:bottom-auto md:left-auto
                    `}
                  >
                    {/* Tiny bubble tail pointing right towards mascot, solid matching background to cover parent border */}
                    <div className={`absolute w-3 h-3 rotate-45 border-r border-t top-1/3 -right-1.5
                      ${
                        theme === "sepia"
                          ? "bg-[#FAF4E5] border-[#EAD09D]"
                          : theme === "light"
                          ? "bg-white border-zinc-150"
                          : "bg-zinc-950/95 border-zinc-800/80"
                      }
                    `} />
                    <motion.div
                      animate={{ y: [0, -3, 0] }}
                      transition={{
                        repeat: Infinity,
                        duration: 3.5,
                        ease: "easeInOut"
                      }}
                    >
                      <p className="relative">
                        {displayedDialogue}
                        {displayedDialogue.length < heroDialogue.length && (
                          <span className="inline-block ml-1 w-1.5 h-3.5 bg-amber-500 animate-pulse rounded align-middle" />
                        )}
                      </p>

                      {heroDialogue.includes("IG") && displayedDialogue.length >= 10 && (
                        <div className="mt-3 pt-2.5 border-t border-dashed border-zinc-200/60 dark:border-white/10 flex justify-center">
                          <a
                            href="https://www.instagram.com/mumao1_the_cat_religion?igsh=MXF2a3N1bm45ajhkaw=="
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-1.5 w-full py-2 px-3 rounded-xl text-xs font-bold tracking-wide text-white transition-all duration-300 active:scale-95 shadow-md hover:shadow-pink-500/10 cursor-pointer bg-gradient-to-r from-pink-500 via-red-500 to-amber-500 hover:brightness-110"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSocialClick();
                            }}
                          >
                            <Instagram className="h-3.5 w-3.5 shrink-0" />
                            <span>前往 MuMㄠ 教主 IG 🐾</span>
                          </a>
                        </div>
                      )}

                      {(heroDialogue.includes("運勢") || heroDialogue.includes("求籤")) && displayedDialogue.length >= 10 && (
                        <div className="mt-3 pt-2.5 border-t border-dashed border-zinc-200/60 dark:border-white/10 flex justify-center">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              const el = document.getElementById("footer-fortune");
                              if (el) {
                                el.scrollIntoView({ behavior: "smooth" });
                              }
                            }}
                            className="inline-flex items-center justify-center gap-1.5 w-full py-2 px-3 rounded-xl text-xs font-bold tracking-wide text-white transition-all duration-300 active:scale-95 shadow-md cursor-pointer bg-gradient-to-r from-red-500 to-[#D33F33] hover:brightness-110"
                          >
                            <span>⛩️ 前往今日運勢求籤 🐾</span>
                          </button>
                        </div>
                      )}
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

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
                <style>{`
                  @keyframes mumao-closed {
                    0%, 19.99%, 80%, 100% {
                      opacity: 1;
                    }
                    20%, 79.99% {
                      opacity: 0;
                    }
                  }
                  @keyframes mumao-medium {
                    0%, 19.99%, 40%, 59.99%, 80%, 100% {
                      opacity: 0;
                    }
                    20%, 39.99%, 60%, 79.99% {
                      opacity: 1;
                    }
                  }
                  @keyframes mumao-open {
                    0%, 39.99%, 60%, 100% {
                      opacity: 0;
                    }
                    40%, 59.99% {
                      opacity: 1;
                    }
                  }
                  .mumao-anim-closed {
                    animation: mumao-closed 0.7s infinite steps(1);
                  }
                  .mumao-anim-medium {
                    animation: mumao-medium 0.7s infinite steps(1);
                  }
                  .mumao-anim-open {
                    animation: mumao-open 0.7s infinite steps(1);
                  }

                  /* Body movement keyframes for lively expressions (Subtler/Gentler) */
                  @keyframes mumao-idle-float {
                    0%, 100% {
                      transform: translateY(0) rotate(0deg);
                    }
                    50% {
                      transform: translateY(-2px) rotate(0.3deg);
                    }
                  }
                  @keyframes mumao-speaking-bounce {
                    0%, 100% {
                      transform: translateY(0) scale(1) rotate(0deg);
                    }
                    25% {
                      transform: translateY(-3.5px) scale(1.012) rotate(-0.4deg);
                    }
                    50% {
                      transform: translateY(0.6px) scale(0.988) rotate(0.2deg);
                    }
                    75% {
                      transform: translateY(-2.2px) scale(1.006) rotate(-0.2deg);
                    }
                  }
                  @keyframes mumao-hover-wiggle {
                    0%, 100% {
                      transform: scale(1.01) rotate(0deg) translateY(0);
                    }
                    25% {
                      transform: scale(1.015) rotate(-0.5deg) translateY(-1px);
                    }
                    75% {
                      transform: scale(1.015) rotate(0.5deg) translateY(-1px);
                    }
                  }

                  .mumao-idle {
                    animation: mumao-idle-float 3.8s infinite ease-in-out;
                  }
                  .mumao-speaking {
                    animation: mumao-speaking-bounce 0.95s infinite ease-in-out;
                  }
                  .mumao-playful {
                    animation: mumao-hover-wiggle 1.2s infinite ease-in-out;
                  }

                  /* 魔法少女彩虹光暈 Drop Shadow 動畫 */
                  @keyframes rainbow-glow {
                    0%, 100% {
                      filter: drop-shadow(0 0 18px rgba(244, 63, 94, 0.85)) drop-shadow(0 0 35px rgba(244, 63, 94, 0.5));
                    }
                    20% {
                      filter: drop-shadow(0 0 18px rgba(251, 191, 36, 0.85)) drop-shadow(0 0 35px rgba(251, 191, 36, 0.5));
                    }
                    40% {
                      filter: drop-shadow(0 0 18px rgba(52, 211, 153, 0.85)) drop-shadow(0 0 35px rgba(52, 211, 153, 0.5));
                    }
                    60% {
                      filter: drop-shadow(0 0 18px rgba(96, 165, 250, 0.85)) drop-shadow(0 0 35px rgba(96, 165, 250, 0.5));
                    }
                    80% {
                      filter: drop-shadow(0 0 18px rgba(167, 139, 250, 0.85)) drop-shadow(0 0 35px rgba(167, 139, 250, 0.5));
                    }
                  }
                  .mumao-rainbow-glow {
                    animation: rainbow-glow 3s infinite linear !important;
                  }
                `}</style>

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
          </div>

          {/* Draggable cat food can Easter Egg in the corner of the Hero section */}
          <motion.div
            ref={canRef}
            style={{ x: canX, y: canY, rotate: canRotate, touchAction: "none" }}
            drag
            dragConstraints={{ left: -1500, right: 1500, top: -1500, bottom: 1500 }}
            dragElastic={0.15}
            dragMomentum={false}
            onDragStart={handleCanDragStart}
            onDrag={handleCanDrag}
            onDragEnd={handleCanDragEnd}
            onTap={handleCanTap}
            whileHover={{ scale: 1.1 }}
            whileDrag={{ scale: 1.25, rotate: 12, cursor: "grabbing" }}
            className="absolute top-2 right-4 lg:top-0 lg:right-0 z-50 cursor-grab select-none p-1.5 active:cursor-grabbing group"
          >
            {/* Elegant flavor badge that appears on hover */}
            <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-neutral-900/95 text-[10px] text-white font-medium px-2 py-0.5 rounded shadow-lg border border-white/10 pointer-events-none whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              {FLAVOR_PHYSICS[canFlavor].emoji} {FLAVOR_PHYSICS[canFlavor].name}
            </span>

            <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 drop-shadow-md">
              {/* Top lid outer rim */}
              <ellipse cx="24" cy="14" rx="18" ry="6" fill={FLAVOR_PHYSICS[canFlavor].topLidFill} stroke={FLAVOR_PHYSICS[canFlavor].topLidStroke} strokeWidth="1.5" />
              {/* Inner lid recess */}
              <ellipse cx="24" cy="14" rx="14" ry="4.5" fill={FLAVOR_PHYSICS[canFlavor].innerLidFill} stroke={FLAVOR_PHYSICS[canFlavor].topLidStroke} strokeWidth="1" />
              
              {/* Premium metal pull-tab ring */}
              <path d="M 24,14 C 24,12 21,10 19,11 C 17,12 17,14 19,15 C 21,16 24,14 24,14" fill={FLAVOR_PHYSICS[canFlavor].innerLidFill} stroke={FLAVOR_PHYSICS[canFlavor].topLidStroke} strokeWidth="1" />
              <circle cx="19" cy="13" r="1.5" fill="#FEF3C7" />

              {/* Cylindrical metallic body with smooth gradient shading */}
              <path d="M 6,14 A 18,6 0 0 0 42,14 L 42,32 A 18,6 0 0 1 6,32 Z" fill={`url(#${FLAVOR_PHYSICS[canFlavor].bodyGradient})`} stroke={FLAVOR_PHYSICS[canFlavor].topLidStroke} strokeWidth="1.5" strokeLinejoin="round" />
              
              {/* Bottom 3D curved shadow and rim */}
              <ellipse cx="24" cy="32" rx="18" ry="6" fill={FLAVOR_PHYSICS[canFlavor].topLidStroke} opacity="0.35" />
              <ellipse cx="24" cy="32" rx="18" ry="6" fill="none" stroke={FLAVOR_PHYSICS[canFlavor].topLidStroke} strokeWidth="1.5" />

              {/* Minimalist wrapper sleeve label */}
              <path d="M 6,20 A 18,5 0 0 0 42,20 L 42,28 A 18,5 0 0 1 6,28 Z" fill={FLAVOR_PHYSICS[canFlavor].labelFill} opacity="0.95" />
              
              {/* Custom patterns for each flavor */}
              {canFlavor === "tuna" ? (
                <>
                  {/* Delicate minimalist vector fish */}
                  <path d="M 18,24 C 21,21 24,21 27,24 L 29,22.5 L 29,25.5 Z" fill={FLAVOR_PHYSICS[canFlavor].labelPatternFill} />
                  <circle cx="20" cy="23.5" r="0.6" fill="#1D4ED8" />
                </>
              ) : canFlavor === "chicken" ? (
                <>
                  {/* Delicate minimalist chicken drumstick/wing shape */}
                  <circle cx="22" cy="24" r="2.2" fill={FLAVOR_PHYSICS[canFlavor].labelPatternFill} />
                  <circle cx="24.5" cy="24.5" r="1.6" fill={FLAVOR_PHYSICS[canFlavor].labelPatternFill} />
                  <path d="M 18,23.5 L 22.5,24.2" stroke={FLAVOR_PHYSICS[canFlavor].labelPatternFill} strokeWidth="1.8" strokeLinecap="round" />
                </>
              ) : (
                <>
                  {/* Elegant vector paw print detailing on the gold label */}
                  <circle cx="24" cy="25" r="2.5" fill="#78350F" />
                  <circle cx="21" cy="21.5" r="1" fill="#78350F" />
                  <circle cx="24" cy="20.5" r="1" fill="#78350F" />
                  <circle cx="27" cy="21.5" r="1" fill="#78350F" />
                </>
              )}

              <defs>
                <linearGradient id="metallicGoldGradient" x1="6" y1="23" x2="42" y2="23" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#B45309" />
                  <stop offset="25%" stopColor="#FBBF24" />
                  <stop offset="50%" stopColor="#FEF3C7" />
                  <stop offset="75%" stopColor="#FBBF24" />
                  <stop offset="100%" stopColor="#92400E" />
                </linearGradient>
                <linearGradient id="metallicBlueGradient" x1="6" y1="23" x2="42" y2="23" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#1E3A8A" />
                  <stop offset="25%" stopColor="#3B82F6" />
                  <stop offset="50%" stopColor="#93C5FD" />
                  <stop offset="75%" stopColor="#3B82F6" />
                  <stop offset="100%" stopColor="#172554" />
                </linearGradient>
                <linearGradient id="metallicRedGradient" x1="6" y1="23" x2="42" y2="23" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#7F1D1D" />
                  <stop offset="25%" stopColor="#EF4444" />
                  <stop offset="50%" stopColor="#FCA5A5" />
                  <stop offset="75%" stopColor="#EF4444" />
                  <stop offset="100%" stopColor="#450A0A" />
                </linearGradient>
              </defs>
            </svg>
          </motion.div>
        </section>

        {/* 區塊標題 & 卡片過濾器 */}
        <section id="portfolio-grid" className="space-y-8 scroll-mt-[48px] md:scroll-mt-[58px]">
          {/* 標題與分類選單緊湊排版包裝器 */}
          <div className="space-y-1 md:space-y-1.5 flex flex-col items-center w-full">
            <div className="max-w-3xl mx-auto text-center space-y-2">
              <h2 className="text-3xl md:text-4xl font-display font-medium text-white tracking-tight">
                探索設計作品
              </h2>
              <div className="h-[2px] w-12 bg-amber-500 mx-auto rounded-full"></div>
            </div>



            {/* 各類作品過濾選項 (電腦版精緻呈現，手機版優化為橫向滑動選單與二列極簡格狀面板) */}
            <div className="w-full flex flex-col items-center gap-4">
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
                    onClick={() => setSelectedCategory(cat)}
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
                    onClick={() => setSelectedCategory(cat)}
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
                    onScroll={checkCategoriesScroll}
                    className="flex gap-2 overflow-x-auto scrollbar-none py-1.5 px-4 w-full flex-nowrap whitespace-nowrap scroll-smooth"
                  >
                    {categories.map((cat) => (
                      <CategoryButton
                        key={cat}
                        cat={cat}
                        theme={theme}
                        isActive={selectedCategory === cat}
                        onClick={() => setSelectedCategory(cat)}
                      />
                    ))}
                  </div>

                  {/* 右側漸變淡出 */}
                  <div 
                    className={`absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l ${
                      theme === "sepia" 
                        ? "from-[#FAF4E5]" 
                        : theme === "light" 
                        ? "from-[#FAFAFA]" 
                        : "from-[#0A0A0A]"
                    } to-transparent z-10 pointer-events-none transition-opacity duration-300 ${
                      showCategoriesRightMask ? "opacity-100" : "opacity-0"
                    }`} 
                  />
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
                              setSelectedCategory(cat);
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
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
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
                const is80PercentMark = index === preloadThresholdIndex;
                return (
                  <PortfolioCard
                    key={item.id}
                    item={item}
                    onClick={() => setActiveModalItem(item)}
                    priority={index < 6}
                    index={index}
                    prevVisibleCount={prevVisibleCount}
                    theme={deferredTheme}
                    showAllDetails={false}
                    onNearBottom={is80PercentMark ? handlePreloadNextBatch : undefined}
                  />
                );
              })}
            </AnimatePresence>
          </div>

          {/* 無限滾動偵測點與極簡毛玻璃載入指示器 */}
          <div ref={loaderRef} className="w-full py-4 flex flex-col items-center justify-center gap-3 shrink-0">
            {filteredItems.length > visibleCount ? (
              <div className="flex flex-col items-center gap-2 text-zinc-500 font-sans text-xs">
                {/* 輕量級動態三點跳躍加載指示器 */}
                <div className="flex gap-1.5 items-center justify-center py-1">
                  <span className="w-2 h-2 rounded-full bg-amber-500/80 animate-bounce duration-300" />
                  <span className="w-2 h-2 rounded-full bg-amber-500/80 animate-bounce [animation-delay:0.12s] duration-300" />
                  <span className="w-2 h-2 rounded-full bg-amber-500/80 animate-bounce [animation-delay:0.24s] duration-300" />
                </div>
                <span className={`text-[11px] font-mono tracking-wider uppercase ${theme === 'sepia' ? 'text-[#8C7B69]/70' : 'text-zinc-500/70'}`}>
                  自動加載精彩內容中 ({visibleCount} / {filteredItems.length})
                </span>
              </div>
            ) : filteredItems.length > 0 ? (
              <div className="flex flex-col items-center gap-2 py-4">
                <div className={`h-px w-24 ${theme === 'dark' ? 'bg-white/5' : theme === 'sepia' ? 'bg-amber-900/10' : 'bg-zinc-200'}`} />
                <span className={`text-[10px] uppercase font-mono tracking-widest ${theme === 'sepia' ? 'text-[#8C7B69]/60' : 'text-zinc-500'}`}>
                  ✦ 已顯示全數 {filteredItems.length} 項作品 • 感謝您的細緻賞析 ✦
                </span>
              </div>
            ) : null}
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

        {/* 回到最上方按鈕 */}
        <div id="section_scroll_to_top_bottom" className="flex justify-center pt-0 !mt-10 md:!mt-12">
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
                  {/* 傳統右至左、上至下：右欄「李、凱」，左欄「博、印」 */}
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
                <CatFortuneTeller theme={theme} onConsult={handleFortuneConsult} />
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
                  const totalAchievements = 11;
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
                    magicMumuUnlocked
                  ].filter(Boolean).length;
                  
                  return (
                    <motion.button
                      onClick={() => {
                        setIsCertModalOpen(true);
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
                      {/* 完美和風御守本體 (將吊繩與圓點一併繪入 SVG 中，徹底免除外部 HTML 元素與 flex 容器對齊時產生的白塊與渲染問題) */}
                      <div 
                        style={{ background: "transparent", backgroundColor: "transparent" }}
                        className="w-14 h-[94px] relative flex flex-col items-center justify-center pb-2 pt-[22px] gap-2.5 px-1.5 bg-transparent border-0"
                      >
                        
                        {/* 背景 SVG (包含頂端吊繩、黃色圓點、御守本體，一體化渲染) */}
                        <svg 
                          width="56" 
                          height="94" 
                          viewBox="0 0 56 94" 
                          style={{ background: "transparent", backgroundColor: "transparent" }}
                          className="absolute inset-0 w-full h-full pointer-events-none drop-shadow-[0_3px_5px_rgba(0,0,0,0.15)] dark:drop-shadow-[0_4px_8px_rgba(0,0,0,0.45)] bg-transparent"
                        >
                          <defs>
                            {/* 定義漸層色 */}
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

                          {/* 吊繩 (直接繪製於 SVG 內) */}
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
                          
                          {/* 頂部吊繩圓點 */}
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

                          {/* 御守外觀多邊形 (整體下移 14px 以避開吊繩) */}
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

                          {/* 內圈虛線裝飾 (整體下移 14px) */}
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
                          <span>姆</span>
                          <span>貓</span>
                          <span>御</span>
                          <span>守</span>
                        </div>
                      </div>
                    </motion.button>
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
          <PortfolioDetailModal
            activeModalItem={activeModalItem}
            onClose={() => setActiveModalItem(null)}
            filteredItems={filteredItems}
            onPrevItem={handlePrevModalItem}
            onNextItem={handleNextModalItem}
          />
        )}
      </AnimatePresence>

      {/* AI 設計輔助工作流彈出框 (Workflow Bottom Sheet / Modal) */}
      <AIWorkflowModal
        isOpen={isWorkflowOpen}
        onClose={() => setIsWorkflowOpen(false)}
        theme={theme}
      />

      {/* 傳統 vCard 數位名片與 QR Code 彈出視窗 */}
      <ContactModal
        isOpen={isContactCardOpen}
        onClose={() => setIsContactCardOpen(false)}
        theme={theme}
        profile={profile}
        downloadVCard={downloadVCard}
        vCardText={vCardText}
      />

      {/* 角色插畫類別配置：右下角生動彈出裝飾（極高解析度 GPU 隔離渲染） */}
      <InteractiveMascot 
        currentMascot={currentMascot}
        theme={deferredTheme}
        activeModalItem={activeModalItem}
        isWorkflowOpen={isWorkflowOpen}
        isContactCardOpen={isContactCardOpen}
        scrollSectionVisible={isMascotVisibleByScroll}
        onInteract={incrementInteraction}
      />

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

      {/* 貓咪點擊足跡層 (🐾) */}
      <CatFootprintsLayer />

      {/* 手機版底部精緻 RPG 對話框 (Mobile RPG Dialogue Box) */}
      {mounted && typeof document !== "undefined" && createPortal(
        <AnimatePresence>
          {showHeroDialogue && (
            <motion.div
              initial={{ y: 120, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 120, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              onClick={(e) => e.stopPropagation()}
              className={`md:hidden fixed bottom-4 left-4 right-4 z-[99999] p-4.5 rounded-2xl shadow-2xl border flex flex-col gap-3.5
                ${
                  theme === "sepia"
                    ? "bg-[#FAF4E5] border-2 border-[#A05C2C] text-[#382B1D] shadow-[#382B1D]/15"
                    : theme === "light"
                    ? "bg-white border-2 border-amber-600 text-zinc-800 shadow-zinc-300/65"
                    : "bg-zinc-950/98 border-2 border-amber-500 text-zinc-100 shadow-black/90"
                }
              `}
            >
              {/* Top Row: Avatar & Title & Close button */}
              <div className="flex items-start gap-3 relative">
                {/* Cute Avatar of MuMㄠ with matching border frame */}
                <div className={`relative shrink-0 w-13 h-13 rounded-xl overflow-hidden border-2 p-0.5 shadow-sm
                  ${
                    theme === "sepia"
                      ? "border-[#A05C2C] bg-[#FCF8EE]"
                      : theme === "light"
                      ? "border-amber-600 bg-amber-50"
                      : "border-amber-500 bg-zinc-900"
                  }
                `}>
                  <img
                    src="https://drive.google.com/thumbnail?sz=w1000&id=1eqi9X536nUrXqj-gv6kqjNMfpiC1YumX"
                    alt="MuMㄠ"
                    className="w-full h-full object-contain select-none"
                    referrerPolicy="no-referrer"
                  />
                  {isMagicTransformed && (
                    <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-pink-500"></span>
                    </span>
                  )}
                </div>

                {/* RPG Title & Dialogue text */}
                <div className="flex-1 min-w-0 pr-6">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className={`text-[11px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-md text-white bg-gradient-to-r ${
                      theme === "sepia"
                        ? "from-[#A05C2C] to-[#854B22]"
                        : theme === "light"
                        ? "from-amber-600 to-amber-700"
                        : "from-amber-500 to-amber-600 text-black font-extrabold"
                    }`}>
                      {isMagicTransformed ? "🪄 魔法姆貓" : "🐾 姆貓教主"}
                    </span>
                    <span className={`text-[10px] font-mono opacity-60`}>
                      Oracle
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm leading-relaxed font-semibold">
                    {displayedDialogue}
                    {displayedDialogue.length < heroDialogue.length && (
                      <span className="inline-block ml-1 w-1.5 h-3.5 bg-amber-500 animate-pulse rounded align-middle" />
                    )}
                  </p>
                </div>

                {/* RPG Close Button */}
                <button
                  type="button"
                  onClick={() => setShowHeroDialogue(false)}
                  className={`absolute right-0 top-0 p-1 rounded-full transition-colors active:scale-90
                    ${
                      theme === "sepia"
                        ? "hover:bg-[#EAD09D]/30 text-[#A05C2C]"
                        : theme === "light"
                        ? "hover:bg-zinc-100 text-zinc-400"
                        : "hover:bg-white/10 text-zinc-400 hover:text-white"
                    }
                  `}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Bottom Row Actions inside RPG Box */}
              {displayedDialogue.length >= 10 && (
                <div className="flex flex-col gap-2 border-t border-dashed border-zinc-200/60 dark:border-white/10 pt-2.5 mt-0.5">
                  {heroDialogue.includes("IG") && (
                    <a
                      href="https://www.instagram.com/mumao1_the_cat_religion?igsh=MXF2a3N1bm45ajhkaw=="
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 w-full py-2.5 px-3.5 rounded-xl text-xs font-bold tracking-wide text-white transition-all duration-300 active:scale-95 shadow-md hover:shadow-pink-500/10 cursor-pointer bg-gradient-to-r from-pink-500 via-red-500 to-amber-500 hover:brightness-110 text-center"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSocialClick();
                      }}
                    >
                      <Instagram className="h-3.5 w-3.5 shrink-0" />
                      <span>前往 MuMㄠ 教主 IG 🐾</span>
                    </a>
                  )}

                  {(heroDialogue.includes("運勢") || heroDialogue.includes("求籤")) && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowHeroDialogue(false); // Close first to let them see
                        const el = document.getElementById("footer-fortune");
                        if (el) {
                          el.scrollIntoView({ behavior: "smooth" });
                        }
                      }}
                      className="inline-flex items-center justify-center gap-1.5 w-full py-2.5 px-3.5 rounded-xl text-xs font-bold tracking-wide text-white transition-all duration-300 active:scale-95 shadow-md cursor-pointer bg-gradient-to-r from-red-500 to-[#D33F33] hover:brightness-110"
                    >
                      <span>⛩️ 前往今日運勢 🐾</span>
                    </button>
                  )}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}

      {/* 姆貓認證標章 (Mumu Certified Badge) - Removed/Relocated to Footer Omamori */}

      {/* 姆貓認證證書 Modal */}
      <AnimatePresence>
        {isCertModalOpen && (
          <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4">
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCertModalOpen(false)}
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
                onClick={() => setIsCertModalOpen(false)}
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

                  {/* 成成 9: 極致奢華罐罐奉納 */}
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

      {/* 榮譽成就解鎖通知 (Achievement Unlocked Toast) */}
      <AnimatePresence>
        {unlockedAchToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.85 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9, transition: { duration: 0.2 } }}
            className={`fixed bottom-6 right-6 z-[999999] p-4 rounded-xl border shadow-2xl flex items-center gap-3.5 max-w-xs ${
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
                恭喜獲得姆貓教特別榮譽認證！已登錄至您的教主證書。
              </p>
            </div>
            <button
              onClick={() => setUnlockedAchToast(null)}
              className="text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer self-start p-1"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
