import React, { useState, useEffect, useCallback, useRef } from "react";
import { playMeowSound } from "../utils/audioEffects";

interface UseMumuAchievementsProps {
  theme: "dark" | "light" | "sepia";
  isWorkflowOpen?: boolean;
  tutorialStep?: number;
  heroSectionRef?: React.RefObject<any>;
}

export function useMumuAchievements({
  theme,
  isWorkflowOpen = false,
  tutorialStep = 0,
  heroSectionRef,
}: UseMumuAchievementsProps) {
  // 1. Interaction count tracking
  const [interactionCount, setInteractionCount] = useState<number>(() => {
    try {
      const saved = localStorage.getItem("mumu_interaction_count");
      return saved ? parseInt(saved, 10) : 0;
    } catch {
      return 0;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("mumu_interaction_count", interactionCount.toString());
    } catch (e) {}
  }, [interactionCount]);

  // 2. Midnight cat lover
  const [midnightUnlocked, setMidnightUnlocked] = useState<boolean>(() => {
    try {
      return localStorage.getItem("mumu_ach_midnight") === "true";
    } catch {
      return false;
    }
  });

  // 3. Theme time traveler
  const [visitedThemes, setVisitedThemes] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("mumu_visited_themes");
      return saved ? JSON.parse(saved) : ["dark"];
    } catch {
      return ["dark"];
    }
  });

  // 4. Fortune teller friend
  const [fortuneCount, setFortuneCount] = useState<number>(() => {
    try {
      const saved = localStorage.getItem("mumu_fortune_count");
      return saved ? parseInt(saved, 10) : 0;
    } catch {
      return 0;
    }
  });

  // 5. Portfolio connoisseur
  const [viewedProjects, setViewedProjects] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("mumu_viewed_projects");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // 6. Other specific achievements
  const [zenUnlocked, setZenUnlocked] = useState<boolean>(() => {
    try {
      return localStorage.getItem("mumu_ach_zen") === "true";
    } catch {
      return false;
    }
  });

  const [socialUnlocked, setSocialUnlocked] = useState<boolean>(() => {
    try {
      return localStorage.getItem("mumu_ach_social") === "true";
    } catch {
      return false;
    }
  });

  const [slackerUnlocked, setSlackerUnlocked] = useState<boolean>(() => {
    try {
      return localStorage.getItem("mumu_ach_slacker") === "true";
    } catch {
      return false;
    }
  });

  const [aiWizardUnlocked, setAiWizardUnlocked] = useState<boolean>(() => {
    try {
      return localStorage.getItem("mumu_ach_ai_wizard") === "true";
    } catch {
      return false;
    }
  });

  const [premiumCanUnlocked, setPremiumCanUnlocked] = useState<boolean>(() => {
    try {
      return localStorage.getItem("mumu_ach_premium_can") === "true";
    } catch {
      return false;
    }
  });

  const [fedFlavors, setFedFlavors] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("mumu_ach_fed_flavors");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [balloonUnlocked, setBalloonUnlocked] = useState<boolean>(() => {
    try {
      return localStorage.getItem("mumu_ach_balloon") === "true";
    } catch {
      return false;
    }
  });

  const [magicMumuUnlocked, setMagicMumuUnlocked] = useState<boolean>(() => {
    try {
      return localStorage.getItem("mumu_ach_magic_mumu") === "true";
    } catch {
      return false;
    }
  });

  const [gravityRestoreUnlocked, setGravityRestoreUnlocked] = useState<boolean>(() => {
    try {
      return localStorage.getItem("mumu_ach_gravity_restore") === "true";
    } catch {
      return false;
    }
  });

  const [pdfUnlocked, setPdfUnlocked] = useState<boolean>(() => {
    try {
      return localStorage.getItem("mumu_ach_pdf") === "true";
    } catch {
      return false;
    }
  });

  const [tutorialAchUnlocked, setTutorialAchUnlocked] = useState<boolean>(() => {
    try {
      return localStorage.getItem("mumu_ach_tutorial") === "true";
    } catch {
      return false;
    }
  });

  const [windStormUnlocked, setWindStormUnlocked] = useState<boolean>(() => {
    try {
      return localStorage.getItem("mumu_ach_wind_storm") === "true";
    } catch {
      return false;
    }
  });

  const [spawnedRareTypes, setSpawnedRareTypes] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("mumu_spawned_rare_types");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [rareCollectorUnlocked, setRareCollectorUnlocked] = useState<boolean>(() => {
    try {
      return localStorage.getItem("mumu_ach_rare_collector") === "true";
    } catch {
      return false;
    }
  });

  // Achievement unlock Toast Notification
  const [unlockedAchToast, setUnlockedAchToast] = useState<string | null>(null);
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const triggerAchievementUnlock = useCallback((name: string) => {
    setUnlockedAchToast(name);
    try {
      playMeowSound();
    } catch (e) {}

    // Sparkle particles
    const newParticles = Array.from({ length: 20 }).map((_, i) => ({
      id: Date.now() + i + Math.random(),
      x: (typeof window !== "undefined" ? window.innerWidth / 2 : 200) + (Math.random() * 320 - 160),
      y: (typeof window !== "undefined" ? window.innerHeight / 2 : 200) + (Math.random() * 320 - 160),
      emoji: ["✨", "🏆", "🌟", "🐾", "🎉", "👑", "💖"][Math.floor(Math.random() * 7)],
    }));
    heroSectionRef?.current?.setHeroParticles((prev: any[]) => [...prev, ...newParticles].slice(-60));

    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    toastTimeoutRef.current = setTimeout(() => {
      setUnlockedAchToast(null);
    }, 4500);
  }, [heroSectionRef]);

  // Interaction increment with midnight check
  const incrementInteraction = useCallback(() => {
    setInteractionCount((prev) => {
      const next = prev + 1;
      const hour = new Date().getHours();
      if (hour >= 23 || hour < 4) {
        if (!midnightUnlocked) {
          setMidnightUnlocked(true);
          try {
            localStorage.setItem("mumu_ach_midnight", "true");
          } catch (e) {}
          triggerAchievementUnlock("深夜擼貓者 🐾");
        }
      }
      return next;
    });
  }, [midnightUnlocked, triggerAchievementUnlock]);

  // 100 interactions slacker god
  useEffect(() => {
    if (interactionCount >= 100 && !slackerUnlocked) {
      setSlackerUnlocked(true);
      try {
        localStorage.setItem("mumu_ach_slacker", "true");
      } catch (e) {}
      triggerAchievementUnlock("極意摸魚之神 👑");
    }
  }, [interactionCount, slackerUnlocked, triggerAchievementUnlock]);

  // 3 minutes zen meditation
  useEffect(() => {
    if (zenUnlocked) return;
    const timer = setTimeout(() => {
      setZenUnlocked(true);
      try {
        localStorage.setItem("mumu_ach_zen", "true");
      } catch (e) {}
      triggerAchievementUnlock("靜心禪修者 🧘‍♀️");
    }, 180000);
    return () => clearTimeout(timer);
  }, [zenUnlocked, triggerAchievementUnlock]);

  // AI Workflow Wizard
  useEffect(() => {
    if (isWorkflowOpen && !aiWizardUnlocked) {
      setAiWizardUnlocked(true);
      try {
        localStorage.setItem("mumu_ach_ai_wizard", "true");
      } catch (e) {}
      triggerAchievementUnlock("AI 協同巫師 ✨");
    }
  }, [isWorkflowOpen, aiWizardUnlocked, triggerAchievementUnlock]);

  // Social share click
  const handleSocialClick = useCallback(() => {
    if (!socialUnlocked) {
      setSocialUnlocked(true);
      try {
        localStorage.setItem("mumu_ach_social", "true");
      } catch (e) {}
      triggerAchievementUnlock("社交宣傳使者 🐾");
    }
  }, [socialUnlocked, triggerAchievementUnlock]);

  // PDF click
  const handlePdfClick = useCallback(() => {
    if (!pdfUnlocked) {
      setPdfUnlocked(true);
      try {
        localStorage.setItem("mumu_ach_pdf", "true");
      } catch (e) {}
      triggerAchievementUnlock("傳統派讀者 📖");
    }
  }, [pdfUnlocked, triggerAchievementUnlock]);

  // Balloon fly away
  const triggerBalloonAchievement = useCallback(() => {
    if (!balloonUnlocked) {
      setBalloonUnlocked(true);
      try {
        localStorage.setItem("mumu_ach_balloon", "true");
      } catch (e) {}
      triggerAchievementUnlock("飛天姆貓 🎈");
    }
  }, [balloonUnlocked, triggerAchievementUnlock]);

  // Tutorial complete
  useEffect(() => {
    if (tutorialStep >= 4 && !tutorialAchUnlocked) {
      setTutorialAchUnlocked(true);
      try {
        localStorage.setItem("mumu_ach_tutorial", "true");
      } catch (e) {}
      triggerAchievementUnlock("新手上路 🎓");
    }
  }, [tutorialStep, tutorialAchUnlocked, triggerAchievementUnlock]);

  // Wind storm listener
  useEffect(() => {
    const handleWindStormAch = () => {
      if (!windStormUnlocked) {
        setWindStormUnlocked(true);
        try {
          localStorage.setItem("mumu_ach_wind_storm", "true");
        } catch (e) {}
        triggerAchievementUnlock("御風神官 🌬️");
      }
    };
    window.addEventListener("trigger-wind-storm-ach", handleWindStormAch);
    return () => {
      window.removeEventListener("trigger-wind-storm-ach", handleWindStormAch);
    };
  }, [windStormUnlocked, triggerAchievementUnlock]);

  // Rare items collection listener
  useEffect(() => {
    const handleRareSpawned = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail && detail.rareType) {
        const type = detail.rareType as string;
        setSpawnedRareTypes((prev) => {
          if (prev.includes(type)) return prev;
          const next = [...prev, type];
          try {
            localStorage.setItem("mumu_spawned_rare_types", JSON.stringify(next));
          } catch (err) {}
          return next;
        });
      }
    };
    window.addEventListener("rare-item-spawned", handleRareSpawned);
    return () => {
      window.removeEventListener("rare-item-spawned", handleRareSpawned);
    };
  }, []);

  useEffect(() => {
    const required = ["amulet", "star", "apple", "palette", "ig"];
    const hasAll = required.every((t) => spawnedRareTypes.includes(t));
    if (hasAll && !rareCollectorUnlocked) {
      setRareCollectorUnlocked(true);
      try {
        localStorage.setItem("mumu_ach_rare_collector", "true");
      } catch (e) {}
      triggerAchievementUnlock("奇蹟之物收集雅士 💎");
    }
  }, [spawnedRareTypes, rareCollectorUnlocked, triggerAchievementUnlock]);

  // Theme visited tracker
  useEffect(() => {
    if (!visitedThemes.includes(theme)) {
      const updated = [...visitedThemes, theme];
      setVisitedThemes(updated);
      try {
        localStorage.setItem("mumu_visited_themes", JSON.stringify(updated));
      } catch (e) {}

      if (updated.length === 3) {
        const alreadyThemeUnlocked = localStorage.getItem("mumu_ach_theme") === "true";
        if (!alreadyThemeUnlocked) {
          try {
            localStorage.setItem("mumu_ach_theme", "true");
          } catch (e) {}
          triggerAchievementUnlock("時空穿梭大師 🎨");
        }
      }
    }
  }, [theme, visitedThemes, triggerAchievementUnlock]);

  // Fortune consultation
  const handleFortuneConsult = useCallback(() => {
    setFortuneCount((prev) => {
      const next = prev + 1;
      try {
        localStorage.setItem("mumu_fortune_count", next.toString());
      } catch (e) {}

      if (next === 3) {
        const alreadyFortuneUnlocked = localStorage.getItem("mumu_ach_fortune") === "true";
        if (!alreadyFortuneUnlocked) {
          try {
            localStorage.setItem("mumu_ach_fortune", "true");
          } catch (e) {}
          triggerAchievementUnlock("命運之友 🔮");
        }
      }
      return next;
    });
  }, [triggerAchievementUnlock]);

  // Project view tracker
  const handleProjectView = useCallback((projectId: string) => {
    setViewedProjects((prev) => {
      if (prev.includes(projectId)) return prev;
      const updated = [...prev, projectId];
      try {
        localStorage.setItem("mumu_viewed_projects", JSON.stringify(updated));
      } catch (e) {}

      if (updated.length === 5) {
        const alreadyPortfolioUnlocked = localStorage.getItem("mumu_ach_portfolio") === "true";
        if (!alreadyPortfolioUnlocked) {
          try {
            localStorage.setItem("mumu_ach_portfolio", "true");
          } catch (e) {}
          triggerAchievementUnlock("作品鑑賞家 📖");
        }
      }
      return updated;
    });
  }, [triggerAchievementUnlock]);

  // Gravity restore unlock
  const handleGravityRestore = useCallback(() => {
    if (!gravityRestoreUnlocked) {
      setGravityRestoreUnlocked(true);
      try {
        localStorage.setItem("mumu_ach_gravity_restore", "true");
      } catch (e) {}
      triggerAchievementUnlock("重力掌控者 🌌");
    }
  }, [gravityRestoreUnlocked, triggerAchievementUnlock]);

  // Magic transformation unlock
  const handleMagicMumuUnlock = useCallback(() => {
    if (!magicMumuUnlocked) {
      setMagicMumuUnlocked(true);
      try {
        localStorage.setItem("mumu_ach_magic_mumu", "true");
      } catch (e) {}
      triggerAchievementUnlock("魔法姆貓 🪄");
    }
  }, [magicMumuUnlocked, triggerAchievementUnlock]);

  return {
    interactionCount,
    incrementInteraction,
    midnightUnlocked,
    visitedThemes,
    fortuneCount,
    handleFortuneConsult,
    viewedProjects,
    handleProjectView,
    zenUnlocked,
    socialUnlocked,
    handleSocialClick,
    slackerUnlocked,
    aiWizardUnlocked,
    premiumCanUnlocked,
    setPremiumCanUnlocked,
    fedFlavors,
    setFedFlavors,
    balloonUnlocked,
    triggerBalloonAchievement,
    magicMumuUnlocked,
    handleMagicMumuUnlock,
    gravityRestoreUnlocked,
    handleGravityRestore,
    pdfUnlocked,
    handlePdfClick,
    tutorialAchUnlocked,
    windStormUnlocked,
    spawnedRareTypes,
    rareCollectorUnlocked,
    unlockedAchToast,
    setUnlockedAchToast,
    triggerAchievementUnlock,
  };
}
