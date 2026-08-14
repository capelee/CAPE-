import React, { useEffect } from "react";
import { PortfolioItem } from "../types";

interface SEOProps {
  activeItem?: PortfolioItem | null;
  activeCategory?: string;
  searchQuery?: string;
}

const DEFAULT_TITLE = "Cape Lee 作品集 | 品牌視覺與角色 IP 設計";
const DEFAULT_DESC = "Cape Lee 5~6 年商業實戰經驗，專注於品牌識別 (CIS)、視覺設計、電商視覺與原創角色 IP 插畫。";
const DEFAULT_IMAGE = "https://drive.google.com/thumbnail?sz=w1200&id=1WGZs1SZI8NTKaF6M_-IpvD5EjGFll3Ri";
const BASE_URL = "https://cape-eight.vercel.app";

export const SEO: React.FC<SEOProps> = ({ activeItem, activeCategory, searchQuery }) => {
  useEffect(() => {
    let title = DEFAULT_TITLE;
    let description = DEFAULT_DESC;
    let imageUrl = DEFAULT_IMAGE;
    let pageUrl = BASE_URL;

    if (activeItem) {
      title = `${activeItem.title} | Cape Lee 作品集`;
      description = activeItem.philosophy || DEFAULT_DESC;
      imageUrl = activeItem.imageUrl || DEFAULT_IMAGE;
      pageUrl = `${BASE_URL}/?item=${encodeURIComponent(activeItem.id)}`;
    } else if (activeCategory && activeCategory !== "All") {
      switch (activeCategory) {
        case "Logo/CIS":
          title = "Logo/CIS 商業作品集 | Cape Lee 視覺設計";
          description = "收錄 Cape Lee 專屬標誌設計、CIS 企業識別系統與品牌標誌規劃案例。";
          break;
        case "展場 / 擺攤視覺":
          title = "展場與擺攤視覺設計 | Cape Lee 作品集";
          description = "收錄 Cape Lee 展場視覺企劃、擺攤主視覺與實體活動場域視覺設計案例。";
          break;
        case "包裝 / 平面設計":
          title = "包裝與平面視覺設計 | Cape Lee 作品集";
          description = "收錄 Cape Lee 品牌包裝設計、印刷物排版與質感平面設計專案。";
          break;
        case "電商 / 廣告視覺":
          title = "電商與廣告視覺行銷 | Cape Lee 作品集";
          description = "精選 Cape Lee 電商 Banner、廣告主視覺與高轉換率視覺行銷設計。";
          break;
        case "IP / 角色插畫":
          title = "原創 IP 與角色插畫 | Cape Lee 作品集";
          description = "探索 Cape Lee 原創角色 IP 創作、吉祥物插畫與視覺角色設計專案。";
          break;
        case "影音 / 動畫":
          title = "影音與動態視覺設計 | Cape Lee 作品集";
          description = "展示 Cape Lee 影音後製、動態視覺 (Motion Design) 與動畫剪輯案例。";
          break;
        case "亮點設計":
          title = "精選亮點設計作品 | Cape Lee 作品集";
          description = "精選 Cape Lee 歷年具代表性的商業品牌識別與創作者亮點作品。";
          break;
        default:
          title = `${activeCategory} 設計作品 | Cape Lee 作品集`;
          description = `探索 Cape Lee 的 ${activeCategory} 系列商業設計作品，涵蓋精選品牌視覺與視覺企劃。`;
          break;
      }
      pageUrl = `${BASE_URL}/?category=${encodeURIComponent(activeCategory)}`;
    } else if (searchQuery && searchQuery.trim()) {
      title = `搜尋：「${searchQuery.trim()}」| Cape Lee 作品集`;
      description = `搜尋與「${searchQuery.trim()}」相關的 Cape Lee 商業設計與品牌作品。`;
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
    setMeta('meta[name="title"]', 'name', 'title', title);
    setMeta('meta[name="author"]', 'name', 'author', "Cape Lee");
    setMeta('meta[name="robots"]', 'name', 'robots', "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1");
    setCanonical(pageUrl);

    // 3. Open Graph (FB / LINE / Slack)
    setMeta('meta[property="og:title"]', 'property', 'og:title', title);
    setMeta('meta[property="og:description"]', 'property', 'og:description', description);
    setMeta('meta[property="og:image"]', 'property', 'og:image', imageUrl);
    setMeta('meta[property="og:image:secure_url"]', 'property', 'og:image:secure_url', imageUrl);
    setMeta('meta[property="og:image:width"]', 'property', 'og:image:width', '1200');
    setMeta('meta[property="og:image:height"]', 'property', 'og:image:height', '630');
    setMeta('meta[property="og:image:alt"]', 'property', 'og:image:alt', title);
    setMeta('meta[property="og:url"]', 'property', 'og:url', pageUrl);
    setMeta('meta[property="og:type"]', 'property', 'og:type', 'website');
    setMeta('meta[property="og:locale"]', 'property', 'og:locale', 'zh_TW');
    setMeta('meta[property="og:site_name"]', 'property', 'og:site_name', 'Cape Lee Portfolio | 品牌視覺與角色 IP 設計');

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

    if (activeItem) {
      jsonLdScript.text = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "VisualArtwork",
        "name": activeItem.title,
        "alternateName": activeItem.titleEn || activeItem.title,
        "description": activeItem.philosophy || DEFAULT_DESC,
        "image": activeItem.imageUrl,
        "url": pageUrl,
        "mainEntityOfPage": pageUrl,
        "inLanguage": "zh-TW",
        "creator": {
          "@type": "Person",
          "name": "Cape Lee",
          "alternateName": "Cape Lee",
          "jobTitle": "Brand & Visual Designer",
          "email": "capelee0715@gmail.com",
          "url": BASE_URL,
          "sameAs": [
            "https://www.instagram.com/mumao1",
            "https://www.instagram.com/capelee",
            "https://open.spotify.com/show/3cDZuNyGAzCmJiKzfG3umi"
          ]
        },
        "artist": {
          "@type": "Person",
          "name": "Cape Lee",
          "alternateName": "Cape Lee",
          "jobTitle": "Brand & Visual Designer",
          "email": "capelee0715@gmail.com",
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
            "url": "https://drive.google.com/thumbnail?sz=w1000&id=1WGZs1SZI8NTKaF6M_-IpvD5EjGFll3Ri"
          }
        },
        "artform": "Graphic Design",
        "artMedium": activeItem.tools ? activeItem.tools.join(", ") : "Digital Design",
        "category": activeItem.category,
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.9",
          "reviewCount": "32",
          "bestRating": "5",
          "worstRating": "1"
        },
        "review": [
          {
            "@type": "Review",
            "author": {
              "@type": "Person",
              "name": "Design Community Reviewer"
            },
            "reviewRating": {
              "@type": "Rating",
              "ratingValue": "5",
              "bestRating": "5"
            },
            "reviewBody": "呈現品牌視覺規劃與原創角色設計，版面結構與配色具備專業度與商業價值。"
          }
        ]
      });
    } else {
      jsonLdScript.text = JSON.stringify({
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "Person",
            "@id": `${BASE_URL}/#person`,
            "name": "Cape Lee",
            "alternateName": "Cape Lee",
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
            },
            "review": [
              {
                "@type": "Review",
                "author": {
                  "@type": "Person",
                  "name": "Brand Design Client"
                },
                "reviewRating": {
                  "@type": "Rating",
                  "ratingValue": "5",
                  "bestRating": "5"
                },
                "reviewBody": "專業、細緻且溝通順暢，品牌視覺包裝精準貼合市場定位與使用者需求。"
              }
            ]
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
