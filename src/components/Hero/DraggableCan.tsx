import React from 'react';
import { motion, MotionValue } from 'motion/react';
import { FLAVOR_PHYSICS } from '../../utils/flavorPhysics';

interface DraggableCanProps {
  canRef: React.RefObject<HTMLDivElement>;
  canX: MotionValue<number>;
  canY: MotionValue<number>;
  canRotate: MotionValue<number>;
  canFlavor: string;
  handleCanDragStart: (e: any, info: any) => void;
  handleCanDrag: (e: any, info: any) => void;
  handleCanDragEnd: (e: any, info: any) => void;
  handleCanTap: () => void;
}

export const DraggableCan: React.FC<DraggableCanProps> = ({
  canRef,
  canX,
  canY,
  canRotate,
  canFlavor,
  handleCanDragStart,
  handleCanDrag,
  handleCanDragEnd,
  handleCanTap
}) => {
  const [showEntranceEffect, setShowEntranceEffect] = React.useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setShowEntranceEffect(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      ref={canRef}
      style={{ x: canX, y: canY, rotate: canRotate, touchAction: "none" }}
      drag
      dragConstraints={{ left: -1500, right: 1500, top: -1500, bottom: 1500 }}
      dragElastic={0.15}
      dragMomentum={false}
      onDragStart={handleCanDragStart}
      onDrag={handleCanDrag}
      onDragEnd={handleCanDragEnd}
      onTap={handleCanTap}
      className="absolute top-2 right-4 lg:top-0 lg:right-0 z-50 cursor-grab select-none p-1.5 active:cursor-grabbing group will-change-transform"
    >
      <motion.div
        initial={{ scale: 0, opacity: 0, rotate: -135, y: -45 }}
        animate={{ scale: 1, opacity: 1, rotate: 0, y: 0 }}
        transition={{ 
          type: "spring", 
          stiffness: 280, 
          damping: 14,
          delay: 0.15
        }}
        whileHover={{ scale: 1.12 }}
        whileTap={{ scale: 1.25, rotate: 12 }}
        className="relative"
      >
        {/* Glow / Sparkle background effect for entrance */}
        {showEntranceEffect && (
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: [1, 1.3, 1], opacity: [0, 0.8, 0] }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute -inset-4 bg-amber-400/30 rounded-full blur-xl pointer-events-none"
          />
        )}
        
        {/* Hover subtle glow that remains interactive */}
        <div className="absolute -inset-2 bg-amber-400/0 rounded-full blur-md pointer-events-none group-hover:bg-amber-400/15 transition-all duration-300" />
        
        {/* Sparkle particle effects circling the can when appearing */}
        {showEntranceEffect && (
          <>
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [0, 1.5, 0], opacity: [0, 1, 0], x: [0, 12, 20], y: [0, -12, -24] }}
              transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
              className="absolute top-1 right-1 w-2.5 h-2.5 bg-yellow-300 rounded-full blur-[0.5px] pointer-events-none"
            />
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [0, 1.2, 0], opacity: [0, 1, 0], x: [0, -15, -25], y: [0, 10, 20] }}
              transition={{ duration: 1.4, ease: "easeOut", delay: 0.4 }}
              className="absolute bottom-1 left-1 w-2 h-2 bg-amber-400 rounded-full blur-[0.5px] pointer-events-none"
            />
          </>
        )}

        <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-neutral-900/95 text-[10px] text-white font-medium px-2 py-0.5 rounded shadow-lg border border-white/10 pointer-events-none whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          {FLAVOR_PHYSICS[canFlavor].emoji} {FLAVOR_PHYSICS[canFlavor].name}
        </span>
        <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 drop-shadow-md">
        <ellipse cx="24" cy="14" rx="18" ry="6" fill={FLAVOR_PHYSICS[canFlavor].topLidFill} stroke={FLAVOR_PHYSICS[canFlavor].topLidStroke} strokeWidth="1.5" />
        <ellipse cx="24" cy="14" rx="14" ry="4.5" fill={FLAVOR_PHYSICS[canFlavor].innerLidFill} stroke={FLAVOR_PHYSICS[canFlavor].topLidStroke} strokeWidth="1" />
        
        <path d="M 24,14 C 24,12 21,10 19,11 C 17,12 17,14 19,15 C 21,16 24,14 24,14" fill={FLAVOR_PHYSICS[canFlavor].innerLidFill} stroke={FLAVOR_PHYSICS[canFlavor].topLidStroke} strokeWidth="1" />
        <circle cx="19" cy="13" r="1.5" fill="#FEF3C7" />
        <path d="M 6,14 A 18,6 0 0 0 42,14 L 42,32 A 18,6 0 0 1 6,32 Z" fill={`url(#${FLAVOR_PHYSICS[canFlavor].bodyGradient})`} stroke={FLAVOR_PHYSICS[canFlavor].topLidStroke} strokeWidth="1.5" strokeLinejoin="round" />
        
        <ellipse cx="24" cy="32" rx="18" ry="6" fill={FLAVOR_PHYSICS[canFlavor].topLidStroke} opacity="0.35" />
        <ellipse cx="24" cy="32" rx="18" ry="6" fill="none" stroke={FLAVOR_PHYSICS[canFlavor].topLidStroke} strokeWidth="1.5" />
        <path d="M 6,20 A 18,5 0 0 0 42,20 L 42,28 A 18,5 0 0 1 6,28 Z" fill={FLAVOR_PHYSICS[canFlavor].labelFill} opacity="0.95" />
        
        {canFlavor === "tuna" ? (
          <>
            <path d="M 18,24 C 21,21 24,21 27,24 L 29,22.5 L 29,25.5 Z" fill={FLAVOR_PHYSICS[canFlavor].labelPatternFill} />
            <circle cx="20" cy="23.5" r="0.6" fill="#1D4ED8" />
          </>
        ) : canFlavor === "chicken" ? (
          <>
            <circle cx="22" cy="24" r="2.2" fill={FLAVOR_PHYSICS[canFlavor].labelPatternFill} />
            <circle cx="24.5" cy="24.5" r="1.6" fill={FLAVOR_PHYSICS[canFlavor].labelPatternFill} />
            <path d="M 18,23.5 L 22.5,24.2" stroke={FLAVOR_PHYSICS[canFlavor].labelPatternFill} strokeWidth="1.8" strokeLinecap="round" />
          </>
        ) : (
          <>
            <circle cx="24" cy="25" r="2.5" fill="#78350F" />
            <circle cx="21" cy="21.5" r="1" fill="#78350F" />
            <circle cx="24" cy="20.5" r="1" fill="#78350F" />
            <circle cx="27" cy="21.5" r="1" fill="#78350F" />
          </>
        )}
        <defs>
          <linearGradient id="metallicGoldGradient" x1="6" y1="23" x2="42" y2="23" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#B45309" />
            <stop offset="25%" stopColor="#FBBF24" />
            <stop offset="50%" stopColor="#FEF3C7" />
            <stop offset="75%" stopColor="#FBBF24" />
            <stop offset="100%" stopColor="#92400E" />
          </linearGradient>
          <linearGradient id="metallicBlueGradient" x1="6" y1="23" x2="42" y2="23" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#1E3A8A" />
            <stop offset="25%" stopColor="#3B82F6" />
            <stop offset="50%" stopColor="#93C5FD" />
            <stop offset="75%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#172554" />
          </linearGradient>
          <linearGradient id="metallicRedGradient" x1="6" y1="23" x2="42" y2="23" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#7F1D1D" />
            <stop offset="25%" stopColor="#EF4444" />
            <stop offset="50%" stopColor="#FCA5A5" />
            <stop offset="75%" stopColor="#EF4444" />
            <stop offset="100%" stopColor="#450A0A" />
          </linearGradient>
        </defs>
      </svg>
      </motion.div>
    </motion.div>
  );
};
