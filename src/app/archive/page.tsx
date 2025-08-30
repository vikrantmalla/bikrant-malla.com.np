import ArchiveFilterMenu from "@/components/archive/ArchiveFilterMenu";
import ArchiveList from "@/components/archive/ArchiveList";
import ArchiveStoreProvider from "@/components/archive/ArchiveStoreProvider";
import { joseFont, tekoFont } from "@/helpers/lib/font";
import {
  fetchPortfolioDetailsData,
  fetchTagData,
} from "@/service/apiService";
import React from "react";

export async function generateMetadata() {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  const appTitle = "Archive - Bikrant Malla";
  return {
    metadataBase: new URL(`${appUrl}`),
    title: appTitle,
    authors: [{ name: "Bikrant Malla", url: `${appUrl}/archive` }],
    openGraph: {
      title: appTitle,
      authors: [{ name: "Bikrant Malla", url: `${appUrl}/archive` }],
    },
    twitter: {
      title: appTitle,
    },
    alternates: {
      canonical: "/archive",
    },
  };
}

const Archive = async () => {
  const [portfolioData, techTagData] = await Promise.all([
    fetchPortfolioDetailsData(),
    fetchTagData()
  ]);

  // Extract the data with proper error handling
  const archiveProjects = portfolioData?.archiveProjects || [];
  const techTags = techTagData?.techTags || [];

  return (
    <>
      <section className="container">
        <div className="archive">
          <h1 className={`heading ${tekoFont} fs-700`}>Archive</h1>
          <p className={`subheading ${joseFont} fs-600`}>
            A list of things I&apos;ve worked on
          </p>
          <ArchiveStoreProvider archiveProjects={archiveProjects}>
            <div>
              <ArchiveFilterMenu project={archiveProjects} techTag={techTags} />
            </div>
            <div className="archive-lists">
              <ArchiveList archiveProjects={archiveProjects} />
            </div>
          </ArchiveStoreProvider>
        </div>
      </section>
    </>
  );
};

export default Archive;
