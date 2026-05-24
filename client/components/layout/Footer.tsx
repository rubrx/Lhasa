"use client";

import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin, ArrowUpRight } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

const exploreLinks = [
  { href: "/books",   label: "Browse Books" },
  { href: "/sell",    label: "Sell a Book" },
  { href: "/contact", label: "Contact Us" },
];

const guestAccountLinks = [
  { href: "/login",    label: "Log In" },
  { href: "/register", label: "Create Account" },
];

const authAccountLinks = [
  { href: "/dashboard", label: "My Listings" },
  { href: "/profile",   label: "My Profile" },
];

export default function Footer() {
  const { isAuthenticated } = useAuth();
  const accountLinks = isAuthenticated ? authAccountLinks : guestAccountLinks;
  return (
    <footer className="border-t border-border bg-surface-paper">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 md:grid-cols-4">

          {/* Brand */}
          <div className="sm:col-span-2 md:col-span-1">
            <Link href="/" className="group inline-flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-lg bg-brand-light p-1.5 transition-all duration-200 group-hover:bg-brand/15">
                <Image src="/logo.svg" alt="Lhasa Books" width={28} height={28} />
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-display text-[19px] font-bold tracking-tight text-ink">Lhasa Books</span>
                <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-ink-subtle">Lohit District</span>
              </div>
            </Link>
            <p className="mt-4 max-w-[220px] text-[13px] leading-relaxed text-ink-muted">
              Where books find their next reader, a community marketplace for Lohit district. No fees, no commissions.
            </p>
            <div className="mt-5 flex items-center gap-1.5">
              <MapPin size={12} className="shrink-0 text-brand" />
              <span className="text-[12px] font-medium text-ink-subtle">Lohit, Arunachal Pradesh</span>
            </div>
          </div>

          {/* Explore */}
          <div>
            <p className="mb-5 text-[11px] font-extrabold uppercase tracking-[0.14em] text-ink-subtle">
              Explore
            </p>
            <ul className="space-y-3">
              {exploreLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="group flex items-center gap-1 text-[14px] font-medium text-ink-muted transition-colors hover:text-ink"
                  >
                    {label}
                    <ArrowUpRight size={12} className="opacity-0 transition-opacity group-hover:opacity-50" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <p className="mb-5 text-[11px] font-extrabold uppercase tracking-[0.14em] text-ink-subtle">
              Account
            </p>
            <ul className="space-y-3">
              {accountLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="group flex items-center gap-1 text-[14px] font-medium text-ink-muted transition-colors hover:text-ink"
                  >
                    {label}
                    <ArrowUpRight size={12} className="opacity-0 transition-opacity group-hover:opacity-50" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="mb-5 text-[11px] font-extrabold uppercase tracking-[0.14em] text-ink-subtle">
              Get in touch
            </p>
            <ul className="space-y-4">
              <li>
                <a
                  href="mailto:rubrangsokri07@gmail.com"
                  className="flex items-start gap-2.5 text-[13px] font-medium text-ink-muted transition-colors hover:text-ink"
                >
                  <Mail size={14} className="mt-0.5 shrink-0 text-brand" />
                  <span className="break-all">rubrangsokri07@gmail.com</span>
                </a>
              </li>
              <li>
                <a
                  href="tel:+918259906585"
                  className="flex items-center gap-2.5 text-[13px] font-medium text-ink-muted transition-colors hover:text-ink"
                >
                  <Phone size={14} className="shrink-0 text-brand" />
                  +91 82599 06585
                </a>
              </li>
            </ul>
            <p className="mt-4 text-[12px] leading-relaxed text-ink-subtle">
              Bug report? Feedback? We read every message.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <p className="text-[12px] font-medium text-ink-subtle">
            © {new Date().getFullYear()} Lhasa · Lohit district
          </p>
          <p className="text-[12px] font-medium text-ink-subtle">
            Where books find their next reader.
          </p>
        </div>
      </div>
    </footer>
  );
}
