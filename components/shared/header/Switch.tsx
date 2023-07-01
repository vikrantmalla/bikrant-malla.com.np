import React from "react";
import { useTheme } from "../../../context/ThemeContext";
import { FaMoon, FaSun } from "react-icons/fa";

export default function Switch() {
  const { dark, toggle } = useTheme();
  return (
    <button
      className="switch"
      onClick={() => toggle()}
      aria-label="theme-switch"
    >
      {!dark ? <FaMoon /> : <FaSun size={15} style={{ color: "fff" }} />}
    </button>
  );
}
