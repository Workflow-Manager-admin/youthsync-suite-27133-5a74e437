import React from "react";
import { Link, useLocation } from "react-router-dom";

// PUBLIC_INTERFACE
/**
 * Navbar for YouthSync Suite -- always visible, with suite branding and simple nav
 */
const Navbar = () => {
  const location = useLocation();
  return (
    <nav className="fixed w-full z-50 top-0 left-0 bg-[#18181b] border-b border-[#222] px-2 py-3 md:py-4 shadow-lg">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 select-none group">
          <span className="block w-4 h-4 rounded-full bg-[#38bdf8] shadow-[0_0_12px_#38bdf8AA] group-hover:scale-110 transition"></span>
          <span className="font-semibold text-lg md:text-xl tracking-wide bg-gradient-to-br from-[#38bdf8] to-blue-200 text-transparent bg-clip-text select-none">
            YouthSync Suite
          </span>
        </Link>
        <div className="flex gap-2 md:gap-4">
          <NavItem
            label="GradeBoost"
            to="/gradeboost"
            active={location.pathname.startsWith("/gradeboost")}
          />
          <NavItem
            label="SplitMate"
            to="/splitmate"
            active={location.pathname.startsWith("/splitmate")}
          />
          <NavItem
            label="FocusFlow"
            to="/focusflow"
            active={location.pathname.startsWith("/focusflow")}
          />
        </div>
      </div>
    </nav>
  );
};

// PUBLIC_INTERFACE
function NavItem({ label, to, active }) {
  return (
    <Link
      to={to}
      className={`px-3 py-[6px] rounded transition font-medium text-sm md:text-base ${
        active
          ? "bg-[#38bdf8] text-[#18181b] shadow-[0_0_8px_#38bdf8DD]"
          : "hover:bg-[#222] text-gray-200"
      }`}
    >
      {label}
    </Link>
  );
}

export default Navbar;
