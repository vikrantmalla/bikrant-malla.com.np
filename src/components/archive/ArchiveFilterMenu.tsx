"use client";
import { useCallback, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import Link from "next/link";
import { joseFont } from "@/helpers/lib/font";
import { ArchiveProps } from "../../types/data";
import * as gtag from "../../helpers/lib/gtag";
import {
  setProjectList,
  setSelectedTag,
  setSkeletonLoading,
} from "@/redux/feature/projectSlice";
import { TagsCategory } from "@/types/enum";
import { FaSort } from "react-icons/fa";

const ArchiveFilterMenu = ({ project, techTag }: ArchiveProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const selectedTag = useSelector(
    (state: RootState) => state.project.selectedTag
  );

  let formattedSelectedTag: string;

  if (
    selectedTag.toUpperCase() === TagsCategory.HTML ||
    selectedTag.toUpperCase() === TagsCategory.CSS ||
    selectedTag.toUpperCase() === TagsCategory.SCSS
  ) {
    formattedSelectedTag = selectedTag.toUpperCase();
  } else {
    const words = selectedTag.split("_"); // Split the tag by underscore if it contains any
    formattedSelectedTag = words
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  const search = useSearchParams();

  const filterProjects = useCallback(
    (tag: string) => {
      let filteredProjects;
      if (tag === TagsCategory.ALL || tag === TagsCategory.ALL.toLowerCase()) {
        filteredProjects = project;
      } else if (tag === TagsCategory.FEATURE.toLowerCase()) {
        // Filter based on isNew property for "Feature" tag
        filteredProjects = project.filter((p) => p.isnew);
      } else {
        // Filter based on tag props
        filteredProjects = project.filter((p) =>
          p.build.includes(formattedSelectedTag)
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
    [dispatch, project, formattedSelectedTag]
  );

  useEffect(() => {
    const initialTagFromUrl = search.get("tag") || TagsCategory.ALL;
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
  const formattedTech = tech.map((tag) =>
    tag.toLowerCase().replace(/\s/g, "_")
  );

  return (
    <div className={`subheading ${joseFont} fs-300 filter-links`}>
      <ul>
        {tech.map((techTag, index) => (
          <li key={techTag}>
            <Link
              onClick={() => handleTagSelect(techTag)}
              className={
                formattedSelectedTag === techTag
                  ? "tag-selected"
                  : "tag-not-selected"
              }
              href={
                formattedTech[index] === TagsCategory.ALL.toLowerCase()
                  ? "/archive"
                  : `?tag=${formattedTech[index]}`
              }
              aria-label={`Filter by ${techTag} projects`}
            >
              {techTag}
            </Link>
          </li>
        ))}
      </ul>
      <button role="button" className="sort-btn">
        <FaSort />
      </button>
    </div>
  );
};

export default ArchiveFilterMenu;
