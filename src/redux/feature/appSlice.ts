import { ProviderContext } from "@/types/data";
import { createSlice } from "@reduxjs/toolkit";

const initialState: ProviderContext.AppSlice = {
  toggleMenu: false,
  navColor: false,
  activeLink: "",
  showForgetPasswordModal: false
};

export const app = createSlice({
  name: "app",
  initialState,
  reducers: {
    setToggleMenu: (state, action) => {
      state.toggleMenu = action.payload;
    },
    setNavColor: (state, action) => {
      state.navColor = action.payload;
    },
    setActiveLink: (state, action) => {
      state.activeLink = action.payload;
    },
    setShowForgetPasswordModal: (state, action) => {
      state.showForgetPasswordModal = action.payload;
    }
  },
});

export const { setToggleMenu, setNavColor, setActiveLink, setShowForgetPasswordModal } = app.actions;
export default app.reducer;
