import { initialPortfolioData } from "./src/data";
import fs from "fs";
import path from "path";

// A list of general Traditional Chinese filler phrases to remove to keep the description dense
const fillerWords = [
  "本設計為", "本設計以", "本案例以", "此設計為", "本案設計以", "本案設計為", "本案為", "本設計專為", "此設計旨在",
  "完美融合", "呈現出", "呈現了", "帶給消費者", "營造出", "營造了", "創造出", "打造出", "全方位展現",
  "極致地", "完美平衡", "完美地", "為主人", "大幅增強", "大幅提升", "在不同光線下", "令人驚豔",
  "專為數位零售通路量身打造", "深受", "打造兼具", "視覺與工藝設計全方位展現極致匠心", "的尊貴感", "的儀式感"
];

// Helper to sanitize and compress a single philosophy text under 100 chars
function compressPhilosophy(text: string, title: string): string {
  // 1. Structural cleaning
  let s = text.trim();

  // Strip bullet point indices or redundant line breaks
  s = s.replace(/\r/g, "").replace(/\n/g, " ");
  s = s.replace(/^\d+[\.\、]/, ""); 

  // Remove list items placeholders if any
  s = s.replace(/1\..*?2\..*?3\..*/g, "");

  // Remove filler words
  for (let f of fillerWords) {
    s = s.replace(new RegExp(f, "g"), "");
  }

  // Remove leading comma/period that might remain
  s = s.replace(/^[,，。；;]/, "");

  // Let's split by major clauses
  const clauses = s.split(/[。；\n;]/).map(c => c.trim()).filter(c => c.length > 0);

  // We want to reconstruct the philosophy using the key descriptive design facts (e.g., color, materials, structure)
  // Usually, clauses that mention color names, layout methods, tactile textures are extremely crucial.
  // Let's assemble clauses up to 90 characters.
  let target = "";
  for (let c of clauses) {
    // Avoid repeating the title in the philosophy
    if (title && c.includes(title)) {
      continue;
    }
    
    // Add comma separator if needed
    const sep = target.length > 0 ? "，" : "";
    if (target.length + sep.length + c.length <= 92) {
      target += sep + c;
    } else {
      // If we cannot fit the next clause fully, try to preserve the first chunk of it if it fits
      const remainingSpace = 92 - target.length - sep.length;
      if (remainingSpace > 15) {
        target += sep + c.slice(0, remainingSpace - 1) + "。";
      }
      break;
    }
  }

  // Final trim and polishing
  target = target.trim();
  if (!target.endsWith("。") && target.length > 0) {
    target += "。";
  }

  // If for some reason it's still empty, create a smart generic design philosophy based on the title
  if (target.length < 5) {
    target = `以精緻美學進行${title.slice(0, 20)}之排版設計與色彩校正，強化品牌質感。`;
  }

  // Strict local safety assert
  if (target.length > 98) {
    target = target.slice(0, 95) + "。";
  }

  return target;
}

console.log("Compacting all 140 designs' philosophies offline...");

const originalData = [...initialPortfolioData];
let updatedCount = 0;

originalData.forEach(item => {
  const oldText = item.philosophy;
  const newText = compressPhilosophy(oldText, item.title);
  
  if (oldText !== newText) {
    item.philosophy = newText;
    updatedCount++;
    console.log(`- ID: ${item.id} [${item.title.slice(0, 15)}]`);
    console.log(`  Before (${oldText.length} c): ${oldText}`);
    console.log(`  After  (${newText.length} c): ${newText}`);
    console.log(`---`);
  }
});

// Final assertion to certify 100% compliance
originalData.forEach(item => {
  if (item.philosophy.length > 98) {
    item.philosophy = item.philosophy.slice(0, 95) + "。";
  }
});

const dataPath = path.join(process.cwd(), "src/data.ts");
const arrayString = JSON.stringify(originalData, null, 2);
const fileContent = `import { PortfolioItem } from "./types";\n\nexport const initialPortfolioData: PortfolioItem[] = ${arrayString};\n`;
fs.writeFileSync(dataPath, fileContent, "utf8");

console.log(`\nCOMPLETED! Programmatically compressed ${updatedCount} design philosophies.`);
console.log("All entries are now strictly validated to be <= 98 characters.");
