import { ProviderContext } from "@/types/data";
import { createSlice } from "@reduxjs/toolkit";

const initialState: ProviderContext.ThemeSlice = {
    isDarkTheme: false,
};

export const theme = createSlice({
    name: "theme",
    initialState,
    reducers: {
        setIsDarkTheme: (state, action) => {
            state.isDarkTheme = action.payload;
        },
    },
});

export const { setIsDarkTheme } = theme.actions;
export default theme.reducer;
