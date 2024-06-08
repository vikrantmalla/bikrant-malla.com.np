"use client";
import React, { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { joseFont } from "@/helpers/lib/font";
import { ContactInfo, NavBarProps, NavItemProps } from "../../../types/data";
import { FaTimes, FaBars } from "react-icons/fa";
import Link from "next/link";
import ThemeSwitch from "./ThemeSwitch";
import ResumeLink from "./ResumeLink";
import Backdrop from "./Backdrop";
import SocialMedia from "../footer/SocialMedia";
import * as gtag from "../../../helpers/lib/gtag";
import {
  setActiveLink,
  setNavColor,
  setToggleMenu,
} from "@/redux/feature/appSlice";
import { motion, useScroll, useSpring } from "framer-motion";
import { NavItemId, NavItemLabel } from "@/types/enum";

// MenuIcon component
export function MenuIcon() {
  const dispatch = useDispatch<AppDispatch>();
  const toggleMenu = useSelector((state: RootState) => state.app.toggleMenu);

  const handleClick = () => {
    dispatch(setToggleMenu(!toggleMenu));
    const mobileNav = !toggleMenu ? "mobile_nav_open" : "mobile_nav_close";
    gtag.event({
      action: `${mobileNav}`,
      category: "mobile_navigation",
      label: "hamburger_menu_click",
    });
  };
  const arialMessage = !toggleMenu
    ? "Open mobile navigation menu"
    : "Close mobile navigation menu";

  return (
    <button
      role="button"
      className="menu-icon"
      onClick={handleClick}
      aria-label={arialMessage}
    >
      {toggleMenu ? (
        <FaTimes aria-label={`${arialMessage} icon`} />
      ) : (
        <FaBars aria-label={`${arialMessage} icon`} />
      )}
    </button>
  );
}

// Navigation component
export function Navigation({ contact }: NavBarProps) {
  const dispatch = useDispatch<AppDispatch>();
  const pathname = usePathname();
  const isMenuOpen = useSelector((state: RootState) => state.app.toggleMenu);
  const toggleMenu = useSelector((state: RootState) => state.app.toggleMenu);
  const activeLink = useSelector((state: RootState) => state.app.activeLink);

  const handleToggleMenu = () => {
    dispatch(setToggleMenu(!isMenuOpen));
  };

  const handleTabClick = (tabId: string) => {
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

  const isContactDefined = contact !== undefined;
  return (
    <nav className="nav">
      <ul className={isMenuOpen ? "nav-menu active" : "nav-menu"}>
        {[
          NavItemId.ABOUTME,
          NavItemId.SKILL,
          NavItemId.PROJECT,
          NavItemId.CONCEPT,
          NavItemId.CONTACT,
        ].map((tabId) => (
          <NavItem
            key={tabId}
            tabId={tabId}
            pathname={pathname}
            activeLink={activeLink}
            onTabClick={handleTabClick}
            onMenuClick={handleToggleMenu}
          />
        ))}
        <li
          className="social-media mobile-nav-social-media"
          style={{ margin: "1rem 0" }}
        >
          {isContactDefined &&
            contact.map((details: ContactInfo, index: number) => (
              <div key={index}>
                <SocialMedia {...details} visibleCount={2} />
              </div>
            ))}
        </li>
      </ul>
    </nav>
  );
}

// Individual navigation item component
const NavItem = ({
  tabId,
  pathname,
  activeLink,
  onTabClick,
  onMenuClick,
}: NavItemProps) => {
  const handleClick = () => {
    if (window.innerWidth < 768) {
      onMenuClick();
    }
  };

  return (
    <li
      onClick={() => handleClick()}
      className={`nav-item ${joseFont} fs-400`}
      style={{ textTransform: "capitalize" }}
    >
      {pathname === "/" ? (
        <p
          onClick={() => onTabClick(tabId)}
          className={
            activeLink === tabId.replace("#", "")
              ? "activeLink"
              : "unActiveLink"
          }
        >
          {tabId.replace("#", "")}
        </p>
      ) : (
        <Link href="/" passHref>
          {tabId.replace("#", "")}
        </Link>
      )}
    </li>
  );
};

// NavBar component
const NavBar = ({ contact }: NavBarProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const toggleMenu = useSelector((state: RootState) => state.app.toggleMenu);
  const navColor = useSelector((state: RootState) => state.app.navColor);
  const activeLink = useSelector((state: RootState) => state.app.activeLink);

  const handleClick = () => {
    dispatch(setToggleMenu(!toggleMenu));
  };

  if (typeof window !== "undefined") {
    if (toggleMenu) {
      document.body.classList.add("active-modal");
    } else {
      document.body.classList.remove("active-modal");
    }
  }

  useEffect(() => {
    dispatch(setNavColor(window.scrollY >= 50));

    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      const sections = [
        {
          id: NavItemId.ABOUTME,
          range: [515, 900],
          label: NavItemLabel.ABOUTME,
        },
        { id: NavItemId.SKILL, range: [900, 1490], label: NavItemLabel.SKILL },
        {
          id: NavItemId.PROJECT,
          range: [1490, 2360],
          label: NavItemLabel.PROJECT,
        },
        {
          id: NavItemId.CONCEPT,
          range: [2360, 3200],
          label: NavItemLabel.CONCEPT,
        },
        {
          id: NavItemId.CONTACT,
          range: [3200, 4200],
          label: NavItemLabel.CONTACT,
        },
      ];

      const activeSection = sections.find(
        (section) =>
          scrollTop >= section.range[0] && scrollTop <= section.range[1]
      );

      if (activeSection && activeSection.id !== activeLink) {
        dispatch(setActiveLink(activeSection.id));
      }

      dispatch(setNavColor(scrollTop >= 50));
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
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 200,
    damping: 50,
  });
  return (
    <>
      <header className={`header ${navColor ? "colorChange" : ""}`}>
        <div className="nav-container">
          <Navigation />
          {!toggleMenu && <MenuIcon />}
          {toggleMenu && (
            <>
              <MenuIcon />
              <Navigation contact={contact} />
              <Backdrop onClose={handleClick} />
            </>
          )}
          <div className="nav-option">
            <ThemeSwitch />
            <ResumeLink />
          </div>
        </div>
        <motion.div
          className="progress-bar"
          style={{
            scaleX,
            transformOrigin: "left",
          }}
        />
      </header>
    </>
  );
};

export default NavBar;
