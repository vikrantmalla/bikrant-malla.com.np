import type { Viewport } from "next";
import { ReduxProvider } from "@/redux/Provider";
import { fetchContactData } from "@/service/apiService";
import NavBar from "@/components/shared/header/NavBar";
import Footer from "@/components/shared/footer/Footer";
import ScrollArrow from "@/components/shared/scrollup/ScrollArrow";
import DotRing from "@/components/shared/cursor/DotRing";
import Gtag from "@/components/shared/gtag";
import "../styles/globals.scss";
import Script from "next/script";

export async function generateMetadata() {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  const googleSiteID = process.env.NEXT_PUBLIC_GOOGLE_SITE_ID;
  return {
    metadataBase: new URL(`${appUrl}/`),
    title: "Bikrant Malla - Frontend Web Developer",
    description:
      "Bikrant Malla - Experienced Front-End Web Developer specializing in JavaScript and cutting-edge web technologies, delivering creative solutions. Explore a portfolio showcasing expertise in building dynamic and user-friendly web applications.",
    keywords:
      "bikrant malla, vikrant malla, ui/ux, portfolio, web, web developer, frontend, developer, frontend enginner, project, design, bikrantmalla.com.np, reactjs",
    authors: [{ name: "Bikrant Malla", url: `${appUrl}/` }],
    referrer: "origin-when-cross-origin",
    category: "portfolio",
    openGraph: {
      title: "Bikrant Malla - Frontend Web Developer",
      description:
        "Bikrant Malla - Experienced Front-End Web Developer specializing in JavaScript and cutting-edge web technologies, delivering creative solutions. Explore a portfolio showcasing expertise in building dynamic and user-friendly web applications.",
      authors: [{ name: "Bikrant Malla", url: `${appUrl}/` }],
      url: `${appUrl}`,
      siteName: "Bikrant Malla",
      images: [
        {
          url: `${appUrl}/ogimg.png`,
          alt: "Bikrant malla",
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Bikrant Malla - Frontend Web Developer",
      description:
        "Bikrant Malla - Experienced Front-End Web Developer specializing in JavaScript and cutting-edge web technologies, delivering creative solutions. Explore a portfolio showcasing expertise in building dynamic and user-friendly web applications.",
      creator: "@Vikrantmalla09",
      creatorId: "@Vikrantmalla09",
      images: [`${appUrl}/ogimg.png`],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    alternates: {
      canonical: "/",
    },
    verification: {
      google: `${googleSiteID}`,
    },
  };
}

export function generateViewport(): Viewport {
  return {
    themeColor: [
      { media: "(prefers-color-scheme: light)", color: "#f9fafb" },
      { media: "(prefers-color-scheme: dark)", color: "#13141c" },
    ],
    colorScheme: "dark light",
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const contactData = await fetchContactData();
  return (
    <html lang="en">
      <Script strategy="lazyOnload" id="clarity-script">
        {`
          (function(c,l,a,r,i,t,y){
            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window, document, "clarity", "script", "l6dex549t7");
        `}
      </Script>
      <ReduxProvider>
        <body>
          <Gtag />
          <NavBar contactData={contactData} />
          {children}
          <DotRing />
          <ScrollArrow />
          <Footer />
        </body>
      </ReduxProvider>
    </html>
  );
}
