import { Suspense } from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, MapPin, Shield, Zap, MessageCircle } from "lucide-react";
import SearchHero from "@/components/home/SearchHero";
import RecentBooks from "@/components/home/RecentBooks";
import RecentBooksErrorBoundary from "@/components/home/RecentBooksErrorBoundary";
import BookCardSkeleton from "@/components/books/BookCardSkeleton";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

const categories = [
  "Fiction", "Non-fiction", "Science", "Mathematics", "History",
  "Literature", "Self-Help", "Biography", "Comics", "Children",
  "Religion", "Reference",
];

const steps = [
  {
    step: "01",
    title: "List your book",
    desc: "Upload photos, set your price, describe the condition. Takes under 2 minutes.",
    icon: BookOpen,
    cardBg: "bg-brand-light",
    iconBg: "bg-brand/15",
    iconColor: "text-brand",
    numColor: "text-brand/10",
  },
  {
    step: "02",
    title: "We review it",
    desc: "Every listing is approved within 24 hours — no spam, no fake posts, no clutter.",
    icon: Shield,
    cardBg: "bg-amber-light",
    iconBg: "bg-amber/15",
    iconColor: "text-amber",
    numColor: "text-amber/10",
  },
  {
    step: "03",
    title: "Connect & exchange",
    desc: "Buyers reach you directly via WhatsApp. You meet locally. Zero fees, always.",
    icon: MessageCircle,
    cardBg: "bg-surface-paper",
    iconBg: "bg-ink/8",
    iconColor: "text-ink-muted",
    numColor: "text-ink/6",
  },
];

const features = [
  {
    icon: Zap,
    title: "Zero Fees",
    desc: "No listing fees, no commissions. Keep every rupee you earn.",
    cardBg: "bg-amber-light",
    iconBg: "bg-amber/15",
    iconColor: "text-amber",
  },
  {
    icon: MapPin,
    title: "Hyper-local",
    desc: "Connect with buyers and sellers right here in Lohit district.",
    cardBg: "bg-brand-light",
    iconBg: "bg-brand/15",
    iconColor: "text-brand",
  },
  {
    icon: Shield,
    title: "Curated",
    desc: "Every listing is reviewed before going live. No spam, no fake posts.",
    cardBg: "bg-surface-muted",
    iconBg: "bg-ink/8",
    iconColor: "text-ink-muted",
  },
  {
    icon: MessageCircle,
    title: "Direct Contact",
    desc: "Talk to sellers directly via WhatsApp. No middlemen, no delays.",
    cardBg: "bg-sage-light",
    iconBg: "bg-sage/20",
    iconColor: "text-sage",
  },
];

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <BookCardSkeleton key={i} />
      ))}
    </div>
  );
}

async function fetchStats(): Promise<{ total: number; thisWeek: number }> {
  try {
    const res = await fetch(`${API_URL}/api/books/stats`, {
      next: { revalidate: 300 },
      signal: AbortSignal.timeout(3000),
    });
    if (!res.ok) return { total: 0, thisWeek: 0 };
    const data = await res.json();
    return { total: data.total ?? 0, thisWeek: data.thisWeek ?? 0 };
  } catch {
    return { total: 0, thisWeek: 0 };
  }
}

export default async function HomePage() {
  const stats = await fetchStats();

  return (
    <div className="overflow-x-hidden">

      {/* ──────────────────── HERO ──────────────────── */}
      <section className="relative overflow-hidden bg-surface-raised px-6 pb-20 pt-14 md:pt-20 md:pb-24">
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-0 h-[480px] w-[900px] -translate-x-1/2"
          style={{ background: "radial-gradient(ellipse 70% 55% at 50% 0%, #e8eef6 0%, transparent 68%)" }}
        />

        <div className="relative mx-auto max-w-2xl text-center">

          {/* Location badge */}
          <div className="animate-fade-in mb-8 inline-flex items-center gap-2 rounded border border-border bg-white px-3.5 py-1.5 text-[12px] font-medium text-ink-muted shadow-sm">
            <span className="animate-pulse-dot inline-block h-1.5 w-1.5 rounded-full bg-accent" />
            <MapPin size={11} className="text-brand" />
            Lohit district · Arunachal Pradesh
          </div>

          <h1
            className="animate-fade-up font-display font-bold tracking-tight text-brand"
            style={{ fontSize: "clamp(3rem, 10vw, 5.5rem)", lineHeight: 1.0, animationDelay: "0.04s" }}
          >
            Lhasa Books
          </h1>

          <p
            className="animate-fade-up mt-4 font-display font-semibold italic text-ink"
            style={{ fontSize: "clamp(1.1rem, 3vw, 1.6rem)", lineHeight: 1.35, animationDelay: "0.1s" }}
          >
            Where books find their next reader.
          </p>

          <p
            className="animate-fade-up mx-auto mt-4 max-w-[420px] text-[15px] text-ink-muted"
            style={{ lineHeight: 1.75, animationDelay: "0.15s" }}
          >
            Buy and sell used books with people in your district. No fees, no commissions, no middlemen. Ever.
          </p>

          <div
            className="animate-fade-up mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row"
            style={{ animationDelay: "0.2s" }}
          >
            <Link
              href="/books"
              className="group flex w-full items-center justify-center gap-2 rounded bg-accent px-8 py-3.5 text-[15px] font-semibold text-white shadow-sm transition-all duration-150 hover:bg-accent-hover sm:w-auto"
            >
              Browse Books
              <ArrowRight size={14} className="transition-transform duration-150 group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/sell"
              className="flex w-full items-center justify-center gap-2 rounded border border-border bg-white px-8 py-3.5 text-[15px] font-semibold text-ink-muted transition-all duration-150 hover:border-brand/30 hover:text-ink sm:w-auto"
            >
              List a Book
            </Link>
          </div>

          <div className="animate-fade-up mt-6" style={{ animationDelay: "0.26s" }}>
            <SearchHero />
          </div>

          <p className="animate-fade-up mt-5 text-[12px] text-ink-subtle" style={{ animationDelay: "0.3s" }}>
            Free to list · No account fees · Direct WhatsApp contact
          </p>
        </div>
      </section>

      {/* ──────────────────── FLOW COUNTER ──────────────────── */}
      {stats.total > 0 && (
        <div className="border-y border-border bg-surface-paper py-3 text-center">
          <p className="text-[13px] font-medium text-ink-muted">
            <span className="font-semibold text-ink">{stats.total.toLocaleString("en-IN")}</span>{" "}
            books have found new readers in Lohit.{" "}
            <span className="font-semibold text-ink">{stats.thisWeek}</span> listed this week.
          </p>
        </div>
      )}

      {/* ──────────────────── HOW IT WORKS ──────────────────── */}
      <section className="bg-surface px-6 py-18">
        <div className="mx-auto max-w-5xl">
          <div className="mb-10 text-center">
            <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.14em] text-brand">
              Simple process
            </p>
            <h2 className="font-display text-[1.8rem] font-bold text-ink md:text-[2.4rem]">
              How it works
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {steps.map(({ step, title, desc, icon: Icon, cardBg, iconBg, iconColor, numColor }) => (
              <div
                key={step}
                className={`group relative overflow-hidden rounded-lg border border-border p-7 transition-shadow duration-200 hover:shadow-md ${cardBg}`}
              >
                <span className={`select-none font-display text-[72px] font-black leading-none ${numColor}`}>
                  {step}
                </span>
                <div className="mt-3 flex items-center gap-3">
                  <div className={`flex h-8 w-8 items-center justify-center rounded ${iconBg}`}>
                    <Icon size={15} strokeWidth={2} className={iconColor} />
                  </div>
                  <h3 className="text-[15px] font-bold text-ink">{title}</h3>
                </div>
                <p className="mt-2 text-[13px] leading-relaxed text-ink-muted">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ──────────────────── READER STORY ──────────────────── */}
      <section className="border-y border-border bg-surface-paper px-6 py-14">
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-6 text-[11px] font-bold uppercase tracking-[0.14em] text-brand">
            From our community
          </p>
          <blockquote>
            <p className="font-serif text-[17px] leading-relaxed text-ink md:text-[19px]">
              &ldquo;I found a copy of The God of Small Things here last month.
              Someone had tucked a small note inside: &lsquo;This one changed me.&rsquo;
              I understood by page 40.&rdquo;
            </p>
            <footer className="mt-5 text-[13px] font-medium text-ink-muted">
              — Priya M., Tezu
            </footer>
          </blockquote>
          <Link
            href="/books"
            className="mt-7 inline-flex items-center gap-1.5 rounded border border-brand/20 bg-brand-light px-5 py-2.5 text-[13px] font-semibold text-brand transition-all duration-150 hover:border-brand/40 hover:bg-brand/15"
          >
            Find your next book <ArrowRight size={13} />
          </Link>
        </div>
      </section>

      {/* ──────────────────── CATEGORIES ──────────────────── */}
      <section className="border-y border-border bg-surface-raised px-6 py-12">
        <div className="mx-auto max-w-5xl">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.14em] text-brand">
                Genres
              </p>
              <h2 className="font-display text-[1.5rem] font-bold text-ink">
                Browse by Category
              </h2>
            </div>
            <Link
              href="/books"
              className="flex items-center gap-1 text-[13px] font-semibold text-brand transition-colors hover:text-brand-hover"
            >
              See all <ArrowRight size={13} />
            </Link>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((label) => (
              <Link
                key={label}
                href={`/books?q=${encodeURIComponent(label)}`}
                className="rounded border border-brand/20 bg-brand-light px-3.5 py-1.5 text-[13px] font-medium text-brand transition-all duration-150 hover:border-brand/40 hover:bg-brand/15"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ──────────────────── RECENTLY PASSED ON ──────────────────── */}
      <section className="bg-surface px-4 py-14">
        <div className="mx-auto max-w-6xl">
          <div className="mb-7 flex items-end justify-between px-2">
            <div>
              <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.14em] text-brand">
                Just listed
              </p>
              <h2 className="font-display text-[1.6rem] font-bold text-ink md:text-[2rem]">
                Recently Passed On
              </h2>
            </div>
            <Link
              href="/books"
              className="flex items-center gap-1.5 rounded border border-border bg-surface-raised px-4 py-2 text-[13px] font-semibold text-ink-muted shadow-sm transition-all duration-150 hover:border-border-strong hover:text-ink"
            >
              View all <ArrowRight size={13} />
            </Link>
          </div>

          <RecentBooksErrorBoundary>
            <Suspense fallback={<SkeletonGrid />}>
              <RecentBooks />
            </Suspense>
          </RecentBooksErrorBoundary>

          <div className="mt-8 text-center">
            <Link
              href="/books"
              className="group inline-flex items-center gap-2 rounded border border-border bg-surface-raised px-6 py-2.5 text-[14px] font-semibold text-ink-muted shadow-sm transition-all duration-150 hover:border-border-strong hover:text-ink"
            >
              Browse all books
              <ArrowRight size={14} className="transition-transform duration-150 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ──────────────────── CTA BANNER ──────────────────── */}
      <section className="px-4 pb-14 md:px-6">
        <div className="mx-auto max-w-6xl overflow-hidden rounded-lg bg-brand px-8 py-14 text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-accent-mid">
            For sellers
          </p>
          <h2 className="mt-3 font-display text-[1.8rem] font-bold text-white md:text-[2.4rem]">
            Have books that deserve a second chapter?
          </h2>
          <p className="mx-auto mt-4 max-w-md text-[15px] leading-relaxed text-white/60">
            List them in minutes. Let them find someone new.
          </p>
          <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/sell"
              className="group flex items-center gap-2 rounded bg-white px-7 py-3 text-[14px] font-bold text-ink transition-all duration-150 hover:bg-white/90"
            >
              List a Book — it&apos;s free
              <ArrowRight size={13} className="transition-transform duration-150 group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/books"
              className="rounded border border-white/20 px-7 py-3 text-[14px] font-medium text-white/70 transition-all duration-150 hover:border-white/40 hover:text-white"
            >
              Browse books
            </Link>
          </div>
        </div>
      </section>

      {/* ──────────────────── SUSTAINABILITY STATEMENT ──────────────────── */}
      <div className="bg-surface px-6 py-8 text-center">
        <p className="mx-auto max-w-md font-serif text-[15px] italic leading-relaxed text-ink-muted">
          &ldquo;Every second-hand book purchased is one that didn&apos;t need to be printed.&rdquo;
        </p>
      </div>

      {/* ──────────────────── WHY LHASA BOOKS ──────────────────── */}
      <section className="bg-surface-raised px-6 pb-20">
        <div className="mx-auto max-w-5xl">
          <div className="mb-8 text-center">
            <h2 className="font-display text-[1.6rem] font-bold text-ink md:text-[2rem]">
              Why Lhasa Books?
            </h2>
            <p className="mx-auto mt-2 max-w-sm text-[14px] text-ink-muted">
              Built for Lohit district. No VC funding, no growth hacks — just a clean, honest community marketplace.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-4">
            {features.map(({ icon: Icon, title, desc, cardBg, iconBg, iconColor }) => (
              <div key={title} className={`rounded-lg border border-border p-5 ${cardBg}`}>
                <div className={`mb-3.5 flex h-9 w-9 items-center justify-center rounded ${iconBg}`}>
                  <Icon size={16} className={iconColor} strokeWidth={2} />
                </div>
                <h3 className="text-[14px] font-bold text-ink">{title}</h3>
                <p className="mt-1.5 text-[12px] leading-relaxed text-ink-muted">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
