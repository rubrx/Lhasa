export default function BookCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-white">
      <div className="aspect-[3/4] animate-shimmer" />
      <div className="p-4 space-y-2">
        <div className="h-4 w-3/4 animate-shimmer rounded-lg" />
        <div className="h-3 w-1/2 animate-shimmer rounded-lg" />
        <div className="mt-3 flex items-end justify-between">
          <div className="h-5 w-16 animate-shimmer rounded-lg" />
          <div className="h-3 w-10 animate-shimmer rounded-lg" />
        </div>
        <div className="mt-2 flex items-center gap-1.5">
          <div className="h-4 w-4 animate-shimmer rounded-full" />
          <div className="h-3 w-24 animate-shimmer rounded-lg" />
        </div>
      </div>
    </div>
  );
}
