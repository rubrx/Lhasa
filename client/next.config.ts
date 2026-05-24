import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Tell Next.js/Turbopack the project root is client/, not the git root.
  // Without this, Turbopack walks up to the .git directory (Lhasa/) and
  // resolves CSS @import "tailwindcss" from there — where node_modules doesn't exist.
  outputFileTracingRoot: path.join(__dirname),

  async headers() {
    const apiOrigin = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Cross-Origin-Opener-Policy", value: "same-origin-allow-popups" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' accounts.google.com",
              `connect-src 'self' ${apiOrigin} accounts.google.com https://www.googleapis.com`,
              "img-src 'self' res.cloudinary.com lh3.googleusercontent.com data: blob:",
              "font-src 'self' fonts.gstatic.com",
              "style-src 'self' 'unsafe-inline' fonts.googleapis.com",
              "frame-src accounts.google.com",
              "object-src 'none'",
              "base-uri 'self'",
            ].join("; "),
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
