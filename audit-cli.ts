import { GoogleGenAI, Type } from "@google/genai";
import fs from "fs";
import path from "path";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const DATA_FILE_PATH = path.join(process.cwd(), "src", "data.ts");

// Initialize Gemini Client
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("\x1b[31m[錯誤] 未偵測到 GEMINI_API_KEY 環境變數。請在專案根目錄的 .env 檔案中，或在系統後台 Secrets 中設定。\x1b[0m");
    process.exit(1);
  }
  return new GoogleGenAI({ apiKey });
}

// Fetch image buffer & convert to base64
async function fetchImagePart(url: string) {
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
      },
      timeout: 10000
    } as any);
    
    if (!response.ok) {
      console.warn(`\x1b[33m[警告] 無法下載圖片: ${url}，狀態碼: ${response.status}\x1b[0m`);
      return null;
    }
    
    const contentType = response.headers.get("content-type") || "image/jpeg";
    const mimeType = contentType.split(";")[0];
    
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    return {
      inlineData: {
        data: buffer.toString("base64"),
        mimeType
      }
    };
  } catch (error) {
    console.error(`\x1b[33m[警告] 下載圖片時發生錯誤 ${url}:`, error);
    return null;
  }
}

// Parse initialPortfolioData array from src/data.ts
function parsePortfolioData(): any[] {
  try {
    const content = fs.readFileSync(DATA_FILE_PATH, "utf8");
    const startIndex = content.indexOf("[");
    const endIndex = content.lastIndexOf("]");
    if (startIndex === -1 || endIndex === -1) {
      console.error("\x1b[31m[錯誤] 無法解析 data.ts 中的作品陣列格式。\x1b[0m");
      process.exit(1);
    }
    const arrayStr = content.substring(startIndex, endIndex + 1);
    // Safe evaluation
    const data = Function(`return ${arrayStr}`)();
    return data;
  } catch (err) {
    console.error("\x1b[31m[錯誤] 讀取作品資料失敗:\x1b[0m", err);
    process.exit(1);
  }
}

// Surgically replace philosophy field inside src/data.ts
function updatePhilosophyInFile(itemId: string, newPhilosophy: string): boolean {
  try {
    const content = fs.readFileSync(DATA_FILE_PATH, "utf8");
    
    const idPattern = new RegExp(`"id"\\s*:\\s*"${itemId}"`);
    const idMatch = content.match(idPattern);
    if (!idMatch || idMatch.index === undefined) return false;
    
    const idIndex = idMatch.index;
    const nextCloseBrace = content.indexOf("}", idIndex);
    if (nextCloseBrace === -1) return false;
    
    const itemBlock = content.substring(idIndex, nextCloseBrace);
    const philPattern = /"philosophy"\s*:\s*"([^"\\]*(?:\\.[^"\\]*)*)"/;
    const philMatch = itemBlock.match(philPattern);
    
    if (!philMatch || philMatch.index === undefined) return false;
    
    const originalLine = philMatch[0];
    const escapedPhilosophy = newPhilosophy.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
    const newLine = `"philosophy": "${escapedPhilosophy}"`;
    
    const absolutePhilIndex = idIndex + philMatch.index;
    const before = content.substring(0, absolutePhilIndex);
    const after = content.substring(absolutePhilIndex + originalLine.length);
    
    fs.writeFileSync(DATA_FILE_PATH, before + newLine + after, "utf8");
    return true;
  } catch (error) {
    console.error(`\x1b[31m[錯誤] 寫入 data.ts 時發生問題: ${itemId}\x1b[0m`, error);
    return false;
  }
}

// System instructions for visual audit compliance
const systemInstruction = `
你是一位極致挑剔、追求視覺美學與敘事一致性的資深品牌設計總監。
你的任務是進行「設計理念與視覺一致性稽核」，自動比對作品的『設計理念』與其『實際圖片特徵』。

請嚴格遵循以下稽核與優化原則：

1. 影像特徵分析：
   - 仔細觀察並辨識提供的作品圖片。
   - 提取 5-8 個高度客觀、描述性的「視覺特徵關鍵字」（如：結構化色塊、不對稱排版、低飽和色調、無襯線展示體、手繪線條質感、高對比、點線面網格）。

2. 語意分歧檢測 (Semantic Discrepancy Detection)：
   - 比對現有的「設計理念」與「圖片實際視覺」。
   - 檢查理念中提到的專業設計手法（如「不對稱網格」、「雙語對照排版」、「粗獷主義」、「高明度高飽和色塊」）在圖中是否「真實存在」且「高度契合」。
   - 若理念提及了圖中根本沒有的元素，或是出現了明顯的語意違和，則判定為「語意分歧 (discrepancy: true)」。
   - 若內容完全脗合且設計理念非常契合視覺，則判定為「語意一致 (discrepancy: false)」。

3. 設計理念優化 (Philosophy Optimization)：
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
      description: "若存在分歧，請說明具體原因（例如：理念中提到「雙語排版」但圖片中僅有中文字符；或實為置中對稱結構）"
    },
    needsOptimization: {
      type: Type.BOOLEAN,
      description: "是否需要進行設計理念優化"
    },
    optimizedPhilosophy: {
      type: Type.STRING,
      description: "重新撰寫符合所有 AGENTS.md 限制的設計理念（45-80字，去行銷化，無開頭冗餘，繁體中文）。"
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

async function run() {
  console.log("\x1b[35m====================================================\x1b[0m");
  console.log("\x1b[35m       Gemini 3.5 視覺多模態「一致性稽核與智慧修復」工具\x1b[0m");
  console.log("\x1b[35m====================================================\x1b[0m");

  const ai = getGeminiClient();
  const items = parsePortfolioData();
  
  console.log(`\x1b[32m[資訊] 成功載入作品資料，共偵測到 ${items.length} 個作品項目。\x1b[0m\n`);

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    console.log(`\x1b[36m[${i + 1}/${items.length}] 正在分析作品: ${item.id} - 「${item.title}」...\x1b[0m`);
    
    const contents: any[] = [];
    
    // Download and append image if available
    if (item.imageUrl) {
      const imgPart = await fetchImagePart(item.imageUrl);
      if (imgPart) {
        contents.push(imgPart);
        console.log(`  └─ 成功載入多模態影像: ${item.imageUrl.substring(0, 50)}...`);
      } else {
        console.log(`  └─ 無法載入影像，將使用作品詮釋資料與技術手法進行語意推導。`);
      }
    } else {
      console.log(`  └─ 無影像，將使用作品詮釋資料進行語意推導。`);
    }

    const promptText = `
作品 ID: ${item.id}
分類: ${item.category}
中文名稱: ${item.title}
英文名稱: ${item.titleEn}
現有設計理念: ${item.philosophy}
技術與工藝手法: ${item.tools?.join(", ") || ""}
`;
    contents.push(promptText);

    try {
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
      if (!resultText) throw new Error("Gemini 返回空回應");

      const report = JSON.parse(resultText);
      
      console.log(`  ├─ 偵測特徵: ${report.visualKeywords?.join(", ") || "無"}`);
      console.log(`  ├─ 語意分歧檢測: ${report.discrepancy ? "\x1b[33m【有分歧】\x1b[0m" : "\x1b[32m【一致】\x1b[0m"}`);
      if (report.discrepancy) {
        console.log(`  ├─ 分歧原因: ${report.discrepancyReason}`);
      }

      if (report.discrepancy || report.needsOptimization) {
        const optimized = report.optimizedPhilosophy;
        console.log(`  ├─ 原設計理念: ${item.philosophy}`);
        console.log(`  ├─ \x1b[32m優化後理念: ${optimized} (${optimized.length} 字)\x1b[0m`);
        
        // Write back immediately
        const success = updatePhilosophyInFile(item.id, optimized);
        if (success) {
          console.log(`  └─ \x1b[32m[成功] 已將優化文案自動修復並寫入 data.ts 檔案！\x1b[0m`);
        } else {
          console.log(`  └─ \x1b[31m[失敗] 無法將優化文案寫入檔案。\x1b[0m`);
        }
      } else {
        console.log(`  └─ \x1b[32m[極佳] 理念與視覺相符，無需異動。\x1b[0m`);
      }
    } catch (err: any) {
      console.error(`  └─ \x1b[31m[出錯] 稽核此項目時發生錯誤:\x1b[0m`, err.message);
    }
    console.log("");
  }

  console.log("\x1b[32m[完成] 一致性分析與優化流程結束！所有符合規範的優化文案已直接套用至 portfolio 檔案。\x1b[0m");
}

run();
