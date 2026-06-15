import { GoogleGenAI, Type } from "@google/genai";
import fetch from "node-fetch";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error("GEMINI_API_KEY is not defined!");
  process.exit(1);
}

const ai = new GoogleGenAI({
  apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build'
    }
  }
});

const FOLDERS = [
  {
    index: 1,
    folderId: "1wZ6JLbqI-k436MiQnUFiPXv9eBCn3QRd",
    images: ["1WR4TI87XZbt53ySarce8wVPWkNbxJMnZ", "1pj7P1yrCsfRi6C_RxS7dSVGG-RBTzbMJ"]
  },
  {
    index: 2,
    folderId: "1If06uSSXz45jTHfspN1g1o33Kt2VtrYT",
    images: ["180vjBisFIR8Sd4-mRFusIw13G4UTg5Zl", "1DP-cQLMU20sG902gNR1Btv48H7hQBO0_"]
  },
  {
    index: 3,
    folderId: "1oqkIA8LMvdW25VHxDeH2m7O6YMjY5Op2",
    images: ["16lSTH72n4Em8WEIUFGMt3sUPaT1amGHm", "1pFDhRFRu7F3FsbYu7LZ_4K1DQFYgFpxl"]
  },
  {
    index: 4,
    folderId: "19rjMpFjCBmiH1Fgm7miYgyqKpBS-zmdl",
    images: ["1YuoDxGAVMhQeQaLf0Wq_Fc18zP0ZsWXU", "1bjngfCO98_w7rmvmap7K4zGeupClB9eS"]
  }
];

async function downloadImageAsBase64(id: string): Promise<string | null> {
  const url = `https://drive.google.com/thumbnail?sz=w1000&id=${id}`;
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
      }
    });
    if (!res.ok) {
      console.warn(`Failed to download ${id}: ${res.statusText}`);
      return null;
    }
    const buffer = await res.arrayBuffer();
    return Buffer.from(buffer).toString("base64");
  } catch (err: any) {
    console.error(`Error downloading ${id}:`, err.message);
    return null;
  }
}

async function run() {
  const args = process.argv.slice(2);
  const folderArg = args.find(a => a.startsWith("--folder="));
  const filterIndex = folderArg ? parseInt(folderArg.split("=")[1], 10) : null;

  console.log(`Starting analysis of 4 dinosaur folders with Gemini... (filterIndex: ${filterIndex})`);
  
  const targetFolders = filterIndex 
    ? FOLDERS.filter(f => f.index === filterIndex)
    : FOLDERS;

  const results: any[] = [];

  for (const folder of targetFolders) {
    console.log(`\n------------------------------------------------`);
    console.log(`Analyzing Folder ${folder.index} (${folder.folderId})...`);
    
    // We will download both files from the folder to analyze
    const base64List: string[] = [];
    for (const imageId of folder.images) {
      console.log(`Downloading file ${imageId}...`);
      const base64 = await downloadImageAsBase64(imageId);
      if (base64) {
        base64List.push(base64);
      }
    }

    if (base64List.length === 0) {
      console.error(`Could not download any images for Folder ${folder.index}. skipping.`);
      continue;
    }

    // Build parts for Gemini API
    const parts: any[] = base64List.map(base64 => ({
      inlineData: {
        mimeType: "image/png",
        data: base64
      }
    }));

    // Add prompt
    parts.push({
      text: `你是一位資深的吉祥物設計總監與IP包裝大師。
請仔細分析這組恐龍IP吉祥物設計圖稿（包含角色原畫、表情、服飾配件、甚至可能的簡介文案文字）。

請為此吉祥物角色，產生一個用於精緻線上作品集（Portfolio）的項目資料結構。
注意：
1. 提取或推斷吉祥物的「名字」（可能叫Shone、MuMㄠ或特定的名字。如果圖片上有文字，請務必辨識圖片上的簡介、名字文字！圖片可能含有繁體中文的介紹，請提取它）。
2. philosophy 必須是極為專業、優雅、深度且不落俗套的設計理念說明（繁體中文，字數在 350-500 字之間）。描述其色彩學、比例線條、街頭 or 日常生活配件所代表的性格，以及此角色在品牌傳達和插畫貼圖應用中的核心價值。
3. title 必須為「[吉祥物中文名字]吉祥物：[街頭風格/精確風格描述] IP角色與貼圖設計」的格式。
4. titleEn 必須是相對應且優雅的英文標題。
5. imageUrl 與 images 的格式均為 "https://drive.google.com/thumbnail?sz=w1000&id=[IMAGE_ID]"。
6. imageUrl 請使用這組中最具代表性、最完整正面、最像海報或設計圖稿的那張 IMAGE_ID。
7. tools 必須列出具體而在行的 4~5 個工具，例如：["Illustrator 向量繪製", "IP角色品牌視覺規劃", ...]。
8. colorTheme 必須是一個極具沉浸感、呼應角色主色的 dark Tailwind gradient，如 "from-[#0A192F] via-[#112240] to-[#0A192F]" 或對應顏色。

輸出 JSON 結構：
{
  "id": "new-dino-${folder.index + 1}",
  "category": "角色IP&插畫與貼圖",
  "title": "...",
  "titleEn": "...",
  "philosophy": "...",
  "tools": ["...", "...", "...", "..."],
  "imageUrl": "https://drive.google.com/thumbnail?sz=w1000&id=[THE_BESTs_REPRESENTATIVE_IMAGE_ID]",
  "placeholderId": "IMAGE_DINO_NEW_${folder.index}",
  "colorTheme": "from-[#...] via-[#...] to-[#...]",
  "images": [
     "https://drive.google.com/thumbnail?sz=w1000&id=[IMAGE_ID_1]",
     "https://drive.google.com/thumbnail?sz=w1000&id=[IMAGE_ID_2]"
  ]
}`
    });

    try {
      console.log("Calling Gemini API...");
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: parts,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              category: { type: Type.STRING },
              title: { type: Type.STRING },
              titleEn: { type: Type.STRING },
              philosophy: { type: Type.STRING },
              tools: { type: Type.ARRAY, items: { type: Type.STRING } },
              imageUrl: { type: Type.STRING },
              placeholderId: { type: Type.STRING },
              colorTheme: { type: Type.STRING },
              images: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["id", "category", "title", "titleEn", "philosophy", "tools", "imageUrl", "placeholderId", "colorTheme", "images"]
          }
        }
      });

      if (response.text) {
        console.log("Gemini API Response retrieved.");
        const result = JSON.parse(response.text);
        
        // Save individual result immediately
        const outFileName = `dino_generated_${folder.index}.json`;
        fs.writeFileSync(outFileName, JSON.stringify(result, null, 2), "utf-8");
        console.log(`Saved individual result to ${outFileName}`);
        
        results.push(result);
        console.log(`Success processing Dino Folder ${folder.index}:`, result.title);
      } else {
        console.warn(`Empty response for Folder ${folder.index}`);
      }
    } catch (err: any) {
      console.error(`Gemini API error for Folder ${folder.index}:`, err.message);
    }
  }

  if (results.length > 0 && !filterIndex) {
    fs.writeFileSync("dino_generated_cards.json", JSON.stringify(results, null, 2), "utf-8");
    console.log("\nAll folders analyzed successfully! Results saved to dino_generated_cards.json.");
  }
}

run();
