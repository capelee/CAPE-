import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  X, 
  Share2, 
  Copy, 
  Check, 
  Download, 
  Sparkles, 
  ExternalLink,
  MessageSquare,
  Twitter,
  Facebook,
  Smartphone,
  Eye,
  Layers,
  Image as ImageIcon
} from "lucide-react";
import { PortfolioItem } from "../types";
import { getCategoryColor } from "../categoryColors";

interface ShareOgModalProps {
  item: PortfolioItem | null;
  isOpen: boolean;
  onClose: () => void;
  theme?: "dark" | "light" | "sepia";
}

type PreviewTab = "og-card" | "line-mockup" | "social-mockup";

export const ShareOgModal: React.FC<ShareOgModalProps> = ({
  item,
  isOpen,
  onClose,
  theme = "dark"
}) => {
  const [activeTab, setActiveTab] = useState<PreviewTab>("og-card");
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Close on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!item || !isOpen) return null;

  const catColor = getCategoryColor(item.category);
  const shareUrl = `https://cape-eight.vercel.app/?item=${encodeURIComponent(item.id)}`;
  const shareTitle = `${item.title} | 李凱博 Cape Lee 設計作品集`;
  const shareDescription = item.philosophy 
    ? (item.philosophy.length > 80 ? item.philosophy.slice(0, 80) + "..." : item.philosophy)
    : "李凱博 Cape Lee 品牌識別、視覺設計與原創角色 IP 設計實戰作品。";

  // Primary image
  const displayImage = item.imageUrl || (item.images && item.images.length > 0 ? item.images[0] : null);

  // Copy Link Handler
  const handleCopyLink = async () => {
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(shareUrl);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2500);
      }
    } catch (e) {
      console.error("Failed to copy link:", e);
    }
  };

  // Native Web Share API
  const handleNativeShare = async () => {
    if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareDescription,
          url: shareUrl,
        });
      } catch (e) {
        if ((e as Error)?.name !== "AbortError") {
          handleCopyLink();
        }
      }
    } else {
      handleCopyLink();
    }
  };

  // Social Share Handlers
  const handleLineShare = () => {
    const text = encodeURIComponent(`${shareTitle}\n${shareDescription}\n${shareUrl}`);
    window.open(`https://line.me/R/msg/text/?${text}`, "_blank", "noopener,noreferrer");
  };

  const handleTwitterShare = () => {
    const text = encodeURIComponent(`${shareTitle} — ${shareDescription}`);
    const url = encodeURIComponent(shareUrl);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}&hashtags=Design,Portfolio,CapeLee`, "_blank", "noopener,noreferrer");
  };

  const handleFacebookShare = () => {
    const url = encodeURIComponent(shareUrl);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, "_blank", "noopener,noreferrer");
  };

  // Generate and Download 1200x630 High-Resolution OG Image via Canvas
  const handleDownloadOgImage = useCallback(async () => {
    if (!item) return;
    setIsGeneratingImage(true);

    try {
      const width = 1200;
      const height = 630;
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        setIsGeneratingImage(false);
        return;
      }

      // 1. Draw Deep Studio Background
      const bgGradient = ctx.createLinearGradient(0, 0, width, height);
      bgGradient.addColorStop(0, "#0a0a0c");
      bgGradient.addColorStop(0.5, "#121216");
      bgGradient.addColorStop(1, "#070709");
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, width, height);

      // 2. Ambient Color Glow from Project Theme
      const ambientGlow = ctx.createRadialGradient(850, 315, 50, 850, 315, 550);
      ambientGlow.addColorStop(0, `rgba(${catColor.rgbaGlow || "245, 158, 11"}, 0.25)`);
      ambientGlow.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = ambientGlow;
      ctx.fillRect(0, 0, width, height);

      // 3. Subtle grid lines pattern
      ctx.strokeStyle = "rgba(255, 255, 255, 0.03)";
      ctx.lineWidth = 1;
      for (let x = 40; x < width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 40; y < height; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Helper function to draw an image if loadable
      const drawArtwork = async () => {
        if (!displayImage) return false;
        return new Promise<boolean>((resolve) => {
          const img = new Image();
          img.crossOrigin = "anonymous";
          img.onload = () => {
            try {
              // Artwork card container on the right (x: 620, y: 65, w: 515, h: 500)
              const cardX = 620;
              const cardY = 65;
              const cardW = 515;
              const cardH = 500;
              const cardRadius = 24;

              ctx.save();
              // Clip rounded rectangle for image
              ctx.beginPath();
              ctx.moveTo(cardX + cardRadius, cardY);
              ctx.lineTo(cardX + cardW - cardRadius, cardY);
              ctx.quadraticCurveTo(cardX + cardW, cardY, cardX + cardW, cardY + cardRadius);
              ctx.lineTo(cardX + cardW, cardY + cardH - cardRadius);
              ctx.quadraticCurveTo(cardX + cardW, cardY + cardH, cardX + cardW - cardRadius, cardY + cardH);
              ctx.lineTo(cardX + cardRadius, cardY + cardH);
              ctx.quadraticCurveTo(cardX, cardY + cardH, cardX, cardY + cardH - cardRadius);
              ctx.lineTo(cardX, cardY + cardRadius);
              ctx.quadraticCurveTo(cardX, cardY, cardX + cardRadius, cardY);
              ctx.closePath();
              ctx.clip();

              // Draw image with object-cover math
              const imgAspect = img.width / img.height;
              const targetAspect = cardW / cardH;
              let renderW = cardW;
              let renderH = cardH;
              let offsetX = cardX;
              let offsetY = cardY;

              if (imgAspect > targetAspect) {
                renderW = cardH * imgAspect;
                offsetX = cardX - (renderW - cardW) / 2;
              } else {
                renderH = cardW / imgAspect;
                offsetY = cardY - (renderH - cardH) / 2;
              }

              ctx.drawImage(img, offsetX, offsetY, renderW, renderH);

              // Overlay soft gradient inside image
              const cardOverlay = ctx.createLinearGradient(cardX, cardY, cardX, cardY + cardH);
              cardOverlay.addColorStop(0, "rgba(0, 0, 0, 0.1)");
              cardOverlay.addColorStop(0.7, "rgba(0, 0, 0, 0)");
              cardOverlay.addColorStop(1, "rgba(0, 0, 0, 0.6)");
              ctx.fillStyle = cardOverlay;
              ctx.fillRect(cardX, cardY, cardW, cardH);

              ctx.restore();

              // Border around artwork card
              ctx.save();
              ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
              ctx.lineWidth = 2;
              ctx.beginPath();
              ctx.moveTo(cardX + cardRadius, cardY);
              ctx.lineTo(cardX + cardW - cardRadius, cardY);
              ctx.quadraticCurveTo(cardX + cardW, cardY, cardX + cardW, cardY + cardRadius);
              ctx.lineTo(cardX + cardW, cardY + cardH - cardRadius);
              ctx.quadraticCurveTo(cardX + cardW, cardY + cardH, cardX + cardW - cardRadius, cardY + cardH);
              ctx.lineTo(cardX + cardRadius, cardY + cardH);
              ctx.quadraticCurveTo(cardX, cardY + cardH, cardX, cardY + cardH - cardRadius);
              ctx.lineTo(cardX, cardY + cardRadius);
              ctx.quadraticCurveTo(cardX, cardY, cardX + cardRadius, cardY);
              ctx.closePath();
              ctx.stroke();
              ctx.restore();

              resolve(true);
            } catch (err) {
              console.warn("Canvas image drawing tainted:", err);
              resolve(false);
            }
          };
          img.onerror = () => resolve(false);
          img.src = displayImage;
        });
      };

      const imageDrawn = await drawArtwork();

      // If image failed or CORS blocked, draw an elegant placeholder artwork frame
      if (!imageDrawn) {
        const cardX = 620;
        const cardY = 65;
        const cardW = 515;
        const cardH = 500;
        const cardRadius = 24;

        ctx.save();
        const placeholderGrad = ctx.createLinearGradient(cardX, cardY, cardX + cardW, cardY + cardH);
        placeholderGrad.addColorStop(0, "#1f1d24");
        placeholderGrad.addColorStop(1, "#111015");
        ctx.fillStyle = placeholderGrad;
        ctx.beginPath();
        ctx.roundRect(cardX, cardY, cardW, cardH, cardRadius);
        ctx.fill();
        ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
        ctx.lineWidth = 2;
        ctx.stroke();

        // Decorative emblem
        ctx.fillStyle = `rgba(${catColor.rgbaGlow || "245, 158, 11"}, 0.9)`;
        ctx.font = "bold 28px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(item.category, cardX + cardW / 2, cardY + cardH / 2 - 10);
        ctx.fillStyle = "#888899";
        ctx.font = "16px monospace";
        ctx.fillText("CAPE LEE PORTFOLIO", cardX + cardW / 2, cardY + cardH / 2 + 25);
        ctx.restore();
      }

      // 4. Left Content Panel Typography & Badges
      const leftX = 75;

      // Category Pill
      const catText = item.category;
      ctx.font = "bold 15px sans-serif";
      const catWidth = ctx.measureText(catText).width + 32;
      const catHeight = 32;
      const catY = 75;

      ctx.save();
      ctx.fillStyle = `rgba(${catColor.rgbaGlow || "245, 158, 11"}, 0.15)`;
      ctx.strokeStyle = `rgba(${catColor.rgbaGlow || "245, 158, 11"}, 0.6)`;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(leftX, catY, catWidth, catHeight, 16);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "#fbbf24";
      ctx.textBaseline = "middle";
      ctx.textAlign = "left";
      ctx.fillText(catText, leftX + 16, catY + catHeight / 2);
      ctx.restore();

      // English Subtitle
      ctx.save();
      ctx.fillStyle = "#a1a1aa";
      ctx.font = "14px monospace";
      ctx.textBaseline = "top";
      const titleEnText = item.titleEn ? (item.titleEn.length > 40 ? item.titleEn.slice(0, 40) + "..." : item.titleEn) : "VISUAL & IP DESIGN";
      ctx.fillText(titleEnText.toUpperCase(), leftX, 130);
      ctx.restore();

      // Main Title (Multi-line support if long)
      ctx.save();
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 36px 'Noto Sans TC', sans-serif";
      ctx.textBaseline = "top";
      
      const maxWidth = 480;
      const words = item.title;
      let line = "";
      let titleY = 160;

      for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n];
        const metrics = ctx.measureText(testLine);
        const testWidth = metrics.width;
        if (testWidth > maxWidth && n > 0) {
          ctx.fillText(line, leftX, titleY);
          line = words[n];
          titleY += 48;
          if (titleY > 215) { // Cap at 2 lines
            line = line + "...";
            break;
          }
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line, leftX, titleY);
      ctx.restore();

      // Philosophy Description
      ctx.save();
      ctx.fillStyle = "#d4d4d8";
      ctx.font = "16px 'Noto Sans TC', sans-serif";
      ctx.textBaseline = "top";
      
      const philText = item.philosophy ? item.philosophy : "專注於品牌識別 (CIS)、視覺設計與原創角色 IP 插畫。";
      let pLine = "";
      let pY = titleY + 65;

      for (let n = 0; n < philText.length; n++) {
        const testLine = pLine + philText[n];
        const testWidth = ctx.measureText(testLine).width;
        if (testWidth > maxWidth && n > 0) {
          ctx.fillText(pLine, leftX, pY);
          pLine = philText[n];
          pY += 26;
          if (pY > titleY + 120) {
            pLine = pLine + "...";
            break;
          }
        } else {
          pLine = testLine;
        }
      }
      ctx.fillText(pLine, leftX, pY);
      ctx.restore();

      // Tool Chips
      if (item.tools && item.tools.length > 0) {
        ctx.save();
        let chipX = leftX;
        const chipY = 445;
        const toolsToDraw = item.tools.slice(0, 4);

        toolsToDraw.forEach(tool => {
          ctx.font = "13px monospace";
          const tWidth = ctx.measureText(tool).width + 20;
          
          ctx.fillStyle = "rgba(255, 255, 255, 0.06)";
          ctx.strokeStyle = "rgba(255, 255, 255, 0.18)";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.roundRect(chipX, chipY, tWidth, 26, 6);
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = "#e4e4e7";
          ctx.textBaseline = "middle";
          ctx.fillText(tool, chipX + 10, chipY + 13);

          chipX += tWidth + 8;
        });
        ctx.restore();
      }

      // Bottom Footer Bar & Branding
      ctx.save();
      ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(leftX, 505);
      ctx.lineTo(leftX + maxWidth, 505);
      ctx.stroke();

      // Designer identity & URL
      ctx.fillStyle = "#fbbf24";
      ctx.font = "bold 15px sans-serif";
      ctx.textBaseline = "top";
      ctx.fillText("李凱博 Cape Lee • 設計作品集", leftX, 525);

      ctx.fillStyle = "#71717a";
      ctx.font = "13px monospace";
      ctx.fillText("cape-eight.vercel.app", leftX, 548);
      ctx.restore();

      // Convert to blob and download
      canvas.toBlob((blob) => {
        if (!blob) {
          setIsGeneratingImage(false);
          return;
        }
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.download = `${item.title.replace(/\s+/g, "_")}_OG_Share.png`;
        link.href = url;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        setIsGeneratingImage(false);
      }, "image/png");

    } catch (err) {
      console.error("Failed to generate OG image:", err);
      setIsGeneratingImage(false);
    }
  }, [item, displayImage, catColor]);

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-10 bg-black/80 backdrop-blur-md overflow-y-auto"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative w-full max-w-4xl bg-zinc-900 border border-zinc-700/60 rounded-3xl shadow-2xl overflow-hidden text-zinc-100 my-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-800 bg-zinc-950/40">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                  社群分享與 Open Graph 預覽
                </h3>
                <p className="text-xs text-zinc-400 font-mono">
                  動態生成 1200×630 高畫質社群分享卡片
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center justify-between px-6 pt-4 border-b border-zinc-800/80 bg-zinc-900/50">
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab("og-card")}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-t-xl text-xs sm:text-sm font-medium transition-all ${
                  activeTab === "og-card"
                    ? "bg-zinc-800 text-amber-300 border-t-2 border-amber-400 shadow-sm"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50"
                }`}
              >
                <ImageIcon className="w-4 h-4" />
                <span>1200×630 OG 卡片</span>
              </button>

              <button
                onClick={() => setActiveTab("line-mockup")}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-t-xl text-xs sm:text-sm font-medium transition-all ${
                  activeTab === "line-mockup"
                    ? "bg-zinc-800 text-green-400 border-t-2 border-green-400 shadow-sm"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50"
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                <span>LINE 聊天預覽</span>
              </button>

              <button
                onClick={() => setActiveTab("social-mockup")}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-t-xl text-xs sm:text-sm font-medium transition-all ${
                  activeTab === "social-mockup"
                    ? "bg-zinc-800 text-sky-400 border-t-2 border-sky-400 shadow-sm"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50"
                }`}
              >
                <Twitter className="w-4 h-4" />
                <span>X / Threads 貼文</span>
              </button>
            </div>

            <div className="hidden sm:flex items-center text-[11px] text-zinc-400 font-mono gap-1">
              <Eye className="w-3.5 h-3.5 text-amber-400" />
              <span>即時動態渲染</span>
            </div>
          </div>

          {/* Main Visual Preview Area */}
          <div className="p-4 sm:p-6 bg-zinc-950/60 flex flex-col items-center justify-center min-h-[300px]">
            
            {/* TAB 1: 1200x630 OG Card Visual */}
            {activeTab === "og-card" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full aspect-[1200/630] max-h-[380px] rounded-2xl overflow-hidden border border-zinc-700/80 shadow-2xl relative flex flex-col sm:flex-row bg-[#0c0c0e]"
                style={{
                  backgroundImage: `radial-gradient(circle at 80% 50%, rgba(${catColor.rgbaGlow || "245, 158, 11"}, 0.22), transparent 70%)`
                }}
              >
                {/* Left Content */}
                <div className="flex-1 p-5 sm:p-8 flex flex-col justify-between z-10">
                  <div className="space-y-2.5">
                    {/* Category pill */}
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-0.5 rounded-full text-[10px] sm:text-xs font-bold bg-amber-400/15 text-amber-300 border border-amber-400/30">
                        {item.category}
                      </span>
                      {item.isHighlight && (
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-mono bg-zinc-800 text-amber-400 border border-amber-400/20 flex items-center gap-1">
                          <Sparkles className="w-2.5 h-2.5" /> 精選亮點
                        </span>
                      )}
                    </div>

                    <p className="text-[10px] sm:text-xs font-mono text-zinc-400 tracking-wider uppercase line-clamp-1">
                      {item.titleEn || "VISUAL & IP DESIGN"}
                    </p>

                    <h2 className="text-base sm:text-2xl font-bold font-display text-white leading-tight line-clamp-2">
                      {item.title}
                    </h2>

                    <p className="text-xs sm:text-sm text-zinc-300 line-clamp-2 sm:line-clamp-3 leading-relaxed">
                      {item.philosophy || "Cape Lee 品牌識別 (CIS)、視覺設計與原創角色 IP 插畫。"}
                    </p>
                  </div>

                  {/* Bottom tools & signature */}
                  <div className="space-y-3 pt-3 border-t border-zinc-800/80">
                    <div className="flex flex-wrap gap-1.5">
                      {item.tools?.slice(0, 4).map(t => (
                        <span key={t} className="px-2 py-0.5 rounded text-[10px] font-mono bg-zinc-800/90 text-zinc-300 border border-zinc-700">
                          {t}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400">
                      <span className="text-amber-400 font-bold">李凱博 Cape Lee • 設計作品集</span>
                      <span>cape-eight.vercel.app</span>
                    </div>
                  </div>
                </div>

                {/* Right Artwork Box */}
                <div className="w-full sm:w-[45%] h-40 sm:h-auto relative p-3 sm:p-5 flex items-center justify-center">
                  <div className="w-full h-full rounded-xl overflow-hidden border border-white/10 shadow-lg relative bg-zinc-800">
                    {displayImage ? (
                      <img
                        src={displayImage}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-zinc-500 font-mono text-xs">
                        Artwork Preview
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
                  </div>
                </div>
              </motion.div>
            )}

            {/* TAB 2: LINE Chat Mockup */}
            {activeTab === "line-mockup" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md bg-[#849EB9] rounded-2xl p-4 shadow-xl border border-zinc-700/50 space-y-3"
              >
                <div className="text-center text-[10px] text-white/70 font-mono">
                  今日 12:00
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-amber-400 flex items-center justify-center font-bold text-black text-xs shrink-0 shadow-sm">
                    Cape
                  </div>

                  {/* LINE Rich Card Message */}
                  <div className="bg-white text-zinc-900 rounded-2xl rounded-tl-none overflow-hidden shadow-lg border border-black/5 max-w-[280px]">
                    <div className="w-full aspect-[16/9] relative bg-zinc-200 overflow-hidden">
                      {displayImage && (
                        <img src={displayImage} alt={item.title} className="w-full h-full object-cover" />
                      )}
                    </div>
                    <div className="p-3 space-y-1">
                      <div className="text-[10px] font-mono text-amber-600 font-semibold uppercase">
                        {item.category}
                      </div>
                      <h4 className="text-xs font-bold text-zinc-900 line-clamp-1">
                        {item.title} | 李凱博 Cape Lee 作品集
                      </h4>
                      <p className="text-[11px] text-zinc-500 line-clamp-2 leading-snug">
                        {item.philosophy || "李凱博 Cape Lee 品牌識別、視覺設計與角色 IP 設計。"}
                      </p>
                      <div className="pt-1.5 text-[9.5px] text-zinc-400 font-mono flex items-center gap-1">
                        <span>cape-eight.vercel.app</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* TAB 3: X / Twitter / Threads Mockup */}
            {activeTab === "social-mockup" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-lg bg-black rounded-2xl p-4 sm:p-5 border border-zinc-800 shadow-xl space-y-3 text-white"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center font-bold text-black text-sm">
                    CL
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 text-xs sm:text-sm font-bold">
                      <span>李凱博 Cape Lee</span>
                      <span className="text-zinc-500 font-normal">@cape_lee_design · 剛才</span>
                    </div>
                    <p className="text-xs text-zinc-300">
                      分享最新專案作品：{item.title} ✨
                    </p>
                  </div>
                </div>

                {/* Twitter Large Summary Card */}
                <div className="rounded-xl overflow-hidden border border-zinc-800 bg-zinc-900/90 shadow-md">
                  <div className="w-full aspect-[2/1] relative bg-zinc-800 overflow-hidden">
                    {displayImage && (
                      <img src={displayImage} alt={item.title} className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div className="p-3 space-y-1">
                    <div className="text-[10px] text-zinc-500 font-mono uppercase">
                      cape-eight.vercel.app
                    </div>
                    <div className="text-xs font-bold text-zinc-100 line-clamp-1">
                      {item.title} | 李凱博 Cape Lee 作品集
                    </div>
                    <div className="text-[11px] text-zinc-400 line-clamp-1">
                      {item.philosophy || "品牌識別與原創角色 IP 設計"}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Quick Actions & Sharing Suite */}
          <div className="p-5 sm:p-6 bg-zinc-900 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Share Destination Buttons */}
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              {/* Native share on mobile */}
              <button
                onClick={handleNativeShare}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium bg-amber-500 hover:bg-amber-400 text-black font-bold transition-all shadow-md active:scale-95"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>立即分享</span>
              </button>

              {/* LINE share */}
              <button
                onClick={handleLineShare}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-[#06C755] hover:bg-[#05b34c] text-white transition-all active:scale-95 shadow-sm"
                title="分享至 LINE"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>LINE</span>
              </button>

              {/* X / Twitter share */}
              <button
                onClick={handleTwitterShare}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700 transition-all active:scale-95 shadow-sm"
                title="分享至 X (Twitter)"
              >
                <Twitter className="w-3.5 h-3.5" />
                <span>X / 推特</span>
              </button>

              {/* Facebook share */}
              <button
                onClick={handleFacebookShare}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-[#1877F2] hover:bg-[#166fe5] text-white transition-all active:scale-95 shadow-sm"
                title="分享至 Facebook"
              >
                <Facebook className="w-3.5 h-3.5" />
                <span>FB</span>
              </button>
            </div>

            {/* Download Image & Copy Link Buttons */}
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button
                onClick={handleDownloadOgImage}
                disabled={isGeneratingImage}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-600 transition-all active:scale-95 disabled:opacity-50"
              >
                <Download className="w-3.5 h-3.5 text-amber-400" />
                <span>{isGeneratingImage ? "生成圖片中..." : "下載 1200×630 OG 圖"}</span>
              </button>

              <button
                onClick={handleCopyLink}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-600 transition-all active:scale-95"
              >
                {isCopied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-green-400" />
                    <span className="text-green-400 font-bold">已複製連結！</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-amber-400" />
                    <span>複製專屬連結</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
