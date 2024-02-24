import baseUrl from "@/helpers/lib/baseUrl";

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
  const res = await fetch(`${baseUrl}/api/projects`, { cache: 'no-store' });
  const data = await res.json();
  return data;
}

export async function fetchContactData() {
  const res = await fetch(`${baseUrl}/api/contact`, { cache: 'no-store' });
  const data = await res.json();
  return data;
}

export async function fetchMetaData() {
  const res = await fetch(`${baseUrl}/api/metadata`, { cache: 'no-store' });
  const data = await res.json();
  return data;
}

// export async function fetchTagData() {
//   const res = await fetch(`${baseUrl}/api/tags`, { cache: 'no-store' });
//   const data = await res.json();
//   return data;
// }