const fs = require('fs');
const filePath = 'src/components/PortfolioCard.tsx';
let content = fs.readFileSync(filePath, 'utf8');

content = content.replace(
  /\{\/\* 背景霓虹光澤 \*\/\}\s*<div className=\{`absolute inset-0 bg-gradient-to-t \$\{\s*isSepia\s*\? "from-\[#433422\]\/90 via-\[#433422\]\/15 to-transparent"\s*: "from-black\/85 via-black\/10 to-transparent"\s*\}\`\><\/div>/g,
  ''
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Done removing bottom gradient');
