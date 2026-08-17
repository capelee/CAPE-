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
  const currentDate = new Date().toISOString().split('T')[0];
  const categories = Array.from(new Set(items.map(i => i.category))).filter(Boolean);

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n`;

  // Root URL (Highest priority)
  xml += `  <url>\n`;
  xml += `    <loc>${baseUrl}/</loc>\n`;
  xml += `    <lastmod>${currentDate}</lastmod>\n`;
  xml += `    <changefreq>daily</changefreq>\n`;
  xml += `    <priority>1.0</priority>\n`;
  xml += `  </url>\n`;

  // Category URLs
  categories.forEach(cat => {
    xml += `  <url>\n`;
    xml += `    <loc>${baseUrl}/?category=${encodeURIComponent(cat)}</loc>\n`;
    xml += `    <lastmod>${currentDate}</lastmod>\n`;
    xml += `    <changefreq>weekly</changefreq>\n`;
    xml += `    <priority>0.8</priority>\n`;
    xml += `  </url>\n`;
  });

  // Individual Project / Item URLs
  items.forEach(item => {
    const isFlagship = item.id === 'mumao-cat-religion-ip' || item.isHighlight;
    const priority = item.id === 'mumao-cat-religion-ip' ? '0.9' : (item.isHighlight ? '0.8' : '0.7');
    const changefreq = isFlagship ? 'weekly' : 'monthly';

    xml += `  <url>\n`;
    xml += `    <loc>${baseUrl}/?item=${encodeURIComponent(item.id)}</loc>\n`;
    xml += `    <lastmod>${currentDate}</lastmod>\n`;
    xml += `    <changefreq>${changefreq}</changefreq>\n`;
    xml += `    <priority>${priority}</priority>\n`;

    if (item.imageUrl) {
      const safeImg = (item.imageUrl || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
      const safeTitle = (item.title || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
      xml += `    <image:image>\n`;
      xml += `      <image:loc>${safeImg}</image:loc>\n`;
      xml += `      <image:title>${safeTitle}</image:title>\n`;
      xml += `    </image:image>\n`;
    }
    xml += `  </url>\n`;
  });

  xml += `</urlset>`;

  const publicDir = path.join(__dirname, 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), xml, 'utf8');

  // Also write to dist if it exists
  const distDir = path.join(__dirname, 'dist');
  if (fs.existsSync(distDir)) {
    fs.writeFileSync(path.join(distDir, 'sitemap.xml'), xml, 'utf8');
  }

  console.log(`Successfully generated sitemap.xml with ${items.length} items and ${categories.length} categories!`);
} catch (err) {
  console.error('Error generating sitemap:', err);
}

