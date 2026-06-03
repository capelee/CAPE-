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
  },
  {
    id: "9",
    category: "商品與周邊設計",
    title: "軍備局第209廠：雲豹多功能戰術輪車紀念鈦合金戶外旅行杯",
    titleEn: "MND Armaments Bureau: Clouded Leopard Multifunctional Tactical Wheeled Vehicle Memorial Titanium Cup",
    philosophy: "為國防部軍備局生產製造中心第209廠（以及第202廠共同協作）所研製與設計的「雲豹多功能戰術輪車紀念鈦合金戶外旅行杯（共三款）」。視覺設計深度融合現代軍事工業美學與極致戶外運動裝備的堅韌調性。杯身精選頂級二級純鈦材質，經防指紋噴砂處理呈現岩灰色沉穩霧面質感。杯身表面精密雷射雕刻呈現三款獨特工藝圖樣：細緻勾勒雲豹多功能戰術輪車流線型強悍車身、多重裝甲防禦結構幾何，以及崎嶇地形上的八驅輪胎胎跡。將國防科技自主之硬核實力與前衛工業設計美學，完美凝聚於精緻的高端純鈦生活器物中。",
    tools: ["產品視覺設計", "雷射雕刻工藝", "軍事周邊企劃", "Illustrator", "Photoshop"],
    imageUrl: "https://lh3.googleusercontent.com/d/1upzQ59TTjDRD1XTIz5T2sNIPi9jc2zNU?v=2",
    placeholderId: "IMAGE_9",
    colorTheme: "from-zinc-700 to-slate-900",
    images: [
      "https://lh3.googleusercontent.com/d/1upzQ59TTjDRD1XTIz5T2sNIPi9jc2zNU?v=2",
      "https://lh3.googleusercontent.com/d/19Qjs0r0EZg4spxpxD18pKs5361Dh_3pf?v=2",
      "https://lh3.googleusercontent.com/d/16J5phwsiaG9uq4X30I92BZOGVmZLPqH1?v=2",
      "https://lh3.googleusercontent.com/d/1OEa1klQ2qD8T8HYD3DRv5QV5Z5zc8UpX?v=2"
    ]
  },
  {
    id: "10",
    category: "商品與周邊設計",
    title: "PGA TOUR（美國職業高爾夫巡迴賽）紀念高爾夫球標設計",
    titleEn: "PGA TOUR Official Golf Ball Marker Design",
    philosophy: "為享譽全球的頂級運動殿堂 PGA TOUR（美國職業高爾夫巡迴賽）所傾心打造的紀念高爾夫球標（Golf Ball Marker）。本系列視覺設計在極小物理尺寸中，展現了無與倫比的精密視覺與金屬工藝美學。設計採用高經緯度磨砂烤漆、壓鑄合金、壓克力琺瑯填色等頂級禮品工藝，完美勾勒出經典 PGA TOUR 男高爾夫球手剪影標誌。細緻的同心圓雙色階梯、高飽和度的經典藍白紅運動配色，搭配精準咬合的磁吸底盤構造，使整體球標兼具實用機能與高端收藏價值，精巧呈現全天候精準擊球理念與職業賽事的榮耀質感。",
    tools: ["產品設計", "金屬工藝開發", "運動周邊企劃", "Illustrator", "Photoshop"],
    imageUrl: "https://lh3.googleusercontent.com/d/1GZCZrX8BolWjvQ25F_2XVyGsG4CLnuiX?v=2",
    placeholderId: "IMAGE_10",
    colorTheme: "from-blue-950 to-emerald-900",
    images: [
      "https://lh3.googleusercontent.com/d/1GZCZrX8BolWjvQ25F_2XVyGsG4CLnuiX?v=2",
      "https://lh3.googleusercontent.com/d/14zrlBRxbe6XBkg4cUpIJFKawMB2OVBgV?v=2",
      "https://lh3.googleusercontent.com/d/1-Vi8ys7NFQigpJ7zMHtsI9blh7bB6oNa?v=2"
    ]
  },
  {
    id: "11",
    category: "商品與周邊設計",
    title: "PGA TOUR（美國職業高爾夫巡迴賽）581紀念金屬徽章別針",
    titleEn: "PGA TOUR Official 581 Memorial Metal Pin Badge",
    philosophy: "為PGA TOUR（美國職業高爾夫巡迴賽）傾心設計的581紀念金屬徽章別針（Metal Badge Pin）。視覺與工藝設計全方位展現極致匠心：\n\n1. 烤漆與金屬線條（烤漆/琺瑯工藝）：徽章主體採用高規格鋅合金金色電鍍，外圍與數字輪廓勾勒出流暢且立體的金色金屬線條，經由凹凸模具設計實施仿琺瑯（Synthetic Enamel）與軟烤漆（Soft Enamel）高精密填色，展現富麗端莊的浮雕質感。\n\n2. 特殊紋理填料（珍珠底/閃粉效果）：數字「581」內部非單調平面烤漆，而是特別融入帶有晶亮微粒感的珍珠漆（Pearl paint）與閃粉（Glitter）配方。在光線流轉下折射出內斂深邃的星芒光澤，大幅增強了紀念徽章的精緻度與藝術高級感。\n\n3. 拋光與邊緣防護：金屬邊緣皆作精細手工去毛刺與高光圓潤拋光，表面平整晶瑩，搭配圓帽背釦構造，不僅確保絕佳觸感與佩戴牢固度，更傳遞高爾夫榮耀殿堂的璀璨光芒。",
    tools: ["金屬模具開發", "電鍍烤漆工藝", "珍珠底閃粉效果", "運動禮品企劃", "Illustrator"],
    imageUrl: "https://lh3.googleusercontent.com/d/14In054ETcrU3dVV1Q-7xhvmRGYpecLsJ",
    placeholderId: "IMAGE_11",
    colorTheme: "from-amber-600 to-stone-900",
    images: [
      "https://lh3.googleusercontent.com/d/14In054ETcrU3dVV1Q-7xhvmRGYpecLsJ",
      "https://lh3.googleusercontent.com/d/1ikYM21JUZi9n3zf39z5J9DQByqa5MpvB",
      "https://lh3.googleusercontent.com/d/1RaCzC_MBxFcpB6sk5rQCM-PCMkMRrzsr",
      "https://lh3.googleusercontent.com/d/1hr50ySQhfbfxEJ0FeCXhlb7ab5pTja5a"
    ]
  },
  {
    id: "12",
    category: "商品與周邊設計",
    title: "台北國際音樂邀請賽 2026 鋅合金壓鑄電鍍獎牌設計",
    titleEn: "Taipei International Music Competition 2026 Die-Cast Zinc Alloy Medal Design",
    philosophy: "為2026年「台北國際音樂邀請賽」精心研發設計的官方頂級壓鑄紀念金屬獎牌。本獎牌旨在將無形的音樂藝術成就凝聚於實體榮譽中，設計與材質工藝深度解析如下：\n\n1. 多層次立體浮雕：採用專業級高經緯度3D建模與精密金屬雕刻模具，在堅韌的壓鑄表面勾勒出律動的五線譜、高音記號及賽事核心徽標，呈現出層次豐富、光影變化強烈的立體浮雕視覺效果。\n\n2. 霧面噴砂底紋：金屬線條的凹槽底部經由霧砂質感咬花（Sandblast / Matte Texture）精細處理，與表面高精度拋光的金色鏡面金屬突出線條，形成反差強烈的雙重質感，使整體視覺顯得格外沉穩與高級。\n\n3. 彩色琺瑯填色：使用環保耐磨的仿琺瑯高溫液態烤漆，於特定區域手工填灌賽事代表色。顏色飽和度極高、且與金屬邊界完美切齊無溢色，經烘烤後質地堅硬、色澤歷久彌新。\n\n4. 賽事專屬緹花織帶：針對本次競賽特別開發的寬版高密度聚酯纖維編織帶，結合雙邊防皺包邊與客製化耐磨網版印刷，織帶圖騰、色系與獎牌主體高度呼應，為獲獎音樂家獻上最尊貴且不凡的藝術榮耀。",
    tools: ["3D壓鑄模具開發", "多層次立體浮雕", "霧面底紋處理", "琺瑯填色工藝", "織帶織造規劃"],
    imageUrl: "https://lh3.googleusercontent.com/d/1ShlcU_YeoBOgrHu68R0uV_lnZiIvuIrc",
    placeholderId: "IMAGE_12",
    colorTheme: "from-rose-950 to-amber-950",
    images: [
      "https://lh3.googleusercontent.com/d/1ShlcU_YeoBOgrHu68R0uV_lnZiIvuIrc",
      "https://lh3.googleusercontent.com/d/1-hVBbk0V22gYnEM89yYSxdwVcdfIaq2r",
      "https://lh3.googleusercontent.com/d/10kj650sOdBV6tdDoKAMTZWSRfk4G9GQ6",
      "https://lh3.googleusercontent.com/d/1VjwFKvd5lvBLcGzbwRD4481D-hQmFG5k"
    ]
  },
  {
    id: "13",
    category: "商品與周邊設計",
    title: "DePaul University 帝博大學黃銅鏤空多功能紀念書籤尺",
    titleEn: "DePaul University CNC Etched Brass Bookmark & Ruler with Silk Tassel",
    philosophy: "為 DePaul University（帝博大學）傾心設計與研發的黃銅鏤空多功能書籤尺。本系列視覺設計完美融合了傳統學府的人文底蘊與精湛的現代金屬雕琢工藝，設計及工藝細節深度解析如下：\n\n1. 黃銅精細鏤空工藝：主體精選頂級 H65 拋光黃銅板材，利用高精密化學蝕刻與 CNC 雷射鏤空工藝，點綴出圓滿優雅的鏤空雕花及經典幾何窗欄紋樣，使光線可穿透其間，呈現澄澈、輕盈的古典視覺張力。\n\n2. 深度金屬刻印與度量標記：尺身一側刻有極其精細的度量刻度，採用高經緯度凹槽防磨損刻印工藝，將實用主義尺規功能完美融入書籤載體。中央精密雕刻帝博大學校徽及代表性標誌，字體筆畫清晰規整、高光金屬反射質感亮麗。\n\n3. 霧面拉絲底紋與防氧化保護：黃銅表面經由微細金屬拉絲技術（Brushed Brass Texture）抗刮傷處理，賦予物體溫潤如玉的霧感金光。同時，表面覆有奈米防指紋與防氧化烤漆塗層，有效減緩黃銅自然硫化，常保色澤歷久彌新。\n\n4. 手工編織絲質流蘇：頂端特別配備極具東方古典韻味的手工多股純絲編織流蘇，柔軟滑順、垂墜感極佳，為硬核的黃銅工藝平添一抹雅致、文儒的流動生機，是實用度量工具與高端文創工藝品的完美結晶。",
    tools: ["黃銅化學蝕刻", "CNC雷射鏤空", "金屬拉絲工藝", "防氧化奈米塗層", "文創周邊企劃"],
    imageUrl: "https://lh3.googleusercontent.com/d/1Fi8gl2mH39tby-qyKKYxERus01US5PY8",
    placeholderId: "IMAGE_13",
    colorTheme: "from-amber-500 to-amber-950",
    images: [
      "https://lh3.googleusercontent.com/d/1Fi8gl2mH39tby-qyKKYxERus01US5PY8",
      "https://lh3.googleusercontent.com/d/1cyvka6bvYgUtFHJ9gVTKlUXce5Q7D1DS",
      "https://lh3.googleusercontent.com/d/1RFyc2x3yjnY10lxRVYISeezCaIGY8y_Q",
      "https://lh3.googleusercontent.com/d/1dSbo0892NTDOCPAJGh5v6v0ZlV_VD6Iz"
    ]
  },
  {
    id: "14",
    category: "商品與周邊設計",
    title: "2025 TISDC 臺灣國際學生創意設計大賽 官方名牌識別徽章",
    titleEn: "2025 TISDC Taiwan International Student Design Competition Official ID Badge Pins",
    philosophy: "為2025臺灣國際學生創意設計大賽（TISDC，Taiwan International Student Design Competition）傾心規劃與設計的官方專屬名牌識別徽章。本系列徽章涵蓋「工作人員 Staff」、「獲獎者 Winners」、「主持人 Moderators」及「評審 Jurors」等，將賽事的主視覺美學與金屬工藝完美熔煉：\n\n1. 身分識別與幾何色塊語彙：依據不同大會定位與功能角色，規劃出高飽和度的色彩與立體切割幾何圖騰。將繁複的大賽視覺圖形精煉於隨身佩戴的名牌上，於大型國際典禮中達到極佳的瞬間視覺辨識度與社交穿透力。\n\n2. 壓鑄電鍍與多層次拋光：採用鋅合金模具高壓鑄造（Die-Casting），基底表面進行極致高光金色/銀色電鍍。每一枚別針邊界及英文字母輪廓金屬高光流亮、線條流暢，突顯國際級專業競賽的高貴尊榮風範。\n\n3. 琺瑯填漆工藝（Color Filling）：採用仿琺瑯烤漆（Synthetic Enamel）手工填附色塊，顏色鮮明、均勻平整且緊扣幾何線條邊界，經高溫烘烤固化後抗刮耐磨、不褪色，完美還原 2025 TISDC 大會主視覺強烈的活力與現代藝術氣息。",
    tools: ["多色身分視覺識別", "鋅合金壓鑄電鍍", "仿琺瑯填色工藝", "金屬微細拋光", "賽事徽章規劃"],
    imageUrl: "https://lh3.googleusercontent.com/d/18Csy_4BnCnOM6iE3Q-m3sAWR9nweuHcX",
    placeholderId: "IMAGE_14",
    colorTheme: "from-sky-900 to-indigo-950",
    images: [
      "https://lh3.googleusercontent.com/d/18Csy_4BnCnOM6iE3Q-m3sAWR9nweuHcX",
      "https://lh3.googleusercontent.com/d/1qXXSZRiB0yvCiYXJdVMmpeJiI-Lu-fm6",
      "https://lh3.googleusercontent.com/d/1LXIPlXZg89qKND3gvdPz9Gqb20neMDJG",
      "https://lh3.googleusercontent.com/d/1Ur6dQ1KQRR5FxsTxHYuBJ9JZrLm--3Rv"
    ]
  },
  {
    id: "15",
    category: "商品與周邊設計",
    title: "2025 曼波新城國際疊石藝術節 手作立體浮雕創意磁鐵",
    titleEn: "2025 Mambo Xincheng International Rock Stacking Art Festival Handmade 3D Resin Clay Relief Magnets",
    philosophy: "以花蓮著名的「曼波新城－國際疊石藝術節」為設計核心，精心打造的手作立體浮雕磁鐵旅遊文創商品。本作品完美再現了東海岸豐沛的山海意象與疊石禪意，設計與材質工藝細節如下：\n\n1. 立體樹脂浮雕與黏土手工捏塑：主體結合高品質環保樹脂與輕質黏土手工塑形，將層疊交錯、平衡矗立的鵝卵石與大理石以高低起伏的立體雕塑之姿呈現，層次鮮明，展現強烈的立體觸覺震撼與手工藝感。\n\n2. 職人細緻手工繪製：每一顆疊石的外觀、斑駁的石紋，到金燦的陽光、漸層湛藍的太平洋波浪，皆由專業職人以細微筆觸進行純手工多層次彩繪及暈染，完美還原岩石的自然風化質感與生機盎然的海洋美學。\n\n3. 高強力永磁置入：磁鐵背面精密嵌入高磁力的釹鐵硼永磁，與手作本體完美密合、吸力強大。既可作為實用的生活備忘磁鐵，亦是承載著花蓮在地山海故事、將自然能量帶入生活空間的極致藝術裝飾。",
    tools: ["手工黏土捏塑", "3D環保樹脂浮雕", "擬真石紋手繪", "釹鐵硼高密磁吸", "在地觀光文創企劃"],
    imageUrl: "https://lh3.googleusercontent.com/d/1Dv3qoc-u2F91Gj_2tMM2BhNlnZ1vS0uh",
    placeholderId: "IMAGE_15",
    colorTheme: "from-teal-900 to-orange-950",
    images: [
      "https://lh3.googleusercontent.com/d/1Dv3qoc-u2F91Gj_2tMM2BhNlnZ1vS0uh",
      "https://lh3.googleusercontent.com/d/16wpZtacW9UaEaVteAJf-KUJOFkrqYDb8",
      "https://lh3.googleusercontent.com/d/1wsraQ5KT2T0dI1UCML_S0TDfIbfb-kKd",
      "https://lh3.googleusercontent.com/d/11JKYPOjl01kgV8L-a15BdNHRi2MeG3hL"
    ]
  },
  {
    id: "16",
    category: "商品與周邊設計",
    title: "捷克參議院議長訪問臺灣立法院 官方典藏紀念徽章組",
    titleEn: "Czech Senate President's Historic Visit to Taiwan Legislative Yuan Commemorative Badge Set",
    philosophy: "為捷克參議院議長率團訪問臺灣立法院而特別企劃與設計的級別迎賓紀念別針徽章及展示。徽章組完美融合兩國的國家圖騰、民主聯盟情誼及頂級金屬工藝：\n\n1. 兩國國旗與民主同盟語彙：設計將捷克共和國與中華民國（臺灣）的情誼具象化，融匯雙方國花、經典配色（藍、白、紅）及民主自由盟約設計，展現攜手共創價值的崇高願景。\n\n2. 高精密鋅合金壓鑄與亮拋光：採用鋅合金高壓鑄造（Die-Casting），基底表面進行極致高光金色與鎳色（鍍銀）電鍍。文字輪廓與金屬分色線精準清晰，散發莊嚴典雅的尊榮質感。\n\n3. 彩色仿琺瑯手工填漆（Color Fill）：融合大會主視覺高彩度色塊，以手工逐一填入琺瑯漆料。色彩鮮明平整、分界精準，經高溫固化後抗刮耐磨、歷久不褪色，完美重現高貴藝術。 \n\n4. 微縮大會堂浮雕：下方生動立體微雕出立法院議事廳的巴洛克紅磚圓頂大樓，光影交錯、線條緊緻，呈現厚重的憲政歷史厚度與民主合作象徵。",
    tools: ["國旗與民主別針規劃", "鋅合金壓鑄電鍍", "精密防琺瑯填漆", "微縮建築立體浮雕", "元首級外賓禮品企劃"],
    imageUrl: "https://lh3.googleusercontent.com/d/1S4f3FpGHl8NmqbBwAwepS_2SCFDb-AJa",
    placeholderId: "IMAGE_16",
    colorTheme: "from-sky-950 to-red-950",
    images: [
      "https://lh3.googleusercontent.com/d/1S4f3FpGHl8NmqbBwAwepS_2SCFDb-AJa",
      "https://lh3.googleusercontent.com/d/1vavGwqzQpSeg_xz5gqun_dgYzQSTj9Si",
      "https://lh3.googleusercontent.com/d/18BLol6O9iIsLJap27J1dgbX-SMOuZNTS",
      "https://lh3.googleusercontent.com/d/1Sgyj8Lf3lKE_Himam_ydZSyoJSsipwfd",
      "https://lh3.googleusercontent.com/d/16cAqcT0vyBIGL9-QVIRx5g8Yf6zh_GNX"
    ]
  },
  {
    id: "17",
    category: "商品與周邊設計",
    title: "台灣大和化成股份有限公司 官方高質感企業識別徽章",
    titleEn: "Taiwan Yamato Chemicals Official Premium High-End Corporate Emblem Pin",
    philosophy: "為「台灣大和化成股份有限公司」（Taiwan Yamato Chemicals Co., Ltd.）精心設計與製作的官方高質感企業識別別針徽章。本件別針徽章的開發完美融合品牌形象與現代高端金屬工藝，設計及工藝特色深度解析如下：\n\n1. 幾何科技感企業Logo轉化：徽章主體設計精準還原大和化成的標誌符號，採用流暢動感的幾何線條展示專業與持續創新的品牌特質。在微縮的胸針規格中，線條切割精準，具有極高辨識度及精緻美感。\n\n2. 鋅合金精密鑄造與極致金屬電鍍：選用高純度鋅合金材料，透過200噸高壓熔鑄模具（Die-Casting）進行微米級細節刻劃。金屬框線經過高密度精細拋光後進行亮鎳或亮鉻電鍍處理，邊緣及字體高光如鏡、線條挺拔滑順。\n\n3. 專屬防偽仿琺瑯填漆（Color Fill）：對接品牌標準色，手工將高飽和度的蔚藍與晶瑩白雙色完美充填，分色精準。經由大於180度高溫固化與精緻研磨拋光，使漆面與金屬表面達到無落差的極致平整度，保證耐刮、耐酸鹼且常亮如新，呼應化工大廠對卓越化學物理特性的追求。\n\n4. 尊尊榮精細包裝：每枚徽章均配備高級抗氧化卡紙、背貼加固蝴蝶帽扣，在公司商務交流、週年典禮及重大展會中，最能極致流露專業風貌與團隊榮耀。",
    tools: ["企業CIS金屬轉化", "鋅合金精密鑄造", "仿琺瑯大會色填漆", "鏡面亮鎳電鍍拋光", "企業禮品與CIS企劃"],
    imageUrl: "https://lh3.googleusercontent.com/d/14aj8IqyxwHdo_BFw7HurXwtS2Y96vZfy",
    placeholderId: "IMAGE_17",
    colorTheme: "from-blue-900 to-indigo-950",
    images: [
      "https://lh3.googleusercontent.com/d/14aj8IqyxwHdo_BFw7HurXwtS2Y96vZfy",
      "https://lh3.googleusercontent.com/d/11RiwU7_a6eRx-QjbNzidW4ZowruwUjHD",
      "https://lh3.googleusercontent.com/d/1aBk773m9xj89-GxmOG1yqQZC--rQl9oF"
    ]
  },
  {
    id: "18",
    category: "商品與周邊設計",
    title: "中華民國空軍「天龍操演」團體總錦標紀念天龍銀盤",
    titleEn: "ROC Air Force 'Sky Dragon Exercise' Overall Championship Commemorative Silver Platter",
    philosophy: "專為中華民國空軍年度最頂尖之戰術演訓「天龍操演」（戰術專精班常態性競賽）團體總錦標榮譽所特別企劃、研發與鍛造的官方巨獻「紀念天龍銀盤」。本作品將空軍卓越空優戰力形象與頂級貴重金屬鍛造刻劃技術工藝完美凝結：\n\n1. 雷雕銘刻天龍翔空軍旗語彙：銀盤盤面精準雷射高深多層次銘刻，將空軍代表性的「天龍」圖騰威武刻劃。巨龍展翼、氣勢磅礴，與空軍軍徽及「團體總錦標」得獎榮譽文字交織，突顯精準空戰與無上團隊榮譽之精神表徵。\n\n2. 貴重金屬精細鍛造與亮面拋光：底座採用高純度黃銅極限冷鍛成形，全表面進行多重超高亮度鏡面亮銀電鍍處理。鍍銀層經抗氧化極致處理，在不同投射光源下高光流亮、邊緣晶瑩亮徹，賦予國軍最高榮譽至高無上的尊榮金屬高貴質感。\n\n3. 盤緣細膩網線與立體波折：銀盤外圈邊界經過精細壓痕工藝呈現均勻規整的波浪網線與複刻花邊，凹凸光影極具雕塑厚重感。每尊均附高級大氣紅木底座及高質感專屬壓花盒，呈現出無可替代的典雅憲政與國防榮譽高度。",
    tools: ["貴重金屬鍛造亮銀", "極限鏡面高光拋光", "精密雷射立體雕刻", "國航榮譽企劃與設計", "包裝與底座工藝整合"],
    imageUrl: "https://lh3.googleusercontent.com/d/1aY3ESOBDk4-0SOy7aIuCvCmwCLVtmyoS",
    placeholderId: "IMAGE_18",
    colorTheme: "from-slate-800 to-sky-950",
    images: [
      "https://lh3.googleusercontent.com/d/1aY3ESOBDk4-0SOy7aIuCvCmwCLVtmyoS",
      "https://lh3.googleusercontent.com/d/1ylg3Abwlw-9mX96ixwQVG9kUrRjqdM77",
      "https://lh3.googleusercontent.com/d/1tIPWZyIHFVfMllpaZs33_B8GhbHX94U4"
    ]
  },
  {
    id: "19",
    category: "商品與周邊設計",
    title: "王品集團第一屆王品嚴選年菜競賽 官方琥珀藝術獎盃",
    titleEn: "1st Wangpin Select New Year Dishes Competition Official Amber Glass Art Trophy",
    philosophy: "為王品集團（Wowprime Group）耀眼舉辦的第一屆「王品嚴選年菜競賽」官方特別企劃、研發與工藝定製的「琥珀色典藏大師級獎盃」。本作品專注於頂級餐飲榮譽，將賽事對經典佳餚的極致苛求，以高貴的琥珀琉璃美學與冷熱加工技術完美凝固：\n\n1. 奢華溫潤琥珀流光：整體採用高純度、高抗黃變的透光樹脂與脫蠟琉璃（Lost-Wax Casting）混合配方，調製出從明黃、橙金過渡至深褐的奢華漸層琥珀色調。在自然光源及射燈的透射下，散發如美酒琥珀般的晶瑩底蘊與頂級人文質感。\n\n2. 職人級真空消泡與高拋光：經由24小時真空脫氣和恆溫定形，確保獎盃本體零氣泡、無斷紋，晶瑩透亮。由工藝職人經由極細目砂紙及高密絨布進行多道鏡面拋光，杯體觸感滑如油脂、反光瑩潤。\n\n3. 多重異材質精密組裝與微波銘刻：底座搭配深沉貴重的黑曜石/黑水晶底托，上層安裝經精密多層電鍍的高光金色或古銅拉絲金屬文字飾版，細緻雷射深雕大賽主視覺與榮譽大獎等印記。兩者嚴絲合縫、沈穩厚重，呈現極高的殿堂級頒獎現場穿透力與典藏風範。",
    tools: ["琥珀琉璃脫蠟澆鑄", "晶瑩透光高拋光", "精細雷射微雕銘刻", "異材質(金屬與水晶)組裝", "食品盛事榮譽企劃"],
    imageUrl: "https://lh3.googleusercontent.com/d/1P098Xy4DJXxhSmDHtdVGYq76xo3dfpae",
    placeholderId: "IMAGE_19",
    colorTheme: "from-amber-900 to-amber-950",
    images: [
      "https://lh3.googleusercontent.com/d/1P098Xy4DJXxhSmDHtdVGYq76xo3dfpae",
      "https://lh3.googleusercontent.com/d/1Xi4R7qWREyhHDEGFbQXNymdLKuIHLIs-",
      "https://lh3.googleusercontent.com/d/1831MiaXEAXxzatNRqcSf7z9RbDIa2iBR",
      "https://lh3.googleusercontent.com/d/1tg9-cFoJjNqEfVPFLfBA9NNzWqDXm8P9"
    ]
  },
  {
    id: "20",
    category: "商品與周邊設計",
    title: "花蓮縣光華國民小學 官方永續吸水文創玻璃砂與珪藻土杯墊",
    titleEn: "Hualien Guanghua Elementary School Official Eco-Friendly Absorbent Glass Sand Coasters",
    philosophy: "專為花蓮縣吉安鄉光華國民小學精心企劃與研發客製的「官方永續吸水文創玻璃砂與珪藻土杯墊」。本周邊商品凝聚了光華國小親水、生態度假與藝術美學的教育願景，將光華獨特的人文與自然紋理巧妙轉化：\n\n1. 永續環保生態材質複合：主體採用良好吸水性珪藻土與回收再利用的海洋玻璃砂，透過精密熱壓融合加工而成。不僅具備超強吸水、乾爽防霉的優異物理特點，更寓意著綠色永續與守護蔚藍海洋的深刻生態教育精神。\n\n2. 絢麗在地特殊美景手繪：杯墊表面由專業設計師精心彩繪光華國小獨特優美大自然與校園大榕樹波折，色彩溫暖柔和、漸層豐富。將朝氣蓬勃的校園氛圍與花蓮美麗大自然融入日常器皿，散發濃厚的人文溫度。\n\n3. 精密壓紋與防滑安全：外圍邊角經過細緻洗磨與倒角拋光，觸感圓潤安全。背面特別貼合天然木栓（Cork）隔熱且極致止滑，避免劃傷精密案几，將微縮文創設計與極致實用性完美契合。",
    tools: ["環保海洋玻璃砂複合", "高密珪藻土熱壓工工藝", "校園美景抗褪色噴繪", "天然防滑木栓墊貼合", "在地教育與觀光文創"],
    imageUrl: "https://lh3.googleusercontent.com/d/1retvEk1bQzzqoazWkMVO2UgHo9D5I9eu",
    placeholderId: "IMAGE_20",
    colorTheme: "from-teal-800 to-emerald-950",
    images: [
      "https://lh3.googleusercontent.com/d/1retvEk1bQzzqoazWkMVO2UgHo9D5I9eu",
      "https://lh3.googleusercontent.com/d/1wMrQcpN3Kf1ISNsWW8PkMThdCf9CKvZ9",
      "https://lh3.googleusercontent.com/d/1PMkdOF4uj2NCzNTxB3Yhkd5-ZU7BXDj9",
      "https://lh3.googleusercontent.com/d/1itnLFHmghsuGh6SGZuiXoJmtDJPsb12a",
      "https://lh3.googleusercontent.com/d/1PcAb_2p1_nLYN9k_C6T6dlLQV47o6QOe"
    ]
  },
  {
    id: "21",
    category: "商品與周邊設計",
    title: "宏泰人壽官方高質感企業員工識別名牌與徽章",
    titleEn: "Hontai Life Insurance Official Premium Corporate Employee Name Identification Badge",
    philosophy: "專為「宏泰人壽」（Hontai Life Insurance）精心設計與精雕定製的「官方高質感企業員工識別名牌與徽章」。本件作品結合尊榮保險品牌形象及現代高端金屬切削、電鍍與填漆工藝，設計細節如下：\n\n1. 企業經典Logo與幾何流線相容：完美再現宏泰人壽極具辨識度的品牌Logo。流暢的幾何金屬外輪廓結合流線設計，賦予佩戴者無與倫比的專業、信賴與尊貴感。\n\n2. 鏡面拋光亮金電鍍工藝：徽章底座採用高規黃銅極限冷鍛成形，表面經由手工精細拋光達極高鏡面光澤，再電鍍極致尊貴的24K亮金塗層。亮金色澤飽和溫潤，邊緣線條流暢，突顯保險業「一生的承諾，堅實的守護」之尊榮理念。\n\n3. 精密手工防琺瑯大會色充填：對接宏泰人壽標準CIS色系，手工逐層填注蔚藍色與純白琺瑯漆。經過高溫固化、多道研磨及鏡面拋光，使金屬線與色塊表面平滑如一、無階差，呈現無與倫比的晶瑩珠寶質感與極佳耐磨、防褪色性能。\n\n4. 實用配戴與防護設計：背面配備強力磁吸背扣，具有超高吸附力且安全不傷筆挺的西服與套裝面料，為全體同仁提供最體面的企業門面形象與事業榮譽感。",
    tools: ["企業徽章與名牌企劃", "24K亮金鏡面電鍍", "精密防琺瑯分色填漆", "強磁無損配戴設計", "企業員工形象CIS轉化"],
    imageUrl: "https://lh3.googleusercontent.com/d/1OyWdL1g7TX2bguGcI0uQMHF0NUTH3NZh",
    placeholderId: "IMAGE_21",
    colorTheme: "from-amber-600 to-blue-950",
    images: [
      "https://lh3.googleusercontent.com/d/1OyWdL1g7TX2bguGcI0uQMHF0NUTH3NZh",
      "https://lh3.googleusercontent.com/d/1uyHF_dBEXpJszgY-bxq5Gcc2e4U_R7Sy",
      "https://lh3.googleusercontent.com/d/1inNA2jtluXfoo8DkVo7lY3O_HFLtNbRQ",
      "https://lh3.googleusercontent.com/d/1EIRZO2IFenG6QCv9NceP7YE1SiR1NP2c"
    ]
  },
  {
    id: "22",
    category: "商品與周邊設計",
    title: "花蓮縣玉里鎮公所 官方YULI觀光與節慶文創禮品組",
    titleEn: "Hualien Yuli Township Office Official YULI Tourism and Festival Commemorative Gifts",
    philosophy: "專為花蓮縣玉里鎮公所特別策劃與設計開發的「官方YULI觀光與節慶文創禮品組」。玉里鎮以純淨大自然、秀麗金針花海景觀及溫馨多元族群人文聞名，本件禮品套組完美融合地方靈魂形象與細膩實用工藝：\n\n1. 玉里在地自然人文意象轉化：設計圍繞「YULI字形」與「玉里特色」展開，融入充滿生命力的在地吉祥物與山水風光，將玉里的熱情、樸實與純真極致呈現，在視覺上傳遞熱烈的節慶與觀光氛圍。\n\n2. 高規環保複合與細緻彩繪噴塗：本體及周邊配件選用精良、安全耐磨的綠色永續基材製作，表面結合領先的高精密熱轉印與抗褪色釉點彩繪工藝，圖案分色清晰、過渡溫潤。每個禮品細節皆經過職人修邊打磨，觸感圓潤溫實。\n\n3. 觀光推廣與在地伴手禮企劃：專為公所外賓參訪、在地重大文化節慶（例如金針花季）量身定製，兼顧生活美學實用性與玉里大自然的綠能精神。是一份盛載鄉土厚重情懷與現代創意美感的國際級文旅伴手禮。",
    tools: ["地方IP觀光禮品企劃", "環保複合材質加工", "微縮視覺高保真呈現", "外賓典藏禮品盒裝", "觀光伴手禮美學轉化"],
    imageUrl: "https://lh3.googleusercontent.com/d/1j_Dl5I5TtH2AW5CMDhhM8C8fBYUMY1bZ",
    placeholderId: "IMAGE_22",
    colorTheme: "from-yellow-700 to-green-950",
    images: [
      "https://lh3.googleusercontent.com/d/1j_Dl5I5TtH2AW5CMDhhM8C8fBYUMY1bZ",
      "https://lh3.googleusercontent.com/d/1X9LYBLKQvn3vw6wasco-Dkc0HoYCzYlX",
      "https://lh3.googleusercontent.com/d/1MyLBGhCc6Esa4gfwE1Li4PJULrdbGJCS",
      "https://lh3.googleusercontent.com/d/1xDaziJJisny5CJhO1wIkkOW_4_kcinf-"
    ]
  },
  {
    id: "23",
    category: "商品與周邊設計",
    title: "國立金門大學企業管理學系 官方文創形象徽章與周邊設計組",
    titleEn: "National Quemoy University Department of Business Administration Official Brand Souvenirs",
    philosophy: "專為「國立金門大學企業管理學系」精心企劃與研發開發的「官方文創形象徽章與周邊設計組」。本系列設計將金門地區深厚的閩南古典文化底蘊（如傳統大厝飛揚的燕尾脊脊線）與現代企業管理商務實務的多維視野（全球化戰略、變革領導力與永續創業精神）完美交織，打造成為兼具校園品牌認同與極致生活美學之大成之作：\n\n1. 閩南燕尾天際線與現代商務徽標共融：設計巧妙提取金門最具代表性的屋頂「燕尾脊」優美弧線，並將品牌「BA」（Business Administration）英文字體進行現代幾何轉化，兩者完美融合。這既蘊含了深邃的中華古典人文底蘊，也突顯了企管人才勇往直前的戰略前瞻性。\n\n2. 高級感霧面高質感工藝與雙重質地：全套周邊均選用頂級與極致手感的工藝。精工馬克杯杯身塗覆手感極佳的細緻啞光黑不銹鋼保護層，並以毫米級精密雷雕呈現亮金色系徽；精緻胸針徽章採用高純度鋅合金壓鑄成形，表面塗布莫蘭迪莫蘭迪藍填漆與手工鏡面拋光，光暈流轉、無瑕剔透。\n\n3. 全方位學術品牌凝聚與典藏禮包設計：產品涵蓋不銹鋼磨砂杯、帆布背袋、精切烤漆襟章等，以頂級禮品包裝工藝與深邃品牌視覺配色，提供給全球畢業系友、全體在校同仁，激發極致深遠的系所歸屬感與形象推廣實用價值。",
    tools: ["學術品牌與CIS規劃", "霧面真空防指紋電鍍", "精密高精雷射微痕雕刻", "鋅合金重壓鑄與琺瑯填漆", "生活美學文創產品實踐"],
    imageUrl: "https://lh3.googleusercontent.com/d/1P5P1Ya0Kca9dA5whL3E2tcA_TH_lzuUL",
    placeholderId: "IMAGE_23",
    colorTheme: "from-blue-900 to-indigo-950",
    images: [
      "https://lh3.googleusercontent.com/d/1P5P1Ya0Kca9dA5whL3E2tcA_TH_lzuUL",
      "https://lh3.googleusercontent.com/d/10AjArOKN0Vo-lyY-TFW45ozc7VWOgck7",
      "https://lh3.googleusercontent.com/d/1tOKXw2YYNMxtzOKuYt8_uFaUucNZpHR0",
      "https://lh3.googleusercontent.com/d/1MjR0dp1mufFn7y9u9g8aXJJqRpx5GcJT",
      "https://lh3.googleusercontent.com/d/1SZuGtDlOf-oAX8pmPEMGWaA6LjDXtd9M",
      "https://lh3.googleusercontent.com/d/18CRBIkrvagHVcgJEhIZUUxya9iMMrDoR"
    ]
  },
  {
    id: "24",
    category: "商品與周邊設計",
    title: "松冠基督徒大會中心 第五屆姐妹彩虹營會 官方尊榮金屬書籤",
    titleEn: "Pinecrest Christian Conference Center AGAPE TRES DIAS 5 Official Sister Rainbow Camp Commemorative Metal Bookmark",
    philosophy: "專為「松冠基督徒大會中心」（Pinecrest Christian Conference Center）盛大舉辦的「AGAPE TRES DIAS 5 第五屆姐妹彩虹營會」精心設計與紀念定製之「官方尊榮精緻金屬書籤」。本作品將深沉的信仰涵意、溫溫暖的姐妹契合情懷與彩虹之約的聖潔之美完美凝固：\n\n1. 聖潔神聖的極致美學：設計融匯彩虹營會的核心精神，將象徵愛（Agape）、希望與誓約的彩虹線條與十字信仰符號，以最優美的幾何線流體化呈現。書籤本體線條流暢，傳遞無微不至的聖潔、溫暖、感動與支持。\n\n2. 高規金屬蝕刻與鏤空工藝：基材選用頂級黃銅薄片，利用高精密雙面光化學蝕刻（Photo-Etching）技術切削出通透細膩、絲絲入扣的鏤空花紋，邊緣線條流暢，無任何毛刺或割手感。金屬表面經化學拋光與特殊防氧化處理，流露高貴、典雅且歷久彌新的香檳金屬光澤。\n\n3. 七彩虹光琺瑯填漆與特製緞帶：結合「彩虹營會」主題，在鏤空凹形槽中手工注入漸層絢麗的彩虹七色琺瑯烤漆，色彩飽和、鮮豔通透。書籤頂端附有精編的絲滑緞帶，觸感柔軟流暢，在掀閱經藏書頁間散發優雅、尊榮與無限祝福的人文底蘊。",
    tools: ["宗教信仰周邊策劃", "精密雙面光化學金屬蝕刻", "多色亮麗琺瑯彩漆充填", "精細表面防氧化拋光", "絲緞流蘇飾件複合裝配"],
    imageUrl: "https://lh3.googleusercontent.com/d/1qkeYDElnY0UG-WwpKtAH3jpMACO1CiLK",
    placeholderId: "IMAGE_24",
    colorTheme: "from-purple-900 to-indigo-950",
    images: [
      "https://lh3.googleusercontent.com/d/1qkeYDElnY0UG-WwpKtAH3jpMACO1CiLK",
      "https://lh3.googleusercontent.com/d/1bt6GtmA1xSlXM_too_rnkzL1mLvVwyjK",
      "https://lh3.googleusercontent.com/d/1L-EgequPshLXmeoKp3xNrCPXzhDFed_J"
    ]
  },
  {
    id: "25",
    category: "商品與周邊設計",
    title: "國立新竹科學園區實驗高級中等學校 官方雙層圓邊高透光壓克力吊飾",
    titleEn: "National Experimental High School at Hsinchu Science Park Official Premium Acrylic Charm Keychain",
    philosophy: "專為「國立新竹科學園區實驗高級中等學校」（NEHS，竹科實中）特別企劃與美學定製的「官方雙層圓邊高透光壓克力吊飾」。本周邊商品凝聚了竹科實中兼具科學理性引領與人文藝術素養的卓越教學願景，並將獨特的多元學系、校徽意象巧妙轉譯：\n\n1. 竹科實中尊榮校徽與科系交融：正面精準立體呈現實驗中學引以為傲的經典校徽。以高解析度數位噴繪、飽滿色調及精確光學網點定位技術，使校名徽記與金屬掛環完美相襯，完美向外展示實中學子的非凡榮譽。\n\n2. 頂級高透光雙層夾層工藝：本體嚴選抗黃化、極佳耐衝擊之進口光學級 PMMA 壓克力，厚度達4mm。採用先進的「雙面夾層高溫熱合技術」，將精美彩色噴繪完全封裝於兩層高透壓克力板正中央，徹底杜絕表面圖層因摩擦、掛刮或汗水侵蝕而造成脫落或磨損，使校徽圖樣長久晶瑩如新。\n\n3. 3D鑽石級雷射精密拋光與安全導角：吊飾周邊經過領先的毫米級 CO₂ 雷射精密切割與 3D 圓導角拋光（Beveling），外圍無尖銳稜角，手感極致細膩圓實。頂部高強度不銹鋼D字扣環貼合度高且開合流暢，可便捷、安全固定於各式書包、鑰匙環或多功能背包上，為校園師生增添無與倫比的時尚美學質感。",
    tools: ["校園CIS與品牌企劃", "光學級PMMA高透熱壓", "高彩無痕耐磨夾層噴繪", "雷射全導角拋光工藝", "高強度不銹鋼抗磨掛扣"],
    imageUrl: "https://lh3.googleusercontent.com/d/1bE5O6UX3KuVNyZhXgFlSpKqiUtaltgPv",
    placeholderId: "IMAGE_25",
    colorTheme: "from-cyan-950 to-neutral-950",
    images: [
      "https://lh3.googleusercontent.com/d/1bE5O6UX3KuVNyZhXgFlSpKqiUtaltgPv",
      "https://lh3.googleusercontent.com/d/1ui8JKOv5A8kXWYDO2oM3YZv1lkkpTIWo",
      "https://lh3.googleusercontent.com/d/1y5AMAb3AD1u_9XTPr31PWr-VXv_r4XmB"
    ]
  }
];
