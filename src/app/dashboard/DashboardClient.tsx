"use client";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import PortfolioForm from "@/components/dashboard/Portfolio";
import ProjectsForm from "@/components/dashboard/Projects";
import ArchiveProjectsForm from "@/components/dashboard/ArchiveProjects";
import SideMenu from "@/components/dashboard/SideMenu";
import { useThemeStore } from "@/store/feature/themeStore";
import { toCSSVars } from "@/helpers/utils";
import "./dashboard.scss";
import { Invite } from "@/components/dashboard/Invite";
import ProjectLimitsConfig from "@/components/dashboard/ProjectLimitsConfig";
import TechOptionsManager from "@/components/dashboard/TechOptionsManager";
import TechTagsManager from "@/components/dashboard/TechTagsManager";
import { PortfolioDetails } from "@/types/data";
import LogoutButton from "@/components/auth/LogoutButton";
import "@/components/auth/auth.scss";

interface DashboardClientProps {
  initialPortfolioData: {
    success: boolean;
    data?: PortfolioDetails;
    error?: string;
    isDatabaseError?: boolean;
  };
}

export default function DashboardClient({
  initialPortfolioData,
}: DashboardClientProps) {
  const { user, isAuthenticated, userRole, isCheckingRole, checkUserRole, isLoading, redirectToLogin } =
    useAuth();
  const { isDarkTheme, themes } = useThemeStore();
  const currentTheme = isDarkTheme ? themes.dark : themes.light;
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

  // Server-side authentication handles protection, no client-side redirect needed

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
  if (loading || isLoading) {
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

  // Handle case when no portfolio exists or portfolio is empty
  if (initialPortfolioData.success && (!portfolioData || !portfolioData.name)) {
    return (
      <div
        className="dashboard"
        style={{
          background: currentTheme?.background || "#f9fafb",
          color: currentTheme?.text || "#000",
        }}
      >
        <div className="dashboard__error">
          <h1 className="dashboard__error-title">No Portfolio Found</h1>
          <p className="dashboard__error-message">
            You don&apos;t have a portfolio yet. Please contact the administrator to set up your portfolio.
          </p>
          <div className="dashboard__error-actions">
            <button 
              onClick={() => window.location.reload()} 
              className="dashboard__error-retry"
            >
              Refresh Page
            </button>
            <button 
              onClick={() => redirectToLogin('/dashboard')} 
              className="dashboard__error-login"
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

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
        onLogout={() => {}}
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
                portfolioId={portfolioData?.id || undefined}
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
                portfolioId={portfolioData?.id || undefined}
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
              <TechOptionsManager />
              <TechTagsManager />
            </div>
          )}
        </div>
      </main>

      {/* User Actions */}
      <div className="dashboard__user-actions">
        <LogoutButton className="dashboard__logout-btn">
          Logout
        </LogoutButton>
      </div>
    </div>
  );
}
