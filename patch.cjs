const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');
const lines = code.split('\n');

const newLines = `    setHeroParticles((prev) => [...prev, ...explosionParticles].slice(-100));

    const newFedFlavors = [...new Set([...fedFlavors, canFlavor])];
    if (newFedFlavors.length > fedFlavors.length) {
      setFedFlavors(newFedFlavors);
      try {
        localStorage.setItem("mumu_ach_fed_flavors", JSON.stringify(newFedFlavors));
      } catch (e) {}
    }

    if (!premiumCanUnlocked && newFedFlavors.length >= 3) {
      setPremiumCanUnlocked(true);
      try {
        localStorage.setItem("mumu_ach_premium_can", "true");
      } catch (e) {}
      triggerAchievementUnlock("極致奢華罐罐奉納 🥫");
      setHeroDialogue("喵嗚！太美味了吧！你居然集齊了三種口味的罐罐奉納！😻🥫✨ 本教主心情大好，特許你擁有無上福報、諸願成就！🐾");
    } else if (!premiumCanUnlocked) {
      const remaining = 3 - newFedFlavors.length;
      setHeroDialogue(\`喵嗚～美味的\${FLAVOR_PHYSICS[canFlavor].name}！🤤 再餵我 \${remaining} 種不同口味的罐罐，我就大發慈悲賜予你祝福！🐾\`);
    } else {
      setHeroDialogue(\`喵嗚！是\${FLAVOR_PHYSICS[canFlavor].name}！太美味了吧！😻🥫✨ 本教主心情大好！🐾\`);
    }

    setIsHeroSpeaking(true);
    setShowHeroDialogue(true);
  };`.split('\n');

lines.splice(1073 - 1, 1083 - 1073 + 1, ...newLines);
fs.writeFileSync('src/App.tsx', lines.join('\n'));
