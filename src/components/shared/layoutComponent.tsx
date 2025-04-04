"use client";
import React from "react";
import { Contact } from "@/types/data";
import DotRing from "./cursor/DotRing";
import ScrollArrow from "./scrollup/ScrollArrow";
import Footer from "./footer/Footer";
import NavBar from "./header/NavBar";
import CustomScript from "@/helpers/customScript/customScript";

const SharedComponent = ({ contact }: Contact) => {
  return (
    <>
      <CustomScript />
      <NavBar contact={contact} />
      <DotRing />
      <ScrollArrow />
      <Footer />
    </>
  );
};

export default SharedComponent;
