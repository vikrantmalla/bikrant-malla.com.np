import baseUrl from "@/helpers/lib/baseUrl";
import Data, { PortfolioDetails } from "@/types/data";
import { ApiEndpoint } from "@/types/enum";

async function fetchData<T>(endpoint: string): Promise<T> {
  const res = await fetch(`${baseUrl}/${endpoint}`, { cache: "no-store" });
  const data: T = await res.json();
  return data;
}

export async function fetchPortfolioDetailsData(): Promise<PortfolioDetails> {
  return fetchData<PortfolioDetails>(ApiEndpoint.PortfolioDetails);
}

export async function fetchAboutMeData(): Promise<Data.AboutMeData> {
  return fetchData<Data.AboutMeData>(ApiEndpoint.AboutMe);
}
export async function fetchProjectHighlights(): Promise<Data.ProjectHighlightData> {
  return fetchData<Data.ProjectHighlightData>(ApiEndpoint.ProjectHighlights);
}

export async function fetchBehanceData(): Promise<Data.BehanceData> {
  return fetchData<Data.BehanceData>(ApiEndpoint.Behance);
}

export async function fetchProjectData(): Promise<Data.ProjectData> {
  return fetchData<Data.ProjectData>(ApiEndpoint.Projects);
}

export async function fetchContactData(): Promise<Data.ContactData> {
  return fetchData<Data.ContactData>(ApiEndpoint.Contact);
}

export async function fetchMetaData(): Promise<Data.MetaTagData> {
  return fetchData<Data.MetaTagData>(ApiEndpoint.MetaData);
}

// export async function fetchTagData()  {
// fetchData(ApisEndpoint.Tags)
// // }
