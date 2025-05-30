import React from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/Navbar.css";

// PUBLIC_INTERFACE
/**
 * Navbar for YouthSync Suite -- always visible, with suite branding and simple nav
 */
const Navbar = () => {
  const location = useLocation();
  return (
    <nav className="ys-navbar">
      <div className="ys-navbar-inner">
        <Link to="/" className="ys-navbar-logo">
          <span className="ys-logo-dot"></span>
          <span className="ys-logo-text">
            YouthSync Suite
          </span>
        </Link>
        <div className="ys-navbar-links">
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
      className={`ys-navbar-link${active ? " ys-navbar-link-active" : ""}`}
    >
      {label}
    </Link>
  );
}

export default Navbar;
