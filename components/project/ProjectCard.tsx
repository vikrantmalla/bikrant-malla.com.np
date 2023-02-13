import Link from "next/link";
import Image from "next/image";
import { useMouseCursor } from "../../context/MouseContext";
import { ProjectHighlightsCard } from "../../types/data";
import * as gtag from "../../helpers/lib/gtag";
import baseUrl from "@/helpers/lib/baseUrl";

const ProjectCard = ({ project }: ProjectHighlightsCard) => {
  const { images, alt, title, build, projectview } = project;
  const { cursorChangeHandler } = useMouseCursor();
  const handleClick = () => {
    gtag.event({
      action: 'project_highlight_clicked',
      category: 'engagement',
      label: 'method'
    })
  }
  return (
    <div className="card">
      <div className="card-img">
        <div
          onMouseEnter={() => cursorChangeHandler("hovered")}
          onMouseLeave={() => cursorChangeHandler("")}
        >
          <Link href={projectview} passHref>
            <Image src={`${baseUrl}/${images} `} alt={alt} width={300} height={250}/>
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
            <Link href={projectview} passHref onClick={handleClick} aria-label="arrow">
              <i className="fas fa-chevron-right" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
