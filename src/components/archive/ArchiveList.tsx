"use client";
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { Project } from "../../types/data";
import { joseFont } from "@/helpers/lib/font";
import ArchiveDetails from "./ArchiveCard";

const Card = () => {
  const projectList = useSelector(
    (state: RootState) => state.project.projectList
  );
  return (
    <>
      {projectList.length > 0 ? (
        projectList.map((data: Project, id: number) => (
          <ArchiveDetails key={id} {...data} isnew={data.isnew} />
        ))
      ) : (
        <div className="message-placeholder">
          <p className={`subheading ${joseFont} fs-600`}>
            Project is not available
          </p>
        </div>
      )}
    </>
  );
};

export default Card;
