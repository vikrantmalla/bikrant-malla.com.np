import React from "react";
import { useTheme } from "../../../context/ThemeContext";

export default function Switch() {
  const { dark, toggle } = useTheme();
  return (
    <button className="switch" onClick={() => toggle()}>
      {!dark ? <i className="far fa-moon" /> : <i className="far fa-sun" />}
    </button>
  );
}
