import baseUrl from "@/helpers/lib/baseUrl";

export async function fetchProjectHighlights() {
  const res = await fetch(`${baseUrl}/api/projecthighlights`);
  const data = await res.json();
  return data;
}

export async function fetchBehanceData() {
  const res = await fetch(`${baseUrl}/api/behance`);
  const data = await res.json();
  return data;
}

export async function fetchProjectData() {
  const res = await fetch(`${baseUrl}/api/projects`);
  const data = await res.json();
  return data;
}

export async function fetchMetaTagData() {
  const res = await fetch(`${baseUrl}/api/metatags`);
  const data = await res.json();
  return data;
}
