const fs = require('fs');
const filePath = 'src/App.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// Front Face
content = content.replace(
  /className=\{`absolute inset-0 w-full h-full p-5 lg:p-7 rounded-\[1\.25rem\] backdrop-blur-md flex flex-col justify-start items-start overflow-hidden transition-colors duration-500 \$\{/,
  'className={`absolute inset-0 w-full h-full p-5 lg:p-7 rounded-[1.25rem] border backdrop-blur-md flex flex-col justify-start items-start overflow-hidden transition-colors duration-500 ${'
);
content = content.replace(
  /\? "bg-\[#FCF8EE\]\/80 hover:bg-white shadow-\[0_4px_20px_-4px_rgba\(0,0,0,0\.02\)\]"/,
  '? "bg-[#FCF8EE]/80 border-[#DFCFA0]/50 hover:bg-white shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)]"'
);
content = content.replace(
  /\? "bg-white\/70 hover:bg-white shadow-\[0_4px_20px_-4px_rgba\(0,0,0,0\.02\)\]"/,
  '? "bg-white/70 border-zinc-200/60 hover:bg-white shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)]"'
);
content = content.replace(
  /: "bg-zinc-900\/50 hover:bg-zinc-800\/80 shadow-\[0_4px_20px_-4px_rgba\(0,0,0,0\.2\)\]"/,
  ': "bg-zinc-900/50 border-white/5 hover:bg-zinc-800/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.2)]"'
);

// Inner Box
content = content.replace(
  /className=\{`relative p-3 rounded-\[1rem\] flex items-center justify-center overflow-hidden \$\{/,
  'className={`relative p-3 rounded-[1rem] flex items-center justify-center overflow-hidden border ${'
);
content = content.replace(
  /\? "bg-gradient-to-br from-\[#FCF8EE\] to-\[#F3E8D0\] shadow-\[0_2px_10px_rgba\(200,160,100,0\.15\),inset_0_1px_0_rgba\(255,255,255,0\.9\)\]"/,
  '? "bg-gradient-to-br from-[#FCF8EE] to-[#F3E8D0] border-[#E8DCC0] shadow-[0_2px_10px_rgba(200,160,100,0.15),inset_0_1px_0_rgba(255,255,255,0.9)]"'
);
content = content.replace(
  /\? "bg-gradient-to-br from-white to-zinc-50\/80 shadow-\[0_2px_10px_rgba\(0,0,0,0\.05\),inset_0_1px_0_rgba\(255,255,255,1\)\]"/,
  '? "bg-gradient-to-br from-white to-zinc-50/80 border-zinc-200/80 shadow-[0_2px_10px_rgba(0,0,0,0.05),inset_0_1px_0_rgba(255,255,255,1)]"'
);
content = content.replace(
  /: "bg-gradient-to-br from-zinc-800 to-zinc-900 shadow-\[0_4px_15px_rgba\(0,0,0,0\.4\),inset_0_1px_0_rgba\(255,255,255,0\.1\)\]"/,
  ': "bg-gradient-to-br from-zinc-800 to-zinc-900 border-zinc-700/80 shadow-[0_4px_15px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.1)]"'
);

// Back Face
content = content.replace(
  /className=\{`absolute inset-0 w-full h-full p-4 sm:p-5 lg:p-6 rounded-\[1\.25rem\] backdrop-blur-md flex flex-col justify-start items-start overflow-hidden \$\{/,
  'className={`absolute inset-0 w-full h-full p-4 sm:p-5 lg:p-6 rounded-[1.25rem] border backdrop-blur-md flex flex-col justify-start items-start overflow-hidden ${'
);
content = content.replace(
  /\? "bg-\[#FCF8EE\]\/95 shadow-\[0_8px_30px_-4px_rgba\(200,160,100,0\.15\)\]"/,
  '? "bg-[#FCF8EE]/95 border-[#D0B87A] shadow-[0_8px_30px_-4px_rgba(200,160,100,0.15)]"'
);
content = content.replace(
  /\? "bg-white\/95 shadow-\[0_8px_30px_-4px_rgba\(0,0,0,0\.06\)\]"/,
  '? "bg-white/95 border-zinc-300 shadow-[0_8px_30px_-4px_rgba(0,0,0,0.06)]"'
);
content = content.replace(
  /: "bg-zinc-800\/95 shadow-\[0_8px_30px_-4px_rgba\(255,255,255,0\.03\)\]"/,
  ': "bg-zinc-800/95 border-white/10 shadow-[0_8px_30px_-4px_rgba(255,255,255,0.03)]"'
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Done restoring highlight section borders');
