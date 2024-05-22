import { configureStore } from "@reduxjs/toolkit";
import appReducer from "./feature/appSlice";
import themeReducer from "./feature/themeSlice";
import projectReducer from "./feature/projectSlice"
import mouseReducer from "./feature/mouseSlice"
import { Enviroment } from "@/types/enum";

export const store = configureStore({
  reducer: {
    app: appReducer,
    theme: themeReducer,
    project: projectReducer,
    mouseEffect: mouseReducer
  },
  devTools: process.env.NODE_ENV !== Enviroment.PRODUCTION,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;