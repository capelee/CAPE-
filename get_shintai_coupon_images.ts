import fetch from "node-fetch";

async function run() {
  const folderUrl = "https://drive.google.com/drive/folders/1ftyg5H_QrYEajVzIXF3SoleqNaDWYBHc?usp=drive_link";
  try {
    const res = await fetch(folderUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
      }
    });
    const html = await res.text();
    
    // Look for 33-char IDs starting with '1'
    const thirtyThreeCharRegex = /"1[a-zA-Z0-9_-]{32}"/g;
    const allIds = Array.from(new Set(html.match(thirtyThreeCharRegex) || [])).map(id => id.slice(1, -1));
    console.log("All 33-char IDs found in HTML:");
    console.log(allIds);

  } catch (err: any) {
    console.error("Error:", err.message);
  }
}

run();
