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
    {
      url: `${process.env.NEXT_PUBLIC_APP_URL}/archive?tag=all`,
      lastModified: new Date(),
    },
    {
      url: `${process.env.NEXT_PUBLIC_APP_URL}/archive?tag=feature`,
      lastModified: new Date(),
    },
    {
      url: `${process.env.NEXT_PUBLIC_APP_URL}/archive?tag=html`,
      lastModified: new Date(),
    },
    {
      url: `${process.env.NEXT_PUBLIC_APP_URL}/archive?tag=css`,
      lastModified: new Date(),
    },
    {
      url: `${process.env.NEXT_PUBLIC_APP_URL}/archive?tag=scss`,
      lastModified: new Date(),
    },
    {
      url: `${process.env.NEXT_PUBLIC_APP_URL}/archive?tag=react_js`,
      lastModified: new Date(),
    },
  ];
}
