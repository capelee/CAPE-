const fs = require('fs');
const filePath = 'src/components/PortfolioCard.tsx';
let content = fs.readFileSync(filePath, 'utf8');

content = content.replace(
  /"bg-\[#FCF5E3\] bg-gradient-to-b from-\[#FCF5E3\] to-\[#EDE2CA\] border-\[2\.5px\] border-amber-600 hover:border-amber-700"/g,
  '"bg-[#FCF5E3] bg-gradient-to-b from-[#FCF5E3] to-[#EDE2CA]"'
);

content = content.replace(
  /"bg-\[#FCF8EE\] bg-gradient-to-b from-\[#FCF8EE\] via-\[#FCF8EE\] to-\[#FAF4E5\] border-\[2\.5px\] border-amber-500 hover:border-amber-600"/g,
  '"bg-[#FCF8EE] bg-gradient-to-b from-[#FCF8EE] via-[#FCF8EE] to-[#FAF4E5]"'
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Done fixing highlight card borders in PortfolioCard.tsx');
