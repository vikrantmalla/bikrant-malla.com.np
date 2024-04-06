"use client";
import React from "react";
import { usePathname } from "next/navigation";
import DotRing from "./cursor/DotRing";
import ScrollArrow from "./scrollup/ScrollArrow";
import Footer from "./footer/Footer";
import NavBar from "./header/NavBar";
import CustomScript from "@/helpers/customScript/customScript";
import { Contact } from "@/types/data";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SharedComponent = ({ contact }: Contact) => {
  const pathname = usePathname();
  const isNavigationEnabled =
    pathname !== "/signin" &&
    pathname !== "/signup" &&
    pathname !== "/resetpassword";
  return (
    <>
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <CustomScript />
      {isNavigationEnabled && <NavBar contact={contact} />}
      <DotRing />
      <ScrollArrow />
      {isNavigationEnabled && <Footer />}
    </>
  );
};

export default SharedComponent;
