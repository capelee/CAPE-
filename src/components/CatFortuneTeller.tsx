import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, X, RefreshCw, Smile, Heart, Zap } from "lucide-react";
import { audioContextManager } from "../utils/audioEffects";

interface CatFortuneTellerProps {
  theme: "dark" | "light" | "sepia";
  onConsult?: () => void;
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

// 神社御守/神樂鈴 (Suzu bell) 專屬極致網頁合成音效：模擬多層清脆銅鈴與祈福繩索晃動聲
const playSuzuBellSound = () => {
  try {
    const ctx = audioContextManager.getOrCreateContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    // 模擬神社搖鈴的三次連續晃動音 (由強至弱)
    const shakes = [0, 0.28, 0.56];

    shakes.forEach((delay, shakeIdx) => {
      const t = now + delay;
      // 5個神社黃銅鈴鐺特有高頻共振諧音點 (1350Hz, 1850Hz, 2200Hz, 2850Hz, 3700Hz)
      const freqs = [1350, 1850, 2200, 2850, 3700];
      const bellGain = ctx.createGain();
      
      // 隨次數衰減音量，讓搖鈴物理感更逼真
      const vol = 0.08 * Math.pow(0.85, shakeIdx);
      bellGain.gain.setValueAtTime(0, t);
      bellGain.gain.linearRampToValueAtTime(vol, t + 0.015); // 極快起音 (Impact)
      bellGain.gain.exponentialRampToValueAtTime(0.001, t + 0.35); // 快速消逝 (Decay)

      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, t);
        // 微弱的頻率震顫 (Wobble) 模擬鈴鐺內鐵丸撞擊旋轉
        osc.frequency.linearRampToValueAtTime(freq + (idx % 2 === 0 ? 12 : -12), t + 0.15);

        osc.connect(bellGain);
        osc.start(t);
        osc.stop(t + 0.4);
      });

      // 伴隨麻繩/流蘇擺動的超微弱沙沙低頻雜音
      const bufferSize = ctx.sampleRate * 0.12;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noiseNode = ctx.createBufferSource();
      noiseNode.buffer = buffer;
      const noiseFilter = ctx.createBiquadFilter();
      noiseFilter.type = "bandpass";
      noiseFilter.frequency.setValueAtTime(650, t);
      noiseFilter.Q.setValueAtTime(3.5, t);

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0, t);
      noiseGain.gain.linearRampToValueAtTime(0.012, t + 0.04);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.14);

      noiseNode.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(ctx.destination);

      noiseNode.start(t);
      noiseNode.stop(t + 0.16);

      bellGain.connect(ctx.destination);
    });
  } catch (e) {
    console.warn("Web Audio API not supported for Suzu Bell", e);
  }
};

// 完美的網頁合成音效：高逼真度開罐金屬聲與魔法幸運磬音
const playCanOpenSound = () => {
  try {
    const ctx = audioContextManager.getOrCreateContext();
    if (!ctx) return;
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
    filter.frequency.exponentialRampToValueAtTime(6000, now + 0.15); // Lowered ceiling to reduce sharp noise spikes

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.06, now); // Softer hiss (0.06 instead of 0.15)
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

    popGain.gain.setValueAtTime(0.12, now); // Softer pop clank (0.12 instead of 0.3)
    popGain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

    oscPop1.connect(popGain);
    oscPop2.connect(popGain);
    popGain.connect(ctx.destination);

    // 3. 姆貓開運幸運清脆風鈴聲 (Magical Chime!)
    const chime1 = ctx.createOscillator();
    const chime2 = ctx.createOscillator();
    const chimeGain = ctx.createGain();

    chime1.type = "sine";
    chime1.frequency.setValueAtTime(1046.50, now + 0.08); // C6 instead of E6 for a sweeter pitch
    chime1.frequency.exponentialRampToValueAtTime(1567.98, now + 0.25); // G6 instead of B6

    chime2.type = "sine";
    chime2.frequency.setValueAtTime(1318.51, now + 0.12); // E6 instead of G6

    chimeGain.gain.setValueAtTime(0, now);
    chimeGain.gain.linearRampToValueAtTime(0.06, now + 0.1); // Softer chime envelope (0.06 instead of 0.12)
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

// 神社清脆木魚與深遠梵鐘（Mokugyo & Temple Bell）神聖合成音效
const playMokugyoAndTempleBellSound = () => {
  try {
    const ctx = audioContextManager.getOrCreateContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    // A. 模擬經典木魚雙擊聲 (Mokugyo "叩、叩")
    const mokugyoTimes = [0, 0.2];
    mokugyoTimes.forEach((delay) => {
      const t = now + delay;
      
      // 木魚的主共振頻率 (~560Hz -> ~420Hz 的極快向下音高滑移)
      const osc = ctx.createOscillator();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(560, t);
      osc.frequency.exponentialRampToValueAtTime(420, t + 0.07);

      // 共鳴濾波器，強化木腔中空感
      const filter = ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.setValueAtTime(460, t);
      filter.Q.setValueAtTime(4.0, t);

      const gainNode = ctx.createGain();
      gainNode.gain.setValueAtTime(0, t);
      gainNode.gain.linearRampToValueAtTime(0.24, t + 0.005);
      gainNode.gain.exponentialRampToValueAtTime(0.001, t + 0.1);

      osc.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.start(t);
      osc.stop(t + 0.12);
    });

    // B. 模擬深遠日式梵鐘/磬 (Temple Bell / Rin Singing Bowl) 迴響
    const bellGain = ctx.createGain();
    bellGain.gain.setValueAtTime(0, now);
    bellGain.gain.linearRampToValueAtTime(0.28, now + 0.02); // 瞬態撞擊
    bellGain.gain.exponentialRampToValueAtTime(0.08, now + 0.6); // 緩釋衰減
    bellGain.gain.exponentialRampToValueAtTime(0.001, now + 2.8); // 裊裊餘音

    // 梵鐘特有的複音共鳴結構 (由低至高，包含微弱的不諧和音程產生真實金屬震動)
    const partials = [
      { freq: 174, vol: 1.0 },   // F3 基音 (古樸沉穩)
      { freq: 261, vol: 0.6 },   // C4 五度
      { freq: 349, vol: 0.45 },  // F4 八度
      { freq: 523, vol: 0.35 },  // C5
      { freq: 784, vol: 0.25 },  // G5 高頻清越
      { freq: 1047, vol: 0.15 }, // C6
      { freq: 1396, vol: 0.1 }   // F6
    ];

    // LFO (低頻調幅器) 模擬鐘身微弱自轉與厚重金屬聲波交乾產生的「嗡嗡」顫音效果 (Tremolo)
    const lfo = ctx.createOscillator();
    lfo.type = "sine";
    lfo.frequency.setValueAtTime(4.5, now); // 4.5Hz 顫動

    const lfoGain = ctx.createGain();
    lfoGain.gain.setValueAtTime(0.18, now);

    lfo.connect(lfoGain);
    
    partials.forEach((p, idx) => {
      const osc = ctx.createOscillator();
      osc.type = "sine";
      // 隨時間微降頻率 (Slight Pitch Glide)
      osc.frequency.setValueAtTime(p.freq, now);
      osc.frequency.linearRampToValueAtTime(p.freq * 0.985, now + 2.5);

      const partGain = ctx.createGain();
      partGain.gain.setValueAtTime(p.vol, now);
      partGain.gain.exponentialRampToValueAtTime(0.001, now + (1.2 * (p.vol + 0.4)));

      // 將 LFO 引入調製部分音軌，形成優雅的波幅干涉
      if (idx < 3) {
        lfoGain.connect(partGain.gain);
      }

      osc.connect(partGain);
      partGain.connect(bellGain);

      osc.start(now);
      osc.stop(now + 3.0);
    });

    lfo.start(now);
    lfo.stop(now + 3.0);

    bellGain.connect(ctx.destination);
  } catch (e) {
    console.warn("Web Audio API not supported or blocked for Temple Bell", e);
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

// 神社神樂鈴 (Suzu bell) 物理搖晃衰減動畫
const bellShakeVariants = {
  ring: {
    rotate: [0, -22, 18, -18, 14, -10, 6, -3, 0],
    x: [0, -3, 2, -2, 1, 0],
    transition: {
      duration: 1.3,
      ease: "easeInOut"
    }
  }
};

export function CatFortuneTeller({ theme, onConsult }: CatFortuneTellerProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isOpening, setIsOpening] = useState<boolean>(false);
  const [isBellRinging, setIsBellRinging] = useState<boolean>(false);
  const [currentFortune, setCurrentFortune] = useState<Fortune | null>(null);
    const [showTooltip, setShowTooltip] = useState<boolean>(true);
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle background scroll lock and escape key close for fortune teller modal
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("overflow-hidden");
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          setIsOpen(false);
        }
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => {
        document.body.classList.remove("overflow-hidden");
        window.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [isOpen]);

  // 10秒後自動隱藏初始氣泡提示，避免遮擋
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTooltip(false);
    }, 10000);
    return () => clearTimeout(timer);
  }, []);

  const triggerOpenCan = () => {
    if (isOpening || isBellRinging) return;
    
    setShowTooltip(false);

    // Trigger parent callback to track fortune consult count
    if (onConsult) {
      onConsult();
    }

    // 1. 預先挑選今日好運
    const randomIdx = Math.floor(Math.random() * FORTUNES.length);
    setCurrentFortune(FORTUNES[randomIdx]);

    // 2. 立即開啟神社卡片面板並啟動神社搖鈴過場
    setIsOpen(true);
    setIsBellRinging(true);

    // 3. 播放極致神聖神社搖鈴音效 與 深沉禪意梵鐘木魚音
    setTimeout(() => { playSuzuBellSound(); playMokugyoAndTempleBellSound(); }, 20);

    // 4. 觸發神社雙重長震動 (高質感回饋)
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate([40, 80, 40]);
    }

          
    

    // 6. 1400ms 後搖鈴儀式完結，驚喜爆開罐罐好運並噴發主視覺粒子！
    setTimeout(() => {
      setIsBellRinging(false);
      setIsOpening(true);

      // 播放高品質開罐聲，儀式揭曉！
      setTimeout(() => { playCanOpenSound(); }, 20);

      // 觸發金光波紋
      const rippleId = Date.now();
      setRipples((prev) => [...prev, { id: rippleId }]);
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== rippleId));
      }, 800);

      // 開罐爆炸彩蛋粒子
              
      

      setTimeout(() => {
        setIsOpening(false);
        
      }, 500);
    }, 1400);
  };

  const handleNextFortune = () => {
    if (isOpening || isBellRinging) return;

    // 1. 啟用搖鈴狀態，播放 Suzu bell 神樂音 與 梵鐘敲響
    setIsBellRinging(true);
    playSuzuBellSound();
    playMokugyoAndTempleBellSound();

    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate([40, 80, 40]);
    }

          
    

    // 2. 經過 1400ms 搖鈴祈願後揭曉新籤
    setTimeout(() => {
      setIsBellRinging(false);
      setIsOpening(true);

      // 播放開罐解封聲
      playCanOpenSound();

      // 觸發金光波紋
      const rippleId = Date.now();
      setRipples((prev) => [...prev, { id: rippleId }]);
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== rippleId));
      }, 800);

      // 避開重演，取得下一張運勢籤
      let nextIdx = Math.floor(Math.random() * FORTUNES.length);
      if (currentFortune) {
        const currentIdx = FORTUNES.findIndex((f) => f.level === currentFortune.level);
        if (nextIdx === currentIdx) {
          nextIdx = (nextIdx + 1) % FORTUNES.length;
        }
      }
      setCurrentFortune(FORTUNES[nextIdx]);

      // 爆開新運勢粒子
              
      

      setTimeout(() => {
        setIsOpening(false);
        
      }, 500);
    }, 1400);
  };

  // 主題配色樣式
  const panelBgClass =
    theme === "sepia"
      ? "bg-[#FCF8EE] border-[#EAD09D] text-[#382B1D]"
      : theme === "light"
      ? "bg-white border-zinc-200 text-zinc-800 shadow-[0_10px_30px_rgba(0,0,0,0.08)]"
      : "bg-[#0E0E0E]/95 border-white/10 text-zinc-100 shadow-[0_10px_35px_rgba(0,0,0,0.5)]";

  const textMutedClass =
    theme === "sepia"
      ? "text-[#6B5A46]"
      : theme === "light"
      ? "text-zinc-500"
      : "text-zinc-400";

  const fortuneTextColor =
    theme === "sepia"
      ? "text-[#4A341F]"
      : theme === "light"
      ? "text-zinc-900"
      : "text-zinc-50";

  const secondaryBtnClass =
    theme === "sepia"
      ? "bg-[#EADECC]/40 hover:bg-[#EADECC]/70 border-[#DFCFA0] text-[#4F3C28]"
      : theme === "light"
      ? "bg-zinc-100 hover:bg-zinc-200 border-zinc-200 text-zinc-700"
      : "bg-zinc-800/60 hover:bg-zinc-800 border-zinc-700 text-zinc-200";

  return (
    <>
      {/* 1. 頁尾嵌入式按鈕：姆貓運勢 */}
      <div 
        style={{ background: "transparent", backgroundColor: "transparent", boxShadow: "none", border: "none" }}
        className="relative select-none flex flex-col items-center justify-center bg-transparent z-50"
      >
        
        {/* Bouncing Tooltip 提示氣泡 (置中顯示) */}
        <AnimatePresence>
          {showTooltip && !isOpen && !isOpening && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-3.5 py-2 rounded-lg text-[11px] font-serif font-bold whitespace-nowrap shadow-md border text-center flex items-center gap-2 cursor-pointer z-50 ${
                theme === "sepia"
                  ? "bg-[#FCFAF7] border-[#D33F33]/40 text-[#D33F33]"
                  : theme === "light"
                  ? "bg-[#FCFAF7] border-[#D33F33]/30 text-[#D33F33]"
                  : "bg-[#181212] border-[#D33F33]/50 text-[#FAF1E6]"
              }`}
              onClick={triggerOpenCan}
            >
              <span className="animate-bounce select-none text-xs">⛩️</span>
              <span className="tracking-[0.15em]">點我祈願今日姆貓神籤！</span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowTooltip(false);
                }}
                className="hover:scale-110 ml-0.5 text-[#D33F33]/50 hover:text-[#D33F33] dark:hover:text-[#FAF1E6] transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
              {/* 三角縮進箭頭 */}
              <div className={`absolute top-full left-1/2 -translate-x-1/2 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[6px] ${
                theme === "sepia" || theme === "light"
                  ? "border-t-[#D33F33]/30"
                  : "border-t-[#D33F33]/50"
              }`} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* 方案三：紙燈籠燭光微弱搖曳暖橘色呼吸光暈 (Candle flickering halo behind button) */}
        <motion.div
          animate={{
            scale: [0.96, 1.05, 0.94, 1.1, 0.96, 1.03, 0.96],
            opacity: [0.25, 0.5, 0.2, 0.55, 0.3, 0.45, 0.25],
          }}
          transition={{
            duration: 4.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute w-[80px] h-[100px] rounded-2xl bg-gradient-to-b from-amber-500/20 via-orange-500/30 to-red-500/10 blur-xl pointer-events-none -z-10"
        />

        {/* 繪馬按鈕：與御守呼應的精美向量日式繪馬 (Ema) */}
        <motion.button
          onClick={triggerOpenCan}
          whileHover={{
            rotate: [0, -6, 5, -4, 3, 0],
            scale: 1.05,
            transition: { duration: 1.2, ease: "easeInOut" }
          }}
          whileTap={{ scale: 0.95 }}
          animate={isOpening ? { rotate: [0, -8, 8, -8, 8, -8, 8, 0], scale: [1, 1.05, 0.98, 1.05, 1] } : {}}
          transition={isOpening ? { repeat: 0, duration: 0.4 } : {}}
          style={{
            transformOrigin: "top center",
            background: "transparent",
            backgroundColor: "transparent",
            border: "none",
            outline: "none",
            boxShadow: "none"
          }}
          type="button"
          id="btn_mumu_fortune_ema"
          className="relative cursor-pointer group flex flex-col items-center bg-transparent border-0 p-0 outline-none shadow-none z-50"
          title="召喚今日姆貓運勢"
        >
          {/* 完美和風繪馬本體 (包含吊繩、繪馬外殼、內層虛線，一體化渲染) */}
          <div 
            style={{ background: "transparent", backgroundColor: "transparent" }}
            className="w-[72px] h-[94px] relative flex items-center justify-center bg-transparent border-0"
          >
            {/* 背景 SVG (包含頂端吊繩、繪馬本體) */}
            <svg 
              width="72" 
              height="94" 
              viewBox="0 0 72 94" 
              style={{ background: "transparent", backgroundColor: "transparent" }}
              className="absolute inset-0 w-full h-full pointer-events-none drop-shadow-[0_3px_5px_rgba(0,0,0,0.15)] dark:drop-shadow-[0_4px_8px_rgba(0,0,0,0.45)] bg-transparent"
            >
              <defs>
                {/* 定義繪馬漸層色 */}
                <linearGradient id="ema-sepia" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#F5E8C4" />
                  <stop offset="100%" stopColor="#D9C394" />
                </linearGradient>
                <linearGradient id="ema-light" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FCFAF7" />
                  <stop offset="100%" stopColor="#F0E5D8" />
                </linearGradient>
                <linearGradient id="ema-dark" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2E1A1A" />
                  <stop offset="100%" stopColor="#1C1010" />
                </linearGradient>
              </defs>

              {/* 吊繩 (直接繪製於 SVG 內) */}
              <line 
                x1="36" 
                y1="2" 
                x2="36" 
                y2="22" 
                stroke={
                  theme === "sepia" 
                    ? "#8C251C" 
                    : theme === "light" 
                    ? "#D33F33" 
                    : "#FBBF24"
                } 
                strokeWidth="1.5" 
                strokeLinecap="round" 
              />
              
              {/* 頂部吊繩圓點 */}
              <circle 
                cx="36" 
                cy="2" 
                r="1.5" 
                fill={
                  theme === "sepia" 
                    ? "#8C251C" 
                    : theme === "light" 
                    ? "#D33F33" 
                    : "#FBBF24"
                } 
              />

              {/* 繪馬外觀五邊形 (整體下移 22px 以避開吊繩) */}
              <polygon 
                points="36,22 70,34 70,92 2,92 2,34" 
                fill={
                  theme === "sepia"
                    ? "url(#ema-sepia)"
                    : theme === "light"
                    ? "url(#ema-light)"
                    : "url(#ema-dark)"
                }
                stroke={
                  theme === "sepia"
                    ? "#8C251C"
                    : theme === "light"
                    ? "#D33F33"
                    : "rgba(245, 158, 11, 0.4)"
                }
                strokeWidth="1.5" 
              />

              {/* 內圈虛線裝飾 (比外殼略小 3px) */}
              <polygon 
                points="36,26 67,36 67,89 5,89 5,36" 
                fill="none"
                stroke={
                  theme === "sepia"
                    ? "#8C251C"
                    : theme === "light"
                    ? "#D33F33"
                    : "#F59E0B"
                }
                strokeWidth="1"
                strokeDasharray="3,2"
                strokeOpacity={
                  theme === "sepia" ? 0.35 : theme === "light" ? 0.45 : 0.25
                }
              />

              {/* 懸掛繩孔 */}
              <circle 
                cx="36" 
                cy="32" 
                r="2.5" 
                fill={
                  theme === "sepia"
                    ? "#D4C094"
                    : theme === "light"
                    ? "#E5DCD0"
                    : "#140C0C"
                }
                stroke={
                  theme === "sepia"
                    ? "#8C251C"
                    : theme === "light"
                    ? "#D33F33"
                    : "#F59E0B"
                }
                strokeWidth="1"
                strokeOpacity="0.4"
              />
            </svg>

            {/* 直式文字：運勢 */}
            <div className={`absolute top-[60px] left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1.5 font-serif z-10 font-black text-[12px] tracking-[0.1em] ${
              theme === "sepia" 
                ? "text-[#5C4033]" 
                : theme === "light" 
                ? "text-[#1C1917]" 
                : "text-[#FAF1E6]"
            }`}>
              <span>運</span>
              <span>勢</span>
            </div>

          </div>
        </motion.button>
      </div>

      {/* 2. 運勢對話卡片：點開後的華麗展現 (AnimatePresence Overlay) */}
      {mounted && typeof document !== "undefined" && createPortal(
        <AnimatePresence>
          {isOpen && currentFortune && (
            <div
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-[9999] overflow-y-auto bg-black/80 p-4 flex items-start sm:items-center justify-center cursor-pointer"
            >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="w-full max-w-sm rounded-3xl border border-[#DFCFA0]/90 text-[#3E2715] shadow-[0_25px_60px_rgba(40,30,20,0.25)] overflow-hidden relative flex flex-col font-serif my-auto sm:my-8 cursor-default"
              style={{
                backgroundImage: `
                  linear-gradient(to right, rgba(211, 63, 51, 0.003) 1px, transparent 1px),
                  linear-gradient(to bottom, rgba(211, 63, 51, 0.003) 1px, transparent 1px),
                  radial-gradient(ellipse at center, #FCFBF7 0%, #FAF6F0 100%)
                `,
                backgroundSize: '24px 24px, 24px 24px, auto'
              }}
            >
              {/* 模擬神社內香火與燭光的「光影搖曳」細膩氛圍 */}
              <div className="absolute inset-0 pointer-events-none z-0 bg-[radial-gradient(circle_at_50%_25%,rgba(251,191,36,0.08)_0%,rgba(211,63,51,0.02)_50%,transparent_100%)]" />

              {/* 卡片背景和紙纖維微弱光暈 */}
              <div className="absolute inset-0 opacity-[0.015] pointer-events-none bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:12px_12px]" />
              
              

              {/* 神社搖鈴儀式感動畫過場 */}
              <AnimatePresence>
                {isBellRinging && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0 z-30 bg-[#FAF6F0] flex flex-col items-center justify-center p-6 select-none"
                    style={{
                      backgroundImage: `
                        linear-gradient(to right, rgba(211, 63, 51, 0.004) 1px, transparent 1px),
                        linear-gradient(to bottom, rgba(211, 63, 51, 0.004) 1px, transparent 1px),
                        radial-gradient(ellipse at center, #FCFAF7 0%, #F5EFE6 100%)
                      `,
                      backgroundSize: '20px 20px, 20px 20px, auto'
                    }}
                  >
                    {/* 傳統和紙纖維微粒子 */}
                    <div className="absolute inset-0 opacity-[0.012] pointer-events-none bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:12px_12px]" />
                    
                    {/* 柔和金色御神光暈 */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(211,63,51,0.05)_0%,transparent_70%)] pointer-events-none" />

                    {/* 神聖神社鳥居背景浮雕符號 */}
                    <div className="absolute inset-x-0 top-12 flex justify-center opacity-[0.03] pointer-events-none">
                      <span className="text-9xl">⛩️</span>
                    </div>

                    <div className="text-center mb-6 z-10">
                      <p className="font-serif text-[11px] tracking-[0.4em] text-[#D33F33] font-bold animate-pulse">
                        神樂鈴響 · 厄除開運
                      </p>
                      <span className="font-serif text-[8px] text-[#C5A059] tracking-[0.3em] uppercase block mt-1 opacity-80">
                        SUZU RITUAL REVERB
                      </span>
                    </div>

                    {/* 搖鈴本體 */}
                    <div className="relative flex items-center justify-center mb-6 z-10">
                      {/* 精美金色聲波圓環擴散 */}
                      <motion.div
                        animate={{ scale: [0.85, 1.8, 2.1], opacity: [0, 0.45, 0] }}
                        transition={{ repeat: Infinity, duration: 1.1, delay: 0.1 }}
                        className="absolute w-24 h-24 rounded-full border border-[#C5A059]/40 pointer-events-none"
                      />
                      <motion.div
                        animate={{ scale: [0.85, 1.6, 1.9], opacity: [0, 0.35, 0] }}
                        transition={{ repeat: Infinity, duration: 1.1, delay: 0.4 }}
                        className="absolute w-24 h-24 rounded-full border border-[#D33F33]/25 pointer-events-none"
                      />

                      <motion.svg
                        width="110"
                        height="190"
                        viewBox="0 0 120 220"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        variants={bellShakeVariants}
                        animate="ring"
                        className="origin-top"
                      >
                        {/* 紅白神社編織粗繩 */}
                        <path
                          d="M60 10 C54 25, 66 40, 60 55 C54 70, 66 85, 60 100 L60 130"
                          stroke="#D33F33"
                          strokeWidth="9"
                          strokeLinecap="round"
                        />
                        <path
                          d="M60 10 C66 25, 54 40, 60 55 C66 70, 54 85, 60 100 L60 130"
                          stroke="#FCFAF7"
                          strokeWidth="4.5"
                          strokeLinecap="round"
                        />

                        {/* 黃銅圓鈴本體 */}
                        <circle cx="60" cy="130" r="32" fill="url(#goldGrad)" stroke="#A0783F" strokeWidth="2.5" />
                        
                        {/* 鈴底鏤空裂口 */}
                        <path
                          d="M40 145 C45 138, 75 138, 80 145"
                          stroke="#32251A"
                          strokeWidth="4.5"
                          strokeLinecap="round"
                        />
                        <circle cx="40" cy="145" r="3.5" fill="#32251A" />
                        <circle cx="80" cy="145" r="3.5" fill="#32251A" />

                        {/* 上方掛環 */}
                        <circle cx="60" cy="98" r="7" stroke="#A0783F" strokeWidth="2.5" />

                        {/* 朱泥結扣點 */}
                        <rect x="52" y="93" width="16" height="10" rx="3" fill="#D33F33" />
                        <circle cx="60" cy="98" r="3.5" fill="#FCFAF7" />

                        {/* 底部朱紅大流蘇 */}
                        <path
                          d="M60 162 L48 215 C46 218, 52 220, 60 218 C68 220, 74 218, 72 215 Z"
                          fill="#D33F33"
                        />
                        <path
                          d="M60 162 L53 212 C52 214, 57 215, 60 214 C63 215, 68 214, 67 212 Z"
                          fill="#E55447"
                        />
                        <rect x="54" y="168" width="12" height="4" rx="1" fill="#C5A059" />

                        <defs>
                          <radialGradient id="goldGrad" cx="35%" cy="30%" r="70%">
                            <stop offset="0%" stopColor="#FFF2D4" />
                            <stop offset="25%" stopColor="#E2BD70" />
                            <stop offset="70%" stopColor="#C5A059" />
                            <stop offset="100%" stopColor="#8A6730" />
                          </radialGradient>
                        </defs>
                      </motion.svg>
                    </div>

                    <div className="text-center z-10">
                      <p className="font-serif text-[12px] text-[#5C4D3C] tracking-[0.25em] font-black animate-pulse">
                        虔誠搖鈴，祈願開罐...
                      </p>
                      <span className="font-serif text-[9px] text-[#8E7E6A] tracking-wider block mt-1.5 opacity-80">
                        誠心祈願 · 諸願成就
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* 關閉按鈕 */}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full border border-[#DFCFA0]/60 bg-[#FAF6F0]/80 hover:bg-[#EADECC]/40 text-[#4F3C28] transition-all duration-200 hover:scale-105 active:scale-95 z-10 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>

              {/* 頂部神社標題與教主大頭 */}
              <div className="p-6 pb-2 text-center flex flex-col items-center">
                <div className="relative mb-2.5 flex justify-center items-center">
                  {/* 神社祈福圓環 */}
                  <div className="absolute inset-0 bg-[#D33F33]/5 rounded-full animate-ping duration-3000 scale-125" />
                  <div className="w-16 h-16 rounded-full bg-[#FAF6F0] border-2 border-[#D33F33]/20 flex items-center justify-center relative shadow-md">
                    <img 
                      src="https://drive.google.com/thumbnail?sz=w1000&id=1eqi9X536nUrXqj-gv6kqjNMfpiC1YumX" 
                      alt="姆貓教主" 
                      className="w-13 h-13 object-contain"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute -bottom-1 -right-1 bg-[#D33F33] text-[9px] font-extrabold text-white px-1.5 py-0.5 rounded-full border border-[#FAF6F0] shadow-sm font-sans">
                      教主 👑
                    </div>
                  </div>
                </div>

                {/* 貓耳鳥居與神社籤名 */}
                <div className="text-xl text-[#D33F33] mb-0.5 select-none animate-pulse">⛩️</div>
                <h3 className="font-serif font-black text-base tracking-[0.2em] text-[#D33F33] flex items-center gap-1 justify-center">
                  <span>姆貓神社 · 御神籤</span>
                </h3>
                <p className="text-[9px] font-mono tracking-[0.25em] text-[#8E7E6A] uppercase mt-0.5 select-none">
                  MUMㄠ SHRINE • OMIKUJI
                </p>
              </div>

              {/* 運勢大吉和紙籤條 (垂直書寫直書排版) */}
              <div className="px-6 py-2 select-text overflow-hidden">
                <motion.div
                  key={currentFortune.id + "_" + isBellRinging}
                  initial={{ scaleY: 0, opacity: 0, transformOrigin: "top" }}
                  animate={isBellRinging ? { scaleY: 0, opacity: 0 } : { scaleY: 1, opacity: 1 }}
                  transition={{ 
                    type: "spring", 
                    damping: 18, 
                    stiffness: 110, 
                    delay: isBellRinging ? 0 : 0.05 
                  }}
                  className="relative bg-[#FCFAF7] border-2 border-double border-[#D33F33]/70 rounded-xl p-5 shadow-inner flex flex-col items-center justify-between min-h-[290px] overflow-hidden"
                >
                  
                  {/* 和紙紋理疊加 */}
                  <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px]" />
                  
                  {/* 直書內容排版：從右至左 (writingMode: vertical-rl) */}
                  <div className="w-full flex justify-around items-stretch flex-row-reverse h-[210px] py-1 gap-1 select-none">
                    
                    {/* 1. 運勢等級欄 (右側) */}
                    <div 
                      className="flex flex-col items-center justify-start shrink-0" 
                      style={{ writingMode: "vertical-rl", WebkitWritingMode: "vertical-rl" }}
                    >
                      <span className="font-serif text-[10px] tracking-widest text-[#8E7E6A] mb-2 font-bold">御神籤</span>
                      <div className="px-1.5 py-3 rounded border-2 border-[#D33F33]/40 bg-[#D33F33]/5 text-[#D33F33] font-serif font-black text-sm tracking-[0.2em] shadow-sm leading-none">
                        {currentFortune.level.split(" · ")[0]}
                      </div>
                      <span className="text-[9px] font-medium text-[#8E7E6A] mt-2 tracking-tighter max-h-[80px] overflow-hidden opacity-90 leading-tight">
                        {currentFortune.level.split(" · ")[1] || ""}
                      </span>
                    </div>

                    {/* 2. 核心命理直書文字 (中間：精美復古宋體) */}
                    <div className="flex-1 flex justify-center items-center px-1.5 sm:px-3 border-r border-l border-[#D33F33]/10 min-w-0">
                      <div 
                        style={{ writingMode: "vertical-rl", WebkitWritingMode: "vertical-rl" }} 
                        className="h-full flex items-center justify-center text-center font-serif font-bold text-[#2A1E17] leading-[1.8] tracking-[0.22em] text-[13.5px] sm:text-[15.5px] max-h-[200px] overflow-y-hidden"
                      >
                        「{currentFortune.text}」
                      </div>
                    </div>

                    {/* 3. 神社編號與名號 (左側) */}
                    <div 
                      className="flex flex-col items-center justify-between shrink-0 opacity-80" 
                      style={{ writingMode: "vertical-rl", WebkitWritingMode: "vertical-rl" }}
                    >
                      <span className="font-serif text-[9px] tracking-widest text-[#D33F33]/60 font-semibold">
                        第七十七籤
                      </span>
                      <span className="font-serif text-[11px] tracking-[0.3em] text-[#D33F33]/90 font-black mt-auto">
                        姆貓神社
                      </span>
                    </div>
                  </div>

                  {/* 精緻御朱印 (印章印記) */}
                  <div className="absolute bottom-3 left-4 w-9 h-9 rounded border-2 border-red-500/80 flex flex-col items-center justify-center text-red-500 font-serif text-[9px] font-black rotate-[-8deg] select-none pointer-events-none bg-red-500/[0.02]">
                    <span className="text-xs transform -translate-y-0.5 leading-none">🐾</span>
                    <span className="text-[6px] font-extrabold scale-75 tracking-widest -mt-0.5">姆貓印</span>
                  </div>

                  {/* 籤詩頁尾金質祈福紋路 */}
                  <div className="w-full border-t border-[#D33F33]/15 pt-2 flex justify-center items-center gap-1.5 opacity-90 select-none">
                    <span className="text-[10px]">🔔</span>
                    <span className="text-[10px] text-[#C5A059] font-serif font-bold tracking-widest">開運厄除 · 福德圓滿</span>
                    <span className="text-[10px]">🐾</span>
                  </div>
                </motion.div>
              </div>

              {/* 每日宜忌面板 (繪馬/御守雙側設計) */}
              <div className="px-6 py-2 select-none">
                <div className="grid grid-cols-2 gap-3">
                  {/* 宜 (Do) - 綠底朱泥木牌 */}
                  <div className="rounded-2xl p-3 border border-[#E2D2B8] bg-[#FCFBF9] hover:bg-[#FAF8F3] transition-colors flex flex-col items-center text-center shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 inset-x-0 h-0.5 bg-[#2C4C38]/40" />
                    <div className="flex items-center gap-1 text-[#2C4C38] font-serif font-black text-xs mb-1.5">
                      <Heart className="w-3.5 h-3.5 fill-[#2C4C38]/10" />
                      <span className="tracking-widest">宜</span>
                    </div>
                    <p className="text-[11px] font-serif font-bold leading-relaxed text-[#5C4D3C]">
                      {currentFortune.do}
                    </p>
                  </div>

                  {/* 忌 (Don't) - 紅底漆金木牌 */}
                  <div className="rounded-2xl p-3 border border-[#E2D2B8] bg-[#FCFBF9] hover:bg-[#FAF8F3] transition-colors flex flex-col items-center text-center shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 inset-x-0 h-0.5 bg-[#D33F33]/40" />
                    <div className="flex items-center gap-1 text-[#D33F33] font-serif font-black text-xs mb-1.5">
                      <Zap className="w-3.5 h-3.5 fill-[#D33F33]/10" />
                      <span className="tracking-widest">忌</span>
                    </div>
                    <p className="text-[11px] font-serif font-bold leading-relaxed text-[#5C4D3C]">
                      {currentFortune.dont}
                    </p>
                  </div>
                </div>
              </div>

              {/* 互動操作底欄 */}
              <div className="p-6 pt-3 flex items-center justify-between gap-3 shrink-0">
                <motion.button
                  type="button"
                  onClick={handleNextFortune}
                  disabled={isOpening}
                  whileHover={{
                    scale: 1.04,
                    rotate: [0, -2, 2, -2, 2, 0],
                    transition: {
                      rotate: {
                        repeat: Infinity,
                        duration: 0.38,
                        ease: "easeInOut"
                      },
                      scale: {
                        type: "spring",
                        stiffness: 400,
                        damping: 15
                      }
                    }
                  }}
                  whileTap={{ scale: 0.96 }}
                  className="flex-1 py-3 rounded-2xl text-xs font-serif font-black flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer bg-[#D33F33] hover:bg-[#C0392B] text-white border-2 border-[#D33F33] hover:border-[#D33F33]/80 shadow-lg shadow-[#D33F33]/15 tracking-wider"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isOpening ? "animate-spin" : ""}`} />
                  <span>再開一罐 🥫</span>
                </motion.button>

                <a
                  href="https://www.instagram.com/mumao1_the_cat_religion/"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsOpen(false)}
                  className="py-3 px-5 rounded-2xl text-xs font-serif font-bold border-2 border-[#DFCFA0] bg-[#FAF6F0] hover:bg-[#EADECC]/30 text-[#4F3C28] transition-all active:scale-95 cursor-pointer tracking-wider inline-flex items-center justify-center"
                >
                  領取好運 🐾
                </a>
              </div>

              {/* 最下方五色祈福線條 */}
              <div className="flex h-1.5 w-full select-none">
                <div className="flex-1 bg-[#D33F33]" title="朱紅" />
                <div className="flex-1 bg-[#C5A059]" title="金黃" />
                <div className="flex-1 bg-[#2C4C38]" title="深綠" />
                <div className="flex-1 bg-[#4A7F9A]" title="靛藍" />
                <div className="flex-1 bg-[#FAF6F0]" title="純白" />
              </div>
            </motion.div>
          </div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}
