"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, SlidersHorizontal, X, Shuffle } from "lucide-react";
import { useRouter } from "next/navigation";
import { getApprovedBooks } from "@/lib/api";
import { Book, BookCategory, BookCondition } from "@/lib/types";
import BookCard from "@/components/books/BookCard";

const LIMIT = 20;

const CATEGORIES: { value: BookCategory | ""; label: string }[] = [
  { value: "", label: "All categories" },
  { value: "TEXTBOOK", label: "Textbooks" },
  { value: "NOVEL", label: "Novels" },
  { value: "COMPETITIVE", label: "Competitive Exams" },
  { value: "LITERATURE", label: "Literature" },
  { value: "OTHER", label: "Other" },
];

const CONDITIONS: { value: BookCondition | ""; label: string }[] = [
  { value: "", label: "Any condition" },
  { value: "LIKE_NEW", label: "Pristine" },
  { value: "GOOD", label: "Gently Read" },
  { value: "POOR", label: "Well Loved" },
];

function BookSkeleton() {
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-surface-raised">
      <div className="aspect-[3/4] animate-shimmer bg-border" />
      <div className="space-y-2 p-3">
        <div className="h-4 w-3/4 animate-shimmer rounded bg-border" />
        <div className="h-3 w-1/2 animate-shimmer rounded bg-border" />
        <div className="h-4 w-1/3 animate-shimmer rounded bg-border" />
      </div>
    </div>
  );
}

export default function BooksPage() {
  const router = useRouter();
  const [books, setBooks] = useState<Book[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [category, setCategory] = useState<BookCategory | "">("");
  const [condition, setCondition] = useState<BookCondition | "">("");
  const [maxPrice, setMaxPrice] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(timer);
  }, [query]);

  // Fetch page 1 whenever filters change
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setPage(1);
    getApprovedBooks({
      search: debouncedQuery || undefined,
      category: category || undefined,
      condition: condition || undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      page: 1,
      limit: LIMIT,
    })
      .then((r) => {
        if (!cancelled) {
          setBooks(r.books);
          setTotal(r.total);
        }
      })
      .catch(() => { if (!cancelled) { setBooks([]); setTotal(0); } })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [debouncedQuery, category, condition, maxPrice]);

  const loadMore = useCallback(() => {
    const nextPage = page + 1;
    setLoadingMore(true);
    getApprovedBooks({
      search: debouncedQuery || undefined,
      category: category || undefined,
      condition: condition || undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      page: nextPage,
      limit: LIMIT,
    })
      .then((r) => {
        setBooks((prev) => [...prev, ...r.books]);
        setPage(nextPage);
      })
      .catch(() => {})
      .finally(() => setLoadingMore(false));
  }, [page, debouncedQuery, category, condition, maxPrice]);

  // Seed query from URL on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const q = params.get("q");
    if (q) setQuery(q);
  }, []);

  const hasFilters = !!(query || category || condition || maxPrice);

  const clearFilters = () => {
    setQuery("");
    setCategory("");
    setCondition("");
    setMaxPrice("");
  };

  const handleSurpriseMe = () => {
    const eligible = books.filter(
      (b) => b.condition !== "POOR" && b.status === "UNSOLD"
    );
    if (eligible.length === 0) return;
    const random = eligible[Math.floor(Math.random() * eligible.length)];
    router.push(`/books/${random.id}`);
  };

  const activeFilterCount = [category, condition, maxPrice].filter(Boolean).length;
  const hasMore = books.length < total;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* Header */}
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-ink">
            Browse Books
          </h1>
          <p className="mt-1 text-sm text-ink-muted">
            {loading
              ? "Loading…"
              : `${total} book${total !== 1 ? "s" : ""} available`}
          </p>
        </div>
        <button
          onClick={handleSurpriseMe}
          className="flex items-center gap-2 rounded border border-border bg-surface-raised px-4 py-2.5 text-[13px] font-medium text-ink-muted transition-colors hover:border-border-strong hover:text-ink"
        >
          <Shuffle size={14} />
          Surprise me
        </button>
      </div>

      {/* Search + Filter toggle */}
      <div className="mb-4 flex gap-2">
        <div className="relative flex-1">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted"
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search title or author…"
            className="w-full rounded border border-border bg-surface-raised py-2.5 pl-9 pr-9 text-sm text-ink placeholder:text-ink-muted outline-none transition-all focus:border-brand/50 focus:ring-2 focus:ring-brand/10"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted transition-colors hover:text-ink"
            >
              <X size={14} />
            </button>
          )}
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 rounded border px-4 py-2.5 text-sm font-medium transition-colors ${
            showFilters
              ? "border-brand bg-brand-light text-brand"
              : "border-border bg-surface-raised text-ink-muted hover:text-ink"
          }`}
        >
          <SlidersHorizontal size={15} />
          <span className="hidden sm:inline">Filters</span>
          {activeFilterCount > 0 && (
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-brand text-[10px] font-bold text-white">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* Filter panel */}
      {showFilters && (
        <div className="mb-5 grid grid-cols-2 gap-3 rounded-lg border border-border bg-surface-raised p-4 sm:grid-cols-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-ink-muted">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as BookCategory | "")}
              className="w-full rounded border border-border bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-brand/50"
            >
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-ink-muted">
              Condition
            </label>
            <select
              value={condition}
              onChange={(e) =>
                setCondition(e.target.value as BookCondition | "")
              }
              className="w-full rounded border border-border bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-brand/50"
            >
              {CONDITIONS.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-ink-muted">
              Max Price (₹)
            </label>
            <input
              type="number"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              placeholder="e.g. 500"
              className="w-full rounded border border-border bg-surface px-3 py-2 text-sm text-ink placeholder:text-ink-muted outline-none focus:border-brand/50"
            />
          </div>
        </div>
      )}

      {/* Book grid */}
      {loading ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <BookSkeleton key={i} />
          ))}
        </div>
      ) : books.length > 0 ? (
        <>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {books.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
          {hasMore && (
            <div className="mt-8 flex justify-center">
              <button
                onClick={loadMore}
                disabled={loadingMore}
                className="rounded border border-border bg-surface-raised px-6 py-2.5 text-sm font-medium text-ink-muted transition-colors hover:border-border-strong hover:text-ink disabled:opacity-50"
              >
                {loadingMore ? (
                  <span className="flex items-center gap-2">
                    <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Loading…
                  </span>
                ) : (
                  `Load more (${total - books.length} remaining)`
                )}
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="rounded-lg border border-border bg-surface-raised px-6 py-16 text-center">
          <Search size={32} strokeWidth={1} className="mx-auto text-ink-subtle" />
          <p className="mt-3 font-medium text-ink">No books found</p>
          <p className="mt-1 text-sm text-ink-muted">
            {hasFilters
              ? "Try adjusting your search or filters."
              : "No books available yet."}
          </p>
          {hasFilters && (
            <button
              onClick={clearFilters}
              className="mt-4 rounded bg-brand-light px-5 py-2 text-sm font-medium text-brand transition-colors hover:bg-brand/15"
            >
              Clear filters
            </button>
          )}
        </div>
      )}
    </div>
  );
}
