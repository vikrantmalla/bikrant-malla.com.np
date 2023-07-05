import React from "react";
import { BehancePageData, BehanceProject } from "../../types/data";
import BehanceCard from "./BehanceCard";

const Behance = ({ behanceData }: BehancePageData) => {
  return (
    <>
      <section className="concept" id="concept">
        <h1 className="headingright ff-serif-jose fs-600">UI/UX Concept</h1>
        <div className="behanceitems">
          {behanceData.behanceProject.map(
            (project: BehanceProject, index: number) => {
              return <BehanceCard key={index} project={project} />;
            }
          )}
        </div>
      </section>
    </>
  );
};

export default Behance;
