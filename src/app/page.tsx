import React from 'react'
import AboutMe from '@/components/intro/AboutMe'
import Behance from '@/components/behance/Behance';
import ProjectHighlight from '@/components/project/ProjectHighlight';
import { fetchAboutMeData, fetchBehanceData, fetchProjectHighlights } from '@/service/apiService';

const Home = async () => {
  const aboutMeData = await fetchAboutMeData();
  const projectHighlightData = await fetchProjectHighlights();
  const behanceData = await fetchBehanceData();
  return (
    <main>
      <article className="container">
        <AboutMe aboutMeData={aboutMeData} />
        <ProjectHighlight projectHighlightData={projectHighlightData} />
        <Behance behanceData={behanceData} />
      </article>
    </main>
  )
}

export default Home