"use client";
import React, { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { signIn } from "next-auth/react";
import SignIn from "./SignIn";
import { ConfigData } from "@/types/data";
import SignUp from "./SignUp";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import ResetPassword from "./ResetPassword";
import { joseFont } from "@/helpers/lib/font";

const AuthModal = ({ config }: ConfigData) => {
  const showForgetPasswordModal = useSelector(
    (state: RootState) => state.app.showForgetPasswordModal
  );

  const renderTabsTrigger = (value: string) => {
    if (value === "Sign In") {
      return (
        <TabsTrigger value={value} className={`${joseFont} fs-400`}>
          {value}
        </TabsTrigger>
      );
    }
    if (value === "Sign Up") {
      return (
        <TabsTrigger value={value} className={`${joseFont} fs-400`}>
          {value}
        </TabsTrigger>
      );
    }
    return null;
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <Tabs defaultValue="Sign In" className="w-[400px]">
        {showForgetPasswordModal === false ? (
          <TabsList className="grid w-full grid-cols-2 h-10">
            {renderTabsTrigger("Sign In")}
            {renderTabsTrigger("Sign Up")}
          </TabsList>
        ) : null}
        {showForgetPasswordModal === false ? (
          <>
            <TabsContent value="Sign In">
              <SignIn />
            </TabsContent>
            <TabsContent value="Sign Up">
              <SignUp config={config} />
            </TabsContent>
          </>
        ) : (
          <ResetPassword />
        )}
      </Tabs>
    </div>
  );
};

export default AuthModal;
