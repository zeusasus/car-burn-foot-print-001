import { useState } from "react";
import { playClick } from "../utils/audio";
import { DrillIcon, PlateIcon, GlassesIcon, SpiralIcon, LightbulbIcon } from "./icons";

function Navbar({ screen, setScreen, onResetProfile }) {
  const [collapsed, setCollapsed] = useState(false);

  // Get user details from localStorage
  const userData = JSON.parse(localStorage.getItem("userData") || "{}");
  const userName = userData.name || "User";
  const userInitials = userName.slice(0, 2).toUpperCase();

  const links = [
    { id: "dashboard", label: "Dashboard", icon: <DrillIcon size={20} /> },
    { id: "input", label: "Log Activities", icon: <PlateIcon size={20} /> },
    { id: "history", label: "Personal History", icon: <GlassesIcon size={20} /> },
    { id: "tips", label: "Eco Pledges", icon: <SpiralIcon size={20} className="icon-spiral" /> },
    { id: "ai", label: "AI Footprint", icon: <LightbulbIcon size={20} /> },
  ];

  const handleNavClick = (id) => {
    playClick();
    setScreen(id);
  };

  const toggleCollapse = () => {
    playClick();
    setCollapsed(!collapsed);
  };

  return (
    <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <div 
        className="sidebar-brand" 
        onClick={() => handleNavClick("dashboard")}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") handleNavClick("dashboard"); }}
        aria-label="karburn Home Dashboard"
      >
        <SpiralIcon size={28} className="icon-spiral" />
        {!collapsed && <span className="brand-text" style={{ color: "var(--primary-green)" }}>karburn</span>}
      </div>

      <div className="sidebar-profile">
        <div className="profile-avatar">{userInitials}</div>
        {!collapsed && (
          <div className="profile-details">
            <div className="profile-name">{userName}</div>
            <div className="profile-role">Earth Citizen</div>
            <button 
              onClick={onResetProfile}
              className="profile-reset-btn"
              style={{
                background: "none",
                border: "none",
                color: "var(--accent-crimson)",
                fontSize: "11px",
                textAlign: "left",
                padding: "4px 0 0 0",
                cursor: "pointer",
                textDecoration: "underline",
                opacity: 0.85,
                fontWeight: 600,
                width: "fit-content",
                fontFamily: "var(--font-sans)"
              }}
              title="Erase profile data and restart tutorial"
            >
              Reset Profile
            </button>
          </div>
        )}
      </div>

      <nav className="sidebar-menu">
        {links.map((link) => (
          <button
            key={link.id}
            className={`menu-item menu-${link.id} ${screen === link.id ? "active" : ""}`}
            onClick={() => handleNavClick(link.id)}
            title={link.label}
          >
            <span className="menu-icon">{link.icon}</span>
            {!collapsed && <span className="menu-label">{link.label}</span>}
          </button>
        ))}
      </nav>

      <button className="sidebar-toggle" onClick={toggleCollapse} title="Toggle Sidebar">
        {collapsed ? "→" : "← Collapse Menu"}
      </button>
    </aside>
  );
}

export default Navbar;