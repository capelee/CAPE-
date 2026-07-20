const fs = require('fs');
const filePath = 'src/components/CatFortuneTeller.tsx';
let content = fs.readFileSync(filePath, 'utf8');

content = content.replace(/const speed = 25 \+ Math\.random\(\) \* 30;[\s\S]*?\}\);/g, '');
content = content.replace(/const speed = 40 \+ Math\.random\(\) \* 60;[\s\S]*?\}\);/g, '');
content = content.replace(/const speed = 20 \+ Math\.random\(\) \* 25;[\s\S]*?\}\);/g, '');
content = content.replace(/const speed = 35 \+ Math\.random\(\) \* 45;[\s\S]*?\}\);/g, '');

fs.writeFileSync(filePath, content, 'utf8');
console.log('Done fixing syntax');
