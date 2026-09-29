const fs = require('fs');
const files = ['src/App.tsx', 'src/data.ts', 'src/components/SEO.tsx', 'src/utils.ts', 'index.html', 'src/components/CategoryButton.tsx', 'src/categoryColors.ts'];
files.forEach(f => {
  if (fs.existsSync(f)) {
    const content = fs.readFileSync(f, 'utf8');
    let idx = -1;
    while ((idx = content.indexOf('亮點設計', idx + 1)) !== -1) {
      console.log(`Found in ${f} at index ${idx}: ${content.substring(Math.max(0, idx - 40), Math.min(content.length, idx + 60))}`);
    }
  }
});
