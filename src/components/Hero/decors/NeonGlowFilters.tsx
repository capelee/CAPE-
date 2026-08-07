import React from "react";

const STANDARD_GLOW_IDS = [
  "neonGlowPurple",
  "neonGlowIndigo",
  "neonGlowTeal",
  "neonGlowAmber",
  "neonGlowSky",
  "neonGlowBlue",
  "neonGlowEmerald",
  "neonGlowCyan",
  "neonGlowPink",
  "neonGlowRose",
  "neonGlowOrange",
  "neonGlowBrightOrange"
];

export const NeonGlowFilters: React.FC = () => {
  return (
    <>
      {STANDARD_GLOW_IDS.map((id) => (
        <filter key={id} id={id} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      ))}

      {/* Electric Pulse Glow Special Filter */}
      <filter id="electricGlow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="1.5" result="blur1" />
        <feGaussianBlur stdDeviation="1" result="blur2" />
        <feMerge>
          <feMergeNode in="blur1" />
          <feMergeNode in="blur2" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </>
  );
};
