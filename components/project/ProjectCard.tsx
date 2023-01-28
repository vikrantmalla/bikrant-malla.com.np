/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { useMouseCursor } from "../../context/MouseContext";
import { ProjectHighlightsCard } from "../../types/data";

const ProjectCard = ({ project }: ProjectHighlightsCard) => {
  const { images, alt, title, build, projectview } = project;
  const { cursorChangeHandler } = useMouseCursor();
  return (
    <div className="card">
      <div className="card-img">
        <div
          onMouseEnter={() => cursorChangeHandler("hovered")}
          onMouseLeave={() => cursorChangeHandler("")}
        >
          <Link href={projectview} passHref>
            <img src={images} alt={alt} />
          </Link>
        </div>
      </div>
      <div className="card-details">
        <div className="card-head">
          <h1 className="ff-serif-jose fs-400">{title}</h1>
          <p className="ff-serif-jose fs-300">{build}</p>
        </div>
        <div className="card-body">
          <div
            onMouseEnter={() => cursorChangeHandler("hovered")}
            onMouseLeave={() => cursorChangeHandler("")}
          >
            <Link href={projectview} passHref>
              <i className="fas fa-chevron-right" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
