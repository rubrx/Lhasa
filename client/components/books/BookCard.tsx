import Link from "next/link";
import Image from "next/image";
import { Book, BookCondition } from "@/lib/types";
import { cn, timeAgo, formatPrice, cloudinaryOptimize } from "@/lib/utils";
import { Eye } from "lucide-react";

const conditionMap: Record<BookCondition, { label: string; className: string }> = {
  LIKE_NEW: { label: "Pristine",    className: "bg-condition-new-bg text-condition-new" },
  GOOD:     { label: "Gently Read", className: "bg-condition-good-bg text-condition-good" },
  POOR:     { label: "Well Loved",  className: "bg-condition-poor-bg text-condition-poor" },
};

function BookPlaceholder({ title }: { title: string }) {
  const initials = title
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
  return (
    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-brand-light to-surface-paper">
      <span className="font-display text-4xl font-bold text-brand/25">{initials}</span>
    </div>
  );
}

export default function BookCard({ book }: { book: Book }) {
  const condition = conditionMap[book.condition];
  const coverUrl = book.images[0] ? cloudinaryOptimize(book.images[0], 400) : null;

  return (
    <Link href={`/books/${book.id}`} className="group block">
      <article className="overflow-hidden rounded-lg border border-border bg-surface-raised transition-shadow duration-200 hover:shadow-[0_4px_20px_rgba(20,15,10,0.10)]">

        {/* Cover */}
        <div className="relative aspect-[3/4] overflow-hidden bg-surface-muted">
          {coverUrl ? (
            <Image
              src={coverUrl}
              alt={book.name}
              fill
              className="object-cover transition-transform duration-400 group-hover:scale-[1.025]"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              loading="lazy"
            />
          ) : (
            <BookPlaceholder title={book.name} />
          )}

          {/* Hover overlay — warm dark tint */}
          <div className="absolute inset-0 flex items-center justify-center bg-ink/0 transition-all duration-250 group-hover:bg-ink/20">
            <div className="flex items-center gap-1.5 rounded bg-white/95 px-3 py-1.5 text-[11px] font-semibold text-ink opacity-0 shadow-sm transition-opacity duration-200 group-hover:opacity-100">
              <Eye size={11} />
              View book
            </div>
          </div>

          {/* Condition badge — design token colors, rectangular not pill */}
          <span className={cn("absolute left-2.5 top-2.5 rounded px-2 py-0.5 text-[10px] font-bold shadow-sm", condition.className)}>
            {condition.label}
          </span>
        </div>

        {/* Info */}
        <div className="p-3.5">
          <p className="truncate text-[13px] font-semibold leading-snug text-ink">{book.name}</p>
          <p className="mt-0.5 truncate text-[12px] font-medium text-ink-muted">{book.author}</p>

          <div className="mt-3 flex items-end justify-between gap-1">
            <span className="font-display text-[16px] font-bold text-ink">
              {formatPrice(book.price)}
            </span>
            <span className="text-[11px] text-ink-subtle">{timeAgo(book.createdAt)}</span>
          </div>

          <div className="mt-2 flex items-center gap-1.5 border-t border-border/60 pt-2">
            <div className="flex h-4 w-4 items-center justify-center rounded-full bg-brand-light text-[9px] font-black text-brand">
              {book.Seller.name[0].toUpperCase()}
            </div>
            <p className="text-[11px] font-medium text-ink-subtle">
              {book.Seller.name.split(" ")[0]} · {book.Seller.district}
            </p>
          </div>
        </div>

      </article>
    </Link>
  );
}
