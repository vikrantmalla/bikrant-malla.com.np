import React from "react";
import Link from "next/link";
import { useProjectData } from "../../context/ProjectContext";

const ArchiveHeader = () => {
  const { filterKeyword, RemoveKeyword, ClearKeywords } = useProjectData();
  return (
    <>
      <header className="archive-header">
        <div className="center">
          <div className={`${filterKeyword.length > 0 ? "search" : null}`}>
            <div className="filter_tags">
              {filterKeyword.map((tag: string, id: number) => {
                return (
                  <div className="filter" key={id}>
                    <span className="ff-serif-jose fs-400">{tag}</span>
                    <i
                      className="fas fa-times"
                      onClick={() => RemoveKeyword(tag)}
                    />
                  </div>
                );
              })}
            </div>
            {filterKeyword.length > 0 && (
              <button
                className="clear ff-serif-jose fs-400"
                onClick={ClearKeywords}
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </header>
    </>
  );
};

export default ArchiveHeader;
