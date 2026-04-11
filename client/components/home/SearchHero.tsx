"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Mic } from "lucide-react";

export default function SearchHero() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(query.trim() ? `/books?q=${encodeURIComponent(query.trim())}` : "/books");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto mt-8 max-w-lg overflow-hidden rounded-2xl border border-border bg-white shadow-[0_2px_20px_rgba(0,0,0,0.08)] transition-all duration-200 focus-within:border-accent/40 focus-within:shadow-[0_6px_32px_rgba(61,107,82,0.2)]"
    >
      <div className="flex items-center gap-2 px-4">
        <Search size={16} className="shrink-0 text-ink-subtle" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by title, author, or subject…"
          className="flex-1 bg-transparent py-4 text-[14px] font-medium text-ink outline-none placeholder:font-normal placeholder:text-ink-subtle"
        />
        <button
          type="button"
          title="Voice search — coming soon"
          className="shrink-0 rounded-lg p-1.5 text-ink-subtle transition-colors hover:bg-surface-muted hover:text-ink-muted"
        >
          <Mic size={15} />
        </button>
        <div className="h-5 w-px bg-border" />
        <button
          type="submit"
          className="my-2 shrink-0 rounded-xl bg-accent px-5 py-2.5 text-[14px] font-bold text-white shadow-sm transition-all duration-150 hover:bg-accent-hover hover:shadow-md active:scale-95"
        >
          Search
        </button>
      </div>
    </form>
  );
}
