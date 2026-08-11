import express from "express";
import path from "path";
import fs from "fs";
import { sanitizePortfolioItem } from "./src/utils";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "50mb" }));

// Helper to check if GEMINI_API_KEY is configured
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is required");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build"
      }
    }
  });
}

// Helper to fetch the image and return base64 data & mimeType
async function fetchImageBuffer(url: string): Promise<{ data: string; mimeType: string } | null> {
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
      },
      timeout: 10000
    } as any);
    
    if (!response.ok) {
      console.warn(`Failed to fetch image: ${url}, status: ${response.status}`);
      return null;
    }
    
    const contentType = response.headers.get("content-type") || "image/jpeg";
    const mimeType = contentType.split(";")[0];
    
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    return {
      data: buffer.toString("base64"),
      mimeType
    };
  } catch (error) {
    console.error(`Error fetching image buffer from ${url}:`, error);
    return null;
  }
}

// Function to read latest portfolio data directly from file to bypass Cache
function getLatestPortfolioData(): any[] {
  try {
    const filePath = path.join(process.cwd(), "src", "data.ts");
    const content = fs.readFileSync(filePath, "utf8");
    const startIndex = content.indexOf("[");
    const endIndex = content.lastIndexOf("]");
    if (startIndex === -1 || endIndex === -1) return [];
    const arrayStr = content.substring(startIndex, endIndex + 1);
    const data = Function(`return ${arrayStr}`)();
    return data;
  } catch (err) {
    console.error("Error reading portfolio data:", err);
    return [];
  }
}

// Function to update a single item's philosophy in data.ts surgically
function updatePhilosophyInFile(filePath: string, itemId: string, newPhilosophy: string): boolean {
  try {
    const content = fs.readFileSync(filePath, "utf8");
    
    // Find the item block start
    const idPattern = new RegExp(`"id"\\s*:\\s*"${itemId}"`);
    const idMatch = content.match(idPattern);
    if (!idMatch || idMatch.index === undefined) {
      return false;
    }
    
    const idIndex = idMatch.index;
    
    // Search forward from idIndex for the "philosophy" field
    const nextCloseBrace = content.indexOf("}", idIndex);
    if (nextCloseBrace === -1) return false;
    
    const itemBlock = content.substring(idIndex, nextCloseBrace);
    const philPattern = /"philosophy"\s*:\s*"([^"\\]*(?:\\.[^"\\]*)*)"/;
    const philMatch = itemBlock.match(philPattern);
    
    if (!philMatch || philMatch.index === undefined) {
      return false;
    }
    
    const originalLine = philMatch[0];
    const escapedPhilosophy = newPhilosophy.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
    const newLine = `"philosophy": "${escapedPhilosophy}"`;
    
    const absolutePhilIndex = idIndex + philMatch.index;
    const before = content.substring(0, absolutePhilIndex);
    const after = content.substring(absolutePhilIndex + originalLine.length);
    
    const updatedContent = before + newLine + after;
    fs.writeFileSync(filePath, updatedContent, "utf8");
    return true;
  } catch (error) {
    console.error("Error updating philosophy in file:", error);
    return false;
  }
}

// System instruction for consistent design auditing and optimization
const systemInstruction = `
你是一位極致挑剔、追求視覺美學與敘事一致性的資深品牌設計總監。
你的任務是進行「設計理念一致性稽核」，自動比對作品的『設計理念』文本內容與作品的『視覺影像特徵』。

請嚴格遵守以下稽核與優化原則：

1. 影像分析與特徵關鍵字生成：
   - 仔細觀察並辨識提供的作品圖片（若無法提供圖片，則根據作品名稱、類別和技術工具進行合理的設計推導）。
   - 提取 5-8 個高度客觀、描述性的「視覺特徵關鍵字」（如：結構化色塊、不對稱排版、低飽和色調、無襯線展示體、手繪線條質感、高對比、點線面網格）。

2. 語意分歧檢測 (Semantic Discrepancy Detection)：
   - 比對現有的「設計理念」與「圖片視覺/關鍵字」。
   - 檢查理念中提到的專業設計手法（如「不對稱網格」、「雙語對照排版」、「粗獷主義」、「高明度高飽和色塊」）在圖中是否「真實存在」且「高度契合」。
   - 若理念提及了圖中根本沒有的元素（例如：理念說採用「不對稱網格與雙語排版」，但圖中是完全對稱、純中文的簡單Logo），或是出現了明顯的語意違和，則判定為「語意分歧 (discrepancy: true)」。
   - 若內容完全脗合且設計理念非常契合視覺，則判定為「語意一致 (discrepancy: false)」。

3. 設計理念優化 (Philosophy Optimization) — 僅在 discrepancy 為 true 或 needsOptimization 為 true 時進行，或當用戶要求強制優化時：
   - 重新撰寫符合該作品真實視覺呈現的「設計理念」。
   - **字數限制（極度重要）**：字數必須「嚴格控制在 45 至 80 字之間」，在任何情況下都「絕對不可超過 100 字」（含標點符號）。
   - **無自我提及 / 開頭冗餘**：嚴禁開頭使用「本專案為...」、「本專案以...」、「本作品是...」、「設計理念是...」、「此設計專為...」、「我們希望呈現...」等贅語。必須直接從核心設計手法、視覺構成元素、排版網格切入。
   - **全面去行銷化（極度重要）**：徹底刪除所有主觀、浮誇、推銷性質的修飾詞（例如：極致、奢華、尊榮、高端、精品級、頂級、完美、強烈、無比、獨特、精心、科幻、暖心、美輪美奐、匠心獨運、完美融合、令人驚艷、不二之舉等）。
   - **語系要求**：一律使用「繁體中文（台灣）」，符合台灣本地主流設計美學語彙。

請輸出 JSON 格式的稽核報告。
`;

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    visualKeywords: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "從影像特徵中提取的 5-8 個專業視覺特徵關鍵字"
    },
    visualDescription: {
      type: Type.STRING,
      description: "對作品影像或設計特徵的 1-2 句客觀、精確描述"
    },
    discrepancy: {
      type: Type.BOOLEAN,
      description: "現有設計理念與實際視覺特徵/關鍵字之間是否存在語意分歧或不合理敘述"
    },
    discrepancyReason: {
      type: Type.STRING,
      description: "若存在分歧，請說明具體原因（例如：理念中提到「雙語排版」但圖片中僅有中文字符；或提及「不對稱網格」但實為置中對稱結構）"
    },
    needsOptimization: {
      type: Type.BOOLEAN,
      description: "是否需要進行設計理念優化"
    },
    optimizedPhilosophy: {
      type: Type.STRING,
      description: "若有分歧或需要優化，請根據作品真實視覺重新撰寫符合所有 AGENTS.md 限制的設計理念（45-80字，去行銷化，無開頭冗餘，繁體中文）。若不需優化，請返回原設計理念。"
    }
  },
  required: [
    "visualKeywords",
    "visualDescription",
    "discrepancy",
    "discrepancyReason",
    "needsOptimization",
    "optimizedPhilosophy"
  ]
};

// Helper to generate dynamic HTML with custom OpenGraph / SEO tags & pre-rendered fallback HTML
function generateSeoHtml(baseHtml: string, req: express.Request): string {
  try {
    const items = getLatestPortfolioData();
    const itemId = (req.query.item || req.query.id || "") as string;
    const categoryParam = (req.query.category || "") as string;

    const baseUrl = "https://cape-eight.vercel.app";
    let title = "Cape Lee 作品集 | 品牌視覺與角色 IP 設計";
    let description = "Cape Lee 5~6 年商業實戰經驗，專注於品牌識別 (CIS)、視覺設計、電商視覺與原創角色 IP 插畫。";
    let imageUrl = "https://drive.google.com/thumbnail?sz=w1200&id=1WGZs1SZI8NTKaF6M_-IpvD5EjGFll3Ri";
    let pageUrl = `${baseUrl}${req.originalUrl || "/"}`;

    let selectedItem: any = null;
    if (itemId) {
      selectedItem = items.find((i: any) => i.id === itemId);
    }

    if (selectedItem) {
      title = `${selectedItem.title} | Cape Lee 品牌視覺與角色 IP 設計作品集`;
      description = selectedItem.philosophy || description;
      imageUrl = selectedItem.imageUrl || imageUrl;
      pageUrl = `${baseUrl}/?item=${encodeURIComponent(selectedItem.id)}`;
    } else if (categoryParam && categoryParam !== "All") {
      switch (categoryParam) {
        case "Logo/CIS":
          title = "Logo/CIS 商業作品集 | Cape Lee 視覺設計";
          description = "收錄 Cape Lee 專屬標誌設計、CIS 企業識別系統與品牌標誌規劃案例。";
          break;
        case "展場 / 擺攤視覺":
          title = "展場與擺攤視覺設計 | Cape Lee 作品集";
          description = "收錄 Cape Lee 展場視覺企劃、擺攤主視覺與實體活動場域視覺設計案例。";
          break;
        case "包裝 / 平面設計":
          title = "包裝與平面視覺設計 | Cape Lee 作品集";
          description = "收錄 Cape Lee 品牌包裝設計、印刷物排版與質感平面設計專案。";
          break;
        case "電商 / 廣告視覺":
          title = "電商與廣告視覺行銷 | Cape Lee 作品集";
          description = "精選 Cape Lee 電商 Banner、廣告主視覺與高轉換率視覺行銷設計。";
          break;
        case "IP / 角色插畫":
          title = "原創 IP 與角色插畫 | Cape Lee 作品集";
          description = "探索 Cape Lee 原創角色 IP 創作、吉祥物插畫與視覺角色設計專案。";
          break;
        case "影音 / 動畫":
          title = "影音與動態視覺設計 | Cape Lee 作品集";
          description = "展示 Cape Lee 影音後製、動態視覺 (Motion Design) 與動畫剪輯案例。";
          break;
        case "亮點設計":
          title = "精選亮點設計作品 | Cape Lee 作品集";
          description = "精選 Cape Lee 歷年具代表性的商業品牌識別與創作者亮點作品。";
          break;
        default:
          title = `${categoryParam} 系列作品 | Cape Lee 視覺設計作品集`;
          description = `探索 Cape Lee 的 ${categoryParam} 商業作品與設計提案，展現高質感與視覺原創美學。`;
          break;
      }
      pageUrl = `${baseUrl}/?category=${encodeURIComponent(categoryParam)}`;
    }

    // Escape helper for safe attribute injection
    const esc = (str: string) => (str || "").replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

    let html = baseHtml;
    // 1. Replace Title
    html = html.replace(/<title>.*?<\/title>/gi, `<title>${esc(title)}</title>`);
    html = html.replace(/<meta\s+name="title"\s+content=".*?"\s*\/?>/gi, `<meta name="title" content="${esc(title)}" />`);

    // 2. Replace Description
    html = html.replace(/<meta\s+name="description"\s+content=".*?"\s*\/?>/gi, `<meta name="description" content="${esc(description)}" />`);

    // 3. Replace Canonical
    html = html.replace(/<link\s+rel="canonical"\s+href=".*?"\s*\/?>/gi, `<link rel="canonical" href="${pageUrl}" />`);

    // 4. Replace OpenGraph
    html = html.replace(/<meta\s+property="og:title"\s+content=".*?"\s*\/?>/gi, `<meta property="og:title" content="${esc(title)}" />`);
    html = html.replace(/<meta\s+property="og:description"\s+content=".*?"\s*\/?>/gi, `<meta property="og:description" content="${esc(description)}" />`);
    html = html.replace(/<meta\s+property="og:image"\s+content=".*?"\s*\/?>/gi, `<meta property="og:image" content="${imageUrl}" />`);
    html = html.replace(/<meta\s+property="og:url"\s+content=".*?"\s*\/?>/gi, `<meta property="og:url" content="${pageUrl}" />`);

    // Ensure or inject og:image:secure_url, width, height, alt
    if (html.includes('property="og:image:secure_url"')) {
      html = html.replace(/<meta\s+property="og:image:secure_url"\s+content=".*?"\s*\/?>/gi, `<meta property="og:image:secure_url" content="${imageUrl}" />`);
    } else {
      html = html.replace('</head>', `  <meta property="og:image:secure_url" content="${imageUrl}" />\n</head>`);
    }
    if (html.includes('property="og:image:width"')) {
      html = html.replace(/<meta\s+property="og:image:width"\s+content=".*?"\s*\/?>/gi, `<meta property="og:image:width" content="1200" />`);
    } else {
      html = html.replace('</head>', `  <meta property="og:image:width" content="1200" />\n</head>`);
    }
    if (html.includes('property="og:image:height"')) {
      html = html.replace(/<meta\s+property="og:image:height"\s+content=".*?"\s*\/?>/gi, `<meta property="og:image:height" content="630" />`);
    } else {
      html = html.replace('</head>', `  <meta property="og:image:height" content="630" />\n</head>`);
    }
    if (html.includes('property="og:image:alt"')) {
      html = html.replace(/<meta\s+property="og:image:alt"\s+content=".*?"\s*\/?>/gi, `<meta property="og:image:alt" content="${esc(title)}" />`);
    } else {
      html = html.replace('</head>', `  <meta property="og:image:alt" content="${esc(title)}" />\n</head>`);
    }

    // 5. Replace Twitter
    html = html.replace(/<meta\s+property="twitter:title"\s+content=".*?"\s*\/?>/gi, `<meta property="twitter:title" content="${esc(title)}" />`);
    html = html.replace(/<meta\s+property="twitter:description"\s+content=".*?"\s*\/?>/gi, `<meta property="twitter:description" content="${esc(description)}" />`);
    html = html.replace(/<meta\s+property="twitter:image"\s+content=".*?"\s*\/?>/gi, `<meta property="twitter:image" content="${imageUrl}" />`);
    html = html.replace(/<meta\s+property="twitter:url"\s+content=".*?"\s*\/?>/gi, `<meta property="twitter:url" content="${pageUrl}" />`);

    // 5.5. Inject SSR BreadcrumbList JSON-LD
    const breadcrumbItems: any[] = [
      {
        "@type": "ListItem",
        position: 1,
        name: "Cape Lee 作品集",
        item: `${baseUrl}/`
      }
    ];

    if (selectedItem) {
      const catName = selectedItem.category || "作品分類";
      breadcrumbItems.push({
        "@type": "ListItem",
        position: 2,
        name: catName,
        item: `${baseUrl}/?category=${encodeURIComponent(catName)}`
      });
      breadcrumbItems.push({
        "@type": "ListItem",
        position: 3,
        name: selectedItem.title,
        item: pageUrl
      });
    } else if (categoryParam && categoryParam !== "All") {
      breadcrumbItems.push({
        "@type": "ListItem",
        position: 2,
        name: categoryParam,
        item: pageUrl
      });
    }

    const breadcrumbJsonLd = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": breadcrumbItems
    });

    if (html.includes('id="json-ld-breadcrumb"')) {
      html = html.replace(/<script\s+id="json-ld-breadcrumb"\s+type="application\/ld\+json">.*?<\/script>/gis, `<script id="json-ld-breadcrumb" type="application/ld+json">${breadcrumbJsonLd}</script>`);
    } else {
      html = html.replace('</head>', `  <script id="json-ld-breadcrumb" type="application/ld+json">${breadcrumbJsonLd}</script>\n</head>`);
    }

    // 6. Inject pre-rendered semantic HTML inside <div id="root"></div> for crawlers
    let prerenderContent = "";
    if (selectedItem) {
      prerenderContent = `
        <div style="padding: 24px; font-family: sans-serif; max-width: 900px; margin: 0 auto; color: #1e293b; background: #ffffff;">
          <nav style="margin-bottom: 20px;"><a href="${baseUrl}" style="color: #2563eb; text-decoration: none;">← 返回 Cape Lee 作品集首頁</a></nav>
          <article>
            <span style="font-size: 14px; color: #64748b; font-weight: bold;">${esc(selectedItem.category)}</span>
            <h1 style="font-size: 28px; margin: 10px 0;">${esc(selectedItem.title)}</h1>
            ${selectedItem.titleEn ? `<h2 style="font-size: 18px; color: #64748b; margin-bottom: 15px;">${esc(selectedItem.titleEn)}</h2>` : ""}
            <div style="margin: 20px 0;">
              <img src="${selectedItem.imageUrl}" alt="${esc(selectedItem.title)}" style="max-width: 100%; height: auto; border-radius: 8px;" />
            </div>
            <section style="margin-top: 20px;">
              <h3 style="font-size: 20px; color: #0f172a;">設計理念</h3>
              <p style="font-size: 16px; line-height: 1.7; color: #334155;">${esc(selectedItem.philosophy)}</p>
            </section>
            ${selectedItem.tools && selectedItem.tools.length ? `<p style="margin-top: 15px; font-size: 14px; color: #475569;"><strong>使用工具 / 技術手法：</strong> ${selectedItem.tools.map(esc).join(", ")}</p>` : ""}
            ${selectedItem.link ? `<p style="margin-top: 15px;"><a href="${selectedItem.link}" target="_blank" rel="noopener noreferrer" style="color: #2563eb;">外部專案連結</a></p>` : ""}
          </article>
        </div>
      `;
    } else {
      const topItems = items.slice(0, 30);
      prerenderContent = `
        <div style="padding: 24px; font-family: sans-serif; max-width: 1000px; margin: 0 auto; color: #1e293b; background: #ffffff;">
          <header style="margin-bottom: 30px; border-bottom: 2px solid #e2e8f0; padding-bottom: 20px;">
            <h1 style="font-size: 32px; color: #0f172a; margin-bottom: 10px;">Cape Lee 作品集 | 品牌視覺與角色 IP 設計</h1>
            <p style="font-size: 16px; color: #475569; line-height: 1.6;">Cape Lee 5~6 年商業實戰經驗，專注於品牌識別 (CIS)、視覺設計、電商視覺與原創角色 IP 插畫。</p>
          </header>
          <main>
            <section>
              <h2 style="font-size: 22px; color: #1e293b; margin-bottom: 15px;">精選商業設計作品 (${items.length} 項專案)</h2>
              <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px;">
                ${topItems.map((item: any) => `
                  <article style="border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; background: #f8fafc;">
                    <span style="font-size: 12px; color: #64748b; font-weight: bold;">${esc(item.category)}</span>
                    <h3 style="font-size: 18px; margin: 8px 0;"><a href="${baseUrl}/?item=${encodeURIComponent(item.id)}" style="color: #0f172a; text-decoration: none;">${esc(item.title)}</a></h3>
                    <p style="font-size: 14px; color: #475569; line-height: 1.5; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;">${esc(item.philosophy)}</p>
                  </article>
                `).join("")}
              </div>
            </section>
          </main>
        </div>
      `;
    }

    html = html.replace('<div id="root"></div>', `<div id="root">${prerenderContent}</div>`);
    return html;
  } catch (e) {
    console.error("Error generating SEO HTML:", e);
    return baseHtml;
  }
}

app.get("/robots.txt", (req, res) => {
  res.type("text/plain");
  res.send(`User-agent: *\nAllow: /\nSitemap: https://cape-eight.vercel.app/sitemap.xml\n`);
});

app.get("/sitemap.xml", (req, res) => {
  try {
    const items = getLatestPortfolioData();
    const baseUrl = "https://cape-eight.vercel.app";
    const categories = Array.from(new Set(items.map((i: any) => i.category))).filter(Boolean);

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n`;

    // Root URL
    xml += `  <url>\n    <loc>${baseUrl}/</loc>\n    <changefreq>daily</changefreq>\n    <priority>1.0</priority>\n  </url>\n`;

    // Category URLs
    categories.forEach((cat: any) => {
      xml += `  <url>\n    <loc>${baseUrl}/?category=${encodeURIComponent(cat)}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
    });

    // Individual Item URLs with Image Sitemap tags
    items.forEach((item: any) => {
      xml += `  <url>\n`;
      xml += `    <loc>${baseUrl}/?item=${encodeURIComponent(item.id)}</loc>\n`;
      xml += `    <changefreq>monthly</changefreq>\n`;
      xml += `    <priority>0.7</priority>\n`;
      if (item.imageUrl) {
        const safeImg = item.imageUrl.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        const safeTitle = (item.title || "").replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        xml += `    <image:image>\n`;
        xml += `      <image:loc>${safeImg}</image:loc>\n`;
        xml += `      <image:title>${safeTitle}</image:title>\n`;
        xml += `    </image:image>\n`;
      }
      xml += `  </url>\n`;
    });

    xml += `</urlset>`;

    res.header("Content-Type", "application/xml");
    res.send(xml);
  } catch (err: any) {
    res.status(500).send("Error generating sitemap");
  }
});

app.get("/api/portfolio", (req, res) => {
  try {
    // Explicitly disable any caching on client, CDN, and browser levels
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
    res.setHeader("Surrogate-Control", "no-store");
    
    const rawData = getLatestPortfolioData();
    const data = rawData.map(sanitizePortfolioItem);
    res.json({ success: true, data });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post("/api/audit-item", async (req, res) => {
  try {
    const { item, forceOptimize } = req.body;
    if (!item) {
      return res.status(400).json({ success: false, error: "Missing item data" });
    }

    const ai = getGeminiClient();
    
    // Fetch image if present
    let imagePart: any = null;
    if (item.imageUrl) {
      const imgBuffer = await fetchImageBuffer(item.imageUrl);
      if (imgBuffer) {
        imagePart = {
          inlineData: {
            data: imgBuffer.data,
            mimeType: imgBuffer.mimeType
          }
        };
      }
    }

    const contents: any[] = [];
    if (imagePart) {
      contents.push(imagePart);
    }
    
    const promptText = `
作品 ID: ${item.id}
分類: ${item.category}
中文名稱: ${item.title}
英文名稱: ${item.titleEn}
現有設計理念: ${item.philosophy}
所用技術工具: ${item.tools?.join(", ") || ""}
圖片網址: ${item.imageUrl || "無"}

請執行設計理念與視覺特徵的比對稽核。${forceOptimize ? "【請注意：使用者要求強制重新優化設計理念，請務必重新生成最完美的理念文案。】" : ""}
`;
    contents.push(promptText);

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema
      }
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error("Empty response from Gemini API");
    }

    const auditReport = JSON.parse(resultText);
    res.json({ success: true, report: auditReport });
  } catch (err: any) {
    console.error("Audit item error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post("/api/save-philosophy", (req, res) => {
  try {
    const { itemId, newPhilosophy } = req.body;
    if (!itemId || !newPhilosophy) {
      return res.status(400).json({ success: false, error: "Missing itemId or newPhilosophy" });
    }

    const filePath = path.join(process.cwd(), "src", "data.ts");
    
    // Auto-sanitize philosophy using the rules in src/utils.ts before saving
    const dummyItem = {
      id: itemId,
      category: "",
      title: "",
      titleEn: "",
      philosophy: newPhilosophy,
      tools: [],
      imageUrl: "",
      placeholderId: "",
      colorTheme: ""
    };
    const sanitizedItem = sanitizePortfolioItem(dummyItem);
    const sanitizedPhilosophy = sanitizedItem.philosophy;

    const success = updatePhilosophyInFile(filePath, itemId, sanitizedPhilosophy);
    
    if (success) {
      res.json({ success: true, message: `Successfully updated philosophy for ${itemId}` });
    } else {
      res.status(404).json({ success: false, error: `Item with ID ${itemId} not found or update failed` });
    }
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Start server async function to integrate Vite
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });

    app.use(async (req, res, next) => {
      // Intercept root/HTML requests to serve dynamically transformed SEO HTML
      if (req.method === "GET" && (req.headers.accept || "").includes("text/html") && !req.path.startsWith("/api") && !req.path.includes(".")) {
        try {
          const rawHtml = fs.readFileSync(path.join(process.cwd(), "index.html"), "utf8");
          const transformedHtml = await vite.transformIndexHtml(req.originalUrl, rawHtml);
          const seoHtml = generateSeoHtml(transformedHtml, req);
          res.status(200).set({ "Content-Type": "text/html" }).end(seoHtml);
          return;
        } catch (e) {
          vite.ssrFixStacktrace(e as Error);
          next(e);
          return;
        }
      }
      next();
    });

    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath, { index: false }));
    app.get("*", (req, res) => {
      const indexPath = path.join(distPath, "index.html");
      if (fs.existsSync(indexPath)) {
        const rawHtml = fs.readFileSync(indexPath, "utf8");
        const seoHtml = generateSeoHtml(rawHtml, req);
        res.status(200).set({ "Content-Type": "text/html" }).end(seoHtml);
      } else {
        res.status(404).send("index.html not found");
      }
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
