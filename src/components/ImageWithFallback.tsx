interface ImageWithFallbackProps {
  src: string;
  alt: string;
  className?: string;
  fallbackTheme?: string;
  categoryName?: string;
  titleText?: string;
  referrerPolicy?: React.HTMLAttributeReferrerPolicy;
  optimizeSize?: number;
  lazy?: boolean;
  zoomable?: boolean;
  priority?: boolean;
  theme?: "dark" | "light" | "sepia";
  heightAuto?: boolean;
  onLoad?: () => void;
}

import React, { useState } from "react";
import { Image as ImageIcon, Sparkles, ZoomIn, ZoomOut } from "lucide-react";
import { motion } from "motion/react";
import { getCategoryColor } from "../categoryColors";
import { resolveImageUrl, YT_THUMBNAIL_CACHE, DRIVE_THUMBNAIL_CACHE, extractDriveId, extractYoutubeId, saveDriveCacheToStorage, saveYtCacheToStorage } from "../utils";

export function ImageWithFallback({ 
  src, 
  alt, 
  className, 
  fallbackTheme = "from-amber-600 to-blue-900",
  categoryName,
  titleText,
  referrerPolicy,
  optimizeSize,
  lazy = false,
  zoomable = false,
  priority = false,
  theme = "dark",
  heightAuto = false,
  onLoad
}: ImageWithFallbackProps) {
  const [isInView, setIsInView] = useState<boolean>(priority || !lazy);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [currentSrc, setCurrentSrc] = useState<string>(() => {
    return (priority || !lazy) ? resolveImageUrl(src, optimizeSize) : "";
  });
  const [fallbackAttempt, setFallbackAttempt] = useState<number>(0);
  const [failedCount, setFailedCount] = useState<number>(0);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const imgRef = React.useRef<HTMLImageElement>(null);

  const [lastSuccessfulSrc, setLastSuccessfulSrc] = useState<string>("");
  const lastTitleRef = React.useRef<string | undefined>(titleText);

  React.useEffect(() => {
    if (lastTitleRef.current !== titleText) {
      setLastSuccessfulSrc("");
      lastTitleRef.current = titleText;
    }
  }, [titleText]);

  React.useEffect(() => {
    if (isLoaded && currentSrc) {
      setLastSuccessfulSrc(currentSrc);
    }
  }, [isLoaded, currentSrc]);

  const [isZoomed, setIsZoomed] = useState<boolean>(false);
  const [zoomPosition, setZoomPosition] = useState<{ x: number; y: number }>({ x: 50, y: 50 });

  React.useEffect(() => {
    setIsZoomed(false);
    setZoomPosition({ x: 50, y: 50 });
  }, [src]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!zoomable || !isZoomed) return;
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPosition({ x, y });
  };

  const handleZoomClick = (e: React.MouseEvent) => {
    if (!zoomable) return;
    e.stopPropagation();
    if (isZoomed) {
      setIsZoomed(false);
    } else {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setZoomPosition({ x, y });
      setIsZoomed(true);
    }
  };

  const handleMouseLeave = () => {
    if (zoomable && isZoomed) {
      setIsZoomed(false);
    }
  };

  React.useEffect(() => {
    if (priority || !lazy) {
      setIsInView(true);
      return;
    }
    // High-performance offscreen pre-fetching system:
    // Triggers image loading when scrolling within 600px of viewport to maximize cached delivery
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: "650px", // Early fetch margin to avoid layout flashes
        threshold: 0.001,
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [lazy, priority, src]);

  // Track load start time to measure performance
  const loadStartTimeRef = React.useRef<number>(0);

  React.useEffect(() => {
    if (isInView) {
      const resolved = resolveImageUrl(src, optimizeSize);
      setCurrentSrc(resolved);
      setFallbackAttempt(0);
      setFailedCount(0);
      setIsLoaded(false);
      loadStartTimeRef.current = performance.now();
      
      console.log(`%c[ImageWithFallback:INIT]%c Loading image for [%c${titleText || alt}%c]\nSource: ${resolved}`, 
        "color: #10B981; font-weight: bold;", 
        "color: inherit;", 
        "color: #F59E0B; font-weight: bold;", 
        "color: inherit;"
      );
    }
  }, [src, optimizeSize, isInView, titleText, alt]);

  const handleYoutubeFallback = (img: HTMLImageElement) => {
    const isYoutube = img.src.includes("youtube.com") || img.src.includes("img.youtube.com") || img.src.includes("ytimg.com");
    if (isYoutube && img.naturalWidth > 0 && img.naturalWidth <= 120) {
      const ytId = extractYoutubeId(img.src);
      
      if (fallbackAttempt === 0 && img.src.includes("maxresdefault.jpg")) {
        const hqUrl = img.src.replace("maxresdefault.jpg", "hqdefault.jpg");
        console.warn(`%c[ImageWithFallback:YOUTUBE_FALLBACK]%c YouTube maxresdefault.jpg missing or grey background for ID: ${ytId}. Re-routing to hqdefault.jpg`,
          "color: #F59E0B; font-weight: bold;",
          "color: inherit;"
        );
        
        if (ytId) {
          YT_THUMBNAIL_CACHE.set(ytId, "hqdefault.jpg");
          saveYtCacheToStorage();
        }

        loadStartTimeRef.current = performance.now();
        setCurrentSrc(hqUrl);
        setFallbackAttempt(1);
        setIsLoaded(false);
        return true;
      } else {
        const nextUrl = img.src.includes("maxresdefault.jpg")
          ? img.src.replace("maxresdefault.jpg", "hqdefault.jpg")
          : img.src.includes("hqdefault.jpg")
          ? img.src.replace("hqdefault.jpg", "0.jpg")
          : "";
        
        if (nextUrl && fallbackAttempt < 2) {
          const typeStr = nextUrl.includes("0.jpg") ? "0.jpg" : "hqdefault.jpg";
          console.warn(`%c[ImageWithFallback:YOUTUBE_FALLBACK]%c Trying secondary thumbnail format %c${typeStr}%c for ID: ${ytId}`,
            "color: #F59E0B; font-weight: bold;",
            "color: inherit;",
            "color: #3B82F6; font-weight: bold;",
            "color: inherit;"
          );
          
          if (ytId) {
            YT_THUMBNAIL_CACHE.set(ytId, typeStr);
            saveYtCacheToStorage();
          }

          loadStartTimeRef.current = performance.now();
          setCurrentSrc(nextUrl);
          setFallbackAttempt(fallbackAttempt + 1);
          setIsLoaded(false);
          return true;
        } else {
          console.error(`%c[ImageWithFallback:YOUTUBE_FALLBACK_FAILED]%c All native YouTube thumbnails failed for ID: ${ytId}. Reverted to placeholder.`,
            "color: #EF4444; font-weight: bold;",
            "color: inherit;"
          );
          loadStartTimeRef.current = performance.now();
          setCurrentSrc("https://picsum.photos/seed/" + encodeURIComponent(alt) + "/600/450");
          setFallbackAttempt(3);
          setIsLoaded(false);
          return true;
        }
      }
    }
    return false;
  };

  const onFinalSuccess = (img: HTMLImageElement) => {
    setIsLoaded(true);
    if (onLoad) {
      onLoad();
    }
    
    // Performance metrics
    const loadTime = performance.now() - loadStartTimeRef.current;
    if (loadTime > 1000 || img.naturalWidth > 1920) {
      console.warn(`%c[ImageWithFallback:PERF_WARN]%c Image [%c${titleText || alt}%c] may impact performance.\nLoad Time: ${loadTime.toFixed(1)}ms | Dimensions: ${img.naturalWidth}x${img.naturalHeight}px`,
        "color: #EF4444; font-weight: bold;",
        "color: inherit;",
        "color: #F59E0B; font-weight: bold;",
        "color: inherit;"
      );
    } else {
      console.log(`%c[ImageWithFallback:PERF]%c Image loaded \nLoad Time: ${loadTime.toFixed(1)}ms | Dimensions: ${img.naturalWidth}x${img.naturalHeight}px`,
        "color: #8B5CF6; font-weight: bold;",
        "color: #6B7280;"
      );
    }

    const dId = extractDriveId(src);
    if (dId && fallbackAttempt > 0) {
      let typeStr = "";
      if (img.src.includes("uc?export=view")) typeStr = "view";
      else if (img.src.includes("lh3.googleusercontent.com")) typeStr = "lh3";
      else if (img.src.includes("drive.google.com/thumbnail")) typeStr = "thumb";

      if (typeStr && DRIVE_THUMBNAIL_CACHE.get(dId) !== typeStr) {
        DRIVE_THUMBNAIL_CACHE.set(dId, typeStr);
        saveDriveCacheToStorage();
        console.log(`%c[ImageWithFallback:DRIVE_CACHE]%c Successfully saved working Drive URL format %c${typeStr}%c for ID: ${dId}`, 
          "color: #10B981; font-weight: bold;", 
          "color: inherit;", 
          "color: #3B82F6; font-weight: bold;", 
          "color: inherit;"
        );
      }
    }

    console.log(`%c[ImageWithFallback:SUCCESS]%c Image loaded successfully for [%c${titleText || alt}%c]\nUrl: ${img.src}`, 
      "color: #10B981; font-weight: bold;", 
      "color: inherit;", 
      "color: #F59E0B; font-weight: bold;", 
      "color: inherit;"
    );
  };

  const handleLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    const fellBack = handleYoutubeFallback(img);
    if (!fellBack) {
      onFinalSuccess(img);
    }
  };

  // Robust, race-condition-free cache and completion observer.
  React.useEffect(() => {
    if (!isInView || !currentSrc) return;
    const img = imgRef.current;
    if (img) {
      const isSrcMatching = img.src === currentSrc || img.src.includes(currentSrc) || img.src.endsWith(currentSrc);
      if (img.complete && isSrcMatching && img.naturalWidth > 0) {
        const fellBack = handleYoutubeFallback(img);
        if (!fellBack && !isLoaded) {
          onFinalSuccess(img);
        }
      }
    }
  }, [currentSrc, fallbackAttempt, isInView, isLoaded]);

  const safeSetCurrentSrc = (newUrl: string, nextAttempt: number) => {
    let finalUrl = newUrl;
    if (finalUrl === currentSrc) {
      const separator = finalUrl.includes("?") ? "&" : "?";
      finalUrl = `${finalUrl}${separator}fb_retry=${nextAttempt}`;
    }
    setCurrentSrc(finalUrl);
  };

  const setPlaceholderFallback = (attemptNo?: number) => {
    const attemptNum = attemptNo || 1;
    if (src.includes("photo-1627308595229-7830a5c91f9f") || alt.includes("茂生") || alt.includes("月餅")) {
      safeSetCurrentSrc(`https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?auto=format&fit=crop&q=80&w=600&h=450&sig=${attemptNum}`, attemptNum);
    } else if (categoryName && (categoryName.includes("LOGO") || categoryName.includes("CIS"))) {
      const urls = [
        "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634",
        "https://images.unsplash.com/photo-1626785774573-4b799315345d",
        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3"
      ];
      const selectedUrl = urls[(attemptNum - 1) % urls.length];
      safeSetCurrentSrc(`${selectedUrl}?auto=format&fit=crop&q=80&w=600&h=450`, attemptNum);
    } else if (categoryName && (categoryName.includes("實體") || categoryName.includes("展覽") || categoryName.includes("空間"))) {
      const urls = [
        "https://images.unsplash.com/photo-1497366216548-37526070297c",
        "https://images.unsplash.com/photo-1497366811353-6870744d04b2",
        "https://images.unsplash.com/photo-1441986300917-64674bd600d8"
      ];
      const selectedUrl = urls[(attemptNum - 1) % urls.length];
      safeSetCurrentSrc(`${selectedUrl}?auto=format&fit=crop&q=80&w=600&h=450`, attemptNum);
    } else if (categoryName && (categoryName.includes("插畫") || categoryName.includes("繪圖"))) {
      const urls = [
        "https://images.unsplash.com/photo-1513364776144-60967b0f800f",
        "https://images.unsplash.com/photo-1501183007986-d0d080b147f9",
        "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5"
      ];
      const selectedUrl = urls[(attemptNum - 1) % urls.length];
      safeSetCurrentSrc(`${selectedUrl}?auto=format&fit=crop&q=80&w=600&h=450`, attemptNum);
    } else {
      safeSetCurrentSrc("https://picsum.photos/seed/" + encodeURIComponent(alt + `_fb_${attemptNum}`) + "/600/450", attemptNum);
    }
  };

  const handleError = () => {
    setIsLoaded(false);
    const nextFailed = failedCount + 1;
    setFailedCount(nextFailed);

    console.warn(`%c[ImageWithFallback:ERROR]%c Failed to load image for [%c${titleText || alt}%c]\nUrl: ${currentSrc}\nFailed count: ${nextFailed}`, 
      "color: #EF4444; font-weight: bold;", 
      "color: inherit;", 
      "color: #F59E0B; font-weight: bold;", 
      "color: inherit;"
    );

    // If reached 3 failures, directly switch to category preset Unsplash URL & resolve immediately
    if (nextFailed >= 3) {
      console.warn(`[failedCount >= 3] Switching to category preset Unsplash URL for ${categoryName}`);
      let unsplashUrl = "https://images.unsplash.com/photo-1618005182384-a83a8dc5735e?auto=format&fit=crop&q=80&w=600&h=450";
      if (categoryName && (categoryName.includes("LOGO") || categoryName.includes("CIS"))) {
        unsplashUrl = "https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&q=80&w=600&h=450";
      } else if (categoryName && (categoryName.includes("實體") || categoryName.includes("展覽") || categoryName.includes("空間"))) {
        unsplashUrl = "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=600&h=450";
      } else if (categoryName && (categoryName.includes("插畫") || categoryName.includes("繪圖") || categoryName.includes("平面"))) {
        unsplashUrl = "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=600&h=450";
      }
      setCurrentSrc(unsplashUrl);
      setIsLoaded(true);
      return;
    }
    
    // 1. YouTube specific fallback logic to try lower quality thumbnails gracefully
    if (src.includes("youtube.com") || src.includes("ytimg.com") || currentSrc.includes("youtube.com") || currentSrc.includes("ytimg.com")) {
      if (fallbackAttempt === 0 && currentSrc.includes("maxresdefault.jpg")) {
        safeSetCurrentSrc(currentSrc.replace("maxresdefault.jpg", "hqdefault.jpg"), 1);
        setFallbackAttempt(1);
        return;
      } else if (fallbackAttempt === 1 && currentSrc.includes("hqdefault.jpg")) {
        safeSetCurrentSrc(currentSrc.replace("hqdefault.jpg", "0.jpg"), 2);
        setFallbackAttempt(2);
        return;
      }
    }

    const id = extractDriveId(src);
    const nextAttempt = fallbackAttempt + 1;

    // Upgrade local asset validation: matches both root-relative and dot-relative layouts safely.
    const isLocal = (src.includes("/images/") || currentSrc.includes("/images/")) && !src.includes("/images/optimized/") && !currentSrc.includes("/images/optimized/");

    if (isLocal) {
      let nextSrc = src;
      let attempt = nextAttempt;

      // Ensure neat sequential fallback checks using standard if-else chains instead of independent cascaded checkblocks!
      if (fallbackAttempt === 0) {
        // Step 1: try standard dot relative
        const relativePath = src.startsWith("/") ? src.slice(1) : src.startsWith("./") ? src.slice(2) : src;
        nextSrc = `./${relativePath}`;
        attempt = 1;
      } else if (fallbackAttempt === 1) {
        // Step 2: try relative without dot prefix
        const relativePath = src.startsWith("/") ? src.slice(1) : src.startsWith("./") ? src.slice(2) : src;
        nextSrc = relativePath;
        attempt = 2;
      } else if (fallbackAttempt === 2) {
        // Step 3: try root absolute
        const relativePath = src.startsWith("/") ? src.slice(1) : src.startsWith("./") ? src.slice(2) : src;
        nextSrc = `/${relativePath}`;
        attempt = 3;
      } else if (fallbackAttempt === 3) {
        // Step 4: try switching file format suffix (.webp <=> .jpg)
        let switched = "";
        const cleanSrc = src.split("?")[0];
        if (cleanSrc.endsWith(".webp")) {
          switched = src.replace(/\.webp($|\?)/, ".jpg$1");
        } else if (cleanSrc.endsWith(".jpg")) {
          switched = src.replace(/\.jpg($|\?)/, ".webp$1");
        } else if (cleanSrc.endsWith(".png")) {
          switched = src.replace(/\.png($|\?)/, ".webp$1");
        }

        if (switched && currentSrc !== switched) {
          nextSrc = switched;
          attempt = 4;
        } else {
          attempt = 5;
        }
      }

      setFallbackAttempt(attempt);

      if (attempt < 5) {
        safeSetCurrentSrc(nextSrc, attempt);
      } else {
        // Final fallback for local imagery: use elegant Unsplash placeholders styled by category
        setPlaceholderFallback(attempt);
        setFallbackAttempt(5); // This will transition high-contrast fallback details
      }
    } else {
      setFallbackAttempt(nextAttempt);
      // Standard image fallback (Drive / External)
      if (nextAttempt === 1) {
        if (id) {
          // 1st fallback for Drive: direct view URL
          safeSetCurrentSrc(`https://drive.google.com/uc?export=view&id=${id}`, nextAttempt);
        } else {
          setPlaceholderFallback(nextAttempt);
        }
      } else if (nextAttempt === 2) {
        if (id) {
          // 2nd fallback for Drive: LH3 direct view format
          safeSetCurrentSrc(`https://lh3.googleusercontent.com/d/${id}=w${optimizeSize || 600}`, nextAttempt);
        } else {
          setPlaceholderFallback(nextAttempt);
        }
      } else if (nextAttempt === 3) {
        // Try high-availability thumbnail URL
        if (id) {
          safeSetCurrentSrc(`https://drive.google.com/thumbnail?sz=w${optimizeSize || 600}&id=${id}`, nextAttempt);
        } else {
          setPlaceholderFallback(nextAttempt);
        }
      } else {
        // Display beautiful gradient-based Premium Concept Card with correct project details
        setFallbackAttempt(4);
      }
    }
  };

  if (lazy && !isInView) {
    return (
      <div 
        ref={containerRef}
        className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden bg-[#0A0A0A] select-none border border-white/5"
      >
        <div className="absolute inset-0 bg-[#0B0B0B] flex flex-col items-center justify-center p-4 text-center">
          <div className="relative flex items-center justify-center">
            <div className="absolute w-8 h-8 rounded-full bg-amber-500/5 blur-sm" />
            <div className="w-5 h-5 rounded-full border border-neutral-800" />
          </div>
          <span className="text-[9px] font-mono tracking-[0.25em] text-neutral-700 uppercase mt-4">
            PREPARING
          </span>
        </div>
      </div>
    );
  }

  if (fallbackAttempt >= 4 && !currentSrc.startsWith("http") && !currentSrc.startsWith("https")) {
    return (
      <div ref={containerRef} className={`w-full h-full bg-gradient-to-br ${fallbackTheme} flex flex-col items-center justify-center p-6 text-center select-none relative overflow-hidden`}>
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

  const catColor = getCategoryColor(categoryName);
  
  const isSepia = theme === "sepia";
  const isLight = theme === "light";

  const skeletonBg = isSepia 
    ? "bg-[#FAF4E5]" 
    : isLight 
    ? "bg-zinc-50" 
    : "bg-[#090909]";

  const gridLineColor = isSepia
    ? "bg-[linear-gradient(to_right,rgba(67,52,34,0.035)_1px,transparent_1px),linear-gradient(to_bottom,rgba(67,52,34,0.035)_1px,transparent_1px)] bg-[size:24px_24px] opacity-60"
    : isLight
    ? "bg-[linear-gradient(to_right,rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[size:24px_24px] opacity-60"
    : "bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:24px_24px] opacity-60";

  const ambientOpacity = isSepia ? "opacity-[0.14]" : isLight ? "opacity-[0.12]" : "opacity-[0.22]";

  const topCategoryBg = isSepia
    ? "bg-[#EDE2CA] border-[#DFCFA0]/50"
    : isLight
    ? "bg-zinc-200/60 border-zinc-300/40"
    : "bg-zinc-800/60 border-white/[0.02]";

  const wireframeSubBlockBg = isSepia
    ? "bg-[#EADECC]/60"
    : isLight
    ? "bg-zinc-200/50"
    : "bg-zinc-850/40";

  const ringBorder = isSepia
    ? "border-[#DFCFA0]/60"
    : isLight
    ? "border-zinc-300"
    : "border-zinc-850";

  const centerCircleBg = isSepia
    ? "bg-[#FCF5E3] border-[#DFCFA0]"
    : isLight
    ? "bg-white border-zinc-200"
    : "bg-zinc-900 border-white/[0.06]";

  const restoredTextClass = isSepia
    ? "text-[#8C7B69]"
    : isLight
    ? "text-zinc-400 font-medium"
    : "text-zinc-500";

  const loadingTrackBg = isSepia
    ? "bg-[#EADECC]/60"
    : isLight
    ? "bg-zinc-200/60"
    : "bg-zinc-900/60";

  // Filter out transition definitions to avoid conflicts, but keep state utilities like scale-100/105
  const baseImgClass = className
    ? className
        .split(" ")
        .filter(c => 
          c !== "transition-all" && 
          c !== "transition" && 
          c !== "transform" &&
          !c.startsWith("duration-") && 
          !c.startsWith("ease-")
        )
        .join(" ")
    : "w-full h-full object-cover";

  const getTransition = () => {
    if (!isLoaded) return "none";
    if (zoomable && isZoomed) {
      return "transform 0.15s ease-out, transform-origin 0.05s ease-out, opacity 0.36s cubic-bezier(0.16, 1, 0.3, 1)";
    }
    // Fully unified hardware-accelerated transition with no CSS conflicts
    return "opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), filter 0.4s cubic-bezier(0.16, 1, 0.3, 1)";
  };

  const imageStyle: React.CSSProperties = {
    zIndex: 10,
    opacity: isLoaded ? 1 : 0,
    transition: getTransition(),
    ...(zoomable && isZoomed
      ? {
          transform: "scale(2.2)",
          transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
          cursor: "zoom-out",
        }
      : zoomable
      ? { 
          cursor: "zoom-in",
        }
      : {}),
  };

  const imageClass = `${baseImgClass} ${
    isLoaded 
      ? "blur-none" 
      : lastSuccessfulSrc
      ? "blur-none animate-none"
      : "blur-lg scale-[1.03]"
  }`;

  return (
    <div 
      ref={containerRef} 
      onMouseMove={handleMouseMove}
      onClick={handleZoomClick}
      onMouseLeave={handleMouseLeave}
      className={heightAuto 
        ? `relative w-full h-auto block overflow-hidden bg-transparent select-none ${zoomable ? "cursor-zoom-in" : ""}`
        : `relative w-full h-full flex items-center justify-center overflow-hidden bg-neutral-950/20 select-none ${
            zoomable ? "cursor-zoom-in" : ""
          }`
      }
    >
      {/* 簡單、高性能的純色佔位塊，此處在沒有上一張圖作快取時展示 */}
      {!isLoaded && fallbackAttempt < 4 && !lastSuccessfulSrc && (
        <div className={`absolute inset-0 z-10 ${skeletonBg}`} />
      )}
      
      {/* 雙快取無縫過渡背景板，切換同專案圖片時提供無縫、無黑色過渡、無跳動的連續視覺美學 */}
      {lastSuccessfulSrc && (
        <img
          src={lastSuccessfulSrc}
          alt={`${alt} - transition background`}
          referrerPolicy={referrerPolicy}
          className={`${baseImgClass} absolute pointer-events-none`}
          style={{
            zIndex: 5,
            opacity: isLoaded ? 0 : 1,
            transition: isLoaded 
              ? "opacity 0.36s cubic-bezier(0.16, 1, 0.3, 1)" 
              : "none",
          }}
        />
      )}
      
      {zoomable && isLoaded && (
        <div className="absolute top-4 left-4 z-20 pointer-events-none flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-mono tracking-wider text-zinc-300 bg-black/85 backdrop-blur-md rounded-md border border-white/10 select-none shadow-lg">
          {isZoomed ? (
            <>
              <ZoomOut className="h-3.5 w-3.5 text-amber-500" />
              <span>點擊縮小 / 移動滑鼠瀏覽細節</span>
            </>
          ) : (
            <>
              <ZoomIn className="h-3.5 w-3.5 text-amber-500" />
              <span>點擊放大細節</span>
            </>
          )}
        </div>
      )}

      {currentSrc && (
        <img
          ref={imgRef}
          src={currentSrc}
          alt={alt}
          onLoad={handleLoad}
          onError={handleError}
          decoding="async"
          style={imageStyle}
          className={imageClass}
          referrerPolicy={referrerPolicy}
          loading={priority ? "eager" : "lazy"}
          {...(priority ? { fetchPriority: "high" } : {})}
        />
      )}
    </div>
  );
}