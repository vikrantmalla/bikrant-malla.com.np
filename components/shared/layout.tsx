import React, { ReactNode } from "react";
import MetaTags from "./metaTag";
import DotRing from "./cursor/DotRing";
import ScrollArrow from "./scrollup/ScrollArrow";
import Footer from "./footer/Footer";
import ThemeProvider from "@/context/ThemeContext";
import MouseContextProvider from "@/context/MouseContext";
import ProjectProvider from "@/context/ProjectContext";
import NavBar from "./header/NavBar";
import { MetaTagData } from "@/types/data";

interface Props {
  children: ReactNode;
  metaTagData?: MetaTagData;
}

const Layout = ({ children, metaTagData }: Props) => {
  return (
    <>
      <ThemeProvider>
        <MouseContextProvider>
          <ProjectProvider>
          {metaTagData && <MetaTags metaTagData={metaTagData} />}
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
