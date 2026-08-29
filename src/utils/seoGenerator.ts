import { PortfolioItem } from "../types";

export interface ProjectSeoTags {
  title: string;
  description: string;
  keywords: string;
  imageUrl: string;
  pageUrl: string;
  ogTitle: string;
  ogDescription: string;
  twitterTitle: string;
  twitterDescription: string;
  jsonLd: Record<string, any>;
}

export const BASE_URL = "https://cape-eight.vercel.app";
export const DEFAULT_IMAGE = "https://drive.google.com/thumbnail?sz=w1200&id=1WGZs1SZI8NTKaF6M_-IpvD5EjGFll3Ri";

// 針對不同分類的延伸 SEO 關鍵字矩陣
export const CATEGORY_KEYWORD_MAP: Record<string, string[]> = {
  "Logo/CIS": [
    "品牌識別設計",
    "CIS設計",
    "企業Logo設計",
    "商標設計",
    "品牌規範手冊",
    "視覺識別系統",
    "品牌升級",
    "台北品牌設計師"
  ],
  "展場 / 擺攤視覺": [
    "展場視覺設計",
    "特裝展位規劃",
    "展覽主視覺",
    "活動攤位設計",
    "空間視覺企劃",
    "大型海報背板輸出",
    "醫學會展覽設計"
  ],
  "包裝 / 平面設計": [
    "產品包裝設計",
    "精裝禮盒包裝",
    "特殊印刷工藝",
    "雙語排版海報",
    "不對稱幾何網格",
    "燙金打凸工藝",
    "文創商品包裝"
  ],
  "電商 / 廣告視覺": [
    "電商視覺設計",
    "一頁式銷售網頁",
    "產品詳情瀑布頁",
    "社群廣告Banner",
    "蝦皮詳情頁設計",
    "高轉換率視覺行銷"
  ],
  "IP / 角色插畫": [
    "原創角色IP設計",
    "吉祥物設計",
    "LINE貼圖設計",
    "角色插畫",
    "IP衍生品設計",
    "表情包繪製",
    "MuMㄠ聽團貓咪"
  ],
  "影音 / 動畫": [
    "動態視覺設計",
    "Motion Graphics",
    "影音剪輯後製",
    "MG動畫",
    "社群短影音視覺"
  ],
  "亮點設計": [
    "精選設計作品",
    "代表作專案",
    "商業品牌設計案例",
    "台北設計師推薦"
  ]
};

/**
 * 自動為指定的作品卡片 (PortfolioItem) 生成專屬的高權重 SEO Meta Tags
 */
export function generateProjectSeoTags(item: PortfolioItem): ProjectSeoTags {
  const categoryKeywords = CATEGORY_KEYWORD_MAP[item.category] || [item.category, "商業視覺設計"];
  const toolList = Array.isArray(item.tools) && item.tools.length > 0 ? item.tools : ["數位視覺設計"];
  const toolsText = toolList.join("、");

  // 1. 生成高點擊率與精準定位的 Title
  const title = `【${item.category}】${item.title} ${item.titleEn ? `(${item.titleEn}) ` : ""}| Cape Lee (李凱博) 設計作品集`;

  // 2. 自動產生關鍵字密集且通順的 Meta Description (約 120-160 字)
  const cleanPhilosophy = item.philosophy ? item.philosophy.trim().replace(/\s+/g, " ") : "";
  const description = `【${item.category}】${item.title} 設計專案。${cleanPhilosophy} 採用技術與工藝：${toolsText}。由 5~6 年商業實戰經驗的資深視覺設計師 Cape Lee (李凱博) 操刀規劃。`;

  // 3. 自動聚合去重的 Keywords 清單
  const rawKeywords = [
    "李凱博",
    "李凱博設計師",
    "李凱博作品集",
    item.title,
    item.titleEn,
    item.category,
    ...toolList,
    ...categoryKeywords,
    "Cape Lee",
    "Cape Lee作品集",
    "台灣設計師",
    "台北視覺設計"
  ];
  const uniqueKeywords = Array.from(new Set(rawKeywords.filter(Boolean)));
  const keywords = uniqueKeywords.join(", ");

  // 4. 資源路徑與深層連結
  const imageUrl = item.imageUrl || (item.images && item.images.length > 0 ? item.images[0] : DEFAULT_IMAGE);
  const pageUrl = `${BASE_URL}/?item=${encodeURIComponent(item.id)}`;

  // 5. Open Graph 與 Twitter Meta Tags
  const ogTitle = `【${item.category}】${item.title} | Cape Lee (李凱博) 品牌視覺作品`;
  const ogDescription = description;
  const twitterTitle = ogTitle;
  const twitterDescription = description;

  // 6. Schema.org VisualArtwork / CreativeWork 結構化資料
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "VisualArtwork",
    "@id": `${BASE_URL}/#project-${item.id}`,
    "name": item.title,
    "alternateName": item.titleEn || item.title,
    "headline": item.title,
    "description": cleanPhilosophy || description,
    "image": imageUrl,
    "url": pageUrl,
    "mainEntityOfPage": pageUrl,
    "inLanguage": "zh-TW",
    "artform": item.category,
    "artMedium": toolsText,
    "keywords": keywords,
    "creator": {
      "@type": "Person",
      "name": "Cape Lee (李凱博)",
      "alternateName": ["李凱博", "Cape Lee", "CAPELEE", "凱博"],
      "email": "capelee0715@gmail.com",
      "jobTitle": "Senior Brand & Visual Designer",
      "url": BASE_URL,
      "sameAs": [
        "https://www.instagram.com/mumao1",
        "https://www.instagram.com/capelee",
        "https://open.spotify.com/show/3cDZuNyGAzCmJiKzfG3umi"
      ]
    },
    "publisher": {
      "@type": "Organization",
      "name": "Cape Lee Visual Design Studio",
      "url": BASE_URL,
      "logo": {
        "@type": "ImageObject",
        "url": DEFAULT_IMAGE
      }
    }
  };

  return {
    title,
    description,
    keywords,
    imageUrl,
    pageUrl,
    ogTitle,
    ogDescription,
    twitterTitle,
    twitterDescription,
    jsonLd
  };
}
