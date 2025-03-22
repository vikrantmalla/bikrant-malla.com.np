import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { Enviroment } from "@/types/enum";
import { ProviderContext } from "@/types/data";

export const useProjectStore = create<ProviderContext.ProjectStore>()(
  devtools(
    (set) => ({
      projectList: [],
      selectedTag: "ALL",
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
        set((state) => ({
          isAscending: !state.isAscending,
          projectList: [...state.projectList].sort((prevProject, nextProject) =>
            state.isAscending
              ? prevProject.year - nextProject.year
              : nextProject.year - prevProject.year
          ),
        })),

      setSkeletonLoading: (value) => set({ showSkeletonLoading: value }),
    }),
    {
      enabled: process.env.NODE_ENV !== Enviroment.PRODUCTION,
      name: "projectStore",
    }
  )
);
