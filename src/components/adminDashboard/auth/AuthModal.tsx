"use client";
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { signIn } from "next-auth/react";
import SignIn from "./SignIn";
import { ConfigData } from "@/types/data";
import SignUp from "./SignUp";
// import { useDispatch } from "react-redux";
// import { AppDispatch } from "@/redux/store";
// import { setShowModal } from "@/redux/feature/appSlice";

const AuthModal = ({ config }: ConfigData) => {
  // const dispatch = useDispatch<AppDispatch>();
  const [showForgetPasswordModal, setShowForgetPasswordModal] = useState(false);
  const allowSignUp = config.some((c) => c.allowSignUp);
  const renderTabsTrigger = (value: string) => {
    if (allowSignUp) {
      return <TabsTrigger value={value}>{value}</TabsTrigger>;
    }
    if (value === "SignIn") {
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
      <Tabs defaultValue="SignIn" className="w-[400px]">
        <TabsList
          className={allowSignUp ? "grid w-full grid-cols-2" : "w-full"}
        >
          {renderTabsTrigger("SignIn")}
          {renderTabsTrigger("SignUp")}
        </TabsList>
        <TabsContent value="SignIn">
          <SignIn />
        </TabsContent>
        {allowSignUp && (
          <TabsContent value="SignUp">
            <SignUp />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default AuthModal;
