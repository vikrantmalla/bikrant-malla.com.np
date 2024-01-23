import { ProviderContext } from "@/types/data";
import { createSlice } from "@reduxjs/toolkit";

const initialState: ProviderContext.MouseSlice = {
    cursorType: "",
    mousePosition: { x: 0, y: 0 }
};

export const mouseEffect = createSlice({
  name: "mouseEffect",
  initialState,
  reducers: {
    setCursorType: (state, action) => {
      state.cursorType = action.payload;
    },
    setMousePosition: (state, action) => {
        state.mousePosition = action.payload;
    }
  },
});

export const { setCursorType, setMousePosition } = mouseEffect.actions;
export default mouseEffect.reducer;
