import { PortfolioItem } from "./types";

export const initialPortfolioData: PortfolioItem[] = [
  {
    id: "1",
    category: "角色IP設計",
    title: "時空旅人：啵啵 (BOBO)",
    titleEn: "Chronos Voyager: BOBO",
    philosophy: "BOBO 是一個來自未來星系的像素風外星生命，頭戴具有時間折射功能的復古風圓耳太空盔，象徵著童真與對宇宙的好奇。整體配色採用柔和的高級灰粉與未來感電光藍，形成撞色對比。圓滾身軀與略帶憂鬱的豆豆眼設計，能瞬間建立情感連結。其簡潔輪廓與高辨識度外觀，具備極佳的潮流盲盒玩具開發及品牌延伸潛力。",
    tools: ["Illustrator", "Photoshop", "Cinema 4D", "Midjourney"],
    imageUrl: "https://images.unsplash.com/photo-1608889174637-3c44f6326f1a?auto=format&fit=crop&q=80&w=600&h=450",
    placeholderId: "IMAGE_1",
    colorTheme: "from-pink-500 to-blue-500"
  },
  {
    id: "2",
    category: "電商Banner設計",
    title: "未來震盪：Cyber-Boost 聯名企劃",
    titleEn: "Future Shock: Cyber-Boost Campaign",
    philosophy: "針對新世代 Z 世代消費者設計的科技球鞋宣傳 Banner。畫面採用強烈的透視構圖，主角鞋款以 45 度角斜切畫面，營造迎面襲來的速度感。色彩上運用深邃的石墨黑作為底色，並以螢光綠與霓虹紫的流線光學粒子軌跡環繞，突顯鞋底「能量回彈」與「超跑避震」的科技屬性。簡約大膽的無襯線字體與幾何網格背景，將電商轉換與極致美學完美融合。",
    tools: ["Photoshop", "Blender", "Vizcom AI", "Figma"],
    imageUrl: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&q=80&w=600&h=450",
    placeholderId: "IMAGE_2",
    colorTheme: "from-emerald-400 to-violet-600"
  },
  {
    id: "3",
    category: "展演活動主視覺",
    title: "2026 數位潮汐藝術節：共生",
    titleEn: "2026 Digital Tide Art Festival: Symbiosis",
    philosophy: "以「數位媒介如潮汐般浸潤生命體」為核心概念。視覺主體是由無數流暢的 3D 三維流體曲線與半透明漸變質地交織而成的生命漩渦。配色使用深邃的海洋藍與高明度的極光綠相互暈染，局部加入珍珠霓虹光澤，呈現出迷幻的液態金屬感。構圖採用不對稱的螺旋式向心力佈局，文字排版則遵循瑞士平面學派的嚴格網格，在高度流動的視覺與極簡秩序間達到完美共生。",
    tools: ["Illustrator", "Blender", "Cinema 4D", "Photoshop"],
    imageUrl: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=600&h=450",
    placeholderId: "IMAGE_3",
    colorTheme: "from-blue-600 to-emerald-400"
  },
  {
    id: "4",
    category: "App UI/UX 原型",
    title: "AeroFlow: 智感低碳生活平台",
    titleEn: "AeroFlow: Eco-Smart Mobility Hub",
    philosophy: "旨在解決都市人群低碳出行痛點的移動端 App。UI 介面遵循極簡黑白美學與超流線圓弧設計。卡片佈局採用非對稱的 Bento Grid（便當盒佈局），將每日碳足跡減免量、出行路線推薦與空氣品質指數進行清晰的視覺層級區隔。大膽使用具微光效果的漸變藍色圓形環狀圖，提供直觀、無感、且優雅的數據視覺化回饋，極大地提升了低碳出行的日常互動趣味與用戶黏著度。",
    tools: ["Figma", "Principle", "After Effects"],
    imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=600&h=450",
    placeholderId: "IMAGE_4",
    colorTheme: "from-cyan-500 to-teal-400"
  },
  {
    id: "5",
    category: "品牌視覺識別",
    title: "極光冷萃：Aurora Brew 品牌識別系統",
    titleEn: "Aurora Coffee Brew Brand Identity",
    philosophy: "為高端冷萃咖啡設計的品牌識別與奢華包裝。標誌採用抽象的雙重幾何線條，巧妙勾勒出極光波紋與咖啡滴落的姿態。包裝瓶選用低飽和度的深琥珀色玻璃，標籤設計極致精簡，僅以無襯線黑體輔以細小的金色壓箔，在深色包裝上散發出低調神祕的奢華感，使產品在貨架上具備高度的視覺辨識力與精品儀式感。",
    tools: ["Illustrator", "Dimension", "Figma", "Midjourney"],
    imageUrl: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=600&h=450",
    placeholderId: "IMAGE_5",
    colorTheme: "from-amber-600 to-orange-400"
  },
  {
    id: "6",
    category: "展覽主視覺與海報",
    title: "失重維度：未來重力重構展",
    titleEn: "Zero Gravity: Reconstructing Dimensions",
    philosophy: "以「物理法則失效、空間重組」為發想的前衛視覺設計展海報。海報中央呈現一個被撕裂與錯位的漂浮 3D 幾何立方體，周圍環繞著極具未來主義氛圍的重力拉扯射線。色彩排版大膽拋棄繁贅雜色，僅使用經典極簡的純白、科技灰與一抹冷冽高飽和度的克萊因藍（Klein Blue），製造純粹而神秘的視覺張力，成功引發觀看者對未來維度的哲學性思考。",
    tools: ["Illustrator", "Photoshop", "Cinema 4D"],
    imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=600&h=450",
    placeholderId: "IMAGE_6",
    colorTheme: "from-blue-600 to-slate-900"
  },
  {
    id: "7",
    category: "商品商業攝影",
    title: "茂生食品：極品燕窩月餅禮盒",
    titleEn: "Mawsheng Food: Elite Swiftlet Nest Mooncake Gift Box",
    philosophy: "專為高端中秋禮贈市場打造的「茂生食品：精粹燕窩月餅禮盒」商業攝影企劃。視覺風格融合傳統東方雅致與現代奢華質感，背景選用低調深色岩板與霧面金屬器皿襯托，運用單側柔光箱（Softbox）與逆光勾勒，強調溫潤燕窩剔透之流體質地，以及月餅餅皮上的精緻工藝。整體色調以沈穩的暗墨黑搭配極致古銅金，營造華麗而不落俗套的頂級食藝美學，精準傳遞產品奢華定位與極致匠心。",
    tools: ["單眼攝影", "燈光控制", "Lightroom", "Photoshop"],
    imageUrl: "https://lh3.googleusercontent.com/d/1udB6cVB2XyCPgUwpkYMvlvyjiJlzaH41",
    placeholderId: "IMAGE_7",
    colorTheme: "from-amber-600 to-blue-900",
    images: [
      "https://lh3.googleusercontent.com/d/1udB6cVB2XyCPgUwpkYMvlvyjiJlzaH41",
      "https://lh3.googleusercontent.com/d/1GU6AvSwQzrAhFO04nacOTHOdMSIyElLg",
      "https://lh3.googleusercontent.com/d/1xlPHUpIYagYymTsDC2jotn-NCErmTWcZ",
      "https://lh3.googleusercontent.com/d/17wKjs0RY_Lb7fGJw0eu1fKNRVntOuMD6",
      "https://lh3.googleusercontent.com/d/1ormkUavOimjMEe7fTyNjiTBiyAUSwTZl",
      "https://lh3.googleusercontent.com/d/1AY5OoGsk2-_9UtMKUSmRoXegUXwGjwiX",
      "https://lh3.googleusercontent.com/d/17WvnbSTsQEG11YndzkYjs_zPsyLFn5ID",
      "https://lh3.googleusercontent.com/d/1rok--MhGJB7Yj68PiptgcoyxK1a2WCSV",
      "https://lh3.googleusercontent.com/d/1INGpWmxk2gJ9gIH5dd3W-WVilqavAdJP",
      "https://lh3.googleusercontent.com/d/18Bx5dZkFRsnsNuggs50oqu3gyKNXXf51",
      "https://lh3.googleusercontent.com/d/12LDwOx5KaJk_A6th-2vSsCpYdtbzdzH7",
      "https://lh3.googleusercontent.com/d/1BCB0lP7E3Kv_TzohFvLLDa9C5s_-Ld6c",
      "https://lh3.googleusercontent.com/d/1pcPQwW-2Hj7DQKhDdWj9aS_FMB5rs9TX"
    ]
  },
  {
    id: "8",
    category: "商品商業攝影",
    title: "紅龍食品：人氣炸物系列商品視覺與電商圖文企劃",
    titleEn: "Red Dragon / KKLife: Crispy Fried Chicken Commercial Series",
    philosophy: "針對「紅龍炸物系列（雞塊、雞柳、雞胸、烤翅）」進行的一系列產品商業攝影與電商團購圖文製作。視覺理念在於呈現金黃酥脆的手作炸物溫度，利用逆光高光勾勒金黃表皮的爽脆感，並採用深色石紋與微木質調餐具營造居酒屋般的療癒食刻。電商圖文則結合醒目飽滿的色調、大膽的標題字體與直觀的高規袋裝圖文，將商品在各大團購、餐飲批發渠道的優勢（如高性價比、免退冰即炸）進行最佳化視覺轉譯，大幅提升電商轉換率。",
    tools: ["單眼攝影", "燈光控制", "電商視覺企劃", "Photoshop", "Lightroom"],
    imageUrl: "https://lh3.googleusercontent.com/d/1RccWI-GWaOkfWVwxP7gqTk4uLRA92D7u",
    placeholderId: "IMAGE_8",
    colorTheme: "from-amber-500 to-red-700",
    images: [
      "https://lh3.googleusercontent.com/d/1RccWI-GWaOkfWVwxP7gqTk4uLRA92D7u",
      "https://lh3.googleusercontent.com/d/1Gz9VBiVnAHv2FTKmTkAF_XvKALTSZWl1",
      "https://lh3.googleusercontent.com/d/1w8UXmPH3Q87y9hZetzeakePAJKVyKTxK",
      "https://lh3.googleusercontent.com/d/1fCUxjk4k0EQvsRwsBXalsE0FhaP9r6Fr",
      "https://lh3.googleusercontent.com/d/1x9kQloVlpI2LawcVjqhJSstCVZPmVIMS",
      "https://lh3.googleusercontent.com/d/1mXEuZHPvQYp_Er8UFFUb9JjAwYM2YoJD",
      "https://lh3.googleusercontent.com/d/1-RLZbZlC1XkUtYdkL7br3NkLdpJdLH68",
      "https://lh3.googleusercontent.com/d/10gVfLayS-J-dP_7Ba7gx5km4sZelQMXG",
      "https://lh3.googleusercontent.com/d/1amJ9bKDRdI_8g-H7ZdIICc8ytBU1nf6S",
      "https://lh3.googleusercontent.com/d/11Tr9EdlM3Myw9OCOdOpjwHhVn90i_p6y",
      "https://lh3.googleusercontent.com/d/1-ZH_P0gR8gBNw8Ci0LL6ToaNGlPyMpXa",
      "https://lh3.googleusercontent.com/d/1WSrxIF54CuFcJ6lPHir6ACc0DdjUEa1V",
      "https://lh3.googleusercontent.com/d/1E1b8LRf6R6COJpS1y3YOmThFEuZ5SOsm"
    ]
  }
];
