"use client";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { FaMoon, FaSun } from "react-icons/fa";
import { setIsDarkTheme } from "@/redux/feature/themeSlice";
import * as gtag from "@/helpers/lib/gtag";

export default function Switch() {
  const dispatch = useDispatch<AppDispatch>();
  const isDarkTheme = useSelector(
    (state: RootState) => state.theme.isDarkTheme
  );
  const currentTheme = useSelector(
    (state: RootState) => state.theme.currentTheme
  );

  useEffect(() => {
    const lastTheme = window.localStorage.getItem("darkTheme");

    if (lastTheme === "true") {
      dispatch(setIsDarkTheme(true));
    } else {
      dispatch(setIsDarkTheme(false));
    }
    const root = document.getElementsByTagName("html")[0];
    root.style.cssText = currentTheme.join(";");
  }, [currentTheme, dispatch]);

  const toggle = (currentTheme: string[]) => {
    const root = document.getElementsByTagName("html")[0];
    root.style.cssText = currentTheme.join(";");
    const body = document.getElementsByTagName("body")[0];
    body.style.cssText = "transition: background .5s ease";

    dispatch(setIsDarkTheme(!isDarkTheme));
    window.localStorage.setItem("darkTheme", String(!isDarkTheme));

    const theme = isDarkTheme ? "light_theme" : "dark_theme";
    gtag.event({
      action: `${theme}`,
      category: "ui_theme",
      label: "switched_theme",
    });
  };

  return (
    <button
      className="switch"
      onClick={() => toggle(currentTheme)}
      aria-label="theme-switch"
    >
      {!isDarkTheme ? <FaMoon style={{ color: "#000" }} /> : <FaSun size={15} style={{ color: "fff" }} />}
    </button>
  );
}
