import Head from "next/head";
import { GetServerSideProps } from "next";
import NavBar from "../components/shared/header/NavBar";
import AboutMe from "../components/intro/AboutMe";
import ProjectHighlight from "../components/project/ProjectHighlight";
import Behance from "../components/behance/Behance";
import Contact from "../components/shared/footer/Contact";
import Data, { PageData } from "../types/data";
import { fetchProjectHighlights, fetchBehanceData } from '@/service/apiService';

const Home = ({
  projectHighlightData,
  behanceData,
}: PageData.ProjectPageData) => {
  return (
    <>
      <NavBar />
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
}> = async (context) => {
  const projectHighlightData = await fetchProjectHighlights();
  const behanceData = await fetchBehanceData();
  return {
    props: { projectHighlightData, behanceData },
  };
};

export default Home;
