import { createStore } from "../provider";
import { TagsCategory } from "@/types/enum";
import { ArchiveProject, ProviderContext } from "@/types/data";

export const useProjectStore = createStore<ProviderContext.ProjectStore>(
  (set) => ({
    projectList: [],
    selectedTag: TagsCategory.ALL,
    showSkeletonLoading: false,
    isAscending: false,

    setSelectedTag: (tag) => set({ selectedTag: tag }),

    setProjectList: (projects) =>
      set({
        projectList: [...projects].sort(
          (prevProject, nextProject) => nextProject.year - prevProject.year
        ),
      }),

    sortProjectList: () =>
      set((state: { isAscending: boolean; projectList: ArchiveProject[] }) => ({
        isAscending: !state.isAscending,
        projectList: [...state.projectList].sort((prevProject, nextProject) =>
          state.isAscending
            ? prevProject.year - nextProject.year
            : nextProject.year - prevProject.year
        ),
      })),

    setSkeletonLoading: (value) => set({ showSkeletonLoading: value }),
  }),
  "projectStore"
);
