export interface PortfolioItem {
  id: string;
  category: string;
  title: string;
  titleEn: string;
  philosophy: string;
  tools: string[];
  imageUrl: string;
  placeholderId: string;
  colorTheme: string; // Tailored color accent for hovering effects
  images?: string[]; // Multiple images for project portfolio gallery
  videoUrl?: string; // Optional embedded video link (e.g. YouTube video URL)
  isHighlight?: boolean; // Highlighted featured project cards
  driveFolderId?: string; // Google Drive Folder ID for fully cloud-based assets
  link?: string; // 外部連結、訪問專案或作品網站
}
