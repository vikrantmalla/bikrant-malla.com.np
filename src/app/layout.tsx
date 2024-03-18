import type { Viewport } from "next";
import { ReduxProvider } from "@/redux/Provider";
import { fetchPortfolioDetailsData } from "@/service/apiService";
import SharedComponent from "@/components/shared/layoutComponent";
import "../styles/globals.scss";

export async function generateMetadata() {
  const portfolioDetails = await fetchPortfolioDetailsData();
  const { metaData } = portfolioDetails;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  const googleSiteID = process.env.NEXT_PUBLIC_GOOGLE_SITE_ID;
  const appTitle = "Bikrant Malla - Frontend Web Developer";
  return {
    metadataBase: new URL(`${appUrl}/`),
    title: appTitle,
    description: `${metaData[0].description}`,
    keywords:`${metaData[0].keyword}`,
    authors: [{ name: `${metaData[0].author}`, url: `${appUrl}/` }],
    referrer: "origin-when-cross-origin",
    category: "portfolio",
    openGraph: {
      title: appTitle,
      description: `${metaData[0].description}`,
      authors: [{ name: `${metaData[0].author}`, url: `${appUrl}/` }],
      url: `${appUrl}`,
      siteName: `${metaData[0].author}`,
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
      description: `${metaData[0].description}`,
      creator: `${metaData[0].twitterID}`,
      creatorId: `${metaData[0].twitterID}`,
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
  const portfolioDetails = await fetchPortfolioDetailsData();
  const { contact } = portfolioDetails;
  return (
    <html lang="en">
      <ReduxProvider>
        <body>
          {children}
          <SharedComponent contact={contact}/>
        </body>
      </ReduxProvider>
    </html>
  );
}
