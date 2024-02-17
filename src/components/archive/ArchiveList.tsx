"use client";
import React, { useState, useEffect, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import ArchiveDetails from "./ArchiveCard";
import { ArchiveDetailsData, ArchiveList } from "../../types/data";
import {setProjectList} from "../../redux/feature/projectSlice"

const Card = ({ project }: ArchiveList) => {
  const dispatch = useDispatch<AppDispatch>();
  const filterKeyword = useSelector((state: RootState) => state.project.filterKeyword);
  const projectList = useSelector((state: RootState) => state.project.projectList);

  useEffect(() => {
    const FilteredData = () => {
      if (filterKeyword) {
        const filter = project.filter(
          (tag: ArchiveDetailsData) => {
            return filterKeyword.every((key: string) => {
              return tag.build.includes(key);
            });
          }
        );
        dispatch(setProjectList(filter));
      } else {
        dispatch(setProjectList(project));
      }
    };
    FilteredData();
  }, [project, filterKeyword, dispatch]);
  return (
    <>
      {projectList.map((data: any, id: number) => {
        return <ArchiveDetails key={id} {...data} isNew={data.isnew} />;
      })}
    </>
  );
};

export default Card;
