"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  MessageCircle,
  Copy,
  Check,
  Phone,
  AlertCircle,
} from "lucide-react";
import { getBookById, createInquiry } from "@/lib/api";
import { Book, BookCondition } from "@/lib/types";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";
import {
  cn,
  timeAgo,
  formatPrice,
  cloudinaryOptimize,
} from "@/lib/utils";

const conditionMap: Record<
  BookCondition,
  { label: string; className: string }
> = {
  LIKE_NEW: {
    label: "Like New",
    className: "bg-condition-new-bg text-condition-new",
  },
  GOOD: {
    label: "Good",
    className: "bg-condition-good-bg text-condition-good",
  },
  POOR: {
    label: "Fair",
    className: "bg-condition-poor-bg text-condition-poor",
  },
};

const categoryLabels: Record<string, string> = {
  TEXTBOOK: "Textbook",
  NOVEL: "Novel",
  COMPETITIVE: "Competitive Exam",
  LITERATURE: "Literature",
  OTHER: "Other",
};

export default function BookDetailClient({ id }: { id: string }) {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [contactRevealed, setContactRevealed] = useState(false);
  const [sendingInquiry, setSendingInquiry] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);

  useEffect(() => {
    if (!id) return;
    getBookById(Number(id))
      .then((r) => setBook(r.book))
      .catch(() => toast.error("Book not found"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleInterest = async () => {
    if (authLoading) return;

    if (!isAuthenticated) {
      router.push(`/login?redirect=/books/${id}`);
      return;
    }

    if (contactRevealed) return;

    setSendingInquiry(true);
    try {
      await createInquiry(Number(id), "I am interested in this book.");
    } catch {
      // Inquiry may already exist — that's fine, still reveal contact
    } finally {
      setSendingInquiry(false);
      setContactRevealed(true);
    }
  };

  const handleCopyPhone = (phone: string) => {
    navigator.clipboard.writeText(phone);
    setCopiedPhone(true);
    toast.success("Phone number copied");
    setTimeout(() => setCopiedPhone(false), 2000);
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-24 rounded bg-border" />
          <div className="grid gap-8 md:grid-cols-[2fr_3fr]">
            <div className="aspect-[3/4] rounded-2xl bg-border" />
            <div className="space-y-3">
              <div className="h-8 w-3/4 rounded bg-border" />
              <div className="h-5 w-1/2 rounded bg-border" />
              <div className="h-10 w-1/3 rounded bg-border" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center">
        <AlertCircle
          size={40}
          className="mx-auto mb-4 text-border"
          strokeWidth={1}
        />
        <p className="font-medium text-ink">Book not found</p>
        <Link
          href="/books"
          className="mt-4 inline-flex rounded-xl bg-accent px-5 py-2.5 text-sm font-medium text-white"
        >
          Browse all books
        </Link>
      </div>
    );
  }

  const condition = conditionMap[book.condition];

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 md:py-10">
      {/* Back */}
      <Link
        href="/books"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-ink-muted transition-colors hover:text-ink"
      >
        <ArrowLeft size={15} />
        Back to books
      </Link>

      <div className="grid gap-8 md:grid-cols-[2fr_3fr]">
        {/* Image gallery */}
        <div className="space-y-3">
          <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-accent-light">
            {book.images[activeImage] ? (
              <Image
                src={cloudinaryOptimize(book.images[activeImage], 600)}
                alt={book.name}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <span className="font-serif text-5xl font-semibold text-accent opacity-50">
                  {book.name.slice(0, 2).toUpperCase()}
                </span>
              </div>
            )}
          </div>
          {/* Thumbnails */}
          {book.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {book.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={cn(
                    "relative h-16 w-12 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all",
                    i === activeImage
                      ? "border-accent"
                      : "border-transparent opacity-60 hover:opacity-100"
                  )}
                >
                  <Image
                    src={cloudinaryOptimize(img, 100)}
                    alt={`View ${i + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Book info */}
        <div className="flex flex-col">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span
              className={cn(
                "rounded-full px-2.5 py-0.5 text-xs font-medium",
                condition.className
              )}
            >
              {condition.label}
            </span>
            <span className="rounded-full border border-border px-2.5 py-0.5 text-xs text-ink-muted">
              {categoryLabels[book.category] || book.category}
            </span>
            {book.status === "SOLD" && (
              <span className="rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-medium text-red-600">
                Sold
              </span>
            )}
          </div>

          <h1 className="font-serif text-2xl font-semibold leading-snug text-ink md:text-3xl">
            {book.name}
          </h1>
          <p className="mt-1 text-base text-ink-muted">by {book.author}</p>

          <p className="mt-4 font-serif text-4xl font-semibold text-ink">
            {formatPrice(book.price)}
          </p>

          {book.description && (
            <p className="mt-4 text-sm leading-relaxed text-ink-muted">
              {book.description}
            </p>
          )}

          {/* Seller info */}
          <div className="mt-6 rounded-xl border border-border bg-surface-raised p-4">
            <p className="mb-1 text-xs font-medium uppercase tracking-wider text-ink-muted">
              Listed by
            </p>
            <p className="font-medium text-ink">{book.Seller.name}</p>
            <div className="mt-1 flex items-center gap-3 text-xs text-ink-muted">
              <span className="flex items-center gap-1">
                <MapPin size={11} /> {book.Seller.district}
              </span>
              <span className="flex items-center gap-1">
                <Calendar size={11} /> {timeAgo(book.createdAt)}
              </span>
            </div>
          </div>

          {/* Contact reveal */}
          <div className="mt-4">
            {book.status === "SOLD" ? (
              <div className="rounded-xl border border-border bg-surface-raised p-4 text-center text-sm text-ink-muted">
                This book has already been sold.
              </div>
            ) : !contactRevealed ? (
              <button
                onClick={handleInterest}
                disabled={sendingInquiry || authLoading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-6 py-3.5 text-sm font-medium text-white transition-colors hover:bg-accent/90 disabled:opacity-60"
              >
                <MessageCircle size={16} />
                {sendingInquiry
                  ? "Connecting…"
                  : isAuthenticated
                    ? "I'm interested — show contact"
                    : "Log in to contact seller"}
              </button>
            ) : (
              <div className="space-y-2.5 rounded-xl border border-accent/30 bg-accent-light p-4">
                <p className="text-xs font-medium text-accent">
                  Seller contact revealed
                </p>
                {book.Seller.phone && (
                  <>
                    <a
                      href={`https://wa.me/91${book.Seller.phone.replace(/\D/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#25D366] px-4 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                      Message on WhatsApp
                    </a>
                    <button
                      onClick={() => handleCopyPhone(book.Seller.phone!)}
                      className="flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-surface-raised px-4 py-2 text-sm text-ink transition-colors hover:bg-border"
                    >
                      {copiedPhone ? (
                        <Check size={14} className="text-accent" />
                      ) : (
                        <Copy size={14} />
                      )}
                      <Phone size={13} />
                      {book.Seller.phone}
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Disclaimer */}
          {contactRevealed && (
            <p className="mt-3 text-xs leading-relaxed text-ink-muted">
              Payment and delivery are handled directly between buyer and seller.
              Lhasa is not involved in the transaction.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
