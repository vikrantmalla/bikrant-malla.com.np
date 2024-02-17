import React from 'react'
import AboutMe from '@/components/intro/AboutMe'
import Behance from '@/components/behance/Behance';
import Contact from '@/components/shared/footer/Contact';
import ProjectHighlight from '@/components/project/ProjectHighlight';
import { fetchAboutMeData, fetchBehanceData, fetchContactData, fetchProjectHighlights } from '@/service/apiService';

const Home = async () => {
  const aboutMeData = await fetchAboutMeData();
  const projectHighlightData = await fetchProjectHighlights();
  const behanceData = await fetchBehanceData();
  const contactData = await fetchContactData();
  return (
    <main>
      <article className="container">
        <AboutMe aboutMeData={aboutMeData} />
        <ProjectHighlight projectHighlightData={projectHighlightData} />
        <Behance behanceData={behanceData} />
        <Contact contactData={contactData} />
      </article>
    </main>
  )
}

export default Home