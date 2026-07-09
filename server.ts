import express from "express";
import path from "path";
import fs from "fs";
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

// API Routes
app.get("/api/portfolio", (req, res) => {
  try {
    // Explicitly disable any caching on client, CDN, and browser levels
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
    res.setHeader("Surrogate-Control", "no-store");
    
    const data = getLatestPortfolioData();
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
    const success = updatePhilosophyInFile(filePath, itemId, newPhilosophy);
    
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
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
