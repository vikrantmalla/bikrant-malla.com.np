import { ProviderContext } from "@/types/data";
import { createSlice } from "@reduxjs/toolkit";

const initialState: ProviderContext.AppSlice = {
  toggleMenu: false,
  navColor: false,
  activeLink: ""
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
  },
});

export const { setToggleMenu, setNavColor, setActiveLink } = app.actions;
export default app.reducer;
