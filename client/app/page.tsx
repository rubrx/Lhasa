import { Suspense } from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, MapPin, Shield, Zap, MessageCircle } from "lucide-react";
import SearchHero from "@/components/home/SearchHero";
import RecentBooks from "@/components/home/RecentBooks";
import BookCardSkeleton from "@/components/books/BookCardSkeleton";

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
    accent: "bg-accent-light text-accent",
    num: "text-accent-light",
  },
  {
    step: "02",
    title: "Get approved",
    desc: "We review every listing and publish it within 24 hours. No spam, no fake books.",
    icon: Shield,
    accent: "bg-amber-light text-amber",
    num: "text-amber-light",
  },
  {
    step: "03",
    title: "Connect & sell",
    desc: "Buyers contact you directly via WhatsApp. You meet locally. Zero platform fees — ever.",
    icon: MessageCircle,
    accent: "bg-violet-50 text-violet-600",
    num: "text-violet-100",
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

export default function HomePage() {
  return (
    <div className="overflow-x-hidden">

      {/* ──────────────────── HERO ──────────────────── */}
      <section className="relative overflow-hidden bg-white px-6 pb-20 pt-16 md:pt-24 md:pb-28">
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-0 h-[520px] w-[900px] -translate-x-1/2"
          style={{ background: "radial-gradient(ellipse 70% 55% at 50% 0%, #d6eadd 0%, transparent 70%)" }}
        />

        <div className="relative mx-auto max-w-3xl text-center">
          {/* Live badge */}
          <div className="animate-fade-in mb-7 inline-flex items-center gap-2 rounded-full border border-border bg-white px-4 py-1.5 text-[13px] font-medium text-ink-muted shadow-sm">
            <span className="animate-pulse-dot inline-block h-2 w-2 rounded-full bg-accent" />
            <MapPin size={12} className="text-accent" />
            Lohit district · Arunachal Pradesh
          </div>

          {/* Title */}
          <h1
            className="animate-fade-up font-serif font-bold tracking-tight text-ink"
            style={{ fontSize: "clamp(4.5rem, 15vw, 9rem)", lineHeight: 0.95, animationDelay: "0.04s" }}
          >
            Lhasa
          </h1>

          <p
            className="animate-fade-up mt-5 text-xl font-semibold text-ink md:text-2xl"
            style={{ animationDelay: "0.1s" }}
          >
            Books. Local. Affordable.
          </p>
          <p
            className="animate-fade-up mx-auto mt-3 max-w-[480px] text-[16px] text-ink-muted"
            style={{ lineHeight: 1.7, animationDelay: "0.15s" }}
          >
            Buy and sell used books directly with people around you — no commissions, no middlemen, no fees. Ever.
          </p>

          <div className="animate-fade-up" style={{ animationDelay: "0.2s" }}>
            <SearchHero />
          </div>

          <div
            className="animate-fade-up mt-5 flex flex-col items-center justify-center gap-3 sm:flex-row"
            style={{ animationDelay: "0.26s" }}
          >
            <Link
              href="/books"
              className="group flex w-full items-center justify-center gap-2 rounded-xl bg-ink px-8 py-3.5 text-[15px] font-semibold text-white shadow-sm transition-all duration-200 hover:bg-ink/85 hover:shadow-md sm:w-auto"
            >
              Browse Books
              <ArrowRight size={15} className="transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/sell"
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-white px-8 py-3.5 text-[15px] font-semibold text-ink shadow-sm transition-all duration-200 hover:border-accent/40 hover:bg-accent-light sm:w-auto"
            >
              <BookOpen size={15} className="text-accent" />
              List a Book
            </Link>
          </div>

          <p className="animate-fade-up mt-6 text-[13px] text-ink-subtle" style={{ animationDelay: "0.3s" }}>
            100% free to list · No account fees · Direct WhatsApp contact
          </p>
        </div>
      </section>

      {/* ──────────────────── HOW IT WORKS ──────────────────── */}
      <section className="bg-surface px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 text-center">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.15em] text-accent">
              Simple process
            </p>
            <h2 className="font-serif text-[2rem] font-bold text-ink md:text-[2.6rem]">
              How it works
            </h2>
            <p className="mx-auto mt-3 max-w-md text-[15px] text-ink-muted">
              Three steps from listing to sale. No complexity, no hidden steps.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {steps.map(({ step, title, desc, icon: Icon, accent, num }) => (
              <div
                key={step}
                className="group relative overflow-hidden rounded-2xl border border-border bg-white p-7 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_16px_48px_rgba(0,0,0,0.09)]"
              >
                <span className={`select-none font-serif text-[80px] font-bold leading-none ${num} transition-colors`}>
                  {step}
                </span>
                <div className="mt-4 flex items-center gap-3">
                  <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${accent}`}>
                    <Icon size={16} strokeWidth={2} />
                  </div>
                  <h3 className="text-[16px] font-bold text-ink">{title}</h3>
                </div>
                <p className="mt-2.5 text-[14px] leading-relaxed text-ink-muted">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ──────────────────── CATEGORIES ──────────────────── */}
      <section className="border-y border-border bg-white px-6 py-14">
        <div className="mx-auto max-w-5xl">
          <div className="mb-7 flex items-end justify-between">
            <div>
              <p className="mb-1 text-xs font-bold uppercase tracking-[0.15em] text-accent">
                Genres
              </p>
              <h2 className="font-serif text-[1.6rem] font-bold text-ink">
                Browse by Category
              </h2>
            </div>
            <Link
              href="/books"
              className="flex items-center gap-1.5 text-[14px] font-semibold text-accent transition-colors hover:text-accent-hover"
            >
              See all <ArrowRight size={14} />
            </Link>
          </div>
          <div className="flex flex-wrap gap-2.5">
            {categories.map((label) => (
              <Link
                key={label}
                href={`/books?q=${encodeURIComponent(label)}`}
                className="rounded-full border border-accent/20 bg-accent/10 px-4 py-2 text-[13px] font-semibold text-accent transition-all duration-200 hover:border-accent/35 hover:bg-accent/15"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ──────────────────── RECENT BOOKS ──────────────────── */}
      <section className="bg-surface px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex items-end justify-between px-2">
            <div>
              <p className="mb-1 text-xs font-bold uppercase tracking-[0.15em] text-accent">
                Just listed
              </p>
              <h2 className="font-serif text-[1.8rem] font-bold text-ink md:text-[2.2rem]">
                Recently Listed
              </h2>
            </div>
            <Link
              href="/books"
              className="flex items-center gap-1.5 rounded-xl border border-border bg-white px-4 py-2.5 text-[14px] font-semibold text-ink-muted shadow-sm transition-all duration-200 hover:border-border-strong hover:text-ink"
            >
              View all <ArrowRight size={13} />
            </Link>
          </div>

          <Suspense fallback={<SkeletonGrid />}>
            <RecentBooks />
          </Suspense>
        </div>
      </section>

      {/* ──────────────────── CTA BANNER ──────────────────── */}
      <section className="px-4 pb-16 md:px-6">
        <div className="mx-auto max-w-6xl overflow-hidden rounded-3xl bg-ink px-8 py-16 text-center shadow-xl">
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-accent-mid">
            For sellers
          </p>
          <h2 className="mt-3 font-serif text-[2rem] font-bold text-white md:text-[2.8rem]">
            Have books collecting dust?
          </h2>
          <p className="mx-auto mt-4 max-w-md text-[15px] leading-relaxed text-white/60">
            Turn your shelf into someone else&apos;s adventure. List for free, connect locally, sell directly.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/sell"
              className="group flex items-center gap-2 rounded-xl bg-white px-8 py-3.5 text-[15px] font-bold text-ink transition-all duration-200 hover:bg-white/90"
            >
              Start listing — it&apos;s free
              <ArrowRight size={15} className="transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/books"
              className="rounded-xl border border-white/20 px-8 py-3.5 text-[15px] font-semibold text-white/70 transition-all duration-200 hover:border-white/40 hover:text-white"
            >
              Browse books
            </Link>
          </div>
        </div>
      </section>

      {/* ──────────────────── WHY LHASA ──────────────────── */}
      <section className="bg-white px-6 pb-20">
        <div className="mx-auto max-w-5xl">
          <div className="mb-10 text-center">
            <h2 className="font-serif text-[1.8rem] font-bold text-ink md:text-[2.2rem]">
              Why Lhasa?
            </h2>
            <p className="mx-auto mt-2 max-w-sm text-[15px] text-ink-muted">
              Built for Lohit district. No VC funding, no growth hacks — just a clean, honest marketplace.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
            {[
              { icon: Zap,            title: "Zero Fees",       desc: "No listing fees, no commissions. Keep every rupee you earn.",             bg: "bg-amber-50",    iconColor: "text-amber-600",  iconBg: "bg-amber-100" },
              { icon: MapPin,         title: "Hyper-local",     desc: "Connect with buyers and sellers right in your district.",                  bg: "bg-sky-50",      iconColor: "text-sky-600",    iconBg: "bg-sky-100" },
              { icon: Shield,         title: "Curated",         desc: "Every listing is reviewed before going live. No spam or fake posts.",      bg: "bg-violet-50",   iconColor: "text-violet-600", iconBg: "bg-violet-100" },
              { icon: MessageCircle,  title: "Direct Contact",  desc: "Talk to sellers directly via WhatsApp. No middlemen, no delays.",          bg: "bg-emerald-50",  iconColor: "text-emerald-600",iconBg: "bg-emerald-100" },
            ].map(({ icon: Icon, title, desc, bg, iconColor, iconBg }) => (
              <div key={title} className={`rounded-2xl border border-border p-6 ${bg}`}>
                <div className={`mb-4 flex h-10 w-10 items-center justify-center rounded-xl ${iconBg}`}>
                  <Icon size={18} className={iconColor} strokeWidth={2} />
                </div>
                <h3 className="text-[15px] font-bold text-ink">{title}</h3>
                <p className="mt-1.5 text-[13px] leading-relaxed text-ink-muted">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
