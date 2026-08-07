import React from "react";

interface PerspectiveGridProps {
  strokeColor: string;
  horizontalLines?: (string | number)[];
  verticalLines?: (string | number)[];
  opacity?: number;
  strokeDasharray?: string;
  strokeWidth?: number;
  centerCircles?: number[];
  centerPos?: { cx: number; cy: number };
}

export const PerspectiveGrid: React.FC<PerspectiveGridProps> = ({
  strokeColor,
  horizontalLines,
  verticalLines,
  opacity = 0.25,
  strokeDasharray = "4 4",
  strokeWidth = 0.8,
  centerCircles,
  centerPos = { cx: 600, cy: 200 },
}) => {
  const hPath = horizontalLines
    ? horizontalLines.map((y) => `M 5% ${y} L 95% ${y}`).join(" ")
    : "";

  const vPath = verticalLines
    ? verticalLines.map((x) => `M ${x} 5% L ${x} 95%`).join(" ")
    : "";

  const combinedPath = `${hPath} ${vPath}`.trim();

  return (
    <g opacity={opacity}>
      {combinedPath && (
        <path
          d={combinedPath}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeDasharray={strokeDasharray}
          fill="none"
        />
      )}
      {centerCircles &&
        centerCircles.map((r, idx) => (
          <circle
            key={`grid-circle-${idx}`}
            cx={centerPos.cx}
            cy={centerPos.cy}
            r={r}
            fill="none"
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeDasharray={idx % 2 === 0 ? "3 3" : "2 2"}
            opacity={0.4 + (idx % 3) * 0.1}
          />
        ))}
    </g>
  );
};
