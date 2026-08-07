export type ThemeMode = "dark" | "light" | "sepia";

export interface ThemeAccents {
  strokeColor: string;
  fillGlow: string;
  textColor: string;
}

export const CATEGORY_THEMES: Record<string, Record<ThemeMode, ThemeAccents>> = {
  "影音與多媒體設計": {
    sepia: { strokeColor: "#8B5CF6", fillGlow: "rgba(139, 92, 246, 0.08)", textColor: "text-purple-700/60" },
    light: { strokeColor: "#9333EA", fillGlow: "rgba(147, 51, 234, 0.06)", textColor: "text-purple-600/70" },
    dark: { strokeColor: "#A855F7", fillGlow: "rgba(168, 85, 247, 0.15)", textColor: "text-purple-400/80" },
  },
  "企業LOGO與CIS設計": {
    sepia: { strokeColor: "#4F46E5", fillGlow: "rgba(79, 70, 229, 0.08)", textColor: "text-indigo-800/70" },
    light: { strokeColor: "#4338CA", fillGlow: "rgba(67, 56, 202, 0.06)", textColor: "text-indigo-700/80" },
    dark: { strokeColor: "#6366F1", fillGlow: "rgba(99, 102, 241, 0.16)", textColor: "text-indigo-400/80" },
  },
  "網站產品瀑布頁": {
    sepia: { strokeColor: "#0D9488", fillGlow: "rgba(13, 148, 136, 0.08)", textColor: "text-teal-800/70" },
    light: { strokeColor: "#0D9488", fillGlow: "rgba(13, 148, 136, 0.06)", textColor: "text-teal-700/80" },
    dark: { strokeColor: "#14B8A6", fillGlow: "rgba(20, 184, 166, 0.16)", textColor: "text-teal-400/80" },
  },
  "商品周邊企業禮贈品": {
    sepia: { strokeColor: "#D97706", fillGlow: "rgba(217, 119, 6, 0.08)", textColor: "text-amber-800/70" },
    light: { strokeColor: "#D97706", fillGlow: "rgba(217, 119, 6, 0.06)", textColor: "text-amber-700/80" },
    dark: { strokeColor: "#F59E0B", fillGlow: "rgba(245, 158, 11, 0.16)", textColor: "text-amber-400/80" },
  },
  "實體店面與展覽": {
    sepia: { strokeColor: "#0284C7", fillGlow: "rgba(2, 132, 199, 0.08)", textColor: "text-sky-800/70" },
    light: { strokeColor: "#0284C7", fillGlow: "rgba(2, 132, 199, 0.06)", textColor: "text-sky-700/80" },
    dark: { strokeColor: "#0EA5E9", fillGlow: "rgba(14, 165, 233, 0.16)", textColor: "text-sky-400/80" },
  },
  "平面海報廣告設計": {
    sepia: { strokeColor: "#1D4ED8", fillGlow: "rgba(29, 78, 216, 0.08)", textColor: "text-blue-800/70" },
    light: { strokeColor: "#2563EB", fillGlow: "rgba(37, 99, 235, 0.06)", textColor: "text-blue-700/80" },
    dark: { strokeColor: "#3B82F6", fillGlow: "rgba(59, 130, 246, 0.16)", textColor: "text-blue-400/80" },
  },
  "商務印刷品設計": {
    sepia: { strokeColor: "#059669", fillGlow: "rgba(5, 150, 105, 0.08)", textColor: "text-emerald-800/70" },
    light: { strokeColor: "#059669", fillGlow: "rgba(5, 150, 105, 0.06)", textColor: "text-emerald-700/80" },
    dark: { strokeColor: "#10B981", fillGlow: "rgba(16, 185, 129, 0.16)", textColor: "text-emerald-400/80" },
  },
  "角色 IP & 插畫與貼圖": {
    sepia: { strokeColor: "#0891B2", fillGlow: "rgba(8, 145, 178, 0.08)", textColor: "text-cyan-800/70" },
    light: { strokeColor: "#0891B2", fillGlow: "rgba(8, 145, 178, 0.06)", textColor: "text-cyan-700/80" },
    dark: { strokeColor: "#06B6D4", fillGlow: "rgba(6, 182, 212, 0.16)", textColor: "text-cyan-400/80" },
  },
  "賣場 Banner 橫幅廣告": {
    sepia: { strokeColor: "#DB2777", fillGlow: "rgba(219, 39, 119, 0.08)", textColor: "text-pink-800/70" },
    light: { strokeColor: "#DB2777", fillGlow: "rgba(219, 39, 119, 0.06)", textColor: "text-pink-700/80" },
    dark: { strokeColor: "#EC4899", fillGlow: "rgba(236, 72, 153, 0.16)", textColor: "text-pink-400/80" },
  },
  "商業視覺攝影": {
    sepia: { strokeColor: "#E11D48", fillGlow: "rgba(225, 29, 72, 0.08)", textColor: "text-rose-800/70" },
    light: { strokeColor: "#E11D48", fillGlow: "rgba(225, 29, 72, 0.06)", textColor: "text-rose-700/80" },
    dark: { strokeColor: "#F43F5E", fillGlow: "rgba(244, 63, 94, 0.16)", textColor: "text-rose-400/80" },
  },
  "社群行銷小編圖文": {
    sepia: { strokeColor: "#EA580C", fillGlow: "rgba(234, 88, 12, 0.08)", textColor: "text-orange-800/70" },
    light: { strokeColor: "#EA580C", fillGlow: "rgba(234, 88, 12, 0.06)", textColor: "text-orange-700/80" },
    dark: { strokeColor: "#FB923C", fillGlow: "rgba(251, 146, 60, 0.16)", textColor: "text-orange-400/80" },
  },
  "電商產品銷售圖": {
    sepia: { strokeColor: "#C2410C", fillGlow: "rgba(194, 65, 12, 0.08)", textColor: "text-orange-900/70" },
    light: { strokeColor: "#C2410C", fillGlow: "rgba(194, 65, 12, 0.06)", textColor: "text-orange-800/80" },
    dark: { strokeColor: "#F97316", fillGlow: "rgba(249, 115, 22, 0.16)", textColor: "text-orange-400/80" },
  },
};

export function getCategoryTheme(categoryKey: string, theme: ThemeMode): ThemeAccents {
  const cat = CATEGORY_THEMES[categoryKey];
  if (cat && cat[theme]) {
    return cat[theme];
  }
  return CATEGORY_THEMES["影音與多媒體設計"][theme || "dark"];
}
