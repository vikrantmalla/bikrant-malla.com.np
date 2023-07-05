import React, { ReactNode } from "react";
import MetaTags from "./metaTag";
import DotRing from "./cursor/DotRing";
import ScrollArrow from "./scrollup/ScrollArrow";
import Footer from "./footer/Footer";
import ThemeProvider from "@/context/ThemeContext";
import MouseContextProvider from "@/context/MouseContext";
import ProjectProvider from "@/context/ProjectContext";
import NavBar from "./header/NavBar";
import { ContactData, MetaTagData } from "@/types/data";

interface LayoutProps {
  children: ReactNode;
  metaTagData: MetaTagData;
  contactData: ContactData;
}

const Layout = ({ children, metaTagData, contactData }: LayoutProps) => {
  return (
    <>
      <ThemeProvider>
        <MouseContextProvider>
          <ProjectProvider>
          {<MetaTags metaTagData={metaTagData} />}
            {children}
            <DotRing />
            <ScrollArrow />
            <NavBar contactData={contactData}/>
            <Footer />
          </ProjectProvider>
        </MouseContextProvider>
      </ThemeProvider>
    </>
  );
};

export default Layout;
