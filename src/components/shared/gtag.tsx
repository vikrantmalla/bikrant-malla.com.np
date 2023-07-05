import React from "react";
import Script from "next/script";
import * as gtag from "../../helpers/lib/gtag";

const Gtag = () => {
  const isProduction = process.env.NODE_ENV === "production";
  return (
    <>
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
  );
};

export default Gtag;
