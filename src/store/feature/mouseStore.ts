import { createStore } from "../provider";
import { ProviderContext } from "@/types/data";


export const useMouseStore = createStore<ProviderContext.MouseStore>(
  (set) => ({
    cursorType: "",
    mousePosition: { x: 0, y: 0 },
    setCursorType: (type) => set({ cursorType: type }),
    setMousePosition: (position) => set({ mousePosition: position }),
  }),
  "mouseStore"
);
