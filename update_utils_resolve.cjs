const fs = require('fs');
const filePath = 'src/utils.ts';
let content = fs.readFileSync(filePath, 'utf8');

content = content.replace(
  /export function resolveImageUrl\(url: string, size\?: number\): string \{/,
  'export function resolveImageUrl(url: string, size?: number, format?: "webp" | "avif" | "jpeg"): string {'
);

content = content.replace(
  /urlObj\.searchParams\.set\("auto", "format"\);/,
  'if (format) { urlObj.searchParams.set("fm", format); } else { urlObj.searchParams.set("auto", "format"); }'
);

content = content.replace(
  /return `\$\{baseUrl\}\?w=\$\{s\}&auto=format&fit=crop&q=80`;/,
  'return `${baseUrl}?w=${s}&${format ? `fm=${format}` : "auto=format"}&fit=crop&q=80`;'
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Done updating utils.ts');
