import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${process.env.NEXT_PUBLIC_APP_URL}`,
      lastModified: new Date(),
    },
    {
      url: `${process.env.NEXT_PUBLIC_APP_URL}/archive`,
      lastModified: new Date(),
    },
    {
      url: `${process.env.NEXT_PUBLIC_APP_URL}/resume.pdf`,
      lastModified: new Date(),
    },
  ];
}
