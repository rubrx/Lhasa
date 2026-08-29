import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create account",
  description: "Create your Lhasa Books account to list books.",
  robots: { index: false, follow: false },
};

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return children;
}
