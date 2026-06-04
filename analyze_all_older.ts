import { GoogleGenAI, Type } from "@google/genai";
import fetch from "node-fetch";
import * as fs from "fs";

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error("No GEMINI_API_KEY in environment");
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

const projects = [
  { id: "7", currentTitle: "茂生食品：極品燕窩月餅禮盒", imageUrl: "https://lh3.googleusercontent.com/d/1udB6cVB2XyCPgUwpkYMvlvyjiJlzaH41" },
  { id: "8", currentTitle: "紅龍食品：人氣炸物系列商品視覺與電商圖文企劃", imageUrl: "https://lh3.googleusercontent.com/d/1RccWI-GWaOkfWVwxP7gqTk4uLRA92D7u" },
  { id: "9", currentTitle: "軍備局第209廠：雲豹多功能戰術輪車紀念鈦合金戶外旅行杯", imageUrl: "https://lh3.googleusercontent.com/d/1upzQ59TTjDRD1XTIz5T2sNIPi9jc2zNU?v=2" },
  { id: "10", currentTitle: "PGA TOUR（美國職業高爾夫巡迴賽）紀念高爾夫球標設計", imageUrl: "https://lh3.googleusercontent.com/d/1GZCZrX8BolWjvQ25F_2XVyGsG4CLnuiX?v=2" },
  { id: "11", currentTitle: "PGA TOUR（美國職業高爾夫巡迴賽）581紀念金屬徽章別針", imageUrl: "https://lh3.googleusercontent.com/d/14In054ETcrU3dVV1Q-7xhvmRGYpecLsJ" },
  { id: "12", currentTitle: "台北國際音樂邀請賽 2026 鋅合金壓鑄電鍍獎牌設計", imageUrl: "https://lh3.googleusercontent.com/d/1ShlcU_YeoBOgrHu68R0uV_lnZiIvuIrc" },
  { id: "13", currentTitle: "DePaul University 帝博大學黃銅鏤空多功能紀念書籤尺", imageUrl: "https://lh3.googleusercontent.com/d/1Fi8gl2mH39tby-qyKKYxERus01US5PY8" },
  { id: "14", currentTitle: "2025 TISDC 臺灣國際學生創意設計大賽 官方名牌識別徽章", imageUrl: "https://lh3.googleusercontent.com/d/18Csy_4BnCnOM6iE3Q-m3sAWR9nweuHcX" },
  { id: "15", currentTitle: "2025 曼波新城國際疊石藝術節 手作立體浮雕創意磁鐵", imageUrl: "https://lh3.googleusercontent.com/d/1Dv3qoc-u2F91Gj_2tMM2BhNlnZ1vS0uh" },
  { id: "16", currentTitle: "捷克參議院議長訪問臺灣立法院 官方典藏紀念徽章組", imageUrl: "https://lh3.googleusercontent.com/d/1S4f3FpGHl8NmqbBwAwepS_2SCFDb-AJa" },
  { id: "17", currentTitle: "台灣大和化成股份有限公司 官方高質感企業識別徽章", imageUrl: "https://lh3.googleusercontent.com/d/14aj8IqyxwHdo_BFw7HurXwtS2Y96vZfy" },
  { id: "18", currentTitle: "中華民國空軍「天龍操演」團體總錦標紀念天龍銀盤", imageUrl: "https://lh3.googleusercontent.com/d/1aY3ESOBDk4-0SOy7aIuCvCmwCLVtmyoS" },
  { id: "19", currentTitle: "王品集團第一屆王品嚴選年菜競賽 官方琥珀藝術獎盃", imageUrl: "https://lh3.googleusercontent.com/d/1P098Xy4DJXxhSmDHtdVGYq76xo3dfpae" },
  { id: "20", currentTitle: "花蓮縣光華國民小學 官方永續吸水文創玻璃砂與珪藻土杯墊", imageUrl: "https://lh3.googleusercontent.com/d/1retvEk1bQzzqoazWkMVO2UgHo9D5I9eu" },
  { id: "21", currentTitle: "宏泰人壽官方高質感企業員工識別名牌與徽章", imageUrl: "https://lh3.googleusercontent.com/d/1OyWdL1g7TX2bguGcI0uQMHF0NUTH3NZh" },
  { id: "22", currentTitle: "花蓮縣玉里鎮公所 官方YULI觀光與節慶文創禮品組", imageUrl: "https://lh3.googleusercontent.com/d/1j_Dl5I5TtH2AW5CMDhhM8C8fBYUMY1bZ" },
  { id: "23", currentTitle: "國立金門大學企業管理學系 官方文創形象徽章與周邊設計組", imageUrl: "https://lh3.googleusercontent.com/d/1P5P1Ya0Kca9dA5whL3E2tcA_TH_lzuUL" },
  { id: "24", currentTitle: "松冠基督徒大會中心 第五屆姐妹彩虹營會 官方尊榮金屬書籤", imageUrl: "https://lh3.googleusercontent.com/d/1qkeYDElnY0UG-WwpKtAH3jpMACO1CiLK" },
  { id: "25", currentTitle: "國立新竹科學園區實驗高級中等學校 官方雙層圓邊高透光壓克力吊飾", imageUrl: "https://lh3.googleusercontent.com/d/1bE5O6UX3KuVNyZhXgFlSpKqiUtaltgPv" },
  { id: "26", currentTitle: "工信工程淡江大橋 官方開工大吉紀念金鏟子禮盒組", imageUrl: "https://lh3.googleusercontent.com/d/1lBKTHUW3qRda2cLel9fBpgL15AfuVQzH" },
  { id: "27", currentTitle: "台北華山扶輪社 台灣奶茶主題國際親善交流紀念徽章", imageUrl: "https://lh3.googleusercontent.com/d/1ksnPCle4trzSUThCjte3DtDkx_YiMjrX" },
  { id: "28", currentTitle: "雲林家扶中心 75周年 溫馨守護防潮野餐墊", imageUrl: "https://lh3.googleusercontent.com/d/1E5nphIawW2SO10AFtNnULRBP8xwlEQul" },
  { id: "29", currentTitle: "新竹市體育會西洋棋委員會 典藏工藝級防滑矽膠吸水杯墊", imageUrl: "https://lh3.googleusercontent.com/d/1Nx7DXhK0ZCOUFQzegZZHrR5pKHHNIvdP" },
  { id: "30", currentTitle: "新竹科學菁英學校 畢業紀念冊 典藏裝幀外裝本", imageUrl: "https://lh3.googleusercontent.com/d/1j3vY9HAh8Aogdae_yNhjfrMcRLJxuxZS" },
  { id: "31", currentTitle: "豐森大境建案 官方開工大吉紀念金鏟子禮盒組", imageUrl: "https://lh3.googleusercontent.com/d/1CtntqV1k0wyIgCcqalGDdizW-POttWfK" },
  { id: "32", currentTitle: "花蓮地震震災重建義賣 鏟子超人雷雕紀念吊飾組", imageUrl: "https://lh3.googleusercontent.com/d/1IHNMICS3Jrmupw6YpTHCiKEO6x1Ig10L" },
  { id: "33", currentTitle: "墾丁國家公園 鸚哥魚主題海洋保育陶瓷紀念杯", imageUrl: "https://lh3.googleusercontent.com/d/18Q1AMvM0tzx0ihr9qYX4pTKIWzJrMyin" },
  { id: "34", currentTitle: "臺北市立建國高級中學 第41屆畢業40週年 榮耀重聚紀念徽章", imageUrl: "https://lh3.googleusercontent.com/d/ Kalv_LXV4d8zb9193SPf3QylJx6lb3bx" } // Wait, ID 34 has a typo in the main array check `1Kalv_LXV4d8zb9193SPf3QylJx6lb3bx`
];

// Let's fix ID 34 URL
projects[projects.length - 1].imageUrl = "https://lh3.googleusercontent.com/d/1Kalv_LXV4d8zb9193SPf3QylJx6lb3bx";

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function getImageBase64(url: string) {
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
      }
    });
    if (!res.ok) {
      throw new Error(`Failed to fetch image: ${res.statusText}`);
    }
    const buffer = await res.arrayBuffer();
    const contentType = res.headers.get("content-type") || "image/jpeg";
    return {
      base64: Buffer.from(buffer).toString("base64"),
      contentType
    };
  } catch (err: any) {
    console.error(`Error fetching image from ${url}:`, err.message);
    return null;
  }
}

async function analyzeProject(project: typeof projects[0], attempt = 1): Promise<any> {
  console.log(`[START] Analyzing ID ${project.id}: "${project.currentTitle}" (Attempt ${attempt})...`);
  const imgData = await getImageBase64(project.imageUrl);
  if (!imgData) {
    console.error(`  Could not fetch image for project ${project.id}`);
    return null;
  }

  const prompt = `You are an expert Art Director and Senior Graphic & Industrial Designer.
Analyze this design image carefully. Look at the exact text, title, brands/names, dates, typography, colors, graphical elements, layout, style, shapes, materials, and overall aesthetics of the design item.
Current title hint: "${project.currentTitle}" (this is the user's title, use the real text on the image to make it highly precise).

Based on the actual image, generate:
1. "title": A highly polished, precise, and professional portfolio item title in Traditional Chinese (Taiwan), representing exactly what is printed/shown in this design (e.g. include the real brand names, exact product name, exact military units, or event/exhibition/cooperation names shown).
2. "titleEn": A professional English translation of the title.
3. "philosophy": A highly professional, evocative, and deep design description/philosophy in Traditional Chinese (Taiwan), around 200-300 words. It must describe:
   - What is physically depicted/designed in this specific image (mention specific visual features, exact band names, official text, characters, patterns, geometries, illustration details, material surface finishes, or product form).
   - The graphic designer's choices: color system (dominant tones, contrast), page/item layout, spatial hierarchy, typography details (serif/sans-serif/calligraphy/brutalist), and emotional/artistic vibe.
   - The production material, printing technology, or finishing features (e.g., zinc alloy die-cast, synthetic soft enamel, frosted sandblasting finish, chemical brass etching, laser engraving, high-saturation Giclée art print, etc.) to showcase absolute end-to-end design mastery.
4. "tools": A list of tools and concepts used (e.g., ["Illustrator", "Photoshop", "Typography", "Color Choice", "Layout", etc.]).
5. "colorTheme": A Tailwind CSS color gradient theme starting text (e.g. "from-stone-900 to-indigo-950") that matches the dominant color palette of the image.

Output MUST be returned as a strict JSON matching the schema. No markdown formatting outer text exception, just the JSON object.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          inlineData: {
            data: imgData.base64,
            mimeType: imgData.contentType
          }
        },
        {
          text: prompt
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
            tools: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            colorTheme: { type: Type.STRING }
          },
          required: ["title", "titleEn", "philosophy", "tools", "colorTheme"]
        }
      }
    });

    const text = response.text?.trim() || "{}";
    const parsed = JSON.parse(text);
    console.log(`  [SUCCESS] ID ${project.id}: "${parsed.title}"`);
    return parsed;
  } catch (err: any) {
    if (err.message.includes("429") || err.message.includes("quota") || err.message.includes("RESOURCE_EXHAUSTED")) {
      console.warn(`  [RATE LIMIT] Quota hit on ID ${project.id}. Waiting 20 seconds before retry...`);
      await sleep(20000);
      if (attempt < 3) {
        return analyzeProject(project, attempt + 1);
      }
    }
    console.error(`  [ERROR] ID ${project.id} failed:`, err.message);
    return null;
  }
}

async function run() {
  const results: Record<string, any> = {};

  // Load existing intermediate progress if any, to be able to resume in case of complete failures
  if (fs.existsSync("./intermediate_progress.json")) {
    console.log("Loading intermediate progress...");
    Object.assign(results, JSON.parse(fs.readFileSync("./intermediate_progress.json", "utf-8")));
  }

  let processedThisRun = 0;
  for (const p of projects) {
    if (results[p.id]) {
      console.log(`Skipping ID ${p.id} as it is already analyzed.`);
      continue;
    }

    if (processedThisRun >= 3) {
      console.log(`Processed 3 items this run. Exiting early to avoid timeout. Run again to continue.`);
      break;
    }

    const data = await analyzeProject(p);
    if (data) {
      results[p.id] = data;
      processedThisRun++;
      // Save progress incrementally after each success
      fs.writeFileSync("./intermediate_progress.json", JSON.stringify(results, null, 2));
    }

    // Wait a brief delay to respect rate limit (approx. 1 second sleep between requests)
    await sleep(1000);
  }

  // Check if fully complete
  const allIds = projects.map(p => p.id);
  const completedIds = Object.keys(results);
  const isComplete = allIds.every(id => completedIds.includes(id));

  if (isComplete) {
    // Write final outputs to updated_projects.json
    fs.writeFileSync("./updated_projects_older.json", JSON.stringify(results, null, 2));
    console.log("Written results to updated_projects_older.json!");

    // Clean up progress file
    if (fs.existsSync("./intermediate_progress.json")) {
      fs.unlinkSync("./intermediate_progress.json");
    }
  } else {
    console.log(`Intermediate progress saved. ${completedIds.length} out of ${allIds.length} projects completed.`);
  }
}

run();
