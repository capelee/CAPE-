const fs = require('fs');
const filePath = 'src/components/CatFortuneTeller.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// Remove leftover particle generation loops
const removeRegex1 = /\/\/ 5\. 產生搖鈴時的細微靈性光芒粒子 與 「吉、大吉、中吉」等隨機浮動文字粒子[\s\S]*?const glowParticles[^;]+;\n/s;
content = content.replace(removeRegex1, '');

const removeRegex2 = /\/\/ 產生祈福輕微粒子 與 浮動吉運文字[\s\S]*?const glowParticles[^;]+;\n/s;
content = content.replace(removeRegex2, '');

const removeRegex3 = /const textParticles = Array.from[^;]+;\n/s;
content = content.replace(removeRegex3, '');

const removeRegex4 = /const burstParticles[^;]+;\n/sg;
content = content.replace(removeRegex4, '');

fs.writeFileSync(filePath, content, 'utf8');
console.log('Done cleaning up loops');
