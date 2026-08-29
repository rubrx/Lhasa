import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.lhasabooks.com";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export const revalidate = 3600;

interface BookLite {
  id: string;
  updatedAt?: string;
}

const PAGE_SIZE = 100;
const MAX_PAGES = 20;

async function fetchBooksPage(page: number): Promise<BookLite[] | null> {
  try {
    const res = await fetch(
      `${API_URL}/api/books?limit=${PAGE_SIZE}&page=${page}`,
      {
        next: { revalidate: 3600 },
        signal: AbortSignal.timeout(5000),
      },
    );
    if (!res.ok) return null;
    const data: unknown = await res.json();
    const list: unknown = Array.isArray(data)
      ? data
      : (data as { books?: unknown }).books;
    if (!Array.isArray(list)) return null;
    const items: BookLite[] = [];
    for (const item of list) {
      if (typeof item !== "object" || item === null) continue;
      const record = item as { id?: unknown; updatedAt?: unknown };
      if (record.id === undefined || record.id === null) continue;
      items.push({
        id: String(record.id),
        updatedAt:
          typeof record.updatedAt === "string" ? record.updatedAt : undefined,
      });
    }
    return items;
  } catch {
    return null;
  }
}

async function fetchBookIds(): Promise<BookLite[]> {
  const all: BookLite[] = [];
  for (let page = 1; page <= MAX_PAGES; page++) {
    const items = await fetchBooksPage(page);
    if (items === null) break;
    all.push(...items);
    if (items.length < PAGE_SIZE) break;
  }
  return all;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/books`, lastModified: now, changeFrequency: "hourly", priority: 0.9 },
    { url: `${SITE_URL}/sell`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/contact`, lastModified: now, changeFrequency: "yearly", priority: 0.4 },
  ];

  const books = await fetchBookIds();
  const bookEntries: MetadataRoute.Sitemap = books.map((b) => ({
    url: `${SITE_URL}/books/${b.id}`,
    lastModified: b.updatedAt ? new Date(b.updatedAt) : now,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  return [...staticEntries, ...bookEntries];
}
