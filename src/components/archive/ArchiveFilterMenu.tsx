"use client";
import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import Link from "next/link";
import { joseFont } from "@/helpers/lib/font";
import Data, { ArchiveList } from "../../types/data";
import * as gtag from "../../helpers/lib/gtag";
import { setProjectList, setSelectedTag } from "@/redux/feature/projectSlice";

const ArchiveFilterMenu = ({ project }: ArchiveList) => {
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
        filteredProjects = project.filter(
          (p: Data.ArchiveDetailsData) => p.isnew
        );
      } else {
        // Replace underscores with spaces in the tag
        const formattedTag = tag.replace(/_/g, " ");
        // Filter based on tag props
        filteredProjects = project.filter((p: Data.ArchiveDetailsData) =>
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
    filterProjects(techTag);
  };

  const tech = ["All", "Feature", "HTML", "CSS", "React JS"];

  // Replace spaces with underscore in the URL
  const formattedTech = tech.map((tag) => tag.replace(/\s/g, "_"));

  return (
    <div className={`subheading ${joseFont} fs-300 filter-links`}>
      <ul>
        {tech.map((techTag, index) => (
          <li key={techTag}>
            <Link
              href={`?tag=${formattedTech[index]}`}
              onClick={() => handleTagSelect(techTag)}
              className="tags"
            >
              {techTag}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ArchiveFilterMenu;
