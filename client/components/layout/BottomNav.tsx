"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { BookOpen, Home, User, Plus } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { cloudinaryOptimize, cn } from "@/lib/utils";

export default function BottomNav() {
  const pathname = usePathname();
  const { user, isAuthenticated } = useAuth();

  const linkClass = (href: string) =>
    cn(
      "flex flex-1 flex-col items-center justify-center gap-0.5 py-2.5 transition-colors",
      pathname === href || (href === "/profile" && pathname === "/dashboard")
        ? "text-brand"
        : "text-ink-muted"
    );

  const isActive = (href: string) =>
    pathname === href || (href === "/profile" && pathname === "/dashboard");

  const IconPill = ({ active }: { active: boolean }) => (
    <div
      className={cn(
        "flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-200",
        active ? "bg-brand/10" : "bg-transparent"
      )}
    />
  );

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-stretch border-t border-border/70 bg-surface/95 backdrop-blur-xl md:hidden">

      {/* Home */}
      <Link href="/" className={linkClass("/")}>
        <div className={cn("flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-200", isActive("/") ? "bg-brand/10" : "")}>
          <Home size={19} strokeWidth={isActive("/") ? 2.2 : 1.5} />
        </div>
        <span className={cn("text-[10px]", isActive("/") ? "font-semibold" : "font-medium")}>Home</span>
        {isActive("/") && <span className="mt-0.5 h-0.5 w-3 rounded-full bg-brand" />}
      </Link>

      {/* Browse */}
      <Link href="/books" className={linkClass("/books")}>
        <div className={cn("flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-200", isActive("/books") ? "bg-brand/10" : "")}>
          <BookOpen size={19} strokeWidth={isActive("/books") ? 2.2 : 1.5} />
        </div>
        <span className={cn("text-[10px]", isActive("/books") ? "font-semibold" : "font-medium")}>Browse</span>
        {isActive("/books") && <span className="mt-0.5 h-0.5 w-3 rounded-full bg-brand" />}
      </Link>

      {/* List a Book — floating action button */}
      <Link href="/sell" className="flex flex-1 flex-col items-center justify-end pb-2.5">
        <div className="-mt-5 flex h-12 w-12 items-center justify-center rounded-full bg-accent shadow-md ring-4 ring-surface/95 transition-transform duration-150 active:scale-95">
          <Plus size={20} strokeWidth={2.5} className="text-white" />
        </div>
        <span className="mt-1 text-[10px] font-medium text-accent">List</span>
      </Link>

      {/* Account */}
      <Link
        href="/profile"
        className={cn(
          "flex flex-1 flex-col items-center justify-center gap-0.5 py-2.5 transition-colors",
          isActive("/profile") ? "text-brand" : "text-ink-muted"
        )}
      >
        <div className={cn("flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-200", isActive("/profile") ? "bg-brand/10" : "")}>
          {isAuthenticated && user ? (
            <div className="flex h-6 w-6 items-center justify-center overflow-hidden rounded-full bg-brand">
              {user.profileImg ? (
                <Image
                  src={cloudinaryOptimize(user.profileImg, 48)}
                  alt={user.name}
                  width={24}
                  height={24}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-[10px] font-semibold text-white">
                  {user.name[0]?.toUpperCase()}
                </span>
              )}
            </div>
          ) : (
            <User size={19} strokeWidth={isActive("/profile") ? 2.2 : 1.5} />
          )}
        </div>
        <span className={cn("text-[10px]", isActive("/profile") ? "font-semibold" : "font-medium")}>
          Account
        </span>
        {isActive("/profile") && <span className="mt-0.5 h-0.5 w-3 rounded-full bg-brand" />}
      </Link>

    </nav>
  );
}
