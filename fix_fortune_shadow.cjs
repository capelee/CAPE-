const fs = require('fs');
const filePath = 'src/components/CatFortuneTeller.tsx';
let content = fs.readFileSync(filePath, 'utf8');

content = content.replace('className="origin-top drop-shadow-[0_12px_24px_rgba(40,30,20,0.18)]"', 'className="origin-top"');

fs.writeFileSync(filePath, content, 'utf8');
console.log('Done removing drop-shadow');
