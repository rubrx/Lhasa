"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, PlusCircle, LayoutDashboard, Home } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { href: "/",          icon: Home,            label: "Home" },
  { href: "/books",     icon: BookOpen,        label: "Browse" },
  { href: "/sell",      icon: PlusCircle,      label: "Sell" },
  { href: "/dashboard", icon: LayoutDashboard, label: "Account" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex border-t border-border/70 bg-surface/90 backdrop-blur-xl md:hidden">
      {items.map(({ href, icon: Icon, label }) => {
        const isActive = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex flex-1 flex-col items-center justify-center gap-1 py-3 text-xs transition-colors",
              isActive ? "text-accent" : "text-ink-muted"
            )}
          >
            <Icon
              size={21}
              strokeWidth={isActive ? 2 : 1.5}
              className="transition-transform active:scale-90"
            />
            <span className={cn("font-medium", isActive && "font-semibold")}>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
