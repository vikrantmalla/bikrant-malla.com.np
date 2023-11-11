import React from 'react'
import AboutMe from '@/components/intro/AboutMe'
import { fetchAboutMeData } from '@/service/apiService';

const Home = async () => {
  const aboutMeData = await fetchAboutMeData();
  return (
    <main>
      <article className="container">
        <AboutMe aboutMeData={aboutMeData} />
      </article>
    </main>
  )
}

export default Home