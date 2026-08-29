import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Complete profile",
  robots: { index: false, follow: false },
};

export default function CompleteProfileLayout({ children }: { children: React.ReactNode }) {
  return children;
}
