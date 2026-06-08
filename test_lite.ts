import { GoogleGenAI } from "@google/genai";
import fetch from "node-fetch";

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error("No API key found!");
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey });

async function check() {
  try {
    const id = '13om-MS8AQVHg8pVOAeIvnVa6K0I5voF3'; // TSCI 01.png
    const url = `https://lh3.googleusercontent.com/d/${id}`;
    const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
    if (!res.ok) {
      console.log("Download failed", res.status);
      return;
    }
    const buffer = await res.arrayBuffer();
    const base64Data = Buffer.from(buffer).toString("base64");
    
    console.log("Calling model gemini-3.1-flash-lite...");
    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-lite",
      contents: [
        {
          inlineData: {
            data: base64Data,
            mimeType: "image/jpeg"
          }
        },
        `Explain exactly what physical item we are seeing in this TSCI image, the main colors, and the text on the panels (especially any logos like Myval Octa, Meril, Buddy Medical, TTT or TSCI). Short 2 sentences in Traditional Chinese.`
      ]
    });
    console.log("SUCCESS:", response.text);
  } catch (err: any) {
    console.error("ERROR:", err.message);
  }
}

check();
