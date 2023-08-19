import { GetServerSideProps } from "next";
import AboutMe from "../components/intro/AboutMe";
import ProjectHighlight from "../components/project/ProjectHighlight";
import Behance from "../components/behance/Behance";
import Contact from "../components/shared/footer/Contact";
import Data, { PageData } from "../types/data";
import { fetchProjectHighlights, fetchBehanceData, fetchAboutMeData, fetchContactData } from "@/service/apiService";

const Home = ({
  aboutMeData,
  projectHighlightData,
  behanceData,
  contactData
}: PageData.ProjectPageData) => {
  return (
    <>
      <main>
        <article className="container">
          <AboutMe aboutMeData={aboutMeData}/>
          <ProjectHighlight projectHighlightData={projectHighlightData} />
          <Behance behanceData={behanceData} />
          <Contact contactData={contactData}/>
        </article>
      </main>
    </>
  );
};

export const getServerSideProps: GetServerSideProps<{
  projectHighlightData: Data.ProjectHighlightData;
  behanceData: Data.BehanceData;
  aboutMeData: Data.AboutMeData
  contactData: Data.ContactData
}> = async (context) => {
  const aboutMeData = await fetchAboutMeData();
  const projectHighlightData = await fetchProjectHighlights();
  const behanceData = await fetchBehanceData();
  const contactData = await fetchContactData();
  return {
    props: { aboutMeData, projectHighlightData, behanceData, contactData  },
  };
};

export default Home;
