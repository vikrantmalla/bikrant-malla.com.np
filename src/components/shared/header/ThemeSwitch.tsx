"use client";
import React, { useEffect } from "react";
import { FaMoon, FaSun } from "react-icons/fa";
import { useThemeStore } from "@/store/feature/themeStore";
import * as gtag from "@/helpers/lib/gtag";

export default function Switch() {
  const { isDarkTheme, currentTheme, setIsDarkTheme } = useThemeStore();

  useEffect(() => {
    const lastTheme = window.localStorage.getItem("darkTheme");

    if (lastTheme === "true") {
      setIsDarkTheme(true);
    } else {
      setIsDarkTheme(false);
    }
    const root = document.getElementsByTagName("html")[0];
    root.style.cssText = currentTheme.join(";");
  }, [currentTheme, setIsDarkTheme]);

  const toggle = (currentTheme: string[]) => {
    const root = document.getElementsByTagName("html")[0];
    root.style.cssText = currentTheme.join(";");
    const body = document.getElementsByTagName("body")[0];
    body.style.cssText = "transition: background .5s ease";

    setIsDarkTheme(!isDarkTheme);
    window.localStorage.setItem("darkTheme", String(!isDarkTheme));

    const theme = isDarkTheme ? "light_theme" : "dark_theme";
    gtag.event({
      action: `${theme}`,
      category: "ui_theme",
      label: "switched_theme",
    });
  };

  const arialMessage = `Switch to ${
    isDarkTheme ? "light theme" : "dark theme"
  }`;
  return (
    <button
      role="button"
      className="switch"
      onClick={() => toggle(currentTheme)}
      aria-label={arialMessage}
    >
      {!isDarkTheme ? (
        <FaMoon style={{ color: "#000" }} aria-label={`${arialMessage} icon`} />
      ) : (
        <FaSun
          size={15}
          style={{ color: "fff" }}
          aria-label={`${arialMessage} icon`}
        />
      )}
    </button>
  );
}
