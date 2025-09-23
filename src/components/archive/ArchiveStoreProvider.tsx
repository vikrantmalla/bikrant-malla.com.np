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
  const { setProjectList, setOriginalProjects } = useProjectStore();

  useEffect(() => {
    // Initialize store with archive projects on component mount
    if (archiveProjects.length > 0) {
      setOriginalProjects(archiveProjects); // Store original projects for filtering
      setProjectList(archiveProjects); // Set initial display list
    }
  }, [archiveProjects, setOriginalProjects, setProjectList]);

  return <>{children}</>;
};

export default ArchiveStoreProvider;
