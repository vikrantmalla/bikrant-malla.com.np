import { useEffect, useState } from "react";
import type { AppProps } from "next/app";
import Router, { useRouter } from "next/router";
import * as gtag from "../helpers/lib/gtag";
import Gtag from "@/components/shared/gtag";
import Layout from "@/components/shared/layout";
import Loading from "@/components/shared/loading";
import "../styles/globals.scss";

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

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <>
          <Gtag />
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </>
      )}
    </>
  );
}
