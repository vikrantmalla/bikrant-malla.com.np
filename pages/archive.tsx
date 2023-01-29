import Head from "next/head";
import { GetServerSideProps } from "next";
import ArchiveHeader from "../components/archive/ArchiveHeader";
import baseUrl from "../helpers/lib/baseUrl";
import ArchiveList from "../components/archive/ArchiveList";
import Data, { PageData } from "../types/data";

const Archive = ({ projectData }: PageData.ArchivePageData) => {
  return (
    <>
      <Head>
        {/* <title>Archive - Bikrant Malla</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta
          name="description"
          content="Bikrant Malla - Creative frontEnd web developer who loves javascript and modern web technologies."
        />
        <meta
          name="keywords"
          content="bikrant malla, vikrant, ui/ux, portfolio, web, frontend, developer, frontend enginner, project"
        />
        <meta name="author" content="Bikrant Malla" />
        <meta
          name="google-site-verification"
          content="pjAbOBn26n0Q6sNbPKdsSIb4F921MU1XrRja9irTkXU"
        />
        <meta
          name="robots"
          content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
        />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Bikrant Malla" />
        <meta
          property="og:title"
          content="Bikrant Malla - Frontend Developer"
        />
        <meta
          property="og:description"
          content="Bikrant Malla - Creative frontEnd web developer who loves javascript and modern web technologies."
        />
        <meta
          property="og:url"
          content="https://www.bikrant-malla.com.np/archive"
        />
        <meta property="fb:app_id" content="668583534114468" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@Vikrantmalla09" />
        <meta name="twitter:creator" content="@Vikrantmalla09" />
        <meta
          property="og:url"
          content="https://www.bikrant-malla.com.np/archive"
        />
        <meta
          property="og:title"
          content="Bikrant Malla - Frontend Developer"
        />
        <meta
          property="og:description"
          content="Bikrant Malla - Creative frontEnd web developer who loves javascript and modern web technologies."
        />
        <meta
          property="og:image"
          content="https://www.bikrant-malla.com.np/ogimg.png"
        />
        <meta
          name="google-site-verification"
          content="pjAbOBn26n0Q6sNbPKdsSIb4F921MU1XrRja9irTkXU"
        /> */}
        <link
          rel="stylesheet"
          href="https://use.fontawesome.com/releases/v5.15.4/css/all.css"
          integrity="sha384-DyZ88mC6Up2uqS4h/KRgHuoeGwBcD4Ng9SiP4dIRy0EXTlnuz47vAwmeGwVChigm"
          crossOrigin="anonymous"
        />
      </Head>
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
export const getServerSideProps: GetServerSideProps<{
  projectData: Data.ProjectData;
}> = async (context) => {
  const res = await fetch(`${baseUrl}/api/projects`);
  const projectData = await res.json();
  return {
    props: { projectData },
  };
};
export default Archive;
