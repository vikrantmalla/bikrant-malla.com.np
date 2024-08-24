"use client";
import Link from "next/link";
import { Project, ProjectHighlightData } from "../../types/data";
import ProjectCard from "./ProjectCard";
import { joseFont } from "@/helpers/lib/font";

const ProjectHighlight = ({ project, configData }: ProjectHighlightData) => {
  return (
    <>
      <section className="project" id="project">
        <h2 className={`headingleft ${joseFont} fs-600`}>Projects</h2>
        <div className="projectItem">
          {project.map((project: Project, index: number) => {
            return (
              <ProjectCard key={index} project={project} config={configData} />
            );
          })}
        </div>
        <Link href="/archive" passHref aria-label="View Full Project Archive">
          <h1 className={`link ${joseFont} fs-400`}>View the Archive</h1>
        </Link>
      </section>
    </>
  );
};

export default ProjectHighlight;
