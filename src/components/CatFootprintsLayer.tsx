import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { playPawPopSound } from "../utils/audioEffects";

interface CatFootprint {
  id: number;
  x: number;
  y: number;
  angle: number;
  scale: number;
}

export function CatFootprintsLayer() {
  const [footprints, setFootprints] = useState<CatFootprint[]>([]);

  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      let target = e.target as HTMLElement | null;
      
      const isInteractive = (el: HTMLElement | null): boolean => {
        if (!el) return false;
        const tagName = el.tagName.toLowerCase();
        if (["button", "a", "input", "select", "textarea", "iframe"].includes(tagName)) return true;
        if (el.getAttribute("role") === "button") return true;
        if (el.classList.contains("cursor-pointer") || el.classList.contains("interactive-tap")) return true;
        if (el.closest("#modal-multimedia-menu") || el.closest(".fixed.z-50") || el.closest(".fixed.z-40")) return true;
        return isInteractive(el.parentElement);
      };

      if (isInteractive(target)) {
        // Play the adorable paw pop sound!
        playPawPopSound();
        return;
      }

      const newFootprint: CatFootprint = {
        id: Date.now() + Math.random(),
        x: e.pageX,
        y: e.pageY,
        angle: -35 + Math.random() * 70,
        scale: 0.75 + Math.random() * 0.4,
      };

      setFootprints((prev) => [...prev, newFootprint]);

      setTimeout(() => {
        setFootprints((prev) => prev.filter((fp) => fp.id !== newFootprint.id));
      }, 3500);
    };

    window.addEventListener("click", handleGlobalClick);
    return () => {
      window.removeEventListener("click", handleGlobalClick);
    };
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none z-30 overflow-hidden">
      <AnimatePresence>
        {footprints.map((fp) => (
          <motion.div
            key={fp.id}
            initial={{ opacity: 0, scale: 0.2 }}
            animate={{ 
              opacity: [0, 0.75, 0.75, 0], 
              scale: [0.2, fp.scale, fp.scale, fp.scale * 0.9] 
            }}
            exit={{ opacity: 0 }}
            transition={{ 
              duration: 3.5, 
              times: [0, 0.08, 0.8, 1], 
              ease: "easeInOut" 
            }}
            style={{
              position: "absolute",
              left: fp.x - 16,
              top: fp.y - 16,
              transform: `rotate(${fp.angle}deg)`,
            }}
            className="text-rose-400/70 select-none pointer-events-none filter drop-shadow-[0_1.5px_3px_rgba(244,63,94,0.2)]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
              <g fill="#fda4af">
                {/* 貓掌中間大肉墊 */}
                <path d="M16,16 C12,16 11,19 11,21 C11,23.5 13,25 16,25 C19,25 21,23.5 21,21 C21,19 20,16 16,16 Z" />
                {/* 四個萌感小腳趾墊 */}
                <circle cx="8" cy="15" r="2" />
                <circle cx="12.5" cy="10" r="2" />
                <circle cx="19.5" cy="10" r="2" />
                <circle cx="24" cy="15" r="2" />
              </g>
            </svg>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
