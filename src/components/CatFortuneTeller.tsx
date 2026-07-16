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

// 神社御守/神樂鈴 (Suzu bell) 專屬極致網頁合成音效：模擬多層清脆銅鈴與祈福繩索晃動聲
const playSuzuBellSound = () => {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
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

// 神社清脆木魚與深遠梵鐘（Mokugyo & Temple Bell）神聖合成音效
const playMokugyoAndTempleBellSound = () => {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
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

export function CatFortuneTeller({ theme }: CatFortuneTellerProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isOpening, setIsOpening] = useState<boolean>(false);
  const [isBellRinging, setIsBellRinging] = useState<boolean>(false);
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
    if (isOpening || isBellRinging) return;
    
    setShowTooltip(false);

    // 1. 預先挑選今日好運
    const randomIdx = Math.floor(Math.random() * FORTUNES.length);
    setCurrentFortune(FORTUNES[randomIdx]);

    // 2. 立即開啟神社卡片面板並啟動神社搖鈴過場
    setIsOpen(true);
    setIsBellRinging(true);

    // 3. 播放極致神聖神社搖鈴音效 與 深沉禪意梵鐘木魚音
    playSuzuBellSound();
    playMokugyoAndTempleBellSound();

    // 4. 觸發神社雙重長震動 (高質感回饋)
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate([40, 80, 40]);
    }

    // 5. 產生搖鈴時的細微靈性光芒粒子 與 「吉、大吉、中吉」等隨機浮動文字粒子
    const textPool = ["大吉", "中吉", "小吉", "末吉", "吉", "開運", "喵吉", "招財", "福徳"];
    const textParticles: Particle[] = Array.from({ length: 6 }).map((_, idx) => {
      const randomText = textPool[Math.floor(Math.random() * textPool.length)];
      return {
        id: Date.now() + 500 + idx + Math.random(),
        char: randomText,
        x: (Math.random() * 120) - 60, // 左右微散
        y: -30 - (Math.random() * 80), // 向上漂移
        scale: 0.9 + Math.random() * 0.35,
        rotation: (Math.random() * 24) - 12, // 輕微傾斜
      };
    });

    const glowParticles: Particle[] = Array.from({ length: 12 }).map((_, idx) => {
      const angle = (idx * (360 / 12) + Math.random() * 15) * (Math.PI / 180);
      const speed = 25 + Math.random() * 30;
      return {
        id: Date.now() + idx + Math.random(),
        char: ["✨", "🐾", "🌸", "🔔"][idx % 4],
        x: Math.cos(angle) * speed,
        y: Math.sin(angle) * speed - 10,
        scale: 0.8 + Math.random() * 0.4,
        rotation: Math.random() * 180 - 90,
      };
    });
    setParticles([...glowParticles, ...textParticles]);

    // 6. 1400ms 後搖鈴儀式完結，驚喜爆開罐罐好運並噴發主視覺粒子！
    setTimeout(() => {
      setIsBellRinging(false);
      setIsOpening(true);

      // 播放高品質開罐聲，儀式揭曉！
      playCanOpenSound();

      // 觸發金光波紋
      const rippleId = Date.now();
      setRipples((prev) => [...prev, { id: rippleId }]);
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== rippleId));
      }, 800);

      // 開罐爆炸彩蛋粒子
      const burstParticles: Particle[] = Array.from({ length: 16 }).map((_, idx) => {
        const angle = (idx * (360 / 16) + Math.random() * 15) * (Math.PI / 180);
        const speed = 40 + Math.random() * 60;
        return {
          id: Date.now() + 100 + idx + Math.random(),
          char: PARTICLES_EMOJIS[Math.floor(Math.random() * PARTICLES_EMOJIS.length)],
          x: Math.cos(angle) * speed,
          y: Math.sin(angle) * speed - 20,
          scale: 0.8 + Math.random() * 0.5,
          rotation: Math.random() * 360 - 180,
        };
      });
      setParticles(burstParticles);

      setTimeout(() => {
        setIsOpening(false);
        setTimeout(() => setParticles([]), 1200);
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

    // 產生祈福輕微粒子 與 浮動吉運文字
    const textPool = ["大吉", "中吉", "小吉", "末吉", "吉", "開運", "喵吉", "招財", "福徳"];
    const textParticles: Particle[] = Array.from({ length: 6 }).map((_, idx) => {
      const randomText = textPool[Math.floor(Math.random() * textPool.length)];
      return {
        id: Date.now() + 600 + idx + Math.random(),
        char: randomText,
        x: (Math.random() * 120) - 60,
        y: -30 - (Math.random() * 80),
        scale: 0.9 + Math.random() * 0.35,
        rotation: (Math.random() * 24) - 12,
      };
    });

    const glowParticles: Particle[] = Array.from({ length: 10 }).map((_, idx) => {
      const angle = (idx * (360 / 10) + Math.random() * 20) * (Math.PI / 180);
      const speed = 20 + Math.random() * 25;
      return {
        id: Date.now() + idx + Math.random(),
        char: ["✨", "🐾", "🌸", "🔔"][idx % 4],
        x: Math.cos(angle) * speed,
        y: Math.sin(angle) * speed - 10,
        scale: 0.7 + Math.random() * 0.3,
        rotation: Math.random() * 180 - 90,
      };
    });
    setParticles([...glowParticles, ...textParticles]);

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
      const burstParticles: Particle[] = Array.from({ length: 12 }).map((_, idx) => {
        const angle = (idx * (360 / 12) + Math.random() * 15) * (Math.PI / 180);
        const speed = 35 + Math.random() * 45;
        return {
          id: Date.now() + 100 + idx + Math.random(),
          char: PARTICLES_EMOJIS[Math.floor(Math.random() * PARTICLES_EMOJIS.length)],
          x: Math.cos(angle) * speed,
          y: Math.sin(angle) * speed - 15,
          scale: 0.8 + Math.random() * 0.4,
          rotation: Math.random() * 360 - 180,
        };
      });
      setParticles(burstParticles);

      setTimeout(() => {
        setIsOpening(false);
        setTimeout(() => setParticles([]), 1000);
      }, 500);
    }, 1400);
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
      {/* 1. 頁尾嵌入式按鈕：姆貓運勢罐罐 */}
      <div className="relative select-none flex flex-col items-center justify-center">
        
        {/* Bouncing Tooltip 提示氣泡 (置中顯示) */}
        <AnimatePresence>
          {showTooltip && !isOpen && !isOpening && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-3.5 py-2 rounded-lg text-[11px] font-serif font-bold whitespace-nowrap shadow-md border text-center flex items-center gap-2 cursor-pointer z-40 ${
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

        {/* 粒子噴發現象容器 */}
        <div className="absolute inset-0 pointer-events-none overflow-visible flex items-center justify-center">
          <AnimatePresence>
            {particles.map((p) => {
              const isChinese = /[\u4e00-\u9fa5]/.test(p.char);
              return (
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
                  transition={{ duration: 1.0, ease: "easeOut" }}
                  className="absolute pointer-events-none select-none"
                >
                  {isChinese ? (
                    <div className="font-serif font-black text-xs text-[#D33F33] bg-[#FCFAF7] border border-[#D33F33]/40 px-2.5 py-1 rounded-md shadow-md whitespace-nowrap tracking-widest flex items-center gap-1">
                      <span className="text-[10px]">⛩️</span>
                      <span>{p.char}</span>
                    </div>
                  ) : (
                    <span className="text-xl">{p.char}</span>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* 罐罐按鈕：與頁尾設計高度融合的精美橫向按鈕 */}
        <motion.button
          onClick={triggerOpenCan}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          animate={isOpening ? { rotate: [0, -8, 8, -8, 8, -8, 8, 0], scale: [1, 1.05, 0.98, 1.05, 1] } : {}}
          transition={isOpening ? { repeat: 0, duration: 0.4 } : {}}
          className={`relative px-5 py-2.5 rounded-lg border-4 border-double transition-all duration-300 shadow-md flex items-center justify-center gap-2.5 cursor-pointer group active:scale-95 text-xs font-serif font-black ${
            theme === "sepia"
              ? "bg-[#FCFAF7] border-[#D33F33] text-[#D33F33] hover:bg-[#FAF5ED] hover:shadow-[0_4px_12px_rgba(211,63,51,0.15)]"
              : theme === "light"
              ? "bg-[#FCFAF7] border-[#D33F33] text-[#D33F33] hover:bg-[#FAF5ED] hover:shadow-[0_4px_12px_rgba(211,63,51,0.12)]"
              : "bg-[#181212] border-[#D33F33]/80 text-[#FAF1E6] hover:bg-[#201818] hover:border-[#D33F33] hover:shadow-[0_4px_15px_rgba(211,63,51,0.25)]"
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
                className="absolute inset-0 rounded-lg border-2 border-[#D33F33]/60 pointer-events-none"
              />
            ))}
          </AnimatePresence>

          {/* 罐罐主視覺圖標 */}
          <span className="text-sm transform group-hover:scale-125 group-hover:-rotate-12 transition-transform duration-300 select-none">
            🥫
          </span>

          <span className="tracking-[0.2em] font-serif font-black text-xs sm:text-sm">
            今日姆貓運勢罐罐
          </span>
          
          {/* 閃爍祈願圖標 */}
          <span className="text-sm transform group-hover:scale-125 group-hover:rotate-12 transition-transform duration-300 select-none">
            ✨
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
              className="w-full max-w-sm rounded-3xl border border-[#DFCFA0]/90 text-[#3E2715] shadow-[0_25px_60px_rgba(40,30,20,0.25)] overflow-hidden relative flex flex-col font-serif"
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
              <motion.div
                className="absolute inset-0 pointer-events-none z-0"
                animate={{
                  background: [
                    "radial-gradient(circle at 50% 25%, rgba(251, 191, 36, 0.08) 0%, rgba(211, 63, 51, 0.02) 50%, transparent 100%)",
                    "radial-gradient(circle at 47% 28%, rgba(251, 191, 36, 0.14) 0%, rgba(211, 63, 51, 0.045) 55%, transparent 100%)",
                    "radial-gradient(circle at 53% 22%, rgba(251, 191, 36, 0.05) 0%, rgba(211, 63, 51, 0.01) 45%, transparent 100%)",
                    "radial-gradient(circle at 48% 26%, rgba(251, 191, 36, 0.11) 0%, rgba(211, 63, 51, 0.035) 52%, transparent 100%)",
                    "radial-gradient(circle at 50% 25%, rgba(251, 191, 36, 0.08) 0%, rgba(211, 63, 51, 0.02) 50%, transparent 100%)"
                  ]
                }}
                transition={{
                  duration: 6.0,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />

              {/* 粒子噴發現象容器 (Modal 內部) */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center z-40">
                <AnimatePresence>
                  {particles.map((p) => {
                    const isChinese = /[\u4e00-\u9fa5]/.test(p.char);
                    return (
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
                        transition={{ duration: 1.0, ease: "easeOut" }}
                        className="absolute pointer-events-none select-none"
                      >
                        {isChinese ? (
                          <div className="font-serif font-black text-xs text-[#D33F33] bg-[#FCFAF7] border border-[#D33F33]/40 px-2.5 py-1 rounded-md shadow-md whitespace-nowrap tracking-widest flex items-center gap-1">
                            <span className="text-[10px]">⛩️</span>
                            <span>{p.char}</span>
                          </div>
                        ) : (
                          <span className="text-xl">{p.char}</span>
                        )}
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>

              {/* 卡片背景和紙纖維微弱光暈 */}
              <div className="absolute inset-0 opacity-[0.015] pointer-events-none bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:12px_12px]" />
              <div className="absolute -top-24 -left-24 w-48 h-48 rounded-full bg-[#D33F33]/5 blur-[60px] pointer-events-none" />
              <div className="absolute -bottom-24 -right-24 w-48 h-48 rounded-full bg-[#C5A059]/10 blur-[60px] pointer-events-none" />

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
                        className="origin-top drop-shadow-[0_12px_24px_rgba(40,30,20,0.18)]"
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
                  MUMIAO SHRINE • OMIKUJI
                </p>
              </div>

              {/* 運勢大吉和紙籤條 (垂直書寫直書排版) */}
              <div className="px-6 py-2 select-text">
                <div className="relative bg-[#FCFAF7] border-2 border-double border-[#D33F33]/70 rounded-xl p-5 shadow-inner flex flex-col items-center justify-between min-h-[290px] overflow-hidden">
                  
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
                </div>
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
                <button
                  type="button"
                  onClick={handleNextFortune}
                  disabled={isOpening}
                  className="flex-1 py-3 rounded-2xl text-xs font-serif font-black flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer bg-[#D33F33] hover:bg-[#C0392B] text-white border-2 border-[#D33F33] hover:border-[#D33F33]/80 shadow-lg shadow-[#D33F33]/15 tracking-wider"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isOpening ? "animate-spin" : ""}`} />
                  <span>再開一罐 🥫</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="py-3 px-5 rounded-2xl text-xs font-serif font-bold border-2 border-[#DFCFA0] bg-[#FAF6F0] hover:bg-[#EADECC]/30 text-[#4F3C28] transition-all active:scale-95 cursor-pointer tracking-wider"
                >
                  領取好運 🐾
                </button>
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
      </AnimatePresence>
    </>
  );
}
