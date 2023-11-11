import React from 'react'
import AboutMe from '@/components/intro/AboutMe'
import Behance from '@/components/behance/Behance';
import { fetchAboutMeData, fetchBehanceData } from '@/service/apiService';

const Home = async () => {
  const aboutMeData = await fetchAboutMeData();
  const behanceData = await fetchBehanceData();
  return (
    <main>
      <article className="container">
        <AboutMe aboutMeData={aboutMeData} />
        <Behance behanceData={behanceData} />
      </article>
    </main>
  )
}

export default Home