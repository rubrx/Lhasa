import type { Metadata } from "next";
import { Lora, Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import Navbar from "@/components/layout/Navbar";
import BottomNav from "@/components/layout/BottomNav";
import Footer from "@/components/layout/Footer";

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.lhasabraii.shop";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    template: "%s | Lhasa",
    default: "Lhasa — Buy & Sell Used Books in Lohit, Arunachal Pradesh",
  },
  description:
    "Lhasa is a free local marketplace to buy and sell used books in Lohit district, Arunachal Pradesh. No fees, no commissions — connect directly with buyers and sellers near you.",
  keywords: [
    "Lhasa",
    "lhasa",
    "Lhasabraii",
    "lhasabraii",
    "lhasa books",
    "Lhasa books",
    "buy books Lohit",
    "sell books Lohit",
    "used books Arunachal Pradesh",
    "second hand books Arunachal",
    "book marketplace Lohit",
    "cheap books Tezu",
    "books near me Arunachal",
    "online book shopping Arunachal Pradesh",
    "buy sell books online India",
    "local book market Lohit district",
    "affordable books Arunachal",
    "second hand textbooks Arunachal Pradesh",
  ],
  verification: {
    google: "16o_bWAdqhD5QlzGzgKRl2l1x7zyyP37_lEUb_2d38I",
  },
  authors: [{ name: "Lhasa" }],
  creator: "Lhasa",
  publisher: "Lhasa",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: SITE_URL,
    siteName: "Lhasa",
    title: "Lhasa — Buy & Sell Used Books in Lohit, Arunachal Pradesh",
    description:
      "Free local marketplace for used books in Lohit district. No fees, no commissions — connect with buyers and sellers near you.",
    images: [
      {
        url: "/favicons/android-chrome-512x512.png",
        width: 512,
        height: 512,
        alt: "Lhasa — Books. Local. Affordable.",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "Lhasa — Buy & Sell Used Books in Lohit, Arunachal Pradesh",
    description:
      "Free local marketplace for used books in Lohit district. No fees, no commissions.",
    images: ["/favicons/android-chrome-512x512.png"],
  },
  icons: {
    icon: [
      { url: "/favicons/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicons/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/favicons/apple-touch-icon.png",
    other: [
      { rel: "android-chrome-192x192", url: "/favicons/android-chrome-192x192.png" },
      { rel: "android-chrome-512x512", url: "/favicons/android-chrome-512x512.png" },
    ],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: "Lhasa",
      description: "Free local marketplace to buy and sell used books in Lohit district, Arunachal Pradesh.",
      potentialAction: {
        "@type": "SearchAction",
        target: { "@type": "EntryPoint", urlTemplate: `${SITE_URL}/books?q={search_term_string}` },
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "LocalBusiness",
      "@id": `${SITE_URL}/#organization`,
      name: "Lhasa",
      url: SITE_URL,
      description: "Buy and sell used books locally in Lohit district, Arunachal Pradesh. Zero fees, direct WhatsApp contact.",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Lohit district",
        addressRegion: "Arunachal Pradesh",
        addressCountry: "IN",
      },
      areaServed: {
        "@type": "Place",
        name: "Lohit district, Arunachal Pradesh",
      },
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${lora.variable} ${inter.variable} font-sans antialiased`}>
        <Providers>
          <Navbar />
          <main className="min-h-screen pb-20 md:pb-0">{children}</main>
          <div className="hidden md:block">
            <Footer />
          </div>
          <BottomNav />
        </Providers>
      </body>
    </html>
  );
}
