import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { FaMoon, FaSun } from "react-icons/fa";
import { setIsDarkTheme } from "@/redux/feature/themeSlice";
import * as gtag from "@/helpers/lib/gtag";

export default function Switch() {
  const dispatch = useDispatch<AppDispatch>();
  const isDarkTheme = useSelector((state: RootState) => state.theme.isDarkTheme);


  const toggle = () => {
    const body = document.getElementsByTagName("body")[0];
    body.style.cssText = "transition: background .5s ease";

    dispatch(setIsDarkTheme(!isDarkTheme))
    // @ts-ignore:next-line
    window.localStorage.setItem("darkTheme", !isDarkTheme);
 
    const theme  = isDarkTheme ? "light_theme" : "dark_theme"
    gtag.event({
      action: `${theme}`,
      category: "ui_theme",
      label: "switched_theme",
    });
  };
  return (
    <button
      className="switch"
      onClick={() => toggle()}
      aria-label="theme-switch"
    >
      {!isDarkTheme ? <FaMoon /> : <FaSun size={15} style={{ color: "fff" }} />}
    </button>
  );
}
