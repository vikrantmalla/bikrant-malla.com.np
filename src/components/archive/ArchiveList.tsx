"use client";
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import ArchiveDetails from "./ArchiveCard";
import Data from "../../types/data";

const Card = () => {
  const projectList = useSelector((state: RootState) => state.project.projectList);
  return (
    <>
      {...projectList.map((data: Data.ArchiveDetailsData, id: number) => {
        return <ArchiveDetails key={id} {...data} isNew={data.isnew} />;
      })}
    </>
  );
};

export default Card;
