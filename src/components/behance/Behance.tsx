import React from "react";
import {
  BehanceProject,
  Project,
  ProjectHighlightData,
} from "../../types/data";
import BehanceCard from "./BehanceCard";
import { joseFont } from "@/helpers/lib/font";

const Behance = ({ projects }: ProjectHighlightData) => {
  return (
    <>
      <section className="concept" id="concept">
        <h2 className={`headingright ${joseFont} fs-600`}>UI/UX Concept</h2>
        <div className="behanceitems">
          {projects.map((project: Project, index: number) => {
            return <BehanceCard key={index} project={project} />;
          })}
        </div>
      </section>
    </>
  );
};

export default Behance;
