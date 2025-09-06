import React from "react";
import AboutMe from "@/components/intro/AboutMe";
import Behance from "@/components/behance/Behance";
import Contact from "@/components/shared/footer/Contact";
import ProjectHighlight from "@/components/project/ProjectHighlight";
import { fetchPortfolioDetailsData } from "@/service/apiService";
import { Project } from "@/types/data";
import { Platform } from "@/types/enum";

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';

const Home = async () => {
  let portfolioDetail;
  try {
    portfolioDetail = await fetchPortfolioDetailsData();
  } catch (error) {
    console.error("Error fetching portfolio data in Home:", error);
    // Return empty portfolio structure if database fails
    portfolioDetail = {
      id: null,
      name: "",
      jobTitle: "",
      aboutDescription1: "",
      aboutDescription2: "",
      skills: [],
      email: "",
      ownerEmail: "",
      linkedIn: "",
      gitHub: "",
      facebook: "",
      instagram: "",
      projects: [],
      archiveProjects: [],
      userRoles: []
    };
  }
  const aboutme = {
    title: portfolioDetail.name,
    subTitle: portfolioDetail.jobTitle,
    aboutDescription1: portfolioDetail.aboutDescription1,
    aboutDescription2: portfolioDetail.aboutDescription2,
    skills: portfolioDetail.skills,
  };
  const contact = {
    email: portfolioDetail.email,
    linkedIn: portfolioDetail.linkedIn,
    gitHub: portfolioDetail.gitHub,
    facebook: portfolioDetail.facebook,
    instagram: portfolioDetail.instagram,
  };
  const behance = portfolioDetail.projects.filter(
    (project: Project) => project.platform === Platform.Design
  );
  const projecthighlight = portfolioDetail.projects.filter(
    (project: Project) => project.platform === Platform.Web
  );
  return (
    <main>
      <article className="container">
        <AboutMe aboutme={aboutme} />
        {projecthighlight.length > 0 && (
          <ProjectHighlight projects={projecthighlight} />
        )}
        {behance.length > 0 && <Behance projects={behance} />}
        <Contact contact={contact} />
      </article>
    </main>
  );
};

export default Home;
