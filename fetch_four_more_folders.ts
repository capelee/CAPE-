import fetch from "node-fetch";

const urls = [
  "https://drive.google.com/drive/folders/1tRDj77JbvA6rER2irIQKYOjU86lxZFWp",
  "https://drive.google.com/drive/folders/1W75WMEYLQU1i7R644zhMT21cLbGRL9Zf",
  "https://drive.google.com/drive/folders/1Opx1PjgS3TB9LD5DfzmALcSUFyPenJ0r",
  "https://drive.google.com/drive/folders/1gBWjribEGpEVmp5UprBrrRTpSDf5Dh6u"
];

async function run() {
  for (let i = 0; i < urls.length; i++) {
    const url = urls[i];
    console.log(`\n-------------------------------------`);
    console.log(`Fetching Folder ${i + 1}: ${url}`);
    try {
      const res = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        }
      });
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }
      const html = await res.text();
      const generalRegex = /"1[a-zA-Z0-9_-]{32}"/g;
      const allIds = Array.from(new Set(html.match(generalRegex) || [])).map(id => id.slice(1, -1));
      
      // Filter out the folder ID itself
      const folderId = url.split("/").pop()?.split("?")[0] || "";
      const imageIds = allIds.filter(id => id !== folderId);
      
      console.log(`Folder ID: ${folderId}`);
      console.log(`Image IDs found count: ${imageIds.length}`);
      console.log(JSON.stringify(imageIds));
    } catch (err: any) {
      console.error(`Error Folder ${i + 1}:`, err.message);
    }
  }
}

run();
