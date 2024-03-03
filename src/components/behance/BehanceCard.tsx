"use client";
import Image from "next/image";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { BehanceCard } from "../../types/data";
import { FaChevronRight } from "react-icons/fa";
import { joseFont } from "@/helpers/lib/font";
import { setCursorType } from "@/redux/feature/mouseSlice";
import ExternalLink from "../shared/externalLink";

const BehanceCard = ({ project }: BehanceCard) => {
  const { id, images, alt, title, subTitle, tools, projectview } = project;
  const dispatch = useDispatch<AppDispatch>();

  const cursorChangeHandler = (cursorType: React.SetStateAction<string>) => {
    dispatch(setCursorType(cursorType));
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
            <Image
              src={`/${images}`}
              alt={alt}
              width={500}
              height={500}
              className="responsive-image"
            />
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
