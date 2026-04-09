"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

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
      className="mx-auto mt-8 flex max-w-lg overflow-hidden rounded-2xl border border-border bg-white shadow-md transition-all duration-200 focus-within:border-accent/50 focus-within:shadow-[0_4px_24px_rgba(61,107,82,0.18)]"
    >
      <div className="flex flex-1 items-center gap-3 px-4">
        <Search size={16} className="shrink-0 text-ink-subtle" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by title, author, or subject…"
          className="flex-1 bg-transparent py-4 text-[14px] font-medium text-ink outline-none placeholder:font-normal placeholder:text-ink-subtle"
        />
      </div>
      <button
        type="submit"
        className="m-2 rounded-xl bg-accent px-5 py-2.5 text-[14px] font-bold text-white shadow-sm transition-all duration-150 hover:bg-accent-hover hover:shadow-md"
      >
        Search
      </button>
    </form>
  );
}
