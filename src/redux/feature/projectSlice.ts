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
    setSelectedTag: (state, action: PayloadAction<string>) => {
      state.selectedTag = action.payload;
    },
    setProjectList: (state, action) => {
      state.projectList = action.payload;
    },
  },
});

export const { setSelectedTag, setProjectList } = project.actions;
export default project.reducer;
