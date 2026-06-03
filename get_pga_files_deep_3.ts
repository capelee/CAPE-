import fetch from "node-fetch";

async function run() {
  const folderUrl = "https://drive.google.com/drive/folders/1iP1f4NMNDeqGTwxy8mbDUDSk1mSIao8-?usp=drive_link";
  try {
    const res = await fetch(folderUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
      }
    });
    const html = await res.text();
    
    // Google Drive embeds JSON variables. Let's look for large JSON arrays.
    // We want to find any occurrences of names and IDs together.
    // The format is often: [ "1[a-zA-Z0-9_-]{32}", "filename.ext", ... ]
    
    // We can extract all chunks between brackets and parse them.
    const regex = /\["1[a-zA-Z0-9_-]{32}","[^"]+"[^\]]*\]/g;
    const matches = html.match(regex) || [];
    console.log("Matched individual pattern JSON structures:");
    matches.forEach((m, idx) => {
      console.log(`${idx}: ${m}`);
    });

    // Let's also look for all strings ending with .png or .jpg or similar in the folder HTML
    const pngRegex = /"[^"]+\.(?:png|jpg|jpeg|webp)"/g;
    const pngMatches = Array.from(new Set(html.match(pngRegex) || []));
    console.log("\nAll images mentioned in the document:");
    pngMatches.forEach((m, idx) => {
      console.log(`${idx}: ${m}`);
    });

    // Let's print any other 33-char IDs we can find anywhere in the text
    const thirtyThreeCharRegex = /"1[a-zA-Z0-9_-]{32}"/g;
    const allIds = Array.from(new Set(html.match(thirtyThreeCharRegex) || [])).map(id => id.slice(1, -1));
    console.log("\nAll 33-char IDs found in HTML:");
    console.log(allIds);

  } catch (err: any) {
    console.error("Error:", err.message);
  }
}

run();
