import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NeonGlowFilters } from "./NeonGlowFilters";
import { getCategoryTheme, ThemeMode } from "./themeConfig";

interface DecorWrapperProps {
  category: string;
  theme: ThemeMode;
  topRightBadge?: React.ReactNode;
  bottomIndicatorText?: string;
  svgViewBox?: string;
  preserveAspectRatio?: string;
  svgOpacityClass?: string;
  svgDefs?: React.ReactNode;
  svgContent?: React.ReactNode;
  children?: React.ReactNode;
}

export const DecorWrapper: React.FC<DecorWrapperProps> = ({
  category,
  theme,
  topRightBadge,
  bottomIndicatorText,
  svgViewBox,
  preserveAspectRatio = "xMidYMid slice",
  svgOpacityClass = "opacity-30 dark:opacity-45",
  svgDefs,
  svgContent,
  children,
}) => {
  const { fillGlow, strokeColor } = getCategoryTheme(category, theme);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={`decor-${category}`}
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 1.02 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-0 pointer-events-none overflow-hidden z-0 select-none will-change-transform"
        style={{ transform: "translateZ(0)", willChange: "transform" }}
        aria-hidden="true"
      >
        {/* Background Ambient Radial Glow */}
        <div
          className="absolute -top-24 -right-24 w-[520px] h-[520px] rounded-full blur-2xl opacity-30 dark:opacity-45 transition-all duration-700"
          style={{ background: `radial-gradient(circle, ${fillGlow} 0%, transparent 70%)` }}
        />
        <div
          className="absolute -bottom-24 -left-24 w-[480px] h-[480px] rounded-full blur-2xl opacity-20 dark:opacity-35 transition-all duration-700"
          style={{ background: `radial-gradient(circle, ${fillGlow} 0%, transparent 70%)` }}
        />

        {/* Top-Right Badge */}
        {topRightBadge}

        {/* SVG vector canvas */}
        {(svgContent || svgDefs) && (
          <svg
            className={`absolute inset-0 w-full h-full ${svgOpacityClass}`}
            {...(svgViewBox ? { viewBox: svgViewBox } : {})}
            preserveAspectRatio={preserveAspectRatio}
          >
            <defs>
              <NeonGlowFilters />
              {svgDefs}
            </defs>
            {svgContent}
          </svg>
        )}

        {/* Floating cards & HTML children */}
        {children}

        {/* Bottom indicator text */}
        {bottomIndicatorText && (
          <motion.div
            className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 font-mono text-[9px] opacity-80 will-change-transform"
            style={{ color: strokeColor, transform: "translateZ(0)", willChange: "transform" }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          >
            <div
              className="w-0.5 h-6 shadow-sm"
              style={{ background: `linear-gradient(to bottom, ${strokeColor}, transparent)` }}
            />
            <span className="tracking-widest">{bottomIndicatorText}</span>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};
