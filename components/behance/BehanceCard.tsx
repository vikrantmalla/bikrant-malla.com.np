/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import Image from "next/image";
import { useMouseCursor } from "../../context/MouseContext";
import { BehanceCard } from "../../types/data";
import * as gtag from "../../helpers/lib/gtag";
import { FaChevronRight } from "react-icons/fa";
const BehanceCard = ({ project }: BehanceCard) => {
  const { id, images, alt, title, subTitle, tools, projectview } = project;
  const { cursorChangeHandler } = useMouseCursor();
  const handleClick = () => {
    gtag.event({
      action: "behance_project_clicked",
      category: "engagement",
      label: "method",
    });
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
            <img loading="lazy" src={images} alt={alt} className="responsive-image" />
          </Link>
        </div>
      </div>
      <div className="card-details">
        <div className="card-head">
          <h1 className="ff-serif-jose fs-400">
            {title} <span className="ff-serif-jose fs-300">{subTitle}</span>
          </h1>
          <p className="ff-serif-jose fs-300">{tools}</p>
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

export default BehanceCard;
