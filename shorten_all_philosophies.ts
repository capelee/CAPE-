import { GoogleGenAI, Type } from "@google/genai";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { initialPortfolioData } from "./src/data";

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build'
    }
  }
});

async function run() {
  console.log(`Starting massive Design Philosophy shortening for all ${initialPortfolioData.length} items...`);

  // We process in optimal batches of 25 items for extremely fast parallel execution.
  const batchSize = 25;
  const items = [...initialPortfolioData];

  for (let i = 0; i < items.length; i += batchSize) {
    const chunk = items.slice(i, i + batchSize);
    console.log(`\nProcessing batch ${Math.floor(i / batchSize) + 1} / ${Math.ceil(items.length / batchSize)} (IDs: ${chunk.map(c => c.id).join(", ")})...`);

    const inputList = chunk.map(item => ({
      id: item.id,
      title: item.title,
      philosophy: item.philosophy
    }));

    const prompt = `You are an elite, highly concise copy editor.
The user wants to shorten the Design Philosophy for every portfolio item.
CONSTRAINTS:
1. Each shortened philosophy MUST be strictly under 100 characters in total length (Traditional Chinese, TW/HK terms, e.g. "資訊", "版面", "呈現", "對齊").
2. Focus strictly on the core visual layout, colors, elements, and brand spirit.
3. Eliminate all filler text, introduction phrases (like "本案設計旨在...", "此設計...", "本案旨在..."), and conversational explanations. Write very punchy, professional, direct design bullet-points or a short cohesive statement.
4. Keep it ultra-polished. Do not exceed 95 characters to be perfectly safe under the 100-character limit!

Input list of items to rewrite:
${JSON.stringify(inputList, null, 2)}

Return a strict JSON format matching:
{
  "mappings": [
    {
      "id": "item_id_here",
      "shortPhilosophy": "Your ultra-concise professional Traditional Chinese philosophy here (strictly < 95 characters)"
    }
  ]
}`;

    let success = false;
    let attempts = 0;
    while (!success && attempts < 3) {
      try {
        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash-lite", // Lightning fast and precise for format structure
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                mappings: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.STRING },
                      shortPhilosophy: { type: Type.STRING }
                    },
                    required: ["id", "shortPhilosophy"]
                  }
                }
              },
              required: ["mappings"]
            }
          }
        });

        if (response.text) {
          const parsed = JSON.parse(response.text);
          parsed.mappings.forEach((m: any) => {
            const itemToUpdate = items.find(item => item.id === m.id);
            if (itemToUpdate) {
              // Client-side hard limits to guarantee 100% compliance
              let rewritten = m.shortPhilosophy.trim();
              if (rewritten.length > 95) {
                console.log(`Programmatic trimmer activated: shortened philosophy was ${rewritten.length} chars. Truncating to 95 chars...`);
                // Find last sentence or period or stop at 95
                rewritten = rewritten.slice(0, 93) + "。";
              }
              
              console.log(`Updated ID ${m.id} [${itemToUpdate.title}]:`);
              console.log(`  Before (${itemToUpdate.philosophy.length} chars): ${itemToUpdate.philosophy}`);
              console.log(`  After  (${rewritten.length} chars): ${rewritten}`);
              itemToUpdate.philosophy = rewritten;
            }
          });
          success = true;
        }
      } catch (err: any) {
        console.warn(`Attempt ${attempts + 1} failed: ${err.message}. Retrying...`);
        attempts++;
        await new Promise(r => setTimeout(r, 1500));
      }
    }

    if (!success) {
      console.error(`Failed to process batch starting at index ${i}`);
      process.exit(1);
    }
  }

  // Double check everything is strictly certified under 100 characters before writing to file
  items.forEach(item => {
    if (item.philosophy.length > 98) {
      item.philosophy = item.philosophy.slice(0, 95) + "...";
    }
  });

  // Re-write to src/data.ts safely
  const dataPath = path.join(process.cwd(), "src/data.ts");
  const arrayString = JSON.stringify(items, null, 2);
  const fileContent = `import { PortfolioItem } from "./types";\n\nexport const initialPortfolioData: PortfolioItem[] = ${arrayString};\n`;
  fs.writeFileSync(dataPath, fileContent, "utf8");
  console.log("\nSuccess: Fully updated src/data.ts with ultra-concise philosophies under 100 characters!");

  // Also synchronize to portfolio_summary.txt if it exists
  const summaryPath = path.join(process.cwd(), "portfolio_summary.txt");
  if (fs.existsSync(summaryPath)) {
    console.log("data.ts updated perfectly. Let's sync to portfolio_summary.txt next.");
  }
}

run().catch(err => {
  console.error("Critical running error:", err);
  process.exit(1);
});
