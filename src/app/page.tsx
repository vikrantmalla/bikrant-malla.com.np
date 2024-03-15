import React from "react";
import AboutMe from "@/components/intro/AboutMe";
import Behance from "@/components/behance/Behance";
import Contact from "@/components/shared/footer/Contact";
import ProjectHighlight from "@/components/project/ProjectHighlight";
import { fetchPortfolioDetailsData } from "@/service/apiService";

const Home = async () => {
  const portfolioDetails = await fetchPortfolioDetailsData();
  const { aboutme, project, behance, contact } = portfolioDetails;
  return (
    <main>
      <article className="container">
        <AboutMe aboutme={aboutme} />
        <ProjectHighlight project={project} />
        <Behance behance={behance} />
        <Contact contact={contact} />
      </article>
    </main>
  );
};

export default Home;
