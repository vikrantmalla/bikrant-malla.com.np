"use client";
import { useCallback, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import Link from "next/link";
import { joseFont } from "@/helpers/lib/font";
import Data, { ProjectData } from "../../types/data";
import * as gtag from "../../helpers/lib/gtag";
import {
  setProjectList,
  setSelectedTag,
  setSkeletonLoading,
} from "@/redux/feature/projectSlice";

const ArchiveFilterMenu = ({ project, techTag }: ProjectData) => {
  const dispatch = useDispatch<AppDispatch>();
  const selectedTag = useSelector(
    (state: RootState) => state.project.selectedTag
  );
  const search = useSearchParams();

  const filterProjects = useCallback(
    (tag: string) => {
      let filteredProjects;
      if (tag === "All") {
        filteredProjects = project;
      } else if (tag === "Feature") {
        // Filter based on isNew property for "Feature" tag
        filteredProjects = project.filter((p: Data.Project) => p.isnew);
      } else {
        // Replace underscores with spaces in the tag
        const formattedTag = tag.replace(/_/g, " ");
        // Filter based on tag props
        filteredProjects = project.filter((p: Data.Project) =>
          p.build.includes(formattedTag)
        );
      }
      dispatch(setProjectList(filteredProjects));
      const newKeyword = tag.toLowerCase().replace(/\s+/g, "_");
      gtag.event({
        action: `${newKeyword}`,
        category: "keyword_filtering",
        label: "keyword_list_update",
      });
    },
    [project, dispatch]
  );

  useEffect(() => {
    const initialTagFromUrl = search.get("tag") || "All";
    dispatch(setSelectedTag(initialTagFromUrl));
    filterProjects(initialTagFromUrl);
  }, [search, filterProjects, dispatch]);

  const handleTagSelect = (techTag: string) => {
    dispatch(setSelectedTag(techTag));
    dispatch(setSkeletonLoading(true));
    filterProjects(techTag);
    setTimeout(() => {
      dispatch(setSkeletonLoading(false));
    }, 2000);
  };

  const tech = techTag.map((techTag) => techTag.tag);

  // Replace spaces with underscore in the URL
  const formattedTech = tech.map((tag) => tag.replace(/\s/g, "_"));

  return (
    <div className={`subheading ${joseFont} fs-300 filter-links`}>
      <ul>
        <li>
          {tech.map((techTag, index) => (
            <Link
              key={techTag}
              onClick={() => handleTagSelect(techTag)}
              className={
                selectedTag === techTag ? "tag-selected" : "tag-not-selected"
              }
              href={`?tag=${formattedTech[index]}`}
            >
              {techTag}
            </Link>
          ))}
        </li>
      </ul>
    </div>
  );
};

export default ArchiveFilterMenu;
