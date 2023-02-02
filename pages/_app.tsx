import { useEffect } from "react";
import type { AppProps } from "next/app";
import Router, { useRouter } from "next/router";
import nProgress from "nprogress";
import ThemeContext from "../context/ThemeContext";
import ProjectContext from "../context/ProjectContext";
import MouseContext from "../context/MouseContext";
import DotRing from "../components/shared/cursor/DotRing";
import ScrollArrow from "../components/shared/scrollup/ScrollArrow";
import Footer from "../components/shared/footer/Footer";
import * as gtag from "../helpers/lib/gtag";
import "../styles/globals.scss";
import Script from "next/script";
import MetaTags from "../components/shared/metaTag";

Router.events.on("routeChangeStart", nProgress.start);
Router.events.on("routeChangeError", nProgress.done);
Router.events.on("routeChangeComplete", nProgress.done);

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  useEffect(() => {
    const handleRouteChange = (url: URL) => {
      gtag.pageview(url);
    };
    router.events.on("routeChangeComplete", handleRouteChange);
    router.events.on("hashChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
      router.events.off("hashChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  const isProduction = process.env.NODE_ENV === "production";

  return (
    <>
      <>
        {/* Global Site Tag (gtag.js) - Google Analytics */}
        {isProduction && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gtag.GA_TRACKING_ID}`}
              strategy="afterInteractive"
            />
            <Script
              id="gtag-init"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gtag.GA_TRACKING_ID}', {
            page_path: window.location.pathname,
          });
        `,
              }}
            />
          </>
        )}
      </>
      <MetaTags />
      <ThemeContext>
        <MouseContext>
          <ProjectContext>
            <Component {...pageProps} />
            <DotRing />
            <ScrollArrow />
            <Footer />
          </ProjectContext>
        </MouseContext>
      </ThemeContext>
    </>
  );
}
