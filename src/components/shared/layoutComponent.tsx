"use client"
import React from "react";
import { usePathname } from 'next/navigation';
import DotRing from "./cursor/DotRing";
import ScrollArrow from "./scrollup/ScrollArrow";
import Footer from "./footer/Footer";
import NavBar from "./header/NavBar";
import CustomScript from "@/helpers/customScript/customScript";
import { Contact } from "@/types/data";

const SharedComponent = ({contact}: Contact) => {
    const pathname = usePathname();
    const isNavigationEnabled = pathname !== '/admin';
  return (
    <>
      <CustomScript />
      {isNavigationEnabled && <NavBar contact={contact} />}
      <DotRing />
      <ScrollArrow />
      {isNavigationEnabled && <Footer />}
    </>
  );
};

export default SharedComponent;
