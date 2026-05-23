export default function BookCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-surface-raised">
      <div className="aspect-[3/4] animate-shimmer" />
      <div className="space-y-2 p-3.5">
        <div className="h-3.5 w-3/4 animate-shimmer rounded" />
        <div className="h-3 w-1/2 animate-shimmer rounded" />
        <div className="mt-3 flex items-end justify-between">
          <div className="h-4 w-14 animate-shimmer rounded" />
          <div className="h-3 w-9 animate-shimmer rounded" />
        </div>
        <div className="mt-2 flex items-center gap-1.5 border-t border-border/60 pt-2">
          <div className="h-4 w-4 animate-shimmer rounded-full" />
          <div className="h-3 w-20 animate-shimmer rounded" />
        </div>
      </div>
    </div>
  );
}
