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
import Settings from "@/components/dashboard/Settings";
import { PortfolioDetails } from "@/types/data";
import { ActiveForm } from "@/types/enum";

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
  const {
    user,
    isAuthenticated,
    userRole,
    isCheckingRole,
    checkUserRole,
    isLoading,
    redirectToLogin,
    logout,
  } = useAuth();
  const { isDarkTheme, themes } = useThemeStore();
  const currentTheme = isDarkTheme ? themes.dark : themes.light;
  const [loading, setLoading] = useState(true);
  const [activeForm, setActiveForm] = useState<ActiveForm>(ActiveForm.OVERVIEW);
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

  const handleFormChange = (formType: ActiveForm) => {
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
            You don&apos;t have a portfolio yet. Please contact the
            administrator to set up your portfolio.
          </p>
          <div className="dashboard__error-actions">
            <button
              onClick={() => window.location.reload()}
              className="dashboard__error-retry"
            >
              Refresh Page
            </button>
            <button
              onClick={() => redirectToLogin("/dashboard")}
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
        onLogout={logout}
        onThemeToggle={() => {}}
      />

      {/* Main Content */}
      <main className="dashboard__main dashboard__main--with-sidebar">
        {/* Full Width Header */}
        <div className="dashboard__header-full">
          <div className="dashboard__content">
            <div className="dashboard__header-content">
              <div className="dashboard__header-text">
                {activeForm === ActiveForm.OVERVIEW && (
                  <>
                    <h2 className="dashboard__section-title">Overview</h2>
                    <p className="dashboard__header-subtitle">Dashboard statistics and insights</p>
                  </>
                )}
                {activeForm === ActiveForm.PORTFOLIO && (
                  <>
                    <h2 className="dashboard__section-title">Portfolio Management</h2>
                    <p className="dashboard__header-subtitle">Manage your portfolio information and details</p>
                  </>
                )}
                {activeForm === ActiveForm.PROJECTS && (
                  <>
                    <h2 className="dashboard__section-title">Projects Management</h2>
                    <p className="dashboard__header-subtitle">Add, edit, and organize your projects</p>
                  </>
                )}
                {activeForm === ActiveForm.ARCHIVE && (
                  <>
                    <h2 className="dashboard__section-title">Archive Management</h2>
                    <p className="dashboard__header-subtitle">View and manage archived projects</p>
                  </>
                )}
                {activeForm === ActiveForm.SETTINGS && (
                  <>
                    <h2 className="dashboard__section-title">Settings</h2>
                    <p className="dashboard__header-subtitle">Configure your dashboard preferences</p>
                  </>
                )}
              </div>
              <div className="dashboard__header-actions">
                <div className="dashboard__header-breadcrumb">
                  <span className="dashboard__breadcrumb-item">Dashboard</span>
                  <span className="dashboard__breadcrumb-separator">›</span>
                  <span className="dashboard__breadcrumb-current">
                    {activeForm === ActiveForm.OVERVIEW && "Overview"}
                    {activeForm === ActiveForm.PORTFOLIO && "Portfolio"}
                    {activeForm === ActiveForm.PROJECTS && "Projects"}
                    {activeForm === ActiveForm.ARCHIVE && "Archive"}
                    {activeForm === ActiveForm.SETTINGS && "Settings"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="dashboard__content">
          {/* Conditional Form Rendering */}
          {activeForm === ActiveForm.OVERVIEW && (
            <>
              {/* Overview Section */}
              <div className="dashboard__section">
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

          {activeForm === ActiveForm.PORTFOLIO && (
            <div>
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

          {activeForm === ActiveForm.PROJECTS && (
            <div>
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

          {activeForm === ActiveForm.ARCHIVE && (
            <div>
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

          {activeForm === ActiveForm.SETTINGS && (
            <Settings currentTheme={currentTheme} />
          )}
        </div>
      </main>

    </div>
  );
}
