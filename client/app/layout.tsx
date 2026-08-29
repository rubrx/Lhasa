import type { Metadata, Viewport } from "next";
import { Fraunces, Lora, DM_Sans } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import Navbar from "@/components/layout/Navbar";
import BottomNav from "@/components/layout/BottomNav";
import Footer from "@/components/layout/Footer";

/* Display — headings and brand moments only */
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  weight: ["600", "700", "800"],
  style: ["normal", "italic"],
});

/* Editorial body — comfortable for reading */
const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
  display: "swap",
  weight: ["400", "600"],
});

/* UI — neutral, readable at small sizes */
const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.lhasabooks.com";

export const viewport: Viewport = {
  themeColor: "#1b2e4b",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    template: "%s | Lhasa Books",
    default: "Lhasa Books — Buy & Sell Used Books in Lohit, Arunachal Pradesh",
  },
  description:
    "Free local marketplace to buy and sell used books in Lohit district, Arunachal Pradesh. Zero fees, zero commissions. Connect directly with sellers on WhatsApp.",
  keywords: [
    "used books Lohit",
    "second hand books Arunachal Pradesh",
    "buy books Tezu",
    "sell books Arunachal",
    "book marketplace Lohit district",
    "cheap textbooks Arunachal Pradesh",
    "Lhasa books",
  ],
  applicationName: "Lhasa Books",
  verification: {
    google: "16o_bWAdqhD5QlzGzgKRl2l1x7zyyP37_lEUb_2d38I",
  },
  authors: [{ name: "Lhasa Books" }],
  creator: "Lhasa Books",
  publisher: "Lhasa Books",
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
    siteName: "Lhasa Books",
    title: "Lhasa Books — Buy & Sell Used Books in Lohit, Arunachal Pradesh",
    description:
      "Free local marketplace for used books in Lohit district. Zero fees, zero commissions. Direct WhatsApp contact with sellers.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lhasa Books — Buy & Sell Used Books in Lohit, Arunachal Pradesh",
    description:
      "Free local marketplace for used books in Lohit district. Zero fees, zero commissions.",
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
      name: "Lhasa Books",
      description:
        "Free local marketplace to buy and sell used books in Lohit district, Arunachal Pradesh.",
      inLanguage: "en-IN",
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${SITE_URL}/books?q={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "LocalBusiness",
      "@id": `${SITE_URL}/#organization`,
      name: "Lhasa Books",
      url: SITE_URL,
      logo: `${SITE_URL}/logo.svg`,
      image: `${SITE_URL}/opengraph-image`,
      description:
        "Buy and sell used books locally in Lohit district, Arunachal Pradesh. Zero fees, direct WhatsApp contact.",
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
      <body className={`${fraunces.variable} ${lora.variable} ${dmSans.variable} font-sans antialiased`}>
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
