const fs = require('fs');
const filePath = 'src/categoryColors.ts';
let content = fs.readFileSync(filePath, 'utf8');

// Replace highlightBorderDark values
content = content.replace(
  /highlightBorderDark: "border-\[2px\] border-[a-z]+-500\/35 hover:border-[a-z]+-400"/g,
  'highlightBorderDark: "border-white/5 hover:border-white/10"'
);

// We should also probably replace the others just in case they are used somewhere else.
content = content.replace(
  /highlightBorderLight: "border-\[2\.5px\] border-amber-500 hover:border-amber-600"/g,
  'highlightBorderLight: "border-zinc-200/50 hover:border-zinc-300"'
);

content = content.replace(
  /highlightBorderSepia: "border-\[2\.5px\] border-amber-500 hover:border-amber-650"/g,
  'highlightBorderSepia: "border-[#E8DFCE]/50 hover:border-[#D0C098]"'
);

content = content.replace(
  /highlightBorderClass: "border-\[2px\] border-[a-z]+-500\/35 hover:border-[a-z]+-400"/g,
  'highlightBorderClass: "border-transparent"'
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Done fixing highlight borders in categoryColors.ts');
