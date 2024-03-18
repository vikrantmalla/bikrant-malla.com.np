import React, { useState } from "react";
import LogIn from "../adminDashboard/auth/LogIn";
import SignUp from "../adminDashboard/auth/SignUp";
import { TabType } from "@/types/enum";

interface Props {
  showForgetPasswordModal: boolean;
  setShowForgetPasswordModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const Tabs = ({
  showForgetPasswordModal,
  setShowForgetPasswordModal,
}: Props) => {
  const [openTab, setOpenTab] = useState(TabType.logIn);
  return (
    <>
      <div className="flex flex-wrap">
        <div className="w-full">
          <ul
            className="flex flex-column mb-0 list-none flex-wrap pt-3 pb-4"
            role="tablist"
          >
            {showForgetPasswordModal === false ? (
              <>
                <li className="-mb-px mr-2 last:mr-0 flex-auto text-center">
                  <a
                    className={
                      "text-xs font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal " +
                      (openTab === 1 ? "bg-yellow-400 text-white" : "bg-white")
                    }
                    onClick={(e) => {
                      e.preventDefault();
                      setOpenTab(1);
                    }}
                    data-toggle="tab"
                    href="#link1"
                    role="tablist"
                  >
                    LOGIN
                  </a>
                </li>
                <li className="-mb-px mr-2 last:mr-0 flex-auto text-center">
                  <a
                    className={
                      "text-xs font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal " +
                      (openTab === 2 ? "bg-yellow-400 text-white" : "bg-white")
                    }
                    onClick={(e) => {
                      e.preventDefault();
                      setOpenTab(2);
                    }}
                    data-toggle="tab"
                    href="#link2"
                    role="tablist"
                  >
                    SIGNUP
                  </a>
                </li>
              </>
            ) : (
              <li className="-mb-px mr-2 last:mr-0 flex-auto text-center">
                <a
                  className="text-xs font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal bg-yellow-400 text-white"
                  data-toggle="tab"
                  role="tablist"
                >
                  Forget Password
                </a>
              </li>
            )}
          </ul>
          <div className="relative flex flex-col min-w-0 break-words bg-white w-full rounded">
            <div className="px-4 py-5 flex-auto">
              <div className="tab-content tab-space">
                <div
                  className={`w-full max-w-lg ${
                    openTab === TabType.logIn ? "block" : "hidden"
                  }`}
                  id="link1"
                >
                  <LogIn showForgetPasswordModal={showForgetPasswordModal} setShowForgetPasswordModal={setShowForgetPasswordModal}/>
                </div>
                <div
                  className={`w-full max-w-lg ${
                    openTab === TabType.signUp ? "block" : "hidden"
                  }`}
                  id="link2"
                >
                  <SignUp />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default function TabsRender({
  showForgetPasswordModal,
  setShowForgetPasswordModal
}: Props) {
  return (
    <>
      <Tabs
        showForgetPasswordModal={showForgetPasswordModal}
        setShowForgetPasswordModal={setShowForgetPasswordModal}
      />
    </>
  );
}
