import { MetaTagData } from "@/types/data";
import Head from "next/head";
import { useRouter } from "next/router";


interface Props {
  metaTagData: MetaTagData
}

const MetaTags = ({ metaTagData }: Props) => {
  const router = useRouter();
  return (
    <Head>
      <meta charSet="utf-8" />
      {router.pathname === "/" ? (
        <title>Bikrant Malla - Frontend Web Developer</title>
      ) : (
        <title>Archive - Bikrant Malla</title>
      )}
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      <meta
        name="description"
        content={metaTagData.metaTag[0].description}
      />
      <meta
        name="keywords"
        content={metaTagData.metaTag[0].keyword}
      />
      <meta name="author" content={metaTagData.metaTag[0].author} />
      <meta
        name="google-site-verification"
        content={metaTagData.metaTag[0].googleSiteID}
      />
      <meta
        name="robots"
        content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
      />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={metaTagData.metaTag[0].author} />
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
        content={metaTagData.metaTag[0].description}
      />
      {router.pathname === "/" ? (
        <meta property="og:url" content={`${process.env.NEXT_PUBLIC_APP_URL}`} />
      ) : (
        <meta
          property="og:url"
          content={`${process.env.NEXT_PUBLIC_APP_URL}/archive`}
        />
      )}
      <meta property="fb:app_id" content={metaTagData.metaTag[0].fbID} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={metaTagData.metaTag[0].twitterID} />
      <meta name="twitter:creator" content={metaTagData.metaTag[0].twitterID} />
      <meta name="twitter:title" content={metaTagData.metaTag[0].title} />
      <meta
        name="twitter:description"
        content={metaTagData.metaTag[0].description}
      />
      <meta property="twitter:image" content={`${process.env.NEXT_PUBLIC_APP_URL}/ogimg.png`} />
      <meta
        property="og:description"
        content={metaTagData.metaTag[0].description}
      />
      <meta
        property="og:image"
        content={`${process.env.NEXT_PUBLIC_APP_URL}/ogimg.png`}
      />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="675" />
    </Head>
  );
};

export default MetaTags;
