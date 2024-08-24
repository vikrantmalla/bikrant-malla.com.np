import React from "react";
import { BehanceData, BehanceProject } from "../../types/data";
import BehanceCard from "./BehanceCard";
import { joseFont } from "@/helpers/lib/font";

const Behance = ({ behance, configData }: BehanceData) => {
  return (
    <>
      <section className="concept" id="concept">
        <h2 className={`headingright ${joseFont} fs-600`}>UI/UX Concept</h2>
        <div className="behanceitems">
          {behance.map((project: BehanceProject, index: number) => {
            return (
              <BehanceCard key={index} project={project} config={configData} />
            );
          })}
        </div>
      </section>
    </>
  );
};

export default Behance;
