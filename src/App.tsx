import React, { useState, useMemo } from "react";
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
  Globe,
  Printer,
  Camera,
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
import { motion, AnimatePresence, useDragControls, useMotionValue, useSpring } from "motion/react";
import { PortfolioItem } from "./types";
import { EXISTING_OPTIMIZED_IMAGES } from "./existingImages";

import { YT_THUMBNAIL_CACHE, DRIVE_THUMBNAIL_CACHE, saveYtCacheToStorage, saveDriveCacheToStorage, extractYoutubeId, extractDriveId, getOptimizedGoogleUrl, resolveImageUrl } from "./utils";
import { animaleseSynth } from "./utils/animalese";

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

import { MagneticButton } from "./components/MagneticButton";

import { InteractiveMascot } from "./components/InteractiveMascot";



import { PortfolioCard } from "./components/PortfolioCard";
import { MinimalistLogo } from "./components/MinimalistLogo";
import { DesignerBento } from "./components/DesignerBento";

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

export default function App() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const initialDataRef = React.useRef<PortfolioItem[]>([]);
  
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

  const [showAllDetails, setShowAllDetails] = useState<boolean>(false);

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

  const [selectedCategory, setSelectedCategory] = useState<string>("All");
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

  interface MascotCharacter {
    name: string;
    role: string;
    imageDriveId: string;
    imageDriveIdSpeaking?: string;
    glowColor: string;
    dialogues: string[];
    idles: string[];
  }

  const categoryMascotMap: Record<string, MascotCharacter> = useMemo(() => ({
    "All": {
      name: "創意總監 Shone",
      role: "全能創意總監",
      imageDriveId: "1bHgPPa1xfQGwcfWlpWa_jiEFRvuUmxpl", // SHONE_P.png (主形象)
      glowColor: "from-cyan-400/25 to-blue-500/20 shadow-[0_0_50px_rgba(6,182,212,0.25)]",
      dialogues: [
        "吼吼～我是創意總監 Shone！歡迎來到我的品牌整合設計大宇宙！🐾",
        "點擊上方的分類按鈕，隨時解鎖 12 隻專業吉祥物戰隊伙伴和精美作品喔！✨",
        "把溫暖人心的溫度融進每一像素與細緻完稿中，這就是我的美學指南！💖",
        "哈囉～這裡收集了我經手的所有完美裝幀設計與實作大作，請慢慢參觀參觀！💎",
        "工作累了嗎？有核心總監 Shone 當你的專屬靈感守護神，讓你元氣滿滿！🌟"
      ],
      idles: [
        "每個專案背後，都是幾百次的像素極限微調與 AIGC 優化流程唷！🐾",
        "創意的本質是點石成金，把繁雜轉化為極簡的品牌尊榮！🌌",
        "點點我的身體，看我跟著你的節奏唱歌，哼唱專屬靈感曲!🎵",
        "吼～點個上方的分類按鈕，看看我的百變恐龍特攻隊夥伴吧！🦖"
      ]
    },
    "角色IP&插畫與貼圖": {
      name: "藍色暴龍 Shone",
      role: "IP角色與插畫首席大師",
      imageDriveId: "1bHgPPa1xfQGwcfWlpWa_jiEFRvuUmxpl", // SHONE_P.png
      glowColor: "from-indigo-500/25 to-cyan-500/20 shadow-[0_0_50px_rgba(99,102,241,0.25)]",
      dialogues: [
        "吼吼！我是原創暴龍 Shone！潮流壓舌帽和滑板是我的日常靈感標配！🛹🦖",
        "踩著滑板畫插畫，讓筆尖帶著自由的風在螢幕上極速奔馳！🔥",
        "用我有力的暴龍雙手，一筆勾畫出最具溫慢與親和力的品牌原創角色 IP！🐾",
        "角色 IP 就像是品牌的心臟，能讓品牌超越冰冷符合，與消費者玩在一起！✨",
        "原創貼圖就是把日常的怪脾氣放大，讓每一句訊息對話都充滿溫度！💖"
      ],
      idles: [
        "在原創 IP 的冒險世界裡，我的滑板沒有終點！Keep pushing! 🛹",
        "想讓你的品牌擁有超高吸睛度的吉祥物嗎？交給我們的插畫就對了！🦖",
        "多看幾個我的插畫作品，可以獲得滿滿的角色 IP 靈感爆擊與貼圖驚喜唷！💥"
      ]
    },
    "平面海報設計": {
      name: "雷龍 Bronti",
      role: "海報版面大師",
      imageDriveId: "1S3U5KeLluy942QfF7NI286vr2GP48IZ_", // BRONTI_P.png
      glowColor: "from-emerald-500/25 to-teal-500/20 shadow-[0_0_50px_rgba(16,185,129,0.25)]",
      dialogues: [
        "喔吼～我是溫和雷龍 Bronti！我長頸看高的開闊視野最懂恢弘大氣的海報排版了！🦖🌿",
        "海報排版要大氣、對比要震撼！用雷龍的俯瞰視角精準對齊極美版面！📐",
        "把厚重而豐富的色塊與醒目的字型結構層層堆疊，這就是平面美學的極致！✨",
        "好海報要在遠處十公尺外，一瞬間便擊中並烙印在讀者的靈魂深處！💎"
      ],
      idles: [
        "長脖子伸得高高，是在幫你偵測未來的海報設計大獎熱門靈感喔！🦖",
        "海報版面的氣韻生動，出自對圖像留白與字級對比的精妙直覺！🌿",
        "安靜而有力的空間留白，往往比塞滿圖案更具有震耳欲聾的品牌聲音！🌾"
      ]
    },
    "商品周邊企業禮贈品": {
      name: "小牛龍 Carno",
      role: "禮贈品工藝專家",
      imageDriveId: "1E9I5w5yq2qcBry_ebnnQo7UDa96qqDOJ", // CARNO_P.png
      glowColor: "from-amber-400/25 to-orange-500/20 shadow-[0_0_50px_rgba(245,158,11,0.25)]",
      dialogues: [
        "嗨！我是小牛龍 Carno！用我的雙角和 my 頂級匠心打造最有份量的企業禮贈品！🦖🎒",
        "將厚重合金與細打磨黑核桃實木完美咬合，每一件紀念品都是不凡的傳家寶！🪵",
        "禮物的尊榮感源於對細節的雕琢，每一個 3D 浮雕壓鑄都刻著匠人的鎔鑄魂魄！💠",
        "聞一聞～精裝禮盒的高級木質墨香！今天的實體化周邊完稿也元氣滿滿喔！🍹"
      ],
      idles: [
        "鋅合金、原木、高週波燙金... 用沉甸甸的質感，給別人最尊貴的呈上之禮！🎁",
        "實體化周邊一定要兼具精美實用與收藏價值，這是我作為 Carno 的核心堅持！🔧",
        "精密咬合、全無瑕疵。我的匠人魂可是承襲了最頂級的工裝美學唷！🐾"
      ]
    },
    "商業視覺攝影": {
      name: "翼龍 Ptera",
      role: "全景商業攝影師",
      imageDriveId: "1zmtZxwZAMmP5rkCi-SAZBPujjisUQvr5", // PTERA_P.png
      glowColor: "from-violet-500/25 to-fuchsia-500/20 shadow-[0_0_50px_rgba(168,85,247,0.25)]",
      dialogues: [
        "咻～我是神速翼龍 Ptera！飛翔在上帝視角，完美捕捉那百萬分之一秒的光影瞬間！📸🦅",
        "商業攝影是光的精密雕刻、影的多重協奏！用微距與絕美特寫述說品牌格調！✨",
        "從專業影棚控光到後期像素級精細修圖，每一張大片都安靜綻放著奢華張力！💎",
        "喀嚓！快門按下。讓我帶你深入凝視精緻玻璃反光與極致金屬背後的拍攝奧秘！🎥"
      ],
      idles: [
        "光圈大小、快門開關。攝影的精髓，在於用反光讓冷靜的名器娓娓道來！🎬",
        "每一次俯衝與定格，都是為了捕捉那純粹而深邃的奢華質感！🌌",
        "點大圖看細節，你會讚歎每一道光澤背後的精密控光與像素後期大算計！👁️"
      ]
    },
    "企業LOGO與CIS設計": {
      name: "三角龍 Triko",
      role: "品牌識別研發官",
      imageDriveId: "1M7do_D_NPz-f1NMDJRoCgXQWe4bQpVo_", // TRIKO_P.png
      glowColor: "from-sky-500/25 to-blue-600/20 shadow-[0_0_50px_rgba(14,165,233,0.25)]",
      dialogues: [
        "吼！我是三角龍 Triko！用我最堅硬的頭楯三角幾何，為品牌打下黃金網格！📐🦖",
        "企業商標不僅線條優美，更是整個 CIS 形象的理性數字縮影！🌌",
        "手拿幾何對齊定位網格，我們為每一家企業精心搭建最穩定的視覺骨骼！✒️",
        "一個頂級商標能橫跨百年。一起深入網格探索線條背後的數學幾何美學吧！✨"
      ],
      idles: [
        "比例是線條的鋼琴鍵。好的 LOGO 即使在黑白單色下，音律依舊極致悠揚！🎼",
        "用極其精緻的簡練幾何線條，盛放品牌的宏大靈魂。這就是設計的理性至上！📐",
        "企業的視覺識別系統（CIS），是其向世界遞出的最重要第一張視覺名片！🌿"
      ]
    },
    "實體店面與展覽": {
      name: "空間導覽 MuMㄠ",
      role: "實體展間空間大師",
      imageDriveId: "1xdFRDuxv-offTrfIN68jU4i841goOjPZ", // 坐下.png
      glowColor: "from-rose-500/25 to-coral-500/20 shadow-[0_0_50px_rgba(244,63,94,0.25)]",
      dialogues: [
        "悠閒坐好！我是空間美學導師 MuMㄠ！讓我們安靜看著人潮在精美展間湧動吧！🎪🐾",
        "空間設計是三維的綜合藝術。要如何用大型輸出物料引導最舒服的觀展動線？🗺️",
        "展區看板、立體結構吊牌... 每一項大圖文輸出都得經過極嚴格的 100% 完稿與出血拼合！📐",
        "坐在展覽入口，用大器的插畫背景和大開海報，迎接每一位尊崇的參訪貴賓！🌟"
      ],
      idles: [
        "展覽逛累了嗎？來陪我坐一會兒，看看牆上那些精湛的超巨實體設計吧！🎨",
        "超高精度的海報輸出與抗褪色工藝，是確保實體店面高大上質感的必備底子！🎴",
        "將平面美學延展到三維的物理空間，我的優雅坐姿就是最佳的代言示範喵！✨"
      ]
    },
    "社群行銷小編圖文": {
      name: "奮鬥小編 MuMㄠ",
      role: "熱血社群小編",
      imageDriveId: "144FgZpX5ebsp7lJadjc3HxaLgTvIqInv", // 爛泥前.png
      glowColor: "from-yellow-500/25 to-amber-500/20 shadow-[0_0_50px_rgba(234,179,8,0.25)]",
      dialogues: [
        "喵唔！我是踩在爛泥裡依然精神抖擻的 MuMㄠ！熱血小編永遠在創意的最前線！🐾🔥",
        "哪怕生活是成堆的泥巴（爛泥前.png），小編也要繪製出最燃最逗趣的爆讚圖文！💥",
        "迅速洞察最新話題跟網絡跟熱梗迷因，用最幽默大方的畫筆擊碎大家的疲憊！🛒",
        "戴上大耳機大聲歌唱～只要心中有熱情，哪怕泥濘滿地也能開出絢麗的創意之花！🎵"
      ],
      idles: [
        "在泥濘中大步流星，這就是我們原創小編苦中作樂的極致浪漫與自豪！🚀",
        "別怕挫折！現在踩在爛泥裡，意味著未來只會平步青雲噢！打工人加油！✨",
        "想要能在 0.5 秒内牢牢拴住大眾指尖的小編貼文嗎？看我的熱血手繪企劃！🔥"
      ]
    },
    "商務印刷品設計": {
      name: "紙藝大師 MuMㄠ",
      role: "商務印刷極客手札",
      imageDriveId: "1h_kR_PViTQVM9dyh5ZhcfovaB5kGejD0", // 盤腿坐轉頭去背.png
      glowColor: "from-teal-500/25 to-cyan-500/20 shadow-[0_0_50px_rgba(20,184,166,0.25)]",
      dialogues: [
        "喵唔！細嗅一下油墨配上精緻壓燙後的温潤紙香～我是紙藝大師 MuMㄠ！🖨️🌿",
        "在心裡精密算計萊尼紙質地、磨砂壓花邊封和高級高亮燙金，盤腿沉思就是我的日常！📜",
        "商務手冊不只是承載字句，更是品牌的實體面子。裁切溢出與壓痕差半點都不行！📐",
        "翻閱這本印刷作品集，感受哪怕處在虛擬屏幕中，也彷彿要躍於指掌的完美高檔質感！🎨"
      ],
      idles: [
        "墨香溫熱、紙溫細膩。將數位的代碼化為實體拿在掌心沉甸甸的感動！🖤",
        "出血、排版拼對、壓折痕裁線... 完稿過程需要精密如同外科手術般的精細！📐",
        "我們用最專業的印刷製版控片，給品牌賦予最具深邃手感溫度的線下實體！💼"
      ]
    },
    "網站產品瀑布頁": {
      name: "流光 MuMㄠ",
      role: "長圖流暢加載大師",
      imageDriveId: "1nugKG10Q4xf6qoFTyqF8CJxtfqJljq4T", // 睡覺.png
      glowColor: "from-indigo-600/25 to-purple-500/20 shadow-[0_0_50px_rgba(79,70,229,0.25)]",
      dialogues: [
        "呼嚕... 呼嚕... 全能拼接 MuMㄠ 來也！在甜美夢境中才能理出無限順暢的超長網頁拼裝喔～😴💤",
        "網頁長圖滾動就像古典畫卷，加載載速與品質是考驗！我在夢中都要為之鑽研代碼！💻",
        "把無數大體積的高精視覺完美切片與無瑕拼接，換來你指尖那流暢極致的敘事視覺長河！🚀",
        "別輕輕戳醒我唷～睡得足靈感多，大圖拼接才不會出細縫，讓觀展體驗一瀉千里！🌟"
      ],
      idles: [
        "呼嚕嚕... 睡一覺起來，我的長圖瀑布頁加載效率又可以直接爆表了！📈💤",
        "讓網頁內容如同浩瀚長河般順滑流淌。點開大瀑布頁作品看看完美的對位吧！💻",
        "長圖排版的核心秘密：掌握在指尖上下滑動時的視覺呼吸、高低對比與精準留白！📜"
      ]
    },
    "電商產品銷售圖": {
      name: "元氣橘橘",
      role: "千萬流量銷售爆發大咖",
      imageDriveId: "1ZqwEVdSgE6ClGKJ4sZj-Cgn2q25AInK6", // 03.png
      glowColor: "from-orange-500/25 to-red-500/20 shadow-[0_0_50px_rgba(249,115,22,0.25)]",
      dialogues: [
        "哇！驚喜亮相！我是爆單智多星橘橘！大眼睛 03.png 可愛姿勢是我今天的元氣象徵！🍊🛒",
        "高端電商詳情頁的核心密碼：高反差強烈視覺抓睛 + 3秒刺痛購買需求的痛點排版！💥",
        "每一個微渲染產品大特寫、每一道霓虹廣告，都是點石成金、拉爆轉化率的祕訣！✨",
        "看我如何用大氣非凡的排版，幫最頂級的產品包裝出月銷破萬的輝煌淘金之路！🚀"
      ],
      idles: [
        "電商的海洋中，漂亮的詳情才能誘發顧客在停留的黃金十秒裡點下成交按鈕！🔥",
        "痛點狠、吸睛準、版面淨、美感硬！電商美編不單是精緻，更是頂尖的視覺行銷！📊",
        "來杯柑橘蘇打汽水～一起看看這些把品牌質感與千萬銷能實力完美糅合的小說詳情頁吧！🍹"
      ]
    },
    "賣場Banner橫幅廣告": {
      name: "彩霓 MuMㄠ",
      role: "流量橫幅廣告吸睛專家",
      imageDriveId: "1vw2VmkxKGl_GR50UtJ2dmHqa4kuIIC4d", // 拷貝.png
      glowColor: "from-pink-500/25 to-rose-500/20 shadow-[0_0_50px_rgba(236,72,153,0.25)]",
      dialogues: [
        "嘿！雙手大讚！這是我的『拷貝雙讚影分身』姿勢！我是極光 Banner 視覺魔術師！🎨⚡",
        "賣場橫幅的最大挑戰：在有限而扁長的區塊中，調和立體炫目字體去極速抓住讀者目光！👁️",
        "叮！促銷高霓閃爍！讓你的賣場點擊率飆升到最滿，吸金力高高掛起！💰💥",
        "點擊橫幅展示！每一個完美的流彩色調與浮雕質感，都埋伏著全渠道營銷的心得喔！🔥"
      ],
      idles: [
        "驚豔是第一眼，購買是落點。我的 Banner 會讓點擊這件事變成手指肌肉的本能！⚡",
        "雖然地方窄扁，但透過精準的三維排布與氣質漸層，依舊能製造澎湃空間感！💎",
        "一張高大上的促銷 Banner 就是全旗艦店的冠冕，點亮它，銷量不容置疑！📈"
      ]
    },
    "影音與多媒體設計": {
      name: "回眸編導 MuMㄠ",
      role: "多媒體動態後期總監",
      imageDriveId: "1ODr1QBQ77gaEzfbk7VZzvATOMILnyLtJ", // 爛泥後.png
      glowColor: "from-indigo-500/25 to-violet-500/20 shadow-[0_0_50px_rgba(99,102,241,0.25)]",
      dialogues: [
        "喀嚓！動態回眸定格！我是多媒體大師 MuMㄠ！這是我的『回首回眸坐姿』！🎥🎵",
        "畫面要咬住旋律，轉場卡點、重低音共鳴，這才叫具有生命力的動態美學！🎬",
        "從分鏡情境腳本、精編後期字效到 AI 智能音軌拼接，為企業品牌注入大片級震撼！✨",
        "戴上大音響吧！進去欣賞我的視頻作品集，保證一秒點燃並引爆你的视聽官感！🍿🚀"
      ],
      idles: [
        "節奏卡點、動感炫幕。每一個鏡頭對齐轉場，都是我們對電影品質不懈的深耕！🎞️",
        "好的影像短片超越一切無力的言辭，用故事直逼心扉，這就是多媒體的魔法！💖",
        "回首再回首，靈光一現、神作誕生。今天也陪我一起，靜靜感受光影留聲的澎湃吧！🌿"
      ]
    }
  }), []);

  const currentMascot = useMemo(() => {
    return categoryMascotMap[selectedCategory] || categoryMascotMap["All"];
  }, [selectedCategory, categoryMascotMap]);

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
  }, [selectedCategory, items]);
  const [activeModalItem, setActiveModalItem] = useState<PortfolioItem | null>(null);
  const [isWorkflowOpen, setIsWorkflowOpen] = useState<boolean>(false);
  const [isContactCardOpen, setIsContactCardOpen] = useState<boolean>(false);
  const [activeImageUrl, setActiveImageUrl] = useState<string | null>(null);
  const [isVideoActive, setIsVideoActive] = useState<boolean>(false);
  const [waterfallMode, setWaterfallMode] = useState<"stitch" | "single">("stitch");
  const [isMaximized, setIsMaximized] = useState<boolean>(false);
  const [stitchScrollProgress, setStitchScrollProgress] = useState<number>(0);
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

  // Hero white cat character interaction states
  const [isHeroSpeaking, setIsHeroSpeaking] = useState<boolean>(false);
  const [showHeroDialogue, setShowHeroDialogue] = useState<boolean>(false);
  const [heroDialogue, setHeroDialogue] = useState<string>("");
  const [displayedDialogue, setDisplayedDialogue] = useState<string>("");
  const [heroParticles, setHeroParticles] = useState<{ id: number; x: number; y: number; emoji: string }[]>([]);

  // Handle typewriter effect for lively dialog popups
  React.useEffect(() => {
    if (!showHeroDialogue || !heroDialogue) {
      setDisplayedDialogue("");
      return;
    }

    setDisplayedDialogue("");
    let currentText = "";
    let i = 0;
    
    const interval = setInterval(() => {
      if (i < heroDialogue.length) {
        currentText += heroDialogue[i];
        setDisplayedDialogue(currentText);
        i++;
      } else {
        clearInterval(interval);
      }
    }, 35); // 35ms per character is highly responsive and synced with cute audio blips

    return () => {
      clearInterval(interval);
    };
  }, [showHeroDialogue, heroDialogue]);

  const heroDialogues = useMemo(() => [
    "哈囉！我是 Cape Lee 👋 歡迎來到我的視覺與品牌整合設計宇宙！",
    "點選左下角的『看作品』，就能解鎖我經手的所有精彩作品喔！✨",
    "每一像素都承載著設計的溫度與堅持。希望你今天逛得開心！💖",
    "這隻白貓是我的原創 IP 角色 MuMㄠ 喔！是不是很可愛呢？🐾",
    "在右下角還有我們的 12 隻專業恐龍與吉祥物戰隊，也可以找他們聊天喔！🦖"
  ], []);

  const triggerHeroSpeaking = () => {
    if (isHeroSpeaking) {
      setIsHeroSpeaking(false);
      return;
    }
    const randomIndex = Math.floor(Math.random() * heroDialogues.length);
    setHeroDialogue(heroDialogues[randomIndex]);
    setIsHeroSpeaking(true);
  };

  const handleHeroClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const emojis = ["✨", "💖", "🐾", "🎨", "💬", "⭐", "🎵", "😻", "🎀"];
    const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];

    const newParticle = {
      id: Date.now() + Math.random(),
      x,
      y,
      emoji: randomEmoji,
    };

    setHeroParticles((prev) => [...prev, newParticle].slice(-20));
    triggerHeroSpeaking();
  };

  React.useEffect(() => {
    let dialogDelayTimeout: NodeJS.Timeout | null = null;
    let autoCloseTimeout: NodeJS.Timeout | null = null;

    if (isHeroSpeaking) {
      // 一開始對話框先隱藏 (或重設)
      setShowHeroDialogue(false);

      // 播放動物森友會風格的語音 (根據對話內容，最長播放 2.5 秒)
      if (heroDialogue) {
        animaleseSynth.play(heroDialogue, 2500);
      }

      // 嘴部動作開始 300ms 後，對話框才同步出現，使表情與講話節奏更立體生動
      dialogDelayTimeout = setTimeout(() => {
        setShowHeroDialogue(true);
      }, 300);

      // 4.2 秒後自動閉嘴，並隱藏對話框
      autoCloseTimeout = setTimeout(() => {
        setIsHeroSpeaking(false);
        setShowHeroDialogue(false);
      }, 4200);
    } else {
      setShowHeroDialogue(false);
      animaleseSynth.stop();
    }

    return () => {
      if (dialogDelayTimeout) clearTimeout(dialogDelayTimeout);
      if (autoCloseTimeout) clearTimeout(autoCloseTimeout);
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

  React.useEffect(() => {
    if (activeModalItem) {
      setActiveImageUrl(activeModalItem.imageUrl || (activeModalItem.images && activeModalItem.images.length > 0 ? activeModalItem.images[0] : undefined));
      setIsVideoActive(!!activeModalItem.videoUrl);
      setIsMaximized(false);
      setStitchScrollProgress(0);
      if (activeModalItem.category === "網站產品瀑布頁" || activeModalItem.category === "企業LOGO與CIS設計") {
        setWaterfallMode("stitch");
      } else {
        setWaterfallMode("single");
      }
    } else {
      setActiveImageUrl(null);
      setIsVideoActive(false);
      setIsMaximized(false);
      setStitchScrollProgress(0);
    }
  }, [activeModalItem]);

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
    return ["All", ...Array.from(list)];
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
    let list = selectedCategory === "All" 
      ? items 
      : items.filter(item => item.category === selectedCategory);
    
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

  // Find index of current modal item to support sliding control inside Lightbox
  const modalItemIndex = useMemo(() => {
    if (!activeModalItem) return -1;
    return filteredItems.findIndex(i => i.id === activeModalItem.id);
  }, [activeModalItem, filteredItems]);

  // List of media items for the active modal item to coordinate slides/media navigation
  const modalMediaList = useMemo(() => {
    if (!activeModalItem) return [];
    const list: { type: "video" | "image"; url: string }[] = [];
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

  const currentMediaIndex = useMemo(() => {
    if (modalMediaList.length === 0) return -1;
    if (isVideoActive) {
      return modalMediaList.findIndex(m => m.type === "video");
    }
    const currentUrl = activeImageUrl || (activeModalItem ? activeModalItem.imageUrl : null);
    return modalMediaList.findIndex(m => m.type === "image" && m.url === currentUrl);
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

  // Touch Swipe gestures support
  const touchStartX = React.useRef<number | null>(null);
  const touchStartY = React.useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartX.current = touch.clientX;
    touchStartY.current = touch.clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const touch = e.changedTouches[0];
    const diffX = touch.clientX - touchStartX.current;
    const diffY = touch.clientY - touchStartY.current;

    // 水平滑動距離大於垂直滑動距離，避免干擾上下滾動
    if (Math.abs(diffX) > Math.abs(diffY)) {
      if (Math.abs(diffX) > 40) { // 至少滑動 40px
        if (diffX < 0) {
          // 向左滑動 (下一張 / 下一個作品)
          if (modalMediaList.length > 1 && currentMediaIndex < modalMediaList.length - 1) {
            handleNextSlide();
          } else {
            // 切換至下一個作品
            if (modalItemIndex < filteredItems.length - 1) {
              setActiveModalItem(filteredItems[modalItemIndex + 1]);
            } else {
              setActiveModalItem(filteredItems[0]);
            }
          }
        } else {
          // 向右滑動 (上一張 / 上一個作品)
          if (modalMediaList.length > 1 && currentMediaIndex > 0) {
            handlePrevSlide();
          } else {
            // 切換至上一個作品
            if (modalItemIndex > 0) {
              setActiveModalItem(filteredItems[modalItemIndex - 1]);
            } else {
              setActiveModalItem(filteredItems[filteredItems.length - 1]);
            }
          }
        }
      }
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  const handlePrevModalItem = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (modalItemIndex > 0) {
      setActiveModalItem(filteredItems[modalItemIndex - 1]);
    } else {
      setActiveModalItem(filteredItems[filteredItems.length - 1]); // loop to end
    }
  };

  const handleNextModalItem = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (modalItemIndex < filteredItems.length - 1) {
      setActiveModalItem(filteredItems[modalItemIndex + 1]);
    } else {
      setActiveModalItem(filteredItems[0]); // loop to start
    }
  };

  // Keyboard navigation for Lightbox modal
  React.useEffect(() => {
    if (!activeModalItem) return;

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
        setActiveModalItem(null);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        // 左右方向鍵直接切換「上一個 / 下一個」作品
        if (modalItemIndex > 0) {
          setActiveModalItem(filteredItems[modalItemIndex - 1]);
        } else {
          setActiveModalItem(filteredItems[filteredItems.length - 1]);
        }
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        // 左右方向鍵直接切換「上一個 / 下一個」作品
        if (modalItemIndex < filteredItems.length - 1) {
          setActiveModalItem(filteredItems[modalItemIndex + 1]);
        } else {
          setActiveModalItem(filteredItems[0]);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeModalItem, filteredItems, modalItemIndex, modalMediaList, currentMediaIndex]);

  return (
    <div className={`min-h-screen flex flex-col font-sans relative overflow-x-hidden transition-colors duration-500 ${
      theme === "light" 
        ? "light-theme text-[#1F2937] selection:bg-amber-500/20 selection:text-amber-800" 
        : theme === "sepia"
        ? "sepia-theme text-[#433422] selection:bg-amber-500/20 selection:text-amber-900"
        : "bg-[#070707] text-[#E5E7EB] selection:bg-amber-500/20 selection:text-amber-300"
    }`}>
      
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
          <button
            type="button"
            onClick={scrollToTop}
            className="flex items-center gap-2 sm:gap-3 cursor-pointer group/brand select-none hover:opacity-90 active:scale-[0.98] transition-all duration-200 text-left outline-none"
          >
            <MinimalistLogo theme={theme} className="w-[30px] h-[30px] md:w-[36px] md:h-[36px] shrink-0 group-hover/brand:scale-105 transition-transform duration-300" />
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className={`font-display font-semibold tracking-tight text-xs sm:text-sm md:text-md uppercase transition-colors duration-300 ${brandingTextClass}`}>capelee</span>
                <span className="hidden sm:inline-block text-[9px] font-mono px-1.5 py-0.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded font-semibold whitespace-nowrap">2026 OFFICIAL</span>
              </div>
              <p className="hidden sm:block text-[10px] font-mono text-zinc-500 tracking-wider">CREATIVE VISUAL PORTFOLIO</p>
            </div>
          </button>

          <div className="flex items-center gap-2 sm:gap-4 md:gap-6">
            {/* 導航文字連結：作品 & 履歷 & AI工作流 */}
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
              <button
                type="button"
                onClick={() => setIsWorkflowOpen(true)}
                className={`text-xs sm:text-sm font-sans font-normal transition-colors duration-250 cursor-pointer hover:scale-105 active:scale-95 ${navLinkClass}`}
                title="查看 AI 輔助設計工作流"
              >
                AI工作流
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
                title="訪問 Instagram (木貓教)"
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
      <main className="flex-1 w-full max-w-7xl xl:max-w-[1400px] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-8 md:pt-24 md:pb-12 z-10 space-y-12 md:space-y-16">
        
        {/* 極簡頂部 Hero Section */}
        <section id="hero-minimalist" className="relative pt-4 pb-8 md:pt-10 md:pb-14 overflow-visible flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12 border-b border-zinc-150/50 dark:border-white/5 scroll-mt-[48px] md:scroll-mt-[58px]">
          <div className="flex-1 space-y-6 max-w-2xl text-left">
            <div className="space-y-2">
              <span className={`text-[11px] sm:text-xs font-mono tracking-[0.2em] font-bold uppercase ${
                theme === "sepia" 
                  ? "text-[#A05C2C]" 
                  : theme === "light" 
                  ? "text-amber-600" 
                  : "text-amber-400"
              }`}>
                視覺設計 · 平面設計
              </span>
              <h1 className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-sans font-extrabold tracking-tight leading-[1.1] transition-colors duration-350 ${
                theme === "sepia" 
                  ? "text-[#2B1B0C]" 
                  : theme === "light" 
                  ? "text-zinc-950" 
                  : "text-white"
              }`}>
                Cape Lee
              </h1>
            </div>
            
            <p className={`text-sm sm:text-md md:text-[17px] font-light leading-relaxed transition-colors duration-350 ${
              theme === "sepia" 
                ? "text-[#5C4D3C]" 
                : theme === "light" 
                ? "text-zinc-650" 
                : "text-zinc-300"
            }`}>
              5 ~ 6 年品牌商業整合設計實戰經驗，作品橫跨電商視覺、品牌識別與原創角色 IP。
            </p>

            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <button
                onClick={() => scrollToElement("portfolio-grid")}
                className={`px-6 py-3 font-semibold rounded-xl text-xs sm:text-sm transition-all duration-300 shadow-md active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer ${
                  theme === "sepia"
                    ? "bg-[#A05C2C] hover:bg-[#854B22] text-[#FCF8EE] shadow-amber-950/20"
                    : theme === "light"
                    ? "bg-amber-600 hover:bg-amber-750 text-white shadow-amber-600/20"
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
                  className={`px-6 py-3 font-medium rounded-xl text-xs sm:text-sm transition-all duration-300 border backdrop-blur active:scale-95 flex items-center justify-center gap-1.5 ${
                    theme === "sepia"
                      ? "border-[#DFCFA0] hover:bg-[#EADECC]/40 text-[#4F3C28]"
                      : theme === "light"
                      ? "border-zinc-200 hover:bg-zinc-50 text-zinc-700"
                      : "border-white/10 hover:bg-white/5 text-zinc-300"
                  }`}
                  title="開啟雲端儲存的傳統 PDF 作品集"
                >
                  <FileText className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>PDF 作品集</span>
                </a>
              )}
            </div>
          </div>

          <div className="w-full lg:w-auto shrink-0 flex items-center justify-center overflow-visible p-4">
            <motion.div
              initial={{ opacity: 0, x: 40, rotate: 5, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, rotate: 0, scale: 1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.93, scaleY: 0.88, scaleX: 1.05 }}
              transition={{ type: "spring", bounce: 0.15, duration: 1.2, delay: 0.1 }}
              onClick={handleHeroClick}
              className="w-full max-w-[280px] sm:max-w-[360px] lg:max-w-[420px] aspect-square relative flex items-center justify-center overflow-visible cursor-pointer group select-none"
            >
              {/* Soft background glow matching mascot role */}
              <div className="absolute inset-4 bg-amber-500/8 rounded-full blur-[50px] -z-10 animate-pulse duration-[6000ms]" />
              
              {/* Click Particles Burst */}
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
                    initial={{ opacity: 0, scale: 0.8, y: 15 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, y: 15 }}
                    transition={{ type: "spring", stiffness: 300, damping: 22 }}
                    className={`absolute z-30 w-[240px] sm:w-[280px] p-4 rounded-2xl shadow-xl border text-xs sm:text-sm font-medium leading-relaxed
                      ${
                        theme === "sepia"
                          ? "bg-[#FAF4E5] border-[#EAD09D] text-[#382B1D] shadow-[#382B1D]/5"
                          : theme === "light"
                          ? "bg-white border-zinc-150 text-zinc-800 shadow-zinc-200/50"
                          : "bg-zinc-950/95 border-zinc-800/80 text-zinc-100 shadow-black/40"
                      }
                      bottom-[105%] left-1/2 -translate-x-1/2 lg:left-auto lg:right-[72%] lg:-translate-x-0 lg:bottom-[88%] lg:translate-y-0
                    `}
                  >
                    {/* Tiny bubble tail pointing down-right towards mascot, solid matching background to cover parent border */}
                    <div className={`absolute w-3 h-3 rotate-45 border-r border-b bottom-[-5px] left-1/2 -translate-x-1/2 lg:left-auto lg:right-8 lg:-translate-x-0
                      ${
                        theme === "sepia"
                          ? "bg-[#FAF4E5] border-[#EAD09D]"
                          : theme === "light"
                          ? "bg-white border-zinc-150"
                          : "bg-zinc-950 border-zinc-800/80"
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
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className={`w-full h-auto relative overflow-visible transition-all duration-500 ease-out ${
                isHeroSpeaking 
                  ? "mumao-speaking" 
                  : "mumao-idle group-hover:mumao-playful"
              }`}>
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
                `}</style>

                {/* 1. 閉嘴版 (Base / Default) */}
                <img
                  src="https://drive.google.com/thumbnail?sz=w1000&id=1WGZs1SZI8NTKaF6M_-IpvD5EjGFll3Ri"
                  alt="Cape Lee mascot closed mouth"
                  referrerPolicy="no-referrer"
                  className={`w-full h-auto object-contain filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.08)] dark:drop-shadow-[0_15px_35px_rgba(0,0,0,0.6)] relative z-10 transition-transform duration-500 ${
                    isHeroSpeaking ? "mumao-anim-closed" : "opacity-100"
                  }`}
                />
                {/* 2. 說話版1 (中開) */}
                <img
                  src="https://drive.google.com/thumbnail?sz=w1000&id=1ZhhZ25s_ADm5iFcAO_I-YxglQlFlcsjk"
                  alt="Cape Lee mascot speaking 1"
                  referrerPolicy="no-referrer"
                  className={`w-full h-auto object-contain filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.08)] dark:drop-shadow-[0_15px_35px_rgba(0,0,0,0.6)] absolute inset-0 transition-transform duration-500 ${
                    isHeroSpeaking ? "mumao-anim-medium z-20" : "opacity-0 pointer-events-none z-0"
                  }`}
                />
                {/* 3. 說話版2 (大開) */}
                <img
                  src="https://drive.google.com/thumbnail?sz=w1000&id=1Q7naVG-GPyr6s5X57rYiKlSofgb8hpBh"
                  alt="Cape Lee mascot speaking 2"
                  referrerPolicy="no-referrer"
                  className={`w-full h-auto object-contain filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.08)] dark:drop-shadow-[0_15px_35px_rgba(0,0,0,0.6)] absolute inset-0 transition-transform duration-500 ${
                    isHeroSpeaking ? "mumao-anim-open z-20" : "opacity-0 pointer-events-none z-0"
                  }`}
                />
              </div>
            </motion.div>
          </div>
        </section>

        {/* 區塊標題 & 卡片過濾器 */}
        <section id="portfolio-grid" className="space-y-8 scroll-mt-[48px] md:scroll-mt-[58px]">
          <div className="max-w-3xl mx-auto text-center space-y-3">
            <h2 className="text-3xl md:text-4xl font-display font-medium text-white tracking-tight">
              探索設計作品
            </h2>
            <div className="h-[2px] w-12 bg-amber-500 mx-auto rounded-full"></div>
            <p className="text-zinc-400 text-xs md:text-sm leading-relaxed font-light">
              點擊作品查看詳細資訊
            </p>
          </div>

          {/* 各類作品過濾選項 (電腦版精緻呈現，手機版優化為橫向滑動選單與二列極簡格狀面板) */}
          <div className="w-full pt-2 flex flex-col items-center gap-4">
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

            {/* 卡片詳情顯示模式切換按鈕 */}
            <button 
              onClick={() => setShowAllDetails(prev => !prev)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 border ${
                showAllDetails 
                  ? theme === 'sepia'
                    ? "bg-[#E2D2B3]/60 text-[#433422] border-[#C8A97A] hover:bg-[#D5B98A]"
                    : theme === 'light'
                    ? "bg-amber-100 text-amber-700 border-amber-300 hover:bg-amber-200"
                    : "bg-amber-500/20 text-amber-500 border-amber-500/40 hover:bg-amber-500/30" 
                  : theme === 'sepia'
                    ? "bg-[#FAF4E5] text-[#8C7B69] border-[#EADECC] hover:bg-[#F3DFBD] hover:text-[#433422]"
                    : theme === 'light'
                    ? "bg-white text-zinc-500 border-zinc-200 hover:bg-zinc-50 hover:text-zinc-800 hover:border-zinc-300"
                    : "bg-white/5 text-zinc-400 border-white/10 hover:bg-white/10 hover:text-zinc-200 hover:border-white/20"
              }`}
            >
              {showAllDetails ? <X className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              {showAllDetails ? "恢復簡潔圖像預覽模式" : "展開原始卡片詳細資訊"}
            </button>
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

            {/* 常見快篩標籤 */}
            <div className="flex flex-wrap justify-center gap-1.5 mt-2.5">
              <span className={`text-[10px] font-sans font-normal self-center mr-1 ${
                theme === "sepia" ? "text-[#8C7B69]" : "text-zinc-500"
              }`}>
                熱門關鍵字:
              </span>
              {["Illustrator", "Photoshop", "AI", "CI"].map((tag) => {
                const isSelected = searchQuery.toLowerCase() === tag.toLowerCase();
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setSearchQuery(isSelected ? "" : tag)}
                    className={`px-2 py-0.5 rounded text-[10px] font-sans transition-all duration-300 cursor-pointer ${
                      isSelected
                        ? (theme === "sepia"
                            ? "bg-amber-700 text-white font-medium"
                            : theme === "light"
                            ? "bg-amber-500 text-black font-semibold"
                            : "bg-amber-500 text-black font-semibold")
                        : (theme === "sepia"
                            ? "bg-white/50 text-[#5C4B3A] border border-[#FAF4E5] hover:bg-white hover:text-amber-800"
                            : theme === "light"
                            ? "bg-zinc-100 text-zinc-500 border border-zinc-200/50 hover:bg-zinc-200 hover:text-zinc-800"
                            : "bg-white/5 text-zinc-400 border border-white/5 hover:bg-white/10 hover:text-zinc-200")
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
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
                    showAllDetails={showAllDetails}
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
        />

        {/* 回到最上方按鈕 */}
        <div id="section_scroll_to_top_bottom" className="flex justify-center pt-12">
          <button
            type="button"
            id="btn_scroll_to_top_bottom"
            onClick={scrollToTop}
            className={`group px-6 py-3 rounded-full font-semibold text-xs transition-all duration-300 border flex items-center gap-2 shadow-lg cursor-pointer active:scale-95 ${
              theme === "light"
                ? "bg-white hover:bg-amber-500 text-zinc-600 hover:text-white border-zinc-200 hover:border-amber-400 shadow-sm hover:shadow-amber-500/10"
                : "bg-[#0E0E0E] hover:bg-amber-500 text-zinc-400 hover:text-black border-white/5 hover:border-amber-400 shadow-black/50 hover:shadow-amber-500/10"
            }`}
            title="回到最上方"
          >
            <ArrowUp className="h-4 w-4 transition-transform group-hover:-translate-y-0.5" />
            <span>回到頁面頂端</span>
          </button>
        </div>

      </main>

      {/* 底部靜態版權聲明 */}
      <footer className="mt-16 border-t border-white/5 bg-[#080808]">
        <div className="max-w-7xl xl:max-w-[1400px] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-7 w-7 rounded-lg bg-gradient-to-tr from-amber-500 to-indigo-600 flex items-center justify-center text-white text-xs font-semibold">
              CP
            </div>
            <p className="text-xs text-zinc-400">
              Cape Lee <span className="text-zinc-600">|</span> 2026 Creative Visual & IP Portfolio
            </p>
          </div>
          <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider text-center md:text-right">
            Designed & Coded with Absolute Craftsmanship • Studio Ready
          </p>
        </div>
      </footer>


      {/* 全域作品亮點彈出 Lightbox (Lightbox Modal with motion) */}
      <AnimatePresence>
        {activeModalItem && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveModalItem(null)}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              transition={{ type: "spring", duration: 0.4 }}
              onClick={(e) => e.stopPropagation()}
              className={`bg-[#0E0E0E] border border-white/10 shadow-2xl relative my-auto transition-all duration-300 ${
                activeModalItem && (activeModalItem.category === "網站產品瀑布頁" || activeModalItem.category === "企業LOGO與CIS設計") && isMaximized
                  ? "max-w-full md:max-w-6xl w-full h-[95vh] md:h-[92vh] flex flex-col rounded-2xl"
                  : "max-w-4xl w-full rounded-2xl"
              }`}
            >
              
              {/* 關閉按鈕 */}
              <button
                type="button"
                id="btn_modal_close"
                onClick={() => setActiveModalItem(null)}
                className="absolute top-4 right-4 z-[35] p-2 rounded-lg bg-black/70 hover:bg-black text-zinc-400 hover:text-white transition-colors border border-white/10 cursor-pointer"
                title="關閉明細"
              >
                <X className="h-5 w-5" />
              </button>

              {/* 上一張 / 下一張左右滑鎖 */}
              {filteredItems.length > 1 && !isMaximized && (
                <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between px-2 pointer-events-none hidden lg:flex">
                  <button
                    type="button"
                    onClick={handlePrevModalItem}
                    className="p-2.5 rounded-full bg-black/80 hover:bg-black/95 text-zinc-400 hover:text-white border border-white/5 pointer-events-auto transition active:scale-95 cursor-pointer"
                    title="前一個作品"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNextModalItem}
                    className="p-2.5 rounded-full bg-black/80 hover:bg-black/95 text-zinc-400 hover:text-white border border-white/5 pointer-events-auto transition active:scale-95 cursor-pointer"
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
                  <div 
                    onTouchStart={handleTouchStart}
                    onTouchEnd={handleTouchEnd}
                    onScroll={(e) => {
                      if ((activeModalItem.category === "網站產品瀑布頁" || activeModalItem.category === "企業LOGO與CIS設計") && waterfallMode === "stitch") {
                        const target = e.currentTarget;
                        const totalScroll = target.scrollHeight - target.clientHeight;
                        if (totalScroll > 0) {
                          const progress = (target.scrollTop / totalScroll) * 100;
                          setStitchScrollProgress(progress);
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
                          <div className="flex items-center gap-2 text-amber-400 font-medium">
                            <span className="flex h-2 w-2 relative">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                            </span>
                            <span className="hidden sm:inline">已無縫拼接為直式長圖 (請往下滾動閱讀 / 可左右滑動切換作品)</span>
                            <span className="sm:hidden text-[10px]">無縫長圖 (下滑閱讀 / 左右滑動切換作品)</span>
                          </div>
                          
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
                              optimizeSize={800}
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
                          <p className="text-xs font-medium text-amber-400 flex items-center gap-1.5">
                            <span>目前視圖：直式產品智慧拼接長圖</span>
                            {isMaximized && (
                              <span className="bg-amber-400/20 text-amber-400 text-[9px] px-1.5 py-0.5 rounded font-mono font-bold tracking-wider border border-amber-400/30">
                                FULL SCREEN READ MODE
                              </span>
                            )}
                          </p>
                          <p className="text-[10px] text-zinc-500 font-light">已重組拼接 {activeModalItem.images?.length || 0} 節視覺切片，極致展現長圖排版之敘事美學。</p>
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
                      <div className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 mb-1.5 flex items-center justify-between">
                        <span>專案多媒體選單 ({activeModalItem.videoUrl ? 1 : 0} 影片, {activeModalItem.images?.length || 0} 照片)</span>
                        <span className="text-amber-400/80">點擊切換影片或作品照</span>
                      </div>
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
                          onClick={() => setActiveModalItem(null)}
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
                    onClick={handlePrevModalItem}
                    className="flex items-center gap-1 text-xs text-zinc-400 hover:text-white px-3 py-1 cursor-pointer"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span>上一件</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleNextModalItem}
                    className="flex items-center gap-1 text-xs text-zinc-400 hover:text-white px-3 py-1 cursor-pointer"
                  >
                    <span>下一件</span>
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              )}

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI 設計輔助工作流彈出框 (Workflow Bottom Sheet / Modal) */}
      <AnimatePresence>
        {isWorkflowOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsWorkflowOpen(false)}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 md:p-6"
          >
            <motion.div
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 30, stiffness: 220 }}
              onClick={(e) => e.stopPropagation()}
              className={`w-full max-w-4xl rounded-t-3xl sm:rounded-2xl overflow-hidden shadow-2xl flex flex-col h-[85vh] sm:h-auto max-h-[85vh] sm:max-h-[90vh] border transition-colors duration-300 ${
                theme === "dark" 
                  ? "bg-[#0E0E0E] border-white/10 text-zinc-100" 
                  : theme === "sepia" 
                  ? "bg-[#FAF4E5] border-[#EADECC] text-[#433422]" 
                  : "bg-white border-zinc-200 text-zinc-900"
              }`}
            >
              {/* 頂部裝飾條 (手機板 RWD 拖拽把手視覺表示) */}
              <div className="flex sm:hidden justify-center py-2 shrink-0">
                <div className={`w-12 h-1 rounded-full ${
                  theme === "dark" ? "bg-zinc-800" : theme === "sepia" ? "bg-[#DECDB2]" : "bg-zinc-200"
                }`} />
              </div>

              {/* 模態框標頭 */}
              <div className={`px-6 py-5 border-b flex items-center justify-between shrink-0 ${
                theme === "dark" ? "border-white/5" : theme === "sepia" ? "border-amber-950/10" : "border-zinc-100"
              }`}>
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl flex items-center justify-center ${
                    theme === "dark" ? "bg-amber-500/10 text-amber-400" : theme === "sepia" ? "bg-amber-700/10 text-[#433422]" : "bg-amber-100 text-amber-700"
                  }`}>
                    <Sparkles className="h-5 w-5 animate-pulse" />
                  </div>
                  <div>
                    <h3 className={`text-base md:text-lg font-display font-semibold ${
                      theme === "dark" ? "text-white" : theme === "sepia" ? "text-[#433422]" : "text-zinc-900"
                    }`}>
                      我的 AI 輔助設計工作流
                    </h3>
                    <p className={`text-[11px] font-mono tracking-wider uppercase mt-0.5 ${
                      theme === "dark" ? "text-zinc-500" : theme === "sepia" ? "text-[#8C7B69]" : "text-zinc-500"
                    }`}>
                      AI-ASSISTED DESIGN & ENGINEERING ENGINE
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsWorkflowOpen(false)}
                  className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                    theme === "dark" 
                      ? "bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white border-white/5" 
                      : theme === "sepia" 
                      ? "bg-[#F4ECD8] hover:bg-[#EFE5CC] text-[#8C7B69] hover:text-[#433422] border-[#E8DCBD]" 
                      : "bg-zinc-50 hover:bg-zinc-100 text-zinc-500 hover:text-zinc-900 border-zinc-200"
                  }`}
                  title="關閉工作流說明"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* 模態框主體 (可捲動區塊) */}
              <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 md:space-y-8 scrollbar-thin">
                
                {/* 引言部分 */}
                <div className={`p-4 md:p-5 rounded-xl border flex flex-col md:flex-row md:items-center gap-4 ${
                  theme === "dark" 
                    ? "bg-amber-500/5 border-amber-500/10" 
                    : theme === "sepia" 
                    ? "bg-[#F4ECD8]/40 border-amber-900/10" 
                    : "bg-amber-50/45 border-amber-200/40"
                }`}>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0 ${
                    theme === "dark" ? "bg-amber-500/10" : theme === "sepia" ? "bg-[#EDE2CA]" : "bg-amber-100/50"
                  }`}>
                    🚀
                  </div>
                  <div className="space-y-1">
                    <h4 className={`text-xs md:text-sm font-semibold tracking-wide flex items-center gap-2 ${
                      theme === "sepia" ? "text-amber-950" : theme === "light" ? "text-zinc-800" : "text-amber-400"
                    }`}>
                      人機協作美學理念
                    </h4>
                    <p className={`text-xs leading-relaxed ${
                      theme === "sepia" ? "text-[#5C4D3C]" : theme === "light" ? "text-zinc-600" : "text-zinc-400"
                    }`}>
                      在創意的起點與終點，設計師始終擁有絕對控制。AI 不是在取代創作，而是在極大限度拓展想像力的邊界。通過結構化的提示工程與神經解耦局部重繪，我們將混亂的像素鍛造成富有呼吸感的前端組件。
                    </p>
                  </div>
                </div>

                {/* 導航工作流四大流程步驟 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  
                  {/* Step 1 */}
                  <div className={`p-5 md:p-6 rounded-2xl border transition-all duration-300 flex flex-col justify-between ${
                    theme === "dark" 
                      ? "bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10" 
                      : theme === "sepia" 
                      ? "bg-[#F4ECD8] border-[#E8DCBD]" 
                      : "bg-zinc-50 border-zinc-200/60"
                  }`}>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className={`text-[10px] font-mono tracking-wider font-semibold uppercase px-2 py-0.5 rounded ${
                          theme === "dark" ? "bg-amber-500/10 text-amber-400" : "bg-amber-500/20 text-amber-800"
                        }`}>STAGES 01</span>
                        <div className={`p-1.5 rounded-lg ${
                          theme === "dark" ? "bg-white/5" : "bg-black/5"
                        }`}>
                          <Zap className={`h-4 w-4 ${
                            theme === "dark" ? "text-amber-400" : "text-amber-800"
                          }`} />
                        </div>
                      </div>
                      
                      <h4 className={`text-sm md:text-base font-semibold ${
                        theme === "dark" ? "text-white" : theme === "sepia" ? "text-[#433422]" : "text-zinc-800"
                      }`}>
                        前期發想｜思維激盪與文案策略
                      </h4>
                      
                      <p className={`text-xs leading-relaxed ${
                        theme === "dark" ? "text-zinc-400" : theme === "sepia" ? "text-[#6C5B48]" : "text-zinc-600"
                      }`}>
                        在專案啟動初期，我將 AI 作為最強大腦，打破單一思考的局限性。輸入核心概念，引導 AI 進行多維度的受眾分析（Target Audience）與市場痛點盲測。同時，利用 AI 產出結構化的 Prompt 關鍵字策略，在極短時間內延伸出多元的視覺風格可能性。
                      </p>

                      <div className="space-y-1.5 pt-2">
                        <span className={`text-[9.5px] font-mono uppercase block ${
                          theme === "dark" ? "text-zinc-500" : "text-zinc-400"
                        }`}>協作工具:</span>
                        <div className={`relative px-3 py-2 rounded-lg font-mono text-[10.5px] leading-relaxed border flex flex-col gap-1 ${
                          theme === "dark" 
                            ? "bg-black/60 text-zinc-300 border-white/5" 
                            : theme === "sepia" 
                            ? "bg-[#EDE2CA] text-[#433422] border-amber-950/5" 
                            : "bg-zinc-100 text-zinc-700 border-zinc-200/50"
                        }`}>
                          <div>• <span className="text-amber-500">Gemini</span>, <span className="text-amber-500">ChatGPT</span></div>
                        </div>
                      </div>
                    </div>

                    <div className={`mt-4 pt-3 border-t text-[11px] leading-relaxed flex items-start gap-1 ${
                      theme === "dark" ? "border-white/5 text-zinc-500" : "border-black/5 text-[#8C7B69]"
                    }`}>
                      <span className="shrink-0 text-amber-500 font-semibold font-sans">💡 生產力產出：</span>
                      <span>【多樣性躍升】 在 1 小時內精準提煉出 5 種不同維度與敘事走向的視覺提案，讓前期的創意漏斗（Funnel）更加寬廣。</span>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className={`p-5 md:p-6 rounded-2xl border transition-all duration-300 flex flex-col justify-between ${
                    theme === "dark" 
                      ? "bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10" 
                      : theme === "sepia" 
                      ? "bg-[#F4ECD8] border-[#E8DCBD]" 
                      : "bg-zinc-50 border-zinc-200/60"
                  }`}>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className={`text-[10px] font-mono tracking-wider font-semibold uppercase px-2 py-0.5 rounded ${
                          theme === "dark" ? "bg-indigo-500/10 text-indigo-400" : "bg-indigo-500/15 text-indigo-800"
                        }`}>STAGES 02</span>
                        <div className={`p-1.5 rounded-lg ${
                          theme === "dark" ? "bg-white/5" : "bg-black/5"
                        }`}>
                          <Layers className={`h-4 w-4 ${
                            theme === "dark" ? "text-indigo-400" : "text-indigo-800"
                          }`} />
                        </div>
                      </div>
                      
                      <h4 className={`text-sm md:text-base font-semibold ${
                        theme === "dark" ? "text-white" : theme === "sepia" ? "text-[#433422]" : "text-zinc-800"
                      }`}>
                        中期探索｜風格原型與視覺盲測
                      </h4>
                      
                      <p className={`text-xs leading-relaxed ${
                        theme === "dark" ? "text-zinc-400" : theme === "sepia" ? "text-[#6C5B48]" : "text-zinc-600"
                      }`}>
                        拒絕傳統耗時的素材搜集，用最快的速度看見創意的形狀。利用前期提煉出的關鍵字，進行多版本的風格原稿生成。在這個階段，我專注於色調、構圖與氛圍（Moodboard）的快速矩陣測試，不發散、不盲目開盲盒，而是精準定調專案的視覺 DNA。
                      </p>

                      <div className="space-y-1.5 pt-2">
                        <span className={`text-[9.5px] font-mono uppercase block ${
                          theme === "dark" ? "text-zinc-500" : "text-zinc-400"
                        }`}>協作工具:</span>
                        <div className={`relative px-3 py-2 rounded-lg font-mono text-[10.5px] leading-relaxed border flex flex-col gap-1 ${
                          theme === "dark" 
                            ? "bg-black/60 text-zinc-300 border-white/5" 
                            : theme === "sepia" 
                            ? "bg-[#EDE2CA] text-[#433422] border-amber-950/5" 
                            : "bg-zinc-100 text-zinc-700 border-zinc-200/50"
                        }`}>
                          <div>• <span className="text-amber-500">Adobe Firefly</span></div>
                          <div>• <span className="text-amber-500">Leonardo AI</span></div>
                          <div>• <span className="text-amber-500">Midjourney</span></div>
                        </div>
                      </div>
                    </div>

                    <div className={`mt-4 pt-3 border-t text-[11px] leading-relaxed flex items-start gap-1 ${
                      theme === "dark" ? "border-white/5 text-zinc-500" : "border-black/5 text-[#8C7B69]"
                    }`}>
                      <span className="shrink-0 text-amber-500 font-semibold font-sans">💡 生產力產出：</span>
                      <span>【專注核心】大幅降低過往在圖庫中大海撈針的繁瑣時間，將工作重心 100% 回歸於設計師最核心的「美學把關」與「精緻度雕琢」。</span>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className={`p-5 md:p-6 rounded-2xl border transition-all duration-300 flex flex-col justify-between ${
                    theme === "dark" 
                      ? "bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10" 
                      : theme === "sepia" 
                      ? "bg-[#F4ECD8] border-[#E8DCBD]" 
                      : "bg-zinc-50 border-zinc-200/60"
                  }`}>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className={`text-[10px] font-mono tracking-wider font-semibold uppercase px-2 py-0.5 rounded ${
                          theme === "dark" ? "bg-emerald-500/10 text-emerald-400" : "bg-emerald-500/15 text-emerald-800"
                        }`}>STAGES 03</span>
                        <div className={`p-1.5 rounded-lg ${
                          theme === "dark" ? "bg-white/5" : "bg-black/5"
                        }`}>
                          <ZoomIn className={`h-4 w-4 ${
                            theme === "dark" ? "text-emerald-400" : "text-emerald-800"
                          }`} />
                        </div>
                      </div>
                      
                      <h4 className={`text-sm md:text-base font-semibold ${
                        theme === "dark" ? "text-white" : theme === "sepia" ? "text-[#433422]" : "text-zinc-800"
                      }`}>
                        後期完稿｜專業精修與商業落地
                      </h4>
                      
                      <p className={`text-xs leading-relaxed ${
                        theme === "dark" ? "text-zinc-400" : theme === "sepia" ? "text-[#6C5B48]" : "text-zinc-600"
                      }`}>
                        AI 產出的只是素材，唯有透過設計師的手，才能轉化為符合市場標準的商品。將 AI 生成的原型匯入專業軟體，進行局部重繪（Inpainting）、光影細修、去背與去瑕疵。利用編修軟體優化角色骨架，並透過 Illustrator 將關鍵視覺進行向量化（Vectorization）與精準排版，確保多解析度輸出的品質。
                      </p>

                      <div className="space-y-1.5 pt-2">
                        <span className={`text-[9.5px] font-mono uppercase block ${
                          theme === "dark" ? "text-zinc-500" : "text-zinc-400"
                        }`}>協作工具:</span>
                        <div className={`relative px-3 py-2 rounded-lg font-mono text-[10.5px] leading-relaxed border flex flex-col gap-1 ${
                          theme === "dark" 
                            ? "bg-black/60 text-zinc-300 border-white/5" 
                            : theme === "sepia" 
                            ? "bg-[#EDE2CA] text-[#433422] border-amber-950/5" 
                            : "bg-zinc-100 text-zinc-700 border-zinc-200/50"
                        }`}>
                          <div>• <span className="text-amber-500">Adobe Photoshop</span></div>
                          <div>• <span className="text-amber-500">Adobe Illustrator</span></div>
                          <div>• <span className="text-amber-500">Canva</span></div>
                        </div>
                      </div>
                    </div>

                    <div className={`mt-4 pt-3 border-t text-[11px] leading-relaxed flex items-start gap-1 ${
                      theme === "dark" ? "border-white/5 text-zinc-500" : "border-black/5 text-[#8C7B69]"
                    }`}>
                      <span className="shrink-0 text-amber-500 font-semibold font-sans">💡 生產力產出：</span>
                      <span>【效率轉化】成功實現「AI 輔助繪圖 20% + 人類美學完稿 80%」的黃金比例，既保有設計師獨特的筆觸與結構主導權，又兼顧了產出效率。</span>
                    </div>
                  </div>

                  {/* Step 4 */}
                  <div className={`p-5 md:p-6 rounded-2xl border transition-all duration-300 flex flex-col justify-between ${
                    theme === "dark" 
                      ? "bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10" 
                      : theme === "sepia" 
                      ? "bg-[#F4ECD8] border-[#E8DCBD]" 
                      : "bg-zinc-50 border-zinc-200/60"
                  }`}>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className={`text-[10px] font-mono tracking-wider font-semibold uppercase px-2 py-0.5 rounded ${
                          theme === "dark" ? "bg-amber-500/10 text-amber-400" : "bg-amber-505/20 text-amber-800"
                        }`}>STAGES 04</span>
                        <div className={`p-1.5 rounded-lg ${
                          theme === "dark" ? "bg-white/5" : "bg-black/5"
                        }`}>
                          <Sparkles className={`h-4 w-4 ${
                            theme === "dark" ? "text-amber-400" : "text-amber-800"
                          }`} />
                        </div>
                      </div>
                      
                      <h4 className={`text-sm md:text-base font-semibold ${
                        theme === "dark" ? "text-white" : theme === "sepia" ? "text-[#433422]" : "text-zinc-800"
                      }`}>
                        印前模擬｜圖生圖與週邊開發
                      </h4>
                      
                      <p className={`text-xs leading-relaxed ${
                        theme === "dark" ? "text-zinc-400" : theme === "sepia" ? "text-[#6C5B48]" : "text-zinc-600"
                      }`}>
                        在正式進入印刷與市集量產前，用技術降低實體製作的容錯率。運用「圖生圖」與結構參考功能，將設計好的 2D 視覺或角色 IP，快速投射至模擬場景（Mockup）中。無論是市集宣傳海報的街頭貼圖，還是壓克力立牌、週邊商品的實體光影模擬，都能在打樣前得到最直觀的視覺驗證。
                      </p>

                      <div className="space-y-1.5 pt-2">
                        <span className={`text-[9.5px] font-mono uppercase block ${
                          theme === "dark" ? "text-zinc-500" : "text-zinc-400"
                        }`}>協作工具:</span>
                        <div className={`relative px-3 py-2 rounded-lg font-mono text-[10.5px] leading-relaxed border flex flex-col gap-1 ${
                          theme === "dark" 
                            ? "bg-black/60 text-zinc-300 border-white/5" 
                            : theme === "sepia" 
                            ? "bg-[#EDE2CA] text-[#433422] border-amber-950/5" 
                            : "bg-zinc-100 text-zinc-700 border-zinc-200/50"
                        }`}>
                          <div>• <span className="text-amber-500">Image-to-Image (圖生圖控制技術)</span></div>
                        </div>
                      </div>
                    </div>

                    <div className={`mt-4 pt-3 border-t text-[11px] leading-relaxed flex items-start gap-1 ${
                      theme === "dark" ? "border-white/5 text-zinc-500" : "border-black/5 text-[#8C7B69]"
                    }`}>
                      <span className="shrink-0 text-amber-500 font-semibold font-sans">💡 生產力產出：</span>
                      <span>【決策加速】透過高擬真的印前視覺模擬，讓概念發想與風格定調時間縮短 60%，大幅降低與印刷廠商、合作夥伴之間的溝通成本。</span>
                    </div>
                  </div>

                </div>

                {/* 腳部技巧總結 */}
                <div className={`p-4 rounded-xl border text-center space-y-1.5 ${
                  theme === "dark" 
                    ? "bg-zinc-900/60 border-white/5" 
                    : theme === "sepia" 
                    ? "bg-[#EDE2CA]/50 border-amber-950/5" 
                    : "bg-zinc-50 border-zinc-200/50"
                }`}>
                  <p className={`text-[11px] font-sans font-medium uppercase tracking-widest ${
                    theme === "dark" ? "text-amber-400" : "text-amber-800"
                  }`}>
                    ✦ 人工智能不是對手，而是最具未來感的畫筆 ✦
                  </p>
                  <p className={`text-[10px] leading-relaxed ${
                    theme === "dark" ? "text-zinc-500" : "text-zinc-600"
                  }`}>
                    本站所有視覺插畫、擬真擬立體主視覺，皆誕生自以上設計引擎的深度交融。不間斷地疊代、提煉和磨砺。
                  </p>
                </div>

              </div>
              
              {/* 底部按鈕 */}
              <div className={`p-4 border-t flex justify-end shrink-0 ${
                theme === "dark" ? "border-white/5 bg-zinc-950" : theme === "sepia" ? "border-amber-950/10 bg-[#FAF4E5]" : "border-zinc-100 bg-zinc-50"
              }`}>
                <button
                  id="btn-workflow-complete"
                  type="button"
                  onClick={() => setIsWorkflowOpen(false)}
                  className={`px-5 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                    theme === "dark" 
                      ? "bg-amber-500 hover:bg-amber-400 text-black shadow-md shadow-amber-500/10" 
                      : theme === "sepia" 
                      ? "bg-[#D97706] hover:bg-[#B45309] text-amber-50 shadow-md shadow-amber-900/10" 
                      : "bg-zinc-900 hover:bg-zinc-800 text-zinc-50 shadow-md"
                  }`}
                >
                  探索完成，開始瀏覽作品
                </button>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 傳統 vCard 數位名片與 QR Code 彈出視窗 */}
      <AnimatePresence>
        {isContactCardOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsContactCardOpen(false)}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4"
          >
            <motion.div
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 30, stiffness: 220 }}
              onClick={(e) => e.stopPropagation()}
              className={`w-full max-w-2xl rounded-t-3xl sm:rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh] border transition-colors duration-300 ${
                theme === "dark" 
                  ? "bg-[#0E0E0E] border-white/10 text-zinc-100" 
                  : theme === "sepia" 
                  ? "bg-[#FAF4E5] border-[#EADECC] text-[#433422]" 
                  : "bg-white border-zinc-200 text-zinc-900"
              }`}
            >
              {/* 頂部標題 */}
              <div className={`px-6 py-4 border-b flex items-center justify-between shrink-0 ${
                theme === "dark" ? "border-white/5" : theme === "sepia" ? "border-amber-950/10" : "border-zinc-100"
              }`}>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-amber-500 animate-ping"></div>
                  <h3 className="font-display font-bold text-base tracking-tight">商務特調 • 數位名片 & 儲存聯絡資訊</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsContactCardOpen(false)}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                    theme === "dark" ? "hover:bg-white/10 text-zinc-400" : "hover:bg-black/5 text-zinc-500"
                  }`}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* 內容區域 */}
              <div className="p-6 overflow-y-auto space-y-6">
                
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  
                  {/* 左側：精緻數位名片展示 (佔 7 欄) */}
                  <div className="md:col-span-7 flex flex-col justify-between">
                    <div className={`relative overflow-hidden rounded-2xl border p-5 shadow-lg flex flex-col h-full justify-between gap-6 ${
                      theme === "dark"
                        ? "bg-gradient-to-br from-zinc-900 via-zinc-950 to-black border-white/10 hover:border-amber-500/30"
                        : theme === "sepia"
                        ? "bg-gradient-to-br from-[#FAF4E5] via-[#F4ECD8] to-[#EDE2CA] border-[#E8DCBD] shadow-[#433422]/5"
                        : "bg-gradient-to-br from-white via-zinc-50 to-zinc-100 border-zinc-200 shadow-zinc-250/50"
                    }`}>
                      {/* 裝飾背景 */}
                      <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-xl pointer-events-none"></div>
                      
                      <div className="space-y-4 relative z-10">
                        {/* 名片頂部：Logo / 頭像與公司 */}
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="h-12 w-12 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-600 flex items-center justify-center text-white text-lg font-display font-semibold shadow-md">
                              CP
                            </div>
                            <div className="space-y-0.5">
                              <span className="text-[10px] font-mono tracking-widest uppercase opacity-60">Creative Designer</span>
                              <h4 className="font-display font-medium text-xs tracking-wide opacity-80">{profile.company}</h4>
                            </div>
                          </div>
                          <span className={`text-[9px] font-mono border px-1.5 py-0.5 rounded ${
                            theme === "dark" ? "border-amber-500/30 text-amber-400 bg-amber-500/5" : "border-amber-600/30 text-amber-800 bg-amber-600/5"
                          }`}>vCard Standard</span>
                        </div>

                        {/* 名片中部：名字與職位 */}
                        <div className="pt-2">
                          <h2 className={`text-xl font-display font-bold tracking-tight ${
                            theme === "dark" 
                              ? "text-white" 
                              : theme === "sepia" 
                              ? "text-[#382B1D]" 
                              : "text-zinc-900"
                          }`}>
                            {profile.name}
                          </h2>
                          <p className="text-xs font-sans text-amber-500/95 font-medium mt-1">{profile.title}</p>
                        </div>

                        {/* 名片詳細資訊 */}
                        <div className={`space-y-2.5 text-xs pt-3 border-t ${
                          theme === "dark" ? "border-white/5" : "border-black/5"
                        }`}>
                          <div className="flex items-center gap-3">
                            <Mail className="h-3.5 w-3.5 opacity-60 text-amber-500" />
                            <span className="font-mono opacity-80 select-all">{profile.email}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <Globe className="h-3.5 w-3.5 opacity-60 text-amber-500" />
                            <a href={profile.portfolioUrl} target="_blank" rel="noopener noreferrer" className="opacity-80 hover:text-amber-500 hover:underline inline-flex items-center gap-1 transition-colors">
                              <span>Canva 官方精選作品集</span>
                              <ExternalLink className="h-2.5 w-2.5" />
                            </a>
                          </div>
                          <div className="flex items-center gap-3">
                            <Award className="h-3.5 w-3.5 opacity-60 text-amber-500" />
                            <span className="opacity-80">5 - 6 年品牌商業整合設計實戰經驗</span>
                          </div>
                        </div>
                      </div>

                      {/* 底部按鈕 */}
                      <div className={`pt-4 border-t flex flex-col gap-2 ${
                        theme === "dark" ? "border-white/5" : "border-black/5"
                      }`}>
                        <button
                          type="button"
                          onClick={downloadVCard}
                          className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black shadow-md shadow-amber-500/10 active:scale-98 transition-all cursor-pointer"
                        >
                          <Download className="h-3.5 w-3.5" />
                          <span>一鍵下載並匯入通訊錄 (.vcf)</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* 右側：QR Code 掃描區 (佔 5 欄) */}
                  <div className="md:col-span-5 flex flex-col items-center justify-center space-y-4">
                    <div className="p-4 bg-white rounded-2xl shadow-xl border border-zinc-100 flex items-center justify-center max-w-[200px] md:max-w-none w-full aspect-square">
                      {/* 完美高對比、相機最易辨識的實體 QR Code */}
                      <img 
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(vCardText)}`}
                        alt="vCard QR Code"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    
                    <div className="text-center space-y-1 px-2">
                      <p className={`text-xs font-medium ${
                        theme === "dark" ? "text-zinc-300" : "text-zinc-700"
                      }`}>手機相機掃描 QR Code</p>
                      <p className="text-[10px] text-zinc-500 leading-normal">
                        可直接在智慧型手機上辨識並「加入聯絡人」，迅速建立客製化商務橋樑。
                      </p>
                    </div>
                  </div>

                </div>

              </div>

              {/* 底部收起 */}
              <div className={`p-4 border-t flex items-center justify-between shrink-0 ${
                theme === "dark" ? "border-white/5 bg-zinc-950" : theme === "sepia" ? "border-amber-950/10 bg-[#FAF4E5]" : "border-zinc-100 bg-zinc-50"
              }`}>
                <span className="text-[10px] text-zinc-500">
                  ✦ Business Contact Sync Platform v1.1
                </span>
                <button
                  type="button"
                  onClick={() => setIsContactCardOpen(false)}
                  className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                    theme === "dark" 
                      ? "bg-zinc-800 hover:bg-zinc-700 text-zinc-300" 
                      : theme === "sepia" 
                      ? "bg-[#EDE2CA] hover:bg-[#E2D5B9] text-[#433422]" 
                      : "bg-zinc-100 hover:bg-zinc-200 text-zinc-600"
                  }`}
                >
                  關閉名片
                </button>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 角色插畫類別配置：右下角生動彈出裝飾（極高解析度 GPU 隔離渲染） */}
      <InteractiveMascot 
        currentMascot={currentMascot}
        theme={deferredTheme}
        activeModalItem={activeModalItem}
        isWorkflowOpen={isWorkflowOpen}
        isContactCardOpen={isContactCardOpen}
        scrollSectionVisible={isMascotVisibleByScroll}
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

    </div>
  );
}
