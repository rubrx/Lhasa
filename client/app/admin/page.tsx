"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { CheckCircle, XCircle, BookOpen, Shield } from "lucide-react";
import { getPendingBooks, reviewBook } from "@/lib/api";
import { Book } from "@/lib/types";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";
import { formatPrice, timeAgo, cloudinaryOptimize } from "@/lib/utils";

export default function AdminPage() {
  const { isAuthenticated, isAdmin, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<number | null>(null);
  const [rejectReason, setRejectReason] = useState<Record<number, string>>({});

  useEffect(() => {
    if (!authLoading && (!isAuthenticated || !isAdmin)) {
      router.push("/");
    }
  }, [isAuthenticated, isAdmin, authLoading, router]);

  useEffect(() => {
    if (!isAdmin) return;
    getPendingBooks()
      .then((r) => setBooks(r.books))
      .catch(() => toast.error("Failed to load pending books"))
      .finally(() => setLoading(false));
  }, [isAdmin]);

  const handleReview = async (
    bookId: number,
    decision: "APPROVED" | "REJECTED"
  ) => {
    const reason = rejectReason[bookId];
    if (decision === "REJECTED" && !reason?.trim()) {
      toast.error("Provide a rejection reason");
      return;
    }

    setProcessingId(bookId);
    try {
      await reviewBook(bookId, decision, reason);
      setBooks((prev) => prev.filter((b) => b.id !== bookId));
      toast.success(
        decision === "APPROVED" ? "Book approved and live!" : "Book rejected"
      );
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Action failed");
    } finally {
      setProcessingId(null);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-accent border-t-transparent" />
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-light">
          <Shield size={18} className="text-accent" />
        </div>
        <div>
          <h1 className="font-serif text-2xl font-semibold text-ink">
            Admin Panel
          </h1>
          <p className="text-sm text-ink-muted">
            {books.length} book{books.length !== 1 ? "s" : ""} pending review
          </p>
        </div>
      </div>

      {books.length === 0 ? (
        <div className="rounded-2xl border border-border bg-surface-raised px-6 py-16 text-center">
          <CheckCircle
            size={40}
            className="mx-auto mb-4 text-accent"
            strokeWidth={1}
          />
          <p className="font-medium text-ink">All caught up!</p>
          <p className="mt-1 text-sm text-ink-muted">No pending listings.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {books.map((book) => {
            const cover = book.images[0]
              ? cloudinaryOptimize(book.images[0], 200)
              : null;
            const isProcessing = processingId === book.id;

            return (
              <div
                key={book.id}
                className="overflow-hidden rounded-2xl border border-border bg-surface-raised"
              >
                <div className="flex gap-4 p-5">
                  {/* Cover */}
                  <div className="relative h-24 w-16 flex-shrink-0 overflow-hidden rounded-xl bg-accent-light">
                    {cover ? (
                      <Image
                        src={cover}
                        alt={book.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <BookOpen
                          size={20}
                          className="text-accent"
                          strokeWidth={1}
                        />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 space-y-1">
                    <p className="font-medium text-ink">{book.name}</p>
                    <p className="text-sm text-ink-muted">by {book.author}</p>
                    <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-ink-muted">
                      <span>{formatPrice(book.price)}</span>
                      <span>{book.condition.replace("_", " ")}</span>
                      <span>{book.category}</span>
                      <span>{timeAgo(book.createdAt)}</span>
                    </div>
                    {book.description && (
                      <p className="mt-1 text-xs text-ink-muted line-clamp-2">
                        {book.description}
                      </p>
                    )}

                    {/* Seller */}
                    <div className="mt-2 rounded-lg bg-surface px-3 py-2">
                      <p className="text-xs font-medium text-ink">
                        {book.Seller.name}
                      </p>
                      <p className="text-xs text-ink-muted">
                        {book.Seller.email} · {book.Seller.phone}
                      </p>
                    </div>
                  </div>
                </div>

                {/* All images */}
                {book.images.length > 0 && (
                  <div className="flex gap-2 overflow-x-auto border-t border-border px-5 py-3">
                    {book.images.map((img, i) => (
                      <div
                        key={i}
                        className="relative h-16 w-12 flex-shrink-0 overflow-hidden rounded-lg"
                      >
                        <Image
                          src={cloudinaryOptimize(img, 100)}
                          alt={`Photo ${i + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* Actions */}
                <div className="border-t border-border bg-surface/50 p-4 space-y-3">
                  <textarea
                    value={rejectReason[book.id] || ""}
                    onChange={(e) =>
                      setRejectReason((prev) => ({
                        ...prev,
                        [book.id]: e.target.value,
                      }))
                    }
                    placeholder="Rejection reason (required only if rejecting)"
                    rows={2}
                    className="w-full resize-none rounded-xl border border-border bg-surface-raised px-3 py-2 text-sm text-ink placeholder:text-ink-muted outline-none focus:border-accent"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleReview(book.id, "APPROVED")}
                      disabled={isProcessing}
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent/90 disabled:opacity-50"
                    >
                      <CheckCircle size={15} />
                      Approve
                    </button>
                    <button
                      onClick={() => handleReview(book.id, "REJECTED")}
                      disabled={isProcessing}
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-100 disabled:opacity-50"
                    >
                      <XCircle size={15} />
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
