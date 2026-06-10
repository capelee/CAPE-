import fs from 'fs';
import { initialPortfolioData } from "./src/data.ts";

let data = fs.readFileSync('src/data.ts', 'utf-8');
let modifiedCount = 0;

for (let i = 0; i < initialPortfolioData.length; i++) {
  const item = initialPortfolioData[i];
  
  if (item.category === "電商產品銷售圖" && item.title.includes("海報設計")) {
    const newTitle = item.title.replace(/海報設計/g, "電商產品圖文");
    
    // Find the object chunk in data.ts
    const parts = data.split(new RegExp(`"id"\\s*:\\s*"${item.id}"`));
    if (parts.length > 1) {
       let rightPart = parts[1];
       let nextIdIndex = rightPart.indexOf('"id"');
       if (nextIdIndex === -1) nextIdIndex = rightPart.length;
       
       const chunkToModify = rightPart.substring(0, nextIdIndex);
       const modifiedChunk = chunkToModify.replace(`"title": "${item.title}"`, `"title": "${newTitle}"`);
       
       data = parts[0] + `"id": "${item.id}"` + modifiedChunk + rightPart.substring(nextIdIndex);
       modifiedCount++;
       console.log("Modified:", item.title, "->", newTitle);
    }
  }
}

console.log("Total modifications applied:", modifiedCount);
fs.writeFileSync('src/data.ts', data);
