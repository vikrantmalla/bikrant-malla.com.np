import { ArchiveProject } from "@/types/data";
import { joseFont } from "@/helpers/lib/font";
import { FaGithub, FaLink } from "react-icons/fa";
import Skeleton from "../shared/skeleton";
import { TagsCategory } from "@/types/enum";
import { useProjectStore } from "@/store/feature/projectStore";

const ArchiveDetails = ({
  id,
  year,
  title,
  isNew,
  build,
  projectView,
  viewCode,
}: ArchiveProject) => {
  const { selectedTag, showSkeletonLoading } = useProjectStore();
  
  // Format the selected tag for comparison (matches the filter logic)
  const formatSelectedTag = (tag: string): string => {
    if (
      tag.toUpperCase() === TagsCategory.HTML ||
      tag.toUpperCase() === TagsCategory.CSS ||
      tag.toUpperCase() === TagsCategory.SCSS
    ) {
      return tag.toUpperCase();
    }
    
    const words = tag.split("_");
    return words
      .map((word) => {
        // Special case for JS to ensure it's uppercase
        if (word.toLowerCase() === 'js') {
          return 'JS';
        }
        return word.charAt(0).toUpperCase() + word.slice(1);
      })
      .join(" ");
  };

  const formattedSelectedTag = formatSelectedTag(selectedTag);

  return (
    <>
      {!showSkeletonLoading ? (
        <div className={`${isNew ? "project active" : "project"}`} key={id}>
          <div className="project-head">
            <div className="details">
              <div className="title">
                <h2 className={`${joseFont} fs-400`}>{title}</h2>
                {isNew && selectedTag === TagsCategory.ALL ? (
                  <span className={`new ${joseFont}`}>{`NEW!`}</span>
                ) : (
                  ""
                )}
              </div>
              <p className={`${joseFont} fs-300`}>{year}</p>
            </div>
            <div className="links">
              <a href={viewCode}>
                <FaGithub />
              </a>
              <a href={projectView}>
                <FaLink />
              </a>
            </div>
          </div>
          <div className="tag">
            {build.map((tag, index) => (
              <span 
                className={`${joseFont} fs-300`} 
                key={`${id}-tag-${index}`}
                data-testid={`project-tag-${tag.toLowerCase().replace(/\s+/g, '-')}`}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      ) : (
        <Skeleton />
      )}
    </>
  );
};

export default ArchiveDetails;
