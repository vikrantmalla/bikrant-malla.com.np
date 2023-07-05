import React, { createContext, useContext, useState } from "react";
import Data, { Contexts } from "../types/data";
import * as gtag from "../helpers/lib/gtag";

const appContextDefaultValues: Contexts.ProjectContext = {
  filterKeyword: [],
  AddKeyword: () => {},
  RemoveKeyword: () => {},
  ClearKeywords: () => {},
};

const ProjectContext = createContext<Contexts.ProjectContext>(
  appContextDefaultValues
);

export function useProjectData(): Contexts.ProjectContext {
  return useContext(ProjectContext);
}

const ProjectProvider = ({ children }: Data.Props) => {
  const [filterKeyword, setFilterKeyword] = useState<string[]>([]);
  const AddKeyword = (keyword: never) => {
    const techKeyword = (keyword as string).toLowerCase().replace(/\s+/g, '_');
    if (!filterKeyword.includes(keyword)) {
      setFilterKeyword([...filterKeyword, keyword]);
      gtag.event({
        action: `${techKeyword}`,
        category: "keyword_filtering",
        label: "keyword_list_update",
      });
    }
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  const RemoveKeyword = (key: never) => {
    const newKeyword = filterKeyword.filter((tag) => tag !== key);
    setFilterKeyword(newKeyword);
  };

  const ClearKeywords = () => {
    setFilterKeyword([]);
  };

  const projectContext = {
    filterKeyword,
    AddKeyword,
    RemoveKeyword,
    ClearKeywords,
  };
  return (
    <>
      <ProjectContext.Provider value={projectContext}>
        {children}
      </ProjectContext.Provider>
    </>
  );
};

export default ProjectProvider;
