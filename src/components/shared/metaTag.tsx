import Head from "next/head";
import { useRouter } from "next/router";

const MetaTags = () => {
  const router = useRouter();
  return (
    <Head>
      {router.pathname === "/" ? (
        <title> Bikrant Malla - Frontend Web Developer </title>
      ) : (
        <title>Archive - Bikrant Malla</title>
      )}
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      <meta
        name="description"
        content="Bikrant Malla - Experienced Front-End Web Developer specializing in JavaScript and cutting-edge web technologies, delivering creative solutions."
      />
      <meta
        name="keywords"
        content="bikrant malla, vikrant malla, ui/ux, portfolio, web, web developer, frontend, developer, frontend enginner, project, design"
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
      {router.pathname === "/" ? (
        <meta
          property="og:title"
          content="Bikrant Malla - Frontend Web Developer"
        />
      ) : (
        <meta property="og:title" content="Archive - Bikrant Malla" />
      )}
      <meta
        property="og:description"
        content="Bikrant Malla - Experienced Front-End Web Developer specializing in JavaScript and cutting-edge web technologies, delivering creative solutions."
      />
      {router.pathname === "/" ? (
        <meta property="og:url" content="https://www.bikrant-malla.com.np" />
      ) : (
        <meta
          property="og:url"
          content="https://www.bikrant-malla.com.np/archive"
        />
      )}
      <meta property="fb:app_id" content="668583534114468" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@Vikrantmalla09" />
      <meta name="twitter:creator" content="@Vikrantmalla09" />
      <meta
        property="og:description"
        content="Bikrant Malla - Experienced Front-End Web Developer specializing in JavaScript and cutting-edge web technologies, delivering creative solutions."
      />
      <meta
        property="og:image"
        content="https://www.bikrant-malla.com.np/ogimg.png"
      />
      <meta
        name="google-site-verification"
        content="pjAbOBn26n0Q6sNbPKdsSIb4F921MU1XrRja9irTkXU"
      />
    </Head>
  );
};

export default MetaTags;
