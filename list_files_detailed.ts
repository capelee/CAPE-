import fetch from "node-fetch";

const urls = [
  "https://drive.google.com/drive/folders/1wZ6JLbqI-k436MiQnUFiPXv9eBCn3QRd",
  "https://drive.google.com/drive/folders/1If06uSSXz45jTHfspN1g1o33Kt2VtrYT",
  "https://drive.google.com/drive/folders/1oqkIA8LMvdW25VHxDeH2m7O6YMjY5Op2",
  "https://drive.google.com/drive/folders/19rjMpFjCBmiH1Fgm7miYgyqKpBS-zmdl"
];

async function run() {
  for (let i = 0; i < urls.length; i++) {
    const url = urls[i];
    console.log(`\n================================`);
    console.log(`Folder ${i + 1}: ${url}`);
    try {
      const res = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        }
      });
      const html = await res.text();
      
      // Look for JSON arrays like: ["1a2b3c...", "FileName.ext", ...] in the HTML
      // Let's search for filenames in the HTML using regex
      const idRegex = /"1[a-zA-Z0-9_-]{32}"/g;
      
      // Look for pattern: ["<ID>", "<NAME>", ... ]
      // In Google Drive Web, the bootstrap data often looks like: ["1WR4TI87XZbt53ySarce8wVPWkNbxJMnZ","FileName.png",...]
      // Let's search for any text around the IDs
      const allIds = Array.from(new Set(html.match(idRegex) || [])).map(id => id.slice(1, -1));
      
      console.log("IDs:", allIds);
      // Let's print some blocks containing these IDs to extract their real files list
      for (const id of allIds) {
        const idx = html.indexOf(id);
        if (idx !== -1) {
          const start = Math.max(0, idx - 100);
          const end = Math.min(html.length, idx + 200);
          console.log(`ID ${id} nearby:`, html.slice(start, end));
        }
      }
    } catch (err: any) {
      console.error(err);
    }
  }
}

run();
