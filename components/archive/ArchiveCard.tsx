import Link from "next/link";
import { useProjectData } from "../../context/ProjectContext";
import { ArchiveDetailsData } from "../../types/data";

const ArchiveDetails = ({
  id,
  year,
  title,
  isnew,
  build,
  projectview,
  viewcode,
}: ArchiveDetailsData) => {
  const { AddKeyword } = useProjectData();
  const tags = [...build];
  return (
    <>
      <div className={`${isnew ? "project active" : "project"}`} key={id}>
        <div className="project-head">
          <div className="details">
            <div className="title">
              <h1 className="ff-serif-jose fs-400">{title}</h1>
              {isnew && <span className="new ff-serif-jose">{`NEW!`}</span>}
            </div>
            <p className="ff-serif-jose fs-300">{year}</p>
          </div>
          <div className="links">
            <Link href={viewcode} passHref>
              <i className="fab fa-github" />
            </Link>
            <Link href={projectview} passHref>
              <i className="fas fa-external-link-alt" />
            </Link>
          </div>
        </div>
        <div className="tag">
          {tags.map((tag, id) => {
            return (
              <span
                className="ff-serif-jose fs-300"
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
