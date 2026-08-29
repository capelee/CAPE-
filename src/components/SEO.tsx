import React, { useEffect } from "react";
import { PortfolioItem } from "../types";
import { generateProjectSeoTags, BASE_URL, DEFAULT_IMAGE } from "../utils/seoGenerator";

interface SEOProps {
  activeItem?: PortfolioItem | null;
  activeCategory?: string;
  searchQuery?: string;
}

const DEFAULT_TITLE = "Cape Lee (李凱博) 作品集 | 品牌視覺與角色 IP 設計";
const DEFAULT_DESC = "Cape Lee (李凱博) 擁有 5~6 年商業實戰經驗，專注於品牌識別 (CIS 設計)、Logo 商標設計、原創角色 IP 插畫與 LINE 貼圖。精通包裝視覺設計、電商一頁式網頁與產品瀑布頁、雙語排版海報與不對稱網格設計。";
const DEFAULT_KEYWORDS = "李凱博, 李凱博設計師, 李凱博作品集, Cape Lee, Cape Lee作品集, 品牌識別設計, CIS識別手冊, Logo商標設計, 原創 IP 角色設計, LINE貼圖設計, 吉祥物表情包, 包裝視覺設計, 文創包裝, 電商一頁式網頁設計, 產品瀑布頁設計, 向量插畫設計, 雙語排版海報, 不對稱網格構成, 台北設計師推薦";

export const SEO: React.FC<SEOProps> = ({ activeItem, activeCategory, searchQuery }) => {
  useEffect(() => {
    let title = DEFAULT_TITLE;
    let description = DEFAULT_DESC;
    let keywords = DEFAULT_KEYWORDS;
    let imageUrl = DEFAULT_IMAGE;
    let pageUrl = BASE_URL;
    let ogType = "website";
    let activeJsonLd: any = null;

    if (activeItem) {
      // 使用關鍵字導向的自動化 SEO Meta Tag 產生器
      const seoTags = generateProjectSeoTags(activeItem);
      title = seoTags.title;
      description = seoTags.description;
      keywords = seoTags.keywords;
      imageUrl = seoTags.imageUrl;
      pageUrl = seoTags.pageUrl;
      ogType = "article";
      activeJsonLd = seoTags.jsonLd;
    } else if (activeCategory && activeCategory !== "All") {
      switch (activeCategory) {
        case "Logo/CIS":
          title = "Logo/CIS 商業品牌識別作品集 | Cape Lee 視覺設計";
          description = "精選 Cape Lee 品牌識別系統 (CIS)、Logo 商標設計、企業標準色彩計畫與 Brand Guidelines 規範手冊案例。";
          keywords = "Logo設計, CIS設計, 企業識別系統, 品牌設計, 商標設計, 品牌手冊, Cape Lee, 台北設計師";
          break;
        case "展場 / 擺攤視覺":
          title = "展場與特裝攤位視覺設計 | Cape Lee 作品集";
          description = "收錄 Cape Lee 醫療學會年會特裝展位、文創擺攤主視覺、展覽空間背板輸出與實體活動場域視覺企劃。";
          keywords = "展場設計, 特裝展位, 攤位視覺, 展覽主視覺, 空間視覺, 年會視覺, Cape Lee";
          break;
        case "包裝 / 平面設計":
          title = "包裝視覺與平面排版設計 | Cape Lee 作品集";
          description = "精選 Cape Lee 品牌包裝設計、精裝禮盒、特殊印刷工藝、雙語排版海報與不對稱幾何網格構成專案。";
          keywords = "包裝設計, 禮盒包裝, 印刷工藝, 燙金打凸, 平面設計, 雙語排版, 海報設計, Cape Lee";
          break;
        case "電商 / 廣告視覺":
          title = "電商一頁式網頁與廣告視覺行銷 | Cape Lee 作品集";
          description = "收錄 Cape Lee 蝦皮產品詳情瀑布頁、一頁式銷售網頁、社群行銷廣告 Banner 與高轉換率電商視覺設計。";
          keywords = "電商設計, 產品瀑布頁, 一頁式網頁, 蝦皮詳情頁, 廣告Banner, 視覺行銷, Cape Lee";
          break;
        case "IP / 角色插畫":
          title = "原創角色 IP 與 LINE 貼圖插畫 | Cape Lee 作品集";
          description = "探索 Cape Lee 原創角色 IP (MuMㄠ 聽團貓咪)、企業吉祥物插畫、LINE 行動貼圖表情包與文創周邊衍生品視覺。";
          keywords = "角色IP, 吉祥物設計, LINE貼圖, 原創插畫, 表情包設計, MuMㄠ, 貓咪IP, Cape Lee";
          break;
        case "影音 / 動畫":
          title = "影音剪輯與動態視覺設計 | Cape Lee 作品集";
          description = "展示 Cape Lee 影音後製剪輯、動態視覺 (Motion Design) 與動畫短影音行銷專案。";
          keywords = "動態視覺, Motion Design, 影音剪輯, MG動畫, 短影音行銷, Cape Lee";
          break;
        case "亮點設計":
          title = "精選亮點設計作品 | Cape Lee 作品集";
          description = "精選 Cape Lee 歷年具代表性的商業品牌識別、展會空間與創作者原創角色亮點作品。";
          keywords = "精選設計作品, 亮點作品, 品牌代表作, 視覺設計精選, Cape Lee";
          break;
        default:
          title = `${activeCategory} 設計作品 | Cape Lee 作品集`;
          description = `探索 Cape Lee 的 ${activeCategory} 系列商業設計作品，涵蓋精選品牌視覺與視覺企劃。`;
          keywords = `${activeCategory}, 商業設計, Cape Lee, 視覺設計`;
          break;
      }
      pageUrl = `${BASE_URL}/?category=${encodeURIComponent(activeCategory)}`;
    } else if (searchQuery && searchQuery.trim()) {
      title = `搜尋：「${searchQuery.trim()}」| Cape Lee 設計作品集`;
      description = `搜尋與「${searchQuery.trim()}」相關的 Cape Lee 商業品牌識別、包裝設計、角色 IP 與電商視覺作品。`;
      keywords = `${searchQuery.trim()}, Cape Lee, 設計作品搜尋`;
    }

    // 1. Update Document Title
    document.title = title;

    // Helper function to update or create meta tag
    const setMeta = (selector: string, attrName: string, attrVal: string, content: string) => {
      let el = document.querySelector(selector) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attrName, attrVal);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    // Helper function to update link rel canonical
    const setCanonical = (url: string) => {
      let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
      if (!link) {
        link = document.createElement("link");
        link.setAttribute("rel", "canonical");
        document.head.appendChild(link);
      }
      link.setAttribute("href", url);
    };

    // 2. Standard Meta
    setMeta('meta[name="description"]', 'name', 'description', description);
    setMeta('meta[name="keywords"]', 'name', 'keywords', keywords);
    setMeta('meta[name="title"]', 'name', 'title', title);
    setMeta('meta[name="author"]', 'name', 'author', "Cape Lee (李凱博)");
    setMeta('meta[name="robots"]', 'name', 'robots', "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1");
    setCanonical(pageUrl);

    // 3. Open Graph (FB / LINE / Slack / Discord)
    setMeta('meta[property="og:title"]', 'property', 'og:title', title);
    setMeta('meta[property="og:description"]', 'property', 'og:description', description);
    setMeta('meta[property="og:image"]', 'property', 'og:image', imageUrl);
    setMeta('meta[property="og:image:secure_url"]', 'property', 'og:image:secure_url', imageUrl);
    setMeta('meta[property="og:image:width"]', 'property', 'og:image:width', '1200');
    setMeta('meta[property="og:image:height"]', 'property', 'og:image:height', '630');
    setMeta('meta[property="og:image:alt"]', 'property', 'og:image:alt', title);
    setMeta('meta[property="og:url"]', 'property', 'og:url', pageUrl);
    setMeta('meta[property="og:type"]', 'property', 'og:type', ogType);
    setMeta('meta[property="og:locale"]', 'property', 'og:locale', 'zh_TW');
    setMeta('meta[property="og:site_name"]', 'property', 'og:site_name', 'Cape Lee (李凱博) Portfolio | 品牌視覺與角色 IP 設計');

    if (activeItem) {
      setMeta('meta[property="article:section"]', 'property', 'article:section', activeItem.category);
      setMeta('meta[property="article:author"]', 'property', 'article:author', "Cape Lee (李凱博)");
    }

    // 4. Twitter Cards
    setMeta('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary_large_image');
    setMeta('meta[name="twitter:title"]', 'name', 'twitter:title', title);
    setMeta('meta[name="twitter:description"]', 'name', 'twitter:description', description);
    setMeta('meta[name="twitter:image"]', 'name', 'twitter:image', imageUrl);
    setMeta('meta[name="twitter:image:alt"]', 'name', 'twitter:image:alt', title);
    setMeta('meta[name="twitter:url"]', 'name', 'twitter:url', pageUrl);

    // 5. JSON-LD Main Structured Data
    let jsonLdScript = document.getElementById("json-ld-seo") as HTMLScriptElement | null;
    if (!jsonLdScript) {
      jsonLdScript = document.createElement("script");
      jsonLdScript.id = "json-ld-seo";
      jsonLdScript.type = "application/ld+json";
      document.head.appendChild(jsonLdScript);
    }

    if (activeItem && activeJsonLd) {
      jsonLdScript.text = JSON.stringify(activeJsonLd);
    } else {
      jsonLdScript.text = JSON.stringify({
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "Person",
            "@id": `${BASE_URL}/#person`,
            "name": "Cape Lee (李凱博)",
            "alternateName": ["李凱博", "Cape Lee", "CAPELEE", "凱博"],
            "jobTitle": "Senior Brand & Visual Designer",
            "email": "capelee0715@gmail.com",
            "url": BASE_URL,
            "image": DEFAULT_IMAGE,
            "sameAs": [
              "https://www.instagram.com/mumao1",
              "https://www.instagram.com/capelee",
              "https://open.spotify.com/show/3cDZuNyGAzCmJiKzfG3umi"
            ],
            "knowsLanguage": ["zh-TW", "en"],
            "knowsAbout": [
              "企業LOGO與CIS設計",
              "包裝視覺與平面設計",
              "電商與社群視覺行銷",
              "原創角色 IP 與插畫",
              "影音與多媒體設計",
              "網站產品瀑布頁"
            ]
          },
          {
            "@type": "ProfessionalService",
            "@id": `${BASE_URL}/#service`,
            "name": "Cape Lee Visual Design Studio",
            "url": BASE_URL,
            "logo": DEFAULT_IMAGE,
            "image": DEFAULT_IMAGE,
            "description": "提供專業品牌識別設計 (CIS)、展場與擺攤主視覺、包裝視覺、電商視覺與原創角色 IP 插畫開發服務。",
            "provider": {
              "@id": `${BASE_URL}/#person`
            },
            "areaServed": "TW",
            "priceRange": "$$",
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.9",
              "reviewCount": "128",
              "bestRating": "5",
              "worstRating": "1"
            }
          }
        ]
      });
    }

    // 6. JSON-LD BreadcrumbList Structured Data
    let breadcrumbScript = document.getElementById("json-ld-breadcrumb") as HTMLScriptElement | null;
    if (!breadcrumbScript) {
      breadcrumbScript = document.createElement("script");
      breadcrumbScript.id = "json-ld-breadcrumb";
      breadcrumbScript.type = "application/ld+json";
      document.head.appendChild(breadcrumbScript);
    }

    const breadcrumbListItems: Array<{
      "@type": string;
      position: number;
      name: string;
      item: string;
    }> = [
      {
        "@type": "ListItem",
        position: 1,
        name: "Cape Lee 作品集",
        item: `${BASE_URL}/`
      }
    ];

    if (activeItem) {
      const catName = activeItem.category || "作品分類";
      breadcrumbListItems.push({
        "@type": "ListItem",
        position: 2,
        name: catName,
        item: `${BASE_URL}/?category=${encodeURIComponent(catName)}`
      });
      breadcrumbListItems.push({
        "@type": "ListItem",
        position: 3,
        name: activeItem.title,
        item: pageUrl
      });
    } else if (activeCategory && activeCategory !== "All") {
      breadcrumbListItems.push({
        "@type": "ListItem",
        position: 2,
        name: activeCategory,
        item: pageUrl
      });
    }

    breadcrumbScript.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": breadcrumbListItems
    });

  }, [activeItem, activeCategory, searchQuery]);

  return null;
};

