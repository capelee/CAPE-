import { GoogleGenAI } from "@google/genai";
import * as fs from "fs";
import fetch from "node-fetch";

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error("No API key found!");
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey });

// Let's do the rest of the files in a fast series
const filesToDescribe = [
  { id: '1MFgP1Aipo95fju5WDUOqkTvgufOgALrw', name: 'TSOC_02.png' },
  { id: '1uYkDJU6Pizahf56SjVS1liztzoTv3rhr', name: 'TSOC_模擬.jpg' },
  { id: '1fnsCSkigWnZwTngzUJIXq4oIpexcRJf5', name: 'TSOC_背板03.jpg' }
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
    
    console.log(`Describing ${name}...`);
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: [
        {
          inlineData: {
            data: base64Data,
            mimeType: "image/jpeg"
          }
        },
        `Identify visible text (English/Chinese) and described subjects in ${name}. Mention specific brands, product titles, and numbers shown (e.g., CRE8 EVO, Myval Octa, Meril, Buddy Medical, etc.). Avoid long intros.`
      ]
    });
    
    const text = response.text || "No text returned";
    console.log(`\n=== DESC FOR ${name} ===\n${text.trim()}\n`);
    fs.appendFileSync('image_descriptions_log_2.txt', `=== ${name} (${id}) ===\n${text.trim()}\n\n`);
  } catch (err: any) {
    console.error(`Error describing ${name}:`, err.message);
  }
}

async function run() {
  fs.writeFileSync('image_descriptions_log_2.txt', '=== IMAGE DESCRIPTIONS LOG 2 ===\n\n');
  for (const item of filesToDescribe) {
    await describeImage(item.id, item.name);
    await new Promise(r => setTimeout(r, 2000));
  }
}

run();
