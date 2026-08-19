import { PortfolioItem } from "../types";

export interface ProjectIssue {
  id: string;
  title: string;
  category: string;
  missingTitleEn: boolean;
  missingKeywords: boolean;
  missingPhilosophy: boolean;
  missingImageUrl: boolean;
  details: string[];
}

export interface AuditReport {
  total: number;
  completeCount: number;
  issueCount: number;
  missingTitleEnCount: number;
  missingKeywordsCount: number;
  missingPhilosophyCount: number;
  missingImageCount: number;
  issues: ProjectIssue[];
  timestamp: string;
}

/**
 * 掃描 portfolioData 結構，檢查每個專案是否缺少 titleEn (英文標題)、SEO 關鍵字/工具標籤、設計理念或封面圖片
 */
export function auditPortfolioData(items: PortfolioItem[]): AuditReport {
  const issues: ProjectIssue[] = [];
  let missingTitleEnCount = 0;
  let missingKeywordsCount = 0;
  let missingPhilosophyCount = 0;
  let missingImageCount = 0;

  for (const item of items) {
    const details: string[] = [];

    // 檢查英文標題 (titleEn)
    const isMissingTitleEn = !item.titleEn || !item.titleEn.trim() || item.titleEn.trim() === item.title.trim();
    if (isMissingTitleEn) {
      missingTitleEnCount++;
      details.push("缺少或無效的英文標題 (titleEn)");
    }

    // 檢查 SEO 關鍵字與工具標籤 (tools)
    const isMissingKeywords = !Array.isArray(item.tools) || item.tools.length === 0 || item.tools.every(t => !t || !t.trim());
    if (isMissingKeywords) {
      missingKeywordsCount++;
      details.push("缺少 SEO 關鍵字/技術工具標籤 (tools)");
    }

    // 檢查設計理念 (philosophy)
    const isMissingPhilosophy = !item.philosophy || item.philosophy.trim().length < 10;
    if (isMissingPhilosophy) {
      missingPhilosophyCount++;
      details.push("缺少或過短的設計理念 (philosophy)");
    }

    // 檢查封面圖片 (imageUrl)
    const isMissingImage = !item.imageUrl || !item.imageUrl.trim();
    if (isMissingImage) {
      missingImageCount++;
      details.push("缺少封面圖片 (imageUrl)");
    }

    if (details.length > 0) {
      issues.push({
        id: item.id,
        title: item.title,
        category: item.category,
        missingTitleEn: isMissingTitleEn,
        missingKeywords: isMissingKeywords,
        missingPhilosophy: isMissingPhilosophy,
        missingImageUrl: isMissingImage,
        details
      });
    }
  }

  const completeCount = items.length - issues.length;

  return {
    total: items.length,
    completeCount,
    issueCount: issues.length,
    missingTitleEnCount,
    missingKeywordsCount,
    missingPhilosophyCount,
    missingImageCount,
    issues,
    timestamp: new Date().toISOString()
  };
}

/**
 * 在瀏覽器開發者控制台輸出格式化且清晰的內容審計報告
 */
export function printAuditReport(report: AuditReport): void {
  const isAllComplete = report.issueCount === 0;

  const headerStyle = `
    background: ${isAllComplete ? "#065F46" : "#7C2D12"};
    color: #FFFFFF;
    font-size: 13px;
    font-weight: bold;
    padding: 6px 12px;
    border-radius: 4px;
  `;

  console.groupCollapsed(
    `%c[Portfolio Content Audit / 作品集內容審計報告] 總計: ${report.total} 項 | 完整: ${report.completeCount} 項 | 待補全: ${report.issueCount} 項`,
    headerStyle
  );

  console.log(
    `%c審計時間：%c${new Date(report.timestamp).toLocaleString("zh-TW")}`,
    "font-weight: bold; color: #6B7280;",
    "color: #111827;"
  );

  console.table({
    "作品總數 (Total)": report.total,
    "完整無缺 (Complete)": report.completeCount,
    "待優化項目 (With Issues)": report.issueCount,
    "缺少英文標題 (Missing titleEn)": report.missingTitleEnCount,
    "缺少關鍵字標籤 (Missing tools)": report.missingKeywordsCount,
    "缺少設計理念 (Missing philosophy)": report.missingPhilosophyCount,
    "缺少封面圖 (Missing imageUrl)": report.missingImageCount
  });

  if (report.issues.length > 0) {
    console.warn(
      `%c⚠️ 發現 ${report.issues.length} 個作品存在缺失欄位，請參考下方清單進行補全：`,
      "font-weight: bold; color: #D97706;"
    );

    const formattedTable = report.issues.map((issue, idx) => ({
      編號: idx + 1,
      專案ID: issue.id,
      作品名稱: issue.title,
      所屬分類: issue.category,
      缺失項目: issue.details.join(" | ")
    }));

    console.table(formattedTable);
  } else {
    console.log(
      "%c🎉 所有作品的 titleEn、SEO 關鍵字、設計理念與圖片資源皆已 100% 完整配置！",
      "font-weight: bold; color: #10B981;"
    );
  }

  console.groupEnd();
}

/**
 * 執行審計並自動在 Console 輸出結果
 */
export function runPortfolioAudit(items: PortfolioItem[], autoPrint: boolean = true): AuditReport {
  const report = auditPortfolioData(items);
  if (autoPrint) {
    printAuditReport(report);
  }
  return report;
}

export const AuditUtils = {
  auditPortfolioData,
  printAuditReport,
  runPortfolioAudit
};

export default AuditUtils;
