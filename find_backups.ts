import * as fs from "fs";
import * as path from "path";

function findFiles(dir: string) {
  try {
    const list = fs.readdirSync(dir);
    for (const file of list) {
      const fullPath = path.join(dir, file);
      if (fullPath.includes("node_modules") || fullPath.includes(".git") || fullPath.includes(".npm")) {
        continue;
      }
      
      let stats;
      try {
        stats = fs.statSync(fullPath);
      } catch (e) {
        continue;
      }
      
      if (stats.isDirectory()) {
        findFiles(fullPath);
      } else {
        if (file.includes("data") && (file.endsWith(".ts") || file.endsWith(".json") || file.endsWith(".bak"))) {
          console.log(`Found candidate: ${fullPath} (${stats.size} bytes)`);
        }
      }
    }
  } catch (e) {
    // Ignore permissions errors
  }
}

console.log("Searching for data-related files in workspace...");
findFiles(".");
