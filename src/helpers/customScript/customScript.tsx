import React from "react";
import Script from "next/script";
import * as Sentry from "@sentry/nextjs";
import * as gtag from "../lib/gtag";
import { Environment } from "@/types/enum";
import { baseUrl } from "../lib/baseUrl";

const CustomScript = () => {
  // Use NEXT_PUBLIC_ prefix for client-side access
  const isProduction =
    process.env.NEXT_PUBLIC_NODE_ENV === Environment.PRODUCTION ||
    process.env.NODE_ENV === Environment.PRODUCTION;
  const clarityId = process.env.NEXT_PUBLIC_MICROSOFT_CLARITY;
  const gaTrackingId = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS;

  // Track script loading performance
  const trackScriptPerformance = (scriptName: string, startTime: number) => {
    const loadTime = Date.now() - startTime;
    Sentry.addBreadcrumb({
      message: `${scriptName} script performance`,
      level: "info",
      category: "custom-script",
      data: {
        scriptName,
        loadTime,
        performance:
          loadTime < 1000 ? "good" : loadTime < 3000 ? "acceptable" : "slow",
      },
    });
  };

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

  // Debug logging to Sentry and console
  if (typeof window !== "undefined") {
    const debugInfo = {
      isProduction,
      clarityId: clarityId ? `Set (${clarityId})` : "Not set",
      gaTrackingId: gaTrackingId ? "Set" : "Not set",
      baseUrl,
      userAgent: navigator.userAgent,
      url: window.location.href,
      timestamp: new Date().toISOString(),
    };

    // Log to Sentry for monitoring
    Sentry.addBreadcrumb({
      message: "CustomScript initialization",
      level: "info",
      data: debugInfo,
      category: "custom-script",
    });

    // Log as info event to Sentry (only in production to avoid spam)
    if (isProduction) {
      Sentry.captureMessage("CustomScript initialized", {
        level: "info",
        tags: {
          component: "CustomScript",
          environment: isProduction ? "production" : "development",
        },
        extra: debugInfo,
      });
    }
  }

  return (
    <>
      {/* Microsoft Clarity */}
      {isProduction &&
        clarityId &&
        (() => {
          const clarityStartTime = Date.now();
          return (
            <Script
              strategy="lazyOnload"
              id="clarity-script"
              onLoad={() => {
                trackScriptPerformance("Microsoft Clarity", clarityStartTime);
                Sentry.addBreadcrumb({
                  message: "Microsoft Clarity script loaded successfully",
                  level: "info",
                  category: "custom-script",
                });
              }}
              onError={(e) => {
                console.error("Clarity script failed to load:", e);
                Sentry.captureException(
                  new Error("Microsoft Clarity script failed to load"),
                  {
                    tags: {
                      component: "CustomScript",
                      script: "clarity",
                    },
                    extra: {
                      error: e,
                      clarityId,
                      url: window.location.href,
                    },
                  }
                );
              }}
            >
              {`
          (function(c,l,a,r,i,t,y){
            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window, document, "clarity", "script", "l6dex549t7");
        `}
            </Script>
          );
        })()}

      {/* Google Analytics */}
      {isProduction &&
        gaTrackingId &&
        (() => {
          const gaStartTime = Date.now();
          return (
            <>
              <Script
                strategy="afterInteractive"
                src={`https://www.googletagmanager.com/gtag/js?id=${gaTrackingId}`}
                onLoad={() => {
                  console.log("Google Analytics script loaded");
                  trackScriptPerformance("Google Analytics", gaStartTime);
                  Sentry.addBreadcrumb({
                    message: "Google Analytics script loaded successfully",
                    level: "info",
                    category: "custom-script",
                  });
                }}
                onError={(e) => {
                  console.error("Google Analytics script failed to load:", e);
                  Sentry.captureException(
                    new Error("Google Analytics script failed to load"),
                    {
                      tags: {
                        component: "CustomScript",
                        script: "google-analytics",
                      },
                      extra: {
                        error: e,
                        gaTrackingId,
                        url: window.location.href,
                      },
                    }
                  );
                }}
              />
              <Script
                id="gtag-init"
                strategy="afterInteractive"
                onLoad={() => {
                  console.log("Google Analytics gtag initialized");
                  trackScriptPerformance("Google Analytics gtag", gaStartTime);
                  Sentry.addBreadcrumb({
                    message: "Google Analytics gtag initialized successfully",
                    level: "info",
                    category: "custom-script",
                  });
                }}
                onError={(e) => {
                  console.error(
                    "Google Analytics gtag initialization failed:",
                    e
                  );
                  Sentry.captureException(
                    new Error("Google Analytics gtag initialization failed"),
                    {
                      tags: {
                        component: "CustomScript",
                        script: "gtag-init",
                      },
                      extra: {
                        error: e,
                        gaTrackingId,
                        url: window.location.href,
                      },
                    }
                  );
                }}
                dangerouslySetInnerHTML={{
                  __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gaTrackingId}');
            `,
                }}
              />
            </>
          );
        })()}

      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
};

export default CustomScript;
