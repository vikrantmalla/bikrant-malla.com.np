"use client";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useThemeStore } from "@/store/feature/themeStore";
import ThemeSwitch from "@/components/shared/header/ThemeSwitch";
import "./SideMenu.scss";

interface SideMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onFormChange?: (formType: string) => void;
  onLogout?: () => void;
  onThemeToggle?: () => void;
}

interface MenuItem {
  id: string;
  label: string;
  icon: string;
  formType: string;
  isActive?: boolean;
}

const SideMenu: React.FC<SideMenuProps> = ({ 
  isOpen, 
  onClose, 
  onFormChange, 
  onLogout,
  onThemeToggle 
}) => {
  const { user, userRole } = useAuth();
  const { isDarkTheme, themes } = useThemeStore();
  const currentTheme = isDarkTheme ? themes.dark : themes.light;
  const [activeItem, setActiveItem] = useState("dashboard");

  const menuItems: MenuItem[] = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: "📊",
      formType: "overview",
    },
    {
      id: "portfolio",
      label: "Portfolio",
      icon: "💼",
      formType: "portfolio",
    },
    {
      id: "projects",
      label: "Projects",
      icon: "🚀",
      formType: "projects",
    },
    {
      id: "archive",
      label: "Archive",
      icon: "📁",
      formType: "archive",
    },
    {
      id: "settings",
      label: "Settings",
      icon: "⚙️",
      formType: "settings",
    },
  ];

  const handleItemClick = (itemId: string, formType: string) => {
    setActiveItem(itemId);
    onFormChange?.(formType);
  };

  const getUserRoleDisplay = () => {
    if (userRole?.isOwner) return "Owner";
    if (userRole?.hasEditorRole) return "Editor";
    return "User";
  };

  const handleLogout = () => {
    onLogout?.();
  };

  return (
    <div className={`side-menu side-menu--permanent ${isOpen ? "side-menu--open" : ""}`} style={{
      background: currentTheme.navBackground,
      color: currentTheme.textRev
    }}>
      {/* Header Section */}
      <div className="side-menu__header-section">
        <div className="side-menu__logo">
          <span className="side-menu__logo-icon">🎨</span>
          <span className="side-menu__logo-text">Portfolio</span>
        </div>
        
        {/* Theme Toggle */}
        <div className="side-menu__theme-toggle">
          <ThemeSwitch className="side-menu__theme-switch" />
        </div>
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
              <div
                className={`side-menu__nav-link ${
                  activeItem === item.id ? "side-menu__nav-link--active" : ""
                }`}
                onClick={() => handleItemClick(item.id, item.formType)}
              >
                <span className="side-menu__nav-icon">{item.icon}</span>
                <span className="side-menu__nav-label">{item.label}</span>
              </div>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer Actions */}
      <div className="side-menu__footer">
        <button 
          className="side-menu__logout-btn"
          onClick={handleLogout}
          style={{
            background: currentTheme.card || "#ffffff",
            color: currentTheme.text || "#000",
            border: `1px solid ${currentTheme.card || "#e5e7eb"}`
          }}
        >
          <span className="side-menu__logout-icon">🚪</span>
          <span className="side-menu__logout-text">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default SideMenu;
