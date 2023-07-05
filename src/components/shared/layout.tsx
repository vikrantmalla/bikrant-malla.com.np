import React, { ReactNode } from "react";
import MetaTags from "./metaTag";
import DotRing from "./cursor/DotRing";
import ScrollArrow from "./scrollup/ScrollArrow";
import Footer from "./footer/Footer";
import ThemeProvider from "@/context/ThemeContext";
import MouseContextProvider from "@/context/MouseContext";
import ProjectProvider from "@/context/ProjectContext";
import NavBar from "./header/NavBar";

interface Props {
  children: ReactNode;
}

const Layout = ({ children }: Props) => {
  return (
    <>
      <ThemeProvider>
        <MouseContextProvider>
          <ProjectProvider>
            <MetaTags />
            {children}
            <DotRing />
            <ScrollArrow />
            <NavBar />
            <Footer />
          </ProjectProvider>
        </MouseContextProvider>
      </ThemeProvider>
    </>
  );
};

export default Layout;
