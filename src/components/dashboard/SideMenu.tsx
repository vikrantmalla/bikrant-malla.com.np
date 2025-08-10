"use client";
import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useThemeStore } from "@/store/feature/themeStore";
import "./SideMenu.scss";

interface SideMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

interface MenuItem {
  id: string;
  label: string;
  icon: string;
  href: string;
  isActive?: boolean;
}

const SideMenu: React.FC<SideMenuProps> = ({ isOpen, onClose }) => {
  const { user, userRole } = useAuth();
  const { isDarkTheme, themes } = useThemeStore();
  const currentTheme = isDarkTheme ? themes.dark : themes.light;
  const [activeItem, setActiveItem] = useState("dashboard");

  const menuItems: MenuItem[] = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: "📊",
      href: "/dashboard",
    },
    {
      id: "portfolio",
      label: "Portfolio",
      icon: "💼",
      href: "/dashboard/portfolio",
    },
    {
      id: "projects",
      label: "Projects",
      icon: "🚀",
      href: "/dashboard/projects",
    },
    {
      id: "archive",
      label: "Archive",
      icon: "📁",
      href: "/dashboard/archive",
    },
    {
      id: "settings",
      label: "Settings",
      icon: "⚙️",
      href: "/dashboard/settings",
    },
  ];

  const handleItemClick = (itemId: string) => {
    setActiveItem(itemId);
    onClose();
  };

  const getUserRoleDisplay = () => {
    if (userRole?.isOwner) return "Owner";
    if (userRole?.hasEditorRole) return "Editor";
    return "User";
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && <div className="side-menu-backdrop" onClick={onClose} />}
      
      {/* Side Menu */}
      <div className={`side-menu ${isOpen ? "side-menu--open" : ""}`} style={{
        background: currentTheme.navBackground,
        color: currentTheme.textRev
      }}>
        {/* Header */}
        <div className="side-menu__header">
          <div className="side-menu__logo">
            <span className="side-menu__logo-icon">🎨</span>
            <span className="side-menu__logo-text">Portfolio</span>
          </div>
          <button className="side-menu__close" onClick={onClose}>
            <span className="side-menu__close-icon">×</span>
          </button>
        </div>

        {/* User Profile */}
        <div className="side-menu__profile">
          <div className="side-menu__avatar">
            {user?.picture ? (
              <img 
                src={user.picture} 
                alt={user.given_name || "User"} 
                className="side-menu__avatar-img"
              />
            ) : (
              <div className="side-menu__avatar-placeholder">
                {user?.given_name?.charAt(0) || user?.email?.charAt(0) || "U"}
              </div>
            )}
          </div>
          <div className="side-menu__user-info">
            <h3 className="side-menu__user-name">
              {user?.given_name || user?.email || "User"}
            </h3>
            <span className="side-menu__user-role">{getUserRoleDisplay()}</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="side-menu__nav">
          <ul className="side-menu__nav-list">
            {menuItems.map((item) => (
              <li key={item.id} className="side-menu__nav-item">
                <Link
                  href={item.href}
                  className={`side-menu__nav-link ${
                    activeItem === item.id ? "side-menu__nav-link--active" : ""
                  }`}
                  onClick={() => handleItemClick(item.id)}
                >
                  <span className="side-menu__nav-icon">{item.icon}</span>
                  <span className="side-menu__nav-label">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer */}
        <div className="side-menu__footer">
          <div className="side-menu__footer-links">
            <Link href="/" className="side-menu__footer-link">
              View Site
            </Link>
            <Link href="/dashboard/settings" className="side-menu__footer-link">
              Settings
            </Link>
          </div>
          <div className="side-menu__version">
            v1.0.0
          </div>
        </div>
      </div>
    </>
  );
};

export default SideMenu;
