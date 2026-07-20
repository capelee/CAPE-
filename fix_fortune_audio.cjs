const fs = require('fs');
const filePath = 'src/components/CatFortuneTeller.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// Delay audio execution slightly to prevent blocking the main thread during React state updates and animation mount
content = content.replace('playSuzuBellSound();\n    playMokugyoAndTempleBellSound();', 'setTimeout(() => { playSuzuBellSound(); playMokugyoAndTempleBellSound(); }, 20);');
content = content.replace('playSuzuBellSound();\n      playMokugyoAndTempleBellSound();', 'setTimeout(() => { playSuzuBellSound(); playMokugyoAndTempleBellSound(); }, 20);');
content = content.replace('playCanOpenSound();', 'setTimeout(() => { playCanOpenSound(); }, 20);');

fs.writeFileSync(filePath, content, 'utf8');
console.log('Done delaying audio');
