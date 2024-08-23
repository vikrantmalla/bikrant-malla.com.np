import { ProviderContext } from "@/types/data";
import { TagsCategory } from "@/types/enum";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const initialState: ProviderContext.ProjectSlice = {
  selectedTag: TagsCategory.ALL,
  projectList: [],
  showSkeletonLoading: false,
  isAscending: false,
};

export const project = createSlice({
  name: "project",
  initialState,
  reducers: {
    setSelectedTag: (state, action: PayloadAction<string>) => {
      state.selectedTag = action.payload;
    },
    setProjectList: (state, action) => {
      state.projectList = [...action.payload].sort(
        (prevProject: { year: number }, nextProject: { year: number }) =>
          nextProject.year - prevProject.year
      );
    },
    sortProjectList: (state) => {
      state.isAscending = !state.isAscending;
      state.projectList.sort(
        (prevProject: { year: number }, nextProject: { year: number }) =>
          state.isAscending ? prevProject.year - nextProject.year : nextProject.year - prevProject.year
      );
    },
    setSkeletonLoading: (state, action) => {
      state.showSkeletonLoading = action.payload;
    },
  },
});

export const { setSelectedTag, setProjectList, sortProjectList, setSkeletonLoading } =
  project.actions;
export default project.reducer;
