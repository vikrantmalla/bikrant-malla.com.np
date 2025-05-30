import ArchiveFilterMenu from '@/components/archive/ArchiveFilterMenu';
import ArchiveList from '@/components/archive/ArchiveList';
import { joseFont, tekoFont } from '@/helpers/lib/font';
import { fetchProjectData } from '@/service/apiService';
import React from 'react'

export async function generateMetadata() {
  const projectData = await fetchProjectData();
  const { metaData } = projectData;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  const appTitle = "Archive - Bikrant Malla";
  return {
    metadataBase: new URL(`${appUrl}`),
    title: appTitle,
    authors: [{ name: `${metaData[0].author}`, url: `${appUrl}/archive` }],
    openGraph: {
      title: appTitle,
      authors: [{ name: `${metaData[0].author}`, url: `${appUrl}/archive` }],
    },
    twitter: {
      title: appTitle,
    },
    alternates: {
      canonical: "/archive",
    }
  };
}



const Archive = async () => {
  const projectData = await fetchProjectData();
  const {archiveProject, techTag} = projectData;
  return (
    <>
      <section className="container">
        <div className="archive">
          <h1 className={`heading ${tekoFont} fs-700`}>Archive</h1>
          <p className={`subheading ${joseFont} fs-600`}>
            A list of things I’ve worked on
          </p>
          <div>
            <ArchiveFilterMenu project= {archiveProject} techTag={techTag}/>
          </div>
          <div className="archive-lists">
            <ArchiveList />
          </div>
        </div>
      </section>
    </>
  );
};

export default Archive