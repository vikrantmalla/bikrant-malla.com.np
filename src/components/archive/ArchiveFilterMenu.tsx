"use client";
import { joseFont } from "@/helpers/lib/font";
import Data, { ArchiveList } from "../../types/data";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import {  setProjectList, setSelectedTag } from "@/redux/feature/projectSlice";

const ArchiveFilterMenu = ({ project }: ArchiveList) => {
  const dispatch = useDispatch<AppDispatch>();
  const selectedTag = useSelector((state: RootState) => state.project.selectedTag); 
  const search = useSearchParams();
  const initialTag = search.get("tag") || "All";
  useEffect(() => {
    if (selectedTag === "All") {
      dispatch(setProjectList(project));
    }
  }, [selectedTag, project, dispatch]);

  const handleTagSelect = (techTag: string) => {
    dispatch(setSelectedTag(techTag));
    if (techTag === "All") {
      dispatch(setProjectList(project));
    } else {
      const filteredProjects = project.filter(p => p.build.includes(techTag));
      dispatch(setProjectList(filteredProjects));
    }
  };

  const tech = ["All", "Feature", "HTML", "CSS", "React JS"];
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
