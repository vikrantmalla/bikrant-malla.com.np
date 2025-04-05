"use client";
import React, { useEffect, useCallback } from "react";
import { FaMoon, FaSun } from "react-icons/fa";
import { useThemeStore } from "@/store/feature/themeStore";
import { lightTheme, darkTheme } from "@/store/feature/themeStore";
import * as gtag from "@/helpers/lib/gtag";
import { toCSSVars } from "@/helpers/utils";

interface ThemeSwitchProps {
  className?: string;
}

/**
 * ThemeSwitch Component
 *
 * This component provides a toggle button to switch between light and dark themes.
 * It uses local storage to remember the user's theme preference and applies the
 * selected theme using CSS classes and optional CSS variables.
 *
 * Key Features:
 * - Toggles between light and dark themes.
 * - Applies CSS classes to the root HTML element for theming.
 * - Optionally sets CSS variables for dynamic styling.
 * - Stores the theme preference in local storage.
 * - Tracks theme switch events using Google Analytics (gtag).
 *
 * Usage:
 * - Include this component in your application to provide a theme switcher.
 * - Ensure that the theme objects (darkTheme and lightTheme) are defined and
 *   contain the necessary CSS variables.
 */
const ThemeSwitch: React.FC<ThemeSwitchProps> = ({ className = "switch" }) => {
  const { isDarkTheme, setIsDarkTheme } = useThemeStore();

  // Apply theme (class-based + optional CSS variables)
  const applyTheme = useCallback((isDark: boolean) => {
    const root = document.documentElement;

    // Toggle class on HTML element
    root.classList.remove(isDark ? "light" : "dark");
    root.classList.add(isDark ? "dark" : "light");

    // Optional: Keep CSS variables if needed
    const themeVars = isDark ? toCSSVars(darkTheme) : toCSSVars(lightTheme);
    root.style.cssText = themeVars.join(";");
  }, []);

  useEffect(() => {
    const storedTheme = window.localStorage.getItem("darkTheme");
    const shouldBeDark = storedTheme === "true";

    setIsDarkTheme(shouldBeDark);
    applyTheme(shouldBeDark);
  }, [setIsDarkTheme, applyTheme]);

  const handleToggle = useCallback(() => {
    const newThemeState = !isDarkTheme;
    const body = document.body;

    // Apply transition
    body.style.transition = "background 0.5s ease";

    setIsDarkTheme(newThemeState);
    applyTheme(newThemeState);
    window.localStorage.setItem("darkTheme", String(newThemeState));

    const themeEvent = newThemeState ? "dark_theme" : "light_theme";
    gtag.event({
      action: themeEvent,
      category: "ui_theme",
      label: "switched_theme",
    });
  }, [isDarkTheme, setIsDarkTheme, applyTheme]);

  const ariaLabel = `Switch to ${isDarkTheme ? "light" : "dark"} theme`;

  return (
    <button
      role="button"
      className={className}
      onClick={handleToggle}
      aria-label={ariaLabel}
    >
      {isDarkTheme ? (
        <FaSun
          size={15}
          style={{ color: "#fff" }}
          aria-label={`${ariaLabel} icon`}
        />
      ) : (
        <FaMoon style={{ color: "#000" }} aria-label={`${ariaLabel} icon`} />
      )}
    </button>
  );
};

export default ThemeSwitch;
