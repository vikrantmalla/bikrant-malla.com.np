import React from "react";
// import AboutMe from "@/components/intro/AboutMe";
// import Behance from "@/components/behance/Behance";
// import Contact from "@/components/shared/footer/Contact";
// import ProjectHighlight from "@/components/project/ProjectHighlight";
// import { fetchPortfolioDetailsData } from "@/service/apiService";
import Link from "next/link";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

const Home = async () => {
  // const portfolioDetails = await fetchPortfolioDetailsData();
  // const { config, aboutme, projecthighlight, behance, contact } = portfolioDetails;
  // const configData = config[0];
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  console.log(process.env.PORTFOLIO_OWNER_EMAIL);
  return (
    <main>
      <article className="container">
        <h1>hello</h1>
        {/* <AboutMe aboutme={aboutme} />
        <ProjectHighlight project={projecthighlight} configData={configData} />
        <Behance behance={behance} configData={configData}/>
        <Contact contact={contact} /> */}
      </article>
    </main>
  );
};

export default Home;
