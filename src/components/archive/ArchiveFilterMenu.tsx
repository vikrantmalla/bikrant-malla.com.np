"use client";
import { joseFont } from "@/helpers/lib/font";
import Data, { ArchiveList } from "../../types/data";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import {  setProjectList } from "@/redux/feature/projectSlice";

const ArchiveFilterMenu = ({ project }: ArchiveList) => {
  const dispatch = useDispatch<AppDispatch>();
  const search = useSearchParams();
  const [selectedTag, setSelectedTag] = useState(search.get("Html") || "All");
  const filterProjects = (tag: string, projects: Data.ArchiveDetailsData[]) => {
    if (selectedTag === "All") {
      return projects;
    } else {
      return projects.filter((p) => p.build.includes(tag));
    }
  };

  const handleTagSelect = (techTag: string) => {
    setSelectedTag(techTag);
    const filteredProjects = filterProjects(techTag, project);
    dispatch(setProjectList(filteredProjects));
  };

  const tech = ["All", "Feature", "Html", "CSS", "ReactJS"];
  return (
    <div className={`subheading ${joseFont} fs-600`}>
      {tech.map((techTag) => {
        return (
          <Link href={`?tag=${techTag}`} key="index" onClick={() => handleTagSelect(techTag)}>
            {techTag}
          </Link>
        );
      })}
    </div>
  );
};

export default ArchiveFilterMenu;
