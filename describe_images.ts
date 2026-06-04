import { GoogleGenAI } from "@google/genai";
import fetch from "node-fetch";

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error("No apiKey");
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey });

async function describeImage(url: string, name: string) {
  console.log(`Fetching ${name}: ${url}`);
  const res = await fetch(url);
  const buffer = await res.arrayBuffer();
  console.log(`Downloaded ${buffer.byteLength} bytes`);

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [
      {
        inlineData: {
          data: Buffer.from(buffer).toString("base64"),
          mimeType: "image/jpeg"
        }
      },
      "Tell me in Traditional Chinese (Taiwan, 繁體中文) exactly what food/packaging/composition is visible in this food advertisement/commercial photo. Describe the items, background, layout, colors, and overall vibe."
    ]
  });

  console.log(`\n--- Description for ${name} ---`);
  console.log(response.text);
}

async function run() {
  await describeImage("https://lh3.googleusercontent.com/d/1RYBr_8zVpw0j_m8B6t1C4v_Kp2eR6xcV", "00.jpg");
  await describeImage("https://lh3.googleusercontent.com/d/1tQHvOL3NC0ncyfN3EkPUYa8KPxML-b9f", "DSC04652-1.jpg");
}

run().catch(console.error);
