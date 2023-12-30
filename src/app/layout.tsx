import ThemeProvider from "@/context/ThemeContext";
import NavBar from "@/components/shared/header/NavBar";
import Footer from "@/components/shared/footer/Footer";
import "../styles/globals.scss";
import ScrollArrow from "@/components/shared/scrollup/ScrollArrow";
import DotRing from "@/components/shared/cursor/DotRing";
import MouseContextProvider from "@/context/MouseContext";
import { fetchContactData, fetchMetaData } from "@/service/apiService";

export async function generateMetadata() {
  const metatData = await fetchMetaData();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  return {
    metadataBase: new URL(`${appUrl}`),
    title: "Bikrant Malla - Frontend Web Developer",
    description: `${metatData.metaTag[0].description}`,
    keywords: `${metatData.metaTag[0].keyword}`,
    authors: [{ name: `${metatData.metaTag[0].author}`, url: `${appUrl}` }],
    referrer: "origin-when-cross-origin",
    category: 'portfolio',
    openGraph: {
      title: "Bikrant Malla - Frontend Web Developer",
      description: `${metatData.metaTag[0].description}`,
      authors: [{ name: `${metatData.metaTag[0].author}`, url: `${appUrl}` }],
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
      card: 'summary_large_image',
      title: "Bikrant Malla - Frontend Web Developer",
      description: `${metatData.metaTag[0].description}`,
      creator: `${metatData.metaTag[0].twitterID}`,
      creatorId: `${metatData.metaTag[0].twitterID}`,
      images: [ `${appUrl}/ogimg.png`],
    },
    robots: {
      index: false,
      follow: true,
      nocache: true,
      googleBot: {
        index: true,
        follow: false,
        noimageindex: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    alternates: {
      canonical: "/",
      languages: {
        "en-US": "/en-US",
      },
    },
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
      <ThemeProvider>
        <body>
          <MouseContextProvider>
            <NavBar contactData={contactData} />
            {children}
            <DotRing />
            <ScrollArrow />
            <Footer />
          </MouseContextProvider>
        </body>
      </ThemeProvider>
    </html>
  );
}
