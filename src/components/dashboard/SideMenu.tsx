"use client";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useThemeStore } from "@/store/feature/themeStore";
import "./SideMenu.scss";

interface SideMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onFormChange?: (formType: string) => void;
}

interface MenuItem {
  id: string;
  label: string;
  icon: string;
  formType: string;
  isActive?: boolean;
}

const SideMenu: React.FC<SideMenuProps> = ({ isOpen, onClose, onFormChange }) => {
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

        {/* Footer */}
        <div className="side-menu__footer">
          <div className="side-menu__footer-links">
            <div className="side-menu__footer-link">
              View Site
            </div>
            <div className="side-menu__footer-link">
              Settings
            </div>
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
