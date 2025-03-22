"use client";
import Image from "next/image";
import { BehanceCard as BehanceCardDataType } from "../../types/data";
import { FaChevronRight } from "react-icons/fa";
import { joseFont } from "@/helpers/lib/font";
import ExternalLink from "../shared/externalLink";
import { CldImage } from "next-cloudinary";
import { useMouseStore } from "@/store/feature/mouseStore";

const BehanceCard = ({ project, config }: BehanceCardDataType) => {
  const { id, images, imageUrl, alt, title, subTitle, tools, projectview } =
    project;
  const { allowBackupImages } = config;
  const { setCursorType } = useMouseStore();

  const cursorChangeHandler = (cursorType: string) => {
    setCursorType(cursorType)
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
            href={projectview}
            label={`${title} design (opens in a new tab)`}
            gtagAction="behance_project_image_clicked"
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
          <h2 className={`${joseFont} fs-400`}>
            {title} <span className={`${joseFont} fs-300`}>{subTitle}</span>
          </h2>
          <p className={`${joseFont} fs-300`}>{tools}</p>
        </div>
        <div className="card-body">
          <div
            onMouseEnter={() => cursorChangeHandler("hovered")}
            onMouseLeave={() => cursorChangeHandler("")}
          >
            <ExternalLink
              href={projectview}
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
