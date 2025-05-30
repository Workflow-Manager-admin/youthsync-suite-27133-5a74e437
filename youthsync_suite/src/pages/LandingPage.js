import React from "react";
import { useNavigate } from "react-router-dom";

// Icon SVGs for glowing effect
const icons = {
  GradeBoost: (
    <svg width="46" height="46" fill="none" viewBox="0 0 48 48">
      <circle cx="24" cy="24" r="22" stroke="#38bdf8" strokeWidth="3" fill="#22293a" />
      <path d="M15.5 33l3.5-12 8.5-4.5L32.5 33" stroke="#38bdf8" strokeWidth="2" fill="none" />
      <circle cx="24" cy="23" r="3.3" fill="#38bdf8" opacity=".85"/>
    </svg>
  ),
  SplitMate: (
    <svg width="46" height="46" fill="none" viewBox="0 0 48 48">
      <circle cx="24" cy="24" r="22" stroke="#38bdf8" strokeWidth="3" fill="#212428"/>
      <path d="M12 24a12 12 0 0 1 18-10" stroke="#38bdf8" strokeWidth="2"/>
      <path d="M24 24L34 14" stroke="#38bdf8" strokeWidth="2"/>
      <path d="M24 24L34 34" stroke="#38bdf8" strokeWidth="2"/>
      <circle cx="34" cy="34" r="3" fill="#38bdf8" opacity=".7"/>
    </svg>
  ),
  FocusFlow: (
    <svg width="46" height="46" fill="none" viewBox="0 0 48 48">
      <circle cx="24" cy="24" r="22" stroke="#38bdf8" strokeWidth="3" fill="#202731"/>
      <path d="M24 29v-8" stroke="#38bdf8" strokeWidth="2"/>
      <circle cx="24" cy="24" r="3" fill="#38bdf8" opacity=".75"/>
      <path d="M17 24a7 7 0 1 1 14 0 7 7 0 1 1-14 0" stroke="#38bdf8" strokeWidth="1"/>
    </svg>
  ),
};

// Descriptions
const toolDescriptions = {
  GradeBoost:
    "Calculate your CGPA easily! Add grades & credits, get a GPA with a visual progress summary.",
  SplitMate:
    "Quickly split bills among friends. Equal or custom shares, view each share at a glance.",
  FocusFlow:
    "Stay focused! Use a Pomodoro timer, track sessions, and give your best effort easily.",
};

/**
 * Landing page with interactive glowing tool icons
 */
// PUBLIC_INTERFACE
const LandingPage = () => {
  const navigate = useNavigate();

  const toolCards = [
    {
      title: "GradeBoost",
      accent: "from-cyan-400/80 via-sky-500/70 to-blue-300/40",
    },
    {
      title: "SplitMate",
      accent: "from-blue-400/80 via-teal-400/60 to-cyan-300/30",
    },
    {
      title: "FocusFlow",
      accent: "from-cyan-500/80 via-blue-400/60 to-teal-200/40",
    },
  ];
  return (
    <div className="ys-landing-root select-none">
      <div className="ys-landing-subtitle">
        Productivity Tools for Young Minds
      </div>
      <h1 className="ys-landing-title">
        YouthSync Suite
      </h1>
      <p className="ys-landing-desc">
        A modern, all-in-one student toolkit – CGPA calculator, bill splitter, and Pomodoro timer!
      </p>
      <div className="ys-landing-icons-row">
        {toolCards.map((tool, idx) => (
          <IconCircleCard
            key={tool.title}
            icon={icons[tool.title]}
            accent={tool.accent}
            title={tool.title}
            description={toolDescriptions[tool.title]}
            onClick={() => navigate(`/${tool.title.toLowerCase()}`)}
          />
        ))}
      </div>
      <div className="ys-landing-footer">
        Crafted using React, React Router, TailwindCSS · {new Date().getFullYear()}
      </div>
    </div>
  );
};

// PUBLIC_INTERFACE
function IconCircleCard({ icon, accent, title, description, onClick }) {
  // Animate scale/glow on hover
  return (
    <button
      className={
        `relative flex flex-col gap-1 items-center justify-center px-3 py-3
        group hover:z-10 focus:z-10 transition-[box-shadow,transform] duration-200
        rounded-full outline-none`
      }
      style={{ background: "none", border: "none" }}
      aria-label={`Go to ${title}`}
      tabIndex={0}
      onClick={onClick}
      onKeyDown={e => (e.key === "Enter" ? onClick() : undefined)}
    >
      <span
        className={`
          flex items-center justify-center
          rounded-full
          w-32 h-32 md:w-40 md:h-40
          shadow-[0_0_26px_10px_#38bdf888,0_2px_42px_6px_#222a]
          transition-transform duration-200
          bg-gradient-to-br ${accent}
          border-4 border-[#18181b]/70
          group-hover:scale-110 group-hover:shadow-[0_0_36px_20px_#38bdf8cc,0_8px_62px_12px_#2323]
          `}
      >
        {icon}
      </span>
      <div className="mt-3 text-lg font-bold tracking-wide text-white drop-shadow-lg">{title}</div>
      <div className="max-w-[170px] text-xs opacity-70 text-blue-100 text-center">{description}</div>
    </button>
  );
}

export default LandingPage;
