import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Page Not Found",
  description: "The page you were looking for doesn't exist on Lhasa Books.",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center px-6 py-16 text-center">
      <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.14em] text-brand">
        404
      </p>
      <h1 className="font-display text-3xl font-bold text-ink md:text-4xl">
        This page has wandered off.
      </h1>
      <p className="mt-4 text-[15px] leading-relaxed text-ink-muted">
        The link may be broken, or the listing may have found its new reader.
      </p>
      <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded bg-accent px-6 py-3 text-[14px] font-semibold text-white transition-colors hover:bg-accent-hover"
        >
          <ArrowLeft size={14} />
          Back to home
        </Link>
        <Link
          href="/books"
          className="rounded border border-border bg-surface-raised px-6 py-3 text-[14px] font-semibold text-ink-muted transition-colors hover:border-border-strong hover:text-ink"
        >
          Browse books
        </Link>
      </div>
    </div>
  );
}
