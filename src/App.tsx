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
  ShieldAlert,
  ZoomIn,
  ZoomOut,
  Sun,
  Moon,
  Eye,
  ArrowUp,
  Shuffle,
  Maximize2,
  Minimize2,
  Search,
  Image as ImageIcon,
  QrCode,
  Download
} from "lucide-react";
import { motion, AnimatePresence, useDragControls, useMotionValue, useSpring } from "motion/react";
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
  
  let extraParams = "";
  if (url.includes("?")) {
    const query = url.split("?")[1];
    const params = query.split("&").filter(p => !p.startsWith("id=") && !p.startsWith("sz="));
    if (params.length > 0) {
      extraParams = "&" + params.join("&");
    }
  } else if (url.includes("&")) {
    const params = url.split("&").filter(p => !p.startsWith("id=") && !p.startsWith("sz="));
    if (params.length > 0) {
      extraParams = "&" + params.join("&");
    }
  }

  if (id) {
    const s = size ? size : 600;
    return `https://drive.google.com/thumbnail?sz=w${s}&id=${id}${extraParams}`;
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
  
  // Support robust base URL prefixed absolute paths for local image assets.
  // This automatically handles subdirectories (e.g. GitHub Pages) and respects absolute routing sub-folders.
  const isLocalImage = (url.startsWith("/") || url.startsWith("./")) && url.includes("/images/") && !url.includes("/images/optimized/");
  if (isLocalImage) {
    const relativePart = url.startsWith("/") ? url.slice(1) : url.startsWith("./") ? url.slice(2) : url;
    // @ts-ignore
    const baseUrl = import.meta.env.BASE_URL || "/";
    const formattedBase = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
    return `${formattedBase}${relativePart}`;
  }
  
  // Support subdirectory hosting (e.g. GitHub Pages) by resolving local domain-relative paths relative to Vite base URL
  let targetUrl = url;
  if (url.startsWith("/") && !url.startsWith("/images/optimized/") && !url.startsWith("//")) {
    // @ts-ignore
    const baseUrl = import.meta.env.BASE_URL || "/";
    const formattedBase = baseUrl.startsWith("/") 
      ? (baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`) 
      : `/${baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`}`;
    const relativePath = url.slice(1);
    
    if (!url.startsWith(formattedBase)) {
      targetUrl = `${formattedBase}${relativePath}`;
    }
  }

  const id = extractDriveId(targetUrl);
  
  let extraParams = "";
  if (targetUrl.includes("?")) {
    const query = targetUrl.split("?")[1];
    const params = query.split("&").filter(p => !p.startsWith("id=") && !p.startsWith("sz="));
    if (params.length > 0) {
      extraParams = "&" + params.join("&");
    }
  } else if (targetUrl.includes("&")) {
    const params = targetUrl.split("&").filter(p => !p.startsWith("id=") && !p.startsWith("sz="));
    if (params.length > 0) {
      extraParams = "&" + params.join("&");
    }
  }

  if (id) {
    const s = size ? size : 1000;
    // Use high-availability Drive thumbnail API to completely bypass CORS 403 and referrer limits
    return `https://drive.google.com/thumbnail?sz=w${s}&id=${id}${extraParams}`;
  }
  return getOptimizedGoogleUrl(targetUrl, size);
}

const categoryColors: Record<string, {
  accent: string;
  rgbaGlow: string;
  borderClass: string;
  glowClass: string;
  gradientClass: string;
  bgClass: string;
  pulseBorderClass: string;
  textClass: string;
  highlightBorderClass: string;
  normalBorderHoverClass: string;
  titleHoverTextClass: string;
  badgeBorderHoverClass: string;
  darkBgClass: string;
  
  // Highlight configs
  highlightBgDark: string;
  highlightBorderDark: string;
  highlightShadowDark: string;
  
  highlightBgLight: string;
  highlightBorderLight: string;
  highlightShadowLight: string;
  
  highlightBgSepia: string;
  highlightBorderSepia: string;
  highlightShadowSepia: string;
  
  // Normal configs
  normalBgDark: string;
  normalBorderDark: string;
  normalShadowDark: string;
  
  normalBgLight: string;
  normalBorderLight: string;
  normalShadowLight: string;
  
  normalBgSepia: string;
  normalBorderSepia: string;
  normalShadowSepia: string;
}> = {
  "角色IP&插畫與貼圖": {
    accent: "cyan-500",
    rgbaGlow: "6, 182, 212",
    borderClass: "group-hover:border-cyan-500/30",
    glowClass: "group-hover:shadow-cyan-500/15",
    gradientClass: "from-cyan-500/30 via-cyan-500/90 to-cyan-500/20",
    bgClass: "bg-cyan-500",
    pulseBorderClass: "border-cyan-500/10",
    textClass: "text-cyan-500",
    highlightBorderClass: "border-[2px] border-cyan-500/35 hover:border-cyan-400",
    normalBorderHoverClass: "hover:border-cyan-500/35",
    titleHoverTextClass: "group-hover:text-cyan-400",
    badgeBorderHoverClass: "group-hover:border-cyan-500/30",
    darkBgClass: "from-[#021825] to-[#0a0a0a]",
    
    highlightBgDark: "bg-gradient-to-b from-[#021825] to-[#0a0a0a]",
    highlightBorderDark: "border-[2px] border-cyan-500/35 hover:border-cyan-400",
    highlightShadowDark: "0 8px 16px -6px rgba(0,0,0,0.3), 0 0 15px 1px rgba(6, 182, 212, 0.12)",
    highlightBgLight: "bg-gradient-to-b from-[#FFFDF0] via-[#FFF9DF] to-[#FFFBF0]",
    highlightBorderLight: "border-[2.5px] border-amber-500 hover:border-amber-600",
    highlightShadowLight: "0 12px 24px -8px rgba(215,108,0,0.15)",
    highlightBgSepia: "bg-gradient-to-b from-[#FFF5DC] via-[#FAF4E5] to-[#FAF4E5]",
    highlightBorderSepia: "border-[2.5px] border-amber-500 hover:border-amber-650",
    highlightShadowSepia: "0 12px 24px -8px rgba(217,119,6,0.18)",
    
    normalBgDark: "bg-[#0E0E0E]",
    normalBorderDark: "border border-white/5 hover:border-cyan-500/35",
    normalShadowDark: "0 10px 20px -10px rgba(0,0,0,0.25)",
    normalBgLight: "bg-white",
    normalBorderLight: "border border-zinc-200 hover:border-amber-500/25",
    normalShadowLight: "0 4px 6px -1px rgba(0,0,0,0.05)",
    normalBgSepia: "bg-[#FAF4E5]",
    normalBorderSepia: "border border-[#EADECC]/70 hover:border-amber-600/30",
    normalShadowSepia: "0 4px 6px -1px rgba(67,52,34,0.05)"
  },
  "商品周邊企業禮贈品": {
    accent: "amber-500",
    rgbaGlow: "245, 158, 11",
    borderClass: "group-hover:border-amber-500/30",
    glowClass: "group-hover:shadow-amber-500/15",
    gradientClass: "from-amber-500/30 via-amber-500/90 to-amber-500/20",
    bgClass: "bg-amber-500",
    pulseBorderClass: "border-amber-500/10",
    textClass: "text-amber-500",
    highlightBorderClass: "border-[2px] border-amber-500/35 hover:border-amber-400",
    normalBorderHoverClass: "hover:border-amber-500/35",
    titleHoverTextClass: "group-hover:text-amber-400",
    badgeBorderHoverClass: "group-hover:border-amber-500/30",
    darkBgClass: "from-[#16120b] to-[#0a0a0a]",
    
    highlightBgDark: "bg-gradient-to-b from-[#16120b] to-[#0a0a0a]",
    highlightBorderDark: "border-[2px] border-amber-500/35 hover:border-amber-400",
    highlightShadowDark: "0 8px 16px -6px rgba(0,0,0,0.3), 0 0 15px 1px rgba(245, 158, 11, 0.12)",
    highlightBgLight: "bg-gradient-to-b from-[#FFFDF0] via-[#FFF9DF] to-[#FFFBF0]",
    highlightBorderLight: "border-[2.5px] border-amber-500 hover:border-amber-600",
    highlightShadowLight: "0 12px 24px -8px rgba(215,108,0,0.15)",
    highlightBgSepia: "bg-gradient-to-b from-[#FFF5DC] via-[#FAF4E5] to-[#FAF4E5]",
    highlightBorderSepia: "border-[2.5px] border-amber-500 hover:border-amber-650",
    highlightShadowSepia: "0 12px 24px -8px rgba(217,119,6,0.18)",
    
    normalBgDark: "bg-[#0E0E0E]",
    normalBorderDark: "border border-white/5 hover:border-amber-500/35",
    normalShadowDark: "0 10px 20px -10px rgba(0,0,0,0.25)",
    normalBgLight: "bg-white",
    normalBorderLight: "border border-zinc-200 hover:border-amber-500/25",
    normalShadowLight: "0 4px 6px -1px rgba(0,0,0,0.05)",
    normalBgSepia: "bg-[#FAF4E5]",
    normalBorderSepia: "border border-[#EADECC]/70 hover:border-amber-600/30",
    normalShadowSepia: "0 4px 6px -1px rgba(67,52,34,0.05)"
  },
  "商業視覺攝影": {
    accent: "rose-500",
    rgbaGlow: "244, 63, 94",
    borderClass: "group-hover:border-rose-500/30",
    glowClass: "group-hover:shadow-rose-500/15",
    gradientClass: "from-rose-500/30 via-rose-500/90 to-rose-500/20",
    bgClass: "bg-rose-500",
    pulseBorderClass: "border-rose-500/10",
    textClass: "text-rose-500",
    highlightBorderClass: "border-[2px] border-rose-500/35 hover:border-rose-400",
    normalBorderHoverClass: "hover:border-rose-500/35",
    titleHoverTextClass: "group-hover:text-rose-400",
    badgeBorderHoverClass: "group-hover:border-rose-500/30",
    darkBgClass: "from-[#1c0812] to-[#0a0a0a]",
    
    highlightBgDark: "bg-gradient-to-b from-[#1c0812] to-[#0a0a0a]",
    highlightBorderDark: "border-[2px] border-rose-500/35 hover:border-rose-400",
    highlightShadowDark: "0 8px 16px -6px rgba(0,0,0,0.3), 0 0 15px 1px rgba(244, 63, 94, 0.12)",
    highlightBgLight: "bg-gradient-to-b from-[#FFFDF0] via-[#FFF9DF] to-[#FFFBF0]",
    highlightBorderLight: "border-[2.5px] border-amber-500 hover:border-amber-600",
    highlightShadowLight: "0 12px 24px -8px rgba(215,108,0,0.15)",
    highlightBgSepia: "bg-gradient-to-b from-[#FFF5DC] via-[#FAF4E5] to-[#FAF4E5]",
    highlightBorderSepia: "border-[2.5px] border-amber-500 hover:border-amber-650",
    highlightShadowSepia: "0 12px 24px -8px rgba(217,119,6,0.18)",
    
    normalBgDark: "bg-[#0E0E0E]",
    normalBorderDark: "border border-white/5 hover:border-rose-500/35",
    normalShadowDark: "0 10px 20px -10px rgba(0,0,0,0.25)",
    normalBgLight: "bg-white",
    normalBorderLight: "border border-zinc-200 hover:border-amber-500/25",
    normalShadowLight: "0 4px 6px -1px rgba(0,0,0,0.05)",
    normalBgSepia: "bg-[#FAF4E5]",
    normalBorderSepia: "border border-[#EADECC]/70 hover:border-amber-600/30",
    normalShadowSepia: "0 4px 6px -1px rgba(67,52,34,0.05)"
  },
  "電商產品銷售圖": {
    accent: "orange-500",
    rgbaGlow: "249, 115, 22",
    borderClass: "group-hover:border-orange-500/30",
    glowClass: "group-hover:shadow-orange-500/15",
    gradientClass: "from-orange-500/30 via-orange-500/90 to-orange-500/20",
    bgClass: "bg-orange-500",
    pulseBorderClass: "border-orange-500/10",
    textClass: "text-orange-500",
    highlightBorderClass: "border-[2px] border-orange-500/35 hover:border-orange-400",
    normalBorderHoverClass: "hover:border-orange-500/35",
    titleHoverTextClass: "group-hover:text-orange-400",
    badgeBorderHoverClass: "group-hover:border-orange-500/30",
    darkBgClass: "from-[#1c0c05] to-[#0a0a0a]",
    
    highlightBgDark: "bg-gradient-to-b from-[#1c0c05] to-[#0a0a0a]",
    highlightBorderDark: "border-[2px] border-orange-500/35 hover:border-orange-400",
    highlightShadowDark: "0 8px 16px -6px rgba(0,0,0,0.3), 0 0 15px 1px rgba(249, 115, 22, 0.12)",
    highlightBgLight: "bg-gradient-to-b from-[#FFFDF0] via-[#FFF9DF] to-[#FFFBF0]",
    highlightBorderLight: "border-[2.5px] border-amber-500 hover:border-amber-600",
    highlightShadowLight: "0 12px 24px -8px rgba(215,108,0,0.15)",
    highlightBgSepia: "bg-gradient-to-b from-[#FFF5DC] via-[#FAF4E5] to-[#FAF4E5]",
    highlightBorderSepia: "border-[2.5px] border-amber-500 hover:border-amber-650",
    highlightShadowSepia: "0 12px 24px -8px rgba(217,119,6,0.18)",
    
    normalBgDark: "bg-[#0E0E0E]",
    normalBorderDark: "border border-white/5 hover:border-orange-500/35",
    normalShadowDark: "0 10px 20px -10px rgba(0,0,0,0.25)",
    normalBgLight: "bg-white",
    normalBorderLight: "border border-zinc-200 hover:border-amber-500/25",
    normalShadowLight: "0 4px 6px -1px rgba(0,0,0,0.05)",
    normalBgSepia: "bg-[#FAF4E5]",
    normalBorderSepia: "border border-[#EADECC]/70 hover:border-amber-600/30",
    normalShadowSepia: "0 4px 6px -1px rgba(67,52,34,0.05)"
  },
  "企業LOGO與CIS設計": {
    accent: "indigo-500",
    rgbaGlow: "99, 102, 241",
    borderClass: "group-hover:border-indigo-500/30",
    glowClass: "group-hover:shadow-indigo-500/15",
    gradientClass: "from-indigo-500/30 via-indigo-500/90 to-indigo-500/20",
    bgClass: "bg-indigo-500",
    pulseBorderClass: "border-indigo-500/10",
    textClass: "text-indigo-500",
    highlightBorderClass: "border-[2px] border-indigo-500/35 hover:border-indigo-400",
    normalBorderHoverClass: "hover:border-indigo-500/35",
    titleHoverTextClass: "group-hover:text-indigo-400",
    badgeBorderHoverClass: "group-hover:border-indigo-500/30",
    darkBgClass: "from-[#0b0c21] to-[#0a0a0a]",
    
    highlightBgDark: "bg-gradient-to-b from-[#0b0c21] to-[#0a0a0a]",
    highlightBorderDark: "border-[2px] border-indigo-500/35 hover:border-indigo-400",
    highlightShadowDark: "0 8px 16px -6px rgba(0,0,0,0.3), 0 0 15px 1px rgba(99, 102, 241, 0.12)",
    highlightBgLight: "bg-gradient-to-b from-[#FFFDF0] via-[#FFF9DF] to-[#FFFBF0]",
    highlightBorderLight: "border-[2.5px] border-amber-500 hover:border-amber-600",
    highlightShadowLight: "0 12px 24px -8px rgba(215,108,0,0.15)",
    highlightBgSepia: "bg-gradient-to-b from-[#FFF5DC] via-[#FAF4E5] to-[#FAF4E5]",
    highlightBorderSepia: "border-[2.5px] border-amber-500 hover:border-amber-650",
    highlightShadowSepia: "0 12px 24px -8px rgba(217,119,6,0.18)",
    
    normalBgDark: "bg-[#0E0E0E]",
    normalBorderDark: "border border-white/5 hover:border-indigo-500/35",
    normalShadowDark: "0 10px 20px -10px rgba(0,0,0,0.25)",
    normalBgLight: "bg-white",
    normalBorderLight: "border border-zinc-200 hover:border-amber-500/25",
    normalShadowLight: "0 4px 6px -1px rgba(0,0,0,0.05)",
    normalBgSepia: "bg-[#FAF4E5]",
    normalBorderSepia: "border border-[#EADECC]/70 hover:border-amber-600/30",
    normalShadowSepia: "0 4px 6px -1px rgba(67,52,34,0.05)"
  },
  "商務印刷品設計": {
    accent: "emerald-500",
    rgbaGlow: "16, 185, 129",
    borderClass: "group-hover:border-emerald-500/30",
    glowClass: "group-hover:shadow-emerald-500/15",
    gradientClass: "from-emerald-500/30 via-emerald-500/90 to-emerald-500/20",
    bgClass: "bg-emerald-500",
    pulseBorderClass: "border-emerald-500/10",
    textClass: "text-emerald-500",
    highlightBorderClass: "border-[2px] border-emerald-500/35 hover:border-emerald-400",
    normalBorderHoverClass: "hover:border-emerald-500/35",
    titleHoverTextClass: "group-hover:text-emerald-400",
    badgeBorderHoverClass: "group-hover:border-emerald-500/30",
    darkBgClass: "from-[#041a0f] to-[#0a0a0a]",
    
    highlightBgDark: "bg-gradient-to-b from-[#041a0f] to-[#0a0a0a]",
    highlightBorderDark: "border-[2px] border-emerald-500/35 hover:border-emerald-400",
    highlightShadowDark: "0 8px 16px -6px rgba(0,0,0,0.3), 0 0 15px 1px rgba(16, 185, 129, 0.12)",
    highlightBgLight: "bg-gradient-to-b from-[#FFFDF0] via-[#FFF9DF] to-[#FFFBF0]",
    highlightBorderLight: "border-[2.5px] border-amber-500 hover:border-amber-600",
    highlightShadowLight: "0 12px 24px -8px rgba(215,108,0,0.15)",
    highlightBgSepia: "bg-gradient-to-b from-[#FFF5DC] via-[#FAF4E5] to-[#FAF4E5]",
    highlightBorderSepia: "border-[2.5px] border-amber-500 hover:border-amber-650",
    highlightShadowSepia: "0 12px 24px -8px rgba(217,119,6,0.18)",
    
    normalBgDark: "bg-[#0E0E0E]",
    normalBorderDark: "border border-white/5 hover:border-emerald-500/35",
    normalShadowDark: "0 10px 20px -10px rgba(0,0,0,0.25)",
    normalBgLight: "bg-white",
    normalBorderLight: "border border-zinc-200 hover:border-amber-500/25",
    normalShadowLight: "0 4px 6px -1px rgba(0,0,0,0.05)",
    normalBgSepia: "bg-[#FAF4E5]",
    normalBorderSepia: "border border-[#EADECC]/70 hover:border-amber-600/30",
    normalShadowSepia: "0 4px 6px -1px rgba(67,52,34,0.05)"
  },
  "賣場Banner橫幅廣告": {
    accent: "pink-500",
    rgbaGlow: "236, 72, 153",
    borderClass: "group-hover:border-pink-500/30",
    glowClass: "group-hover:shadow-pink-500/15",
    gradientClass: "from-pink-500/30 via-pink-500/90 to-pink-500/20",
    bgClass: "bg-pink-500",
    pulseBorderClass: "border-pink-500/10",
    textClass: "text-pink-500",
    highlightBorderClass: "border-[2px] border-pink-500/35 hover:border-pink-400",
    normalBorderHoverClass: "hover:border-pink-500/35",
    titleHoverTextClass: "group-hover:text-pink-400",
    badgeBorderHoverClass: "group-hover:border-pink-500/30",
    darkBgClass: "from-[#1c0611] to-[#0a0a0a]",
    
    highlightBgDark: "bg-gradient-to-b from-[#1c0611] to-[#0a0a0a]",
    highlightBorderDark: "border-[2px] border-pink-500/35 hover:border-pink-400",
    highlightShadowDark: "0 8px 16px -6px rgba(0,0,0,0.3), 0 0 15px 1px rgba(236, 72, 153, 0.12)",
    highlightBgLight: "bg-gradient-to-b from-[#FFFDF0] via-[#FFF9DF] to-[#FFFBF0]",
    highlightBorderLight: "border-[2.5px] border-amber-500 hover:border-amber-600",
    highlightShadowLight: "0 12px 24px -8px rgba(215,108,0,0.15)",
    highlightBgSepia: "bg-gradient-to-b from-[#FFF5DC] via-[#FAF4E5] to-[#FAF4E5]",
    highlightBorderSepia: "border-[2.5px] border-amber-500 hover:border-amber-650",
    highlightShadowSepia: "0 12px 24px -8px rgba(217,119,6,0.18)",
    
    normalBgDark: "bg-[#0E0E0E]",
    normalBorderDark: "border border-white/5 hover:border-pink-500/35",
    normalShadowDark: "0 10px 20px -10px rgba(0,0,0,0.25)",
    normalBgLight: "bg-white",
    normalBorderLight: "border border-zinc-200 hover:border-amber-500/25",
    normalShadowLight: "0 4px 6px -1px rgba(0,0,0,0.05)",
    normalBgSepia: "bg-[#FAF4E5]",
    normalBorderSepia: "border border-[#EADECC]/70 hover:border-amber-600/30",
    normalShadowSepia: "0 4px 6px -1px rgba(67,52,34,0.05)"
  },
  "影音與多媒體設計": {
    accent: "purple-500",
    rgbaGlow: "168, 85, 247",
    borderClass: "group-hover:border-purple-500/30",
    glowClass: "group-hover:shadow-purple-500/15",
    gradientClass: "from-purple-500/30 via-purple-500/90 to-purple-500/20",
    bgClass: "bg-purple-500",
    pulseBorderClass: "border-purple-500/10",
    textClass: "text-purple-500",
    highlightBorderClass: "border-[2px] border-purple-500/35 hover:border-purple-400",
    normalBorderHoverClass: "hover:border-purple-500/35",
    titleHoverTextClass: "group-hover:text-purple-400",
    badgeBorderHoverClass: "group-hover:border-purple-500/30",
    darkBgClass: "from-[#140621] to-[#0a0a0a]",
    
    highlightBgDark: "bg-gradient-to-b from-[#140621] to-[#0a0a0a]",
    highlightBorderDark: "border-[2px] border-purple-500/35 hover:border-purple-400",
    highlightShadowDark: "0 8px 16px -6px rgba(0,0,0,0.3), 0 0 15px 1px rgba(168, 85, 247, 0.12)",
    highlightBgLight: "bg-gradient-to-b from-[#FFFDF0] via-[#FFF9DF] to-[#FFFBF0]",
    highlightBorderLight: "border-[2.5px] border-amber-500 hover:border-amber-600",
    highlightShadowLight: "0 12px 24px -8px rgba(215,108,0,0.15)",
    highlightBgSepia: "bg-gradient-to-b from-[#FFF5DC] via-[#FAF4E5] to-[#FAF4E5]",
    highlightBorderSepia: "border-[2.5px] border-amber-500 hover:border-amber-650",
    highlightShadowSepia: "0 12px 24px -8px rgba(217,119,6,0.18)",
    
    normalBgDark: "bg-[#0E0E0E]",
    normalBorderDark: "border border-white/5 hover:border-purple-500/35",
    normalShadowDark: "0 10px 20px -10px rgba(0,0,0,0.25)",
    normalBgLight: "bg-white",
    normalBorderLight: "border border-zinc-200 hover:border-amber-500/25",
    normalShadowLight: "0 4px 6px -1px rgba(0,0,0,0.05)",
    normalBgSepia: "bg-[#FAF4E5]",
    normalBorderSepia: "border border-[#EADECC]/70 hover:border-amber-600/30",
    normalShadowSepia: "0 4px 6px -1px rgba(67,52,34,0.05)"
  },
  "網站產品瀑布頁": {
    accent: "teal-500",
    rgbaGlow: "20, 184, 166",
    borderClass: "group-hover:border-teal-500/30",
    glowClass: "group-hover:shadow-teal-500/15",
    gradientClass: "from-teal-500/30 via-teal-500/90 to-teal-500/20",
    bgClass: "bg-teal-500",
    pulseBorderClass: "border-teal-500/10",
    textClass: "text-teal-500",
    highlightBorderClass: "border-[2px] border-teal-500/35 hover:border-teal-400",
    normalBorderHoverClass: "hover:border-teal-500/35",
    titleHoverTextClass: "group-hover:text-teal-400",
    badgeBorderHoverClass: "group-hover:border-teal-500/30",
    darkBgClass: "from-[#031d1a] to-[#0a0a0a]",
    
    highlightBgDark: "bg-gradient-to-b from-[#031d1a] to-[#0a0a0a]",
    highlightBorderDark: "border-[2px] border-teal-500/35 hover:border-teal-400",
    highlightShadowDark: "0 8px 16px -6px rgba(0,0,0,0.3), 0 0 15px 1px rgba(20, 184, 166, 0.12)",
    highlightBgLight: "bg-gradient-to-b from-[#FFFDF0] via-[#FFF9DF] to-[#FFFBF0]",
    highlightBorderLight: "border-[2.5px] border-amber-500 hover:border-amber-600",
    highlightShadowLight: "0 12px 24px -8px rgba(215,108,0,0.15)",
    highlightBgSepia: "bg-gradient-to-b from-[#FFF5DC] via-[#FAF4E5] to-[#FAF4E5]",
    highlightBorderSepia: "border-[2.5px] border-amber-500 hover:border-amber-650",
    highlightShadowSepia: "0 12px 24px -8px rgba(217,119,6,0.18)",
    
    normalBgDark: "bg-[#0E0E0E]",
    normalBorderDark: "border border-white/5 hover:border-teal-500/35",
    normalShadowDark: "0 10px 20px -10px rgba(0,0,0,0.25)",
    normalBgLight: "bg-white",
    normalBorderLight: "border border-zinc-200 hover:border-amber-500/25",
    normalShadowLight: "0 4px 6px -1px rgba(0,0,0,0.05)",
    normalBgSepia: "bg-[#FAF4E5]",
    normalBorderSepia: "border border-[#EADECC]/70 hover:border-amber-600/30",
    normalShadowSepia: "0 4px 6px -1px rgba(67,52,34,0.05)"
  },
  "平面設計與排版": {
    accent: "sky-500",
    rgbaGlow: "14, 165, 233",
    borderClass: "group-hover:border-sky-500/30",
    glowClass: "group-hover:shadow-sky-500/15",
    gradientClass: "from-sky-500/30 via-sky-500/90 to-sky-500/20",
    bgClass: "bg-sky-500",
    pulseBorderClass: "border-sky-500/10",
    textClass: "text-sky-500",
    highlightBorderClass: "border-[2px] border-sky-500/35 hover:border-sky-400",
    normalBorderHoverClass: "hover:border-sky-500/40 hover:shadow-sky-500/5",
    titleHoverTextClass: "group-hover:text-sky-400 gap-1.5",
    badgeBorderHoverClass: "group-hover:border-sky-500/40",
    darkBgClass: "bg-sky-500/20 text-sky-400 border border-sky-500/30",
    highlightBgDark: "bg-sky-500/5 hover:bg-sky-500/10",
    highlightBorderDark: "border-sky-500/20 hover:border-sky-500/40",
    highlightShadowDark: "shadow-[unset] hover:shadow-[0_8px_30px_rgba(14, 165, 233,0.2)]",
    highlightBgLight: "bg-sky-50 hover:bg-sky-100",
    highlightBorderLight: "border-sky-200 hover:border-sky-400",
    highlightShadowLight: "shadow-lg shadow-sky-500/10 hover:shadow-xl hover:shadow-sky-500/20",
    highlightBgSepia: "bg-[rgba(14, 165, 233,0.05)] hover:bg-[rgba(14, 165, 233,0.1)]",
    highlightBorderSepia: "border-[rgba(14, 165, 233,0.2)] hover:border-[rgba(14, 165, 233,0.4)]",
    highlightShadowSepia: "shadow-lg shadow-[rgba(14, 165, 233,0.05)] hover:shadow-xl hover:shadow-[rgba(14, 165, 233,0.15)]",
    normalBgDark: "bg-[unset] hover:bg-zinc-800/80",
    normalBorderDark: "border-white/5 hover:border-sky-500/30",
    normalShadowDark: "shadow-[unset] hover:shadow-[0_4px_20px_rgba(14, 165, 233,0.1)]",
    normalBgLight: "bg-white/60 hover:bg-white",
    normalBorderLight: "border-zinc-200/50 hover:border-sky-300",
    normalShadowLight: "shadow-sm hover:shadow-md hover:shadow-sky-500/10",
    normalBgSepia: "bg-[#FDFBF7]/60 hover:bg-[#FDFBF7]",
    normalBorderSepia: "border-[#E8DFCE]/50 hover:border-[rgba(14, 165, 233,0.3)]",
    normalShadowSepia: "shadow-sm hover:shadow-md hover:shadow-[rgba(14, 165, 233,0.1)]"
  },
  "網頁設計程式UIUX": {
    accent: "fuchsia-500",
    rgbaGlow: "217, 70, 239",
    borderClass: "group-hover:border-fuchsia-500/30",
    glowClass: "group-hover:shadow-fuchsia-500/15",
    gradientClass: "from-fuchsia-500/30 via-fuchsia-500/90 to-fuchsia-500/20",
    bgClass: "bg-fuchsia-500",
    pulseBorderClass: "border-fuchsia-500/10",
    textClass: "text-fuchsia-500",
    highlightBorderClass: "border-[2px] border-fuchsia-500/35 hover:border-fuchsia-400",
    normalBorderHoverClass: "hover:border-fuchsia-500/40 hover:shadow-fuchsia-500/5",
    titleHoverTextClass: "group-hover:text-fuchsia-400 gap-1.5",
    badgeBorderHoverClass: "group-hover:border-fuchsia-500/40",
    darkBgClass: "bg-fuchsia-500/20 text-fuchsia-400 border border-fuchsia-500/30",
    highlightBgDark: "bg-fuchsia-500/5 hover:bg-fuchsia-500/10",
    highlightBorderDark: "border-fuchsia-500/20 hover:border-fuchsia-500/40",
    highlightShadowDark: "shadow-[unset] hover:shadow-[0_8px_30px_rgba(217, 70, 239,0.2)]",
    highlightBgLight: "bg-fuchsia-50 hover:bg-fuchsia-100",
    highlightBorderLight: "border-fuchsia-200 hover:border-fuchsia-400",
    highlightShadowLight: "shadow-lg shadow-fuchsia-500/10 hover:shadow-xl hover:shadow-fuchsia-500/20",
    highlightBgSepia: "bg-[rgba(217, 70, 239,0.05)] hover:bg-[rgba(217, 70, 239,0.1)]",
    highlightBorderSepia: "border-[rgba(217, 70, 239,0.2)] hover:border-[rgba(217, 70, 239,0.4)]",
    highlightShadowSepia: "shadow-lg shadow-[rgba(217, 70, 239,0.05)] hover:shadow-xl hover:shadow-[rgba(217, 70, 239,0.15)]",
    normalBgDark: "bg-[unset] hover:bg-zinc-800/80",
    normalBorderDark: "border-white/5 hover:border-fuchsia-500/30",
    normalShadowDark: "shadow-[unset] hover:shadow-[0_4px_20px_rgba(217, 70, 239,0.1)]",
    normalBgLight: "bg-white/60 hover:bg-white",
    normalBorderLight: "border-zinc-200/50 hover:border-fuchsia-300",
    normalShadowLight: "shadow-sm hover:shadow-md hover:shadow-fuchsia-500/10",
    normalBgSepia: "bg-[#FDFBF7]/60 hover:bg-[#FDFBF7]",
    normalBorderSepia: "border-[#E8DFCE]/50 hover:border-[rgba(217, 70, 239,0.3)]",
    normalShadowSepia: "shadow-sm hover:shadow-md hover:shadow-[rgba(217, 70, 239,0.1)]"
  },
  "商業攝影": {
    accent: "rose-500",
    rgbaGlow: "244, 63, 94",
    borderClass: "group-hover:border-rose-500/30",
    glowClass: "group-hover:shadow-rose-500/15",
    gradientClass: "from-rose-500/30 via-rose-500/90 to-rose-500/20",
    bgClass: "bg-rose-500",
    pulseBorderClass: "border-rose-500/10",
    textClass: "text-rose-500",
    highlightBorderClass: "border-[2px] border-rose-500/35 hover:border-rose-400",
    normalBorderHoverClass: "hover:border-rose-500/40 hover:shadow-rose-500/5",
    titleHoverTextClass: "group-hover:text-rose-400 gap-1.5",
    badgeBorderHoverClass: "group-hover:border-rose-500/40",
    darkBgClass: "bg-rose-500/20 text-rose-400 border border-rose-500/30",
    highlightBgDark: "bg-rose-500/5 hover:bg-rose-500/10",
    highlightBorderDark: "border-rose-500/20 hover:border-rose-500/40",
    highlightShadowDark: "shadow-[unset] hover:shadow-[0_8px_30px_rgba(244, 63, 94,0.2)]",
    highlightBgLight: "bg-rose-50 hover:bg-rose-100",
    highlightBorderLight: "border-rose-200 hover:border-rose-400",
    highlightShadowLight: "shadow-lg shadow-rose-500/10 hover:shadow-xl hover:shadow-rose-500/20",
    highlightBgSepia: "bg-[rgba(244, 63, 94,0.05)] hover:bg-[rgba(244, 63, 94,0.1)]",
    highlightBorderSepia: "border-[rgba(244, 63, 94,0.2)] hover:border-[rgba(244, 63, 94,0.4)]",
    highlightShadowSepia: "shadow-lg shadow-[rgba(244, 63, 94,0.05)] hover:shadow-xl hover:shadow-[rgba(244, 63, 94,0.15)]",
    normalBgDark: "bg-[unset] hover:bg-zinc-800/80",
    normalBorderDark: "border-white/5 hover:border-rose-500/30",
    normalShadowDark: "shadow-[unset] hover:shadow-[0_4px_20px_rgba(244, 63, 94,0.1)]",
    normalBgLight: "bg-white/60 hover:bg-white",
    normalBorderLight: "border-zinc-200/50 hover:border-rose-300",
    normalShadowLight: "shadow-sm hover:shadow-md hover:shadow-rose-500/10",
    normalBgSepia: "bg-[#FDFBF7]/60 hover:bg-[#FDFBF7]",
    normalBorderSepia: "border-[#E8DFCE]/50 hover:border-[rgba(244, 63, 94,0.3)]",
    normalShadowSepia: "shadow-sm hover:shadow-md hover:shadow-[rgba(244, 63, 94,0.1)]"
  },
  "影音製作": {
    accent: "violet-500",
    rgbaGlow: "139, 92, 246",
    borderClass: "group-hover:border-violet-500/30",
    glowClass: "group-hover:shadow-violet-500/15",
    gradientClass: "from-violet-500/30 via-violet-500/90 to-violet-500/20",
    bgClass: "bg-violet-500",
    pulseBorderClass: "border-violet-500/10",
    textClass: "text-violet-500",
    highlightBorderClass: "border-[2px] border-violet-500/35 hover:border-violet-400",
    normalBorderHoverClass: "hover:border-violet-500/40 hover:shadow-violet-500/5",
    titleHoverTextClass: "group-hover:text-violet-400 gap-1.5",
    badgeBorderHoverClass: "group-hover:border-violet-500/40",
    darkBgClass: "bg-violet-500/20 text-violet-400 border border-violet-500/30",
    highlightBgDark: "bg-violet-500/5 hover:bg-violet-500/10",
    highlightBorderDark: "border-violet-500/20 hover:border-violet-500/40",
    highlightShadowDark: "shadow-[unset] hover:shadow-[0_8px_30px_rgba(139, 92, 246,0.2)]",
    highlightBgLight: "bg-violet-50 hover:bg-violet-100",
    highlightBorderLight: "border-violet-200 hover:border-violet-400",
    highlightShadowLight: "shadow-lg shadow-violet-500/10 hover:shadow-xl hover:shadow-violet-500/20",
    highlightBgSepia: "bg-[rgba(139, 92, 246,0.05)] hover:bg-[rgba(139, 92, 246,0.1)]",
    highlightBorderSepia: "border-[rgba(139, 92, 246,0.2)] hover:border-[rgba(139, 92, 246,0.4)]",
    highlightShadowSepia: "shadow-lg shadow-[rgba(139, 92, 246,0.05)] hover:shadow-xl hover:shadow-[rgba(139, 92, 246,0.15)]",
    normalBgDark: "bg-[unset] hover:bg-zinc-800/80",
    normalBorderDark: "border-white/5 hover:border-violet-500/30",
    normalShadowDark: "shadow-[unset] hover:shadow-[0_4px_20px_rgba(139, 92, 246,0.1)]",
    normalBgLight: "bg-white/60 hover:bg-white",
    normalBorderLight: "border-zinc-200/50 hover:border-violet-300",
    normalShadowLight: "shadow-sm hover:shadow-md hover:shadow-violet-500/10",
    normalBgSepia: "bg-[#FDFBF7]/60 hover:bg-[#FDFBF7]",
    normalBorderSepia: "border-[#E8DFCE]/50 hover:border-[rgba(139, 92, 246,0.3)]",
    normalShadowSepia: "shadow-sm hover:shadow-md hover:shadow-[rgba(139, 92, 246,0.1)]"
  },
  "印刷完稿": {
    accent: "emerald-500",
    rgbaGlow: "16, 185, 129",
    borderClass: "group-hover:border-emerald-500/30",
    glowClass: "group-hover:shadow-emerald-500/15",
    gradientClass: "from-emerald-500/30 via-emerald-500/90 to-emerald-500/20",
    bgClass: "bg-emerald-500",
    pulseBorderClass: "border-emerald-500/10",
    textClass: "text-emerald-500",
    highlightBorderClass: "border-[2px] border-emerald-500/35 hover:border-emerald-400",
    normalBorderHoverClass: "hover:border-emerald-500/40 hover:shadow-emerald-500/5",
    titleHoverTextClass: "group-hover:text-emerald-400 gap-1.5",
    badgeBorderHoverClass: "group-hover:border-emerald-500/40",
    darkBgClass: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30",
    highlightBgDark: "bg-emerald-500/5 hover:bg-emerald-500/10",
    highlightBorderDark: "border-emerald-500/20 hover:border-emerald-500/40",
    highlightShadowDark: "shadow-[unset] hover:shadow-[0_8px_30px_rgba(16, 185, 129,0.2)]",
    highlightBgLight: "bg-emerald-50 hover:bg-emerald-100",
    highlightBorderLight: "border-emerald-200 hover:border-emerald-400",
    highlightShadowLight: "shadow-lg shadow-emerald-500/10 hover:shadow-xl hover:shadow-emerald-500/20",
    highlightBgSepia: "bg-[rgba(16, 185, 129,0.05)] hover:bg-[rgba(16, 185, 129,0.1)]",
    highlightBorderSepia: "border-[rgba(16, 185, 129,0.2)] hover:border-[rgba(16, 185, 129,0.4)]",
    highlightShadowSepia: "shadow-lg shadow-[rgba(16, 185, 129,0.05)] hover:shadow-xl hover:shadow-[rgba(16, 185, 129,0.15)]",
    normalBgDark: "bg-[unset] hover:bg-zinc-800/80",
    normalBorderDark: "border-white/5 hover:border-emerald-500/30",
    normalShadowDark: "shadow-[unset] hover:shadow-[0_4px_20px_rgba(16, 185, 129,0.1)]",
    normalBgLight: "bg-white/60 hover:bg-white",
    normalBorderLight: "border-zinc-200/50 hover:border-emerald-300",
    normalShadowLight: "shadow-sm hover:shadow-md hover:shadow-emerald-500/10",
    normalBgSepia: "bg-[#FDFBF7]/60 hover:bg-[#FDFBF7]",
    normalBorderSepia: "border-[#E8DFCE]/50 hover:border-[rgba(16, 185, 129,0.3)]",
    normalShadowSepia: "shadow-sm hover:shadow-md hover:shadow-[rgba(16, 185, 129,0.1)]"
  },
  "IP 與周邊開發": {
    accent: "blue-500",
    rgbaGlow: "59, 130, 246",
    borderClass: "group-hover:border-blue-500/30",
    glowClass: "group-hover:shadow-blue-500/15",
    gradientClass: "from-blue-500/30 via-blue-500/90 to-blue-500/20",
    bgClass: "bg-blue-500",
    pulseBorderClass: "border-blue-500/10",
    textClass: "text-blue-500",
    highlightBorderClass: "border-[2px] border-blue-500/35 hover:border-blue-400",
    normalBorderHoverClass: "hover:border-blue-500/40 hover:shadow-blue-500/5",
    titleHoverTextClass: "group-hover:text-blue-400 gap-1.5",
    badgeBorderHoverClass: "group-hover:border-blue-500/40",
    darkBgClass: "bg-blue-500/20 text-blue-400 border border-blue-500/30",
    highlightBgDark: "bg-blue-500/5 hover:bg-blue-500/10",
    highlightBorderDark: "border-blue-500/20 hover:border-blue-500/40",
    highlightShadowDark: "shadow-[unset] hover:shadow-[0_8px_30px_rgba(59, 130, 246,0.2)]",
    highlightBgLight: "bg-blue-50 hover:bg-blue-100",
    highlightBorderLight: "border-blue-200 hover:border-blue-400",
    highlightShadowLight: "shadow-lg shadow-blue-500/10 hover:shadow-xl hover:shadow-blue-500/20",
    highlightBgSepia: "bg-[rgba(59, 130, 246,0.05)] hover:bg-[rgba(59, 130, 246,0.1)]",
    highlightBorderSepia: "border-[rgba(59, 130, 246,0.2)] hover:border-[rgba(59, 130, 246,0.4)]",
    highlightShadowSepia: "shadow-lg shadow-[rgba(59, 130, 246,0.05)] hover:shadow-xl hover:shadow-[rgba(59, 130, 246,0.15)]",
    normalBgDark: "bg-[unset] hover:bg-zinc-800/80",
    normalBorderDark: "border-white/5 hover:border-blue-500/30",
    normalShadowDark: "shadow-[unset] hover:shadow-[0_4px_20px_rgba(59, 130, 246,0.1)]",
    normalBgLight: "bg-white/60 hover:bg-white",
    normalBorderLight: "border-zinc-200/50 hover:border-blue-300",
    normalShadowLight: "shadow-sm hover:shadow-md hover:shadow-blue-500/10",
    normalBgSepia: "bg-[#FDFBF7]/60 hover:bg-[#FDFBF7]",
    normalBorderSepia: "border-[#E8DFCE]/50 hover:border-[rgba(59, 130, 246,0.3)]",
    normalShadowSepia: "shadow-sm hover:shadow-md hover:shadow-[rgba(59, 130, 246,0.1)]"
  },
  "AI 輔助工作流": {
    accent: "yellow-500",
    rgbaGlow: "234, 179, 8",
    borderClass: "group-hover:border-yellow-500/30",
    glowClass: "group-hover:shadow-yellow-500/15",
    gradientClass: "from-yellow-500/30 via-yellow-500/90 to-yellow-500/20",
    bgClass: "bg-yellow-500",
    pulseBorderClass: "border-yellow-500/10",
    textClass: "text-yellow-500",
    highlightBorderClass: "border-[2px] border-yellow-500/35 hover:border-yellow-400",
    normalBorderHoverClass: "hover:border-yellow-500/40 hover:shadow-yellow-500/5",
    titleHoverTextClass: "group-hover:text-yellow-400 gap-1.5",
    badgeBorderHoverClass: "group-hover:border-yellow-500/40",
    darkBgClass: "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30",
    highlightBgDark: "bg-yellow-500/5 hover:bg-yellow-500/10",
    highlightBorderDark: "border-yellow-500/20 hover:border-yellow-500/40",
    highlightShadowDark: "shadow-[unset] hover:shadow-[0_8px_30px_rgba(234, 179, 8,0.2)]",
    highlightBgLight: "bg-yellow-50 hover:bg-yellow-100",
    highlightBorderLight: "border-yellow-200 hover:border-yellow-400",
    highlightShadowLight: "shadow-lg shadow-yellow-500/10 hover:shadow-xl hover:shadow-yellow-500/20",
    highlightBgSepia: "bg-[rgba(234, 179, 8,0.05)] hover:bg-[rgba(234, 179, 8,0.1)]",
    highlightBorderSepia: "border-[rgba(234, 179, 8,0.2)] hover:border-[rgba(234, 179, 8,0.4)]",
    highlightShadowSepia: "shadow-lg shadow-[rgba(234, 179, 8,0.05)] hover:shadow-xl hover:shadow-[rgba(234, 179, 8,0.15)]",
    normalBgDark: "bg-[unset] hover:bg-zinc-800/80",
    normalBorderDark: "border-white/5 hover:border-yellow-500/30",
    normalShadowDark: "shadow-[unset] hover:shadow-[0_4px_20px_rgba(234, 179, 8,0.1)]",
    normalBgLight: "bg-white/60 hover:bg-white",
    normalBorderLight: "border-zinc-200/50 hover:border-yellow-300",
    normalShadowLight: "shadow-sm hover:shadow-md hover:shadow-yellow-500/10",
    normalBgSepia: "bg-[#FDFBF7]/60 hover:bg-[#FDFBF7]",
    normalBorderSepia: "border-[#E8DFCE]/50 hover:border-[rgba(234, 179, 8,0.3)]",
    normalShadowSepia: "shadow-sm hover:shadow-md hover:shadow-[rgba(234, 179, 8,0.1)]"
  },
  "禮贈品專屬規劃": {
    accent: "amber-500",
    rgbaGlow: "245, 158, 11",
    borderClass: "group-hover:border-amber-500/30",
    glowClass: "group-hover:shadow-amber-500/15",
    gradientClass: "from-amber-500/30 via-amber-500/90 to-amber-500/20",
    bgClass: "bg-amber-500",
    pulseBorderClass: "border-amber-500/10",
    textClass: "text-amber-500",
    highlightBorderClass: "border-[2px] border-amber-500/35 hover:border-amber-400",
    normalBorderHoverClass: "hover:border-amber-500/40 hover:shadow-amber-500/5",
    titleHoverTextClass: "group-hover:text-amber-400 gap-1.5",
    badgeBorderHoverClass: "group-hover:border-amber-500/40",
    darkBgClass: "bg-amber-500/20 text-amber-400 border border-amber-500/30",
    highlightBgDark: "bg-amber-500/5 hover:bg-amber-500/10",
    highlightBorderDark: "border-amber-500/20 hover:border-amber-500/40",
    highlightShadowDark: "shadow-[unset] hover:shadow-[0_8px_30px_rgba(245, 158, 11,0.2)]",
    highlightBgLight: "bg-amber-50 hover:bg-amber-100",
    highlightBorderLight: "border-amber-200 hover:border-amber-400",
    highlightShadowLight: "shadow-lg shadow-amber-500/10 hover:shadow-xl hover:shadow-amber-500/20",
    highlightBgSepia: "bg-[rgba(245, 158, 11,0.05)] hover:bg-[rgba(245, 158, 11,0.1)]",
    highlightBorderSepia: "border-[rgba(245, 158, 11,0.2)] hover:border-[rgba(245, 158, 11,0.4)]",
    highlightShadowSepia: "shadow-lg shadow-[rgba(245, 158, 11,0.05)] hover:shadow-xl hover:shadow-[rgba(245, 158, 11,0.15)]",
    normalBgDark: "bg-[unset] hover:bg-zinc-800/80",
    normalBorderDark: "border-white/5 hover:border-amber-500/30",
    normalShadowDark: "shadow-[unset] hover:shadow-[0_4px_20px_rgba(245, 158, 11,0.1)]",
    normalBgLight: "bg-white/60 hover:bg-white",
    normalBorderLight: "border-zinc-200/50 hover:border-amber-300",
    normalShadowLight: "shadow-sm hover:shadow-md hover:shadow-amber-500/10",
    normalBgSepia: "bg-[#FDFBF7]/60 hover:bg-[#FDFBF7]",
    normalBorderSepia: "border-[#E8DFCE]/50 hover:border-[rgba(245, 158, 11,0.3)]",
    normalShadowSepia: "shadow-sm hover:shadow-md hover:shadow-[rgba(245, 158, 11,0.1)]"
  }
};

const defaultCategoryColor = {
  accent: "amber-500",
  rgbaGlow: "245, 158, 11",
  borderClass: "group-hover:border-amber-500/30",
  glowClass: "group-hover:shadow-amber-500/15",
  gradientClass: "from-amber-500/30 via-amber-500/90 to-amber-500/20",
  bgClass: "bg-amber-500",
  pulseBorderClass: "border-amber-500/10",
  textClass: "text-amber-500",
  highlightBorderClass: "border-[2px] border-amber-500/35 hover:border-amber-400",
  normalBorderHoverClass: "hover:border-amber-500/35",
  titleHoverTextClass: "group-hover:text-amber-400",
  badgeBorderHoverClass: "group-hover:border-amber-500/30",
  darkBgClass: "from-[#16120b] to-[#0a0a0a]",
  
  highlightBgDark: "bg-gradient-to-b from-[#16120b] to-[#0a0a0a]",
  highlightBorderDark: "border-[2px] border-amber-500/35 hover:border-amber-400",
  highlightShadowDark: "0 8px 16px -6px rgba(0,0,0,0.3), 0 0 15px 1px rgba(245, 158, 11, 0.12)",
  highlightBgLight: "bg-gradient-to-b from-[#FFFDF0] via-[#FFF9DF] to-[#FFFBF0]",
  highlightBorderLight: "border-[2.5px] border-amber-500 hover:border-amber-600",
  highlightShadowLight: "0 12px 24px -8px rgba(215,108,0,0.15)",
  highlightBgSepia: "bg-gradient-to-b from-[#FFF5DC] via-[#FAF4E5] to-[#FAF4E5]",
  highlightBorderSepia: "border-[2.5px] border-amber-500 hover:border-amber-650",
  highlightShadowSepia: "0 12px 24px -8px rgba(217,119,6,0.18)",
  
  normalBgDark: "bg-[#0E0E0E]",
  normalBorderDark: "border border-white/5 hover:border-amber-500/35",
  normalShadowDark: "0 10px 20px -10px rgba(0,0,0,0.25)",
  normalBgLight: "bg-white",
  normalBorderLight: "border border-zinc-200 hover:border-amber-500/25",
  normalShadowLight: "0 4px 6px -1px rgba(0,0,0,0.05)",
  normalBgSepia: "bg-[#FAF4E5]",
  normalBorderSepia: "border border-[#EADECC]/70 hover:border-amber-600/30",
  normalShadowSepia: "0 4px 6px -1px rgba(67,52,34,0.05)"
};

function getCategoryColor(category?: string) {
  if (!category) return defaultCategoryColor;
  return categoryColors[category] || defaultCategoryColor;
}

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
      <span className="relative z-10 flex items-center gap-1.5">
        {isActive && (
          <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${isSepia ? "bg-[#2B1B0C]" : isLight ? "bg-white" : "bg-black"}`} />
        )}
        {!isActive && isHovered && (
          <span 
            className="w-1 h-1 rounded-full shrink-0"
            style={{ backgroundColor: `rgba(${catColor.rgbaGlow}, ${isSepia ? 0.8 : isLight ? 0.9 : 1})` }}
          />
        )}
        {cat === "All" ? "全部精選展示" : cat}
      </span>
    </button>
  );
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
  lazy?: boolean;
  zoomable?: boolean;
  priority?: boolean;
  theme?: "dark" | "light" | "sepia";
}

function ImageWithFallback({ 
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
  theme = "dark"
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
    // Triggers image loading only when scrolling within 500px of viewport
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
        rootMargin: "500px",
        threshold: 0.01,
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [lazy, priority, src]);

  React.useEffect(() => {
    if (isInView) {
      setCurrentSrc(resolveImageUrl(src, optimizeSize));
      setFallbackAttempt(0);
      setFailedCount(0);
      setIsLoaded(false);
    }
  }, [src, optimizeSize, isInView]);

  // HEAD check request verification for instant fallback selection on mount or src change
  React.useEffect(() => {
    if (!isInView || !src) return;
    const resolved = resolveImageUrl(src, optimizeSize);
    if (!resolved || resolved.startsWith("data:") || resolved.includes("localhost")) return;

    let active = true;
    const checkUrlWithHead = async () => {
      try {
        const response = await fetch(resolved, { method: "HEAD" });
        if (active && response.status !== 200) {
          console.warn(`[HEAD check non-200] ${response.status} for ${resolved}. Skipping normal loading flow.`);
          setPlaceholderFallback(1);
          setFallbackAttempt(1);
        }
      } catch (err) {
        // Safe standard CORS handling
        console.log("[HEAD check CORS / TypeError ignored]", err);
      }
    };
    checkUrlWithHead();
    return () => {
      active = false;
    };
  }, [src, optimizeSize, isInView]);

  const handleYoutubeFallback = (img: HTMLImageElement) => {
    const isYoutube = img.src.includes("youtube.com") || img.src.includes("img.youtube.com") || img.src.includes("ytimg.com");
    if (isYoutube && img.naturalWidth > 0 && img.naturalWidth <= 120) {
      if (fallbackAttempt === 0 && img.src.includes("maxresdefault.jpg")) {
        const hqUrl = img.src.replace("maxresdefault.jpg", "hqdefault.jpg");
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
          setCurrentSrc(nextUrl);
          setFallbackAttempt(fallbackAttempt + 1);
          setIsLoaded(false);
          return true;
        } else {
          setCurrentSrc("https://picsum.photos/seed/" + encodeURIComponent(alt) + "/600/450");
          setFallbackAttempt(3);
          setIsLoaded(false);
          return true;
        }
      }
    }
    return false;
  };

  const handleLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    const fellBack = handleYoutubeFallback(img);
    if (!fellBack) {
      setIsLoaded(true);
    }
  };

  // Robust, race-condition-free cache and completion observer.
  // We do NOT use any "else { setIsLoaded(false) }" branch here, as that can lead to stuck load states during re-renders.
  React.useEffect(() => {
    if (!isInView || !currentSrc) return;
    const img = imgRef.current;
    if (img && img.complete && img.naturalWidth > 0) {
      const fellBack = handleYoutubeFallback(img);
      if (!fellBack) {
        setIsLoaded(true);
      }
    }
  }, [currentSrc, fallbackAttempt, isInView]);

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
    // Elegant fallback Unsplash placeholders or beautiful representation matching the category
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

    console.log("[ImageWithFallback Error] Failed to load image:", {
      originalSrc: src,
      currentSrc: currentSrc,
      fallbackAttempt: fallbackAttempt,
      failedCount: nextFailed,
      alt: alt,
      categoryName: categoryName,
      titleText: titleText,
      loadedState: "error"
    });

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

  return (
    <div 
      ref={containerRef} 
      onMouseMove={handleMouseMove}
      onClick={handleZoomClick}
      onMouseLeave={handleMouseLeave}
      className={`relative w-full h-full flex items-center justify-center overflow-hidden bg-neutral-950/20 select-none ${
        zoomable ? "cursor-zoom-in" : ""
      }`}
    >
      {/* 簡單、高性能的純色佔位塊，無任何複雜 DOM、漸變或動畫，徹底消除滾動卡頓 */}
      {!isLoaded && fallbackAttempt < 4 && (
        <div className={`absolute inset-0 z-10 ${skeletonBg}`} />
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
          style={{
            // Set zoom-related transforms and cursor
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
            // Put the transitions inside inline styles to bypass Tailwind class definition collisions!
            // This guarantees that the transition always runs with a premium duration and easing.
            transition: zoomable && isZoomed
              ? "transform 0.15s ease-out, transform-origin 0.05s ease-out, opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), filter 0.8s cubic-bezier(0.16, 1, 0.3, 1)"
              : zoomable
              ? "transform 0.25s ease-in-out, opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), filter 0.8s cubic-bezier(0.16, 1, 0.3, 1)"
              : "transform 0.8s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), filter 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
          className={`${className} ${
            isLoaded 
              ? "opacity-100 scale-100 blur-0" 
              : "opacity-0 scale-[1.03] blur-xl"
          }`}
          referrerPolicy={referrerPolicy}
          loading={priority ? "eager" : "lazy"}
          {...(priority ? { fetchPriority: "high" } : {})}
        />
      )}
    </div>
  );
}

interface MagneticButtonProps {
  id?: string;
  onClick?: () => void;
  className?: string;
  title?: string;
  children: React.ReactNode;
  type?: "button" | "submit" | "reset";
  initial?: any;
  animate?: any;
  exit?: any;
}

const MagneticButton: React.FC<MagneticButtonProps> = ({
  id,
  onClick,
  className,
  title,
  children,
  type = "button",
  initial,
  animate,
  exit
}) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 180, damping: 15 });
  const springY = useSpring(y, { stiffness: 180, damping: 15 });

  const handlePointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const dx = e.clientX - centerX;
    const dy = e.clientY - centerY;
    
    const maxOffset = 8;
    const distance = Math.hypot(dx, dy);
    if (distance === 0) return;
    
    // 計算阻尼吸引力，當指標靠近時能有一股吸向指標的活力效應
    const strength = 0.22;
    const targetX = Math.max(-maxOffset, Math.min(maxOffset, dx * strength));
    const targetY = Math.max(-maxOffset, Math.min(maxOffset, dy * strength));
    
    x.set(targetX);
    y.set(targetY);
  };

  const handlePointerLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.button
      id={id}
      type={type}
      onClick={onClick}
      className={className}
      title={title}
      initial={initial}
      animate={animate}
      exit={exit}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={{ x: springX, y: springY, willChange: "transform" }}
    >
      {children}
    </motion.button>
  );
};

interface InteractiveMascotProps {
  currentMascot: {
    name: string;
    role: string;
    imageDriveId: string;
    glowColor: string;
    dialogues: string[];
    idles: string[];
  };
  theme: "dark" | "light" | "sepia";
  activeModalItem: any;
  isWorkflowOpen: boolean;
  isContactCardOpen: boolean;
}

const InteractiveMascot = React.memo(function InteractiveMascot({
  currentMascot,
  theme,
  activeModalItem,
  isWorkflowOpen,
  isContactCardOpen
}: InteractiveMascotProps) {
  const [mascotDialogue, setMascotDialogue] = useState<string>("");
  const [showMascotDialogue, setShowMascotDialogue] = useState<boolean>(false);
  const [isTouched, setIsTouched] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [isImageLoaded, setIsImageLoaded] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  
  // 雙指縮放狀態
  const [mascotScale, setMascotScale] = useState<number>(1);
  const initialDistanceRef = React.useRef<number | null>(null);
  const currentScaleRef = React.useRef<number>(1);
  
  const dragControls = useDragControls();

  // 建立滑鼠/指標跟蹤角度邏輯及其平滑彈性曲線 (Motion values)
  const containerRef = React.useRef<HTMLDivElement>(null);
  const rotateValue = useMotionValue(-5);
  const smoothRotate = useSpring(rotateValue, { damping: 25, stiffness: 180 });

  // 監聽全球 pointermove 計算與吉祥物的相對角度，達成靈活動態跟隨效果
  React.useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (!isImageLoaded || !containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const dx = e.clientX - centerX;
      const dy = e.clientY - centerY;
      const distance = Math.hypot(dx, dy);
      const triggerDistance = 250; // 觸發距離設定為 250px
      
      if (distance < triggerDistance) {
        // 指向性夾角計算
        const angleRad = Math.atan2(dy, dx);
        const angleDeg = angleRad * (180 / Math.PI);
        
        // 吉祥物頭部朝上為基準 (-90)，所以加 90 以使插畫指向指標
        let targetRotate = angleDeg + 90;
        
        // 限制傾斜角度範圍在 [-15, 15] 之間，既生動又不易與對話框重疊遮擋
        targetRotate = Math.max(-15, Math.min(15, targetRotate));
        
        // 基於接近程度進行平滑漸變 (從接觸邊緣 250px 的 0 到重心的 1)
        const t = (triggerDistance - distance) / triggerDistance;
        const interpolatedRotate = -5 + (targetRotate - (-5)) * t;
        
        rotateValue.set(interpolatedRotate);
      } else {
        // 距離超過 250px 時，平滑回復預設 -5 度偏斜
        rotateValue.set(-5);
      }
    };

    const handlePointerLeave = () => {
      // 滑鼠移出視窗或離開時，平滑回復預設 -5 度偏斜
      rotateValue.set(-5);
    };

    window.addEventListener("pointermove", handlePointerMove);
    document.addEventListener("pointerleave", handlePointerLeave);
    
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, [isImageLoaded, rotateValue]);

  // 當常駐代言吉祥物改變時，自動重置並介紹
  React.useEffect(() => {
    setIsImageLoaded(false);
    if (currentMascot && currentMascot.dialogues.length > 0) {
      setMascotDialogue(currentMascot.dialogues[0]);
      setShowMascotDialogue(false);
      setIsVisible(true);
    }
  }, [currentMascot]);

  // 當圖片載入完成時，顯示吉祥物對話框
  React.useEffect(() => {
    // 確保留有一點彈出緩衝時間，不至於卡頓
    let timer: NodeJS.Timeout;
    if (isImageLoaded) {
      timer = setTimeout(() => setShowMascotDialogue(true), 250);
    }
    return () => clearTimeout(timer);
  }, [isImageLoaded]);

  // 點擊吉祥物時隨機切換台詞 (且不影響 App.tsx 渲染)
  const handleNextMascot = () => {
    if (currentMascot && currentMascot.dialogues.length > 0) {
      const candidates = currentMascot.dialogues.filter(item => item !== mascotDialogue);
      const chosen = candidates.length > 0
        ? candidates[Math.floor(Math.random() * candidates.length)]
        : currentMascot.dialogues[0];
      setMascotDialogue(chosen);
      setShowMascotDialogue(true);
    }
  };

  // 7.5 秒自動播放常駐吉祥物的閒聊 (採元件內部定時，0% 全局 App re-render 開銷)
  React.useEffect(() => {
    const interval = setInterval(() => {
      if (currentMascot && currentMascot.idles.length > 0) {
        const randomIdle = currentMascot.idles[Math.floor(Math.random() * currentMascot.idles.length)];
        setMascotDialogue(randomIdle);
      }
    }, 7500);

    return () => clearInterval(interval);
  }, [currentMascot, mascotDialogue]);

  // 手機震動反饋與極速觸摸響應 & 雙指縮放
  const handleTouchStart = (e: React.TouchEvent<HTMLButtonElement | HTMLDivElement>) => {
    if (e.touches && e.touches.length === 2) {
      // 雙指觸控開始
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const dist = Math.hypot(touch1.clientX - touch2.clientX, touch1.clientY - touch2.clientY);
      initialDistanceRef.current = dist;
      currentScaleRef.current = mascotScale;
    } else if (e.touches && e.touches.length === 1) {
      setIsTouched(true);
      if (typeof window !== "undefined" && window.navigator && window.navigator.vibrate) {
        try {
          window.navigator.vibrate(15);
        } catch (err) {
          // Safe catch for iframe / permission constraints
        }
      }
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLButtonElement | HTMLDivElement>) => {
    // 檢查是否有進行拖曳 (framermotion drag 會有些攔截，但如果是 2 指，則嘗試計算縮放)
    if (e.touches && e.touches.length === 2 && initialDistanceRef.current !== null) {
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const dist = Math.hypot(touch1.clientX - touch2.clientX, touch1.clientY - touch2.clientY);
      const ratio = dist / initialDistanceRef.current;
      const newScale = Math.min(Math.max(currentScaleRef.current * ratio, 0.5), 2.5); // 限制縮放範圍在 0.5 到 2.5 倍
      setMascotScale(newScale);
    }
  };

  const handleTouchEnd = () => {
    setIsTouched(false);
    initialDistanceRef.current = null;
  };

  return (
    <AnimatePresence>
      {isVisible && !activeModalItem && !isWorkflowOpen && !isContactCardOpen && (
        <motion.div
          ref={containerRef}
          initial={{ y: "100%", opacity: 0, rotate: 15, scale: 0.5 }}
          animate={isImageLoaded ? { y: 0, opacity: 1, rotate: -5, scale: mascotScale } : { y: "100%", opacity: 0, rotate: 15, scale: 0.5 }}
          exit={{ y: "150%", opacity: 0, rotate: 20, scale: 0.5 }}
          transition={{ type: "spring", bounce: 0.6, duration: 0.8, delay: 0.1 }}
          className="fixed bottom-0 -right-2 md:right-12 z-[45] pointer-events-none origin-bottom flex flex-col items-center drop-shadow-2xl w-[150px] sm:w-[200px] md:w-[250px]"
          style={{ backfaceVisibility: "hidden", willChange: "transform, opacity" }}
          drag
          dragControls={dragControls}
          dragListener={false}
          dragMomentum={false}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={handleTouchEnd}
        >
          {/* 自定義組件自密閉 CSS 動態效果：包含對話框微幅上下飄移 & 優雅氣泡指向動畫 */}
          <style dangerouslySetInnerHTML={{ __html: `
            @keyframes mascotBubbleFloat {
              0%, 100% { transform: translateY(0px) rotate(0deg); }
              50% { transform: translateY(-5px) rotate(-0.5deg); }
            }
            .animate-mascot-bubble-float {
              animation: mascotBubbleFloat 4.5s ease-in-out infinite;
            }
          `}} />

          {/* 互動對話氣泡 */}
          <AnimatePresence>
            {showMascotDialogue && (
              <motion.div
                initial={{ scale: 0, opacity: 0, y: 10 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0, opacity: 0, y: 10 }}
                transition={{ type: "spring", bounce: 0.4, duration: 0.4 }}
                onClick={handleNextMascot}
                onPointerDown={(e) => dragControls.start(e)}
                className={`${
                  theme === "light"
                    ? "bg-white/95 border-amber-500/50 shadow-[0_4px_25px_rgba(245,158,11,0.2)]"
                    : theme === "sepia"
                    ? "bg-[#FCF8EE]/95 border-amber-600/40 shadow-[0_4px_25px_rgba(180,83,9,0.2)]"
                    : "bg-black/95 border-amber-500/40 shadow-[0_0_20px_rgba(245,158,11,0.25)]"
                } backdrop-blur-sm border p-3 pt-3.5 rounded-2xl mb-2.5 relative flex flex-col items-center justify-center pointer-events-auto max-w-[145px] sm:max-w-[190px] md:max-w-[240px] overflow-hidden cursor-pointer transition-colors group animate-mascot-bubble-float`}
                style={{ willChange: "transform, opacity, scale", touchAction: "none" }}
                title="點擊對話，長按可自由拖曳！🐾"
              >
                {/* 關閉對話框的 X 按鈕 */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowMascotDialogue(false);
                    setIsVisible(false);
                  }}
                  className={`absolute top-0 right-0 z-10 p-2 rounded-full transition-colors cursor-pointer ${
                    theme === "light"
                      ? "text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100"
                      : theme === "sepia"
                      ? "text-[#433422]/60 hover:text-[#433422] hover:bg-[#E2D5B9]"
                      : "text-zinc-400 hover:text-white hover:bg-white/10"
                  }`}
                  aria-label="Close dialogue"
                  title="關閉對話框"
                >
                  <svg className="w-[17px] h-[17px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                <div className={`${
                  theme === "light"
                    ? "text-zinc-850 font-semibold group-hover:text-amber-600"
                    : theme === "sepia"
                    ? "text-[#433422]/60 font-bold group-hover:text-[#B45309]"
                    : "text-zinc-100 group-hover:text-amber-200"
                } text-[10px] sm:text-[11.5px] text-center leading-relaxed font-sans px-1 select-none whitespace-normal break-words transition-colors min-h-[30px] sm:min-h-[34px] flex flex-col items-center justify-center`}>
                  {/* 顯示角色名字與職位 */}
                  <span className={`text-[8.5px] sm:text-[9.5px] tracking-wider opacity-75 mb-1 font-bold font-sans px-1.5 py-0.5 rounded-full ${
                    theme === "light" 
                      ? "bg-zinc-100 text-zinc-650" 
                      : theme === "sepia" 
                      ? "bg-[#EDE2CA] text-[#433422]" 
                      : "bg-white/10 text-zinc-300"
                  }`}>
                    {currentMascot.name} • {currentMascot.role}
                  </span>
                  
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={mascotDialogue}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.18, ease: "easeInOut" }}
                      className="block leading-relaxed"
                    >
                      {mascotDialogue}
                    </motion.span>
                  </AnimatePresence>
                </div>
                <div className={`absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 border-r border-b rotate-45 ${
                  theme === "light"
                    ? "bg-white border-amber-500/50"
                    : theme === "sepia"
                    ? "bg-[#FCF8EE] border-amber-600/40"
                    : "bg-black/95 border-amber-500/40"
                }`} />
              </motion.div>
            )}
          </AnimatePresence>
          
          <motion.button
            onClick={handleNextMascot}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onTouchCancel={handleTouchEnd}
            onPointerDown={(e) => dragControls.start(e)}
            type="button"
            whileHover={{ 
              scale: 1.05,
              transition: { duration: 0.2 }
            }}
            whileTap={{ scale: 0.95 }}
            animate={{
              y: [0, -6, 0],
              scale: isTouched ? 0.95 : 1
            }}
            transition={{
              y: {
                repeat: Infinity,
                duration: 3,
                ease: "easeInOut"
              },
              scale: {
                duration: 0.12,
                ease: "easeOut"
              }
            }}
            className="relative w-23 md:w-28 lg:w-32 pointer-events-auto cursor-pointer group focus:outline-none"
            title={`點我跟 ${currentMascot.name} 互動！(長按可拖曳)`}
            style={{ willChange: "transform", touchAction: "none", rotate: smoothRotate }}
          >
            {/* 動態背景彩色發光暈圈 */}
            <div 
              className={`absolute inset-4 -z-10 rounded-full blur-[40px] opacity-[0.06] group-hover:opacity-100 group-hover:scale-125 transition-all duration-700 ease-out bg-gradient-to-tr ${
                currentMascot.glowColor
              } pointer-events-none`}
              style={{ willChange: "transform, opacity" }}
            />
            
            <AnimatePresence mode="wait">
              <motion.img 
                key={currentMascot.imageDriveId}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                src={`https://drive.google.com/thumbnail?sz=w800&id=${currentMascot.imageDriveId}`} 
                alt={currentMascot.name} 
                draggable={false}
                className="w-full h-auto object-contain filter drop-shadow-[0_15px_25px_rgba(0,0,0,0.85)] brightness-110 group-hover:brightness-125 transition-all duration-300 pointer-events-none select-none"
                onLoad={() => setIsImageLoaded(true)}
                onError={(e) => {
                  setIsImageLoaded(true); // 失敗也照常觸發顯示對話框
                  e.currentTarget.src = "https://drive.google.com/thumbnail?sz=w800&id=16RO9RvE_GrYhKKb_umrUJ8oFpmig40CI";
                }}
              />
            </AnimatePresence>

            {/* 收納狀態提示小紅點 (呼吸燈效果) */}
            <AnimatePresence>
              {!showMascotDialogue && isImageLoaded && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  className="absolute -top-1 right-2 w-3.5 h-3.5 bg-red-500 rounded-full border-2 border-white/20 shadow-[0_0_10px_rgba(239,68,68,0.8)] z-10"
                >
                  <div className="absolute inset-0 rounded-full animate-ping bg-red-400 opacity-75" />
                </motion.div>
              )}
            </AnimatePresence>

            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-black/75 border border-white/10 text-[9px] text-zinc-300 px-2 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap shadow-lg">
              💬 點擊跟我對話吧！({currentMascot.name})
            </div>
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

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

const PortfolioCard = React.memo(function PortfolioCard({ 
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
  const cardInnerRef = React.useRef<HTMLDivElement>(null);
  const glareRef = React.useRef<HTMLDivElement>(null);

  const isSepia = theme === "sepia";
  const isLight = theme === "light";

  const defaultShadow = item.isHighlight 
    ? (isSepia ? "0 10px 20px -8px rgba(115, 76, 34, 0.22)" : isLight ? "0 10px 20px -8px rgba(217, 119, 6, 0.15)" : catColor.highlightShadowDark)
    : (isSepia ? catColor.normalShadowSepia : isLight ? catColor.normalShadowLight : catColor.normalShadowDark);

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
        rootMargin: "380px 0px 380px 0px", // Preload items near the viewport
        threshold: 0.01,
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

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (inertiaFrameRef.current) {
      cancelAnimationFrame(inertiaFrameRef.current);
      inertiaFrameRef.current = null;
    }
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
    setIsPressed(true);
    setIsHovered(true);

    if (cardInnerRef.current) {
      // 輕量化按壓反饋，不啟用複雜的旋轉與漸變，確保滑動極致流暢
      cardInnerRef.current.style.transform = "scale3d(0.97, 0.97, 1)";
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!touchStartRef.current) return;
    const touch = e.touches[0];
    const diffX = Math.abs(touch.clientX - touchStartRef.current.x);
    const diffY = Math.abs(touch.clientY - touchStartRef.current.y);

    // 當偵測到用戶正在進行頁面滾動（位移大於 6 pixel），立即釋放卡片焦點與縮小反饋，完整交回給瀏覽器原生滚动
    if (diffX > 6 || diffY > 6) {
      touchStartRef.current = null;
      setIsPressed(false);
      setIsHovered(false);
      if (cardInnerRef.current) {
        cardInnerRef.current.style.transform = "scale3d(1, 1, 1)";
        cardInnerRef.current.style.boxShadow = defaultShadow;
      }
      if (glareRef.current) {
        glareRef.current.style.opacity = "0";
      }
    }
  };

  const handleTouchEnd = () => {
    touchStartRef.current = null;
    setIsPressed(false);
    setIsHovered(false);
    if (cardInnerRef.current) {
      cardInnerRef.current.style.transform = "scale3d(1, 1, 1)";
      cardInnerRef.current.style.boxShadow = defaultShadow;
    }
    if (glareRef.current) {
      glareRef.current.style.opacity = "0";
    }
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

    if (cardInnerRef.current) {
      cardInnerRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(${isPressed ? 0.955 : 1.025}, ${isPressed ? 0.955 : 1.025}, 1)`;
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
    if (cardInnerRef.current) {
      cardInnerRef.current.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
      cardInnerRef.current.style.boxShadow = defaultShadow;
    }
    if (glareRef.current) {
      glareRef.current.style.opacity = "0";
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
      className="h-full snap-center scroll-mt-24"
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
        onClick={onClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onMouseDown={() => {
          setIsPressed(true);
          if (cardInnerRef.current) {
            cardInnerRef.current.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(0.955, 0.955, 1)";
          }
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
          transition: isHovered || isPressed 
            ? "transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.4s ease, border-color 0.4s ease, background-color 0.4s ease" 
            : "transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1)",
          boxShadow: defaultShadow,
        }}
        className={`group relative flex flex-col rounded-2xl overflow-hidden cursor-pointer h-full transition-[background-color,border-color,color] duration-500 ${
          isSepia
            ? item.isHighlight
              ? "bg-[#FCF5E3] bg-gradient-to-b from-[#FCF5E3] to-[#EDE2CA] border-[2.5px] border-amber-600 hover:border-amber-700 shadow-md shadow-amber-900/10"
              : `${catColor.normalBgSepia} ${catColor.normalBorderSepia}`
            : isLight
            ? item.isHighlight
              ? "bg-[#FCF8EE] bg-gradient-to-b from-[#FCF8EE] via-[#FCF8EE] to-[#FAF4E5] border-[2.5px] border-amber-500 hover:border-amber-600 shadow-sm shadow-amber-500/10"
              : `${catColor.normalBgLight} ${catColor.normalBorderLight}`
            : item.isHighlight
            ? `${catColor.highlightBgDark} ${catColor.highlightBorderDark}`
            : `${catColor.normalBgDark} ${catColor.normalBorderDark}`
        }`}
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
            optimizeSize={600}
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

          {/* hover 視覺遮罩提示 - 採用 react isHovered 狀態控制，免除 3D rotate 後 CSS 邊界滯留 bug */}
          <div className={`absolute inset-0 transition-opacity duration-300 flex flex-col items-center justify-center ${
            isHovered ? "opacity-100" : "opacity-0 pointer-events-none"
          } ${
            isSepia ? "bg-[#FAF4E5]/90 backdrop-blur-[3px]" : isLight ? "bg-white/90 backdrop-blur-[3px]" : "bg-black/70 backdrop-blur-sm"
          }`}>
            {!showAllDetails && (
              <div className={`px-4 text-center transform transition-all duration-300 z-10 ${isHovered ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}>
                <p className={`text-[10px] sm:text-xs font-mono tracking-widest mb-2 uppercase drop-shadow-sm ${
                  isSepia ? "text-[#734C22]/90 font-bold" : isLight ? "text-amber-700 font-bold" : "text-[#FFF9DF]/80 drop-shadow-md"
                }`}>
                  {item.titleEn}
                </p>
                <h3 className={`text-xl sm:text-2xl font-display font-medium mb-4 tracking-wide ${
                  isSepia ? "text-[#2B1B0C] drop-shadow-sm font-bold" : isLight ? "text-zinc-900 drop-shadow-sm font-bold" : "text-white drop-shadow-lg"
                }`}>
                  {item.title}
                </h3>
              </div>
            )}
            <span className={`text-[11px] font-sans font-semibold tracking-wider text-black ${catColor.bgClass} px-3.5 py-1.5 rounded-lg shadow-lg transform transition-all duration-300 uppercase flex items-center gap-1.5 ${
              isHovered ? "translate-y-0" : "translate-y-2"
            }`} style={{ transform: "translateZ(15px)" }}>
              <span>觀看精彩設計細節</span>
              <ArrowUpRight className="h-3 w-3 shrink-0 stroke-[2.5]" />
            </span>
          </div>
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
  const fileIdRegex = /\/file\/d\/([a-zA-Z0-9_-]{28,45})/g;
  const ids: string[] = [];
  let match;
  while ((match = fileIdRegex.exec(html)) !== null) {
    if (match[1] && !ids.includes(match[1])) {
      if (match[1] !== folderId && match[1].length >= 28) {
        ids.push(match[1]);
      }
    }
  }
  return ids.map(id => `https://drive.google.com/thumbnail?sz=w1000&id=${id}`);
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
  
  React.useEffect(() => {
    import("./data").then(module => {
      const initialItems = module.initialPortfolioData;
      initialDataRef.current = initialItems;
      setItems(initialItems);

      // Dynamically load images from Google Drive folders for cloud-based items
      initialItems.forEach(item => {
        if (item.driveFolderId) {
          fetchFolderImages(item.driveFolderId).then(images => {
            if (images && images.length > 0) {
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
          }).catch(err => {
            console.error(`Failed to dynamically fetch images for folder ${item.driveFolderId}:`, err);
          });
        }
      });
    });
  }, []);

  const [isRandomMode, setIsRandomMode] = useState<boolean>(false);
  const [showAllDetails, setShowAllDetails] = useState<boolean>(false);

  const handleShuffle = () => {
    const shuffled = [...items];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = shuffled[i];
      shuffled[i] = shuffled[j];
      shuffled[j] = temp;
    }
    setItems(shuffled);
    setIsRandomMode(true);
  };

  const handleResetOrder = () => {
    setItems(initialDataRef.current);
    setIsRandomMode(false);
  };

  // Theme state: "dark" | "light" | "sepia" (stores user preference in localStorage)
  const [theme, setTheme] = useState<"dark" | "light" | "sepia">(() => {
    try {
      const saved = localStorage.getItem("capelee_theme");
      return (saved === "light" || saved === "dark" || saved === "sepia") ? saved : "dark";
    } catch {
      return "dark";
    }
  });

  const deferredTheme = React.useDeferredValue(theme);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : theme === "light" ? "sepia" : "dark";
    setTheme(nextTheme);
    try {
      localStorage.setItem("capelee_theme", nextTheme);
    } catch (e) {
      console.error(e);
    }
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

  // Automatically reset visibleCount when category, search query, or order is changed to improve rendering load
  React.useEffect(() => {
    setVisibleCount(12);
    setPrevVisibleCount(0);
  }, [selectedCategory, searchQuery, isRandomMode]);

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
  const loaderRef = React.useRef<HTMLDivElement | null>(null);

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

  // Scroll to top and navbar transition support
  const [showScrollTop, setShowScrollTop] = useState<boolean>(false);
  const [showHeader, setShowHeader] = useState<boolean>(true);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  
  const categoriesRef = React.useRef<HTMLDivElement>(null);
  const [showCategoriesLeftMask, setShowCategoriesLeftMask] = useState<boolean>(false);
  const [showCategoriesRightMask, setShowCategoriesRightMask] = useState<boolean>(false);

  const checkCategoriesScroll = React.useCallback(() => {
    if (categoriesRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = categoriesRef.current;
      setShowCategoriesLeftMask(scrollLeft > 0);
      setShowCategoriesRightMask(Math.ceil(scrollLeft + clientWidth) < scrollWidth - 1);
    }
  }, []);

  React.useEffect(() => {
    checkCategoriesScroll();
    window.addEventListener('resize', checkCategoriesScroll);
    return () => window.removeEventListener('resize', checkCategoriesScroll);
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
          setIsScrolled((prev) => {
            if (prev !== scrolled) {
              return scrolled;
            }
            return prev;
          });

          setShowScrollTop((prev) => {
            const next = currentScrollY > 300;
            return prev !== next ? next : prev;
          });

          // Show/Hide top navbar
          setShowHeader((prev) => {
            if (currentScrollY < 10) {
              return true;
            } else if (currentScrollY > lastY + 5) {
              return false; // scrolling down
            } else if (currentScrollY < lastY - 5) {
              return true; // scrolling up
            }
            return prev;
          });

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
    ? "p-1.5 sm:p-2 rounded-lg border flex items-center justify-center transition-all duration-300 transform active:scale-95 shadow-sm bg-[#EDE2CA]/95 hover:bg-[#E2D5B9] border-[#DFCFA0]/80 hover:border-amber-600/40 text-[#4F3C28] hover:text-[#2B1B0C] shrink-0 cursor-pointer"
    : theme === "light"
    ? "p-1.5 sm:p-2 rounded-lg border flex items-center justify-center transition-all duration-300 transform active:scale-95 shadow-sm bg-zinc-100 hover:bg-zinc-200/80 border-zinc-200/80 hover:border-amber-500/30 text-zinc-750 hover:text-zinc-950 shrink-0 cursor-pointer"
    : "p-1.5 sm:p-2 rounded-lg border-2 flex items-center justify-center transition-all duration-300 transform active:scale-95 shadow-sm text-zinc-400 hover:text-white bg-white/5 border-white/5 hover:bg-white/10 shrink-0 cursor-pointer";

  const copyEmailClass = theme === "sepia"
    ? "text-xs bg-[#EDE2CA]/95 hover:bg-[#E2D5B9] text-[#4F3C28] hover:text-[#2B1B0C] p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg border border-[#DFCFA0]/80 hover:border-amber-600/40 transition flex items-center gap-2 relative group cursor-pointer"
    : theme === "light"
    ? "text-xs bg-zinc-100 hover:bg-zinc-200/80 text-zinc-750 hover:text-zinc-950 p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg border border-zinc-200/80 hover:border-amber-500/30 transition flex items-center gap-2 relative group cursor-pointer"
    : "text-xs bg-[#111] hover:bg-[#161616] text-zinc-300 hover:text-white p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg border border-white/5 transition flex items-center gap-2 relative group cursor-pointer";

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  React.useEffect(() => {
    if (activeModalItem) {
      setActiveImageUrl(activeModalItem.imageUrl || (activeModalItem.images && activeModalItem.images.length > 0 ? activeModalItem.images[0] : undefined));
      setIsVideoActive(!!activeModalItem.videoUrl);
      setIsMaximized(false);
      if (activeModalItem.category === "網站產品瀑布頁") {
        setWaterfallMode("stitch");
      } else {
        setWaterfallMode("single");
      }
    } else {
      setActiveImageUrl(null);
      setIsVideoActive(false);
      setIsMaximized(false);
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
    
    if (!isRandomMode) {
      // Sort: isHighlight === true projects go to the front
      return [...list].sort((a, b) => {
        const aVal = a.isHighlight ? 1 : 0;
        const bVal = b.isHighlight ? 1 : 0;
        return bVal - aVal;
      });
    }
    return list;
  }, [items, selectedCategory, searchQuery, isRandomMode]);

  const visibleItems = useMemo(() => {
    return filteredItems.slice(0, visibleCount);
  }, [filteredItems, visibleCount]);

  // Infinite scroll loader using Intersection Observer to detect the viewport boundary and trigger pagination
  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && filteredItems.length > visibleCount) {
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

  // vCard details and download handler
  const vCardText = useMemo(() => {
    return [
      "BEGIN:VCARD",
      "VERSION:3.0",
      `FN:${profile.name} (${profile.engName})`,
      "N:李;凱博;;;",
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
        if (modalItemIndex > 0) {
          setActiveModalItem(filteredItems[modalItemIndex - 1]);
        } else {
          setActiveModalItem(filteredItems[filteredItems.length - 1]); // loop to end
        }
      } else if (e.key === "ArrowRight") {
        if (modalItemIndex < filteredItems.length - 1) {
          setActiveModalItem(filteredItems[modalItemIndex + 1]);
        } else {
          setActiveModalItem(filteredItems[0]); // loop to start
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeModalItem, filteredItems, modalItemIndex]);

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
        animate={{ y: showHeader ? 0 : -100 }}
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
        className="sticky top-0 z-40 border-b py-4 px-4 sm:px-6 lg:px-8 transition-colors duration-300"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-xl bg-gradient-to-tr from-amber-500 to-indigo-600 flex items-center justify-center text-white text-xs sm:text-sm font-semibold font-display shadow-lg shadow-amber-950/20 border border-white/10 shrink-0">
              CP
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className={`font-display font-semibold tracking-tight text-xs sm:text-sm md:text-md uppercase transition-colors duration-300 ${brandingTextClass}`}>capelee</span>
                <span className="hidden sm:inline-block text-[9px] font-mono px-1.5 py-0.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded font-semibold whitespace-nowrap">2026 OFFICIAL</span>
              </div>
              <p className="hidden sm:block text-[10px] font-mono text-zinc-500 tracking-wider">CREATIVE VISUAL PORTFOLIO</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-3 md:gap-4">
            <div className="hidden md:flex items-center gap-4 text-xs">
              <a href="#designer-bento" className={navLinkClass}>關於我</a>
              <span className={navSlashClass}>/</span>
              <a href="#portfolio-grid" className={navLinkClass}>精選作品</a>
              <span className={navSlashClass}>/</span>
              <a href="#designer-bento" className={navLinkClass}>專業範疇</a>
            </div>

            <div className="flex items-center gap-1 sm:gap-2">
              {/* 我的工作流按鈕 (桌機 & 行動裝置通用) */}
              <button
                type="button"
                onClick={() => setIsWorkflowOpen(true)}
                className={`p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg border flex items-center justify-center gap-1.5 transition-all duration-300 transform active:scale-95 text-xs shrink-0 cursor-pointer ${workflowBtnClass}`}
                title="查看 AI 輔助設計工作流"
              >
                <Sparkles className="h-4 w-4 sm:h-3.5 sm:w-3.5 text-amber-500 animate-pulse" />
                <span className="hidden md:inline font-sans">我的工作流</span>
                <span className="hidden sm:inline md:hidden font-mono text-[10px]">工作流</span>
              </button>

              {/* 主題切換按鈕 (深邃黑 vs 極簡白 vs 護眼暖沙) */}
              <button
                type="button"
                id="btn_theme_toggle"
                onClick={toggleTheme}
                className={themeToggleClass}
                title={
                  theme === "dark" 
                    ? "目前：深邃黑 (點擊切換為極簡白)" 
                    : theme === "light" 
                    ? "目前：極簡白 (點擊切換為護眼暖沙)" 
                    : "目前：護眼暖沙 (點擊切換為深邃黑)"
                }
              >
                {theme === "dark" ? (
                  <Moon className="h-4 w-4 text-indigo-400" />
                ) : theme === "light" ? (
                  <Sun className="h-4 w-4 text-[#D97706]" />
                ) : (
                  <Eye className="h-4 w-4 text-amber-700 animate-pulse" />
                )}
              </button>

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
                     <span className="hidden sm:inline text-green-400 text-[11px] font-medium font-sans">已複製信箱</span>
                  </>
                ) : (
                  <>
                     <Mail className={`h-3.5 w-3.5 transition-colors ${
                       theme === 'sepia' 
                         ? 'text-[#8C7B69]/80 group-hover:text-amber-700' 
                         : theme === 'light' 
                         ? 'text-zinc-400 group-hover:text-amber-600' 
                         : 'text-zinc-500 group-hover:text-amber-400'
                     }`} />
                     <span className="hidden sm:inline text-[11px] font-mono">capelee0715@gmail.com</span>
                  </>
                )}
              </button>

              {/* 外部官方作品集連結 */}
              <a 
                href={profile.portfolioUrl}
                target="_blank" 
                rel="noopener noreferrer"
                className="p-1.5 sm:px-3.5 sm:py-1.5 text-xs font-semibold rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black transition-all shadow-md shadow-amber-500/20 active:scale-95 flex items-center justify-center gap-1 shrink-0"
                title="訪問官方全網作品集"
              >
                <span className="hidden sm:inline">官方全網 ↗</span>
                <ArrowUpRight className="h-4 w-4 sm:hidden block" />
              </a>
            </div>
          </div>
        </div>
      </motion.header>

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

                {/* 2026作品集主要按鈕與一鍵儲存聯絡資訊 */}
                <div className="pt-2 flex flex-col gap-2.5">
                  <a 
                    href={profile.portfolioUrl}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black transition-all shadow-lg shadow-amber-500/25 active:scale-98 text-center uppercase tracking-wide font-sans scroll-smooth"
                  >
                    <span>最新 2026 官方作品集 (Canva) ↗</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => setIsContactCardOpen(true)}
                    className={`w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-xl border transition-all duration-300 shadow-md active:scale-98 text-center uppercase tracking-wide font-sans cursor-pointer ${
                      theme === "dark"
                        ? "border-amber-500/25 bg-amber-500/10 hover:bg-amber-500 hover:text-black hover:border-amber-400 text-amber-400"
                        : theme === "sepia"
                        ? "border-amber-700/25 bg-amber-700/10 hover:bg-amber-700 hover:text-white hover:border-amber-600 text-amber-900"
                        : "border-amber-600/25 bg-amber-500/10 hover:bg-amber-600 hover:text-white hover:border-amber-500 text-amber-700"
                    }`}
                  >
                    <QrCode className="h-3.5 w-3.5" />
                    <span>一鍵儲存聯絡資訊 (vCard)</span>
                  </button>
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

          {/* 各類作品過濾選項 (固定成兩行，電腦版置中呈現，自動雙行換行且內容置中對齊) */}
          <div className="w-full pt-2 flex flex-col items-center gap-4">
            <div className="w-full max-w-5xl flex flex-col items-center gap-2.5 sm:gap-3 px-4">
              {/* 第一行 */}
              <div 
                className="w-full flex flex-wrap justify-center gap-1.5 sm:gap-2.5 py-0.5"
              >
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
              <div 
                className="w-full flex flex-wrap justify-center gap-1.5 sm:gap-2.5 py-0.5"
              >
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

          {/* 隨機瀏覽玩法/洗牌控制項 */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-1 pb-3">
            <div className="flex items-center gap-1.5 text-zinc-500 font-mono text-[10px] uppercase tracking-widest">
              <Shuffle className={`h-3.5 w-3.5 text-amber-500/80 ${isRandomMode ? "animate-pulse" : ""}`} />
              <span>Browse Mode / 瀏覽模式：</span>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="inline-flex rounded-full p-0.5 bg-white/[0.02] border border-white/5 shadow-inner">
                <MagneticButton
                  type="button"
                  id="btn_mode_normal"
                  onClick={handleResetOrder}
                  className={`px-3.5 py-1 text-xs font-sans rounded-full transition-all duration-300 cursor-pointer ${
                    !isRandomMode
                      ? "bg-amber-500 text-black font-semibold shadow-md"
                      : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  預設排序
                </MagneticButton>
                
                <MagneticButton
                  type="button"
                  id="btn_mode_shuffle"
                  onClick={handleShuffle}
                  className={`px-3.5 py-1 text-xs font-sans rounded-full transition-all duration-300 cursor-pointer flex items-center gap-1.5 ${
                    isRandomMode
                      ? "bg-amber-500 text-black font-semibold shadow-md"
                      : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  <span>隨機洗牌瀏覽</span>
                </MagneticButton>
              </div>

              {isRandomMode && (
                <MagneticButton
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  type="button"
                  id="btn_reshuffle"
                  onClick={handleShuffle}
                  className="px-3 py-1 text-xs bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 hover:border-amber-500/40 rounded-full cursor-pointer transition-all duration-300 flex items-center gap-1 font-sans active:scale-95"
                  title="重新洗牌一次"
                >
                  <span>再洗一次 🎲</span>
                </MagneticButton>
              )}
            </div>
          </div>

          {/* 作品卡片 RWD 呈現 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 min-h-[300px]">
            <AnimatePresence>
              {visibleItems.map((item, index) => (
                <PortfolioCard
                  key={item.id}
                  item={item}
                  onClick={() => setActiveModalItem(item)}
                  priority={index < 6}
                  index={index}
                  prevVisibleCount={prevVisibleCount}
                  theme={deferredTheme}
                  showAllDetails={showAllDetails}
                />
              ))}
            </AnimatePresence>
          </div>

          {/* 無限滾動偵測點與極簡毛玻璃載入指示器 */}
          <div ref={loaderRef} className="w-full py-12 flex flex-col items-center justify-center gap-3 shrink-0">
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
                  <h4 className="font-display font-semibold text-sm mb-2">此特定類別下尚未登錄核心作品</h4>
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
              className={`bg-[#0E0E0E] border border-white/10 shadow-2xl relative my-auto transition-all duration-300 ${
                activeModalItem && activeModalItem.category === "網站產品瀑布頁" && isMaximized
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

              <div className={`grid grid-cols-1 md:grid-cols-12 ${isMaximized && activeModalItem.category === "網站產品瀑布頁" ? "h-full flex-grow overflow-hidden" : ""}`}>
                
                {/* 左側大圖 */}
                <div className={`bg-zinc-950 relative overflow-hidden flex flex-col justify-between border border-white/5 transition-all duration-300 ${
                  activeModalItem.category === "網站產品瀑布頁" && isMaximized 
                    ? "col-span-12 md:col-span-12 h-full flex-grow" 
                    : "md:col-span-7 aspect-[4/3] md:aspect-auto md:h-[500px]"
                }`}>
                  <div className={`relative w-full flex-grow bg-black/40 min-h-[280px] ${
                    activeModalItem.category === "網站產品瀑布頁" && waterfallMode === "stitch" 
                      ? `overflow-y-auto block ${isMaximized ? "h-[calc(95vh-140px)] md:h-[calc(92vh-100px)]" : "h-[500px]"} scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent` 
                      : `overflow-hidden flex items-center justify-center ${activeModalItem.category === "網站產品瀑布頁" && isMaximized ? "h-[calc(95vh-140px)] md:h-[calc(92vh-100px)]" : "md:h-[500px]"}`
                  }`}>
                    {activeModalItem.category === "網站產品瀑布頁" && waterfallMode === "stitch" ? (
                      <div className="w-full flex flex-col select-none bg-[#050505]">
                        {/* 頂部操作列 / 提示 */}
                        <div className="sticky top-0 z-20 bg-black/90 backdrop-blur-md px-4 py-2.5 border-b border-white/10 flex items-center justify-between text-[11.5px] font-sans text-zinc-400">
                          <div className="flex items-center gap-2 text-amber-400 font-medium">
                            <span className="flex h-2 w-2 relative">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                            </span>
                            <span className="hidden sm:inline">已無縫拼接為直式長圖 (請往下滾動閱讀)</span>
                            <span className="sm:hidden text-[10px]">無縫長圖 (下滑閱讀)</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => setIsMaximized(!isMaximized)}
                              className="px-2.5 py-1 rounded bg-amber-500/10 text-amber-400 hover:bg-amber-400 hover:text-black transition duration-200 border border-amber-500/25 text-[10px] uppercase font-mono tracking-wider font-bold cursor-pointer"
                              title={isMaximized ? "還原視窗" : "全寬滿版"}
                            >
                              {isMaximized ? "還原 🗅" : "全寬 🗖"}
                            </button>
                            <button
                              type="button"
                              onClick={() => setWaterfallMode("single")}
                              className="px-2.5 py-1 rounded bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white transition duration-200 border border-white/10 text-[10px] uppercase font-mono tracking-wider font-semibold cursor-pointer"
                            >
                              單圖 🖼️
                            </button>
                          </div>
                        </div>
                        
                        {/* 拼裝大圖 */}
                        <div className="flex flex-col gap-0 w-full overflow-hidden bg-[#050505]">
                          {activeModalItem.images && activeModalItem.images.map((imgUrl, idx) => (
                            <div key={idx} className="w-full block bg-[#050505] p-0 m-0 border-0 leading-[0]">
                              <ImageWithFallback 
                                src={imgUrl}
                                alt={`${activeModalItem.title} - 拼接第 ${idx + 1} 節`}
                                referrerPolicy="no-referrer"
                                fallbackTheme={activeModalItem.colorTheme}
                                categoryName={activeModalItem.category}
                                titleText={activeModalItem.title}
                                optimizeSize={1200}
                                className="w-full h-auto object-contain block p-0 m-0 border-0 outline-none"
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
                        {activeModalItem.category === "網站產品瀑布頁" && (
                          <div className="absolute top-3 left-3 z-[25] hidden md:flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => setWaterfallMode("stitch")}
                              className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-semibold text-xs tracking-wide shadow-lg border border-amber-500/10 cursor-pointer flex items-center gap-1.5 transition active:scale-95 duration-200"
                            >
                              <span>🗂️ 拼裝切換：一鍵查看直式無縫長圖</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setIsMaximized(!isMaximized)}
                              className="px-3 py-1.5 rounded-lg bg-black/60 hover:bg-amber-500 hover:text-black text-amber-400 font-semibold text-xs tracking-wide shadow-lg border border-amber-500/20 cursor-pointer flex items-center gap-1.5 transition active:scale-95 duration-200 backdrop-blur-md"
                            >
                              {isMaximized ? (
                                <>
                                  <Minimize2 className="h-3.5 w-3.5" />
                                  <span>還原視窗 🗅</span>
                                </>
                              ) : (
                                <>
                                  <Maximize2 className="h-3.5 w-3.5" />
                                  <span>全寬滿版 🗖</span>
                                </>
                              )}
                            </button>
                          </div>
                        )}
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

                    {/* 左右切換細節照片 */}
                    {waterfallMode !== "stitch" && !isVideoActive && activeModalItem.images && activeModalItem.images.length > 1 && (
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
                    {waterfallMode !== "stitch" && (
                      <div className="absolute bottom-4 left-4 z-10">
                        <span className="px-3 py-1 text-xs font-semibold tracking-wide text-amber-400 bg-black/80 backdrop-blur-md rounded-md border border-amber-500/20 shadow-md">
                          {activeModalItem.category}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Thumbnail gallery selector */}
                  {activeModalItem.category === "網站產品瀑布頁" && waterfallMode === "stitch" ? (
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
                {!(activeModalItem.category === "網站產品瀑布頁" && isMaximized) && (
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
                    <div className="pt-4 mt-4 border-t border-white/5 flex items-center justify-between shrink-0">
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
                  type="button"
                  onClick={() => setIsWorkflowOpen(false)}
                  className={`px-5 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                    theme === "dark" 
                      ? "bg-amber-500 hover:bg-amber-400 text-black shadow-md shadow-amber-500/10" 
                      : theme === "sepia" 
                      ? "bg-[#D97706] hover:bg-[#B45309] text-white shadow-md shadow-amber-900/10" 
                      : "bg-zinc-900 hover:bg-zinc-800 text-white shadow-md"
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
                            {profile.name} <span className="text-xs font-mono font-normal opacity-60">({profile.engName})</span>
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
