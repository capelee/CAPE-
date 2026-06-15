import fetch from "node-fetch";

async function run() {
  const ids = ["1WR4TI87XZbt53ySarce8wVPWkNbxJMnZ", "1pj7P1yrCsfRi6C_RxS7dSVGG-RBTzbMJ"];
  for (const id of ids) {
    const start = Date.now();
    const url = `https://drive.google.com/thumbnail?sz=w1000&id=${id}`;
    console.log(`Fetching ${id}...`);
    try {
      const res = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        }
      });
      console.log(`Status for ${id}: ${res.status} in ${Date.now() - start}ms`);
    } catch (err: any) {
      console.error(`Error fetching ${id}:`, err.message);
    }
  }
}

run();
