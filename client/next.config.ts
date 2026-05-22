import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Tell Next.js/Turbopack the project root is client/, not the git root.
  // Without this, Turbopack walks up to the .git directory (Lhasa/) and
  // resolves CSS @import "tailwindcss" from there — where node_modules doesn't exist.
  outputFileTracingRoot: path.join(__dirname),

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin-allow-popups",
          },
        ],
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
};

export default nextConfig;
