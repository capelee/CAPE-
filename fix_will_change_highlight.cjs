const fs = require('fs');
const filePath = 'src/App.tsx';
let content = fs.readFileSync(filePath, 'utf8');

content = content.replace(
  'className="relative min-h-[200px] sm:min-h-[220px] lg:min-h-[240px] w-full group h-full"',
  'className="relative min-h-[200px] sm:min-h-[220px] lg:min-h-[240px] w-full group h-full will-change-transform transform-gpu"'
);

content = content.replace(
  'className="w-full h-full relative cursor-pointer"',
  'className="w-full h-full relative cursor-pointer will-change-transform transform-gpu"'
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Done fixing will-change in App.tsx');
