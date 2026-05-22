"use client";

import { useState, useEffect } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { getApprovedBooks } from "@/lib/api";
import { Book, BookCategory, BookCondition } from "@/lib/types";
import BookCard from "@/components/books/BookCard";

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
  { value: "LIKE_NEW", label: "Like New" },
  { value: "GOOD", label: "Good" },
  { value: "POOR", label: "Fair" },
];

function BookSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-surface-raised">
      <div className="aspect-[3/4] animate-pulse bg-border" />
      <div className="space-y-2 p-3">
        <div className="h-4 w-3/4 animate-pulse rounded bg-border" />
        <div className="h-3 w-1/2 animate-pulse rounded bg-border" />
        <div className="h-4 w-1/3 animate-pulse rounded bg-border" />
      </div>
    </div>
  );
}

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<BookCategory | "">("");
  const [condition, setCondition] = useState<BookCondition | "">("");
  const [maxPrice, setMaxPrice] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    // Persist initial search query from URL if present
    const params = new URLSearchParams(window.location.search);
    const q = params.get("q");
    if (q) setQuery(q);

    getApprovedBooks()
      .then((r) => setBooks(r.books))
      .catch(() => setBooks([]))
      .finally(() => setLoading(false));
  }, []);

  const hasFilters = !!(query || category || condition || maxPrice);

  const filtered = books.filter((book) => {
    if (
      query &&
      !book.name.toLowerCase().includes(query.toLowerCase()) &&
      !book.author.toLowerCase().includes(query.toLowerCase()) &&
      !book.category.toLowerCase().includes(query.toLowerCase())
    )
      return false;
    if (category && book.category !== category) return false;
    if (condition && book.condition !== condition) return false;
    if (maxPrice && book.price > Number(maxPrice)) return false;
    return true;
  });

  const clearFilters = () => {
    setQuery("");
    setCategory("");
    setCondition("");
    setMaxPrice("");
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-serif text-3xl font-semibold text-ink">
          Browse Books
        </h1>
        <p className="mt-1 text-sm text-ink-muted">
          {loading
            ? "Loading…"
            : `${filtered.length} book${filtered.length !== 1 ? "s" : ""} available`}
        </p>
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
            placeholder="Search title, author, or category…"
            className="w-full rounded-xl border border-border bg-surface-raised py-2.5 pl-9 pr-9 text-sm text-ink placeholder:text-ink-muted outline-none transition-all focus:border-accent focus:ring-2 focus:ring-accent/20"
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
          className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors ${
            showFilters
              ? "border-accent bg-accent-light text-accent"
              : "border-border bg-surface-raised text-ink-muted hover:text-ink"
          }`}
        >
          <SlidersHorizontal size={15} />
          <span className="hidden sm:inline">Filters</span>
          {(category || condition || maxPrice) && (
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-white">
              !
            </span>
          )}
        </button>
      </div>

      {/* Filter panel */}
      {showFilters && (
        <div className="mb-5 grid grid-cols-2 gap-3 rounded-xl border border-border bg-surface-raised p-4 sm:grid-cols-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-ink-muted">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as BookCategory | "")}
              className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-accent"
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
              className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-accent"
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
              className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-ink placeholder:text-ink-muted outline-none focus:border-accent"
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
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {filtered.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-border bg-surface-raised px-6 py-16 text-center">
          <p className="text-4xl">🔍</p>
          <p className="mt-3 font-medium text-ink">No books found</p>
          <p className="mt-1 text-sm text-ink-muted">
            {hasFilters
              ? "Try adjusting your search or filters."
              : "No books available yet."}
          </p>
          {hasFilters && (
            <button
              onClick={clearFilters}
              className="mt-4 rounded-xl bg-accent-light px-5 py-2 text-sm font-medium text-accent transition-colors hover:bg-accent/20"
            >
              Clear filters
            </button>
          )}
        </div>
      )}
    </div>
  );
}
