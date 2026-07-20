const fs = require('fs');

const filePath = 'src/components/CatFortuneTeller.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// 1. Remove blur-[60px] divs (Line ~874-875)
content = content.replace('<div className="absolute -top-24 -left-24 w-48 h-48 rounded-full bg-[#D33F33]/5 blur-[60px] pointer-events-none" />', '');
content = content.replace('<div className="absolute -bottom-24 -right-24 w-48 h-48 rounded-full bg-[#C5A059]/10 blur-[60px] pointer-events-none" />', '');

// 2. Remove blur-xl div (Line ~656)
content = content.replace('<div\n          className="absolute w-[80px] h-[100px] rounded-2xl bg-gradient-to-b from-amber-500/20 via-orange-500/30 to-red-500/10 blur-xl pointer-events-none -z-10"\n        />', '');

// 3. Replace animated radial gradient with a static div
const animatedBgRegex = /<motion\.div\s+className="absolute inset-0 pointer-events-none z-0"\s+animate=\{\{\s+background: \[\s+"radial-gradient[^\]]+\]\s+\}\}\s+transition=\{\{[^\}]+\}\}\s+\/>/s;
content = content.replace(animatedBgRegex, '<div className="absolute inset-0 pointer-events-none z-0 bg-[radial-gradient(circle_at_50%_25%,rgba(251,191,36,0.08)_0%,rgba(211,63,51,0.02)_50%,transparent_100%)]" />');

fs.writeFileSync(filePath, content, 'utf8');
console.log('Done fixing performance');
