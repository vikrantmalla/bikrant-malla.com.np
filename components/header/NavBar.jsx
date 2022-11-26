import React, { useState } from "react";
import Link from "next/link";
import Switch from "./Switch";
import Backdrop from "./Backdrop";
import $ from "jquery";

const NavBar = () => {
  const [click, setClick] = useState(false);

  const handleClick = () => setClick(!click);

  if (process.browser) {
    if (click) {
      document.body.classList.add("active-modal");
    } else {
      document.body.classList.remove("active-modal");
    }
  }

  const _handleTabClick = (tabId) => {
    const checkWidth = window.matchMedia("(min-width: 677px)");
    var tab = $(tabId);
    var tabOffset = tab?.offset();

    if (tabOffset != null) {
      $("html, body").animate(
        {
          scrollTop: tabOffset.top - (checkWidth.matches ? 116.5 : 126),
        },
        "slow"
      );
    }
    if (checkWidth === "667px") {
      setClick(!click);
    }
  };

  return (
    <>
      <header className="header container">
        <div className="nav-container">
          <nav className="nav">
            <ul className={click ? "nav-menu active" : "nav-menu"}>
              <li className="nav-item ff-serif-jose fs-400">
                <a onClick={() => _handleTabClick("#aboutme")}>AboutMe</a>
              </li>
              <li className="nav-item ff-serif-jose fs-400">
                <a onClick={() => _handleTabClick("#skill")}>Skill</a>
              </li>
              <li className="nav-item ff-serif-jose fs-400">
                <a onClick={() => _handleTabClick("#project")}>Project</a>
              </li>
              <li className="nav-item ff-serif-jose fs-400">
                <a onClick={() => _handleTabClick("#concept")}>Concept</a>
              </li>
            </ul>
          </nav>
          {!click && (
            <div className="menu-icon" onClick={handleClick}>
              <i className={click ? "fas fa-times" : "fas fa-bars"} />
            </div>
          )}
          {click && (
            <>
              <div className="menu-icon" onClick={handleClick}>
                <i className={click ? "fas fa-times" : "fas fa-bars"} />
              </div>
              <nav className="nav">
                <ul className={click ? "nav-menu active" : "nav-menu"}>
                  <li className="nav-item ff-serif-jose fs-400" onClick={handleClick}>
                    <a onClick={() => _handleTabClick("#aboutme")}>AboutMe</a>
                  </li>
                  <li className="nav-item ff-serif-jose fs-400" onClick={handleClick}>
                    <a onClick={() => _handleTabClick("#skill")}>Skill</a>
                  </li>
                  <li className="nav-item ff-serif-jose fs-400" onClick={handleClick}>
                    <a onClick={() => _handleTabClick("#project")}>Project</a>
                  </li>
                  <li className="nav-item ff-serif-jose fs-400" onClick={handleClick}>
                    <a onClick={() => _handleTabClick("#concept")}>Concept</a>
                  </li>
                </ul>
              </nav>
              <Backdrop onClose={handleClick} />
            </>
          )}
          <Switch />
        </div>
      </header>
    </>
  );
};

export default NavBar;
