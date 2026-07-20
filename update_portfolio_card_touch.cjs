const fs = require('fs');
const filePath = 'src/components/PortfolioCard.tsx';
let content = fs.readFileSync(filePath, 'utf8');

const oldHandlersStart = content.indexOf('const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {');
const oldHandlersEnd = content.indexOf('const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {');

const newHandlers = `const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (showFirstPulse) setShowFirstPulse(false);
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
    setIsPressed(true);
    isTouchDeviceRef.current = true;
    hasMovedRef.current = false;

    // Initial physical interaction center
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = (touch.clientX - rect.left) / rect.width;
    const y = (touch.clientY - rect.top) / rect.height;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!touchStartRef.current) return;
    const touch = e.touches[0];
    const diffX = Math.abs(touch.clientX - touchStartRef.current.x);
    const diffY = Math.abs(touch.clientY - touchStartRef.current.y);
    
    // Apply physical damping before scroll threshold
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = (touch.clientX - rect.left) / rect.width;
    const y = (touch.clientY - rect.top) / rect.height;
    mouseX.set(x);
    mouseY.set(y);

    if (diffX > 10 || diffY > 10) {
      hasMovedRef.current = true;
      touchStartRef.current = null;
      setIsPressed(false);
      mouseX.set(0.5);
      mouseY.set(0.5);
    }
  };

  const handleTouchEnd = () => {
    touchStartRef.current = null;
    setIsPressed(false);
    mouseX.set(0.5);
    mouseY.set(0.5);
  };

  `;

content = content.substring(0, oldHandlersStart) + newHandlers + content.substring(oldHandlersEnd);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Done rewriting touch handlers');
