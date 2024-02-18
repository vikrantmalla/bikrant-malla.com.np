import ArchiveFilterMenu from '@/components/archive/ArchiveFilterMenu';
import ArchiveHeader from '@/components/archive/ArchiveHeader';
import ArchiveList from '@/components/archive/ArchiveList';
import { joseFont, tekoFont } from '@/helpers/lib/font';
import { fetchProjectData } from '@/service/apiService';
import React from 'react'

export async function generateMetadata() {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  return {
    metadataBase: new URL(`${appUrl}`),
    title: "Archive - Bikrant Malla",
    authors: [{ name: "Bikrant Malla", url: `${appUrl}/archive` }],
    openGraph: {
      title: "Archive - Bikrant Malla",
      authors: [{ name: "Bikrant Malla", url: `${appUrl}/archive` }],
    },
    twitter: {
      title: "Archive - Bikrant Malla",
    },
    alternates: {
      canonical: "/archive",
    }
  };
}



const Archive = async () => {
  const projectData = await fetchProjectData();
  console.log(projectData)
  return (
    <>
      <section className="container">
        <ArchiveHeader />
        <div className="archive">
          <h1 className={`heading ${tekoFont} fs-700`}>Archive</h1>
          <p className={`subheading ${joseFont} fs-600`}>
            A list of things I’ve worked on
          </p>
          <div>
            <ArchiveFilterMenu project={projectData} {...projectData}/>
          </div>
          <div className="archive-lists">
            <ArchiveList project={projectData} {...projectData} />
          </div>
        </div>
      </section>
    </>
  );
};

export default Archive