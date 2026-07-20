const fs = require('fs');
const filePath = 'src/components/PortfolioCard.tsx';
let content = fs.readFileSync(filePath, 'utf8');

content = content.replace(
  /"bg-\[#FCF5E3\] bg-gradient-to-b from-\[#FCF5E3\] to-\[#EDE2CA\]"/g,
  '`bg-[#FCF5E3] bg-gradient-to-b from-[#FCF5E3] to-[#EDE2CA] border ${catColor.highlightBorderSepia}`'
);

content = content.replace(
  /"bg-\[#FCF8EE\] bg-gradient-to-b from-\[#FCF8EE\] via-\[#FCF8EE\] to-\[#FAF4E5\]"/g,
  '`bg-[#FCF8EE] bg-gradient-to-b from-[#FCF8EE] via-[#FCF8EE] to-[#FAF4E5] border ${catColor.highlightBorderLight}`'
);

// We need to also add border to dark if it's missing the word 'border' in highlightBorderDark?
// highlightBorderDark is "border-white/5 hover:border-white/10" which already has 'border' but misses 'border' (1px).
// "border border-white/5 hover:border-white/10" might be better.

fs.writeFileSync(filePath, content, 'utf8');
console.log('Done adding 1px borders back to PortfolioCard.tsx');
