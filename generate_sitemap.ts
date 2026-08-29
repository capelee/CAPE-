import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Define __dirname equivalent for ES Modules / tsx context
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function generateSitemap() {
  let items: any[] = [];
  let categories: string[] = [];
  const baseUrl = 'https://cape-eight.vercel.app';
  const currentDate = new Date().toISOString().split('T')[0];

  console.log('Starting robust sitemap generation...');

  // Step 1: Try importing data.ts dynamically (Type-safe and modern)
  try {
    const dataPath = path.join(__dirname, 'src', 'data.ts');
    console.log(`Attempting to dynamically import data from: ${dataPath}`);
    const dataModule = await import('./src/data.ts');
    if (dataModule && dataModule.initialPortfolioData) {
      items = dataModule.initialPortfolioData;
      console.log(`Successfully imported ${items.length} items via tsx dynamic import.`);
    } else {
      throw new Error('initialPortfolioData is not exported or empty in data.ts');
    }
  } catch (importErr: any) {
    console.warn('⚠️ Dynamic import failed. Falling back to robust string parsing. Error:', importErr.message || importErr);

    // Step 2: Fallback to string extraction & eval if import failed (e.g. syntax/type errors in data.ts)
    try {
      const filePath = path.join(__dirname, 'src', 'data.ts');
      const content = fs.readFileSync(filePath, 'utf8');
      const startIndex = content.indexOf('[');
      const endIndex = content.lastIndexOf(']');
      if (startIndex !== -1 && endIndex !== -1) {
        const arrayStr = content.substring(startIndex, endIndex + 1);
        // Clean up any trailing code or comments safely
        items = Function(`return ${arrayStr}`)();
        console.log(`Successfully parsed ${items.length} items via string extraction fallback.`);
      } else {
        throw new Error('Could not locate array brackets [] in data.ts');
      }
    } catch (parseErr: any) {
      console.error('❌ Robust string parsing also failed. Error:', parseErr.message || parseErr);
      console.warn('⚠️ Falling back to minimal static sitemap to prevent Vercel build crash.');
      items = [];
    }
  }

  // Extract unique categories safely
  if (items && items.length > 0) {
    categories = Array.from(new Set(items.map((i: any) => i.category))).filter(Boolean) as string[];
  } else {
    // Basic fallback categories if we cannot load data.ts at all
    categories = [
      '影音與多媒體設計',
      '賣場Banner橫幅廣告',
      '角色IP&插畫與貼圖',
      '品牌識別CIS設計',
      '書籍裝幀與排版',
      '包裝設計',
      '網頁與UIUX設計',
      '周邊商品與印務'
    ];
  }

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n`;

  // 1. Root URL (Highest priority)
  xml += `  <url>\n`;
  xml += `    <loc>${baseUrl}/</loc>\n`;
  xml += `    <lastmod>${currentDate}</lastmod>\n`;
  xml += `    <changefreq>daily</changefreq>\n`;
  xml += `    <priority>1.0</priority>\n`;
  xml += `  </url>\n`;

  // 2. Category URLs
  categories.forEach(cat => {
    xml += `  <url>\n`;
    xml += `    <loc>${baseUrl}/?category=${encodeURIComponent(cat)}</loc>\n`;
    xml += `    <lastmod>${currentDate}</lastmod>\n`;
    xml += `    <changefreq>weekly</changefreq>\n`;
    xml += `    <priority>0.8</priority>\n`;
    xml += `  </url>\n`;
  });

  // 3. Individual Project / Item URLs (only if items were successfully parsed)
  if (items && items.length > 0) {
    items.forEach((item: any) => {
      if (!item || !item.id) return;
      const isFlagship = item.id === 'mumao-cat-religion-ip' || item.isHighlight;
      const priority = item.id === 'mumao-cat-religion-ip' ? '0.9' : (item.isHighlight ? '0.8' : '0.7');
      const changefreq = isFlagship ? 'weekly' : 'monthly';

      xml += `  <url>\n`;
      xml += `    <loc>${baseUrl}/?item=${encodeURIComponent(item.id)}</loc>\n`;
      xml += `    <lastmod>${currentDate}</lastmod>\n`;
      xml += `    <changefreq>${changefreq}</changefreq>\n`;
      xml += `    <priority>${priority}</priority>\n`;

      if (item.imageUrl) {
        let rawImg = (item.imageUrl || '').trim();
        if (rawImg.startsWith('/')) {
          rawImg = `${baseUrl}${rawImg}`;
        } else if (!rawImg.startsWith('http://') && !rawImg.startsWith('https://')) {
          rawImg = `${baseUrl}/${rawImg}`;
        }
        const safeImg = rawImg.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
        const safeTitle = (item.title || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
        xml += `    <image:image>\n`;
        xml += `      <image:loc>${safeImg}</image:loc>\n`;
        xml += `      <image:title>${safeTitle}</image:title>\n`;
        xml += `    </image:image>\n`;
      }
      xml += `  </url>\n`;
    });
  }

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

  console.log(`✅ Successfully generated sitemap.xml with ${items.length} items and ${categories.length} categories!`);
}

generateSitemap().catch(err => {
  console.error('💥 Fatal error in sitemap generator:', err);
});
