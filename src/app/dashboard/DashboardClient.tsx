"use client";
import { useState, useEffect, useRef } from "react";
import AuthModal from "@/components/authModal/authModal";
import { useAuth } from "@/hooks/useAuth";
import PortfolioForm from "@/components/forms/Portfolio";
import ProjectsForm from "@/components/forms/Projects";
import ArchiveProjectsForm from "@/components/forms/ArchiveProjects";
import SideMenu from "@/components/dashboard/SideMenu";
import { useThemeStore } from "@/store/feature/themeStore";
import { toCSSVars } from "@/helpers/utils";
import "./dashboard.scss";
import { Invite } from "@/components/dashboard/Invite";
import ProjectLimitsConfig from "@/components/dashboard/ProjectLimitsConfig";
import { PortfolioDetails } from "@/types/data";

interface DashboardClientProps {
  initialPortfolioData: {
    success: boolean;
    data?: PortfolioDetails;
    error?: string;
  };
}

export default function DashboardClient({
  initialPortfolioData,
}: DashboardClientProps) {
  const { user, isAuthenticated, userRole, isCheckingRole, checkUserRole } =
    useAuth();
  const { isDarkTheme, themes } = useThemeStore();
  const currentTheme = isDarkTheme ? themes.dark : themes.light;
  const [inviteData, setInviteData] = useState({ email: "", role: "EDITOR" });
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeForm, setActiveForm] = useState("overview");
  const hasInitializedAuth = useRef(false);
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);

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

  // Get portfolio data for stats
  const portfolioData = initialPortfolioData.success
    ? initialPortfolioData.data
    : null;
  const totalProjects = portfolioData?.projects?.length || 0;
  const totalPortfolioItems = portfolioData ? 1 : 0; // Portfolio itself counts as 1
  const totalArchived = portfolioData?.archiveProjects?.length || 0;

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
        isOpen={isSideMenuOpen}
        onClose={() => setIsSideMenuOpen(false)}
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
                        {totalProjects}
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
                        {totalPortfolioItems}
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
                        {totalArchived}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Invite Section */}
              <Invite />
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
              {portfolioData && (
                <div className="dashboard__current-data">
                  <p style={{ color: currentTheme?.text || "#000" }}>
                    Current Portfolio: <strong>{portfolioData.name}</strong> -{" "}
                    {portfolioData.jobTitle}
                  </p>
                </div>
              )}
              <PortfolioForm portfolioData={portfolioData} />
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
              {portfolioData?.projects && portfolioData.projects.length > 0 && (
                <div className="dashboard__current-data">
                  <p style={{ color: currentTheme?.text || "#000" }}>
                    Total Projects:{" "}
                    <strong>{portfolioData.projects.length}</strong>
                  </p>
                </div>
              )}
              <ProjectsForm
                projectsData={portfolioData?.projects}
                portfolioId={portfolioData?.id}
              />
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
              {portfolioData?.archiveProjects &&
                portfolioData.archiveProjects.length > 0 && (
                  <div className="dashboard__current-data">
                    <p style={{ color: currentTheme?.text || "#000" }}>
                      Total Archived Projects:{" "}
                      <strong>{portfolioData.archiveProjects.length}</strong>
                    </p>
                  </div>
                )}
              <ArchiveProjectsForm
                archiveProjectsData={portfolioData?.archiveProjects}
                portfolioId={portfolioData?.id}
              />
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
              <ProjectLimitsConfig />
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
