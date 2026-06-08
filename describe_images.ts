import { GoogleGenAI } from "@google/genai";
import * as fs from "fs";
import fetch from "node-fetch";

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error("No API key found!");
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey });

// Let's gather representative images from each of the three collections
const filesToDescribe = [
  // TSOC Images
  { id: '18uKDTF1Nhr5rfOfQFPObn_M56UH07D9s', name: 'TSOC_01.png' },
  { id: '1MFgP1Aipo95fju5WDUOqkTvgufOgALrw', name: 'TSOC_02.png' },
  { id: '1uYkDJU6Pizahf56SjVS1liztzoTv3rhr', name: 'TSOC_模擬.jpg' },
  { id: '1fnsCSkigWnZwTngzUJIXq4oIpexcRJf5', name: 'TSOC_背板03.jpg' },
  
  // TSCI Images
  { id: '13om-MS8AQVHg8pVOAeIvnVa6K0I5voF3', name: 'TSCI_01.png' },
  { id: '1mCfcZkDCqkwwLUsQrnpwEZ1L7kU2E1pb', name: 'TSCI_02.png' },
  { id: '11Smzxt8uJBxz1EcnkdCoHVYCJjuJv97o', name: 'TSCI_03.jpg' },
  { id: '11Smzxt8uJBxz1EcnkdCoHVYCJjuJv97o', name: 'TSCI_B面1.jpg' },

  // Jacket Images
  { id: '1tJU-4A-o9mUReJui6-7TRlhDldEDMKiv', name: 'Jacket_01.png' },
  { id: '1LbDDLI5eKXOeLYag6THAJDFTKi9SnooI', name: 'Jacket_02.png' },
  { id: '16Qu5Z4-RID6LvwAOLWx2UaCbyPtKVdvw', name: 'Jacket_03.jpg' }
];

async function describeImage(id: string, name: string) {
  const url = `https://lh3.googleusercontent.com/d/${id}`;
  try {
    const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
    if (!res.ok) {
      console.log(`[${name}] ID: ${id} could not be downloaded (status: ${res.status})`);
      return;
    }
    const buffer = await res.arrayBuffer();
    const base64Data = Buffer.from(buffer).toString("base64");
    
    console.log(`Describing ${name} via gemini-3.5-flash...`);
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: [
        {
          inlineData: {
            data: base64Data,
            mimeType: "image/jpeg"
          }
        },
        `You are analyzing high-quality medical exhibition design files / layout renderings for Buddy Medical (巴迪醫療) or other partner brands.
Please write a short (2-3 sentences) description of what is visibly shown inside this image (${name}):
1. What products, medical items, garments, colors or layout configurations do you see?
2. Write down ANY Chinese or English text that is visible on the panels, signage, clothing, or banners (like 'HeartCare', 'Myval', 'Buddy Medical', 'TSCI', 'TSOC', etc.).
3. Identify the item's details (e.g. is it an exhibition booth rendering, a blueprint/banner layout diagram, a jacket mock-up, or photos of people at an event?).
Answer in Traditional Chinese (繁體中文).`
      ]
    });
    
    const text = response.text || "No text returned";
    console.log(`\n=== DESC FOR ${name} ===\n${text.trim()}\n`);
    fs.appendFileSync('image_descriptions_log.txt', `=== ${name} (${id}) ===\n${text.trim()}\n\n`);
  } catch (err: any) {
    console.error(`Error describing ${name}:`, err.message);
  }
}

async function run() {
  fs.writeFileSync('image_descriptions_log.txt', '=== IMAGE DESCRIPTIONS LOG ===\n\n');
  for (const item of filesToDescribe) {
    await describeImage(item.id, item.name);
    console.log("Sleeping 8 seconds to respect rate limits...");
    await new Promise(r => setTimeout(r, 8000));
  }
}

run();
