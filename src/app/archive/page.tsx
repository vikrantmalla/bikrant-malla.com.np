import ArchiveHeader from '@/components/archive/ArchiveHeader';
import ArchiveList from '@/components/archive/ArchiveList';
import { fetchProjectData } from '@/service/apiService';
import React from 'react'

const Archive = async () => {
  const projectData = await fetchProjectData();
  return (
    <>
      <section className="container">
        <ArchiveHeader />
        <div className="archive">
          <h1 className="heading ff-serif-teko fs-700">Archive</h1>
          <p className="subheading ff-serif-jose fs-600">
            A list of things I’ve worked on
          </p>
          <div className="archive-lists">
            <ArchiveList project={projectData} {...projectData} />
          </div>
        </div>
      </section>
    </>
  );
};

export default Archive