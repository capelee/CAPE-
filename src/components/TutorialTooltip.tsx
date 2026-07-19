import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface TutorialTooltipProps {
  vertical?: boolean;
  step: number;
  text: string;
  theme: string;
  onClick: () => void;
  pointerDirection?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}

export const TutorialTooltip: React.FC<TutorialTooltipProps> = ({
  step,
  text,
  theme,
  onClick,
  pointerDirection = 'bottom',
  className = '',
  vertical = false
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: pointerDirection === 'top' ? -15 : 15, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, y: pointerDirection === 'top' ? -5 : 5 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`absolute z-[100] ${className}`}
    >
      <motion.div
        animate={{ 
          y: pointerDirection === 'bottom' ? [0, -5, 0] : pointerDirection === 'top' ? [0, 5, 0] : 0,
          x: pointerDirection === 'left' ? [0, 5, 0] : pointerDirection === 'right' ? [0, -5, 0] : 0
        }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        className={`relative ${vertical ? 'flex-col py-4 px-2 rounded-full' : 'flex-row px-4 py-2 rounded-full'} flex items-center justify-center gap-2 whitespace-nowrap shadow-2xl border cursor-pointer transition-transform hover:scale-[1.02] active:scale-95 ${
          theme === "light" 
            ? "bg-white/95 backdrop-blur-md border-amber-300/80 text-zinc-700 shadow-[0_8px_30px_rgba(245,158,11,0.22)]" 
            : theme === "sepia" 
            ? "bg-[#FCF8EE]/95 backdrop-blur-md border-[#D2B48C]/60 text-[#5C4033] shadow-[0_8px_30px_rgba(180,83,9,0.2)]" 
            : "bg-[#111]/95 backdrop-blur-md border-amber-500/40 text-amber-50/90 shadow-[0_8px_30px_rgba(245,158,11,0.2)]"
        }`}
      >
        <Sparkles className={`w-3.5 h-3.5 ${theme === "light" ? "text-amber-500" : theme === "sepia" ? "text-amber-600" : "text-amber-400"}`} />
        <span className={`text-[12px] md:text-sm font-semibold tracking-wide ${vertical ? 'writing-vertical-rl' : ''}`} style={vertical ? { writingMode: 'vertical-rl', textOrientation: 'upright' } : {}}>
          {vertical ? `${step}・${text}` : `${step}. ${text}`}
        </span>
        
        {pointerDirection === 'bottom' && (
          <div className={`absolute -bottom-[6px] left-1/2 -translate-x-1/2 w-3 h-3 border-r border-b rotate-45 ${
            theme === "light" ? "bg-white border-amber-300/80" : theme === "sepia" ? "bg-[#FCF8EE] border-[#D2B48C]/60" : "bg-[#111] border-amber-500/40"
          }`} />
        )}
        {pointerDirection === 'top' && (
          <div className={`absolute -top-[6px] left-1/2 -translate-x-1/2 w-3 h-3 border-l border-t rotate-45 ${
            theme === "light" ? "bg-white border-amber-300/80" : theme === "sepia" ? "bg-[#FCF8EE] border-[#D2B48C]/60" : "bg-[#111] border-amber-500/40"
          }`} />
        )}
        {pointerDirection === 'right' && (
          <div className={`absolute top-1/2 -right-[6px] -translate-y-1/2 w-3 h-3 border-r border-t rotate-45 ${
            theme === "light" ? "bg-white border-amber-300/80" : theme === "sepia" ? "bg-[#FCF8EE] border-[#D2B48C]/60" : "bg-[#111] border-amber-500/40"
          }`} />
        )}
        {pointerDirection === 'left' && (
          <div className={`absolute top-1/2 -left-[6px] -translate-y-1/2 w-3 h-3 border-l border-b rotate-45 ${
            theme === "light" ? "bg-white border-amber-300/80" : theme === "sepia" ? "bg-[#FCF8EE] border-[#D2B48C]/60" : "bg-[#111] border-amber-500/40"
          }`} />
        )}
      </motion.div>
    </motion.div>
  );
};
