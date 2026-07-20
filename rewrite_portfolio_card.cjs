const fs = require('fs');
const filePath = 'src/components/PortfolioCard.tsx';
let content = fs.readFileSync(filePath, 'utf8');

content = content.replace(
  'import { motion, AnimatePresence } from "motion/react";',
  'import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, useMotionTemplate } from "motion/react";'
);

// We need to replace the state and ref logic for hover/physics.
// Let's find the component declaration.
const componentStartIdx = content.indexOf('export const PortfolioCard = React.memo(function PortfolioCard({');
const renderStartIdx = content.indexOf('  return (');

// Let's get the exact function body and write a script to replace the part between 
// const catColor = getCategoryColor(item.category);
// and 
// return (

