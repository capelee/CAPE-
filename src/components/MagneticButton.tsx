import React, { useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

export interface MagneticButtonProps {
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

export const MagneticButton: React.FC<MagneticButtonProps> = ({
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

