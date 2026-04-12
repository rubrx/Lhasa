import type { Metadata } from "next";
import BookDetailClient from "./BookDetailClient";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8081";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.lhasabraii.shop";

interface BookMeta {
  name: string;
  author: string;
  description?: string;
  price: number;
  category: string;
  images: string[];
}

async function fetchBookMeta(id: string): Promise<BookMeta | null> {
  try {
    const res = await fetch(`${API_URL}/api/books/${id}`, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    const data = await res.json();
    return data.book ?? null;
  } catch {
    return null;
  }
}

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const { id } = await params;
  const book = await fetchBookMeta(id);

  if (!book) {
    return {
      title: "Book Not Found",
      description: "This book listing is no longer available on Lhasa.",
    };
  }

  const title = `${book.name} by ${book.author}`;
  const price = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(book.price);
  const description =
    book.description
      ? `${book.description.slice(0, 120)} — Buy for ${price} on Lhasa, the local book marketplace for Lohit district.`
      : `Buy "${book.name}" by ${book.author} for ${price} on Lhasa. Used books in Lohit district, Arunachal Pradesh.`;

  const image = book.images[0] ?? null;

  return {
    title,
    description,
    alternates: { canonical: `/books/${id}` },
    openGraph: {
      title: `${title} — ${price}`,
      description,
      url: `${SITE_URL}/books/${id}`,
      type: "website",
      ...(image && {
        images: [{ url: image, alt: book.name }],
      }),
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} — ${price}`,
      description,
      ...(image && { images: [image] }),
    },
  };
}

export default async function BookDetailPage(
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return <BookDetailClient id={id} />;
}
