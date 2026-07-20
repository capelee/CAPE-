const fs = require('fs');
const filePath = 'src/categoryColors.ts';
let content = fs.readFileSync(filePath, 'utf8');

content = content.replace(/highlightBorderDark: ".*?"/g, 'highlightBorderDark: "border-white/5 hover:border-white/10"');
content = content.replace(/highlightBorderLight: ".*?"/g, 'highlightBorderLight: "border-zinc-200/50 hover:border-zinc-300"');
content = content.replace(/highlightBorderSepia: ".*?"/g, 'highlightBorderSepia: "border-[#E8DFCE]/50 hover:border-[#D0C098]"');

fs.writeFileSync(filePath, content, 'utf8');
console.log('Done fixing highlight borders 2 in categoryColors.ts');
