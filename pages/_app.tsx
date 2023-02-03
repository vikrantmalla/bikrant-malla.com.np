import { useEffect, useState } from "react";
import Head from "next/head";
import type { AppProps } from "next/app";
import Router, { useRouter } from "next/router";
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

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);

  Router.events.on("routeChangeStart", (url) => {
    setLoading(true);
  });

  Router.events.on("routeChangeComplete", (url) => {
    setLoading(false);
  });

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
      {loading ? (
        <div className="loading">
          <div className="loading-text">
            <span className="loading-text-words">L</span>
            <span className="loading-text-words">O</span>
            <span className="loading-text-words">A</span>
            <span className="loading-text-words">D</span>
            <span className="loading-text-words">I</span>
            <span className="loading-text-words">N</span>
            <span className="loading-text-words">G</span>
          </div>
        </div>
      ) : (
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
      )}
    </>
  );
}
