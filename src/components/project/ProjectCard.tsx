import Image from "next/image";
import { FaChevronRight } from "react-icons/fa";
import { joseFont } from "@/helpers/lib/font";
import { CldImage } from "next-cloudinary";
import { useMouseStore } from "@/store/feature/mouseStore";
import { ProjectHighlightsCard } from "@/types/data";
import ExternalLink from "../shared/externalLink";

const ProjectCard = ({ project, config }: ProjectHighlightsCard) => {
  const { images, imageUrl, alt, title, build, projectview } = project;
  const { allowBackupImages } = config;
  const { setCursorType } = useMouseStore();

  const cursorChangeHandler = (cursorType: string) => {
    setCursorType(cursorType);
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
            {allowBackupImages ? (
              <CldImage
                width="500"
                height="800"
                src={`${imageUrl}`}
                alt={alt}
                priority={false}
              />
            ) : (
              <Image
                src={`/${images}`}
                alt={alt}
                width={500}
                height={500}
                className="responsive-image"
              />
            )}
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
