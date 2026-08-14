import React, { useState, useRef, useEffect } from "react";
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
  Moon
} from "lucide-react";
import { MumaoCatIcon } from "./MumaoCatIcon";
import { SoundwaveWhisker, SoundwaveDivider, SoundwavePillBadge } from "./SoundwaveDecorations";
import { InteractiveHeroWhiskers } from "./InteractiveHeroWhiskers";
import { playMeowSound, catPurr } from "../utils/audioEffects";

interface MumaoProjectPageProps {
  isOpen: boolean;
  onClose: () => void;
  theme?: string;
}

export function MumaoProjectPage({ isOpen, onClose, theme = "light" }: MumaoProjectPageProps) {
  const [activeHeroImage, setActiveHeroImage] = useState(0);
  const [isPurring, setIsPurring] = useState(false);
  const [copiedHex, setCopiedHex] = useState<string | null>(null);
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

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const heroVisuals = [
    {
      url: "https://drive.google.com/thumbnail?sz=w1000&id=18ega279ty4XVeShySlEkSzJXUz2pOcep",
      title: "KEY VISUAL 01: STANDARD STANCE",
      desc: "MUMㄠ 品牌標準立姿與視覺識別標誌"
    },
    {
      url: "https://drive.google.com/thumbnail?sz=w1000&id=1eqi9X536nUrXqj-gv6kqjNMfpiC1YumX",
      title: "KEY VISUAL 02: WINK & MOSH",
      desc: "動態表情與現場搖滾次文化插畫手稿"
    }
  ];

  const characterActions = [
    {
      role: "01 / CORE IDENTITY",
      title: "STANDARD STANCE",
      zhTitle: "標準角色",
      desc: "以 MUMㄠ 的基本正面角色作為核心識別，固定頭型、耳朵、『ㄠ』、音波鬍鬚與服裝比例，建立所有角色延伸的視覺基準。",
      image: "https://drive.google.com/thumbnail?sz=w1000&id=18ega279ty4XVeShySlEkSzJXUz2pOcep",
      tag: "MASTER CHARACTER",
      principle: "CORE IDENTITY"
    },
    {
      role: "02 / EXPRESSION",
      title: "WINK & MOSH",
      zhTitle: "眨眼／情緒",
      desc: "透過眨眼、表情與身體微幅變化，讓 MUM 可以進入音樂、社群與日常情境，但不改變核心角色識別。",
      image: "https://drive.google.com/thumbnail?sz=w1000&id=1eqi9X536nUrXqj-gv6kqjNMfpiC1YumX",
      tag: "EXPRESSION SYSTEM",
      principle: "EXPRESSION SYSTEM"
    },
    {
      role: "03 / ACTION",
      title: "RAISED PAWS",
      zhTitle: "舉手／動作",
      desc: "以舉手、揮舞與 Mosh Pit 等動作，建立 MUM 的現場能量，讓角色能自然進入音樂祭、舞台與活動視覺。",
      image: "https://drive.google.com/thumbnail?sz=w1000&id=18ega279ty4XVeShySlEkSzJXUz2pOcep",
      tag: "ACTION LANGUAGE",
      principle: "ACTION SYSTEM"
    }
  ];

  const characterFutureSystem = [
    { num: "01", name: "SIDE VIEW", zhName: "側面視角", desc: "側影輪廓與立體比例規範" },
    { num: "02", name: "SITTING POSE", zhName: "坐姿", desc: "草地野餐與日常休閒情境" },
    { num: "03", name: "DANCING MOVEMENT", zhName: "跳舞／音樂祭動作", desc: "舞台現場與律動幾何分割" },
    { num: "04", name: "TOWEL SWING", zhName: "毛巾揮舞動作", desc: "音樂祭標誌性道具甩動連續幀數" }
  ];

  const brandDecrees = [
    {
      num: "01",
      title: "演出不能遲到",
      enTitle: "NEVER MISS THE SHOW.",
      category: "ATTITUDE",
      principle: "PUNCTUALITY",
      tag: "MUM ATTITUDE",
      desc: "第一拍就要開衝，因為好音樂不等人。"
    },
    {
      num: "02",
      title: "喜歡的團，就要用力喊。",
      enTitle: "CHEER LOUDER.",
      category: "EMOTION",
      principle: "VOCAL ENTHUSIASM",
      tag: "MUM EMOTION",
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
      id: "megaport",
      num: "01",
      name: "大港開唱 MEGAPORT FESTIVAL",
      category: "MUSIC FESTIVAL",
      eventField: "MUSIC",
      year: "2024–2026",
      location: "高雄港區 ‧ 大港橋",
      role: "現場主視覺角色 ／ 聽團文化識別",
      culturalRole: "Audience Companion (陪伴聽團仔進入現場)",
      context: "MUMㄠ 進入大型音樂祭現場，以角色、毛巾與現場視覺建立與聽團文化之間的直接連結。",
      culturalConnection: "將現場聽團仔的狂熱記憶與地標港區融合，高舉湛藍音波毛巾成為音樂祭打卡標誌。",
      visualOutput: "現場拍照裝置、音樂祭限定毛巾、現場標籤與指標視覺系統",
      image: "https://drive.google.com/thumbnail?sz=w1000&id=18ega279ty4XVeShySlEkSzJXUz2pOcep",
      isPrimary: true
    },
    {
      id: "taipei-art-book",
      num: "02",
      name: "草率季 TAIPEI ART BOOK FAIR",
      category: "ART & ZINE",
      eventField: "ART",
      year: "2024",
      location: "台北 ‧ 華山1914",
      role: "獨立出版 Zine 創作者 ／ 藝術語境字符",
      culturalRole: "Independent Culture Character (成為創作者與出版文化的一部分)",
      context: "MUMㄠ 從音樂現場延伸至獨立出版與藝術文化場域，透過插畫、紙品與角色視覺，建立更完整的 IP 文化語境。",
      culturalConnection: "打破單一樂團界線，在獨立出版與手繪創作生態圈中展示 IP 的文化包容力。",
      visualOutput: "繪本 Zine 特刊、手繪塗鴉卡片、藝術貼紙包與展位藝術展示",
      image: "https://drive.google.com/thumbnail?sz=w1000&id=1eqi9X536nUrXqj-gv6kqjNMfpiC1YumX",
      isPrimary: false
    },
    {
      id: "rough-mud",
      num: "03",
      name: "爛泥發 ROUGH MUD FESTIVAL",
      category: "FIELD CULTURE",
      eventField: "FIELD",
      year: "2025",
      location: "桃園 ‧ 泰圳路農場",
      role: "泥地體驗參與者 ／ 現場文化符號",
      culturalRole: "Festival Participant (和觀眾一起玩、一起髒、一起留下記憶)",
      context: "當音樂祭從舞台延伸至泥地，MUMㄠ 也進入更直接、更狼狽、更真實的現場文化。",
      culturalConnection: "呼應「泥巴踩下去就回不去了」的聽團信念，傳達混亂與泥濘中的現場浪漫。",
      visualOutput: "泥地戶外防水貼紙、現場雨衣圖騰、野外紀實攝影刊物",
      image: "https://drive.google.com/thumbnail?sz=w1000&id=18ega279ty4XVeShySlEkSzJXUz2pOcep",
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
      purpose: "MUM 長什麼樣",
      uses: "Standard Mascot / Style Guide / Identity Spec",
      aspect: "aspect-[4/5]",
      image: "https://drive.google.com/thumbnail?sz=w1000&id=18ega279ty4XVeShySlEkSzJXUz2pOcep",
      desc: "以 MUMㄠ 的標準角色比例、五大固定特徵與核心色彩，建立所有延伸視覺的基礎。"
    },
    {
      num: "02",
      systemCategory: "CONTENT",
      medium: "SOCIAL CONTENT",
      title: "社群內容",
      enTitle: "SOCIAL CONTENT",
      purpose: "MUM 發什麼",
      uses: "Instagram / Comic / Post / Story / Meme",
      aspect: "aspect-square",
      image: "https://drive.google.com/thumbnail?sz=w1000&id=1eqi9X536nUrXqj-gv6kqjNMfpiC1YumX",
      desc: "將角色語言與聽團日常轉化為容易被分享、閱讀與互動的社群內容。"
    },
    {
      num: "03",
      systemCategory: "COMMUNICATION",
      medium: "STICKER / EXPRESSION",
      title: "貼圖與情緒表達",
      enTitle: "STICKER / EXPRESSION",
      purpose: "MUM 怎麼互動",
      uses: "LINE / Chat / Social Reaction / Digital Communication",
      aspect: "aspect-[16/9]",
      image: "https://drive.google.com/thumbnail?sz=w1000&id=18ega279ty4XVeShySlEkSzJXUz2pOcep",
      desc: "透過表情、姿勢與短句，讓 MUMㄠ 成為聽團仔日常溝通的一部分。"
    },
    {
      num: "04",
      systemCategory: "ENVIRONMENT",
      medium: "FESTIVAL APPLICATION",
      title: "音樂祭現場",
      enTitle: "FESTIVAL APPLICATION",
      purpose: "MUM 怎麼進入現場",
      uses: "Poster / Banner / Towel / Signage / Event Visual",
      aspect: "aspect-[3/4]",
      image: "https://drive.google.com/thumbnail?sz=w1000&id=1eqi9X536nUrXqj-gv6kqjNMfpiC1YumX",
      desc: "將 MUMㄠ 從螢幕帶入真實音樂祭，形成具有現場辨識度的角色視覺。"
    }
  ];

  const merchandiseDesigns = [
    {
      num: "01",
      category: "01 WEAR (穿戴)",
      productRole: "FESTIVAL ESSENTIAL",
      roleQuote: "「音樂祭不是只有音樂，毛巾也是現場身份的一部分。」",
      name: "MUMㄠ 湛藍波紋搖滾毛巾",
      enName: "MUMㄠ FESTIVAL TOWEL",
      tag: "SIGNATURE FESTIVAL ITEM",
      spec: "100% 純棉雙面緹花 ‧ 29×100cm",
      image: "https://drive.google.com/thumbnail?sz=w1000&id=18ega279ty4XVeShySlEkSzJXUz2pOcep",
      desc: "把音樂祭最直接的現場符號，轉化成 MUMㄠ 的品牌識別。轉化 MUMㄠ 鬍鬚湛藍波紋為滿版緹花圖騰。",
      application: ["Festival", "Identity", "Merchandise"]
    },
    {
      num: "02",
      category: "02 STICK (貼附)",
      productRole: "EVERYDAY MARK",
      roleQuote: "「把 MUMㄠ 帶進日常生活，讓角色成為隨手可見的識別。」",
      name: "大鬧泥坑防水噴漆貼紙組",
      enName: "MUD FESTIVAL VINYL STICKER PACK",
      tag: "EVERYDAY CULT MARK",
      spec: "PVC 防水刀模 ‧ 霧面抗 UV 塗層",
      image: "https://drive.google.com/thumbnail?sz=w1000&id=1eqi9X536nUrXqj-gv6kqjNMfpiC1YumX",
      desc: "專為樂器袋、吉他盒與安全帽設計，全天候耐水耐刮次文化貼紙。",
      application: ["Daily", "Gear", "Subculture"]
    },
    {
      num: "03",
      category: "03 COLLECT (收藏)",
      productRole: "COLLECTIBLE",
      roleQuote: "「將角色核心特徵縮小成可以收藏與穿戴的物件。」",
      name: "MUMㄠ 白貓耳朵金屬胸章",
      enName: "MUMㄠ EAR PINK METAL BADGE",
      tag: "CHARACTER COLLECTIBLE",
      spec: "烤漆鋅合金 ‧ 鍍黑鎳邊框 ‧ 30mm",
      image: "https://drive.google.com/thumbnail?sz=w1000&id=18ega279ty4XVeShySlEkSzJXUz2pOcep",
      desc: "精緻金屬質感，耳尖點綴粉紅漆面，搭配後方蝴蝶扣配件。",
      application: ["Accessory", "Collectible", "Wear"]
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
      image: "https://drive.google.com/thumbnail?sz=w1000&id=1eqi9X536nUrXqj-gv6kqjNMfpiC1YumX",
      desc: "專為大草皮舞台空檔休憩設計，大面積印刷 MUM 經典開衝繪圖。",
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
      name: "MUM WHITE",
      zhName: "姆貓純白",
      ratio: "70%",
      position: "CHARACTER BASE",
      role: "CHARACTER BASE 70%",
      hex: "#FFFFFF",
      rgb: "255, 255, 255",
      cmyk: "C:0 M:0 Y:0 K:0",
      pantone: "Reference: Bright White",
      bgHex: "#FFFFFF",
      isLight: true,
      meaning: "純粹 ‧ 留白 ‧ 角色本體 ‧ 視覺空間",
      desc: "MUM 的基礎色彩。大面積使用於角色身體、背景與主要視覺，建立乾淨、純粹且具有留白感的視覺基礎。",
      characterLink: "MUM'S BODY",
      characterZh: "角色本體與空間留白",
      applications: ["角色身體與毛色", "大面積空間留白", "品牌服飾原色", "主要視覺基底"]
    },
    {
      code: "02 / IDENTITY",
      name: "WAVE BLUE",
      zhName: "音波湛藍",
      ratio: "20%",
      position: "MUSIC IDENTITY",
      role: "MUSIC IDENTITY 20%",
      hex: "#437596",
      rgb: "67, 117, 150",
      cmyk: "C:72 M:42 Y:24 K:3",
      pantone: "Reference: 7697 C",
      bgHex: "#437596",
      isLight: false,
      meaning: "音樂 ‧ 聲音 ‧ 節奏 ‧ 現場 ‧ 台灣獨立音樂文化",
      desc: "取自 MUM 的湛藍音波鬍鬚，象徵聲音、節奏與音樂現場，是 MUM 與音樂文化之間最重要的色彩連結。",
      characterLink: "MUM'S SOUND",
      characterZh: "音樂鬍鬚與聽團聲波",
      applications: ["音波鬍鬚超級符號", "標題 Accent", "Section Label", "Graphic Line", "Festival Visual", "重要資訊與連結"]
    },
    {
      code: "03 / ACCENT",
      name: "EAR PINK",
      zhName: "耳尖粉紅",
      ratio: "10%",
      position: "EMOTIONAL ACCENT",
      role: "EMOTIONAL ACCENT 10%",
      hex: "#E8829C",
      rgb: "232, 130, 156",
      cmyk: "C:4 M:60 Y:24 K:0",
      pantone: "Reference: 708 C",
      bgHex: "#E8829C",
      isLight: false,
      meaning: "情緒 ‧ 溫度 ‧ 親和力 ‧ 角色個性",
      desc: "取自 MUM 的耳朵與肉球，作為角色中的暖色情緒訊號，為黑、白與湛藍構成的視覺系統加入溫度。（強調少量使用，不作為主色）",
      characterLink: "MUM'S EMOTION",
      characterZh: "耳朵肉球與情緒溫度",
      applications: ["耳朵內側", "肉球細節", "Highlight 亮點", "Small Accent", "社群微細節 (少量使用)"]
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
      meaning: "手繪 ‧ 輪廓 ‧ 結構 ‧ 角色辨識",
      desc: "取自 MUM 手繪角色線稿，作為輪廓、文字與資訊結構的主要色彩，保留手繪筆觸的直接與辨識度。（不佔 70/20/10 比例，依結構需求使用）",
      characterLink: "MUM'S LINE",
      characterZh: "手繪線條與結構輪廓",
      applications: ["Character Outline", "Typography 標題與內文", "Graphic Structure", "Divider 分隔線", "插畫手繪線稿"]
    }
  ];

  const colorCraftSpecs = [
    {
      color: "MUM WHITE",
      hex: "#FFFFFF",
      medium: "服飾／防水貼紙",
      craft: "重磅純棉原色 ‧ 霧面防水底膜",
      principle: "適合大面積底色與服飾應用，保留角色的純粹與留白。",
      note: "建議應用"
    },
    {
      color: "WAVE BLUE",
      hex: "#437596",
      medium: "RISO 孔版印刷／雙面混色紙",
      craft: "大豆油墨疊印 ‧ 雙面緹花編織",
      principle: "適合 RISO、網版與紙材印刷，強化音樂識別與手繪感。",
      note: "建議應用"
    },
    {
      color: "EAR PINK",
      hex: "#E8829C",
      medium: "局部特殊色／絲網印花",
      craft: "局部烤漆填色 ‧ 絲網印花點綴",
      principle: "適合局部色彩與小面積印刷，作為角色情緒 Highlight。",
      note: "建議應用"
    },
    {
      color: "CHARCOAL BLACK",
      hex: "#1E242B",
      medium: "粗粒子網印／鍍黑金屬",
      craft: "粗目絹印線稿 ‧ 鍍黑鎳金屬邊",
      principle: "適合線稿、文字與輪廓，保留手繪角色的直接感。",
      note: "建議應用"
    }
  ];

  // Theme mappings & section state
  const themeMode = theme;
  const [activeSection, setActiveSection] = useState<string>("hero-section");

  const isDark = themeMode === "dark";
  const isSepia = themeMode === "sepia";

  const navItems = [
    { label: "OVERVIEW", id: "hero-section" },
    { label: "01 CHARACTER", id: "character-section" },
    { label: "02 COLOR", id: "color-section" },
    { label: "03 LANGUAGE", id: "language-section" },
    { label: "04 FESTIVAL", id: "festival-section" },
    { label: "05 VISUALS", id: "visuals-section" },
    { label: "06 MERCH", id: "merch-section" },
    { label: "07 APPLICATION", id: "application-section" },
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
      "final-statement",
    ];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            if (id === "dna-section") {
              setActiveSection("hero-section");
            } else if (id === "final-statement") {
              setActiveSection("application-section");
            } else {
              setActiveSection(id);
            }
          }
        });
      },
      {
        rootMargin: "-15% 0px -55% 0px",
        threshold: 0,
      }
    );

    const timer = setTimeout(() => {
      sectionIds.forEach((id) => {
        const el = document.getElementById(id);
        if (el) observer.observe(el);
      });
    }, 150);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [isOpen]);

  // Mobile horizontal auto-scroll centering active nav item
  useEffect(() => {
    if (!activeSection) return;
    const mobileBtn = document.getElementById(`mobile-nav-${activeSection}`);
    if (mobileBtn) {
      mobileBtn.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    }
  }, [activeSection]);

  // Core Three-Color Brand Palette CSS Variables (MUM White × Wave Blue × Ear Pink + Charcoal Black)
  const brandCssVars = {
    // 1. MUM White (70% Base & Canvas)
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
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={brandCssVars}
        className={`fixed inset-0 z-[100000] overflow-y-auto font-sans antialiased ${themeClasses.containerBg} ${themeClasses.selectionBg}`}
      >
        {/* ===== 1. Sticky Editorial Header (Portfolio Navigation) ===== */}
        <header className={`sticky top-0 z-50 backdrop-blur-md border-b transition-all ${themeClasses.headerBg}`}>
          <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
            
            {/* Left: Portfolio Project Title */}
            <button
              type="button"
              onClick={() => scrollToSection("hero-section")}
              className="flex items-center gap-3 cursor-pointer text-left group"
            >
              <div className={`w-9 h-9 rounded-full flex items-center justify-center shadow-xs transition-all group-hover:scale-105 active:scale-95 select-none relative p-0.5 ${themeClasses.headerBtnLogoBg}`}>
                <MumaoCatIcon className="w-7 h-7" isPurring={isPurring} />
              </div>
              <div className="flex flex-col">
                <span className={`text-sm font-black tracking-tight font-mono leading-none flex items-baseline gap-0.5 ${themeClasses.headerText}`}>
                  <span className="font-bold tracking-tighter">MUM</span>
                  <span className="text-[0.85em] font-black">ㄠ</span>
                </span>
                <span className={`text-[9px] font-mono font-semibold tracking-widest uppercase mt-0.5 ${themeClasses.headerSubText}`}>
                  IP BRAND SYSTEM
                </span>
              </div>
            </button>

            {/* Center: Case Study Navigation with animated pill indicator */}
            <nav className="hidden lg:flex items-center gap-1 font-mono text-[11px] font-medium tracking-wide relative">
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
                    className={`relative px-2.5 py-1 rounded-full transition-colors cursor-pointer select-none ${
                      isActive
                        ? "text-[#437596] dark:text-[#6CA4C8] font-bold"
                        : `${themeClasses.bodySubText} hover:text-[#437596] dark:hover:text-[#6CA4C8]`
                    }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="activeNavPill"
                        className="absolute inset-0 rounded-full bg-[#437596]/15 dark:bg-[#6CA4C8]/20 border border-[#437596]/30 dark:border-[#6CA4C8]/40"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10 flex items-center gap-1.5">
                      {isActive && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#E8829C] inline-block animate-pulse" />
                      )}
                      {item.label}
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
        </header>

        {/* Mobile / Tablet Horizontal ScrollSpy Navigation Strip */}
        <div className="lg:hidden sticky top-16 z-40 backdrop-blur-md border-b border-black/5 dark:border-white/5 bg-white/80 dark:bg-zinc-950/80 px-4 py-2 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                id={`mobile-nav-${item.id}`}
                type="button"
                onClick={() => {
                  setActiveSection(item.id);
                  scrollToSection(item.id);
                }}
                className={`whitespace-nowrap px-3 py-1 rounded-full text-xs font-mono font-medium transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                  isActive
                    ? "bg-[#437596] text-white dark:bg-[#6CA4C8] dark:text-zinc-950 font-bold shadow-xs"
                    : `${themeClasses.bodySubText} hover:text-black dark:hover:text-white bg-black/5 dark:bg-white/5`
                }`}
              >
                {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#E8829C]" />}
                {item.label}
              </button>
            );
          })}
        </div>

        {/* ===== MAIN CONTENT AREA ===== */}
        <main className="max-w-6xl mx-auto px-6 py-10 space-y-16">

          {/* ===== 2. CASE STUDY HERO ===== */}
          <section id="hero-section" className="space-y-8 text-left">
            {/* Project Information Meta */}
            <div className={`flex flex-wrap items-center justify-between gap-4 border-b pb-5 ${themeClasses.borderCol}`}>
              <div className="flex flex-wrap items-center gap-2 font-mono text-[11px]">
                <span className={`px-2.5 py-1 rounded-sm font-medium uppercase border flex items-center gap-1.5 ${
                  isDark 
                    ? "bg-[#417293]/20 text-[#6CA4C8] border-[#417293]/40" 
                    : isSepia 
                    ? "bg-[#417293]/10 text-[#2B5573] border-[#417293]/30" 
                    : "bg-[#EBF3F8] text-[#2B5573] border-[#C8DCE8]"
                }`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E8829C] inline-block"></span>
                  IP BRAND DESIGN
                </span>
                <span className={`px-2.5 py-1 rounded-sm border font-medium uppercase ${
                  isDark ? "border-zinc-800 text-zinc-400" : isSepia ? "border-amber-950/15 text-[#6C5B48]" : "border-slate-200 text-slate-600"
                }`}>
                  CHARACTER DESIGN
                </span>
                <span className={`px-2.5 py-1 rounded-sm border font-medium uppercase ${
                  isDark ? "border-zinc-800 text-zinc-400" : isSepia ? "border-amber-950/15 text-[#6C5B48]" : "border-slate-200 text-slate-600"
                }`}>
                  MERCHANDISE
                </span>
              </div>

              <div className={`flex items-center gap-3 text-xs font-mono tracking-wide ${themeClasses.bodySubText}`}>
                <span>2024 — 2026</span>
                <span>•</span>
                <span className="font-semibold">LEAD IP DESIGNER</span>
              </div>
            </div>

            {/* Left: Brand Name & Strategy | Right: Showcase Placeholder Artwork */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              {/* Left Column: Brand, Positioning & Concept */}
              <div className="lg:col-span-5 space-y-6">
                <div className="space-y-3">
                  <span className={`font-mono text-xs font-bold tracking-widest uppercase block ${isDark ? "text-[#6CA4C8]" : "text-[#437596]"}`}>
                    TAIWAN INDIE MUSIC × CAT IP
                  </span>

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

                  <p className={`text-xl sm:text-2xl font-mono font-bold tracking-wide flex items-center gap-2 pt-1 ${isDark ? "text-[#6CA4C8]" : "text-[#437596]"}`}>
                    <span>THE CAT RELIGION 姆貓教</span>
                  </p>
                </div>

                <div className="space-y-3.5">
                  <p className={`text-base sm:text-lg leading-relaxed font-medium ${themeClasses.bodyTitle}`}>
                    「一隻喜歡聽團、喜歡跑音樂祭，偶爾也會厭世的台灣白貓。」
                  </p>

                  <p className={`text-sm sm:text-base leading-relaxed ${themeClasses.bodySubText}`}>
                    MUMㄠ 以「ㄠ」注音與藍色音波鬍鬚建立角色識別，將台灣在地語言、獨立音樂與聽團文化轉化為原創 IP。
                  </p>
                </div>

                <div className={`pt-2 border-l-2 pl-4 ${isDark ? "border-[#F49BB2]" : "border-[#E8829C]"}`}>
                  <p className={`font-serif italic text-base sm:text-lg font-bold tracking-wider ${isDark ? "text-zinc-200" : "text-slate-800"}`}>
                    「全是感情，還有音樂。」
                  </p>
                </div>
              </div>

              {/* Right Column: Hero Visual Showcase Artwork */}
              <div className="lg:col-span-7 space-y-3">
                <div className={`relative h-[300px] sm:h-[380px] md:h-[420px] lg:h-[460px] w-full rounded-2xl overflow-hidden shadow-xs group border-2 ${
                  isDark ? "border-[#6CA4C8]/30 bg-zinc-900/30" : isSepia ? "border-[#437596]/30 bg-[#FAF4E5]" : "border-[#C8DCE8] bg-white"
                } flex items-center justify-center`}>
                  {/* Main Showcase Artwork (Contain, zero crop) */}
                  <img
                    src={heroVisuals[activeHeroImage].url}
                    alt={heroVisuals[activeHeroImage].title}
                    className="relative z-10 max-h-full max-w-full w-auto h-auto object-contain p-4 sm:p-6 transition-transform duration-500 group-hover:scale-102 select-none"
                  />
                  
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
                      STANDARD CHARACTER
                    </span>
                  </div>
                </div>

                {/* Switcher & Caption below image */}
                <div className={`flex flex-wrap items-center justify-between gap-2 text-xs font-mono px-1 ${themeClasses.bodySubText}`}>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] sm:text-xs font-bold text-[#437596] dark:text-[#6CA4C8]">KEY VISUAL 0{activeHeroImage + 1}</span>
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
          </section>


          {/* ===== 3. PROJECT SNAPSHOT ===== */}
          <section id="snapshot-section" className="space-y-6 pt-2 text-left">
            <div className={`flex items-center justify-between border-b pb-3 ${themeClasses.borderCol}`}>
              <span className={`text-xs font-mono font-bold uppercase tracking-widest ${isDark ? "text-[#6CA4C8]" : "text-[#437596]"}`}>
                PROJECT SNAPSHOT
              </span>
              <span className={`text-[11px] font-mono ${themeClasses.bodySubText}`}>
                CASE STUDY METADATA
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 pt-1">
              <div className="space-y-1">
                <span className={`text-[11px] font-mono uppercase tracking-wider block ${themeClasses.bodySubText}`}>
                  PROJECT
                </span>
                <p className={`text-sm font-bold font-mono ${themeClasses.bodyTitle}`}>
                  MUMㄠ
                </p>
              </div>

              <div className="space-y-1">
                <span className={`text-[11px] font-mono uppercase tracking-wider block ${themeClasses.bodySubText}`}>
                  ROLE
                </span>
                <p className={`text-sm font-bold font-mono ${themeClasses.bodyTitle}`}>
                  LEAD IP DESIGNER
                </p>
              </div>

              <div className="space-y-1">
                <span className={`text-[11px] font-mono uppercase tracking-wider block ${themeClasses.bodySubText}`}>
                  PERIOD
                </span>
                <p className={`text-sm font-bold font-mono ${themeClasses.bodyTitle}`}>
                  2024 — 2026
                </p>
              </div>

              <div className="space-y-1">
                <span className={`text-[11px] font-mono uppercase tracking-wider block ${themeClasses.bodySubText}`}>
                  CATEGORY
                </span>
                <p className={`text-xs font-mono font-bold ${themeClasses.bodyTitle}`}>
                  IP BRAND / CHARACTER / MUSIC / FESTIVAL
                </p>
              </div>

              <div className="col-span-2 md:col-span-4 lg:col-span-1 space-y-1">
                <span className={`text-[11px] font-mono uppercase tracking-wider block ${themeClasses.bodySubText}`}>
                  SCOPE
                </span>
                <p className={`text-xs leading-snug font-mono ${themeClasses.bodyText}`}>
                  Character Identity, Visual Language, Merchandise, Festival Applications
                </p>
              </div>
            </div>
          </section>


          {/* ===== 4. THE DNA OF MUM ===== */}
          <section id="dna-section" className="space-y-8 pt-4 text-left">
            <SoundwaveDivider isDark={isDark} color={isDark ? "#6CA4C8" : "#437596"} className="mb-6" />
            
            <div className={`flex flex-col sm:flex-row sm:items-end justify-between border-b pb-4 gap-2 ${themeClasses.borderCol}`}>
              <div>
                <span className={`text-xs font-mono font-bold uppercase tracking-widest block ${isDark ? "text-[#6CA4C8]" : "text-[#437596]"}`}>
                  OVERVIEW / CORE IDENTITY
                </span>
                <h2 className={`text-2xl sm:text-3xl font-black font-mono mt-1 ${themeClasses.bodyTitle}`}>
                  THE DNA OF MUM
                </h2>
              </div>
              <p className={`text-xs font-mono ${themeClasses.bodySubText}`}>
                Three visual cues define the character.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10 pt-2">
              {/* 01: ㄠ */}
              <div className={`space-y-4 pb-4 border-b md:border-b-0 md:border-r pr-0 md:pr-6 lg:pr-8 ${themeClasses.borderColSubtle}`}>
                <div className="flex items-baseline justify-between">
                  <span className="text-3xl font-black font-mono text-[#437596] dark:text-[#6CA4C8]">01</span>
                  <span className="text-4xl font-black font-sans leading-none text-[#437596] dark:text-[#6CA4C8]">ㄠ</span>
                </div>
                <div>
                  <h3 className={`text-sm font-bold font-mono tracking-wider uppercase ${themeClasses.bodyTitle}`}>
                    TAIWANESE IDENTITY
                  </h3>
                  <p className={`text-xs font-medium mt-0.5 text-[#437596] dark:text-[#6CA4C8]`}>
                    在地語言文化
                  </p>
                </div>
                <p className={`text-sm leading-relaxed ${themeClasses.bodyText}`}>
                  注音「ㄠ」成為 MUM 最具台灣識別性的角色細節，將角色命名與在地語言文化直接連結。
                </p>
              </div>

              {/* 02: 〰〰〰 */}
              <div className={`space-y-4 pb-4 border-b md:border-b-0 md:border-r pr-0 md:pr-6 lg:pr-8 ${themeClasses.borderColSubtle}`}>
                <div className="flex items-baseline justify-between">
                  <span className="text-3xl font-black font-mono text-[#437596] dark:text-[#6CA4C8]">02</span>
                  <span className="text-2xl font-black tracking-tighter leading-none text-[#437596] dark:text-[#6CA4C8]">〰〰〰</span>
                </div>
                <div>
                  <h3 className={`text-sm font-bold font-mono tracking-wider uppercase ${themeClasses.bodyTitle}`}>
                    MUSIC IDENTITY
                  </h3>
                  <p className={`text-xs font-medium mt-0.5 text-[#437596] dark:text-[#6CA4C8]`}>
                    音波視覺語言
                  </p>
                </div>
                <p className={`text-sm leading-relaxed ${themeClasses.bodyText}`}>
                  湛藍波浪鬍鬚象徵聲音、音樂與現場情緒，同時成為 MUM 最具辨識度的視覺語言。
                </p>
              </div>

              {/* 03: PINK */}
              <div className="space-y-4 pb-4">
                <div className="flex items-baseline justify-between">
                  <span className="text-3xl font-black font-mono text-[#E8829C] dark:text-[#F49BB2]">03</span>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-sm border border-[#E8829C]/40 bg-[#E8829C]/10 text-[#E8829C] dark:text-[#F49BB2]">
                    EAR PINK
                  </span>
                </div>
                <div>
                  <h3 className={`text-sm font-bold font-mono tracking-wider uppercase ${themeClasses.bodyTitle}`}>
                    CHARACTER EMOTION
                  </h3>
                  <p className={`text-xs font-medium mt-0.5 text-[#E8829C] dark:text-[#F49BB2]`}>
                    情緒溫度色彩
                  </p>
                </div>
                <p className={`text-sm leading-relaxed ${themeClasses.bodyText}`}>
                  粉紅耳朵與肉球作為情緒色彩，讓音樂文化之外的角色個性更有溫度。
                </p>
              </div>
            </div>
          </section>


          {/* ===== 5. DESIGN STATEMENT ===== */}
          <section id="statement-section" className="space-y-6 pt-2 text-left">
            <div className={`p-8 rounded-2xl border ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-4 space-y-1.5">
                  <span className={`text-xs font-mono font-bold uppercase tracking-widest block ${isDark ? "text-[#6CA4C8]" : "text-[#437596]"}`}>
                    DESIGN STATEMENT
                  </span>
                  <h3 className={`text-xl sm:text-2xl font-bold font-mono ${themeClasses.bodyTitle}`}>
                    設計策略思維
                  </h3>
                </div>

                <div className="lg:col-span-8 space-y-4">
                  <p className={`text-base sm:text-lg leading-relaxed font-medium ${themeClasses.bodyTitle}`}>
                    MUMㄠ 不是一隻單純的可愛白貓。透過注音「ㄠ」、音波鬍鬚與手繪語言，將台灣在地文化、獨立音樂與聽團日常，轉化成一個具有角色個性與延伸性的 IP。
                  </p>
                  <div className="pt-2">
                    <span className="font-serif italic text-lg sm:text-xl font-bold tracking-wide text-[#437596] dark:text-[#6CA4C8]">
                      「全是感情，還有音樂。」
                    </span>
                  </div>
                </div>
              </div>
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
                  CHARACTER SYSTEM
                </h2>
                <p className={`text-xs font-mono tracking-wide ${themeClasses.bodySubText}`}>
                  Building the visual identity of MUMㄠ.
                </p>
              </div>
              <div className="sm:max-w-md space-y-2">
                <p className={`text-xs leading-relaxed ${themeClasses.bodyText}`}>
                  建立 MUMㄠ 的角色識別系統，透過固定角色特徵、表情與動作規則，維持不同情境下的角色一致性。
                </p>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E8829C] inline-block animate-pulse"></span>
                  <span className={`text-[11px] font-mono font-bold uppercase tracking-wider ${isDark ? "text-[#F49BB2]" : "text-[#D85E7E]"}`}>
                    ONE MUM. MULTIPLE STATES.
                  </span>
                  <span className={`text-[11px] font-mono ${themeClasses.bodySubText}`}>
                    ／ 同一個 MUM，不同的情緒與動作
                  </span>
                </div>
              </div>
            </div>

            {/* Character System Hierarchy Diagram */}
            <div className={`p-6 sm:p-7 rounded-2xl border space-y-6 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-3 gap-2">
                <div>
                  <span className={`text-[10px] font-mono font-bold uppercase tracking-widest block ${isDark ? "text-[#6CA4C8]" : "text-[#437596]"}`}>
                    SYSTEM LOGIC & ARCHITECTURE
                  </span>
                  <h3 className={`text-sm font-bold font-mono ${themeClasses.bodyTitle}`}>
                    CHARACTER SYSTEM FLOW
                  </h3>
                </div>
                <span className={`text-xs font-mono ${themeClasses.bodySubText}`}>
                  Core Identity → Expression → Action → Application
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
                {/* 01: Core Identity */}
                <div className={`p-4 rounded-xl border space-y-2 flex flex-col justify-between ${themeClasses.cardBg} ${themeClasses.borderColSubtle}`}>
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded border border-[#437596]/30 bg-[#437596]/10 text-[#437596] dark:text-[#6CA4C8]">
                      01 / IDENTITY
                    </span>
                    <h4 className={`text-xs font-bold font-mono mt-2 ${themeClasses.bodyTitle}`}>
                      CORE IDENTITY
                    </h4>
                    <p className={`text-[11px] font-medium text-[#437596] dark:text-[#6CA4C8]`}>
                      決定 MUM 是誰
                    </p>
                  </div>
                  <p className={`text-xs leading-relaxed ${themeClasses.bodySubText}`}>
                    固定正向骨架、圓潤頭型、注音「ㄠ」與音波鬍鬚，確立 Master Character。
                  </p>
                </div>

                {/* 02: Expression */}
                <div className={`p-4 rounded-xl border space-y-2 flex flex-col justify-between ${themeClasses.cardBg} ${themeClasses.borderColSubtle}`}>
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded border border-[#E8829C]/40 bg-[#E8829C]/10 text-[#E8829C] dark:text-[#F49BB2]">
                      02 / EXPRESSION
                    </span>
                    <h4 className={`text-xs font-bold font-mono mt-2 ${themeClasses.bodyTitle}`}>
                      EXPRESSION SYSTEM
                    </h4>
                    <p className={`text-[11px] font-medium text-[#E8829C] dark:text-[#F49BB2]`}>
                      決定 MUM 怎麼表達
                    </p>
                  </div>
                  <p className={`text-xs leading-relaxed ${themeClasses.bodySubText}`}>
                    眨眼、厭世神態與情緒溫度色彩，在保持比例一致下進入日常情境。
                  </p>
                </div>

                {/* 03: Action */}
                <div className={`p-4 rounded-xl border space-y-2 flex flex-col justify-between ${themeClasses.cardBg} ${themeClasses.borderColSubtle}`}>
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded border border-[#437596]/30 bg-[#437596]/10 text-[#437596] dark:text-[#6CA4C8]">
                      03 / ACTION
                    </span>
                    <h4 className={`text-xs font-bold font-mono mt-2 ${themeClasses.bodyTitle}`}>
                      ACTION LANGUAGE
                    </h4>
                    <p className={`text-[11px] font-medium text-[#437596] dark:text-[#6CA4C8]`}>
                      決定 MUM 怎麼活動
                    </p>
                  </div>
                  <p className={`text-xs leading-relaxed ${themeClasses.bodySubText}`}>
                    舉手開衝、揮舞毛巾與現場 Mosh Pit，建立音樂祭的即時動態能量。
                  </p>
                </div>

                {/* 04: Application */}
                <div className={`p-4 rounded-xl border space-y-2 flex flex-col justify-between ${themeClasses.cardBg} ${themeClasses.borderColSubtle}`}>
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded border border-zinc-500/30 bg-zinc-500/10 text-zinc-500 dark:text-zinc-400">
                      04 / APPLICATION
                    </span>
                    <h4 className={`text-xs font-bold font-mono mt-2 ${themeClasses.bodyTitle}`}>
                      APPLICATION SYSTEM
                    </h4>
                    <p className={`text-[11px] font-medium text-zinc-500 dark:text-zinc-400`}>
                      決定 MUM 怎麼落地
                    </p>
                  </div>
                  <p className={`text-xs leading-relaxed ${themeClasses.bodySubText}`}>
                    周邊商品、社群內容、音樂祭現場輸出與識別規範，實現長效應用。
                  </p>
                </div>
              </div>
            </div>

            {/* Character Design Principles (Editorial Grid & Guideline) */}
            <div className="space-y-8 pt-4">
              {/* Section Header */}
              <div className={`border-b pb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-3 ${themeClasses.borderCol}`}>
                <div>
                  <span className={`text-[10px] font-mono font-bold uppercase tracking-widest block ${isDark ? "text-[#6CA4C8]" : "text-[#437596]"}`}>
                    DESIGN SYSTEM RULES
                  </span>
                  <h3 className={`text-2xl sm:text-3xl font-black font-mono tracking-tight mt-1 ${themeClasses.bodyTitle}`}>
                    CHARACTER DESIGN PRINCIPLES
                  </h3>
                </div>
                <p className={`text-xs font-mono max-w-sm text-left sm:text-right ${themeClasses.bodySubText}`}>
                  Four principles keep MUMㄠ visually consistent across every extension.
                </p>
              </div>

              {/* 03 / Four Core Principles (Editorial Grid - Minimal Cards) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* 01 SILHOUETTE */}
                <div className={`p-6 rounded-xl border space-y-3.5 flex flex-col justify-between ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                  <div className="space-y-2.5">
                    <div className="flex items-baseline justify-between border-b pb-2 border-zinc-500/15">
                      <span className="text-2xl font-black font-mono text-[#437596] dark:text-[#6CA4C8]">01</span>
                      <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-[#437596] dark:text-[#6CA4C8]">
                        FORM / RECOGNITION
                      </span>
                    </div>
                    <div>
                      <h4 className={`text-sm font-bold font-mono uppercase tracking-wider ${themeClasses.bodyTitle}`}>
                        SILHOUETTE
                      </h4>
                      <p className={`text-xs font-medium mt-0.5 text-[#437596] dark:text-[#6CA4C8]`}>
                        輪廓識別度
                      </p>
                    </div>
                    <p className={`text-xs leading-relaxed ${themeClasses.bodyText}`}>
                      維持圓潤貓頭與清楚外輪廓，即使縮小至貼圖、社群圖像或周邊尺寸，仍能保留 MUM 的角色辨識度。
                    </p>
                  </div>
                  <div className="pt-2">
                    <span className={`text-[10px] font-mono uppercase ${themeClasses.bodySubText}`}>
                      RULE: SILHOUETTE INTEGRITY
                    </span>
                  </div>
                </div>

                {/* 02 SIGNATURE FEATURES */}
                <div className={`p-6 rounded-xl border space-y-3.5 flex flex-col justify-between ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                  <div className="space-y-2.5">
                    <div className="flex items-baseline justify-between border-b pb-2 border-zinc-500/15">
                      <span className="text-2xl font-black font-mono text-[#E8829C] dark:text-[#F49BB2]">02</span>
                      <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-[#E8829C] dark:text-[#F49BB2]">
                        CORE DNA
                      </span>
                    </div>
                    <div>
                      <h4 className={`text-sm font-bold font-mono uppercase tracking-wider ${themeClasses.bodyTitle}`}>
                        SIGNATURE FEATURES
                      </h4>
                      <p className={`text-xs font-medium mt-0.5 text-[#E8829C] dark:text-[#F49BB2]`}>
                        固定五大特徵
                      </p>
                    </div>
                    <p className={`text-xs leading-relaxed ${themeClasses.bodyText}`}>
                      「ㄠ」、藍色音波鬍鬚、粉紅耳朵、白色 T-shirt、藍色牛仔褲，共同構成 MUM 的核心角色識別，不可任意替換或刪減。
                    </p>
                  </div>
                  <div className="pt-2">
                    <span className={`text-[10px] font-mono uppercase ${themeClasses.bodySubText}`}>
                      RULE: 5 CORE IDENTIFIERS
                    </span>
                  </div>
                </div>

                {/* 03 EXPRESSION */}
                <div className={`p-6 rounded-xl border space-y-3.5 flex flex-col justify-between ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                  <div className="space-y-2.5">
                    <div className="flex items-baseline justify-between border-b pb-2 border-zinc-500/15">
                      <span className="text-2xl font-black font-mono text-[#437596] dark:text-[#6CA4C8]">03</span>
                      <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-[#437596] dark:text-[#6CA4C8]">
                        EXPRESSION SYSTEM
                      </span>
                    </div>
                    <div>
                      <h4 className={`text-sm font-bold font-mono uppercase tracking-wider ${themeClasses.bodyTitle}`}>
                        EXPRESSION
                      </h4>
                      <p className={`text-xs font-medium mt-0.5 text-[#437596] dark:text-[#6CA4C8]`}>
                        表情變化守則
                      </p>
                    </div>
                    <p className={`text-xs leading-relaxed ${themeClasses.bodyText}`}>
                      表情可以依情境變化，例如眨眼、放空、微笑、Mosh 或大笑，但角色臉部比例與核心特徵必須維持一致。
                    </p>
                  </div>
                  <div className="pt-2">
                    <span className={`text-[10px] font-mono uppercase ${themeClasses.bodySubText}`}>
                      RULE: IDENTITY STAYS FIXED
                    </span>
                  </div>
                </div>

                {/* 04 ACTION */}
                <div className={`p-6 rounded-xl border space-y-3.5 flex flex-col justify-between ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                  <div className="space-y-2.5">
                    <div className="flex items-baseline justify-between border-b pb-2 border-zinc-500/15">
                      <span className="text-2xl font-black font-mono text-[#437596] dark:text-[#6CA4C8]">04</span>
                      <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-[#437596] dark:text-[#6CA4C8]">
                        ACTION LANGUAGE
                      </span>
                    </div>
                    <div>
                      <h4 className={`text-sm font-bold font-mono uppercase tracking-wider ${themeClasses.bodyTitle}`}>
                        ACTION
                      </h4>
                      <p className={`text-xs font-medium mt-0.5 text-[#437596] dark:text-[#6CA4C8]`}>
                        動態性格準則
                      </p>
                    </div>
                    <p className={`text-xs leading-relaxed ${themeClasses.bodyText}`}>
                      動作可以自由延伸，但必須符合 MUM 的角色性格：輕鬆、微厭世、喜歡音樂、現場感強，並保留聽團文化中的自然與幽默。
                    </p>
                  </div>
                  <div className="pt-2">
                    <span className={`text-[10px] font-mono uppercase ${themeClasses.bodySubText}`}>
                      RULE: FESTIVAL PERSONA
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 04 / Core Design Statement & Always Keep DNA List */}
            <div className={`p-8 sm:p-10 rounded-2xl border space-y-8 ${themeClasses.cardBg} ${themeClasses.borderColSubtle}`}>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Left: Design Manifesto */}
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
                      無論出現在社群內容、音樂祭現場或商品應用，MUMㄠ 都必須維持相同的角色識別。姿勢可以改變，情緒可以改變，但核心特徵與角色個性不能被改變。
                    </p>
                    <p className={`text-xs font-mono italic ${themeClasses.bodySubText}`}>
                      From social content to festival applications, MUMㄠ keeps the same visual DNA across every expression.
                    </p>
                  </div>
                </div>

                {/* Right: ALWAYS KEEP DNA Spec List (Vertical List / Fine Dividers) */}
                <div className="lg:col-span-5 space-y-3">
                  <div className="border-b pb-2 flex items-center justify-between">
                    <span className={`text-xs font-mono font-bold uppercase tracking-wider ${isDark ? "text-[#6CA4C8]" : "text-[#437596]"}`}>
                      ALWAYS KEEP / 核心 DNA 規範
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
                        <span className={`font-bold ${themeClasses.bodyTitle}`}>MUSIC IDENTITY</span>
                      </div>
                      <span className={`text-[11px] ${themeClasses.bodySubText}`}>藍色音波鬍鬚</span>
                    </div>

                    <div className="py-2 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#E8829C] inline-block"></span>
                        <span className={`font-bold ${themeClasses.bodyTitle}`}>PINK EARS</span>
                      </div>
                      <span className={`text-[11px] text-[#E8829C] dark:text-[#F49BB2]`}>Character Emotion</span>
                    </div>

                    <div className="py-2 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="w-2 h-2 rounded bg-zinc-300 dark:bg-zinc-600 inline-block"></span>
                        <span className={`font-bold ${themeClasses.bodyTitle}`}>WHITE TEE</span>
                      </div>
                      <span className={`text-[11px] ${themeClasses.bodySubText}`}>Everyday Persona</span>
                    </div>

                    <div className="py-2 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="w-2 h-2 rounded bg-[#437596] inline-block"></span>
                        <span className={`font-bold ${themeClasses.bodyTitle}`}>BLUE DENIM</span>
                      </div>
                      <span className={`text-[11px] ${themeClasses.bodySubText}`}>Festival / Casual Identity</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 05 / FIXED vs. FLEXIBLE System Grid */}
            <div className={`p-8 rounded-2xl border space-y-6 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-3 gap-2">
                <div>
                  <span className={`text-[10px] font-mono font-bold uppercase tracking-widest block ${isDark ? "text-[#6CA4C8]" : "text-[#437596]"}`}>
                    DESIGN BOUNDARIES / 設計界線
                  </span>
                  <h4 className={`text-base font-bold font-mono ${themeClasses.bodyTitle}`}>
                    FIXED VS. FLEXIBLE SYSTEM
                  </h4>
                </div>
                <p className={`text-xs font-mono ${themeClasses.bodySubText}`}>
                  Directing what stays untouchable and what adapts freely.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 divide-y md:divide-y-0 md:divide-x divide-zinc-500/20">
                {/* FIXED COLUMN */}
                <div className="space-y-4 pr-0 md:pr-6">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#E8829C]"></span>
                    <h5 className={`text-sm font-bold font-mono tracking-wider uppercase text-[#E8829C] dark:text-[#F49BB2]`}>
                      FIXED / 不可更動
                    </h5>
                  </div>
                  <p className={`text-xs leading-relaxed ${themeClasses.bodySubText}`}>
                    確保品牌資產與角色辨識度的核心基準，在任何延伸媒介中皆必須完整保留：
                  </p>
                  <ul className="space-y-2 text-xs font-mono pt-1">
                    {[
                      { en: "Core Identity", zh: "核心角色基準" },
                      { en: "ㄠ", zh: "注音識別符號" },
                      { en: "Blue Whiskers", zh: "湛藍音波鬍鬚" },
                      { en: "Pink Ears", zh: "粉紅耳朵與溫度" },
                      { en: "White T-shirt", zh: "經典白色素 T" },
                      { en: "Blue Denim", zh: "藍色休閒牛仔褲" },
                      { en: "Character Proportion", zh: "頭身與五官幾何比例" },
                      { en: "Line Language", zh: "手繪與向量線條風格" }
                    ].map((item, idx) => (
                      <li key={idx} className={`flex items-center justify-between py-1 border-b border-zinc-500/10 ${themeClasses.bodyTitle}`}>
                        <span className="font-semibold">• {item.en}</span>
                        <span className={`text-[11px] ${themeClasses.bodySubText}`}>{item.zh}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* FLEXIBLE COLUMN */}
                <div className="space-y-4 pt-6 md:pt-0 pl-0 md:pl-6">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#437596] dark:bg-[#6CA4C8]"></span>
                    <h5 className={`text-sm font-bold font-mono tracking-wider uppercase text-[#437596] dark:text-[#6CA4C8]`}>
                      FLEXIBLE / 自由延伸
                    </h5>
                  </div>
                  <p className={`text-xs leading-relaxed ${themeClasses.bodySubText}`}>
                    配合不同展演場域、情境載體與情緒節奏，可進行多樣化創作演繹：
                  </p>
                  <ul className="space-y-2 text-xs font-mono pt-1">
                    {[
                      { en: "Pose", zh: "站姿、坐姿、側影動態" },
                      { en: "Expression", zh: "眨眼、微笑、放空、開衝" },
                      { en: "Gesture", zh: "舉爪、揮手、比讚、手勢" },
                      { en: "Props", zh: "樂團毛巾、吉他 Pick、墨鏡、旗幟" },
                      { en: "Festival Situation", zh: "音樂祭舞台、草地、市集" },
                      { en: "Music Context", zh: "搖滾、電子、Indie Pop 氛圍" },
                      { en: "Social Content", zh: "迷因、社群短影音、貼圖日常" }
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

            {/* 06 / Character Design Formula (Minimal Equation Banner) */}
            <div className={`p-6 rounded-2xl border text-center space-y-3 ${themeClasses.cardBg} ${themeClasses.borderColSubtle}`}>
              <span className={`text-[10px] font-mono font-bold uppercase tracking-widest block ${isDark ? "text-[#6CA4C8]" : "text-[#437596]"}`}>
                MUM CHARACTER SYSTEM FORMULA
              </span>

              <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 font-mono font-black text-xs sm:text-sm lg:text-base">
                <span className="px-3 py-1.5 rounded-lg border border-[#437596]/30 bg-[#437596]/10 text-[#437596] dark:text-[#6CA4C8]">
                  CORE IDENTITY (固定 DNA)
                </span>
                <span className={`${themeClasses.bodySubText}`}>+</span>
                <span className="px-3 py-1.5 rounded-lg border border-[#E8829C]/30 bg-[#E8829C]/10 text-[#E8829C] dark:text-[#F49BB2]">
                  EXPRESSION (情緒變化)
                </span>
                <span className={`${themeClasses.bodySubText}`}>+</span>
                <span className="px-3 py-1.5 rounded-lg border border-[#437596]/30 bg-[#437596]/10 text-[#437596] dark:text-[#6CA4C8]">
                  ACTION (動態語言)
                </span>
                <span className={`${themeClasses.bodySubText}`}>=</span>
                <span className={`px-4 py-1.5 rounded-lg border font-extrabold ${themeClasses.bodyTitle} ${themeClasses.borderCol}`}>
                  MUMㄠ (可擴充角色體系)
                </span>
              </div>

              <p className={`text-xs font-mono pt-1 ${themeClasses.bodySubText}`}>
                固定識別資產 × 靈活的情緒與動作 ＝ 具備長效生命力之獨立 IP 系統
              </p>
            </div>

            {/* Signature Features (固定識別元素) */}
            <div className="space-y-6 pt-2">
              <div className={`border-b pb-3 flex flex-col sm:flex-row sm:items-end justify-between gap-1 ${themeClasses.borderCol}`}>
                <div>
                  <span className={`text-[10px] font-mono font-bold uppercase tracking-widest block ${isDark ? "text-[#6CA4C8]" : "text-[#437596]"}`}>
                    SYSTEM COMPONENTS / 構成元素規範
                  </span>
                  <h3 className={`text-xl font-bold font-mono mt-0.5 ${themeClasses.bodyTitle}`}>
                    SIGNATURE FEATURES
                  </h3>
                </div>
                <p className={`text-xs font-mono ${themeClasses.bodySubText}`}>
                  Five fixed visual anchors defining MUMㄠ across all media.
                </p>
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
                      TAIWANESE IDENTITY
                    </h4>
                    <p className={`text-[11px] font-medium text-[#437596] dark:text-[#6CA4C8]`}>
                      在地語言文化
                    </p>
                  </div>
                  <p className={`text-xs leading-relaxed ${themeClasses.bodySubText}`}>
                    注音「ㄠ」融入命名與角色識別，具備強烈在地次文化歸屬感。
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
                      MUSIC IDENTITY
                    </h4>
                    <p className={`text-[11px] font-medium text-[#437596] dark:text-[#6CA4C8]`}>
                      音波視覺語言
                    </p>
                  </div>
                  <p className={`text-xs leading-relaxed ${themeClasses.bodySubText}`}>
                    湛藍波浪鬍鬚象徵聲波、音浪與現場能量，為最核心的超級符號。
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
                      情緒溫度色彩
                    </p>
                  </div>
                  <p className={`text-xs leading-relaxed ${themeClasses.bodySubText}`}>
                    粉紅耳尖與肉球帶來手繪溫度，平衡冷色調音波與俐落線條。
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
                      日常隨性氣質
                    </p>
                  </div>
                  <p className={`text-xs leading-relaxed ${themeClasses.bodySubText}`}>
                    經典素面白色短 T，塑造親切、輕鬆、貼近生活的青年人設。
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
                      聽團現場次文化
                    </p>
                  </div>
                  <p className={`text-xs leading-relaxed ${themeClasses.bodySubText}`}>
                    率性牛仔短褲，連結獨立樂迷在草地與泥坑中聽團的真實日常。
                  </p>
                </div>
              </div>
            </div>

            {/* Action Extension System (Future Roadmap) */}
            <div className={`p-6 sm:p-7 rounded-2xl border space-y-5 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
              <div className={`flex flex-col sm:flex-row sm:items-center justify-between border-b pb-3 gap-2 ${themeClasses.borderColSubtle}`}>
                <div>
                  <span className={`text-[10px] font-mono font-bold uppercase tracking-widest block ${isDark ? "text-[#6CA4C8]" : "text-[#437596]"}`}>
                    FUTURE CHARACTER ROADMAP / 擴充規劃
                  </span>
                  <h3 className={`text-sm font-bold font-mono ${themeClasses.bodyTitle}`}>
                    ACTION EXTENSION SYSTEM
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold">
                    EXPANSION DIRECTION
                  </span>
                </div>
              </div>

              <p className={`text-xs leading-relaxed ${themeClasses.bodyText}`}>
                MUM 的動作可以持續延伸，但所有新姿勢都必須遵循同一套角色語言。以下為規劃中之擴充動作系統方向：
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {characterFutureSystem.map((sys, idx) => (
                  <div key={idx} className={`p-4 rounded-xl border space-y-2 transition-all ${themeClasses.cardBg} ${themeClasses.borderColSubtle}`}>
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className={`font-bold ${isDark ? "text-[#6CA4C8]" : "text-[#437596]"}`}>{sys.num}</span>
                      <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-zinc-500/10 text-zinc-500 dark:text-zinc-400">
                        FUTURE ROADMAP
                      </span>
                    </div>
                    <div>
                      <span className={`text-xs font-mono font-bold block ${themeClasses.bodyTitle}`}>{sys.name}</span>
                      <span className={`text-[11px] font-medium text-[#437596] dark:text-[#6CA4C8]`}>{sys.zhName}</span>
                    </div>
                    <p className={`text-xs leading-relaxed ${themeClasses.bodySubText}`}>{sys.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Next Section Navigation Button */}
            <div className={`pt-6 flex justify-end border-t ${themeClasses.borderColSubtle}`}>
              <button
                type="button"
                onClick={() => scrollToSection("color-section")}
                className={`inline-flex items-center gap-4 px-6 py-3.5 rounded-xl border text-xs font-mono font-bold transition-all ${themeClasses.cardBg} ${themeClasses.borderColSubtle} hover:border-[#437596] hover:text-[#437596] dark:hover:border-[#6CA4C8] dark:hover:text-[#6CA4C8] group cursor-pointer`}
              >
                <div className="text-left">
                  <span className={`text-[10px] block font-mono uppercase tracking-widest ${themeClasses.bodySubText}`}>
                    NEXT SECTION
                  </span>
                  <span className="text-sm font-bold tracking-tight">
                    02 / COLOR SYSTEM →
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
                  MUMㄠ 的色彩不是裝飾，而是由角色 DNA、台灣文化與音樂識別共同建立的視覺系統。
                </p>
              </div>
            </div>

            {/* 1. VISUAL WEIGHT RATIO (70% Base / 20% Music / 10% Accent + Structural Line) */}
            <div className={`p-6 sm:p-8 rounded-2xl border space-y-6 ${themeClasses.cardBg} ${themeClasses.borderBlueAccent}`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-4 border-black/5 dark:border-white/5">
                <div>
                  <span className={`text-xs font-mono font-bold uppercase tracking-widest block ${isDark ? "text-[#6CA4C8]" : "text-[#437596]"}`}>
                    COLOR USAGE RULE
                  </span>
                  <h3 className={`text-lg font-bold font-mono ${themeClasses.bodyTitle}`}>
                    VISUAL WEIGHT RATIO / 色彩比例守則
                  </h3>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded-md ${isDark ? "bg-zinc-800 text-zinc-200" : "bg-slate-100 text-slate-700"}`}>
                    70% BASE / 20% MUSIC / 10% ACCENT
                  </span>
                  <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded-md border border-zinc-500/30 ${themeClasses.cardSubtleBg} text-zinc-500 dark:text-zinc-400`}>
                    BLACK: STRUCTURAL
                  </span>
                </div>
              </div>

              {/* Stacked Proportional Bar */}
              <div className="space-y-2">
                <div className="h-12 w-full rounded-xl overflow-hidden flex shadow-inner border border-black/15 dark:border-white/15">
                  {/* 70% White */}
                  <div className="w-[70%] bg-white text-zinc-900 flex items-center justify-between px-4 text-xs font-mono font-bold border-r border-zinc-200">
                    <span className="truncate">70% MUM WHITE / CHARACTER BASE</span>
                    <span className="hidden sm:inline font-bold">70%</span>
                  </div>
                  {/* 20% Wave Blue */}
                  <div className="w-[20%] bg-[#437596] text-white flex items-center justify-between px-3 text-xs font-mono font-bold border-r border-[#2B5573]">
                    <span className="truncate">20% WAVE BLUE</span>
                    <span className="hidden sm:inline font-bold">20%</span>
                  </div>
                  {/* 10% Ear Pink */}
                  <div className="w-[10%] bg-[#E8829C] text-white flex items-center justify-center text-xs font-mono font-bold">
                    <span className="truncate text-center">10%</span>
                  </div>
                </div>
              </div>

              {/* 3 Colors Proportional Roles + Structural Line Box */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                {/* 70% MUM WHITE */}
                <div className={`p-4 rounded-xl border space-y-2 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-black font-mono leading-none text-zinc-800 dark:text-zinc-100">70%</span>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200">
                      CHARACTER BASE
                    </span>
                  </div>
                  <div>
                    <h4 className={`text-xs font-bold font-mono ${themeClasses.bodyTitle}`}>
                      MUM WHITE ‧ 姆貓純白
                    </h4>
                    <p className={`text-[11px] font-mono mt-0.5 text-zinc-500 dark:text-zinc-400`}>
                      純粹 ‧ 留白 ‧ 角色本體 ‧ 視覺空間
                    </p>
                  </div>
                  <p className={`text-xs leading-relaxed ${themeClasses.bodySubText}`}>
                    MUM 的基礎色彩。大面積使用於角色身體、背景與主要視覺，建立乾淨、純粹且具有留白感的視覺基礎。
                  </p>
                </div>

                {/* 20% WAVE BLUE */}
                <div className={`p-4 rounded-xl border space-y-2 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-black font-mono leading-none text-[#437596] dark:text-[#6CA4C8]">20%</span>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded border border-[#437596]/30 bg-[#437596]/10 text-[#437596] dark:text-[#6CA4C8]">
                      MUSIC IDENTITY
                    </span>
                  </div>
                  <div>
                    <h4 className={`text-xs font-bold font-mono ${themeClasses.bodyTitle}`}>
                      WAVE BLUE ‧ 音波湛藍
                    </h4>
                    <p className={`text-[11px] font-mono mt-0.5 text-[#437596] dark:text-[#6CA4C8]`}>
                      音樂 ‧ 聲音 ‧ 節奏 ‧ 現場
                    </p>
                  </div>
                  <p className={`text-xs leading-relaxed ${themeClasses.bodySubText}`}>
                    取自 MUM 的湛藍音波鬍鬚，象徵聲音、節奏與音樂現場，是 MUM 與音樂文化之間最重要的色彩連結。
                  </p>
                </div>

                {/* 10% EAR PINK */}
                <div className={`p-4 rounded-xl border space-y-2 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-black font-mono leading-none text-[#E8829C] dark:text-[#F49BB2]">10%</span>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded border border-[#E8829C]/30 bg-[#E8829C]/10 text-[#E8829C] dark:text-[#F49BB2]">
                      EMOTIONAL ACCENT
                    </span>
                  </div>
                  <div>
                    <h4 className={`text-xs font-bold font-mono ${themeClasses.bodyTitle}`}>
                      EAR PINK ‧ 耳尖粉紅
                    </h4>
                    <p className={`text-[11px] font-mono mt-0.5 text-[#E8829C] dark:text-[#F49BB2]`}>
                      情緒 ‧ 溫度 ‧ 親和力 ‧ 角色個性
                    </p>
                  </div>
                  <p className={`text-xs leading-relaxed ${themeClasses.bodySubText}`}>
                    取自 MUM 的耳朵與肉球，作為暖色情緒訊號，為黑、白與湛藍系統加入溫度。（強調少量使用，不作為主色）
                  </p>
                </div>
              </div>

              {/* Structural Charcoal Black Clarification Banner */}
              <div className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                <div className="flex items-center gap-3">
                  <span className="w-3.5 h-3.5 rounded-sm bg-[#1E242B] border border-white/20 shrink-0"></span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-mono font-bold uppercase ${themeClasses.bodyTitle}`}>
                        CHARCOAL BLACK / 手繪炭黑
                      </span>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#1E242B] text-white">
                        STRUCTURAL / VARIABLE
                      </span>
                    </div>
                    <p className={`text-xs leading-relaxed mt-0.5 ${themeClasses.bodySubText}`}>
                      不納入 70 / 20 / 10 的彩度比例計算。屬於結構色（Structural Line），依照文字、手繪線稿與資訊結構需求彈性使用。
                    </p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className={`text-[10px] font-mono block ${themeClasses.bodySubText}`}>LINE & STRUCTURE</span>
                  <span className="text-xs font-mono font-bold text-zinc-500 dark:text-zinc-400">NON-RATIO COLOR</span>
                </div>
              </div>
            </div>

            {/* 2. Color Swatches Specification Grid (4 Columns) */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b pb-2 border-black/5 dark:border-white/5">
                <span className={`text-xs font-mono font-bold uppercase tracking-widest ${themeClasses.bodyTitle}`}>
                  COLOR SPECIFICATIONS / 四大核心色彩規格
                </span>
                <span className={`text-[11px] font-mono ${themeClasses.bodySubText}`}>
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
                            {col.ratio}
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

            {/* 3. COLOR HIERARCHY (色彩層級系統) */}
            <div className={`p-6 sm:p-8 rounded-2xl border space-y-6 ${themeClasses.cardBg} ${themeClasses.borderColSubtle}`}>
              <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b pb-4 gap-2 border-black/5 dark:border-white/5">
                <div>
                  <span className={`text-xs font-mono font-bold uppercase tracking-widest block ${isDark ? "text-[#6CA4C8]" : "text-[#437596]"}`}>
                    SYSTEM ARCHITECTURE
                  </span>
                  <h3 className={`text-xl font-bold font-mono mt-0.5 ${themeClasses.bodyTitle}`}>
                    COLOR HIERARCHY / 色彩層級架構
                  </h3>
                </div>
                <p className={`text-xs font-mono ${themeClasses.bodySubText}`}>
                  White 建立空間 ‧ Blue 建立品牌 ‧ Pink 建立情緒 ‧ Black 建立結構
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* 01 BASE */}
                <div className={`p-5 rounded-xl border space-y-3 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100">
                      01 / BASE
                    </span>
                    <span className="w-3.5 h-3.5 rounded-full bg-white border border-zinc-300"></span>
                  </div>
                  <div>
                    <h4 className={`text-sm font-bold font-mono ${themeClasses.bodyTitle}`}>
                      MUM WHITE
                    </h4>
                    <p className={`text-xs font-bold text-zinc-500 dark:text-zinc-400`}>
                      建立空間與留白 (Base & Space)
                    </p>
                  </div>
                  <p className={`text-xs leading-relaxed ${themeClasses.bodySubText}`}>
                    作為視覺系統的呼吸底襯，賦予畫面開闊感，承載角色本體與文字排版。
                  </p>
                </div>

                {/* 02 IDENTITY */}
                <div className={`p-5 rounded-xl border space-y-3 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-[#437596]/15 text-[#437596] dark:text-[#6CA4C8]">
                      02 / IDENTITY
                    </span>
                    <span className="w-3.5 h-3.5 rounded-full bg-[#437596]"></span>
                  </div>
                  <div>
                    <h4 className={`text-sm font-bold font-mono ${themeClasses.bodyTitle}`}>
                      WAVE BLUE
                    </h4>
                    <p className={`text-xs font-bold text-[#437596] dark:text-[#6CA4C8]`}>
                      建立品牌識別 (Brand & Music)
                    </p>
                  </div>
                  <p className={`text-xs leading-relaxed ${themeClasses.bodySubText}`}>
                    貫穿全品牌的音波超級符號，鎖定音樂祭、活動標籤與關鍵識別錨點。
                  </p>
                </div>

                {/* 03 ACCENT */}
                <div className={`p-5 rounded-xl border space-y-3 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-[#E8829C]/15 text-[#E8829C] dark:text-[#F49BB2]">
                      03 / ACCENT
                    </span>
                    <span className="w-3.5 h-3.5 rounded-full bg-[#E8829C]"></span>
                  </div>
                  <div>
                    <h4 className={`text-sm font-bold font-mono ${themeClasses.bodyTitle}`}>
                      EAR PINK
                    </h4>
                    <p className={`text-xs font-bold text-[#E8829C] dark:text-[#F49BB2]`}>
                      建立角色情緒 (Emotional Accent)
                    </p>
                  </div>
                  <p className={`text-xs leading-relaxed ${themeClasses.bodySubText}`}>
                    點睛之筆，少量置於耳朵與肉球，在冷靜音樂調性中注入溫度與生動性格。
                  </p>
                </div>

                {/* 04 STRUCTURE */}
                <div className={`p-5 rounded-xl border space-y-3 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-zinc-900 text-white">
                      04 / STRUCTURE
                    </span>
                    <span className="w-3.5 h-3.5 rounded-full bg-[#1E242B] border border-zinc-700"></span>
                  </div>
                  <div>
                    <h4 className={`text-sm font-bold font-mono ${themeClasses.bodyTitle}`}>
                      CHARCOAL BLACK
                    </h4>
                    <p className={`text-xs font-bold text-zinc-500 dark:text-zinc-400`}>
                      建立資訊骨架 (Structural Line)
                    </p>
                  </div>
                  <p className={`text-xs leading-relaxed ${themeClasses.bodySubText}`}>
                    手繪輪廓線條、排版文字與網格邊框，支撐起整套識別系統的骨骼與可讀性。
                  </p>
                </div>
              </div>
            </div>

            {/* 4. COLOR AS CHARACTER & RELATIONSHIP (色彩即角色語彙) */}
            <div className={`p-6 sm:p-8 rounded-2xl border space-y-8 ${themeClasses.cardBg} ${themeClasses.borderBlueAccent}`}>
              <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b pb-4 gap-2 border-black/5 dark:border-white/5">
                <div>
                  <span className={`text-xs font-mono font-bold uppercase tracking-widest block ${isDark ? "text-[#6CA4C8]" : "text-[#437596]"}`}>
                    DNA ALIGNMENT
                  </span>
                  <h3 className={`text-2xl font-black font-mono tracking-tight ${themeClasses.bodyTitle}`}>
                    COLOR FOLLOWS CHARACTER.
                  </h3>
                  <p className={`text-xs font-mono mt-1 ${isDark ? "text-[#6CA4C8]" : "text-[#437596]"}`}>
                    「色彩從角色而來。」色彩就是角色語言的一部分。
                  </p>
                </div>
                <span className={`text-xs font-mono ${themeClasses.bodySubText}`}>
                  COLOR = CHARACTER LANGUAGE
                </span>
              </div>

              {/* 4 Statements Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* WHITE */}
                <div className={`p-5 rounded-xl border flex flex-col justify-between space-y-3 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-white text-zinc-900 border border-zinc-300">
                      WHITE
                    </span>
                    <h4 className={`text-base font-black font-mono mt-2 ${themeClasses.bodyTitle}`}>
                      MUM'S BODY
                    </h4>
                    <p className={`text-xs font-bold text-zinc-500 dark:text-zinc-400`}>
                      角色本體與空間留白
                    </p>
                  </div>
                  <p className={`text-xs leading-relaxed ${themeClasses.bodySubText}`}>
                    白色是 MUM 的軀體與呼吸空間，定義純粹、真實與不加修飾的原生質地。
                  </p>
                </div>

                {/* BLUE */}
                <div className={`p-5 rounded-xl border flex flex-col justify-between space-y-3 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#437596] text-white">
                      BLUE
                    </span>
                    <h4 className={`text-base font-black font-mono mt-2 ${themeClasses.bodyTitle}`}>
                      MUM'S SOUND
                    </h4>
                    <p className={`text-xs font-bold text-[#437596] dark:text-[#6CA4C8]`}>
                      音樂鬍鬚與聽團聲波
                    </p>
                  </div>
                  <p className={`text-xs leading-relaxed ${themeClasses.bodySubText}`}>
                    湛藍是音浪與震動頻率，把角色的貓鬚直接轉化為音樂祭現場的能量天線。
                  </p>
                </div>

                {/* PINK */}
                <div className={`p-5 rounded-xl border flex flex-col justify-between space-y-3 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#E8829C] text-white">
                      PINK
                    </span>
                    <h4 className={`text-base font-black font-mono mt-2 ${themeClasses.bodyTitle}`}>
                      MUM'S EMOTION
                    </h4>
                    <p className={`text-xs font-bold text-[#E8829C] dark:text-[#F49BB2]`}>
                      耳朵肉球與情緒溫度
                    </p>
                  </div>
                  <p className={`text-xs leading-relaxed ${themeClasses.bodySubText}`}>
                    粉紅是角色的感受器官與害羞訊號，帶來觸感溫度與親和感。
                  </p>
                </div>

                {/* BLACK */}
                <div className={`p-5 rounded-xl border flex flex-col justify-between space-y-3 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#1E242B] text-white">
                      BLACK
                    </span>
                    <h4 className={`text-base font-black font-mono mt-2 ${themeClasses.bodyTitle}`}>
                      MUM'S LINE
                    </h4>
                    <p className={`text-xs font-bold text-zinc-500 dark:text-zinc-400`}>
                      手繪線條與結構輪廓
                    </p>
                  </div>
                  <p className={`text-xs leading-relaxed ${themeClasses.bodySubText}`}>
                    炭黑是手繪筆觸的靈魂，確立角色輪廓、版面線稿與文字骨架。
                  </p>
                </div>
              </div>

              {/* Color Relationship Minimal Grid */}
              <div className={`p-5 rounded-xl border ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                <span className={`text-[10px] font-mono font-bold uppercase tracking-widest block mb-4 ${themeClasses.bodySubText}`}>
                  COLOR RELATIONSHIP MAPPING
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center font-mono">
                  <div className="space-y-1.5">
                    <span className="text-xs font-bold block text-zinc-800 dark:text-zinc-200">MUM WHITE</span>
                    <span className="text-xs text-zinc-400 block">↓</span>
                    <span className="text-xs font-semibold px-2 py-1 rounded bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 block">
                      Base / Space
                    </span>
                  </div>
                  <div className="space-y-1.5">
                    <span className="text-xs font-bold block text-[#437596] dark:text-[#6CA4C8]">WAVE BLUE</span>
                    <span className="text-xs text-zinc-400 block">↓</span>
                    <span className="text-xs font-semibold px-2 py-1 rounded bg-[#437596]/10 text-[#437596] dark:text-[#6CA4C8] border border-[#437596]/20 block">
                      Music / Identity
                    </span>
                  </div>
                  <div className="space-y-1.5">
                    <span className="text-xs font-bold block text-[#E8829C] dark:text-[#F49BB2]">EAR PINK</span>
                    <span className="text-xs text-zinc-400 block">↓</span>
                    <span className="text-xs font-semibold px-2 py-1 rounded bg-[#E8829C]/10 text-[#E8829C] dark:text-[#F49BB2] border border-[#E8829C]/20 block">
                      Emotion / Accent
                    </span>
                  </div>
                  <div className="space-y-1.5">
                    <span className="text-xs font-bold block text-zinc-700 dark:text-zinc-300">CHARCOAL BLACK</span>
                    <span className="text-xs text-zinc-400 block">↓</span>
                    <span className="text-xs font-semibold px-2 py-1 rounded bg-zinc-900 text-white block">
                      Structure / Line
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 5. PRODUCTION & MATERIAL APPLICATION (印刷與媒材應用原則) */}
            <div className={`p-6 sm:p-8 rounded-2xl border space-y-6 ${themeClasses.cardSubtleBg} ${themeClasses.borderBlueAccent}`}>
              <div className={`flex flex-col sm:flex-row sm:items-end justify-between border-b pb-4 gap-2 ${themeClasses.borderColSubtle}`}>
                <div>
                  <span className={`text-xs font-mono font-bold uppercase tracking-widest block ${isDark ? "text-[#6CA4C8]" : "text-[#437596]"}`}>
                    MATERIAL & CRAFT SPECIFICATION
                  </span>
                  <h3 className={`text-xl font-bold font-mono mt-0.5 ${themeClasses.bodyTitle}`}>
                    PRODUCTION & MATERIAL APPLICATION / 印刷與媒材應用
                  </h3>
                </div>
                <span className={`text-xs font-mono ${themeClasses.bodySubText}`}>
                  CMYK & SPECIAL INK GUIDE / 媒材應用建議
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {colorCraftSpecs.map((craft, idx) => (
                  <div 
                    key={idx} 
                    className={`p-5 rounded-xl border space-y-3 transition-all ${themeClasses.cardBg} ${themeClasses.borderColSubtle} hover:border-[#437596] dark:hover:border-[#6CA4C8]`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full border border-black/20" style={{ backgroundColor: craft.hex }}></span>
                        <span className={`text-xs font-mono font-bold ${isDark ? "text-[#6CA4C8]" : "text-[#437596]"}`}>
                          {craft.color}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                        {craft.note}
                      </span>
                    </div>

                    <div>
                      <h4 className={`text-xs font-bold ${themeClasses.bodyTitle}`}>
                        {craft.medium}
                      </h4>
                      <p className={`text-[11px] font-mono mt-0.5 ${themeClasses.bodySubText}`}>
                        {craft.craft}
                      </p>
                    </div>

                    <p className={`text-xs leading-relaxed ${themeClasses.bodyText}`}>
                      {craft.principle}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* 6. COLOR USAGE: DO & DON'T RULES */}
            <div className={`p-6 sm:p-8 rounded-2xl border space-y-6 ${themeClasses.cardBg} ${themeClasses.borderColSubtle}`}>
              <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b pb-4 gap-2 border-black/5 dark:border-white/5">
                <div>
                  <span className={`text-xs font-mono font-bold uppercase tracking-widest block ${isDark ? "text-[#6CA4C8]" : "text-[#437596]"}`}>
                    GUIDELINE RESTRICTIONS
                  </span>
                  <h3 className={`text-xl font-bold font-mono mt-0.5 ${themeClasses.bodyTitle}`}>
                    COLOR USAGE / 色彩使用原則與禁則
                  </h3>
                </div>
                <span className={`text-xs font-mono ${themeClasses.bodySubText}`}>
                  DO / DON'T COMPLIANCE MATRIX
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* DO */}
                <div className={`p-5 rounded-xl border space-y-3.5 bg-emerald-50/40 dark:bg-emerald-950/10 border-emerald-500/20`}>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-emerald-600 text-white">
                      DO / 建議規範
                    </span>
                    <span className="text-xs font-mono text-emerald-700 dark:text-emerald-400 font-semibold">
                      正確使用原則
                    </span>
                  </div>

                  <ul className="space-y-2.5 text-xs font-mono">
                    <li className="flex items-start gap-2 text-zinc-700 dark:text-zinc-300">
                      <span className="text-emerald-600 font-bold shrink-0 mt-0.5">✓</span>
                      <span><strong>White 保持大面積留白</strong>：作為版面呼吸基礎與角色底襯。</span>
                    </li>
                    <li className="flex items-start gap-2 text-zinc-700 dark:text-zinc-300">
                      <span className="text-emerald-600 font-bold shrink-0 mt-0.5">✓</span>
                      <span><strong>Blue 作為主要品牌 Accent</strong>：用於音波鬍鬚、標籤與焦點文字。</span>
                    </li>
                    <li className="flex items-start gap-2 text-zinc-700 dark:text-zinc-300">
                      <span className="text-emerald-600 font-bold shrink-0 mt-0.5">✓</span>
                      <span><strong>Pink 少量使用</strong>：僅作為耳朵、肉球與微細節情緒 Highlight。</span>
                    </li>
                    <li className="flex items-start gap-2 text-zinc-700 dark:text-zinc-300">
                      <span className="text-emerald-600 font-bold shrink-0 mt-0.5">✓</span>
                      <span><strong>Black 維持線稿與資訊結構</strong>：確保文字清晰度與手繪直接感。</span>
                    </li>
                  </ul>
                </div>

                {/* DON'T */}
                <div className={`p-5 rounded-xl border space-y-3.5 bg-rose-50/40 dark:bg-rose-950/10 border-rose-500/20`}>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-rose-600 text-white">
                      DON'T / 嚴格禁則
                    </span>
                    <span className="text-xs font-mono text-rose-700 dark:text-rose-400 font-semibold">
                      禁止之色彩操作
                    </span>
                  </div>

                  <ul className="space-y-2.5 text-xs font-mono">
                    <li className="flex items-start gap-2 text-zinc-700 dark:text-zinc-300">
                      <span className="text-rose-600 font-bold shrink-0 mt-0.5">✕</span>
                      <span><strong>不要讓 Pink 成為主背景</strong>：粉紅過量會破壞次文化與音樂冷冽感。</span>
                    </li>
                    <li className="flex items-start gap-2 text-zinc-700 dark:text-zinc-300">
                      <span className="text-rose-600 font-bold shrink-0 mt-0.5">✕</span>
                      <span><strong>不要大量使用 Blue 作整頁背景</strong>：湛藍應保持為 Accent 焦點。</span>
                    </li>
                    <li className="flex items-start gap-2 text-zinc-700 dark:text-zinc-300">
                      <span className="text-rose-600 font-bold shrink-0 mt-0.5">✕</span>
                      <span><strong>不要加入新的品牌色</strong>（如黃、綠、橘、紫）：嚴守四色核心 DNA。</span>
                    </li>
                    <li className="flex items-start gap-2 text-zinc-700 dark:text-zinc-300">
                      <span className="text-rose-600 font-bold shrink-0 mt-0.5">✕</span>
                      <span><strong>不要使用多色漸層</strong>：保持色塊純粹與手繪平塗質感。</span>
                    </li>
                    <li className="flex items-start gap-2 text-zinc-700 dark:text-zinc-300">
                      <span className="text-rose-600 font-bold shrink-0 mt-0.5">✕</span>
                      <span><strong>不要改變角色核心色彩比例</strong>：嚴格遵守 70 / 20 / 10 與結構線。</span>
                    </li>
                  </ul>
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


          {/* ===== 6. 03 / BRAND LANGUAGE (姆貓教語言系統) ===== */}
          <section id="language-section" className="pt-6 space-y-12 text-left">
            <SoundwaveDivider isDark={isDark} color={isDark ? "#6CA4C8" : "#437596"} className="mb-8" />
            
            {/* Section Header */}
            <div className={`flex flex-col sm:flex-row sm:items-end justify-between border-b pb-4 gap-4 ${themeClasses.borderCol}`}>
              <div>
                <div className="flex items-center gap-2">
                  <Sparkles className={`h-4 w-4 ${isDark ? "text-[#6CA4C8]" : "text-[#437596]"}`} />
                  <span className={`text-xs font-mono font-bold uppercase tracking-widest block ${isDark ? "text-[#6CA4C8]" : "text-[#437596]"}`}>
                    03 / BRAND LANGUAGE ‧ VERBAL IDENTITY SYSTEM
                  </span>
                </div>
                <h2 className={`text-3xl font-bold font-mono mt-1 tracking-tight ${themeClasses.bodyTitle}`}>
                  姆貓教語言系統
                </h2>
              </div>
              <div className="max-w-md">
                <p className={`text-xs leading-relaxed font-mono ${themeClasses.bodySubText}`}>
                  將「姆貓教」從單一角色名稱，轉化為一套文化語境與情緒語言，讓 MUMㄠ 在社群、音樂祭與商品溝通中保持一致。
                </p>
                <span className={`text-[10px] font-mono block mt-1 ${isDark ? "text-[#6CA4C8]" : "text-[#437596]"}`}>
                  From a character name to a recognizable verbal culture.
                </span>
              </div>
            </div>

            {/* 1. CORE STATEMENT ANCHOR */}
            <div className={`p-6 sm:p-8 rounded-2xl border ${themeClasses.cardBg} ${themeClasses.borderBlueAccent} flex flex-col md:flex-row md:items-center justify-between gap-6`}>
              <div className="space-y-2 max-w-2xl">
                <span className={`text-xs font-mono font-bold uppercase tracking-widest block ${isDark ? "text-[#6CA4C8]" : "text-[#437596]"}`}>
                  CORE STATEMENT
                </span>
                <h3 className={`text-2xl sm:text-3xl font-black font-mono tracking-tight leading-snug ${themeClasses.bodyTitle}`}>
                  「姆貓教不是一套口號，<br className="hidden sm:inline" />而是一種聽團生活的說話方式。」
                </h3>
              </div>
              <div className={`p-4 rounded-xl border text-right font-mono text-xs space-y-1 shrink-0 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                <span className={`block uppercase font-bold text-[10px] ${themeClasses.bodySubText}`}>KEY VERBAL IDENTITY</span>
                <span className={`text-sm font-bold block ${isDark ? "text-[#6CA4C8]" : "text-[#437596]"}`}>
                  MUM SPEAKS IN MUSIC.<br />MUM SPEAKS IN LIFE.
                </span>
              </div>
            </div>

            {/* 2. MUM LANGUAGE PRINCIPLES (5 Language Principles Specimens) */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b pb-2 gap-2 border-black/5 dark:border-white/5">
                <div>
                  <span className={`text-xs font-mono font-bold uppercase tracking-widest block ${isDark ? "text-[#6CA4C8]" : "text-[#437596]"}`}>
                    MUM LANGUAGE PRINCIPLES
                  </span>
                  <h3 className={`text-lg font-bold font-mono ${themeClasses.bodyTitle}`}>
                    姆貓教五大核心語言守則
                  </h3>
                </div>
                <span className={`text-[11px] font-mono ${themeClasses.bodySubText}`}>
                  BRAND VERBAL SPECIMENS
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {brandDecrees.map((dec, idx) => {
                  const isCoreMotto = dec.principle === "CORE MOTTO";
                  return (
                    <div
                      key={idx}
                      className={`p-5 rounded-2xl border flex flex-col justify-between space-y-4 transition-all ${
                        isCoreMotto
                          ? `${themeClasses.cardBg} border-[#E8829C] dark:border-[#F49BB2] shadow-sm`
                          : `${themeClasses.cardBg} ${themeClasses.borderColSubtle} hover:border-[#437596] dark:hover:border-[#6CA4C8]`
                      }`}
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between border-b pb-2 border-black/5 dark:border-white/5">
                          <span className={`text-xs font-mono font-bold ${isDark ? "text-[#6CA4C8]" : "text-[#437596]"}`}>
                            {dec.num}
                          </span>
                          <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                            isCoreMotto 
                              ? "bg-[#E8829C] text-white" 
                              : `${themeClasses.cardSubtleBg} ${themeClasses.bodySubText}`
                          }`}>
                            {dec.category}
                          </span>
                        </div>

                        <div>
                          <span className={`text-[10px] font-mono font-bold tracking-wider block ${
                            isCoreMotto ? "text-[#E8829C] dark:text-[#F49BB2]" : isDark ? "text-[#6CA4C8]" : "text-[#437596]"
                          }`}>
                            {dec.enTitle}
                          </span>
                          <h4 className={`text-base font-bold font-mono mt-0.5 leading-snug ${
                            isCoreMotto ? "text-[#E8829C] dark:text-[#F49BB2] font-black text-lg" : themeClasses.bodyTitle
                          }`}>
                            {dec.title}
                          </h4>
                        </div>

                        <p className={`text-xs leading-relaxed ${themeClasses.bodySubText}`}>
                          {dec.desc}
                        </p>
                      </div>

                      <div className={`pt-2.5 border-t flex items-center justify-between text-[10px] font-mono ${themeClasses.borderColSubtle}`}>
                        <span className="font-bold text-zinc-500 dark:text-zinc-400">{dec.tag}</span>
                        <span className={themeClasses.bodySubText}>{dec.principle}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Language System Mapping Hierarchy (ATTITUDE -> BELIEF) */}
              <div className={`p-4 rounded-xl border ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                <span className={`text-[10px] font-mono font-bold uppercase tracking-widest block mb-3 ${themeClasses.bodySubText}`}>
                  MUM LANGUAGE SYSTEM HIERARCHY
                </span>
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-zinc-800 dark:text-zinc-200">01. ATTITUDE</span>
                    <span className="text-zinc-400">→</span>
                    <span className={themeClasses.bodySubText}>演出不能遲到</span>
                  </div>
                  <span className="text-zinc-300 dark:text-zinc-700 hidden lg:inline">|</span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#437596] dark:text-[#6CA4C8]">02. EMOTION</span>
                    <span className="text-zinc-400">→</span>
                    <span className={themeClasses.bodySubText}>喜歡的團要用力喊</span>
                  </div>
                  <span className="text-zinc-300 dark:text-zinc-700 hidden lg:inline">|</span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-zinc-800 dark:text-zinc-200">03. CULTURE</span>
                    <span className="text-zinc-400">→</span>
                    <span className={themeClasses.bodySubText}>毛巾一定要帶</span>
                  </div>
                  <span className="text-zinc-300 dark:text-zinc-700 hidden lg:inline">|</span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-zinc-800 dark:text-zinc-200">04. EXPERIENCE</span>
                    <span className="text-zinc-400">→</span>
                    <span className={themeClasses.bodySubText}>泥巴踩下去就回不去了</span>
                  </div>
                  <span className="text-zinc-300 dark:text-zinc-700 hidden lg:inline">|</span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#E8829C] dark:text-[#F49BB2]">05. BELIEF</span>
                    <span className="text-zinc-400">→</span>
                    <span className="font-bold text-[#E8829C] dark:text-[#F49BB2]">全是感情，還有音樂</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. MUM BRAND VOICE (4 Key Tone Pillars) */}
            <div className={`p-6 sm:p-8 rounded-2xl border space-y-6 ${themeClasses.cardBg} ${themeClasses.borderColSubtle}`}>
              <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b pb-4 gap-2 border-black/5 dark:border-white/5">
                <div>
                  <span className={`text-xs font-mono font-bold uppercase tracking-widest block ${isDark ? "text-[#6CA4C8]" : "text-[#437596]"}`}>
                    TONE OF VOICE
                  </span>
                  <h3 className={`text-xl font-bold font-mono mt-0.5 ${themeClasses.bodyTitle}`}>
                    MUM BRAND VOICE / 品牌語氣四大柱石
                  </h3>
                </div>
                <span className={`text-xs font-mono ${themeClasses.bodySubText}`}>
                  DIRECT ‧ WARM ‧ PLAYFUL ‧ PASSIONATE
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* 01 DIRECT */}
                <div className={`p-5 rounded-xl border space-y-2 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-zinc-800 text-white">
                    01 / DIRECT
                  </span>
                  <h4 className={`text-base font-bold font-mono ${themeClasses.bodyTitle}`}>
                    直接
                  </h4>
                  <p className={`text-xs leading-relaxed ${themeClasses.bodySubText}`}>
                    不繞圈子，想到就說。直截了當地表達對現場與樂團的喜愛。
                  </p>
                </div>

                {/* 02 WARM */}
                <div className={`p-5 rounded-xl border space-y-2 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#E8829C]/20 text-[#E8829C] dark:text-[#F49BB2]">
                    02 / WARM
                  </span>
                  <h4 className={`text-base font-bold font-mono ${themeClasses.bodyTitle}`}>
                    有溫度
                  </h4>
                  <p className={`text-xs leading-relaxed ${themeClasses.bodySubText}`}>
                    像朋友一樣講話。沒有距離感，懂聽團仔的累與爽。
                  </p>
                </div>

                {/* 03 PLAYFUL */}
                <div className={`p-5 rounded-xl border space-y-2 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#437596]/20 text-[#437596] dark:text-[#6CA4C8]">
                    03 / PLAYFUL
                  </span>
                  <h4 className={`text-base font-bold font-mono ${themeClasses.bodyTitle}`}>
                    有點鬧
                  </h4>
                  <p className={`text-xs leading-relaxed ${themeClasses.bodySubText}`}>
                    可以開玩笑，但絕不刻意裝可愛或做作。自帶迷因感。
                  </p>
                </div>

                {/* 04 PASSIONATE */}
                <div className={`p-5 rounded-xl border space-y-2 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-600 dark:text-amber-400">
                    04 / PASSIONATE
                  </span>
                  <h4 className={`text-base font-bold font-mono ${themeClasses.bodyTitle}`}>
                    有熱情
                  </h4>
                  <p className={`text-xs leading-relaxed ${themeClasses.bodySubText}`}>
                    遇到喜歡的音樂就大聲說出來，把能量渲染給每一個人。
                  </p>
                </div>
              </div>
            </div>

            {/* 4. DO vs. DON'T VOICE EXAMPLES */}
            <div className={`p-6 sm:p-8 rounded-2xl border space-y-6 ${themeClasses.cardBg} ${themeClasses.borderColSubtle}`}>
              <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b pb-4 gap-2 border-black/5 dark:border-white/5">
                <div>
                  <span className={`text-xs font-mono font-bold uppercase tracking-widest block ${isDark ? "text-[#6CA4C8]" : "text-[#437596]"}`}>
                    VOICE COMPARISON
                  </span>
                  <h3 className={`text-xl font-bold font-mono mt-0.5 ${themeClasses.bodyTitle}`}>
                    DO vs. DON'T / MUM 語氣對比實例
                  </h3>
                </div>
                <span className={`text-xs font-mono ${themeClasses.bodySubText}`}>
                  HOW MUM SOUNDS LIKE
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* DO */}
                <div className="p-5 rounded-xl border space-y-4 bg-emerald-50/40 dark:bg-emerald-950/10 border-emerald-500/20">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-emerald-600 text-white">
                      DO / MUM SHOULD SOUND LIKE...
                    </span>
                    <span className="text-xs font-mono text-emerald-700 dark:text-emerald-400 font-semibold">
                      正確語氣實例
                    </span>
                  </div>

                  <ul className="space-y-3 text-xs font-mono">
                    <li className="p-2.5 rounded-lg bg-white dark:bg-zinc-900 border border-emerald-500/20 text-zinc-800 dark:text-zinc-200 flex items-center justify-between">
                      <span>「今晚哪團？」</span>
                      <span className="text-[10px] text-emerald-600 font-bold">聽團日常</span>
                    </li>
                    <li className="p-2.5 rounded-lg bg-white dark:bg-zinc-900 border border-emerald-500/20 text-zinc-800 dark:text-zinc-200 flex items-center justify-between">
                      <span>「毛巾帶了沒？」</span>
                      <span className="text-[10px] text-emerald-600 font-bold">現場提醒</span>
                    </li>
                    <li className="p-2.5 rounded-lg bg-white dark:bg-zinc-900 border border-emerald-500/20 text-zinc-800 dark:text-zinc-200 flex items-center justify-between">
                      <span>「這團不喊不行。」</span>
                      <span className="text-[10px] text-emerald-600 font-bold">直率挺團</span>
                    </li>
                    <li className="p-2.5 rounded-lg bg-white dark:bg-zinc-900 border border-emerald-500/20 text-zinc-800 dark:text-zinc-200 flex items-center justify-between">
                      <span>「泥巴都踩下去了，還回家？」</span>
                      <span className="text-[10px] text-emerald-600 font-bold">音樂祭態度</span>
                    </li>
                    <li className="p-2.5 rounded-lg bg-white dark:bg-zinc-900 border border-emerald-500/20 text-zinc-800 dark:text-zinc-200 flex items-center justify-between">
                      <span className="font-bold text-[#E8829C] dark:text-[#F49BB2]">「全是感情，還有音樂。」</span>
                      <span className="text-[10px] text-[#E8829C] font-bold">核心信念</span>
                    </li>
                  </ul>
                </div>

                {/* DON'T */}
                <div className="p-5 rounded-xl border space-y-4 bg-rose-50/40 dark:bg-rose-950/10 border-rose-500/20">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-rose-600 text-white">
                      DON'T / MUM DOESN'T SOUND LIKE...
                    </span>
                    <span className="text-xs font-mono text-rose-700 dark:text-rose-400 font-semibold">
                      避開語氣禁則
                    </span>
                  </div>

                  <ul className="space-y-3 text-xs font-mono">
                    <li className="p-2.5 rounded-lg bg-white dark:bg-zinc-900 border border-rose-500/20 text-zinc-700 dark:text-zinc-300 flex items-center justify-between">
                      <span className="line-through text-zinc-400">「本活動誠摯邀請您蒞臨參與。」</span>
                      <span className="text-[10px] text-rose-600 font-bold">過度官方</span>
                    </li>
                    <li className="p-2.5 rounded-lg bg-white dark:bg-zinc-900 border border-rose-500/20 text-zinc-700 dark:text-zinc-300 flex items-center justify-between">
                      <span className="line-through text-zinc-400">「在聲音的宇宙裡尋找靈魂共鳴。」</span>
                      <span className="text-[10px] text-rose-600 font-bold">過度文青</span>
                    </li>
                    <li className="p-2.5 rounded-lg bg-white dark:bg-zinc-900 border border-rose-500/20 text-zinc-700 dark:text-zinc-300 flex items-center justify-between">
                      <span className="line-through text-zinc-400">「大家一起喵喵喵～♡」</span>
                      <span className="text-[10px] text-rose-600 font-bold">過度可愛</span>
                    </li>
                    <li className="p-2.5 rounded-lg bg-white dark:bg-zinc-900 border border-rose-500/20 text-zinc-700 dark:text-zinc-300 flex items-center justify-between">
                      <span className="line-through text-zinc-400">「現在就加入姆貓教，享受新體驗！」</span>
                      <span className="text-[10px] text-rose-600 font-bold">過度廣告</span>
                    </li>
                    <li className="p-2.5 rounded-lg bg-white dark:bg-zinc-900 border border-rose-500/20 text-zinc-700 dark:text-zinc-300 flex items-center justify-between">
                      <span className="line-through text-zinc-400">「尊榮貴賓專屬音樂享受提案。」</span>
                      <span className="text-[10px] text-rose-600 font-bold">商業行銷</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 5. TAIWANESE LANGUAGE DNA & VERBAL MARK "ㄠ" */}
            <div className={`p-6 sm:p-8 rounded-2xl border space-y-6 ${themeClasses.cardSubtleBg} ${themeClasses.borderBlueAccent}`}>
              <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b pb-4 gap-2 border-black/5 dark:border-white/5">
                <div>
                  <span className={`text-xs font-mono font-bold uppercase tracking-widest block ${isDark ? "text-[#6CA4C8]" : "text-[#437596]"}`}>
                    CULTURAL ANCHOR
                  </span>
                  <h3 className={`text-xl font-bold font-mono mt-0.5 ${themeClasses.bodyTitle}`}>
                    TAIWANESE LANGUAGE DNA / 台灣在地化語意深耕
                  </h3>
                </div>
                <span className={`text-xs font-mono ${themeClasses.bodySubText}`}>
                  VERBAL MARK: 「ㄠ」
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-3">
                  <p className={`text-xs leading-relaxed ${themeClasses.bodyText}`}>
                    MUMㄠ 的語言不刻意模仿台灣文化，而是直接使用台灣人真實的日常語氣。融入注音符號、聽團圈用語、音樂祭現場話術與社群迷因語感，建立具有高在地共鳴度的次文化對話。
                  </p>
                  <div className="flex flex-wrap gap-2 pt-2">
                    <span className="text-xs font-mono font-bold px-2.5 py-1 rounded border border-[#437596]/30 bg-[#437596]/10 text-[#437596] dark:text-[#6CA4C8]">
                      注音符號語感
                    </span>
                    <span className="text-xs font-mono font-bold px-2.5 py-1 rounded border border-[#437596]/30 bg-[#437596]/10 text-[#437596] dark:text-[#6CA4C8]">
                      聽團仔圈內用語
                    </span>
                    <span className="text-xs font-mono font-bold px-2.5 py-1 rounded border border-[#437596]/30 bg-[#437596]/10 text-[#437596] dark:text-[#6CA4C8]">
                      音樂祭現場梗
                    </span>
                    <span className="text-xs font-mono font-bold px-2.5 py-1 rounded border border-[#437596]/30 bg-[#437596]/10 text-[#437596] dark:text-[#6CA4C8]">
                      台灣日常真實口語
                    </span>
                  </div>
                </div>

                {/* Verbal Mark Box for "ㄠ" */}
                <div className={`p-4 rounded-xl border space-y-2 flex flex-col justify-between ${themeClasses.cardBg} ${themeClasses.borderColSubtle}`}>
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-3xl font-black font-mono text-[#E8829C] dark:text-[#F49BB2]">ㄠ</span>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-black/10 dark:bg-white/10 text-zinc-800 dark:text-zinc-200">
                        VERBAL MARK
                      </span>
                    </div>
                    <h4 className={`text-xs font-bold font-mono mt-2 ${themeClasses.bodyTitle}`}>
                      TAIWANESE VERBAL MARK
                    </h4>
                  </div>
                  <p className={`text-[11px] leading-relaxed ${themeClasses.bodySubText}`}>
                    「ㄠ」本身就是 MUMㄠ 的獨特語言資產，代表台灣注音文化的韻腳聲音與視覺辨識。
                  </p>
                </div>
              </div>
            </div>

            {/* 6. MUM LANGUAGE FORMULA & NEXT NAVIGATION */}
            <div className={`p-6 rounded-2xl border space-y-4 ${themeClasses.cardBg} ${themeClasses.borderColSubtle}`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4 border-black/5 dark:border-white/5">
                <div>
                  <span className={`text-xs font-mono font-bold uppercase tracking-widest block ${isDark ? "text-[#6CA4C8]" : "text-[#437596]"}`}>
                    SUMMARY FORMULA
                  </span>
                  <h3 className={`text-lg font-bold font-mono ${themeClasses.bodyTitle}`}>
                    MUM LANGUAGE FORMULA / 姆貓教語言公式
                  </h3>
                </div>
                <span className={`text-xs font-mono font-bold px-3 py-1 rounded bg-[#437596]/10 text-[#437596] dark:text-[#6CA4C8]`}>
                  MUM VOICE
                </span>
              </div>

              <div className="p-4 rounded-xl border bg-zinc-900 text-white font-mono text-center sm:text-left flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="text-xs sm:text-sm font-bold flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <span className="text-zinc-300">TAIWANESE (台灣語感)</span>
                  <span className="text-[#6CA4C8]">+</span>
                  <span className="text-zinc-300">MUSIC (音樂文化)</span>
                  <span className="text-[#6CA4C8]">+</span>
                  <span className="text-zinc-300">EMOTION (真實情緒)</span>
                  <span className="text-[#6CA4C8]">+</span>
                  <span className="text-zinc-300">HUMOR (一點幽默)</span>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-base font-black text-[#F49BB2] block">= MUM VOICE</span>
                </div>
              </div>
            </div>

            {/* Next Section Navigation Button */}
            <div className={`pt-6 flex justify-end border-t ${themeClasses.borderColSubtle}`}>
              <button
                type="button"
                onClick={() => scrollToSection("festival-section")}
                className={`inline-flex items-center gap-4 px-6 py-3.5 rounded-xl border text-xs font-mono font-bold transition-all ${themeClasses.cardBg} ${themeClasses.borderColSubtle} hover:border-[#437596] hover:text-[#437596] dark:hover:border-[#6CA4C8] dark:hover:text-[#6CA4C8] group cursor-pointer`}
              >
                <div className="text-left">
                  <span className={`text-[10px] block font-mono uppercase tracking-widest ${themeClasses.bodySubText}`}>
                    NEXT SECTION
                  </span>
                  <span className="text-sm font-bold tracking-tight">
                    04 / CAMPAIGN & FESTIVAL →
                  </span>
                </div>
              </button>
            </div>
          </section>


          {/* ===== 7. 04 / CAMPAIGN & FESTIVAL (音樂祭情境與活動視覺) ===== */}
          <section id="festival-section" className="pt-6 space-y-12 text-left">
            <SoundwaveDivider isDark={isDark} color={isDark ? "#6CA4C8" : "#437596"} className="mb-8" />
            
            {/* Section Header */}
            <div className={`flex flex-col sm:flex-row sm:items-end justify-between border-b pb-4 gap-4 ${themeClasses.borderCol}`}>
              <div>
                <div className="flex items-center gap-2">
                  <Compass className={`h-4 w-4 ${isDark ? "text-[#6CA4C8]" : "text-[#437596]"}`} />
                  <span className={`text-xs font-mono font-bold uppercase tracking-widest block ${isDark ? "text-[#6CA4C8]" : "text-[#437596]"}`}>
                    04 / CAMPAIGN & FESTIVAL ‧ APPLICATION SYSTEM
                  </span>
                </div>
                <h2 className={`text-3xl font-bold font-mono mt-1 tracking-tight ${themeClasses.bodyTitle}`}>
                  音樂祭情境與活動視覺
                </h2>
              </div>

              <div className="max-w-md">
                <p className={`text-xs leading-relaxed font-mono ${themeClasses.bodySubText}`}>
                  MUMㄠ 透過音樂祭、藝術書展與現場文化，將角色從平面 IP 延伸至真實生活場景。
                </p>
                <span className={`text-[10px] font-mono block mt-1 ${isDark ? "text-[#6CA4C8]" : "text-[#437596]"}`}>
                  From character IP to real-world music culture.
                </span>
              </div>
            </div>

            {/* 1. LARGE ANCHOR STATEMENT */}
            <div className={`p-8 rounded-2xl border ${themeClasses.cardBg} ${themeClasses.borderBlueAccent} flex flex-col md:flex-row md:items-center justify-between gap-6`}>
              <div className="space-y-2 max-w-2xl">
                <span className={`text-xs font-mono font-bold uppercase tracking-widest block ${isDark ? "text-[#6CA4C8]" : "text-[#437596]"}`}>
                  CULTURAL POSITIONING
                </span>
                <h3 className={`text-3xl sm:text-4xl font-black font-mono tracking-tight leading-tight ${themeClasses.bodyTitle}`}>
                  FROM CHARACTER<br className="hidden sm:inline" /> TO CULTURE.
                </h3>
                <p className={`text-sm font-mono mt-1 ${themeClasses.bodySubText}`}>
                  MUMㄠ 不只是被畫出來的角色，而是走進音樂祭、書展與現場文化裡的角色。
                </p>
              </div>

              <div className={`p-4 rounded-xl border text-right font-mono text-xs space-y-1 shrink-0 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                <span className={`block uppercase font-bold text-[10px] ${themeClasses.bodySubText}`}>IP ARCHIVE TYPE</span>
                <span className={`text-sm font-bold block ${isDark ? "text-[#6CA4C8]" : "text-[#437596]"}`}>
                  FIELD APPLICATION<br />CULTURAL SCENARIO
                </span>
              </div>
            </div>

            {/* 2. CAMPAIGN CASE STUDY SPECIMENS (PRIMARY: Megaport / SECONDARY: Art Book & Mud) */}
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b pb-2 gap-2 border-black/5 dark:border-white/5">
                <div>
                  <span className={`text-xs font-mono font-bold uppercase tracking-widest block ${isDark ? "text-[#6CA4C8]" : "text-[#437596]"}`}>
                    CAMPAIGN CASE STUDY
                  </span>
                  <h3 className={`text-lg font-bold font-mono ${themeClasses.bodyTitle}`}>
                    三大核心文化活動案例
                  </h3>
                </div>
                <span className={`text-[11px] font-mono ${themeClasses.bodySubText}`}>
                  INDEPENDENT IP ARCHIVE
                </span>
              </div>

              {/* Case Study Grid: Primary Case (Wide) + 2 Secondary Cases */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {festivalCampaigns.map((fest) => {
                  if (fest.isPrimary) {
                    {/* PRIMARY CASE STUDY: MEGAPORT FESTIVAL */}
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
                              className="w-full h-full object-cover pointer-events-none"
                            />
                            <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                              <span className="px-2.5 py-1 rounded bg-zinc-900 text-white font-mono text-[10px] font-bold">
                                PRIMARY CASE / {fest.num}
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

                              <div className="space-y-2 pt-1 font-mono text-xs">
                                <div className={`p-3 rounded-lg border space-y-1 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                                  <span className={`text-[10px] font-bold uppercase block text-[#437596] dark:text-[#6CA4C8]`}>
                                    03 / MUM ROLE
                                  </span>
                                  <p className={`font-bold ${themeClasses.bodyTitle}`}>{fest.role}</p>
                                  <p className={`text-[11px] ${themeClasses.bodySubText}`}>{fest.culturalRole}</p>
                                </div>

                                <div className="space-y-1.5 pt-1">
                                  <span className={`text-[10px] font-bold uppercase block ${themeClasses.bodySubText}`}>
                                    02 / CONTEXT
                                  </span>
                                  <p className={`leading-relaxed ${themeClasses.bodyText}`}>{fest.context}</p>
                                </div>

                                <div className="space-y-1.5 pt-1">
                                  <span className={`text-[10px] font-bold uppercase block ${themeClasses.bodySubText}`}>
                                    04 / CULTURAL CONNECTION
                                  </span>
                                  <p className={`leading-relaxed ${themeClasses.bodySubText}`}>{fest.culturalConnection}</p>
                                </div>
                              </div>
                            </div>

                            <div className={`pt-3 border-t flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] font-mono ${themeClasses.borderColSubtle}`}>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-[#437596] dark:text-[#6CA4C8]">05 / VISUAL OUTPUT:</span>
                                <span className={themeClasses.bodySubText}>{fest.visualOutput}</span>
                              </div>
                              <span className="text-[10px] text-zinc-400">PRIMARY FEATURED CASE</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  }

                  {/* SECONDARY CASES: TAIPEI ART BOOK FAIR & ROUGH MUD FESTIVAL */}
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
                            className="w-full h-full object-cover pointer-events-none"
                          />
                          <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                            <span className="px-2 py-0.5 rounded bg-zinc-900 text-white font-mono text-[10px] font-bold">
                              {fest.num}
                            </span>
                            <span className="px-2 py-0.5 rounded bg-zinc-800/80 text-white font-mono text-[10px] font-bold">
                              {fest.category}
                            </span>
                          </div>
                        </div>

                        <div className="space-y-2">
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

                          <div className={`p-2.5 rounded-lg border font-mono text-xs space-y-0.5 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                            <span className="text-[10px] font-bold uppercase text-[#437596] dark:text-[#6CA4C8]">MUM ROLE</span>
                            <p className={`font-bold ${themeClasses.bodyTitle}`}>{fest.role}</p>
                          </div>

                          <p className={`text-xs leading-relaxed pt-1 ${themeClasses.bodySubText}`}>
                            {fest.context}
                          </p>

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

            {/* 3. MUM CULTURAL FIELD & IP ROLE ACROSS CULTURES */}
            <div className={`p-6 sm:p-8 rounded-2xl border space-y-6 ${themeClasses.cardBg} ${themeClasses.borderColSubtle}`}>
              <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b pb-4 gap-2 border-black/5 dark:border-white/5">
                <div>
                  <span className={`text-xs font-mono font-bold uppercase tracking-widest block ${isDark ? "text-[#6CA4C8]" : "text-[#437596]"}`}>
                    MUM CULTURAL FIELD
                  </span>
                  <h3 className={`text-xl font-bold font-mono mt-0.5 ${themeClasses.bodyTitle}`}>
                    IP ROLE ACROSS CULTURES / 三大文化場域與角色定位
                  </h3>
                </div>
                <span className={`text-xs font-mono ${themeClasses.bodySubText}`}>
                  MUSIC ‧ ART ‧ FIELD
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* 01 MUSIC */}
                <div className={`p-5 rounded-xl border space-y-3 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-[#437596] text-white">
                      01 / MUSIC
                    </span>
                    <span className="text-[10px] font-mono font-bold text-[#437596] dark:text-[#6CA4C8]">MEGAPORT</span>
                  </div>
                  <div>
                    <h4 className={`text-base font-bold font-mono ${themeClasses.bodyTitle}`}>
                      音樂祭場域 (MUSIC FESTIVAL)
                    </h4>
                    <p className={`text-xs font-bold text-[#437596] dark:text-[#6CA4C8] mt-0.5`}>
                      ROLE: Audience Companion
                    </p>
                  </div>
                  <p className={`text-xs leading-relaxed ${themeClasses.bodySubText}`}>
                    陪伴聽團仔進入現場。不是居高臨下的吉祥物，而是和所有人一起站在台上台下同頻共振的夥伴。
                  </p>
                </div>

                {/* 02 ART */}
                <div className={`p-5 rounded-xl border space-y-3 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-zinc-800 text-white">
                      02 / ART
                    </span>
                    <span className="text-[10px] font-mono font-bold text-zinc-500">TAIPEI ART BOOK FAIR</span>
                  </div>
                  <div>
                    <h4 className={`text-base font-bold font-mono ${themeClasses.bodyTitle}`}>
                      藝術／出版 (ART & ZINE)
                    </h4>
                    <p className={`text-xs font-bold text-zinc-500 dark:text-zinc-400 mt-0.5`}>
                      ROLE: Independent Culture Character
                    </p>
                  </div>
                  <p className={`text-xs leading-relaxed ${themeClasses.bodySubText}`}>
                    成為創作者與出版文化的一部分。透過紙本繪本、手繪稿與周邊，建立富有手感溫度的角色深度。
                  </p>
                </div>

                {/* 03 FIELD */}
                <div className={`p-5 rounded-xl border space-y-3 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-amber-600 text-white">
                      03 / FIELD
                    </span>
                    <span className="text-[10px] font-mono font-bold text-amber-600 dark:text-amber-400">ROUGH MUD FESTIVAL</span>
                  </div>
                  <div>
                    <h4 className={`text-base font-bold font-mono ${themeClasses.bodyTitle}`}>
                      戶外／現場 (FIELD FESTIVAL)
                    </h4>
                    <p className={`text-xs font-bold text-amber-600 dark:text-amber-400 mt-0.5`}>
                      ROLE: Festival Participant
                    </p>
                  </div>
                  <p className={`text-xs leading-relaxed ${themeClasses.bodySubText}`}>
                    和觀眾一起玩、一起髒、一起留下記憶。走入泥地與暴雨，真實紀錄聽團仔最真摯的狂歡瞬間。
                  </p>
                </div>
              </div>
            </div>

            {/* 4. FESTIVAL APPLICATION & CAMPAIGN LOGIC SYSTEM */}
            <div className={`p-6 sm:p-8 rounded-2xl border space-y-6 ${themeClasses.cardSubtleBg} ${themeClasses.borderBlueAccent}`}>
              <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b pb-4 gap-2 border-black/5 dark:border-white/5">
                <div>
                  <span className={`text-xs font-mono font-bold uppercase tracking-widest block ${isDark ? "text-[#6CA4C8]" : "text-[#437596]"}`}>
                    APPLICATION LOGIC
                  </span>
                  <h3 className={`text-xl font-bold font-mono mt-0.5 ${themeClasses.bodyTitle}`}>
                    FESTIVAL APPLICATION & CAMPAIGN SYSTEM / 活動延伸應用系統
                  </h3>
                </div>
                <span className={`text-xs font-mono ${themeClasses.bodySubText}`}>
                  LIVE ‧ SOCIAL ‧ MERCH
                </span>
              </div>

              {/* 3 Touchpoints Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className={`p-4 rounded-xl border space-y-2 ${themeClasses.cardBg} ${themeClasses.borderColSubtle}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-[#437596] dark:text-[#6CA4C8]">01 / LIVE 現場應用</span>
                    <span className="text-[10px] font-mono text-zinc-400">ON-SITE</span>
                  </div>
                  <p className={`text-xs leading-relaxed ${themeClasses.bodySubText}`}>
                    舞台地標裝置、現場指示牌、巨型氣球、大港橋打卡點、雨衣與舞台邊緣裝飾。
                  </p>
                </div>

                <div className={`p-4 rounded-xl border space-y-2 ${themeClasses.cardBg} ${themeClasses.borderColSubtle}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-[#437596] dark:text-[#6CA4C8]">02 / SOCIAL 社群傳播</span>
                    <span className="text-[10px] font-mono text-zinc-400">DIGITAL</span>
                  </div>
                  <p className={`text-xs leading-relaxed ${themeClasses.bodySubText}`}>
                    音樂祭倒數圖卡、聽團迷因、IG 限動濾鏡貼紙、演出時間表導覽與現場即時限動。
                  </p>
                </div>

                <div className={`p-4 rounded-xl border space-y-2 ${themeClasses.cardBg} ${themeClasses.borderColSubtle}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-[#E8829C] dark:text-[#F49BB2]">03 / MERCH 周邊實體</span>
                    <span className="text-[10px] font-mono text-zinc-400">PRODUCT</span>
                  </div>
                  <p className={`text-xs leading-relaxed ${themeClasses.bodySubText}`}>
                    音樂祭波紋毛巾、防水戶外貼紙包、手繪卡片、聽團背帶與角色刺繡徽章。
                  </p>
                </div>
              </div>

              {/* Campaign Logic Flow Banner */}
              <div className="p-4 rounded-xl border bg-zinc-900 text-white font-mono">
                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 block mb-2">
                  CAMPAIGN LOGIC FLOW
                </span>
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-bold">
                  <span className="text-zinc-200">EVENT (活動)</span>
                  <span className="text-[#6CA4C8]">↓</span>
                  <span className="text-zinc-200">CHARACTER (角色)</span>
                  <span className="text-[#6CA4C8]">↓</span>
                  <span className="text-zinc-200">LANGUAGE (語言)</span>
                  <span className="text-[#6CA4C8]">↓</span>
                  <span className="text-zinc-200">VISUAL (視覺)</span>
                  <span className="text-[#6CA4C8]">↓</span>
                  <span className="text-[#F49BB2]">MERCH (周邊)</span>
                  <span className="text-[#6CA4C8]">↓</span>
                  <span className="text-zinc-100 font-black">MEMORY (現場記憶)</span>
                </div>
              </div>
            </div>

            {/* Next Section Navigation Button */}
            <div className={`pt-6 flex justify-end border-t ${themeClasses.borderColSubtle}`}>
              <button
                type="button"
                onClick={() => scrollToSection("visuals-section")}
                className={`inline-flex items-center gap-4 px-6 py-3.5 rounded-xl border text-xs font-mono font-bold transition-all ${themeClasses.cardBg} ${themeClasses.borderColSubtle} hover:border-[#437596] hover:text-[#437596] dark:hover:border-[#6CA4C8] dark:hover:text-[#6CA4C8] group cursor-pointer`}
              >
                <div className="text-left">
                  <span className={`text-[10px] block font-mono uppercase tracking-widest ${themeClasses.bodySubText}`}>
                    NEXT SECTION
                  </span>
                  <span className="text-sm font-bold tracking-tight">
                    05 / VISUAL SYSTEM →
                  </span>
                </div>
              </button>
            </div>
          </section>


          {/* ===== 8. 05 / VISUAL SYSTEM (MUMㄠ 視覺應用系統) ===== */}
          <section id="visuals-section" className="pt-6 space-y-12 text-left">
            <SoundwaveDivider isDark={isDark} color={isDark ? "#6CA4C8" : "#437596"} className="mb-8" />
            
            {/* Section Header */}
            <div className={`flex flex-col sm:flex-row sm:items-end justify-between border-b pb-4 gap-4 ${themeClasses.borderCol}`}>
              <div>
                <div className="flex items-center gap-2">
                  <LayoutGrid className={`h-4 w-4 ${isDark ? "text-[#6CA4C8]" : "text-[#437596]"}`} />
                  <span className={`text-xs font-mono font-bold uppercase tracking-widest block ${isDark ? "text-[#6CA4C8]" : "text-[#437596]"}`}>
                    05 / VISUAL SYSTEM ‧ VISUAL APPLICATION SYSTEM
                  </span>
                </div>
                <h2 className={`text-3xl font-bold font-mono mt-1 tracking-tight ${themeClasses.bodyTitle}`}>
                  MUMㄠ 視覺應用系統
                </h2>
              </div>

              <div className="max-w-md">
                <p className={`text-xs leading-relaxed font-mono ${themeClasses.bodySubText}`}>
                  將角色識別、音樂語彙與台灣在地符號，轉化為可延伸至社群、活動、出版與周邊的視覺系統。
                </p>
                <span className={`text-[10px] font-mono block mt-1 ${isDark ? "text-[#6CA4C8]" : "text-[#437596]"}`}>
                  A flexible visual system built from MUMㄠ's character, music identity and Taiwanese cultural language.
                </span>
              </div>
            </div>

            {/* 1. MUM VISUAL DNA (4 Core Elements) */}
            <div className={`p-6 sm:p-8 rounded-2xl border space-y-6 ${themeClasses.cardBg} ${themeClasses.borderBlueAccent}`}>
              <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b pb-4 gap-2 border-black/5 dark:border-white/5">
                <div>
                  <span className={`text-xs font-mono font-bold uppercase tracking-widest block ${isDark ? "text-[#6CA4C8]" : "text-[#437596]"}`}>
                    MUM VISUAL DNA
                  </span>
                  <h3 className={`text-xl font-bold font-mono mt-0.5 ${themeClasses.bodyTitle}`}>
                    四大視覺核心基因
                  </h3>
                </div>
                <span className={`text-xs font-mono ${themeClasses.bodySubText}`}>
                  FOUNDATION OF VISUAL SYSTEM
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* 01 CHARACTER */}
                <div className={`p-4 rounded-xl border space-y-2 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-zinc-800 text-white">
                    01 / CHARACTER
                  </span>
                  <h4 className={`text-sm font-bold font-mono ${themeClasses.bodyTitle}`}>
                    白貓角色
                  </h4>
                  <p className={`text-xs leading-relaxed ${themeClasses.bodySubText}`}>
                    標準角色比例與五大固定外型特徵，奠定無可替代的角色 IP 本體。
                  </p>
                </div>

                {/* 02 MUSIC */}
                <div className={`p-4 rounded-xl border space-y-2 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#437596] text-white">
                    02 / MUSIC
                  </span>
                  <h4 className={`text-sm font-bold font-mono ${themeClasses.bodyTitle}`}>
                    音波鬍鬚
                  </h4>
                  <p className={`text-xs leading-relaxed ${themeClasses.bodySubText}`}>
                    聲波脈衝與聽團節奏語彙，讓視覺自帶聲音感與音樂節奏。
                  </p>
                </div>

                {/* 03 TAIWAN */}
                <div className={`p-4 rounded-xl border space-y-2 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#E8829C] text-white">
                    03 / TAIWAN
                  </span>
                  <h4 className={`text-sm font-bold font-mono ${themeClasses.bodyTitle}`}>
                    注音「ㄠ」
                  </h4>
                  <p className={`text-xs leading-relaxed ${themeClasses.bodySubText}`}>
                    台灣在地語言文化符號，成為連結次文化與日常語境的視覺標籤。
                  </p>
                </div>

                {/* 04 FESTIVAL */}
                <div className={`p-4 rounded-xl border space-y-2 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-600 text-white">
                    04 / FESTIVAL
                  </span>
                  <h4 className={`text-sm font-bold font-mono ${themeClasses.bodyTitle}`}>
                    現場文化
                  </h4>
                  <p className={`text-xs leading-relaxed ${themeClasses.bodySubText}`}>
                    音樂祭場面、聽團道具與現場狂歡氛圍，注入真實活動生命力。
                  </p>
                </div>
              </div>

              {/* Formula Banner */}
              <div className="p-3.5 rounded-xl border bg-zinc-900 text-white font-mono text-center flex flex-wrap items-center justify-center gap-2 text-xs font-bold">
                <span className="text-zinc-300">CHARACTER</span>
                <span className="text-[#6CA4C8]">+</span>
                <span className="text-zinc-300">MUSIC</span>
                <span className="text-[#6CA4C8]">+</span>
                <span className="text-zinc-300">TAIWAN</span>
                <span className="text-[#6CA4C8]">+</span>
                <span className="text-zinc-300">FESTIVAL</span>
                <span className="text-[#F49BB2]">= MUM VISUAL LANGUAGE</span>
              </div>
            </div>

            {/* 2. VISUAL APPLICATION MATRIX (4 Applications Grid) */}
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b pb-2 gap-2 border-black/5 dark:border-white/5">
                <div>
                  <span className={`text-xs font-mono font-bold uppercase tracking-widest block ${isDark ? "text-[#6CA4C8]" : "text-[#437596]"}`}>
                    VISUAL SYSTEM MATRIX
                  </span>
                  <h3 className={`text-lg font-bold font-mono ${themeClasses.bodyTitle}`}>
                    四個核心應用場景 (IDENTITY ‧ CONTENT ‧ COMMUNICATION ‧ ENVIRONMENT)
                  </h3>
                </div>
                <span className={`text-[11px] font-mono ${themeClasses.bodySubText}`}>
                  CLICK CARD TO VIEW DETAILS
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {visualApplications.map((app, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setPreviewItem({
                      title: app.title,
                      category: app.medium,
                      image: app.image,
                      desc: app.desc
                    })}
                    className={`p-6 rounded-2xl space-y-4 group text-left cursor-pointer transition-all border ${themeClasses.cardBg} ${themeClasses.borderColSubtle} hover:border-[#437596] dark:hover:border-[#6CA4C8] hover:shadow-md`}
                  >
                    <div className="flex items-center justify-between border-b pb-2 border-black/5 dark:border-white/5">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-zinc-900 text-white font-mono text-[10px] font-bold">
                          {app.num} / {app.systemCategory}
                        </span>
                        <span className="text-xs font-mono font-bold text-[#437596] dark:text-[#6CA4C8]">
                          {app.purpose}
                        </span>
                      </div>
                      <span className={`text-[10px] font-mono ${themeClasses.bodySubText}`}>
                        {app.uses}
                      </span>
                    </div>

                    <div className={`relative ${app.aspect} rounded-xl overflow-hidden bg-slate-100/5 border ${themeClasses.borderBlueAccent}`}>
                      <img src={app.image} alt={app.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-103" />
                      <div className="absolute top-3 left-3 bg-slate-900/85 backdrop-blur-md px-2.5 py-1 rounded-full text-white font-mono text-[10px] font-medium flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#E8829C] inline-block"></span>
                        {app.medium}
                      </div>
                      <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/25 transition-colors flex items-center justify-center">
                        <span className="opacity-0 group-hover:opacity-100 backdrop-blur-xs px-3.5 py-1.5 rounded-full text-xs font-mono font-bold transition-all shadow-md bg-[#E8829C] text-white">
                          檢視視覺設計細節
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <h4 className={`text-lg font-bold font-mono transition-colors group-hover:text-[#437596] dark:group-hover:text-[#6CA4C8] ${themeClasses.bodyTitle}`}>
                        0{idx + 1}. {app.title} ({app.enTitle})
                      </h4>
                      <p className={`text-xs leading-relaxed ${themeClasses.bodySubText}`}>
                        {app.desc}
                      </p>
                    </div>

                    <div className={`pt-2 border-t flex items-center justify-between text-[10px] font-mono ${themeClasses.borderColSubtle} ${themeClasses.bodySubText}`}>
                      <span>APPLICATION TOUCHPOINT</span>
                      <span className="text-[#437596] dark:text-[#6CA4C8]">EXPANDABLE SYSTEM</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* 3. MUM VISUAL APPLICATION MATRIX (Grid Table) */}
            <div className={`p-6 sm:p-8 rounded-2xl border space-y-6 ${themeClasses.cardBg} ${themeClasses.borderColSubtle}`}>
              <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b pb-4 gap-2 border-black/5 dark:border-white/5">
                <div>
                  <span className={`text-xs font-mono font-bold uppercase tracking-widest block ${isDark ? "text-[#6CA4C8]" : "text-[#437596]"}`}>
                    MUM VISUAL APPLICATION MATRIX
                  </span>
                  <h3 className={`text-xl font-bold font-mono mt-0.5 ${themeClasses.bodyTitle}`}>
                    跨媒介視覺延伸陣列 (DIGITAL ‧ PRINT ‧ FESTIVAL)
                  </h3>
                </div>
                <span className={`text-xs font-mono ${themeClasses.bodySubText}`}>
                  CROSS-MEDIA EXTENSION
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs font-mono text-left border-collapse">
                  <thead>
                    <tr className={`border-b ${themeClasses.borderColSubtle}`}>
                      <th className={`py-3 px-4 uppercase text-[10px] font-bold ${themeClasses.bodySubText}`}>SYSTEM ASSET</th>
                      <th className="py-3 px-4 uppercase text-[10px] font-bold text-[#437596] dark:text-[#6CA4C8]">DIGITAL (社群數位)</th>
                      <th className="py-3 px-4 uppercase text-[10px] font-bold text-zinc-600 dark:text-zinc-300">PRINT (紙本出版)</th>
                      <th className="py-3 px-4 uppercase text-[10px] font-bold text-[#E8829C] dark:text-[#F49BB2]">FESTIVAL (現場環境)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/5 dark:divide-white/5">
                    <tr>
                      <td className={`py-3.5 px-4 font-bold ${themeClasses.bodyTitle}`}>CHARACTER (白貓)</td>
                      <td className={`py-3.5 px-4 ${themeClasses.bodySubText}`}>Avatar / Reel Meme / Post Illustration</td>
                      <td className={`py-3.5 px-4 ${themeClasses.bodySubText}`}>Zine Cover / Art Book / Postcard Pack</td>
                      <td className={`py-3.5 px-4 ${themeClasses.bodySubText}`}>Stage Banner / Photo Spot / Giant Balloon</td>
                    </tr>
                    <tr>
                      <td className={`py-3.5 px-4 font-bold ${themeClasses.bodyTitle}`}>LANGUAGE (語域)</td>
                      <td className={`py-3.5 px-4 ${themeClasses.bodySubText}`}>Story Meme / Caption Quotes / Sticker Text</td>
                      <td className={`py-3.5 px-4 ${themeClasses.bodySubText}`}>Booklet Copy / Independent Zine Quotes</td>
                      <td className={`py-3.5 px-4 ${themeClasses.bodySubText}`}>Towel Slogans / Venue Signage Quotes</td>
                    </tr>
                    <tr>
                      <td className={`py-3.5 px-4 font-bold ${themeClasses.bodyTitle}`}>MUSIC WAVE (音波)</td>
                      <td className={`py-3.5 px-4 ${themeClasses.bodySubText}`}>GIF Motion Wave / Audio Player Visual</td>
                      <td className={`py-3.5 px-4 ${themeClasses.bodySubText}`}>Embossed Foil Line / Cover Pattern</td>
                      <td className={`py-3.5 px-4 ${themeClasses.bodySubText}`}>Stage Backdrop Wave / Merch Pattern</td>
                    </tr>
                    <tr>
                      <td className={`py-3.5 px-4 font-bold ${themeClasses.bodyTitle}`}>ㄠ SYMBOL (在地標籤)</td>
                      <td className={`py-3.5 px-4 ${themeClasses.bodySubText}`}>Watermark Badge / Profile Stamp</td>
                      <td className={`py-3.5 px-4 ${themeClasses.bodySubText}`}>Hand Stamp / Book Seal / Packaging Tag</td>
                      <td className={`py-3.5 px-4 ${themeClasses.bodySubText}`}>Outdoor Vinyl Sticker / Venue Flag Symbol</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* 4. FIXED vs. FLEXIBLE VISUAL ELEMENTS (SYSTEM vs EXPRESSION) */}
            <div className={`p-6 sm:p-8 rounded-2xl border space-y-6 ${themeClasses.cardBg} ${themeClasses.borderColSubtle}`}>
              <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b pb-4 gap-2 border-black/5 dark:border-white/5">
                <div>
                  <span className={`text-xs font-mono font-bold uppercase tracking-widest block ${isDark ? "text-[#6CA4C8]" : "text-[#437596]"}`}>
                    SYSTEM vs. EXPRESSION
                  </span>
                  <h3 className={`text-xl font-bold font-mono mt-0.5 ${themeClasses.bodyTitle}`}>
                    固定與可變元素系統 (「識別固定，表現自由。」)
                  </h3>
                </div>
                <span className={`text-xs font-mono ${themeClasses.bodySubText}`}>
                  FIXED vs. FLEXIBLE
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* FIXED VISUAL ELEMENTS */}
                <div className={`p-5 rounded-xl border space-y-4 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                  <div className="flex items-center justify-between border-b pb-2 border-black/5 dark:border-white/5">
                    <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-zinc-800 text-white">
                      FIXED VISUAL ELEMENTS / 固定元素 (SYSTEM)
                    </span>
                    <span className="text-xs font-mono text-[#437596] dark:text-[#6CA4C8] font-bold">
                      DNA 不變
                    </span>
                  </div>

                  <ul className="space-y-2 text-xs font-mono">
                    <li className="flex items-center justify-between p-2 rounded bg-white dark:bg-zinc-900 border border-black/5 dark:border-white/5">
                      <span className="font-bold">01. WHITE CAT</span>
                      <span className={themeClasses.bodySubText}>白貓角色本體與標準身材比例</span>
                    </li>
                    <li className="flex items-center justify-between p-2 rounded bg-white dark:bg-zinc-900 border border-black/5 dark:border-white/5">
                      <span className="font-bold text-[#437596] dark:text-[#6CA4C8]">02. WAVE BLUE WHISKERS</span>
                      <span className={themeClasses.bodySubText}>湛藍波浪聲波鬍鬚</span>
                    </li>
                    <li className="flex items-center justify-between p-2 rounded bg-white dark:bg-zinc-900 border border-black/5 dark:border-white/5">
                      <span className="font-bold text-[#E8829C] dark:text-[#F49BB2]">03. EAR PINK</span>
                      <span className={themeClasses.bodySubText}>耳尖輕盈粉紅點綴</span>
                    </li>
                    <li className="flex items-center justify-between p-2 rounded bg-white dark:bg-zinc-900 border border-black/5 dark:border-white/5">
                      <span className="font-bold">04. 注音「ㄠ」</span>
                      <span className={themeClasses.bodySubText}>台灣在地注音文化標籤</span>
                    </li>
                    <li className="flex items-center justify-between p-2 rounded bg-white dark:bg-zinc-900 border border-black/5 dark:border-white/5">
                      <span className="font-bold">05. WHITE TEE & 06. BLUE DENIM</span>
                      <span className={themeClasses.bodySubText}>純白素 T 與湛藍牛仔褲標配</span>
                    </li>
                    <li className="flex items-center justify-between p-2 rounded bg-white dark:bg-zinc-900 border border-black/5 dark:border-white/5">
                      <span className="font-bold">07. MUSIC / WAVE MOTIF</span>
                      <span className={themeClasses.bodySubText}>音樂波紋脈衝圖騰</span>
                    </li>
                  </ul>
                  <p className={`text-[11px] font-mono font-semibold pt-1 ${themeClasses.bodySubText}`}>
                    * 確保 MUMㄠ 在任何延伸媒介中，皆能維持 100% 角色視覺識別。
                  </p>
                </div>

                {/* FLEXIBLE VISUAL ELEMENTS */}
                <div className={`p-5 rounded-xl border space-y-4 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                  <div className="flex items-center justify-between border-b pb-2 border-black/5 dark:border-white/5">
                    <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-[#437596] text-white">
                      FLEXIBLE VISUAL ELEMENTS / 可變元素 (EXPRESSION)
                    </span>
                    <span className="text-xs font-mono text-[#E8829C] dark:text-[#F49BB2] font-bold">
                      表現自由
                    </span>
                  </div>

                  <ul className="space-y-2 text-xs font-mono">
                    <li className="flex items-center justify-between p-2 rounded bg-white dark:bg-zinc-900 border border-black/5 dark:border-white/5">
                      <span className="font-bold">01. POSE & MOVEMENT</span>
                      <span className={themeClasses.bodySubText}>動態姿勢與聽團甩頭動作</span>
                    </li>
                    <li className="flex items-center justify-between p-2 rounded bg-white dark:bg-zinc-900 border border-black/5 dark:border-white/5">
                      <span className="font-bold">02. EXPRESSION & EMOTION</span>
                      <span className={themeClasses.bodySubText}>喜怒哀樂與聽團沉醉表情</span>
                    </li>
                    <li className="flex items-center justify-between p-2 rounded bg-white dark:bg-zinc-900 border border-black/5 dark:border-white/5">
                      <span className="font-bold">03. HAND-DRAWN TYPOGRAPHY</span>
                      <span className={themeClasses.bodySubText}>手繪標題與塗鴉文字</span>
                    </li>
                    <li className="flex items-center justify-between p-2 rounded bg-white dark:bg-zinc-900 border border-black/5 dark:border-white/5">
                      <span className="font-bold">04. MUSIC SYMBOLS</span>
                      <span className={themeClasses.bodySubText}>吉他破音、樂器與音符</span>
                    </li>
                    <li className="flex items-center justify-between p-2 rounded bg-white dark:bg-zinc-900 border border-black/5 dark:border-white/5">
                      <span className="font-bold">05. FESTIVAL OBJECTS</span>
                      <span className={themeClasses.bodySubText}>現場毛巾、雨衣、泥巴、啤酒</span>
                    </li>
                    <li className="flex items-center justify-between p-2 rounded bg-white dark:bg-zinc-900 border border-black/5 dark:border-white/5">
                      <span className="font-bold">06. EVENT CONTEXT & MERCH</span>
                      <span className={themeClasses.bodySubText}>場景情境與商品周邊圖案</span>
                    </li>
                  </ul>
                  <p className={`text-[11px] font-mono font-semibold pt-1 ${themeClasses.bodySubText}`}>
                    * 賦予 IP 無限延伸的動態故事性，適應各種現場活動與社群議題。
                  </p>
                </div>
              </div>
            </div>

            {/* 5. MUM BRAND ASSETS (Highlighting ㄠ & Whiskers) */}
            <div className={`p-6 sm:p-8 rounded-2xl border space-y-6 ${themeClasses.cardBg} ${themeClasses.borderColSubtle}`}>
              <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b pb-4 gap-2 border-black/5 dark:border-white/5">
                <div>
                  <span className={`text-xs font-mono font-bold uppercase tracking-widest block ${isDark ? "text-[#6CA4C8]" : "text-[#437596]"}`}>
                    MUM BRAND ASSETS
                  </span>
                  <h3 className={`text-xl font-bold font-mono mt-0.5 ${themeClasses.bodyTitle}`}>
                    六大核心品牌資產 (BRAND ASSET SYSTEM)
                  </h3>
                </div>
                <span className={`text-xs font-mono ${themeClasses.bodySubText}`}>
                  CORE ASSETS
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* 01 ㄠ MARK */}
                <div className={`p-5 rounded-xl border space-y-3 ${themeClasses.cardSubtleBg} ${themeClasses.borderBlueAccent}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-black font-mono text-[#E8829C] dark:text-[#F49BB2]">ㄠ</span>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#E8829C] text-white">
                      01 / TAIWANESE MARK
                    </span>
                  </div>
                  <div>
                    <h4 className={`text-base font-bold font-mono ${themeClasses.bodyTitle}`}>
                      ㄠ MARK (Taiwanese Identity Mark)
                    </h4>
                    <span className="text-[10px] font-mono text-[#437596] dark:text-[#6CA4C8] block font-bold">
                      在地識別符號
                    </span>
                  </div>
                  <p className={`text-xs leading-relaxed ${themeClasses.bodySubText}`}>
                    以注音符號「ㄠ」作為 MUM 名稱中的在地識別，讓角色不只是「一隻貓」，而是具有台灣語言文化辨識度的 IP。
                  </p>
                  <div className={`pt-2 border-t text-[10px] font-mono ${themeClasses.borderColSubtle} text-zinc-500`}>
                    EXTENSIONS: Logo, Pattern, Sticker, Merch, Typography, Social Graphic
                  </div>
                </div>

                {/* 02 WAVE WHISKERS */}
                <div className={`p-5 rounded-xl border space-y-3 ${themeClasses.cardSubtleBg} ${themeClasses.borderBlueAccent}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-black font-mono text-[#437596] dark:text-[#6CA4C8]">〰️〰️</span>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#437596] text-white">
                      02 / MUSIC SIGNATURE
                    </span>
                  </div>
                  <div>
                    <h4 className={`text-base font-bold font-mono ${themeClasses.bodyTitle}`}>
                      WAVE WHISKERS (Music Signature)
                    </h4>
                    <span className="text-[10px] font-mono text-[#437596] dark:text-[#6CA4C8] block font-bold">
                      音樂聲波符號
                    </span>
                  </div>
                  <p className={`text-xs leading-relaxed ${themeClasses.bodySubText}`}>
                    MUMㄠ 的鬍鬚不是一般鬍鬚，而是以聲波與音樂節奏轉化而成的角色識別。包含 WAVE / RHYTHM / SOUND / MOVEMENT 四大概念。
                  </p>
                  <div className={`pt-2 border-t text-[10px] font-mono ${themeClasses.borderColSubtle} text-zinc-500`}>
                    EXTENSIONS: Graphic Motif, Pattern, Divider, Motion Element, Festival Decoration
                  </div>
                </div>

                {/* 03 EAR PINK */}
                <div className={`p-5 rounded-xl border space-y-3 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                  <div className="flex items-center justify-between">
                    <span className="w-4 h-4 rounded-full bg-[#E8829C]"></span>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-zinc-800 text-white">
                      03 / EMOTIONAL ACCENT
                    </span>
                  </div>
                  <div>
                    <h4 className={`text-base font-bold font-mono ${themeClasses.bodyTitle}`}>
                      EAR PINK (Emotional Accent)
                    </h4>
                    <span className="text-[10px] font-mono text-zinc-500 block font-bold">
                      情緒粉紅焦點
                    </span>
                  </div>
                  <p className={`text-xs leading-relaxed ${themeClasses.bodySubText}`}>
                    耳尖粉紅作為情感連結點，在湛藍與純白間創造親和溫暖的情緒記憶。
                  </p>
                  <div className={`pt-2 border-t text-[10px] font-mono ${themeClasses.borderColSubtle} text-zinc-500`}>
                    EXTENSIONS: Accent Color, Highlight Tag, Small Accessory
                  </div>
                </div>

                {/* 04 WAVE BLUE */}
                <div className={`p-5 rounded-xl border space-y-3 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                  <div className="flex items-center justify-between">
                    <span className="w-4 h-4 rounded-full bg-[#437596]"></span>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#437596] text-white">
                      04 / CORE COLOR
                    </span>
                  </div>
                  <div>
                    <h4 className={`text-base font-bold font-mono ${themeClasses.bodyTitle}`}>
                      WAVE BLUE (Core Brand Color)
                    </h4>
                    <span className="text-[10px] font-mono text-[#437596] dark:text-[#6CA4C8] block font-bold">
                      湛藍主色彩
                    </span>
                  </div>
                  <p className={`text-xs leading-relaxed ${themeClasses.bodySubText}`}>
                    湛藍主色調，象徵搖滾破音音浪與現場流動狂熱。
                  </p>
                  <div className={`pt-2 border-t text-[10px] font-mono ${themeClasses.borderColSubtle} text-zinc-500`}>
                    EXTENSIONS: Towel Color, Background, Denim Asset, Main UI
                  </div>
                </div>

                {/* 05 HAND-DRAWN TYPE */}
                <div className={`p-5 rounded-xl border space-y-3 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold font-mono italic">MUMㄠ TYPE</span>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-zinc-800 text-white">
                      05 / HUMAN TYPE
                    </span>
                  </div>
                  <div>
                    <h4 className={`text-base font-bold font-mono ${themeClasses.bodyTitle}`}>
                      HAND-DRAWN TYPE (Human Touch)
                    </h4>
                    <span className="text-[10px] font-mono text-zinc-500 block font-bold">
                      手繪感字型
                    </span>
                  </div>
                  <p className={`text-xs leading-relaxed ${themeClasses.bodySubText}`}>
                    帶有手感溫度的手繪字排版，展現獨立音樂與次文化真實不作作的態度。
                  </p>
                  <div className={`pt-2 border-t text-[10px] font-mono ${themeClasses.borderColSubtle} text-zinc-500`}>
                    EXTENSIONS: Zine Headlines, Meme Quotes, Event Poster Slogans
                  </div>
                </div>

                {/* 06 MUM CHARACTER */}
                <div className={`p-5 rounded-xl border space-y-3 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black font-mono">PRIMARY IP</span>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#E8829C] text-white">
                      06 / PRIMARY ASSET
                    </span>
                  </div>
                  <div>
                    <h4 className={`text-base font-bold font-mono ${themeClasses.bodyTitle}`}>
                      MUM CHARACTER (Primary IP Asset)
                    </h4>
                    <span className="text-[10px] font-mono text-zinc-500 block font-bold">
                      角色主要 IP
                    </span>
                  </div>
                  <p className={`text-xs leading-relaxed ${themeClasses.bodySubText}`}>
                    標準雙爪開衝姿態與比例，為所有延伸應用的核心 IP 資產。
                  </p>
                  <div className={`pt-2 border-t text-[10px] font-mono ${themeClasses.borderColSubtle} text-zinc-500`}>
                    EXTENSIONS: All Campaign, Merch, Social, On-Site Touchpoints
                  </div>
                </div>
              </div>
            </div>

            {/* 6. MUM VISUAL FORMULA & CORE STATEMENT */}
            <div className={`p-8 rounded-2xl border ${themeClasses.cardBg} ${themeClasses.borderBlueAccent} flex flex-col md:flex-row md:items-center justify-between gap-6`}>
              <div className="space-y-3 max-w-2xl">
                <span className={`text-xs font-mono font-bold uppercase tracking-widest block ${isDark ? "text-[#6CA4C8]" : "text-[#437596]"}`}>
                  VISUAL SYSTEM ANCHOR STATEMENT
                </span>
                <h3 className={`text-2xl sm:text-4xl font-black font-mono tracking-tight leading-tight ${themeClasses.bodyTitle}`}>
                  THE SYSTEM STAYS.<br />THE EXPRESSION MOVES.
                </h3>
                <p className={`text-lg sm:text-xl font-bold font-mono text-[#E8829C] dark:text-[#F49BB2]`}>
                  「角色不變，世界一直變。」
                </p>
              </div>

              <div className={`p-5 rounded-xl border text-right font-mono text-xs space-y-2 shrink-0 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                <span className={`block uppercase font-bold text-[10px] ${themeClasses.bodySubText}`}>MUM VISUAL FORMULA</span>
                <div className="text-xs font-bold space-y-1 text-left">
                  <div className="text-zinc-800 dark:text-zinc-200">CORE CHARACTER (核心角色)</div>
                  <div className="text-[#437596] dark:text-[#6CA4C8]">+ MUSIC LANGUAGE (音樂語彙)</div>
                  <div className="text-[#E8829C] dark:text-[#F49BB2]">+ TAIWANESE SYMBOL (台灣符號)</div>
                  <div className="text-amber-600 dark:text-amber-400">+ CONTEXT (場景情境)</div>
                  <div className="pt-1 border-t text-[#437596] dark:text-[#6CA4C8] text-sm font-black">= MUM VISUAL</div>
                </div>
              </div>
            </div>

            {/* Next Section Navigation Button */}
            <div className={`pt-6 flex justify-end border-t ${themeClasses.borderColSubtle}`}>
              <button
                type="button"
                onClick={() => scrollToSection("merch-section")}
                className={`inline-flex items-center gap-4 px-6 py-3.5 rounded-xl border text-xs font-mono font-bold transition-all ${themeClasses.cardBg} ${themeClasses.borderColSubtle} hover:border-[#437596] hover:text-[#437596] dark:hover:border-[#6CA4C8] dark:hover:text-[#6CA4C8] group cursor-pointer`}
              >
                <div className="text-left">
                  <span className={`text-[10px] block font-mono uppercase tracking-widest ${themeClasses.bodySubText}`}>
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
                  周邊設計與商品應用
                </h2>
              </div>

              <div className="max-w-md">
                <p className={`text-xs leading-relaxed font-mono ${themeClasses.bodySubText}`}>
                  將 MUMㄠ 的角色 DNA 延伸至可穿戴、可使用、可收藏的實體商品，讓 IP 從視覺識別進入真實生活。
                </p>
                <span className={`text-[10px] font-mono block mt-1 ${isDark ? "text-[#6CA4C8]" : "text-[#437596]"}`}>
                  Turning character identity into physical experiences.
                </span>
              </div>
            </div>

            {/* Visual Anchor Statement */}
            <div className={`p-8 rounded-2xl border ${themeClasses.cardBg} ${themeClasses.borderBlueAccent} flex flex-col md:flex-row md:items-center justify-between gap-6`}>
              <div className="space-y-2">
                <span className={`text-xs font-mono font-bold uppercase tracking-widest block ${isDark ? "text-[#6CA4C8]" : "text-[#437596]"}`}>
                  PRODUCT STRATEGY ANCHOR
                </span>
                <h3 className={`text-2xl sm:text-4xl font-black font-mono tracking-tight ${themeClasses.bodyTitle}`}>
                  FROM IP TO OBJECT.
                </h3>
                <p className={`text-lg sm:text-xl font-bold font-mono text-[#E8829C] dark:text-[#F49BB2]`}>
                  「讓喜歡 MUMㄠ，變成可以帶走的東西。」
                </p>
              </div>

              <div className={`p-4 rounded-xl border font-mono text-xs space-y-1.5 shrink-0 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                <span className={`text-[10px] uppercase font-bold block ${themeClasses.bodySubText}`}>IP TO PHYSICAL SYSTEM</span>
                <div className="text-xs font-bold text-zinc-800 dark:text-zinc-200">CHARACTER ➔ PRODUCT ➔ EXPERIENCE</div>
                <div className="text-[11px] text-[#437596] dark:text-[#6CA4C8]">從平面角色轉化為實體生活的陪伴</div>
              </div>
            </div>

            {/* CHARACTER → MERCHANDISE (Brand Asset Conversion) */}
            <div className={`p-6 sm:p-8 rounded-2xl border space-y-6 ${themeClasses.cardBg} ${themeClasses.borderColSubtle}`}>
              <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b pb-4 gap-2 border-black/5 dark:border-white/5">
                <div>
                  <span className={`text-xs font-mono font-bold uppercase tracking-widest block ${isDark ? "text-[#6CA4C8]" : "text-[#437596]"}`}>
                    CHARACTER → MERCHANDISE
                  </span>
                  <h3 className={`text-xl font-bold font-mono mt-0.5 ${themeClasses.bodyTitle}`}>
                    品牌資產與實體商品轉化對應
                  </h3>
                </div>
                <span className={`text-xs font-mono ${themeClasses.bodySubText}`}>
                  ASSET TRANSLATION
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                <div className={`p-3.5 rounded-xl border text-center space-y-1 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                  <span className="text-[10px] font-mono font-bold block text-zinc-400">01. IP ASSET</span>
                  <div className="text-xs font-bold font-mono text-zinc-800 dark:text-zinc-100">MUM CHARACTER</div>
                  <div className="text-[10px] font-mono text-[#437596] dark:text-[#6CA4C8]">➔ 角色本體</div>
                </div>

                <div className={`p-3.5 rounded-xl border text-center space-y-1 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                  <span className="text-[10px] font-mono font-bold block text-zinc-400">02. WAVE PATTERN</span>
                  <div className="text-xs font-bold font-mono text-[#437596] dark:text-[#6CA4C8]">WAVE WHISKERS</div>
                  <div className="text-[10px] font-mono text-[#437596] dark:text-[#6CA4C8]">➔ 圖形 Pattern</div>
                </div>

                <div className={`p-3.5 rounded-xl border text-center space-y-1 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                  <span className="text-[10px] font-mono font-bold block text-zinc-400">03. COLOR ACCENT</span>
                  <div className="text-xs font-bold font-mono text-[#E8829C] dark:text-[#F49BB2]">EAR PINK</div>
                  <div className="text-[10px] font-mono text-[#E8829C] dark:text-[#F49BB2]">➔ Accent Color</div>
                </div>

                <div className={`p-3.5 rounded-xl border text-center space-y-1 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                  <span className="text-[10px] font-mono font-bold block text-zinc-400">04. LOCAL MARK</span>
                  <div className="text-xs font-bold font-mono text-zinc-800 dark:text-zinc-100">注音「ㄠ」</div>
                  <div className="text-[10px] font-mono text-zinc-500">➔ Graphic Mark</div>
                </div>

                <div className={`p-3.5 rounded-xl border text-center space-y-1 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                  <span className="text-[10px] font-mono font-bold block text-zinc-400">05. BRAND COLOR</span>
                  <div className="text-xs font-bold font-mono text-[#437596] dark:text-[#6CA4C8]">WAVE BLUE</div>
                  <div className="text-[10px] font-mono text-[#437596] dark:text-[#6CA4C8]">➔ Brand Color</div>
                </div>

                <div className={`p-3.5 rounded-xl border text-center space-y-1 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                  <span className="text-[10px] font-mono font-bold block text-zinc-400">06. LINE STYLE</span>
                  <div className="text-xs font-bold font-mono text-zinc-800 dark:text-zinc-100">HAND-DRAWN</div>
                  <div className="text-[10px] font-mono text-zinc-500">➔ Print Style</div>
                </div>
              </div>
            </div>

            {/* MERCHANDISE CASE STUDIES (4 Products Grid) */}
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b pb-2 gap-2 border-black/5 dark:border-white/5">
                <div>
                  <span className={`text-xs font-mono font-bold uppercase tracking-widest block ${isDark ? "text-[#6CA4C8]" : "text-[#437596]"}`}>
                    MUM MERCHANDISE CASE STUDIES
                  </span>
                  <h3 className={`text-lg font-bold font-mono ${themeClasses.bodyTitle}`}>
                    四大實體商品開發系統 (WEAR ‧ STICK ‧ COLLECT ‧ LIVE)
                  </h3>
                </div>
                <span className={`text-[11px] font-mono ${themeClasses.bodySubText}`}>
                  CLICK CARD TO VIEW SPEC
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {merchandiseDesigns.map((merch, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setPreviewItem({
                      title: merch.name,
                      category: merch.category,
                      spec: merch.spec,
                      image: merch.image,
                      desc: `${merch.roleQuote} ${merch.desc}`
                    })}
                    className={`p-5 rounded-2xl space-y-4 group text-left cursor-pointer transition-all flex flex-col justify-between border ${themeClasses.cardBg} ${themeClasses.borderColSubtle} hover:border-[#437596] dark:hover:border-[#6CA4C8] hover:shadow-md`}
                  >
                    <div className="space-y-3">
                      {/* Top Header Badge */}
                      <div className="flex items-center justify-between border-b pb-2 border-black/5 dark:border-white/5">
                        <span className="px-2 py-0.5 rounded bg-zinc-900 text-white font-mono text-[10px] font-bold">
                          {merch.category}
                        </span>
                        <span className="text-[10px] font-mono font-bold text-[#437596] dark:text-[#6CA4C8]">
                          {merch.productRole}
                        </span>
                      </div>

                      {/* Title & Quote */}
                      <div>
                        <h4 className={`text-base font-bold font-mono transition-colors group-hover:text-[#437596] dark:group-hover:text-[#6CA4C8] ${themeClasses.bodyTitle}`}>
                          {merch.name}
                        </h4>
                        <span className="text-[10px] font-mono text-zinc-400 block">
                          {merch.enName}
                        </span>
                        <p className={`text-xs font-semibold italic mt-2 text-[#E8829C] dark:text-[#F49BB2]`}>
                          {merch.roleQuote}
                        </p>
                      </div>

                      {/* Image Preview Box */}
                      <div className={`aspect-square rounded-xl overflow-hidden bg-slate-100/5 relative border ${themeClasses.borderBlueAccent}`}>
                        <img src={merch.image} alt={merch.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                        <div className="absolute top-2.5 left-2.5 bg-slate-900/85 backdrop-blur-xs px-2 py-0.5 rounded text-[9px] font-mono font-bold text-white">
                          {merch.tag}
                        </div>
                      </div>

                      {/* Description */}
                      <p className={`text-xs leading-relaxed ${themeClasses.bodySubText}`}>
                        {merch.desc}
                      </p>

                      {/* Spec info */}
                      <div className={`p-2 rounded-lg text-[10px] font-mono font-bold border ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle} ${isDark ? "text-[#6CA4C8]" : "text-[#437596]"}`}>
                        SPEC: {merch.spec}
                      </div>
                    </div>

                    {/* Footer Application Tags */}
                    <div className={`pt-2 border-t flex flex-wrap gap-1 text-[9px] font-mono ${themeClasses.borderColSubtle}`}>
                      {merch.application.map((appTag, tIdx) => (
                        <span key={tIdx} className="px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/5 text-zinc-500">
                          #{appTag}
                        </span>
                      ))}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* MUM MERCHANDISE STRATEGY & PRODUCT HIERARCHY */}
            <div className={`p-6 sm:p-8 rounded-2xl border space-y-8 ${themeClasses.cardBg} ${themeClasses.borderColSubtle}`}>
              {/* MERCH STRATEGY */}
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b pb-4 gap-2 border-black/5 dark:border-white/5">
                  <div>
                    <span className={`text-xs font-mono font-bold uppercase tracking-widest block ${isDark ? "text-[#6CA4C8]" : "text-[#437596]"}`}>
                      MUM MERCHANDISE STRATEGY
                    </span>
                    <h3 className={`text-xl font-bold font-mono mt-0.5 ${themeClasses.bodyTitle}`}>
                      四大產品體驗維度 (WEAR ‧ STICK ‧ COLLECT ‧ LIVE)
                    </h3>
                  </div>
                  <span className={`text-xs font-mono ${themeClasses.bodySubText}`}>
                    STRATEGY VERBS
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className={`p-4 rounded-xl border space-y-2 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-zinc-900 text-white">
                      WEAR / 穿戴
                    </span>
                    <h4 className={`text-sm font-bold font-mono ${themeClasses.bodyTitle}`}>毛巾 ‧ 搖滾戰袍</h4>
                    <p className={`text-xs leading-relaxed ${themeClasses.bodySubText}`}>
                      音樂祭現場身份識別，高舉時形成視覺方陣。
                    </p>
                  </div>

                  <div className={`p-4 rounded-xl border space-y-2 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-[#437596] text-white">
                      STICK / 貼附
                    </span>
                    <h4 className={`text-sm font-bold font-mono ${themeClasses.bodyTitle}`}>貼紙 ‧ 次文化識別</h4>
                    <p className={`text-xs leading-relaxed ${themeClasses.bodySubText}`}>
                      樂器袋、安全帽與吉他盒上的日常宣示。
                    </p>
                  </div>

                  <div className={`p-4 rounded-xl border space-y-2 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-[#E8829C] text-white">
                      COLLECT / 收藏
                    </span>
                    <h4 className={`text-sm font-bold font-mono ${themeClasses.bodyTitle}`}>胸章 ‧ 精緻紀念</h4>
                    <p className={`text-xs leading-relaxed ${themeClasses.bodySubText}`}>
                      縮小角色核心特徵，隨身別在背包與外套。
                    </p>
                  </div>

                  <div className={`p-4 rounded-xl border space-y-2 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-amber-600 text-white">
                      LIVE / 使用
                    </span>
                    <h4 className={`text-sm font-bold font-mono ${themeClasses.bodyTitle}`}>野餐墊 ‧ 現場生活</h4>
                    <p className={`text-xs leading-relaxed ${themeClasses.bodySubText}`}>
                      延伸至音樂祭草皮休息、社交與等待空間。
                    </p>
                  </div>
                </div>

                {/* Formula Banner */}
                <div className="p-3.5 rounded-xl border bg-zinc-900 text-white font-mono text-center flex flex-wrap items-center justify-center gap-2 text-xs font-bold">
                  <span className="text-zinc-300">WEAR</span>
                  <span className="text-[#6CA4C8]">+</span>
                  <span className="text-zinc-300">STICK</span>
                  <span className="text-[#6CA4C8]">+</span>
                  <span className="text-zinc-300">COLLECT</span>
                  <span className="text-[#6CA4C8]">+</span>
                  <span className="text-zinc-300">LIVE</span>
                  <span className="text-[#F49BB2]">= MUM MERCH</span>
                </div>
              </div>

              {/* PRODUCT HIERARCHY */}
              <div className="space-y-4 pt-6 border-t border-black/5 dark:border-white/5">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
                  <div>
                    <span className={`text-xs font-mono font-bold uppercase tracking-widest block ${isDark ? "text-[#6CA4C8]" : "text-[#437596]"}`}>
                      PRODUCT HIERARCHY
                    </span>
                    <h3 className={`text-xl font-bold font-mono mt-0.5 ${themeClasses.bodyTitle}`}>
                      商品溝通層級 (從入門觸點到沉浸體驗)
                    </h3>
                  </div>
                  <span className={`text-xs font-mono ${themeClasses.bodySubText}`}>
                    ENGAGEMENT DEPTH
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs">
                  <div className={`p-4 rounded-xl border space-y-1.5 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                    <span className="text-[10px] font-bold text-[#437596] dark:text-[#6CA4C8]">01. ENTRY / 入門觸點</span>
                    <h4 className={`text-sm font-bold ${themeClasses.bodyTitle}`}>Sticker Pack (貼紙組)</h4>
                    <p className={`text-xs ${themeClasses.bodySubText}`}>低門檻 ‧ 容易帶走 ‧ 容易分享擴散</p>
                  </div>

                  <div className={`p-4 rounded-xl border space-y-1.5 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                    <span className="text-[10px] font-bold text-[#E8829C] dark:text-[#F49BB2]">02. IDENTITY / 隨身識別</span>
                    <h4 className={`text-sm font-bold ${themeClasses.bodyTitle}`}>Metal Badge (金屬胸章)</h4>
                    <p className={`text-xs ${themeClasses.bodySubText}`}>角色特徵識別 ‧ 隨身收藏與個人展現</p>
                  </div>

                  <div className={`p-4 rounded-xl border space-y-1.5 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                    <span className="text-[10px] font-bold text-zinc-800 dark:text-zinc-200">03. FESTIVAL / 核心文化</span>
                    <h4 className={`text-sm font-bold ${themeClasses.bodyTitle}`}>Festival Towel (搖滾毛巾)</h4>
                    <p className={`text-xs ${themeClasses.bodySubText}`}>音樂祭現場文化 ‧ 聽團仔陣營身份證明</p>
                  </div>

                  <div className={`p-4 rounded-xl border space-y-1.5 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                    <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400">04. EXPERIENCE / 沉浸體驗</span>
                    <h4 className={`text-sm font-bold ${themeClasses.bodyTitle}`}>Outdoor Mat (野餐墊)</h4>
                    <p className={`text-xs ${themeClasses.bodySubText}`}>大型現場物件 ‧ 休息與活動社交場景</p>
                  </div>
                </div>
              </div>
            </div>

            {/* PRODUCT EXPERIENCE (聽團生活情境脈絡) */}
            <div className={`p-6 sm:p-8 rounded-2xl border space-y-6 ${themeClasses.cardBg} ${themeClasses.borderColSubtle}`}>
              <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b pb-4 gap-2 border-black/5 dark:border-white/5">
                <div>
                  <span className={`text-xs font-mono font-bold uppercase tracking-widest block ${isDark ? "text-[#6CA4C8]" : "text-[#437596]"}`}>
                    MUM PRODUCT EXPERIENCE
                  </span>
                  <h3 className={`text-xl font-bold font-mono mt-0.5 ${themeClasses.bodyTitle}`}>
                    聽團生活與體驗時序脈絡
                  </h3>
                </div>
                <span className={`text-xs font-mono ${themeClasses.bodySubText}`}>
                  FESTIVAL TIMELINE
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className={`p-5 rounded-xl border space-y-3 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                  <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded bg-zinc-800 text-white">
                    01. BEFORE THE SHOW
                  </span>
                  <h4 className={`text-base font-bold font-mono ${themeClasses.bodyTitle}`}>
                    行前備戰 ‧ 貼紙與胸章
                  </h4>
                  <p className={`text-xs leading-relaxed ${themeClasses.bodySubText}`}>
                    將貼紙黏貼於吉他盒與安全帽，別上金屬胸章，在進入現場前即確立個人的次文化品味與期待。
                  </p>
                </div>

                <div className={`p-5 rounded-xl border space-y-3 ${themeClasses.cardSubtleBg} ${themeClasses.borderBlueAccent}`}>
                  <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded bg-[#437596] text-white">
                    02. AT THE FESTIVAL
                  </span>
                  <h4 className={`text-base font-bold font-mono ${themeClasses.bodyTitle}`}>
                    現場狂歡 ‧ 湛藍波紋毛巾
                  </h4>
                  <p className={`text-xs leading-relaxed ${themeClasses.bodySubText}`}>
                    舞台前方揮舞高舉，吸汗防水，成為衝撞區與打卡拍照中最具標誌性的教徒識別陣容。
                  </p>
                </div>

                <div className={`p-5 rounded-xl border space-y-3 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                  <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded bg-[#E8829C] text-white">
                    03. AFTER THE FESTIVAL
                  </span>
                  <h4 className={`text-base font-bold font-mono ${themeClasses.bodyTitle}`}>
                    草皮休憩與回憶收藏
                  </h4>
                  <p className={`text-xs leading-relaxed ${themeClasses.bodySubText}`}>
                    表演空檔鋪開防水野餐墊，與團友共享啤酒休憩，並將體驗過後的毛巾與胸章珍藏於日常房內。
                  </p>
                </div>
              </div>
            </div>

            {/* MERCHANDISE MATRIX & DESIGN CONSIDERATIONS */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* MATRIX TABLE */}
              <div className={`p-6 rounded-2xl border space-y-4 ${themeClasses.cardBg} ${themeClasses.borderColSubtle}`}>
                <div className="border-b pb-3 border-black/5 dark:border-white/5">
                  <span className={`text-xs font-mono font-bold uppercase tracking-widest block ${isDark ? "text-[#6CA4C8]" : "text-[#437596]"}`}>
                    MERCHANDISE MATRIX
                  </span>
                  <h3 className={`text-base font-bold font-mono ${themeClasses.bodyTitle}`}>
                    商品與場景維度對照表
                  </h3>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs font-mono text-left border-collapse">
                    <thead>
                      <tr className={`border-b ${themeClasses.borderColSubtle}`}>
                        <th className={`py-2 px-3 uppercase text-[10px] font-bold ${themeClasses.bodySubText}`}>PRODUCT</th>
                        <th className="py-2 px-3 uppercase text-[10px] font-bold text-[#437596] dark:text-[#6CA4C8]">WEAR</th>
                        <th className="py-2 px-3 uppercase text-[10px] font-bold text-zinc-600 dark:text-zinc-300">DAILY</th>
                        <th className="py-2 px-3 uppercase text-[10px] font-bold text-[#E8829C] dark:text-[#F49BB2]">FESTIVAL</th>
                        <th className="py-2 px-3 uppercase text-[10px] font-bold text-amber-600 dark:text-amber-400">COLLECT</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-black/5 dark:divide-white/5">
                      <tr>
                        <td className={`py-2.5 px-3 font-bold ${themeClasses.bodyTitle}`}>FESTIVAL TOWEL</td>
                        <td className="py-2.5 px-3 text-[#437596] dark:text-[#6CA4C8] font-bold">✓</td>
                        <td className="py-2.5 px-3 text-zinc-400">-</td>
                        <td className="py-2.5 px-3 text-[#E8829C] dark:text-[#F49BB2] font-bold">✓</td>
                        <td className="py-2.5 px-3 text-amber-600 dark:text-amber-400 font-bold">✓</td>
                      </tr>
                      <tr>
                        <td className={`py-2.5 px-3 font-bold ${themeClasses.bodyTitle}`}>STICKER PACK</td>
                        <td className="py-2.5 px-3 text-zinc-400">-</td>
                        <td className="py-2.5 px-3 text-zinc-800 dark:text-zinc-200 font-bold">✓</td>
                        <td className="py-2.5 px-3 text-[#E8829C] dark:text-[#F49BB2] font-bold">✓</td>
                        <td className="py-2.5 px-3 text-zinc-400">-</td>
                      </tr>
                      <tr>
                        <td className={`py-2.5 px-3 font-bold ${themeClasses.bodyTitle}`}>METAL BADGE</td>
                        <td className="py-2.5 px-3 text-[#437596] dark:text-[#6CA4C8] font-bold">✓</td>
                        <td className="py-2.5 px-3 text-zinc-800 dark:text-zinc-200 font-bold">✓</td>
                        <td className="py-2.5 px-3 text-[#E8829C] dark:text-[#F49BB2] font-bold">✓</td>
                        <td className="py-2.5 px-3 text-amber-600 dark:text-amber-400 font-bold">✓</td>
                      </tr>
                      <tr>
                        <td className={`py-2.5 px-3 font-bold ${themeClasses.bodyTitle}`}>OUTDOOR MAT</td>
                        <td className="py-2.5 px-3 text-zinc-400">-</td>
                        <td className="py-2.5 px-3 text-zinc-800 dark:text-zinc-200 font-bold">✓</td>
                        <td className="py-2.5 px-3 text-[#E8829C] dark:text-[#F49BB2] font-bold">✓</td>
                        <td className="py-2.5 px-3 text-zinc-400">-</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* DESIGN CONSIDERATIONS */}
              <div className={`p-6 rounded-2xl border space-y-4 ${themeClasses.cardBg} ${themeClasses.borderColSubtle}`}>
                <div className="border-b pb-3 border-black/5 dark:border-white/5">
                  <span className={`text-xs font-mono font-bold uppercase tracking-widest block ${isDark ? "text-[#6CA4C8]" : "text-[#437596]"}`}>
                    DESIGN CONSIDERATIONS
                  </span>
                  <h3 className={`text-base font-bold font-mono ${themeClasses.bodyTitle}`}>
                    商業與商品開發三大思考
                  </h3>
                </div>

                <div className="space-y-3 font-mono text-xs">
                  <div className={`p-3 rounded-lg border space-y-1 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                    <span className="font-bold text-[#437596] dark:text-[#6CA4C8]">01. RECOGNITION / 高辨識度</span>
                    <p className={themeClasses.bodySubText}>即使在遠距離人群中，湛藍音波波紋與耳尖粉紅點綴亦能一眼辨識 MUMㄠ。</p>
                  </div>

                  <div className={`p-3 rounded-lg border space-y-1 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                    <span className="font-bold text-[#E8829C] dark:text-[#F49BB2]">02. USABILITY / 實際實用性</span>
                    <p className={themeClasses.bodySubText}>堅持選用 100% 純棉雙面緹花、PVC 抗 UV 刀模與牛津布防水層，不只是收藏品。</p>
                  </div>

                  <div className={`p-3 rounded-lg border space-y-1 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                    <span className="font-bold text-amber-600 dark:text-amber-400">03. COLLECTIBILITY / 收藏延伸性</span>
                    <p className={themeClasses.bodySubText}>透過不同產品線形成可持續擴充的 IP 紀念系統，增加教徒重複購買與收藏意願。</p>
                  </div>
                </div>
              </div>
            </div>

            {/* MUM MERCH FORMULA & CORE STATEMENT */}
            <div className={`p-8 rounded-2xl border ${themeClasses.cardBg} ${themeClasses.borderBlueAccent} flex flex-col md:flex-row md:items-center justify-between gap-6`}>
              <div className="space-y-3 max-w-2xl">
                <span className={`text-xs font-mono font-bold uppercase tracking-widest block ${isDark ? "text-[#6CA4C8]" : "text-[#437596]"}`}>
                  PRODUCT FORMULA & CORE STATEMENT
                </span>
                <h3 className={`text-2xl sm:text-3xl font-black font-mono tracking-tight leading-tight ${themeClasses.bodyTitle}`}>
                  「識別不只存在於螢幕上。」
                </h3>
                <p className="text-sm font-bold font-mono text-[#437596] dark:text-[#6CA4C8]">
                  FROM SCREEN TO LIFE, FROM IP TO OBJECT.
                </p>
              </div>

              <div className={`p-5 rounded-xl border text-right font-mono text-xs space-y-2 shrink-0 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                <span className={`block uppercase font-bold text-[10px] ${themeClasses.bodySubText}`}>MUM MERCH FORMULA</span>
                <div className="text-xs font-bold space-y-1 text-left">
                  <div className="text-zinc-800 dark:text-zinc-200">CHARACTER (角色識別)</div>
                  <div className="text-[#437596] dark:text-[#6CA4C8]">+ FUNCTION (實際功能)</div>
                  <div className="text-[#E8829C] dark:text-[#F49BB2]">+ CULTURE (音樂文化)</div>
                  <div className="text-amber-600 dark:text-amber-400">+ COLLECTIBILITY (收藏價值)</div>
                  <div className="pt-1 border-t text-[#437596] dark:text-[#6CA4C8] text-sm font-black">= MUM MERCHANDISE</div>
                </div>
              </div>
            </div>

            {/* Next Section Navigation Button */}
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
            
            {/* Section Header (01 | 頁面定位) */}
            <div className={`flex flex-col sm:flex-row sm:items-end justify-between border-b pb-4 gap-4 ${themeClasses.borderCol}`}>
              <div>
                <div className="flex items-center gap-2">
                  <Layers className={`h-4 w-4 ${isDark ? "text-[#6CA4C8]" : "text-[#437596]"}`} />
                  <span className={`text-xs font-mono font-bold uppercase tracking-widest block ${isDark ? "text-[#6CA4C8]" : "text-[#437596]"}`}>
                    07 / BRAND APPLICATION ‧ IP APPLICATION & COMMERCIAL ECOSYSTEM
                  </span>
                </div>
                <h2 className={`text-3xl font-bold font-mono mt-1 tracking-tight ${themeClasses.bodyTitle}`}>
                  IP 商業應用體系
                </h2>
              </div>

              <div className="max-w-md">
                <p className={`text-xs leading-relaxed font-mono ${themeClasses.bodySubText}`}>
                  從角色識別到實體商品與文化場景，建立可持續延伸的 MUMㄠ IP 應用架構。
                </p>
                <span className={`text-[10px] font-mono block mt-1 ${isDark ? "text-[#6CA4C8]" : "text-[#437596]"}`}>
                  From character identity to a scalable IP ecosystem.
                </span>
              </div>
            </div>

            {/* Visual Anchor Statement (02 | 大型核心 Statement) */}
            <div className={`p-8 sm:p-12 rounded-2xl border ${themeClasses.cardBg} ${themeClasses.borderBlueAccent} text-center space-y-4`}>
              <span className={`text-xs font-mono font-bold uppercase tracking-widest block ${isDark ? "text-[#6CA4C8]" : "text-[#437596]"}`}>
                CORE BRAND & IP STATEMENT
              </span>
              <h3 className={`text-3xl sm:text-5xl md:text-6xl font-black font-mono tracking-tight leading-none ${themeClasses.bodyTitle}`}>
                FROM CHARACTER<br />TO CULTURE. TO COMMERCE.
              </h3>
              <p className={`text-xl sm:text-2xl font-bold font-mono text-[#E8829C] dark:text-[#F49BB2] pt-2`}>
                「從角色，走進文化，再走進生活。」
              </p>
            </div>

            {/* MUMㄠ IP ECOSYSTEM DIAGRAM (03 | 建立 IP ECOSYSTEM) */}
            <div className={`p-6 sm:p-10 rounded-2xl border space-y-8 ${themeClasses.cardBg} ${themeClasses.borderColSubtle}`}>
              <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b pb-4 gap-2 border-black/5 dark:border-white/5">
                <div>
                  <span className={`text-xs font-mono font-bold uppercase tracking-widest block ${isDark ? "text-[#6CA4C8]" : "text-[#437596]"}`}>
                    MUMㄠ IP ECOSYSTEM
                  </span>
                  <h3 className={`text-xl font-bold font-mono mt-0.5 ${themeClasses.bodyTitle}`}>
                    IP 生態圖譜與四向延伸軸線
                  </h3>
                </div>
                <span className={`text-xs font-mono ${themeClasses.bodySubText}`}>
                  ECOSYSTEM DIAGRAM
                </span>
              </div>

              {/* Central Hub & 4 Rays */}
              <div className="space-y-6">
                {/* Center Core Node */}
                <div className="p-6 rounded-2xl bg-zinc-900 text-white text-center space-y-2 max-w-md mx-auto border-2 border-[#437596] shadow-xl">
                  <span className="px-2.5 py-0.5 rounded bg-[#E8829C] text-white font-mono text-[10px] font-bold uppercase">
                    CORE IP ENGINE
                  </span>
                  <h4 className="text-3xl font-black font-mono tracking-widest text-[#6CA4C8]">
                    MUMㄠ
                  </h4>
                  <p className="text-xs font-mono text-zinc-300">
                    原創貓咪 IP ‧ 聲音與次文化識別體
                  </p>
                </div>

                <div className="flex justify-center">
                  <div className="w-0.5 h-6 bg-[#437596] dark:bg-[#6CA4C8]"></div>
                </div>

                {/* 4 Rays Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className={`p-5 rounded-xl border space-y-2.5 text-center ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                    <span className="px-2 py-0.5 rounded bg-zinc-800 text-white font-mono text-[10px] font-bold block mx-auto w-fit">
                      01 CULTURE
                    </span>
                    <h5 className={`text-sm font-bold font-mono ${themeClasses.bodyTitle}`}>文化脈絡</h5>
                    <div className="text-xs font-mono text-[#437596] dark:text-[#6CA4C8] space-y-1">
                      <div>音樂祭 ‧ 獨立音樂</div>
                      <div>藝術出版 ‧ 現場文化</div>
                    </div>
                  </div>

                  <div className={`p-5 rounded-xl border space-y-2.5 text-center ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                    <span className="px-2 py-0.5 rounded bg-[#437596] text-white font-mono text-[10px] font-bold block mx-auto w-fit">
                      02 CONTENT
                    </span>
                    <h5 className={`text-sm font-bold font-mono ${themeClasses.bodyTitle}`}>內容載體</h5>
                    <div className="text-xs font-mono text-[#437596] dark:text-[#6CA4C8] space-y-1">
                      <div>Instagram ‧ Comic</div>
                      <div>Sticker ‧ Meme ‧ Social</div>
                    </div>
                  </div>

                  <div className={`p-5 rounded-xl border space-y-2.5 text-center ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                    <span className="px-2 py-0.5 rounded bg-[#E8829C] text-white font-mono text-[10px] font-bold block mx-auto w-fit">
                      03 PRODUCT
                    </span>
                    <h5 className={`text-sm font-bold font-mono ${themeClasses.bodyTitle}`}>實體商品</h5>
                    <div className="text-xs font-mono text-[#E8829C] dark:text-[#F49BB2] space-y-1">
                      <div>Towel ‧ Sticker ‧ Badge</div>
                      <div>Mat ‧ Apparel ‧ Accessories</div>
                    </div>
                  </div>

                  <div className={`p-5 rounded-xl border space-y-2.5 text-center ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                    <span className="px-2 py-0.5 rounded bg-amber-600 text-white font-mono text-[10px] font-bold block mx-auto w-fit">
                      04 COLLABORATION
                    </span>
                    <h5 className={`text-sm font-bold font-mono ${themeClasses.bodyTitle}`}>跨界合作</h5>
                    <div className="text-xs font-mono text-amber-600 dark:text-amber-400 space-y-1">
                      <div>Band ‧ Festival ‧ Artist</div>
                      <div>Brand ‧ Creative Project</div>
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-xl border border-black/5 dark:border-white/5 bg-black/5 dark:bg-white/5 text-center font-mono text-xs font-bold">
                  <span className={themeClasses.bodySubText}>MUMㄠ IP SYSTEM ➔ </span>
                  <span className="text-[#437596] dark:text-[#6CA4C8]">CULTURE</span> + 
                  <span className="text-zinc-700 dark:text-zinc-200"> CONTENT</span> + 
                  <span className="text-[#E8829C] dark:text-[#F49BB2]"> PRODUCT</span> + 
                  <span className="text-amber-600 dark:text-amber-400"> COLLABORATION</span>
                </div>
              </div>
            </div>

            {/* REDEFINED 4 APPLICATIONS (04 | 重新定義四個 Application) */}
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b pb-2 gap-2 border-black/5 dark:border-white/5">
                <div>
                  <span className={`text-xs font-mono font-bold uppercase tracking-widest block ${isDark ? "text-[#6CA4C8]" : "text-[#437596]"}`}>
                    APPLICATION DOMAINS
                  </span>
                  <h3 className={`text-xl font-bold font-mono ${themeClasses.bodyTitle}`}>
                    四大應用範疇 (CULTURAL ‧ CONTENT ‧ PRODUCT ‧ COLLABORATION)
                  </h3>
                </div>
                <span className={`text-[11px] font-mono ${themeClasses.bodySubText}`}>
                  4 CORE PILLARS
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className={`p-6 rounded-2xl border space-y-4 flex flex-col justify-between ${themeClasses.cardBg} ${themeClasses.borderColSubtle}`}>
                  <div className="space-y-3">
                    <span className="px-2.5 py-0.5 rounded bg-zinc-900 text-white font-mono text-[10px] font-bold">
                      01 CULTURAL
                    </span>
                    <h4 className={`text-base font-bold font-mono ${themeClasses.bodyTitle}`}>文化應用</h4>
                    <p className={`text-xs font-bold font-mono text-[#E8829C] dark:text-[#F49BB2]`}>
                      「讓 MUMㄠ 進入真實的台灣音樂與獨立文化場景。」
                    </p>
                    <p className={`text-xs leading-relaxed ${themeClasses.bodySubText}`}>
                      音樂祭現場、獨立音樂演出、藝術出版展覽與次文化聚會，作為文化參與者與視覺標籤。
                    </p>
                  </div>
                  <div className={`pt-3 border-t text-[10px] font-mono space-y-1 ${themeClasses.borderColSubtle} ${themeClasses.bodySubText}`}>
                    <div>• Music Festival</div>
                    <div>• Live Event</div>
                    <div>• Art Book Fair</div>
                    <div>• Independent Culture</div>
                  </div>
                </div>

                <div className={`p-6 rounded-2xl border space-y-4 flex flex-col justify-between ${themeClasses.cardBg} ${themeClasses.borderColSubtle}`}>
                  <div className="space-y-3">
                    <span className="px-2.5 py-0.5 rounded bg-[#437596] text-white font-mono text-[10px] font-bold">
                      02 CONTENT
                    </span>
                    <h4 className={`text-base font-bold font-mono ${themeClasses.bodyTitle}`}>內容應用</h4>
                    <p className={`text-xs font-bold font-mono text-[#437596] dark:text-[#6CA4C8]`}>
                      「讓 MUMㄠ 持續產生可以被觀看、分享與互動的內容。」
                    </p>
                    <p className={`text-xs leading-relaxed ${themeClasses.bodySubText}`}>
                      Instagram 圖像連載、聽團四格漫畫、通訊軟體貼圖與現場迷因，建立高黏著度社群體驗。
                    </p>
                  </div>
                  <div className={`pt-3 border-t text-[10px] font-mono space-y-1 ${themeClasses.borderColSubtle} ${themeClasses.bodySubText}`}>
                    <div>• Social Content</div>
                    <div>• Comic Series</div>
                    <div>• Sticker Set</div>
                    <div>• Meme & Character Art</div>
                  </div>
                </div>

                <div className={`p-6 rounded-2xl border space-y-4 flex flex-col justify-between ${themeClasses.cardBg} ${themeClasses.borderColSubtle}`}>
                  <div className="space-y-3">
                    <span className="px-2.5 py-0.5 rounded bg-[#E8829C] text-white font-mono text-[10px] font-bold">
                      03 PRODUCT
                    </span>
                    <h4 className={`text-base font-bold font-mono ${themeClasses.bodyTitle}`}>商品應用</h4>
                    <p className={`text-xs font-bold font-mono text-[#E8829C] dark:text-[#F49BB2]`}>
                      「將角色識別轉化成可以穿戴、使用與收藏的商品。」
                    </p>
                    <p className={`text-xs leading-relaxed ${themeClasses.bodySubText}`}>
                      緹花搖滾毛巾、防水塗層貼紙、金屬胸章與野餐墊，延伸至日常穿搭與活動用品。
                    </p>
                  </div>
                  <div className={`pt-3 border-t text-[10px] font-mono space-y-1 ${themeClasses.borderColSubtle} ${themeClasses.bodySubText}`}>
                    <div>• Towel & Apparel</div>
                    <div>• Vinyl Sticker</div>
                    <div>• Metal Badge</div>
                    <div>• Outdoor Accessories</div>
                  </div>
                </div>

                <div className={`p-6 rounded-2xl border space-y-4 flex flex-col justify-between ${themeClasses.cardBg} ${themeClasses.borderColSubtle}`}>
                  <div className="space-y-3">
                    <span className="px-2.5 py-0.5 rounded bg-amber-600 text-white font-mono text-[10px] font-bold">
                      04 COLLABORATION
                    </span>
                    <h4 className={`text-base font-bold font-mono ${themeClasses.bodyTitle}`}>合作應用</h4>
                    <p className={`text-xs font-bold font-mono text-amber-600 dark:text-amber-400`}>
                      「讓 MUMㄠ 成為不同文化與創意合作中的角色資產。」
                    </p>
                    <p className={`text-xs leading-relaxed ${themeClasses.bodySubText}`}>
                      樂團聯名視覺、音樂祭周邊合作、創作者跨界企劃與文化品牌攜手，雙向擴張影響力。
                    </p>
                  </div>
                  <div className={`pt-3 border-t text-[10px] font-mono space-y-1 ${themeClasses.borderColSubtle} ${themeClasses.bodySubText}`}>
                    <div>• Band & Music</div>
                    <div>• Festival Partner</div>
                    <div>• Artist Collaboration</div>
                    <div>• Lifestyle Brand</div>
                  </div>
                </div>
              </div>
            </div>

            {/* MUMㄠ IP APPLICATION FLOW (05 | 商業運作邏輯) */}
            <div className={`p-6 sm:p-8 rounded-2xl border space-y-6 ${themeClasses.cardBg} ${themeClasses.borderColSubtle}`}>
              <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b pb-4 gap-2 border-black/5 dark:border-white/5">
                <div>
                  <span className={`text-xs font-mono font-bold uppercase tracking-widest block ${isDark ? "text-[#6CA4C8]" : "text-[#437596]"}`}>
                    MUMㄠ IP APPLICATION FLOW
                  </span>
                  <h3 className={`text-xl font-bold font-mono mt-0.5 ${themeClasses.bodyTitle}`}>
                    IP 商業發展邏輯演進鏈
                  </h3>
                </div>
                <span className={`text-xs font-mono ${themeClasses.bodySubText}`}>
                  6-STEP EVOLUTION
                </span>
              </div>

              {/* Step Flow */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 font-mono text-xs">
                <div className={`p-4 rounded-xl border space-y-1 text-center ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                  <span className="text-[10px] font-bold text-zinc-400 block">STEP 01</span>
                  <div className="font-bold text-zinc-800 dark:text-zinc-100">CHARACTER</div>
                  <div className="text-[11px] text-[#437596] dark:text-[#6CA4C8]">角色原型</div>
                </div>

                <div className={`p-4 rounded-xl border space-y-1 text-center ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                  <span className="text-[10px] font-bold text-zinc-400 block">STEP 02</span>
                  <div className="font-bold text-zinc-800 dark:text-zinc-100">IDENTITY</div>
                  <div className="text-[11px] text-[#437596] dark:text-[#6CA4C8]">建立品牌</div>
                </div>

                <div className={`p-4 rounded-xl border space-y-1 text-center ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                  <span className="text-[10px] font-bold text-zinc-400 block">STEP 03</span>
                  <div className="font-bold text-[#437596] dark:text-[#6CA4C8]">CONTENT</div>
                  <div className="text-[11px] text-[#437596] dark:text-[#6CA4C8]">產生內容</div>
                </div>

                <div className={`p-4 rounded-xl border space-y-1 text-center ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                  <span className="text-[10px] font-bold text-zinc-400 block">STEP 04</span>
                  <div className="font-bold text-[#E8829C] dark:text-[#F49BB2]">CULTURE</div>
                  <div className="text-[11px] text-[#E8829C] dark:text-[#F49BB2]">進入文化</div>
                </div>

                <div className={`p-4 rounded-xl border space-y-1 text-center ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                  <span className="text-[10px] font-bold text-zinc-400 block">STEP 05</span>
                  <div className="font-bold text-zinc-800 dark:text-zinc-100">PRODUCT</div>
                  <div className="text-[11px] text-zinc-500">形成商品</div>
                </div>

                <div className={`p-4 rounded-xl border space-y-1 text-center ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                  <span className="text-[10px] font-bold text-zinc-400 block">STEP 06</span>
                  <div className="font-bold text-amber-600 dark:text-amber-400">COLLABORATION</div>
                  <div className="text-[11px] text-amber-600 dark:text-amber-400">產生合作</div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl border bg-zinc-900 text-white font-mono text-center text-xs">
                <span className="text-zinc-400">COMMERCIAL LOGIC: </span>
                <span className="font-bold text-[#6CA4C8]">角色</span> ➔ 
                <span className="font-bold text-zinc-200"> 建立品牌</span> ➔ 
                <span className="font-bold text-[#6CA4C8]"> 產生內容</span> ➔ 
                <span className="font-bold text-[#F49BB2]"> 進入文化</span> ➔ 
                <span className="font-bold text-zinc-200"> 形成商品</span> ➔ 
                <span className="font-bold text-amber-400"> 產生合作</span>
              </div>
            </div>

            {/* FROM ASSET TO APPLICATION (06 | 品牌資產對應應用) */}
            <div className={`p-6 sm:p-8 rounded-2xl border space-y-6 ${themeClasses.cardBg} ${themeClasses.borderColSubtle}`}>
              <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b pb-4 gap-2 border-black/5 dark:border-white/5">
                <div>
                  <span className={`text-xs font-mono font-bold uppercase tracking-widest block ${isDark ? "text-[#6CA4C8]" : "text-[#437596]"}`}>
                    FROM ASSET TO APPLICATION
                  </span>
                  <h3 className={`text-xl font-bold font-mono mt-0.5 ${themeClasses.bodyTitle}`}>
                    品牌資產落地真實應用對照
                  </h3>
                </div>
                <span className={`text-xs font-mono ${themeClasses.bodySubText}`}>
                  ASSET EXECUTION
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
                <div className={`p-4 rounded-xl border space-y-2 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                  <div className="flex items-center justify-between border-b pb-2 border-black/5 dark:border-white/5">
                    <span className="font-bold text-zinc-800 dark:text-zinc-100">01. MUM CHARACTER</span>
                    <span className="text-[10px] text-[#437596] dark:text-[#6CA4C8]">IP ASSET</span>
                  </div>
                  <div className="text-[11px] text-[#437596] dark:text-[#6CA4C8]">
                    Character Illustration ➔ Social ➔ Merch ➔ Festival
                  </div>
                  <p className={`text-xs ${themeClasses.bodySubText}`}>
                    角色繪稿為核心資產，可彈性改編為社群連載、周邊印花與舞台主視覺。
                  </p>
                </div>

                <div className={`p-4 rounded-xl border space-y-2 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                  <div className="flex items-center justify-between border-b pb-2 border-black/5 dark:border-white/5">
                    <span className="font-bold text-[#437596] dark:text-[#6CA4C8]">02. ㄠ MARK</span>
                    <span className="text-[10px] text-[#437596] dark:text-[#6CA4C8]">LOGOTYPE</span>
                  </div>
                  <div className="text-[11px] text-[#437596] dark:text-[#6CA4C8]">
                    Logo ➔ Pattern ➔ Sticker ➔ Packaging
                  </div>
                  <p className={`text-xs ${themeClasses.bodySubText}`}>
                    注音符號「ㄠ」作為台灣在地標誌，可獨立成 LOGO、連續二方連續與包裝鋼印。
                  </p>
                </div>

                <div className={`p-4 rounded-xl border space-y-2 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                  <div className="flex items-center justify-between border-b pb-2 border-black/5 dark:border-white/5">
                    <span className="font-bold text-[#E8829C] dark:text-[#F49BB2]">03. WAVE WHISKERS</span>
                    <span className="text-[10px] text-[#E8829C] dark:text-[#F49BB2]">GRAPHIC MOTIF</span>
                  </div>
                  <div className="text-[11px] text-[#E8829C] dark:text-[#F49BB2]">
                    Graphic Motif ➔ Poster ➔ Textile ➔ Motion
                  </div>
                  <p className={`text-xs ${themeClasses.bodySubText}`}>
                    湛藍音波鬍鬚化身滿版織品圖案、海報分割線與動態聲波頻率。
                  </p>
                </div>

                <div className={`p-4 rounded-xl border space-y-2 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                  <div className="flex items-center justify-between border-b pb-2 border-black/5 dark:border-white/5">
                    <span className="font-bold text-amber-600 dark:text-amber-400">04. MUM COLOR SYSTEM</span>
                    <span className="text-[10px] text-amber-600 dark:text-amber-400">COLOR PALETTE</span>
                  </div>
                  <div className="text-[11px] text-amber-600 dark:text-amber-400">
                    Print ➔ Digital ➔ Merchandise ➔ Environment
                  </div>
                  <p className={`text-xs ${themeClasses.bodySubText}`}>
                    以 MUM White、Wave Blue 與 Ear Pink 建立全媒介跨載體一致色彩。
                  </p>
                </div>
              </div>
            </div>

            {/* IP APPLICATION LEVELS & VALUE MODEL (07 & 09 | 商業應用層級與價值模型) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* APPLICATION LEVELS */}
              <div className={`p-6 rounded-2xl border space-y-4 ${themeClasses.cardBg} ${themeClasses.borderColSubtle}`}>
                <div className="border-b pb-3 border-black/5 dark:border-white/5">
                  <span className={`text-xs font-mono font-bold uppercase tracking-widest block ${isDark ? "text-[#6CA4C8]" : "text-[#437596]"}`}>
                    IP APPLICATION LEVELS
                  </span>
                  <h3 className={`text-base font-bold font-mono ${themeClasses.bodyTitle}`}>
                    IP 商業應用五大深度層級
                  </h3>
                </div>

                <div className="space-y-2 font-mono text-xs">
                  <div className={`p-2.5 rounded-lg border space-y-1 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                    <div className="flex justify-between font-bold text-zinc-800 dark:text-zinc-100">
                      <span>01. CORE / 角色識別</span>
                      <span className="text-[#437596] dark:text-[#6CA4C8]">BASE</span>
                    </div>
                    <p className={themeClasses.bodySubText}>Character, Logo, Color, Language</p>
                  </div>

                  <div className={`p-2.5 rounded-lg border space-y-1 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                    <div className="flex justify-between font-bold text-[#437596] dark:text-[#6CA4C8]">
                      <span>02. CONTENT / 內容</span>
                      <span>SPREAD</span>
                    </div>
                    <p className={themeClasses.bodySubText}>Social, Comic, Sticker, Meme</p>
                  </div>

                  <div className={`p-2.5 rounded-lg border space-y-1 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                    <div className="flex justify-between font-bold text-[#E8829C] dark:text-[#F49BB2]">
                      <span>03. EXPERIENCE / 體驗</span>
                      <span>SCENE</span>
                    </div>
                    <p className={themeClasses.bodySubText}>Festival, Exhibition, Event, Installation</p>
                  </div>

                  <div className={`p-2.5 rounded-lg border space-y-1 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                    <div className="flex justify-between font-bold text-zinc-800 dark:text-zinc-200">
                      <span>04. PRODUCT / 商品</span>
                      <span>CONVERSION</span>
                    </div>
                    <p className={themeClasses.bodySubText}>Merch, Apparel, Accessories, Collectibles</p>
                  </div>

                  <div className={`p-2.5 rounded-lg border space-y-1 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                    <div className="flex justify-between font-bold text-amber-600 dark:text-amber-400">
                      <span>05. COLLABORATION / 合作</span>
                      <span>EXPANSION</span>
                    </div>
                    <p className={themeClasses.bodySubText}>Artist, Band, Festival, Brand</p>
                  </div>
                </div>
              </div>

              {/* IP VALUE MODEL */}
              <div className={`p-6 rounded-2xl border space-y-4 flex flex-col justify-between ${themeClasses.cardBg} ${themeClasses.borderColSubtle}`}>
                <div className="space-y-3">
                  <div className="border-b pb-3 border-black/5 dark:border-white/5">
                    <span className={`text-xs font-mono font-bold uppercase tracking-widest block ${isDark ? "text-[#6CA4C8]" : "text-[#437596]"}`}>
                      IP VALUE MODEL
                    </span>
                    <h3 className={`text-base font-bold font-mono ${themeClasses.bodyTitle}`}>
                      MUMㄠ IP 商業價值方程式
                    </h3>
                  </div>

                  <p className={`text-xs leading-relaxed ${themeClasses.bodySubText}`}>
                    不只是繪製角色，而是建立可長期複利增值的 IP 商業資產。
                  </p>

                  <div className="space-y-2 font-mono text-xs">
                    <div className={`p-2.5 rounded-lg border flex items-center justify-between ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                      <span className="font-bold text-zinc-800 dark:text-zinc-100">IDENTITY (角色辨識)</span>
                      <span className="text-[10px] text-[#437596] dark:text-[#6CA4C8]">視覺識別資產</span>
                    </div>
                    <div className={`p-2.5 rounded-lg border flex items-center justify-between ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                      <span className="font-bold text-[#437596] dark:text-[#6CA4C8]">CULTURE (文化認同)</span>
                      <span className="text-[10px] text-[#437596] dark:text-[#6CA4C8]">聽團次文化歸屬</span>
                    </div>
                    <div className={`p-2.5 rounded-lg border flex items-center justify-between ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                      <span className="font-bold text-[#E8829C] dark:text-[#F49BB2]">CONTENT (內容傳播)</span>
                      <span className="text-[10px] text-[#E8829C] dark:text-[#F49BB2]">社群互動分享</span>
                    </div>
                    <div className={`p-2.5 rounded-lg border flex items-center justify-between ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                      <span className="font-bold text-amber-600 dark:text-amber-400">PRODUCT (商品轉換)</span>
                      <span className="text-[10px] text-amber-600 dark:text-amber-400">實體變現體驗</span>
                    </div>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl border bg-zinc-900 text-white font-mono text-center text-xs font-bold space-y-1">
                  <div className="text-[10px] text-zinc-400">EQUALS TO</div>
                  <div className="text-sm text-[#6CA4C8] tracking-widest">MUMㄠ IP VALUE</div>
                  <div className="text-[10px] text-zinc-300">角色辨識 + 文化認同 + 內容傳播 + 商品轉換</div>
                </div>
              </div>
            </div>

            {/* POTENTIAL COLLABORATION DIRECTIONS (08 | 跨界合作方向 ‧ 無虛構案例) */}
            <div className={`p-6 sm:p-8 rounded-2xl border space-y-6 ${themeClasses.cardBg} ${themeClasses.borderColSubtle}`}>
              <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b pb-4 gap-2 border-black/5 dark:border-white/5">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-amber-600 text-white font-mono text-[10px] font-bold">
                      POTENTIAL
                    </span>
                    <span className={`text-xs font-mono font-bold uppercase tracking-widest block ${isDark ? "text-[#6CA4C8]" : "text-[#437596]"}`}>
                      POTENTIAL COLLABORATION DIRECTION
                    </span>
                  </div>
                  <h3 className={`text-xl font-bold font-mono mt-1 ${themeClasses.bodyTitle}`}>
                    未來跨界合作地圖 (COLLABORATION DIRECTION)
                  </h3>
                </div>
                <span className={`text-xs font-mono ${themeClasses.bodySubText}`}>
                  FUTURE OPPORTUNITIES
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs">
                <div className={`p-4 rounded-xl border space-y-2 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                  <span className="text-[10px] font-bold text-[#437596] dark:text-[#6CA4C8]">01. MUSIC</span>
                  <h4 className={`text-sm font-bold ${themeClasses.bodyTitle}`}>音樂人 / 樂團</h4>
                  <p className={`text-xs ${themeClasses.bodySubText}`}>
                    單曲 Cover 繪製、巡演限量聯名周邊、MV 動畫插畫。
                  </p>
                </div>

                <div className={`p-4 rounded-xl border space-y-2 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                  <span className="text-[10px] font-bold text-[#E8829C] dark:text-[#F49BB2]">02. FESTIVAL</span>
                  <h4 className={`text-sm font-bold ${themeClasses.bodyTitle}`}>音樂祭 / 大型活動</h4>
                  <p className={`text-xs ${themeClasses.bodySubText}`}>
                    官方周邊圖像授權、現場巨型打卡裝置、周邊聯名商品。
                  </p>
                </div>

                <div className={`p-4 rounded-xl border space-y-2 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                  <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400">03. ART</span>
                  <h4 className={`text-sm font-bold ${themeClasses.bodyTitle}`}>插畫家 / 藝術家</h4>
                  <p className={`text-xs ${themeClasses.bodySubText}`}>
                    藝術家聯名創作、獨立小誌 (Zine) 雙向畫冊合輯。
                  </p>
                </div>

                <div className={`p-4 rounded-xl border space-y-2 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                  <span className="text-[10px] font-bold text-zinc-800 dark:text-zinc-200">04. BRAND</span>
                  <h4 className={`text-sm font-bold ${themeClasses.bodyTitle}`}>生活品牌 / 文化品牌</h4>
                  <p className={`text-xs ${themeClasses.bodySubText}`}>
                    啤酒酒精飲料、露營精緻道具、街頭服飾品牌合作。
                  </p>
                </div>
              </div>
            </div>

            {/* SCALABLE IP SYSTEM & FIXED vs FLEXIBLE (10 | 可持續延伸) */}
            <div className={`p-6 sm:p-8 rounded-2xl border space-y-6 ${themeClasses.cardBg} ${themeClasses.borderColSubtle}`}>
              <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b pb-4 gap-2 border-black/5 dark:border-white/5">
                <div>
                  <span className={`text-xs font-mono font-bold uppercase tracking-widest block ${isDark ? "text-[#6CA4C8]" : "text-[#437596]"}`}>
                    SCALABLE IP SYSTEM
                  </span>
                  <h3 className={`text-xl font-bold font-mono mt-0.5 ${themeClasses.bodyTitle}`}>
                    固定核心與彈性擴充系統 (FIXED vs. FLEXIBLE)
                  </h3>
                </div>
                <span className={`text-xs font-mono ${themeClasses.bodySubText}`}>
                  SYSTEM FLEXIBILITY
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
                {/* FIXED */}
                <div className={`p-5 rounded-xl border space-y-3 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                  <div className="flex items-center justify-between border-b pb-2 border-black/5 dark:border-white/5">
                    <span className="font-bold text-zinc-800 dark:text-zinc-100">FIXED (固定不變)</span>
                    <span className="px-2 py-0.5 rounded bg-zinc-900 text-white text-[10px] font-bold">CORE IDENTITY</span>
                  </div>
                  <div className="space-y-1.5 text-zinc-700 dark:text-zinc-300">
                    <div>• 角色特徵 (Character Identity)</div>
                    <div>• 品牌色彩 (Wave Blue, Ear Pink, Mum White)</div>
                    <div>• 核心識別 (注音「ㄠ」LOGOTYPE)</div>
                    <div>• 關鍵符號 (Wave Whiskers 音波鬍鬚)</div>
                    <div>• 品牌語言 (Verbal Identity & Tone)</div>
                  </div>
                </div>

                {/* FLEXIBLE */}
                <div className={`p-5 rounded-xl border space-y-3 ${themeClasses.cardSubtleBg} ${themeClasses.borderBlueAccent}`}>
                  <div className="flex items-center justify-between border-b pb-2 border-black/5 dark:border-white/5">
                    <span className="font-bold text-[#437596] dark:text-[#6CA4C8]">FLEXIBLE (彈性擴張)</span>
                    <span className="px-2 py-0.5 rounded bg-[#437596] text-white text-[10px] font-bold">APPLICATION</span>
                  </div>
                  <div className="space-y-1.5 text-[#437596] dark:text-[#6CA4C8]">
                    <div>• 音樂祭活動 (Festival Visuals)</div>
                    <div>• 社群內容與迷因 (Content & Memes)</div>
                    <div>• 實體周邊產品 (Merchandise)</div>
                    <div>• 跨界聯名企劃 (Collaboration)</div>
                    <div>• 生活風格場景 (Lifestyle Experience)</div>
                  </div>
                </div>
              </div>

              {/* Re-quote statement */}
              <div className="p-4 rounded-xl border border-[#437596]/30 bg-[#437596]/5 text-center font-mono text-sm font-bold text-[#437596] dark:text-[#6CA4C8]">
                「角色不變，世界一直變。」— THE CORE STAYS FIXED, THE CONTEXT KEEPS EXPANDING.
              </div>
            </div>

            {/* IP LIFE CYCLE & COMMUNITY IDENTITY (12 & 13 | IP 生命周期與社群認同) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* LIFE CYCLE LOOP */}
              <div className={`p-6 rounded-2xl border space-y-4 ${themeClasses.cardBg} ${themeClasses.borderColSubtle}`}>
                <div className="border-b pb-3 border-black/5 dark:border-white/5">
                  <span className={`text-xs font-mono font-bold uppercase tracking-widest block ${isDark ? "text-[#6CA4C8]" : "text-[#437596]"}`}>
                    IP LIFE CYCLE
                  </span>
                  <h3 className={`text-base font-bold font-mono ${themeClasses.bodyTitle}`}>
                    IP 正向循環生命週期
                  </h3>
                </div>

                <div className="font-mono text-xs space-y-2">
                  <div className="p-2.5 rounded-lg border bg-zinc-900 text-white font-bold flex justify-between">
                    <span>1. CHARACTER</span>
                    <span className="text-[#6CA4C8]">原創角色建立</span>
                  </div>
                  <div className="p-2.5 rounded-lg border border-black/10 dark:border-white/10 flex justify-between">
                    <span>2. AUDIENCE</span>
                    <span>吸引聽團群眾</span>
                  </div>
                  <div className="p-2.5 rounded-lg border border-black/10 dark:border-white/10 flex justify-between">
                    <span>3. CONTENT</span>
                    <span className="text-[#437596] dark:text-[#6CA4C8]">連載內容互動</span>
                  </div>
                  <div className="p-2.5 rounded-lg border border-black/10 dark:border-white/10 flex justify-between">
                    <span>4. COMMUNITY</span>
                    <span className="text-[#E8829C] dark:text-[#F49BB2]">姆貓教社群形成</span>
                  </div>
                  <div className="p-2.5 rounded-lg border border-black/10 dark:border-white/10 flex justify-between">
                    <span>5. PRODUCT</span>
                    <span>周邊購買配戴</span>
                  </div>
                  <div className="p-2.5 rounded-lg border border-black/10 dark:border-white/10 flex justify-between">
                    <span>6. COLLABORATION</span>
                    <span className="text-amber-600 dark:text-amber-400">跨界合作擴散</span>
                  </div>
                  <div className="p-2.5 rounded-lg border bg-[#E8829C]/10 border-[#E8829C] text-[#E8829C] font-bold text-center">
                    ➔ LOOPS BACK TO NEW CONTENT (持續循環擴展)
                  </div>
                </div>
              </div>

              {/* COMMUNITY IDENTITY */}
              <div className={`p-6 rounded-2xl border space-y-4 flex flex-col justify-between ${themeClasses.cardBg} ${themeClasses.borderColSubtle}`}>
                <div className="space-y-3">
                  <div className="border-b pb-3 border-black/5 dark:border-white/5">
                    <span className={`text-xs font-mono font-bold uppercase tracking-widest block ${isDark ? "text-[#6CA4C8]" : "text-[#437596]"}`}>
                      MUMㄠ COMMUNITY IDENTITY
                    </span>
                    <h3 className={`text-base font-bold font-mono ${themeClasses.bodyTitle}`}>
                      聽團社群與歸屬認同 (MUMㄠ COMMUNITY)
                    </h3>
                  </div>

                  <p className={`text-xs font-bold font-mono text-[#E8829C] dark:text-[#F49BB2]`}>
                    「喜歡音樂的人，因為共同的現場經驗而聚在一起。」
                  </p>

                  <p className={`text-xs leading-relaxed ${themeClasses.bodySubText}`}>
                    「姆貓教」不只是角色設定，更是一種聽團文化的身份認同。透過現場經驗與共同記憶，凝聚忠實教徒。
                  </p>

                  <div className="grid grid-cols-3 gap-2 font-mono text-center text-xs">
                    <div className={`p-3 rounded-lg border ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                      <span className="font-bold text-[#437596] dark:text-[#6CA4C8] block">MUSIC</span>
                      <span className="text-[10px] text-zinc-500">音樂體驗</span>
                    </div>

                    <div className={`p-3 rounded-lg border ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                      <span className="font-bold text-[#E8829C] dark:text-[#F49BB2] block">MEMORY</span>
                      <span className="text-[10px] text-zinc-500">現場記憶</span>
                    </div>

                    <div className={`p-3 rounded-lg border ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                      <span className="font-bold text-amber-600 dark:text-amber-400 block">BELONGING</span>
                      <span className="text-[10px] text-zinc-500">文化歸屬</span>
                    </div>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl border bg-zinc-900 text-white text-center font-mono text-xs font-bold">
                  MUSIC + MEMORY + BELONGING = MUMㄠ COMMUNITY
                </div>
              </div>
            </div>

            {/* FUTURE ROADMAP / POTENTIAL (11 | 未來應用藍圖) */}
            <div className={`p-6 sm:p-8 rounded-2xl border space-y-6 ${themeClasses.cardBg} ${themeClasses.borderColSubtle}`}>
              <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b pb-4 gap-2 border-black/5 dark:border-white/5">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-zinc-800 text-white font-mono text-[10px] font-bold">
                      ROADMAP
                    </span>
                    <span className={`text-xs font-mono font-bold uppercase tracking-widest block ${isDark ? "text-[#6CA4C8]" : "text-[#437596]"}`}>
                      POTENTIAL / FUTURE ROADMAP
                    </span>
                  </div>
                  <h3 className={`text-xl font-bold font-mono mt-1 ${themeClasses.bodyTitle}`}>
                    未來應用藍圖 (FUTURE APPLICATION)
                  </h3>
                </div>
                <span className={`text-xs font-mono ${themeClasses.bodySubText}`}>
                  6 FUTURE DIRECTIONS
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 font-mono text-xs">
                <div className={`p-3.5 rounded-xl border space-y-1 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                  <span className="text-[10px] font-bold text-zinc-400 block">01. APPAREL</span>
                  <div className={`font-bold ${themeClasses.bodyTitle}`}>服飾線</div>
                  <p className={`text-[10px] ${themeClasses.bodySubText}`}>TEE ‧ 帽子 ‧ 襪款</p>
                </div>

                <div className={`p-3.5 rounded-xl border space-y-1 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                  <span className="text-[10px] font-bold text-[#437596] dark:text-[#6CA4C8] block">02. LIVE GOODS</span>
                  <div className={`font-bold ${themeClasses.bodyTitle}`}>現場周邊</div>
                  <p className={`text-[10px] ${themeClasses.bodySubText}`}>雨衣 ‧ 水壺 ‧ 耳塞</p>
                </div>

                <div className={`p-3.5 rounded-xl border space-y-1 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                  <span className="text-[10px] font-bold text-[#E8829C] dark:text-[#F49BB2] block">03. PUBLISHING</span>
                  <div className={`font-bold ${themeClasses.bodyTitle}`}>出版物</div>
                  <p className={`text-[10px] ${themeClasses.bodySubText}`}>Zine ‧ 畫冊 ‧ 貼圖</p>
                </div>

                <div className={`p-3.5 rounded-xl border space-y-1 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                  <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 block">04. COLLECTIBLES</span>
                  <div className={`font-bold ${themeClasses.bodyTitle}`}>收藏品</div>
                  <p className={`text-[10px] ${themeClasses.bodySubText}`}>公仔 ‧ 軟膠 ‧ 擺飾</p>
                </div>

                <div className={`p-3.5 rounded-xl border space-y-1 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                  <span className="text-[10px] font-bold text-zinc-400 block">05. CO-BRAND</span>
                  <div className={`font-bold ${themeClasses.bodyTitle}`}>聯名商品</div>
                  <p className={`text-[10px] ${themeClasses.bodySubText}`}>啤酒 ‧ 露營 ‧ 街頭</p>
                </div>

                <div className={`p-3.5 rounded-xl border space-y-1 ${themeClasses.cardSubtleBg} ${themeClasses.borderColSubtle}`}>
                  <span className="text-[10px] font-bold text-[#437596] dark:text-[#6CA4C8] block">06. DIGITAL</span>
                  <div className={`font-bold ${themeClasses.bodyTitle}`}>數位內容</div>
                  <p className={`text-[10px] ${themeClasses.bodySubText}`}>動態桌布 ‧ 音效包</p>
                </div>
              </div>
            </div>
          </section>

          {/* ===== 10. FINAL STATEMENT & BRAND CLOSING (品牌情緒收尾頁) ===== */}
          <section id="final-statement" className={`pt-20 pb-16 space-y-16 text-left border-t ${themeClasses.borderColSubtle}`}>
            
            {/* Wave Whisker Divider Line */}
            <div className="flex justify-center opacity-70 my-4">
              <SoundwaveDivider isDark={isDark} color={isDark ? "#6CA4C8" : "#437596"} className="w-full max-w-xl" />
            </div>

            {/* 02｜上方小標 */}
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#E8829C]" />
              <span className={`text-xs font-mono font-bold uppercase tracking-widest ${isDark ? "text-[#6CA4C8]" : "text-[#437596]"}`}>
                MUMㄠ · FINAL STATEMENT
              </span>
            </div>

            {/* 03｜主標題 Editorial Headline */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pt-2">
              <div className="space-y-4">
                <h2 className={`text-4xl sm:text-6xl md:text-7xl font-black font-mono tracking-tight leading-[1.15] ${themeClasses.bodyTitle}`}>
                  MUMㄠ，<br />
                  從一隻貓開始。
                </h2>
                <p className={`text-2xl sm:text-4xl font-bold font-mono tracking-tight text-[#437596] dark:text-[#6CA4C8] leading-tight`}>
                  走進音樂，走進現場，<br />
                  也走進大家的日常。
                </p>
              </div>

              <div className="lg:max-w-xs space-y-1.5 border-l-2 border-[#E8829C]/50 pl-4 py-1">
                <span className="text-xs font-mono font-bold tracking-wider block text-[#E8829C] dark:text-[#F49BB2]">
                  BRAND MANIFESTO
                </span>
                <p className={`text-xs font-mono tracking-widest leading-relaxed uppercase ${themeClasses.bodySubText}`}>
                  FROM A CHARACTER<br />
                  TO A SHARED CULTURAL EXPERIENCE.
                </p>
              </div>
            </div>

            {/* 04｜品牌故事式結語 (80-110字) */}
            <div className="max-w-2xl pt-2 space-y-4">
              <p className={`text-base sm:text-lg leading-relaxed font-normal ${themeClasses.bodyText}`}>
                「MUMㄠ 是一隻喜歡音樂、喜歡聽團，也喜歡跑音樂祭的白貓。<br className="hidden sm:inline" />
                從一個簡單的角色開始，慢慢長出自己的語言、顏色、音樂與現場記憶。<br className="hidden sm:inline" />
                而『姆貓教』，不是要大家信仰一隻貓。<br className="hidden sm:inline" />
                只是因為喜歡同一種聲音，在同一個現場，一起揮著毛巾而已。」
              </p>
            </div>

            {/* 07｜COMMUNITY 概念 (音樂 ‧ 記憶 ‧ 一起在現場) */}
            <div className="pt-6 space-y-3">
              <span className={`text-xs font-mono font-bold uppercase tracking-widest block ${isDark ? "text-[#6CA4C8]" : "text-[#437596]"}`}>
                MUMㄠ COMMUNITY
              </span>
              <div className="flex flex-wrap items-center gap-x-8 gap-y-3 font-mono text-sm sm:text-base font-bold">
                <div className="flex items-baseline gap-2">
                  <span className="text-[#437596] dark:text-[#6CA4C8] text-xs">01</span>
                  <span className={themeClasses.bodyTitle}>MUSIC</span>
                  <span className={`text-xs font-normal ${themeClasses.bodySubText}`}>/ 音樂</span>
                </div>
                <span className="text-[#E8829C]">•</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-[#437596] dark:text-[#6CA4C8] text-xs">02</span>
                  <span className={themeClasses.bodyTitle}>MEMORY</span>
                  <span className={`text-xs font-normal ${themeClasses.bodySubText}`}>/ 記憶</span>
                </div>
                <span className="text-[#E8829C]">•</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-[#437596] dark:text-[#6CA4C8] text-xs">03</span>
                  <span className={themeClasses.bodyTitle}>BELONGING</span>
                  <span className={`text-xs font-normal ${themeClasses.bodySubText}`}>/ 一起在現場</span>
                </div>
              </div>
            </div>

            {/* 05 & 06｜BRAND LINE & CORE SYMBOL (「全是感情，還有音樂。」 Signature) */}
            <div className="pt-12 pb-10 flex flex-col md:flex-row items-start md:items-end justify-between gap-8 border-t border-b border-black/10 dark:border-white/10 my-10">
              <div className="space-y-3 max-w-xl">
                <span className="text-[10px] font-mono tracking-widest text-[#E8829C] dark:text-[#F49BB2] uppercase font-bold block">
                  BRAND SIGNATURE
                </span>
                <h3 className="text-4xl sm:text-6xl md:text-7xl font-black font-mono tracking-tight leading-tight text-[#E8829C] dark:text-[#F49BB2]">
                  「全是感情，<br />
                  　還有音樂。」
                </h3>
                <p className="text-sm font-mono tracking-widest text-[#437596] dark:text-[#6CA4C8] pt-1 uppercase font-bold">
                  ALL FEELINGS. ALL MUSIC.
                </p>
              </div>

              {/* 06｜MUMㄠ 核心符號 Brand Mark (ㄠ + WAVE WHISKERS) */}
              <div className="flex flex-col items-start md:items-end space-y-2 opacity-90">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-3xl font-black text-[#437596] dark:text-[#6CA4C8] border-2 border-[#437596]/50 dark:border-[#6CA4C8]/50 px-3 py-1 rounded-lg bg-[#437596]/5 dark:bg-[#6CA4C8]/5">
                    ㄠ
                  </span>
                  <div className="flex flex-col">
                    <span className="text-xs font-mono font-bold tracking-widest text-zinc-800 dark:text-zinc-200">
                      MUMㄠ
                    </span>
                    <span className="text-[10px] font-mono text-[#437596] dark:text-[#6CA4C8] uppercase tracking-wider font-bold">
                      WAVE WHISKERS
                    </span>
                  </div>
                </div>
                {/* Micro Soundwave Graphic */}
                <div className="flex items-center gap-1.5 h-4 pt-1">
                  <span className="w-1 h-2 bg-[#437596] dark:bg-[#6CA4C8] rounded-full animate-pulse" />
                  <span className="w-1 h-4 bg-[#E8829C] rounded-full" />
                  <span className="w-1 h-3 bg-[#437596] dark:bg-[#6CA4C8] rounded-full" />
                  <span className="w-1 h-1 bg-[#E8829C] rounded-full" />
                  <span className="w-1 h-3.5 bg-[#437596] dark:bg-[#6CA4C8] rounded-full" />
                </div>
              </div>
            </div>

            {/* 08｜按鈕處理 (降低視覺權重，讓主角維持品牌文字) */}
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
                  className={`px-4 py-2 rounded-full border text-[11px] font-mono transition-all cursor-pointer ${
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
