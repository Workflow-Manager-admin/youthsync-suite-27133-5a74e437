import React from "react";
import "../styles/CircularProgress.css";

/**
 * PUBLIC_INTERFACE
 * CircularProgress: Shows progress as a circular indicator with center text.
 * @param {number} value Progress value to display
 * @param {number} max Maximum progress value (default 100)
 * @param {number} size Size in px (default 80)
 * @param {string} accent Hex or color for progress arc (default #38bdf8)
 * @param {string} text Optional center text
 * @param {string} label Optional subtle label under
 */
function CircularProgress({
  value,
  max = 100,
  size = 80,
  accent = "#38bdf8",
  text,
  label,
}) {
  const radius = (size - 12) / 2;
  const circ = 2 * Math.PI * radius;
  const percent = Math.min(Math.max(value, 0), max) / max;
  const dash = percent * circ;
  return (
    <div className="ys-circular-progress" style={{ width: size, height: size + (label ? 26 : 0) }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#333e4b"
          strokeWidth="8"
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={accent}
          strokeWidth="8"
          fill="none"
          strokeDasharray={circ}
          strokeDashoffset={circ - dash}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset .6s cubic-bezier(.45,1,.28,1)" }}
        />
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          alignmentBaseline="middle"
          fontSize={size / 4}
          fill={accent}
          fontWeight="bold"
          dy="0.10em"
        >
          {text ? text : Math.round(percent * 100)}
        </text>
      </svg>
      {label && (
        <div className="ys-circular-progress-label">{label}</div>
      )}
    </div>
  );
}

export default CircularProgress;
