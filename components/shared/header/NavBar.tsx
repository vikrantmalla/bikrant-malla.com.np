import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Switch from "./Switch";
import Backdrop from "./Backdrop";
// @ts-ignore:next-line
import $ from "jquery";
import { ContactPageData } from "../../../types/data";
import Link from "next/link";
import SocialMedia from "../footer/SocialMedia";
import { FaTimes, FaBars } from "react-icons/fa";
import * as gtag from "../../../helpers/lib/gtag";

const NavBar = ({ contactData }: ContactPageData) => {
  const [click, setClick] = useState<boolean>(false);
  const [navColor, setNavColor] = useState<boolean>(false);
  const [activeLink, setActiveLink] = useState<string>("About Me");

  const router = useRouter();

  const handleClick = () => {
    setClick(!click);
    const mobileNav = !click ? "mobile_nav_open" : "mobile_nav_close";
    gtag.event({
      action: `${mobileNav}`,
      category: "mobile_navigation",
      label: "hamburger_menu_click",
    });
  };

  if (process.browser) {
    if (click) {
      document.body.classList.add("active-modal");
    } else {
      document.body.classList.remove("active-modal");
    }
  }

  const _handleTabClick = (tabId: string) => {
    const checkWidth = window.matchMedia("(min-width: 677px)");
    var tab = $(tabId);
    var tabOffset = tab?.offset();
    gtag.event({
      action: `${tabId}`,
      category: "ui_interaction",
      label: "tab_id_click",
    });
    if (tabOffset != null) {
      $("html, body").animate(
        {
          scrollTop: tabOffset.top - (checkWidth.matches ? 116.5 : 126),
        },
        "slow"
      );
    }
    // @ts-ignore:next-line
    if (checkWidth === "667px") {
      setClick(!click);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", changeNavbarColor);
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;

      if (scrollTop >= 515 && scrollTop <= 900) {
        setActiveLink("About Me");
      } else if (scrollTop >= 900 && scrollTop <= 1490) {
        setActiveLink("Skills");
      } else if (scrollTop >= 1490 && scrollTop <= 2360) {
        setActiveLink("Projects");
      } else if (scrollTop >= 2360 && scrollTop <= 3200) {
        setActiveLink("Concepts");
      } else if (scrollTop >= 3200 && scrollTop <= 4200) {
        setActiveLink("Contact");
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  });

  const changeNavbarColor = () => {
    if (window.scrollY >= 50) {
      setNavColor(true);
    } else {
      setNavColor(false);
    }
  };

  return (
    <>
      <header className={`header ${navColor ? "colorChange" : ""}`}>
        <div className="nav-container">
          <nav className="nav">
            <ul className={click ? "nav-menu active" : "nav-menu"}>
              <li className="nav-item ff-serif-jose fs-400">
                {router.pathname === "/" ? (
                  <a
                    onClick={() => _handleTabClick("#aboutme")}
                    className={activeLink === "About Me" ? "activeLink" : ""}
                  >
                    AboutMe
                  </a>
                ) : (
                  <Link href="/" passHref>
                    AboutMe
                  </Link>
                )}
              </li>
              <li className="nav-item ff-serif-jose fs-400">
                {router.pathname === "/" ? (
                  <a
                    onClick={() => _handleTabClick("#skill")}
                    className={activeLink === "Skills" ? "activeLink" : ""}
                  >
                    Skill
                  </a>
                ) : (
                  <Link href="/" passHref>
                    Skill
                  </Link>
                )}
              </li>
              <li className="nav-item ff-serif-jose fs-400">
                {router.pathname === "/" ? (
                  <a
                    onClick={() => _handleTabClick("#project")}
                    className={activeLink === "Projects" ? "activeLink" : ""}
                  >
                    Project
                  </a>
                ) : (
                  <Link href="/" passHref>
                    Project
                  </Link>
                )}
              </li>
              <li className="nav-item ff-serif-jose fs-400">
                {router.pathname === "/" ? (
                  <a
                    onClick={() => _handleTabClick("#concept")}
                    className={activeLink === "Concepts" ? "activeLink" : ""}
                  >
                    Concept
                  </a>
                ) : (
                  <Link href="/" passHref>
                    Concept
                  </Link>
                )}
              </li>
              <li className="nav-item ff-serif-jose fs-400">
                {router.pathname === "/" ? (
                  <a
                    onClick={() => _handleTabClick("#contact")}
                    className={activeLink === "Contact" ? "activeLink" : ""}
                  >
                    Contact
                  </a>
                ) : (
                  <Link href="/" passHref>
                    Contact
                  </Link>
                )}
              </li>
            </ul>
          </nav>
          {!click && (
            <div className="menu-icon" onClick={handleClick}>
              {click ? <FaTimes /> : <FaBars />}
            </div>
          )}
          {click && (
            <>
              <div className="menu-icon" onClick={handleClick}>
                {click ? <FaTimes /> : <FaBars />}
              </div>
              <nav className="nav">
                <ul className={click ? "nav-menu active" : "nav-menu"}>
                  <li
                    className="nav-item ff-serif-jose fs-400"
                    onClick={handleClick}
                  >
                    {router.pathname === "/" ? (
                      <a
                        onClick={() => _handleTabClick("#aboutme")}
                        className={
                          activeLink === "About Me" ? "activeLink" : ""
                        }
                      >
                        AboutMe
                      </a>
                    ) : (
                      <Link href="/" passHref>
                        AboutMe
                      </Link>
                    )}
                  </li>
                  <li
                    className="nav-item ff-serif-jose fs-400"
                    onClick={handleClick}
                  >
                    {router.pathname === "/" ? (
                      <a
                        onClick={() => _handleTabClick("#skill")}
                        className={activeLink === "Skills" ? "activeLink" : ""}
                      >
                        Skill
                      </a>
                    ) : (
                      <Link href="/" passHref>
                        Skill
                      </Link>
                    )}
                  </li>
                  <li
                    className="nav-item ff-serif-jose fs-400"
                    onClick={handleClick}
                  >
                    {router.pathname === "/" ? (
                      <a
                        onClick={() => _handleTabClick("#project")}
                        className={
                          activeLink === "Projects" ? "activeLink" : ""
                        }
                      >
                        Project
                      </a>
                    ) : (
                      <Link href="/" passHref>
                        Project
                      </Link>
                    )}
                  </li>
                  <li
                    className="nav-item ff-serif-jose fs-400"
                    onClick={handleClick}
                  >
                    {router.pathname === "/" ? (
                      <a
                        onClick={() => _handleTabClick("#concept")}
                        className={
                          activeLink === "Concepts" ? "activeLink" : ""
                        }
                      >
                        Concept
                      </a>
                    ) : (
                      <Link href="/" passHref>
                        Concept
                      </Link>
                    )}
                  </li>
                  <li className="social-media" style={{ margin: "1rem 0" }}>
                    <SocialMedia contactData={contactData} visibleCount={2} />
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
