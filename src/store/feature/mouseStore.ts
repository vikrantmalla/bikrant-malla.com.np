import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { Enviroment } from "@/types/enum";
import { ProviderContext } from "@/types/data";

export const useMouseStore = create< ProviderContext.MouseStore>()(
    devtools(
      (set) => ({
        cursorType: "",
        mousePosition: { x: 0, y: 0 },
        setCursorType: (type) => set({ cursorType: type }),
        setMousePosition: (position) => set({ mousePosition: position }),
      }),
      {
        enabled: process.env.NODE_ENV !== Enviroment.PRODUCTION,
        name: 'mouseStore',
      }
    )
  );