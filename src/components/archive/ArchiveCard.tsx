import { ArchiveDetailsData } from "../../types/data";
import { joseFont } from "@/helpers/lib/font";
import { FaGithub, FaLink } from "react-icons/fa";
import { addKeyword } from "@/redux/feature/projectSlice";
import * as gtag from "../../helpers/lib/gtag"
import { store } from "@/redux/store";

const ArchiveDetails = ({
  id,
  year,
  title,
  isnew,
  build,
  projectview,
  viewcode,
}: ArchiveDetailsData) => {
  const AddKeyword = (keyword: string) => {
    const newKeyword= keyword.toLowerCase().replace(/\s+/g, '_');
    store.dispatch(addKeyword(keyword));
    gtag.event({
      action: `${newKeyword}`,
      category: "keyword_filtering",
      label: "keyword_list_update",
    });
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  const tags = [...build];
  return (
    <>
      <div className={`${isnew ? "project active" : "project"}`} key={id}>
        <div className="project-head">
          <div className="details">
            <div className="title">
              <h1 className={`${joseFont} fs-400`}>{title}</h1>
              {isnew && <span className={`new ${joseFont}`}>{`NEW!`}</span>}
            </div>
            <p className={`${joseFont} fs-300`}>{year}</p>
          </div>
          <div className="links">
            <a href={viewcode}>
              <FaGithub />
            </a>
            <a href={projectview}>
              <FaLink />
            </a>
          </div>
        </div>
        <div className="tag">
          {tags.map((tag, id) => {
            return (
              <span
                className={`${joseFont} fs-300`}
                key={id}
                onClick={() => AddKeyword(tag)}
              >
                {tag}{" "}
              </span>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default ArchiveDetails;
