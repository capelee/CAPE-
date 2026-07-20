const fs = require('fs');
const filePath = 'src/App.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// Front face
content = content.replace(
  'className={`absolute inset-0 w-full h-full p-5 lg:p-7 rounded-[1.25rem] border backdrop-blur-md flex flex-col justify-start items-start overflow-hidden transition-colors duration-500 ${',
  'className={`absolute inset-0 w-full h-full p-5 lg:p-7 rounded-[1.25rem] backdrop-blur-md flex flex-col justify-start items-start overflow-hidden transition-colors duration-500 ${'
);
content = content.replace(
  '? "bg-[#FCF8EE]/80 border-[#DFCFA0]/50 hover:bg-white shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)]"',
  '? "bg-[#FCF8EE]/80 hover:bg-white shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)]"'
);
content = content.replace(
  '? "bg-white/70 border-zinc-200/60 hover:bg-white shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)]"',
  '? "bg-white/70 hover:bg-white shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)]"'
);
content = content.replace(
  ': "bg-zinc-900/50 border-white/5 hover:bg-zinc-800/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.2)]"',
  ': "bg-zinc-900/50 hover:bg-zinc-800/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.2)]"'
);

// Back face
content = content.replace(
  'className={`absolute inset-0 w-full h-full p-4 sm:p-5 lg:p-6 rounded-[1.25rem] border backdrop-blur-md flex flex-col justify-start items-start overflow-hidden ${',
  'className={`absolute inset-0 w-full h-full p-4 sm:p-5 lg:p-6 rounded-[1.25rem] backdrop-blur-md flex flex-col justify-start items-start overflow-hidden ${'
);
content = content.replace(
  '? "bg-[#FCF8EE]/95 border-[#D0B87A] shadow-[0_8px_30px_-4px_rgba(200,160,100,0.15)]"',
  '? "bg-[#FCF8EE]/95 shadow-[0_8px_30px_-4px_rgba(200,160,100,0.15)]"'
);
content = content.replace(
  '? "bg-white/95 border-zinc-300 shadow-[0_8px_30px_-4px_rgba(0,0,0,0.06)]"',
  '? "bg-white/95 shadow-[0_8px_30px_-4px_rgba(0,0,0,0.06)]"'
);
content = content.replace(
  ': "bg-zinc-800/95 border-white/10 shadow-[0_8px_30px_-4px_rgba(255,255,255,0.03)]"',
  ': "bg-zinc-800/95 shadow-[0_8px_30px_-4px_rgba(255,255,255,0.03)]"'
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Done removing borders');
