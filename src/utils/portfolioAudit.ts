import { PortfolioItem } from "../types";
import { initialPortfolioData } from "../data";

export interface PortfolioAuditItemResult {
  id: string;
  category: string;
  title: string;
  titleEn: string;
  philosophySnippet: string;
  issues: string[];
  missingFields: {
    titleZh: boolean;
    philosophyZh: boolean;
    categoryZh: boolean;
    titleEn: boolean;
  };
  item: PortfolioItem;
}

export interface PortfolioAuditSummary {
  totalItems: number;
  completeItemsCount: number;
  itemsWithIssuesCount: number;
  issuesBreakdown: {
    missingTitleZh: number;
    missingPhilosophyZh: number;
    missingCategoryZh: number;
    missingTitleEn: number;
  };
  itemsWithIssues: PortfolioAuditItemResult[];
}

/**
 * 檢查字串是否包含中文字元 (CJK 統一表意文字)
 */
export function containsChinese(str: string | undefined | null): boolean {
  if (!str) return false;
  return /[\u4e00-\u9fa5\u3400-\u4dbf\u20000-\u2a6df]/.test(str);
}

/**
 * 掃描 portfolioData 資料結構，檢查缺少中文標題、描述、分類或英文對照的作品物件
 * 
 * @param items 可選傳入作品資料陣列，預設使用 initialPortfolioData
 * @param options 控制選項，例如是否印出控制台日誌 (預設 true)
 * @returns 完整稽核結果報告物件
 */
export function auditPortfolioTranslations(
  items: PortfolioItem[] = initialPortfolioData,
  options: { logToConsole?: boolean } = { logToConsole: true }
): PortfolioAuditSummary {
  const itemsWithIssues: PortfolioAuditItemResult[] = [];
  let missingTitleZhCount = 0;
  let missingPhilosophyZhCount = 0;
  let missingCategoryZhCount = 0;
  let missingTitleEnCount = 0;

  items.forEach((item) => {
    const issues: string[] = [];

    // 檢查中文標題
    const hasTitleZh = containsChinese(item.title);
    if (!item.title || !item.title.trim()) {
      issues.push("缺少中文標題 (Title is empty)");
    } else if (!hasTitleZh) {
      issues.push("標題僅包含英文/數字，未包含中文 (Title lacks Chinese characters)");
    }

    // 檢查中文設計理念 / 描述
    const hasPhilosophyZh = containsChinese(item.philosophy);
    if (!item.philosophy || !item.philosophy.trim()) {
      issues.push("缺少設計理念/描述 (Philosophy is empty)");
    } else if (!hasPhilosophyZh) {
      issues.push("設計理念僅包含英文，缺乏中文描述 (Philosophy lacks Chinese characters)");
    }

    // 檢查中文分類
    const hasCategoryZh = containsChinese(item.category);
    if (!item.category || !item.category.trim()) {
      issues.push("缺少作品分類 (Category is empty)");
    } else if (!hasCategoryZh) {
      issues.push("作品分類未包含中文 (Category lacks Chinese characters)");
    }

    // 檢查英文標題對照
    const hasTitleEn = Boolean(item.titleEn && item.titleEn.trim());
    if (!hasTitleEn) {
      issues.push("缺少英文標題對照 (titleEn is missing)");
    }

    // 計數更新
    if (!hasTitleZh) missingTitleZhCount++;
    if (!hasPhilosophyZh) missingPhilosophyZhCount++;
    if (!hasCategoryZh) missingCategoryZhCount++;
    if (!hasTitleEn) missingTitleEnCount++;

    if (issues.length > 0) {
      itemsWithIssues.push({
        id: item.id,
        category: item.category || "(未指定分類)",
        title: item.title || "(無標題)",
        titleEn: item.titleEn || "(無英文標題)",
        philosophySnippet: item.philosophy
          ? item.philosophy.slice(0, 40) + (item.philosophy.length > 40 ? "..." : "")
          : "(無描述)",
        issues,
        missingFields: {
          titleZh: !hasTitleZh,
          philosophyZh: !hasPhilosophyZh,
          categoryZh: !hasCategoryZh,
          titleEn: !hasTitleEn,
        },
        item,
      });
    }
  });

  const summary: PortfolioAuditSummary = {
    totalItems: items.length,
    completeItemsCount: items.length - itemsWithIssues.length,
    itemsWithIssuesCount: itemsWithIssues.length,
    issuesBreakdown: {
      missingTitleZh: missingTitleZhCount,
      missingPhilosophyZh: missingPhilosophyZhCount,
      missingCategoryZh: missingCategoryZhCount,
      missingTitleEn: missingTitleEnCount,
    },
    itemsWithIssues,
  };

  if (options.logToConsole) {
    console.group("🔍 [Portfolio Data Translation Audit / 作品集中文語系掃描報告]");
    console.log(
      `📊 總作品數: %c${summary.totalItems}%c 項 | 完整雙語: %c${summary.completeItemsCount}%c 項 | 待補充/不完整: %c${summary.itemsWithIssuesCount}%c 項`,
      "font-weight:bold; color:#3b82f6;",
      "",
      "font-weight:bold; color:#22c55e;",
      "",
      "font-weight:bold; color:#ef4444;",
      ""
    );

    console.log("📈 缺失欄位統計:", summary.issuesBreakdown);

    if (summary.itemsWithIssues.length > 0) {
      console.groupCollapsed(`⚠️ 缺少中文或需人工翻譯補充的作品列表 (${summary.itemsWithIssues.length} 項)`);
      
      const tableData = summary.itemsWithIssues.map((res) => ({
        "ID": res.id,
        "分類 (Category)": res.category,
        "標題 (Title)": res.title,
        "英文標題 (TitleEn)": res.titleEn,
        "待補充項目 (Issues)": res.issues.join(" | "),
      }));
      console.table(tableData);

      console.log("📋 缺失詳細清單物件 (點擊展開可複製原始 JSON進行人工翻譯):");
      summary.itemsWithIssues.forEach((res, index) => {
        console.group(`[${index + 1}/${summary.itemsWithIssues.length}] ID: ${res.id}`);
        console.log("標題:", res.title);
        console.log("英文標題:", res.titleEn);
        console.log("分類:", res.category);
        console.log("設計理念 / 描述:", res.item.philosophy);
        console.log("缺少原因:", res.issues);
        console.log("原始物件:", res.item);
        console.groupEnd();
      });

      console.groupEnd();
    } else {
      console.log("✅ 太棒了！所有作品物件皆已包含中文標題與中文描述。");
    }

    console.groupEnd();
  }

  return summary;
}

/**
 * 綁定全域瀏覽器 DevTools 工具函式，方便開發者在控制台隨時輸入 auditPortfolio() 執行掃描
 */
if (typeof window !== "undefined") {
  (window as any).auditPortfolio = (customItems?: PortfolioItem[]) =>
    auditPortfolioTranslations(customItems || initialPortfolioData, { logToConsole: true });
}
