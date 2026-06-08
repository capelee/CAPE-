import { GoogleGenAI } from "@google/genai";
import * as fs from "fs";
import fetch from "node-fetch";

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error("No API key found!");
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey });

// All the new images we need to understand precisely
const filesToDescribe = [
  // TSOC Images
  { id: '1MFgP1Aipo95fju5WDUOqkTvgufOgALrw', name: 'TSOC_02.png (02.png)' },
  { id: '1Qs32VDKek-vM-Hg_yq6_MwP5XMmPhJvd', name: 'TSOC_03.jpg (03.jpg)' },
  { id: '1uYkDJU6Pizahf56SjVS1liztzoTv3rhr', name: 'TSOC_展覽模擬.jpg' },
  { id: '1Q1aBHsIwG9PXcf9ip3asKKxrWAfZZ8jx', name: 'TSOC_展覽背板_工作區域_1.jpg' },
  { id: '1eN_NHKGlcjaALUe5XsHor7XXfFzQnBLk', name: 'TSOC_展覽背板-02.jpg' },
  { id: '1fnsCSkigWnZwTngzUJIXq4oIpexcRJf5', name: 'TSOC_展覽背板-03.jpg' },

  // TSCI Images
  { id: '1mCfcZkDCqkwwLUsQrnpwEZ1L7kU2E1pb', name: 'TSCI_02.png (02.png)' },
  { id: '11Smzxt8uJBxz1EcnkdCoHVYCJjuJv97o', name: 'TSCI_03.jpg (03.jpg)' },
  { id: '18yJicSc31X4dEigTOp1W2nyqPCD8f6av', name: 'TSCI_A面_工作區域_1.jpg' },
  { id: '1ZpL20RJVvl4qYsal-ht1CuhbthVSNXrQ', name: 'TSCI_B面-1_工作區域_1.jpg' },
  { id: '1O4vGhj3r8T_GYjbU4S_877IQY4TnQwBI', name: 'TSCI_B面-2_工作區域_1.jpg' },
  { id: '1HpOcrw9Bxd7rAkwDjsTlLD6XLjga7oOY', name: 'TSCI_LINE_ALBUM_TTT活動現場_64.jpg' },

  // Jacket Images
  { id: '1tJU-4A-o9mUReJui6-7TRlhDldEDMKiv', name: 'Jacket_01.png (01.png)' },
  { id: '1LbDDLI5eKXOeLYag6THAJDFTKi9SnooI', name: 'Jacket_02.png (02.png)' },
  { id: '16Qu5Z4-RID6LvwAOLWx2UaCbyPtKVdvw', name: 'Jacket_03.jpg (03.jpg)' }
];

async function checkId(id: string, name: string) {
  const url = `https://lh3.googleusercontent.com/d/${id}`;
  try {
    const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
    if (!res.ok) {
      console.log(`[${name}] ID: ${id} status: ${res.status}`);
      return;
    }
    const buffer = await res.arrayBuffer();
    const base64Data = Buffer.from(buffer).toString("base64");
    
    fs.appendFileSync('full_image_descriptions.txt', `=== DESC FOR ${name} (${id}) ===\n`);
    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-lite",
      contents: [
        {
          inlineData: {
            data: base64Data,
            mimeType: "image/jpeg"
          }
        },
        `Write a brief, precise description of this image. What is visibly shown? Outline text, brands, devices, or clothing details in Traditional Chinese (繁體中文). Keep it around 2-3 sentences.`
      ]
    });
    const resultText = response.text?.trim() || "";
    fs.appendFileSync('full_image_descriptions.txt', `${resultText}\n\n`);
    console.log(`Finished ${name}`);
  } catch (err: any) {
    fs.appendFileSync('full_image_descriptions.txt', `[${name}] Error: ${err.message}\n\n`);
    console.log(`Error on ${name}:`, err.message);
  }
}

async function run() {
  fs.writeFileSync('full_image_descriptions.txt', '=== DETAILED IMAGE DESCRIPTIONS ===\n\n');
  for (const item of filesToDescribe) {
    await checkId(item.id, item.name);
    // delay 4 seconds to respect the 15 RPM rate limit
    await new Promise(r => setTimeout(r, 4000));
  }
}

run();
