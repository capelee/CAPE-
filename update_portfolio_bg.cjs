const fs = require('fs');
const filePath = 'src/components/PortfolioCard.tsx';
let content = fs.readFileSync(filePath, 'utf8');

content = content.replace(
  /className=\{`relative \$\{showAllDetails \? "aspect-\[4\/3\]" : "aspect-square"\} overflow-hidden \$\{isSepia \? "bg-\[#EADECC\]\/45" : "bg-zinc-950"\}\`/g,
  'className={`relative ${showAllDetails ? "aspect-[4/3]" : "aspect-square"} overflow-hidden ${isSepia ? catColor.highlightBgSepia : isLight ? catColor.highlightBgLight : catColor.highlightBgDark}`'
);

// Also remove the "背景霓虹光澤" bottom gradient if it's there
content = content.replace(
  /\{\/\* 背景霓虹光澤 \*\/\}\s*<div className=\{`absolute inset-0 bg-gradient-to-t \$\{\s*isSepia\s*\? "from-\[#433422\]\/90 via-\[#433422\]\/15 to-transparent"\s*: "from-black\/85 via-black\/10 to-transparent"\s*\}\`\><\/div>/,
  '{/* Subtle ambient shadow at the bottom */}\n              <div className={`absolute inset-0 bg-gradient-to-t ${isSepia ? "from-[#433422]/60 via-[#433422]/5 to-transparent" : "from-black/60 via-black/5 to-transparent"} opacity-60 mix-blend-multiply pointer-events-none`}></div>'
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Done updating PortfolioCard.tsx background');
