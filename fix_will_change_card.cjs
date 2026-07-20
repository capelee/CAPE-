const fs = require('fs');
const filePath = 'src/components/PortfolioCard.tsx';
let content = fs.readFileSync(filePath, 'utf8');

content = content.replace(
  'className="group relative w-full h-full cursor-pointer"',
  'className="group relative w-full h-full cursor-pointer will-change-transform transform-gpu"'
);

content = content.replace(
  'className="relative flex flex-col rounded-2xl w-full h-full"',
  'className="relative flex flex-col rounded-2xl w-full h-full will-change-transform transform-gpu"'
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Done fixing will-change in PortfolioCard.tsx');
