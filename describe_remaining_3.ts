import { GoogleGenAI } from "@google/genai";
import * as fs from "fs";
import fetch from "node-fetch";

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error("No API key found!");
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey });

const filesToDescribe = [
  { id: '1ZpL20RJVvl4qYsal-ht1CuhbthVSNXrQ', name: 'TSCI_B面-1_工作區域_1.jpg' },
  { id: '1O4vGhj3r8T_GYjbU4S_877IQY4TnQwBI', name: 'TSCI_B面-2_工作區域_1.jpg' },
  { id: '1HpOcrw9Bxd7rAkwDjsTlLD6XLjga7oOY', name: 'TSCI_LINE_ALBUM_TTT活動現場_64.jpg' },
  { id: '1tJU-4A-o9mUReJui6-7TRlhDldEDMKiv', name: 'Jacket_01.png' },
  { id: '1LbDDLI5eKXOeLYag6THAJDFTKi9SnooI', name: 'Jacket_02.png' },
  { id: '16Qu5Z4-RID6LvwAOLWx2UaCbyPtKVdvw', name: 'Jacket_03.jpg' }
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
    
    fs.appendFileSync('remaining_descriptions_3.txt', `=== DESC FOR ${name} (${id}) ===\n`);
    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-lite",
      contents: [
        {
          inlineData: {
            data: base64Data,
            mimeType: "image/jpeg"
          }
        },
        `Describe this image. Focus on physical description (colors, layout, text words, brands) in Traditional Chinese (繁體中文). 2 sentences.`
      ]
    });
    const resultText = response.text?.trim() || "";
    fs.appendFileSync('remaining_descriptions_3.txt', `${resultText}\n\n`);
    console.log(`Finished ${name}`);
  } catch (err: any) {
    fs.appendFileSync('remaining_descriptions_3.txt', `[${name}] Error: ${err.message}\n\n`);
    console.log(`Error on ${name}:`, err.message);
  }
}

async function run() {
  fs.writeFileSync('remaining_descriptions_3.txt', '=== FINAL IMAGE DESCRIPTIONS ===\n\n');
  for (const item of filesToDescribe) {
    await checkId(item.id, item.name);
    await new Promise(r => setTimeout(r, 4000));
  }
}

run();
