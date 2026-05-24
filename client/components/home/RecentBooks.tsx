'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import { BookOpen, Repeat2 } from "lucide-react";
import { getApprovedBooks } from "@/lib/api";
import { Book } from "@/lib/types";
import BookCard from "@/components/books/BookCard";
import BookCardSkeleton from "@/components/books/BookCardSkeleton";

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <BookCardSkeleton key={i} />
      ))}
    </div>
  );
}

export default function RecentBooks() {
  const [books, setBooks] = useState<Book[] | null>(null);

  useEffect(() => {
    getApprovedBooks({ page: 1, limit: 8 })
      .then((result) => setBooks(result.books))
      .catch(() => setBooks([]));
  }, []);

  if (books === null) return <SkeletonGrid />;

  if (books.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-white px-6 py-20 text-center shadow-sm">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-lg bg-brand-light">
          <Repeat2 size={28} className="text-brand" strokeWidth={1.75} />
        </div>
        <p className="text-[17px] font-bold text-ink">No books listed yet</p>
        <p className="mt-2 text-[14px] text-ink-muted">
          Be the first to list a book in Lohit.
        </p>
        <Link
          href="/sell"
          className="mt-6 inline-flex items-center gap-2 rounded bg-accent px-7 py-3.5 text-[15px] font-semibold text-white shadow-sm transition-all hover:bg-accent-hover hover:shadow-md"
        >
          <BookOpen size={15} />
          List a book
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
      {books.map((book) => (
        <BookCard key={book.id} book={book} />
      ))}
    </div>
  );
}
