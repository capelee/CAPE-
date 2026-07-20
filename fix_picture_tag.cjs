const fs = require('fs');
const filePath = 'src/components/ImageWithFallback.tsx';
let content = fs.readFileSync(filePath, 'utf8');

content = content.replace(
  /<picture>/g,
  '<picture className="w-full h-full block absolute inset-0">'
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Done fixing picture tag');
