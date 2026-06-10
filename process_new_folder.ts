import { GoogleGenAI } from "@google/genai";
import fetch from "node-fetch";
import sharp from "sharp";
import fs from "fs";
import path from "path";

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error("No API key found in GEMINI_API_KEY!");
  process.exit(1);
}

const ai = new GoogleGenAI({
  apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

const TARGET_IDS = [
  '18ehqP0aO2_4ngzVfkpSTzcEgkCbYOaxA',
  '1jsO0BJhRYjpGr3DQINVQURtaVk9KiTCn',
  '17pfLakFXOq1ZunpHVtWQa1YB39qGcc84',
  '1pI1t1H4AM8bdCdLtUMhKjvW-lBeZ5Ti-',
  '1hyuxMJuZ904h7stGaQAzHZCRPSB0NB0D',
  '1E-RYT731eF0zaaP-_K-M5ELTwOcXs4qq',
  '1nBlca9c4-38iVAi4nkTK4Ukrj1Ywxwuy'
];

async function run() {
  const outDir = "public/images/optimized";
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const results: any[] = [];

  for (let i = 0; i < TARGET_IDS.length; i++) {
    const id = TARGET_IDS[i];
    const url = `https://lh3.googleusercontent.com/d/${id}`;
    const outFile = path.join(outDir, `${id}.webp`);
    console.log(`[${i + 1}/${TARGET_IDS.length}] Processing ${id}...`);

    try {
      // 1. Download
      const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }
      const arrayBuffer = await res.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      console.log(`  -> Downloaded ${buffer.length} bytes.`);

      // 2. Compress with Sharp
      const compressed = await sharp(buffer)
        .resize({ width: 1200, height: 1200, fit: "inside", withoutEnlargement: true })
        .webp({ quality: 80 })
        .toBuffer();
      fs.writeFileSync(outFile, compressed);
      console.log(`  -> Compressed original to WebP: ${Math.round(compressed.length / 1024)}KB`);

      // 3. Analyze with Gemini
      const base64Data = buffer.toString("base64");
      console.log(`  -> Describing using gemini-3.5-flash...`);
      const genResponse = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: [
          {
            inlineData: {
              data: base64Data,
              mimeType: "image/jpeg"
            }
          },
          `你是一位專業的電商視覺設計師。請以繁體中文分析此張「溫太醫草本潤喉珠」電商圖文影像，並給出以下JSON結構（僅輸出 JSON 模組塊，不要其他任何 markdown 解釋，以便我們程式化解析）：
{
  "title": "一小段簡短且精確的此張圖或海報之排版主題（10字以內）",
  "isMainImage": false, (如果是長版詳情頁中某一細節段落，或者若是主宣傳Banner，請判斷是否適合當主圖)
  "description": "2-3句針對此張圖詳細設計、排版、中藥草本元素、文案重點等精確之描述"
}`
        ]
      });

      const text = genResponse.text?.trim() || "";
      console.log(`  -> Gemini Output:\n${text}`);
      
      // Attempt to extract JSON from markdown block
      let cleanedJson = text;
      if (text.includes("```json")) {
        cleanedJson = text.split("```json")[1].split("```")[0].trim();
      } else if (text.includes("```")) {
        cleanedJson = text.split("```")[1].split("```")[0].trim();
      }
      
      try {
        const parsed = JSON.parse(cleanedJson);
        results.push({
          id,
          localPath: `/images/optimized/${id}.webp`,
          ...parsed
        });
      } catch (e) {
        console.warn(`  -> Couldn't parse JSON from Gemini. Storing raw output.`);
        results.push({
          id,
          localPath: `/images/optimized/${id}.webp`,
          rawText: text
        });
      }

    } catch (err: any) {
      console.error(`  -> Failed for ${id}:`, err.message);
    }

    // Delay to play nice with Gemini limits
    await new Promise(r => setTimeout(r, 2000));
  }

  // Write out results log so we can read it in the next step
  fs.writeFileSync("processed_new_results.json", JSON.stringify(results, null, 2), "utf-8");
  console.log("Entire processing completed! Output saved to processed_new_results.json.");
}

run();
