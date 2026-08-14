import React from "react";
import { X, Mail, Globe, ExternalLink, Award, Download, Instagram } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: "dark" | "light" | "sepia";
  profile: any;
  downloadVCard: () => void;
  vCardText: string;
}

export function ContactModal({ isOpen, onClose, theme, profile, downloadVCard, vCardText }: ContactModalProps) {
  React.useEffect(() => {
    if (isOpen) {
      document.body.classList.add("overflow-hidden");
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          onClose();
        }
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => {
        document.body.classList.remove("overflow-hidden");
        window.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4"
        >
          <motion.div
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 30, stiffness: 220 }}
            onClick={(e) => e.stopPropagation()}
            className={`w-full max-w-2xl rounded-t-3xl sm:rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh] border transition-colors duration-300 ${
              theme === "dark" 
                ? "bg-[#0E0E0E] border-white/10 text-zinc-100" 
                : theme === "sepia" 
                ? "bg-[#FAF4E5] border-[#EADECC] text-[#433422]" 
                : "bg-white border-zinc-200 text-zinc-900"
            }`}
          >
            {/* 頂部標題 */}
            <div className={`px-6 py-4 border-b flex items-center justify-between shrink-0 ${
              theme === "dark" ? "border-white/5" : theme === "sepia" ? "border-amber-950/10" : "border-zinc-100"
            }`}>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-bold text-base tracking-tight">儲存聯絡資訊</h3>
              </div>
              <button
                type="button"
                onClick={onClose}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  theme === "dark" ? "hover:bg-white/10 text-zinc-400" : "hover:bg-black/5 text-zinc-500"
                }`}
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* 內容區域 */}
            <div className="p-6 overflow-y-auto space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                
                {/* 左側：精緻數位名片展示 (佔 7 欄) */}
                <div className="md:col-span-7 flex flex-col justify-between">
                  <div className={`relative overflow-hidden rounded-2xl border p-5 shadow-lg flex flex-col h-full justify-between gap-6 ${
                    theme === "dark"
                      ? "bg-gradient-to-br from-zinc-900 via-zinc-950 to-black border-white/10 hover:border-amber-500/30"
                      : theme === "sepia"
                      ? "bg-gradient-to-br from-[#FAF4E5] via-[#F4ECD8] to-[#EDE2CA] border-[#E8DCBD] shadow-[#433422]/5"
                      : "bg-gradient-to-br from-white via-zinc-50 to-zinc-100 border-zinc-200 shadow-zinc-250/50"
                  }`}>
                    {/* 裝飾背景 */}
                    <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-xl pointer-events-none"></div>
                    
                    <div className="space-y-4 relative z-10">
                      {/* 名片頂部：Logo / 頭像與公司 */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-12 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-600 flex items-center justify-center text-white text-lg font-display font-semibold shadow-md">
                            CP
                          </div>
                          <div className="space-y-0.5">
                            <span className="text-[10px] font-mono tracking-widest uppercase opacity-60">Creative Designer</span>
                            <h4 className="font-display font-medium text-xs tracking-wide opacity-80">{profile.company}</h4>
                          </div>
                        </div>
                        <span className={`text-[9px] font-mono border px-1.5 py-0.5 rounded ${
                          theme === "dark" ? "border-amber-500/30 text-amber-400 bg-amber-500/5" : "border-amber-600/30 text-amber-800 bg-amber-600/5"
                        }`}>vCard Standard</span>
                      </div>

                      {/* 名片中部：名字與職位 */}
                      <div className="pt-2">
                        <h2 className={`text-xl font-display font-bold tracking-tight ${
                          theme === "dark" 
                            ? "text-white" 
                            : theme === "sepia" 
                            ? "text-[#382B1D]" 
                            : "text-zinc-900"
                        }`}>
                          {profile.name}
                        </h2>
                        <p className="text-xs font-sans text-amber-500/95 font-medium mt-1">{profile.title}</p>
                      </div>

                      {/* 名片詳細資訊 */}
                      <div className={`space-y-2.5 text-xs pt-3 border-t ${
                        theme === "dark" ? "border-white/5" : "border-black/5"
                      }`}>
                        <div className="flex items-center gap-3">
                          <Mail className="h-3.5 w-3.5 opacity-60 text-amber-500 shrink-0" />
                          <span className="font-mono opacity-80 select-all">{profile.email}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Instagram className="h-3.5 w-3.5 opacity-60 text-amber-500 shrink-0" />
                          <a 
                            href={profile.instagramUrl || "https://www.instagram.com/mumao1_the_cat_religion/"} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="opacity-80 hover:text-amber-500 hover:underline inline-flex items-center gap-1 transition-colors font-mono"
                          >
                            <span>Instagram ({profile.instagramHandle || "@mumao1_the_cat_religion"})</span>
                            <ExternalLink className="h-2.5 w-2.5" />
                          </a>
                        </div>
                        <div className="flex items-center gap-3">
                          <Globe className="h-3.5 w-3.5 opacity-60 text-amber-500 shrink-0" />
                          <a href={profile.portfolioUrl} target="_blank" rel="noopener noreferrer" className="opacity-80 hover:text-amber-500 hover:underline inline-flex items-center gap-1 transition-colors">
                            <span>PDF 作品集</span>
                            <ExternalLink className="h-2.5 w-2.5" />
                          </a>
                        </div>
                        <div className="flex items-center gap-3">
                          <Award className="h-3.5 w-3.5 opacity-60 text-amber-500 shrink-0" />
                          <span className="opacity-80">6 年以上品牌商業整合設計實戰經驗</span>
                        </div>
                      </div>
                    </div>

                    {/* 底部按鈕 */}
                    <div className={`pt-4 border-t flex flex-col gap-2 ${
                      theme === "dark" ? "border-white/5" : "border-black/5"
                    }`}>
                      <button
                        type="button"
                        onClick={downloadVCard}
                        className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black shadow-md shadow-amber-500/10 active:scale-98 transition-all cursor-pointer"
                      >
                        <Download className="h-3.5 w-3.5" />
                        <span>一鍵下載並匯入通訊錄 (.vcf)</span>
                      </button>

                      <a
                        href={profile.instagramUrl || "https://www.instagram.com/mumao1_the_cat_religion/"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`w-full inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                          theme === "dark"
                            ? "border-pink-500/30 bg-pink-500/10 hover:bg-pink-500/20 text-pink-300"
                            : theme === "sepia"
                            ? "border-pink-700/30 bg-pink-700/10 hover:bg-pink-700/20 text-pink-900"
                            : "border-pink-500/30 bg-pink-50 hover:bg-pink-100 text-pink-700"
                        }`}
                      >
                        <Instagram className="h-3.5 w-3.5" />
                        <span>前往 Instagram 粉專 ({profile.instagramHandle || "@mumao1_the_cat_religion"})</span>
                        <ExternalLink className="h-2.5 w-2.5" />
                      </a>
                    </div>
                  </div>
                </div>

                {/* 右側：QR Code 掃描區 (佔 5 欄) */}
                <div className="md:col-span-5 flex flex-col items-center justify-center space-y-4">
                  <div className="p-4 bg-white rounded-2xl shadow-xl border border-zinc-100 flex items-center justify-center max-w-[200px] md:max-w-none w-full aspect-square">
                    {/* 完美高對比、相機最易辨識的實體 QR Code */}
                    <img 
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(vCardText)}`}
                      alt="vCard QR Code"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  
                  <div className="text-center space-y-1 px-2">
                    <p className={`text-xs font-medium ${
                      theme === "dark" ? "text-zinc-300" : "text-zinc-700"
                    }`}>手機相機掃描 QR Code</p>
                    <p className="text-[10px] text-zinc-500 leading-normal">
                      可直接在智慧型手機上辨識並「加入聯絡人」，迅速建立客製化商務橋樑。
                    </p>
                  </div>
                </div>

              </div>

            </div>

            {/* 底部收起 */}
            <div className={`p-4 border-t flex items-center justify-between shrink-0 ${
              theme === "dark" ? "border-white/5 bg-zinc-950" : theme === "sepia" ? "border-amber-950/10 bg-[#FAF4E5]" : "border-zinc-100 bg-zinc-50"
            }`}>
              <span className="text-[10px] text-zinc-500">
                ✦ Business Contact Sync Platform v1.1
              </span>
              <button
                type="button"
                onClick={onClose}
                className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  theme === "dark" 
                    ? "bg-zinc-800 hover:bg-zinc-700 text-zinc-300" 
                    : theme === "sepia" 
                    ? "bg-[#EDE2CA] hover:bg-[#E2D5B9] text-[#433422]" 
                    : "bg-zinc-100 hover:bg-zinc-200 text-zinc-600"
                }`}
              >
                關閉名片
              </button>
            </div>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
