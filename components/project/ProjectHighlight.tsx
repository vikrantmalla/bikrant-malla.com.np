import Link from "next/link";
import { ProjectHighlightPageData, ProjectHighlights } from "../../types/data";
import ProjectCard from "./ProjectCard";

const ProjectHighlight = ({
  projectHighlightData,
}: ProjectHighlightPageData) => {
  return (
    <>
      <section className="project" id="project">
        <h1 className="headingleft ff-serif-jose fs-600">Projects</h1>
        <div className="projectItem">
          {projectHighlightData.projectHighlights.map(
            (project: ProjectHighlights, index: number) => {
              return <ProjectCard key={index} project={project} />;
            }
          )}
        </div>
        <Link href="/archive" passHref>
          <h1 className="link ff-serif-jose fs-400">View the Archive</h1>
        </Link>
      </section>
    </>
  );
};

export default ProjectHighlight;
