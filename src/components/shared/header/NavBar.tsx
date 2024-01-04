"use client";
import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Switch from "./Switch";
import Backdrop from "./Backdrop";
// @ts-ignore:next-line
import $ from "jquery";
import { ContactPageData } from "../../../types/data";
import Link from "next/link";
import SocialMedia from "../footer/SocialMedia";
import { FaTimes, FaBars } from "react-icons/fa";
import * as gtag from "../../../helpers/lib/gtag";
import { joseFont } from "@/helpers/lib/font";

const NavBar = ({ contactData }: ContactPageData) => {
  const [click, setClick] = useState<boolean>(false);
  const [navColor, setNavColor] = useState<boolean>(false);
  const [activeLink, setActiveLink] = useState<string>("About Me");

  const pathname = usePathname();

  const handleClick = () => {
    setClick(!click);
    const mobileNav = !click ? "mobile_nav_open" : "mobile_nav_close";
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

      const activeSection = sections.find(section => scrollTop >= section.range[0] && scrollTop <= section.range[1]);

      if (activeSection) {
        setActiveLink(activeSection.label);
      }
    };

    const changeNavbarColor = () => {
      setNavColor(window.scrollY >= 50);
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("scroll", changeNavbarColor);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("scroll", changeNavbarColor);
    };
  }, []);

  const _handleTabClick = (tabId: string) => {
    const checkWidth = window.matchMedia("(min-width: 677px)");

    gtag.event({
      action: `#${tabId}`,
      category: "ui_interaction",
      label: "tab_id_click",
    });

    const element = document.getElementById(tabId);
    element?.scrollIntoView({ behavior: 'smooth' });

    if (checkWidth.matches) {
      setClick(!click);
    }
  };

  return (
    <header className={`header ${navColor ? "colorChange" : ""}`}>
      <div className="nav-container">
        <nav className="nav">
          <ul className={"nav-menu"}>
            {['aboutme', 'skill', 'project', 'concept', 'contact'].map((tabId) => (
              <li key={tabId} className={`nav-item ${joseFont} fs-400 `}  style={{ textTransform: 'capitalize' }}>
                {pathname === "/" ? (
                  <a
                    onClick={() => _handleTabClick(tabId)}
                    className={activeLink === tabId.replace('#', '') ? "activeLink" : ""}
                  >
                    {tabId.replace('#', '')}
                  </a>
                ) : (
                  <Link href="/" passHref>
                    {tabId.replace('#', '')}
                  </Link>
                )}
              </li>
            ))}
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
                {['aboutme', 'skill', 'project', 'concept', 'contact'].map((tabId) => (
                  <li
                    key={tabId}
                    className={`nav-item ${joseFont} fs-400`}
                    onClick={handleClick}
                    style={{ textTransform: 'capitalize' }}
                  >
                    {pathname === "/" ? (
                      <a
                        onClick={() => _handleTabClick(tabId)}
                        className={activeLink === tabId.replace('#', '') ? "activeLink" : ""}
                      >
                        {tabId.replace('#', '')}
                      </a>
                    ) : (
                      <Link href="/" passHref>
                        {tabId.replace('#', '')}
                      </Link>
                    )}
                  </li>
                ))}
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
  );
};

export default NavBar;

// const NavBar = ({ contactData }: ContactPageData) => {
//   const [click, setClick] = useState<boolean>(false);
//   const [navColor, setNavColor] = useState<boolean>(false);
//   const [activeLink, setActiveLink] = useState<string>("About Me");

//   const pathname = usePathname();

//   const handleClick = () => {
//     setClick(!click);
//     const mobileNav = !click ? "mobile_nav_open" : "mobile_nav_close";
//     gtag.event({
//       action: `${mobileNav}`,
//       category: "mobile_navigation",
//       label: "hamburger_menu_click",
//     });
//   };

//   if (process.browser) {
//     if (click) {
//       document.body.classList.add("active-modal");
//     } else {
//       document.body.classList.remove("active-modal");
//     }
//   }

//   const _handleTabClick = (tabId: string) => {
//     console.log(tabId)
//     const checkWidth = window.matchMedia("(min-width: 677px)");
//     console.log(checkWidth)
//     gtag.event({
//       action: `#${tabId}`,
//       category: "ui_interaction",
//       label: "tab_id_click",
//     });
//     const element = document.getElementById(tabId);
//     element?.scrollIntoView({
//       behavior: 'smooth'
//     });
//     // @ts-ignore:next-line
//     if (checkWidth === "667px") {
//       setClick(!click);
//     }
//   };

//   useEffect(() => {
//     window.addEventListener("scroll", changeNavbarColor);
//     const handleScroll = () => {
//       const scrollTop = window.pageYOffset;

//       if (scrollTop >= 515 && scrollTop <= 900) {
//         setActiveLink("About Me");
//       } else if (scrollTop >= 900 && scrollTop <= 1490) {
//         setActiveLink("Skills");
//       } else if (scrollTop >= 1490 && scrollTop <= 2360) {
//         setActiveLink("Projects");
//       } else if (scrollTop >= 2360 && scrollTop <= 3200) {
//         setActiveLink("Concepts");
//       } else if (scrollTop >= 3200 && scrollTop <= 4200) {
//         setActiveLink("Contact");
//       }
//     };

//     window.addEventListener("scroll", handleScroll);

//     return () => {
//       window.removeEventListener("scroll", handleScroll);
//     };
//   });

//   const changeNavbarColor = () => {
//     if (window.scrollY >= 50) {
//       setNavColor(true);
//     } else {
//       setNavColor(false);
//     }
//   };

//   return (
//       <header className={`header ${navColor ? "colorChange" : ""}`}>
//         <div className="nav-container">
//           <nav className="nav">
//             <ul className={click ? "nav-menu active" : "nav-menu"}>
//               <li className={`nav-item ${joseFont} fs-400`}>
//                 {pathname === "/" ? (
//                   <a
//                     onClick={() => _handleTabClick("aboutme")}
//                     className={activeLink === "About Me" ? "activeLink" : ""}
//                   >
//                     AboutMe
//                   </a>
//                 ) : (
//                   <Link href="/" passHref>
//                     AboutMe
//                   </Link>
//                 )}
//               </li>
//               <li className={`nav-item ${joseFont} fs-400`}>
//                 {pathname === "/" ? (
//                   <a
//                     onClick={() => _handleTabClick("skill")}
//                     className={activeLink === "Skills" ? "activeLink" : ""}
//                   >
//                     Skill
//                   </a>
//                 ) : (
//                   <Link href="/" passHref>
//                     Skill
//                   </Link>
//                 )}
//               </li>
//               <li className={`nav-item ${joseFont} fs-400`}>
//                 {pathname === "/" ? (
//                   <a
//                     onClick={() => _handleTabClick("#project")}
//                     className={activeLink === "Projects" ? "activeLink" : ""}
//                   >
//                     Project
//                   </a>
//                 ) : (
//                   <Link href="/" passHref>
//                     Project
//                   </Link>
//                 )}
//               </li>
//               <li className={`nav-item ${joseFont} fs-400`}>
//                 {pathname === "/" ? (
//                   <a
//                     onClick={() => _handleTabClick("concept")}
//                     className={activeLink === "Concepts" ? "activeLink" : ""}
//                   >
//                     Concept
//                   </a>
//                 ) : (
//                   <Link href="/" passHref>
//                     Concept
//                   </Link>
//                 )}
//               </li>
//               <li className={`nav-item ${joseFont} fs-400`}>
//                 {pathname === "/" ? (
//                   <a
//                     onClick={() => _handleTabClick("contact")}
//                     className={activeLink === "Contact" ? "activeLink" : ""}
//                   >
//                     Contact
//                   </a>
//                 ) : (
//                   <Link href="/" passHref>
//                     Contact
//                   </Link>
//                 )}
//               </li>
//             </ul>
//           </nav>
//           {!click && (
//             <div className="menu-icon" onClick={handleClick}>
//               {click ? <FaTimes /> : <FaBars />}
//             </div>
//           )}
//           {click && (
//             <>
//               <div className="menu-icon" onClick={handleClick}>
//                 {click ? <FaTimes /> : <FaBars />}
//               </div>
//               <nav className="nav">
//                 <ul className={click ? "nav-menu active" : "nav-menu"}>
//                   <li
//                     className={`nav-item ${joseFont} fs-400`}
//                     onClick={handleClick}
//                   >
//                     {pathname === "/" ? (
//                       <a
//                         onClick={() => _handleTabClick("aboutme")}
//                         className={
//                           activeLink === "About Me" ? "activeLink" : ""
//                         }
//                       >
//                         AboutMe
//                       </a>
//                     ) : (
//                       <Link href="/" passHref>
//                         AboutMe
//                       </Link>
//                     )}
//                   </li>
//                   <li
//                     className={`nav-item ${joseFont} fs-400`}
//                     onClick={handleClick}
//                   >
//                     {pathname === "/" ? (
//                       <a
//                         onClick={() => _handleTabClick("skill")}
//                         className={activeLink === "Skills" ? "activeLink" : ""}
//                       >
//                         Skill
//                       </a>
//                     ) : (
//                       <Link href="/" passHref>
//                         Skill
//                       </Link>
//                     )}
//                   </li>
//                   <li
//                     className={`nav-item ${joseFont} fs-400`}
//                     onClick={handleClick}
//                   >
//                     {pathname === "/" ? (
//                       <a
//                         onClick={() => _handleTabClick("project")}
//                         className={
//                           activeLink === "Projects" ? "activeLink" : ""
//                         }
//                       >
//                         Project
//                       </a>
//                     ) : (
//                       <Link href="/" passHref>
//                         Project
//                       </Link>
//                     )}
//                   </li>
//                   <li
//                     className={`nav-item ${joseFont} fs-400`}
//                     onClick={handleClick}
//                   >
//                     {pathname === "/" ? (
//                       <a
//                         onClick={() => _handleTabClick("concept")}
//                         className={
//                           activeLink === "Concepts" ? "activeLink" : ""
//                         }
//                       >
//                         Concept
//                       </a>
//                     ) : (
//                       <Link href="/" passHref>
//                         Concept
//                       </Link>
//                     )}
//                   </li>
//                   <li className="social-media" style={{ margin: "1rem 0" }}>
//                     <SocialMedia contactData={contactData} visibleCount={2} />
//                   </li>
//                 </ul>
//               </nav>
//               <Backdrop onClose={handleClick} />
//             </>
//           )}
//           <Switch />
//         </div>
//       </header>
//   );
// };

// export default NavBar;
