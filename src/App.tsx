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
  Copy,
  Check,
  CheckCircle2,
  Sparkles,
  ArrowUpRight,
  ShieldAlert
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { initialPortfolioData } from "./data";
import { PortfolioItem } from "./types";
import { EXISTING_OPTIMIZED_IMAGES } from "./existingImages";

function extractDriveId(url: string): string | null {
  if (!url) return null;
  if (url.startsWith("/images/optimized/")) {
    const filename = url.replace("/images/optimized/", "");
    return filename.replace(".webp", "").split("?")[0];
  }
  if (url.includes("lh3.googleusercontent.com/d/")) {
    const parts = url.split("lh3.googleusercontent.com/d/");
    if (parts.length > 1) {
      return parts[1].split("=")[0].split("?")[0];
    }
  }
  if (url.includes("id=")) {
    const match = url.match(/[?&]id=([^&#?]+)/);
    if (match) return match[1];
  }
  const match = url.match(/\/file\/d\/([^/\?]+)/);
  if (match) return match[1];
  return null;
}

function getOptimizedGoogleUrl(url: string, size?: number): string {
  if (!url) return "";
  const id = extractDriveId(url);
  if (id) {
    const s = size ? size : 600;
    return `https://drive.google.com/thumbnail?sz=w${s}&id=${id}`;
  }
  if (url.includes("lh3.googleusercontent.com")) {
    const cleanUrl = url.split("=")[0];
    if (size) {
      return `${cleanUrl}=w${size}-rw`;
    }
    return cleanUrl;
  }
  return url;
}

function resolveImageUrl(url: string, size?: number): string {
  if (!url) return "";
  const id = extractDriveId(url);
  if (id) {
    if (url.startsWith("/images/optimized/") && EXISTING_OPTIMIZED_IMAGES.has(id)) {
      return url;
    }
    const s = size ? size : 600;
    // Use high-availability Drive thumbnail API to completely bypass CORS 403 and referrer limits
    return `https://drive.google.com/thumbnail?sz=w${s}&id=${id}`;
  }
  return getOptimizedGoogleUrl(url, size);
}

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  className?: string;
  fallbackTheme?: string;
  categoryName?: string;
  titleText?: string;
  referrerPolicy?: React.HTMLAttributeReferrerPolicy;
  optimizeSize?: number;
}

function ImageWithFallback({ 
  src, 
  alt, 
  className, 
  fallbackTheme = "from-amber-600 to-blue-900",
  categoryName,
  titleText,
  referrerPolicy,
  optimizeSize
}: ImageWithFallbackProps) {
  const [currentSrc, setCurrentSrc] = useState<string>(() => resolveImageUrl(src, optimizeSize));
  const [fallbackAttempt, setFallbackAttempt] = useState<number>(0);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const imgRef = React.useRef<HTMLImageElement>(null);

  React.useEffect(() => {
    setCurrentSrc(resolveImageUrl(src, optimizeSize));
    setFallbackAttempt(0);
    setIsLoaded(false);
  }, [src, optimizeSize]);

  const handleYoutubeFallback = (img: HTMLImageElement) => {
    const isYoutube = img.src.includes("youtube.com") || img.src.includes("img.youtube.com") || img.src.includes("ytimg.com");
    if (isYoutube && img.naturalWidth > 0 && img.naturalWidth <= 120) {
      if (fallbackAttempt === 0 && img.src.includes("maxresdefault.jpg")) {
        const hqUrl = img.src.replace("maxresdefault.jpg", "hqdefault.jpg");
        setCurrentSrc(hqUrl);
        setFallbackAttempt(1);
        return true;
      } else {
        const nextUrl = img.src.includes("maxresdefault.jpg")
          ? img.src.replace("maxresdefault.jpg", "hqdefault.jpg")
          : img.src.includes("hqdefault.jpg")
          ? img.src.replace("hqdefault.jpg", "0.jpg")
          : "";
        
        if (nextUrl && fallbackAttempt < 2) {
          setCurrentSrc(nextUrl);
          setFallbackAttempt(fallbackAttempt + 1);
          return true;
        } else {
          setCurrentSrc("https://picsum.photos/seed/" + encodeURIComponent(alt) + "/600/450");
          setFallbackAttempt(3);
          return true;
        }
      }
    }
    return false;
  };

  const handleLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    handleYoutubeFallback(img);
    setIsLoaded(true);
  };

  React.useEffect(() => {
    const img = imgRef.current;
    if (img && img.complete) {
      handleYoutubeFallback(img);
      setIsLoaded(true);
    }
  }, [currentSrc, fallbackAttempt]);

  const handleError = () => {
    // If it's a youtube image that failed to load (e.g. 404 instead of 120x90 fallback image)
    if (src.includes("youtube.com") || src.includes("ytimg.com") || currentSrc.includes("youtube.com") || currentSrc.includes("ytimg.com")) {
      const isYoutubeUrl = true;
      if (fallbackAttempt === 0 && currentSrc.includes("maxresdefault.jpg")) {
        setCurrentSrc(currentSrc.replace("maxresdefault.jpg", "hqdefault.jpg"));
        setFallbackAttempt(1);
        return;
      } else if (fallbackAttempt === 1 && currentSrc.includes("hqdefault.jpg")) {
        setCurrentSrc(currentSrc.replace("hqdefault.jpg", "0.jpg"));
        setFallbackAttempt(2);
        return;
      }
    }

    const id = extractDriveId(src);
    const nextAttempt = fallbackAttempt + 1;
    setFallbackAttempt(nextAttempt);

    if (nextAttempt === 1) {
      if (id) {
        // 1st fallback: Use direct Google Drive export view URL
        setCurrentSrc(`https://drive.google.com/uc?export=view&id=${id}`);
      } else {
        setPlaceholderFallback();
      }
    } else if (nextAttempt === 2) {
      if (id) {
        // 2nd fallback: LH3 direct view format
        setCurrentSrc(`https://lh3.googleusercontent.com/d/${id}=w${optimizeSize || 600}`);
      } else {
        setPlaceholderFallback();
      }
    } else if (nextAttempt === 3) {
      // 3rd fallback: Premium custom aesthetic Unsplash placeholders
      setPlaceholderFallback();
    } else {
      // 4th fallback: Elegant concept card gradients
      setFallbackAttempt(4);
    }
  };

  const setPlaceholderFallback = () => {
    if (src.includes("photo-1627308595229-7830a5c91f9f") || alt.includes("茂生") || alt.includes("月餅")) {
      setCurrentSrc("https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?auto=format&fit=crop&q=80&w=600&h=450");
    } else {
      setCurrentSrc("https://picsum.photos/seed/" + encodeURIComponent(alt) + "/600/450");
    }
  };

  if (fallbackAttempt >= 4) {
    return (
      <div className={`w-full h-full bg-gradient-to-br ${fallbackTheme} flex flex-col items-center justify-center p-6 text-center select-none relative overflow-hidden`}>
        {/* Decorative Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:14px_24px]" />
        
        {/* Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        
        {/* Content Details */}
        <div className="relative z-10 flex flex-col items-center gap-2">
          <Sparkles className="h-8 w-8 text-amber-300 animate-pulse" />
          <span className="text-[10px] font-mono uppercase tracking-widest text-amber-200/80">Premium Concept Card</span>
          <span className="text-white text-xs font-medium max-w-[85%] truncate">{titleText || alt}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden bg-neutral-950/20">
      {/* Modern thin loader that matches Capelee's ultra-premium minimal aesthetic */}
      {!isLoaded && fallbackAttempt < 4 && (
        <div className="absolute inset-0 bg-[#0B0B0B] flex flex-col items-center justify-center z-13 px-4 text-center select-none">
          <div className="relative flex items-center justify-center">
            <div className="absolute w-8 h-8 rounded-full bg-amber-500/5 blur-sm animate-pulse" />
            <div className="w-6 h-6 rounded-full border-t border-r border-[#D97706]/90 border-zinc-900 animate-spin" />
          </div>
          <span className="text-[9px] font-mono tracking-[0.25em] text-neutral-600 uppercase mt-4">
            LOADING IMAGE
          </span>
        </div>
      )}
      
      <img
        ref={imgRef}
        src={currentSrc}
        alt={alt}
        onLoad={handleLoad}
        onError={handleError}
        className={`${className} transition-all duration-[600ms] ease-out ${
          isLoaded 
            ? "opacity-100 scale-100 blur-0" 
            : "opacity-0 scale-[1.025] blur-[10px]"
        }`}
        referrerPolicy={referrerPolicy}
        loading="lazy"
      />
    </div>
  );
}

// Extract YouTube ID from robust URLs
function getYouTubeEmbedUrl(url?: string): string | null {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  if (match && match[2].length === 11) {
    return `https://www.youtube.com/embed/${match[2]}?autoplay=1&rel=0&showinfo=0&modestbranding=1`;
  }
  return null;
}

export default function App() {
  const [items] = useState<PortfolioItem[]>(initialPortfolioData);

  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [activeModalItem, setActiveModalItem] = useState<PortfolioItem | null>(null);
  const [activeImageUrl, setActiveImageUrl] = useState<string | null>(null);
  const [isVideoActive, setIsVideoActive] = useState<boolean>(false);
  
  // Custom states for interactive highlights
  const [copiedEmail, setCopiedEmail] = useState<boolean>(false);

  React.useEffect(() => {
    if (activeModalItem) {
      setActiveImageUrl(activeModalItem.imageUrl || (activeModalItem.images && activeModalItem.images.length > 0 ? activeModalItem.images[0] : undefined));
      setIsVideoActive(!!activeModalItem.videoUrl);
    } else {
      setActiveImageUrl(null);
      setIsVideoActive(false);
    }
  }, [activeModalItem]);

  // Profile data
  const profile = {
    name: "李凱博",
    engName: "capelee",
    title: "特約專案設計師",
    company: "立陽鴻企業禮贈品",
    school: "環球科技大學",
    dept: "創意商品設計學系 畢業",
    experience: "5 ~ 6 年品牌商業整合設計實戰經驗",
    desireTitle: "視覺設計師 / 平面設計師",
    email: "capelee0715@gmail.com",
    portfolioUrl: "https://canva.link/6byrfm8uow141cv", 
    intro: "擁有 6 年以上品牌商業整合設計實戰經驗，經手超過百個品牌、逾千件商品視覺製作，熟悉電商、醫療、文創等多元產業。具備視覺設計、商業攝影、品牌識別、影音製作與生成式 AI 工作流整合之全方位能力，作品涵蓋月銷破萬電商視覺、客家電視台邀約插畫、個人原創 IP 角色開發及企業 CIS 規劃，致力於將品牌價值轉化為最精準、最具張力的視覺語言。",
    education: [
      { school: "環球科技大學", dept: "創意商品設計學系", info: "大學畢業" },
      { school: "復興美工", dept: "美工科設計組", info: "經典設計本科學府" }
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

  // Filter items
  const filteredItems = useMemo(() => {
    if (selectedCategory === "All") return items;
    return items.filter(item => item.category === selectedCategory);
  }, [items, selectedCategory]);

  // Performance Optimization: Preload the cover images (600px width) of only the active category dynamically.
  // This avoids overwhelming the browser and Google Drive API, resolving rate limits, lag, and black screen failures.
  React.useEffect(() => {
    if (!filteredItems || filteredItems.length === 0) return;
    
    // Limits preloading to max 12 items of the current category to prevent network saturation.
    const itemsToPreload = filteredItems.slice(0, 12);
    itemsToPreload.forEach(item => {
      const coverUrl = item.imageUrl || (item.images && item.images.length > 0 ? item.images[0] : "");
      if (coverUrl) {
        const optimizedUrl = resolveImageUrl(coverUrl, 600);
        const img = new Image();
        img.referrerPolicy = "no-referrer";
        img.src = optimizedUrl;
      }
    });
  }, [selectedCategory, filteredItems]);

  // Performance Optimization: Preload the slider and detail images (1200px / 120px) only when a modal is opened.
  React.useEffect(() => {
    if (!activeModalItem) return;
    
    // Preload current item's high-res slide images in the background so sliding and thumb rendering is instant
    if (activeModalItem.images) {
      activeModalItem.images.slice(0, 6).forEach(imgUrl => {
        if (imgUrl) {
          // Preload detail view (1200 px) and thumbnail item select menu (120 px)
          [1200, 120].forEach(size => {
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

  // Find index of current modal item to support sliding control inside Lightbox
  const modalItemIndex = useMemo(() => {
    if (!activeModalItem) return -1;
    return filteredItems.findIndex(i => i.id === activeModalItem.id);
  }, [activeModalItem, filteredItems]);

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

  return (
    <div className="min-h-screen bg-[#070707] text-[#E5E7EB] flex flex-col selection:bg-amber-500/20 selection:text-amber-300 font-sans relative overflow-x-hidden">
      
      {/* 頂部裝飾背景微光 */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1400px] h-[550px] pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-250px] left-1/4 w-[45%] aspect-square rounded-full bg-amber-500/5 blur-[120px]"></div>
        <div className="absolute top-[-200px] right-1/4 w-[40%] aspect-square rounded-full bg-indigo-500/5 blur-[110px]"></div>
      </div>

      {/* 頂部導航列 (Branding Bar) */}
      <header className="sticky top-0 z-40 bg-[#070707]/80 backdrop-blur-md border-b border-white/5 py-4 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-amber-500 to-indigo-600 flex items-center justify-center text-white text-sm font-semibold font-display shadow-lg shadow-amber-950/20 border border-white/10 shrink-0">
              CP
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-semibold tracking-tight text-white text-sm md:text-md uppercase">capelee</span>
                <span className="text-[9px] font-mono px-1.5 py-0.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded font-semibold">2026 OFFICIAL</span>
              </div>
              <p className="text-[10px] font-mono text-zinc-500 tracking-wider">CREATIVE VISUAL PORTFOLIO</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-4 text-xs text-zinc-400">
              <a href="#designer-bento" className="hover:text-white transition-colors duration-200">關於我</a>
              <span className="text-zinc-700 font-light">/</span>
              <a href="#portfolio-grid" className="hover:text-white transition-colors duration-200">精選作品</a>
              <span className="text-zinc-700 font-light">/</span>
              <a href="#designer-bento" className="hover:text-white transition-colors duration-200">專業範疇</a>
            </div>

            <div className="flex items-center gap-2">
              {/* 電子郵件點擊複製 */}
              <button
                type="button"
                id="btn_header_copy_email"
                onClick={copyEmailToClipboard}
                className="text-xs bg-[#111] hover:bg-[#161616] text-zinc-300 hover:text-white px-2.5 py-1.5 rounded-lg border border-white/5 transition flex items-center gap-2 relative group"
                title="點擊複製聯絡信箱"
              >
                {copiedEmail ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-green-400" />
                    <span className="text-green-400 text-[11px] font-medium font-sans">已複製信箱</span>
                  </>
                ) : (
                  <>
                    <Mail className="h-3.5 w-3.5 text-zinc-500 group-hover:text-amber-400 transition-colors" />
                    <span className="hidden sm:inline text-[11px] font-mono">capelee0715@gmail.com</span>
                  </>
                )}
              </button>

              {/* 外部官方作品集連結 */}
              <a 
                href={profile.portfolioUrl}
                target="_blank" 
                rel="noopener noreferrer"
                className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black transition-all shadow-md shadow-amber-500/20 active:scale-95 flex items-center gap-1 shrink-0"
              >
                <span>官方全網 ↗</span>
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* 主要展示區 */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 z-10 space-y-12 md:space-y-16">
        
        {/* 設計師個人簡介 Bento 板塊 (精雕细琢，全幅 12 欄) */}
        <section id="designer-bento" className="relative scroll-mt-24">
          <div className="absolute -top-32 -left-32 w-72 h-72 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="bg-gradient-to-b from-[#111]/90 to-[#0c0c0c]/90 border border-white/5 rounded-2xl p-6 lg:p-8 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none"></div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* 第一欄：個人身分與品牌自述 (佔 4 欄) */}
              <div className="lg:col-span-4 space-y-6">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-display font-semibold shadow-xl shadow-amber-500/10 border border-white/10 shrink-0">
                    CP
                  </div>
                  <div>
                    <h1 className="text-2xl md:text-3xl font-display font-bold text-white tracking-tight">{profile.name}</h1>
                    <p className="text-xs font-mono text-zinc-500 uppercase tracking-widest mt-0.5">{profile.engName}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  <span className="text-[10px] font-sans font-medium px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1 shadow-inner">
                    <Sparkles className="h-2.5 w-2.5 shrink-0 animate-pulse text-amber-300" />
                    <span>{profile.title}</span>
                  </span>
                  <span className="text-[10px] font-sans font-medium px-3 py-1 rounded-full bg-white/5 text-zinc-400 border border-white/10">
                    {profile.company}
                  </span>
                </div>

                {/* 履歷簡介 */}
                <div className="bg-white/[0.01] border border-white/5 rounded-xl p-4 lg:p-5">
                  <div className="flex items-center gap-1.5 mb-2.5">
                    <div className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse"></div>
                    <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Biography summary / 專業特質</p>
                  </div>
                  <p className="text-zinc-300 text-xs leading-relaxed font-light">
                    {profile.intro}
                  </p>
                </div>

                {/* 聯繫資訊與期望 */}
                <div className="space-y-3 text-[13px] text-zinc-300 leading-relaxed font-light pt-2 pl-1 border-l-2 border-amber-500/20">
                  <div className="flex items-center gap-3">
                    <Award className="h-4 w-4 text-amber-400 shrink-0" />
                    <span>期望職缺：<span className="text-white hover:text-amber-400 transition-colors font-medium underline underline-offset-4 decoration-amber-500/40">{profile.desireTitle}</span></span>
                  </div>
                  <div className="flex items-center gap-3 group/mail cursor-pointer" onClick={copyEmailToClipboard}>
                    <Mail className="h-4 w-4 text-zinc-500 group-hover/mail:text-amber-400 transition-colors shrink-0" />
                    <span className="font-mono text-zinc-400 group-hover/mail:text-white transition-colors text-[12px]">{profile.email}</span>
                  </div>
                </div>

                {/* 2026作品集主要按鈕 */}
                <div className="pt-1">
                  <a 
                    href={profile.portfolioUrl}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black transition-all shadow-lg shadow-amber-500/25 active:scale-98 text-center uppercase tracking-wide font-sans"
                  >
                    <span>最新 2026 官方作品集 (Canva) ↗</span>
                  </a>
                </div>
              </div>

              {/* 第二欄：個人工作經歷與教育學歷 (佔 4 欄) */}
              <div className="lg:col-span-4 space-y-6">
                
                {/* 實戰經歷 */}
                <div className="space-y-3.5">
                  <div className="flex items-center gap-1.5 pl-1">
                    <Briefcase className="h-4 w-4 text-amber-400 shrink-0" />
                    <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Work History / 實戰經歷</p>
                  </div>
                  
                  <div className="space-y-4 relative before:absolute before:bottom-2 before:top-2 before:left-[11px] before:w-[1px] before:bg-white/10">
                    {profile.experienceList.map((exp, i) => (
                      <div key={i} className="flex gap-3 pl-1 relative group">
                        <div className="h-[22px] w-[22px] rounded-full bg-[#0a0a0a] border border-white/10 flex items-center justify-center text-zinc-500 group-hover:border-amber-400 group-hover:text-amber-400 transition-colors duration-300 z-10 shrink-0 mt-0.5">
                          <span className="text-[9px] font-mono font-bold leading-none">{i + 1}</span>
                        </div>
                        <div className="space-y-0.5 min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-[13px] font-medium text-white tracking-tight leading-tight group-hover:text-amber-400 transition-colors duration-200">{exp.title}</span>
                            <span className={`text-[8.5px] font-mono px-1 rounded leading-none py-0.5 ${
                              exp.badge === "現任" 
                                ? "bg-amber-500/10 text-amber-400 border border-amber-500/20 font-medium" 
                                : "bg-white/5 text-zinc-500"
                            }`}>
                              {exp.badge}
                            </span>
                          </div>
                          <p className="text-[11px] text-zinc-400 font-light truncate leading-relaxed">{exp.company}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 特色學歷 */}
                <div className="space-y-3.5 pt-1">
                  <div className="flex items-center gap-1.5 pl-1">
                    <GraduationCap className="h-4 w-4 text-indigo-400 shrink-0" />
                    <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Education / 專業學歷</p>
                  </div>
                  
                  <div className="space-y-4 relative before:absolute before:bottom-2 before:top-2 before:left-[11px] before:w-[1px] before:bg-white/10">
                    {profile.education.map((edu, i) => (
                      <div key={i} className="flex gap-3 pl-1 relative group">
                        <div className="h-[22px] w-[22px] rounded-full bg-[#0a0a0a] border border-white/10 flex items-center justify-center text-zinc-500 group-hover:border-indigo-400 group-hover:text-indigo-400 transition-colors duration-300 z-10 shrink-0 mt-0.5">
                          <div className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                        </div>
                        <div className="space-y-0.5 min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-[13px] font-medium text-white tracking-tight leading-tight group-hover:text-[#818CF8] transition-colors duration-200">{edu.school}</span>
                            <span className="text-[8.5px] font-mono px-1 rounded leading-none py-0.5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                              {edu.info}
                            </span>
                          </div>
                          <p className="text-[11px] text-zinc-400 font-light leading-relaxed">{edu.dept}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* 第三欄：專業能力範疇 (佔 4 欄) */}
              <div className="lg:col-span-4 space-y-3.5">
                <div className="flex items-center gap-1.5 pl-1">
                  <Layers className="h-4 w-4 text-amber-500 shrink-0" />
                  <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest pl-1">Capabilities / 核心專長</p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2">
                  {profile.scopes.map((s) => {
                    let icon = <Layers className="h-3.5 w-3.5 text-amber-400" />;
                    let colorBorder = "group-hover:border-amber-500/20 group-hover:bg-amber-500/[0.02]";
                    
                    if (s.title.includes("識別")) {
                      icon = <Briefcase className="h-3.5 w-3.5 text-blue-400" />;
                      colorBorder = "group-hover:border-blue-500/20 group-hover:bg-blue-500/[0.02]";
                    } else if (s.title.includes("攝影")) {
                      icon = <Camera className="h-3.5 w-3.5 text-purple-400" />;
                      colorBorder = "group-hover:border-purple-500/20 group-hover:bg-purple-500/[0.02]";
                    } else if (s.title.includes("影音")) {
                      icon = <Video className="h-3.5 w-3.5 text-emerald-400" />;
                      colorBorder = "group-hover:border-emerald-500/20 group-hover:bg-emerald-500/[0.02]";
                    } else if (s.title.includes("印刷")) {
                      icon = <Printer className="h-3.5 w-3.5 text-rose-400" />;
                      colorBorder = "group-hover:border-rose-500/20 group-hover:bg-rose-500/[0.02]";
                    } else if (s.title.includes("IP")) {
                      icon = <Sparkles className="h-3.5 w-3.5 text-cyan-400" />;
                      colorBorder = "group-hover:border-cyan-500/20 group-hover:bg-cyan-500/[0.02]";
                    } else if (s.title.includes("AI")) {
                      icon = <Zap className="h-3.5 w-3.5 text-indigo-400" />;
                      colorBorder = "group-hover:border-indigo-500/20 group-hover:bg-indigo-500/[0.02]";
                    } else if (s.title.includes("禮贈品")) {
                      icon = <Award className="h-3.5 w-3.5 text-orange-400" />;
                      colorBorder = "group-hover:border-orange-500/20 group-hover:bg-orange-500/[0.02]";
                    }

                    return (
                      <div 
                        key={s.id} 
                        className={`bg-white/[0.015] border border-white/5 rounded-xl p-3 flex items-start gap-3 transition-all duration-300 group ${colorBorder}`}
                      >
                        <div className="p-1.5 bg-white/5 rounded-lg shrink-0 mt-0.5 border border-white/5 group-hover:scale-105 transition-transform duration-200">
                          {icon}
                        </div>
                        <div className="space-y-0.5 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[12.5px] text-white font-medium group-hover:text-amber-400 transition-colors whitespace-nowrap">{s.title}</span>
                            <span className="text-[7.5px] font-mono bg-white/5 text-zinc-500 px-1 rounded uppercase tracking-wider py-0.5 leading-none shrink-0">{s.badge}</span>
                          </div>
                          <p className="text-[10px] text-[#A1A1AA] leading-relaxed font-light line-clamp-1 group-hover:line-clamp-none transition-all duration-300">{s.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              
            </div>
          </div>
        </section>

        {/* 區塊標題 & 卡片過濾器 */}
        <section id="portfolio-grid" className="space-y-8 scroll-mt-24">
          <div className="max-w-3xl mx-auto text-center space-y-3">
            <span className="inline-flex items-center gap-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 px-3 py-1 rounded-full text-xs font-mono font-semibold uppercase tracking-wider">
              Selected Showcase
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-medium text-white tracking-tight">
              探索精選設計維度
            </h2>
            <div className="h-[2px] w-12 bg-amber-500 mx-auto rounded-full"></div>
            <p className="text-zinc-400 text-xs md:text-sm leading-relaxed font-light">
              融合藝術美學與商業功能思考，為品牌創造可視的商業價值。
              點擊任何作品卡片可查看詳實的設計理念與工具標籤分析。
            </p>
          </div>

          {/* 各類作品過濾選項 (純展示交互，流暢快捷) */}
          <div className="flex flex-wrap gap-2 items-center justify-center pt-2">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                id={`cat_filter_btn_${cat}`}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 text-xs font-medium rounded-full border transition-all duration-300 font-sans cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-amber-500 text-black border-amber-500 shadow-lg shadow-amber-500/10"
                    : "bg-white/[0.02] text-zinc-400 border-white/5 hover:text-white hover:bg-white/5 hover:border-white/10"
                }`}
              >
                {cat === "All" ? "全部精選展示" : cat}
              </button>
            ))}
          </div>

          {/* 作品卡片 RWD 呈現 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 min-h-[300px]">
            <AnimatePresence mode="popLayout">
              {filteredItems.map((item) => {
                return (
                  <motion.div
                    layout
                    initial={{ opacity: 0, y: 15, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.98 }}
                    transition={{ duration: 0.35, ease: "easeInOut" }}
                    key={item.id}
                    id={`portfolio_item_card_${item.id}`}
                    onClick={() => setActiveModalItem(item)}
                    className="group relative flex flex-col bg-[#0E0E0E] rounded-2xl overflow-hidden border border-white/5 hover:border-amber-500/25 transition-all duration-500 cursor-pointer h-full hover:-translate-y-1.5 shadow-lg hover:shadow-2xl hover:shadow-black/70"
                  >
                    {/* 卡片封面圖 */}
                    <div className="relative aspect-[4/3] bg-zinc-950 overflow-hidden">
                      <ImageWithFallback
                        src={item.imageUrl || (item.images && item.images.length > 0 ? item.images[0] : '')}
                        alt={item.title}
                        referrerPolicy="no-referrer"
                        fallbackTheme={item.colorTheme}
                        titleText={item.title}
                        optimizeSize={600}
                        className="w-full h-full object-cover transform transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                      
                      {/* 背景霓虹光澤 */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent"></div>

                      {/* 卡片類別浮章 */}
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 text-[11px] font-medium tracking-wide text-white bg-black/70 backdrop-blur-md border border-white/10 rounded-full shadow-md">
                          {item.category}
                        </span>
                      </div>

                      {/* hover 視覺遮罩提示 */}
                      <div className="absolute inset-0 bg-black/35 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <span className="text-[11px] font-sans font-semibold tracking-wider text-black bg-amber-400 px-3.5 py-1.5 rounded-lg shadow-lg shadow-amber-500/20 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 uppercase flex items-center gap-1.5 animate-fade-in">
                          <span>觀看精彩設計細節</span>
                          <ArrowUpRight className="h-3 w-3 shrink-0 stroke-[2.5]" />
                        </span>
                      </div>
                    </div>

                    {/* 內容描述區 */}
                    <div className="flex-1 flex flex-col p-5 md:p-6 space-y-4">
                      <div className="space-y-1">
                        <p className="text-[10px] font-mono tracking-widest text-[#F59E0B]/80 uppercase">{item.titleEn}</p>
                        <h3 className="text-base font-display font-semibold text-white group-hover:text-amber-400 transition-colors duration-300 line-clamp-1">
                          {item.title}
                        </h3>
                      </div>

                      <p className="text-zinc-400 text-xs leading-relaxed font-sans font-light flex-1 line-clamp-3">
                        {item.philosophy}
                      </p>

                      {/* 工具 Tags */}
                      <div className="pt-3.5 border-t border-white/5 flex flex-wrap gap-1.5">
                        {item.tools.map((tech) => (
                          <span key={tech} className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-white/5 text-zinc-300 border border-white/5">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {filteredItems.length === 0 && (
            <div className="text-center py-20 bg-[#0E0E0E]/40 rounded-xl border border-white/5">
              <ShieldAlert className="h-10 w-10 text-zinc-600 mx-auto mb-3" />
              <p className="text-zinc-400 text-sm font-light">無此類別的核心作品</p>
              <button
                type="button"
                onClick={() => setSelectedCategory("All")}
                className="mt-3 text-xs text-amber-400 hover:underline font-medium cursor-pointer"
              >
                返回展示全部
              </button>
            </div>
          )}
        </section>

      </main>

      {/* 底部靜態版權聲明 */}
      <footer className="mt-16 border-t border-white/5 bg-[#080808]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-7 w-7 rounded-lg bg-gradient-to-tr from-amber-500 to-indigo-600 flex items-center justify-center text-white text-xs font-semibold">
              CP
            </div>
            <p className="text-xs text-zinc-400">
              李凱博 capelee <span className="text-zinc-600">|</span> 2026 Creative Visual & IP Portfolio
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
              className="bg-[#0E0E0E] border border-white/10 rounded-2xl max-w-4xl w-full overflow-hidden shadow-2xl relative my-auto"
            >
              
              {/* 關閉按鈕 */}
              <button
                type="button"
                id="btn_modal_close"
                onClick={() => setActiveModalItem(null)}
                className="absolute top-4 right-4 z-10 p-2 rounded-lg bg-black/70 hover:bg-black text-zinc-400 hover:text-white transition-colors border border-white/10 cursor-pointer"
                title="關閉明細"
              >
                <X className="h-5 w-5" />
              </button>

              {/* 上一張 / 下一張左右滑鎖 */}
              {filteredItems.length > 1 && (
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

              <div className="grid grid-cols-1 md:grid-cols-12">
                
                {/* 左側大圖 */}
                <div className="md:col-span-7 bg-zinc-950 aspect-[4/3] md:aspect-auto md:h-[500px] relative overflow-hidden flex flex-col justify-between border border-white/5">
                  <div className="relative w-full flex-grow overflow-hidden flex items-center justify-center bg-black/40 min-h-[280px]">
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
                          titleText={activeModalItem.title}
                          optimizeSize={1200}
                          className="w-full h-full object-contain transition-all duration-300"
                        />
                        {activeModalItem.videoUrl && (
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
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0E0E0E] via-transparent to-transparent pointer-events-none"></div>

                    {/* 左右切換細節照片 */}
                    {!isVideoActive && activeModalItem.images && activeModalItem.images.length > 1 && (
                      <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none z-20">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            const current = activeImageUrl || activeModalItem.imageUrl || (activeModalItem.images && activeModalItem.images.length > 0 ? activeModalItem.images[0] : undefined);
                            const idx = activeModalItem.images.indexOf(current!);
                            const prevIdx = idx <= 0 ? activeModalItem.images.length - 1 : idx - 1;
                            setActiveImageUrl(activeModalItem.images[prevIdx]);
                          }}
                          className="p-2 rounded-full bg-black/70 hover:bg-black/90 text-zinc-300 hover:text-white border border-white/10 shadow-lg pointer-events-auto transition active:scale-90 cursor-pointer"
                          title="上一張照片"
                        >
                          <ChevronLeft className="h-5 w-5" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            const current = activeImageUrl || activeModalItem.imageUrl || (activeModalItem.images && activeModalItem.images.length > 0 ? activeModalItem.images[0] : undefined);
                            const idx = activeModalItem.images.indexOf(current!);
                            const nextIdx = idx === -1 || idx === activeModalItem.images.length - 1 ? 0 : idx + 1;
                            setActiveImageUrl(activeModalItem.images[nextIdx]);
                          }}
                          className="p-2 rounded-full bg-black/70 hover:bg-black/90 text-zinc-300 hover:text-white border border-white/10 shadow-lg pointer-events-auto transition active:scale-90 cursor-pointer"
                          title="下一張照片"
                        >
                          <ChevronRight className="h-5 w-5" />
                        </button>
                      </div>
                    )}
                    
                    {/* 分類浮水印標籤 */}
                    <div className="absolute bottom-4 left-4 z-10">
                      <span className="px-3 py-1 text-xs font-semibold tracking-wide text-amber-400 bg-black/80 backdrop-blur-md rounded-md border border-amber-500/20 shadow-md">
                        {activeModalItem.category}
                      </span>
                    </div>
                  </div>

                  {/* Thumbnail gallery selector */}
                  {((activeModalItem.videoUrl ? 1 : 0) + (activeModalItem.images?.length || 0) > 1) && (
                    <div className="relative z-10 w-full bg-[#0E0E0E] px-4 py-3 border-t border-white/10 shrink-0">
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
                  )}
                </div>

                {/* 右側資訊 */}
                <div className="md:col-span-5 p-6 lg:p-8 flex flex-col justify-between md:h-[500px] border-t md:border-t-0 md:border-l border-white/5">
                  <div className="space-y-4">
                    
                    {/* 標題 */}
                    <div className="space-y-1">
                      <p className="text-[10px] font-mono tracking-widest text-amber-500 font-semibold uppercase">{activeModalItem.titleEn}</p>
                      <h3 className="text-xl lg:text-2xl font-display font-medium text-white tracking-tight">
                        {activeModalItem.title}
                      </h3>
                    </div>

                    {/* 設計思考核心觀點 */}
                    <div className="space-y-2">
                      <p className="text-[11px] font-mono text-zinc-500 uppercase tracking-widest">Design Philosophy / 設計理念</p>
                      <p className="text-zinc-300 text-xs leading-relaxed font-light font-sans max-h-[180px] md:max-h-[220px] overflow-y-auto pr-1">
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

                  {/* 底部行動 */}
                  <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                    <span className="text-[10.5px] font-mono text-zinc-500">
                      CASE NO. 0{activeModalItem.id}
                    </span>
                    
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
              
              {/* 手機版前後控制項 */}
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

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
