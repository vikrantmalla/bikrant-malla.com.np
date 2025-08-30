"use client";
import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import "./SideMenu.scss";
import { FaArrowLeft, FaBars, FaTimes } from "react-icons/fa";

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
  hasSubmenu?: boolean;
}

const SideMenu: React.FC<SideMenuProps> = ({
  isOpen,
  onClose,
  onFormChange,
  onLogout,
  onThemeToggle,
}) => {
  const { user, userRole } = useAuth();
  const [activeItem, setActiveItem] = useState("dashboard");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
    // Close mobile menu when item is clicked
    if (window.innerWidth < 768) {
      setIsMobileMenuOpen(false);
    }
  };

  const handleLogout = () => {
    onLogout?.();
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const getUserInitials = () => {
    if (user?.given_name && user?.family_name) {
      return `${user.given_name.charAt(0)}${user.family_name.charAt(0)}`;
    }
    if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return "U";
  };

  return (
    <>
      {/* Mobile Menu Toggle Button */}
      <button
        className="side-menu__mobile-toggle"
        onClick={toggleMobileMenu}
        aria-label="Toggle menu"
      >
        <FaBars />
      </button>

      {/* Mobile Backdrop */}
      {isMobileMenuOpen && (
        <div
          className="side-menu__mobile-backdrop"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <div
        className={`side-menu side-menu--permanent ${
          isOpen ? "side-menu--open" : ""
        } ${isMobileMenuOpen ? "side-menu--mobile-open" : ""}`}
      >
        {/* Header Section */}
        <div className="side-menu__header-section">
          <div className="side-menu__header-content">
            <div className="side-menu__header-top">
              <Link href="/" className="side-menu__back-button">
                <FaArrowLeft />
                <span>Back to Site</span>
              </Link>
              <button 
                className="side-menu__close-button"
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Close menu"
              >
                <FaTimes />
              </button>
            </div>
          </div>
        </div>

        {/* User Profile Section */}
        <div className="side-menu__profile">
          <div className="side-menu__avatar">
            {user?.picture ? (
              <img
                src={user.picture}
                alt="Profile"
                className="side-menu__avatar-img"
              />
            ) : (
              <div className="side-menu__avatar-placeholder">
                {getUserInitials()}
              </div>
            )}
            <h3 className="side-menu__user-info-name">
              {user?.given_name && user?.family_name
                ? `${user.given_name} ${user.family_name}`
                : user?.email || "User"}
            </h3>
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
                  {item.hasSubmenu && (
                    <span className="side-menu__nav-chevron">›</span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer Actions */}
        <div className="side-menu__footer">
          <button className="side-menu__logout-btn" onClick={handleLogout}>
            <span className="side-menu__logout-icon">🚪</span>
            <span className="side-menu__logout-text">Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default SideMenu;
