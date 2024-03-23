"use client";
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { signIn } from "next-auth/react";
import SignIn from "./SignIn";
import { ConfigData } from "@/types/data";
import SignUp from "./SignUp";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import ResetPassword from "./ResetPassword";
// import { useDispatch } from "react-redux";
// import { AppDispatch } from "@/redux/store";
// import { setShowModal } from "@/redux/feature/appSlice";

const AuthModal = ({ config }: ConfigData) => {
  // const dispatch = useDispatch<AppDispatch>();
  const showForgetPasswordModal = useSelector(
    (state: RootState) => state.app.showForgetPasswordModal
  );

  const allowSignUp = config.some((c) => c.allowSignUp);
  const renderTabsTrigger = (value: string) => {
    if (value === "SignIn") {
      return <TabsTrigger value={value}>{value}</TabsTrigger>;
    }
    if (value === "SignUp") {
      return <TabsTrigger value={value}>{value}</TabsTrigger>;
    }
    if (value === "ForgetPassword") {
      return (
        <TabsTrigger
          value={value}
          className={`${allowSignUp ? "" : " w-full"}`}
        >
          {value}
        </TabsTrigger>
      );
    }
    return null;
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <Tabs defaultValue="SignIn">
        {!showForgetPasswordModal ? (
          <TabsList>
            {renderTabsTrigger("SignIn")}
            {renderTabsTrigger("SignUp")}
          </TabsList>
        ) : (
          <TabsList
            className={allowSignUp ? "grid w-full grid-cols-2" : "w-full"}
          >
            {renderTabsTrigger("ForgetPassword")}
          </TabsList>
        )}
        {!showForgetPasswordModal ? (
          <>
            <TabsContent value="SignIn">
              <SignIn />
            </TabsContent>
            <TabsContent value="SignUp">
              <SignUp config={config} />
            </TabsContent>
          </>
        ) : (
          <TabsContent value="ForgetPassword">
            <ResetPassword />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default AuthModal;
