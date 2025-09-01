"use client";
import Image from "next/image";
import { ProjectHighlightsCard } from "../../types/data";
import { FaChevronRight } from "react-icons/fa";
import { joseFont } from "@/helpers/lib/font";
import ExternalLink from "../shared/externalLink";
import { CldImage } from "next-cloudinary";
import { useMouseStore } from "@/store/feature/mouseStore";

const BehanceCard = ({ project }: ProjectHighlightsCard) => {
  const { id, images, alt, title, subTitle, tools, projectView } = project;
  const { setCursorType } = useMouseStore();

  const cursorChangeHandler = (cursorType: string) => {
    setCursorType(cursorType);
  };

  return (
    <div className="card" key={id}>
      <div className="card-img">
        <div
          className="image-wrapper"
          onMouseEnter={() => cursorChangeHandler("hovered")}
          onMouseLeave={() => cursorChangeHandler("")}
        >
          <ExternalLink
            href={projectView}
            label={`${title} design (opens in a new tab)`}
            gtagAction="behance_project_image_clicked"
            gtagCategory="image_interaction"
            gtagLabel="click_through_link"
          >
            <Image
              src={images}
              alt={alt}
              width={500}
              height={800}
              priority={false}
              className="w-full h-auto"
            />
          </ExternalLink>
        </div>
      </div>
      <div className="card-details">
        <div className="card-head">
          <h2 className={`${joseFont} fs-400`}>
            {title}{" "}
            {subTitle && (
              <span className={`${joseFont} fs-300`}>{subTitle}</span>
            )}
          </h2>
          <p className={`${joseFont} fs-300`}>{tools.join(", ")}</p>
        </div>
        <div className="card-body">
          <div
            onMouseEnter={() => cursorChangeHandler("hovered")}
            onMouseLeave={() => cursorChangeHandler("")}
          >
            <ExternalLink
              href={projectView}
              label={`${title} design (opens in a new tab)`}
              gtagAction="behance_project_clicked"
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

export default BehanceCard;
