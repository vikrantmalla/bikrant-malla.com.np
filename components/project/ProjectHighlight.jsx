import Link from "next/link";
import ProjectCard from "./ProjectCard";

const ProjectHighlight = ({ projectData }) => {
  return (
    <>
      <section className="project" id="project">
        <h1 className="headingleft ff-serif-jose fs-600">Projects</h1>
        <div className="projectItem">
          {projectData.project.map((project, index) => {
            return <ProjectCard key={index} project={project} />;
          })}
        </div>
        <Link href="/archive" passHref>
          <h1 className="link ff-serif-jose fs-400">
            <a>View the Archive</a>
          </h1>
        </Link>
      </section>
    </>
  );
};

export default ProjectHighlight;
