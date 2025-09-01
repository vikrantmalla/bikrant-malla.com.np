"use client";
import Link from "next/link";
import { Project, ProjectHighlightData } from "../../types/data";
import ProjectCard from "./ProjectCard";
import { joseFont } from "@/helpers/lib/font";

const ProjectHighlight = ({ projects }: ProjectHighlightData) => {
  return (
    <>
      <section className="project" id="project">
        <h2 className={`headingleft ${joseFont} fs-600`}>Projects</h2>
        <div className="projectItem">
          {projects.map((project: Project, index: number) => {
            return (
              <ProjectCard key={index} project={project} />
            );
          })}
        </div>
        <Link href="/archive" passHref aria-label="View Full Project Archive">
          <h2 className={`link ${joseFont} fs-400`}>View the Archive</h2>
        </Link>
      </section>
    </>
  );
};

export default ProjectHighlight;
