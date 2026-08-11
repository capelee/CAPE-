const fs = require('fs');
const path = require('path');

try {
  const filePath = path.join(__dirname, 'src', 'data.ts');
  const content = fs.readFileSync(filePath, 'utf8');
  const startIndex = content.indexOf('[');
  const endIndex = content.lastIndexOf(']');
  if (startIndex === -1 || endIndex === -1) {
    console.error('Could not parse data.ts');
    process.exit(1);
  }
  const arrayStr = content.substring(startIndex, endIndex + 1);
  const items = Function(`return ${arrayStr}`)();

  const baseUrl = 'https://cape-eight.vercel.app';
  const categories = Array.from(new Set(items.map(i => i.category))).filter(Boolean);

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n`;

  // Root URL
  xml += `  <url>\n    <loc>${baseUrl}/</loc>\n    <changefreq>daily</changefreq>\n    <priority>1.0</priority>\n  </url>\n`;

  // Category URLs
  categories.forEach(cat => {
    xml += `  <url>\n    <loc>${baseUrl}/?category=${encodeURIComponent(cat)}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
  });

  // Individual Item URLs
  items.forEach(item => {
    xml += `  <url>\n`;
    xml += `    <loc>${baseUrl}/?item=${encodeURIComponent(item.id)}</loc>\n`;
    xml += `    <changefreq>monthly</changefreq>\n`;
    xml += `    <priority>0.7</priority>\n`;
    if (item.imageUrl) {
      const safeImg = (item.imageUrl || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      const safeTitle = (item.title || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      xml += `    <image:image>\n`;
      xml += `      <image:loc>${safeImg}</image:loc>\n`;
      xml += `      <image:title>${safeTitle}</image:title>\n`;
      xml += `    </image:image>\n`;
    }
    xml += `  </url>\n`;
  });

  xml += `</urlset>`;

  if (!fs.existsSync(path.join(__dirname, 'public'))) {
    fs.mkdirSync(path.join(__dirname, 'public'));
  }

  fs.writeFileSync(path.join(__dirname, 'public', 'sitemap.xml'), xml, 'utf8');

  // Also write to dist if it exists
  const distDir = path.join(__dirname, 'dist');
  if (fs.existsSync(distDir)) {
    fs.writeFileSync(path.join(distDir, 'sitemap.xml'), xml, 'utf8');
  }

  console.log(`Successfully generated sitemap.xml with ${items.length} items!`);
} catch (err) {
  console.error('Error generating sitemap:', err);
}
