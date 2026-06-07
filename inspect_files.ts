import * as fs from "fs";

function searchBinFiles() {
  const files = fs.readdirSync(".");
  for (const f of files) {
    if (f.endsWith(".bin")) {
      const content = fs.readFileSync(f, "utf8");
      
      // Check if it looks like a typescript file with our data
      const hasPortfolio = content.includes("initialPortfolioData");
      const hasId43 = content.includes('"id": "43"');
      const hasId44 = content.includes('"id": "44"');
      const hasId67 = content.includes('"id": "67"');
      
      console.log(`File: ${f}, Has initialPortfolioData: ${hasPortfolio}, Has id:43: ${hasId43}, Has id:44: ${hasId44}, Has id:67: ${hasId67}`);
      
      if (hasId43) {
        console.log(`--> Found active backup candidate with id 43: ${f}`);
      }
    }
  }
}

searchBinFiles();
