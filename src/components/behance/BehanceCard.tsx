"use client";
/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import Image from "next/image";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { BehanceCard } from "../../types/data";
import { FaChevronRight } from "react-icons/fa";
import { joseFont } from "@/helpers/lib/font";
import { setCursorType } from "@/redux/feature/mouseSlice";
import * as gtag from "../../helpers/lib/gtag";
const BehanceCard = ({ project }: BehanceCard) => {
  const { id, images, alt, title, subTitle, tools, projectview } = project;
  const dispatch = useDispatch<AppDispatch>();
  const handleClick = () => {
    gtag.event({
      action: "behance_project_clicked",
      category: "engagement",
      label: "method",
    });
  };

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
          <Link href={projectview} passHref>
            <img
              loading="lazy"
              src={images}
              alt={alt}
              className="responsive-image"
            />
          </Link>
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
            <a href={projectview} onClick={handleClick} aria-label="arrow">
              <FaChevronRight size={20} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BehanceCard;
