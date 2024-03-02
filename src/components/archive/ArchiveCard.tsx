import { RootState } from "@/redux/store";
import { Project } from "../../types/data";
import { joseFont } from "@/helpers/lib/font";
import { useSearchParams } from "next/navigation";
import { FaGithub, FaLink } from "react-icons/fa";
import { useSelector } from "react-redux";
import Skeleton from "../shared/skeleton";

const ArchiveDetails = ({
  id,
  year,
  title,
  isnew,
  build,
  projectview,
  viewcode,
}: Project) => {
  const showSkeletonLoading = useSelector(
    (state: RootState) => state.project.showSkeletonLoading
  );
  const tags = [...build];
  const search = useSearchParams();
  const initialTagFromUrl = search.get("tag") || "All";
  // Replace underscores with spaces in the tag
  const formattedTag = initialTagFromUrl.replace(/_/g, " ");
  /*
   * Reorder the tag according to the formattedTag
   */
  // const reorderedTags = formattedTag !== "All"
  // ? (formattedTag !== "Feature"
  //     ? [formattedTag, ...tags.filter(tag => tag !== formattedTag)]
  //     : tags.filter(tag => tag !== "Feature"))
  // : tags;

  return (
    <>
      {!showSkeletonLoading ? (
        <div className={`${isnew ? "project active" : "project"}`} key={id}>
          <div className="project-head">
            <div className="details">
              <div className="title">
                <h2 className={`${joseFont} fs-400`}>{title}</h2>
                {isnew && initialTagFromUrl === "All" ? (
                  <span className={`new ${joseFont}`}>{`NEW!`}</span>
                ) : (
                  ""
                )}
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
                  className={`${joseFont} ${
                    formattedTag === tag ? "tag-selected" : "tag-not-selected"
                  }  fs-300`}
                  key={id}
                >
                  {tag}
                </span>
              );
            })}
          </div>
        </div>
      ) : (
        <Skeleton />
      )}
    </>
  );
};

export default ArchiveDetails;
