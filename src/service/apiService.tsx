import { baseUrl } from "@/helpers/lib/baseUrl";
import Data, { ArchiveDetailsData, PortfolioDetails } from "@/types/data";
import {
  ABOUT_ME_ENDPOINT,
  BEHANCE_ENDPOINT,
  CONTACT_ENDPOINT,
  META_DATA_ENDPOINT,
  PORTFOLIO_DETAILS_ENDPOINT,
  PROJECTS_ENDPOINT,
  PROJECT_HIGHLIGHTS_ENDPOINT,
} from "./endpoints";

async function fetchData<T>(endpoint: string): Promise<T> {
  const res = await fetch(`${baseUrl}/${endpoint}`, {
    cache: "force-cache", // Enables caching
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch ${endpoint}: ${res.statusText}`);
  }

  const data: T = await res.json();
  return data;
}

// GET METHOD
export async function fetchPortfolioDetailsData(): Promise<PortfolioDetails> {
  return fetchData<PortfolioDetails>(PORTFOLIO_DETAILS_ENDPOINT);
}

export async function fetchProjectData(): Promise<ArchiveDetailsData> {
  return fetchData<ArchiveDetailsData>(PROJECTS_ENDPOINT);
}

// GET, POST, PUT, DELETE METHOD
export async function fetchAboutMeData(): Promise<Data.AboutMeData> {
  return fetchData<Data.AboutMeData>(ABOUT_ME_ENDPOINT);
}
export async function fetchProjectHighlights(): Promise<Data.ProjectHighlightData> {
  return fetchData<Data.ProjectHighlightData>(PROJECT_HIGHLIGHTS_ENDPOINT);
}

export async function fetchBehanceData(): Promise<Data.BehanceData> {
  return fetchData<Data.BehanceData>(BEHANCE_ENDPOINT);
}

export async function fetchContactData(): Promise<Data.Contact> {
  return fetchData<Data.Contact>(CONTACT_ENDPOINT);
}

export async function fetchMetaData(): Promise<Data.MetaData> {
  return fetchData<Data.MetaData>(META_DATA_ENDPOINT);
}

// export async function fetchTagData()  {
// fetchData(TAGS_ENDPOINT)
// // }
