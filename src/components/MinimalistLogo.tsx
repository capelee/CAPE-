import React from "react";
import { motion } from "motion/react";

interface MinimalistLogoProps {
  className?: string;
  size?: number;
  theme?: "dark" | "light" | "sepia";
}

export function MinimalistLogo({ className = "", size, theme = "dark" }: MinimalistLogoProps) {
  const imageUrl = "https://drive.google.com/thumbnail?sz=w1000&id=18ega279ty4XVeShySlEkSzJXUz2pOcep";

  return (
    <motion.div
      className={`relative flex items-center justify-center select-none cursor-pointer ${className}`}
      style={size !== undefined ? { width: size, height: size } : undefined}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <img
        src={imageUrl}
        alt="Cape Lee Logo"
        referrerPolicy="no-referrer"
        className="w-full h-full object-contain"
      />
    </motion.div>
  );
}
