const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const regex1 = /    const explosionParticles = Array\.from\(\{ length: 55 \}\)\.map\(\(_, i\) => \(\{\n      id: Date\.now\(\) \+ i \+ Math\.random\(\),\n      x: 180 \+ \(Math\.random\(\) \* 200 - 100\),\n      y: 180 \+ \(Math\.random\(\) \* 200 - 100\),\n    setHeroParticles\(\(prev\) => \[\.\.\.prev, \.\.\.explosionParticles\]\.slice\(-100\)\);\n\n    const newFedFlavors = \[\.\.\.new Set\(\[\.\.\.fedFlavors, canFlavor\]\)\];\n    if \(newFedFlavors\.length > fedFlavors\.length\) \{\n      setFedFlavors\(newFedFlavors\);\n      try \{\n        localStorage\.setItem\("mumu_ach_fed_flavors", JSON\.stringify\(newFedFlavors\)\);\n      \} catch \(e\) \{\}\n    \}\n\n    if \(!premiumCanUnlocked && newFedFlavors\.length >= 3\) \{\n      setPremiumCanUnlocked\(true\);\n      try \{\n        localStorage\.setItem\("mumu_ach_premium_can", "true"\);\n      \} catch \(e\) \{\}\n      triggerAchievementUnlock\("極致奢華罐罐奉納 🥫"\);\n      setHeroDialogue\("喵嗚！太美味了吧！你居然集齊了三種口味的罐罐奉納！😻🥫✨ 本教主心情大好，特許你擁有無上福報、諸願成就！🐾"\);\n    \} else if \(!premiumCanUnlocked\) \{\n      const remaining = 3 - newFedFlavors\.length;\n      setHeroDialogue\(\`喵嗚～美味的\$\{FLAVOR_PHYSICS\[canFlavor\]\.name\}！🤤 再餵我 \$\{remaining\} 種不同口味的罐罐，我就大發慈悲賜予你祝福！🐾\`\);\n    \} else \{\n      setHeroDialogue\(\`喵嗚！是\$\{FLAVOR_PHYSICS\[canFlavor\]\.name\}！太美味了吧！😻🥫✨ 本教主心情大好！🐾\`\);\n    \}\n\n    setIsHeroSpeaking\(true\);\n    setShowHeroDialogue\(true\);\n  \};\n    setHeroDialogue\("喵嗚！太美味了吧！這就是極致奢華的貓罐罐奉納嗎？😻🥫✨ 本教主心情大好，特許你擁有無上福報、諸願成就！🐾"\);\n    setIsHeroSpeaking\(true\);\n    setShowHeroDialogue\(true\);\n  \};/;

const replacement1 = `    const explosionParticles = Array.from({ length: 55 }).map((_, i) => ({
      id: Date.now() + i + Math.random(),
      x: 180 + (Math.random() * 200 - 100),
      y: 180 + (Math.random() * 200 - 100),
      emoji: ["🥫", "🐟", "🐾", "✨", "💖", "⭐️", "👑", "🌈", "😻"][Math.floor(Math.random() * 9)],
    }));
    setHeroParticles((prev) => [...prev, ...explosionParticles].slice(-100));

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
  };`;

if (regex1.test(code)) {
    code = code.replace(regex1, replacement1);
    console.log("Replaced 1");
} else {
    console.log("Failed 1");
}

fs.writeFileSync('src/App.tsx', code);
