"use client";
import React from "react";
import { usePathname } from "next/navigation";
import { Contact, ContactProps } from "@/types/data";
import DotRing from "./cursor/DotRing";
import ScrollArrow from "./scrollup/ScrollArrow";
import Footer from "./footer/Footer";
import NavBar from "./header/NavBar";
import CustomScript from "@/helpers/customScript/customScript";

const SharedComponent = ({ contact }: ContactProps) => {
  const pathname = usePathname();
  
  // Hide navbar and footer on login page
  const isLoginPage = pathname === "/login";
  
  return (
    <>
      <CustomScript />
      {!isLoginPage && <NavBar contact={contact} />}
      {!isLoginPage && <DotRing />}
      {!isLoginPage && <ScrollArrow />}
      {!isLoginPage && <Footer />}
    </>
  );
};

export default SharedComponent;
