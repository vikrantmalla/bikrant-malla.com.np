import { ProviderContext } from "@/types/data";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const initialState: ProviderContext.ProjectSlice = {
  selectedTag: 'All',
  projectList: [],
  showSkeletonLoading: false
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
    setSkeletonLoading: (state, action) => {
      state.showSkeletonLoading = action.payload;
    }
  },
});

export const { setSelectedTag, setProjectList, setSkeletonLoading } = project.actions;
export default project.reducer;
