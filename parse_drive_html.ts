import fs from "fs";

function searchExtensions(filepath: string) {
  const html = fs.readFileSync(filepath, "utf8");
  const regex = /[a-zA-Z0-9_\-\u4e00-\u9fa5]+\.(?:jpg|png|webp|jpeg|gif)/gi;
  const matches = html.match(regex);
  console.log("Matches count:", matches ? matches.length : 0);
  if (matches) {
    console.log("First 30 matches:", Array.from(new Set(matches)).slice(0, 30));
  }
}

searchExtensions("drive_raw.html");
