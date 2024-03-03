/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import Image from "next/image";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { FaChevronRight } from "react-icons/fa";
import { joseFont } from "@/helpers/lib/font";
import { ProjectHighlightsCard } from "../../types/data";
import { setCursorType } from "@/redux/feature/mouseSlice";
import ExternalLink from "../shared/externalLink";

const ProjectCard = ({ project }: ProjectHighlightsCard) => {
  const { images, alt, title, build, projectview } = project;
  const dispatch = useDispatch<AppDispatch>();

  const cursorChangeHandler = (cursorType: React.SetStateAction<string>) => {
    dispatch(setCursorType(cursorType));
  };

  return (
    <div className="card">
      <div className="card-img">
        <div
          className="image-wrapper"
          onMouseEnter={() => cursorChangeHandler("hovered")}
          onMouseLeave={() => cursorChangeHandler("")}
        >
          <ExternalLink
            href={projectview}
            label={`${title} project (opens in a new tab)`}
            gtagAction="project_highlight_image_clicked"
            gtagCategory="image_interaction"
            gtagLabel="click_through_link"
          >
            <img
              loading="lazy"
              src={images}
              alt={alt}
              className="responsive-image"
            />
          </ExternalLink>
        </div>
      </div>
      <div className="card-details">
        <div className="card-head">
          <h2 className={`${joseFont} fs-400`}>{title}</h2>
          <p className={`${joseFont} fs-300`}>{build}</p>
        </div>
        <div className="card-body">
          <div
            onMouseEnter={() => cursorChangeHandler("hovered")}
            onMouseLeave={() => cursorChangeHandler("")}
          >
            <ExternalLink
              href={projectview}
              label={`${title} project (opens in a new tab)`}
              gtagAction="project_highlight_clicked"
              gtagCategory="project_interaction"
              gtagLabel="click_through_button"
            >
              <FaChevronRight size={20} />
            </ExternalLink>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
