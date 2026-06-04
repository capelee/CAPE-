import { GoogleGenAI, Type } from "@google/genai";
import fetch from "node-fetch";

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error("No API key");
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey });

const validIds = [
  '1lYAORVdlmEzUifxGknP5OkKqOWe6H7Os',
  '1JmuCNnWkj8MJXo6QZroNrnP2Yg4yS319',
  '1NCtmF1YLl5w_bWckDoLv7xeV5rJenOEe',
  '1Mu53ZEC9_Vu3r1gIhOszmOClHrs6ljXf'
];

async function run() {
  const imagesInfo: any[] = [];
  
  for (const id of validIds) {
    console.log(`Downloading and analyzing ID: ${id}...`);
    try {
      const url = `https://lh3.googleusercontent.com/d/${id}`;
      const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
      const buffer = await res.arrayBuffer();
      const base64Data = Buffer.from(buffer).toString("base64");
      
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: [
          {
            inlineData: {
              data: base64Data,
              mimeType: "image/jpeg"
            }
          },
          `Briefly describe what is pictured in this image (e.g. food on a plate, raw food, packaged product, etc.) in English, and indicate whether this looks like a final polished commercial food photography / packaging presentation for "Red Dragon Foods - Beef Meatballs" (紅龍食品 牛肉丸).`
        ]
      });
      const desc = response.text?.trim() || "";
      console.log(`ID ${id} Description:\n${desc}\n`);
      imagesInfo.push({ id, desc, base64Data });
    } catch (e: any) {
      console.error(`Failed ID ${id}:`, e.message);
    }
  }

  // Ask Gemini to synthesize and output the final portfolio JSON
  console.log("Synthesizing final portfolio item for ID 47...");
  const contents: any[] = [];
  for (const info of imagesInfo) {
    contents.push({
      inlineData: {
        data: info.base64Data,
        mimeType: "image/jpeg"
      }
    });
  }
  
  contents.push(`
You are an expert Senior Food Photographer and Art Director.
Above are 4 images found in the updated Google Drive folder for "紅龍食品 牛肉丸" (Red Dragon Foods - Beef Meatballs).

Based on these 4 images:
1. Identify which image is the best and most polished primary/main commercial image for the portfolio (this will be the "imageUrl").
2. Order all valid, high-quality images for the gallery in the "images" field, putting the primary image first.
3. Generate a highly polished "title" in Traditional Chinese (Taiwan), featuring "AI協作修圖與商業美食攝影".
4. Generate "titleEn", a professional English translation.
5. Generate "philosophy", a professional, evocative, around 200-300 words description in Traditional Chinese (Taiwan). Highlight that this is a professional photography work ("都是攝影作品"), and strongly feature "AI協作修圖" (AI-assisted/collaborative retouching) in the post-production to enhance textures, lighting, steam, or remove packaging imperfections.
6. Generate a list of professional "tools" used (must include "AI協作修圖", "商業美食攝影", "單眼數位相機攝影" or similar, "Adobe Photoshop", "Adobe Lightroom").
7. Generate an elegant "colorTheme" starting with Tailwind CSS gradient (e.g. "from-amber-900 to-zinc-950") matching the primary image's aesthetic colors.

Output MUST be returned as a strict JSON matching this schema:
{
  "imageUrl": "https://lh3.googleusercontent.com/d/<PRIMARY_ID>",
  "images": [
    "https://lh3.googleusercontent.com/d/<ID_1>",
    "https://lh3.googleusercontent.com/d/<ID_2>",
    ...
  ],
  "title": "...",
  "titleEn": "...",
  "philosophy": "...",
  "tools": ["..."],
  "colorTheme": "..."
}
Do not use markdown fences. Output raw JSON only.
`);

  const response = await ai.models.generateContent({
    model: "gemini-3.5-flash",
    contents,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          imageUrl: { type: Type.STRING },
          images: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          title: { type: Type.STRING },
          titleEn: { type: Type.STRING },
          philosophy: { type: Type.STRING },
          tools: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          colorTheme: { type: Type.STRING }
        },
        required: ["imageUrl", "images", "title", "titleEn", "philosophy", "tools", "colorTheme"]
      }
    }
  });

  console.log("------------------ GEMINI RESPONSE ------------------");
  console.log(response.text);
  console.log("-----------------------------------------------------");
  
  if (response.text) {
    require("fs").writeFileSync("beefballs_final.json", response.text);
    console.log("Written to beefballs_final.json");
  }
}

run().catch(console.error);
