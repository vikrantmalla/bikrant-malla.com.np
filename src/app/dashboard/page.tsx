"use client";
import { useState, useEffect } from "react";
import AuthModal from "@/components/authModal/authModal";
import { useAuth } from "@/hooks/useAuth";
import PortfolioForm from "@/components/forms/Portfolio";
import SideMenu from "@/components/dashboard/SideMenu";
import ThemeSwitch from "@/components/shared/header/ThemeSwitch";
import { useThemeStore } from "@/store/feature/themeStore";
import { toCSSVars } from "@/helpers/utils";
import "./dashboard.scss";

export default function Dashboard() {
  const { user, isAuthenticated, userRole, isCheckingRole, checkUserRole } =
    useAuth();
  const { isDarkTheme, themes } = useThemeStore();
  const currentTheme = isDarkTheme ? themes.dark : themes.light;
  const [inviteData, setInviteData] = useState({ email: "", role: "editor" });
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("overview");
  const [activeForm, setActiveForm] = useState("overview");

  // Check user role on component mount
  useEffect(() => {
    const initializeAuth = async () => {
      if (isAuthenticated) {
        await checkUserRole();
      }
      setLoading(false);
    };

    initializeAuth();
  }, [isAuthenticated, checkUserRole]);

  // Apply theme CSS variables when theme changes
  useEffect(() => {
    const root = document.documentElement;
    const themeVars = toCSSVars(currentTheme);
    root.style.cssText = themeVars.join(";");
  }, [currentTheme]);

  const inviteUser = async () => {
    try {
      const response = await fetch("/api/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: inviteData.email,
          role: inviteData.role,
        }),
      });
      const result = await response.json();
      alert(response.ok ? result.message : `Error: ${result.error}`);
    } catch (error) {
      console.error("Invite error:", error);
      alert("Failed to send invitation");
    }
  };

  const handleMenuToggle = () => {
    setIsSideMenuOpen(!isSideMenuOpen);
  };

  const handleMenuClose = () => {
    setIsSideMenuOpen(false);
  };

  const handleFormChange = (formType: string) => {
    setActiveForm(formType);
  };

  // Show loading state
  if (loading) {
    return (
      <div
        className="dashboard"
        style={{
          background: currentTheme?.background || "#f9fafb",
          color: currentTheme?.text || "#000",
        }}
      >
        <div className="dashboard__loading">
          <div className="dashboard__loading-spinner"></div>
          <h1 className="dashboard__loading-title">Loading Dashboard...</h1>
        </div>
      </div>
    );
  }

  // Check if user has proper permissions
  if (
    isAuthenticated &&
    userRole &&
    !userRole.hasEditorRole &&
    !userRole.isOwner
  ) {
    return (
      <div
        className="dashboard"
        style={{
          background: currentTheme?.background || "#f9fafb",
          color: currentTheme?.text || "#000",
        }}
      >
        <div className="dashboard__unauthorized">
          <h1 className="dashboard__unauthorized-title">Access Denied</h1>
          <p className="dashboard__unauthorized-message">
            You don&apos;t have permission to access this dashboard.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="dashboard"
      style={{
        background: currentTheme?.background || "#f9fafb",
        color: currentTheme?.text || "#000",
      }}
    >
      {/* Header */}
      <header
        className="dashboard__header"
        style={{
          background: currentTheme?.card || "#ffffff",
          borderColor: currentTheme?.card || "#e5e7eb",
        }}
      >
        <div className="dashboard__header-left">
          <button
            onClick={handleMenuToggle}
            className="dashboard__menu-toggle"
            aria-label="Toggle side menu"
            style={{ color: currentTheme?.text || "#000" }}
          >
            <span className="dashboard__menu-icon">☰</span>
          </button>
          <h1
            className="dashboard__title"
            style={{ color: currentTheme?.text || "#000" }}
          >
            Dashboard
          </h1>
        </div>

        {isAuthenticated && (
          <div className="dashboard__header-right">
            <ThemeSwitch className="dashboard__theme-switch" />
            <button
              onClick={() => setIsLogoutModalOpen(true)}
              className="dashboard__logout-btn"
            >
              Logout
            </button>
            <button onClick={() => setIsSideMenuOpen(true)}>
              Open Side Menu
            </button>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="dashboard__main">
        {!isAuthenticated ? (
          <div className="dashboard__auth-section">
            <div
              className="dashboard__auth-card"
              style={{
                background: currentTheme?.card || "#ffffff",
              }}
            >
              <h2
                className="dashboard__auth-title"
                style={{ color: currentTheme?.text || "#000" }}
              >
                Welcome to Dashboard
              </h2>
              <p className="dashboard__auth-message">
                Please log in to access your portfolio management tools.
              </p>
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="dashboard__login-btn"
                style={{ background: currentTheme?.navBackground || "#111111" }}
              >
                Log In
              </button>
            </div>
          </div>
        ) : (
          <div className="dashboard__content">
            {/* Conditional Form Rendering */}
            {activeForm === "overview" && (
              <>
                {/* Overview Section */}
                <section className="dashboard__section">
                  <h2
                    className="dashboard__section-title"
                    style={{ color: currentTheme?.text || "#000" }}
                  >
                    Overview
                  </h2>
                  <div className="dashboard__stats">
                    <div
                      className="dashboard__stat-card"
                      style={{
                        background: currentTheme?.card || "#ffffff",
                      }}
                    >
                      <div className="dashboard__stat-icon">📊</div>
                      <div className="dashboard__stat-content">
                        <h3 className="dashboard__stat-title">
                          Total Projects
                        </h3>
                        <p
                          className="dashboard__stat-value"
                          style={{ color: currentTheme?.text || "#000" }}
                        >
                          12
                        </p>
                      </div>
                    </div>
                    <div
                      className="dashboard__stat-card"
                      style={{
                        background: currentTheme?.card || "#ffffff",
                      }}
                    >
                      <div className="dashboard__stat-icon">💼</div>
                      <div className="dashboard__stat-content">
                        <h3 className="dashboard__stat-title">
                          Portfolio Items
                        </h3>
                        <p
                          className="dashboard__stat-value"
                          style={{ color: currentTheme?.text || "#000" }}
                        >
                          8
                        </p>
                      </div>
                    </div>
                    <div
                      className="dashboard__stat-card"
                      style={{
                        background: currentTheme?.card || "#ffffff",
                      }}
                    >
                      <div className="dashboard__stat-icon">📁</div>
                      <div className="dashboard__stat-content">
                        <h3 className="dashboard__stat-title">Archived</h3>
                        <p
                          className="dashboard__stat-value"
                          style={{ color: currentTheme?.text || "#000" }}
                        >
                          4
                        </p>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Invite Section */}
                <section className="dashboard__section">
                  <h2
                    className="dashboard__section-title"
                    style={{ color: currentTheme?.text || "#000" }}
                  >
                    Invite Collaborator
                  </h2>
                  <div
                    className="dashboard__invite-form"
                    style={{
                      background: currentTheme?.card || "#ffffff",
                    }}
                  >
                    <div className="dashboard__form-group">
                      <label
                        htmlFor="invite-email"
                        className="dashboard__form-label"
                        style={{ color: currentTheme?.text || "#000" }}
                      >
                        Email Address
                      </label>
                      <input
                        id="invite-email"
                        type="email"
                        value={inviteData.email}
                        onChange={(e) =>
                          setInviteData({
                            ...inviteData,
                            email: e.target.value,
                          })
                        }
                        placeholder="Enter collaborator's email"
                        className="dashboard__form-input"
                        style={{
                          background: currentTheme?.background || "#ffffff",
                          color: currentTheme?.text || "#000",
                          borderColor: currentTheme?.card || "#e5e7eb",
                        }}
                      />
                    </div>
                    <div className="dashboard__form-group">
                      <label
                        htmlFor="invite-role"
                        className="dashboard__form-label"
                        style={{ color: currentTheme?.text || "#000" }}
                      >
                        Role
                      </label>
                      <select
                        id="invite-role"
                        value={inviteData.role}
                        onChange={(e) =>
                          setInviteData({ ...inviteData, role: e.target.value })
                        }
                        className="dashboard__form-select"
                        style={{
                          background: currentTheme?.background || "#ffffff",
                          color: currentTheme?.text || "#000",
                          borderColor: currentTheme?.card || "#e5e7eb",
                        }}
                      >
                        <option value="editor">Editor</option>
                        <option value="viewer">Viewer</option>
                      </select>
                    </div>
                    <button
                      onClick={inviteUser}
                      className="dashboard__invite-btn"
                      disabled={!inviteData.email}
                      style={{
                        background: currentTheme?.navBackground || "#111111",
                      }}
                    >
                      Send Invitation
                    </button>
                  </div>
                </section>
              </>
            )}

            {activeForm === "portfolio" && (
              <div>
                <h2
                  className="dashboard__section-title"
                  style={{ color: currentTheme?.text || "#000" }}
                >
                  Portfolio Management
                </h2>
                <PortfolioForm />
              </div>
            )}

            {activeForm === "projects" && (
              <section>
                <h2
                  className="dashboard__section-title"
                  style={{ color: currentTheme?.text || "#000" }}
                >
                  Projects Management
                </h2>
                <div
                  className="dashboard__form-placeholder"
                  style={{
                    background: currentTheme?.card || "#ffffff",
                    padding: "2rem",
                    borderRadius: "0.75rem",
                    textAlign: "center",
                    color: currentTheme?.text || "#000",
                  }}
                >
                  <h3>Projects Form Coming Soon</h3>
                  <p>This form will be implemented to manage projects.</p>
                </div>
              </section>
            )}

            {activeForm === "archive" && (
              <div>
                <h2
                  className="dashboard__section-title"
                  style={{ color: currentTheme?.text || "#000" }}
                >
                  Archive Management
                </h2>
                <div
                  className="dashboard__form-placeholder"
                  style={{
                    background: currentTheme?.card || "#ffffff",
                    padding: "2rem",
                    borderRadius: "0.75rem",
                    textAlign: "center",
                    color: currentTheme?.text || "#000",
                  }}
                >
                  <h3>Archive Form Coming Soon</h3>
                  <p>This form will be implemented to manage archived items.</p>
                </div>
              </div>
            )}

            {activeForm === "settings" && (
              <div>
                <h2
                  className="dashboard__section-title"
                  style={{ color: currentTheme?.text || "#000" }}
                >
                  Settings
                </h2>
                <div
                  className="dashboard__form-placeholder"
                  style={{
                    background: currentTheme?.card || "#ffffff",
                    padding: "2rem",
                    borderRadius: "0.75rem",
                    textAlign: "center",
                    color: currentTheme?.text || "#000",
                  }}
                >
                  <h3>Settings Form Coming Soon</h3>
                  <p>This form will be implemented to manage settings.</p>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Modals */}
      <AuthModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        type="login"
      />
      <AuthModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        type="logout"
      />

      {/* Side Menu */}
      <SideMenu
        isOpen={isSideMenuOpen}
        onClose={handleMenuClose}
        onFormChange={handleFormChange}
      />
    </div>
  );
}
