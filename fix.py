import sys

with open('src/App.tsx', 'r', encoding='utf-8') as f:
    lines = f.read().split('\n')

start_idx = -1
end_idx = -1

for i in range(len(lines)):
    if "const explosionParticles =" in lines[i]:
        start_idx = i
        break

for i in range(start_idx, len(lines)):
    if "const handleCanDragEnd" in lines[i]:
        end_idx = i
        break

replacement = """    const explosionParticles = Array.from({ length: 55 }).map((_, i) => ({
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
      setHeroDialogue(`喵嗚～美味的${FLAVOR_PHYSICS[canFlavor].name}！🤤 再餵我 ${remaining} 種不同口味的罐罐，我就大發慈悲賜予你祝福！🐾`);
    } else {
      setHeroDialogue(`喵嗚！是${FLAVOR_PHYSICS[canFlavor].name}！太美味了吧！😻🥫✨ 本教主心情大好！🐾`);
    }

    setIsHeroSpeaking(true);
    setShowHeroDialogue(true);
  };
"""

new_lines = lines[:start_idx] + replacement.split('\n') + lines[end_idx:]

with open('src/App.tsx', 'w', encoding='utf-8') as f:
    f.write('\n'.join(new_lines))

print("Fixed!")
