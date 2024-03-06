import { RootState } from "@/redux/store";
import { Project } from "../../types/data";
import { joseFont } from "@/helpers/lib/font";
import { FaGithub, FaLink } from "react-icons/fa";
import { useSelector } from "react-redux";
import Skeleton from "../shared/skeleton";
import TagsCategory from "@/types/enum";

const ArchiveDetails = ({
  id,
  year,
  title,
  isnew,
  build,
  projectview,
  viewcode,
}: Project) => {
  const selectedTag = useSelector(
    (state: RootState) => state.project.selectedTag
  );
  const showSkeletonLoading = useSelector(
    (state: RootState) => state.project.showSkeletonLoading
  );
  const tags = [...build];
  let formattedSelectedTag: string;

  if (
    selectedTag.toUpperCase() === TagsCategory.HTML ||
    selectedTag.toUpperCase() === TagsCategory.CSS ||
    selectedTag.toUpperCase() === TagsCategory.SCSS
  ) {
    formattedSelectedTag = selectedTag.toUpperCase();
  } else {
    const words = selectedTag.split("_"); // Split the tag by underscore if it contains any
    formattedSelectedTag = words
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }
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
                {isnew && selectedTag === TagsCategory.ALL ? (
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
                    formattedSelectedTag === tag
                      ? "tag-selected"
                      : "tag-not-selected"
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
