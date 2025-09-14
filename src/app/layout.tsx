import type { Viewport } from "next";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { fetchPortfolioDetailsData } from "@/service/apiService";
import SharedComponent from "@/components/shared/layoutComponent";
import ClientOnly from "@/components/shared/ClientOnly";

import "../styles/globals.scss";
import { ZustandProvider } from "@/store/provider";

// Force dynamic rendering for this layout
export const dynamic = 'force-dynamic';

export async function generateMetadata() {
  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL;
  const googleSiteID = process.env.NEXT_PUBLIC_GOOGLE_SITE_ID;

  return {
    metadataBase: new URL(appUrl),
    title: "Bikrant Malla - Frontend Web Developer",
    description:
      "Frontend Web Developer specializing in React, Next.js, and modern web technologies. Creating beautiful, responsive, and user-friendly web experiences.",
    keywords:
      "frontend developer, web developer, react developer, next.js developer, portfolio, web technologies, UI/UX, responsive design, bikrant malla",
    authors: [{ name: "Bikrant Malla", url: appUrl }],
    referrer: "origin-when-cross-origin",
    category: "portfolio",
    openGraph: {
      title: "Bikrant Malla - Frontend Web Developer",
      description:
        "Frontend Web Developer specializing in React, Next.js, and modern web technologies. Creating beautiful, responsive, and user-friendly web experiences.",
      authors: [{ name: "Bikrant Malla", url: appUrl }],
      url: appUrl,
      siteName: "Bikrant Malla",
      images: [
        {
          url: `${appUrl}/ogimg.png`,
          alt: "Bikrant Malla - Frontend Web Developer",
          width: 1200,
          height: 630,
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Bikrant Malla - Frontend Web Developer",
      description:
        "Frontend Web Developer specializing in React, Next.js, and modern web technologies.",
      creator: "@bikrantmalla",
      creatorId: "@bikrantmalla",
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
    verification: googleSiteID
      ? {
          google: googleSiteID,
        }
      : undefined,
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
  // Fetch portfolio data with error handling
  const portfolioDetail = await fetchPortfolioDetailsData();
  const contact = {
    email: portfolioDetail.email,
    linkedIn: portfolioDetail.linkedIn,
    gitHub: portfolioDetail.gitHub,
    behance: portfolioDetail.behance,
    twitter: portfolioDetail.twitter,
  };

  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <ZustandProvider>
          <Analytics />
          <SpeedInsights />
          {children}
          <SharedComponent contact={contact} />
        </ZustandProvider>
      </body>
    </html>
  );
}
