const fs = require('fs');
const filePath = 'src/components/PortfolioCard.tsx';
let content = fs.readFileSync(filePath, 'utf8');

content = content.replace(
  'import { motion, AnimatePresence } from "motion/react";',
  'import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, useMotionTemplate } from "motion/react";'
);

const physicsSetup = `
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const springConfig = { stiffness: 150, damping: 15, mass: 0.8 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  const rawRotateX = useTransform(springY, [0, 1], [6, -6]);
  const rawRotateY = useTransform(springX, [0, 1], [-6, 6]);

  const flipSpring = useSpring(isCardFlipped ? 180 : 0, { stiffness: 160, damping: 14, mass: 0.9 });

  const rotateX = useTransform(() => rawRotateX.get());
  const rotateY = useTransform(() => {
    const flip = flipSpring.get();
    const isFlippedNow = flip > 90;
    const ry = rawRotateY.get();
    return flip + (isFlippedNow ? -ry : ry);
  });

  const glareX = useTransform(springX, [0, 1], [0, 100]);
  const glareY = useTransform(springY, [0, 1], [0, 100]);
  const glareOpacity = useSpring(isHovered ? 1 : 0, { stiffness: 200, damping: 20 });
  const glareBackground = useMotionTemplate\`radial-gradient(circle 160px at \${glareX}% \${glareY}%, rgba(\${catColor.rgbaGlow}, 0.14) 0%, transparent 100%)\`;
`;

// Insert the physics setup after `const defaultShadow = ...` or similar.
const injectionPoint = 'const defaultShadow = item.isHighlight ';
const beforeInjection = content.substring(0, content.indexOf(injectionPoint));
const afterInjection = content.substring(content.indexOf(injectionPoint));

// Wait, I need to insert it *after* isCardFlipped is defined, and isCardFlipped relies on isHovered and isFlipped.
// Let's find where isCardFlipped is defined.
const isCardFlippedIndex = content.indexOf('const isCardFlipped = isTouchDeviceRef.current ? isFlipped : (isHovered || isFlipped);');
const insertPoint = isCardFlippedIndex + 'const isCardFlipped = isTouchDeviceRef.current ? isFlipped : (isHovered || isFlipped);'.length;

content = content.substring(0, insertPoint) + physicsSetup + content.substring(insertPoint);

// Replace the event handlers
const oldHandlersStart = content.indexOf('const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {');
const oldHandlersEnd = content.indexOf('const staggerIndex = index - prevVisibleCount;');

const newHandlers = `
  // --- Physics Event Handlers ---
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (showFirstPulse) setShowFirstPulse(false);
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
    setIsPressed(true);
    isTouchDeviceRef.current = true;
    hasMovedRef.current = false;
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!touchStartRef.current) return;
    const touch = e.touches[0];
    const diffX = Math.abs(touch.clientX - touchStartRef.current.x);
    const diffY = Math.abs(touch.clientY - touchStartRef.current.y);
    if (diffX > 10 || diffY > 10) {
      hasMovedRef.current = true;
      touchStartRef.current = null;
      setIsPressed(false);
    }
  };

  const handleTouchEnd = () => {
    touchStartRef.current = null;
    setIsPressed(false);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (showFirstPulse) setShowFirstPulse(false);
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    
    mouseX.set(x);
    mouseY.set(y);
    
    if (!isHovered) {
      setIsHovered(true);
    }
  };

  const handleMouseLeave = () => {
    setIsPressed(false);
    setIsHovered(false);
    setIsFlipped(false);
    mouseX.set(0.5);
    mouseY.set(0.5);
  };

  const handleCardClick = (e: React.MouseEvent) => {
    if (hasMovedRef.current) {
      hasMovedRef.current = false;
      return;
    }
    if (isCardFlipped) {
      onClick();
    } else {
      setIsFlipped(true);
    }
  };

  `;

content = content.substring(0, oldHandlersStart) + newHandlers + content.substring(oldHandlersEnd);

// Replace flipSpring value effectively when isCardFlipped changes
content = content.replace(
  '  const flipSpring = useSpring(isCardFlipped ? 180 : 0, { stiffness: 160, damping: 14, mass: 0.9 });',
  `  const flipSpring = useSpring(0, { stiffness: 160, damping: 14, mass: 0.9 });
  React.useEffect(() => {
    flipSpring.set(isCardFlipped ? 180 : 0);
  }, [isCardFlipped, flipSpring]);`
);

// Update motion.div props
const oldMotionDiv = `<motion.div
            ref={cardInnerRef}
            style={{
              transformStyle: "preserve-3d",
              boxShadow: defaultShadow,
            }}
            animate={{
              rotateY: isCardFlipped ? 180 : 0,
              scale: isPressed ? 0.97 : isHovered ? 1.025 : 1,
            }}
            transition={{
              type: "spring",
              stiffness: 160,
              damping: 14,
              mass: 0.9,
            }}
            className="relative flex flex-col rounded-2xl w-full h-full will-change-transform transform-gpu"
          >`;

const newMotionDiv = `<motion.div
            style={{
              transformStyle: "preserve-3d",
              rotateX,
              rotateY,
            }}
            animate={{
              scale: isPressed ? 0.955 : isHovered ? 1.025 : 1,
              boxShadow: isHovered 
                ? \`0 25px 50px -12px rgba(0,0,0,0.85), 0 0 25px 3px rgba(\${catColor.rgbaGlow}, 0.22)\`
                : defaultShadow,
            }}
            transition={{
              scale: { type: "spring", stiffness: 250, damping: 20 },
              boxShadow: { duration: 0.3 }
            }}
            className="relative flex flex-col rounded-2xl w-full h-full will-change-transform transform-gpu"
          >`;

content = content.replace(oldMotionDiv, newMotionDiv);

// Update glare overlay
const oldGlare = `<div 
            ref={glareRef}
            className="pointer-events-none absolute inset-0 z-50 rounded-2xl transition-opacity duration-300 opacity-0 mix-blend-overlay"
          />`;
const newGlare = `<motion.div 
            style={{ 
              opacity: glareOpacity, 
              background: glareBackground 
            }}
            className="pointer-events-none absolute inset-0 z-50 rounded-2xl mix-blend-overlay"
          />`;

content = content.replace(oldGlare, newGlare);

// Also remove `const cardInnerRef = ...` and `const glareRef = ...`
content = content.replace('const cardInnerRef = React.useRef<HTMLDivElement>(null);', '');
content = content.replace('const glareRef = React.useRef<HTMLDivElement>(null);', '');
content = content.replace('const inertiaFrameRef = React.useRef<number | null>(null);', '');

fs.writeFileSync(filePath, content, 'utf8');
console.log('Done rewriting physics');
