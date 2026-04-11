"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { BookOpen, PlusCircle, Home, User } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { cloudinaryOptimize, cn } from "@/lib/utils";

const items = [
  { href: "/",        icon: Home,      label: "Home" },
  { href: "/books",   icon: BookOpen,  label: "Browse" },
  { href: "/sell",    icon: PlusCircle, label: "Sell" },
  { href: "/profile", icon: User,      label: "Account" },
];

export default function BottomNav() {
  const pathname = usePathname();
  const { user, isAuthenticated } = useAuth();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex border-t border-border/70 bg-surface/95 backdrop-blur-xl md:hidden">
      {items.map(({ href, icon: Icon, label }) => {
        const isActive = pathname === href || (href === "/profile" && pathname === "/dashboard");
        const isAccount = href === "/profile";

        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex flex-1 flex-col items-center justify-center gap-0.5 py-2 text-xs transition-colors",
              isActive ? "text-accent" : "text-ink-muted"
            )}
          >
            <div
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-2xl transition-all duration-200",
                isActive ? "bg-accent/10" : "bg-transparent"
              )}
            >
              {isAccount && isAuthenticated && user ? (
                <div className="flex h-6 w-6 items-center justify-center overflow-hidden rounded-full bg-accent">
                  {user.profileImg ? (
                    <Image
                      src={cloudinaryOptimize(user.profileImg, 48)}
                      alt={user.name}
                      width={24}
                      height={24}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-[10px] font-bold text-white">
                      {user.name[0]?.toUpperCase()}
                    </span>
                  )}
                </div>
              ) : (
                <Icon size={20} strokeWidth={isActive ? 2.2 : 1.5} className="transition-all" />
              )}
            </div>
            <span className={cn("text-[10px]", isActive ? "font-bold" : "font-medium")}>
              {label}
            </span>
            {isActive && <span className="mt-0.5 h-1 w-4 rounded-full bg-accent" />}
          </Link>
        );
      })}
    </nav>
  );
}
