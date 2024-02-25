"use client";
import Link from "next/link";
import { ProjectHighlightPageData, ProjectHighlights } from "../../types/data";
import ProjectCard from "./ProjectCard";
import { joseFont } from "@/helpers/lib/font";

const ProjectHighlight = ({
  projectHighlightData,
}: ProjectHighlightPageData) => {
  return (
    <>
      <section className="project" id="project">
        <h2 className={`headingleft ${joseFont} fs-600`}>Projects</h2>
        <div className="projectItem">
          {projectHighlightData.projectHighlights.map(
            (project: ProjectHighlights, index: number) => {
              return <ProjectCard key={index} project={project} />;
            }
          )}
        </div>
        <Link href="/archive" passHref>
          <h1 className={`link ${joseFont} fs-400`}>View the Archive</h1>
        </Link>
      </section>
    </>
  );
};

export default ProjectHighlight;
