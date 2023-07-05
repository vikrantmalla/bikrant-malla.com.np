import React, { useState, useEffect, useContext } from "react";
import ArchiveDetails from "./ArchiveCard";
import { useProjectData } from "../../context/ProjectContext";
import { ArchiveDetailsData, ArchiveList } from "../../types/data";

const Card = ({ project }: ArchiveList) => {
  const { filterKeyword } = useProjectData();
  const [newData, setNewData] = useState([]);
  useEffect(() => {
    const FilteredData = () => {
      if (filterKeyword) {
        const filter = project.filter((tag: ArchiveDetailsData) => {
          return filterKeyword.every((key: string) => {
            return tag.build.includes(key);
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
      {newData.map((data: ArchiveDetailsData, id: number) => {
        return <ArchiveDetails key={id} {...data} isNew={data.isnew} />;
      })}
    </>
  );
};

export default Card;
