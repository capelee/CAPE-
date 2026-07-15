import React from "react";
import { Sparkles, X, Zap, Layers, ZoomIn } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface AIWorkflowModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: "dark" | "light" | "sepia";
}

export function AIWorkflowModal({ isOpen, onClose, theme }: AIWorkflowModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 md:p-6"
        >
          <motion.div
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 30, stiffness: 220 }}
            onClick={(e) => e.stopPropagation()}
            className={`w-full max-w-4xl rounded-t-3xl sm:rounded-2xl overflow-hidden shadow-2xl flex flex-col h-[85vh] sm:h-auto max-h-[85vh] sm:max-h-[90vh] border transition-colors duration-300 ${
              theme === "dark" 
                ? "bg-[#0E0E0E] border-white/10 text-zinc-100" 
                : theme === "sepia" 
                ? "bg-[#FAF4E5] border-[#EADECC] text-[#433422]" 
                : "bg-white border-zinc-200 text-zinc-900"
            }`}
          >
            {/* 頂部裝飾條 (手機板 RWD 拖拽把手視覺表示) */}
            <div className="flex sm:hidden justify-center py-2 shrink-0">
              <div className={`w-12 h-1 rounded-full ${
                theme === "dark" ? "bg-zinc-800" : theme === "sepia" ? "bg-[#DECDB2]" : "bg-zinc-200"
              }`} />
            </div>

            {/* 模態框標頭 */}
            <div className={`px-6 py-5 border-b flex items-center justify-between shrink-0 ${
              theme === "dark" ? "border-white/5" : theme === "sepia" ? "border-amber-950/10" : "border-zinc-100"
            }`}>
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl flex items-center justify-center ${
                  theme === "dark" ? "bg-amber-500/10 text-amber-400" : theme === "sepia" ? "bg-amber-700/10 text-[#433422]" : "bg-amber-100 text-amber-700"
                }`}>
                  <Sparkles className="h-5 w-5 animate-pulse" />
                </div>
                <div>
                  <h3 className={`text-base md:text-lg font-display font-semibold ${
                    theme === "dark" ? "text-white" : theme === "sepia" ? "text-[#433422]" : "text-zinc-900"
                  }`}>
                    我的 AI 輔助設計工作流
                  </h3>
                  <p className={`text-[11px] font-mono tracking-wider uppercase mt-0.5 ${
                    theme === "dark" ? "text-zinc-500" : theme === "sepia" ? "text-[#8C7B69]" : "text-zinc-500"
                  }`}>
                    AI-ASSISTED DESIGN & ENGINEERING ENGINE
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                  theme === "dark" 
                    ? "bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white border-white/5" 
                    : theme === "sepia" 
                    ? "bg-[#F4ECD8] hover:bg-[#EFE5CC] text-[#8C7B69] hover:text-[#433422] border-[#E8DCBD]" 
                    : "bg-zinc-50 hover:bg-zinc-100 text-zinc-500 hover:text-zinc-900 border-zinc-200"
                }`}
                title="關閉工作流說明"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* 模態框主體 (可捲動區塊) */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 md:space-y-8 scrollbar-thin">
              
              {/* 引言部分 */}
              <div className={`p-4 md:p-5 rounded-xl border flex flex-col md:flex-row md:items-center gap-4 ${
                theme === "dark" 
                  ? "bg-amber-500/5 border-amber-500/10" 
                  : theme === "sepia" 
                  ? "bg-[#F4ECD8]/40 border-amber-900/10" 
                  : "bg-amber-50/45 border-amber-200/40"
              }`}>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0 ${
                  theme === "dark" ? "bg-amber-500/10" : theme === "sepia" ? "bg-[#EDE2CA]" : "bg-amber-100/50"
                }`}>
                  🚀
                </div>
                <div className="space-y-1">
                  <h4 className={`text-xs md:text-sm font-semibold tracking-wide flex items-center gap-2 ${
                    theme === "sepia" ? "text-amber-950" : theme === "light" ? "text-zinc-800" : "text-amber-400"
                  }`}>
                    人機協作美學理念
                  </h4>
                  <p className={`text-xs leading-relaxed ${
                    theme === "sepia" ? "text-[#5C4D3C]" : theme === "light" ? "text-zinc-600" : "text-zinc-400"
                  }`}>
                    在創意的起點與終點，設計師始終擁有絕對控制。AI 不是在取代創作，而是在極大限度拓展想像力的邊界。通過結構化的提示工程與神經解耦局部重繪，我們將混亂的像素鍛造成富有呼吸感的前端組件。
                  </p>
                </div>
              </div>

              {/* 導航工作流四大流程步驟 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                
                {/* Step 1 */}
                <div className={`p-5 md:p-6 rounded-2xl border transition-all duration-300 flex flex-col justify-between ${
                  theme === "dark" 
                    ? "bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10" 
                    : theme === "sepia" 
                    ? "bg-[#F4ECD8] border-[#E8DCBD]" 
                    : "bg-zinc-50 border-zinc-200/60"
                }`}>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-mono tracking-wider font-semibold uppercase px-2 py-0.5 rounded ${
                        theme === "dark" ? "bg-amber-500/10 text-amber-400" : "bg-amber-500/20 text-amber-800"
                      }`}>STAGES 01</span>
                      <div className={`p-1.5 rounded-lg ${
                        theme === "dark" ? "bg-white/5" : "bg-black/5"
                      }`}>
                        <Zap className={`h-4 w-4 ${
                          theme === "dark" ? "text-amber-400" : "text-amber-800"
                        }`} />
                      </div>
                    </div>
                    
                    <h4 className={`text-sm md:text-base font-semibold ${
                      theme === "dark" ? "text-white" : theme === "sepia" ? "text-[#433422]" : "text-zinc-800"
                    }`}>
                      前期發想｜思維激盪與文案策略
                    </h4>
                    
                    <p className={`text-xs leading-relaxed ${
                      theme === "dark" ? "text-zinc-400" : theme === "sepia" ? "text-[#6C5B48]" : "text-zinc-600"
                    }`}>
                      在專案啟動初期，我將 AI 作為最強大腦，打破單一思考的局限性。輸入核心概念，引導 AI 進行多維度的受眾分析（Target Audience）與市場痛點盲測。同時，利用 AI 產出結構化的 Prompt 關鍵字策略，在極短時間內延伸出多元的視覺風格可能性。
                    </p>

                    <div className="space-y-1.5 pt-2">
                      <span className={`text-[9.5px] font-mono uppercase block ${
                        theme === "dark" ? "text-zinc-500" : "text-zinc-400"
                      }`}>協作工具:</span>
                      <div className={`relative px-3 py-2 rounded-lg font-mono text-[10.5px] leading-relaxed border flex flex-col gap-1 ${
                        theme === "dark" 
                          ? "bg-black/60 text-zinc-300 border-white/5" 
                          : theme === "sepia" 
                          ? "bg-[#EDE2CA] text-[#433422] border-amber-950/5" 
                          : "bg-zinc-100 text-zinc-700 border-zinc-200/50"
                      }`}>
                        <div>• <span className="text-amber-500">Gemini</span>, <span className="text-amber-500">ChatGPT</span></div>
                      </div>
                    </div>
                  </div>

                  <div className={`mt-4 pt-3 border-t text-[11px] leading-relaxed flex items-start gap-1 ${
                    theme === "dark" ? "border-white/5 text-zinc-500" : "border-black/5 text-[#8C7B69]"
                  }`}>
                    <span className="shrink-0 text-amber-500 font-semibold font-sans">💡 生產力產出：</span>
                    <span>【多樣性躍升】 在 1 小時內精準提煉出 5 種不同維度與敘事走向的視覺提案，讓前期的創意漏斗（Funnel）更加寬廣。</span>
                  </div>
                </div>

                {/* Step 2 */}
                <div className={`p-5 md:p-6 rounded-2xl border transition-all duration-300 flex flex-col justify-between ${
                  theme === "dark" 
                    ? "bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10" 
                    : theme === "sepia" 
                    ? "bg-[#F4ECD8] border-[#E8DCBD]" 
                    : "bg-zinc-50 border-zinc-200/60"
                }`}>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-mono tracking-wider font-semibold uppercase px-2 py-0.5 rounded ${
                        theme === "dark" ? "bg-indigo-500/10 text-indigo-400" : "bg-indigo-500/15 text-indigo-800"
                      }`}>STAGES 02</span>
                      <div className={`p-1.5 rounded-lg ${
                        theme === "dark" ? "bg-white/5" : "bg-black/5"
                      }`}>
                        <Layers className={`h-4 w-4 ${
                          theme === "dark" ? "text-indigo-400" : "text-indigo-800"
                        }`} />
                      </div>
                    </div>
                    
                    <h4 className={`text-sm md:text-base font-semibold ${
                      theme === "dark" ? "text-white" : theme === "sepia" ? "text-[#433422]" : "text-zinc-800"
                    }`}>
                      中期探索｜風格原型與視覺盲測
                    </h4>
                    
                    <p className={`text-xs leading-relaxed ${
                      theme === "dark" ? "text-zinc-400" : theme === "sepia" ? "text-[#6C5B48]" : "text-zinc-600"
                    }`}>
                      拒絕傳統耗時的素材搜集，用最快的速度看見創意的形狀。利用前期提煉出的關鍵字，進行多版本的風格原稿生成。在這個階段，我專注於色調、構圖與氛圍（Moodboard）的快速矩陣測試，不發散、不盲目開盲盒，而是精準定調專案的視覺 DNA。
                    </p>

                    <div className="space-y-1.5 pt-2">
                      <span className={`text-[9.5px] font-mono uppercase block ${
                        theme === "dark" ? "text-zinc-500" : "text-zinc-400"
                      }`}>協作工具:</span>
                      <div className={`relative px-3 py-2 rounded-lg font-mono text-[10.5px] leading-relaxed border flex flex-col gap-1 ${
                        theme === "dark" 
                          ? "bg-black/60 text-zinc-300 border-white/5" 
                          : theme === "sepia" 
                          ? "bg-[#EDE2CA] text-[#433422] border-amber-950/5" 
                          : "bg-zinc-100 text-zinc-700 border-zinc-200/50"
                      }`}>
                        <div>• <span className="text-amber-500">Adobe Firefly</span></div>
                        <div>• <span className="text-amber-500">Leonardo AI</span></div>
                        <div>• <span className="text-amber-500">Midjourney</span></div>
                      </div>
                    </div>
                  </div>

                  <div className={`mt-4 pt-3 border-t text-[11px] leading-relaxed flex items-start gap-1 ${
                    theme === "dark" ? "border-white/5 text-zinc-500" : "border-black/5 text-[#8C7B69]"
                  }`}>
                    <span className="shrink-0 text-amber-500 font-semibold font-sans">💡 生產力產出：</span>
                    <span>【專注核心】大幅降低過往在圖庫中大海撈針的繁瑣時間，將工作重心 100% 回歸於設計師最核心的「美學把關」與「精緻度雕琢」。</span>
                  </div>
                </div>

                {/* Step 3 */}
                <div className={`p-5 md:p-6 rounded-2xl border transition-all duration-300 flex flex-col justify-between ${
                  theme === "dark" 
                    ? "bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10" 
                    : theme === "sepia" 
                    ? "bg-[#F4ECD8] border-[#E8DCBD]" 
                    : "bg-zinc-50 border-zinc-200/60"
                }`}>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-mono tracking-wider font-semibold uppercase px-2 py-0.5 rounded ${
                        theme === "dark" ? "bg-emerald-500/10 text-emerald-400" : "bg-emerald-500/15 text-emerald-800"
                      }`}>STAGES 03</span>
                      <div className={`p-1.5 rounded-lg ${
                        theme === "dark" ? "bg-white/5" : "bg-black/5"
                      }`}>
                        <ZoomIn className={`h-4 w-4 ${
                          theme === "dark" ? "text-emerald-400" : "text-emerald-800"
                        }`} />
                      </div>
                    </div>
                    
                    <h4 className={`text-sm md:text-base font-semibold ${
                      theme === "dark" ? "text-white" : theme === "sepia" ? "text-[#433422]" : "text-zinc-800"
                    }`}>
                      後期完稿｜專業精修與商業落地
                    </h4>
                    
                    <p className={`text-xs leading-relaxed ${
                      theme === "dark" ? "text-zinc-400" : theme === "sepia" ? "text-[#6C5B48]" : "text-zinc-600"
                    }`}>
                      AI 產出的只是素材，唯有透過設計師的手，才能轉化為符合市場標準的商品。將 AI 生成的原型匯入專業軟體，進行局部重繪（Inpainting）、光影細修、去背與去瑕疵。利用編修軟體優化角色骨架，並透過 Illustrator 將關鍵視覺進行向量化（Vectorization）與精準排版，確保多解析度輸出的品質。
                    </p>

                    <div className="space-y-1.5 pt-2">
                      <span className={`text-[9.5px] font-mono uppercase block ${
                        theme === "dark" ? "text-zinc-500" : "text-zinc-400"
                      }`}>協作工具:</span>
                      <div className={`relative px-3 py-2 rounded-lg font-mono text-[10.5px] leading-relaxed border flex flex-col gap-1 ${
                        theme === "dark" 
                          ? "bg-black/60 text-zinc-300 border-white/5" 
                          : theme === "sepia" 
                          ? "bg-[#EDE2CA] text-[#433422] border-amber-950/5" 
                          : "bg-zinc-100 text-zinc-700 border-zinc-200/50"
                      }`}>
                        <div>• <span className="text-amber-500">Adobe Photoshop</span></div>
                        <div>• <span className="text-amber-500">Adobe Illustrator</span></div>
                        <div>• <span className="text-amber-500">Canva</span></div>
                      </div>
                    </div>
                  </div>

                  <div className={`mt-4 pt-3 border-t text-[11px] leading-relaxed flex items-start gap-1 ${
                    theme === "dark" ? "border-white/5 text-zinc-500" : "border-black/5 text-[#8C7B69]"
                  }`}>
                    <span className="shrink-0 text-amber-500 font-semibold font-sans">💡 生產力產出：</span>
                    <span>【效率轉化】成功實現「AI 輔助繪圖 20% + 人類美學完稿 80%」的黃金比例，既保有設計師獨特的筆觸與結構主導權，又兼顧了產出效率。</span>
                  </div>
                </div>

                {/* Step 4 */}
                <div className={`p-5 md:p-6 rounded-2xl border transition-all duration-300 flex flex-col justify-between ${
                  theme === "dark" 
                    ? "bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10" 
                    : theme === "sepia" 
                    ? "bg-[#F4ECD8] border-[#E8DCBD]" 
                    : "bg-zinc-50 border-zinc-200/60"
                }`}>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-mono tracking-wider font-semibold uppercase px-2 py-0.5 rounded ${
                        theme === "dark" ? "bg-amber-500/10 text-amber-400" : "bg-[#EDE2CA] text-amber-800"
                      }`}>STAGES 04</span>
                      <div className={`p-1.5 rounded-lg ${
                        theme === "dark" ? "bg-white/5" : "bg-black/5"
                      }`}>
                        <Sparkles className={`h-4 w-4 ${
                          theme === "dark" ? "text-amber-400" : "text-amber-800"
                        }`} />
                      </div>
                    </div>
                    
                    <h4 className={`text-sm md:text-base font-semibold ${
                      theme === "dark" ? "text-white" : theme === "sepia" ? "text-[#433422]" : "text-zinc-800"
                    }`}>
                      印前模擬｜圖生圖與週邊開發
                    </h4>
                    
                    <p className={`text-xs leading-relaxed ${
                      theme === "dark" ? "text-zinc-400" : theme === "sepia" ? "text-[#6C5B48]" : "text-zinc-600"
                    }`}>
                      在正式進入印刷與市集量產前，用技術降低實體製作的容錯率。運用「圖生圖」與結構參考功能，將設計好的 2D 視覺或角色 IP，快速投射至模擬場景（Mockup）中。無論是市集宣傳海報的街頭貼圖，還是壓克力立牌、週邊商品的實體光影模擬，都能在打樣前得到最直觀的視覺驗證。
                    </p>

                    <div className="space-y-1.5 pt-2">
                      <span className={`text-[9.5px] font-mono uppercase block ${
                        theme === "dark" ? "text-zinc-500" : "text-zinc-400"
                      }`}>協作工具:</span>
                      <div className={`relative px-3 py-2 rounded-lg font-mono text-[10.5px] leading-relaxed border flex flex-col gap-1 ${
                        theme === "dark" 
                          ? "bg-black/60 text-zinc-300 border-white/5" 
                          : theme === "sepia" 
                          ? "bg-[#EDE2CA] text-[#433422] border-amber-950/5" 
                          : "bg-zinc-100 text-zinc-700 border-zinc-200/50"
                      }`}>
                        <div>• <span className="text-amber-500">Image-to-Image (圖生圖控制技術)</span></div>
                      </div>
                    </div>
                  </div>

                  <div className={`mt-4 pt-3 border-t text-[11px] leading-relaxed flex items-start gap-1 ${
                    theme === "dark" ? "border-white/5 text-zinc-500" : "border-black/5 text-[#8C7B69]"
                  }`}>
                    <span className="shrink-0 text-amber-500 font-semibold font-sans">💡 生產力產出：</span>
                    <span>【決策加速】透過高擬真的印前視覺模擬，讓概念發想與風格定調時間縮短 60%，大幅降低與印刷廠商、合作夥伴之間的溝通成本。</span>
                  </div>
                </div>

              </div>

              {/* 腳部技巧總結 */}
              <div className={`p-4 rounded-xl border text-center space-y-1.5 ${
                theme === "dark" 
                  ? "bg-zinc-900/60 border-white/5" 
                  : theme === "sepia" 
                  ? "bg-[#EDE2CA]/50 border-amber-950/5" 
                  : "bg-zinc-50 border-zinc-200/50"
              }`}>
                <p className={`text-[11px] font-sans font-medium uppercase tracking-widest ${
                  theme === "dark" ? "text-amber-400" : "text-amber-800"
                }`}>
                  ✦ 人工智能不是對手，而是最具未來感的畫筆 ✦
                </p>
                <p className={`text-[10px] leading-relaxed ${
                  theme === "dark" ? "text-zinc-500" : "text-zinc-600"
                }`}>
                  本站所有視覺插畫、擬真擬立體主視覺，皆誕生自以上設計引擎的深度交融。不間斷地疊代、提煉和磨砺。
                </p>
              </div>

            </div>
            
            {/* 底部按鈕 */}
            <div className={`p-4 border-t flex justify-end shrink-0 ${
              theme === "dark" ? "border-white/5 bg-zinc-950" : theme === "sepia" ? "border-amber-950/10 bg-[#FAF4E5]" : "border-zinc-100 bg-zinc-50"
            }`}>
              <button
                id="btn-workflow-complete"
                type="button"
                onClick={onClose}
                className={`px-5 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  theme === "dark" 
                    ? "bg-amber-500 hover:bg-amber-400 text-black shadow-md shadow-amber-500/10" 
                    : theme === "sepia" 
                    ? "bg-[#D97706] hover:bg-[#B45309] text-amber-50 shadow-md shadow-amber-900/10" 
                    : "bg-zinc-900 hover:bg-zinc-800 text-zinc-50 shadow-md"
                }`}
              >
                探索完成，開始瀏覽作品
              </button>
            </div>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
