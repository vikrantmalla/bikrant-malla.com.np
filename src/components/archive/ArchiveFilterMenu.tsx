"use client";
import { joseFont } from "@/helpers/lib/font";
import Data, { ArchiveList } from "../../types/data";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import {  setProjectList, setSelectedTag } from "@/redux/feature/projectSlice";

const ArchiveFilterMenu = ({ project }: ArchiveList) => {
  const dispatch = useDispatch<AppDispatch>();
  const selectedTag = useSelector((state: RootState) => state.project.selectedTag); 
  const search = useSearchParams();

  const filterProjects = useCallback((tag: string) => {
    const filteredProjects = tag === "All" ? project : project.filter((p: Data.ArchiveDetailsData) => p.build.includes(tag));
    dispatch(setProjectList(filteredProjects));
  }, [project, dispatch]);

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

  return (
    <div className={`subheading ${joseFont} fs-600`}>
      {tech.map((techTag) => (
        <Link key={techTag} href={`?tag=${techTag}`} onClick={() => handleTagSelect(techTag)}>
          {techTag}
        </Link>
      ))}
    </div>
  );
};

export default ArchiveFilterMenu;
