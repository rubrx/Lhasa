import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Browse Books",
  description:
    "Browse used books for sale in Lohit district, Arunachal Pradesh. Filter by category, condition, and price. Find textbooks, novels, competitive exam books and more.",
  keywords: [
    "browse used books Lohit",
    "buy second hand books Arunachal Pradesh",
    "cheap textbooks Arunachal",
    "used novels Lohit",
    "competitive exam books Arunachal Pradesh",
    "lhasa books marketplace",
  ],
  alternates: {
    canonical: "/books",
  },
  openGraph: {
    title: "Browse Used Books | Lhasa",
    description:
      "Hundreds of used books available in Lohit district. Textbooks, novels, competitive exams — all at affordable prices with zero platform fees.",
    url: "/books",
  },
};

export default function BooksLayout({ children }: { children: React.ReactNode }) {
  return children;
}
