const fs = require('fs');
const filePath = 'src/components/DesignerBento.tsx';
let content = fs.readFileSync(filePath, 'utf8');

content = content.replace(
    /whileHover=\{\{ x: 4 \}\}/g,
    'initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-10px" }} transition={{ duration: 0.4, delay: i * 0.1 }} whileHover={{ x: 4, transition: { duration: 0.2 } }}'
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Done adding stagger animations to resume');
