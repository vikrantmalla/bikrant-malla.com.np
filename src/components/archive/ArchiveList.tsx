"use client";
import React from "react";
import { joseFont } from "@/helpers/lib/font";
import ArchiveDetails from "./ArchiveCard";
import { useProjectStore } from "@/store/feature/projectStore";

const ArchiveList: React.FC = () => {
  const { projectList, showSkeletonLoading } = useProjectStore();

  // Show skeleton loading state
  if (showSkeletonLoading) {
    return (
      <div className="archive-lists">
        <div className="message-placeholder">
          <p className={`subheading ${joseFont} fs-600`}>
            Loading projects...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="archive-lists">
      {projectList.length > 0 ? (
        projectList.map((project, index) => (
          <ArchiveDetails key={`${project.id}-${index}`} {...project} />
        ))
      ) : (
        <div className="message-placeholder">
          <p className={`subheading ${joseFont} fs-600`}>
            No projects found for the selected filter
          </p>
        </div>
      )}
    </div>
  );
};

export default ArchiveList;
