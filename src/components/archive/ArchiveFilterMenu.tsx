"use client";
import Link from "next/link";
import { useCallback, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { joseFont } from "@/helpers/lib/font";
import { ArchiveProps } from "../../types/data";
import * as gtag from "../../helpers/lib/gtag";
import { TagsCategory } from "@/types/enum";
import { FaSortAmountDownAlt, FaSortAmountUpAlt } from "react-icons/fa";
import { useProjectStore } from "@/store/feature/projectStore";

const ArchiveFilterMenu = ({ techTag }: Omit<ArchiveProps, 'project'>) => {
  const {
    projectList,
    originalProjects,
    isAscending,
    selectedTag,
    sortProjectList,
    setProjectList,
    setSelectedTag,
    setSkeletonLoading,
  } = useProjectStore();

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
      .map((word) => {
        // Special case for JS to ensure it's uppercase
        if (word.toLowerCase() === 'js') {
          return 'JS';
        }
        return word.charAt(0).toUpperCase() + word.slice(1);
      })
      .join(" ");
  }

  const search = useSearchParams();

  const filterProjects = useCallback(
    (tag: string) => {
      let filteredProjects;
      if (tag === TagsCategory.ALL || tag === TagsCategory.ALL.toLowerCase()) {
        // For "All" tag, use the original projects
        filteredProjects = originalProjects;
      } else if (tag === TagsCategory.FEATURE.toLowerCase()) {
        // Filter based on isNew property for "Feature" tag
        filteredProjects = originalProjects.filter((p) => p.isNew);
      } else {
        // Format the tag for comparison with build array
        let formattedTag: string;
        if (
          tag.toUpperCase() === TagsCategory.HTML ||
          tag.toUpperCase() === TagsCategory.CSS ||
          tag.toUpperCase() === TagsCategory.SCSS
        ) {
          formattedTag = tag.toUpperCase();
        } else {
          const words = tag.split("_"); // Split the tag by underscore if it contains any
          formattedTag = words
            .map((word) => {
              // Special case for JS to ensure it's uppercase
              if (word.toLowerCase() === 'js') {
                return 'JS';
              }
              return word.charAt(0).toUpperCase() + word.slice(1);
            })
            .join(" ");
        }
        
        // Filter based on tag props
        filteredProjects = originalProjects.filter((p) =>
          p.build.includes(formattedTag)
        );
      }
      setProjectList(filteredProjects);
      const newKeyword = tag.toLowerCase().replace(/\s+/g, "_");
      gtag.event({
        action: `${newKeyword}`,
        category: "keyword_filtering",
        label: "keyword_list_update",
      });
    },
    [setProjectList, originalProjects]
  );

  useEffect(() => {
    const initialTagFromUrl = search.get("tag") || TagsCategory.ALL;
    setSelectedTag(initialTagFromUrl);
    filterProjects(initialTagFromUrl);
  }, [search, filterProjects, setSelectedTag]);

  const handleTagSelect = (techTag: string) => {
    setSelectedTag(techTag);
    setSkeletonLoading(true);
    filterProjects(techTag);
    setTimeout(() => {
      setSkeletonLoading(false);
    }, 2000);
  };

  const tech = techTag.map((techTag) => techTag.tag);
  // Replace spaces with underscore in the URL
  const formattedTech = tech.map((tag) =>
    tag.toLowerCase().replace(/\s/g, "_")
  );

  const handleSortClick = () => {
    sortProjectList();
    gtag.event({
      action: "sorted",
      category: "sorting",
      label: isAscending ? "ascending" : "descending",
    });
  };

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
                  : `/archive?tag=${formattedTech[index]}`
              }
              aria-label={`Filter by ${techTag} projects`}
            >
              {techTag}
              <span style={{ fontSize: "0.8em", marginLeft: "5px" }}>
                {formattedSelectedTag === techTag
                  ? `(${projectList.length})`
                  : ""}
              </span>
            </Link>
          </li>
        ))}
      </ul>
      <button role="button" className="sort-btn" onClick={handleSortClick}>
        {isAscending ? <FaSortAmountDownAlt /> : <FaSortAmountUpAlt />}
      </button>
    </div>
  );
};

export default ArchiveFilterMenu;
