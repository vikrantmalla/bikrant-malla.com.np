import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { Enviroment } from "@/types/enum";
import { ProviderContext } from "@/types/data";

export const useAppStore = create<ProviderContext.AppState>()(
  devtools(
    (set) => ({
      toggleMenu: false,
      navColor: false,
      activeLink: "",
      showForgetPasswordModal: false,
      setToggleMenu: (value) => set({ toggleMenu: value }),
      setNavColor: (value) => set({ navColor: value }),
      setActiveLink: (value) => set({ activeLink: value }),
      setShowForgetPasswordModal: (value) =>
        set({ showForgetPasswordModal: value }),
    }),
    { enabled: process.env.NODE_ENV !== Enviroment.PRODUCTION, name: "app" }
  )
);
