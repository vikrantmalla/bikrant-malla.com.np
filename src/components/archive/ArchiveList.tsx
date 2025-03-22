"use client";
import React from "react";
import { ArchiveProject } from "../../types/data";
import { joseFont } from "@/helpers/lib/font";
import ArchiveDetails from "./ArchiveCard";
import { useProjectStore } from "@/store/feature/projectStore";

const Card = () => {
  const { projectList } = useProjectStore();

  return (
    <>
      {projectList.length > 0 ? (
        projectList.map((data: ArchiveProject, id: number) => {
          return <ArchiveDetails key={id} {...data} isnew={data.isnew} />;
        })
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
