import React, { useState } from 'react'
import ArchiveData from '../data/ArchiveData';
export const ProjectContext = React.createContext();

const ProjectProvider = (props) => {
    const [filterKeyword, setFilterKeyword] = useState([]);
    const AddKeyword = (keyword) => {
        if (!filterKeyword.includes(keyword)) {
            setFilterKeyword([...filterKeyword, keyword]);
        }
    };
    const RemoveKeyword = (key) => {
        const newKeyword = filterKeyword.filter((tag) => tag !== key);
        setFilterKeyword(newKeyword);
    };

    const ClearKeywords = () => {
        setFilterKeyword([]);
    };

    const projectContext = {
        ArchiveData,filterKeyword, AddKeyword, RemoveKeyword, ClearKeywords
    }
    return (
        <>
            <ProjectContext.Provider value={projectContext}>
                {props.children}
            </ProjectContext.Provider>
        </>
    )
}

export default ProjectProvider
