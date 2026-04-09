"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, BookOpen } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/",       label: "Home" },
  { href: "/books",  label: "Browse" },
  { href: "/sell",   label: "Sell" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 hidden border-b border-border bg-white md:block">
      <div className="mx-auto flex h-[72px] max-w-6xl items-center justify-between px-6">

        {/* ── Logo ── */}
        <Link href="/" className="group flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent transition-all duration-200 group-hover:scale-95 group-hover:bg-accent-hover">
            <BookOpen size={17} className="text-white" strokeWidth={2.2} />
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-serif text-[20px] font-bold tracking-tight text-ink">
              Lhasa
            </span>
            <span className="text-[10px] font-medium uppercase tracking-[0.12em] text-ink-subtle">
              Books · Local
            </span>
          </div>
        </Link>

        {/* ── Nav links ── */}
        <nav className="flex items-center gap-1">
          {navLinks.map(({ href, label }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "rounded-lg px-4 py-2.5 text-[15px] font-medium transition-all duration-150",
                  isActive
                    ? "text-ink"
                    : "text-ink-muted hover:text-ink hover:bg-surface-muted"
                )}
              >
                {label}
              </Link>
            );
          })}
          {isAuthenticated && (
            <>
              <Link
                href="/dashboard"
                className={cn(
                  "rounded-lg px-4 py-2.5 text-[15px] font-medium transition-all duration-150",
                  pathname === "/dashboard"
                    ? "text-ink"
                    : "text-ink-muted hover:text-ink hover:bg-surface-muted"
                )}
              >
                My Books
              </Link>
              {isAdmin && (
                <Link
                  href="/admin"
                  className={cn(
                    "rounded-lg px-4 py-2.5 text-[15px] font-medium transition-all duration-150",
                    pathname === "/admin"
                      ? "text-ink"
                      : "text-ink-muted hover:text-ink hover:bg-surface-muted"
                  )}
                >
                  Admin
                </Link>
              )}
            </>
          )}
        </nav>

        {/* ── Auth ── */}
        <div className="flex items-center gap-2.5">
          {isAuthenticated ? (
            <>
              <span className="text-[15px] font-medium text-ink-muted">
                {user?.name.split(" ")[0]}
              </span>
              <button
                onClick={logout}
                className="flex items-center gap-1.5 rounded-lg border border-border px-3.5 py-2 text-[14px] font-medium text-ink-muted transition-all duration-150 hover:border-border-strong hover:text-ink"
              >
                <LogOut size={14} />
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-lg px-4 py-2.5 text-[15px] font-medium text-ink-muted transition-colors duration-150 hover:text-ink"
              >
                Log in
              </Link>
              <Link
                href="/sell"
                className="rounded-xl bg-accent px-5 py-2.5 text-[15px] font-semibold text-white shadow-sm transition-all duration-150 hover:bg-accent-hover hover:shadow-md"
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
