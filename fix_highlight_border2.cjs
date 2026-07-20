const fs = require('fs');
const filePath = 'src/App.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// Inner Box
content = content.replace(
  'className={`relative p-3 rounded-[1rem] flex items-center justify-center overflow-hidden border ${',
  'className={`relative p-3 rounded-[1rem] flex items-center justify-center overflow-hidden ${'
);
content = content.replace(
  '? "bg-gradient-to-br from-[#FCF8EE] to-[#F3E8D0] border-[#E8DCC0] shadow-[0_2px_10px_rgba(200,160,100,0.15),inset_0_1px_0_rgba(255,255,255,0.9)]"',
  '? "bg-gradient-to-br from-[#FCF8EE] to-[#F3E8D0] shadow-[0_2px_10px_rgba(200,160,100,0.15),inset_0_1px_0_rgba(255,255,255,0.9)]"'
);
content = content.replace(
  '? "bg-gradient-to-br from-white to-zinc-50/80 border-zinc-200/80 shadow-[0_2px_10px_rgba(0,0,0,0.05),inset_0_1px_0_rgba(255,255,255,1)]"',
  '? "bg-gradient-to-br from-white to-zinc-50/80 shadow-[0_2px_10px_rgba(0,0,0,0.05),inset_0_1px_0_rgba(255,255,255,1)]"'
);
content = content.replace(
  ': "bg-gradient-to-br from-zinc-800 to-zinc-900 border-zinc-700/80 shadow-[0_4px_15px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.1)]"',
  ': "bg-gradient-to-br from-zinc-800 to-zinc-900 shadow-[0_4px_15px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.1)]"'
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Done removing inner borders');
