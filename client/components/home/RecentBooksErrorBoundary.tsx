"use client";

import { Component, ReactNode } from "react";
import Link from "next/link";

interface Props { children: ReactNode }
interface State { hasError: boolean }

export default class RecentBooksErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="rounded-lg border border-border bg-surface-raised px-6 py-12 text-center">
          <p className="font-medium text-ink">Couldn&apos;t load recent books</p>
          <p className="mt-1 text-sm text-ink-muted">Check back shortly.</p>
          <Link href="/books" className="mt-4 inline-flex rounded bg-brand-light px-5 py-2 text-sm font-medium text-brand transition-colors hover:bg-brand/15">
            Browse all books
          </Link>
        </div>
      );
    }
    return this.props.children;
  }
}
