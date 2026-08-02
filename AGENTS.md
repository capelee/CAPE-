# AI Coding Agent Custom Guidelines / 專案開發規範

Whenever you create or modify portfolio card items inside `src/data.ts` (or any secondary components), you must strictly enforce the following minimalist content-formatting rules for Portfolio Items (`PortfolioItem` interface).

---

## 1. 作品名稱 / Card Title (`title`)
- **簡潔專業**：作品名稱應直接、客觀，無冗餘綴字。
- **去行銷化**：嚴禁使用主觀或浮誇形容詞（如：「極致」、「頂級」、「奢華」、「高端」、「精心」）。
- **無裝飾符號**：避免加上多餘的裝飾性冒號、逗號或行銷標語。

---

## 2. 設計理念 / Design Philosophy (`philosophy`)
- **嚴格字數限制**：設計理念長度必須「嚴格控制在 45 至 80 字之間」，任何情況下都「絕對不可超過 100 字」（含標點符號）。
- **無自我提及／開頭冗餘**：
  - 嚴禁開頭使用「本專案為...」、「本專案以...」、「本作品是...」、「設計理念是...」、「此設計專為...」、「我們希望呈現...」等 introductory 贅語。
  - 必須直接從核心設計手法、視覺構成元素、排版網格切入。
  - *範例*：「以...配色為底，以...結合...，強化...，展現...美學。」
- **全面去行銷化**：
  - 徹底刪除所有主觀、浮誇、推銷性質的修飾詞（例如：極致、奢華、尊榮、高端、精品級、頂級、完美、強烈、無比、獨特、精心、科幻、暖心、美輪美奐、匠心獨運、完美融合、令人驚艷、不二之舉等）。
- **語系要求**：一律使用「繁體中文（台灣）」，符合台灣本地主流設計美學語彙。

---

## 3. 技術工具 / Technologies & Tools (`tools`)
- **長度限 10 字以內**：`tools` 陣列中的每一個英/中文字串（技術、工具、工藝等名稱），長度「必須在 10 字以內」（精確控制在 10 個字元以下）。
- **無括號附註**：絕對不允許帶有中英文括號註記等贅餘說明（例如選用「燙金工藝」，不可寫「亮金高壓立體燙金工藝 (Hot Gold Foil Stamping)」）。
- **乾淨簡短的工具代表名稱**：
  - Illustrator/Adobe Illustrator -> `Ai`
  - Photoshop/Adobe Photoshop -> `Photoshop`
  - After Effects/Adobe After Effects -> `AE`
  - Premiere Pro/Adobe Premiere Pro -> `Premiere`
  - Procreate -> `Procreate`
  - 3D Rendering -> `3D渲染`
  - Vector graphics/Vector graphic -> `向量圖`
  - Infographics/Infographic -> `資訊圖表`
  - Copywriting -> `文案`
  - Color Theory -> `色彩配色`
- **中文字串工藝/手法名精簡化**：
  - 舉例：「向量插畫」、「雙語排版」、「不對稱網格」、「品牌包裝」、「貼圖設計」、「手繪草稿」、「3D模型」、「符號設計」。

---

## 4. 外部連結 / External Links (`link`)
- **非必要不放置**：未來新增的作品卡片，若無使用者特別指定或要求，預設「不要放置圖文連結（`link` 欄位）」。

---

## 5. 精選/亮點標籤 / Highlight Tag (`isHighlight`)
- **非必要不設定**：未來新增的作品卡片，若無使用者特別指定或要求，預設「不要放置亮點卡片標籤（預設設為 false 或不設置 `isHighlight: true`）」。

---

## 6. 新增卡片預防機制 / Hook Restrictions (If any input fields exist in UI)
- For any code in the portfolio visual interface (`App.tsx`) where user or developer can dynamically input cards, make sure content gets passed through trimming/cleaning helper functions matching the rules above.
