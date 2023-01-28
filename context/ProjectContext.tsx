import React, { createContext, useContext, useState } from "react";
import Data, { Contexts } from "../types/data";

const appContextDefaultValues: Contexts.ProjectContext = {
    filterKeyword: [],
    AddKeyword: () => {},
    RemoveKeyword: () => {},
    ClearKeywords: () => {}

}

const ProjectContext = createContext<Contexts.ProjectContext>(appContextDefaultValues)

export function useProjectData (): Contexts.ProjectContext {
  return useContext(ProjectContext)
}

const ProjectProvider = ({ children }: Data.Props) => {
    const [filterKeyword, setFilterKeyword] = useState([]);
    const AddKeyword = (keyword: never) => {
        if (!filterKeyword.includes(keyword)) {
            setFilterKeyword([...filterKeyword, keyword]);
        }
    };
    const RemoveKeyword = (key: never) => {
        const newKeyword = filterKeyword.filter((tag) => tag !== key);
        setFilterKeyword(newKeyword);
    };

    const ClearKeywords = () => {
        setFilterKeyword([]);
    };

    const projectContext = {
       filterKeyword, AddKeyword, RemoveKeyword, ClearKeywords
    }
    return (
        <>
            <ProjectContext.Provider value={projectContext}>
                {children}
            </ProjectContext.Provider>
        </>
    )
}

export default ProjectProvider