import React, { useState, useEffect } from "react";
import Switch from "./Switch";
import Backdrop from "./Backdrop";
// @ts-ignore:next-line
import $ from "jquery";
import { Links } from "../../../types/data";

const NavBar = () => {
  const [click, setClick] = useState<boolean>(false);
  const [navColor, setNavColor] = useState<boolean>(false);
  const [activeLink, setActiveLink] = useState<string>('About Me');

  const handleClick = () => setClick(!click);

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
        setActiveLink('About Me');
      } else if (scrollTop >= 900 && scrollTop <= 1490) {
        setActiveLink('Skills');
      } else if (scrollTop >= 1490 && scrollTop <= 2360) {
        setActiveLink('Projects');
      } else if (scrollTop >= 2360 && scrollTop <= 3200) {
        setActiveLink('Concepts');
      } else if (scrollTop >= 3200 && scrollTop <= 4200) {
        setActiveLink('Contact');
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  });

  const changeNavbarColor = () => {
    if (window.scrollY >= 50) {
      setNavColor(true);
    } else {
      setNavColor(false);
    }
  };

  const ExternalLink = ({ href, children, label }: Links) => (
    <a target="_blank" rel="noopener noreferrer" href={href} aria-label={label}>
      {children}
    </a>
  );

  return (
    <>
      <header className={`header ${navColor ? "colorChange" : ""}`}>
        <div className="nav-container">
          <nav className="nav">
            <ul className={click ? "nav-menu active" : "nav-menu"}>
              <li className="nav-item ff-serif-jose fs-400">
                <a onClick={() => _handleTabClick("#aboutme")} className={activeLink === 'About Me' ? 'activeLink' : ''}>AboutMe</a>
              </li>
              <li className="nav-item ff-serif-jose fs-400">
                <a onClick={() => _handleTabClick("#skill")} className={activeLink === 'Skills' ? 'activeLink' : ''}>Skill</a>
              </li>
              <li className="nav-item ff-serif-jose fs-400">
                <a onClick={() => _handleTabClick("#project")} className={activeLink === 'Projects' ? 'activeLink' : ''}>Project</a>
              </li>
              <li className="nav-item ff-serif-jose fs-400">
                <a onClick={() => _handleTabClick("#concept")} className={activeLink === 'Concepts' ? 'activeLink' : ''}>Concept</a>
              </li>
              <li className="nav-item ff-serif-jose fs-400">
                <a onClick={() => _handleTabClick("#contact")} className={activeLink === 'Contact' ? 'activeLink' : ''}>Contact</a>
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
                  <li
                    className="nav-item ff-serif-jose fs-400"
                    onClick={handleClick}
                  >
                    <a onClick={() => _handleTabClick("#aboutme")}>AboutMe</a>
                  </li>
                  <li
                    className="nav-item ff-serif-jose fs-400"
                    onClick={handleClick}
                  >
                    <a onClick={() => _handleTabClick("#skill")}>Skill</a>
                  </li>
                  <li
                    className="nav-item ff-serif-jose fs-400"
                    onClick={handleClick}
                  >
                    <a onClick={() => _handleTabClick("#project")}>Project</a>
                  </li>
                  <li
                    className="nav-item ff-serif-jose fs-400"
                    onClick={handleClick}
                  >
                    <a onClick={() => _handleTabClick("#concept")}>Concept</a>
                  </li>
                  <div className="social-media">
                    <ExternalLink
                      href="https://github.com/vikrantmalla"
                      label="Github"
                    >
                      <i className="fab fa-github" />
                    </ExternalLink>
                    <ExternalLink
                      href="https://www.linkedin.com/in/vikrant-malla"
                      label="Linkedin"
                    >
                      <i className="fab fa-linkedin-in" />
                    </ExternalLink>
                  </div>
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
