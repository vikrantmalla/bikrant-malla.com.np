import { GetServerSideProps } from "next";
import AboutMe from "../components/intro/AboutMe";
import ProjectHighlight from "../components/project/ProjectHighlight";
import Behance from "../components/behance/Behance";
import Contact from "../components/shared/footer/Contact";
import Data, { PageData } from "../types/data";
import { fetchProjectHighlights, fetchBehanceData, fetchMetaTagData } from "@/service/apiService";

const Home = ({
  projectHighlightData,
  behanceData,
  metaTagData
}: PageData.ProjectPageData) => {
  return (
    <>
      <main>
        <article className="container">
          <AboutMe />
          <ProjectHighlight projectHighlightData={projectHighlightData} />
          <Behance behanceData={behanceData} />
          <Contact />
        </article>
      </main>
    </>
  );
};

export const getServerSideProps: GetServerSideProps<{
  projectHighlightData: Data.ProjectHighlightData;
  behanceData: Data.BehanceData;
  metaTagData: Data.MetaTagData;
}> = async (context) => {
  const projectHighlightData = await fetchProjectHighlights();
  const behanceData = await fetchBehanceData();
  const metaTagData = await fetchMetaTagData();
  return {
    props: { projectHighlightData, behanceData, metaTagData },
  };
};

export default Home;
