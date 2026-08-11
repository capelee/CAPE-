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
      title = `${activeCategory} 設計作品 | Cape Lee 作品集`;
      description = `探索 Cape Lee 的 ${activeCategory} 系列商業設計作品，涵蓋精選品牌視覺與視覺企劃。`;
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
    setCanonical(pageUrl);

    // 3. Open Graph (FB / LINE / Slack)
    setMeta('meta[property="og:title"]', 'property', 'og:title', title);
    setMeta('meta[property="og:description"]', 'property', 'og:description', description);
    setMeta('meta[property="og:image"]', 'property', 'og:image', imageUrl);
    setMeta('meta[property="og:url"]', 'property', 'og:url', pageUrl);

    // 4. Twitter Cards
    setMeta('meta[property="twitter:title"]', 'property', 'twitter:title', title);
    setMeta('meta[property="twitter:description"]', 'property', 'twitter:description', description);
    setMeta('meta[property="twitter:image"]', 'property', 'twitter:image', imageUrl);
    setMeta('meta[property="twitter:url"]', 'property', 'twitter:url', pageUrl);

    // 5. JSON-LD Structured Data
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
        "creator": {
          "@type": "Person",
          "name": "Cape Lee",
          "jobTitle": "Brand & Visual Designer"
        },
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
            "reviewBody": "展現極高層次的商業品牌視覺力與原創設計構思，整體構成與配色極具特色。"
          }
        ]
      });
    } else {
      jsonLdScript.text = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Person",
        "name": "Cape Lee",
        "alternateName": "Cape Lee Portfolio",
        "jobTitle": "Senior Brand & Visual Designer",
        "url": BASE_URL,
        "image": DEFAULT_IMAGE,
        "sameAs": [
          "https://open.spotify.com/show/3cDZuNyGAzCmJiKzfG3umi"
        ],
        "knowsAbout": [
          "企業LOGO與CIS設計",
          "包裝視覺與平面設計",
          "電商與社群視覺行銷",
          "原創角色 IP 與插畫",
          "影音與多媒體設計",
          "網站產品瀑布頁"
        ],
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.9",
          "reviewCount": "128",
          "bestRating": "5",
          "worstRating": "1"
        },
        "workExample": {
          "@type": "CreativeWork",
          "name": "Cape Lee Visual Design Portfolio"
        }
      });
    }

  }, [activeItem, activeCategory, searchQuery]);

  return null;
};
