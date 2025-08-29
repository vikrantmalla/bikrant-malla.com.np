"use client";
import { useState, useEffect, useRef } from "react";
import AuthModal from "@/components/authModal/authModal";
import { useAuth } from "@/hooks/useAuth";
import PortfolioForm from "@/components/forms/Portfolio";
import ProjectsForm from "@/components/forms/Projects";
import ArchiveProjectsForm from "@/components/forms/ArchiveProjects";
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
  const [activeSection, setActiveSection] = useState("overview");
  const [activeForm, setActiveForm] = useState("overview");
  const hasInitializedAuth = useRef(false);

  // Check user role on component mount
  useEffect(() => {
    if (hasInitializedAuth.current) return;

    const initializeAuth = async () => {
      if (isAuthenticated) {
        await checkUserRole();
      }
      setLoading(false);
      hasInitializedAuth.current = true;
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
      {/* Side Menu - Always Visible */}
      <SideMenu
        isOpen={true}
        onClose={() => {}}
        onFormChange={handleFormChange}
        onLogout={() => setIsLogoutModalOpen(true)}
        onThemeToggle={() => {}}
      />

      {/* Main Content */}
      <main className="dashboard__main dashboard__main--with-sidebar">
        <div className="dashboard__content">
          {/* Conditional Form Rendering */}
          {activeForm === "overview" && (
            <>
              {/* Overview Section */}
              <div className="dashboard__section">
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
                      <h3 className="dashboard__stat-title">Total Projects</h3>
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
                      <h3 className="dashboard__stat-title">Portfolio Items</h3>
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
              </div>

              {/* Invite Section */}
              <div className="dashboard__section">
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
              </div>
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
            <div>
              <h2
                className="dashboard__section-title"
                style={{ color: currentTheme?.text || "#000" }}
              >
                Projects Management
              </h2>
              <ProjectsForm />
            </div>
          )}

          {activeForm === "archive" && (
            <div>
              <h2
                className="dashboard__section-title"
                style={{ color: currentTheme?.text || "#000" }}
              >
                Archive Management
              </h2>
              <ArchiveProjectsForm />
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
    </div>
  );
}
