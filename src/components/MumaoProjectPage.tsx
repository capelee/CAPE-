import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  X, 
  Instagram, 
  Cat, 
  Volume2,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Compass,
  Layers,
  Grid,
  FileText,
  Sparkles,
  Package,
  Palette,
  Layout,
  LayoutGrid,
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  Tag,
  Copy,
  Check,
  Sun,
  Moon,
  Share2
} from "lucide-react";
import { MumaoCatIcon } from "./MumaoCatIcon";
import { SoundwaveWhisker, SoundwaveDivider, SoundwavePillBadge } from "./SoundwaveDecorations";
import { InteractiveHeroWhiskers } from "./InteractiveHeroWhiskers";
import { playMeowSound, catPurr } from "../utils/audioEffects";
import { resolveImageUrl } from "../utils";

interface MumaoProjectPageProps {
  isOpen: boolean;
  onClose: () => void;
  theme?: string;
}

export function MumaoProjectPage({ isOpen, onClose, theme = "light" }: MumaoProjectPageProps) {
  const [activeHeroImage, setActiveHeroImageState] = useState(0);
  const [direction, setDirection] = useState(1); // 1 for next (slide left), -1 for prev (slide right)

  const setActiveHeroImage = (newIndex: number | ((prev: number) => number)) => {
    setActiveHeroImageState((prev) => {
      const nextIndex = typeof newIndex === "function" ? newIndex(prev) : newIndex;
      if (nextIndex > prev) {
        setDirection(1);
      } else if (nextIndex < prev) {
        setDirection(-1);
      } else {
        if (prev === 2 && nextIndex === 0) setDirection(1);
        else if (prev === 0 && nextIndex === 2) setDirection(-1);
      }
      return nextIndex;
    });
  };
  const [isPurring, setIsPurring] = useState(false);
  const [copiedHex, setCopiedHex] = useState<string | null>(null);
  const [copiedTopShare, setCopiedTopShare] = useState(false);

  const copyPlainText = async (text: string) => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        if (typeof ClipboardItem !== "undefined") {
          const blob = new Blob([text], { type: "text/plain" });
          await navigator.clipboard.write([
            new ClipboardItem({ "text/plain": blob })
          ]);
          return true;
        }
        await navigator.clipboard.writeText(text);
        return true;
      }
    } catch {
      // fallback if clipboard API fails or has permission restrictions
    }
    try {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.setAttribute("readonly", "");
      textArea.style.position = "fixed";
      textArea.style.top = "0";
      textArea.style.left = "-9999px";
      textArea.style.opacity = "0";
      document.body.appendChild(textArea);
      textArea.select();
      const successful = document.execCommand("copy");
      document.body.removeChild(textArea);
      return successful;
    } catch {
      return false;
    }
  };

  const handleTopShare = async () => {
    if (typeof window !== "undefined") {
      const shareUrl = window.location.href;
      await copyPlainText(shareUrl);
      setCopiedTopShare(true);
      playMeowSound();
      setTimeout(() => setCopiedTopShare(false), 2000);
    }
  };
  const [previewItem, setPreviewItem] = useState<{
    title: string;
    category?: string;
    type?: string;
    image: string;
    desc?: string;
    spec?: string;
  } | null>(null);

  const festivalScrollRef = useRef<HTMLDivElement>(null);
  const instagramUrl = "https://www.instagram.com/mumao1_the_cat_religion/";

  // Drag-to-scroll refs
  const isMouseDownRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!festivalScrollRef.current) return;
    isMouseDownRef.current = true;
    setIsDragging(true);
    startXRef.current = e.pageX - festivalScrollRef.current.offsetLeft;
    scrollLeftRef.current = festivalScrollRef.current.scrollLeft;
  };

  const handleMouseLeave = () => {
    isMouseDownRef.current = false;
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    isMouseDownRef.current = false;
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isMouseDownRef.current || !festivalScrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - festivalScrollRef.current.offsetLeft;
    const walk = (x - startXRef.current) * 1.5;
    festivalScrollRef.current.scrollLeft = scrollLeftRef.current - walk;
  };

  const scrollFestival = (direction: "left" | "right") => {
    if (festivalScrollRef.current) {
      const scrollAmount = direction === "left" ? -360 : 360;
      festivalScrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const handlePurr = () => {
    if (catPurr.isPlaying) {
      catPurr.stop();
      setIsPurring(false);
    } else {
      catPurr.start();
      setIsPurring(true);
    }
  };

  const handleCopyColor = (hex: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(hex);
    }
    setCopiedHex(hex);
    playMeowSound();
    setTimeout(() => setCopiedHex(null), 2000);
  };

  const modalContainerRef = useRef<HTMLDivElement>(null);
  const mobileNavContainerRef = useRef<HTMLDivElement>(null);
  const [activeSection, setActiveSection] = useState<string>("hero-section");
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mobileNavScrollState, setMobileNavScrollState] = useState({ canScrollLeft: false, canScrollRight: true });

  // Mouse / Pointer Drag to Scroll for Mobile/Tablet Capsule Navigation
  const isDraggingNav = useRef(false);
  const navStartX = useRef(0);
  const navScrollLeft = useRef(0);
  const hasDraggedNav = useRef(false);
  const [isNavPointerDown, setIsNavPointerDown] = useState(false);
  
  const isAutoCenteringRef = useRef(false);
  const navRecenterTimerRef = useRef<NodeJS.Timeout | null>(null);
  const scrollEndDebounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Smoothly center the currently active capsule in the mobile navigation strip
  const centerActiveNavCapsule = useCallback((smooth = true) => {
    if (!activeSection) return;
    const container = mobileNavContainerRef.current;
    const targetBtn = document.getElementById(`mobile-nav-${activeSection}`);
    if (container && targetBtn) {
      isAutoCenteringRef.current = true;
      const targetLeft = targetBtn.offsetLeft - (container.clientWidth / 2) + (targetBtn.clientWidth / 2);
      container.scrollTo({
        left: Math.max(0, targetLeft),
        behavior: smooth ? "smooth" : "auto"
      });
      setTimeout(() => {
        isAutoCenteringRef.current = false;
      }, smooth ? 600 : 50);
    }
  }, [activeSection]);

  // Check if active capsule is currently off-center or scrolled out of view
  const isCapsuleOffCenter = useCallback(() => {
    if (!activeSection) return false;
    const container = mobileNavContainerRef.current;
    const targetBtn = document.getElementById(`mobile-nav-${activeSection}`);
    if (!container || !targetBtn) return false;

    const btnRect = targetBtn.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();

    const btnCenter = btnRect.left + btnRect.width / 2;
    const containerCenter = containerRect.left + containerRect.width / 2;
    const isOffCenter = Math.abs(btnCenter - containerCenter) > 35;
    const isOut = btnRect.right < containerRect.left + 10 || btnRect.left > containerRect.right - 10;

    return isOffCenter || isOut;
  }, [activeSection]);

  const triggerScrollEndCheck = useCallback(() => {
    if (scrollEndDebounceTimerRef.current) clearTimeout(scrollEndDebounceTimerRef.current);
    if (navRecenterTimerRef.current) clearTimeout(navRecenterTimerRef.current);

    // Debounce scroll end (wait 150ms after scroll movement finishes)
    scrollEndDebounceTimerRef.current = setTimeout(() => {
      if (isCapsuleOffCenter()) {
        // Start 3-second countdown to return to active capsule
        navRecenterTimerRef.current = setTimeout(() => {
          if (!isDraggingNav.current && !isNavPointerDown) {
            centerActiveNavCapsule(true);
          }
        }, 3000);
      }
    }, 150);
  }, [centerActiveNavCapsule, isCapsuleOffCenter, isNavPointerDown]);

  const handleNavPointerDown = (e: React.PointerEvent) => {
    const container = mobileNavContainerRef.current;
    if (!container) return;
    
    isDraggingNav.current = true;
    hasDraggedNav.current = false;
    navStartX.current = e.clientX;
    navScrollLeft.current = container.scrollLeft;
    setIsNavPointerDown(true);

    if (navRecenterTimerRef.current) clearTimeout(navRecenterTimerRef.current);
    if (scrollEndDebounceTimerRef.current) clearTimeout(scrollEndDebounceTimerRef.current);

    try {
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    } catch {
      // ignore
    }
  };

  const handleNavPointerMove = (e: React.PointerEvent) => {
    if (!isDraggingNav.current) return;
    const container = mobileNavContainerRef.current;
    if (!container) return;

    const deltaX = e.clientX - navStartX.current;
    if (Math.abs(deltaX) > 4) {
      hasDraggedNav.current = true;
    }

    container.scrollLeft = navScrollLeft.current - deltaX * 1.35;
  };

  const handleNavPointerUp = (e: React.PointerEvent) => {
    isDraggingNav.current = false;
    setIsNavPointerDown(false);
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }
    setTimeout(() => {
      hasDraggedNav.current = false;
    }, 50);

    triggerScrollEndCheck();
  };

  const handleNavTouchStart = (e: React.TouchEvent) => {
    const container = mobileNavContainerRef.current;
    if (!container) return;
    const touch = e.touches[0];
    isDraggingNav.current = true;
    hasDraggedNav.current = false;
    navStartX.current = touch.clientX;
    navScrollLeft.current = container.scrollLeft;

    if (navRecenterTimerRef.current) clearTimeout(navRecenterTimerRef.current);
    if (scrollEndDebounceTimerRef.current) clearTimeout(scrollEndDebounceTimerRef.current);
  };

  const handleNavTouchMove = (e: React.TouchEvent) => {
    if (!isDraggingNav.current) return;
    const container = mobileNavContainerRef.current;
    if (!container) return;
    const touch = e.touches[0];
    const deltaX = touch.clientX - navStartX.current;
    if (Math.abs(deltaX) > 4) {
      hasDraggedNav.current = true;
    }
    container.scrollLeft = navScrollLeft.current - deltaX * 1.2;
  };

  const handleNavTouchEnd = () => {
    isDraggingNav.current = false;
    setTimeout(() => {
      hasDraggedNav.current = false;
    }, 50);

    triggerScrollEndCheck();
  };

  const handleMobileNavScroll = () => {
    const el = mobileNavContainerRef.current;
    if (!el) return;

    const canScrollLeft = el.scrollLeft > 6;
    const canScrollRight = el.scrollLeft < (el.scrollWidth - el.clientWidth - 6);
    setMobileNavScrollState({ canScrollLeft, canScrollRight });

    // Ignore scroll events caused by auto-centering or active drag
    if (isAutoCenteringRef.current || isDraggingNav.current || isNavPointerDown) {
      return;
    }

    triggerScrollEndCheck();
  };

  const scrollToSection = (id: string) => {
    const targetElement = document.getElementById(id);
    const container = modalContainerRef.current;
    if (targetElement && container) {
      const headerOffset = 110; // header + mobile nav strip height
      const targetTop = targetElement.getBoundingClientRect().top + container.scrollTop - container.getBoundingClientRect().top - headerOffset;
      container.scrollTo({ top: Math.max(0, targetTop), behavior: "smooth" });
      if (typeof window !== "undefined") {
        window.history.pushState(null, "", `#${id}`);
      }
    } else if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  const heroVisuals = [
    {
      url: resolveImageUrl("https://drive.google.com/thumbnail?sz=w1000&id=1XRb0RgB2BXTPWjA0Vtegkon_4Ban5cTD"),
      title: "KEY VISUAL 01: DANCING",
      desc: "MUMㄠ 搖滾熱舞手稿與活力日常"
    },
    {
      url: resolveImageUrl("https://drive.google.com/thumbnail?sz=w1000&id=19lC2HqhK8-ZvGjpsT7_6GL6Spn8SDT0S"),
      title: "KEY VISUAL 02: CROSS-LEGGED SITTING",
      desc: "MUMㄠ 悠閒盤腿坐姿與趣味表情"
    },
    {
      url: resolveImageUrl("https://drive.google.com/thumbnail?sz=w1000&id=1kZIv08WMwrJ5RWm0W2Lkgoc7lAkjAW5M"),
      title: "KEY VISUAL 03: MOSH & ILLUSTRATION",
      desc: "MUMㄠ 獨立音樂聽團次文化原創插畫"
    }
  ];

  const characterActions = [
    {
      role: "01 / CORE IDENTITY",
      title: "STANDARD STANCE",
      zhTitle: "標準角色",
      desc: "以 MUMㄠ 的基本正面角色作為核心識別，固定頭型、耳朵、『ㄠ』、音波鬍鬚與服裝比例，建立所有角色延伸的視覺基準。",
      image: "https://drive.google.com/thumbnail?sz=w1000&id=1mgzCv32PxwVezq7VsnX4fV8P203zSZpC",
      tag: "MASTER CHARACTER",
      principle: "CORE IDENTITY"
    },
    {
      role: "02 / EXPRESSION",
      title: "WINK & MOSH",
      zhTitle: "眨眼／情緒",
      desc: "透過眨眼、表情與身體微幅變化，讓 MUMㄠ 可以進入音樂、社群與日常情境，但不改變核心角色識別。",
      image: "https://drive.google.com/thumbnail?sz=w1000&id=1eqi9X536nUrXqj-gv6kqjNMfpiC1YumX",
      tag: "EXPRESSION SYSTEM",
      principle: "EXPRESSION SYSTEM"
    },
    {
      role: "03 / ACTION",
      title: "RAISED PAWS",
      zhTitle: "舉手／動作",
      desc: "以舉手、揮舞與 Mosh Pit 等動作，建立 MUMㄠ 的現場能量，讓角色能自然進入音樂祭、舞台與活動視覺。",
      image: "https://drive.google.com/thumbnail?sz=w1000&id=1mgzCv32PxwVezq7VsnX4fV8P203zSZpC",
      tag: "ACTION LANGUAGE",
      principle: "ACTION SYSTEM"
    }
  ];

  const characterFutureSystem = [
    { num: "01", name: "SIDE VIEW", zhName: "側面視角", desc: "建立角色側面輪廓與立體比例規範。" },
    { num: "02", name: "SITTING POSE", zhName: "坐姿", desc: "建立角色進入日常生活情境的角色狀態。" },
    { num: "03", name: "DANCING MOVEMENT", zhName: "跳舞／音樂祭動作", desc: "建立角色進入音樂祭與舞台情境的動態語言。" },
    { num: "04", name: "TOWEL SWING", zhName: "毛巾揮動", desc: "建立角色與音樂祭周邊道具互動的動作語言。" }
  ];

  const brandDecrees = [
    {
      num: "01",
      title: "演出不能遲到",
      enTitle: "NEVER MISS THE SHOW.",
      category: "ATTITUDE",
      principle: "PUNCTUALITY",
      tag: "MUMㄠ ATTITUDE",
      desc: "第一拍就要開衝，因為好音樂不等人。"
    },
    {
      num: "02",
      title: "喜歡的團，就要用力喊。",
      enTitle: "CHEER LOUDER.",
      category: "EMOTION",
      principle: "VOCAL ENTHUSIASM",
      tag: "MUMㄠ EMOTION",
      desc: "聽見喜歡的歌，就不要把情緒留在心裡。"
    },
    {
      num: "03",
      title: "毛巾一定要帶。",
      enTitle: "BRING THE TOWEL.",
      category: "CULTURE",
      principle: "FESTIVAL CULTURE ASSET",
      tag: "FESTIVAL LANGUAGE",
      desc: "音樂祭可以忘記很多事，毛巾不能。甩動毛巾是現場不可或缺的文化儀式。"
    },
    {
      num: "04",
      title: "泥巴踩下去，就回不去了。",
      enTitle: "NO TURNING BACK.",
      category: "EXPERIENCE",
      principle: "IMMERSIVE SPIRIT",
      tag: "FESTIVAL ATTITUDE",
      desc: "大鬧音樂祭的混亂與泥濘，也是聽團文化裡最真實的浪漫。"
    },
    {
      num: "05",
      title: "全是感情，還有音樂。",
      enTitle: "ALL HEART. ALL MUSIC.",
      category: "BELIEF",
      principle: "CORE MOTTO",
      tag: "CORE MOTTO",
      desc: "姆貓教的核心信念。不需要太多理由，喜歡音樂、喜歡現場、喜歡一起大聲唱，就是加入姆貓教的理由。"
    }
  ];

  const festivalCampaigns = [
    {
      id: "emerge",
      num: "01",
      name: "浮現祭 EMERGE FESTIVAL",
      category: "MUSIC FESTIVAL",
      eventField: "MUSIC",
      year: "2026年2月28日-3月1日",
      location: "台中市清水區 鰲峰山運動公園",
      role: "AUDIENCE COMPANION",
      roleZh: "現場陪伴角色／獨立音樂文化的陪伴者",
      roleShort: "陪伴",
      focusPoint: "MUMㄠ 以觀眾身邊的角色進入音樂祭，透過攤位、周邊與現場視覺建立第一層文化連結。",
      coreConcept: {
        role: "陪伴",
        context: "MUSIC FESTIVAL",
        func: "建立現場親近感"
      },
      culturalConnection: "將現場樂迷的狂熱記憶與 MUMㄠ 角色融合，透過攤位、周邊商品與視覺布置，建立屬於音樂祭現場的品牌親近感與文化連結。",
      visualOutput: "現場攤位布置、音樂祭限定毛巾周邊、商品陳列與品牌現場識別",
      image: "https://drive.google.com/thumbnail?sz=w1000&id=1tec8te6MOKjOA4zcUHh6-hs5ODFxarft",
      isPrimary: true
    },
    {
      id: "taipei-art-book",
      num: "02",
      name: "草率季十周年 Taipei Art Book Fair",
      category: "ART & ZINE",
      eventField: "ART",
      year: "2026年3月6日-3月8日",
      location: "臺北表演藝術中心 超級大劇院",
      role: "INDEPENDENT CULTURE CHARACTER",
      roleZh: "獨立文化角色／Zine 與藝術出版符號",
      roleShort: "參與",
      focusPoint: "MUMㄠ 從音樂現場延伸至獨立出版與藝術文化，透過紙品、角色圖像與手繪視覺建立 IP 的文化深度。",
      coreConcept: {
        role: "參與",
        context: "ART / ZINE / PUBLISHING",
        func: "建立文化辨識度"
      },
      culturalConnection: "打破單一音樂祭界線，在獨立出版與手繪創作生態圈中展示 IP 的文化深度與包容力。",
      visualOutput: "繪本 Zine 特刊、手繪塗鴉卡片、藝術貼紙包與展位藝術展示",
      image: "https://drive.google.com/thumbnail?sz=w1000&id=1_FQpXov24YIwB4tCL1dlFxsf_puJze7b",
      isPrimary: false
    },
    {
      id: "kaka-music",
      num: "03",
      name: "2026 卡卡音樂祭 𝗞𝗔𝗞𝗔 𝗠𝗨𝗦𝗜𝗖 𝗙𝗘𝗦𝗧.",
      category: "FIELD CULTURE",
      eventField: "FIELD",
      year: "2026年3月14日-3月15日",
      location: "國立中央大學戶外草坪",
      role: "CULTURAL PRESENCE ／ DREAM WEAVER",
      roleZh: "文化現場角色／戶外音樂場景中的文化存在",
      roleShort: "融入",
      focusPoint: "MUMㄠ 進一步融入戶外音樂祭與生活場景，不只是陪伴觀眾，而是成為現場氛圍與文化記憶的一部分。",
      coreConcept: {
        role: "融入",
        context: "FIELD / OUTDOOR FESTIVAL",
        func: "建立文化記憶"
      },
      culturalConnection: "呼應 2026「裝睡有理・做夢無罪」，將年輕世代的疲憊、迷惘與自我保護，轉化為具有共感的角色語言，融入大草皮生活場景。",
      visualOutput: "音樂祭限定毛巾、角色貼紙、壓力克立牌、野餐墊、角色周邊與現場攤位視覺",
      image: "https://drive.google.com/thumbnail?sz=w1000&id=1u89BfqIon2CZILyWZ5Pwxx4eq6sX_v8y",
      isPrimary: false
    }
  ];

  const visualApplications = [
    {
      num: "01",
      systemCategory: "IDENTITY",
      medium: "CHARACTER CORE",
      title: "角色核心識別",
      enTitle: "CHARACTER CORE",
      purpose: "MUMㄠ 長什麼樣",
      uses: "Standard Mascot / Style Guide / Identity Spec",
      aspect: "aspect-square",
      image: "https://drive.google.com/thumbnail?sz=w1000&id=1rLxxT_LWlrC9rBVU7rlPOYAQY2xpR1FZ",
      desc: "以 MUMㄠ 的標準角色比例、五大固定特徵與核心色彩，建立所有延伸視覺的基礎。"
    },
    {
      num: "02",
      systemCategory: "CONTENT",
      medium: "SOCIAL CONTENT",
      title: "社群內容",
      enTitle: "SOCIAL CONTENT",
      purpose: "MUMㄠ 發什麼",
      uses: "Instagram / Comic / Post / Story / Meme",
      aspect: "aspect-square",
      image: "https://drive.google.com/thumbnail?sz=w1000&id=1tyEH6DNCyy1dI_ZCLehCVqLDOY5ugz3U",
      desc: "將角色語言與聽團日常轉化為容易被分享、閱讀與互動的社群內容。"
    },
    {
      num: "03",
      systemCategory: "COMMUNICATION",
      medium: "STICKER / EXPRESSION",
      title: "貼圖與情緒表達",
      enTitle: "STICKER / EXPRESSION",
      purpose: "MUMㄠ 怎麼互動",
      uses: "LINE / Chat / Social Reaction / Digital Communication",
      aspect: "aspect-square",
      image: "https://drive.google.com/thumbnail?sz=w1000&id=1OppRUUlVjoNDgtH1q4i1WZrK6AQ9W8ni",
      desc: "透過表情、姿勢與短句，讓 MUMㄠ 成為聽團仔日常溝通的一部分。"
    },
    {
      num: "04",
      systemCategory: "ENVIRONMENT",
      medium: "FESTIVAL APPLICATION",
      title: "音樂祭現場",
      enTitle: "FESTIVAL APPLICATION",
      purpose: "MUMㄠ 怎麼進入現場",
      uses: "Poster / Banner / Towel / Signage / Event Visual",
      aspect: "aspect-square",
      image: "https://drive.google.com/thumbnail?sz=w1000&id=1tUtt2WpBpNz10SOb2VeW-EEbSp9pxm3D",
      desc: "將 MUMㄠ 從螢幕帶入真實音樂祭，形成具有現場辨識度的角色視覺。"
    }
  ];

  const merchandiseDesigns = [
    {
      num: "01",
      category: "01 WEAR（穿戴）",
      productRole: "FESTIVAL ESSENTIAL",
      roleQuote: "把樂迷最直接的願望，變成一條可以帶進音樂祭現場的歌單毛巾。",
      name: "請給我歌單 毛巾",
      enName: "MUSIC FESTIVAL TOWEL",
      tag: "SIGNATURE FESTIVAL ITEM",
      spec: "100% 純棉吸水毛巾・33×100cm",
      image: "https://drive.google.com/thumbnail?sz=w1000&id=1CKKOwMbWjMwy-NTSa92APSgobK-LBwGl",
      desc: "以「請給我歌單」作為主視覺，搭配鞠躬小貓角色，將音樂祭文化與樂迷語言轉化為具有趣味性的限定周邊。藍白配色搭配大字標語，讓毛巾在人群與舞台現場都具有高度辨識度。",
      application: ["Festival", "Merchandise", "MusicTowel"]
    },
    {
      num: "02",
      category: "02 STICKER（貼紙）",
      productRole: "FESTIVAL ESSENTIAL",
      roleQuote: "把音樂祭的浪花，變成一張可以貼在日常裡的小小角色。",
      name: "MUMㄠ貼紙",
      enName: "MUMㄠ FESTIVAL STICKER",
      tag: "EVERYDAY CULT MARK",
      spec: "防水貼紙・霧面材質・約 8×8cm",
      image: "https://drive.google.com/thumbnail?sz=w1000&id=19cHtUo1Z8PDJzFFIqduHu943vybryNs5",
      desc: "以 MUMㄠ 為主角，將標誌性的藍色波浪鬍子轉化為角色識別特徵。簡潔的黑白線條搭配粉色耳朵與藍色波浪元素，呈現俏皮又具有音樂祭個性的限定貼紙。",
      application: ["Festival", "Sticker", "MUMㄠ"]
    },
    {
      num: "03",
      category: "03 COLLECT (收藏)",
      productRole: "COLLECTIBLE",
      roleQuote: "小尺寸品牌辨識，將角色特徵別在背包與外套上。",
      name: "MUMㄠ 金屬胸章",
      enName: "MUMㄠ METAL BADGE",
      tag: "CHARACTER COLLECTIBLE",
      spec: "鋅合金金屬・硬漆／軟漆工藝・2.5×2.5cm",
      image: "https://drive.google.com/thumbnail?sz=w1000&id=1_LcCYFe2RQV4LMCDeku9iGhLDBjmMPaC",
      desc: "以 MUMㄠ Mark 及角色核心特徵為主的精緻金屬胸章，縮小角色線條，適合隨身別在背包、帽子與衣物，提供低調而清晰的品牌識別。",
      application: ["Festival", "Badge", "MUMㄠ"]
    },
    {
      num: "04",
      category: "04 LIVE (現場使用)",
      productRole: "FESTIVAL COMPANION",
      roleQuote: "「把 MUMㄠ 延伸到音樂祭的休息、等待與社交場景。」",
      name: "音樂祭大草皮防水野餐墊",
      enName: "MEADOW FESTIVAL WATERPROOF MAT",
      tag: "ON-SITE LIFESTYLE MAT",
      spec: "600D 牛津布防水層 ‧ 140×150cm",
      image: "https://drive.google.com/thumbnail?sz=w1000&id=12em0bOkBQeoI9ouMfeNmTws-KuhKsouH",
      desc: "專為大草皮舞台空檔休憩設計，大面積印刷 MUMㄠ 經典開衝繪圖。",
      application: ["Festival", "Lifestyle", "On-Site"]
    }
  ];

  const commercialMatrix = [
    { title: "FESTIVAL VISUAL", desc: "音樂祭現場主視覺、舞台看板與地景置入" },
    { title: "SOCIAL CONTENT", desc: "社群動態迷因、四格漫畫與聽團日常連載" },
    { title: "MERCHANDISE", desc: "實體周邊產品線開發、包裝與 Mockup 展示" },
    { title: "COLLABORATION", desc: "獨立樂團聯名周邊、單曲封面與巡演視覺" }
  ];

  const brandColorSystem = [
    {
      code: "01 / BASE",
      name: "MUMㄠ WHITE",
      zhName: "姆貓純白",
      ratio: "70%",
      position: "CHARACTER BASE",
      role: "CHARACTER BASE",
      hex: "#FFFFFF",
      rgb: "255, 255, 255",
      cmyk: "C:0 M:0 Y:0 K:0",
      pantone: "Reference: Bright White",
      bgHex: "#FFFFFF",
      isLight: true,
      meaning: "BODY / 角色本體與空間",
      desc: "建立角色本體與視覺空間。大面積使用於角色身體、背景與主要版面，建立乾淨、純粹且具有留白感的視覺基底。",
      characterLink: "BODY",
      characterZh: "角色本體／空間留白",
      applications: ["服飾／防水貼紙／大面積背景", "角色身體與毛色", "主要視覺空間基底"]
    },
    {
      code: "02 / IDENTITY",
      name: "WAVE BLUE",
      zhName: "音波湛藍",
      ratio: "20%",
      position: "MUSIC IDENTITY",
      role: "MUSIC IDENTITY",
      hex: "#437596",
      rgb: "67, 117, 150",
      cmyk: "C:72 M:42 Y:24 K:3",
      pantone: "Reference: 7697 C",
      bgHex: "#437596",
      isLight: false,
      meaning: "SOUND / 音樂與品牌辨識",
      desc: "建立音樂文化與品牌辨識。取自湛藍音波鬍鬚，象徵聲音、節奏與現場文化，是 MUMㄠ 與音樂文化的核心連結。",
      characterLink: "SOUND",
      characterZh: "音樂／聲波／現場文化",
      applications: ["RISO／印刷／毛巾／音樂祭物料", "音波鬍鬚超級符號", "品牌關鍵識別標籤"]
    },
    {
      code: "03 / ACCENT",
      name: "EAR PINK",
      zhName: "耳尖粉紅",
      ratio: "10%",
      position: "EMOTIONAL ACCENT",
      role: "EMOTIONAL ACCENT",
      hex: "#E8829C",
      rgb: "232, 130, 156",
      cmyk: "C:4 M:60 Y:24 K:0",
      pantone: "Reference: 708 C",
      bgHex: "#E8829C",
      isLight: false,
      meaning: "EMOTION / 角色溫度與情緒焦點",
      desc: "建立角色溫度與情緒焦點。取自耳朵與肉球，作為暖色情緒訊號，在藍白冷靜調性中注入親近感與溫度。（少量使用）",
      characterLink: "EMOTION",
      characterZh: "耳朵／情緒／親近感",
      applications: ["局部特殊色／刺繡／角色細節", "耳朵內側與肉球", "微細節情緒 Highlight"]
    },
    {
      code: "04 / STRUCTURE",
      name: "CHARCOAL BLACK",
      zhName: "手繪炭黑",
      ratio: "STRUCTURAL",
      position: "STRUCTURAL LINE",
      role: "STRUCTURAL / VARIABLE",
      hex: "#1E242B",
      rgb: "30, 36, 43",
      cmyk: "C:75 M:65 Y:55 K:70",
      pantone: "Reference: Black 7 C",
      bgHex: "#1E242B",
      isLight: false,
      meaning: "LINE / 輪廓、文字與結構",
      desc: "建立手繪線條、輪廓與資訊骨架。取自手繪線稿，保留手繪筆觸直接感。（不佔 70/20/10 比例，依結構需求使用）",
      characterLink: "LINE",
      characterZh: "手繪線條／輪廓／結構",
      applications: ["線稿／文字／結構／金屬", "手繪角色輪廓線", "Typography 標題與內文"]
    }
  ];

  const colorCraftSpecs = [
    {
      color: "MUMㄠ WHITE",
      hex: "#FFFFFF",
      medium: "服飾／防水貼紙／大面積背景",
      craft: "重磅純棉原色 ‧ 霧面防水底膜",
      principle: "適合大面積底色與服飾應用，保留角色的純粹與留白空間。",
      note: "BODY / BASE"
    },
    {
      color: "WAVE BLUE",
      hex: "#437596",
      medium: "RISO／印刷／毛巾／音樂祭物料",
      craft: "大豆油墨疊印 ‧ 雙面緹花編織",
      principle: "適合 RISO、網版與織品印刷，強化音樂識別與現場文化感。",
      note: "SOUND / IDENTITY"
    },
    {
      color: "EAR PINK",
      hex: "#E8829C",
      medium: "局部特殊色／刺繡／角色細節",
      craft: "局部烤漆填色 ‧ 絲網印花點綴",
      principle: "適合局部色彩與小面積點綴，作為角色情緒與溫度焦點。",
      note: "EMOTION / ACCENT"
    },
    {
      color: "CHARCOAL BLACK",
      hex: "#1E242B",
      medium: "線稿／文字／結構／金屬",
      craft: "粗目絹印線稿 ‧ 鍍黑鎳金屬邊",
      principle: "適合線稿、文字與輪廓骨架，保留手繪角色的直接感。",
      note: "LINE / STRUCTURE"
    }
  ];

  // Theme mappings & section state
  const themeMode = theme;

  const isDark = themeMode === "dark";
  const isSepia = themeMode === "sepia";

  const navItems = [
    { en: "OVERVIEW", zh: "專案概覽", id: "hero-section" },
    { en: "01 CHARACTER", zh: "角色設定", id: "character-section" },
    { en: "02 COLOR", zh: "色彩系統", id: "color-section" },
    { en: "03 LANGUAGE", zh: "品牌語言", id: "language-section" },
    { en: "04 FESTIVAL", zh: "音樂祭", id: "festival-section" },
    { en: "05 VISUALS", zh: "視覺系統", id: "visuals-section" },
    { en: "06 MERCH", zh: "周邊商品", id: "merch-section" },
    { en: "07 APPLICATION", zh: "商業生態", id: "application-section" },
    { en: "08 EXPERIENCE", zh: "品牌體驗", id: "experience-section" },
  ];

  // ScrollSpy via IntersectionObserver
  useEffect(() => {
    if (!isOpen) return;

    const sectionIds = [
      "hero-section",
      "dna-section",
      "character-section",
      "color-section",
      "language-section",
      "festival-section",
      "visuals-section",
      "merch-section",
      "application-section",
      "experience-section",
      "final-statement",
    ];

    // 1. IntersectionObserver setup
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            if (id === "dna-section") {
              setActiveSection("hero-section");
            } else if (id === "final-statement") {
              setActiveSection("experience-section");
            } else {
              setActiveSection(id);
            }
          }
        });
      },
      {
        root: modalContainerRef.current || null,
        rootMargin: "-10% 0px -60% 0px",
        threshold: 0.05,
      }
    );

    // 2. Direct scroll listener fallback to ensure 100% reliable tracking on mobile devices
    const handleModalScroll = () => {
      const container = modalContainerRef.current;
      if (!container) return;
      const scrollTop = container.scrollTop;
      const maxScroll = container.scrollHeight - container.clientHeight;
      if (maxScroll > 0) {
        const progress = Math.min(100, Math.max(0, (scrollTop / maxScroll) * 100));
        setScrollProgress(progress);
      }
      const headerOffset = 140;

      let currentActive = "hero-section";
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop - headerOffset;
          if (scrollTop >= top) {
            if (id === "dna-section") {
              currentActive = "hero-section";
            } else if (id === "final-statement") {
              currentActive = "experience-section";
            } else {
              currentActive = id;
            }
          }
        }
      }
      setActiveSection(currentActive);
    };

    const containerEl = modalContainerRef.current;
    if (containerEl) {
      containerEl.addEventListener("scroll", handleModalScroll, { passive: true });
    }

    const timer = setTimeout(() => {
      sectionIds.forEach((id) => {
        const el = document.getElementById(id);
        if (el) observer.observe(el);
      });
      handleModalScroll();
    }, 200);

    return () => {
      clearTimeout(timer);
      if (containerEl) {
        containerEl.removeEventListener("scroll", handleModalScroll);
      }
      observer.disconnect();
    };
  }, [isOpen]);

  // Handle initial scroll to hash on open
  useEffect(() => {
    if (!isOpen) return;
    const hash = typeof window !== "undefined" ? window.location.hash.replace("#", "") : "";
    if (hash) {
      const timer = setTimeout(() => {
        scrollToSection(hash);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Mobile horizontal auto-scroll centering active nav item & timer clear
  useEffect(() => {
    if (!activeSection) return;
    centerActiveNavCapsule(true);
    if (navRecenterTimerRef.current) {
      clearTimeout(navRecenterTimerRef.current);
    }
  }, [activeSection, centerActiveNavCapsule]);

  // Clean up 3s timer on unmount or when modal is closed
  useEffect(() => {
    return () => {
      if (navRecenterTimerRef.current) {
        clearTimeout(navRecenterTimerRef.current);
      }
    };
  }, [isOpen]);

  // Hero Image Auto Carousel Autoplay
  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setActiveHeroImage((prev) => (prev + 1) % 3);
    }, 4000);
    return () => clearInterval(interval);
  }, [isOpen]);

  // Core Three-Color Brand Palette CSS Variables (MUMㄠ White × Wave Blue × Ear Pink + Charcoal Black)
  const brandCssVars = {
    // 1. MUMㄠ White (70% Base & Canvas)
    "--mum-white": "#FFFFFF",
    "--mum-bg": isDark ? "#09090b" : isSepia ? "#F4EFE6" : "#FAF8F5",
    "--mum-card": isDark ? "rgba(24, 24, 27, 0.55)" : isSepia ? "#FAF4E5" : "#FFFFFF",
    "--mum-card-subtle": isDark ? "rgba(24, 24, 27, 0.3)" : isSepia ? "#EDE2CA" : "#F8FAFC",
    
    // 2. Wave Blue (20% Key Accent - Soundwave & Whiskers)
    "--mum-blue": "#437596",
    "--mum-blue-deep": "#2B5573",
    "--mum-blue-light": "#6CA4C8",
    "--mum-blue-tint": isDark ? "rgba(108, 164, 200, 0.12)" : isSepia ? "rgba(67, 117, 150, 0.12)" : "#EBF3F8",
    "--mum-blue-border": isDark ? "rgba(108, 164, 200, 0.35)" : isSepia ? "rgba(67, 117, 150, 0.25)" : "#C8DCE8",
    "--mum-blue-accent": isDark ? "#6CA4C8" : isSepia ? "#2B5573" : "#417293",

    // 3. Ear Pink (10% Spot Accent - Emotional Focus & Hand-drawn Warmth)
    "--mum-pink": "#E8829C",
    "--mum-pink-deep": "#D85E7E",
    "--mum-pink-light": "#F49BB2",
    "--mum-pink-tint": isDark ? "rgba(232, 130, 156, 0.15)" : isSepia ? "rgba(232, 130, 156, 0.12)" : "#FDF0F4",
    "--mum-pink-border": isDark ? "rgba(232, 130, 156, 0.35)" : isSepia ? "rgba(232, 130, 156, 0.25)" : "#F6C1CE",
    "--mum-pink-accent": isDark ? "#F49BB2" : "#D85E7E",

    // 4. Charcoal Black & Structural Tokens
    "--mum-charcoal": "#1E242B",
    "--mum-text": isDark ? "#F4F4F5" : isSepia ? "#433422" : "#0F172A",
    "--mum-text-muted": isDark ? "#A1A1AA" : isSepia ? "#6C5B48" : "#475569",
    "--mum-text-subtle": isDark ? "#71717A" : isSepia ? "#8C7B69" : "#64748B",
    "--mum-border": isDark ? "rgba(255, 255, 255, 0.08)" : isSepia ? "rgba(67, 52, 34, 0.1)" : "rgba(0, 0, 0, 0.08)",
  } as React.CSSProperties;

  const themeClasses = {
    // Main Container
    containerBg: isDark 
      ? "bg-zinc-950 text-zinc-100" 
      : isSepia 
      ? "bg-[#F4EFE6] text-[#433422]" 
      : "bg-white text-slate-900",
    
    selectionBg: isDark
      ? "selection:bg-[#6CA4C8] selection:text-zinc-950"
      : isSepia
      ? "selection:bg-[#437596] selection:text-white"
      : "selection:bg-[#437596] selection:text-white",

    // Header
    headerBg: isDark
      ? "bg-zinc-950/90 border-[#6CA4C8]/20"
      : isSepia
      ? "bg-[#F4EFE6]/90 border-[#437596]/20"
      : "bg-white/90 border-[#C8DCE8]",

    headerBtnLogoBg: isDark
      ? "bg-zinc-900 border border-[#6CA4C8]/40 text-[#6CA4C8] hover:text-[#F49BB2] hover:border-[#F49BB2] hover:bg-[#E8829C]/10"
      : isSepia
      ? "bg-[#FAF4E5] border border-[#437596]/30 text-[#2B5573] hover:text-[#D85E7E] hover:border-[#E8829C] hover:bg-[#FDF0F4]"
      : "bg-[#EBF3F8] border border-[#C8DCE8] text-[#437596] hover:bg-[#FDF0F4] hover:text-[#E8829C] hover:border-[#F6C1CE]",

    headerText: isDark
      ? "text-zinc-100"
      : isSepia
      ? "text-[#433422]"
      : "text-slate-900",

    headerSubText: isDark
      ? "text-zinc-400"
      : isSepia
      ? "text-[#8C7B69]"
      : "text-slate-500",

    headerNavLink: isDark
      ? "text-zinc-400 hover:text-[#F49BB2]"
      : isSepia
      ? "text-[#6C5B48] hover:text-[#D85E7E]"
      : "text-slate-600 hover:text-[#E8829C]",

    headerBadge: isDark
      ? "bg-[#6CA4C8]/20 border border-[#6CA4C8]/40 text-[#6CA4C8]"
      : isSepia
      ? "bg-[#437596]/15 border border-[#437596]/30 text-[#2B5573]"
      : "bg-[#EBF3F8] border border-[#C8DCE8] text-[#437596]",

    // Body text & head
    bodyText: isDark
      ? "text-zinc-300"
      : isSepia
      ? "text-[#6C5B48]"
      : "text-slate-700",

    bodyTitle: isDark
      ? "text-white"
      : isSepia
      ? "text-[#433422]"
      : "text-slate-900",

    bodySubText: isDark
      ? "text-zinc-400"
      : isSepia
      ? "text-[#8C7B69]"
      : "text-slate-500",

    borderCol: isDark
      ? "border-zinc-900"
      : isSepia
      ? "border-amber-950/10"
      : "border-slate-200",

    borderColSubtle: isDark
      ? "border-zinc-900/60"
      : isSepia
      ? "border-amber-950/5"
      : "border-slate-100",

    // Blue Structural Border Theme
    borderBlueAccent: isDark
      ? "border-[#6CA4C8]/30"
      : isSepia
      ? "border-[#437596]/30"
      : "border-[#C8DCE8]",

    // Card Styles
    cardBg: isDark
      ? "bg-zinc-900/50 border border-[#6CA4C8]/25 hover:border-[#F49BB2]/50"
      : isSepia
      ? "bg-[#FAF4E5] border border-[#437596]/20 hover:border-[#E8829C]/60"
      : "bg-white border border-[#C8DCE8] shadow-xs hover:border-[#E8829C]/60",

    cardSubtleBg: isDark
      ? "bg-zinc-900/30 border border-[#6CA4C8]/20"
      : isSepia
      ? "bg-[#EDE2CA] border border-[#437596]/15"
      : "bg-[#F8FAFC] border border-[#C8DCE8]/80",

    // Interactive button standard (Pink on hover)
    btnCloseBg: isDark
      ? "bg-zinc-900 border-[#6CA4C8]/30 text-zinc-100 hover:bg-[#E8829C] hover:border-[#E8829C] hover:text-zinc-950"
      : isSepia
      ? "bg-[#FAF4E5] border-[#437596]/30 text-[#433422] hover:bg-[#E8829C] hover:border-[#E8829C] hover:text-white"
      : "bg-white border-[#C8DCE8] text-[#437596] hover:bg-[#E8829C] hover:border-[#E8829C] hover:text-white",

    btnMeowBg: isDark
      ? "border-[#6CA4C8]/40 bg-[#6CA4C8]/15 text-[#6CA4C8] hover:bg-[#E8829C] hover:border-[#E8829C] hover:text-zinc-950"
      : isSepia
      ? "border-[#437596]/40 bg-[#437596]/15 text-[#2B5573] hover:bg-[#E8829C] hover:border-[#E8829C] hover:text-white"
      : "border-[#C8DCE8] bg-[#EBF3F8] text-[#437596] hover:bg-[#E8829C] hover:border-[#E8829C] hover:text-white",

    // Modal Details Box
    modalBg: isDark
      ? "bg-zinc-950 border-[#6CA4C8]/40 text-zinc-100"
      : isSepia
      ? "bg-[#FAF4E5] border-[#437596]/30 text-[#433422]"
      : "bg-white border-[#C8DCE8] text-slate-900",

    modalDivider: isDark
      ? "border-zinc-900"
      : isSepia
      ? "border-amber-950/10"
      : "border-slate-100",

    specBadge: isDark
      ? "bg-[#417293]/20 text-[#6CA4C8] border-[#417293]/40"
      : isSepia
      ? "bg-[#EDE2CA] text-[#2B5573] border-amber-950/5"
      : "bg-[#EBF3F8] text-[#437596] border-[#C8DCE8]"
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        ref={modalContainerRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={brandCssVars}
        className={`fixed inset-0 z-[100000] overflow-y-auto font-sans antialiased mumao-custom-scrollbar scroll-pt-32 overscroll-contain ${
          isDark ? "dark" : isSepia ? "sepia-theme" : "light-theme"
        } ${themeClasses.containerBg} ${themeClasses.selectionBg}`}
      >
        {/* ===== 1. Sticky Editorial Header (Portfolio Navigation) ===== */}
        <header className={`sticky top-0 z-50 backdrop-blur-md border-b transition-all ${themeClasses.headerBg}`}>
          <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
            
            {/* Left: Portfolio Project Title */}
            <button
              type="button"
              onClick={() => scrollToSection("hero-section")}
              className="flex items-center gap-3 cursor-pointer text-left group shrink-0"
            >
              <div className={`w-10 h-10 aspect-square rounded-full shrink-0 flex items-center justify-center shadow-xs transition-all group-hover:scale-105 active:scale-95 select-none relative overflow-hidden ${themeClasses.headerBtnLogoBg}`}>
                <img 
                  src={
                    isPurring
                      ? resolveImageUrl("https://drive.google.com/thumbnail?sz=w1000&id=1eqi9X536nUrXqj-gv6kqjNMfpiC1YumX")
                      : resolveImageUrl("https://drive.google.com/thumbnail?sz=w1000&id=18ega279ty4XVeShySlEkSzJXUz2pOcep")
                  } 
                  alt="MUMㄠ Logo" 
                  className="w-[85%] h-[85%] object-contain rounded-full"
                  referrerPolicy="no-referrer"
                  decoding="async"
                />
              </div>
              <div className="flex flex-col shrink-0">
                <span className={`text-sm font-black tracking-tight font-mono leading-none flex items-baseline gap-0.5 ${themeClasses.headerText}`}>
                  <span className="font-bold tracking-tighter">MUM</span>
                  <span className="text-[0.85em] font-black">ㄠ</span>
                </span>
                <span className={`text-[9px] font-mono font-semibold tracking-widest uppercase mt-0.5 ${themeClasses.headerSubText}`}>
                  IP BRAND SYSTEM
                </span>
              </div>
            </button>

            {/* Center: Case Study Navigation with animated pill indicator and vertical stacked layout */}
            <nav className="hidden lg:flex items-center gap-1 font-mono relative">
              {navItems.map((item) => {
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setActiveSection(item.id);
                      scrollToSection(item.id);
                    }}
                    className={`relative px-2 py-1 rounded-lg transition-colors cursor-pointer select-none flex flex-col items-center justify-center text-center ${
                      isActive
                        ? "text-[#437596] dark:text-[#6CA4C8] font-bold"
                        : `${themeClasses.bodySubText} hover:text-[#437596] dark:hover:text-[#6CA4C8]`
                    }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="activeNavPill"
                        className="absolute inset-0 rounded-lg bg-[#437596]/15 dark:bg-[#6CA4C8]/20 border border-[#437596]/30 dark:border-[#6CA4C8]/40"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10 flex flex-col items-center justify-center leading-tight whitespace-nowrap">
                      <span className="text-[10px] xl:text-[11px] font-bold font-mono tracking-wider flex items-center gap-1">
                        {isActive && (
                          <span className="w-1.5 h-1.5 rounded-full bg-[#E8829C] inline-block animate-pulse" />
                        )}
                        {item.en}
                      </span>
                      <span className={`text-[9px] font-sans transition-opacity ${isActive ? "opacity-90 font-medium" : "opacity-65"}`}>
                        {item.zh}
                      </span>
                    </span>
                  </button>
                );
              })}
            </nav>

            {/* Right: Social & Close Actions */}
            <div className="flex items-center gap-2">
              <a
                href="https://instagram.com/mumao1"
                target="_blank"
                rel="noreferrer"
                className={`hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border text-xs font-mono font-medium transition-all ${
                  isDark ? "border-zinc-800 bg-zinc-900 text-zinc-300 hover:border-[#6CA4C8] hover:text-[#6CA4C8]" : isSepia ? "border-amber-950/15 bg-[#FAF4E5] text-[#4A3B2C] hover:border-[#437596]" : "border-slate-200 bg-white text-slate-700 hover:border-[#437596] hover:text-[#437596]"
                }`}
              >
                <Instagram className="w-3.5 h-3.5 text-[#E8829C]" />
                <span>IG @mumao1</span>
              </a>

              {/* Share Button (Only Icon) */}
              <button
                type="button"
                onClick={handleTopShare}
                title={copiedTopShare ? "" : "Share Link"}
                className={`relative flex items-center justify-center w-[34px] h-[34px] rounded-full border transition-all cursor-pointer ${
                  isDark 
                    ? "border-zinc-800 bg-zinc-900 text-zinc-300 hover:border-[#6CA4C8] hover:text-[#6CA4C8]" 
                    : isSepia 
                    ? "border-amber-950/15 bg-[#FAF4E5] text-[#4A3B2C] hover:border-[#437596]" 
                    : "border-slate-200 bg-white text-slate-700 hover:border-[#437596] hover:text-[#437596]"
                }`}
              >
                {copiedTopShare ? (
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                ) : (
                  <Share2 className="w-3.5 h-3.5" />
                )}
                {/* Micro tooltip when copied */}
                <AnimatePresence>
                  {copiedTopShare && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.9, x: "-50%" }}
                      animate={{ opacity: 1, y: 4, scale: 1, x: "-50%" }}
                      exit={{ opacity: 0, y: 10, scale: 0.9, x: "-50%" }}
                      className="absolute top-full mt-2 left-1/2 !bg-zinc-950 !text-white text-[11px] font-mono font-bold px-2.5 py-1 rounded-md shadow-2xl whitespace-nowrap z-[100] border border-white/20 pointer-events-none select-none tracking-wider"
                      style={{ color: '#ffffff', backgroundColor: '#09090b' }}
                    >
                      Copied!
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>

              <button
                type="button"
                onClick={onClose}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-mono text-xs font-bold transition-all cursor-pointer ${
                  isDark 
                    ? "bg-zinc-800 text-zinc-200 hover:bg-red-500/20 hover:text-red-400 border border-zinc-700/50" 
                    : isSepia
                    ? "bg-[#FAF4E5] text-[#433422] hover:bg-red-500/10 hover:text-red-600 border border-[#433422]/20"
                    : "bg-slate-100 text-slate-800 hover:bg-red-50 hover:text-red-600 border border-slate-200"
                }`}
              >
                <X className="w-3.5 h-3.5" />
                <span>CLOSE</span>
              </button>
            </div>
          </div>

          {/* Reading Progress Indicator */}
          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-slate-200/40 dark:bg-zinc-800/40 overflow-hidden pointer-events-none">
            <div 
              className="h-full bg-[#437596] dark:bg-[#6CA4C8] transition-all duration-75 ease-out"
              style={{ width: `${scrollProgress}%` }}
            />
          </div>
        </header>

        {/* Mobile / Tablet Horizontal ScrollSpy Navigation Strip */}
        <div className={`lg:hidden sticky top-16 z-40 backdrop-blur-md border-b transition-colors relative overflow-hidden ${
          isDark 
            ? "border-zinc-900 bg-zinc-950/90" 
            : isSepia 
            ? "border-amber-950/10 bg-[#FAF4E5]/90" 
            : "border-slate-200/90 bg-white/90"
        }`}>
          {/* Mobile Left Fade Gradient Mask */}
          <div
            className={`absolute left-0 top-0 bottom-0 w-10 z-10 pointer-events-none transition-opacity duration-300 ${
              mobileNavScrollState.canScrollLeft ? "opacity-100" : "opacity-0"
            } ${
              isDark
                ? "bg-gradient-to-r from-zinc-950 via-zinc-950/90 to-transparent"
                : isSepia
                ? "bg-gradient-to-r from-[#FAF4E5] via-[#FAF4E5]/90 to-transparent"
                : "bg-gradient-to-r from-white via-white/90 to-transparent"
            }`}
          />

          {/* Mobile Right Fade Gradient Mask */}
          <div
            className={`absolute right-0 top-0 bottom-0 w-10 z-10 pointer-events-none transition-opacity duration-300 ${
              mobileNavScrollState.canScrollRight ? "opacity-100" : "opacity-0"
            } ${
              isDark
                ? "bg-gradient-to-l from-zinc-950 via-zinc-950/90 to-transparent"
                : isSepia
                ? "bg-gradient-to-l from-[#FAF4E5] via-[#FAF4E5]/90 to-transparent"
                : "bg-gradient-to-l from-white via-white/90 to-transparent"
            }`}
          />

          <div
            ref={mobileNavContainerRef}
            onScroll={handleMobileNavScroll}
            onPointerDown={handleNavPointerDown}
            onPointerMove={handleNavPointerMove}
            onPointerUp={handleNavPointerUp}
            onPointerCancel={handleNavPointerUp}
            onTouchStart={handleNavTouchStart}
            onTouchMove={handleNavTouchMove}
            onTouchEnd={handleNavTouchEnd}
            className={`px-4 py-2 flex items-center gap-2 overflow-x-auto no-scrollbar scrollbar-none select-none touch-pan-x ${
              isNavPointerDown ? "cursor-grabbing" : "cursor-grab"
            }`}
            style={{
              WebkitOverflowScrolling: "touch",
              scrollBehavior: isNavPointerDown ? "auto" : "smooth",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  draggable={false}
                  id={`mobile-nav-${item.id}`}
                  type="button"
                  onClick={() => {
                    if (hasDraggedNav.current) return;
                    setActiveSection(item.id);
                    scrollToSection(item.id);
                  }}
                  className={`px-3 py-1.5 rounded-lg transition-all shrink-0 cursor-pointer flex flex-col items-center justify-center text-center select-none active:scale-95 ${
                    isActive
                      ? "bg-[#437596] text-white font-bold shadow-md scale-105 ring-2 ring-[#437596]/30"
                      : isDark
                      ? "text-zinc-400 hover:text-zinc-200 bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-800/50"
                      : isSepia
                      ? "text-[#4A3B2C]/75 hover:text-[#4A3B2C] bg-[#EDE2CA]/50 hover:bg-[#EDE2CA] border border-amber-950/10"
                      : "text-slate-600 hover:text-slate-900 bg-slate-100/80 hover:bg-slate-200/80 border border-slate-200/60"
                  }`}
                >
                  <span className="flex items-center gap-1 text-[10px] font-mono font-bold leading-tight whitespace-nowrap">
                    {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#E8829C] inline-block animate-pulse" />}
                    <span>{item.en}</span>
                  </span>
                  <span className={`text-[9px] font-sans leading-none mt-0.5 whitespace-nowrap ${isActive ? "opacity-90 font-medium" : "opacity-75"}`}>
                    {item.zh}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ===== MAIN CONTENT AREA ===== */}
        <main className="max-w-6xl mx-auto px-6 py-10 space-y-16">

          {/* ===== 2. CASE STUDY HERO (01 CONTEXT & 02 CHARACTER) ===== */}
          <section id="hero-section" className="space-y-10 text-left">
            {/* 01 / PROJECT CONTEXT Meta & Header */}
            <div className="space-y-4">
              <div className={`flex flex-wrap items-center justify-between gap-4 border-b pb-4 ${themeClasses.borderCol}`}>
                <div className="flex flex-wrap items-center gap-2 font-mono text-[11px]">
                  <span className={`px-2.5 py-1 rounded-sm font-medium uppercase border flex items-center gap-1.5 ${
                    isDark 
                      ? "bg-[#417293]/20 text-[#6CA4C8] border-[#417293]/40" 
                      : isSepia 
                      ? "bg-[#417293]/10 text-[#2B5573] border-[#417293]/30" 
                      : "bg-[#EBF3F8] text-[#2B5573] border-[#C8DCE8]"
                  }`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#E8829C] inline-block animate-pulse"></span>
                    01 / PROJECT CONTEXT ／ 專案背景
                  </span>
                  <span className={`px-2.5 py-1 rounded-sm border font-medium uppercase ${
                    isDark ? "border-zinc-800 text-zinc-400" : isSepia ? "border-amber-950/15 text-[#6C5B48]" : "border-slate-200 text-slate-600"
                  }`}>
                    ORIGINAL IP CASE STUDY ／ 原創 IP 案例研究
                  </span>
                </div>

                <div className={`flex items-center gap-3 text-xs font-mono tracking-wide ${themeClasses.bodySubText}`}>
                  <span>2024 — 2026</span>
                  <span>•</span>
                  <span className="font-semibold">LEAD IP DESIGNER ／ 首席 IP 設計師</span>
                </div>
              </div>

              {/* 01 / PROJECT CONTEXT Narrative Content (Creative Proposition) */}
              <div className="max-w-3xl space-y-2 pt-1">
                <span className={`font-mono text-xs font-bold tracking-widest uppercase block ${isDark ? "text-[#6CA4C8]" : "text-[#437596]"}`}>
                  FROM TAIWANESE LANGUAGE TO MUSIC CULTURE. ／ 從台灣語言到音樂文化
                </span>
                <h2 className={`text-2xl sm:text-3xl font-mono font-bold tracking-tight ${themeClasses.bodyTitle}`}>
                  Creating an original character rooted in Taiwan's independent music scene.
                </h2>
                <p className={`text-base sm:text-lg leading-relaxed font-medium pt-1 ${isDark ? "text-zinc-300" : isSepia ? "text-[#5C4B38]" : "text-slate-700"}`}>
                  從台灣語言出發，將獨立音樂文化轉化為一個可延伸的角色 IP。
                </p>
              </div>
            </div>

            {/* 02 / CHARACTER INTRODUCTION (Left: Info & Identity | Right: Hero Visual Showcase Artwork) */}
            <div className={`pt-6 border-t ${themeClasses.borderColSubtle}`}>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                {/* Left Column: Brand Name, Identity, Positioning & Role in Culture */}
                <div className="lg:col-span-5 space-y-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 font-mono text-[11px]">
                      <span className={`px-2 py-0.5 rounded-sm font-semibold uppercase border ${
                        isDark ? "bg-zinc-900 border-zinc-800 text-zinc-400" : isSepia ? "bg-[#EDE2CA] border-amber-950/10 text-[#6C5B48]" : "bg-slate-100 border-slate-200 text-slate-600"
                      }`}>
                        02 / CHARACTER INTRODUCTION ／ 角色介紹
                      </span>
                    </div>

                    <InteractiveHeroWhiskers
                      isDark={isDark}
                      isSepia={isSepia}
                      isPurring={isPurring}
                      onWhiskersTickle={() => {
                        try {
                          playMeowSound();
                        } catch {
                          // ignore
                        }
                      }}
                    >
                      <h1 className={`text-6xl sm:text-7xl xl:text-8xl font-black tracking-tight leading-none flex items-baseline gap-1 select-none ${themeClasses.bodyTitle}`}>
                        <span className="font-bold tracking-tighter">MUM</span>
                        <span className="text-[0.82em] font-black">ㄠ</span>
                      </h1>
                    </InteractiveHeroWhiskers>

                    <div className={`text-lg sm:text-xl font-mono font-bold tracking-wide flex items-center gap-2.5 pt-1 ${isDark ? "text-[#6CA4C8]" : "text-[#437596]"}`}>
                      <span className="tracking-wider">THE CAT RELIGION</span>
                      <span className="opacity-50">/</span>
                      <span>姆貓教</span>
                    </div>
                  </div>

                  <div className="space-y-3.5">
                    {/* Positioning Card */}
                    <div className={`p-4 rounded-xl border ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle} space-y-1.5`}>
                      <span className={`text-[10px] font-mono font-bold uppercase tracking-widest block ${isDark ? "text-[#6CA4C8]" : "text-[#437596]"}`}>
                        CHARACTER POSITIONING / 角色定位
                      </span>
                      <p className={`text-base sm:text-lg leading-relaxed font-bold ${themeClasses.bodyTitle}`}>
                        「一隻長在台灣獨立音樂文化裡的白貓。」
                      </p>
                      <p className={`text-xs sm:text-sm leading-relaxed ${themeClasses.bodySubText}`}>
                        喜歡聽團、喜歡跑音樂祭，偶爾也會厭世。
                      </p>
                    </div>

                    {/* Role in Culture Mini Block */}
                    <div className={`p-3.5 rounded-xl border ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle} space-y-1`}>
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#E8829C] inline-block"></span>
                        <span className={`text-[10px] font-mono font-bold uppercase tracking-widest ${isDark ? "text-[#F49BB2]" : "text-[#D85E7E]"}`}>
                          ROLE IN CULTURE ／ 文化角色
                        </span>
                      </div>
                      <p className={`text-xs sm:text-sm font-mono font-bold ${themeClasses.bodyTitle}`}>
                        A visual avatar for Taiwan's indie music culture.
                      </p>
                      <p className={`text-xs ${themeClasses.bodySubText}`}>
                        作為台灣獨立音樂文化的角色化身。
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right Column: Hero Visual Showcase Artwork */}
                <div className="lg:col-span-7 space-y-3">
                  <div className={`relative h-[300px] sm:h-[380px] md:h-[420px] lg:h-[460px] w-full rounded-2xl overflow-hidden shadow-xs group border-2 ${
                    isDark ? "border-[#6CA4C8]/30 bg-zinc-900/30" : isSepia ? "border-[#437596]/30 bg-[#FAF4E5]" : "border-[#C8DCE8] bg-white"
                  } flex items-center justify-center`}>
                    {/* Main Showcase Artwork with Horizontal Sliding Animation */}
                    <div className="absolute inset-0 overflow-hidden flex items-center justify-center">
                      <AnimatePresence initial={false} custom={direction} mode="popLayout">
                        <motion.div
                          key={activeHeroImage}
                          custom={direction}
                          variants={{
                            enter: (dir: number) => ({
                              x: dir > 0 ? "100%" : "-100%",
                              opacity: 0,
                              scale: 0.96
                            }),
                            center: {
                              x: 0,
                              opacity: 1,
                              scale: 1
                            },
                            exit: (dir: number) => ({
                              x: dir > 0 ? "-100%" : "100%",
                              opacity: 0,
                              scale: 0.96
                            })
                          }}
                          initial="enter"
                          animate="center"
                          exit="exit"
                          transition={{
                            x: { type: "spring", stiffness: 260, damping: 28 },
                            opacity: { duration: 0.25 },
                            scale: { duration: 0.25 }
                          }}
                          drag="x"
                          dragConstraints={{ left: 0, right: 0 }}
                          dragElastic={0.6}
                          onDragEnd={(_, info) => {
                            const swipeThreshold = 50;
                            if (info.offset.x < -swipeThreshold) {
                              // Swipe left (next image)
                              setActiveHeroImage((prev) => (prev + 1) % 3);
                            } else if (info.offset.x > swipeThreshold) {
                              // Swipe right (previous image)
                              setActiveHeroImage((prev) => (prev - 1 + 3) % 3);
                            }
                          }}
                          className="absolute inset-0 flex items-center justify-center p-4 sm:p-6 select-none cursor-grab active:cursor-grabbing touch-pan-y"
                        >
                          <img
                            src={heroVisuals[activeHeroImage].url}
                            alt={heroVisuals[activeHeroImage].title}
                            className="max-h-full max-w-full w-auto h-auto object-contain transition-transform duration-500 group-hover:scale-102 pointer-events-none select-none"
                            decoding="async"
                            referrerPolicy="no-referrer"
                            draggable="false"
                          />
                        </motion.div>
                      </AnimatePresence>
                    </div>
                    
                    {/* Micro Tag (top-left) */}
                    <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5">
                      <span className={`px-2.5 py-1 rounded-sm font-mono text-[10px] font-bold backdrop-blur-md flex items-center gap-1.5 ${
                        isDark ? "bg-zinc-900/90 text-zinc-200 border border-zinc-700/50" : "bg-slate-900/90 text-white"
                      }`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-[#E8829C] inline-block"></span>
                        KEY VISUAL 0{activeHeroImage + 1}
                      </span>
                      <span className={`px-2.5 py-1 rounded-sm font-mono text-[10px] font-medium backdrop-blur-md ${
                        isDark ? "bg-zinc-900/80 text-zinc-300 border border-zinc-700/40" : "bg-slate-800/80 text-white"
                      }`}>
                        STANDARD CHARACTER ／ 標準角色
                      </span>
                    </div>
                  </div>

                  {/* Switcher & Caption below image */}
                  <div className={`flex flex-wrap items-center justify-between gap-2 text-xs font-mono px-1 ${themeClasses.bodySubText}`}>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] sm:text-xs font-bold text-[#437596] dark:text-[#6CA4C8]">KEY VISUAL 0{activeHeroImage + 1} ／ 主視覺 0{activeHeroImage + 1}</span>
                      <span>•</span>
                      <span className="text-[11px] sm:text-xs">MUMㄠ — Standard Character Identity</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {heroVisuals.map((vis, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setActiveHeroImage(idx)}
                          className={`px-3 py-1 rounded-full text-[11px] font-mono transition-all cursor-pointer border ${
                            activeHeroImage === idx 
                              ? "bg-[#437596] border-[#437596] text-white font-bold shadow-xs" 
                              : (isDark ? "bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-[#E8829C] hover:border-[#E8829C] hover:text-zinc-950" : isSepia ? "bg-[#DECDB2]/50 border-amber-950/10 text-[#6C5B48] hover:bg-[#E8829C] hover:border-[#E8829C] hover:text-white" : "bg-white border-[#C8DCE8] text-[#437596] hover:bg-[#E8829C] hover:border-[#E8829C] hover:text-white")
                          }`}
                        >
                          VISUAL 0{idx + 1}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ===== 03 / WHY MUMㄠ? (CORE DESIGN DECISIONS: PROBLEM → DECISION → RESULT) ===== */}
          <section id="dna-section" className="space-y-8 pt-4 text-left">
            <SoundwaveDivider isDark={isDark} color={isDark ? "#6CA4C8" : "#437596"} className="mb-6" />
            
            <div className={`flex flex-col sm:flex-row sm:items-end justify-between border-b pb-4 gap-4 ${themeClasses.borderCol}`}>
              <div className="space-y-1">
                <span className={`text-xs font-mono font-bold uppercase tracking-widest block ${isDark ? "text-[#6CA4C8]" : "text-[#437596]"}`}>
                  03 / DESIGN DECISIONS ／ 核心設計決策
                </span>
                <h2 className={`text-2xl sm:text-3xl lg:text-4xl font-black font-mono tracking-tight ${themeClasses.bodyTitle}`}>
                  WHY MUMㄠ?
                </h2>
                <p className={`text-xs font-mono tracking-wide ${isDark ? "text-[#6CA4C8]" : "text-[#437596]"}`}>
                  設計問題 → 設計選擇 → 設計理由
                </p>
              </div>
              <div className="sm:max-w-md space-y-1.5">
                <p className={`text-xs font-mono ${themeClasses.bodySubText}`}>
                  Three visual cues define the character ／ 三大視覺線索定義角色：
                </p>
                <div className="flex flex-wrap items-center gap-2 font-mono text-[11px] font-bold">
                  <span className={`px-2.5 py-1 rounded-sm border ${isDark ? "bg-[#417293]/20 border-[#417293]/40 text-[#6CA4C8]" : "bg-[#EBF3F8] border-[#C8DCE8] text-[#437596]"}`}>
                    ㄠ = Taiwan (台灣)
                  </span>
                  <span className={`px-2.5 py-1 rounded-sm border ${isDark ? "bg-[#417293]/20 border-[#417293]/40 text-[#6CA4C8]" : "bg-[#EBF3F8] border-[#C8DCE8] text-[#437596]"}`}>
                    Wave Whiskers = Music (音樂)
                  </span>
                  <span className={`px-2.5 py-1 rounded-sm border ${isDark ? "bg-[#E8829C]/15 border-[#E8829C]/40 text-[#F49BB2]" : "bg-[#E8829C]/10 border-[#E8829C]/30 text-[#D85E7E]"}`}>
                    Pink Ears = Emotion (情緒)
                  </span>
                </div>
              </div>
            </div>

            {/* Three Core Design Decision Columns: PROBLEM → DECISION → RESULT */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10 pt-2">
              {/* 01 / TAIWANESE IDENTITY */}
              <div className={`space-y-6 pb-6 border-b md:border-b-0 md:border-r pr-0 md:pr-6 lg:pr-8 flex flex-col justify-between ${themeClasses.borderColSubtle}`}>
                <div className="space-y-4">
                  {/* Top: Metric / Concept Formula Badge */}
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-black font-mono text-[#437596] dark:text-[#6CA4C8]">01</span>
                    <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded-sm border ${
                      isDark ? "bg-[#417293]/20 border-[#417293]/40 text-[#6CA4C8]" : "bg-[#EBF3F8] border-[#C8DCE8] text-[#437596]"
                    }`}>
                      ㄠ = Taiwan
                    </span>
                  </div>

                  <div>
                    <span className={`text-[10px] font-mono uppercase tracking-wider block ${themeClasses.bodySubText}`}>
                      01 / TAIWANESE IDENTITY ／ 台灣在地身份
                    </span>
                    <h3 className={`text-2xl font-black font-sans mt-1 ${themeClasses.bodyTitle}`}>
                      「ㄠ」
                    </h3>
                  </div>

                  {/* 3-Layer Structured Logic */}
                  <div className="space-y-3 pt-2">
                    <div className={`p-3 rounded-lg border text-left ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                      <span className={`text-[10px] font-mono font-bold uppercase tracking-wider block text-[#437596] dark:text-[#6CA4C8]`}>
                        THE PROBLEM ／ 設計問題
                      </span>
                      <p className={`text-xs sm:text-sm font-medium mt-0.5 ${themeClasses.bodyTitle}`}>
                        如何讓角色一眼具有台灣身份？
                      </p>
                    </div>

                    <div className={`p-3 rounded-lg border text-left ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                      <span className={`text-[10px] font-mono font-bold uppercase tracking-wider block text-[#437596] dark:text-[#6CA4C8]`}>
                        THE DECISION ／ 設計決策
                      </span>
                      <p className={`text-xs sm:text-sm font-medium mt-0.5 ${themeClasses.bodyTitle}`}>
                        將「ㄠ」融入角色命名。
                      </p>
                    </div>

                    <div className={`p-3 rounded-lg border text-left ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                      <span className={`text-[10px] font-mono font-bold uppercase tracking-wider block text-[#437596] dark:text-[#6CA4C8]`}>
                        THE RESULT ／ 最終成果
                      </span>
                      <p className={`text-xs sm:text-sm font-medium mt-0.5 ${themeClasses.bodyTitle}`}>
                        讓台灣語言成為角色識別的一部分。
                      </p>
                    </div>
                  </div>
                </div>

                <div className={`pt-3 border-t ${themeClasses.borderColSubtle} flex items-center gap-2 font-mono text-[11px] ${themeClasses.bodySubText}`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#437596] dark:bg-[#6CA4C8] inline-block"></span>
                  <span>LOCAL CULTURAL ASSET ／ 在地文化資產</span>
                </div>
              </div>

              {/* 02 / MUSIC IDENTITY */}
              <div className={`space-y-6 pb-6 border-b md:border-b-0 md:border-r pr-0 md:pr-6 lg:pr-8 flex flex-col justify-between ${themeClasses.borderColSubtle}`}>
                <div className="space-y-4">
                  {/* Top: Metric / Concept Formula Badge */}
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-black font-mono text-[#437596] dark:text-[#6CA4C8]">02</span>
                    <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded-sm border ${
                      isDark ? "bg-[#417293]/20 border-[#417293]/40 text-[#6CA4C8]" : "bg-[#EBF3F8] border-[#C8DCE8] text-[#437596]"
                    }`}>
                      Wave Whiskers = Music
                    </span>
                  </div>

                  <div>
                    <span className={`text-[10px] font-mono uppercase tracking-wider block ${themeClasses.bodySubText}`}>
                      02 / MUSIC IDENTITY ／ 音樂文化識別
                    </span>
                    <h3 className={`text-2xl font-black font-sans mt-1 ${themeClasses.bodyTitle}`}>
                      音波鬍鬚
                    </h3>
                  </div>

                  {/* 3-Layer Structured Logic */}
                  <div className="space-y-3 pt-2">
                    <div className={`p-3 rounded-lg border text-left ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                      <span className={`text-[10px] font-mono font-bold uppercase tracking-wider block text-[#437596] dark:text-[#6CA4C8]`}>
                        THE PROBLEM ／ 設計問題
                      </span>
                      <p className={`text-xs sm:text-sm font-medium mt-0.5 ${themeClasses.bodyTitle}`}>
                        如何表現音樂，而不落入音符、耳機等常見符號？
                      </p>
                    </div>

                    <div className={`p-3 rounded-lg border text-left ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                      <span className={`text-[10px] font-mono font-bold uppercase tracking-wider block text-[#437596] dark:text-[#6CA4C8]`}>
                        THE DECISION ／ 設計決策
                      </span>
                      <p className={`text-xs sm:text-sm font-medium mt-0.5 ${themeClasses.bodyTitle}`}>
                        將音波融入貓咪鬍鬚。
                      </p>
                    </div>

                    <div className={`p-3 rounded-lg border text-left ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                      <span className={`text-[10px] font-mono font-bold uppercase tracking-wider block text-[#437596] dark:text-[#6CA4C8]`}>
                        THE RESULT ／ 最終成果
                      </span>
                      <p className={`text-xs sm:text-sm font-medium mt-0.5 ${themeClasses.bodyTitle}`}>
                        讓「音樂」成為角色身體的一部分。
                      </p>
                    </div>
                  </div>
                </div>

                <div className={`pt-3 border-t ${themeClasses.borderColSubtle} flex items-center gap-2 font-mono text-[11px] ${themeClasses.bodySubText}`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#437596] dark:bg-[#6CA4C8] inline-block"></span>
                  <span>ACOUSTIC BODY EMBEDDING ／ 音樂身體化</span>
                </div>
              </div>

              {/* 03 / CHARACTER EMOTION */}
              <div className="space-y-6 pb-6 flex flex-col justify-between">
                <div className="space-y-4">
                  {/* Top: Metric / Concept Formula Badge */}
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-black font-mono text-[#E8829C] dark:text-[#F49BB2]">03</span>
                    <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded-sm border ${
                      isDark ? "bg-[#E8829C]/20 border-[#E8829C]/40 text-[#F49BB2]" : "bg-[#E8829C]/10 border-[#E8829C]/30 text-[#D85E7E]"
                    }`}>
                      Pink Ears = Emotion
                    </span>
                  </div>

                  <div>
                    <span className={`text-[10px] font-mono uppercase tracking-wider block ${themeClasses.bodySubText}`}>
                      03 / CHARACTER EMOTION ／ 角色情緒溫度
                    </span>
                    <h3 className={`text-2xl font-black font-sans mt-1 ${themeClasses.bodyTitle}`}>
                      粉紅耳朵
                    </h3>
                  </div>

                  {/* 3-Layer Structured Logic */}
                  <div className="space-y-3 pt-2">
                    <div className={`p-3 rounded-lg border text-left ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                      <span className={`text-[10px] font-mono font-bold uppercase tracking-wider block text-[#E8829C] dark:text-[#F49BB2]`}>
                        THE PROBLEM ／ 設計問題
                      </span>
                      <p className={`text-xs sm:text-sm font-medium mt-0.5 ${themeClasses.bodyTitle}`}>
                        如何讓角色在音樂文化之外，建立自己的情緒溫度？
                      </p>
                    </div>

                    <div className={`p-3 rounded-lg border text-left ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                      <span className={`text-[10px] font-mono font-bold uppercase tracking-wider block text-[#E8829C] dark:text-[#F49BB2]`}>
                        THE DECISION ／ 設計決策
                      </span>
                      <p className={`text-xs sm:text-sm font-medium mt-0.5 ${themeClasses.bodyTitle}`}>
                        以粉紅耳朵加入情緒溫度。
                      </p>
                    </div>

                    <div className={`p-3 rounded-lg border text-left ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                      <span className={`text-[10px] font-mono font-bold uppercase tracking-wider block text-[#E8829C] dark:text-[#F49BB2]`}>
                        THE RESULT ／ 最終成果
                      </span>
                      <p className={`text-xs sm:text-sm font-medium mt-0.5 ${themeClasses.bodyTitle}`}>
                        建立角色的親近感與個性。
                      </p>
                    </div>
                  </div>
                </div>

                <div className={`pt-3 border-t ${themeClasses.borderColSubtle} flex items-center gap-2 font-mono text-[11px] ${themeClasses.bodySubText}`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E8829C] dark:bg-[#F49BB2] inline-block"></span>
                  <span>WARMTH & EMPATHY ACCENT ／ 情感與同理心錨點</span>
                </div>
              </div>
            </div>
          </section>

          {/* ===== 04 / DESIGN STATEMENT (FROM CULTURE TO CHARACTER.) ===== */}
          <section id="statement-section" className="space-y-6 pt-2 text-left">
            <div className={`p-8 sm:p-10 rounded-2xl border ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-4 space-y-2">
                  <span className={`text-xs font-mono font-bold uppercase tracking-widest block ${isDark ? "text-[#6CA4C8]" : "text-[#437596]"}`}>
                    04 / DESIGN STATEMENT ／ 設計宣言
                  </span>
                  <h3 className={`text-xl sm:text-2xl font-bold font-mono ${themeClasses.bodyTitle}`}>
                    FROM CULTURE TO CHARACTER.
                  </h3>
                  <div className="pt-2">
                    <span className="font-serif italic text-xl sm:text-2xl font-bold tracking-wide text-[#437596] dark:text-[#6CA4C8]">
                      「全是感情，還有音樂。」
                    </span>
                  </div>
                </div>

                <div className="lg:col-span-8 space-y-5">
                  <p className={`text-base sm:text-lg leading-relaxed font-bold ${themeClasses.bodyTitle}`}>
                    MUMㄠ 不只是「一隻貓」。
                  </p>
                  <p className={`text-sm sm:text-base leading-relaxed ${themeClasses.bodyText}`}>
                    我希望它成為一個能夠承載台灣獨立音樂文化、音樂祭經驗與日常情緒的角色。
                  </p>
                  <p className={`text-sm sm:text-base leading-relaxed ${themeClasses.bodyText}`}>
                    這三個核心元素成為 MUMㄠ 的 Visual DNA。我將台灣語言、音樂視覺與角色個性轉化為三個核心識別元素，並進一步建立 Character System、Brand Language、Festival Visual 與 Merchandise Application。
                  </p>

                  {/* Clean Visual Flow Process */}
                  <div className={`pt-4 border-t ${themeClasses.borderColSubtle}`}>
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 font-mono text-[11px] font-bold">
                      <span className={`px-3 py-1.5 rounded-sm border ${
                        isDark ? "bg-zinc-900 border-zinc-700 text-zinc-200" : "bg-white border-slate-300 text-slate-800"
                      }`}>
                        CULTURAL INSIGHT / 文化洞察
                      </span>
                      <span className={`text-xs ${themeClasses.bodySubText}`}>→</span>
                      <span className={`px-3 py-1.5 rounded-sm border ${
                        isDark ? "bg-[#417293]/20 border-[#417293]/50 text-[#6CA4C8]" : "bg-[#EBF3F8] border-[#C8DCE8] text-[#437596]"
                      }`}>
                        CHARACTER / 角色本體
                      </span>
                      <span className={`text-xs ${themeClasses.bodySubText}`}>→</span>
                      <span className={`px-3 py-1.5 rounded-sm border ${
                        isDark ? "bg-[#E8829C]/20 border-[#E8829C]/50 text-[#F49BB2]" : "bg-[#E8829C]/10 border-[#E8829C]/30 text-[#D85E7E]"
                      }`}>
                        VISUAL DNA / 視覺 DNA
                      </span>
                      <span className={`text-xs ${themeClasses.bodySubText}`}>→</span>
                      <span className={`px-3 py-1.5 rounded-sm border font-black ${
                        isDark ? "bg-[#6CA4C8] text-zinc-950 border-[#6CA4C8]" : "bg-[#437596] text-white border-[#437596]"
                      }`}>
                        IP SYSTEM / IP 系統
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ===== 05 / PROJECT AT A GLANCE ===== */}
          <section id="snapshot-section" className="space-y-6 pt-2 text-left">
            <div className={`flex items-center justify-between border-b pb-3 ${themeClasses.borderCol}`}>
              <span className={`text-xs font-mono font-bold uppercase tracking-widest ${isDark ? "text-[#6CA4C8]" : "text-[#437596]"}`}>
                05 / PROJECT AT A GLANCE ／ 專案總覽
              </span>
              <span className={`text-[11px] font-mono ${themeClasses.bodySubText}`}>
                CASE STUDY OVERVIEW
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 pt-1">
              <div className="space-y-1">
                <span className={`text-[11px] font-mono uppercase tracking-wider block ${themeClasses.bodySubText}`}>
                  PROJECT / 專案
                </span>
                <p className={`text-sm font-bold font-mono ${themeClasses.bodyTitle}`}>
                  MUMㄠ — ORIGINAL IP
                </p>
              </div>

              <div className="space-y-1">
                <span className={`text-[11px] font-mono uppercase tracking-wider block ${themeClasses.bodySubText}`}>
                  ROLE / 職責
                </span>
                <p className={`text-sm font-bold font-mono ${themeClasses.bodyTitle}`}>
                  LEAD IP DESIGNER
                </p>
              </div>

              <div className="space-y-1">
                <span className={`text-[11px] font-mono uppercase tracking-wider block ${themeClasses.bodySubText}`}>
                  PERIOD / 時程
                </span>
                <p className={`text-sm font-bold font-mono ${themeClasses.bodyTitle}`}>
                  2024–2026
                </p>
              </div>

              <div className="space-y-1">
                <span className={`text-[11px] font-mono uppercase tracking-wider block ${themeClasses.bodySubText}`}>
                  CORE / 核心
                </span>
                <p className={`text-xs font-mono font-bold ${themeClasses.bodyTitle}`}>
                  CHARACTER / MUSIC CULTURE / IP SYSTEM
                </p>
              </div>

              <div className="col-span-2 md:col-span-4 lg:col-span-1 space-y-1">
                <span className={`text-[11px] font-mono uppercase tracking-wider block ${themeClasses.bodySubText}`}>
                  DELIVERABLES / 交付成果
                </span>
                <p className={`text-xs leading-snug font-mono ${themeClasses.bodyText}`}>
                  CHARACTER SYSTEM / BRAND LANGUAGE / FESTIVAL / VISUAL SYSTEM / MERCHANDISE
                </p>
              </div>
            </div>

            {/* Bottom Tagline */}
            <div className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
              <div className="space-y-0.5">
                <p className={`text-sm font-mono font-bold ${themeClasses.bodyTitle}`}>
                  From one character to a scalable IP system.
                </p>
                <p className={`text-xs ${themeClasses.bodySubText}`}>
                  從一個角色，建立一套可持續延伸的 IP 系統。
                </p>
              </div>
              <span className={`text-[10px] font-mono px-2.5 py-1 rounded-sm border uppercase self-start sm:self-auto ${
                isDark ? "bg-[#417293]/20 border-[#417293]/40 text-[#6CA4C8]" : "bg-[#EBF3F8] border-[#C8DCE8] text-[#437596]"
              }`}>
                SYSTEM EXPANSION ／ 系統擴展
              </span>
            </div>

            {/* Next Section Button with Narrative Bridge */}
            <div className={`pt-6 flex justify-end border-t ${themeClasses.borderColSubtle}`}>
              <button
                type="button"
                onClick={() => scrollToSection("character-section")}
                className={`inline-flex items-center gap-4 px-6 py-3.5 rounded-xl border text-xs font-mono font-bold transition-all ${themeClasses.cardBg} ${themeClasses.borderColSubtle} hover:border-[#437596] hover:text-[#437596] dark:hover:border-[#6CA4C8] dark:hover:text-[#6CA4C8] group cursor-pointer`}
              >
                <div className="text-left">
                  <span className={`text-[10px] block font-mono uppercase tracking-widest ${themeClasses.bodySubText}`}>
                    NEXT SECTION ／ 下一章節
                  </span>
                  <span className="text-sm font-bold tracking-tight block">
                    01 / CHARACTER SYSTEM ／ 角色系統
                  </span>
                  <span className="text-[11px] font-mono text-[#437596] dark:text-[#6CA4C8] block pt-0.5">
                    FROM CONCEPT TO CHARACTER SYSTEM →
                  </span>
                </div>
              </button>
            </div>
          </section>


          {/* ===== 6. 01 / CHARACTER DESIGN (MUMㄠ 角色系統) ===== */}
          <section id="character-section" className="pt-6 space-y-12 text-left">
            <SoundwaveDivider isDark={isDark} color={isDark ? "#6CA4C8" : "#437596"} className="mb-8" />
            
            {/* Header & Section Title Hierarchy */}
            <div className={`flex flex-col sm:flex-row sm:items-end justify-between border-b pb-4 gap-4 ${themeClasses.borderCol}`}>
              <div className="space-y-1">
                <span className={`text-xs font-mono font-bold uppercase tracking-widest block ${isDark ? "text-[#6CA4C8]" : "text-[#437596]"}`}>
                  01 / CHARACTER
                </span>
                <h2 className={`text-3xl sm:text-4xl font-black font-mono tracking-tight ${themeClasses.bodyTitle}`}>
                  CHARACTER SYSTEM / 角色識別系統
                </h2>
                <p className={`text-xs font-mono tracking-wide ${isDark ? "text-[#6CA4C8]" : "text-[#437596]"}`}>
                  FROM CHARACTER TO SYSTEM.
                </p>
              </div>
              <div className="sm:max-w-md space-y-2">
                <p className={`text-xs leading-relaxed ${themeClasses.bodyText}`}>
                  「從角色身份開始，建立一套可以持續延伸的 MUMㄠ 角色系統。」
                </p>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E8829C] inline-block animate-pulse"></span>
                  <span className={`text-[11px] font-mono font-bold uppercase tracking-wider ${isDark ? "text-[#F49BB2]" : "text-[#D85E7E]"}`}>
                    ONE MUMㄠ. MULTIPLE STATES.
                  </span>
                  <span className={`text-[11px] font-mono ${themeClasses.bodySubText}`}>
                    ／ 同一個 MUMㄠ，不同的情緒與動態
                  </span>
                </div>
              </div>
            </div>

            {/* SECTION 01: Character System Flow */}
            <div className={`p-6 sm:p-7 rounded-2xl border space-y-6 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-3 gap-2">
                <div>
                  <span className={`text-[10px] font-mono font-bold uppercase tracking-widest block ${isDark ? "text-[#6CA4C8]" : "text-[#437596]"}`}>
                    CHARACTER CREATION FLOW
                  </span>
                  <h3 className={`text-sm font-bold font-mono ${themeClasses.bodyTitle}`}>
                    CHARACTER CREATION FLOW / 角色建立流程
                  </h3>
                </div>
                <span className={`text-xs font-mono ${themeClasses.bodySubText}`}>
                  Identity → Visual DNA → Expression → Action
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
                {/* 01: Character Identity */}
                <div className={`p-4 rounded-xl border space-y-2 flex flex-col justify-between ${themeClasses.cardBg} ${themeClasses.borderColSubtle}`}>
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded border border-[#437596]/30 bg-[#437596]/10 text-[#437596] dark:text-[#6CA4C8]">
                      01 / IDENTITY
                    </span>
                    <h4 className={`text-xs font-bold font-mono mt-2 ${themeClasses.bodyTitle}`}>
                      CHARACTER IDENTITY
                    </h4>
                    <p className={`text-[11px] font-medium text-[#437596] dark:text-[#6CA4C8]`}>
                      先定義 MUMㄠ 是誰
                    </p>
                  </div>
                  <p className={`text-xs leading-relaxed ${themeClasses.bodySubText}`}>
                    「建立角色身份、文化背景與基本人格，先回答 MUMㄠ 是誰。」
                  </p>
                </div>

                {/* 02: Visual DNA */}
                <div className={`p-4 rounded-xl border space-y-2 flex flex-col justify-between ${themeClasses.cardBg} ${themeClasses.borderColSubtle}`}>
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded border border-[#437596]/30 bg-[#437596]/10 text-[#437596] dark:text-[#6CA4C8]">
                      02 / VISUAL DNA
                    </span>
                    <h4 className={`text-xs font-bold font-mono mt-2 ${themeClasses.bodyTitle}`}>
                      VISUAL DNA
                    </h4>
                    <p className={`text-[11px] font-medium text-[#437596] dark:text-[#6CA4C8]`}>
                      定義哪些視覺元素讓 MUMㄠ 被辨識
                    </p>
                  </div>
                  <p className={`text-xs leading-relaxed ${themeClasses.bodySubText}`}>
                    「建立固定的輪廓、比例與核心視覺特徵，形成 MUMㄠ 的角色 DNA。」
                  </p>
                </div>

                {/* 03: Expression */}
                <div className={`p-4 rounded-xl border space-y-2 flex flex-col justify-between ${themeClasses.cardBg} ${themeClasses.borderColSubtle}`}>
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded border border-[#E8829C]/40 bg-[#E8829C]/10 text-[#E8829C] dark:text-[#F49BB2]">
                      03 / EXPRESSION
                    </span>
                    <h4 className={`text-xs font-bold font-mono mt-2 ${themeClasses.bodyTitle}`}>
                      EXPRESSION
                    </h4>
                    <p className={`text-[11px] font-medium text-[#E8829C] dark:text-[#F49BB2]`}>
                      決定角色如何表達
                    </p>
                  </div>
                  <p className={`text-xs leading-relaxed ${themeClasses.bodySubText}`}>
                    「在固定角色 DNA 下，透過表情、情緒與姿態產生不同角色狀態。」
                  </p>
                </div>

                {/* 04: Action */}
                <div className={`p-4 rounded-xl border space-y-2 flex flex-col justify-between ${themeClasses.cardBg} ${themeClasses.borderColSubtle}`}>
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded border border-[#437596]/30 bg-[#437596]/10 text-[#437596] dark:text-[#6CA4C8]">
                      04 / ACTION
                    </span>
                    <h4 className={`text-xs font-bold font-mono mt-2 ${themeClasses.bodyTitle}`}>
                      ACTION
                    </h4>
                    <p className={`text-[11px] font-medium text-[#437596] dark:text-[#6CA4C8]`}>
                      讓角色進入真實情境
                    </p>
                  </div>
                  <p className={`text-xs leading-relaxed ${themeClasses.bodySubText}`}>
                    「將角色放入音樂、社群、節慶與商品情境，形成可延伸的角色行為。」
                  </p>
                </div>
              </div>
            </div>

            {/* SECTION 02: Character Design Principles */}
            <div className="space-y-8 pt-4">
              {/* Section Header */}
              <div className={`border-b pb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-3 ${themeClasses.borderCol}`}>
                <div>
                  <span className={`text-[10px] font-mono font-bold uppercase tracking-widest block ${isDark ? "text-[#6CA4C8]" : "text-[#437596]"}`}>
                    DESIGN PRINCIPLES / 角色設計原則
                  </span>
                  <h3 className={`text-2xl sm:text-3xl font-black font-mono tracking-tight mt-1 ${themeClasses.bodyTitle}`}>
                    CHARACTER DESIGN PRINCIPLES / 角色設計核心原則
                  </h3>
                </div>
                <p className={`text-xs font-mono max-w-sm text-left sm:text-right ${themeClasses.bodySubText}`}>
                  「設計 MUMㄠ 時，我遵循哪四個核心原則？」
                </p>
              </div>

              {/* Four Principles Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* 01 FORM */}
                <div className={`p-6 rounded-xl border space-y-3.5 flex flex-col justify-between ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                  <div className="space-y-2.5">
                    <div className="flex items-baseline justify-between border-b pb-2 border-zinc-500/15">
                      <span className="text-2xl font-black font-mono text-[#437596] dark:text-[#6CA4C8]">01</span>
                      <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-[#437596] dark:text-[#6CA4C8]">
                        FORM
                      </span>
                    </div>
                    <div>
                      <h4 className={`text-sm font-bold font-mono uppercase tracking-wider ${themeClasses.bodyTitle}`}>
                        FORM
                      </h4>
                      <p className={`text-xs font-medium mt-0.5 text-[#437596] dark:text-[#6CA4C8]`}>
                        輪廓識別度
                      </p>
                    </div>
                    <p className={`text-xs leading-relaxed ${themeClasses.bodyText}`}>
                      「維持圓潤貓頭與清楚外輪廓，即使縮小至社群圖像或周邊尺寸，仍能一眼辨識 MUMㄠ。」
                    </p>
                  </div>
                  <div className="pt-2">
                    <span className={`text-[10px] font-mono uppercase ${themeClasses.bodySubText}`}>
                      RULE 01: SILHOUETTE INTEGRITY
                    </span>
                  </div>
                </div>

                {/* 02 DNA */}
                <div className={`p-6 rounded-xl border space-y-3.5 flex flex-col justify-between ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                  <div className="space-y-2.5">
                    <div className="flex items-baseline justify-between border-b pb-2 border-zinc-500/15">
                      <span className="text-2xl font-black font-mono text-[#E8829C] dark:text-[#F49BB2]">02</span>
                      <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-[#E8829C] dark:text-[#F49BB2]">
                        DNA
                      </span>
                    </div>
                    <div>
                      <h4 className={`text-sm font-bold font-mono uppercase tracking-wider ${themeClasses.bodyTitle}`}>
                        DNA
                      </h4>
                      <p className={`text-xs font-medium mt-0.5 text-[#E8829C] dark:text-[#F49BB2]`}>
                        核心識別元素不可替換
                      </p>
                    </div>
                    <p className={`text-xs leading-relaxed ${themeClasses.bodyText}`}>
                      「固定角色的核心視覺特徵，建立角色基因基準；任何延伸媒介中都不能任意替換或省略。」
                    </p>
                  </div>
                  <div className="pt-2">
                    <span className={`text-[10px] font-mono uppercase ${themeClasses.bodySubText}`}>
                      RULE 02: CORE DNA CONSISTENCY
                    </span>
                  </div>
                </div>

                {/* 03 EXPRESSION */}
                <div className={`p-6 rounded-xl border space-y-3.5 flex flex-col justify-between ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                  <div className="space-y-2.5">
                    <div className="flex items-baseline justify-between border-b pb-2 border-zinc-500/15">
                      <span className="text-2xl font-black font-mono text-[#437596] dark:text-[#6CA4C8]">03</span>
                      <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-[#437596] dark:text-[#6CA4C8]">
                        EXPRESSION
                      </span>
                    </div>
                    <div>
                      <h4 className={`text-sm font-bold font-mono uppercase tracking-wider ${themeClasses.bodyTitle}`}>
                        EXPRESSION
                      </h4>
                      <p className={`text-xs font-medium mt-0.5 text-[#437596] dark:text-[#6CA4C8]`}>
                        情緒可以變化，但身份不能改變
                      </p>
                    </div>
                    <p className={`text-xs leading-relaxed ${themeClasses.bodyText}`}>
                      「表情可以依情境改變，但角色比例、核心特徵與視覺 DNA 必須維持一致。」
                    </p>
                  </div>
                  <div className="pt-2">
                    <span className={`text-[10px] font-mono uppercase ${themeClasses.bodySubText}`}>
                      RULE 03: IDENTITY OVER MOOD
                    </span>
                  </div>
                </div>

                {/* 04 ACTION */}
                <div className={`p-6 rounded-xl border space-y-3.5 flex flex-col justify-between ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                  <div className="space-y-2.5">
                    <div className="flex items-baseline justify-between border-b pb-2 border-zinc-500/15">
                      <span className="text-2xl font-black font-mono text-[#437596] dark:text-[#6CA4C8]">04</span>
                      <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-[#437596] dark:text-[#6CA4C8]">
                        ACTION
                      </span>
                    </div>
                    <div>
                      <h4 className={`text-sm font-bold font-mono uppercase tracking-wider ${themeClasses.bodyTitle}`}>
                        ACTION
                      </h4>
                      <p className={`text-xs font-medium mt-0.5 text-[#437596] dark:text-[#6CA4C8]`}>
                        動作可以延伸，但角色語言不能改變
                      </p>
                    </div>
                    <p className={`text-xs leading-relaxed ${themeClasses.bodyText}`}>
                      「動作可以自由延伸，但必須符合 MUMㄠ 的角色性格、音樂文化與現場感。」
                    </p>
                  </div>
                  <div className="pt-2">
                    <span className={`text-[10px] font-mono uppercase ${themeClasses.bodySubText}`}>
                      RULE 04: FESTIVAL PERSONA
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 03: SYSTEM PRINCIPLE */}
            <div className={`p-8 sm:p-10 rounded-2xl border space-y-8 ${themeClasses.cardBg} ${themeClasses.borderColSubtle}`}>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Left: Design Principle Statement */}
                <div className="lg:col-span-7 space-y-4">
                  <span className={`text-[10px] font-mono font-bold uppercase tracking-widest block ${isDark ? "text-[#6CA4C8]" : "text-[#437596]"}`}>
                    SYSTEM PRINCIPLE / 核心設計原則
                  </span>
                  
                  <h3 className={`text-2xl sm:text-3xl lg:text-4xl font-black font-mono tracking-tight leading-tight ${themeClasses.bodyTitle}`}>
                    POSES CAN CHANGE.<br />THE CHARACTER DOESN&apos;T.
                  </h3>

                  <p className="font-serif italic text-lg sm:text-xl font-bold text-[#437596] dark:text-[#6CA4C8]">
                    「姿勢可以變，角色不能變。」
                  </p>

                  <div className="space-y-2 pt-2">
                    <p className={`text-xs sm:text-sm leading-relaxed ${themeClasses.bodyText}`}>
                      「無論角色出現在社群內容、音樂祭現場或商品應用，核心角色 DNA 都必須保持一致；姿勢、表情與情境可以自由變化。」
                    </p>
                    <p className={`text-xs font-mono italic ${themeClasses.bodySubText}`}>
                      Every pose, gesture, and scene can evolve, while the core character DNA remains untouched.
                    </p>
                  </div>
                </div>

                {/* Right: CORE DNA List */}
                <div className="lg:col-span-5 space-y-3">
                  <div className="border-b pb-2 flex items-center justify-between">
                    <span className={`text-xs font-mono font-bold uppercase tracking-wider ${isDark ? "text-[#6CA4C8]" : "text-[#437596]"}`}>
                      CORE DNA / 核心 DNA
                    </span>
                    <span className={`text-[10px] font-mono ${themeClasses.bodySubText}`}>
                      5 CORE IDENTIFIERS
                    </span>
                  </div>

                  <div className={`divide-y text-xs font-mono ${themeClasses.borderColSubtle}`}>
                    <div className="py-2 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="font-sans font-black text-sm text-[#437596] dark:text-[#6CA4C8]">ㄠ</span>
                        <span className={`font-bold ${themeClasses.bodyTitle}`}>TAIWANESE IDENTITY</span>
                      </div>
                      <span className={`text-[11px] ${themeClasses.bodySubText}`}>在地語言符號</span>
                    </div>

                    <div className="py-2 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="font-sans font-black text-sm text-[#437596] dark:text-[#6CA4C8]">〰</span>
                        <span className={`font-bold ${themeClasses.bodyTitle}`}>BLUE WHISKERS</span>
                      </div>
                      <span className={`text-[11px] ${themeClasses.bodySubText}`}>藍色音波鬍鬚</span>
                    </div>

                    <div className="py-2 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#E8829C] inline-block"></span>
                        <span className={`font-bold ${themeClasses.bodyTitle}`}>PINK EARS</span>
                      </div>
                      <span className={`text-[11px] text-[#E8829C] dark:text-[#F49BB2]`}>粉紅耳朵與情緒溫度</span>
                    </div>

                    <div className="py-2 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="w-2 h-2 rounded bg-zinc-300 dark:bg-zinc-600 inline-block"></span>
                        <span className={`font-bold ${themeClasses.bodyTitle}`}>WHITE TEE</span>
                      </div>
                      <span className={`text-[11px] ${themeClasses.bodySubText}`}>經典白色素 T</span>
                    </div>

                    <div className="py-2 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="w-2 h-2 rounded bg-[#437596] inline-block"></span>
                        <span className={`font-bold ${themeClasses.bodyTitle}`}>BLUE DENIM</span>
                      </div>
                      <span className={`text-[11px] ${themeClasses.bodySubText}`}>藍色休閒牛仔褲</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 04: FIXED VS FLEXIBLE SYSTEM */}
            <div className={`p-8 rounded-2xl border space-y-6 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-3 gap-2">
                <div>
                  <span className={`text-[10px] font-mono font-bold uppercase tracking-widest block ${isDark ? "text-[#6CA4C8]" : "text-[#437596]"}`}>
                    DESIGN BOUNDARIES / 設計界線
                  </span>
                  <h4 className={`text-base font-bold font-mono ${themeClasses.bodyTitle}`}>
                    FIXED VS. VARIABLE SYSTEM / 固定與可變系統
                  </h4>
                </div>
                <div className="space-y-0.5 text-left sm:text-right">
                  <p className={`text-xs font-mono font-bold ${isDark ? "text-[#6CA4C8]" : "text-[#437596]"}`}>
                    IDENTITY STAYS FIXED. EXPRESSION CREATES VARIETY.
                  </p>
                  <p className={`text-[11px] font-mono ${themeClasses.bodySubText}`}>
                    「角色身份保持固定，角色表達創造變化。」
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* 1. FIXED IDENTITY */}
                <div className={`p-5 rounded-xl border space-y-3.5 ${themeClasses.cardBg} ${themeClasses.borderColSubtle}`}>
                  <div className="flex items-center gap-2 border-b pb-2 border-zinc-500/15">
                    <span className="w-2 h-2 rounded-full bg-[#E8829C]"></span>
                    <h5 className={`text-xs font-bold font-mono tracking-wider uppercase text-[#E8829C] dark:text-[#F49BB2]`}>
                      FIXED IDENTITY / 固定角色身份
                    </h5>
                  </div>
                  <p className={`text-xs leading-relaxed ${themeClasses.bodySubText}`}>
                    構成角色不可替換的識別基準：
                  </p>
                  <ul className="space-y-2 text-xs font-mono pt-1">
                    {[
                      { en: "ㄠ", zh: "注音識別符號" },
                      { en: "Blue Whiskers", zh: "湛藍音波鬍鬚" },
                      { en: "Pink Ears", zh: "粉紅耳朵與溫度" },
                      { en: "White T-shirt", zh: "經典白色素 T" },
                      { en: "Blue Denim", zh: "藍色休閒牛仔褲" }
                    ].map((item, idx) => (
                      <li key={idx} className={`flex items-center justify-between py-1 border-b border-zinc-500/10 ${themeClasses.bodyTitle}`}>
                        <span className="font-semibold">• {item.en}</span>
                        <span className={`text-[11px] ${themeClasses.bodySubText}`}>{item.zh}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 2. FIXED FORM */}
                <div className={`p-5 rounded-xl border space-y-3.5 ${themeClasses.cardBg} ${themeClasses.borderColSubtle}`}>
                  <div className="flex items-center gap-2 border-b pb-2 border-zinc-500/15">
                    <span className="w-2 h-2 rounded-full bg-[#437596] dark:bg-[#6CA4C8]"></span>
                    <h5 className={`text-xs font-bold font-mono tracking-wider uppercase text-[#437596] dark:text-[#6CA4C8]`}>
                      FIXED FORM / 固定角色形式
                    </h5>
                  </div>
                  <p className={`text-xs leading-relaxed ${themeClasses.bodySubText}`}>
                    確立幾何比例與視覺線條規範：
                  </p>
                  <ul className="space-y-2 text-xs font-mono pt-1">
                    {[
                      { en: "Character Proportion", zh: "頭身與幾何比例" },
                      { en: "Silhouette", zh: "整體外輪廓識別" },
                      { en: "Line Language", zh: "俐落手繪向量線條" }
                    ].map((item, idx) => (
                      <li key={idx} className={`flex items-center justify-between py-1 border-b border-zinc-500/10 ${themeClasses.bodyTitle}`}>
                        <span className="font-semibold">• {item.en}</span>
                        <span className={`text-[11px] ${themeClasses.bodySubText}`}>{item.zh}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 3. VARIABLE EXPRESSION */}
                <div className={`p-5 rounded-xl border space-y-3.5 ${themeClasses.cardBg} ${themeClasses.borderColSubtle}`}>
                  <div className="flex items-center gap-2 border-b pb-2 border-zinc-500/15">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <h5 className={`text-xs font-bold font-mono tracking-wider uppercase text-emerald-600 dark:text-emerald-400`}>
                      VARIABLE EXPRESSION / 可變角色表達
                    </h5>
                  </div>
                  <p className={`text-xs leading-relaxed ${themeClasses.bodySubText}`}>
                    依情境與載體自由延伸多元狀態：
                  </p>
                  <ul className="space-y-2 text-xs font-mono pt-1">
                    {[
                      { en: "Pose", zh: "站姿、坐姿、側影動態" },
                      { en: "Expression", zh: "眨眼、放空、開衝神態" },
                      { en: "Gesture", zh: "舉爪、比讚、甩手動作" },
                      { en: "Props", zh: "樂團毛巾、吉他 Pick、墨鏡" },
                      { en: "Festival Situation", zh: "舞台前排、草地、市集" },
                      { en: "Music Context", zh: "搖滾、電子、Indie Pop 氛圍" },
                      { en: "Social Content", zh: "社群日常、迷因、貼圖延伸" }
                    ].map((item, idx) => (
                      <li key={idx} className={`flex items-center justify-between py-1 border-b border-zinc-500/10 ${themeClasses.bodyTitle}`}>
                        <span className="font-semibold">• {item.en}</span>
                        <span className={`text-[11px] ${themeClasses.bodySubText}`}>{item.zh}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* SECTION 05: CHARACTER FORMULA */}
            <div className={`p-6 sm:p-8 rounded-2xl border text-center space-y-3.5 ${themeClasses.cardBg} ${themeClasses.borderColSubtle}`}>
              <span className={`text-[10px] font-mono font-bold uppercase tracking-widest block ${isDark ? "text-[#6CA4C8]" : "text-[#437596]"}`}>
                MUMㄠ CHARACTER SYSTEM FORMULA
              </span>

              <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 font-mono font-black text-xs sm:text-sm lg:text-base">
                <div className="flex flex-col items-center">
                  <span className="px-3.5 py-1.5 rounded-lg border border-[#437596]/30 bg-[#437596]/10 text-[#437596] dark:text-[#6CA4C8]">
                    CHARACTER DNA
                  </span>
                  <span className={`text-[9px] font-mono font-normal mt-1 ${themeClasses.bodySubText}`}>
                    Fixed Identity
                  </span>
                </div>
                <span className={`${themeClasses.bodySubText} text-base font-bold mb-4`}>+</span>
                <div className="flex flex-col items-center">
                  <span className="px-3.5 py-1.5 rounded-lg border border-[#E8829C]/30 bg-[#E8829C]/10 text-[#E8829C] dark:text-[#F49BB2]">
                    EXPRESSION
                  </span>
                  <span className={`text-[9px] font-mono font-normal mt-1 ${themeClasses.bodySubText}`}>
                    Variable State
                  </span>
                </div>
                <span className={`${themeClasses.bodySubText} text-base font-bold mb-4`}>+</span>
                <div className="flex flex-col items-center">
                  <span className="px-3.5 py-1.5 rounded-lg border border-[#437596]/30 bg-[#437596]/10 text-[#437596] dark:text-[#6CA4C8]">
                    ACTION
                  </span>
                  <span className={`text-[9px] font-mono font-normal mt-1 ${themeClasses.bodySubText}`}>
                    Contextual Behavior
                  </span>
                </div>
                <span className={`${themeClasses.bodySubText} text-base font-bold mb-4`}>=</span>
                <div className="flex flex-col items-center">
                  <span className={`px-4 py-1.5 rounded-lg border font-extrabold ${themeClasses.bodyTitle} ${themeClasses.borderCol}`}>
                    MUMㄠ CHARACTER SYSTEM
                  </span>
                  <span className={`text-[9px] font-mono font-normal mt-1 ${themeClasses.bodySubText}`}>
                    Scalable System
                  </span>
                </div>
              </div>

              <div className="space-y-1 pt-1">
                <p className={`text-xs sm:text-sm font-mono font-bold ${themeClasses.bodyTitle}`}>
                  「固定角色 DNA，搭配可變的情緒表達與情境動作，讓 MUMㄠ 能在不同媒體中持續產生新的角色狀態。」
                </p>
                <p className={`text-xs font-mono ${themeClasses.bodySubText}`}>
                  Fixed Identity + Variable State + Contextual Behavior
                </p>
              </div>
            </div>

            {/* SECTION 06: SIGNATURE FEATURES */}
            <div className="space-y-6 pt-2">
              <div className={`border-b pb-3 flex flex-col sm:flex-row sm:items-end justify-between gap-1 ${themeClasses.borderCol}`}>
                <div>
                  <span className={`text-[10px] font-mono font-bold uppercase tracking-widest block ${isDark ? "text-[#6CA4C8]" : "text-[#437596]"}`}>
                    SYSTEM ANCHORS / 核心識別要素
                  </span>
                  <h3 className={`text-xl font-bold font-mono mt-0.5 ${themeClasses.bodyTitle}`}>
                    SIGNATURE FEATURES / 固定五大核心識別元素
                  </h3>
                </div>
                <div className="space-y-0.5 text-left sm:text-right">
                  <p className={`text-xs font-mono font-bold ${isDark ? "text-[#6CA4C8]" : "text-[#437596]"}`}>
                    FIVE FIXED VISUAL ANCHORS DEFINING MUMㄠ ACROSS ALL MEDIA.
                  </p>
                  <p className={`text-[11px] font-mono ${themeClasses.bodySubText}`}>
                    「五項固定視覺錨點，確保 MUMㄠ 在不同媒體中仍能被辨識。」
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {/* 1. ㄠ */}
                <div className={`p-4 rounded-xl border space-y-2 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-black font-sans leading-none text-[#437596] dark:text-[#6CA4C8]">ㄠ</span>
                    <span className="text-[10px] font-mono text-xs font-bold text-[#437596] dark:text-[#6CA4C8]">01</span>
                  </div>
                  <div>
                    <h4 className={`text-xs font-bold font-mono uppercase ${themeClasses.bodyTitle}`}>
                      ㄠ
                    </h4>
                    <p className={`text-[11px] font-medium text-[#437596] dark:text-[#6CA4C8]`}>
                      TAIWANESE IDENTITY
                    </p>
                  </div>
                  <p className={`text-xs leading-relaxed ${themeClasses.bodySubText}`}>
                    將注音「ㄠ」融入命名與視覺印記，建立鮮明的在地文化識別。
                  </p>
                </div>

                {/* 2. 〰 */}
                <div className={`p-4 rounded-xl border space-y-2 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-black tracking-tighter leading-none text-[#437596] dark:text-[#6CA4C8]">〰</span>
                    <span className="text-[10px] font-mono text-xs font-bold text-[#437596] dark:text-[#6CA4C8]">02</span>
                  </div>
                  <div>
                    <h4 className={`text-xs font-bold font-mono uppercase ${themeClasses.bodyTitle}`}>
                      音波鬍鬚
                    </h4>
                    <p className={`text-[11px] font-medium text-[#437596] dark:text-[#6CA4C8]`}>
                      MUSIC IDENTITY
                    </p>
                  </div>
                  <p className={`text-xs leading-relaxed ${themeClasses.bodySubText}`}>
                    湛藍波浪鬍鬚象徵聲波與音浪，將音樂直接內嵌為身體語彙。
                  </p>
                </div>

                {/* 3. PINK EARS */}
                <div className={`p-4 rounded-xl border space-y-2 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded border border-[#E8829C]/40 bg-[#E8829C]/10 text-[#E8829C] dark:text-[#F49BB2]">
                      PINK
                    </span>
                    <span className="text-[10px] font-mono text-xs font-bold text-[#E8829C] dark:text-[#F49BB2]">03</span>
                  </div>
                  <div>
                    <h4 className={`text-xs font-bold font-mono uppercase ${themeClasses.bodyTitle}`}>
                      PINK EARS
                    </h4>
                    <p className={`text-[11px] font-medium text-[#E8829C] dark:text-[#F49BB2]`}>
                      CHARACTER EMOTION
                    </p>
                  </div>
                  <p className={`text-xs leading-relaxed ${themeClasses.bodySubText}`}>
                    粉紅耳尖與肉球點綴，在冷調中注入親近感與情緒溫度。
                  </p>
                </div>

                {/* 4. WHITE TEE */}
                <div className={`p-4 rounded-xl border space-y-2 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded border border-zinc-400/40 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200">
                      TEE
                    </span>
                    <span className={`text-[10px] font-mono text-xs font-bold ${themeClasses.bodySubText}`}>04</span>
                  </div>
                  <div>
                    <h4 className={`text-xs font-bold font-mono uppercase ${themeClasses.bodyTitle}`}>
                      WHITE TEE
                    </h4>
                    <p className={`text-[11px] font-medium text-[#437596] dark:text-[#6CA4C8]`}>
                      EVERYDAY PERSONA
                    </p>
                  </div>
                  <p className={`text-xs leading-relaxed ${themeClasses.bodySubText}`}>
                    素白短 T 傳遞親切、隨和且貼近日常青年聽團生活的人設。
                  </p>
                </div>

                {/* 5. BLUE DENIM */}
                <div className={`p-4 rounded-xl border space-y-2 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded border border-[#2B5573]/40 bg-[#437596]/10 text-[#2B5573] dark:text-[#6CA4C8]">
                      DENIM
                    </span>
                    <span className={`text-[10px] font-mono text-xs font-bold ${themeClasses.bodySubText}`}>05</span>
                  </div>
                  <div>
                    <h4 className={`text-xs font-bold font-mono uppercase ${themeClasses.bodyTitle}`}>
                      BLUE DENIM
                    </h4>
                    <p className={`text-[11px] font-medium text-[#437596] dark:text-[#6CA4C8]`}>
                      FESTIVAL / CASUAL IDENTITY
                    </p>
                  </div>
                  <p className={`text-xs leading-relaxed ${themeClasses.bodySubText}`}>
                    率性藍色牛仔褲，連結在草地、舞台與泥坑中的真實聽團日常。
                  </p>
                </div>
              </div>
            </div>

            {/* SECTION 07: CHARACTER EXPANSION SYSTEM */}
            <div className={`p-6 sm:p-7 rounded-2xl border space-y-5 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
              <div className={`flex flex-col sm:flex-row sm:items-center justify-between border-b pb-3 gap-2 ${themeClasses.borderColSubtle}`}>
                <div>
                  <span className={`text-[10px] font-mono font-bold uppercase tracking-widest block ${isDark ? "text-[#6CA4C8]" : "text-[#437596]"}`}>
                    CHARACTER EXPANSION SYSTEM / 角色延伸系統
                  </span>
                  <h3 className={`text-sm font-bold font-mono ${themeClasses.bodyTitle}`}>
                    CHARACTER EXPANSION SYSTEM / 角色延伸系統
                  </h3>
                </div>
                <div className="space-y-0.5 text-left sm:text-right">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold">
                    NEW POSE = FIXED DNA + NEW MOVEMENT
                  </span>
                </div>
              </div>

              <p className={`text-xs leading-relaxed ${themeClasses.bodyText}`}>
                「新姿勢可以改變動作與情境，但仍必須保留 MUMㄠ 的輪廓、比例與五項核心識別。」
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {characterFutureSystem.map((sys, idx) => (
                  <div key={idx} className={`p-4 rounded-xl border space-y-2 transition-all ${themeClasses.cardBg} ${themeClasses.borderColSubtle}`}>
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className={`font-bold ${isDark ? "text-[#6CA4C8]" : "text-[#437596]"}`}>{sys.num}</span>
                      <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-zinc-500/10 text-zinc-500 dark:text-zinc-400">
                        EXPANSION CASE
                      </span>
                    </div>
                    <div>
                      <span className={`text-xs font-mono font-bold block ${themeClasses.bodyTitle}`}>{sys.name}</span>
                      <span className={`text-[11px] font-medium text-[#437596] dark:text-[#6CA4C8]`}>{sys.zhName}</span>
                    </div>
                    <p className={`text-xs leading-relaxed ${themeClasses.bodySubText}`}>「{sys.desc}」</p>
                  </div>
                ))}
              </div>
            </div>

            {/* SECTION 08: Chapter Summary & Next Section Navigation */}
            <div className={`p-6 sm:p-8 rounded-2xl border space-y-5 ${themeClasses.cardBg} ${themeClasses.borderColSubtle}`}>
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="space-y-2">
                  <span className={`text-[10px] font-mono font-bold uppercase tracking-widest block ${isDark ? "text-[#6CA4C8]" : "text-[#437596]"}`}>
                    CHAPTER SUMMARY / 章節總結
                  </span>
                  <h3 className={`text-xl sm:text-2xl font-bold font-mono ${themeClasses.bodyTitle}`}>
                    FROM CHARACTER TO SYSTEM.
                  </h3>
                  <p className={`text-xs font-mono ${isDark ? "text-[#6CA4C8]" : "text-[#437596]"}`}>
                    A CHARACTER SYSTEM BUILT TO SCALE.
                  </p>
                  <p className={`text-xs sm:text-sm leading-relaxed ${themeClasses.bodyText} max-w-2xl pt-1`}>
                    「MUMㄠ 不只是一個固定姿勢的角色，而是一套可以在不同情境中持續生成新狀態的角色系統。」
                  </p>
                </div>
              </div>

              {/* Simple Visual Logic Sequence */}
              <div className={`pt-4 border-t ${themeClasses.borderColSubtle}`}>
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 font-mono text-[11px] font-bold">
                  <span className={`px-3 py-1.5 rounded-sm border ${
                    isDark ? "bg-zinc-900 border-zinc-700 text-zinc-200" : "bg-white border-slate-300 text-slate-800"
                  }`}>
                    FIXED DNA
                  </span>
                  <span className={`text-xs ${themeClasses.bodySubText}`}>→</span>
                  <span className={`px-3 py-1.5 rounded-sm border ${
                    isDark ? "bg-[#417293]/20 border-[#417293]/50 text-[#6CA4C8]" : "bg-[#EBF3F8] border-[#C8DCE8] text-[#437596]"
                  }`}>
                    NEW EXPRESSION
                  </span>
                  <span className={`text-xs ${themeClasses.bodySubText}`}>→</span>
                  <span className={`px-3 py-1.5 rounded-sm border ${
                    isDark ? "bg-[#E8829C]/20 border-[#E8829C]/50 text-[#F49BB2]" : "bg-[#E8829C]/10 border-[#E8829C]/30 text-[#D85E7E]"
                  }`}>
                    NEW ACTION
                  </span>
                  <span className={`text-xs ${themeClasses.bodySubText}`}>→</span>
                  <span className={`px-3 py-1.5 rounded-sm border font-black ${
                    isDark ? "bg-[#6CA4C8] text-zinc-950 border-[#6CA4C8]" : "bg-[#437596] text-white border-[#437596]"
                  }`}>
                    NEW APPLICATION
                  </span>
                </div>
                <p className={`text-xs leading-relaxed pt-3 ${themeClasses.bodyText}`}>
                  「固定 DNA 建立角色辨識度；可變的情緒、動作與情境，讓 MUMㄠ 持續生成新的角色狀態與內容。」
                </p>
              </div>
            </div>

            {/* Next Section Navigation Button */}
            <div className={`pt-2 flex justify-end border-t ${themeClasses.borderColSubtle}`}>
              <button
                type="button"
                onClick={() => scrollToSection("color-section")}
                className={`inline-flex items-center gap-4 px-6 py-3.5 rounded-xl border text-xs font-mono font-bold transition-all ${themeClasses.cardBg} ${themeClasses.borderColSubtle} hover:border-[#437596] hover:text-[#437596] dark:hover:border-[#6CA4C8] dark:hover:text-[#6CA4C8] group cursor-pointer`}
              >
                <div className="text-left">
                  <span className={`text-[10px] block font-mono uppercase tracking-widest ${themeClasses.bodySubText}`}>
                    NEXT SECTION
                  </span>
                  <span className="text-sm font-bold tracking-tight block">
                    02 / COLOR SYSTEM
                  </span>
                  <span className="text-[11px] font-mono text-[#437596] dark:text-[#6CA4C8] block pt-0.5">
                    DEFINING THE COLOR PALETTE →
                  </span>
                </div>
              </button>
            </div>
          </section>


          {/* ===== 5. 02 / COLOR SYSTEM (色彩計畫與規範) ===== */}
          <section id="color-section" className="pt-6 space-y-12 text-left">
            <SoundwaveDivider isDark={isDark} color={isDark ? "#6CA4C8" : "#437596"} className="mb-8" />
            
            {/* Section Header */}
            <div className={`flex flex-col sm:flex-row sm:items-end justify-between border-b pb-4 gap-4 ${themeClasses.borderCol}`}>
              <div>
                <div className="flex items-center gap-2">
                  <Palette className={`h-4 w-4 ${isDark ? "text-[#6CA4C8]" : "text-[#437596]"}`} />
                  <span className={`text-xs font-mono font-bold uppercase tracking-widest block ${isDark ? "text-[#6CA4C8]" : "text-[#437596]"}`}>
                    02 / COLOR SYSTEM ‧ VISUAL IDENTITY
                  </span>
                </div>
                <h2 className={`text-3xl font-bold font-mono mt-1 tracking-tight ${themeClasses.bodyTitle}`}>
                  MUMㄠ 色彩計畫規範
                </h2>
              </div>
              <div className="max-w-md">
                <p className={`text-xs leading-relaxed font-mono ${themeClasses.bodySubText}`}>
                  MUMㄠ 的色彩不是裝飾，而是從角色 DNA、音樂語言與情緒特徵中推導出的視覺系統。
                </p>
                <div className="flex flex-wrap items-center gap-1.5 mt-1 text-[10px] font-mono text-[#437596] dark:text-[#6CA4C8]">
                  <span className="font-bold">COLOR FOLLOWS CHARACTER.</span>
                  <span className="opacity-70">From character DNA to a scalable color system.</span>
                </div>
              </div>
            </div>

            {/* 01. COLOR DNA 起源邏輯 (From Character Cues to Color DNA) */}
            <div className={`p-6 sm:p-8 rounded-2xl border space-y-6 ${themeClasses.cardBg} ${themeClasses.borderBlueAccent}`}>
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b pb-4 border-black/5 dark:border-white/5">
                <div className="space-y-1.5 max-w-2xl">
                  <span className={`text-xs font-mono font-bold uppercase tracking-widest block ${isDark ? "text-[#6CA4C8]" : "text-[#437596]"}`}>
                    01 / COLOR ORIGIN & DERIVATION
                  </span>
                  <h3 className={`text-xl font-bold font-mono ${themeClasses.bodyTitle}`}>
                    COLOR DNA / 色彩來源
                  </h3>
                  <div className="flex flex-wrap items-center gap-2 text-xs font-mono font-bold text-[#437596] dark:text-[#6CA4C8]">
                    <span>FROM CHARACTER CUES TO COLOR DNA.</span>
                    <span className="opacity-70">｜ 從角色特徵抽取色彩，而不是從品牌色開始設計。</span>
                  </div>
                  <p className={`text-xs leading-relaxed ${themeClasses.bodySubText}`}>
                    MUMㄠ 的色彩不是先決定品牌色再套用，而是從角色本身已存在的視覺特徵中抽取，轉化成一套可延伸的色彩語言。
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0 font-mono text-[10px] font-bold px-3 py-1.5 rounded-lg border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02]">
                  <span>CHARACTER</span>
                  <span className="text-[#437596] dark:text-[#6CA4C8]">→</span>
                  <span>VISUAL CUES</span>
                  <span className="text-[#437596] dark:text-[#6CA4C8]">→</span>
                  <span className="text-[#437596] dark:text-[#6CA4C8]">COLOR SYSTEM</span>
                </div>
              </div>

              {/* 4 Origin Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* 01 WHITE */}
                <div className={`p-5 rounded-xl border space-y-3 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100">
                      01 / SOURCE
                    </span>
                    <span className="w-3.5 h-3.5 rounded-full bg-white border border-zinc-300 dark:border-zinc-600 shadow-xs"></span>
                  </div>
                  <div>
                    <h4 className={`text-sm font-bold font-mono ${themeClasses.bodyTitle}`}>
                      MUMㄠ WHITE
                    </h4>
                    <p className="text-xs font-mono font-bold text-[#437596] dark:text-[#6CA4C8] mt-0.5">
                      BODY
                    </p>
                    <p className="text-[11px] font-bold text-zinc-700 dark:text-zinc-300">
                      角色本體／空間留白
                    </p>
                  </div>
                  <p className={`text-xs leading-relaxed ${themeClasses.bodySubText}`}>
                    取自 MUMㄠ 的白色毛色，形成角色本體與主要視覺空間。
                  </p>
                </div>

                {/* 02 BLUE */}
                <div className={`p-5 rounded-xl border space-y-3 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-[#437596]/15 text-[#2B5470] dark:text-[#90C2E4]">
                      02 / SOURCE
                    </span>
                    <span className="w-3.5 h-3.5 rounded-full bg-[#437596] shadow-xs"></span>
                  </div>
                  <div>
                    <h4 className={`text-sm font-bold font-mono ${themeClasses.bodyTitle}`}>
                      WAVE BLUE
                    </h4>
                    <p className="text-xs font-mono font-bold text-[#437596] dark:text-[#6CA4C8] mt-0.5">
                      SOUND
                    </p>
                    <p className="text-[11px] font-bold text-[#2B5470] dark:text-[#90C2E4]">
                      音樂／品牌辨識
                    </p>
                  </div>
                  <p className={`text-xs leading-relaxed ${themeClasses.bodySubText}`}>
                    取自藍色音波鬍鬚，將音樂視覺化為品牌辨識。
                  </p>
                </div>

                {/* 03 PINK */}
                <div className={`p-5 rounded-xl border space-y-3 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-[#E8829C]/15 text-[#B83B5E] dark:text-[#FFB6C7]">
                      03 / SOURCE
                    </span>
                    <span className="w-3.5 h-3.5 rounded-full bg-[#E8829C] shadow-xs"></span>
                  </div>
                  <div>
                    <h4 className={`text-sm font-bold font-mono ${themeClasses.bodyTitle}`}>
                      EAR PINK
                    </h4>
                    <p className="text-xs font-mono font-bold text-[#E8829C] dark:text-[#FFB6C7] mt-0.5">
                      EMOTION
                    </p>
                    <p className="text-[11px] font-bold text-[#B83B5E] dark:text-[#FFB6C7]">
                      情緒／親近感
                    </p>
                  </div>
                  <p className={`text-xs leading-relaxed ${themeClasses.bodySubText}`}>
                    取自粉紅耳朵與肉球，建立角色的溫度與情緒焦點。
                  </p>
                </div>

                {/* 04 BLACK */}
                <div className={`p-5 rounded-xl border space-y-3 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-zinc-900 dark:bg-zinc-800 text-white">
                      04 / SOURCE
                    </span>
                    <span className="w-3.5 h-3.5 rounded-full bg-[#1E242B] border border-zinc-700 shadow-xs"></span>
                  </div>
                  <div>
                    <h4 className={`text-sm font-bold font-mono ${themeClasses.bodyTitle}`}>
                      CHARCOAL BLACK
                    </h4>
                    <p className="text-xs font-mono font-bold text-zinc-600 dark:text-zinc-400 mt-0.5">
                      LINE
                    </p>
                    <p className="text-[11px] font-bold text-zinc-700 dark:text-zinc-300">
                      輪廓／結構
                    </p>
                  </div>
                  <p className={`text-xs leading-relaxed ${themeClasses.bodySubText}`}>
                    取自手繪黑色輪廓，建立角色、文字與資訊結構。
                  </p>
                </div>
              </div>
            </div>

            {/* 02. COLOR ROLES (色彩功能定義) */}
            <div className={`p-6 sm:p-8 rounded-2xl border space-y-6 ${themeClasses.cardBg} ${themeClasses.borderColSubtle}`}>
              <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b pb-4 gap-2 border-black/5 dark:border-white/5">
                <div>
                  <span className={`text-xs font-mono font-bold uppercase tracking-widest block ${isDark ? "text-[#6CA4C8]" : "text-[#437596]"}`}>
                    02 / FUNCTIONAL DEFINITIONS
                  </span>
                  <h3 className={`text-xl font-bold font-mono mt-0.5 ${themeClasses.bodyTitle}`}>
                    COLOR ROLES / 色彩功能定義
                  </h3>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-[#437596] dark:text-[#6CA4C8]">
                    COLOR → ROLE → FUNCTION
                  </span>
                  <p className={`text-[11px] font-mono ${themeClasses.bodySubText}`}>
                    每個顏色在整個 IP SYSTEM 裡負責的核心任務
                  </p>
                </div>
              </div>

              {/* 4 Color Roles Statement Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* WHITE */}
                <div className={`p-5 rounded-xl border flex flex-col justify-between space-y-3 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border border-zinc-300 dark:border-zinc-600 shadow-xs">
                        MUMㄠ WHITE
                      </span>
                      <span className="text-xs font-mono font-black text-zinc-800 dark:text-zinc-200">
                        BODY
                      </span>
                    </div>
                    <h4 className={`text-sm font-bold ${themeClasses.bodyTitle}`}>
                      建立角色本體與空間
                    </h4>
                  </div>
                  <p className={`text-xs leading-relaxed ${themeClasses.bodySubText}`}>
                    定義純粹、真實與不加修飾的原生質地，為所有視覺提供開闊的空間基底。
                  </p>
                </div>

                {/* BLUE */}
                <div className={`p-5 rounded-xl border flex flex-col justify-between space-y-3 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#437596] text-white">
                        WAVE BLUE
                      </span>
                      <span className="text-xs font-mono font-black text-[#437596] dark:text-[#6CA4C8]">
                        MUSIC IDENTITY
                      </span>
                    </div>
                    <h4 className={`text-sm font-bold ${themeClasses.bodyTitle}`}>
                      建立音樂與品牌辨識
                    </h4>
                  </div>
                  <p className={`text-xs leading-relaxed ${themeClasses.bodySubText}`}>
                    轉化音浪頻率與音樂現場能量，作為全品牌最核心的文化識別色。
                  </p>
                </div>

                {/* PINK */}
                <div className={`p-5 rounded-xl border flex flex-col justify-between space-y-3 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#E8829C] text-white">
                        EAR PINK
                      </span>
                      <span className="text-xs font-mono font-black text-[#E8829C] dark:text-[#FFB6C7]">
                        EMOTIONAL ACCENT
                      </span>
                    </div>
                    <h4 className={`text-sm font-bold ${themeClasses.bodyTitle}`}>
                      建立角色溫度與情緒焦點
                    </h4>
                  </div>
                  <p className={`text-xs leading-relaxed ${themeClasses.bodySubText}`}>
                    角色的情緒天線與感受器官，在冷靜音樂基調中注入生命溫度與親和力。
                  </p>
                </div>

                {/* BLACK */}
                <div className={`p-5 rounded-xl border flex flex-col justify-between space-y-3 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-zinc-900 dark:bg-zinc-950 text-white border border-zinc-700">
                        CHARCOAL BLACK
                      </span>
                      <span className="text-xs font-mono font-black text-zinc-900 dark:text-zinc-100">
                        STRUCTURAL LINE
                      </span>
                    </div>
                    <h4 className={`text-sm font-bold ${themeClasses.bodyTitle}`}>
                      建立輪廓、文字與資訊結構
                    </h4>
                  </div>
                  <p className={`text-xs leading-relaxed ${themeClasses.bodySubText}`}>
                    手繪線條的靈魂骨架，承載角色輪廓、版面線稿與文字排版的可讀性。
                  </p>
                </div>
              </div>
            </div>

            {/* 03. COLOR RATIO (70% Base / 20% Identity / 10% Emotion + Structural Black) */}
            <div className={`p-6 sm:p-8 rounded-2xl border space-y-6 ${themeClasses.cardBg} ${themeClasses.borderBlueAccent}`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-4 border-black/5 dark:border-white/5">
                <div>
                  <span className={`text-xs font-mono font-bold uppercase tracking-widest block ${isDark ? "text-[#6CA4C8]" : "text-[#437596]"}`}>
                    03 / PROPORTION SYSTEM
                  </span>
                  <h3 className={`text-lg font-bold font-mono ${themeClasses.bodyTitle}`}>
                    COLOR RATIO / 色彩比例守則
                  </h3>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded-md ${isDark ? "bg-zinc-800 text-zinc-200" : "bg-slate-100 text-slate-700"}`}>
                    70% BASE / 20% IDENTITY / 10% EMOTION
                  </span>
                  <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded-md border border-zinc-500/30 ${themeClasses.cardSubtleBg} text-zinc-500 dark:text-zinc-400`}>
                    BLACK: STRUCTURAL / VARIABLE
                  </span>
                </div>
              </div>

              {/* Stacked Proportional Bar */}
              <div className="space-y-2">
                <div className="h-12 w-full rounded-xl overflow-hidden flex shadow-inner border border-black/15 dark:border-white/15">
                  {/* 70% White */}
                  <div className="w-[70%] bg-white text-zinc-900 flex items-center justify-between px-4 text-xs font-mono font-bold border-r border-zinc-200">
                    <span className="truncate">70% CHARACTER BASE / MUMㄠ WHITE</span>
                    <span className="hidden sm:inline font-bold">70%</span>
                  </div>
                  {/* 20% Wave Blue */}
                  <div className="w-[20%] bg-[#437596] text-white flex items-center justify-between px-3 text-xs font-mono font-bold border-r border-[#2B5573]">
                    <span className="truncate">20% MUSIC IDENTITY</span>
                    <span className="hidden sm:inline font-bold">20%</span>
                  </div>
                  {/* 10% Ear Pink */}
                  <div className="w-[10%] bg-[#E8829C] text-white flex items-center justify-center text-xs font-mono font-bold">
                    <span className="truncate text-center">10% EMOTIONAL ACCENT</span>
                  </div>
                </div>
              </div>

              {/* 3 Colors Proportional Roles directly matching Character DNA */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                {/* 70% MUMㄠ WHITE */}
                <div className={`p-4 rounded-xl border space-y-2 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-black font-mono leading-none text-zinc-800 dark:text-zinc-100">70%</span>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200">
                      70% BASE
                    </span>
                  </div>
                  <div>
                    <h4 className={`text-xs font-bold font-mono ${themeClasses.bodyTitle}`}>
                      MUMㄠ WHITE
                    </h4>
                    <p className="text-[11px] font-mono font-bold mt-0.5 text-[#437596] dark:text-[#6CA4C8]">
                      70% CHARACTER BASE / BODY
                    </p>
                  </div>
                  <p className={`text-xs leading-relaxed ${themeClasses.bodySubText}`}>
                    建立角色空間與主要視覺基底。大面積使用於角色身體、背景與主要視覺，建立乾淨、純粹且具有留白感的視覺空間。
                  </p>
                </div>

                {/* 20% WAVE BLUE */}
                <div className={`p-4 rounded-xl border space-y-2 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-black font-mono leading-none text-[#437596] dark:text-[#6CA4C8]">20%</span>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded border border-[#437596]/30 bg-[#437596]/10 text-[#437596] dark:text-[#6CA4C8]">
                      20% IDENTITY
                    </span>
                  </div>
                  <div>
                    <h4 className={`text-xs font-bold font-mono ${themeClasses.bodyTitle}`}>
                      WAVE BLUE
                    </h4>
                    <p className="text-[11px] font-mono font-bold mt-0.5 text-[#437596] dark:text-[#6CA4C8]">
                      20% MUSIC IDENTITY / SOUND
                    </p>
                  </div>
                  <p className={`text-xs leading-relaxed ${themeClasses.bodySubText}`}>
                    建立音樂文化與品牌辨識。取自湛藍音波鬍鬚，象徵聲音、節奏與現場文化，是品牌最關鍵的視覺標誌色。
                  </p>
                </div>

                {/* 10% EAR PINK */}
                <div className={`p-4 rounded-xl border space-y-2 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-black font-mono leading-none text-[#E8829C] dark:text-[#F49BB2]">10%</span>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded border border-[#E8829C]/30 bg-[#E8829C]/10 text-[#E8829C] dark:text-[#F49BB2]">
                      10% EMOTION
                    </span>
                  </div>
                  <div>
                    <h4 className={`text-xs font-bold font-mono ${themeClasses.bodyTitle}`}>
                      EAR PINK
                    </h4>
                    <p className="text-[11px] font-mono font-bold mt-0.5 text-[#E8829C] dark:text-[#F49BB2]">
                      10% EMOTIONAL ACCENT / EMOTION
                    </p>
                  </div>
                  <p className={`text-xs leading-relaxed ${themeClasses.bodySubText}`}>
                    建立角色溫度與視覺焦點。取自耳朵與肉球，作為暖色情緒訊號，為藍白系統加入溫度。（強調少量使用，不作為主色）
                  </p>
                </div>
              </div>

              {/* Structural Charcoal Black Clarification Box */}
              <div className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                <div className="flex items-center gap-3">
                  <span className="w-3.5 h-3.5 rounded-sm bg-[#1E242B] border border-white/20 shrink-0"></span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-mono font-bold uppercase ${themeClasses.bodyTitle}`}>
                        CHARCOAL BLACK / 手繪炭黑
                      </span>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#1E242B] text-white">
                        STRUCTURAL COLOR / VARIABLE
                      </span>
                    </div>
                    <p className={`text-xs leading-relaxed mt-0.5 ${themeClasses.bodySubText}`}>
                      Black 不屬於 70 / 20 / 10 品牌色比例，而是功能性色彩，依文字、線稿、分隔與資訊結構需求使用。
                    </p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className={`text-[10px] font-mono block ${themeClasses.bodySubText}`}>LINE & STRUCTURE</span>
                  <span className="text-xs font-mono font-bold text-zinc-500 dark:text-zinc-400">NON-RATIO COLOR</span>
                </div>
              </div>
            </div>

            {/* 04. COLOR SPECIFICATIONS (四大核心色彩規格) */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b pb-3 gap-2 border-black/5 dark:border-white/5">
                <div>
                  <span className={`text-xs font-mono font-bold uppercase tracking-widest block ${isDark ? "text-[#6CA4C8]" : "text-[#437596]"}`}>
                    04 / COLOR SPECIFICATIONS
                  </span>
                  <h3 className={`text-lg font-bold font-mono ${themeClasses.bodyTitle}`}>
                    四大核心色彩規格
                  </h3>
                  <div className="flex flex-wrap items-center gap-2 text-xs font-mono font-bold text-[#437596] dark:text-[#6CA4C8] mt-0.5">
                    <span>FROM DESIGN DECISION TO PRODUCTION SPECIFICATION.</span>
                    <span className="opacity-70">｜ 確立色彩邏輯後，將其轉化為可直接執行的製作規格。</span>
                  </div>
                </div>
                <span className={`text-[11px] font-mono shrink-0 ${themeClasses.bodySubText}`}>
                  點擊色碼可直接複製 HEX
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {brandColorSystem.map((col, idx) => {
                  const isCopied = copiedHex === col.hex;
                  return (
                    <div
                      key={idx}
                      className={`rounded-2xl border flex flex-col justify-between overflow-hidden transition-all ${themeClasses.cardBg} ${themeClasses.borderColSubtle} hover:border-[#437596] dark:hover:border-[#6CA4C8]`}
                    >
                      {/* Top Color Swatch Block */}
                      <div
                        className={`h-36 w-full relative p-4 flex flex-col justify-between ${
                          col.isLight ? "border-b border-zinc-200" : ""
                        }`}
                        style={{ backgroundColor: col.bgHex }}
                      >
                        <div className="flex items-center justify-between">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                            col.isLight 
                              ? "bg-zinc-900 text-white" 
                              : "bg-white text-zinc-900 shadow-xs"
                          }`}>
                            {col.code}
                          </span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                            col.isLight 
                              ? "bg-zinc-100 text-zinc-800 border border-zinc-300" 
                              : "bg-black/40 text-white"
                          }`}>
                            {col.position}
                          </span>
                        </div>

                        <div className="flex items-end justify-between">
                          <span className={`font-mono text-sm font-bold tracking-wider ${
                            col.isLight ? "text-zinc-900" : "text-white"
                          }`}>
                            {col.hex}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopyColor(col.hex)}
                            className={`p-1.5 rounded-md transition-all cursor-pointer flex items-center gap-1 text-[10px] font-mono font-bold shadow-xs ${
                              isCopied
                                ? "bg-emerald-500 text-white"
                                : col.isLight
                                ? "bg-zinc-900 text-white hover:bg-zinc-700"
                                : "bg-white text-zinc-900 hover:bg-zinc-100"
                            }`}
                            title="點擊複製色碼"
                          >
                            {isCopied ? (
                              <>
                                <Check className="h-3 w-3" />
                                <span>COPIED</span>
                              </>
                            ) : (
                              <>
                                <Copy className="h-3 w-3" />
                                <span>COPY</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Bottom Specs Info */}
                      <div className="p-5 space-y-3.5 flex-1 flex flex-col justify-between">
                        <div className="space-y-2.5">
                          <div className="flex items-baseline justify-between gap-1">
                            <h3 className={`text-sm font-bold font-mono ${themeClasses.bodyTitle}`}>
                              {col.name}
                            </h3>
                            <span className={`text-xs font-bold ${themeClasses.bodySubText}`}>
                              {col.zhName}
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#437596]/10 text-[#437596] dark:text-[#6CA4C8] border border-[#437596]/20">
                              {col.position}
                            </span>
                          </div>

                          {/* Specs Matrix */}
                          <div className={`p-2.5 rounded-xl border space-y-1 font-mono text-[11px] ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                            <div className="flex justify-between">
                              <span className={themeClasses.bodySubText}>RGB:</span>
                              <span className={`font-semibold ${themeClasses.bodyTitle}`}>{col.rgb}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className={themeClasses.bodySubText}>CMYK:</span>
                              <span className={`font-semibold ${themeClasses.bodyTitle}`}>{col.cmyk}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className={themeClasses.bodySubText}>PANTONE:</span>
                              <span className={`font-semibold text-[10px] ${themeClasses.bodyTitle}`}>{col.pantone}</span>
                            </div>
                          </div>

                          <div className="space-y-1">
                            <span className={`text-[10px] font-mono font-bold uppercase tracking-wider block ${isDark ? "text-[#6CA4C8]" : "text-[#437596]"}`}>
                              {col.meaning}
                            </span>
                            <p className={`text-xs leading-relaxed ${themeClasses.bodySubText}`}>
                              {col.desc}
                            </p>
                          </div>
                        </div>

                        {/* Core Application Bullets */}
                        <div className={`pt-2.5 border-t space-y-1.5 ${themeClasses.borderColSubtle}`}>
                          <span className={`text-[10px] font-mono font-bold uppercase tracking-wider block ${themeClasses.bodySubText}`}>
                            PRIMARY APPLICATION
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {col.applications.map((app, aIdx) => (
                              <span
                                key={aIdx}
                                className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${themeClasses.borderColSubtle} ${themeClasses.cardSubtleBg} ${themeClasses.bodySubText}`}
                              >
                                {app}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 05. COLOR HIERARCHY (色彩層級架構 / COLOR ARCHITECTURE) */}
            <div className={`p-6 sm:p-8 rounded-2xl border space-y-6 ${themeClasses.cardBg} ${themeClasses.borderColSubtle}`}>
              <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b pb-4 gap-2 border-black/5 dark:border-white/5">
                <div>
                  <span className={`text-xs font-mono font-bold uppercase tracking-widest block ${isDark ? "text-[#6CA4C8]" : "text-[#437596]"}`}>
                    05 / COLOR ARCHITECTURE
                  </span>
                  <h3 className={`text-xl font-bold font-mono mt-0.5 ${themeClasses.bodyTitle}`}>
                    COLOR HIERARCHY / 色彩層級架構
                  </h3>
                </div>
                <div className="text-right font-mono">
                  <p className={`text-xs font-bold ${isDark ? "text-[#6CA4C8]" : "text-[#437596]"}`}>
                    WHITE BUILDS SPACE. ‧ BLUE BUILDS IDENTITY. ‧ PINK BUILDS EMOTION. ‧ BLACK BUILDS STRUCTURE.
                  </p>
                  <p className={`text-[11px] ${themeClasses.bodySubText} mt-0.5`}>
                    白色建立空間 ‧ 藍色建立辨識 ‧ 粉色建立情緒 ‧ 黑色建立結構
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* 01 BASE */}
                <div className={`p-5 rounded-xl border space-y-3 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100">
                      01 / BASE
                    </span>
                    <span className="w-3.5 h-3.5 rounded-full bg-white border border-zinc-400 dark:border-zinc-500 shadow-xs"></span>
                  </div>
                  <div>
                    <h4 className={`text-sm font-bold font-mono ${themeClasses.bodyTitle}`}>
                      MUMㄠ WHITE
                    </h4>
                    <p className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                      建立空間與角色本體
                    </p>
                  </div>
                  <p className="text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
                    作為視覺系統的呼吸底襯，賦予畫面開闊感，承載角色本體與視覺空間。
                  </p>
                </div>

                {/* 02 IDENTITY */}
                <div className={`p-5 rounded-xl border space-y-3 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-[#437596]/15 text-[#2B5470] dark:text-[#90C2E4]">
                      02 / IDENTITY
                    </span>
                    <span className="w-3.5 h-3.5 rounded-full bg-[#437596] shadow-xs"></span>
                  </div>
                  <div>
                    <h4 className={`text-sm font-bold font-mono ${themeClasses.bodyTitle}`}>
                      WAVE BLUE
                    </h4>
                    <p className="text-xs font-bold text-[#2B5470] dark:text-[#90C2E4]">
                      建立音樂與品牌辨識
                    </p>
                  </div>
                  <p className="text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
                    貫穿全品牌的音波識別，鎖定音樂祭、活動標籤與關鍵視覺焦點。
                  </p>
                </div>

                {/* 03 ACCENT */}
                <div className={`p-5 rounded-xl border space-y-3 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-[#E8829C]/15 text-[#B83B5E] dark:text-[#FFB6C7]">
                      03 / ACCENT
                    </span>
                    <span className="w-3.5 h-3.5 rounded-full bg-[#E8829C] shadow-xs"></span>
                  </div>
                  <div>
                    <h4 className={`text-sm font-bold font-mono ${themeClasses.bodyTitle}`}>
                      EAR PINK
                    </h4>
                    <p className="text-xs font-bold text-[#B83B5E] dark:text-[#FFB6C7]">
                      建立情緒與角色溫度
                    </p>
                  </div>
                  <p className="text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
                    點睛之筆，少量置於耳朵與肉球，在冷靜音樂調性中注入溫度與生動性格。
                  </p>
                </div>

                {/* 04 STRUCTURE */}
                <div className={`p-5 rounded-xl border space-y-3 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-zinc-900 dark:bg-zinc-800 text-white">
                      04 / STRUCTURE
                    </span>
                    <span className="w-3.5 h-3.5 rounded-full bg-[#1E242B] border border-zinc-700 shadow-xs"></span>
                  </div>
                  <div>
                    <h4 className={`text-sm font-bold font-mono ${themeClasses.bodyTitle}`}>
                      CHARCOAL BLACK
                    </h4>
                    <p className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                      建立線條與資訊結構
                    </p>
                  </div>
                  <p className="text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
                    手繪輪廓線條、排版文字與網格邊框，支撐起整套識別系統的骨骼與可讀性。
                  </p>
                </div>
              </div>
            </div>

            {/* 06. PRODUCTION & MATERIAL APPLICATION (印刷與媒材應用) */}
            <div className={`p-6 sm:p-8 rounded-2xl border space-y-6 ${themeClasses.cardSubtleBg} ${themeClasses.borderBlueAccent}`}>
              <div className={`flex flex-col sm:flex-row sm:items-end justify-between border-b pb-4 gap-2 ${themeClasses.borderColSubtle}`}>
                <div>
                  <span className={`text-xs font-mono font-bold uppercase tracking-widest block ${isDark ? "text-[#6CA4C8]" : "text-[#437596]"}`}>
                    06 / PRODUCTION & MATERIAL APPLICATION
                  </span>
                  <h3 className={`text-xl font-bold font-mono mt-0.5 ${themeClasses.bodyTitle}`}>
                    PRODUCTION & MATERIAL APPLICATION / 印刷與媒材應用
                  </h3>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-[#437596] dark:text-[#6CA4C8]">
                    FROM SCREEN TO OBJECT.
                  </span>
                  <p className={`text-[11px] font-mono ${themeClasses.bodySubText}`}>
                    色彩系統從螢幕數位端延伸至實體物料
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {colorCraftSpecs.map((craft, idx) => {
                  const colorTitleClass = 
                    craft.color === "WAVE BLUE" 
                      ? "text-[#2B5470] dark:text-[#90C2E4]"
                      : craft.color === "EAR PINK"
                      ? "text-[#B83B5E] dark:text-[#FFB6C7]"
                      : "text-zinc-900 dark:text-zinc-100";

                  return (
                    <div 
                      key={idx} 
                      className={`p-5 rounded-xl border space-y-3 transition-all ${themeClasses.cardBg} ${themeClasses.borderColSubtle} hover:border-[#437596] dark:hover:border-[#6CA4C8]`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-3.5 h-3.5 rounded-full border border-black/20 dark:border-white/20 shadow-xs" style={{ backgroundColor: craft.hex }}></span>
                          <span className={`text-xs font-mono font-bold ${colorTitleClass}`}>
                            {craft.color}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700">
                          {craft.note}
                        </span>
                      </div>

                      <div>
                        <h4 className={`text-xs font-bold ${themeClasses.bodyTitle}`}>
                          {craft.medium}
                        </h4>
                        <p className="text-[11px] font-mono font-medium mt-0.5 text-zinc-600 dark:text-zinc-400">
                          {craft.craft}
                        </p>
                      </div>

                      <p className="text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
                        {craft.principle}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 07. COLOR CONTROL: DO & DON'T RULES (色彩控制原則與禁則) */}
            <div className={`p-6 sm:p-8 rounded-2xl border space-y-6 ${themeClasses.cardBg} ${themeClasses.borderColSubtle}`}>
              <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b pb-4 gap-2 border-black/5 dark:border-white/5">
                <div>
                  <span className={`text-xs font-mono font-bold uppercase tracking-widest block ${isDark ? "text-[#6CA4C8]" : isSepia ? "text-[#2B5573]" : "text-[#2B5573]"}`}>
                    07 / GUIDELINE RESTRICTIONS
                  </span>
                  <h3 className={`text-xl font-bold font-mono mt-0.5 ${themeClasses.bodyTitle}`}>
                    COLOR CONTROL / 色彩控制原則與禁則
                  </h3>
                </div>
                <span className={`text-xs font-mono font-medium ${isDark ? "text-zinc-400" : isSepia ? "text-[#5C4B3A]" : "text-zinc-600"}`}>
                  DO / DON'T COMPLIANCE MATRIX
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* DO */}
                <div className={`p-5 sm:p-6 rounded-xl border space-y-4 ${
                  isDark 
                    ? "bg-emerald-950/20 border-emerald-500/30" 
                    : isSepia 
                    ? "bg-[#EAF5EC] border-[#B8DEC0]" 
                    : "bg-emerald-50/90 border-emerald-300 shadow-xs"
                }`}>
                  <div className="flex items-center gap-2.5">
                    <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-emerald-700 text-white shadow-xs">
                      DO / 建議規範
                    </span>
                    <span className={`text-xs font-mono font-bold ${
                      isDark ? "text-emerald-300" : isSepia ? "text-[#1B5E20]" : "text-emerald-900"
                    }`}>
                      正確使用原則
                    </span>
                  </div>

                  <ul className={`space-y-3 text-xs font-mono ${
                    isDark ? "text-zinc-100" : isSepia ? "text-[#2B1B0C]" : "text-slate-900"
                  }`}>
                    <li className="flex items-start gap-2.5">
                      <span className={`font-black shrink-0 mt-0.5 text-sm leading-none ${
                        isDark ? "text-emerald-400" : isSepia ? "text-[#2E7D32]" : "text-emerald-700"
                      }`}>✓</span>
                      <span className="leading-relaxed"><strong className="font-bold">White 保持主要角色基底與空間</strong>：作為版面呼吸基礎與角色底襯。</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className={`font-black shrink-0 mt-0.5 text-sm leading-none ${
                        isDark ? "text-emerald-400" : isSepia ? "text-[#2E7D32]" : "text-emerald-700"
                      }`}>✓</span>
                      <span className="leading-relaxed"><strong className="font-bold">Blue 作為主要 Music Identity</strong>：用於音波鬍鬚、標籤、品牌識別與焦點文字。</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className={`font-black shrink-0 mt-0.5 text-sm leading-none ${
                        isDark ? "text-emerald-400" : isSepia ? "text-[#2E7D32]" : "text-emerald-700"
                      }`}>✓</span>
                      <span className="leading-relaxed"><strong className="font-bold">Pink 作為少量 Emotional Highlight</strong>：僅作為耳朵、肉球與微細節情緒點綴。</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className={`font-black shrink-0 mt-0.5 text-sm leading-none ${
                        isDark ? "text-emerald-400" : isSepia ? "text-[#2E7D32]" : "text-emerald-700"
                      }`}>✓</span>
                      <span className="leading-relaxed"><strong className="font-bold">Black 維持線條、文字與資訊結構</strong>：確保手繪直接感與版面資訊骨架清晰度。</span>
                    </li>
                  </ul>
                </div>

                {/* DON'T */}
                <div className={`p-5 sm:p-6 rounded-xl border space-y-4 ${
                  isDark 
                    ? "bg-rose-950/20 border-rose-500/30" 
                    : isSepia 
                    ? "bg-[#FDF0EE] border-[#F4C8C2]" 
                    : "bg-rose-50/90 border-rose-300 shadow-xs"
                }`}>
                  <div className="flex items-center gap-2.5">
                    <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-rose-700 text-white shadow-xs">
                      DON'T / 嚴格禁則
                    </span>
                    <span className={`text-xs font-mono font-bold ${
                      isDark ? "text-rose-300" : isSepia ? "text-[#B71C1C]" : "text-rose-900"
                    }`}>
                      禁止之色彩操作
                    </span>
                  </div>

                  <ul className={`space-y-3 text-xs font-mono ${
                    isDark ? "text-zinc-100" : isSepia ? "text-[#2B1B0C]" : "text-slate-900"
                  }`}>
                    <li className="flex items-start gap-2.5">
                      <span className={`font-black shrink-0 mt-0.5 text-sm leading-none ${
                        isDark ? "text-rose-400" : isSepia ? "text-[#C62828]" : "text-rose-700"
                      }`}>✕</span>
                      <span className="leading-relaxed"><strong className="font-bold">Pink 不可成為大面積主背景</strong>：粉紅過量會破壞次文化與音樂冷冽感。</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className={`font-black shrink-0 mt-0.5 text-sm leading-none ${
                        isDark ? "text-rose-400" : isSepia ? "text-[#C62828]" : "text-rose-700"
                      }`}>✕</span>
                      <span className="leading-relaxed"><strong className="font-bold">Blue 不可取代 White 成為角色主體</strong>：湛藍應保持為 Music Identity 與識別焦點。</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className={`font-black shrink-0 mt-0.5 text-sm leading-none ${
                        isDark ? "text-rose-400" : isSepia ? "text-[#C62828]" : "text-rose-700"
                      }`}>✕</span>
                      <span className="leading-relaxed"><strong className="font-bold">不任意加入新的品牌主色</strong>（如黃、綠、橘、紫）：嚴守四色核心色彩系統。</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className={`font-black shrink-0 mt-0.5 text-sm leading-none ${
                        isDark ? "text-rose-400" : isSepia ? "text-[#C62828]" : "text-rose-700"
                      }`}>✕</span>
                      <span className="leading-relaxed"><strong className="font-bold">不改變四種核心色彩的功能關係</strong>：保持 Body、Sound、Emotion、Line 的功能分工。</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className={`font-black shrink-0 mt-0.5 text-sm leading-none ${
                        isDark ? "text-rose-400" : isSepia ? "text-[#C62828]" : "text-rose-700"
                      }`}>✕</span>
                      <span className="leading-relaxed"><strong className="font-bold">不使用多色漸層破壞手繪角色質感</strong>：保持色塊純粹與手繪平塗質感。</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className={`font-black shrink-0 mt-0.5 text-sm leading-none ${
                        isDark ? "text-rose-400" : isSepia ? "text-[#C62828]" : "text-rose-700"
                      }`}>✕</span>
                      <span className="leading-relaxed"><strong className="font-bold">不任意改變 White / Blue / Pink 的核心比例邏輯</strong>：嚴格遵守 70 / 20 / 10 品牌色彩比例。</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Structural Black Non-Ratio Clarification */}
              <div className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 text-xs font-mono ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                <span className={`text-[11px] ${themeClasses.bodySubText}`}>
                  ※ Black 為 Structural Color，不受 70 / 20 / 10 比例限制，但需依資訊層級使用。
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-zinc-900 text-white shrink-0">
                  STRUCTURAL COMPLIANCE
                </span>
              </div>
            </div>

            {/* 08. COLOR PRINCIPLE (色彩跟著角色走 - 核心結論與公式) */}
            <div className={`p-6 sm:p-8 rounded-2xl border space-y-6 ${themeClasses.cardBg} ${themeClasses.borderBlueAccent}`}>
              <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b pb-4 gap-2 border-black/5 dark:border-white/5">
                <div>
                  <span className={`text-xs font-mono font-bold uppercase tracking-widest block ${isDark ? "text-[#6CA4C8]" : "text-[#437596]"}`}>
                    08 / CHAPTER CONCLUSION
                  </span>
                  <h3 className={`text-2xl font-black font-mono tracking-tight ${themeClasses.bodyTitle}`}>
                    COLOR FOLLOWS CHARACTER.
                  </h3>
                  <p className="text-xs font-bold text-zinc-600 dark:text-zinc-400 mt-0.5">
                    色彩跟著角色走。
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-[#437596] dark:text-[#6CA4C8]">
                    SCALABLE COLOR SYSTEM
                  </span>
                </div>
              </div>

              <div className="max-w-3xl">
                <p className={`text-xs sm:text-sm leading-relaxed ${themeClasses.bodyTitle}`}>
                  MUMㄠ 的色彩不是獨立存在的品牌裝飾，而是從角色本體、音樂語言、情緒特徵與手繪輪廓中自然延伸出的 Character Language。
                </p>
              </div>

              {/* Formula Card */}
              <div className={`p-5 rounded-xl border ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle} space-y-3`}>
                <span className={`text-[10px] font-mono font-bold uppercase tracking-widest block ${themeClasses.bodySubText}`}>
                  COLOR SYSTEM FORMULA / 色彩系統推導公式
                </span>
                <div className="flex flex-wrap items-center gap-2 font-mono text-xs sm:text-sm font-bold">
                  <span className="px-3 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border border-zinc-300 dark:border-zinc-700">
                    CHARACTER DNA
                  </span>
                  <span className="text-[#437596] dark:text-[#6CA4C8] font-black">＋</span>
                  <span className="px-3 py-1.5 rounded-lg bg-[#437596]/15 text-[#2B5470] dark:text-[#90C2E4] border border-[#437596]/30">
                    COLOR ROLES
                  </span>
                  <span className="text-[#437596] dark:text-[#6CA4C8] font-black">＋</span>
                  <span className="px-3 py-1.5 rounded-lg bg-[#E8829C]/15 text-[#B83B5E] dark:text-[#FFB6C7] border border-[#E8829C]/30">
                    USAGE RULES
                  </span>
                  <span className="text-[#437596] dark:text-[#6CA4C8] font-black">＝</span>
                  <span className="px-3 py-1.5 rounded-lg bg-[#437596] text-white shadow-xs">
                    SCALABLE COLOR SYSTEM
                  </span>
                </div>
                <p className={`text-xs font-mono ${themeClasses.bodySubText} pt-1`}>
                  角色 DNA ＋ 色彩角色 ＋ 使用規範 ＝ 可延伸的 MUMㄠ 色彩系統
                </p>
                <div className="pt-2 border-t border-black/5 dark:border-white/5 flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-mono font-bold text-[#437596] dark:text-[#6CA4C8]">
                    FIX THE DNA. SCALE THE LANGUAGE.
                  </span>
                  <span className={`text-[11px] font-mono ${themeClasses.bodySubText}`}>
                    固定角色 DNA，延伸視覺語言。
                  </span>
                </div>
              </div>
            </div>

            {/* Next Section Navigation Button */}
            <div className={`pt-6 flex justify-end border-t ${themeClasses.borderColSubtle}`}>
              <button
                type="button"
                onClick={() => scrollToSection("language-section")}
                className={`inline-flex items-center gap-4 px-6 py-3.5 rounded-xl border text-xs font-mono font-bold transition-all ${themeClasses.cardBg} ${themeClasses.borderColSubtle} hover:border-[#437596] hover:text-[#437596] dark:hover:border-[#6CA4C8] dark:hover:text-[#6CA4C8] group cursor-pointer`}
              >
                <div className="text-left">
                  <span className={`text-[10px] block font-mono uppercase tracking-widest ${themeClasses.bodySubText}`}>
                    NEXT SECTION
                  </span>
                  <span className="text-sm font-bold tracking-tight">
                    03 / BRAND LANGUAGE →
                  </span>
                </div>
              </button>
            </div>
          </section>


          {/* ===== 6. 03 / BRAND LANGUAGE (品牌語言系統) ===== */}
          <section id="language-section" className="pt-6 space-y-12 text-left">
            <SoundwaveDivider isDark={isDark} color={isDark ? "#6CA4C8" : "#437596"} className="mb-8" />
            
            {/* Section Header */}
            <div className={`flex flex-col sm:flex-row sm:items-end justify-between border-b pb-4 gap-4 ${themeClasses.borderCol}`}>
              <div>
                <div className="flex items-center gap-2">
                  <Sparkles className={`h-4 w-4 ${isDark ? "text-[#6CA4C8]" : "text-[#437596]"}`} />
                  <span className={`text-xs font-mono font-bold uppercase tracking-widest block ${isDark ? "text-[#6CA4C8]" : "text-[#437596]"}`}>
                    03 / BRAND LANGUAGE ‧ IP IDENTITY EXTENSION
                  </span>
                </div>
                <h2 className={`text-3xl font-bold font-mono mt-1 tracking-tight ${themeClasses.bodyTitle}`}>
                  03 / BRAND LANGUAGE
                </h2>
              </div>
              <div className="max-w-md">
                <p className={`text-xs leading-relaxed font-mono ${themeClasses.bodySubText}`}>
                  從角色 DNA 出發，建立 MUMㄠ 可被辨識、可被延伸的品牌語言。
                </p>
                <div className="flex flex-wrap items-center gap-1.5 mt-1 text-[10px] font-mono text-[#437596] dark:text-[#6CA4C8]">
                  <span className="font-bold">FROM CHARACTER DNA TO BRAND VOICE.</span>
                  <span className="opacity-70">From character DNA to a scalable brand language.</span>
                </div>
              </div>
            </div>

            {/* Core Proposition & Deduction Pipeline Banner */}
            <div className={`p-6 sm:p-8 rounded-2xl border ${themeClasses.cardBg} ${themeClasses.borderBlueAccent} space-y-5`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4 border-black/5 dark:border-white/5">
                <div className="space-y-1 max-w-2xl">
                  <span className={`text-xs font-mono font-bold uppercase tracking-widest block ${isDark ? "text-[#6CA4C8]" : "text-[#437596]"}`}>
                    CORE PROPOSITION / 核心命題
                  </span>
                  <h3 className={`text-xl sm:text-2xl font-black font-mono tracking-tight ${themeClasses.bodyTitle}`}>
                    角色不是獨立存在的插畫，而是所有品牌語言的來源。
                  </h3>
                </div>
                <span className={`text-xs font-mono font-bold px-3 py-1.5 rounded-lg border border-[#437596]/30 bg-[#437596]/10 text-[#437596] dark:text-[#6CA4C8] shrink-0`}>
                  CHARACTER → BRAND LANGUAGE
                </span>
              </div>

              {/* Deduction Pipeline Steps */}
              <div className={`p-4 rounded-xl border ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                <span className={`text-[10px] font-mono font-bold uppercase tracking-widest block mb-2.5 ${themeClasses.bodySubText}`}>
                  SYSTEM DERIVATION PIPELINE / 品牌語言推導路徑
                </span>
                <div className="flex flex-wrap items-center gap-2 text-xs font-mono font-bold">
                  <span className="px-2.5 py-1 rounded bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100">
                    CHARACTER DNA
                  </span>
                  <span className="text-[#437596] dark:text-[#6CA4C8]">→</span>
                  <span className="px-2.5 py-1 rounded bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100">
                    VISUAL CUES
                  </span>
                  <span className="text-[#437596] dark:text-[#6CA4C8]">→</span>
                  <span className="px-2.5 py-1 rounded bg-[#437596]/15 text-[#2B5470] dark:text-[#90C2E4]">
                    GRAPHIC ASSETS
                  </span>
                  <span className="text-[#437596] dark:text-[#6CA4C8]">→</span>
                  <span className="px-2.5 py-1 rounded bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100">
                    TYPOGRAPHY
                  </span>
                  <span className="text-[#437596] dark:text-[#6CA4C8]">→</span>
                  <span className="px-2.5 py-1 rounded bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100">
                    COMPOSITION
                  </span>
                  <span className="text-[#437596] dark:text-[#6CA4C8]">→</span>
                  <span className="px-2.5 py-1 rounded bg-[#E8829C]/15 text-[#B83B5E] dark:text-[#FFB6C7]">
                    VOICE
                  </span>
                  <span className="text-[#437596] dark:text-[#6CA4C8]">→</span>
                  <span className="px-3 py-1 rounded bg-[#437596] text-white shadow-xs">
                    MUMㄠ BRAND LANGUAGE
                  </span>
                </div>
              </div>
            </div>

            {/* SECTION 01: LANGUAGE DNA / 品牌語言來源 */}
            <div className={`p-6 sm:p-8 rounded-2xl border space-y-6 ${themeClasses.cardBg} ${themeClasses.borderColSubtle}`}>
              <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b pb-4 gap-2 border-black/5 dark:border-white/5">
                <div>
                  <span className={`text-xs font-mono font-bold uppercase tracking-widest block ${isDark ? "text-[#6CA4C8]" : "text-[#437596]"}`}>
                    01 / LANGUAGE DNA
                  </span>
                  <h3 className={`text-xl font-bold font-mono mt-0.5 ${themeClasses.bodyTitle}`}>
                    LANGUAGE DNA / 品牌語言來源
                  </h3>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-[#437596] dark:text-[#6CA4C8]">
                    WHERE DOES MUMㄠ'S LANGUAGE COME FROM?
                  </span>
                  <p className={`text-[11px] font-mono ${themeClasses.bodySubText}`}>
                    從角色 DNA 與文化場景推導品牌語言
                  </p>
                </div>
              </div>

              {/* 4 Source Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* 01 TAIWAN */}
                <div className={`p-5 rounded-xl border space-y-3 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100">
                      01 / SOURCE
                    </span>
                    <span className="text-[10px] font-mono font-bold text-[#437596] dark:text-[#6CA4C8]">LOCAL</span>
                  </div>
                  <div>
                    <h4 className={`text-sm font-bold font-mono ${themeClasses.bodyTitle}`}>
                      TAIWAN
                    </h4>
                    <p className="text-xs font-mono font-bold text-[#437596] dark:text-[#6CA4C8] mt-0.5">
                      LOCAL LANGUAGE
                    </p>
                  </div>
                  <p className={`text-xs leading-relaxed ${themeClasses.bodySubText}`}>
                    ㄠ、注音、台灣口語與在地文化記憶，形成 MUMㄠ 的文化語感。
                  </p>
                </div>

                {/* 02 MUSIC */}
                <div className={`p-5 rounded-xl border space-y-3 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-[#437596]/15 text-[#2B5470] dark:text-[#90C2E4]">
                      02 / SOURCE
                    </span>
                    <span className="text-[10px] font-mono font-bold text-[#437596] dark:text-[#6CA4C8]">SOUND</span>
                  </div>
                  <div>
                    <h4 className={`text-sm font-bold font-mono ${themeClasses.bodyTitle}`}>
                      MUSIC
                    </h4>
                    <p className="text-xs font-mono font-bold text-[#437596] dark:text-[#6CA4C8] mt-0.5">
                      RHYTHM & SOUND
                    </p>
                  </div>
                  <p className={`text-xs leading-relaxed ${themeClasses.bodySubText}`}>
                    音波、節奏、現場感與 Indie Music，形成 MUMㄠ 的音樂語感。
                  </p>
                </div>

                {/* 03 CHARACTER */}
                <div className={`p-5 rounded-xl border space-y-3 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-[#E8829C]/15 text-[#B83B5E] dark:text-[#FFB6C7]">
                      03 / SOURCE
                    </span>
                    <span className="text-[10px] font-mono font-bold text-[#E8829C] dark:text-[#FFB6C7]">DNA</span>
                  </div>
                  <div>
                    <h4 className={`text-sm font-bold font-mono ${themeClasses.bodyTitle}`}>
                      CHARACTER
                    </h4>
                    <p className="text-xs font-mono font-bold text-[#E8829C] dark:text-[#FFB6C7] mt-0.5">
                      CHARACTER FEATURES
                    </p>
                  </div>
                  <p className={`text-xs leading-relaxed ${themeClasses.bodySubText}`}>
                    鬍鬚、耳朵、手繪輪廓與角色動作，成為可被延伸的視覺資產。
                  </p>
                </div>

                {/* 04 SCENE */}
                <div className={`p-5 rounded-xl border space-y-3 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-zinc-900 dark:bg-zinc-800 text-white">
                      04 / SOURCE
                    </span>
                    <span className="text-[10px] font-mono font-bold text-zinc-400">SCENE</span>
                  </div>
                  <div>
                    <h4 className={`text-sm font-bold font-mono ${themeClasses.bodyTitle}`}>
                      SCENE
                    </h4>
                    <p className="text-xs font-mono font-bold text-zinc-600 dark:text-zinc-400 mt-0.5">
                      MUSIC CULTURE
                    </p>
                  </div>
                  <p className={`text-xs leading-relaxed ${themeClasses.bodySubText}`}>
                    音樂祭、舞台、社群與現場互動，讓 MUMㄠ 的角色語言進入真實文化場景。
                  </p>
                </div>
              </div>

              {/* Language DNA Equation */}
              <div className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                <div className="flex flex-wrap items-center gap-2 text-xs font-mono font-bold">
                  <span className="text-zinc-800 dark:text-zinc-200">TAIWAN</span>
                  <span className="text-[#437596] dark:text-[#6CA4C8]">＋</span>
                  <span className="text-[#437596] dark:text-[#6CA4C8]">MUSIC</span>
                  <span className="text-[#437596] dark:text-[#6CA4C8]">＋</span>
                  <span className="text-[#E8829C] dark:text-[#FFB6C7]">CHARACTER</span>
                  <span className="text-[#437596] dark:text-[#6CA4C8]">＋</span>
                  <span className="text-zinc-800 dark:text-zinc-200">SCENE</span>
                  <span className="text-[#437596] dark:text-[#6CA4C8]">＝</span>
                  <span className="text-[#437596] dark:text-[#6CA4C8] font-black">MUMㄠ BRAND LANGUAGE</span>
                </div>
                <span className={`text-[11px] font-mono shrink-0 ${themeClasses.bodySubText}`}>
                  角色 DNA 轉譯公式
                </span>
              </div>
            </div>

            {/* SECTION 02: TYPOGRAPHY LANGUAGE / 字體語言 */}
            <div className={`p-6 sm:p-8 rounded-2xl border space-y-6 ${themeClasses.cardBg} ${themeClasses.borderBlueAccent}`}>
              <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b pb-4 gap-2 border-black/5 dark:border-white/5">
                <div>
                  <span className={`text-xs font-mono font-bold uppercase tracking-widest block ${isDark ? "text-[#6CA4C8]" : "text-[#437596]"}`}>
                    02 / TYPOGRAPHY LANGUAGE
                  </span>
                  <h3 className={`text-xl font-bold font-mono mt-0.5 ${themeClasses.bodyTitle}`}>
                    TYPE IS PART OF THE CHARACTER.
                  </h3>
                  <p className="text-xs font-bold text-zinc-600 dark:text-zinc-400 mt-0.5">
                    字體也是角色的一部分 ‧ Typography = Personality
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-[#437596] dark:text-[#6CA4C8]">
                    3 TYPOGRAPHIC ROLES
                  </span>
                </div>
              </div>

              {/* 3 Typography Role Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* 01 CHARACTER VOICE */}
                <div className={`p-5 rounded-xl border flex flex-col justify-between space-y-4 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between border-b pb-2 border-black/5 dark:border-white/5">
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-zinc-900 dark:bg-zinc-800 text-white">
                        01 / CHARACTER VOICE
                      </span>
                      <span className="text-[10px] font-mono font-bold text-[#437596] dark:text-[#6CA4C8]">
                        BOLD / DIRECT / LOUD
                      </span>
                    </div>

                    {/* Specimen Box */}
                    <div className={`p-3 rounded-lg border text-center font-mono ${themeClasses.cardBg} ${themeClasses.borderColSubtle}`}>
                      <span className={`text-lg sm:text-xl font-black block tracking-tight ${themeClasses.bodyTitle}`}>
                        MUMㄠ! HERO
                      </span>
                      <span className={`text-[10px] font-bold block mt-1 text-[#437596] dark:text-[#6CA4C8]`}>
                        ALL HEART. ALL MUSIC.
                      </span>
                    </div>

                    <div className="space-y-1.5 text-xs">
                      <div>
                        <span className={`font-mono font-bold text-[10px] block ${themeClasses.bodySubText}`}>用途與角色：</span>
                        <p className={`leading-relaxed ${themeClasses.bodySubText}`}>
                          用於 MUMㄠ 主標題、Festival Hero 與 Campaign 主視覺。建立直接、明確、帶有角色個性的視覺聲音。
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 02 SYSTEM VOICE */}
                <div className={`p-5 rounded-xl border flex flex-col justify-between space-y-4 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between border-b pb-2 border-black/5 dark:border-white/5">
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#437596] text-white">
                        02 / SYSTEM VOICE
                      </span>
                      <span className="text-[10px] font-mono font-bold text-[#437596] dark:text-[#6CA4C8]">
                        MONOSPACE / SYSTEMATIC / TECHNICAL
                      </span>
                    </div>

                    {/* Specimen Box */}
                    <div className={`p-3 rounded-lg border text-left font-mono text-[11px] leading-relaxed ${themeClasses.cardBg} ${themeClasses.borderColSubtle}`}>
                      <div className="text-zinc-500 dark:text-zinc-400">SPEC: 2026.02.28 // STAGE_01</div>
                      <div className="font-bold text-[#437596] dark:text-[#6CA4C8]">CAT_ID: MUM-01 // RUNDOWN: 19:30</div>
                    </div>

                    <div className="space-y-1.5 text-xs">
                      <div>
                        <span className={`font-mono font-bold text-[10px] block ${themeClasses.bodySubText}`}>用途與角色：</span>
                        <p className={`leading-relaxed ${themeClasses.bodySubText}`}>
                          用於 Case Study、Label、Category、日期、編號與系統資訊。負責整理資訊並建立品牌系統感。
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 03 HUMAN VOICE */}
                <div className={`p-5 rounded-xl border flex flex-col justify-between space-y-4 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between border-b pb-2 border-black/5 dark:border-white/5">
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#E8829C] text-white">
                        03 / HUMAN VOICE
                      </span>
                      <span className="text-[10px] font-mono font-bold text-[#E8829C] dark:text-[#FFB6C7]">
                        RAW / HUMAN / PLAYFUL
                      </span>
                    </div>

                    {/* Specimen Box */}
                    <div className={`p-3 rounded-lg border text-center font-mono ${themeClasses.cardBg} ${themeClasses.borderColSubtle}`}>
                      <span className="text-base font-bold text-[#B83B5E] dark:text-[#FFB6C7] block">
                        「來聽歌啊」「今晚哪團？」
                      </span>
                      <span className={`text-[10px] block mt-1 ${themeClasses.bodySubText}`}>
                        泥巴踩下去就對了
                      </span>
                    </div>

                    <div className="space-y-1.5 text-xs">
                      <div>
                        <span className={`font-mono font-bold text-[10px] block ${themeClasses.bodySubText}`}>用途與角色：</span>
                        <p className={`leading-relaxed ${themeClasses.bodySubText}`}>
                          用於角色台詞、社群文字與 Festival Graphics。保留手寫感與不完美，讓 MUMㄠ 像一個真的人在說話。
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 03: GRAPHIC DNA / 圖形語彙 (Character Features -> Graphic Assets) */}
            <div className={`p-6 sm:p-8 rounded-2xl border space-y-6 ${themeClasses.cardBg} ${themeClasses.borderColSubtle}`}>
              <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b pb-4 gap-2 border-black/5 dark:border-white/5">
                <div>
                  <span className={`text-xs font-mono font-bold uppercase tracking-widest block ${isDark ? "text-[#6CA4C8]" : "text-[#437596]"}`}>
                    03 / GRAPHIC DNA
                  </span>
                  <h3 className={`text-xl font-bold font-mono mt-0.5 ${themeClasses.bodyTitle}`}>
                    CHARACTER FEATURES TO GRAPHIC ASSETS
                  </h3>
                  <p className="text-xs font-bold text-zinc-600 dark:text-zinc-400 mt-0.5">
                    圖形語彙 ‧ 角色特徵如何被轉換成品牌圖形資產
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-[#437596] dark:text-[#6CA4C8]">
                    CHARACTER → ABSTRACTION → ASSET → APPLICATION
                  </span>
                </div>
              </div>

              {/* 4 Graphic Asset Cards with 4-step derivation */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {/* 01 WAVE WHISKERS */}
                <div className={`p-5 rounded-xl border space-y-3.5 flex flex-col justify-between ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                  <div className="space-y-3">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#437596]/15 text-[#2B5470] dark:text-[#90C2E4]">
                      01 / WAVE WHISKERS
                    </span>
                    <h4 className={`text-sm font-bold font-mono ${themeClasses.bodyTitle}`}>
                      波浪鬍鬚音波資產
                    </h4>

                    {/* 4-Step Deduction Stack */}
                    <div className={`p-3 rounded-lg border font-mono text-[11px] space-y-2 ${themeClasses.cardBg} ${themeClasses.borderColSubtle}`}>
                      <div>
                        <span className="text-[9px] uppercase font-bold text-zinc-400 block">CHARACTER</span>
                        <p className={`font-medium text-xs ${themeClasses.bodyTitle}`}>MUMㄠ 的藍色波浪鬍鬚</p>
                      </div>
                      <div className="text-zinc-300 dark:text-zinc-700 text-center text-xs">↓</div>
                      <div>
                        <span className="text-[9px] uppercase font-bold text-[#437596] dark:text-[#6CA4C8] block">ABSTRACTION</span>
                        <p className={`text-xs ${themeClasses.bodySubText}`}>將鬍鬚視為音波與節奏的視覺符號</p>
                      </div>
                      <div className="text-zinc-300 dark:text-zinc-700 text-center text-xs">↓</div>
                      <div>
                        <span className="text-[9px] uppercase font-bold text-[#437596] dark:text-[#6CA4C8] block">ASSET</span>
                        <p className="font-bold text-[#437596] dark:text-[#6CA4C8] text-xs">Wave Graphic</p>
                      </div>
                      <div className="text-zinc-300 dark:text-zinc-700 text-center text-xs">↓</div>
                      <div>
                        <span className="text-[9px] uppercase font-bold text-zinc-500 dark:text-zinc-400 block">APPLICATION</span>
                        <p className="text-[10px] text-zinc-600 dark:text-zinc-400 font-bold">Festival / Social / Merch</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 02 HAND-DRAWN LINE */}
                <div className={`p-5 rounded-xl border space-y-3.5 flex flex-col justify-between ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                  <div className="space-y-3">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-zinc-900 dark:bg-zinc-800 text-white">
                      02 / HAND-DRAWN LINE
                    </span>
                    <h4 className={`text-sm font-bold font-mono ${themeClasses.bodyTitle}`}>
                      手繪線條筆觸資產
                    </h4>

                    {/* 4-Step Deduction Stack */}
                    <div className={`p-3 rounded-lg border font-mono text-[11px] space-y-2 ${themeClasses.cardBg} ${themeClasses.borderColSubtle}`}>
                      <div>
                        <span className="text-[9px] uppercase font-bold text-zinc-400 block">CHARACTER</span>
                        <p className={`font-medium text-xs ${themeClasses.bodyTitle}`}>角色手繪輪廓</p>
                      </div>
                      <div className="text-zinc-300 dark:text-zinc-700 text-center text-xs">↓</div>
                      <div>
                        <span className="text-[9px] uppercase font-bold text-zinc-600 dark:text-zinc-300 block">ABSTRACTION</span>
                        <p className={`text-xs ${themeClasses.bodySubText}`}>保留不完美、手工感與筆觸變化</p>
                      </div>
                      <div className="text-zinc-300 dark:text-zinc-700 text-center text-xs">↓</div>
                      <div>
                        <span className="text-[9px] uppercase font-bold text-zinc-800 dark:text-zinc-200 block">ASSET</span>
                        <p className="font-bold text-zinc-800 dark:text-zinc-200 text-xs">Hand-drawn Line</p>
                      </div>
                      <div className="text-zinc-300 dark:text-zinc-700 text-center text-xs">↓</div>
                      <div>
                        <span className="text-[9px] uppercase font-bold text-zinc-500 dark:text-zinc-400 block">APPLICATION</span>
                        <p className="text-[10px] text-zinc-600 dark:text-zinc-400 font-bold">Illustration / Frame / Graphic</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 03 LABEL SYSTEM */}
                <div className={`p-5 rounded-xl border space-y-3.5 flex flex-col justify-between ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                  <div className="space-y-3">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#437596]/15 text-[#2B5470] dark:text-[#90C2E4]">
                      03 / LABEL SYSTEM
                    </span>
                    <h4 className={`text-sm font-bold font-mono ${themeClasses.bodyTitle}`}>
                      模組化標籤系統
                    </h4>

                    {/* 4-Step Deduction Stack */}
                    <div className={`p-3 rounded-lg border font-mono text-[11px] space-y-2 ${themeClasses.cardBg} ${themeClasses.borderColSubtle}`}>
                      <div>
                        <span className="text-[9px] uppercase font-bold text-zinc-400 block">CHARACTER</span>
                        <p className={`font-medium text-xs ${themeClasses.bodyTitle}`}>角色原有的資訊標記與分類感</p>
                      </div>
                      <div className="text-zinc-300 dark:text-zinc-700 text-center text-xs">↓</div>
                      <div>
                        <span className="text-[9px] uppercase font-bold text-[#437596] dark:text-[#6CA4C8] block">ABSTRACTION</span>
                        <p className={`text-xs ${themeClasses.bodySubText}`}>將角色文化資訊整理成模組化標籤</p>
                      </div>
                      <div className="text-zinc-300 dark:text-zinc-700 text-center text-xs">↓</div>
                      <div>
                        <span className="text-[9px] uppercase font-bold text-[#437596] dark:text-[#6CA4C8] block">ASSET</span>
                        <p className="font-bold text-[#437596] dark:text-[#6CA4C8] text-xs">Label System</p>
                      </div>
                      <div className="text-zinc-300 dark:text-zinc-700 text-center text-xs">↓</div>
                      <div>
                        <span className="text-[9px] uppercase font-bold text-zinc-500 dark:text-zinc-400 block">APPLICATION</span>
                        <p className="text-[10px] text-zinc-600 dark:text-zinc-400 font-bold">Case Study / Festival / Social</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 04 MUMㄠ MARK */}
                <div className={`p-5 rounded-xl border space-y-3.5 flex flex-col justify-between ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                  <div className="space-y-3">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#E8829C]/15 text-[#B83B5E] dark:text-[#FFB6C7]">
                      04 / MUMㄠ MARK
                    </span>
                    <h4 className={`text-sm font-bold font-mono ${themeClasses.bodyTitle}`}>
                      在地超級識別印記
                    </h4>

                    {/* 4-Step Deduction Stack */}
                    <div className={`p-3 rounded-lg border font-mono text-[11px] space-y-2 ${themeClasses.cardBg} ${themeClasses.borderColSubtle}`}>
                      <div>
                        <span className="text-[9px] uppercase font-bold text-zinc-400 block">CHARACTER</span>
                        <p className={`font-medium text-xs ${themeClasses.bodyTitle}`}>「ㄠ」與角色名稱的識別關係</p>
                      </div>
                      <div className="text-zinc-300 dark:text-zinc-700 text-center text-xs">↓</div>
                      <div>
                        <span className="text-[9px] uppercase font-bold text-[#E8829C] dark:text-[#FFB6C7] block">ABSTRACTION</span>
                        <p className={`text-xs ${themeClasses.bodySubText}`}>將台灣語言符號轉化為角色識別標記</p>
                      </div>
                      <div className="text-zinc-300 dark:text-zinc-700 text-center text-xs">↓</div>
                      <div>
                        <span className="text-[9px] uppercase font-bold text-[#B83B5E] dark:text-[#FFB6C7] block">ASSET</span>
                        <p className="font-bold text-[#B83B5E] dark:text-[#FFB6C7] text-xs">MUMㄠ Mark</p>
                      </div>
                      <div className="text-zinc-300 dark:text-zinc-700 text-center text-xs">↓</div>
                      <div>
                        <span className="text-[9px] uppercase font-bold text-zinc-500 dark:text-zinc-400 block">APPLICATION</span>
                        <p className="text-[10px] text-zinc-600 dark:text-zinc-400 font-bold">Merch / Social / Identity</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 04: COMPOSITION LANGUAGE / 構圖語言 */}
            <div className={`p-6 sm:p-8 rounded-2xl border space-y-6 ${themeClasses.cardBg} ${themeClasses.borderBlueAccent}`}>
              <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b pb-4 gap-2 border-black/5 dark:border-white/5">
                <div>
                  <span className={`text-xs font-mono font-bold uppercase tracking-widest block ${isDark ? "text-[#6CA4C8]" : "text-[#437596]"}`}>
                    04 / COMPOSITION LANGUAGE
                  </span>
                  <h3 className={`text-xl font-bold font-mono mt-0.5 ${themeClasses.bodyTitle}`}>
                    COMPOSITION LANGUAGE / 構圖語言
                  </h3>
                </div>
                <div className="text-right font-mono">
                  <p className={`text-xs font-bold ${isDark ? "text-[#6CA4C8]" : "text-[#437596]"}`}>
                    SYSTEM CONTROLS INFORMATION. CHARACTER BREAKS THE SYSTEM.
                  </p>
                  <p className={`text-[11px] ${themeClasses.bodySubText} mt-0.5`}>
                    系統負責整理資訊，角色負責打破秩序。
                  </p>
                </div>
              </div>

              {/* 4 Composition Principles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* 01 ONE HERO */}
                <div className={`p-5 rounded-xl border space-y-2.5 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-zinc-900 dark:bg-zinc-800 text-white">
                    01 / ONE HERO
                  </span>
                  <h4 className={`text-sm font-bold font-mono ${themeClasses.bodyTitle}`}>
                    單一主視覺焦點
                  </h4>
                  <p className={`text-xs leading-relaxed ${themeClasses.bodySubText}`}>
                    一個畫面只保留一個主要視覺焦點，確保角色與訊息能快速被辨識。
                  </p>
                </div>

                {/* 02 GRID + IMPERFECTION */}
                <div className={`p-5 rounded-xl border space-y-2.5 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#437596]/15 text-[#2B5470] dark:text-[#90C2E4]">
                    02 / GRID + IMPERFECTION
                  </span>
                  <h4 className={`text-sm font-bold font-mono ${themeClasses.bodyTitle}`}>
                    理性格線＋手繪不完美
                  </h4>
                  <p className={`text-xs leading-relaxed ${themeClasses.bodySubText}`}>
                    以 Swiss Grid 建立資訊秩序，再加入手繪線條與角色元素，形成理性與個性的張力。
                  </p>
                </div>

                {/* 03 OPEN SPACE */}
                <div className={`p-5 rounded-xl border space-y-2.5 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100">
                    03 / OPEN SPACE
                  </span>
                  <h4 className={`text-sm font-bold font-mono ${themeClasses.bodyTitle}`}>
                    開放呼吸留白
                  </h4>
                  <p className={`text-xs leading-relaxed ${themeClasses.bodySubText}`}>
                    保留足夠的空間讓角色與訊息呼吸，使 MUMㄠ 成為畫面中的視覺主角。
                  </p>
                </div>

                {/* 04 BREAK THE GRID */}
                <div className={`p-5 rounded-xl border space-y-2.5 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#E8829C]/15 text-[#B83B5E] dark:text-[#FFB6C7]">
                    04 / BREAK THE GRID
                  </span>
                  <h4 className={`text-sm font-bold font-mono ${themeClasses.bodyTitle}`}>
                    角色突破框架
                  </h4>
                  <p className={`text-xs leading-relaxed ${themeClasses.bodySubText}`}>
                    允許角色、音波或手繪元素突破格線，製造現場感與非正式的文化氣氛。
                  </p>
                </div>
              </div>
            </div>

            {/* SECTION 05: IMAGE LANGUAGE / 影像語言 */}
            <div className={`p-6 sm:p-8 rounded-2xl border space-y-6 ${themeClasses.cardBg} ${themeClasses.borderColSubtle}`}>
              <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b pb-4 gap-2 border-black/5 dark:border-white/5">
                <div>
                  <span className={`text-xs font-mono font-bold uppercase tracking-widest block ${isDark ? "text-[#6CA4C8]" : "text-[#437596]"}`}>
                    05 / IMAGE LANGUAGE
                  </span>
                  <h3 className={`text-xl font-bold font-mono mt-0.5 ${themeClasses.bodyTitle}`}>
                    IMAGE LANGUAGE / 影像語言
                  </h3>
                  <p className="text-xs font-bold text-zinc-600 dark:text-zinc-400 mt-0.5">
                    從「角色插畫」走向「文化角色」的影像質地
                  </p>
                </div>
                <span className={`text-xs font-mono ${themeClasses.bodySubText}`}>
                  LIVE ‧ RAW ‧ PLAYFUL ‧ HUMAN
                </span>
              </div>

              {/* 4 Image Keywords */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className={`p-4 rounded-xl border space-y-1.5 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                  <span className="text-xs font-mono font-bold text-[#437596] dark:text-[#6CA4C8] block">LIVE / 現場感</span>
                  <h4 className={`text-sm font-bold ${themeClasses.bodyTitle}`}>音樂祭與真實現場</h4>
                  <p className={`text-xs leading-relaxed ${themeClasses.bodySubText}`}>音樂祭、舞台、群眾與真實現場環境。</p>
                </div>

                <div className={`p-4 rounded-xl border space-y-1.5 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                  <span className="text-xs font-mono font-bold text-zinc-700 dark:text-zinc-300 block">RAW / 真實感</span>
                  <h4 className={`text-sm font-bold ${themeClasses.bodyTitle}`}>自然生活狀態</h4>
                  <p className={`text-xs leading-relaxed ${themeClasses.bodySubText}`}>自然光、手持感、未過度修飾的生活狀態。</p>
                </div>

                <div className={`p-4 rounded-xl border space-y-1.5 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                  <span className="text-xs font-mono font-bold text-[#E8829C] dark:text-[#FFB6C7] block">PLAYFUL / 玩心</span>
                  <h4 className={`text-sm font-bold ${themeClasses.bodyTitle}`}>趣味現場互動</h4>
                  <p className={`text-xs leading-relaxed ${themeClasses.bodySubText}`}>角色與人、道具、音樂現場產生互動。</p>
                </div>

                <div className={`p-4 rounded-xl border space-y-1.5 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                  <span className="text-xs font-mono font-bold text-zinc-700 dark:text-zinc-300 block">HUMAN / 人的痕跡</span>
                  <h4 className={`text-sm font-bold ${themeClasses.bodyTitle}`}>真實生活溫度</h4>
                  <p className={`text-xs leading-relaxed ${themeClasses.bodySubText}`}>汗水、混亂、手勢、表情與真實情緒。</p>
                </div>
              </div>

              {/* ENCOURAGE vs. AVOID 對照 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* ENCOURAGE */}
                <div className={`p-5 rounded-xl border space-y-3.5 ${
                  isDark ? "bg-emerald-950/20 border-emerald-500/30" : "bg-emerald-50/80 border-emerald-300"
                }`}>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-emerald-700 text-white">
                      ENCOURAGE / 建議影像方向
                    </span>
                    <span className={`text-xs font-mono font-bold ${isDark ? "text-emerald-300" : "text-emerald-900"}`}>
                      文化現場真實質地
                    </span>
                  </div>
                  <ul className={`space-y-2 text-xs font-mono ${isDark ? "text-zinc-200" : "text-slate-900"}`}>
                    <li className="flex items-center gap-2">
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold">✓</span>
                      <span>音樂祭現場：草皮、舞台光線、人群與泥土</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold">✓</span>
                      <span>社群日常：手持視角、自然光、隨拍紀錄</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold">✓</span>
                      <span>互動與動態：甩毛巾、合照、開衝瞬間</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold">✓</span>
                      <span>非完美構圖：真實生活的隨機感與呼吸空間</span>
                    </li>
                  </ul>
                </div>

                {/* AVOID */}
                <div className={`p-5 rounded-xl border space-y-3.5 ${
                  isDark ? "bg-rose-950/20 border-rose-500/30" : "bg-rose-50/80 border-rose-300"
                }`}>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-rose-700 text-white">
                      AVOID / 避開影像風格
                    </span>
                    <span className={`text-xs font-mono font-bold ${isDark ? "text-rose-300" : "text-rose-900"}`}>
                      破壞次文化感之影像
                    </span>
                  </div>
                  <ul className={`space-y-2 text-xs font-mono ${isDark ? "text-zinc-200" : "text-slate-900"}`}>
                    <li className="flex items-center gap-2">
                      <span className="text-rose-600 dark:text-rose-400 font-bold">✕</span>
                      <span>過度精緻：過度修圖與塑膠感 3D 渲染</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-rose-600 dark:text-rose-400 font-bold">✕</span>
                      <span>過度商業棚拍：死板白背景商品定裝照與 Luxury 風格</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-rose-600 dark:text-rose-400 font-bold">✕</span>
                      <span>純萌寵可愛感：失去獨立音樂個性與態度</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-rose-600 dark:text-rose-400 font-bold">✕</span>
                      <span>完全無情境：缺乏生活與音樂祭現場脈絡</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

            {/* ===== 7. 04 / CULTURAL APPLICATION (文化場景與角色應用) ===== */}
          <section id="festival-section" className="pt-6 space-y-16 text-left">
            <SoundwaveDivider isDark={isDark} color={isDark ? "#6CA4C8" : "#437596"} className="mb-8" />
            
            {/* Section Header */}
            <div className={`flex flex-col sm:flex-row sm:items-end justify-between border-b pb-4 gap-4 ${themeClasses.borderCol}`}>
              <div>
                <div className="flex items-center gap-2">
                  <Compass className={`h-4 w-4 ${isDark ? "text-[#6CA4C8]" : "text-[#437596]"}`} />
                  <span className={`text-xs font-mono font-bold uppercase tracking-widest block ${isDark ? "text-[#6CA4C8]" : "text-[#437596]"}`}>
                    04 / CULTURAL APPLICATION ‧ APPLICATION SYSTEM
                  </span>
                </div>
                <h2 className={`text-3xl font-bold font-mono mt-1 tracking-tight ${themeClasses.bodyTitle}`}>
                  04 / CULTURAL APPLICATION <span className="block sm:inline font-normal text-xl sm:text-2xl mt-1 sm:mt-0">文化場景與角色應用</span>
                </h2>
              </div>

              <div className="max-w-md space-y-1">
                <span className={`text-xs font-mono font-bold uppercase tracking-widest block ${isDark ? "text-[#6CA4C8]" : "text-[#437596]"}`}>
                  FROM CHARACTER TO CULTURAL PRESENCE.
                </span>
                <p className={`text-xs leading-relaxed font-mono ${themeClasses.bodySubText}`}>
                  從角色 DNA 出發，讓 MUMㄠ 進入真實文化場景，並在不同情境中發展不同的角色功能。
                </p>
                <p className={`text-[11px] leading-relaxed font-mono text-zinc-400 dark:text-zinc-500`}>
                  From character DNA to real-world cultural presence, MUMㄠ adapts its role across different contexts.
                </p>
                <span className={`text-[10px] font-mono block pt-1 ${isDark ? "text-[#6CA4C8]" : "text-[#437596]"}`}>
                  CHARACTER → CULTURE → ROLE → APPLICATION → MEMORY
                </span>
              </div>
            </div>

            {/* ========================================================
                BLOCK 01: 01 / CULTURAL POSITIONING (文化角色定位)
               ======================================================== */}
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b pb-2 gap-2 border-black/5 dark:border-white/5">
                <div>
                  <span className={`text-xs font-mono font-bold uppercase tracking-widest block ${isDark ? "text-[#6CA4C8]" : "text-[#437596]"}`}>
                    01 / CULTURAL POSITIONING
                  </span>
                  <h3 className={`text-xl font-bold font-mono ${themeClasses.bodyTitle}`}>
                    CULTURAL POSITIONING / 文化角色定位
                  </h3>
                </div>
                <span className={`text-[11px] font-mono ${themeClasses.bodySubText}`}>
                  ROLE ADAPTATION IN CULTURAL SCENES
                </span>
              </div>

              {/* Anchor Statement Card */}
              <div className={`p-8 rounded-2xl border ${themeClasses.cardBg} ${themeClasses.borderBlueAccent} flex flex-col md:flex-row md:items-center justify-between gap-6`}>
                <div className="space-y-3 max-w-2xl">
                  <span className={`text-xs font-mono font-bold uppercase tracking-widest block ${isDark ? "text-[#6CA4C8]" : "text-[#437596]"}`}>
                    CULTURAL POSITIONING
                  </span>
                  <h4 className={`text-3xl sm:text-4xl font-black font-mono tracking-tight leading-tight ${themeClasses.bodyTitle}`}>
                    FROM CHARACTER<br className="hidden sm:inline" /> TO CULTURE. <span className="block text-xl sm:text-2xl mt-1 font-bold">／ 從角色延伸至文化現場</span>
                  </h4>
                  
                  {/* Chinese enhanced explanation */}
                  <p className={`text-sm sm:text-base font-bold font-mono ${isDark ? "text-zinc-200" : "text-zinc-800"}`}>
                    「MUMㄠ 不只是出現在活動裡，而是透過不同文化場景改變角色功能，逐步成為現場文化的一部分。」
                  </p>

                  {/* English enhanced explanation */}
                  <p className={`text-xs leading-relaxed font-mono ${themeClasses.bodySubText}`}>
                    MUMㄠ does not simply appear at events. The character enters different cultural contexts, adapts its role, and becomes part of the scene.
                  </p>
                </div>

                <div className={`p-5 rounded-xl border text-right font-mono text-xs space-y-2 shrink-0 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                  <span className={`block uppercase font-bold text-[10px] ${themeClasses.bodySubText}`}>IP ARCHIVE TYPE</span>
                  <div className={`text-xs font-bold leading-relaxed ${isDark ? "text-[#6CA4C8]" : "text-[#437596]"}`}>
                    IP ROLE MODEL<br />
                    CULTURAL APPLICATION<br />
                    <span className="text-zinc-400">─────</span><br />
                    <span className="text-[10px] text-zinc-400">ROLE EVOLUTION MODEL</span>
                  </div>
                </div>
              </div>
            </div>

            {/* ========================================================
                BLOCK 02: 02 / CAMPAIGN CASE STUDY (三大文化場景中的角色演變)
               ======================================================== */}
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b pb-2 gap-2 border-black/5 dark:border-white/5">
                <div>
                  <span className={`text-xs font-mono font-bold uppercase tracking-widest block ${isDark ? "text-[#6CA4C8]" : "text-[#437596]"}`}>
                    02 / CAMPAIGN CASE STUDY
                  </span>
                  <h3 className={`text-xl font-bold font-mono ${themeClasses.bodyTitle}`}>
                    CAMPAIGN CASE STUDY / 三大文化場景中的角色演變
                  </h3>
                </div>
                <span className={`text-[11px] font-mono ${themeClasses.bodySubText}`}>
                  HOW MUMㄠ CHANGES ITS ROLE ACROSS CULTURAL CONTEXTS.
                </span>
              </div>

              {/* Case Study Grid: Primary Case (Wide) + 2 Secondary Cases */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {festivalCampaigns.map((fest) => {
                  if (fest.isPrimary) {
                    {/* PRIMARY CASE STUDY: EMERGE FESTIVAL (CASE 01 / MUSIC) */}
                    return (
                      <div
                        key={fest.id}
                        className={`lg:col-span-12 p-6 sm:p-8 rounded-2xl border space-y-6 transition-all ${themeClasses.cardBg} ${themeClasses.borderBlueAccent}`}
                      >
                        <div className="flex flex-col md:flex-row gap-6 items-stretch">
                          {/* Left Image */}
                          <div className={`w-full md:w-5/12 aspect-square md:aspect-auto rounded-xl overflow-hidden bg-slate-100/5 border relative shrink-0 ${themeClasses.borderColSubtle}`}>
                            <img
                              src={fest.image}
                              alt={fest.name}
                              draggable={false}
                              loading="lazy"
                              decoding="async"
                              className="w-full h-full object-cover pointer-events-none"
                            />
                            <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                              <span className="px-2.5 py-1 rounded bg-zinc-900 text-white font-mono text-[10px] font-bold">
                                CASE 01 / MUSIC
                              </span>
                              <span className="px-2.5 py-1 rounded bg-[#437596] text-white font-mono text-[10px] font-bold">
                                {fest.category}
                              </span>
                            </div>
                          </div>

                          {/* Right Content */}
                          <div className="w-full md:w-7/12 flex flex-col justify-between space-y-4">
                            <div className="space-y-3">
                              <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-2 border-black/5 dark:border-white/5">
                                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-zinc-800 text-white">
                                  EVENT FIELD: {fest.eventField}
                                </span>
                                <div className={`flex items-center gap-3 text-xs font-mono ${themeClasses.bodySubText}`}>
                                  <div className="flex items-center gap-1">
                                    <MapPin className="h-3 w-3 text-[#437596] dark:text-[#6CA4C8]" />
                                    <span>{fest.location}</span>
                                  </div>
                                  <span>{fest.year}</span>
                                </div>
                              </div>

                              <div>
                                <span className={`text-xs font-mono font-bold uppercase tracking-widest block ${isDark ? "text-[#6CA4C8]" : "text-[#437596]"}`}>
                                  {fest.category}
                                </span>
                                <h4 className={`text-2xl font-black font-mono tracking-tight mt-0.5 ${themeClasses.bodyTitle}`}>
                                  {fest.name}
                                </h4>
                              </div>

                              {/* Role Positioning Card */}
                              <div className={`p-4 rounded-xl border space-y-2 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                                <div className="flex items-center justify-between">
                                  <span className="text-[10px] font-bold font-mono uppercase px-2 py-0.5 rounded bg-[#437596] text-white">
                                    MUMㄠ ROLE: {fest.role}
                                  </span>
                                  <span className="text-[10px] font-mono text-zinc-400">ROLE 01</span>
                                </div>
                                <p className={`font-bold font-mono text-sm ${themeClasses.bodyTitle}`}>
                                  {fest.roleZh}
                                </p>
                                <p className={`text-xs leading-relaxed font-mono ${themeClasses.bodyText}`}>
                                  {fest.focusPoint}
                                </p>

                                {/* 3 Core Concept Badges */}
                                <div className="pt-2 border-t flex flex-wrap items-center gap-2 border-black/5 dark:border-white/5">
                                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/5 dark:bg-white/5 text-zinc-700 dark:text-zinc-300">
                                    <strong className="text-[#437596] dark:text-[#6CA4C8]">ROLE /</strong> 陪伴
                                  </span>
                                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/5 dark:bg-white/5 text-zinc-700 dark:text-zinc-300">
                                    <strong className="text-[#437596] dark:text-[#6CA4C8]">CONTEXT /</strong> MUSIC FESTIVAL
                                  </span>
                                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/5 dark:bg-white/5 text-zinc-700 dark:text-zinc-300">
                                    <strong className="text-[#437596] dark:text-[#6CA4C8]">FUNCTION /</strong> 建立現場親近感
                                  </span>
                                </div>
                              </div>

                              {/* Cultural Connection */}
                              <div className="space-y-1 font-mono text-xs">
                                <span className={`text-[10px] font-bold uppercase block ${themeClasses.bodySubText}`}>
                                  CULTURAL CONNECTION
                                </span>
                                <p className={`leading-relaxed ${themeClasses.bodySubText}`}>
                                  {fest.culturalConnection}
                                </p>
                              </div>
                            </div>

                            <div className={`pt-3 border-t flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] font-mono ${themeClasses.borderColSubtle}`}>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-[#437596] dark:text-[#6CA4C8]">VISUAL OUTPUT:</span>
                                <span className={themeClasses.bodySubText}>{fest.visualOutput}</span>
                              </div>
                              <span className="text-[10px] text-zinc-400">PRIMARY FEATURED CASE</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  }

                  {/* SECONDARY CASES: CASE 02 / ART & CASE 03 / FIELD */}
                  const isArtCase = fest.id === "taipei-art-book";
                  const roleTag = isArtCase ? "CASE 02 / ART" : "CASE 03 / FIELD";
                  const roleKeyword = isArtCase ? "參與" : "融入";
                  const roleContext = isArtCase ? "ART / ZINE / PUBLISHING" : "FIELD / OUTDOOR FESTIVAL";
                  const roleFunction = isArtCase ? "建立文化辨識度" : "建立文化記憶";

                  return (
                    <div
                      key={fest.id}
                      className={`lg:col-span-6 p-6 rounded-2xl border space-y-5 flex flex-col justify-between transition-all ${themeClasses.cardBg} ${themeClasses.borderColSubtle} hover:border-[#437596] dark:hover:border-[#6CA4C8]`}
                    >
                      <div className="space-y-4">
                        <div className={`relative aspect-video rounded-xl overflow-hidden bg-slate-100/5 border ${themeClasses.borderColSubtle}`}>
                          <img
                            src={fest.image}
                            alt={fest.name}
                            draggable={false}
                            loading="lazy"
                            decoding="async"
                            className="w-full h-full object-cover pointer-events-none"
                          />
                          <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                            <span className="px-2 py-0.5 rounded bg-zinc-900 text-white font-mono text-[10px] font-bold">
                              {roleTag}
                            </span>
                            <span className="px-2 py-0.5 rounded bg-zinc-800/80 text-white font-mono text-[10px] font-bold">
                              {fest.category}
                            </span>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className={`flex items-center justify-between text-xs font-mono ${themeClasses.bodySubText}`}>
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3 text-[#437596] dark:text-[#6CA4C8]" />
                              <span>{fest.location}</span>
                            </div>
                            <span>{fest.year}</span>
                          </div>

                          <h4 className={`text-xl font-bold font-mono leading-tight ${themeClasses.bodyTitle}`}>
                            {fest.name}
                          </h4>

                          {/* Role Positioning Card */}
                          <div className={`p-3.5 rounded-xl border font-mono text-xs space-y-2 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-bold uppercase text-[#437596] dark:text-[#6CA4C8]">
                                MUMㄠ ROLE: {fest.role}
                              </span>
                              <span className="text-[10px] text-zinc-400 font-bold">【{roleKeyword}】</span>
                            </div>
                            <p className={`font-bold ${themeClasses.bodyTitle}`}>{fest.roleZh}</p>
                            <p className={`text-xs leading-relaxed ${themeClasses.bodyText}`}>
                              {fest.focusPoint}
                            </p>

                            {/* 3 Core Concept Badges */}
                            <div className="pt-2 border-t flex flex-wrap items-center gap-1.5 border-black/5 dark:border-white/5">
                              <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-black/5 dark:bg-white/5 text-zinc-700 dark:text-zinc-300">
                                <strong className="text-[#437596] dark:text-[#6CA4C8]">ROLE /</strong> {roleKeyword}
                              </span>
                              <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-black/5 dark:bg-white/5 text-zinc-700 dark:text-zinc-300">
                                <strong className="text-[#437596] dark:text-[#6CA4C8]">CONTEXT /</strong> {roleContext}
                              </span>
                              <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-black/5 dark:bg-white/5 text-zinc-700 dark:text-zinc-300">
                                <strong className="text-[#437596] dark:text-[#6CA4C8]">FUNCTION /</strong> {roleFunction}
                              </span>
                            </div>

                            {/* Art case specific proof statement */}
                            {isArtCase && (
                              <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-[11px] font-bold text-amber-600 dark:text-amber-400">
                                「文化定位延伸：證明 MUMㄠ 不被『音樂祭吉祥物』單一定位限制。」
                              </div>
                            )}
                          </div>

                          <div className="space-y-1 pt-1 font-mono text-xs">
                            <span className={`text-[10px] font-bold uppercase block ${themeClasses.bodySubText}`}>
                              CULTURAL CONNECTION
                            </span>
                            <p className={`text-xs leading-relaxed ${themeClasses.bodySubText}`}>{fest.culturalConnection}</p>
                          </div>
                        </div>
                      </div>

                      <div className={`pt-3 border-t font-mono text-[11px] space-y-1 ${themeClasses.borderColSubtle}`}>
                        <span className="font-bold text-[#437596] dark:text-[#6CA4C8] block">VISUAL OUTPUT</span>
                        <p className={`text-[10px] ${themeClasses.bodySubText}`}>{fest.visualOutput}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ========================================================
                BLOCK 03: 04 / ROLE EVOLUTION (角色定位演變)
               ======================================================== */}
            <div className={`p-6 sm:p-8 rounded-2xl border space-y-6 ${themeClasses.cardBg} ${themeClasses.borderColSubtle}`}>
              <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b pb-4 gap-2 border-black/5 dark:border-white/5">
                <div>
                  <span className={`text-xs font-mono font-bold uppercase tracking-widest block ${isDark ? "text-[#6CA4C8]" : "text-[#437596]"}`}>
                    03 / ROLE EVOLUTION
                  </span>
                  <h3 className={`text-xl font-bold font-mono mt-0.5 ${themeClasses.bodyTitle}`}>
                    ROLE EVOLUTION / 角色定位演變
                  </h3>
                </div>
                <span className={`text-xs font-mono ${themeClasses.bodySubText}`}>
                  FROM AUDIENCE COMPANION TO CULTURAL PRESENCE.
                </span>
              </div>

              {/* 3 Columns */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* 01 MUSIC */}
                <div className={`p-5 rounded-xl border space-y-3 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-[#437596] text-white">
                      01 / MUSIC
                    </span>
                    <span className="text-xs font-mono font-black text-[#437596] dark:text-[#6CA4C8]">陪伴</span>
                  </div>
                  <div>
                    <h4 className={`text-base font-bold font-mono ${themeClasses.bodyTitle}`}>
                      AUDIENCE COMPANION
                    </h4>
                    <p className={`text-xs font-bold text-[#437596] dark:text-[#6CA4C8] mt-0.5`}>
                      現場陪伴角色
                    </p>
                  </div>
                  <p className={`text-xs leading-relaxed ${themeClasses.bodySubText}`}>
                    從觀眾身邊開始，建立 MUMㄠ 與音樂現場的第一層關係。
                  </p>
                </div>

                {/* 02 ART */}
                <div className={`p-5 rounded-xl border space-y-3 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-zinc-800 text-white">
                      02 / ART
                    </span>
                    <span className="text-xs font-mono font-black text-zinc-300">參與</span>
                  </div>
                  <div>
                    <h4 className={`text-base font-bold font-mono ${themeClasses.bodyTitle}`}>
                      INDEPENDENT CULTURE CHARACTER
                    </h4>
                    <p className={`text-xs font-bold text-[#437596] dark:text-[#6CA4C8] mt-0.5`}>
                      獨立文化角色
                    </p>
                  </div>
                  <p className={`text-xs leading-relaxed ${themeClasses.bodySubText}`}>
                    從音樂現場延伸至出版與藝術文化，建立角色本身的文化辨識度。
                  </p>
                </div>

                {/* 03 FIELD */}
                <div className={`p-5 rounded-xl border space-y-3 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-pink-900/40 text-pink-300 border border-pink-500/20">
                      03 / FIELD
                    </span>
                    <span className="text-xs font-mono font-black text-[#E8829C]">融入</span>
                  </div>
                  <div>
                    <h4 className={`text-base font-bold font-mono ${themeClasses.bodyTitle}`}>
                      CULTURAL PRESENCE
                    </h4>
                    <p className={`text-xs font-bold text-[#E8829C] mt-0.5`}>
                      文化現場角色
                    </p>
                  </div>
                  <p className={`text-xs leading-relaxed ${themeClasses.bodySubText}`}>
                    角色進一步融入戶外音樂與生活場景，成為現場氛圍與文化記憶的一部分。
                  </p>
                </div>
              </div>

              {/* Role Evolution Pipeline */}
              <div className="p-4 rounded-xl border border-black/5 dark:border-white/5 bg-black/5 dark:bg-white/5 font-mono space-y-3">
                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 block">
                  ROLE EVOLUTION PIPELINE ‧ 角色演變流程
                </span>
                
                <div className="flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm font-bold">
                  <div className="flex items-center gap-2 p-2.5 rounded-lg bg-[#437596]/15 border border-[#437596]/30">
                    <span className="text-[#437596] dark:text-[#6CA4C8]">MUSIC</span>
                    <span className="text-zinc-300">|</span>
                    <span className={themeClasses.bodyTitle}>陪伴 / Companion</span>
                  </div>
                  <span className="text-zinc-400 font-black">→</span>
                  <div className="flex items-center gap-2 p-2.5 rounded-lg bg-zinc-800/40 border border-zinc-700/60">
                    <span className="text-zinc-300">ART</span>
                    <span className="text-zinc-400">|</span>
                    <span className="text-white">參與 / Participant</span>
                  </div>
                  <span className="text-zinc-400 font-black">→</span>
                  <div className="flex items-center gap-2 p-2.5 rounded-lg bg-pink-900/20 border border-pink-500/30">
                    <span className="text-[#E8829C]">FIELD</span>
                    <span className="text-zinc-400">|</span>
                    <span className={themeClasses.bodyTitle}>融入 / Cultural Presence</span>
                  </div>
                </div>

                {/* Bottom Summary Statement */}
                <div className="pt-3 border-t border-black/5 dark:border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="space-y-0.5">
                    <span className="text-xs font-black tracking-wide text-[#437596] dark:text-[#6CA4C8] block">
                      FROM COMPANION TO PARTICIPANT TO CULTURAL PRESENCE.
                    </span>
                    <span className={`text-xs font-bold ${themeClasses.bodyTitle}`}>
                      從陪伴者，到參與者，再到文化現場中的角色存在。
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* ========================================================
                BLOCK 04: 04 / FROM ROLE TO APPLICATION (從角色到應用)
               ======================================================== */}
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b pb-2 gap-2 border-black/5 dark:border-white/5">
                <div>
                  <span className={`text-xs font-mono font-bold uppercase tracking-widest block ${isDark ? "text-[#6CA4C8]" : "text-[#437596]"}`}>
                    04 / FROM ROLE TO APPLICATION
                  </span>
                  <h3 className={`text-xl font-bold font-mono ${themeClasses.bodyTitle}`}>
                    04 / FROM ROLE TO APPLICATION ／ 從角色到文化應用
                  </h3>
                </div>
                <span className={`text-[11px] font-mono ${themeClasses.bodySubText}`}>
                  HOW CHARACTER ROLE BECOMES REAL-WORLD APPLICATION.
                </span>
              </div>

              {/* 5-Step Logic Flow Bar */}
              <div className="p-4 rounded-xl border border-black/5 dark:border-white/5 bg-black/5 dark:bg-white/5 font-mono">
                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 block mb-2.5">
                  5-STAGE DERIVATION FRAMEWORK ‧ 角色推導應用架構
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs">
                  <div className={`p-2.5 rounded-lg border ${themeClasses.cardBg} ${themeClasses.borderColSubtle}`}>
                    <span className="text-[9px] text-zinc-400 block">STAGE 01</span>
                    <span className="font-bold text-[#437596] dark:text-[#6CA4C8]">CHARACTER ROLE</span>
                    <span className={`text-[10px] block mt-0.5 ${themeClasses.bodySubText}`}>角色功能</span>
                  </div>
                  <div className={`p-2.5 rounded-lg border ${themeClasses.cardBg} ${themeClasses.borderColSubtle}`}>
                    <span className="text-[9px] text-zinc-400 block">STAGE 02</span>
                    <span className="font-bold text-zinc-200">CULTURAL CONTEXT</span>
                    <span className={`text-[10px] block mt-0.5 ${themeClasses.bodySubText}`}>文化場景</span>
                  </div>
                  <div className={`p-2.5 rounded-lg border ${themeClasses.cardBg} ${themeClasses.borderColSubtle}`}>
                    <span className="text-[9px] text-zinc-400 block">STAGE 03</span>
                    <span className="font-bold text-[#437596] dark:text-[#6CA4C8]">BRAND LANGUAGE</span>
                    <span className={`text-[10px] block mt-0.5 ${themeClasses.bodySubText}`}>品牌語言</span>
                  </div>
                  <div className={`p-2.5 rounded-lg border ${themeClasses.cardBg} ${themeClasses.borderColSubtle}`}>
                    <span className="text-[9px] text-zinc-400 block">STAGE 04</span>
                    <span className="font-bold text-zinc-200">APPLICATION</span>
                    <span className={`text-[10px] block mt-0.5 ${themeClasses.bodySubText}`}>實際應用</span>
                  </div>
                  <div className={`p-2.5 rounded-lg border bg-[#437596]/15 border-[#437596]/40 col-span-2 sm:col-span-1`}>
                    <span className="text-[9px] text-[#E8829C] block font-bold">STAGE 05</span>
                    <span className="font-bold text-[#437596] dark:text-[#6CA4C8]">AUDIENCE EXPERIENCE</span>
                    <span className={`text-[10px] block mt-0.5 ${themeClasses.bodySubText}`}>觀眾體驗</span>
                  </div>
                </div>
              </div>

              {/* 3 Real-world Application Categories Connected to Role */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* 01 LIVE */}
                <div className={`p-5 rounded-xl border space-y-4 flex flex-col justify-between ${themeClasses.cardBg} ${themeClasses.borderColSubtle}`}>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-[#437596] text-white">
                        01 / LIVE
                      </span>
                      <span className="text-[10px] font-mono text-zinc-400">現場應用</span>
                    </div>
                    <div>
                      <h4 className={`text-base font-bold font-mono ${themeClasses.bodyTitle}`}>
                        現場空間與導視
                      </h4>
                      <p className={`text-xs font-bold text-[#437596] dark:text-[#6CA4C8] mt-0.5`}>
                        ROLE LINK: AUDIENCE COMPANION
                      </p>
                    </div>
                    <p className={`text-xs leading-relaxed font-mono ${themeClasses.bodySubText}`}>
                      透過空間配置、攤位、標示與現場視覺，讓「陪伴」的角色功能成為可被體驗的空間語言。
                    </p>
                  </div>

                  <div className={`p-3 rounded-lg border font-mono text-xs space-y-1 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">
                      CORE ARTIFACTS
                    </span>
                    <p className={`text-xs font-bold ${themeClasses.bodyTitle}`}>
                      Banner / Booth / Signage / Stage Graphic
                    </p>
                  </div>
                </div>

                {/* 02 SOCIAL */}
                <div className={`p-5 rounded-xl border space-y-4 flex flex-col justify-between ${themeClasses.cardBg} ${themeClasses.borderColSubtle}`}>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-zinc-800 text-white">
                        02 / SOCIAL
                      </span>
                      <span className="text-[10px] font-mono text-zinc-400">社群傳播</span>
                    </div>
                    <div>
                      <h4 className={`text-base font-bold font-mono ${themeClasses.bodyTitle}`}>
                        社群內容與文化發聲
                      </h4>
                      <p className={`text-xs font-bold text-[#437596] dark:text-[#6CA4C8] mt-0.5`}>
                        ROLE LINK: CULTURAL VOICE & MEME
                      </p>
                    </div>
                    <p className={`text-xs leading-relaxed font-mono ${themeClasses.bodySubText}`}>
                      將現場角色轉化為社群內容，讓 MUMㄠ 從現場延伸至數位文化語境。
                    </p>
                  </div>

                  <div className={`p-3 rounded-lg border font-mono text-xs space-y-1 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">
                      CORE ARTIFACTS
                    </span>
                    <p className={`text-xs font-bold ${themeClasses.bodyTitle}`}>
                      IG / Event Post / Festival Content
                    </p>
                  </div>
                </div>

                {/* 03 MERCH */}
                <div className={`p-5 rounded-xl border space-y-4 flex flex-col justify-between ${themeClasses.cardBg} ${themeClasses.borderColSubtle}`}>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-pink-900/40 text-pink-300 border border-pink-500/20">
                        03 / MERCH
                      </span>
                      <span className="text-[10px] font-mono text-[#E8829C]">周邊體驗</span>
                    </div>
                    <div>
                      <h4 className={`text-base font-bold font-mono ${themeClasses.bodyTitle}`}>
                        周邊物件與生活延伸
                      </h4>
                      <p className={`text-xs font-bold text-[#E8829C] mt-0.5`}>
                        ROLE LINK: TANGIBLE MEMORY
                      </p>
                    </div>
                    <p className={`text-xs leading-relaxed font-mono ${themeClasses.bodySubText}`}>
                      將角色與文化記憶轉化為可以被帶走、使用與保存的物件。
                    </p>
                  </div>

                  <div className={`p-3 rounded-lg border font-mono text-xs space-y-1 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">
                      CORE ARTIFACTS
                    </span>
                    <p className={`text-xs font-bold ${themeClasses.bodyTitle}`}>
                      Towel / T-shirt / Sticker / Zine / Goods
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* ========================================================
                BLOCK 05: 05 / APPLICATION LOGIC (活動推導核心模型)
               ======================================================== */}
            <div className={`p-6 sm:p-8 rounded-2xl border space-y-6 ${themeClasses.cardBg} ${themeClasses.borderBlueAccent}`}>
              <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b pb-4 gap-2 border-black/5 dark:border-white/5">
                <div>
                  <span className={`text-xs font-mono font-bold uppercase tracking-widest block ${isDark ? "text-[#6CA4C8]" : "text-[#437596]"}`}>
                    05 / APPLICATION LOGIC
                  </span>
                  <h3 className={`text-xl font-bold font-mono mt-0.5 ${themeClasses.bodyTitle}`}>
                    05 / APPLICATION LOGIC ／ SYSTEM DERIVATION PIPELINE ／ 活動推導核心模型
                  </h3>
                </div>
                <span className={`text-xs font-mono ${themeClasses.bodySubText}`}>
                  EVENT → ROLE → LANGUAGE → VISUAL → APPLICATION → MEMORY
                </span>
              </div>

              {/* Blue Deep Logic Schema */}
              <div className="p-6 rounded-xl border border-[#2B5573] bg-[#183348] text-white font-mono shadow-md space-y-4">
                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-300 block">
                  CAMPAIGN SYSTEM PIPELINE (活動 → 角色 → 語言 → 視覺 → 應用 → 現場記憶)
                </span>
                
                <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-center text-xs font-bold">
                  <div className="p-2.5 rounded-lg bg-black/40 border border-zinc-700/60">
                    <span className="text-zinc-400 block text-[9px]">01</span>
                    <span className="text-white">EVENT</span>
                    <span className="text-[10px] text-zinc-300 block">活動場景</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-black/40 border border-zinc-700/60">
                    <span className="text-zinc-400 block text-[9px]">02</span>
                    <span className="text-[#6CA4C8]">ROLE</span>
                    <span className="text-[10px] text-zinc-300 block">角色定位</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-black/40 border border-zinc-700/60">
                    <span className="text-zinc-400 block text-[9px]">03</span>
                    <span className="text-white">LANGUAGE</span>
                    <span className="text-[10px] text-zinc-300 block">品牌語言</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-black/40 border border-zinc-700/60">
                    <span className="text-zinc-400 block text-[9px]">04</span>
                    <span className="text-white">VISUAL</span>
                    <span className="text-[10px] text-zinc-300 block">視覺系統</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-black/40 border border-zinc-700/60">
                    <span className="text-zinc-400 block text-[9px]">05</span>
                    <span className="text-white">APPLICATION</span>
                    <span className="text-[10px] text-zinc-300 block">實際應用</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#437596]/60 border border-[#6CA4C8] col-span-2 sm:col-span-1">
                    <span className="text-[#F49BB2] block text-[9px]">06</span>
                    <span className="text-white font-black">MEMORY</span>
                    <span className="text-[10px] text-pink-200 block">現場記憶</span>
                  </div>
                </div>
              </div>

              {/* Side Quote Box */}
              <div className={`p-4 rounded-xl border font-mono ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle} flex flex-col sm:flex-row sm:items-center justify-between gap-4`}>
                <div className="space-y-1">
                  <p className={`text-sm sm:text-base font-bold ${themeClasses.bodyTitle}`}>
                    「角色不是活動中的裝飾，而是連結 IP、觀眾與文化現場的媒介。」
                  </p>
                  <p className={`text-xs ${themeClasses.bodySubText}`}>
                    The character is not decoration. It is the bridge between the IP, the audience, and the cultural scene.
                  </p>
                </div>
                <span className="text-[10px] px-2.5 py-1 rounded bg-[#437596] text-white font-bold shrink-0">
                  DESIGN PRINCIPLE
                </span>
              </div>
            </div>





            {/* ========================================================
                BLOCK 06: 06 / CHAPTER CONCLUSION (本章總結)
               ======================================================== */}
            <div className={`p-8 sm:p-10 rounded-2xl border space-y-8 ${themeClasses.cardSubtleBg} ${themeClasses.borderBlueAccent}`}>
              <div className="space-y-3">
                <span className={`text-xs font-mono font-bold uppercase tracking-widest block ${isDark ? "text-[#6CA4C8]" : "text-[#437596]"}`}>
                  06 / CHAPTER CONCLUSION
                </span>
                <h3 className={`text-2xl sm:text-3xl font-black font-mono tracking-tight ${themeClasses.bodyTitle}`}>
                  FROM CHARACTER TO CULTURAL PRESENCE.
                </h3>
                <p className={`text-xs sm:text-sm font-mono tracking-wide ${isDark ? "text-[#6CA4C8]" : "text-[#437596]"}`}>
                  角色進入文化，文化反過來定義角色。
                </p>
              </div>

              {/* Conclusion Body */}
              <div className={`p-6 rounded-xl border space-y-4 font-mono text-xs sm:text-sm leading-relaxed ${themeClasses.cardBg} ${themeClasses.borderColSubtle}`}>
                <p className={`font-bold ${isDark ? "text-zinc-100" : "text-zinc-800"}`}>
                  MUMㄠ 從一個角色開始，透過音樂、藝術與戶外文化場景，逐步建立不同的角色功能與使用方式。
                </p>
                <p className={themeClasses.bodyText}>
                  因此 MUMㄠ 不只是「一隻貓」，而是一個能夠進入真實文化場景、與人產生互動並持續延伸的 IP。
                </p>
                <div className={`pt-3 border-t text-xs leading-relaxed ${themeClasses.bodySubText} border-black/5 dark:border-white/5`}>
                  MUMㄠ started as a character, then entered music, art, and outdoor cultural contexts. Through each context, the role evolved without losing its core identity. The result is not simply a cat character, but a scalable IP presence built for real cultural participation.
                </div>
              </div>

              {/* Real-world IP Experience Formula Summary Pill */}
              <div className={`p-4 rounded-xl border text-center font-mono ${themeClasses.cardBg} ${themeClasses.borderColSubtle} space-y-1`}>
                <p className={`text-xs font-bold uppercase tracking-wider text-[#437596] dark:text-[#6CA4C8]`}>
                  CHARACTER → CULTURE → ROLE → APPLICATION → MEMORY
                </p>
                <p className={`text-sm font-bold ${themeClasses.bodyTitle}`}>
                  「讓角色進入文化，而不是讓角色只是出現在畫面裡。」
                </p>
              </div>

              {/* Next Section Navigation Button */}
              <div className={`pt-4 flex justify-end border-t ${themeClasses.borderColSubtle}`}>
                <button
                  type="button"
                  onClick={() => scrollToSection("visuals-section")}
                  className={`inline-flex items-center gap-4 px-6 py-3.5 rounded-xl border text-xs font-mono font-bold transition-all bg-[#437596] text-white hover:bg-[#345c77] shadow-sm group cursor-pointer`}
                >
                  <div className="text-left">
                    <span className="text-[10px] block font-mono uppercase tracking-widest text-zinc-200">
                      NEXT SECTION
                    </span>
                    <span className="text-sm font-bold tracking-tight">
                      05 / VISUAL SYSTEM →
                    </span>
                  </div>
                </button>
              </div>
            </div>
          </section>


                                                             {/* ===== 8. 05 / VISUAL SYSTEM (MUMㄠ 視覺系統規範) ===== */}
          <section id="visuals-section" className="pt-6 space-y-16 text-left">
            <SoundwaveDivider isDark={isDark} color={isDark ? "#E8829C" : "#437596"} className="mb-8" />
            
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-black/10 dark:border-white/10">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Sparkles className={`h-4 w-4 ${isDark ? "text-[#E8829C]" : "text-[#437596]"}`} />
                  <span className={`text-xs font-mono font-bold uppercase tracking-widest block ${isDark ? "text-[#E8829C]" : "text-[#437596]"}`}>
                    05 / VISUAL SYSTEM ‧ BRAND VISUAL GUIDELINE
                  </span>
                </div>
                <h2 className={`text-3xl font-bold font-mono mt-1 tracking-tight ${themeClasses.bodyTitle}`}>
                  05 / VISUAL SYSTEM <span className="block sm:inline font-normal text-xl sm:text-2xl mt-1 sm:mt-0">MUMㄠ 視覺系統規範</span>
                </h2>
              </div>

              <div className="max-w-md space-y-1.5">
                <span className={`text-xs font-mono font-bold uppercase tracking-widest block ${isDark ? "text-[#E8829C]" : "text-[#437596]"}`}>
                  IDENTITY STAYS. VISUAL EXPRESSION EVOLVES.
                </span>
                <p className={`text-xs leading-relaxed font-mono ${themeClasses.bodySubText}`}>
                  「固定的是辨識方式，變化的是視覺表現。」
                </p>
                <p className={`text-[11px] leading-relaxed font-mono text-zinc-500 dark:text-zinc-400 border-l-2 border-[#437596] pl-2.5 mt-2`}>
                  從「視覺元素展示頁」提升為真正可供設計師執行的品牌視覺規範系統，明確規定元素階層、構成法則與跨媒介重組原則。
                </p>
              </div>
            </div>

            {/* Pipeline Flow Banner */}
            <div className={`p-4 rounded-xl border ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle} space-y-2`}>
              <span className={`text-[10px] font-mono font-bold uppercase tracking-widest block text-[#437596] dark:text-[#6CA4C8]`}>
                MUMㄠ SYSTEM TRANSFORMATION PIPELINE
              </span>
              <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono font-bold">
                <span className="px-2 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100">CHARACTER DNA</span>
                <span className="text-[#437596] dark:text-[#6CA4C8]">→</span>
                <span className="px-2 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100">VISUAL CUES</span>
                <span className="text-[#437596] dark:text-[#6CA4C8]">→</span>
                <span className="px-2 py-0.5 rounded bg-[#437596]/15 text-[#2B5470] dark:text-[#90C2E4]">GRAPHIC ELEMENTS</span>
                <span className="text-[#437596] dark:text-[#6CA4C8]">→</span>
                <span className="px-2 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100">LAYOUT</span>
                <span className="text-[#437596] dark:text-[#6CA4C8]">→</span>
                <span className="px-2 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100">IMAGE</span>
                <span className="text-[#437596] dark:text-[#6CA4C8]">→</span>
                <span className="px-2 py-0.5 rounded bg-[#E8829C]/15 text-[#B83B5E] dark:text-[#FFB6C7]">APPLICATION</span>
              </div>
            </div>

            {/* ========================================================
                01 / VISUAL DNA
               ======================================================== */}
            <div className={`p-6 sm:p-8 rounded-2xl border space-y-6 bg-white dark:bg-[#121315] ${themeClasses.borderColSubtle}`}>
              <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b pb-4 gap-2 border-black/5 dark:border-white/5">
                <div>
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#437596] text-white uppercase`}>
                    01 / VISUAL DNA
                  </span>
                  <h3 className={`text-xl font-bold font-mono mt-1.5 ${themeClasses.bodyTitle}`}>
                    VISUAL DNA / 視覺 DNA
                  </h3>
                  <p className="text-xs font-bold text-zinc-600 dark:text-zinc-400 mt-0.5">
                    FROM CHARACTER FEATURES TO REAL VISUAL ASSETS. ／ 角色核心特徵轉化為品牌實際視覺資產。
                  </p>
                </div>
                <span className="text-xs font-mono font-bold text-[#437596] dark:text-[#6CA4C8]">
                  CHARACTER → VISUAL ABSTRACTION → VISUAL ASSET
                </span>
              </div>

              {/* Visual Abstraction Assets Matrix */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* 01 Wave */}
                <div className={`p-5 rounded-xl border space-y-4 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle} flex flex-col justify-between`}>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold text-[#437596]">01 / WAVE</span>
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#437596]/15 text-[#437596] dark:text-[#6CA4C8] font-bold">PRIMARY VISUAL</span>
                    </div>
                    <h4 className={`text-base font-bold font-mono ${themeClasses.bodyTitle}`}>Wave Whiskers / 波浪鬍鬚</h4>
                    <p className="text-xs text-zinc-500 leading-relaxed">
                      <strong className="text-zinc-700 dark:text-zinc-300">WAVE WHISKERS ＝ MUMㄠ 最主要的視覺辨識資產。</strong>延伸自貓咪鬍鬚特徵，具備流動感與韻律。
                    </p>
                    <div className="flex flex-wrap gap-1 text-[10px] font-mono text-[#437596] font-bold">
                      <span>• 波浪</span> <span>• 水平延伸</span> <span>• 不規則</span> <span>• 可裁切</span> <span>• 可放大</span> <span>• 可重複</span> <span>• 音樂節奏感</span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-lg bg-zinc-950/90 border border-[#437596]/30 space-y-2 overflow-hidden relative">
                    <div className="h-16 flex items-center justify-center relative">
                      <svg className="w-full h-12 text-[#437596]" viewBox="0 0 160 40" fill="none">
                        <path d="M0 20 Q20 5 40 20 T80 20 T120 20 T160 20" stroke="currentColor" strokeWidth="3" strokeLinecap="round" fill="none" />
                        <path d="M-10 28 Q10 13 30 28 T70 28 T110 28 T150 28" stroke="#E8829C" strokeWidth="1.5" strokeDasharray="3 3" fill="none" opacity="0.8" />
                        <path d="M10 12 Q30 -3 50 12 T90 12 T130 12 T170 12" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.4" />
                      </svg>
                    </div>
                    <div className="text-[9px] font-mono space-y-0.5 text-center border-t border-white/10 pt-1.5 text-zinc-300">
                      <span className="text-[#90C2E4] font-bold block">PRIMARY VISUAL : WAVE_WHISKER_01</span>
                    </div>
                  </div>
                </div>

                {/* 02 Line */}
                <div className={`p-5 rounded-xl border space-y-4 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle} flex flex-col justify-between`}>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold text-[#437596]">02 / LINE</span>
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-bold">HUMAN TRACE</span>
                    </div>
                    <h4 className={`text-base font-bold font-mono ${themeClasses.bodyTitle}`}>Hand-drawn Line / 手繪線條</h4>
                    <p className="text-xs text-zinc-500 leading-relaxed">
                      <strong className="text-zinc-700 dark:text-zinc-300">HAND-DRAWN LINE ＝ 人工感與不完美感。</strong>真實手繪筆觸、有機不完美、帶有人工手感與微小起伏。
                    </p>
                    <div className="flex flex-wrap gap-1 text-[10px] font-mono text-zinc-600 dark:text-zinc-400 font-bold">
                      <span>• 手繪筆觸</span> <span>• 有機曲折</span> <span>• 不完美</span> <span>• 人工感</span> <span>• 可變線寬</span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-lg bg-zinc-950/90 border border-zinc-700/50 space-y-2 overflow-hidden">
                    <div className="h-16 flex items-center justify-center">
                      <svg className="w-full h-10 text-zinc-200" viewBox="0 0 160 30" fill="none">
                        <path d="M8 15 C30 12, 55 18, 80 14 C105 10, 130 17, 152 13" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" fill="none" />
                        <path d="M12 21 C35 19, 60 23, 85 20 C110 17, 132 22, 148 19" stroke="#E8829C" strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.7" />
                      </svg>
                    </div>
                    <div className="text-[9px] font-mono space-y-0.5 text-center border-t border-white/10 pt-1.5 text-zinc-300">
                      <span className="text-zinc-300 font-bold block">HUMAN TRACE : HAND_LINE_SYSTEM</span>
                    </div>
                  </div>
                </div>

                {/* 03 Label */}
                <div className={`p-5 rounded-xl border space-y-4 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle} flex flex-col justify-between`}>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold text-[#437596]">03 / LABEL</span>
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#437596]/15 text-[#437596] dark:text-[#6CA4C8] font-bold">INFO SYSTEM</span>
                    </div>
                    <h4 className={`text-base font-bold font-mono ${themeClasses.bodyTitle}`}>Label System / 標籤系統</h4>
                    <p className="text-xs text-zinc-500 leading-relaxed">
                      <strong className="text-zinc-700 dark:text-zinc-300">LABEL SYSTEM ＝ 資訊、分類、活動脈絡。</strong>完整的 MUMㄠ metadata 標籤結構。
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-zinc-950/90 border border-[#437596]/40 text-[9px] font-mono space-y-1 text-zinc-300">
                    <div className="flex justify-between border-b border-white/10 pb-1 text-[#6CA4C8] font-bold">
                      <span>EVENT</span> <span>MUMAO_FESTIVAL</span>
                    </div>
                    <div className="flex justify-between text-[8px]">
                      <span className="text-zinc-400">DATE:</span> <span>2026.02.28</span>
                    </div>
                    <div className="flex justify-between text-[8px]">
                      <span className="text-zinc-400">LOCATION:</span> <span>TAICHUNG</span>
                    </div>
                    <div className="flex justify-between text-[8px]">
                      <span className="text-zinc-400">ROLE:</span> <span>MAIN ID</span>
                    </div>
                    <div className="flex justify-between text-[8px]">
                      <span className="text-zinc-400">ID / CAT:</span> <span className="text-[#E8829C]">MUMAO_M01 / METADATA</span>
                    </div>
                  </div>
                </div>

                {/* 04 Mark */}
                <div className={`p-5 rounded-xl border space-y-4 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle} flex flex-col justify-between`}>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold text-[#E8829C]">04 / MARK</span>
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#E8829C]/15 text-[#E8829C] font-bold">BRAND SIGNATURE</span>
                    </div>
                    <h4 className={`text-base font-bold font-mono ${themeClasses.bodyTitle}`}>MUMㄠ Mark / 識別印記</h4>
                    <p className="text-xs text-zinc-500 leading-relaxed">
                      <strong className="text-zinc-700 dark:text-zinc-300">MUMㄠ MARK ＝ 品牌識別與簽名。</strong>專屬識別印記，作為標誌認證圖章。
                    </p>
                  </div>

                  <div className="p-3.5 rounded-lg bg-zinc-950/90 border border-[#E8829C]/40 flex flex-col items-center justify-center gap-1">
                    <div className="px-3.5 h-10 min-w-[100px] border-2 border-[#E8829C] rounded flex items-center justify-center font-mono text-xs font-black text-[#E8829C] tracking-wider bg-[#E8829C]/10 shadow-sm whitespace-nowrap">
                      [ MUMㄠ 印 ]
                    </div>
                    <span className="text-[8px] font-mono text-zinc-400 mt-1">BRAND SIGNATURE STAMP</span>
                  </div>
                </div>
              </div>
            </div>

            {/* ========================================================
                02 / GRAPHIC ELEMENTS
               ======================================================== */}
            <div className={`p-6 sm:p-8 rounded-2xl border space-y-6 bg-white dark:bg-[#121315] ${themeClasses.borderColSubtle}`}>
              <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b pb-4 gap-2 border-black/5 dark:border-white/5">
                <div>
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#437596] text-white uppercase`}>
                    02 / GRAPHIC ELEMENTS
                  </span>
                  <h3 className={`text-xl font-bold font-mono mt-1.5 ${themeClasses.bodyTitle}`}>
                    GRAPHIC ELEMENTS / 視覺圖形系統
                  </h3>
                  <p className="text-xs font-bold text-zinc-600 dark:text-zinc-400 mt-0.5">
                    MUMㄠ GRAPHIC TOOLKIT / 建立明確視覺層級 (VISUAL HIERARCHY)
                  </p>
                </div>
                <span className={`text-xs font-mono ${themeClasses.bodySubText}`}>
                  PRIMARY → SECONDARY → SUPPORTING
                </span>
              </div>

              {/* Priority Rule Banner */}
              <div className="p-4 rounded-xl border border-[#437596]/30 bg-[#437596]/5 space-y-2.5 font-mono text-xs">
                <span className="text-[10px] font-bold text-[#437596] dark:text-[#6CA4C8] uppercase block tracking-wider">
                  USAGE PRIORITY RULE // 使用優先順序規則
                </span>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-0.5">
                  <div className="p-2.5 rounded-lg bg-[#437596]/10 border border-[#437596]/20 space-y-0.5">
                    <span className="text-[10px] font-bold text-[#437596] dark:text-[#6CA4C8] block">PRIMARY</span>
                    <span className="font-bold text-[#2B5470] dark:text-[#90C2E4] block text-[11px]">ESTABLISHES RECOGNITION</span>
                    <span className="text-[10px] text-zinc-500 font-medium block">主元素建立辨識</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-zinc-200/60 dark:bg-zinc-800/60 border border-zinc-300 dark:border-zinc-700 space-y-0.5">
                    <span className="text-[10px] font-bold text-zinc-700 dark:text-zinc-300 block">SECONDARY</span>
                    <span className="font-bold text-zinc-800 dark:text-zinc-200 block text-[11px]">ESTABLISHES CHARACTER</span>
                    <span className="text-[10px] text-zinc-500 font-medium block">次元素建立個性</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-zinc-200/40 dark:bg-zinc-800/40 border border-zinc-300/60 dark:border-zinc-700/60 space-y-0.5">
                    <span className="text-[10px] font-bold text-zinc-600 dark:text-zinc-400 block">SUPPORTING</span>
                    <span className="font-bold text-zinc-700 dark:text-zinc-300 block text-[11px]">ADDS INFORMATION + MOVEMENT</span>
                    <span className="text-[10px] text-zinc-500 font-medium block">輔助元素提供資訊與動態</span>
                  </div>
                </div>
              </div>

              {/* Hierarchy Group 1: PRIMARY ELEMENT */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded bg-[#437596] text-white text-[10px] font-mono font-bold uppercase tracking-wider">
                    PRIMARY ELEMENT / 主視覺核心元素
                  </span>
                  <span className="text-xs font-mono text-[#437596] dark:text-[#6CA4C8] font-bold">
                    [ HIGHEST RECOGNITION ]
                  </span>
                </div>

                <div className={`p-5 rounded-xl border ${themeClasses.cardSubtleBg} border-[#437596]/40 bg-[#437596]/5 space-y-4`}>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-3 border-[#437596]/20">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-[#437596] block">01 / WAVE WHISKERS</span>
                      <h4 className={`text-lg font-bold font-mono ${themeClasses.bodyTitle}`}>波浪鬍鬚</h4>
                    </div>
                    <div className="flex flex-wrap gap-1.5 text-xs font-mono font-bold text-[#2B5470] dark:text-[#90C2E4]">
                      <span className="px-2 py-0.5 rounded bg-[#437596]/15">BEHAVIOR: Horizontal</span>
                      <span className="px-2 py-0.5 rounded bg-[#437596]/15">Repeating</span>
                      <span className="px-2 py-0.5 rounded bg-[#437596]/15">Cropped</span>
                      <span className="px-2 py-0.5 rounded bg-[#437596]/15">Oversized</span>
                      <span className="px-2 py-0.5 rounded bg-[#437596]/15">Dynamic</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                    <div className="md:col-span-2 h-16 flex items-center justify-center border border-dashed border-[#437596]/40 rounded-lg bg-zinc-950 p-2 overflow-hidden">
                      <svg className="w-full h-10 text-[#437596]" viewBox="0 0 200 30" fill="none">
                        <path d="M0 15 Q25 0 50 15 T100 15 T150 15 T200 15" stroke="currentColor" strokeWidth="3.5" fill="none" />
                        <path d="M0 22 Q25 7 50 22 T100 22 T150 22 T200 22" stroke="#E8829C" strokeWidth="1.5" strokeDasharray="4 4" fill="none" opacity="0.8" />
                      </svg>
                    </div>
                    <div className="text-xs font-mono space-y-1">
                      <span className="text-[10px] text-zinc-400 font-bold block uppercase">APPLICATION</span>
                      <p className="font-bold text-zinc-700 dark:text-zinc-200">
                        Festival / Poster / Social / Merch
                      </p>
                      <p className="text-[10px] text-zinc-500">
                        作為最主要品牌視覺語彙，可跨頁跨畫面水平延伸或巨幅裁切。
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Hierarchy Group 2: SECONDARY ELEMENTS */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded bg-zinc-800 text-zinc-100 text-[10px] font-mono font-bold uppercase tracking-wider">
                    SECONDARY ELEMENTS / 次要輔助元素
                  </span>
                  <span className="text-xs font-mono text-zinc-500 font-bold">
                    [ CHARACTER & STRUCTURE ]
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* 02 Hand-drawn line */}
                  <div className={`p-5 rounded-xl border space-y-3 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                    <div className="flex items-center justify-between border-b pb-2 border-black/5 dark:border-white/5">
                      <span className="text-[10px] font-mono font-bold text-[#437596]">02 / HAND-DRAWN LINE</span>
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">SECONDARY</span>
                    </div>
                    <h4 className={`text-base font-bold font-mono ${themeClasses.bodyTitle}`}>手繪線條</h4>
                    <div className="flex flex-wrap gap-1 text-[10px] font-mono font-bold text-zinc-700 dark:text-zinc-300">
                      <span className="px-1.5 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800">Loose</span>
                      <span className="px-1.5 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800">Organic</span>
                      <span className="px-1.5 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800">Imperfect</span>
                      <span className="px-1.5 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800">Variable</span>
                      <span className="px-1.5 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800">Human</span>
                    </div>
                    <div className="border-t pt-2 border-black/5 dark:border-white/5 text-xs font-mono">
                      <span className="text-[10px] text-zinc-400 font-bold block">APPLICATION</span>
                      <span className="font-bold text-zinc-700 dark:text-zinc-300">Illustration / Frame / Editorial / Graphic</span>
                    </div>
                  </div>

                  {/* 03 Mark */}
                  <div className={`p-5 rounded-xl border space-y-3 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                    <div className="flex items-center justify-between border-b pb-2 border-black/5 dark:border-white/5">
                      <span className="text-[10px] font-mono font-bold text-[#E8829C]">03 / MUMㄠ MARK</span>
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#E8829C]/15 text-[#E8829C]">SECONDARY</span>
                    </div>
                    <h4 className={`text-base font-bold font-mono ${themeClasses.bodyTitle}`}>MUMㄠ 識別印記</h4>
                    <div className="flex flex-wrap gap-1 text-[10px] font-mono font-bold text-[#B83B5E] dark:text-[#FFB6C7]">
                      <span className="px-1.5 py-0.5 rounded bg-[#E8829C]/10">Compact</span>
                      <span className="px-1.5 py-0.5 rounded bg-[#E8829C]/10">Recognizable</span>
                      <span className="px-1.5 py-0.5 rounded bg-[#E8829C]/10">Consistent</span>
                      <span className="px-1.5 py-0.5 rounded bg-[#E8829C]/10">Small-scale</span>
                    </div>
                    <div className="border-t pt-2 border-black/5 dark:border-white/5 text-xs font-mono">
                      <span className="text-[10px] text-zinc-400 font-bold block">APPLICATION</span>
                      <span className="font-bold text-zinc-700 dark:text-zinc-300">Merch / Poster / Goods / Zine</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Hierarchy Group 3: SUPPORTING ELEMENTS */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-[10px] font-mono font-bold uppercase tracking-wider">
                    SUPPORTING ELEMENTS / 點綴資訊元素
                  </span>
                  <span className="text-xs font-mono text-zinc-400 font-bold">
                    [ DETAILS & METADATA ]
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* 04 Rhythm cue */}
                  <div className={`p-4 rounded-xl border space-y-3 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                    <div className="flex items-center justify-between border-b pb-1.5 border-black/5 dark:border-white/5">
                      <span className="text-[10px] font-mono font-bold text-[#437596]">04 / RHYTHM CUE</span>
                      <span className="text-[9px] font-mono text-zinc-400">SUPPORTING</span>
                    </div>
                    <h4 className={`text-sm font-bold font-mono ${themeClasses.bodyTitle}`}>韻律點符</h4>
                    <div className="p-2 rounded bg-zinc-950 text-center font-mono text-xs text-[#90C2E4] font-bold">
                      • - • - • • | | ⁑
                    </div>
                    <div className="text-[10px] font-mono space-y-1">
                      <div className="text-zinc-400">BEHAVIOR: Loose / Scattered / Irregular / Rhythmic</div>
                      <div className="font-bold text-zinc-700 dark:text-zinc-300">APP: Poster / Stage / Social</div>
                    </div>
                  </div>

                  {/* 05 Label tag */}
                  <div className={`p-4 rounded-xl border space-y-3 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                    <div className="flex items-center justify-between border-b pb-1.5 border-black/5 dark:border-white/5">
                      <span className="text-[10px] font-mono font-bold text-[#437596]">05 / LABEL TAG</span>
                      <span className="text-[9px] font-mono text-zinc-400">SUPPORTING</span>
                    </div>
                    <h4 className={`text-sm font-bold font-mono ${themeClasses.bodyTitle}`}>資訊標籤</h4>
                    <div className="p-2 rounded bg-zinc-950 text-[8px] font-mono text-zinc-300 space-y-0.5">
                      <div>ID / MUMAO_M01</div>
                      <div>ROLE / FESTIVAL</div>
                      <div>DATE / 2026.02.28</div>
                      <div>LOCATION / TAICHUNG</div>
                    </div>
                    <div className="text-[10px] font-mono space-y-1">
                      <div className="text-zinc-400">BEHAVIOR: Modular / Small / Informational / Categorized</div>
                      <div className="font-bold text-zinc-700 dark:text-zinc-300">APP: Poster / Web / Case Study / Graphic</div>
                    </div>
                  </div>

                  {/* 06 Motion mark */}
                  <div className={`p-4 rounded-xl border space-y-3 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                    <div className="flex items-center justify-between border-b pb-1.5 border-black/5 dark:border-white/5">
                      <span className="text-[10px] font-mono font-bold text-[#E8829C]">06 / MOTION MARK</span>
                      <span className="text-[9px] font-mono text-zinc-400">SUPPORTING</span>
                    </div>
                    <h4 className={`text-sm font-bold font-mono ${themeClasses.bodyTitle}`}>動態痕跡</h4>
                    <div className="p-2 rounded bg-zinc-950 text-center font-mono text-xs text-[#E8829C] font-bold">
                      /// ── ↗ ⚡ [ TRAIL ]
                    </div>
                    <div className="text-[10px] font-mono space-y-1">
                      <div className="text-zinc-400">BEHAVIOR: Gesture Trail / Speed / Direction / Movement</div>
                      <div className="font-bold text-zinc-700 dark:text-zinc-300">APP: Motion / Social / Festival</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ========================================================
                03 / LAYOUT SYSTEM
               ======================================================== */}
            <div className={`p-6 sm:p-8 rounded-2xl border space-y-6 bg-white dark:bg-[#121315] ${themeClasses.borderColSubtle}`}>
              <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b pb-4 gap-2 border-black/5 dark:border-white/5">
                <div>
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#437596] text-white uppercase`}>
                    03 / LAYOUT SYSTEM
                  </span>
                  <h3 className={`text-xl font-bold font-mono mt-1.5 ${themeClasses.bodyTitle}`}>
                    LAYOUT SYSTEM / 構圖系統
                  </h3>
                  <p className="text-xs font-bold text-[#437596] dark:text-[#6CA4C8] mt-0.5">
                    STRUCTURE CREATES CLARITY. CHARACTER BREAKS THE GRID.
                  </p>
                </div>
                <span className={`text-xs font-mono ${themeClasses.bodySubText}`}>
                  4 EXECUTABLE LAYOUT RULES
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {/* Layout 01 */}
                <div className={`p-5 rounded-xl border space-y-4 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle} flex flex-col justify-between h-84`}>
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-mono font-bold text-[#437596] block">01 / ONE HERO</span>
                    <h4 className={`text-base font-bold font-mono ${themeClasses.bodyTitle}`}>單一主視覺</h4>
                    <p className="text-xs text-zinc-500 leading-relaxed">
                      Hero Character / Wave Graphic / Product 保持唯一 Primary Focus，其餘資訊退居次要層級。
                    </p>
                  </div>

                  <div className="h-32 rounded-lg border border-dashed border-zinc-700/40 bg-zinc-950 flex flex-col justify-between p-2 font-mono text-[9px]">
                    <div className="text-right text-[8px] text-zinc-500">[ METADATA TAG ]</div>
                    <div className="text-center text-[10px] text-[#90C2E4] font-bold border py-2.5 bg-[#437596]/20 rounded border-[#437596]/50">
                      ★ HERO FOCUS ★
                    </div>
                    <div className="flex justify-between border-t border-white/10 pt-1 text-[8px] text-zinc-400">
                      <span>SUB_INFO</span>
                      <span>DATE: 2026</span>
                    </div>
                  </div>

                  <div className="border-t pt-2 border-black/5 dark:border-white/5">
                    <span className="text-[9px] font-mono font-bold text-zinc-400 block uppercase">USE</span>
                    <span className="text-xs font-mono font-bold text-[#437596] dark:text-[#6CA4C8]">KV / Poster / Campaign</span>
                  </div>
                </div>

                {/* Layout 02 */}
                <div className={`p-5 rounded-xl border space-y-4 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle} flex flex-col justify-between h-84`}>
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-mono font-bold text-[#437596] block">02 / GRID + IMPERFECTION</span>
                    <h4 className={`text-base font-bold font-mono ${themeClasses.bodyTitle}`}>網格＋不完美</h4>
                    <p className="text-xs text-zinc-500 leading-relaxed">
                      Swiss Grid 是結構，Hand-drawn Line / Wave / Character 是破壞與平衡 Grid 的有機元素。
                    </p>
                  </div>

                  <div className="h-32 rounded-lg border border-dashed border-zinc-700/40 bg-zinc-950 flex flex-col justify-between p-2 font-mono text-[9px]">
                    <div className="grid grid-cols-2 gap-1 h-16">
                      <div className="border border-zinc-700/40 p-1 rounded bg-zinc-900/50 text-[8px] text-zinc-400">SWISS GRID</div>
                      <div className="border border-zinc-700/40 p-1 rounded bg-zinc-900/50 text-[8px] text-zinc-400">SWISS GRID</div>
                    </div>
                    <div className="border-t-2 border-dashed border-[#E8829C] pt-1 text-center font-bold text-[#E8829C] text-[9px]">
                      GRID + IMPERFECT ELEMENT = MUMㄠ COMPOSITION
                    </div>
                  </div>

                  <div className="border-t pt-2 border-black/5 dark:border-white/5">
                    <span className="text-[9px] font-mono font-bold text-zinc-400 block uppercase">USE</span>
                    <span className="text-xs font-mono font-bold text-[#437596] dark:text-[#6CA4C8]">Editorial / Zine / Pamphlet</span>
                  </div>
                </div>

                {/* Layout 03 */}
                <div className={`p-5 rounded-xl border space-y-4 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle} flex flex-col justify-between h-84`}>
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-mono font-bold text-[#E8829C] block">03 / OPEN SPACE</span>
                    <h4 className={`text-base font-bold font-mono ${themeClasses.bodyTitle}`}>大面積留白</h4>
                    <p className="text-xs text-zinc-500 leading-relaxed">
                      大面積 White Space，角色或 Wave 成為唯一焦點，不讓無關資訊填滿畫面。
                    </p>
                  </div>

                  <div className="h-32 rounded-lg border border-dashed border-zinc-700/40 bg-zinc-950 flex flex-col justify-between p-2 font-mono text-[9px]">
                    <div className="text-[8px] text-zinc-500">[ TAG ]</div>
                    <div className="flex justify-center my-auto">
                      <div className="h-8 w-8 rounded-full bg-[#E8829C]/30 border border-[#E8829C] flex items-center justify-center text-[7px] text-[#E8829C] font-bold">
                        HERO
                      </div>
                    </div>
                    <div className="text-right text-[8px] text-zinc-500">OPEN WHITE SPACE</div>
                  </div>

                  <div className="border-t pt-2 border-black/5 dark:border-white/5">
                    <span className="text-[9px] font-mono font-bold text-zinc-400 block uppercase">USE</span>
                    <span className="text-xs font-mono font-bold text-[#E8829C]">Brochure / Merch / Identity</span>
                  </div>
                </div>

                {/* Layout 04 */}
                <div className={`p-5 rounded-xl border space-y-4 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle} flex flex-col justify-between h-96 sm:h-auto`}>
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-mono font-bold text-[#E8829C] block">04 / BREAKTHROUGH</span>
                    <h4 className={`text-base font-bold font-mono ${themeClasses.bodyTitle}`}>角色破 Grid</h4>
                    <p className="text-xs text-zinc-500 leading-relaxed">
                      「Grid 可以被突破，但資訊層級不能被破壞。」Grid 作為資訊結構，Wave / Character 突破邊界形成情緒焦點。
                    </p>
                  </div>

                  <div className="p-2.5 rounded-lg border border-dashed border-zinc-700/40 bg-zinc-950 space-y-2 font-mono">
                    <div className="border border-dashed border-zinc-700 p-2 rounded relative bg-zinc-900/40">
                      <span className="text-[8px] text-zinc-500 block">GRID = INFO STRUCTURE</span>
                      <div className="text-[8px] text-zinc-400 space-y-0.5 mt-1">
                        <div>[ MARK = BRAND ANCHOR ]</div>
                        <div>[ WAVE = MOVEMENT ]</div>
                      </div>
                      <div className="absolute -top-2.5 -right-2 px-2 py-0.5 bg-[#E8829C] text-white text-[8px] font-bold rounded shadow-md">
                        ▲ BREAKTHROUGH!
                      </div>
                    </div>
                    <div className="p-2 rounded bg-[#E8829C]/10 border border-[#E8829C]/30 text-center space-y-1">
                      <span className="text-[9px] font-bold text-[#E8829C] block tracking-tight">BREAK THE GRID. KEEP THE HIERARCHY.</span>
                      <span className="text-[9px] font-bold text-[#E8829C] block tracking-tight">THE GRID ORGANIZES. THE CHARACTER INTERRUPTS.</span>
                      <span className="text-[8px] text-zinc-400 block">「網格負責整理，角色負責打破。」</span>
                    </div>
                  </div>

                  <div className="border-t pt-2 border-black/5 dark:border-white/5">
                    <span className="text-[9px] font-mono font-bold text-zinc-400 block uppercase">USE</span>
                    <span className="text-xs font-mono font-bold text-[#E8829C]">Festival Banner / Cover / Social</span>
                  </div>
                </div>
              </div>
            </div>

            {/* ========================================================
                04 / IMAGE LANGUAGE
               ======================================================== */}
            <div className={`p-6 sm:p-8 rounded-2xl border space-y-6 bg-white dark:bg-[#121315] ${themeClasses.borderColSubtle}`}>
              <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b pb-4 gap-2 border-black/5 dark:border-white/5">
                <div>
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#437596] text-white uppercase`}>
                    04 / IMAGE LANGUAGE
                  </span>
                  <h3 className={`text-xl font-bold font-mono mt-1.5 ${themeClasses.bodyTitle}`}>
                    IMAGE LANGUAGE / 影像執行規範
                  </h3>
                  <p className="text-xs font-bold text-zinc-600 dark:text-zinc-400 mt-0.5">
                    IMAGE EXECUTION STANDARD / 影像攝影執行標準
                  </p>
                </div>
                <span className={`text-xs font-mono ${themeClasses.bodySubText}`}>
                  DOCUMENTARY ‧ REAL ‧ UNFILTERED
                </span>
              </div>

              {/* Overall Image Principle Banner */}
              <div className="p-3.5 rounded-xl border border-[#437596]/30 bg-[#437596]/5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 font-mono text-xs">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold text-[#437596] dark:text-[#6CA4C8] uppercase block tracking-wider">
                    OVERALL IMAGE PRINCIPLE // 影像核心原則
                  </span>
                  <p className="font-bold text-[#2B5470] dark:text-[#90C2E4]">
                    IMAGE MUST FEEL OBSERVED, NOT MANUFACTURED.
                  </p>
                </div>
                <span className="text-[11px] text-zinc-600 dark:text-zinc-300 font-medium shrink-0 bg-[#437596]/10 px-2.5 py-1 rounded border border-[#437596]/20">
                  「影像應該像被看見，而不是被製造。」
                </span>
              </div>

              {/* 4 Image Directions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className={`p-4 rounded-xl border space-y-2 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                  <span className="text-[10px] font-mono font-bold text-[#437596] block">01 / LIVE 現場</span>
                  <p className={`text-xs font-bold ${themeClasses.bodyTitle}`}>Music Festival / 音樂祭現場</p>
                  <p className="text-[10px] font-mono text-zinc-500 leading-relaxed">
                    Crowd / Stage / Natural Light / Real Environment
                  </p>
                </div>

                <div className={`p-4 rounded-xl border space-y-2 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                  <span className="text-[10px] font-mono font-bold text-[#437596] block">02 / OBJECT 商品</span>
                  <p className={`text-xs font-bold ${themeClasses.bodyTitle}`}>Merch / 周邊材質細節</p>
                  <p className="text-[10px] font-mono text-zinc-500 leading-relaxed">
                    Product / Material / Texture / Detail / Close-up
                  </p>
                </div>

                <div className={`p-4 rounded-xl border space-y-2 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                  <span className="text-[10px] font-mono font-bold text-[#E8829C] block">03 / CHARACTER 角色</span>
                  <p className={`text-xs font-bold ${themeClasses.bodyTitle}`}>MUMㄠ Character / 角色寫照</p>
                  <p className="text-[10px] font-mono text-zinc-500 leading-relaxed">
                    White Space / Gesture / Expression / Silhouette / Playful
                  </p>
                </div>

                <div className={`p-4 rounded-xl border space-y-2 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                  <span className="text-[10px] font-mono font-bold text-[#E8829C] block">04 / CULTURAL 文化</span>
                  <p className={`text-xs font-bold ${themeClasses.bodyTitle}`}>Taiwan / 在地日常文化</p>
                  <p className="text-[10px] font-mono text-zinc-500 leading-relaxed">
                    Local / Human / Everyday / Real / Unfiltered
                  </p>
                </div>
              </div>

              {/* Photography Execution Standard Comparison */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 space-y-3">
                  <div className="flex items-center justify-between border-b pb-2 border-emerald-500/20">
                    <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      ✓ KEEP / 攝影執行允許 (DOCUMENTARY)
                    </span>
                    <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400">REALITY</span>
                  </div>
                  <ul className="space-y-1.5 font-mono text-xs text-emerald-900 dark:text-emerald-200">
                    <li className="flex items-center gap-2"><span>✓</span> <span>Natural Light / 現場自然光線紀錄</span></li>
                    <li className="flex items-center gap-2"><span>✓</span> <span>Real Environment / 真實非搭建環境</span></li>
                    <li className="flex items-center gap-2"><span>✓</span> <span>Human Presence / 帶有人情與觀眾參與感</span></li>
                    <li className="flex items-center gap-2"><span>✓</span> <span>Imperfect Details / 有機現場細節與質理</span></li>
                    <li className="flex items-center gap-2"><span>✓</span> <span>Documentary Feeling / 紀實紀錄視角</span></li>
                  </ul>
                </div>

                <div className="p-5 rounded-xl border border-rose-500/20 bg-rose-500/5 space-y-3">
                  <div className="flex items-center justify-between border-b pb-2 border-rose-500/20">
                    <span className="text-xs font-mono font-bold text-rose-600 dark:text-rose-400">
                      ✕ AVOID / 攝影執行嚴格禁止
                    </span>
                    <span className="text-[10px] font-mono text-rose-600 dark:text-rose-400">NON-MUMAO</span>
                  </div>
                  <ul className="space-y-1.5 font-mono text-xs text-rose-900 dark:text-rose-200">
                    <li className="flex items-center gap-2"><span>✕</span> <span>Luxury Editorial / 精品奢華商業時尚風格</span></li>
                    <li className="flex items-center gap-2"><span>✕</span> <span>Over-retouched / 過度修圖與高修容</span></li>
                    <li className="flex items-center gap-2"><span>✕</span> <span>Generic Stock Photo / 罐頭無感圖庫照片</span></li>
                    <li className="flex items-center gap-2"><span>✕</span> <span>Excessive 3D Render / 過度擬真金屬 3D 渲染</span></li>
                    <li className="flex items-center gap-2"><span>✕</span> <span>Plastic AI Look / 塑膠感與精緻 AI 繪圖視覺</span></li>
                  </ul>
                </div>
              </div>
            </div>

            {/* ========================================================
                05 / VISUAL APPLICATION
               ======================================================== */}
            <div className={`p-6 sm:p-8 rounded-2xl border space-y-6 bg-white dark:bg-[#121315] ${themeClasses.borderColSubtle}`}>
              <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b pb-4 gap-2 border-black/5 dark:border-white/5">
                <div>
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#437596] text-white uppercase`}>
                    05 / VISUAL APPLICATION
                  </span>
                  <h3 className={`text-xl font-bold font-mono mt-1.5 ${themeClasses.bodyTitle}`}>
                    VISUAL APPLICATION / 視覺應用系統
                  </h3>
                  <p className="text-xs font-bold text-zinc-600 dark:text-zinc-400 mt-0.5">
                    VISUAL SYSTEM → MEDIUM → OUTPUT
                  </p>
                </div>
                <span className={`text-xs font-mono ${themeClasses.bodySubText}`}>
                  6 MEDIA APPLICATION RULES
                </span>
              </div>

              {/* Highlight Application Principle Banner */}
              <div className="p-4 rounded-xl border border-[#437596]/30 bg-[#437596]/5 space-y-1">
                <span className="text-[10px] font-mono font-bold text-[#437596] dark:text-[#6CA4C8] uppercase block">
                  APPLICATION PRINCIPLE // 核心視覺應用原則
                </span>
                <p className="text-xs font-mono font-bold text-[#2B5470] dark:text-[#90C2E4]">
                  SAME ELEMENT. DIFFERENT SCALE. DIFFERENT COMBINATION. SAME RECOGNITION.
                </p>
                <p className="text-[11px] font-mono text-zinc-500">
                  「同一元素，不同尺度；不同組合，維持同一辨識。」
                </p>
              </div>

              {/* 6 Media Cards with Visual Combination Diagrams & Hierarchy Formulas */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Media 01 */}
                <div className={`p-5 rounded-xl border space-y-3 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle} flex flex-col justify-between`}>
                  <div className="space-y-2">
                    <span className="text-[9px] font-mono text-zinc-400 block font-bold">MEDIA 01</span>
                    <h4 className="font-bold text-base font-mono text-[#437596]">01 / FESTIVAL</h4>
                    <p className="text-xs text-zinc-500">Poster / Banner / Booth / Stage Graphic</p>
                    <div className="space-y-1 text-[11px] font-mono border-t border-black/5 dark:border-white/5 pt-2">
                      <div className="text-zinc-600 dark:text-zinc-300"><span className="text-[#437596] font-bold">PRIMARY:</span> WAVE</div>
                      <div className="text-zinc-600 dark:text-zinc-300"><span className="text-zinc-500 font-bold">SECONDARY:</span> MARK + LARGE TYPE</div>
                      <div className="text-zinc-600 dark:text-zinc-300"><span className="text-zinc-400 font-bold">SUPPORTING:</span> LABEL</div>
                    </div>
                  </div>

                  <div className="p-2.5 rounded bg-zinc-950 border border-zinc-800 space-y-1 text-center font-mono">
                    <span className="text-[8px] text-zinc-500 block">FORMULA</span>
                    <div className="text-[10px] font-bold text-[#90C2E4] border border-[#437596]/30 py-1 rounded bg-[#437596]/10">
                      WAVE + MARK + TYPE + LABEL
                    </div>
                  </div>
                </div>

                {/* Media 02 */}
                <div className={`p-5 rounded-xl border space-y-3 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle} flex flex-col justify-between`}>
                  <div className="space-y-2">
                    <span className="text-[9px] font-mono text-zinc-400 block font-bold">MEDIA 02</span>
                    <h4 className="font-bold text-base font-mono text-[#437596]">02 / SOCIAL</h4>
                    <p className="text-xs text-zinc-500">IG Post / Story / Event Post</p>
                    <div className="space-y-1 text-[11px] font-mono border-t border-black/5 dark:border-white/5 pt-2">
                      <div className="text-zinc-600 dark:text-zinc-300"><span className="text-[#437596] font-bold">PRIMARY:</span> CHARACTER / WAVE</div>
                      <div className="text-zinc-600 dark:text-zinc-300"><span className="text-zinc-500 font-bold">SECONDARY:</span> LABEL</div>
                      <div className="text-zinc-600 dark:text-zinc-300"><span className="text-zinc-400 font-bold">SUPPORTING:</span> MARK</div>
                    </div>
                  </div>

                  <div className="p-2.5 rounded bg-zinc-950 border border-zinc-800 space-y-1 text-center font-mono">
                    <span className="text-[8px] text-zinc-500 block">FORMULA</span>
                    <div className="text-[10px] font-bold text-[#90C2E4] border border-[#437596]/30 py-1 rounded bg-[#437596]/10">
                      CHARACTER + WAVE + LABEL
                    </div>
                  </div>
                </div>

                {/* Media 03 */}
                <div className={`p-5 rounded-xl border space-y-3 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle} flex flex-col justify-between`}>
                  <div className="space-y-2">
                    <span className="text-[9px] font-mono text-zinc-400 block font-bold">MEDIA 03</span>
                    <h4 className="font-bold text-base font-mono text-[#437596]">03 / EDITORIAL</h4>
                    <p className="text-xs text-zinc-500">Zine / Art Book / Feature</p>
                    <div className="space-y-1 text-[11px] font-mono border-t border-black/5 dark:border-white/5 pt-2">
                      <div className="text-zinc-600 dark:text-zinc-300"><span className="text-[#437596] font-bold">PRIMARY:</span> OPEN SPACE / LINE</div>
                      <div className="text-zinc-600 dark:text-zinc-300"><span className="text-zinc-500 font-bold">SECONDARY:</span> LABEL</div>
                      <div className="text-zinc-600 dark:text-zinc-300"><span className="text-zinc-400 font-bold">SUPPORTING:</span> MARK</div>
                    </div>
                  </div>

                  <div className="p-2.5 rounded bg-zinc-950 border border-zinc-800 space-y-1 text-center font-mono">
                    <span className="text-[8px] text-zinc-500 block">FORMULA</span>
                    <div className="text-[10px] font-bold text-[#90C2E4] border border-[#437596]/30 py-1 rounded bg-[#437596]/10">
                      LINE + LABEL + OPEN SPACE
                    </div>
                  </div>
                </div>

                {/* Media 04 */}
                <div className={`p-5 rounded-xl border space-y-3 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle} flex flex-col justify-between`}>
                  <div className="space-y-2">
                    <span className="text-[9px] font-mono text-zinc-400 block font-bold">MEDIA 04</span>
                    <h4 className="font-bold text-base font-mono text-[#E8829C]">04 / MERCH</h4>
                    <p className="text-xs text-zinc-500">T-shirt / Towel / Sticker / Pin / Goods</p>
                    <div className="space-y-1 text-[11px] font-mono border-t border-black/5 dark:border-white/5 pt-2">
                      <div className="text-zinc-600 dark:text-zinc-300"><span className="text-[#E8829C] font-bold">PRIMARY:</span> MARK / WAVE</div>
                      <div className="text-zinc-600 dark:text-zinc-300"><span className="text-zinc-500 font-bold">SECONDARY:</span> TYPE</div>
                      <div className="text-zinc-600 dark:text-zinc-300"><span className="text-zinc-400 font-bold">SUPPORTING:</span> LABEL</div>
                    </div>
                  </div>

                  <div className="p-2.5 rounded bg-zinc-950 border border-zinc-800 space-y-1 text-center font-mono">
                    <span className="text-[8px] text-zinc-500 block">FORMULA</span>
                    <div className="text-[10px] font-bold text-[#E8829C] border border-[#E8829C]/30 py-1 rounded bg-[#E8829C]/10">
                      MARK + WAVE + TYPE
                    </div>
                  </div>
                </div>

                {/* Media 05 */}
                <div className={`p-5 rounded-xl border space-y-3 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle} flex flex-col justify-between`}>
                  <div className="space-y-2">
                    <span className="text-[9px] font-mono text-zinc-400 block font-bold">MEDIA 05</span>
                    <h4 className="font-bold text-base font-mono text-[#437596]">05 / SIGNAGE</h4>
                    <p className="text-xs text-zinc-500">Wayfinding / Booth Sign / Directional Graphic</p>
                    <div className="space-y-1 text-[11px] font-mono border-t border-black/5 dark:border-white/5 pt-2">
                      <div className="text-zinc-600 dark:text-zinc-300"><span className="text-[#437596] font-bold">PRIMARY:</span> MARK / TYPE</div>
                      <div className="text-zinc-600 dark:text-zinc-300"><span className="text-zinc-500 font-bold">SECONDARY:</span> LABEL</div>
                      <div className="text-zinc-600 dark:text-zinc-300"><span className="text-zinc-400 font-bold">SUPPORTING:</span> WAVE</div>
                    </div>
                  </div>

                  <div className="p-2.5 rounded bg-zinc-950 border border-zinc-800 space-y-1 text-center font-mono">
                    <span className="text-[8px] text-zinc-500 block">FORMULA</span>
                    <div className="text-[10px] font-bold text-[#90C2E4] border border-[#437596]/30 py-1 rounded bg-[#437596]/10">
                      MARK + TYPE + LABEL
                    </div>
                  </div>
                </div>

                {/* Media 06 */}
                <div className={`p-5 rounded-xl border space-y-3 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle} flex flex-col justify-between`}>
                  <div className="space-y-2">
                    <span className="text-[9px] font-mono text-zinc-400 block font-bold">MEDIA 06</span>
                    <h4 className="font-bold text-base font-mono text-[#437596]">06 / DIGITAL</h4>
                    <p className="text-xs text-zinc-500">Website / Event Page / Motion Graphic</p>
                    <div className="space-y-1 text-[11px] font-mono border-t border-black/5 dark:border-white/5 pt-2">
                      <div className="text-zinc-600 dark:text-zinc-300"><span className="text-[#437596] font-bold">PRIMARY:</span> WAVE</div>
                      <div className="text-zinc-600 dark:text-zinc-300"><span className="text-zinc-500 font-bold">SECONDARY:</span> MOTION MARK</div>
                      <div className="text-zinc-600 dark:text-zinc-300"><span className="text-zinc-400 font-bold">SUPPORTING:</span> LABEL + CHARACTER</div>
                    </div>
                  </div>

                  <div className="p-2.5 rounded bg-zinc-950 border border-zinc-800 space-y-1 text-center font-mono">
                    <span className="text-[8px] text-zinc-500 block">FORMULA</span>
                    <div className="text-[10px] font-bold text-[#90C2E4] border border-[#437596]/30 py-1 rounded bg-[#437596]/10">
                      WAVE + MOTION + LABEL
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ========================================================
                06 / CHAPTER CONCLUSION
               ======================================================== */}
            <div className={`p-6 sm:p-8 rounded-2xl border space-y-6 bg-white dark:bg-[#121315] ${themeClasses.borderBlueAccent}`}>
              <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b pb-4 gap-2 border-black/5 dark:border-white/5">
                <div>
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#437596] text-white uppercase`}>
                    06 / CHAPTER CONCLUSION
                  </span>
                  <h3 className={`text-xl font-bold font-mono mt-1.5 ${themeClasses.bodyTitle}`}>
                    FROM ELEMENTS TO SYSTEM. ／ 從視覺元素到系統
                  </h3>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-[#437596] dark:text-[#6CA4C8]">
                    IDENTITY STAYS. VISUAL EXPRESSION EVOLVES.
                  </span>
                </div>
              </div>

              {/* Pipeline Flow representation */}
              <div className={`p-4 rounded-xl border ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle} space-y-2`}>
                <span className={`text-[10px] font-mono font-bold uppercase tracking-widest block ${themeClasses.bodySubText}`}>
                  MUMㄠ VISUAL SYSTEM PIPELINE
                </span>
                <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono font-bold">
                  <span className="px-2 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100">CHARACTER DNA</span>
                  <span className="text-[#437596] dark:text-[#6CA4C8]">→</span>
                  <span className="px-2 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100">VISUAL CUES</span>
                  <span className="text-[#437596] dark:text-[#6CA4C8]">→</span>
                  <span className="px-2 py-0.5 rounded bg-[#437596]/15 text-[#2B5470] dark:text-[#90C2E4]">GRAPHIC ELEMENTS</span>
                  <span className="text-[#437596] dark:text-[#6CA4C8]">→</span>
                  <span className="px-2 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100">LAYOUT</span>
                  <span className="text-[#437596] dark:text-[#6CA4C8]">→</span>
                  <span className="px-2 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100">IMAGE</span>
                  <span className="text-[#437596] dark:text-[#6CA4C8]">→</span>
                  <span className="px-2 py-0.5 rounded bg-[#E8829C]/15 text-[#B83B5E] dark:text-[#FFB6C7]">APPLICATION</span>
                  <span className="text-[#437596] dark:text-[#6CA4C8]">→</span>
                  <span className="px-3 py-0.5 rounded bg-[#437596] text-white">MUMㄠ VISUAL SYSTEM</span>
                </div>
              </div>

              {/* Formula */}
              <div className="p-4 rounded-xl border border-[#2B5573] bg-[#183348] text-white text-center space-y-1.5 font-mono text-sm">
                <p className="font-bold text-[#90C2E4] tracking-tight">
                  CHARACTER DNA + VISUAL RULES + APPLICATION RULES = SCALABLE VISUAL SYSTEM
                </p>
                <p className="text-xs text-zinc-300">「固定的是辨識方式，變化的是視覺表現。」</p>
              </div>

              {/* Core Final Principle */}
              <div className="p-4 rounded-xl border border-[#437596]/40 bg-[#437596]/10 text-center space-y-1 font-mono">
                <span className="text-xs font-bold text-[#437596] dark:text-[#90C2E4] uppercase tracking-widest block">
                  NOT THE SAME EVERY TIME. BUT ALWAYS RECOGNIZABLE AS MUMㄠ.
                </span>
                <p className="text-xs text-zinc-700 dark:text-zinc-300 font-bold">
                  「不是每次都長得一樣，而是每次都看得出來是 MUMㄠ。」
                </p>
              </div>
            </div>

            {/* Transition button */}
            <div className={`p-6 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
              <div className="space-y-1">
                <span className={`text-[10px] font-mono font-bold uppercase tracking-widest block ${themeClasses.bodySubText}`}>
                  TRANSITION TO MERCHANDISE
                </span>
                <h4 className={`text-base font-bold font-mono ${themeClasses.bodyTitle}`}>
                  FROM SYSTEM TO TANGIBLE PRODUCTS.
                </h4>
                <p className={`text-xs font-mono ${themeClasses.bodySubText}`}>
                  將視覺系統規範，落實為具有生活手感與溫度的周邊設計與商品應用。
                </p>
              </div>

              <button
                type="button"
                onClick={() => scrollToSection("merch-section")}
                className={`inline-flex items-center gap-3 px-6 py-3.5 rounded-xl border text-xs font-mono font-bold transition-all bg-[#437596] text-white hover:bg-[#345c77] shadow-sm group cursor-pointer shrink-0`}
              >
                <div className="text-left">
                  <span className="text-[10px] block font-mono uppercase tracking-widest text-zinc-200">
                    NEXT SECTION
                  </span>
                  <span className="text-sm font-bold tracking-tight">
                    06 / MERCHANDISE →
                  </span>
                </div>
              </button>
            </div>
          </section>

          {/* ===== 9. 06 / MERCHANDISE (MUMㄠ 周邊設計與商品應用系統) ===== */}
          <section id="merch-section" className="pt-6 space-y-12 text-left">
            <SoundwaveDivider isDark={isDark} color={isDark ? "#6CA4C8" : "#437596"} className="mb-8" />
            
            {/* Section Header */}
            <div className={`flex flex-col sm:flex-row sm:items-end justify-between border-b pb-4 gap-4 ${themeClasses.borderCol}`}>
              <div>
                <div className="flex items-center gap-2">
                  <Package className={`h-4 w-4 ${isDark ? "text-[#6CA4C8]" : "text-[#437596]"}`} />
                  <span className={`text-xs font-mono font-bold uppercase tracking-widest block ${isDark ? "text-[#6CA4C8]" : "text-[#437596]"}`}>
                    06 / MERCHANDISE ‧ MUMㄠ MERCHANDISE SYSTEM
                  </span>
                </div>
                <h2 className={`text-3xl font-bold font-mono mt-1 tracking-tight ${themeClasses.bodyTitle}`}>
                  周邊設計與商品應用系統
                </h2>
              </div>

              <div className="max-w-md">
                <p className={`text-xs leading-relaxed font-mono ${themeClasses.bodySubText}`}>
                  將 MUMㄠ 的 Visual System 轉譯為實體物件，規範識別如何被使用、攜帶、收藏與記憶。
                </p>
                <span className={`text-[10px] font-mono block mt-1 ${isDark ? "text-[#6CA4C8]" : "text-[#437596]"}`}>
                  CHARACTER ➔ VISUAL SYSTEM ➔ PRODUCT ➔ MATERIAL ➔ FUNCTION ➔ EXPERIENCE ➔ MEMORY
                </span>
              </div>
            </div>

            {/* 01 / PRODUCT STRATEGY ANCHOR */}
            <div className={`p-8 rounded-2xl border ${themeClasses.cardBg} ${themeClasses.borderBlueAccent} flex flex-col md:flex-row md:items-center justify-between gap-6`}>
              <div className="space-y-2">
                <span className={`text-xs font-mono font-bold uppercase tracking-widest block ${isDark ? "text-[#6CA4C8]" : "text-[#437596]"}`}>
                  01 / PRODUCT STRATEGY ANCHOR
                </span>
                <h3 className={`text-2xl sm:text-4xl font-black font-mono tracking-tight ${themeClasses.bodyTitle}`}>
                  FROM IP TO OBJECT. <span className="block text-xl sm:text-2xl mt-1 font-bold">／ 從角色 IP 到實體物件</span>
                </h3>
                <p className={`text-lg sm:text-xl font-bold font-mono text-zinc-900 dark:text-zinc-100`}>
                  「讓喜歡 MUMㄠ，變成可以帶走的東西。」
                </p>
              </div>

              <div className={`p-4 rounded-xl border font-mono text-xs space-y-2 shrink-0 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                <span className={`text-[10px] uppercase font-bold block ${themeClasses.bodySubText}`}>IP TO PHYSICAL SYSTEM</span>
                <div className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
                  CHARACTER ➔ VISUAL SYSTEM ➔ PRODUCT ➔ EXPERIENCE ➔ MEMORY
                </div>
                <div className="text-[11px] text-[#437596] dark:text-[#6CA4C8]">
                  角色 ➔ 視覺系統 ➔ 商品 ➔ 使用體驗 ➔ 品牌記憶
                </div>
              </div>
            </div>

            {/* Core Concept Note */}
            <div className="p-4 rounded-xl border border-[#437596]/30 bg-[#437596]/10 text-center space-y-1 font-mono">
              <span className="text-xs font-bold text-[#437596] dark:text-[#90C2E4] uppercase tracking-wide block">
                MUMㄠ MERCH IS NOT CHARACTER REPRODUCTION. IT IS CHARACTER ENTERING DAILY LIFE.
              </span>
              <p className="text-xs text-zinc-700 dark:text-zinc-300 font-bold">
                「MUMㄠ 周邊不是角色的複製，而是角色進入日常生活。」
              </p>
            </div>

            {/* 02 / VISUAL ASSET TRANSLATION */}
            <div className={`p-6 sm:p-8 rounded-2xl border space-y-6 ${themeClasses.cardBg} ${themeClasses.borderColSubtle}`}>
              <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b pb-4 gap-2 border-black/5 dark:border-white/5">
                <div>
                  <span className={`text-xs font-mono font-bold uppercase tracking-widest block ${isDark ? "text-[#6CA4C8]" : "text-[#437596]"}`}>
                    02 / VISUAL ASSET TRANSLATION
                  </span>
                  <h3 className={`text-xl font-bold font-mono mt-0.5 ${themeClasses.bodyTitle}`}>
                    品牌資產商品化轉譯
                  </h3>
                </div>
                <span className={`text-xs font-mono ${themeClasses.bodySubText}`}>
                  VISUAL ASSET ➔ MERCHANDISE ROLE
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                <div className={`p-3.5 rounded-xl border space-y-1.5 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                  <span className="text-[9px] font-mono font-bold block text-zinc-400 uppercase">01 / CHARACTER</span>
                  <div className="text-xs font-bold font-mono text-zinc-800 dark:text-zinc-100">CHARACTER</div>
                  <div className="text-[10px] font-mono text-[#437596] dark:text-[#6CA4C8] font-bold">PRIMARY VISUAL</div>
                </div>

                <div className={`p-3.5 rounded-xl border space-y-1.5 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                  <span className="text-[9px] font-mono font-bold block text-zinc-400 uppercase">02 / WAVE</span>
                  <div className="text-xs font-bold font-mono text-zinc-800 dark:text-zinc-100">WAVE</div>
                  <div className="text-[10px] font-mono text-[#437596] dark:text-[#6CA4C8] font-bold">PATTERN / EXTENSION</div>
                </div>

                <div className={`p-3.5 rounded-xl border space-y-1.5 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                  <span className="text-[9px] font-mono font-bold block text-zinc-400 uppercase">03 / MARK</span>
                  <div className="text-xs font-bold font-mono text-zinc-800 dark:text-zinc-100">MARK</div>
                  <div className="text-[10px] font-mono text-zinc-700 dark:text-zinc-200 font-bold">BRAND SIGNATURE</div>
                </div>

                <div className={`p-3.5 rounded-xl border space-y-1.5 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                  <span className="text-[9px] font-mono font-bold block text-zinc-400 uppercase">04 / LABEL</span>
                  <div className="text-xs font-bold font-mono text-zinc-800 dark:text-zinc-100">LABEL</div>
                  <div className="text-[10px] font-mono text-zinc-700 dark:text-zinc-200 font-bold">INFORMATION DETAIL</div>
                </div>

                <div className={`p-3.5 rounded-xl border space-y-1.5 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                  <span className="text-[9px] font-mono font-bold block text-zinc-400 uppercase">05 / COLOR</span>
                  <div className="text-xs font-bold font-mono text-zinc-800 dark:text-zinc-100">COLOR</div>
                  <div className="text-[10px] font-mono text-[#E8829C] dark:text-[#F49BB2] font-bold">ACCENT / HIGHLIGHT</div>
                </div>

                <div className={`p-3.5 rounded-xl border space-y-1.5 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                  <span className="text-[9px] font-mono font-bold block text-zinc-400 uppercase">06 / LINE</span>
                  <div className="text-xs font-bold font-mono text-zinc-800 dark:text-zinc-100">LINE</div>
                  <div className="text-[10px] font-mono text-zinc-700 dark:text-zinc-200 font-bold">HUMAN TRACE</div>
                </div>
              </div>
            </div>

            {/* 03 / MERCHANDISE CASE STUDIES (4 Representative Cases) */}
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b pb-2 gap-2 border-black/5 dark:border-white/5">
                <div>
                  <span className={`text-xs font-mono font-bold uppercase tracking-widest block ${isDark ? "text-[#6CA4C8]" : "text-[#437596]"}`}>
                    03 / MERCHANDISE CASE STUDIES
                  </span>
                  <h3 className={`text-lg font-bold font-mono ${themeClasses.bodyTitle}`}>
                    四大實體商品轉譯案例
                  </h3>
                </div>
                <span className={`text-[11px] font-mono ${themeClasses.bodySubText}`}>
                  4 REPRESENTATIVE PRODUCT CASES
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Case 01: FESTIVAL TOWEL */}
                <div className={`p-5 rounded-2xl space-y-4 border ${themeClasses.cardBg} ${themeClasses.borderColSubtle} flex flex-col justify-between`}>
                  <div className="space-y-3 font-mono">
                    <div className="flex items-center justify-between border-b pb-2 border-black/5 dark:border-white/5">
                      <span className="px-2 py-0.5 rounded bg-zinc-900 text-white text-[10px] font-bold">01 / WEAR</span>
                      <span className="text-[10px] font-bold text-[#437596] dark:text-[#6CA4C8]">FESTIVAL TOWEL</span>
                    </div>
                    <div>
                      <h4 className={`text-base font-bold ${themeClasses.bodyTitle}`}>請給我歌單 毛巾</h4>
                      <span className="text-[10px] text-zinc-400 block">FESTIVAL TOWEL</span>
                    </div>
                    <div className="aspect-square rounded-xl overflow-hidden bg-slate-100/5 relative border border-black/5 dark:border-white/5">
                      <img src="https://drive.google.com/thumbnail?sz=w1000&id=1CKKOwMbWjMwy-NTSa92APSgobK-LBwGl" alt="Festival Towel" className="w-full h-full object-cover" />
                    </div>
                    <div className="space-y-1 text-[10px] pt-1 border-t border-black/5 dark:border-white/5">
                      <div><span className="text-zinc-400 font-bold">01 / ROLE:</span> <span className="text-zinc-800 dark:text-zinc-200">音樂祭現場穿戴物件</span></div>
                      <div><span className="text-zinc-400 font-bold">02 / TRANSLATION:</span> <span className="text-[#437596] dark:text-[#6CA4C8]">WAVE + MUMㄠ MARK</span></div>
                      <div><span className="text-zinc-400 font-bold">03 / FUNCTION:</span> <span className="text-zinc-700 dark:text-zinc-300">現場應援與社群大面積識別</span></div>
                      <div><span className="text-zinc-400 font-bold">04 / MATERIAL:</span> <span className="text-zinc-700 dark:text-zinc-300">100% Cotton Towel</span></div>
                      <div><span className="text-zinc-400 font-bold">05 / PRODUCTION:</span> <span className="text-zinc-700 dark:text-zinc-300">Screen Print / Textile Print</span></div>
                      <div><span className="text-zinc-400 font-bold">06 / SCENARIO:</span> <span className="text-zinc-700 dark:text-zinc-300">Music Festival / Outdoor</span></div>
                    </div>
                  </div>
                </div>

                {/* Case 02: STICKER PACK */}
                <div className={`p-5 rounded-2xl space-y-4 border ${themeClasses.cardBg} ${themeClasses.borderColSubtle} flex flex-col justify-between`}>
                  <div className="space-y-3 font-mono">
                    <div className="flex items-center justify-between border-b pb-2 border-black/5 dark:border-white/5">
                      <span className="px-2 py-0.5 rounded bg-[#437596] text-white text-[10px] font-bold">02 / STICK</span>
                      <span className="text-[10px] font-bold text-[#437596] dark:text-[#6CA4C8]">STICKER PACK</span>
                    </div>
                    <div>
                      <h4 className={`text-base font-bold ${themeClasses.bodyTitle}`}>MUMㄠ 貼紙組</h4>
                      <span className="text-[10px] text-zinc-400 block">STICKER PACK</span>
                    </div>
                    <div className="aspect-square rounded-xl overflow-hidden bg-slate-100/5 relative border border-black/5 dark:border-white/5">
                      <img src="https://drive.google.com/thumbnail?sz=w1000&id=19cHtUo1Z8PDJzFFIqduHu943vybryNs5" alt="Sticker Pack" className="w-full h-full object-cover" />
                    </div>
                    <div className="space-y-1 text-[10px] pt-1 border-t border-black/5 dark:border-white/5">
                      <div><span className="text-zinc-400 font-bold">01 / ROLE:</span> <span className="text-zinc-800 dark:text-zinc-200">日常載具貼附物件</span></div>
                      <div><span className="text-zinc-400 font-bold">02 / TRANSLATION:</span> <span className="text-[#437596] dark:text-[#6CA4C8]">CHARACTER + MARK + LABEL</span></div>
                      <div><span className="text-zinc-400 font-bold">03 / FUNCTION:</span> <span className="text-zinc-700 dark:text-zinc-300">個人物品個性化標籤</span></div>
                      <div><span className="text-zinc-400 font-bold">04 / MATERIAL:</span> <span className="text-zinc-700 dark:text-zinc-300">Water-resistant Vinyl</span></div>
                      <div><span className="text-zinc-400 font-bold">05 / PRODUCTION:</span> <span className="text-zinc-700 dark:text-zinc-300">Die-cut / Matte Coating</span></div>
                      <div><span className="text-zinc-400 font-bold">06 / SCENARIO:</span> <span className="text-zinc-700 dark:text-zinc-300">Laptop / Phone / Helmet</span></div>
                    </div>
                  </div>
                </div>

                {/* Case 03: METAL BADGE */}
                <div className={`p-5 rounded-2xl space-y-4 border ${themeClasses.cardBg} ${themeClasses.borderColSubtle} flex flex-col justify-between`}>
                  <div className="space-y-3 font-mono">
                    <div className="flex items-center justify-between border-b pb-2 border-black/5 dark:border-white/5">
                      <span className="px-2 py-0.5 rounded bg-zinc-800 text-white text-[10px] font-bold">03 / COLLECT</span>
                      <span className="text-[10px] font-bold text-zinc-700 dark:text-zinc-300">METAL BADGE</span>
                    </div>
                    <div>
                      <h4 className={`text-base font-bold ${themeClasses.bodyTitle}`}>MUMㄠ 金屬胸章</h4>
                      <span className="text-[10px] text-zinc-400 block">METAL BADGE</span>
                    </div>
                    <div className="aspect-square rounded-xl overflow-hidden bg-slate-100/5 relative border border-black/5 dark:border-white/5">
                      <img src="https://drive.google.com/thumbnail?sz=w1000&id=1_LcCYFe2RQV4LMCDeku9iGhLDBjmMPaC" alt="Metal Badge" className="w-full h-full object-cover" />
                    </div>
                    <div className="space-y-1 text-[10px] pt-1 border-t border-black/5 dark:border-white/5">
                      <div><span className="text-zinc-400 font-bold">01 / ROLE:</span> <span className="text-zinc-800 dark:text-zinc-200">精緻文化收藏物件</span></div>
                      <div><span className="text-zinc-400 font-bold">02 / TRANSLATION:</span> <span className="text-zinc-700 dark:text-zinc-200">MUMㄠ MARK + CHARACTER</span></div>
                      <div><span className="text-zinc-400 font-bold">03 / FUNCTION:</span> <span className="text-zinc-700 dark:text-zinc-300">包款配件點綴與收藏</span></div>
                      <div><span className="text-zinc-400 font-bold">04 / MATERIAL:</span> <span className="text-zinc-700 dark:text-zinc-300">Zinc Alloy / Enamel</span></div>
                      <div><span className="text-zinc-400 font-bold">05 / PRODUCTION:</span> <span className="text-zinc-700 dark:text-zinc-300">Soft Enamel / Die-Casting</span></div>
                      <div><span className="text-zinc-400 font-bold">06 / SCENARIO:</span> <span className="text-zinc-700 dark:text-zinc-300">Bags / Jacket / Collection</span></div>
                    </div>
                  </div>
                </div>

                {/* Case 04: OUTDOOR MAT */}
                <div className={`p-5 rounded-2xl space-y-4 border ${themeClasses.cardBg} ${themeClasses.borderColSubtle} flex flex-col justify-between`}>
                  <div className="space-y-3 font-mono">
                    <div className="flex items-center justify-between border-b pb-2 border-black/5 dark:border-white/5">
                      <span className="px-2 py-0.5 rounded bg-[#437596] text-white text-[10px] font-bold">04 / LIVE</span>
                      <span className="text-[10px] font-bold text-[#437596] dark:text-[#6CA4C8]">OUTDOOR MAT</span>
                    </div>
                    <div>
                      <h4 className={`text-base font-bold ${themeClasses.bodyTitle}`}>音樂祭野餐墊</h4>
                      <span className="text-[10px] text-zinc-400 block">OUTDOOR MAT</span>
                    </div>
                    <div className="aspect-square rounded-xl overflow-hidden bg-slate-100/5 relative border border-black/5 dark:border-white/5">
                      <img src="https://drive.google.com/thumbnail?sz=w1000&id=12em0bOkBQeoI9ouMfeNmTws-KuhKsouH" alt="Outdoor Mat" className="w-full h-full object-cover" />
                    </div>
                    <div className="space-y-1 text-[10px] pt-1 border-t border-black/5 dark:border-white/5">
                      <div><span className="text-zinc-400 font-bold">01 / ROLE:</span> <span className="text-zinc-800 dark:text-zinc-200">現場情境地盤物件</span></div>
                      <div><span className="text-zinc-400 font-bold">02 / TRANSLATION:</span> <span className="text-[#437596] dark:text-[#6CA4C8]">CHARACTER + WAVE GRAPHIC</span></div>
                      <div><span className="text-zinc-400 font-bold">03 / FUNCTION:</span> <span className="text-zinc-700 dark:text-zinc-300">草地休息與空間品牌邊界</span></div>
                      <div><span className="text-zinc-400 font-bold">04 / MATERIAL:</span> <span className="text-zinc-700 dark:text-zinc-300">Waterproof Oxford Fabric</span></div>
                      <div><span className="text-zinc-400 font-bold">05 / PRODUCTION:</span> <span className="text-zinc-700 dark:text-zinc-300">Digital Sublimation Print</span></div>
                      <div><span className="text-zinc-400 font-bold">06 / SCENARIO:</span> <span className="text-zinc-700 dark:text-zinc-300">Outdoor Picnic / Festival</span></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 04 / PRODUCT ROLE SYSTEM */}
            <div className={`p-6 sm:p-8 rounded-2xl border space-y-6 ${themeClasses.cardBg} ${themeClasses.borderColSubtle}`}>
              <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b pb-4 gap-2 border-black/5 dark:border-white/5">
                <div>
                  <span className={`text-xs font-mono font-bold uppercase tracking-widest block ${isDark ? "text-[#6CA4C8]" : "text-[#437596]"}`}>
                    04 / PRODUCT ROLE SYSTEM
                  </span>
                  <h3 className={`text-xl font-bold font-mono mt-0.5 ${themeClasses.bodyTitle}`}>
                    PRODUCT ROLE SYSTEM ／ 商品角色系統
                  </h3>
                </div>
                <span className={`text-xs font-mono ${themeClasses.bodySubText}`}>
                  4 PRODUCT ROLES IN DAILY LIFE
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
                <div className={`p-4 rounded-xl border space-y-2 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-zinc-900 text-white">
                    01 / WEAR
                  </span>
                  <h4 className={`text-sm font-bold ${themeClasses.bodyTitle}`}>CHARACTER ON BODY</h4>
                  <p className={`text-xs ${themeClasses.bodySubText}`}>角色進入穿戴</p>
                </div>

                <div className={`p-4 rounded-xl border space-y-2 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-[#437596] text-white">
                    02 / STICK
                  </span>
                  <h4 className={`text-sm font-bold ${themeClasses.bodyTitle}`}>CHARACTER IN DAILY LIFE</h4>
                  <p className={`text-xs ${themeClasses.bodySubText}`}>角色進入日常</p>
                </div>

                <div className={`p-4 rounded-xl border space-y-2 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-zinc-800 text-white">
                    03 / COLLECT
                  </span>
                  <h4 className={`text-sm font-bold ${themeClasses.bodyTitle}`}>CHARACTER AS CULTURAL OBJECT</h4>
                  <p className={`text-xs ${themeClasses.bodySubText}`}>角色成為文化物件</p>
                </div>

                <div className={`p-4 rounded-xl border space-y-2 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-[#2B5573] text-white">
                    04 / LIVE
                  </span>
                  <h4 className={`text-sm font-bold ${themeClasses.bodyTitle}`}>CHARACTER IN THE SCENE</h4>
                  <p className={`text-xs ${themeClasses.bodySubText}`}>角色進入現場</p>
                </div>
              </div>

              {/* Formula Banner */}
              <div className="p-3.5 rounded-xl border border-[#2B5573] bg-[#183348] text-white font-mono text-center flex flex-wrap items-center justify-center gap-2 text-xs font-bold shadow-md">
                <span className="text-zinc-300">WEAR</span>
                <span className="text-[#6CA4C8]">+</span>
                <span className="text-zinc-300">STICK</span>
                <span className="text-[#6CA4C8]">+</span>
                <span className="text-zinc-300">COLLECT</span>
                <span className="text-[#6CA4C8]">+</span>
                <span className="text-zinc-300">LIVE</span>
                <span className="text-[#6CA4C8]">= MUMㄠ MERCH</span>
              </div>
            </div>

            {/* 05 / PRODUCT HIERARCHY */}
            <div className={`p-6 sm:p-8 rounded-2xl border space-y-6 ${themeClasses.cardBg} ${themeClasses.borderColSubtle}`}>
              <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b pb-4 gap-2 border-black/5 dark:border-white/5">
                <div>
                  <span className={`text-xs font-mono font-bold uppercase tracking-widest block ${isDark ? "text-[#6CA4C8]" : "text-[#437596]"}`}>
                    05 / PRODUCT HIERARCHY
                  </span>
                  <h3 className={`text-xl font-bold font-mono mt-0.5 ${themeClasses.bodyTitle}`}>
                    PRODUCT HIERARCHY ／ 商品接觸層級
                  </h3>
                </div>
                <span className={`text-xs font-mono ${themeClasses.bodySubText}`}>
                  HOW DEEP IS THE USER RELATIONSHIP?
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs">
                <div className={`p-4 rounded-xl border space-y-1.5 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                  <span className="text-[10px] font-bold text-[#437596] dark:text-[#6CA4C8]">01 / ENTRY</span>
                  <h4 className={`text-sm font-bold ${themeClasses.bodyTitle}`}>Sticker Pack</h4>
                  <p className={`text-xs ${themeClasses.bodySubText}`}>低門檻接觸品牌</p>
                </div>

                <div className={`p-4 rounded-xl border space-y-1.5 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                  <span className="text-[10px] font-bold text-zinc-700 dark:text-zinc-300">02 / IDENTITY</span>
                  <h4 className={`text-sm font-bold ${themeClasses.bodyTitle}`}>Metal Badge</h4>
                  <p className={`text-xs ${themeClasses.bodySubText}`}>建立角色與品牌識別</p>
                </div>

                <div className={`p-4 rounded-xl border space-y-1.5 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                  <span className="text-[10px] font-bold text-zinc-900 dark:text-zinc-100">03 / FESTIVAL</span>
                  <h4 className={`text-sm font-bold ${themeClasses.bodyTitle}`}>Festival Towel</h4>
                  <p className={`text-xs ${themeClasses.bodySubText}`}>建立音樂祭現場記憶</p>
                </div>

                <div className={`p-4 rounded-xl border space-y-1.5 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                  <span className="text-[10px] font-bold text-[#437596] dark:text-[#6CA4C8]">04 / EXPERIENCE</span>
                  <h4 className={`text-sm font-bold ${themeClasses.bodyTitle}`}>Outdoor Mat</h4>
                  <p className={`text-xs ${themeClasses.bodySubText}`}>進入真實生活與使用情境</p>
                </div>
              </div>

              {/* Depth Pipeline Banner */}
              <div className="p-3.5 rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 text-center font-mono space-y-1">
                <div className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
                  ENTRY ➔ RECOGNITION ➔ CULTURAL PARTICIPATION ➔ DAILY EXPERIENCE
                </div>
                <div className="text-[11px] text-zinc-500">
                  接觸 ➔ 辨識 ➔ 文化參與 ➔ 日常體驗
                </div>
              </div>
            </div>

            {/* 06 / MATERIAL & PRODUCTION PRINCIPLES */}
            <div className={`p-6 sm:p-8 rounded-2xl border space-y-6 ${themeClasses.cardBg} ${themeClasses.borderColSubtle}`}>
              <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b pb-4 gap-2 border-black/5 dark:border-white/5">
                <div>
                  <span className={`text-xs font-mono font-bold uppercase tracking-widest block ${isDark ? "text-[#6CA4C8]" : "text-[#437596]"}`}>
                    06 / MATERIAL & PRODUCTION PRINCIPLES
                  </span>
                  <h3 className={`text-xl font-bold font-mono mt-0.5 ${themeClasses.bodyTitle}`}>
                    MATERIAL & PRODUCTION PRINCIPLES ／ 材質與製作原則
                  </h3>
                </div>
                <span className={`text-xs font-mono ${themeClasses.bodySubText}`}>
                  MATERIAL & PRODUCTION PRINCIPLES
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs">
                {/* Textile */}
                <div className={`p-4 rounded-xl border space-y-2 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-zinc-900 text-white uppercase">TEXTILE</span>
                  <h4 className={`text-sm font-bold ${themeClasses.bodyTitle}`}>Cotton / Towel / Canvas</h4>
                  <div className="pt-2 border-t border-black/5 dark:border-white/5 text-[11px] space-y-1">
                    <span className="text-zinc-400 block font-bold">RECOMMENDED PRODUCTION:</span>
                    <span className="text-[#437596] dark:text-[#6CA4C8] font-bold block">Screen Print / Textile Print / Embroidery</span>
                  </div>
                </div>

                {/* Paper */}
                <div className={`p-4 rounded-xl border space-y-2 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#437596] text-white uppercase">PAPER</span>
                  <h4 className={`text-sm font-bold ${themeClasses.bodyTitle}`}>Sticker / Zine / Card</h4>
                  <div className="pt-2 border-t border-black/5 dark:border-white/5 text-[11px] space-y-1">
                    <span className="text-zinc-400 block font-bold">RECOMMENDED PRODUCTION:</span>
                    <span className="text-[#437596] dark:text-[#6CA4C8] font-bold block">Digital Print / Die-cut / Offset</span>
                  </div>
                </div>

                {/* Metal */}
                <div className={`p-4 rounded-xl border space-y-2 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-zinc-800 text-white uppercase">METAL</span>
                  <h4 className={`text-sm font-bold ${themeClasses.bodyTitle}`}>Badge / Pin</h4>
                  <div className="pt-2 border-t border-black/5 dark:border-white/5 text-[11px] space-y-1">
                    <span className="text-zinc-400 block font-bold">RECOMMENDED PRODUCTION:</span>
                    <span className="text-zinc-700 dark:text-zinc-200 font-bold block">Enamel / Metal Casting</span>
                  </div>
                </div>

                {/* Outdoor */}
                <div className={`p-4 rounded-xl border space-y-2 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#2B5573] text-white uppercase">OUTDOOR</span>
                  <h4 className={`text-sm font-bold ${themeClasses.bodyTitle}`}>Mat / Banner / Goods</h4>
                  <div className="pt-2 border-t border-black/5 dark:border-white/5 text-[11px] space-y-1">
                    <span className="text-zinc-400 block font-bold">RECOMMENDED PRODUCTION:</span>
                    <span className="text-[#437596] dark:text-[#6CA4C8] font-bold block">Water-resistant Textile / Digital Print</span>
                  </div>
                </div>
              </div>

              {/* Brand Production Rules */}
              <div className="space-y-2 pt-2 border-t border-black/5 dark:border-white/5">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider block text-zinc-400">BRAND PRODUCTION RULES ／ 製作四大原則</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 font-mono text-xs">
                  <div className={`p-3 rounded-lg border ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                    <span className="font-bold text-[#437596] dark:text-[#6CA4C8] block">01 / KEEP RECOGNITION</span>
                    <span className={themeClasses.bodySubText}>品牌識別優先</span>
                  </div>
                  <div className={`p-3 rounded-lg border ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                    <span className="font-bold text-zinc-800 dark:text-zinc-200 block">02 / KEEP MATERIAL HONEST</span>
                    <span className={themeClasses.bodySubText}>材質感不過度修飾</span>
                  </div>
                  <div className={`p-3 rounded-lg border ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                    <span className="font-bold text-zinc-800 dark:text-zinc-200 block">03 / KEEP GRAPHIC SIMPLE</span>
                    <span className={themeClasses.bodySubText}>圖形不過度複雜</span>
                  </div>
                  <div className={`p-3 rounded-lg border ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                    <span className="font-bold text-[#437596] dark:text-[#6CA4C8] block">04 / KEEP FUNCTION FIRST</span>
                    <span className={themeClasses.bodySubText}>先滿足使用，再談品牌裝飾</span>
                  </div>
                </div>
              </div>

              {/* Master Rule Banner */}
              <div className="p-4 rounded-xl border border-[#437596]/30 bg-[#437596]/10 text-center font-mono space-y-1">
                <span className="text-xs font-bold text-[#437596] dark:text-[#90C2E4] uppercase tracking-wide block">
                  MATERIAL CHANGES. IDENTITY REMAINS.
                </span>
                <p className="text-xs text-zinc-700 dark:text-zinc-300 font-bold">
                  「材質可以改變，品牌辨識不能消失。」
                </p>
              </div>
            </div>

            {/* 07 / MERCHANDISE IDENTIFICATION SCALE */}
            <div className={`p-6 sm:p-8 rounded-2xl border space-y-6 ${themeClasses.cardBg} ${themeClasses.borderColSubtle}`}>
              <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b pb-4 gap-2 border-black/5 dark:border-white/5">
                <div>
                  <span className={`text-xs font-mono font-bold uppercase tracking-widest block ${isDark ? "text-[#6CA4C8]" : "text-[#437596]"}`}>
                    07 / MERCHANDISE IDENTIFICATION SCALE
                  </span>
                  <h3 className={`text-xl font-bold font-mono mt-0.5 ${themeClasses.bodyTitle}`}>
                    MERCHANDISE IDENTIFICATION SCALE ／ 商品識別尺度
                  </h3>
                </div>
                <span className={`text-xs font-mono ${themeClasses.bodySubText}`}>
                  DESIGN SCALE & PLACEMENT LOGIC
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
                <div className={`p-4 rounded-xl border space-y-2 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                  <span className="text-[10px] font-bold text-[#437596] dark:text-[#6CA4C8] uppercase">HERO SCALE</span>
                  <h4 className={`text-sm font-bold ${themeClasses.bodyTitle}`}>CHARACTER / WAVE</h4>
                  <p className={themeClasses.bodySubText}>大型主視覺（例：毛巾、野餐墊主面）</p>
                </div>

                <div className={`p-4 rounded-xl border space-y-2 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                  <span className="text-[10px] font-bold text-zinc-800 dark:text-zinc-200 uppercase">MEDIUM SCALE</span>
                  <h4 className={`text-sm font-bold ${themeClasses.bodyTitle}`}>MARK / TYPE</h4>
                  <p className={themeClasses.bodySubText}>中型品牌識別（例：背包印記、胸章、服飾胸前）</p>
                </div>

                <div className={`p-4 rounded-xl border space-y-2 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                  <span className="text-[10px] font-bold text-zinc-500 uppercase">MICRO SCALE</span>
                  <h4 className={`text-sm font-bold ${themeClasses.bodyTitle}`}>LABEL / DETAIL</h4>
                  <p className={themeClasses.bodySubText}>微型資訊細節（例：車標、吊牌、側面邊角標籤）</p>
                </div>
              </div>

              {/* Scale Rule Banner */}
              <div className="p-4 rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 text-center font-mono space-y-1">
                <div className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
                  PRODUCT SIZE CHANGES. IDENTITY HIERARCHY REMAINS.
                </div>
                <div className="text-xs font-bold text-[#437596] dark:text-[#90C2E4]">
                  「商品尺寸可以改變，識別層級不能混亂。」
                </div>
              </div>
            </div>

            {/* 08 / MERCHANDISE MATRIX & 09 / DESIGN PRINCIPLES */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* 08 / MERCHANDISE USAGE MATRIX */}
              <div className={`p-6 rounded-2xl border space-y-4 ${themeClasses.cardBg} ${themeClasses.borderColSubtle}`}>
                <div className="border-b pb-3 border-black/5 dark:border-white/5">
                  <span className={`text-xs font-mono font-bold uppercase tracking-widest block ${isDark ? "text-[#6CA4C8]" : "text-[#437596]"}`}>
                    08 / MERCHANDISE USAGE MATRIX
                  </span>
                  <h3 className={`text-base font-bold font-mono ${themeClasses.bodyTitle}`}>
                    MERCHANDISE USAGE MATRIX ／ 商品使用情境矩陣
                  </h3>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs font-mono text-left border-collapse">
                    <thead>
                      <tr className={`border-b ${themeClasses.borderColSubtle}`}>
                        <th className={`py-2 px-3 uppercase text-[10px] font-bold ${themeClasses.bodySubText}`}>PRODUCT</th>
                        <th className="py-2 px-3 uppercase text-[10px] font-bold text-[#437596] dark:text-[#6CA4C8]">WEAR</th>
                        <th className="py-2 px-3 uppercase text-[10px] font-bold text-zinc-600 dark:text-zinc-300">DAILY</th>
                        <th className="py-2 px-3 uppercase text-[10px] font-bold text-zinc-800 dark:text-zinc-200">FESTIVAL</th>
                        <th className="py-2 px-3 uppercase text-[10px] font-bold text-[#437596] dark:text-[#6CA4C8]">COLLECT</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-black/5 dark:divide-white/5">
                      <tr>
                        <td className={`py-2.5 px-3 font-bold ${themeClasses.bodyTitle}`}>FESTIVAL TOWEL</td>
                        <td className="py-2.5 px-3 text-[#437596] dark:text-[#6CA4C8] font-bold">✓</td>
                        <td className="py-2.5 px-3 text-zinc-400">-</td>
                        <td className="py-2.5 px-3 text-zinc-800 dark:text-zinc-200 font-bold">✓</td>
                        <td className="py-2.5 px-3 text-[#437596] dark:text-[#6CA4C8] font-bold">✓</td>
                      </tr>
                      <tr>
                        <td className={`py-2.5 px-3 font-bold ${themeClasses.bodyTitle}`}>STICKER PACK</td>
                        <td className="py-2.5 px-3 text-zinc-400">-</td>
                        <td className="py-2.5 px-3 text-zinc-800 dark:text-zinc-200 font-bold">✓</td>
                        <td className="py-2.5 px-3 text-zinc-800 dark:text-zinc-200 font-bold">✓</td>
                        <td className="py-2.5 px-3 text-zinc-400">-</td>
                      </tr>
                      <tr>
                        <td className={`py-2.5 px-3 font-bold ${themeClasses.bodyTitle}`}>METAL BADGE</td>
                        <td className="py-2.5 px-3 text-[#437596] dark:text-[#6CA4C8] font-bold">✓</td>
                        <td className="py-2.5 px-3 text-zinc-800 dark:text-zinc-200 font-bold">✓</td>
                        <td className="py-2.5 px-3 text-zinc-800 dark:text-zinc-200 font-bold">✓</td>
                        <td className="py-2.5 px-3 text-[#437596] dark:text-[#6CA4C8] font-bold">✓</td>
                      </tr>
                      <tr>
                        <td className={`py-2.5 px-3 font-bold ${themeClasses.bodyTitle}`}>OUTDOOR MAT</td>
                        <td className="py-2.5 px-3 text-zinc-400">-</td>
                        <td className="py-2.5 px-3 text-zinc-800 dark:text-zinc-200 font-bold">✓</td>
                        <td className="py-2.5 px-3 text-zinc-800 dark:text-zinc-200 font-bold">✓</td>
                        <td className="py-2.5 px-3 text-zinc-400">-</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 09 / DESIGN PRINCIPLES */}
              <div className={`p-6 rounded-2xl border space-y-4 ${themeClasses.cardBg} ${themeClasses.borderColSubtle}`}>
                <div className="border-b pb-3 border-black/5 dark:border-white/5">
                  <span className={`text-xs font-mono font-bold uppercase tracking-widest block ${isDark ? "text-[#6CA4C8]" : "text-[#437596]"}`}>
                    09 / DESIGN PRINCIPLES
                  </span>
                  <h3 className={`text-base font-bold font-mono ${themeClasses.bodyTitle}`}>
                    DESIGN PRINCIPLES ／ 設計原則
                  </h3>
                </div>

                <div className="space-y-3 font-mono text-xs">
                  <div className={`p-3 rounded-lg border space-y-1 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                    <span className="font-bold text-[#437596] dark:text-[#6CA4C8]">01 / RECOGNITION ／ 品牌辨識</span>
                    <p className={themeClasses.bodySubText}>「看得出是 MUMㄠ。」</p>
                  </div>

                  <div className={`p-3 rounded-lg border space-y-1 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                    <span className="font-bold text-zinc-800 dark:text-zinc-200">02 / USABILITY ／ 實際使用</span>
                    <p className={themeClasses.bodySubText}>「真的有人會使用。」</p>
                  </div>

                  <div className={`p-3 rounded-lg border space-y-1 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                    <span className="font-bold text-zinc-800 dark:text-zinc-200">03 / COLLECTIBILITY ／ 收藏價值</span>
                    <p className={themeClasses.bodySubText}>「值得留下來。」</p>
                  </div>

                  {/* Master Rule */}
                  <div className="p-2.5 rounded bg-[#437596]/10 border border-[#437596]/30 text-center font-mono space-y-0.5">
                    <span className="text-[10px] font-bold text-[#437596] dark:text-[#90C2E4] uppercase block">
                      A GOOD MERCH ITEM MUST WORK BEFORE IT BECOMES A BRAND OBJECT.
                    </span>
                    <span className="text-[10px] text-zinc-500 block">
                      「好的周邊必須先是一個好用的物件，才能成為一個好的品牌物件。」
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 10 / PRODUCT FORMULA & CORE STATEMENT */}
            <div className={`p-8 rounded-2xl border ${themeClasses.cardBg} ${themeClasses.borderBlueAccent} flex flex-col md:flex-row md:items-center justify-between gap-6`}>
              <div className="space-y-3 max-w-2xl font-mono">
                <span className={`text-xs font-bold uppercase tracking-widest block ${isDark ? "text-[#6CA4C8]" : "text-[#437596]"}`}>
                  10 / PRODUCT FORMULA & CORE STATEMENT
                </span>
                <h3 className={`text-2xl sm:text-3xl font-black tracking-tight leading-tight ${themeClasses.bodyTitle}`}>
                  「識別不只存在於螢幕上。」
                </h3>
                <p className="text-sm font-bold text-[#437596] dark:text-[#6CA4C8]">
                  FROM SCREEN TO LIFE. FROM IP TO OBJECT.
                </p>
              </div>

              <div className={`p-5 rounded-xl border text-right font-mono text-xs space-y-3 shrink-0 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                <div className="space-y-1.5 text-left">
                  <span className={`block uppercase font-bold text-[10px] tracking-wider ${themeClasses.bodySubText}`}>
                    MERCHANDISE FORMULA
                  </span>
                  <div className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
                    CHARACTER + FUNCTION + CULTURE + COLLECTIBILITY = MUMㄠ MERCHANDISE
                  </div>
                </div>

                <div className="text-center text-zinc-400 font-bold text-xs py-0.5">↓</div>

                <div className="space-y-1.5 text-left pt-2 border-t border-black/5 dark:border-white/5">
                  <span className={`block uppercase font-bold text-[10px] tracking-wider ${isDark ? "text-[#6CA4C8]" : "text-[#437596]"}`}>
                    BRAND EXPERIENCE FORMULA
                  </span>
                  <div className="text-xs font-bold text-[#437596] dark:text-[#6CA4C8]">
                    VISUAL SYSTEM + MATERIAL + FUNCTION = TANGIBLE BRAND EXPERIENCE
                  </div>
                </div>
              </div>
            </div>

            {/* 11 / CHAPTER CONCLUSION */}
            <div className={`p-6 sm:p-8 rounded-2xl border space-y-6 bg-white dark:bg-[#121315] ${themeClasses.borderBlueAccent}`}>
              <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b pb-4 gap-2 border-black/5 dark:border-white/5">
                <div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#437596] text-white uppercase">
                    11 / CHAPTER CONCLUSION
                  </span>
                  <h3 className={`text-xl font-bold font-mono mt-1.5 ${themeClasses.bodyTitle}`}>
                    FROM CHARACTER TO OBJECT. ／ 從角色到物件
                  </h3>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-[#437596] dark:text-[#6CA4C8]">
                    MERCHANDISE SYSTEM SPECIFICATION
                  </span>
                </div>
              </div>

              <div className="space-y-3 font-mono text-xs leading-relaxed text-zinc-600 dark:text-zinc-300">
                <p className="font-bold text-zinc-800 dark:text-zinc-100 text-sm">
                  MUMㄠ STARTS AS A CHARACTER. IT BECOMES A VISUAL SYSTEM. THEN IT BECOMES SOMETHING PEOPLE CAN USE, CARRY, COLLECT, AND REMEMBER.
                </p>
                <p>
                  MUMㄠ 從角色開始，經過視覺系統、商品功能與文化情境，成為可以被使用、攜帶、收藏與記憶的實體物件。
                </p>
              </div>

              {/* Final Core Sentence */}
              <div className="p-4 rounded-xl border border-[#437596]/40 bg-[#437596]/10 text-center space-y-1 font-mono">
                <span className="text-sm font-black text-[#437596] dark:text-[#90C2E4] uppercase tracking-wider block">
                  NOT JUST MERCH. A PIECE OF MUMㄠ TO TAKE WITH YOU.
                </span>
                <p className="text-xs text-zinc-800 dark:text-zinc-200 font-bold">
                  「不只是周邊，而是一小部分可以帶走的 MUMㄠ。」
                </p>
              </div>
            </div>

            {/* 12 / NEXT SECTION Navigation */}
            <div className={`pt-6 flex justify-end border-t ${themeClasses.borderColSubtle}`}>
              <button
                type="button"
                onClick={() => scrollToSection("application-section")}
                className={`inline-flex items-center gap-4 px-6 py-3.5 rounded-xl border text-xs font-mono font-bold transition-all ${themeClasses.cardBg} ${themeClasses.borderColSubtle} hover:border-[#437596] hover:text-[#437596] dark:hover:border-[#6CA4C8] dark:hover:text-[#6CA4C8] group cursor-pointer`}
              >
                <div className="text-left">
                  <span className={`text-[10px] block font-mono uppercase tracking-widest ${themeClasses.bodySubText}`}>
                    NEXT SECTION
                  </span>
                  <span className="text-sm font-bold tracking-tight">
                    07 / BRAND APPLICATION →
                  </span>
                </div>
              </button>
            </div>
          </section>


          {/* ===== 10. 07 / BRAND APPLICATION (IP 商業應用體系 & COMMERCIAL ECOSYSTEM) ===== */}
          <section id="application-section" className="pt-6 space-y-12 text-left">
            <SoundwaveDivider isDark={isDark} color={isDark ? "#6CA4C8" : "#437596"} className="mb-8" />
            
            {/* Section Header */}
            <div className={`flex flex-col sm:flex-row sm:items-end justify-between border-b pb-4 gap-4 ${themeClasses.borderCol}`}>
              <div>
                <div className="flex items-center gap-2">
                  <Layers className={`h-4 w-4 ${isDark ? "text-[#6CA4C8]" : "text-[#437596]"}`} />
                  <span className={`text-xs font-mono font-bold uppercase tracking-widest block ${isDark ? "text-[#6CA4C8]" : "text-[#437596]"}`}>
                    07 / BRAND APPLICATION ‧ IP APPLICATION & COMMERCIAL ECOSYSTEM
                  </span>
                </div>
                <h2 className={`text-3xl font-bold font-mono mt-1 tracking-tight ${themeClasses.bodyTitle}`}>
                  07 / 品牌應用與 IP 商業生態系
                </h2>
              </div>

              <div className="max-w-md">
                <p className={`text-xs leading-relaxed font-mono ${themeClasses.bodySubText}`}>
                  MUMㄠ 如何從一個角色 IP，進一步形成可被品牌、活動、媒體、內容、合作與商業場景採用的 IP 系統。
                </p>
                <span className={`text-[10px] font-mono block mt-1 ${isDark ? "text-[#6CA4C8]" : "text-[#437596]"}`}>
                  FROM CHARACTER TO ECOSYSTEM.
                </span>
              </div>
            </div>

            {/* Overall Chapter Logic Banner */}
            <div className={`p-4 rounded-xl border font-mono text-xs ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
              <span className={`block uppercase font-bold text-[10px] tracking-wider mb-2 ${themeClasses.bodySubText}`}>
                CHAPTER ARCHITECTURE LOGIC / 全章導覽邏輯
              </span>
              <div className="flex flex-wrap items-center gap-1.5 font-bold text-[11px] text-[#437596] dark:text-[#6CA4C8]">
                <span>CHARACTER</span>
                <span className="text-zinc-400">→</span>
                <span>IP ASSET</span>
                <span className="text-zinc-400">→</span>
                <span>APPLICATION</span>
                <span className="text-zinc-400">→</span>
                <span>COLLABORATION</span>
                <span className="text-zinc-400">→</span>
                <span>EXPERIENCE</span>
                <span className="text-zinc-400">→</span>
                <span>AUDIENCE</span>
                <span className="text-zinc-400">→</span>
                <span className="text-[#E8829C] dark:text-[#F49BB2]">MEMORY</span>
                <span className="text-zinc-400">→</span>
                <span className="text-[#E8829C] dark:text-[#F49BB2]">IP VALUE</span>
                <span className="text-zinc-400">→</span>
                <span>NEW APPLICATION</span>
              </div>
            </div>

            {/* 01 / IP APPLICATION POSITIONING */}
            <div className={`p-6 sm:p-10 rounded-2xl border space-y-8 ${themeClasses.cardBg} ${themeClasses.borderColSubtle}`}>
              <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b pb-4 gap-2 border-black/5 dark:border-white/5">
                <div>
                  <span className={`text-xs font-mono font-bold uppercase tracking-widest block ${isDark ? "text-[#6CA4C8]" : "text-[#437596]"}`}>
                    01 / IP APPLICATION POSITIONING
                  </span>
                  <h3 className={`text-xl sm:text-2xl font-bold font-mono mt-0.5 ${themeClasses.bodyTitle}`}>
                    IP 商業應用定位
                  </h3>
                </div>
                <span className={`text-xs font-mono ${themeClasses.bodySubText}`}>
                  POSITIONING
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                {/* Left Core Statements */}
                <div className="lg:col-span-7 space-y-6">
                  <div className="space-y-2">
                    <span className={`text-2xl sm:text-4xl font-black font-mono tracking-tight block ${themeClasses.bodyTitle}`}>
                      FROM CHARACTER<br />TO ECOSYSTEM.
                    </span>
                    <p className="text-base sm:text-lg font-bold font-mono text-[#437596] dark:text-[#6CA4C8]">
                      ／ 從角色到商業生態系
                    </p>
                  </div>

                  <div className="space-y-3 pt-2">
                    <p className={`text-sm sm:text-base font-bold font-mono leading-relaxed ${themeClasses.bodyTitle}`}>
                      MUMㄠ 不只是被使用的角色，而是一套可以進入品牌、活動、媒體、內容與文化場景的 IP 資產。
                    </p>
                    <p className={`text-xs font-mono leading-relaxed uppercase tracking-wider text-zinc-500 dark:text-zinc-400`}>
                      MUMㄠ IS NOT ONLY A CHARACTER. IT IS A FLEXIBLE IP ASSET BUILT FOR CULTURAL, CREATIVE AND COMMERCIAL APPLICATION.
                    </p>
                  </div>
                </div>

                {/* Right Total Flow (IP EVOLUTION) */}
                <div className={`lg:col-span-5 p-5 rounded-xl border space-y-3 font-mono text-xs ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                  <span className={`block uppercase font-bold text-[10px] tracking-wider ${themeClasses.bodySubText}`}>
                    IP EVOLUTION PROCESS / IP 演化流程
                  </span>
                  <div className="space-y-1.5 text-center font-bold">
                    <div className="p-2 rounded bg-black/5 dark:bg-white/5 text-zinc-800 dark:text-zinc-200">CHARACTER</div>
                    <div className="text-zinc-400 text-[10px]">↓</div>
                    <div className="p-2 rounded bg-black/5 dark:bg-white/5 text-zinc-800 dark:text-zinc-200">VISUAL SYSTEM</div>
                    <div className="text-zinc-400 text-[10px]">↓</div>
                    <div className="p-2 rounded border border-[#437596]/40 bg-[#437596]/10 text-[#437596] dark:text-[#6CA4C8]">IP ASSET</div>
                    <div className="text-zinc-400 text-[10px]">↓</div>
                    <div className="p-2 rounded bg-black/5 dark:bg-white/5 text-zinc-800 dark:text-zinc-200">APPLICATION</div>
                    <div className="text-zinc-400 text-[10px]">↓</div>
                    <div className="p-2 rounded bg-black/5 dark:bg-white/5 text-zinc-800 dark:text-zinc-200">COLLABORATION</div>
                    <div className="text-zinc-400 text-[10px]">↓</div>
                    <div className="p-2 rounded bg-black/5 dark:bg-white/5 text-zinc-800 dark:text-zinc-200">EXPERIENCE</div>
                    <div className="text-zinc-400 text-[10px]">↓</div>
                    <div className="p-2.5 rounded bg-[#183348] text-white font-black text-xs sm:text-sm tracking-widest shadow-sm">COMMERCIAL ECOSYSTEM</div>
                  </div>
                </div>
              </div>
            </div>

            {/* 02 / IP ASSET SYSTEM */}
            <div className={`p-6 sm:p-8 rounded-2xl border space-y-6 ${themeClasses.cardBg} ${themeClasses.borderColSubtle}`}>
              <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b pb-4 gap-2 border-black/5 dark:border-white/5">
                <div>
                  <span className={`text-xs font-mono font-bold uppercase tracking-widest block ${isDark ? "text-[#6CA4C8]" : "text-[#437596]"}`}>
                    02 / IP ASSET SYSTEM
                  </span>
                  <h3 className={`text-xl font-bold font-mono mt-0.5 ${themeClasses.bodyTitle}`}>
                    IP 資產組成系統
                  </h3>
                </div>
                <span className={`text-xs font-mono text-[#437596] dark:text-[#6CA4C8] font-bold`}>
                  「品牌或合作方可以使用 MUMㄠ 的哪些 IP 資產？」
                </span>
              </div>

              {/* 6 Assets Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 font-mono text-xs">
                <div className={`p-4 rounded-xl border space-y-2 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                  <span className="text-[10px] font-bold text-zinc-400 block">01 / CHARACTER</span>
                  <div className={`font-bold text-sm ${themeClasses.bodyTitle}`}>MUMㄠ Character</div>
                  <div className="text-xs text-[#437596] dark:text-[#6CA4C8] font-bold">角色本體</div>
                </div>

                <div className={`p-4 rounded-xl border space-y-2 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                  <span className="text-[10px] font-bold text-zinc-400 block">02 / VISUAL</span>
                  <div className={`font-bold text-sm ${themeClasses.bodyTitle}`}>Wave / Mark / Graphic</div>
                  <div className="text-xs text-[#437596] dark:text-[#6CA4C8] font-bold">視覺資產</div>
                </div>

                <div className={`p-4 rounded-xl border space-y-2 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                  <span className="text-[10px] font-bold text-zinc-400 block">03 / STORY</span>
                  <div className={`font-bold text-sm ${themeClasses.bodyTitle}`}>Character Story / Narrative</div>
                  <div className="text-xs text-[#437596] dark:text-[#6CA4C8] font-bold">角色故事</div>
                </div>

                <div className={`p-4 rounded-xl border space-y-2 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                  <span className="text-[10px] font-bold text-zinc-400 block">04 / CONTENT</span>
                  <div className={`font-bold text-sm ${themeClasses.bodyTitle}`}>Image / Motion / Social</div>
                  <div className="text-xs text-[#437596] dark:text-[#6CA4C8] font-bold">內容資產</div>
                </div>

                <div className={`p-4 rounded-xl border space-y-2 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                  <span className="text-[10px] font-bold text-zinc-400 block">05 / PRODUCT</span>
                  <div className={`font-bold text-sm ${themeClasses.bodyTitle}`}>Merchandise / Goods</div>
                  <div className="text-xs text-[#437596] dark:text-[#6CA4C8] font-bold">商品資產</div>
                </div>

                <div className={`p-4 rounded-xl border space-y-2 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                  <span className="text-[10px] font-bold text-zinc-400 block">06 / EXPERIENCE</span>
                  <div className={`font-bold text-sm ${themeClasses.bodyTitle}`}>Festival / Event / Installation</div>
                  <div className="text-xs text-[#437596] dark:text-[#6CA4C8] font-bold">體驗資產</div>
                </div>
              </div>

              {/* ASSET ≠ APPLICATION Core Concept */}
              <div className={`p-5 rounded-xl border space-y-3 font-mono text-xs ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
                  <div className="space-y-1">
                    <span className="px-2 py-0.5 rounded bg-[#183348] text-white text-[10px] font-bold tracking-widest inline-block mb-1">
                      CORE PRINCIPLE: ASSET ≠ APPLICATION
                    </span>
                    <p className={`font-bold text-sm ${themeClasses.bodyTitle}`}>
                      「同一項 IP 資產，可以被轉譯成不同商業應用。」
                    </p>
                  </div>
                  <div className="flex items-center gap-2 font-bold text-[#437596] dark:text-[#6CA4C8]">
                    <span className="p-2 rounded bg-black/5 dark:bg-white/5 text-zinc-800 dark:text-zinc-200">IP ASSET</span>
                    <span>↓</span>
                    <span className="p-2 rounded border border-[#437596]/40 bg-[#437596]/10 text-[#437596] dark:text-[#6CA4C8]">TRANSLATION</span>
                    <span>↓</span>
                    <span className="p-2 rounded bg-[#183348] text-white">MULTIPLE APPLICATIONS</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 03 / APPLICATION TERRITORIES */}
            <div className={`p-6 sm:p-8 rounded-2xl border space-y-8 ${themeClasses.cardBg} ${themeClasses.borderColSubtle}`}>
              <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b pb-4 gap-2 border-black/5 dark:border-white/5">
                <div>
                  <span className={`text-xs font-mono font-bold uppercase tracking-widest block ${isDark ? "text-[#6CA4C8]" : "text-[#437596]"}`}>
                    03 / APPLICATION TERRITORIES
                  </span>
                  <h3 className={`text-xl font-bold font-mono mt-0.5 ${themeClasses.bodyTitle}`}>
                    IP 應用領域
                  </h3>
                </div>
                <span className={`text-xs font-mono ${themeClasses.bodySubText}`}>
                  6 TERRITORIES & IP APPLICATION MAP
                </span>
              </div>

              {/* 6 Territories Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 font-mono text-xs">
                <div className={`p-3.5 rounded-xl border space-y-1 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                  <span className="text-[10px] font-bold text-[#437596] dark:text-[#6CA4C8]">01 / CAMPAIGN</span>
                  <div className={`font-bold ${themeClasses.bodyTitle}`}>品牌活動 / 聯名企劃</div>
                </div>
                <div className={`p-3.5 rounded-xl border space-y-1 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                  <span className="text-[10px] font-bold text-[#437596] dark:text-[#6CA4C8]">02 / EVENT</span>
                  <div className={`font-bold ${themeClasses.bodyTitle}`}>音樂祭 / 展覽 / 快閃</div>
                </div>
                <div className={`p-3.5 rounded-xl border space-y-1 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                  <span className="text-[10px] font-bold text-[#437596] dark:text-[#6CA4C8]">03 / COLLABORATION</span>
                  <div className={`font-bold ${themeClasses.bodyTitle}`}>品牌跨界合作</div>
                </div>
                <div className={`p-3.5 rounded-xl border space-y-1 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                  <span className="text-[10px] font-bold text-[#437596] dark:text-[#6CA4C8]">04 / CONTENT</span>
                  <div className={`font-bold ${themeClasses.bodyTitle}`}>社群 / 短影音 / Editorial</div>
                </div>
                <div className={`p-3.5 rounded-xl border space-y-1 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                  <span className="text-[10px] font-bold text-[#437596] dark:text-[#6CA4C8]">05 / PRODUCT</span>
                  <div className={`font-bold ${themeClasses.bodyTitle}`}>聯名商品 / 限定商品</div>
                </div>
                <div className={`p-3.5 rounded-xl border space-y-1 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                  <span className="text-[10px] font-bold text-[#437596] dark:text-[#6CA4C8]">06 / EXPERIENCE</span>
                  <div className={`font-bold ${themeClasses.bodyTitle}`}>空間 / 裝置 / 現場互動</div>
                </div>
              </div>

              {/* Radial Center IP APPLICATION MAP Diagram */}
              <div className={`p-6 sm:p-8 rounded-xl border space-y-6 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                <span className={`block uppercase font-bold text-[10px] tracking-wider text-center ${themeClasses.bodySubText}`}>
                  IP APPLICATION MAP / 中心放射式應用圖譜
                </span>

                <div className="max-w-3xl mx-auto space-y-6 font-mono text-xs">
                  {/* Center Node */}
                  <div className="p-4 rounded-xl bg-[#183348] text-white text-center font-black text-base tracking-widest max-w-xs mx-auto shadow-lg border-2 border-[#437596]">
                    MUMㄠ IP
                  </div>

                  {/* Branching tree to 6 Applications */}
                  <div className="flex flex-col items-center">
                    <div className="w-0.5 h-4 bg-[#437596] dark:bg-[#6CA4C8]"></div>
                    <div className="w-full max-w-2xl h-0.5 bg-[#437596] dark:bg-[#6CA4C8]"></div>
                    <div className="flex justify-between w-full max-w-2xl h-4">
                      <div className="w-0.5 h-full bg-[#437596] dark:bg-[#6CA4C8]"></div>
                      <div className="w-0.5 h-full bg-[#437596] dark:bg-[#6CA4C8]"></div>
                      <div className="w-0.5 h-full bg-[#437596] dark:bg-[#6CA4C8]"></div>
                      <div className="w-0.5 h-full bg-[#437596] dark:bg-[#6CA4C8]"></div>
                      <div className="w-0.5 h-full bg-[#437596] dark:bg-[#6CA4C8]"></div>
                      <div className="w-0.5 h-full bg-[#437596] dark:bg-[#6CA4C8]"></div>
                    </div>
                  </div>

                  {/* 6 Application Nodes */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-center font-bold text-[11px]">
                    <div className="p-2.5 rounded-lg border border-[#437596]/40 bg-[#437596]/10 text-[#437596] dark:text-[#6CA4C8]">
                      CAMPAIGN
                    </div>
                    <div className="p-2.5 rounded-lg border border-[#437596]/40 bg-[#437596]/10 text-[#437596] dark:text-[#6CA4C8]">
                      EVENT
                    </div>
                    <div className="p-2.5 rounded-lg border border-[#437596]/40 bg-[#437596]/10 text-[#437596] dark:text-[#6CA4C8]">
                      COLLABORATION
                    </div>
                    <div className="p-2.5 rounded-lg border border-black/10 dark:border-white/10 text-zinc-800 dark:text-zinc-200">
                      CONTENT
                    </div>
                    <div className="p-2.5 rounded-lg border border-black/10 dark:border-white/10 text-zinc-800 dark:text-zinc-200">
                      PRODUCT
                    </div>
                    <div className="p-2.5 rounded-lg border border-black/10 dark:border-white/10 text-zinc-800 dark:text-zinc-200">
                      EXPERIENCE
                    </div>
                  </div>

                  {/* Convergence lines to AUDIENCE */}
                  <div className="flex flex-col items-center">
                    <div className="flex justify-between w-full max-w-2xl h-4">
                      <div className="w-0.5 h-full bg-[#437596] dark:bg-[#6CA4C8]"></div>
                      <div className="w-0.5 h-full bg-[#437596] dark:bg-[#6CA4C8]"></div>
                      <div className="w-0.5 h-full bg-[#437596] dark:bg-[#6CA4C8]"></div>
                      <div className="w-0.5 h-full bg-[#437596] dark:bg-[#6CA4C8]"></div>
                      <div className="w-0.5 h-full bg-[#437596] dark:bg-[#6CA4C8]"></div>
                      <div className="w-0.5 h-full bg-[#437596] dark:bg-[#6CA4C8]"></div>
                    </div>
                    <div className="w-full max-w-2xl h-0.5 bg-[#437596] dark:bg-[#6CA4C8]"></div>
                    <div className="w-0.5 h-4 bg-[#437596] dark:bg-[#6CA4C8]"></div>
                  </div>

                  {/* Convergence Destination Nodes */}
                  <div className="max-w-md mx-auto space-y-3 text-center">
                    <div className="p-3 rounded-xl border border-[#437596]/40 bg-[#437596]/10 text-[#437596] dark:text-[#6CA4C8] font-bold text-sm tracking-wider">
                      AUDIENCE / 受眾
                    </div>
                    <div className="text-zinc-400 font-bold text-xs">↓ PARTICIPATION</div>
                    <div className="p-3 rounded-xl bg-[#E8829C]/15 border border-[#E8829C]/40 text-[#E8829C] dark:text-[#F49BB2] font-black text-sm tracking-widest shadow-sm">
                      MEMORY / 受眾記憶
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 04 / BRAND COLLABORATION MODEL */}
            <div className={`p-6 sm:p-8 rounded-2xl border space-y-6 ${themeClasses.cardBg} ${themeClasses.borderColSubtle}`}>
              <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b pb-4 gap-2 border-black/5 dark:border-white/5">
                <div>
                  <span className={`text-xs font-mono font-bold uppercase tracking-widest block ${isDark ? "text-[#6CA4C8]" : "text-[#437596]"}`}>
                    04 / BRAND COLLABORATION MODEL
                  </span>
                  <h3 className={`text-xl font-bold font-mono mt-0.5 ${themeClasses.bodyTitle}`}>
                    品牌合作模式
                  </h3>
                </div>
                <span className={`text-xs font-mono ${themeClasses.bodySubText}`}>
                  3 COLLABORATION LEVELS & DEPTH
                </span>
              </div>

              {/* 3 Levels */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs">
                {/* Level 01 */}
                <div className={`p-5 rounded-2xl border space-y-4 flex flex-col justify-between ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center border-b pb-2 border-black/5 dark:border-white/5">
                      <span className="font-bold text-zinc-800 dark:text-zinc-100">LEVEL 01 / IP FEATURE</span>
                      <span className="px-2 py-0.5 rounded bg-zinc-800 text-white text-[10px]">VISIBILITY</span>
                    </div>
                    <div className="space-y-1">
                      <h4 className={`text-base font-bold ${themeClasses.bodyTitle}`}>01 / VISIBILITY 「被看見」</h4>
                      <p className="text-xs font-bold text-[#437596] dark:text-[#6CA4C8]">角色出現</p>
                    </div>
                    <p className={`text-xs leading-relaxed ${themeClasses.bodySubText}`}>
                      角色作為視覺元素出現於品牌行銷素材、社群貼文或活動海報中。
                    </p>
                  </div>
                  <div className={`pt-3 border-t text-[11px] space-y-1 ${themeClasses.borderColSubtle} ${themeClasses.bodySubText}`}>
                    <div className="font-bold text-zinc-700 dark:text-zinc-300 mb-1">應 用 範 疇：</div>
                    <div>• Campaign KV</div>
                    <div>• Social Post</div>
                    <div>• Event Poster</div>
                    <div>• Brand Content</div>
                  </div>
                </div>

                {/* Level 02 */}
                <div className={`p-5 rounded-2xl border space-y-4 flex flex-col justify-between ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center border-b pb-2 border-black/5 dark:border-white/5">
                      <span className="font-bold text-[#437596] dark:text-[#6CA4C8]">LEVEL 02 / IP COLLABORATION</span>
                      <span className="px-2 py-0.5 rounded bg-[#437596] text-white text-[10px]">CO-CREATION</span>
                    </div>
                    <div className="space-y-1">
                      <h4 className={`text-base font-bold ${themeClasses.bodyTitle}`}>02 / CO-CREATION 「共同創作」</h4>
                      <p className="text-xs font-bold text-[#437596] dark:text-[#6CA4C8]">角色 × 品牌共同創作</p>
                    </div>
                    <p className={`text-xs leading-relaxed ${themeClasses.bodySubText}`}>
                      角色與品牌共同開發專屬產品、特色包裝與限定活動周邊。
                    </p>
                  </div>
                  <div className={`pt-3 border-t text-[11px] space-y-1 ${themeClasses.borderColSubtle} ${themeClasses.bodySubText}`}>
                    <div className="font-bold text-zinc-700 dark:text-zinc-300 mb-1">應 用 範 疇：</div>
                    <div>• Co-branded Product</div>
                    <div>• Packaging</div>
                    <div>• Limited Edition</div>
                    <div>• Campaign</div>
                  </div>
                </div>

                {/* Level 03 */}
                <div className={`p-5 rounded-2xl border space-y-4 flex flex-col justify-between ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center border-b pb-2 border-black/5 dark:border-white/5">
                      <span className="font-bold text-[#E8829C] dark:text-[#F49BB2]">LEVEL 03 / IP EXPERIENCE</span>
                      <span className="px-2 py-0.5 rounded bg-[#E8829C] text-white text-[10px]">PARTICIPATION</span>
                    </div>
                    <div className="space-y-1">
                      <h4 className={`text-base font-bold ${themeClasses.bodyTitle}`}>03 / PARTICIPATION 「共同參與」</h4>
                      <p className="text-xs font-bold text-[#E8829C] dark:text-[#F49BB2]">角色成為整體體驗的一部分</p>
                    </div>
                    <p className={`text-xs leading-relaxed ${themeClasses.bodySubText}`}>
                      角色深度融入實體空間、展覽策劃、快閃店與音樂祭現場互動裝置。
                    </p>
                  </div>
                  <div className={`pt-3 border-t text-[11px] space-y-1 ${themeClasses.borderColSubtle} ${themeClasses.bodySubText}`}>
                    <div className="font-bold text-zinc-700 dark:text-zinc-300 mb-1">應 用 範 疇：</div>
                    <div>• Pop-up</div>
                    <div>• Festival</div>
                    <div>• Exhibition</div>
                    <div>• Installation</div>
                    <div>• Interactive Experience</div>
                  </div>
                </div>
              </div>

              {/* Bottom Level Flow & Core Sentence */}
              <div className="space-y-3 font-mono">
                <div className="p-3.5 rounded-xl border border-[#2B5573] bg-[#183348] text-white text-center text-xs font-bold tracking-widest shadow-md">
                  VISIBILITY → CO-CREATION → PARTICIPATION
                </div>
                <div className="p-4 rounded-xl border border-[#437596]/40 bg-[#437596]/10 text-center space-y-1">
                  <span className="text-sm font-black text-[#437596] dark:text-[#90C2E4] uppercase tracking-wider block">
                    FROM CHARACTER PRESENCE TO SHARED EXPERIENCE.
                  </span>
                  <p className="text-xs text-zinc-800 dark:text-zinc-200 font-bold">
                    「從角色出現，到共同創造體驗。」
                  </p>
                </div>
              </div>
            </div>

            {/* 05 / COLLABORATION PRINCIPLES */}
            <div className={`p-6 sm:p-8 rounded-2xl border space-y-6 ${themeClasses.cardBg} ${themeClasses.borderColSubtle}`}>
              <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b pb-4 gap-2 border-black/5 dark:border-white/5">
                <div>
                  <span className={`text-xs font-mono font-bold uppercase tracking-widest block ${isDark ? "text-[#6CA4C8]" : "text-[#437596]"}`}>
                    05 / COLLABORATION PRINCIPLES
                  </span>
                  <h3 className={`text-xl font-bold font-mono mt-0.5 ${themeClasses.bodyTitle}`}>
                    IP 聯名合作原則
                  </h3>
                </div>
                <span className={`text-xs font-mono ${themeClasses.bodySubText}`}>
                  3 STRATEGIC PRINCIPLES
                </span>
              </div>

              {/* 3 Principles */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs">
                <div className={`p-5 rounded-xl border space-y-3 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                  <span className="text-[10px] font-bold text-[#437596] dark:text-[#6CA4C8]">01 / KEEP IDENTITY</span>
                  <h4 className={`text-sm font-bold ${themeClasses.bodyTitle}`}>角色辨識不可消失</h4>
                  <p className={`text-xs leading-relaxed ${themeClasses.bodySubText}`}>
                    合作品牌可以改變語境，但不能破壞 MUMㄠ 核心識別。
                  </p>
                </div>

                <div className={`p-5 rounded-xl border space-y-3 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                  <span className="text-[10px] font-bold text-[#437596] dark:text-[#6CA4C8]">02 / SHARE THE LANGUAGE</span>
                  <h4 className={`text-sm font-bold ${themeClasses.bodyTitle}`}>雙方視覺語言共存</h4>
                  <div className={`text-xs leading-relaxed space-y-1 ${themeClasses.bodySubText}`}>
                    <p className="line-through opacity-60">不是單純：MUMㄠ LOGO + PARTNER LOGO</p>
                    <p className="font-bold text-zinc-800 dark:text-zinc-100">而是：MUMㄠ × PARTNER 共同形成新的視覺語言。</p>
                  </div>
                </div>

                <div className={`p-5 rounded-xl border space-y-3 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                  <span className="text-[10px] font-bold text-[#437596] dark:text-[#6CA4C8]">03 / CREATE NEW VALUE</span>
                  <h4 className={`text-sm font-bold ${themeClasses.bodyTitle}`}>合作產生新的文化價值</h4>
                  <div className={`text-xs leading-relaxed space-y-2 ${themeClasses.bodySubText}`}>
                    <p className="line-through opacity-60">不要只是：CHARACTER + LOGO</p>
                    <div className="p-2 rounded bg-[#183348] text-white font-bold text-[11px] tracking-tight">
                      CHARACTER + BRAND + CONTEXT<br />= NEW CULTURAL VALUE
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Core Sentence */}
              <div className="p-4 rounded-xl border border-[#437596]/40 bg-[#437596]/10 text-center space-y-1 font-mono">
                <span className="text-sm font-black text-[#437596] dark:text-[#90C2E4] uppercase tracking-wider block">
                  COLLABORATION IS NOT CHARACTER PLACEMENT. IT IS SHARED CULTURAL CREATION.
                </span>
                <p className="text-xs text-zinc-800 dark:text-zinc-200 font-bold">
                  「聯名不是把角色放上去，而是共同創造新的文化內容。」
                </p>
              </div>
            </div>

            {/* 06 / APPLICATION MATRIX */}
            <div className={`p-6 sm:p-8 rounded-2xl border space-y-6 ${themeClasses.cardBg} ${themeClasses.borderColSubtle}`}>
              <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b pb-4 gap-2 border-black/5 dark:border-white/5">
                <div>
                  <span className={`text-xs font-mono font-bold uppercase tracking-widest block ${isDark ? "text-[#6CA4C8]" : "text-[#437596]"}`}>
                    06 / APPLICATION MATRIX
                  </span>
                  <h3 className={`text-xl font-bold font-mono mt-0.5 ${themeClasses.bodyTitle}`}>
                    APPLICATION DEPTH MATRIX / IP 商業應用深度矩陣
                  </h3>
                </div>
                <div className="flex items-center gap-3 text-[10px] font-mono">
                  <span className="px-2 py-0.5 rounded bg-[#183348] text-white font-bold">PRIMARY</span>
                  <span className="px-2 py-0.5 rounded bg-[#437596]/20 text-[#437596] dark:text-[#6CA4C8] font-bold">SECONDARY</span>
                  <span className="px-2 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 text-zinc-500 font-bold">– NONE</span>
                </div>
              </div>

              {/* Matrix Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse font-mono text-xs">
                  <thead>
                    <tr className={`border-b ${themeClasses.borderColSubtle} ${themeClasses.cardSubtleBg}`}>
                      <th className="p-3.5 font-bold">IP ASSET</th>
                      <th className="p-3.5 font-bold text-center">CAMPAIGN</th>
                      <th className="p-3.5 font-bold text-center">EVENT</th>
                      <th className="p-3.5 font-bold text-center">COLLAB</th>
                      <th className="p-3.5 font-bold text-center">CONTENT</th>
                      <th className="p-3.5 font-bold text-center">PRODUCT</th>
                      <th className="p-3.5 font-bold text-center">EXPERIENCE</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${themeClasses.borderColSubtle}`}>
                    <tr>
                      <td className="p-3.5 font-bold text-[#437596] dark:text-[#6CA4C8]">CHARACTER</td>
                      <td className="p-3.5 text-center"><span className="px-2 py-1 rounded bg-[#183348] text-white font-bold text-[10px]">PRIMARY</span></td>
                      <td className="p-3.5 text-center"><span className="px-2 py-1 rounded bg-[#183348] text-white font-bold text-[10px]">PRIMARY</span></td>
                      <td className="p-3.5 text-center"><span className="px-2 py-1 rounded bg-[#183348] text-white font-bold text-[10px]">PRIMARY</span></td>
                      <td className="p-3.5 text-center"><span className="px-2 py-1 rounded bg-[#183348] text-white font-bold text-[10px]">PRIMARY</span></td>
                      <td className="p-3.5 text-center"><span className="px-2 py-1 rounded bg-[#183348] text-white font-bold text-[10px]">PRIMARY</span></td>
                      <td className="p-3.5 text-center"><span className="px-2 py-1 rounded bg-[#183348] text-white font-bold text-[10px]">PRIMARY</span></td>
                    </tr>
                    <tr>
                      <td className="p-3.5 font-bold text-[#437596] dark:text-[#6CA4C8]">VISUAL</td>
                      <td className="p-3.5 text-center"><span className="px-2 py-1 rounded bg-[#183348] text-white font-bold text-[10px]">PRIMARY</span></td>
                      <td className="p-3.5 text-center"><span className="px-2 py-1 rounded bg-[#183348] text-white font-bold text-[10px]">PRIMARY</span></td>
                      <td className="p-3.5 text-center"><span className="px-2 py-1 rounded bg-[#183348] text-white font-bold text-[10px]">PRIMARY</span></td>
                      <td className="p-3.5 text-center"><span className="px-2 py-1 rounded bg-[#437596]/20 text-[#437596] dark:text-[#6CA4C8] font-bold text-[10px]">SECONDARY</span></td>
                      <td className="p-3.5 text-center"><span className="px-2 py-1 rounded bg-[#183348] text-white font-bold text-[10px]">PRIMARY</span></td>
                      <td className="p-3.5 text-center"><span className="px-2 py-1 rounded bg-[#183348] text-white font-bold text-[10px]">PRIMARY</span></td>
                    </tr>
                    <tr>
                      <td className="p-3.5 font-bold text-[#437596] dark:text-[#6CA4C8]">STORY</td>
                      <td className="p-3.5 text-center"><span className="px-2 py-1 rounded bg-[#437596]/20 text-[#437596] dark:text-[#6CA4C8] font-bold text-[10px]">SECONDARY</span></td>
                      <td className="p-3.5 text-center"><span className="px-2 py-1 rounded bg-[#183348] text-white font-bold text-[10px]">PRIMARY</span></td>
                      <td className="p-3.5 text-center"><span className="px-2 py-1 rounded bg-[#183348] text-white font-bold text-[10px]">PRIMARY</span></td>
                      <td className="p-3.5 text-center"><span className="px-2 py-1 rounded bg-[#183348] text-white font-bold text-[10px]">PRIMARY</span></td>
                      <td className="p-3.5 text-center"><span className="text-zinc-400 font-bold">–</span></td>
                      <td className="p-3.5 text-center"><span className="px-2 py-1 rounded bg-[#183348] text-white font-bold text-[10px]">PRIMARY</span></td>
                    </tr>
                    <tr>
                      <td className="p-3.5 font-bold text-[#437596] dark:text-[#6CA4C8]">CONTENT</td>
                      <td className="p-3.5 text-center"><span className="px-2 py-1 rounded bg-[#183348] text-white font-bold text-[10px]">PRIMARY</span></td>
                      <td className="p-3.5 text-center"><span className="px-2 py-1 rounded bg-[#183348] text-white font-bold text-[10px]">PRIMARY</span></td>
                      <td className="p-3.5 text-center"><span className="px-2 py-1 rounded bg-[#183348] text-white font-bold text-[10px]">PRIMARY</span></td>
                      <td className="p-3.5 text-center"><span className="px-2 py-1 rounded bg-[#183348] text-white font-bold text-[10px]">PRIMARY</span></td>
                      <td className="p-3.5 text-center"><span className="px-2 py-1 rounded bg-[#183348] text-white font-bold text-[10px]">PRIMARY</span></td>
                      <td className="p-3.5 text-center"><span className="px-2 py-1 rounded bg-[#183348] text-white font-bold text-[10px]">PRIMARY</span></td>
                    </tr>
                    <tr>
                      <td className="p-3.5 font-bold text-[#437596] dark:text-[#6CA4C8]">PRODUCT</td>
                      <td className="p-3.5 text-center"><span className="text-zinc-400 font-bold">–</span></td>
                      <td className="p-3.5 text-center"><span className="px-2 py-1 rounded bg-[#437596]/20 text-[#437596] dark:text-[#6CA4C8] font-bold text-[10px]">SECONDARY</span></td>
                      <td className="p-3.5 text-center"><span className="px-2 py-1 rounded bg-[#183348] text-white font-bold text-[10px]">PRIMARY</span></td>
                      <td className="p-3.5 text-center"><span className="px-2 py-1 rounded bg-[#437596]/20 text-[#437596] dark:text-[#6CA4C8] font-bold text-[10px]">SECONDARY</span></td>
                      <td className="p-3.5 text-center"><span className="px-2 py-1 rounded bg-[#183348] text-white font-bold text-[10px]">PRIMARY</span></td>
                      <td className="p-3.5 text-center"><span className="px-2 py-1 rounded bg-[#437596]/20 text-[#437596] dark:text-[#6CA4C8] font-bold text-[10px]">SECONDARY</span></td>
                    </tr>
                    <tr>
                      <td className="p-3.5 font-bold text-[#437596] dark:text-[#6CA4C8]">EXPERIENCE</td>
                      <td className="p-3.5 text-center"><span className="px-2 py-1 rounded bg-[#437596]/20 text-[#437596] dark:text-[#6CA4C8] font-bold text-[10px]">SECONDARY</span></td>
                      <td className="p-3.5 text-center"><span className="px-2 py-1 rounded bg-[#183348] text-white font-bold text-[10px]">PRIMARY</span></td>
                      <td className="p-3.5 text-center"><span className="px-2 py-1 rounded bg-[#183348] text-white font-bold text-[10px]">PRIMARY</span></td>
                      <td className="p-3.5 text-center"><span className="text-zinc-400 font-bold">–</span></td>
                      <td className="p-3.5 text-center"><span className="px-2 py-1 rounded bg-[#437596]/20 text-[#437596] dark:text-[#6CA4C8] font-bold text-[10px]">SECONDARY</span></td>
                      <td className="p-3.5 text-center"><span className="px-2 py-1 rounded bg-[#183348] text-white font-bold text-[10px]">PRIMARY</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Bottom Core Statement */}
              <div className="p-4 rounded-xl border border-[#437596]/40 bg-[#437596]/10 text-center space-y-1 font-mono">
                <span className="text-sm font-black text-[#437596] dark:text-[#90C2E4] uppercase tracking-wider block">
                  APPLICATION DEPTH CHANGES. IP RECOGNITION REMAINS.
                </span>
                <p className="text-xs text-zinc-800 dark:text-zinc-200 font-bold">
                  「應用深度可以改變，IP 辨識仍然保持。」
                </p>
              </div>
            </div>

            {/* 07 / COMMERCIAL ECOSYSTEM */}
            <div className={`p-6 sm:p-10 rounded-2xl border space-y-8 ${themeClasses.cardBg} ${themeClasses.borderColSubtle}`}>
              <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b pb-4 gap-2 border-black/5 dark:border-white/5">
                <div>
                  <span className={`text-xs font-mono font-bold uppercase tracking-widest block ${isDark ? "text-[#6CA4C8]" : "text-[#437596]"}`}>
                    07 / COMMERCIAL ECOSYSTEM
                  </span>
                  <h3 className={`text-xl font-bold font-mono mt-0.5 ${themeClasses.bodyTitle}`}>
                    IP 商業生態系
                  </h3>
                </div>
                <span className={`text-xs font-mono ${themeClasses.bodySubText}`}>
                  IP ECOSYSTEM MAP
                </span>
              </div>

              {/* ECOSYSTEM ENABLERS (BRAND & MEDIA) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
                <div className={`p-4 rounded-xl border space-y-2.5 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                  <div className="flex justify-between items-center border-b pb-2 border-black/5 dark:border-white/5">
                    <span className="font-bold text-zinc-800 dark:text-zinc-100 uppercase tracking-wider">BRAND / 品牌夥伴</span>
                    <span className="px-2 py-0.5 rounded bg-[#437596]/15 text-[#437596] dark:text-[#6CA4C8] text-[10px] font-bold">ECOSYSTEM ENABLER</span>
                  </div>
                  <p className={`text-xs leading-relaxed ${themeClasses.bodySubText}`}>
                    Co-branding · Partnership · Collaboration
                  </p>
                  <p className="text-[11px] font-bold text-[#437596] dark:text-[#6CA4C8]">
                    推動 IP 應用的外部商業力量（BRAND ↓ APPLICATION ↓ AUDIENCE）
                  </p>
                </div>

                <div className={`p-4 rounded-xl border space-y-2.5 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                  <div className="flex justify-between items-center border-b pb-2 border-black/5 dark:border-white/5">
                    <span className="font-bold text-zinc-800 dark:text-zinc-100 uppercase tracking-wider">MEDIA / 傳播媒介</span>
                    <span className="px-2 py-0.5 rounded bg-[#437596]/15 text-[#437596] dark:text-[#6CA4C8] text-[10px] font-bold">ECOSYSTEM ENABLER</span>
                  </div>
                  <p className={`text-xs leading-relaxed ${themeClasses.bodySubText}`}>
                    Social · Editorial · Digital · Press
                  </p>
                  <p className="text-[11px] font-bold text-[#437596] dark:text-[#6CA4C8]">
                    放大 IP 聲量的傳播渠道（MEDIA ↓ APPLICATION ↓ AUDIENCE）
                  </p>
                </div>
              </div>

              {/* Ecosystem Map Diagram */}
              <div className={`p-6 sm:p-10 rounded-xl border space-y-6 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                <span className={`block uppercase font-bold text-[10px] tracking-wider text-center ${themeClasses.bodySubText}`}>
                  IP ECOSYSTEM MAP / 商業生態地圖
                </span>

                <div className="max-w-2xl mx-auto space-y-6 font-mono text-xs">
                  {/* Center Core: MUMㄠ IP (Deep Navy) */}
                  <div className="text-center">
                    <span className="p-4 rounded-xl bg-[#183348] text-white font-black text-base tracking-widest shadow-lg border-2 border-[#437596] inline-block px-10">
                      MUMㄠ IP
                    </span>
                  </div>

                  {/* Branching Tree Line to 6 Applications */}
                  <div className="flex flex-col items-center">
                    <div className="w-0.5 h-4 bg-[#437596] dark:bg-[#6CA4C8]"></div>
                    <div className="w-full max-w-lg h-0.5 bg-[#437596] dark:bg-[#6CA4C8]"></div>
                    <div className="flex justify-between w-full max-w-lg h-4">
                      <div className="w-0.5 h-full bg-[#437596] dark:bg-[#6CA4C8]"></div>
                      <div className="w-0.5 h-full bg-[#437596] dark:bg-[#6CA4C8]"></div>
                      <div className="w-0.5 h-full bg-[#437596] dark:bg-[#6CA4C8]"></div>
                    </div>
                  </div>

                  {/* Row 1: CAMPAIGN / EVENT / COLLABORATION */}
                  <div className="grid grid-cols-3 gap-3 text-center font-bold">
                    <div className="p-3 rounded-lg border border-[#437596]/40 bg-[#437596]/10 text-[#437596] dark:text-[#6CA4C8]">
                      CAMPAIGN
                    </div>
                    <div className="p-3 rounded-lg border border-[#437596]/40 bg-[#437596]/10 text-[#437596] dark:text-[#6CA4C8]">
                      EVENT
                    </div>
                    <div className="p-3 rounded-lg border border-[#437596]/40 bg-[#437596]/10 text-[#437596] dark:text-[#6CA4C8]">
                      COLLABORATION
                    </div>
                  </div>

                  {/* Connectors Row 1 -> Row 2 */}
                  <div className="flex flex-col items-center">
                    <div className="w-0.5 h-3 bg-[#437596] dark:bg-[#6CA4C8]"></div>
                  </div>

                  {/* Row 2: CONTENT / PRODUCT / EXPERIENCE */}
                  <div className="grid grid-cols-3 gap-3 text-center font-bold">
                    <div className="p-3 rounded-lg border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 text-zinc-800 dark:text-zinc-200">
                      CONTENT
                    </div>
                    <div className="p-3 rounded-lg border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 text-zinc-800 dark:text-zinc-200">
                      PRODUCT
                    </div>
                    <div className="p-3 rounded-lg border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 text-zinc-800 dark:text-zinc-200">
                      EXPERIENCE
                    </div>
                  </div>

                  {/* Convergence Tree Line to Audience */}
                  <div className="flex flex-col items-center">
                    <div className="flex justify-between w-full max-w-lg h-4">
                      <div className="w-0.5 h-full bg-[#437596] dark:bg-[#6CA4C8]"></div>
                      <div className="w-0.5 h-full bg-[#437596] dark:bg-[#6CA4C8]"></div>
                      <div className="w-0.5 h-full bg-[#437596] dark:bg-[#6CA4C8]"></div>
                    </div>
                    <div className="w-full max-w-lg h-0.5 bg-[#437596] dark:bg-[#6CA4C8]"></div>
                    <div className="w-0.5 h-4 bg-[#437596] dark:bg-[#6CA4C8]"></div>
                  </div>

                  {/* Flow: AUDIENCE -> PARTICIPATION -> MEMORY -> IP VALUE -> NEW APPLICATION */}
                  <div className="text-center space-y-3">
                    <div className="p-3 rounded-xl border border-[#437596]/40 bg-[#437596]/15 text-[#437596] dark:text-[#6CA4C8] font-bold inline-block px-10 text-sm">
                      AUDIENCE / 受眾
                    </div>
                    <div className="text-zinc-400 text-xs font-bold">↓ PARTICIPATION / 參與</div>
                    <div className="p-3 rounded-xl bg-[#E8829C]/15 border border-[#E8829C]/40 text-[#E8829C] dark:text-[#F49BB2] font-black inline-block px-10 text-sm">
                      MEMORY / 品牌記憶
                    </div>
                    <div className="text-zinc-400 text-xs font-bold">↓ GENERATES</div>
                    <div className="p-3.5 rounded-xl bg-[#183348] text-white font-black text-sm tracking-widest shadow-md inline-block px-12">
                      IP VALUE / IP 價值
                    </div>
                    <div className="text-zinc-400 text-xs font-bold">↓ EXPANDS TO</div>
                    <div className="p-3 rounded-xl border-2 border-[#E8829C] bg-[#E8829C]/10 text-[#E8829C] dark:text-[#F49BB2] font-black inline-block px-8 text-xs sm:text-sm">
                      NEW APPLICATION ↺ (RECURS TO MUMㄠ IP)
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Logic Statement */}
              <div className="p-4 rounded-xl border border-[#437596]/40 bg-[#437596]/10 text-center space-y-1 font-mono">
                <span className="text-xs sm:text-sm font-black text-[#437596] dark:text-[#90C2E4] uppercase tracking-wider block">
                  MUMㄠ IP → MULTIPLE APPLICATIONS → AUDIENCE PARTICIPATION → MEMORY → IP VALUE → NEW APPLICATION
                </span>
                <p className="text-xs text-zinc-800 dark:text-zinc-200 font-bold">
                  「一個 IP，不只產生一種應用，而是透過不同場景持續產生受眾參與與品牌記憶。」
                </p>
              </div>
            </div>

            {/* 08 / IP VALUE LOOP */}
            <div className={`p-6 sm:p-8 rounded-2xl border space-y-6 ${themeClasses.cardBg} ${themeClasses.borderColSubtle}`}>
              <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b pb-4 gap-2 border-black/5 dark:border-white/5">
                <div>
                  <span className={`text-xs font-mono font-bold uppercase tracking-widest block ${isDark ? "text-[#6CA4C8]" : "text-[#437596]"}`}>
                    08 / IP VALUE LOOP
                  </span>
                  <h3 className={`text-xl font-bold font-mono mt-0.5 ${themeClasses.bodyTitle}`}>
                    IP 價值循環
                  </h3>
                </div>
                <span className={`text-xs font-mono ${themeClasses.bodySubText}`}>
                  CLOSED VALUE RECURSION CYCLE
                </span>
              </div>

              {/* Loop Diagram with explicit recursion return */}
              <div className={`p-6 sm:p-8 rounded-xl border space-y-4 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                <div className="max-w-md mx-auto space-y-2 font-mono text-xs text-center font-bold relative">
                  {/* Outer Loop Line Indicator */}
                  <div className="absolute left-0 top-3 bottom-3 w-3 border-l-2 border-t-2 border-b-2 border-[#E8829C]/50 rounded-l-xl hidden sm:block"></div>
                  <div className="absolute left-[-24px] top-1/2 -translate-y-1/2 text-[10px] text-[#E8829C] font-bold -rotate-90 hidden sm:block">RECURSION</div>

                  <div className="p-2.5 rounded-lg border border-black/10 dark:border-white/10 text-zinc-800 dark:text-zinc-200">
                    CHARACTER
                  </div>
                  <div className="text-zinc-400 text-[10px]">↓</div>
                  <div className="p-2.5 rounded-lg border border-black/10 dark:border-white/10 text-zinc-800 dark:text-zinc-200">
                    CULTURAL PRESENCE
                  </div>
                  <div className="text-zinc-400 text-[10px]">↓</div>
                  <div className="p-2.5 rounded-lg border border-[#437596]/40 bg-[#437596]/10 text-[#437596] dark:text-[#6CA4C8]">
                    APPLICATION
                  </div>
                  <div className="text-zinc-400 text-[10px]">↓</div>
                  <div className="p-2.5 rounded-lg border border-black/10 dark:border-white/10 text-zinc-800 dark:text-zinc-200">
                    AUDIENCE
                  </div>
                  <div className="text-zinc-400 text-[10px]">↓</div>
                  <div className="p-2.5 rounded-lg border border-black/10 dark:border-white/10 text-zinc-800 dark:text-zinc-200">
                    PARTICIPATION
                  </div>
                  <div className="text-zinc-400 text-[10px]">↓</div>
                  <div className="p-2.5 rounded-lg border border-[#E8829C]/40 bg-[#E8829C]/10 text-[#E8829C] dark:text-[#F49BB2]">
                    MEMORY
                  </div>
                  <div className="text-zinc-400 text-[10px]">↓</div>
                  <div className="p-3 rounded-lg bg-[#183348] text-white font-black text-sm tracking-widest shadow-md">
                    IP VALUE
                  </div>
                  <div className="text-zinc-400 text-[10px]">↓</div>
                  <div className="p-2.5 rounded-lg border-2 border-[#E8829C] bg-[#E8829C]/10 text-[#E8829C] dark:text-[#F49BB2] font-black">
                    NEW APPLICATION ↺ (RECURS BACK TO CHARACTER)
                  </div>
                </div>
              </div>

              {/* Core Sentence */}
              <div className="p-4 rounded-xl border border-[#437596]/40 bg-[#437596]/10 text-center space-y-1 font-mono">
                <span className="text-sm font-black text-[#437596] dark:text-[#90C2E4] uppercase tracking-wider block">
                  APPLICATION CREATES MEMORY. MEMORY CREATES IP VALUE.
                </span>
                <p className="text-xs text-zinc-800 dark:text-zinc-200 font-bold">
                  「應用創造記憶，記憶累積 IP 價值。」
                </p>
              </div>
            </div>

            {/* 09 / CHAPTER CONCLUSION */}
            <div className={`p-8 sm:p-12 rounded-2xl border ${themeClasses.cardBg} ${themeClasses.borderBlueAccent} space-y-8`}>
              <div className="space-y-3">
                <span className={`text-xs font-mono font-bold uppercase tracking-widest block ${isDark ? "text-[#6CA4C8]" : "text-[#437596]"}`}>
                  09 / CHAPTER CONCLUSION
                </span>
                <h3 className={`text-2xl sm:text-4xl font-black font-mono tracking-tight leading-none ${themeClasses.bodyTitle}`}>
                  FROM CHARACTER TO ECOSYSTEM.
                </h3>
                <p className="text-base sm:text-lg font-bold font-mono text-[#437596] dark:text-[#6CA4C8]">
                  ／ 從角色到商業生態系
                </p>
              </div>

              <div className="space-y-3 border-t pt-6 border-black/5 dark:border-white/5 font-mono">
                <p className={`text-sm sm:text-base leading-relaxed ${themeClasses.bodyText}`}>
                  MUMㄠ 從一個角色開始，透過文化、視覺、商品、內容與品牌合作，逐漸形成可以持續擴張的 IP 商業生態。
                </p>
                <p className={`text-xs leading-relaxed uppercase tracking-wider text-zinc-500 dark:text-zinc-400`}>
                  MUMㄠ STARTS AS A CHARACTER. THROUGH CULTURE, VISUAL SYSTEMS, PRODUCTS, CONTENT, EXPERIENCE AND COLLABORATION, IT EVOLVES INTO A SCALABLE IP ECOSYSTEM.
                </p>
              </div>

              {/* Final Core Sentence */}
              <div className="p-4 rounded-xl border border-[#437596]/40 bg-[#437596]/10 text-center space-y-1 font-mono">
                <span className="text-sm font-black text-[#437596] dark:text-[#90C2E4] uppercase tracking-wider block">
                  NOT JUST A CHARACTER. A SYSTEM PEOPLE CAN SEE, USE, JOIN AND REMEMBER.
                </span>
                <p className="text-xs text-zinc-800 dark:text-zinc-200 font-bold">
                  「不只是一個角色，而是一套人們可以看見、使用、參與並記住的系統。」
                </p>
              </div>
            </div>

            {/* CHAPTER TRANSITION & Next Section Navigation */}
            <div className={`p-6 rounded-2xl border space-y-4 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle} font-mono`}>
              <div className="space-y-1 text-left border-b pb-3 border-black/5 dark:border-white/5">
                <span className={`text-[10px] block font-bold uppercase tracking-widest ${isDark ? "text-[#6CA4C8]" : "text-[#437596]"}`}>
                  CHAPTER TRANSITION / 章節過渡
                </span>
                <h4 className={`text-sm sm:text-base font-bold ${themeClasses.bodyTitle}`}>
                  FROM IP SYSTEM TO BRAND EXPERIENCE.
                </h4>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 font-bold">
                  ／ 從 IP 系統進入品牌體驗
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                {/* Transition Flow */}
                <div className="flex items-center gap-2 text-xs font-bold text-[#437596] dark:text-[#6CA4C8]">
                  <span className="px-3 py-1.5 rounded bg-black/5 dark:bg-white/5 text-zinc-800 dark:text-zinc-200">IP</span>
                  <span>→</span>
                  <span className="px-3 py-1.5 rounded bg-black/5 dark:bg-white/5 text-zinc-800 dark:text-zinc-200">APPLICATION</span>
                  <span>→</span>
                  <span className="px-3 py-1.5 rounded bg-[#183348] text-white">EXPERIENCE</span>
                </div>

                {/* Nav Button */}
                <button
                  type="button"
                  onClick={() => scrollToSection("experience-section")}
                  className={`inline-flex items-center gap-4 px-6 py-3.5 rounded-xl border text-xs font-mono font-bold transition-all ${themeClasses.cardBg} ${themeClasses.borderColSubtle} hover:border-[#437596] hover:text-[#437596] dark:hover:border-[#6CA4C8] dark:hover:text-[#6CA4C8] group cursor-pointer`}
                >
                  <div className="text-left">
                    <span className={`text-[10px] block font-mono uppercase tracking-widest ${themeClasses.bodySubText}`}>
                      NEXT SECTION
                    </span>
                    <span className="text-sm font-bold tracking-tight">
                      08 / BRAND EXPERIENCE →
                    </span>
                  </div>
                </button>
              </div>
            </div>
          </section>

          {/* ===== 08. BRAND EXPERIENCE ‧ IP EXPERIENCE & CULTURAL PARTICIPATION (品牌體驗與文化參與系統) ===== */}
          <section id="experience-section" className={`space-y-16 text-left border-t pt-20 ${themeClasses.borderColSubtle}`}>
            
            {/* Chapter Header */}
            <div className="space-y-4 font-mono">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-4 border-black/10 dark:border-white/10">
                <div className="flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full bg-[#E8829C] inline-block animate-pulse" />
                  <span className={`text-xs font-bold uppercase tracking-widest ${isDark ? "text-[#6CA4C8]" : "text-[#437596]"}`}>
                    08 / BRAND EXPERIENCE
                  </span>
                </div>
                <span className="text-xs text-zinc-400 font-bold uppercase tracking-widest">
                  IP EXPERIENCE & CULTURAL PARTICIPATION
                </span>
              </div>

              <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pt-2">
                <div className="space-y-2">
                  <h2 className={`text-3xl sm:text-5xl font-black tracking-tight leading-none ${themeClasses.bodyTitle}`}>
                    BRAND EXPERIENCE SYSTEM
                  </h2>
                  <p className="text-lg sm:text-xl font-bold text-[#437596] dark:text-[#6CA4C8]">
                    08 / 品牌體驗與文化參與系統
                  </p>
                </div>
                <p className={`text-xs max-w-md leading-relaxed ${themeClasses.bodySubText}`}>
                  MUMㄠ 不只是被看見，而是被遇見、被參與、被記住的文化體驗系統。
                </p>
              </div>
            </div>

            {/* 01 / EXPERIENCE POSITIONING */}
            <div className={`p-6 sm:p-8 rounded-2xl border space-y-6 ${themeClasses.cardBg} ${themeClasses.borderColSubtle}`}>
              <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b pb-4 gap-2 border-black/5 dark:border-white/5 font-mono">
                <div>
                  <span className={`text-xs font-bold uppercase tracking-widest block ${isDark ? "text-[#6CA4C8]" : "text-[#437596]"}`}>
                    01 / EXPERIENCE POSITIONING
                  </span>
                  <h3 className={`text-xl font-bold mt-0.5 ${themeClasses.bodyTitle}`}>
                    品牌體驗定位
                  </h3>
                </div>
                <span className={`text-xs ${themeClasses.bodySubText}`}>
                  FROM IP TO EXPERIENCE
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center font-mono">
                <div className="lg:col-span-7 space-y-4">
                  <h4 className={`text-2xl sm:text-3xl font-black tracking-tight leading-tight ${themeClasses.bodyTitle}`}>
                    FROM IP TO EXPERIENCE.
                  </h4>
                  <p className="text-base sm:text-lg font-bold text-[#437596] dark:text-[#6CA4C8]">
                    ／ 從一個角色，到一種可以參與的文化體驗
                  </p>

                  <div className="p-4 rounded-xl border border-[#437596]/40 bg-[#437596]/10 space-y-2">
                    <p className="text-base sm:text-lg font-bold text-zinc-800 dark:text-zinc-100 leading-snug">
                      「MUMㄠ 不只是被看見，而是被遇見、被參與、被記住。」
                    </p>
                    <p className="text-xs text-[#437596] dark:text-[#6CA4C8] uppercase tracking-wider">
                      MUMㄠ IS NOT JUST SEEN. IT IS ENCOUNTERED, PARTICIPATED IN, AND REMEMBERED.
                    </p>
                  </div>

                  <p className={`text-xs sm:text-sm leading-relaxed ${themeClasses.bodyText}`}>
                    本章將視覺識別（Visual System）、實體周邊（Merchandise）與商業應用（Brand Application）整合為完整的使用者經驗，規範人與 MUMㄠ 接觸的每一個節點與情感累積過程。
                  </p>
                </div>

                {/* Right: Evolution Flow */}
                <div className="lg:col-span-5 p-5 rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 space-y-3">
                  <span className={`text-[10px] font-bold uppercase tracking-widest block ${themeClasses.bodySubText}`}>
                    EXPERIENCE EVOLUTION / 體驗演進流程
                  </span>
                  
                  <div className="space-y-2 text-xs font-bold">
                    <div className="p-2.5 rounded-lg border border-black/10 dark:border-white/10 text-zinc-800 dark:text-zinc-200">
                      CHARACTER / 角色
                    </div>
                    <div className="text-center text-zinc-400 text-[10px]">↓</div>
                    <div className="p-2.5 rounded-lg border border-black/10 dark:border-white/10 text-zinc-800 dark:text-zinc-200">
                      VISUAL / 視覺系統
                    </div>
                    <div className="text-center text-zinc-400 text-[10px]">↓</div>
                    <div className="p-2.5 rounded-lg border border-black/10 dark:border-white/10 text-zinc-800 dark:text-zinc-200">
                      OBJECT / 實體物件
                    </div>
                    <div className="text-center text-zinc-400 text-[10px]">↓</div>
                    <div className="p-2.5 rounded-lg border border-black/10 dark:border-white/10 text-zinc-800 dark:text-zinc-200">
                      SPACE / 場域與現場
                    </div>
                    <div className="text-center text-zinc-400 text-[10px]">↓</div>
                    <div className="p-2.5 rounded-lg border border-black/10 dark:border-white/10 text-zinc-800 dark:text-zinc-200">
                      PARTICIPATION / 群眾參與
                    </div>
                    <div className="text-center text-zinc-400 text-[10px]">↓</div>
                    <div className="p-3 rounded-xl bg-[#E8829C]/15 border border-[#E8829C]/40 text-[#E8829C] dark:text-[#F49BB2] font-black text-center">
                      MEMORY / 品牌記憶
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 02 / EXPERIENCE TOUCHPOINT SYSTEM */}
            <div className={`p-6 sm:p-8 rounded-2xl border space-y-6 ${themeClasses.cardBg} ${themeClasses.borderColSubtle}`}>
              <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b pb-4 gap-2 border-black/5 dark:border-white/5 font-mono">
                <div>
                  <span className={`text-xs font-bold uppercase tracking-widest block ${isDark ? "text-[#6CA4C8]" : "text-[#437596]"}`}>
                    02 / EXPERIENCE TOUCHPOINT SYSTEM
                  </span>
                  <h3 className={`text-xl font-bold mt-0.5 ${themeClasses.bodyTitle}`}>
                    品牌體驗接觸點
                  </h3>
                </div>
                <span className={`text-xs ${themeClasses.bodySubText}`}>
                  6 EXPERIENCE TOUCHPOINTS
                </span>
              </div>

              {/* 6 Touchpoints Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 font-mono text-xs">
                {/* 01 / MUSIC */}
                <div className={`p-5 rounded-xl border space-y-3 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                  <div className="flex items-center justify-between border-b pb-2 border-black/5 dark:border-white/5">
                    <span className="font-bold text-[#437596] dark:text-[#6CA4C8] text-sm">01 / MUSIC</span>
                    <span className="px-2 py-0.5 rounded bg-black/5 dark:bg-white/5 text-[10px] font-bold">音樂</span>
                  </div>
                  <p className="font-bold text-zinc-800 dark:text-zinc-100">Stage / Sound / Festival</p>
                  <p className={`text-xs leading-relaxed ${themeClasses.bodySubText}`}>
                    音樂舞台、音響重低音與聽團現場，為 MUMㄠ 最核心的情緒觸發與精神場域。
                  </p>
                </div>

                {/* 02 / SPACE */}
                <div className={`p-5 rounded-xl border space-y-3 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                  <div className="flex items-center justify-between border-b pb-2 border-black/5 dark:border-white/5">
                    <span className="font-bold text-[#437596] dark:text-[#6CA4C8] text-sm">02 / SPACE</span>
                    <span className="px-2 py-0.5 rounded bg-black/5 dark:bg-white/5 text-[10px] font-bold">空間</span>
                  </div>
                  <p className="font-bold text-zinc-800 dark:text-zinc-100">Booth / Pop-up / Installation</p>
                  <p className={`text-xs leading-relaxed ${themeClasses.bodySubText}`}>
                    音樂祭攤位、快閃空間與大型實體裝置，建立群眾能親自走入與拍照的實體據點。
                  </p>
                </div>

                {/* 03 / OBJECT */}
                <div className={`p-5 rounded-xl border space-y-3 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                  <div className="flex items-center justify-between border-b pb-2 border-black/5 dark:border-white/5">
                    <span className="font-bold text-[#437596] dark:text-[#6CA4C8] text-sm">03 / OBJECT</span>
                    <span className="px-2 py-0.5 rounded bg-black/5 dark:bg-white/5 text-[10px] font-bold">物件</span>
                  </div>
                  <p className="font-bold text-zinc-800 dark:text-zinc-100">Merchandise / Goods / Collectibles</p>
                  <p className={`text-xs leading-relaxed ${themeClasses.bodySubText}`}>
                    應援毛巾、貼紙、T-shirt 與周邊，將現場體驗帶回日常生活長久佩戴與收藏。
                  </p>
                </div>

                {/* 04 / CONTENT */}
                <div className={`p-5 rounded-xl border space-y-3 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                  <div className="flex items-center justify-between border-b pb-2 border-black/5 dark:border-white/5">
                    <span className="font-bold text-[#437596] dark:text-[#6CA4C8] text-sm">04 / CONTENT</span>
                    <span className="px-2 py-0.5 rounded bg-black/5 dark:bg-white/5 text-[10px] font-bold">內容</span>
                  </div>
                  <p className="font-bold text-zinc-800 dark:text-zinc-100">Social / Video / Story</p>
                  <p className={`text-xs leading-relaxed ${themeClasses.bodySubText}`}>
                    社群動態、角色插畫、現場紀錄影片與視覺故事，維持日常數位觸及與世界觀延伸。
                  </p>
                </div>

                {/* 05 / PEOPLE */}
                <div className={`p-5 rounded-xl border space-y-3 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                  <div className="flex items-center justify-between border-b pb-2 border-black/5 dark:border-white/5">
                    <span className="font-bold text-[#437596] dark:text-[#6CA4C8] text-sm">05 / PEOPLE</span>
                    <span className="px-2 py-0.5 rounded bg-black/5 dark:bg-white/5 text-[10px] font-bold">人</span>
                  </div>
                  <p className="font-bold text-zinc-800 dark:text-zinc-100">Crowd / Community / Interaction</p>
                  <p className={`text-xs leading-relaxed ${themeClasses.bodySubText}`}>
                    現場樂迷、聽團群眾與社群同好，透過共同喊出歌詞與揮舞毛巾建立集體認同。
                  </p>
                </div>

                {/* 06 / CULTURE */}
                <div className={`p-5 rounded-xl border space-y-3 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                  <div className="flex items-center justify-between border-b pb-2 border-black/5 dark:border-white/5">
                    <span className="font-bold text-[#437596] dark:text-[#6CA4C8] text-sm">06 / CULTURE</span>
                    <span className="px-2 py-0.5 rounded bg-black/5 dark:bg-white/5 text-[10px] font-bold">文化</span>
                  </div>
                  <p className="font-bold text-zinc-800 dark:text-zinc-100">Taiwan / Local / Everyday Life</p>
                  <p className={`text-xs leading-relaxed ${themeClasses.bodySubText}`}>
                    台灣獨立音樂祭文化、街頭風格與日常態度，讓 MUMㄠ 深耕在地文化場景。
                  </p>
                </div>
              </div>

              {/* System Formula Banner */}
              <div className="p-4 rounded-xl bg-[#183348] text-white font-mono text-center space-y-1 shadow-md">
                <span className="text-[10px] font-bold text-[#6CA4C8] uppercase tracking-widest block">
                  MUMㄠ EXPERIENCE TOUCHPOINT SYSTEM
                </span>
                <p className="text-xs sm:text-sm font-bold tracking-wider">
                  MUSIC + SPACE + OBJECT + CONTENT + PEOPLE + CULTURE
                </p>
              </div>
            </div>

            {/* 03 / EXPERIENCE JOURNEY */}
            <div className={`p-6 sm:p-8 rounded-2xl border space-y-6 ${themeClasses.cardBg} ${themeClasses.borderColSubtle}`}>
              <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b pb-4 gap-2 border-black/5 dark:border-white/5 font-mono">
                <div>
                  <span className={`text-xs font-bold uppercase tracking-widest block ${isDark ? "text-[#6CA4C8]" : "text-[#437596]"}`}>
                    03 / EXPERIENCE JOURNEY
                  </span>
                  <h3 className={`text-xl font-bold mt-0.5 ${themeClasses.bodyTitle}`}>
                    使用者體驗旅程
                  </h3>
                </div>
                <span className={`text-xs ${themeClasses.bodySubText}`}>
                  USER EXPERIENCE JOURNEY
                </span>
              </div>

              {/* Horizontal Journey Steps */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 font-mono text-xs">
                {/* Step 1 */}
                <div className={`p-4 rounded-xl border space-y-2 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                  <span className="text-[10px] font-bold text-[#437596] dark:text-[#6CA4C8]">01 / DISCOVER</span>
                  <p className="font-bold text-zinc-800 dark:text-zinc-100">發現</p>
                  <p className={`text-[11px] leading-relaxed ${themeClasses.bodySubText}`}>
                    Visual / Social / Poster
                  </p>
                </div>

                {/* Step 2 */}
                <div className={`p-4 rounded-xl border space-y-2 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                  <span className="text-[10px] font-bold text-[#437596] dark:text-[#6CA4C8]">02 / ENCOUNTER</span>
                  <p className="font-bold text-zinc-800 dark:text-zinc-100">遇見</p>
                  <p className={`text-[11px] leading-relaxed ${themeClasses.bodySubText}`}>
                    Character / Music / Space
                  </p>
                </div>

                {/* Step 3 */}
                <div className={`p-4 rounded-xl border space-y-2 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                  <span className="text-[10px] font-bold text-[#437596] dark:text-[#6CA4C8]">03 / PARTICIPATE</span>
                  <p className="font-bold text-zinc-800 dark:text-zinc-100">參與</p>
                  <p className={`text-[11px] leading-relaxed ${themeClasses.bodySubText}`}>
                    Game / Festival / Interaction
                  </p>
                </div>

                {/* Step 4 */}
                <div className={`p-4 rounded-xl border space-y-2 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                  <span className="text-[10px] font-bold text-[#437596] dark:text-[#6CA4C8]">04 / CONNECT</span>
                  <p className="font-bold text-zinc-800 dark:text-zinc-100">連結</p>
                  <p className={`text-[11px] leading-relaxed ${themeClasses.bodySubText}`}>
                    People / Community
                  </p>
                </div>

                {/* Step 5 */}
                <div className={`p-4 rounded-xl border space-y-2 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                  <span className="text-[10px] font-bold text-[#437596] dark:text-[#6CA4C8]">05 / SHARE</span>
                  <p className="font-bold text-zinc-800 dark:text-zinc-100">分享</p>
                  <p className={`text-[11px] leading-relaxed ${themeClasses.bodySubText}`}>
                    Photo / Social / Content
                  </p>
                </div>

                {/* Step 6 */}
                <div className="p-4 rounded-xl border border-[#E8829C]/40 bg-[#E8829C]/10 space-y-2">
                  <span className="text-[10px] font-bold text-[#E8829C] dark:text-[#F49BB2]">06 / REMEMBER</span>
                  <p className="font-bold text-[#E8829C] dark:text-[#F49BB2]">記住</p>
                  <p className="text-[11px] leading-relaxed text-zinc-700 dark:text-zinc-200">
                    Object / Emotion / Memory
                  </p>
                </div>
              </div>

              {/* Journey Banner */}
              <div className="p-4 rounded-xl border border-[#437596]/40 bg-[#437596]/10 text-center font-mono space-y-1">
                <span className="text-sm font-black text-[#437596] dark:text-[#90C2E4] uppercase tracking-wider block">
                  FROM OBSERVER TO PARTICIPANT.
                </span>
                <p className="text-xs text-zinc-800 dark:text-zinc-200 font-bold">
                  「從被動觀看，到主動參與。」
                </p>
              </div>
            </div>

            {/* 04 / EXPERIENCE SCENARIOS */}
            <div className={`p-6 sm:p-8 rounded-2xl border space-y-6 ${themeClasses.cardBg} ${themeClasses.borderColSubtle}`}>
              <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b pb-4 gap-2 border-black/5 dark:border-white/5 font-mono">
                <div>
                  <span className={`text-xs font-bold uppercase tracking-widest block ${isDark ? "text-[#6CA4C8]" : "text-[#437596]"}`}>
                    04 / EXPERIENCE SCENARIOS
                  </span>
                  <h3 className={`text-xl font-bold mt-0.5 ${themeClasses.bodyTitle}`}>
                    品牌體驗場景
                  </h3>
                </div>
                <span className={`text-xs ${themeClasses.bodySubText}`}>
                  4 CORE EXPERIENCE SCENARIOS
                </span>
              </div>

              {/* 4 Scenarios Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
                {/* Scenario 01 */}
                <div className={`p-5 rounded-xl border space-y-3 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                  <div className="flex items-center justify-between border-b pb-2 border-black/5 dark:border-white/5">
                    <span className="font-bold text-sm text-[#437596] dark:text-[#6CA4C8]">01 / FESTIVAL</span>
                    <span className="px-2 py-0.5 rounded bg-[#437596]/15 text-[#437596] dark:text-[#6CA4C8] text-[10px] font-bold">音樂祭現場</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div>
                      <span className="text-zinc-400 block text-[10px]">ROLE / 角色定位</span>
                      <span className="font-bold text-zinc-800 dark:text-zinc-200">現場陪伴者</span>
                    </div>
                    <div>
                      <span className="text-zinc-400 block text-[10px]">TOUCHPOINT / 接觸點</span>
                      <span className="font-bold text-zinc-800 dark:text-zinc-200">Stage / Crowd / Booth / Music / Towel</span>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-black/5 dark:border-white/5">
                    <span className="text-zinc-400 block text-[10px]">EXPERIENCE / 體驗核心</span>
                    <p className={`text-xs leading-relaxed font-bold ${themeClasses.bodyText}`}>
                      全場揮舞毛巾、大聲合唱，感受音樂重低音震撼與群眾共鳴。
                    </p>
                  </div>
                </div>

                {/* Scenario 02 */}
                <div className={`p-5 rounded-xl border space-y-3 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                  <div className="flex items-center justify-between border-b pb-2 border-black/5 dark:border-white/5">
                    <span className="font-bold text-sm text-[#437596] dark:text-[#6CA4C8]">02 / POP-UP</span>
                    <span className="px-2 py-0.5 rounded bg-[#437596]/15 text-[#437596] dark:text-[#6CA4C8] text-[10px] font-bold">品牌快閃</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div>
                      <span className="text-zinc-400 block text-[10px]">ROLE / 角色定位</span>
                      <span className="font-bold text-zinc-800 dark:text-zinc-200">互動引導者</span>
                    </div>
                    <div>
                      <span className="text-zinc-400 block text-[10px]">TOUCHPOINT / 接觸點</span>
                      <span className="font-bold text-zinc-800 dark:text-zinc-200">Character / Merchandise / Interaction</span>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-black/5 dark:border-white/5">
                    <span className="text-zinc-400 block text-[10px]">EXPERIENCE / 體驗核心</span>
                    <p className={`text-xs leading-relaxed font-bold ${themeClasses.bodyText}`}>
                      實體角色裝置互動、限量周邊首發與現場打卡體驗。
                    </p>
                  </div>
                </div>

                {/* Scenario 03 */}
                <div className={`p-5 rounded-xl border space-y-3 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                  <div className="flex items-center justify-between border-b pb-2 border-black/5 dark:border-white/5">
                    <span className="font-bold text-sm text-[#437596] dark:text-[#6CA4C8]">03 / EXHIBITION</span>
                    <span className="px-2 py-0.5 rounded bg-[#437596]/15 text-[#437596] dark:text-[#6CA4C8] text-[10px] font-bold">展覽</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div>
                      <span className="text-zinc-400 block text-[10px]">ROLE / 角色定位</span>
                      <span className="font-bold text-zinc-800 dark:text-zinc-200">故事講述者</span>
                    </div>
                    <div>
                      <span className="text-zinc-400 block text-[10px]">TOUCHPOINT / 接觸點</span>
                      <span className="font-bold text-zinc-800 dark:text-zinc-200">Story / Visual / Installation</span>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-black/5 dark:border-white/5">
                    <span className="text-zinc-400 block text-[10px]">EXPERIENCE / 體驗核心</span>
                    <p className={`text-xs leading-relaxed font-bold ${themeClasses.bodyText}`}>
                      靜態與動態視覺沉浸、展覽裝置與 IP 核心哲學探索。
                    </p>
                  </div>
                </div>

                {/* Scenario 04 */}
                <div className={`p-5 rounded-xl border space-y-3 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                  <div className="flex items-center justify-between border-b pb-2 border-black/5 dark:border-white/5">
                    <span className="font-bold text-sm text-[#437596] dark:text-[#6CA4C8]">04 / DAILY LIFE</span>
                    <span className="px-2 py-0.5 rounded bg-[#437596]/15 text-[#437596] dark:text-[#6CA4C8] text-[10px] font-bold">日常生活</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div>
                      <span className="text-zinc-400 block text-[10px]">ROLE / 角色定位</span>
                      <span className="font-bold text-zinc-800 dark:text-zinc-200">默默陪伴者</span>
                    </div>
                    <div>
                      <span className="text-zinc-400 block text-[10px]">TOUCHPOINT / 接觸點</span>
                      <span className="font-bold text-zinc-800 dark:text-zinc-200">Sticker / T-shirt / Bag / Object</span>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-black/5 dark:border-white/5">
                    <span className="text-zinc-400 block text-[10px]">EXPERIENCE / 體驗核心</span>
                    <p className={`text-xs leading-relaxed font-bold ${themeClasses.bodyText}`}>
                      服飾、隨身小物、貼紙融入日常生活步調，成為離開現場後的記憶隨身延續。
                    </p>
                  </div>
                </div>
              </div>

              {/* Bottom Core Statement */}
              <div className="p-4 rounded-xl border border-[#437596]/40 bg-[#437596]/10 text-center font-mono space-y-1">
                <span className="text-xs sm:text-sm font-black text-[#437596] dark:text-[#90C2E4] uppercase tracking-wider block">
                  MUMㄠ DOES NOT ONLY EXIST ON STAGE. IT LIVES IN EVERYDAY LIFE AFTER THE SHOW.
                </span>
                <p className="text-xs text-zinc-800 dark:text-zinc-200 font-bold">
                  「MUMㄠ 不只存在於舞台，也存在於人離開舞台之後的日常。」
                </p>
              </div>
            </div>

            {/* 05 / PARTICIPATION SYSTEM */}
            <div className={`p-6 sm:p-8 rounded-2xl border space-y-6 ${themeClasses.cardBg} ${themeClasses.borderColSubtle}`}>
              <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b pb-4 gap-2 border-black/5 dark:border-white/5 font-mono">
                <div>
                  <span className={`text-xs font-bold uppercase tracking-widest block ${isDark ? "text-[#6CA4C8]" : "text-[#437596]"}`}>
                    05 / PARTICIPATION SYSTEM
                  </span>
                  <h3 className={`text-xl font-bold mt-0.5 ${themeClasses.bodyTitle}`}>
                    參與機制
                  </h3>
                </div>
                <span className={`text-xs ${themeClasses.bodySubText}`}>
                  PARTICIPATION DEPTH SYSTEM
                </span>
              </div>

              {/* Participation Progression Matrix */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 font-mono text-xs">
                <div className={`p-4 rounded-xl border space-y-2 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                  <span className="text-[10px] font-black text-[#437596] dark:text-[#6CA4C8] block">LOOK / 看見</span>
                  <p className="font-bold text-zinc-800 dark:text-zinc-100">看到角色</p>
                  <p className={`text-[11px] ${themeClasses.bodySubText}`}>Wave / Visual</p>
                </div>

                <div className={`p-4 rounded-xl border space-y-2 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                  <span className="text-[10px] font-black text-[#437596] dark:text-[#6CA4C8] block">TOUCH / 接觸</span>
                  <p className="font-bold text-zinc-800 dark:text-zinc-100">摸到商品</p>
                  <p className={`text-[11px] ${themeClasses.bodySubText}`}>Sticker / Towel</p>
                </div>

                <div className={`p-4 rounded-xl border space-y-2 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                  <span className="text-[10px] font-black text-[#437596] dark:text-[#6CA4C8] block">PLAY / 玩</span>
                  <p className="font-bold text-zinc-800 dark:text-zinc-100">體驗活動</p>
                  <p className={`text-[11px] ${themeClasses.bodySubText}`}>Music / Interaction</p>
                </div>

                <div className={`p-4 rounded-xl border space-y-2 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                  <span className="text-[10px] font-black text-[#437596] dark:text-[#6CA4C8] block">JOIN / 加入</span>
                  <p className="font-bold text-zinc-800 dark:text-zinc-100">進入現場</p>
                  <p className={`text-[11px] ${themeClasses.bodySubText}`}>Festival / Community</p>
                </div>

                <div className={`p-4 rounded-xl border space-y-2 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                  <span className="text-[10px] font-black text-[#437596] dark:text-[#6CA4C8] block">SHARE / 分享</span>
                  <p className="font-bold text-zinc-800 dark:text-zinc-100">發布紀錄</p>
                  <p className={`text-[11px] ${themeClasses.bodySubText}`}>Photo / Social</p>
                </div>

                <div className="p-4 rounded-xl border border-[#E8829C]/40 bg-[#E8829C]/15 space-y-2">
                  <span className="text-[10px] font-black text-[#E8829C] dark:text-[#F49BB2] block">BELONG / 歸屬</span>
                  <p className="font-bold text-[#E8829C] dark:text-[#F49BB2]">成為其中一份子</p>
                  <p className="text-[11px] text-zinc-700 dark:text-zinc-200 font-bold">Culture / Memory</p>
                </div>
              </div>

              {/* Bottom Depth Bar */}
              <div className="p-3.5 rounded-xl border border-[#2B5573] bg-[#183348] text-white font-mono text-center text-xs font-bold tracking-widest shadow-md">
                ENGAGEMENT DEPTH: LOOK → TOUCH → PLAY → JOIN → SHARE → BELONG
              </div>
            </div>

            {/* 06 / EMOTIONAL EXPERIENCE */}
            <div className={`p-6 sm:p-8 rounded-2xl border space-y-6 ${themeClasses.cardBg} ${themeClasses.borderColSubtle}`}>
              <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b pb-4 gap-2 border-black/5 dark:border-white/5 font-mono">
                <div>
                  <span className={`text-xs font-bold uppercase tracking-widest block ${isDark ? "text-[#6CA4C8]" : "text-[#437596]"}`}>
                    06 / EMOTIONAL EXPERIENCE
                  </span>
                  <h3 className={`text-xl font-bold mt-0.5 ${themeClasses.bodyTitle}`}>
                    情緒體驗系統
                  </h3>
                </div>
                <span className={`text-xs ${themeClasses.bodySubText}`}>
                  5 BRAND EMOTIONS
                </span>
              </div>

              {/* 5 Emotions Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 font-mono text-xs">
                <div className={`p-4 rounded-xl border space-y-2 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                  <span className="text-xs font-bold text-[#437596] dark:text-[#6CA4C8]">01 / JOY</span>
                  <p className="font-bold text-zinc-800 dark:text-zinc-100 text-sm">開心</p>
                  <p className={`text-[11px] leading-relaxed ${themeClasses.bodySubText}`}>
                    遇見音樂與角色的愉悅
                  </p>
                </div>

                <div className={`p-4 rounded-xl border space-y-2 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                  <span className="text-xs font-bold text-[#437596] dark:text-[#6CA4C8]">02 / EXCITEMENT</span>
                  <p className="font-bold text-zinc-800 dark:text-zinc-100 text-sm">興奮</p>
                  <p className={`text-[11px] leading-relaxed ${themeClasses.bodySubText}`}>
                    現場音樂與人群產生的興奮
                  </p>
                </div>

                <div className={`p-4 rounded-xl border space-y-2 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                  <span className="text-xs font-bold text-[#437596] dark:text-[#6CA4C8]">03 / FREEDOM</span>
                  <p className="font-bold text-zinc-800 dark:text-zinc-100 text-sm">自由</p>
                  <p className={`text-[11px] leading-relaxed ${themeClasses.bodySubText}`}>
                    在音樂與現場中暫時放下日常
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-[#E8829C]/40 bg-[#E8829C]/10 space-y-2">
                  <span className="text-xs font-bold text-[#E8829C] dark:text-[#F49BB2]">04 / BELONGING</span>
                  <p className="font-bold text-[#E8829C] dark:text-[#F49BB2] text-sm">歸屬</p>
                  <p className="text-[11px] leading-relaxed text-zinc-700 dark:text-zinc-200 font-bold">
                    與喜歡同一種聲音的人產生連結
                  </p>
                </div>

                <div className="p-4 rounded-xl border-2 border-[#E8829C] bg-[#E8829C]/15 space-y-2">
                  <span className="text-xs font-black text-[#E8829C] dark:text-[#F49BB2]">05 / MEMORY</span>
                  <p className="font-bold text-[#E8829C] dark:text-[#F49BB2] text-sm">記憶</p>
                  <p className="text-[11px] leading-relaxed text-zinc-700 dark:text-zinc-200 font-bold">
                    活動結束後仍留下的情緒痕跡
                  </p>
                </div>
              </div>

              {/* Emotion Node Flow */}
              <div className="p-4 rounded-xl border border-[#437596]/40 bg-[#437596]/10 text-center font-mono space-y-1">
                <div className="flex items-center justify-center gap-3 text-xs sm:text-sm font-bold text-zinc-800 dark:text-zinc-100">
                  <span className="px-3 py-1 rounded bg-[#183348] text-white">MUSIC</span>
                  <span>→</span>
                  <span className="px-3 py-1 rounded bg-black/10 dark:bg-white/10">EMOTION</span>
                  <span>→</span>
                  <span className="px-3 py-1 rounded bg-black/10 dark:bg-white/10">CONNECTION</span>
                  <span>→</span>
                  <span className="px-3 py-1 rounded bg-[#E8829C] text-white font-black">MEMORY</span>
                </div>
              </div>
            </div>

            {/* 07 / EXPERIENCE MEMORY */}
            <div className={`p-6 sm:p-8 rounded-2xl border space-y-6 ${themeClasses.cardBg} ${themeClasses.borderColSubtle}`}>
              <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b pb-4 gap-2 border-black/5 dark:border-white/5 font-mono">
                <div>
                  <span className={`text-xs font-bold uppercase tracking-widest block ${isDark ? "text-[#6CA4C8]" : "text-[#437596]"}`}>
                    07 / EXPERIENCE MEMORY
                  </span>
                  <h3 className={`text-xl font-bold mt-0.5 ${themeClasses.bodyTitle}`}>
                    品牌記憶系統
                  </h3>
                </div>
                <span className={`text-xs ${themeClasses.bodySubText}`}>
                  4-TIER MEMORY SYSTEM
                </span>
              </div>

              {/* 4-Tier Memory Diagram */}
              <div className={`p-6 sm:p-8 rounded-xl border space-y-4 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle} font-mono text-xs text-center max-w-xl mx-auto`}>
                <div className="p-3 rounded-lg border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 font-bold text-zinc-800 dark:text-zinc-200">
                  01 / VISUAL CUE ／ 視覺記憶 (Wave / MUMㄠ / Pink / Mark)
                </div>
                <div className="text-zinc-400 font-bold">↓</div>
                <div className="p-3 rounded-lg border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 font-bold text-zinc-800 dark:text-zinc-200">
                  02 / PHYSICAL CUE ／ 實體記憶 (Towel / Sticker / Badge / Space)
                </div>
                <div className="text-zinc-400 font-bold">↓</div>
                <div className="p-3 rounded-lg border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 font-bold text-zinc-800 dark:text-zinc-200">
                  03 / SOCIAL CUE ／ 社交記憶 (Music / Crowd / Participation)
                </div>
                <div className="text-zinc-400 font-bold">↓</div>
                <div className="p-3 rounded-lg border border-[#E8829C]/40 bg-[#E8829C]/10 text-[#E8829C] dark:text-[#F49BB2] font-black">
                  04 / EMOTIONAL CUE ／ 情緒記憶 (Joy / Freedom / Belonging)
                </div>
                <div className="text-zinc-400 font-bold">↓</div>
                <div className="p-4 rounded-xl bg-[#183348] text-white font-black text-sm tracking-widest shadow-md">
                  BRAND MEMORY ／ 品牌記憶
                </div>
              </div>

              {/* Large Focus Concept Sentence Box */}
              <div className="p-8 sm:p-12 rounded-2xl border-2 border-[#E8829C] bg-[#E8829C]/10 text-center space-y-3 font-mono shadow-sm">
                <span className="text-xs font-bold text-[#E8829C] dark:text-[#F49BB2] uppercase tracking-widest block">
                  CORE BRAND MEMORY FOCUS / 品牌情感記憶焦點
                </span>
                <h4 className="text-2xl sm:text-4xl font-black text-zinc-900 dark:text-white tracking-tight">
                  「我在那裡遇見過 MUMㄠ。」
                </h4>
                <p className="text-sm font-bold text-[#E8829C] dark:text-[#F49BB2] uppercase tracking-widest">
                  "I MET MUMㄠ THERE."
                </p>
              </div>
            </div>

            {/* 08 / EXPERIENCE FORMULA */}
            <div className={`p-6 sm:p-8 rounded-2xl border space-y-6 ${themeClasses.cardBg} ${themeClasses.borderColSubtle}`}>
              <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b pb-4 gap-2 border-black/5 dark:border-white/5 font-mono">
                <div>
                  <span className={`text-xs font-bold uppercase tracking-widest block ${isDark ? "text-[#6CA4C8]" : "text-[#437596]"}`}>
                    08 / EXPERIENCE FORMULA
                  </span>
                  <h3 className={`text-xl font-bold mt-0.5 ${themeClasses.bodyTitle}`}>
                    品牌體驗公式
                  </h3>
                </div>
                <span className={`text-xs ${themeClasses.bodySubText}`}>
                  CORE EXPERIENCE MODEL
                </span>
              </div>

              {/* Formula Model Box */}
              <div className={`p-6 sm:p-10 rounded-xl border space-y-6 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle} font-mono text-center`}>
                <span className="text-xs font-bold text-[#437596] dark:text-[#6CA4C8] uppercase tracking-widest block">
                  MUMㄠ EXPERIENCE SYSTEM MODEL
                </span>

                <div className="space-y-4 max-w-2xl mx-auto text-xs sm:text-sm font-bold">
                  {/* Layer 1 */}
                  <div className="p-4 rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 text-zinc-800 dark:text-zinc-100">
                    VISUAL + OBJECT + SPACE + MUSIC + PARTICIPATION = <span className="text-[#437596] dark:text-[#6CA4C8]">MUMㄠ EXPERIENCE</span>
                  </div>

                  <div className="text-zinc-400">+</div>

                  {/* Layer 2 */}
                  <div className="p-4 rounded-xl border border-[#437596]/40 bg-[#437596]/10 text-[#437596] dark:text-[#6CA4C8]">
                    EXPERIENCE + EMOTION = <span className="text-[#E8829C] dark:text-[#F49BB2]">MEMORY</span>
                  </div>

                  <div className="text-zinc-400">+</div>

                  {/* Layer 3 */}
                  <div className="p-4 rounded-xl bg-[#183348] text-white font-black text-sm sm:text-base tracking-widest shadow-md">
                    MEMORY + COMMUNITY = BRAND CULTURE
                  </div>
                </div>
              </div>
            </div>

            {/* Chapter Transition to Final Statement */}
            <div className={`p-6 rounded-2xl border space-y-4 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle} font-mono`}>
              <div className="space-y-1 text-left border-b pb-3 border-black/5 dark:border-white/5">
                <span className={`text-[10px] block font-bold uppercase tracking-widest ${isDark ? "text-[#6CA4C8]" : "text-[#437596]"}`}>
                  CHAPTER TRANSITION / 章節過渡
                </span>
                <h4 className={`text-sm sm:text-base font-bold ${themeClasses.bodyTitle}`}>
                  FROM EXPERIENCE TO MANIFESTO.
                </h4>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 font-bold">
                  ／ 從品牌體驗進入最終宣言
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs font-bold text-[#437596] dark:text-[#6CA4C8]">
                  <span className="px-3 py-1.5 rounded bg-black/5 dark:bg-white/5 text-zinc-800 dark:text-zinc-200">EXPERIENCE</span>
                  <span>→</span>
                  <span className="px-3 py-1.5 rounded bg-black/5 dark:bg-white/5 text-zinc-800 dark:text-zinc-200">COMMUNITY</span>
                  <span>→</span>
                  <span className="px-3 py-1.5 rounded bg-[#183348] text-white">MANIFESTO</span>
                </div>

                <button
                  type="button"
                  onClick={() => scrollToSection("final-statement")}
                  className={`inline-flex items-center gap-4 px-6 py-3.5 rounded-xl border text-xs font-mono font-bold transition-all ${themeClasses.cardBg} ${themeClasses.borderColSubtle} hover:border-[#437596] hover:text-[#437596] dark:hover:border-[#6CA4C8] dark:hover:text-[#6CA4C8] group cursor-pointer`}
                >
                  <div className="text-left">
                    <span className={`text-[10px] block font-mono uppercase tracking-widest ${themeClasses.bodySubText}`}>
                      NEXT SECTION
                    </span>
                    <span className="text-sm font-bold tracking-tight">
                      09 / FINAL STATEMENT →
                    </span>
                  </div>
                </button>
              </div>
            </div>
          </section>

          {/* ===== 09. FINAL STATEMENT & BRAND CLOSING (最終品牌宣言頁) ===== */}
          <section id="final-statement" className={`pt-20 pb-20 space-y-20 text-left border-t ${themeClasses.borderColSubtle}`}>
            
            {/* Wave Whisker Divider Line */}
            <div className="flex justify-center opacity-70 my-2">
              <SoundwaveDivider isDark={isDark} color={isDark ? "#6CA4C8" : "#437596"} className="w-full max-w-xl" />
            </div>

            {/* 01｜MAIN STATEMENT */}
            <div className="space-y-6 pt-4">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#E8829C]" />
                <span className={`text-xs font-mono font-bold uppercase tracking-widest ${isDark ? "text-[#6CA4C8]" : "text-[#437596]"}`}>
                  09 / FINAL STATEMENT ‧ 最終品牌宣言
                </span>
              </div>

              <div className="space-y-6 max-w-4xl">
                <h2 className={`text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black font-mono tracking-tight leading-[1.1] ${themeClasses.bodyTitle}`}>
                  MUMㄠ，<br />
                  從一隻貓開始。
                </h2>
                <p className="text-2xl sm:text-4xl md:text-5xl font-bold font-mono tracking-tight text-[#437596] dark:text-[#6CA4C8] leading-tight">
                  走進音樂，走進現場，<br />
                  也走進大家的日常。
                </p>
              </div>
            </div>

            {/* 02｜BRAND MANIFESTO */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-6 border-t border-black/5 dark:border-white/5 font-mono">
              {/* Left Main Text */}
              <div className="lg:col-span-8 space-y-6 text-base sm:text-lg lg:text-xl font-normal leading-relaxed text-zinc-800 dark:text-zinc-100">
                <p className="leading-loose">
                  「MUMㄠ 是一隻喜歡音樂、喜歡聽團，<br />
                  也喜歡陪音樂祭的白貓。
                </p>
                <p className="leading-loose">
                  從一個簡單的角色開始，<br />
                  慢慢長出自己的語言、顏色、<br />
                  音樂與現場記憶。
                </p>
                <p className="leading-loose">
                  而「媽媽咪呀」不是要大家信仰一隻貓。
                </p>
                <p className="leading-loose font-medium">
                  只是因為喜歡同一種聲音，<br />
                  在同一個現場，<br />
                  一起揮著毛巾而已。」
                </p>
              </div>

              {/* Right Manifesto Tag */}
              <div className="lg:col-span-4 space-y-2 border-l-2 border-[#E8829C] pl-4 py-2">
                <span className="text-xs font-bold tracking-widest block text-[#E8829C] dark:text-[#F49BB2]">
                  BRAND MANIFESTO
                </span>
                <p className={`text-xs tracking-widest leading-relaxed uppercase font-bold ${themeClasses.bodySubText}`}>
                  FROM A CHARACTER<br />
                  TO A SHARED CULTURAL EXPERIENCE.
                </p>
              </div>
            </div>

            {/* 03｜COMMUNITY */}
            <div className="pt-8 space-y-3 border-t border-black/5 dark:border-white/5 font-mono">
              <span className={`text-xs font-bold uppercase tracking-widest block ${isDark ? "text-[#6CA4C8]" : "text-[#437596]"}`}>
                MUMㄠ COMMUNITY
              </span>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs sm:text-sm font-bold">
                <div className="flex items-center gap-2">
                  <span className="text-[#437596] dark:text-[#6CA4C8]">01</span>
                  <span className={themeClasses.bodyTitle}>MUSIC</span>
                  <span className={`font-normal ${themeClasses.bodySubText}`}>/ 音樂</span>
                </div>
                <span className="text-[#E8829C]">•</span>
                <div className="flex items-center gap-2">
                  <span className="text-[#437596] dark:text-[#6CA4C8]">02</span>
                  <span className={themeClasses.bodyTitle}>MEMORY</span>
                  <span className={`font-normal ${themeClasses.bodySubText}`}>/ 記憶</span>
                </div>
                <span className="text-[#E8829C]">•</span>
                <div className="flex items-center gap-2">
                  <span className="text-[#437596] dark:text-[#6CA4C8]">03</span>
                  <span className={themeClasses.bodyTitle}>BELONGING</span>
                  <span className={`font-normal ${themeClasses.bodySubText}`}>/ 一起在現場</span>
                </div>
              </div>
            </div>

            {/* 04 & 05｜FINAL BRAND SIGNATURE & BRAND MARK */}
            <div className="pt-12 pb-10 flex flex-col md:flex-row items-start md:items-end justify-between gap-8 border-t-2 border-b border-black/10 dark:border-white/10 my-10 font-mono">
              <div className="space-y-4 max-w-xl">
                <span className="text-[10px] tracking-widest text-[#E8829C] dark:text-[#F49BB2] uppercase font-bold block">
                  BRAND SIGNATURE
                </span>
                <h3 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight leading-tight text-[#E8829C] dark:text-[#F49BB2]">
                  「全是感情，<br />
                  　還有音樂。」
                </h3>
                <p className="text-sm tracking-widest text-[#437596] dark:text-[#6CA4C8] pt-1 uppercase font-bold">
                  ALL FEELINGS. ALL MUSIC.
                </p>
              </div>

              {/* 05｜BRAND MARK */}
              <div className="flex flex-col items-start md:items-end space-y-2 opacity-90">
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-black text-[#437596] dark:text-[#6CA4C8] border border-[#437596]/40 dark:border-[#6CA4C8]/40 px-2.5 py-0.5 rounded bg-[#437596]/5 dark:bg-[#6CA4C8]/5">
                    ㄠ
                  </span>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold tracking-widest text-zinc-800 dark:text-zinc-200">
                      MUMㄠ
                    </span>
                    <span className="text-[10px] text-[#437596] dark:text-[#6CA4C8] uppercase tracking-wider font-bold">
                      WAVE WHISKERS
                    </span>
                  </div>
                </div>
                {/* Micro Soundwave Graphic */}
                <div className="flex items-center gap-1.5 h-3 pt-1">
                  <span className="w-1 h-2 bg-[#437596] dark:bg-[#6CA4C8] rounded-full" />
                  <span className="w-1 h-3.5 bg-[#E8829C] rounded-full" />
                  <span className="w-1 h-2 bg-[#437596] dark:bg-[#6CA4C8] rounded-full" />
                </div>
              </div>
            </div>

            {/* Navigation Actions */}
            <div className="pt-2 flex flex-wrap items-center justify-between gap-6 font-mono text-xs">
              <button
                type="button"
                onClick={onClose}
                className={`group flex items-center gap-2 transition-all cursor-pointer ${
                  isDark ? "text-zinc-400 hover:text-white" : "text-zinc-600 hover:text-black"
                }`}
              >
                <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1 text-[#437596] dark:text-[#6CA4C8]" />
                <span className="underline underline-offset-4 decoration-zinc-500/40 group-hover:decoration-current font-bold">
                  BACK TO PORTFOLIO
                </span>
              </button>

              <div className="flex items-center gap-6">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  className={`group flex items-center gap-2 transition-all cursor-pointer ${
                    isDark ? "text-zinc-400 hover:text-[#F49BB2]" : "text-zinc-600 hover:text-[#E8829C]"
                  }`}
                >
                  <span className="underline underline-offset-4 decoration-zinc-500/40 group-hover:decoration-current font-bold">
                    FOLLOW MUMㄠ
                  </span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 text-[#E8829C] dark:text-[#F49BB2]" />
                </a>

                <button
                  type="button"
                  onClick={onClose}
                  className={`px-4 py-2 rounded-full border text-[11px] transition-all cursor-pointer ${
                    isDark 
                      ? "border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 bg-zinc-900/50" 
                      : "border-zinc-300 text-zinc-600 hover:text-black hover:border-zinc-400 bg-zinc-100/50"
                  }`}
                >
                  CLOSE CASE STUDY
                </button>
              </div>
            </div>

          </section>

        </main>

        {/* Case Study Footer */}
        <footer className={`border-t py-8 text-center font-mono text-xs ${
          isDark 
            ? "border-zinc-900 bg-zinc-950/50 text-zinc-500" 
            : isSepia 
            ? "border-amber-950/10 bg-[#FAF4E5]/50 text-[#8C7B69]" 
            : "border-slate-200 bg-white text-slate-400"
        }`}>
          <p>MUMㄠ IP BRAND DESIGN CASE STUDY ‧ PORTFOLIO SHOWCASE</p>
        </footer>

        {/* Case Study Detail Modal */}
        {previewItem && (
          <div
            className={`fixed inset-0 z-[100005] flex items-center justify-center p-4 cursor-pointer ${
              isDark ? "bg-black/85" : "bg-slate-900/80"
            } backdrop-blur-md`}
            onClick={() => setPreviewItem(null)}
          >
            <div
              className={`rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border cursor-default space-y-4 p-6 ${themeClasses.modalBg}`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={`flex items-center justify-between border-b pb-3 ${themeClasses.modalDivider}`}>
                <div>
                  <span className={`text-[10px] font-mono font-bold uppercase tracking-wider block flex items-center gap-1.5 ${
                    isDark ? "text-[#6CA4C8]" : "text-[#417293]"
                  }`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#E8829C] inline-block"></span>
                    {previewItem.category || "DESIGN DETAIL"}
                  </span>
                  <h3 className={`text-base font-bold font-mono ${themeClasses.headerText}`}>{previewItem.title}</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setPreviewItem(null)}
                  className={`p-1.5 rounded-full transition-all cursor-pointer ${
                    isDark ? "text-zinc-400 hover:text-[#F49BB2] hover:bg-[#E8829C]/20" : isSepia ? "text-[#6C5B48] hover:text-[#D85E7E] hover:bg-[#FDF0F4]" : "text-slate-400 hover:text-[#D85E7E] hover:bg-[#FDF0F4]"
                  }`}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className={`aspect-square rounded-xl overflow-hidden bg-slate-100/5 border-2 ${themeClasses.borderBlueAccent}`}>
                <img
                  src={previewItem.image}
                  alt={previewItem.title}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover"
                />
              </div>

              {previewItem.spec && (
                <p className={`text-xs font-mono font-bold px-3 py-1.5 rounded-lg border ${themeClasses.specBadge}`}>
                  SPEC: {previewItem.spec}
                </p>
              )}

              <p className={`text-xs font-normal leading-relaxed ${themeClasses.bodyText}`}>
                {previewItem.desc}
              </p>

              <div className={`pt-2 flex items-center justify-between border-t ${themeClasses.modalDivider}`}>
                <span className={`text-[11px] font-mono ${themeClasses.bodySubText}`}>DESIGN CASE STUDY DETAIL</span>
                <button
                  type="button"
                  onClick={() => setPreviewItem(null)}
                  className={`px-4 py-1.5 rounded-full text-xs font-mono font-bold transition-all cursor-pointer border ${
                    isDark 
                      ? "bg-[#437596] border-[#437596] text-white hover:bg-[#E8829C] hover:border-[#E8829C]" 
                      : isSepia 
                      ? "bg-[#2B5573] border-[#2B5573] text-[#F4EFE6] hover:bg-[#E8829C] hover:border-[#E8829C]" 
                      : "bg-[#437596] border-[#437596] text-white hover:bg-[#E8829C] hover:border-[#E8829C]"
                  }`}
                >
                  CLOSE
                </button>
              </div>
            </div>
          </div>
        )}

      </motion.div>
    </AnimatePresence>
  );
}
