import React from "react";
import { BehancePageData, BehanceProject } from "../../types/data";
import BehanceCard from "./BehanceCard";
import { joseFont } from "@/helpers/lib/font";

const Behance = ({ behanceData }: BehancePageData) => {
  return (
    <>
      <section className="concept" id="concept">
        <h2 className={`headingright ${joseFont} fs-600`}>UI/UX Concept</h2>
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
