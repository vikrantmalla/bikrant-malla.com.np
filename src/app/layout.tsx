import type { Viewport } from "next";
import { ReduxProvider } from "@/redux/Provider";
import { fetchContactData, fetchMetaData } from "@/service/apiService";
import CustomScript from "@/helpers/customScript/customScript";
import NavBar from "@/components/shared/header/NavBar";
import Footer from "@/components/shared/footer/Footer";
import ScrollArrow from "@/components/shared/scrollup/ScrollArrow";
import DotRing from "@/components/shared/cursor/DotRing";
import "../styles/globals.scss";

export async function generateMetadata() {
  const metaData = await fetchMetaData();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  const googleSiteID = process.env.NEXT_PUBLIC_GOOGLE_SITE_ID;
  const appTitle = "Bikrant Malla - Frontend Web Developer";
  return {
    metadataBase: new URL(`${appUrl}/`),
    title: appTitle,
    description: `${metaData.metaTag[0].description}`,
    keywords:`${metaData.metaTag[0].keyword}`,
    authors: [{ name: `${metaData.metaTag[0].author}`, url: `${appUrl}/` }],
    referrer: "origin-when-cross-origin",
    category: "portfolio",
    openGraph: {
      title: appTitle,
      description: `${metaData.metaTag[0].description}`,
      authors: [{ name: `${metaData.metaTag[0].author}`, url: `${appUrl}/` }],
      url: `${appUrl}`,
      siteName: `${metaData.metaTag[0].author}`,
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
      title: appTitle,
      description: `${metaData.metaTag[0].description}`,
      creator: `${metaData.metaTag[0].twitterID}`,
      creatorId: `${metaData.metaTag[0].twitterID}`,
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
      <ReduxProvider>
        <body>
          <CustomScript />
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
