import { initialPortfolioData } from './src/data';

interface Detail {
  id: string;
  title: string;
  category: string;
  imageCount: number;
  imageUrl: string;
}

const mapByImage = new Map<string, typeof initialPortfolioData>();
initialPortfolioData.forEach(item => {
  const primary = item.imageUrl;
  if (!mapByImage.has(primary)) {
    mapByImage.set(primary, []);
  }
  mapByImage.get(primary)!.push(item);
});

console.log("--- MULTIPLE ITEMS SHARING THE SAME PRIMARY IMAGE ---");
for (const [img, items] of mapByImage.entries()) {
  if (items.length > 1) {
    console.log(`Image: ${img}`);
    items.forEach(itm => {
      console.log(`   - ID: ${itm.id} | Title: ${itm.title} | Cat: ${itm.category}`);
    });
  }
}

console.log("\n--- SEARCHING FOR CROSS-CONTAMINATION IN PHILOSOPHY ---");
// Check if philosophy mentions a different project's core keyword
initialPortfolioData.forEach(item => {
  const phil = item.philosophy.toLowerCase();
  const title = item.title.toLowerCase();
  
  if (phil.includes("金鏟子") && !title.includes("鏟") && !title.includes("鏟子")) {
    console.log(`Mismatch (金鏟子): ID ${item.id} "${item.title}" philosophy talks about金鏟子`);
  }
  if (phil.includes("鸚哥魚") && !title.includes("鸚哥魚")) {
    console.log(`Mismatch (鸚哥魚): ID ${item.id} "${item.title}" philosophy talks about鸚哥魚`);
  }
  if (phil.includes("胸針") && !title.includes("胸針") && !title.includes("徽章") && !title.includes("別針") && !title.includes("名牌")) {
    // If it's a bookmark or trophy but mentions chest pin
    if (title.includes("書籤") || title.includes("獎盤") || title.includes("帳篷") || title.includes("水壺") || title.includes("墊") || title.includes("相框") || title.includes("馬克杯") || title.includes("袋子") || title.includes("獎盃")) {
      console.log(`Mismatch (胸針/別針 in non-badge): ID ${item.id} "${item.title}" philosophy mentions chest pin/badge/別針`);
    }
  }
  if (phil.includes("別針") && !title.includes("徽章") && !title.includes("別針") && !title.includes("名牌")) {
    if (title.includes("書籤") || title.includes("獎盤") || title.includes("餐券") || title.includes("墊") || title.includes("杯") || title.includes("袋") || title.includes("盤") || title.includes("琉璃")) {
       console.log(`Mismatch (別針 in non-badge): ID ${item.id} "${item.title}" philosophy talks about別針`);
    }
  }
  if (phil.includes("徽章") && !title.includes("徽章") && !title.includes("別針") && !title.includes("名牌")) {
    if (title.includes("書籤") || title.includes("獎盤") || title.includes("杯墊") || title.includes("野餐墊") || title.includes("袋") || title.includes("盤") || title.includes("琉璃") || title.includes("撲克牌") || title.includes("鏟子")) {
       console.log(`Mismatch (徽章 in non-badge): ID ${item.id} "${item.title}" philosophy talks about徽章`);
    }
  }
});
