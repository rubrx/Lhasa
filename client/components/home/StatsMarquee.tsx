const items = [
  { label: "Books Listed", value: "500+" },
  { label: "Zero Commission", value: "Always Free" },
  { label: "Lohit District", value: "Local" },
  { label: "Approval Time", value: "< 24 hrs" },
  { label: "Connect via", value: "WhatsApp" },
  { label: "Categories", value: "12+" },
  { label: "Happy Readers", value: "200+" },
  { label: "Listing Fee", value: "₹0" },
];

const Dot = () => (
  <span className="mx-6 inline-block h-1 w-1 shrink-0 rounded-full bg-border" />
);

export default function StatsMarquee() {
  const doubled = [...items, ...items];

  return (
    <div className="overflow-hidden border-y border-border bg-surface-raised py-3.5">
      <div className="flex animate-marquee whitespace-nowrap">
        {doubled.map((item, i) => (
          <span key={i} className="inline-flex shrink-0 items-center text-sm">
            <span className="font-serif font-semibold text-ink">{item.value}</span>
            <span className="ml-1.5 text-ink-muted">{item.label}</span>
            <Dot />
          </span>
        ))}
      </div>
    </div>
  );
}
