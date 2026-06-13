import fs from "fs";

function testMapping(filepath: string) {
  const html = fs.readFileSync(filepath, "utf8");
  
  // Let's search for filenames in the HTML and inspect what's around them.
  // We'll search for things like '01.jpg', '02.jpg', etc.
  const filenames = [
    '01.jpg', '02.jpg', '03.jpg', '04.jpg', '05.jpg', '06.jpg', '07.jpg', '08.jpg',
    '09.jpg', '10.jpg', '11.jpg', '12.jpg', '13.jpg', '14.jpg', '15.jpg', '16.jpg',
    '17.jpg', '18.jpg'
  ];
  
  for (const fn of filenames) {
    let index = 0;
    while (true) {
      index = html.indexOf(fn, index);
      if (index === -1) break;
      
      const start = Math.max(0, index - 500);
      const end = Math.min(html.length, index + 500);
      const context = html.slice(start, end);
      
      // Let's search for any drive-like ID patterns (1 followed by 32 alphanumeric/dash/underscore chars)
      const driveIdRegex = /1[a-zA-Z0-9_-]{32}/g;
      const ids = context.match(driveIdRegex) || [];
      if (ids.length > 0) {
        console.log(`Filename: ${fn} has nearby IDs:`, Array.from(new Set(ids)));
      }
      index += fn.length;
    }
  }
}

testMapping("drive_raw.html");
