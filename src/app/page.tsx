import React from "react";
import AboutMe from "@/components/intro/AboutMe";
import Behance from "@/components/behance/Behance";
import Contact from "@/components/shared/footer/Contact";
import ProjectHighlight from "@/components/project/ProjectHighlight";
import { fetchPortfolioDetailsData } from "@/service/apiService";
import { Project } from "@/types/data";

const Home = async () => {
  const portfolioDetail = await fetchPortfolioDetailsData();
  const aboutme = {
    title: portfolioDetail.name,
    subTitle: portfolioDetail.jobTitle,
    aboutDescription1: portfolioDetail.aboutDescription1,
    aboutDescription2: portfolioDetail.aboutDescription2,
  };
  const contact = {
    email: portfolioDetail.email,
    linkedIn: portfolioDetail.linkedIn,
    gitHub: portfolioDetail.gitHub,
    facebook: portfolioDetail.facebook,
    instagram: portfolioDetail.instagram,
  };
  const behance = portfolioDetail.projects.filter(
    (project: Project) => project.platform === "Design"
  );
  const projecthighlight = portfolioDetail.projects.filter(
    (project: Project) => project.platform === "Web"
  );
  const configData = { allowBackupImages: false };
  return (
    <main>
      <article className="container">
        <AboutMe aboutme={aboutme} />
        <ProjectHighlight project={projecthighlight} configData={configData} />
        <Behance behance={behance} configData={configData} />
        <Contact contact={contact} />
      </article>
    </main>
  );
};

export default Home;
