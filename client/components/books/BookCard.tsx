import Link from "next/link";
import Image from "next/image";
import { Book, BookCondition } from "@/lib/types";
import { cn, timeAgo, formatPrice, cloudinaryOptimize } from "@/lib/utils";
import { Eye } from "lucide-react";

const conditionMap: Record<BookCondition, { label: string; className: string }> = {
  LIKE_NEW: { label: "Like New", className: "bg-emerald-100 text-emerald-700" },
  GOOD:     { label: "Good",     className: "bg-amber-100  text-amber-700"   },
  POOR:     { label: "Fair",     className: "bg-stone-100  text-stone-600"   },
};

function BookPlaceholder({ title }: { title: string }) {
  const initials = title
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
  return (
    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-accent-light to-emerald-100">
      <span className="font-serif text-4xl font-bold text-accent/40">{initials}</span>
    </div>
  );
}

export default function BookCard({ book }: { book: Book }) {
  const condition = conditionMap[book.condition];
  const coverUrl = book.images[0] ? cloudinaryOptimize(book.images[0], 400) : null;

  return (
    <Link href={`/books/${book.id}`} className="group block">
      <article className="overflow-hidden rounded-2xl border border-border bg-white transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_12px_40px_rgba(0,0,0,0.12)]">
        {/* Cover */}
        <div className="relative aspect-[3/4] overflow-hidden bg-surface-muted">
          {coverUrl ? (
            <Image
              src={coverUrl}
              alt={book.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              loading="lazy"
            />
          ) : (
            <BookPlaceholder title={book.name} />
          )}

          {/* Hover overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-ink/0 transition-all duration-300 group-hover:bg-ink/25">
            <div className="flex items-center gap-1.5 rounded-full bg-white/95 px-3.5 py-1.5 text-[12px] font-semibold text-ink opacity-0 shadow-md backdrop-blur-sm transition-opacity duration-200 group-hover:opacity-100">
              <Eye size={12} />
              View book
            </div>
          </div>

          {/* Condition badge */}
          <span className={cn("absolute left-2.5 top-2.5 rounded-full px-2.5 py-1 text-[11px] font-bold shadow-sm", condition.className)}>
            {condition.label}
          </span>
        </div>

        {/* Info */}
        <div className="p-4">
          <p className="truncate text-[14px] font-bold leading-snug text-ink">{book.name}</p>
          <p className="mt-0.5 truncate text-[12px] font-medium text-ink-muted">{book.author}</p>
          <div className="mt-3 flex items-end justify-between gap-1">
            <span className="font-serif text-[17px] font-bold text-ink">
              {formatPrice(book.price)}
            </span>
            <span className="text-[11px] text-ink-subtle">{timeAgo(book.createdAt)}</span>
          </div>
          <div className="mt-2 flex items-center gap-1.5">
            <div className="flex h-4 w-4 items-center justify-center rounded-full bg-accent-light text-[9px] font-black text-accent">
              {book.Seller.name[0].toUpperCase()}
            </div>
            <p className="text-[11px] font-medium text-ink-muted">
              {book.Seller.name.split(" ")[0]} · {book.Seller.district}
            </p>
          </div>
        </div>
      </article>
    </Link>
  );
}
