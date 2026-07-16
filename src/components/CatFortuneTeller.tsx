import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, X, RefreshCw, Smile, Heart, Zap } from "lucide-react";

interface CatFortuneTellerProps {
  theme: "dark" | "light" | "sepia";
}

interface Fortune {
  level: string;
  badgeBg: string;
  text: string;
  do: string;
  dont: string;
}

interface Particle {
  id: number;
  char: string;
  x: number;
  y: number;
  scale: number;
  rotation: number;
}

interface Ripple {
  id: number;
}

// 完美的網頁合成音效：高逼真度開罐金屬聲與魔法幸運磬音
const playCanOpenSound = () => {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const now = ctx.currentTime;

    // 1. 金屬高壓氣體釋放聲 (Psssh!)
    const bufferSize = ctx.sampleRate * 0.25;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noiseNode = ctx.createBufferSource();
    noiseNode.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = "highpass";
    filter.frequency.setValueAtTime(1500, now);
    filter.frequency.exponentialRampToValueAtTime(8000, now + 0.15);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.15, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

    noiseNode.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(ctx.destination);

    // 2. 開罐拉環扣響聲 (Clank/Pop)
    const oscPop1 = ctx.createOscillator();
    const oscPop2 = ctx.createOscillator();
    const popGain = ctx.createGain();

    oscPop1.type = "triangle";
    oscPop1.frequency.setValueAtTime(180, now);
    oscPop1.frequency.exponentialRampToValueAtTime(900, now + 0.1);

    oscPop2.type = "sine";
    oscPop2.frequency.setValueAtTime(350, now);
    oscPop2.frequency.setValueAtTime(120, now + 0.04);
    oscPop2.frequency.exponentialRampToValueAtTime(50, now + 0.14);

    popGain.gain.setValueAtTime(0.3, now);
    popGain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

    oscPop1.connect(popGain);
    oscPop2.connect(popGain);
    popGain.connect(ctx.destination);

    // 3. 姆貓開運幸運清脆風鈴聲 (Magical Chime!)
    const chime1 = ctx.createOscillator();
    const chime2 = ctx.createOscillator();
    const chimeGain = ctx.createGain();

    chime1.type = "sine";
    chime1.frequency.setValueAtTime(1320, now + 0.08); // E6
    chime1.frequency.exponentialRampToValueAtTime(1976, now + 0.25); // B6

    chime2.type = "sine";
    chime2.frequency.setValueAtTime(1567, now + 0.12); // G6

    chimeGain.gain.setValueAtTime(0, now);
    chimeGain.gain.linearRampToValueAtTime(0.12, now + 0.1);
    chimeGain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

    chime1.connect(chimeGain);
    chime2.connect(chimeGain);
    chimeGain.connect(ctx.destination);

    // 啟動所有節點
    noiseNode.start(now);
    oscPop1.start(now);
    oscPop2.start(now);
    chime1.start(now + 0.08);
    chime2.start(now + 0.12);

    // 安全停止節點釋放內存
    noiseNode.stop(now + 0.25);
    oscPop1.stop(now + 0.18);
    oscPop2.stop(now + 0.18);
    chime1.stop(now + 0.65);
    chime2.stop(now + 0.65);
  } catch (e) {
    console.warn("Web Audio API not supported or blocked by browser autopsy", e);
  }
};

const FORTUNES: Fortune[] = [
  {
    level: "大吉 · 靈感湧現 🐾",
    badgeBg: "from-pink-500 to-rose-500 text-white shadow-rose-500/20",
    text: "今日適合餵主子吃肉泥！你的靈魂設計感將如泉水般噴湧，一稿就過！",
    do: "吃罐罐、自信提案、選用大膽配色",
    dont: "過度加班、懷疑自己、空腹開會",
  },
  {
    level: "中吉 · 改稿退散 🎸",
    badgeBg: "from-amber-500 to-orange-500 text-white shadow-orange-500/20",
    text: "今天最適合向姆貓教主請安，下班絕對不會有任何討厭的臨時改稿！",
    do: "準時下班、擼貓 10 分鐘、無視無理要求",
    dont: "答應免費修改、忘記存檔、太晚吃飯",
  },
  {
    level: "罐罐吉 · 合法摸魚 🥫",
    badgeBg: "from-yellow-400 to-amber-500 text-zinc-950 shadow-amber-500/20",
    text: "今天非常適合摸魚 5 分鐘，姆貓教主特批，摸魚期間靈魂充能 200%！",
    do: "吃點心、偷偷摸魚、欣賞姆貓插畫",
    dont: "對著螢幕發呆、答應過短的排程",
  },
  {
    level: "超大吉 · 財源滾滾 🚀",
    badgeBg: "from-purple-500 to-indigo-500 text-white shadow-purple-500/20",
    text: "天降神運！今天的提案不但一次就過，業主還會主動追加預算，對你讚不絕口！",
    do: "微笑收訂金、享受咖啡、大展身手",
    dont: "退縮、忘記給貓買玩具",
  },
  {
    level: "肉泥吉 · 甜品滿點 🧁",
    badgeBg: "from-sky-400 to-blue-500 text-white shadow-blue-500/20",
    text: "今日宜享用精緻下午茶，姆貓教主會悄悄幫你擋掉所有修改與溝通障礙！",
    do: "點外送、享受珍珠奶茶、更換亮眼桌布",
    dont: "委曲求全、接不熟的案子",
  },
  {
    level: "睡眠吉 · 夢中神配 💤",
    badgeBg: "from-emerald-400 to-teal-500 text-white shadow-teal-500/20",
    text: "今天睡滿 8 小時，姆貓教主將在夢中賜予你最完美的色彩搭配與視覺網格！",
    do: "早點睡覺、夢中找靈感、放鬆緊繃肩膀",
    dont: "熬夜滑手機、咖啡因過量",
  },
  {
    level: "貓咪吉 · 幸運加持 🐱",
    badgeBg: "from-fuchsia-400 to-pink-500 text-white shadow-pink-500/20",
    text: "今天在路上遇到的第一隻貓，會把牠 50% 的超級幸運偷偷分送給你喔！",
    do: "觀察路邊小貓、面帶微笑、帶原創角色出門",
    dont: "大聲說話嚇到貓、走路不看路",
  }
];

const PARTICLES_EMOJIS = ["🥫", "🐟", "🥩", "✨", "💖", "🐾", "🐱", "🌈"];

export function CatFortuneTeller({ theme }: CatFortuneTellerProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isOpening, setIsOpening] = useState<boolean>(false);
  const [currentFortune, setCurrentFortune] = useState<Fortune | null>(null);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [showTooltip, setShowTooltip] = useState<boolean>(true);
  const [ripples, setRipples] = useState<Ripple[]>([]);

  // 10秒後自動隱藏初始氣泡提示，避免遮擋
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTooltip(false);
    }, 10000);
    return () => clearTimeout(timer);
  }, []);

  const triggerOpenCan = () => {
    if (isOpening) return;
    
    setIsOpening(true);
    setShowTooltip(false);

    // 1. 觸發開罐震動 (雙短震動：強烈真實的回饋)
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate([60, 45, 60]);
    }

    // 2. 播放高品質開罐音效
    playCanOpenSound();

    // 3. 觸發黃金波紋擴散
    const rippleId = Date.now();
    setRipples((prev) => [...prev, { id: rippleId }]);
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== rippleId));
    }, 800);

    // 產生開罐爆炸粒子效果
    const newParticles: Particle[] = Array.from({ length: 16 }).map((_, idx) => {
      const angle = (idx * (360 / 16) + Math.random() * 15) * (Math.PI / 180);
      const speed = 40 + Math.random() * 60;
      return {
        id: Date.now() + idx + Math.random(),
        char: PARTICLES_EMOJIS[Math.floor(Math.random() * PARTICLES_EMOJIS.length)],
        x: Math.cos(angle) * speed,
        y: Math.sin(angle) * speed - 20, // 略微向上噴發
        scale: 0.8 + Math.random() * 0.5,
        rotation: Math.random() * 360 - 180,
      };
    });
    setParticles(newParticles);

    // 500ms 後展開運勢對話框
    setTimeout(() => {
      const randomIdx = Math.floor(Math.random() * FORTUNES.length);
      setCurrentFortune(FORTUNES[randomIdx]);
      setIsOpen(true);
      setIsOpening(false);
      // 清空粒子
      setTimeout(() => setParticles([]), 1000);
    }, 600);
  };

  const handleNextFortune = () => {
    // 再次開罐動畫
    setIsOpening(true);

    // 1. 觸發短暫輕微震動
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate([40]);
    }

    // 2. 再次播放開罐音效
    playCanOpenSound();

    // 3. 觸發黃金波紋擴散
    const rippleId = Date.now();
    setRipples((prev) => [...prev, { id: rippleId }]);
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== rippleId));
    }, 800);

    const newParticles: Particle[] = Array.from({ length: 10 }).map((_, idx) => {
      const angle = (idx * (360 / 10) + Math.random() * 20) * (Math.PI / 180);
      const speed = 35 + Math.random() * 45;
      return {
        id: Date.now() + idx + Math.random(),
        char: PARTICLES_EMOJIS[Math.floor(Math.random() * PARTICLES_EMOJIS.length)],
        x: Math.cos(angle) * speed,
        y: Math.sin(angle) * speed - 15,
        scale: 0.7 + Math.random() * 0.4,
        rotation: Math.random() * 180 - 90,
      };
    });
    setParticles(newParticles);

    setTimeout(() => {
      let nextIdx = Math.floor(Math.random() * FORTUNES.length);
      // 避免抽到相同的
      if (currentFortune) {
        const currentIdx = FORTUNES.findIndex((f) => f.level === currentFortune.level);
        if (nextIdx === currentIdx) {
          nextIdx = (nextIdx + 1) % FORTUNES.length;
        }
      }
      setCurrentFortune(FORTUNES[nextIdx]);
      setIsOpening(false);
      setTimeout(() => setParticles([]), 800);
    }, 500);
  };

  // 主題配色樣式
  const panelBgClass =
    theme === "sepia"
      ? "bg-[#FCF8EE] border-[#EAD09D] text-[#382B1D]"
      : theme === "light"
      ? "bg-white border-zinc-200 text-zinc-800 shadow-[0_10px_30px_rgba(0,0,0,0.08)]"
      : "bg-[#0E0E0E]/95 border-white/10 text-zinc-100 shadow-[0_10px_35px_rgba(0,0,0,0.5)] backdrop-blur-md";

  const textMutedClass =
    theme === "sepia"
      ? "text-[#6B5A46]"
      : theme === "light"
      ? "text-zinc-500"
      : "text-zinc-400";

  const secondaryBtnClass =
    theme === "sepia"
      ? "bg-[#EADECC]/40 hover:bg-[#EADECC]/70 border-[#DFCFA0] text-[#4F3C28]"
      : theme === "light"
      ? "bg-zinc-100 hover:bg-zinc-200 border-zinc-200 text-zinc-700"
      : "bg-zinc-800/60 hover:bg-zinc-800 border-zinc-700 text-zinc-200";

  return (
    <>
      {/* 1. 頁尾嵌入式按鈕：姆貓運勢罐罐 */}
      <div className="relative select-none flex flex-col items-center justify-center">
        
        {/* Bouncing Tooltip 提示氣泡 (置中顯示) */}
        <AnimatePresence>
          {showTooltip && !isOpen && !isOpening && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-3 py-1.5 rounded-xl text-[11px] font-bold whitespace-nowrap shadow-lg border text-center flex items-center gap-1.5 cursor-pointer z-40 ${
                theme === "sepia"
                  ? "bg-[#FDF9F0] border-[#EAD09D] text-[#433422]"
                  : theme === "light"
                  ? "bg-white border-zinc-200 text-zinc-700 shadow-zinc-250/20"
                  : "bg-zinc-900 border-zinc-800 text-zinc-200"
              }`}
              onClick={triggerOpenCan}
            >
              <span className="animate-bounce">🔮</span>
              <span>點我召喚今日姆貓運勢！</span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowTooltip(false);
                }}
                className="hover:scale-110 ml-0.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
              {/* 三角縮進箭頭 */}
              <div className={`absolute top-full left-1/2 -translate-x-1/2 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[6px] ${
                theme === "sepia"
                  ? "border-t-[#EAD09D]"
                  : theme === "light"
                  ? "border-t-zinc-200"
                  : "border-t-zinc-800"
              }`} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* 粒子噴發現象容器 */}
        <div className="absolute inset-0 pointer-events-none overflow-visible flex items-center justify-center">
          <AnimatePresence>
            {particles.map((p) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 1, scale: 0, x: 0, y: 0, rotate: 0 }}
                animate={{
                  opacity: [1, 1, 0],
                  scale: p.scale,
                  x: p.x,
                  y: p.y,
                  rotate: p.rotation,
                }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="absolute text-xl pointer-events-none select-none"
              >
                {p.char}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* 罐罐按鈕：與頁尾設計高度融合的精美橫向按鈕 */}
        <motion.button
          onClick={triggerOpenCan}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          animate={isOpening ? { rotate: [0, -8, 8, -8, 8, -8, 8, 0], scale: [1, 1.05, 0.98, 1.05, 1] } : {}}
          transition={isOpening ? { repeat: 0, duration: 0.4 } : {}}
          className={`relative px-4 py-2 rounded-xl border transition-all duration-300 shadow-md flex items-center gap-2 cursor-pointer group active:scale-95 text-xs font-semibold ${
            theme === "sepia"
              ? "bg-[#FCF8EE] hover:bg-[#EADECC]/40 border-[#DFCFA0] text-[#4F3C28]"
              : theme === "light"
              ? "bg-zinc-50 hover:bg-zinc-100 border-zinc-200 text-zinc-700"
              : "bg-zinc-900/80 hover:bg-zinc-950 border-white/5 text-zinc-300 hover:text-white"
          }`}
          title="召喚今日姆貓運勢罐罐"
        >
          {/* 金屬反光裝飾線 */}
          <div className="absolute inset-x-2 top-0.5 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none rounded-full" />
          
          {/* 波紋擴散動畫 (Concentric Expanding Rings) */}
          <AnimatePresence>
            {ripples.map((r) => (
              <motion.span
                key={r.id}
                initial={{ scale: 0.9, opacity: 0.8 }}
                animate={{ scale: 2.2, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="absolute inset-0 rounded-xl border-2 border-amber-500/80 pointer-events-none"
              />
            ))}
          </AnimatePresence>

          {/* 罐頭主視覺圖標 */}
          <span className="text-base transform group-hover:scale-125 group-hover:rotate-12 transition-transform duration-300">
            🥫
          </span>

          <span>今日姆貓運勢罐罐</span>
          
          <span className="text-[10px] text-amber-500 opacity-80 group-hover:animate-pulse">
            🔮
          </span>
        </motion.button>
      </div>

      {/* 2. 運勢對話卡片：點開後的華麗展現 (AnimatePresence Overlay) */}
      <AnimatePresence>
        {isOpen && currentFortune && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className={`w-full max-w-sm rounded-3xl border overflow-hidden relative flex flex-col ${panelBgClass}`}
            >
              {/* 卡片背後微弱迷霧霓虹 */}
              <div className="absolute -top-24 -left-24 w-48 h-48 rounded-full bg-amber-500/10 blur-[50px] pointer-events-none" />
              <div className="absolute -bottom-24 -right-24 w-48 h-48 rounded-full bg-pink-500/10 blur-[50px] pointer-events-none" />

              {/* 關閉按鈕 */}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className={`absolute top-4 right-4 p-1.5 rounded-full border transition-all duration-200 hover:scale-105 active:scale-95 ${secondaryBtnClass}`}
              >
                <X className="w-3.5 h-3.5" />
              </button>

              {/* 頂部開罐香氣與姆貓教主大頭 */}
              <div className="p-6 pb-2 text-center flex flex-col items-center">
                <div className="relative mb-3 flex justify-center items-center">
                  {/* 可愛背景圓環 */}
                  <div className="absolute inset-0 bg-amber-500/10 rounded-full animate-ping duration-3000 scale-125" />
                  <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center relative shadow-inner">
                    <img 
                      src="https://drive.google.com/thumbnail?sz=w1000&id=1eqi9X536nUrXqj-gv6kqjNMfpiC1YumX" 
                      alt="姆貓教主" 
                      className="w-14 h-14 object-contain"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute -bottom-1 -right-1 bg-rose-500 text-[9px] font-extrabold text-white px-1.5 rounded-full border border-white animate-bounce">
                      教主 👑
                    </div>
                  </div>
                </div>

                <h3 className="font-display font-black text-sm tracking-widest uppercase text-amber-500 flex items-center gap-1 justify-center">
                  <span>🔮 姆貓教主運勢罐罐 🔮</span>
                </h3>
                <p className={`text-[10px] font-mono tracking-wider mt-0.5 ${textMutedClass}`}>
                  CAT FORTUNE TELLER
                </p>
              </div>

              {/* 運勢大吉星光板 */}
              <div className="px-6 py-2">
                <div className="bg-zinc-500/5 border border-zinc-500/10 rounded-2xl p-4 relative overflow-hidden flex flex-col items-center text-center">
                  
                  {/* 運勢等級徽章 (Shimmering color badge) */}
                  <div className={`px-4 py-1.5 rounded-full text-xs font-black bg-gradient-to-r shadow-lg tracking-wider mb-3 ${currentFortune.badgeBg}`}>
                    {currentFortune.level}
                  </div>

                  {/* 運勢描述 */}
                  <p className="text-xs font-medium leading-relaxed tracking-wide text-zinc-800 dark:text-zinc-100 max-w-[260px]">
                    「{currentFortune.text}」
                  </p>

                  {/* 小魚乾與裝飾花紋 */}
                  <div className="flex gap-1.5 mt-3.5 opacity-60">
                    <span className="text-xs">🐟</span>
                    <span className="text-xs">✨</span>
                    <span className="text-xs">🐾</span>
                    <span className="text-xs">🐟</span>
                  </div>
                </div>
              </div>

              {/* 每日宜忌面板 */}
              <div className="px-6 py-2">
                <div className="grid grid-cols-2 gap-3">
                  {/* 宜 (Do) */}
                  <div className="rounded-xl p-2.5 border border-emerald-500/10 bg-emerald-500/[0.02] flex flex-col items-center text-center">
                    <div className="flex items-center gap-1 text-emerald-500 font-extrabold text-xs mb-1">
                      <Heart className="w-3 h-3 fill-emerald-500" />
                      <span>宜</span>
                    </div>
                    <p className={`text-[11px] font-medium leading-relaxed ${textMutedClass}`}>
                      {currentFortune.do}
                    </p>
                  </div>

                  {/* 忌 (Don't) */}
                  <div className="rounded-xl p-2.5 border border-rose-500/10 bg-rose-500/[0.02] flex flex-col items-center text-center">
                    <div className="flex items-center gap-1 text-rose-500 font-extrabold text-xs mb-1">
                      <Zap className="w-3 h-3 fill-rose-500" />
                      <span>忌</span>
                    </div>
                    <p className={`text-[11px] font-medium leading-relaxed ${textMutedClass}`}>
                      {currentFortune.dont}
                    </p>
                  </div>
                </div>
              </div>

              {/* 互動操作底欄 */}
              <div className="p-6 pt-3 flex items-center justify-between gap-3 shrink-0">
                <button
                  type="button"
                  onClick={handleNextFortune}
                  disabled={isOpening}
                  className="flex-1 py-2.5 rounded-xl text-xs font-extrabold border flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black border-amber-400 shadow-lg shadow-amber-500/10"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isOpening ? "animate-spin" : ""}`} />
                  <span>再開一罐 🥫</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className={`py-2.5 px-4 rounded-xl text-xs font-extrabold border transition-all active:scale-95 cursor-pointer ${secondaryBtnClass}`}
                >
                  領取好運 🐾
                </button>
              </div>

              {/* 下方拉環與標籤裝飾線 */}
              <div className="h-1 w-full bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-500 opacity-60" />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
