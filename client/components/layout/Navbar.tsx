"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { MessageCircle, Plus } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { cloudinaryOptimize, cn } from "@/lib/utils";

const baseNavLinks = [
  { href: "/",      label: "Home" },
  { href: "/books", label: "Browse" },
];

export default function Navbar() {
  const { user, isAuthenticated, isAdmin } = useAuth();
  const pathname = usePathname();

  const navLinks = [
    ...baseNavLinks,
    ...(isAuthenticated ? [{ href: "/dashboard", label: "My Books" }] : []),
    ...(isAdmin ? [{ href: "/admin", label: "Admin" }] : []),
  ];

  return (
    <header className="sticky top-0 z-50 hidden border-b border-border bg-surface/95 backdrop-blur-sm md:block">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-6">

        {/* ── Logo ── */}
        <Link href="/" className="group flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-lg bg-accent-light p-1.5 transition-all duration-200 group-hover:bg-accent/15">
            <Image src="/logo.svg" alt="Lhasa Books" width={28} height={28} />
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-display text-[19px] font-bold tracking-tight text-ink">
              Lhasa Books
            </span>
            <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-ink-subtle">
              Lohit District
            </span>
          </div>
        </Link>

        {/* ── Nav links ── */}
        <nav className="flex items-center gap-0.5">
          {navLinks.map(({ href, label }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "px-4 py-2.5 text-[14px] font-medium transition-colors duration-150",
                  isActive
                    ? "text-brand"
                    : "text-ink-muted hover:text-ink"
                )}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        {/* ── Auth ── */}
        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <>
              <Link
                href="/sell"
                className="flex items-center gap-1.5 rounded px-3 py-2 text-[13px] font-medium text-ink-muted transition-colors duration-150 hover:text-ink"
              >
                <Plus size={13} strokeWidth={2.5} />
                List
              </Link>
              <Link
                href="/contact"
                className={cn(
                  "flex items-center gap-1.5 rounded border border-border px-3 py-2 text-[13px] font-medium transition-all duration-150 hover:border-border-strong hover:text-ink",
                  pathname === "/contact" ? "border-brand/30 text-brand" : "text-ink-muted"
                )}
              >
                <MessageCircle size={13} />
                Contact
              </Link>
              <Link
                href="/profile"
                title={user?.name}
                className="relative ml-1 flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-brand ring-2 ring-transparent transition-all duration-200 hover:ring-brand/25"
              >
                {user?.profileImg ? (
                  <Image
                    src={cloudinaryOptimize(user.profileImg, 64)}
                    alt={user.name}
                    width={32}
                    height={32}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-[13px] font-semibold text-white">
                    {user?.name[0]?.toUpperCase()}
                  </span>
                )}
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="px-4 py-2.5 text-[14px] font-medium text-ink-muted transition-colors duration-150 hover:text-ink"
              >
                Log in
              </Link>
              <Link
                href="/sell"
                className="rounded bg-accent px-5 py-2.5 text-[14px] font-semibold text-white transition-all duration-150 hover:bg-accent-hover"
              >
                List a Book
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
