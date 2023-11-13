import baseUrl from "@/helpers/lib/baseUrl";

export async function fetchMetaTagData() {
  const res = await fetch(`${baseUrl}/api/metatags`);
  const data = await res.json();
  return data;
}

export async function fetchAboutMeData() {
  const res = await fetch(`${baseUrl}/api/aboutme`, { cache: 'no-store' });
  const data = await res.json();
  return data;
}


export async function fetchProjectHighlights() {
  const res = await fetch(`${baseUrl}/api/projecthighlight`, { cache: 'no-store' });
  const data = await res.json();
  return data;
}

export async function fetchBehanceData() {
  const res = await fetch(`${baseUrl}/api/behance`, { cache: 'no-store' });
  const data = await res.json();
  return data;
}

export async function fetchProjectData() {
  const res = await fetch(`${baseUrl}/api/projects`);
  const data = await res.json();
  return data;
}

export async function fetchContactData() {
  const res = await fetch(`${baseUrl}/api/contact`, { cache: 'no-store' });
  const data = await res.json();
  return data;
}