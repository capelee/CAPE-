import React from "react";
import { getCategoryColor } from "../categoryColors";

export interface CategoryButtonProps {
  cat: string;
  isActive: boolean;
  onClick: () => void;
  key?: React.Key;
  theme: "dark" | "light" | "sepia";
}

export function CategoryButton({ cat, isActive, onClick, theme }: CategoryButtonProps) {
  const [isHovered, setIsHovered] = React.useState(false);
  const catColor = getCategoryColor(cat);
  
  const isDark = theme === "dark";
  const isSepia = theme === "sepia";
  const isLight = theme === "light";

  return (
    <button
      type="button"
      draggable={false}
      id={`cat_filter_btn_${cat}`}
      data-cat={cat}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="px-3 sm:px-4.5 py-2 min-h-[42px] sm:min-h-[44px] text-[12px] sm:text-xs font-semibold rounded-full border transition-all duration-300 font-sans cursor-pointer relative overflow-hidden flex items-center justify-center whitespace-nowrap shrink-0 touch-manipulation select-none"
      style={{
        backgroundColor: isActive 
          ? `rgba(${catColor.rgbaGlow}, ${isSepia ? 0.85 : isLight ? 0.92 : 1})` 
          : isHovered 
            ? `rgba(${catColor.rgbaGlow}, ${isSepia ? 0.15 : isLight ? 0.12 : 0.12})` 
            : isSepia 
              ? "rgba(67, 52, 34, 0.05)" 
              : isLight 
                ? "rgba(0, 0, 0, 0.04)" 
                : "rgba(255, 255, 255, 0.04)",
        borderColor: isActive 
          ? `rgba(${catColor.rgbaGlow}, ${isSepia ? 0.7 : isLight ? 0.8 : 0.9})` 
          : isHovered 
            ? `rgba(${catColor.rgbaGlow}, ${isSepia ? 0.45 : isLight ? 0.4 : 0.4})` 
            : isSepia 
              ? "rgba(67, 52, 34, 0.15)" 
              : isLight 
                ? "rgba(0, 0, 0, 0.12)" 
                : "rgba(255, 255, 255, 0.1)",
        color: isActive 
          ? (isSepia ? "#2B1B0C" : isLight ? "#ffffff" : "#000000") 
          : isHovered 
            ? (isSepia ? "#2B1B0C" : isLight ? "#09090B" : "#ffffff") 
            : (isSepia ? "#5C4B3A" : isLight ? "#3F3F46" : "#E4E4E7"),
        boxShadow: isActive 
          ? `0 10px 20px -5px rgba(${catColor.rgbaGlow}, ${isSepia ? 0.25 : isLight ? 0.3 : 0.4}), 0 0 15px 1px rgba(${catColor.rgbaGlow}, ${isSepia ? 0.1 : isLight ? 0.15 : 0.15})` 
          : isHovered 
            ? `0 4px 12px -2px rgba(${catColor.rgbaGlow}, ${isSepia ? 0.1 : isLight ? 0.1 : 0.15})` 
            : "none"
      }}
    >
      <span className="relative z-10">
        {cat === "All" ? "全部作品" : cat}
      </span>
    </button>
  );
}
