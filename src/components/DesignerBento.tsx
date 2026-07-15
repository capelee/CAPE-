import React, { useState } from "react";
import { 
  Sparkles, 
  ChevronDown, 
  Briefcase, 
  GraduationCap, 
  Award, 
  CheckCircle2, 
  Layers, 
  Camera, 
  Video, 
  Printer, 
  Zap, 
  Mail, 
  QrCode,
  Check,
  FileText
} from "lucide-react";
import { MinimalistLogo } from "./MinimalistLogo";

interface DesignerBentoProps {
  theme: "dark" | "light" | "sepia";
  profile: {
    name: string;
    engName: string;
    title: string;
    company: string;
    school: string;
    dept: string;
    experience: string;
    desireTitle: string;
    email: string;
    portfolioUrl: string;
    pdfPortfolioUrl?: string;
    intro: string;
    education: Array<{
      school: string;
      dept: string;
      info: string;
      activities?: string[];
    }>;
    certificates: Array<{
      name: string;
      issuer: string;
    }>;
    experienceList: Array<{
      title: string;
      company: string;
      badge: string;
    }>;
    scopes: Array<{
      id: string;
      title: string;
      desc: string;
      badge: string;
    }>;
  };
  setIsContactCardOpen: (open: boolean) => void;
  onCopyEmail?: () => void;
  setIsWorkflowOpen?: (open: boolean) => void;
}

export function DesignerBento({ theme, profile, setIsContactCardOpen, onCopyEmail, setIsWorkflowOpen }: DesignerBentoProps) {
  const [localCopied, setLocalCopied] = useState<boolean>(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(profile.email);
    setLocalCopied(true);
    if (onCopyEmail) {
      onCopyEmail();
    }
    setTimeout(() => {
      setLocalCopied(false);
    }, 2000);
  };

  return (
    <section id="designer-bento" className="relative scroll-mt-[48px] md:scroll-mt-[58px]">
      <div className="absolute -top-32 -left-32 w-72 h-72 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>
      
      <div className={`border rounded-2xl p-6 lg:p-8 relative overflow-hidden shadow-2xl transition-all duration-300 ${
        theme === "sepia"
          ? "bg-[#F5ECD8] border-[#DFD0B8] text-[#433422]"
          : theme === "light"
          ? "bg-white border-zinc-200 text-zinc-800 shadow-zinc-200/50"
          : "bg-gradient-to-b from-[#111]/90 to-[#0c0c0c]/90 border-white/5 text-white"
      }`}>
        <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-2xl pointer-events-none ${
          theme === "dark" ? "bg-indigo-500/5" : "bg-indigo-500/[0.02]"
        }`}></div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 lg:gap-6 items-start">
          
          {/* 第一欄：個人身分與品牌自述 (佔 4 欄) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="flex items-center gap-4">
              <MinimalistLogo size={64} theme={theme} className="shrink-0" />
              <div>
                <h1 className={`text-2xl md:text-3xl font-display font-bold tracking-tight ${
                  theme === "sepia" ? "text-[#2B1B0C]" : theme === "light" ? "text-zinc-950" : "text-white"
                }`}>{profile.name}</h1>
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5">
              <span className={`text-[10px] font-sans font-medium px-3 py-1 rounded-full flex items-center gap-1 shadow-inner ${
                theme === "sepia"
                  ? "bg-amber-700/10 text-amber-900 border border-amber-700/20"
                  : theme === "light"
                  ? "bg-amber-500/10 text-amber-800 border border-amber-500/20"
                  : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
              }`}>
                <Sparkles className="h-2.5 w-2.5 shrink-0 animate-pulse text-amber-300" />
                <span>{profile.title}</span>
              </span>
              <span className={`text-[10px] font-sans font-medium px-3 py-1 rounded-full border ${
                theme === "sepia" 
                  ? "bg-amber-950/5 text-[#5C4D3C] border-amber-950/10" 
                  : theme === "light" 
                  ? "bg-zinc-100 text-zinc-600 border-zinc-200" 
                  : "bg-white/5 text-zinc-400 border-white/10"
              }`}>
                {profile.company}
              </span>
            </div>

            {/* 履歷簡介 */}
            <div className={`border rounded-xl p-4 lg:p-5 ${
              theme === "sepia"
                ? "bg-[#FAF4E5]/80 border-[#EADECC]"
                : theme === "light"
                ? "bg-zinc-50 border-zinc-200"
                : "bg-white/[0.01] border-white/5"
            }`}>
              <div className="flex items-center gap-1.5 mb-2.5">
                <div className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse"></div>
                <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Biography summary / 專業特質</p>
              </div>
              <p className={`text-xs leading-relaxed font-light ${
                theme === "sepia" ? "text-[#433422]" : theme === "light" ? "text-zinc-700" : "text-zinc-300"
              }`}>
                {profile.intro}
              </p>
            </div>

            {/* 聯繫資訊與期望 */}
            <div className={`space-y-3 text-[13px] leading-relaxed font-light pt-2 pl-1 border-l-2 border-amber-500/20 ${
              theme === "sepia" ? "text-[#433422]" : theme === "light" ? "text-zinc-700" : "text-zinc-300"
            }`}>
              <div className="flex items-center gap-3">
                <Award className="h-4 w-4 text-amber-400 shrink-0" />
                <span>期望職缺：<span className={`transition-colors font-medium underline underline-offset-4 decoration-amber-500/40 ${
                  theme === "sepia" ? "text-[#2B1B0C] hover:text-amber-700" : theme === "light" ? "text-zinc-950 hover:text-amber-600" : "text-white hover:text-amber-400"
                }`}>{profile.desireTitle}</span></span>
              </div>
              <div className="flex items-center gap-3 group/mail cursor-pointer" onClick={handleCopyEmail}>
                {localCopied ? (
                  <Check className="h-4 w-4 text-green-500 shrink-0" />
                ) : (
                  <Mail className="h-4 w-4 text-zinc-500 group-hover/mail:text-amber-400 transition-colors shrink-0" />
                )}
                <span className={`font-mono transition-colors text-[12px] flex items-center gap-1.5 ${
                  theme === "sepia" 
                    ? "text-[#6C5B48] group-hover/mail:text-[#2B1B0C]" 
                    : theme === "light" 
                    ? "text-zinc-500 group-hover/mail:text-zinc-900" 
                    : "text-zinc-400 group-hover/mail:text-white"
                }`}>
                  {profile.email}
                  {localCopied && <span className="text-[10px] text-green-500 font-sans font-normal">(已複製!)</span>}
                </span>
              </div>
            </div>

            {/* 2026作品集主要按鈕與一鍵儲存聯絡資訊 */}
            <div className="pt-2 flex flex-col gap-2.5">
              <a 
                href={profile.portfolioUrl}
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black transition-all shadow-lg shadow-amber-500/25 active:scale-98 text-center uppercase tracking-wide font-sans scroll-smooth"
              >
                <span>PDF 作品集 ↗</span>
              </a>

              {profile.pdfPortfolioUrl && profile.pdfPortfolioUrl !== profile.portfolioUrl && (
                <a 
                  href={profile.pdfPortfolioUrl}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={`w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-xl border transition-all duration-300 shadow-md active:scale-98 text-center uppercase tracking-wide font-sans ${
                    theme === "dark"
                      ? "border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800 text-zinc-200"
                      : theme === "sepia"
                      ? "border-[#DFCFA0] bg-[#FCF8EE]/50 hover:bg-[#DFCFA0]/20 text-[#4F3C28]"
                      : "border-zinc-200 bg-zinc-50 hover:bg-zinc-100 text-zinc-700"
                  }`}
                >
                  <FileText className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                  <span>傳統雲端 PDF 作品集 ↗</span>
                </a>
              )}

              <button
                type="button"
                onClick={() => setIsContactCardOpen(true)}
                className={`w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-xl border transition-all duration-300 shadow-md active:scale-98 text-center uppercase tracking-wide font-sans cursor-pointer ${
                  theme === "dark"
                    ? "border-amber-500/25 bg-amber-500/10 hover:bg-amber-500 hover:text-black hover:border-amber-400 text-amber-400"
                    : theme === "sepia"
                    ? "border-amber-700/25 bg-amber-700/10 hover:bg-amber-700 hover:text-white hover:border-amber-600 text-amber-900"
                    : "border-amber-600/25 bg-amber-500/10 hover:bg-amber-600 hover:text-white hover:border-amber-500 text-amber-700"
                }`}
              >
                <QrCode className="h-3.5 w-3.5" />
                <span>一鍵儲存聯絡資訊 (vCard)</span>
              </button>

              <button
                type="button"
                onClick={() => setIsWorkflowOpen && setIsWorkflowOpen(true)}
                className={`w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-xl border transition-all duration-300 shadow-md active:scale-98 text-center uppercase tracking-wide font-sans cursor-pointer ${
                  theme === "dark"
                    ? "border-amber-500/25 bg-amber-500/10 hover:bg-amber-500 hover:text-black hover:border-amber-400 text-amber-400"
                    : theme === "sepia"
                    ? "border-amber-700/25 bg-amber-700/10 hover:bg-amber-700 hover:text-white hover:border-amber-600 text-amber-900"
                    : "border-amber-600/25 bg-amber-500/10 hover:bg-amber-600 hover:text-white hover:border-amber-500 text-amber-700"
                }`}
              >
                <Sparkles className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                <span>AI 輔助設計工作流</span>
              </button>
            </div>
          </div>

          {/* 第二欄：個人工作經歷與教育學歷 (佔 4 欄) */}
          <div className="lg:col-span-4 space-y-3 lg:space-y-6">
            
            {/* 實戰經歷 */}
            <div className={`space-y-3 transition-all duration-300 ${
              theme === "sepia"
                ? "max-lg:bg-[#FAF4E5]/40 max-lg:border max-lg:border-[#EADECC]/40 max-lg:p-4 max-lg:rounded-2xl"
                : theme === "light"
                ? "max-lg:bg-zinc-50 max-lg:border max-lg:border-zinc-200 max-lg:p-4 max-lg:rounded-2xl"
                : "max-lg:bg-white/[0.012] max-lg:border max-lg:border-white/5 max-lg:p-4 max-lg:rounded-2xl"
            }`}>
              <div className="flex items-center justify-between pl-1 select-none py-1 lg:py-0">
                <div className="flex items-center gap-1.5">
                  <Briefcase className="h-4 w-4 text-amber-400 shrink-0" />
                  <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Work History / 實戰經歷</p>
                </div>
              </div>
              
              <div>
                <div className={`space-y-2.5 pt-1.5 lg:pt-0 relative before:absolute before:bottom-2 before:top-2 before:left-[9px] before:w-[1px] ${
                  theme === "sepia" ? "before:bg-[#EADECC]" : theme === "light" ? "before:bg-zinc-200" : "before:bg-white/10"
                }`}>
                  {profile.experienceList.map((exp, i) => (
                    <div key={i} className="flex gap-2.5 pl-0.5 relative group">
                      <div className={`h-[18px] w-[18px] rounded-full flex items-center justify-center transition-colors duration-300 z-10 shrink-0 mt-0.5 ${
                        theme === "sepia"
                          ? "bg-[#FAF4E5] border border-[#EADECC]/80 text-[#8C7B69] group-hover:border-amber-750 group-hover:text-amber-800"
                          : theme === "light"
                          ? "bg-white border border-zinc-200 text-zinc-500 group-hover:border-amber-600 group-hover:text-amber-600"
                          : "bg-[#0a0a0a] border border-white/10 text-zinc-500 group-hover:border-amber-400 group-hover:text-amber-400"
                      }`}>
                        <span className="text-[8px] font-mono font-bold leading-none">{i + 1}</span>
                      </div>
                      <div className="space-y-px min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className={`text-[12px] font-medium tracking-tight leading-tight transition-colors duration-200 ${
                            theme === "sepia"
                              ? "text-[#2B1B0C] group-hover:text-amber-800"
                              : theme === "light"
                              ? "text-zinc-950 group-hover:text-amber-600"
                              : "text-white group-hover:text-amber-400"
                          }`}>{exp.title}</span>
                          <span className={`text-[8px] font-mono px-1 rounded leading-none py-0.5 ${
                            exp.badge === "現任" 
                              ? theme === "sepia"
                                ? "bg-amber-700/10 text-amber-900 border border-amber-700/20 font-medium"
                                : theme === "light"
                                ? "bg-amber-100 text-amber-800 border border-amber-200 font-medium"
                                : "bg-amber-500/10 text-amber-400 border border-amber-500/20 font-medium" 
                              : theme === "sepia"
                              ? "bg-[#EADECC]/40 text-[#6C5B48]"
                              : theme === "light"
                              ? "bg-zinc-100 text-zinc-500"
                              : "bg-white/5 text-zinc-500"
                          }`}>
                            {exp.badge}
                          </span>
                        </div>
                        <p className={`text-[10px] font-light truncate leading-relaxed ${
                          theme === "sepia" ? "text-[#5C4D3C]" : theme === "light" ? "text-zinc-600" : "text-zinc-400"
                        }`}>{exp.company}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 特色學歷 */}
            <div className={`space-y-3 lg:pt-1 transition-all duration-300 ${
              theme === "sepia"
                ? "max-lg:bg-[#FAF4E5]/40 max-lg:border max-lg:border-[#EADECC]/40 max-lg:p-4 max-lg:rounded-2xl"
                : theme === "light"
                ? "max-lg:bg-zinc-50 max-lg:border max-lg:border-zinc-200 max-lg:p-4 max-lg:rounded-2xl"
                : "max-lg:bg-white/[0.012] max-lg:border max-lg:border-white/5 max-lg:p-4 max-lg:rounded-2xl"
            }`}>
              <div className="flex items-center justify-between pl-1 select-none py-1 lg:py-0">
                <div className="flex items-center gap-1.5">
                  <GraduationCap className="h-4 w-4 text-indigo-400 shrink-0" />
                  <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Education / 專業學歷</p>
                </div>
              </div>
              
              <div>
                <div className={`space-y-2.5 pt-1.5 lg:pt-0 relative before:absolute before:bottom-2 before:top-2 before:left-[9px] before:w-[1px] ${
                  theme === "sepia" ? "before:bg-[#EADECC]" : theme === "light" ? "before:bg-zinc-200" : "before:bg-white/10"
                }`}>
                  {profile.education.map((edu, i) => (
                    <div key={i} className={`flex gap-2.5 p-1.5 -mx-1.5 rounded-lg relative group transition-all duration-300 ${
                      theme === "sepia"
                        ? "hover:bg-[#E3D3BE]/40"
                        : theme === "light"
                        ? "hover:bg-zinc-100"
                        : "hover:bg-white/[0.03]"
                    }`}>
                      <div className={`h-[18px] w-[18px] rounded-full border flex items-center justify-center transition-all duration-300 z-10 shrink-0 mt-0.5 group-hover:scale-105 ${
                        theme === "sepia"
                          ? "bg-[#FAF4E5] border-[#EADECC]/80 text-[#8C7B69] group-hover:border-indigo-500 group-hover:text-indigo-500"
                          : theme === "light"
                          ? "bg-white border-zinc-200 text-zinc-500 group-hover:border-indigo-500 group-hover:text-indigo-500"
                          : "bg-[#0a0a0a] border-white/10 text-zinc-500 group-hover:border-indigo-400 group-hover:text-indigo-400"
                      }`}>
                        <div className="h-1 w-1 rounded-full bg-indigo-500 transition-transform duration-300 group-hover:scale-110" />
                      </div>
                      <div className="space-y-px min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className={`text-[12px] font-medium tracking-tight leading-tight transition-colors duration-200 ${
                            theme === "sepia"
                              ? "text-[#2B1B0C] group-hover:text-indigo-600"
                              : theme === "light"
                              ? "text-zinc-950 group-hover:text-indigo-600"
                              : "text-white group-hover:text-[#818CF8]"
                          }`}>{edu.school}</span>
                          <span className={`text-[8px] font-mono px-1 rounded leading-none py-0.5 ${
                            theme === "sepia"
                              ? "bg-indigo-700/10 text-indigo-900 border border-indigo-700/20"
                              : theme === "light"
                              ? "bg-indigo-100 text-indigo-800 border border-indigo-200"
                              : "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                          }`}>
                            {edu.info}
                          </span>
                        </div>
                        <p className={`text-[10px] font-light leading-relaxed ${
                          theme === "sepia" ? "text-[#5C4D3C]" : theme === "light" ? "text-zinc-600" : "text-zinc-400"
                        }`}>{edu.dept}</p>
                        {edu.activities && edu.activities.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {edu.activities.map((act, idx) => (
                              <span 
                                key={idx} 
                                className={`text-[8.5px] font-sans px-1.5 py-0.5 rounded transition-all duration-300 ${
                                  theme === "sepia"
                                    ? "bg-[#EADECC]/60 text-[#433422] border border-[#D5C2A5]"
                                    : theme === "light"
                                    ? "bg-zinc-100 text-zinc-700 border border-zinc-200"
                                    : "bg-zinc-800/80 text-zinc-300 border border-zinc-700/50"
                                }`}
                              >
                                {act}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 專業證照 */}
            <div className={`space-y-3 lg:pt-3.5 lg:border-t transition-all duration-300 ${
              theme === "sepia"
                ? "border-[#EADECC]/60 max-lg:bg-[#FAF4E5]/40 max-lg:border max-lg:border-[#EADECC]/40 max-lg:p-4 max-lg:rounded-2xl"
                : theme === "light"
                ? "border-zinc-200 max-lg:bg-zinc-50 max-lg:border max-lg:border-zinc-200 max-lg:p-4 max-lg:rounded-2xl"
                : "border-white/5 max-lg:bg-white/[0.012] max-lg:border max-lg:border-white/5 max-lg:p-4 max-lg:rounded-2xl"
            }`}>
              <div className="flex items-center justify-between pl-1 select-none py-1 lg:py-0">
                <div className="flex items-center gap-1.5">
                  <Award className="h-4 w-4 text-amber-500 shrink-0" />
                  <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Certifications / 專業證照</p>
                </div>
              </div>
              
              <div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-x-3 gap-y-2 pt-1.5 lg:pt-0">
                  {profile.certificates.map((cert, i) => (
                    <div key={i} className={`flex items-start gap-2 p-1.5 -mx-1 rounded-lg group transition-all duration-300 ${
                      theme === "sepia"
                        ? "hover:bg-[#E3D3BE]/40"
                        : theme === "light"
                        ? "hover:bg-zinc-100"
                        : "hover:bg-white/[0.03]"
                    }`}>
                      <div className={`h-4.5 w-4.5 rounded-full border flex items-center justify-center transition-all duration-300 shrink-0 mt-0.5 group-hover:scale-105 ${
                        theme === "sepia"
                          ? "bg-[#FAF4E5] border-[#EADECC]/80 text-amber-700 group-hover:border-amber-500 group-hover:text-amber-500"
                          : theme === "light"
                          ? "bg-white border-zinc-200 text-zinc-400 group-hover:border-amber-500 group-hover:text-amber-500"
                          : "bg-[#0a0a0a] border-white/10 text-zinc-500 group-hover:border-amber-400 group-hover:text-amber-400"
                      }`}>
                        <CheckCircle2 className="h-2.5 w-2.5 text-amber-500 transition-transform duration-300 group-hover:scale-105" />
                      </div>
                      <div className="space-y-px min-w-0">
                        <span className={`text-[12px] font-medium tracking-tight leading-snug transition-colors duration-200 block ${
                          theme === "sepia"
                            ? "text-[#2B1B0C] group-hover:text-amber-700"
                            : theme === "light"
                            ? "text-zinc-950 group-hover:text-amber-700"
                            : "text-white group-hover:text-amber-400"
                        }`}>{cert.name}</span>
                        <p className={`text-[10px] font-light leading-normal ${
                          theme === "sepia" ? "text-[#5C4D3C]" : theme === "light" ? "text-zinc-600" : "text-zinc-400"
                        }`}>{cert.issuer}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>

          {/* 第三欄：專業能力範疇 (佔 4 欄) */}
          <div className={`lg:col-span-4 space-y-3 transition-all duration-300 ${
            theme === "sepia"
              ? "max-lg:bg-[#FAF4E5]/40 max-lg:border max-lg:border-[#EADECC]/40 max-lg:p-4 max-lg:rounded-2xl"
              : theme === "light"
              ? "max-lg:bg-zinc-50 max-lg:border max-lg:border-zinc-200 max-lg:p-4 max-lg:rounded-2xl"
              : "max-lg:bg-white/[0.012] max-lg:border max-lg:border-white/5 max-lg:p-4 max-lg:rounded-2xl"
          }`}>
            <div className="flex items-center justify-between pl-1 select-none py-1 lg:py-0">
              <div className="flex items-center gap-1.5">
                <Layers className="h-4 w-4 text-amber-500 shrink-0" />
                <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest pl-1">Capabilities / 核心專長</p>
              </div>
            </div>
            
            <div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2 pt-2 lg:pt-0">
                {profile.scopes.map((s) => {
                  let icon = <Layers className="h-3.5 w-3.5 text-amber-400" />;
                  let colorBorder = "group-hover:border-amber-500/20 group-hover:bg-amber-500/[0.02]";
                  
                  if (s.title.includes("識別")) {
                    icon = <Briefcase className="h-3.5 w-3.5 text-blue-400" />;
                    colorBorder = "group-hover:border-blue-500/20 group-hover:bg-blue-500/[0.02]";
                  } else if (s.title.includes("攝影")) {
                    icon = <Camera className="h-3.5 w-3.5 text-purple-400" />;
                    colorBorder = "group-hover:border-purple-500/20 group-hover:bg-purple-500/[0.02]";
                  } else if (s.title.includes("影音")) {
                    icon = <Video className="h-3.5 w-3.5 text-emerald-400" />;
                    colorBorder = "group-hover:border-emerald-500/20 group-hover:bg-emerald-500/[0.02]";
                  } else if (s.title.includes("印刷")) {
                    icon = <Printer className="h-3.5 w-3.5 text-rose-400" />;
                    colorBorder = "group-hover:border-rose-500/20 group-hover:bg-rose-500/[0.02]";
                  } else if (s.title.includes("IP")) {
                    icon = <Sparkles className="h-3.5 w-3.5 text-cyan-400" />;
                    colorBorder = "group-hover:border-cyan-500/20 group-hover:bg-cyan-500/[0.02]";
                  } else if (s.title.includes("AI")) {
                    icon = <Zap className="h-3.5 w-3.5 text-indigo-400" />;
                    colorBorder = "group-hover:border-indigo-500/20 group-hover:bg-indigo-500/[0.02]";
                  } else if (s.title.includes("禮贈品")) {
                    icon = <Award className="h-3.5 w-3.5 text-orange-400" />;
                    colorBorder = "group-hover:border-orange-500/20 group-hover:bg-orange-500/[0.02]";
                  }

                  return (
                    <div 
                      key={s.id} 
                      className={`border rounded-xl p-3 flex items-start gap-3 transition-all duration-300 group ${colorBorder} ${
                        theme === "sepia"
                          ? "bg-[#FAF4E5]/60 border-[#EADECC]/80"
                          : theme === "light"
                          ? "bg-zinc-50 border-zinc-200"
                          : "bg-white/[0.015] border-white/5"
                      }`}
                    >
                      <div className={`p-1.5 rounded-lg shrink-0 mt-0.5 border group-hover:scale-105 transition-transform duration-200 ${
                        theme === "sepia"
                          ? "bg-[#FAF4E5] border-[#EADECC]/80"
                          : theme === "light"
                          ? "bg-white border-zinc-200"
                          : "bg-white/5 border-white/5"
                      }`}>
                        {icon}
                      </div>
                      <div className="space-y-0.5 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className={`text-[12.5px] font-medium group-hover:text-amber-500 transition-colors whitespace-nowrap ${
                            theme === "sepia" ? "text-[#2B1B0C]" : theme === "light" ? "text-zinc-900" : "text-white"
                          }`}>{s.title}</span>
                          <span className={`text-[7.5px] font-mono px-1 rounded uppercase tracking-wider py-0.5 leading-none shrink-0 ${
                            theme === "sepia"
                              ? "bg-amber-950/5 text-[#8C7B69]"
                              : theme === "light"
                              ? "bg-zinc-100 text-zinc-500"
                              : "bg-white/5 text-zinc-500"
                          }`}>{s.badge}</span>
                        </div>
                        <p className={`text-[10px] leading-relaxed font-light line-clamp-1 group-hover:line-clamp-none transition-all duration-300 ${
                          theme === "sepia" ? "text-[#5C4D3C]" : theme === "light" ? "text-zinc-600" : "text-[#A1A1AA]"
                        }`}>{s.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
