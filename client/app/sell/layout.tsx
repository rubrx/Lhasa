import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sell a Book",
  description:
    "List your used book for free on Lhasa. No fees, no commissions. Upload photos, set your price, and connect with buyers in Lohit district directly via WhatsApp.",
  keywords: [
    "sell used books Lohit",
    "list book for sale Arunachal Pradesh",
    "free book listing Lhasa",
    "sell second hand books Arunachal",
    "sell textbooks near me",
  ],
  alternates: {
    canonical: "/sell",
  },
  openGraph: {
    title: "Sell Your Books for Free | Lhasa",
    description:
      "List your used book in under 2 minutes. Zero fees, zero commissions. Buyers contact you directly on WhatsApp.",
    url: "/sell",
  },
};

export default function SellLayout({ children }: { children: React.ReactNode }) {
  return children;
}
