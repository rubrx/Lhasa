import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Lhasa — Buy & Sell Used Books",
    short_name: "Lhasa",
    description:
      "Free local marketplace to buy and sell used books in Lohit district, Arunachal Pradesh.",
    start_url: "/",
    display: "standalone",
    background_color: "#fafaf9",
    theme_color: "#2d6a4f",
    icons: [
      {
        src: "/favicons/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/favicons/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
