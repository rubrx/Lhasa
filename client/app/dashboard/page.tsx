"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Plus,
  Trash2,
  Clock,
  CheckCircle,
  XCircle,
  BookOpen,
  AlertCircle,
} from "lucide-react";
import { getMyBooks, deleteBook } from "@/lib/api";
import { Book, AdminCheck } from "@/lib/types";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";
import { cn, formatPrice, timeAgo, cloudinaryOptimize } from "@/lib/utils";

const statusConfig: Record<
  AdminCheck,
  { label: string; icon: React.ReactNode; className: string }
> = {
  PENDING: {
    label: "Under review",
    icon: <Clock size={13} />,
    className: "bg-amber-50 text-amber-700 border-amber-200",
  },
  APPROVED: {
    label: "Live",
    icon: <CheckCircle size={13} />,
    className: "bg-condition-new-bg text-condition-new border-condition-new/30",
  },
  REJECTED: {
    label: "Rejected",
    icon: <XCircle size={13} />,
    className: "bg-red-50 text-red-600 border-red-200",
  },
};

export default function DashboardPage() {
  const { isAuthenticated, isLoading: authLoading, user } = useAuth();
  const router = useRouter();

  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login?redirect=/dashboard");
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    if (!isAuthenticated) return;
    getMyBooks()
      .then((r) => setBooks(r.books))
      .catch(() => toast.error("Failed to load books"))
      .finally(() => setLoading(false));
  }, [isAuthenticated]);

  const handleDelete = async (bookId: number, bookName: string) => {
    if (!confirm(`Remove "${bookName}" from your listings?`)) return;
    setDeletingId(bookId);
    try {
      await deleteBook(bookId);
      setBooks((prev) => prev.filter((b) => b.id !== bookId));
      toast.success("Book removed");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete");
    } finally {
      setDeletingId(null);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 rounded bg-border" />
          <div className="grid gap-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-24 w-full rounded-xl border border-border bg-surface-raised"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-ink">
            My Books
          </h1>
          <p className="mt-1 text-sm text-ink-muted">
            Welcome back, {user?.name.split(" ")[0]}.{" "}
            {books.length > 0
              ? `You have ${books.length} listing${books.length !== 1 ? "s" : ""}.`
              : ""}
          </p>
        </div>
        <Link
          href="/sell"
          className="flex items-center gap-1.5 rounded-xl bg-ink px-4 py-2.5 text-sm font-medium text-surface transition-colors hover:bg-ink/80"
        >
          <Plus size={15} />
          <span className="hidden sm:inline">List a book</span>
          <span className="sm:hidden">Add</span>
        </Link>
      </div>

      {/* Stats row */}
      {books.length > 0 && (
        <div className="mb-6 grid grid-cols-3 gap-3">
          {(
            [
              ["APPROVED", "Live"],
              ["PENDING", "Pending"],
              ["REJECTED", "Rejected"],
            ] as [AdminCheck, string][]
          ).map(([status, label]) => (
            <div
              key={status}
              className="rounded-xl border border-border bg-surface-raised p-4 text-center"
            >
              <p className="font-serif text-2xl font-semibold text-ink">
                {books.filter((b) => b.adminCheck === status).length}
              </p>
              <p className="mt-1 text-xs text-ink-muted">{label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Books list */}
      {books.length === 0 ? (
        <div className="rounded-2xl border border-border bg-surface-raised px-6 py-16 text-center">
          <BookOpen
            size={40}
            className="mx-auto mb-4 text-border"
            strokeWidth={1}
          />
          <p className="font-medium text-ink">No books listed yet</p>
          <p className="mt-1 text-sm text-ink-muted">
            List your first book and give it a new home.
          </p>
          <Link
            href="/sell"
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent/90"
          >
            <Plus size={15} /> List a book
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {books.map((book) => {
            const status = statusConfig[book.adminCheck];
            const cover = book.images[0]
              ? cloudinaryOptimize(book.images[0], 100)
              : null;

            return (
              <div
                key={book.id}
                className="flex items-center gap-4 rounded-xl border border-border bg-surface-raised p-4 transition-shadow hover:shadow-sm"
              >
                {/* Thumbnail */}
                <div className="relative h-16 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-accent-light">
                  {cover ? (
                    <Image src={cover} alt={book.name} fill className="object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <span className="font-serif text-xs font-semibold text-accent">
                        {book.name.slice(0, 2).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-ink">{book.name}</p>
                  <p className="mt-0.5 truncate text-xs text-ink-muted">
                    {book.author}
                  </p>
                  <div className="mt-1.5 flex flex-wrap items-center gap-2">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium",
                        status.className
                      )}
                    >
                      {status.icon}
                      {status.label}
                    </span>
                    <span className="text-xs text-ink-muted">
                      {formatPrice(book.price)}
                    </span>
                    <span className="text-xs text-ink-muted">
                      {timeAgo(book.createdAt)}
                    </span>
                  </div>
                  {book.adminCheck === "REJECTED" && book.rejectionReason && (
                    <p className="mt-1.5 flex items-start gap-1 text-xs text-red-500">
                      <AlertCircle size={11} className="mt-0.5 flex-shrink-0" />
                      {book.rejectionReason}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-shrink-0 items-center gap-2">
                  {book.adminCheck === "APPROVED" && (
                    <Link
                      href={`/books/${book.id}`}
                      className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-ink-muted transition-colors hover:text-ink"
                    >
                      View
                    </Link>
                  )}
                  <button
                    onClick={() => handleDelete(book.id, book.name)}
                    disabled={deletingId === book.id}
                    className="rounded-lg p-2 text-ink-muted transition-colors hover:bg-red-50 hover:text-red-500 disabled:opacity-40"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
