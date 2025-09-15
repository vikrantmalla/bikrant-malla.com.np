"use client";
import React, { useState } from "react";
import ProjectLimitsConfig from "./ProjectLimitsConfig";
import TechOptionsManager from "./TechOptionsManager";
import TechTagsManager from "./TechTagsManager";
import "./SettingsTabs.scss";

interface SettingsTabsProps {
  currentTheme?: {
    text?: string;
    card?: string;
    background?: string;
  };
}

type SettingsTabType = "project-limits" | "tech-options" | "tech-tags";

const SettingsTabs: React.FC<SettingsTabsProps> = ({ currentTheme }) => {
  const [activeTab, setActiveTab] = useState<SettingsTabType>("project-limits");

  const tabs = [
    {
      id: "project-limits" as SettingsTabType,
      label: "Project Limits",
      icon: "📊",
      component: <ProjectLimitsConfig />
    },
    {
      id: "tech-options" as SettingsTabType,
      label: "Tech Options",
      icon: "⚙️",
      component: <TechOptionsManager />
    },
    {
      id: "tech-tags" as SettingsTabType,
      label: "Tech Tags",
      icon: "🏷️",
      component: <TechTagsManager />
    }
  ];

  const activeTabData = tabs.find(tab => tab.id === activeTab);

  return (
    <div className="settings-tabs">
      {/* Tab Navigation */}
      <div 
        className="settings-tabs__nav"
        style={{ background: currentTheme?.background || "#f5f5f5" }}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`settings-tabs__nav-item ${
              activeTab === tab.id ? "settings-tabs__nav-item--active" : ""
            }`}
            onClick={() => setActiveTab(tab.id)}
            style={{
              background: activeTab === tab.id 
                ? currentTheme?.card || "#ffffff" 
                : "transparent",
              color: currentTheme?.text || "#000",
              boxShadow: activeTab === tab.id 
                ? "0 2px 4px rgba(0, 0, 0, 0.1)" 
                : "none",
            }}
            aria-selected={activeTab === tab.id}
            role="tab"
          >
            <span className="settings-tabs__nav-icon">{tab.icon}</span>
            <span className="settings-tabs__nav-label">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div 
        className="settings-tabs__content"
        style={{ background: currentTheme?.card || "#ffffff" }}
      >
        <div className="settings-tabs__content-header">
          <h3 
            className="settings-tabs__content-title"
            style={{ color: currentTheme?.text || "#000" }}
          >
            {activeTabData?.label}
          </h3>
          <p 
            className="settings-tabs__content-description"
            style={{ color: currentTheme?.text || "#000" }}
          >
            {activeTab === "project-limits" && "Configure maximum project limits and constraints"}
            {activeTab === "tech-options" && "Manage available technology options for projects"}
            {activeTab === "tech-tags" && "Manage technology tags and categories"}
          </p>
        </div>
        
        <div className="settings-tabs__content-body">
          {activeTabData?.component}
        </div>
      </div>
    </div>
  );
};

export default SettingsTabs;
