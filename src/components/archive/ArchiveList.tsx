"use client";
import React from "react";
import { ArchiveProject } from "../../types/data";
import { joseFont } from "@/helpers/lib/font";
import ArchiveDetails from "./ArchiveCard";

interface ArchiveListProps {
  archiveProjects: ArchiveProject[];
}

const ArchiveList: React.FC<ArchiveListProps> = ({ archiveProjects }) => {
  return (
    <>
      {archiveProjects.length > 0 ? (
        archiveProjects.map((data: ArchiveProject, id: number) => {
          return <ArchiveDetails key={id} {...data} />
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

export default ArchiveList;
