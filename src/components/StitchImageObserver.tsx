import React, { useState, useEffect, useRef } from "react";
import { ImageWithFallback } from "./ImageWithFallback";
import { EyeOff, Loader2 } from "lucide-react";

interface StitchImageObserverProps {
  src: string;
  alt: string;
  fallbackTheme?: string;
  categoryName?: string;
  titleText?: string;
  idx: number;
  optimizeSize?: number;
}

export function StitchImageObserver({
  src,
  alt,
  fallbackTheme,
  categoryName,
  titleText,
  idx,
  optimizeSize = 1200
}: StitchImageObserverProps) {
  const [isInView, setIsInView] = useState(idx === 0); // Keep first image active for fast LCP
  const [isImgLoaded, setIsImgLoaded] = useState(idx === 0); // First image is loaded/ready eagerly
  const [hasBeenLoaded, setHasBeenLoaded] = useState(idx === 0); // Preserve already-loaded slices
  const [height, setHeight] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);

  // Once an image has loaded, we lock its hasBeenLoaded and isImgLoaded states so it never unmounts
  useEffect(() => {
    if (isImgLoaded) {
      setHasBeenLoaded(true);
    }
  }, [isImgLoaded]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Determine dynamic preload buffer based on screen height
    let bottomMargin = 400;
    if (typeof window !== "undefined" && window.innerHeight > 800) {
      bottomMargin = 800; // Extra down-buffer for taller devices to pre-load slices smoothly
    }
    const rootMarginStr = `400px 0px ${bottomMargin}px 0px`;

    // Use IntersectionObserver to determine visibility
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      {
        rootMargin: rootMarginStr,
        threshold: 0.01,
      }
    );

    observer.observe(container);

    // Track dynamic element height via ResizeObserver to dynamically lock height,
    // avoiding layout shifts (cumulative layout shift) when the image is unmounted.
    if (window.ResizeObserver) {
      const resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const rect = entry.contentRect;
          // Only capture true image height when it is rendered and actually loaded
          if (rect.height > 100) {
            setHeight(rect.height);
          }
        }
      });
      resizeObserver.observe(container);
      resizeObserverRef.current = resizeObserver;
    }

    return () => {
      observer.disconnect();
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect();
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      id={`stitch-image-wrapper-${idx}`}
      style={{
        // 1. If image is loaded, CLEAR the minHeight constraint entirely.
        //    This completely bypasses any circular ResizeObserver locks, allowing natural 
        //    proportional resizing and zero black gaps.
        // 2. If loading or out-of-view, lock minHeight to prevent cumulative layout shift (CLS).
        minHeight: !isImgLoaded
          ? (height ? `${height}px` : undefined)
          : undefined,
      }}
      className="w-full relative bg-[#050505] overflow-hidden leading-[0] p-0 m-0 border-0"
    >
      {(isInView || hasBeenLoaded) ? (
        <ImageWithFallback
          src={src}
          alt={alt}
          referrerPolicy="no-referrer"
          fallbackTheme={fallbackTheme}
          categoryName={categoryName}
          titleText={titleText}
          optimizeSize={optimizeSize}
          lazy={idx > 0 && !hasBeenLoaded}
          priority={idx === 0 || hasBeenLoaded}
          heightAuto={true} // Force inner wrapper to use h-auto instead of h-full centering
          onLoad={() => setIsImgLoaded(true)}
          className="w-full h-auto object-contain block p-0 m-0 border-0 outline-none animate-fade-in"
        />
      ) : (
        // When the element is out of the viewport, we completely unmount the high-quality image.
        // This drops browser GPU texture locks, cleans DOM/CSS rendering trees, and prevents crashes on mobile devices.
        <div
          className="w-full flex flex-col items-center justify-center bg-[#090909]/45 border-0 transition-colors duration-300"
          style={{ height: height ? `${height}px` : "320px" }}
        >
          <div className="flex flex-col items-center gap-2 text-zinc-600 animate-pulse select-none">
            {height ? (
              <>
                <EyeOff className="w-5 h-5 stroke-[1.5]" />
                <span className="text-[9px] font-mono tracking-wider">
                  SECTION {idx + 1} • MEMORY RELEASED
                </span>
              </>
            ) : (
              <>
                <Loader2 className="w-5 h-5 stroke-[1.5] animate-spin text-amber-500/60" />
                <span className="text-[9px] font-mono tracking-wider text-amber-500/50">
                  PRE-RENDERING SECTION {idx + 1}...
                </span>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
