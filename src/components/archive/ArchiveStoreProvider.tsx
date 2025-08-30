"use client";
import React, { useEffect } from "react";
import { ArchiveProject } from "@/types/data";
import { useProjectStore } from "@/store/feature/projectStore";

interface ArchiveStoreProviderProps {
  archiveProjects: ArchiveProject[];
  children: React.ReactNode;
}

const ArchiveStoreProvider: React.FC<ArchiveStoreProviderProps> = ({ 
  archiveProjects, 
  children 
}) => {
  const { setProjectList } = useProjectStore();

  useEffect(() => {
    // Populate the store with the archive projects
    if (archiveProjects.length > 0) {
      setProjectList(archiveProjects);
    }
  }, [archiveProjects, setProjectList]);

  return <>{children}</>;
};

export default ArchiveStoreProvider;
