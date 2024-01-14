"use client";
import React from "react";
import { useSelector } from "react-redux";
import { RootState, store } from "@/redux/store";
import { joseFont } from "@/helpers/lib/font";
import { IoIosClose } from "react-icons/io";
import { clearKeywords, removeKeyword } from "@/redux/feature/projectSlice";

const ArchiveHeader = () => {
  const filterKeyword = useSelector(
    (state: RootState) => state.project.filterKeyword
  );

  const RemoveKeyword = (key: string) => {
    store.dispatch(removeKeyword(key));
  };

  const ClearKeywords = () => {
    store.dispatch(clearKeywords());
  };
  return (
    <>
      <header className="archive-header">
        <div className="center">
          <div className={`${filterKeyword.length > 0 ? "search" : null}`}>
            <div className="filter_tags">
              {filterKeyword.map((tag: string, id: number) => {
                return (
                  <div className="filter" key={id}>
                    <span className={`link ${joseFont} fs-400`}>{tag}</span>
                    <IoIosClose
                      className="close"
                      size={35}
                      onClick={() => RemoveKeyword(tag)}
                    />
                  </div>
                );
              })}
            </div>
            {filterKeyword.length > 0 && (
              <button
                className={`clear ${joseFont} fs-400`}
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
