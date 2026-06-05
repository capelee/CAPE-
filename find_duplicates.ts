import * as fs from "fs";

function run() {
  const content = fs.readFileSync("src/data.ts", "utf-8");
  
  const ids: number[] = [];
  let match;
  const idRegex = /"id":\s*"([^"]+)"/g;
  while ((match = idRegex.exec(content)) !== null) {
    ids.push(parseInt(match[1], 10));
  }
  
  ids.sort((a, b) => a - b);
  console.log("All IDs:", ids);
}

run();
