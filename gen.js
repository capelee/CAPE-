const colors = [
  { name: "平面設計與排版", color: "sky", hexRgb: "14, 165, 233" },
  { name: "網頁設計程式UIUX", color: "fuchsia", hexRgb: "217, 70, 239" },
  { name: "商業攝影", color: "rose", hexRgb: "244, 63, 94" },
  { name: "影音製作", color: "violet", hexRgb: "139, 92, 246" },
  { name: "印刷完稿", color: "emerald", hexRgb: "16, 185, 129" },
  { name: "IP 與周邊開發", color: "blue", hexRgb: "59, 130, 246" },
  { name: "AI 輔助工作流", color: "yellow", hexRgb: "234, 179, 8" },
  { name: "禮贈品專屬規劃", color: "amber", hexRgb: "245, 158, 11" }
];

let result = "";
for (const c of colors) {
  result += `  "${c.name}": {
    accent: "${c.color}-500",
    rgbaGlow: "${c.hexRgb}",
    borderClass: "group-hover:border-${c.color}-500/30",
    glowClass: "group-hover:shadow-${c.color}-500/15",
    gradientClass: "from-${c.color}-500/30 via-${c.color}-500/90 to-${c.color}-500/20",
    bgClass: "bg-${c.color}-500",
    pulseBorderClass: "border-${c.color}-500/10",
    textClass: "text-${c.color}-500",
    highlightBorderClass: "border-[2px] border-${c.color}-500/35 hover:border-${c.color}-400",
    normalBorderHoverClass: "hover:border-${c.color}-500/40 hover:shadow-${c.color}-500/5",
    titleHoverTextClass: "group-hover:text-${c.color}-400 gap-1.5",
    badgeBorderHoverClass: "group-hover:border-${c.color}-500/40",
    darkBgClass: "bg-${c.color}-500/20 text-${c.color}-400 border border-${c.color}-500/30",
    highlightBgDark: "bg-${c.color}-500/5 hover:bg-${c.color}-500/10",
    highlightBorderDark: "border-${c.color}-500/20 hover:border-${c.color}-500/40",
    highlightShadowDark: "shadow-[unset] hover:shadow-[0_8px_30px_rgba(${c.hexRgb},0.2)]",
    highlightBgLight: "bg-${c.color}-50 hover:bg-${c.color}-100",
    highlightBorderLight: "border-${c.color}-200 hover:border-${c.color}-400",
    highlightShadowLight: "shadow-lg shadow-${c.color}-500/10 hover:shadow-xl hover:shadow-${c.color}-500/20",
    highlightBgSepia: "bg-[rgba(${c.hexRgb},0.05)] hover:bg-[rgba(${c.hexRgb},0.1)]",
    highlightBorderSepia: "border-[rgba(${c.hexRgb},0.2)] hover:border-[rgba(${c.hexRgb},0.4)]",
    highlightShadowSepia: "shadow-lg shadow-[rgba(${c.hexRgb},0.05)] hover:shadow-xl hover:shadow-[rgba(${c.hexRgb},0.15)]",
    normalBgDark: "bg-[unset] hover:bg-zinc-800/80",
    normalBorderDark: "border-white/5 hover:border-${c.color}-500/30",
    normalShadowDark: "shadow-[unset] hover:shadow-[0_4px_20px_rgba(${c.hexRgb},0.1)]",
    normalBgLight: "bg-white/60 hover:bg-white",
    normalBorderLight: "border-zinc-200/50 hover:border-${c.color}-300",
    normalShadowLight: "shadow-sm hover:shadow-md hover:shadow-${c.color}-500/10",
    normalBgSepia: "bg-[#FDFBF7]/60 hover:bg-[#FDFBF7]",
    normalBorderSepia: "border-[#E8DFCE]/50 hover:border-[rgba(${c.hexRgb},0.3)]",
    normalShadowSepia: "shadow-sm hover:shadow-md hover:shadow-[rgba(${c.hexRgb},0.1)]"
  },
`;
}
console.log(result);
