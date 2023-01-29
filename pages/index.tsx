import Head from "next/head";
import { GetServerSideProps } from "next";
import NavBar from "../components/shared/header/NavBar";
import AboutMe from "../components/intro/AboutMe";
import ProjectHighlight from "../components/project/ProjectHighlight";
import Behance from "../components/behance/Behance";
import Contact from "../components/shared/footer/Contact";
import baseUrl from "../helpers/lib/baseUrl";
import Data, { PageData } from "../types/data";

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
  const res1 = await fetch(`${baseUrl}/api/projecthighlights`);
  const res2 = await fetch(`${baseUrl}/api/behance`);
  const projectHighlightData = await res1.json();
  const behanceData = await res2.json();

  return {
    props: { projectHighlightData, behanceData },
  };
};

export default Home;
