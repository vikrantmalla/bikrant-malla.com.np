import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { Enviroment } from "@/types/enum";
import { ProviderContext } from "@/types/data";

// styles
const lightTheme: string[] = [
  "--background: #f9fafb",
  "--navBackground: #111111",
  "--navBackgroundShadow: 0 1px 30px 0 rgb(145 145 145 / 20%)",
  "--navActiveLink: #404756",
  "--text: #000",
  "--textRev: #fff",
  "--headingStroke: #fff",
  "--hoverStroke: #000",
  "--toggle: #eaeaea",
  "--toggleHover: #444444",
  "--link:#444444",
  "--card:#dbe1e8",
  "--cardBackgroundShadow: 0 3px 8px rgb(0 0 0 / 24%)",
  "--span:#3f4954",
];

const darkTheme: string[] = [
  "--background: #13141c",
  "--navBackground: #f9fafb",
  "--navBackgroundShadow: 0 1px 30px 0 rgb(2 2 3 / 70%)",
  "--navActiveLink: #ebecf0",
  "--text: #fff",
  "--textRev: #000",
  "--headingStroke: #000",
  "--hoverStroke: #fff",
  "--toggle: #202230",
  "--toggleHover: #eaeaea",
  "--link:#888888",
  "--card:#212330",
  "--cardBackgroundShadow: 0 2px 20px 0 rgb(0 0 0 / 5%)",
  "--span:#f9feff",
];

export const useThemeStore = create<ProviderContext.ThemeStore>()(
  devtools(
    (set) => ({
      isDarkTheme: false,
      currentTheme: lightTheme, // Default to light theme
      themes: {
        light: lightTheme,
        dark: darkTheme,
      },
      setIsDarkTheme: (value) =>
        set((state) => ({
          isDarkTheme: value,
          currentTheme: value ? state.themes.dark : state.themes.light,
        })),
    }),
    {
      enabled: process.env.NODE_ENV !== Enviroment.PRODUCTION,
      name: "themeStore",
    }
  )
);
