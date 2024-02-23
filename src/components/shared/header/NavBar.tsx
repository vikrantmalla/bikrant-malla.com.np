"use client";
import React, { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { FaTimes, FaBars } from "react-icons/fa";
import Link from "next/link";
import ThemeSwitch from "./ThemeSwitch";
import Backdrop from "./Backdrop";
import SocialMedia from "../footer/SocialMedia";
import * as gtag from "../../../helpers/lib/gtag";
import { joseFont } from "@/helpers/lib/font";
import { ContactPageData } from "../../../types/data";
import {
  setActiveLink,
  setNavColor,
  setToggleMenu,
} from "@/redux/feature/appSlice";

const NavBar = ({ contactData }: ContactPageData) => {
  const dispatch = useDispatch<AppDispatch>();
  const toggleMenu = useSelector((state: RootState) => state.app.toggleMenu);
  const navColor = useSelector((state: RootState) => state.app.navColor);
  const activeLink = useSelector((state: RootState) => state.app.activeLink);

  const pathname = usePathname();

  const handleClick = () => {
    dispatch(setToggleMenu(!toggleMenu));
    const mobileNav = !toggleMenu ? "mobile_nav_open" : "mobile_nav_close";
    gtag.event({
      action: `${mobileNav}`,
      category: "mobile_navigation",
      label: "hamburger_menu_click",
    });
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      const sections = [
        { id: "aboutme", range: [515, 900], label: "About Me" },
        { id: "skill", range: [900, 1490], label: "Skills" },
        { id: "project", range: [1490, 2360], label: "Projects" },
        { id: "concept", range: [2360, 3200], label: "Concepts" },
        { id: "contact", range: [3200, 4200], label: "Contact" },
      ];

      const activeSection = sections.find(
        (section) =>
          scrollTop >= section.range[0] && scrollTop <= section.range[1]
      );

      if (activeSection && activeSection.id !== activeLink) {
        dispatch(setActiveLink(activeSection.id));
      }
    };

    const changeNavbarColor = () => {
      dispatch(setNavColor(window.scrollY >= 50));
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("scroll", changeNavbarColor);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("scroll", changeNavbarColor);
    };
  }, [activeLink, dispatch]);

  const _handleTabClick = (tabId: string) => {
    const checkWidth = window.matchMedia("(min-width: 677px)");

    gtag.event({
      action: `#${tabId}`,
      category: "ui_interaction",
      label: "tab_id_click",
    });

    const element = document.getElementById(tabId);
    element?.scrollIntoView({ behavior: "smooth" });

    if (checkWidth.matches) {
      setToggleMenu(!toggleMenu);
    }
  };

  return (
    <header className={`header ${navColor ? "colorChange" : ""}`}>
      <div className="nav-container">
        <nav className="nav">
          <ul className={"nav-menu"}>
            {["aboutme", "skill", "project", "concept", "contact"].map(
              (tabId) => (
                <li
                  key={tabId}
                  className={`nav-item ${joseFont} fs-400 `}
                  style={{ textTransform: "capitalize" }}
                >
                  {pathname === "/" ? (
                    <a
                      onClick={() => _handleTabClick(tabId)}
                      className={
                        activeLink === tabId.replace("#", "")
                          ? "activeLink"
                          : "unActiveLink"
                      }
                      rel={
                        [
                          "aboutme",
                          "skill",
                          "project",
                          "concept",
                          "contact",
                        ].includes(tabId)
                          ? "nofollow"
                          : ""
                      }
                    >
                      {tabId.replace("#", "")}
                    </a>
                  ) : (
                    <Link href="/" passHref>
                      {tabId.replace("#", "")}
                    </Link>
                  )}
                </li>
              )
            )}
          </ul>
        </nav>
        {!toggleMenu && (
          <div className="menu-icon" onClick={handleClick}>
            {toggleMenu ? <FaTimes /> : <FaBars />}
          </div>
        )}
        {toggleMenu && (
          <>
            <div className="menu-icon" onClick={handleClick}>
              {toggleMenu ? <FaTimes /> : <FaBars />}
            </div>
            <nav className="nav">
              <ul className={toggleMenu ? "nav-menu active" : "nav-menu"}>
                {["aboutme", "skill", "project", "concept", "contact"].map(
                  (tabId) => (
                    <li
                      key={tabId}
                      className={`nav-item ${joseFont} fs-400`}
                      onClick={handleClick}
                      style={{ textTransform: "capitalize" }}
                    >
                      {pathname === "/" ? (
                        <a
                          onClick={() => _handleTabClick(tabId)}
                          className={
                            activeLink === tabId.replace("#", "")
                              ? "activeLink"
                              : "unActiveLink"
                          }
                          rel={
                            [
                              "aboutme",
                              "skill",
                              "project",
                              "concept",
                              "contact",
                            ].includes(tabId)
                              ? "nofollow"
                              : ""
                          }
                        >
                          {tabId.replace("#", "")}
                        </a>
                      ) : (
                        <Link href="/" passHref>
                          {tabId.replace("#", "")}
                        </Link>
                      )}
                    </li>
                  )
                )}
                <li className="social-media" style={{ margin: "1rem 0" }}>
                  <SocialMedia contactData={contactData} visibleCount={2} />
                </li>
              </ul>
            </nav>
            <Backdrop onClose={handleClick} />
          </>
        )}
        <ThemeSwitch />
      </div>
    </header>
  );
};

export default NavBar;