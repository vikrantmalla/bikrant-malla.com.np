"use client";
import React from "react";
import SettingsTabs from "./SettingsTabs";
import "./Settings.scss";

interface SettingsProps {
  currentTheme?: {
    text?: string;
    card?: string;
    background?: string;
  };
}

const Settings: React.FC<SettingsProps> = ({ currentTheme }) => {
  return (
    <div className="settings-container">
      <SettingsTabs currentTheme={currentTheme} />
    </div>
  );
};

export default Settings;
