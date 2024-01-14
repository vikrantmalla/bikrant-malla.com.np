import { ProviderContext } from "@/types/data";
import { createSlice } from "@reduxjs/toolkit";

const initialState: ProviderContext.ProjectSlice = {
  filterKeyword: [],
  projectList: []
};

export const project = createSlice({
  name: "project",
  initialState,
  reducers: {
    setFilterKeyword: (state, action) => {
      state.filterKeyword = action.payload;
    },
    addKeyword: (state, action) => {
      const keyword = action.payload;
      if (!state.filterKeyword.includes(keyword)) {
        state.filterKeyword.push(keyword);
      }
    },
    removeKeyword: (state, action) => {
      state.filterKeyword = state.filterKeyword.filter(
        (tag) => tag !== action.payload
      );
    },
    clearKeywords: (state) => {
      state.filterKeyword = [];
    },
    setProjectList: (state, action) => {
      state.projectList = action.payload;
    },
  },
});

export const { setFilterKeyword, addKeyword, removeKeyword, clearKeywords, setProjectList } = project.actions;
export default project.reducer;
