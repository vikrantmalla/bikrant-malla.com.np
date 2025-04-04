import React from "react";
import Script from "next/script";
import * as gtag from "../lib/gtag";
import { Environment } from "@/types/enum";
import { baseUrl } from "../lib/baseUrl";

const CustomScript = () => {
  const isProduction = process.env.NODE_ENV === Environment.PRODUCTION;
  const jsonLd = {
    "@context": "https://schema.org/",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "View Full Résumé",
        item: `${baseUrl}/resume.pdf`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "View Full Project Archive",
        item: `${baseUrl}/archive`,
      },
    ],
  };

  if (typeof window !== 'undefined' && isProduction) {
    window.console.log = () => {};
  }

  return (
    <>
      {isProduction && (
        <>
          <Script strategy="lazyOnload" id="clarity-script">
            {`
          (function(c,l,a,r,i,t,y){
            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window, document, "clarity", "script", "l6dex549t7");
        `}
          </Script>
          <Script
            defer
            src={`https://www.googletagmanager.com/gtag/js?id=${gtag.GA_TRACKING_ID}`}
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
};

export default CustomScript;
