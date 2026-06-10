import { GoogleGenAI, Type } from "@google/genai";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build'
    }
  }
});

const FOLDERS = [
  {
    index: 1,
    id: "127",
    coverPath: "public/images/optimized/1a6aL9XZ6mK0JskkWcoFyoFl1ALmAdOMp.webp",
    images: [
      "/images/optimized/1a6aL9XZ6mK0JskkWcoFyoFl1ALmAdOMp.webp",
      "/images/optimized/1sSuz3sY_2zXwbwXRI2ASmnBX2Zpl-B3q.webp",
      "/images/optimized/1qePqfl_fYR6jCfTH1EN5aK39MQLHUuly.webp",
      "/images/optimized/1E3IULoAPe1iI_XCYpJwfyzdnCE_oexB-.webp",
      "/images/optimized/1iYyB8F1kCEuhAbVo9Cm0AGt0_w3FfuH5.webp",
      "/images/optimized/1MX0lLQCb0fsITCEMWWhgzFyzDahPw7y6.webp",
      "/images/optimized/15-rkQmBRYp7x0ndGsBbDg0SSNXrfc3HO.webp",
      "/images/optimized/1FDffwLSGDoTRBB65zUR2LokHr0vPEfc4.webp",
      "/images/optimized/1E6heih39No6C4O_27gF27eJng9XDKJwv.webp"
    ]
  },
  {
    index: 2,
    id: "128",
    coverPath: "public/images/optimized/1685_ZHDJmU2-ILvkPfcBP6r187mLG9bO.webp",
    images: [
      "/images/optimized/1685_ZHDJmU2-ILvkPfcBP6r187mLG9bO.webp",
      "/images/optimized/1RummUYqi0h-ZYJOF9rVIrX5ctIHvCAcg.webp",
      "/images/optimized/16DEtSvS-q9dfMeAhBn4VmgLJDLwGu3P3.webp",
      "/images/optimized/1Uib7b6kE1MPxngeH1aWJFHqPdqpeZDxI.webp",
      "/images/optimized/1KGC7loOcTDxko2GnJnzfjp5WXXh02izM.webp",
      "/images/optimized/1QPy1l2R3vAeqhEgEGibzfPnZcvqjrFSM.webp",
      "/images/optimized/1e9iEth96FwHfMiQrmqIa21kXrprwn0i3.webp",
      "/images/optimized/1xGzlR6pdxC2Uq__XppdKwMm8D7eG6-OT.webp",
      "/images/optimized/1vUC3Otevo_wHcECOTWakskZ9_zS1J4oU.webp",
      "/images/optimized/1ng2Mo1uHBUg3E_Prvq0BrgWqH1cTYYLr.webp",
      "/images/optimized/1w3Gxp3_uRJVKtLDIz3Wj4KRdsm9_eclN.webp",
      "/images/optimized/1BfghHVyi_97_5dnnh80VBRh4dRtzF81e.webp",
      "/images/optimized/1HhMMwmEHKeMcGVXg5r29MAj1zT-OFJft.webp",
      "/images/optimized/1lHuuCRc3jEKlyDmp60alO_0IAcFv_1vg.webp",
      "/images/optimized/13q-UNxm7yqSTukaNtr8id9UPJl1lhd8m.webp",
      "/images/optimized/1Vz3A3FqdTP0ObesYCBYCu8ueJk-JxhVi.webp",
      "/images/optimized/1VTmyphE61H6RgcIB_DN8JbtystYOtb_z.webp"
    ]
  },
  {
    index: 3,
    id: "129",
    coverPath: "public/images/optimized/1OPq4KJEJYjLEnUKOHTlYB6sZ1UcOfacg.webp",
    images: [
      "/images/optimized/1OPq4KJEJYjLEnUKOHTlYB6sZ1UcOfacg.webp",
      "/images/optimized/1xDTu2js0jxaJpakF1H5shamv1KxSW_np.webp",
      "/images/optimized/1AYnexcydDFtNBiw9iQC3n7vXQryAcBaP.webp",
      "/images/optimized/1UUK4oB0QKU2WnHfe6PKz9xeoT_tlN_RO.webp",
      "/images/optimized/1iwrcm5rF00rdcBraxQKUKDSMjWBCqEqa.webp",
      "/images/optimized/1ztedHHrHDtzuCjkMpKgLXUGH7UPOQy7R.webp",
      "/images/optimized/1bL86FOtaEMPdYmk_EVrR4M4jNU3dJhJf.webp",
      "/images/optimized/1G5Yy4KQmI4IU5PQ_jnsfVK3hXxQwItTE.webp",
      "/images/optimized/137UfEYCBPTFFwMpQws66-KBn_Wn8HXMH.webp",
      "/images/optimized/1eC4GHVBaNo5_YqKZzX4st13Rv-N3qAnc.webp",
      "/images/optimized/1eS-R3PjIqT9YbIc8fB820Of737boojhb.webp"
    ]
  },
  {
    index: 4,
    id: "130",
    coverPath: "public/images/optimized/1qWgFsK8XWJHW-B2dSNnMTEfTQ9NNBLiQ.webp",
    images: [
      "/images/optimized/1qWgFsK8XWJHW-B2dSNnMTEfTQ9NNBLiQ.webp",
      "/images/optimized/1brmW0f3g0EyGHO2vB2irJ7Q_PytIlSpN.webp",
      "/images/optimized/1lDVhRm9cJV2wikXsmyffFc8vnCEkfmcO.webp"
    ]
  }
];

const MODELS = ["gemini-3.5-flash", "gemini-flash-latest"];

async function run() {
  const targetIdx = parseInt(process.argv[2] || "1");
  const folder = FOLDERS.find(f => f.index === targetIdx);
  if (!folder) {
    console.error("Invalid index: " + targetIdx);
    return;
  }

  console.log(`Analyzing Folder ${folder.index} [ID ${folder.id}]: ${folder.coverPath}`);
  const fileData = fs.readFileSync(folder.coverPath);
  const base64 = fileData.toString("base64");

  for (let model of MODELS) {
    try {
      console.log(`Using model: ${model}...`);
      const response = await ai.models.generateContent({
        model: model,
        contents: [
          { inlineData: { mimeType: "image/webp", data: base64 } },
          {
            text: `Analyze this design picture. Identify the BRAND and the EXACT PRODUCT name shown.
Write a structured JSON string matching this shape:
{
  "title": "[Brand] [Product Description]: [Feature/Themes/Poetic Aesthetic Description]電商詳情長頁與海報設計",
  "titleEn": "Elegant English title matching the Chinese theme",
  "philosophy": "A stunning design philosophy paragraph (Traditional Chinese, must be 300+ characters) explaining the aesthetic concept, negative space, lighting, textures, material contrasts, typography choices, and how it serves the brand story with zero hype. Taiwanese styling (no simplified words).",
  "tools": [
    "Photoshop Tool description 1 (e.g. Photoshop high-dynamic lighting reconstruction ...)",
    "3D structure Tool description 2 ...",
    "Swiss layout/Typography Tool description 3",
    "Storyflow/Benefit copywriting Tool description 4",
    "Technical diagram rendering Tool description 5"
  ],
  "colorTheme": "from-[#...] via-[#...] to-[#...] (A beautiful, extremely dark ambient gradient corresponding to the image's dominant colors)"
}`
          }
        ],
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              titleEn: { type: Type.STRING },
              philosophy: { type: Type.STRING },
              tools: { type: Type.ARRAY, items: { type: Type.STRING } },
              colorTheme: { type: Type.STRING }
            },
            required: ["title", "titleEn", "philosophy", "tools", "colorTheme"]
          }
        }
      });

      if (response.text) {
        const parsed = JSON.parse(response.text);
        parsed.id = folder.id;
        parsed.category = "電商視覺設計";
        parsed.imageUrl = folder.images[0];
        parsed.placeholderId = `IMAGE_${folder.id}`;
        parsed.images = folder.images;

        // Save immediately as folderX.json
        fs.writeFileSync(`folder_${folder.index}.json`, JSON.stringify(parsed, null, 2));
        console.log(`\nSUCCESS Folder ${folder.index}:`);
        console.log(JSON.stringify(parsed, null, 2));
        return;
      }
    } catch (e: any) {
      console.error(`Error with ${model}:`, e.message);
    }
  }
}

run();
