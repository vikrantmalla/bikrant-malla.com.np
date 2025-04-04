import { createStore } from "../provider";
import { ProviderContext } from "@/types/data";

export const useAppStore = createStore<ProviderContext.AppState>(
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
  "app"
);
