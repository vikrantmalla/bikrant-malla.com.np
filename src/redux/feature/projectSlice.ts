import { ProviderContext } from "@/types/data";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const initialState: ProviderContext.ProjectSlice = {
  filterKeyword: [],
  selectedTag: 'All',
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
    setSelectedTag: (state, action: PayloadAction<string>) => {
      state.selectedTag = action.payload;
    },
    setProjectList: (state, action) => {
      console.log(state.projectList.length)
      console.log(state.projectList)
      state.projectList = action.payload;
    },
  },
});

export const { setFilterKeyword, addKeyword, removeKeyword, clearKeywords, setSelectedTag, setProjectList } = project.actions;
export default project.reducer;
