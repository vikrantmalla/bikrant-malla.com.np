/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import Image from "next/image";
import { useMouseCursor } from "../../context/MouseContext";
import { ProjectHighlightsCard } from "../../types/data";
import * as gtag from "../../helpers/lib/gtag";
import baseUrl from "@/helpers/lib/baseUrl";
import { FaChevronRight } from "react-icons/fa";

const ProjectCard = ({ project }: ProjectHighlightsCard) => {
  const { images, alt, title, build, projectview } = project;
  const { cursorChangeHandler } = useMouseCursor();
  const handleClick = () => {
    gtag.event({
      action: "project_highlight_clicked",
      category: "engagement",
      label: "method",
    });
  };
  return (
    <div className="card">
      <div className="card-img">
        <div
          className="image-wrapper"
          onMouseEnter={() => cursorChangeHandler("hovered")}
          onMouseLeave={() => cursorChangeHandler("")}
        >
          <Link href={projectview} passHref>
            <img loading="lazy" src={images} alt={alt} className="responsive-image" />
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
            <a
              href={projectview}
              onClick={handleClick}
              aria-label="arrow"
            >
              <FaChevronRight size={20} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
