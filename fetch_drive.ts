import https from "https";

const url = "https://drive.google.com/drive/folders/1aniUitB-HaQF1KGwZqwscgp2FZwfraXH?usp=drive_link";

function fetchUrl(targetUrl: string): Promise<string> {
  return new Promise((resolve, reject) => {
    https.get(targetUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36"
      }
    }, (res) => {
      let data = "";
      res.on("data", (chunk) => { data += chunk; });
      res.on("end", () => resolve(data));
    }).on("error", (err) => reject(err));
  });
}

async function run() {
  try {
    console.log("Fetching Google Drive folder...");
    const html = await fetchUrl(url);
    console.log("HTML length:", html.length);
    
    // Google Drive folders list elements in JSON format embedded in the HTML
    // Let's search for patterns like: ["1...", "name.png", ...] or typical Google Drive resource patterns.
    // Let's search for occurrences of .png and nearby drive file IDs (1 followed by 32 characters of a-zA-Z0-9_-)
    const idRegex = /1[a-zA-Z0-9_-]{32}/g;
    const pngRegex = /[^"'\s<>]*?\.png/gi;
    
    // We can search for the JSON blobs of the folder's files:
    // Let's write a script that looks for elements that might contain file metadata.
    // Typically, Drive folder HTML embeds file names and IDs in arrays like:
    // ["<ID>", "<NAME>", ... ]
    
    // Let's search for filenames ending in .png and see if we can find associated IDs.
    const results: { id: string; name: string }[] = [];
    const idSet = new Set<string>();
    
    // Let's look for match sequences or print 1000 characters around any .png filename
    const pngMatches = Array.from(html.matchAll(pngRegex));
    console.log("Found PNG mentions:", pngMatches.length);
    
    for (const match of pngMatches) {
      const idx = match.index;
      if (idx === undefined) continue;
      const start = Math.max(0, idx - 400);
      const end = Math.min(html.length, idx + 400);
      const surrounding = html.slice(start, end);
      
      // Look for Drive IDs in the surrounding text
      const foundIds = surrounding.match(idRegex) || [];
      if (foundIds.length > 0 && !surrounding.includes("folders")) {
        const firstId = foundIds[0];
        if (!idSet.has(firstId)) {
          idSet.add(firstId);
          // Clean the png name
          const nameMatch = match[0].split(/[/\\]/).pop();
          if (nameMatch) {
            results.push({ id: firstId, name: decodeURIComponent(nameMatch) });
          }
        }
      }
    }
    
    console.log("Parsed assets count:", results.length);
    console.log("Parsed assets list:", JSON.stringify(results, null, 2));
  } catch (error) {
    console.error("Error fetching or parsing:", error);
  }
}

run();
