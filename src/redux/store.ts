import { configureStore } from "@reduxjs/toolkit";
import appReducer from "./feature/appSlice";
import themeReducer from "./feature/themeSlice";

export const store = configureStore({
  reducer: {
    app: appReducer,
    theme: themeReducer
  },
  devTools: process.env.NODE_ENV !== "production",
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;