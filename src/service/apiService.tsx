import baseUrl from "@/helpers/lib/baseUrl";
import Data from "@/types/data";

export async function fetchAboutMeData(): Promise<Data.AboutMeData> {
  const res = await fetch(`${baseUrl}/api/aboutme`, { cache: "no-store" });
  const data: Data.AboutMeData = await res.json();
  return data;
}

export async function fetchProjectHighlights(): Promise<Data.ProjectHighlightData> {
  const res = await fetch(`${baseUrl}/api/projecthighlight`, {
    cache: "no-store",
  });
  const data: Data.ProjectHighlightData = await res.json();
  return data;
}

export async function fetchBehanceData(): Promise<Data.BehanceData> {
  const res = await fetch(`${baseUrl}/api/behance`, { cache: "no-store" });
  const data: Data.BehanceData = await res.json();
  return data;
}

export async function fetchProjectData(): Promise<Data.ProjectData> {
  const res = await fetch(`${baseUrl}/api/projects`, { cache: "no-store" });
  const data: Data.ProjectData = await res.json();
  return data;
}

export async function fetchContactData(): Promise<Data.ContactData> {
  const res = await fetch(`${baseUrl}/api/contact`, { cache: "no-store" });
  const data: Data.ContactData = await res.json();
  return data;
}

export async function fetchMetaData(): Promise<Data.MetaTagData> {
  const res = await fetch(`${baseUrl}/api/metadata`, { cache: "no-store" });
  const data: Data.MetaTagData = await res.json();
  return data;
}

// export async function fetchTagData()  {
//  const res = await fetch(`${baseUrl}/api/tags`, { cache: "no-store" });
//   const data = await res.json();
//   return data;
// // }
