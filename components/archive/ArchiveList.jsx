import React, { useState, useEffect, useContext } from 'react';
import ArchiveDetails from './ArchiveCard'
import { ProjectContext } from '../../context/ProjectContext'
const Card = ({ project }) => {
    const { filterKeyword } = useContext(ProjectContext);
    const [newData, setNewData] = useState([]);
    useEffect(() => {
        const FilteredData = () => {
            if (filterKeyword) {
                const filter = project.filter((tag) => {
                    return filterKeyword.every((key) => {
                        return (
                            tag.build.includes(key)
                        );
                    });
                });
                setNewData(filter);
            } else {
                setNewData(project);
            }
        };
        FilteredData();
    }, [project, filterKeyword]);
    return (
        <>
            {
                newData.map((data, id) => {
                    return <ArchiveDetails key={id} {...data} isNew={data.isnew} />
                })
            }
        </>
    )
};

export default Card;
