import { Bug, Sparkles, MessageCircle } from "lucide-react";
import type { Metadata } from "next";
import ContactForm from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact Lhasa",
  description: "Got feedback, a bug, or just want to say hi? Drop us a message.",
};

const reasons = [
  { icon: Bug,           title: "Report a bug",    desc: "Something broken? We'll fix it ASAP." },
  { icon: Sparkles,      title: "Share feedback",   desc: "Ideas to make Lhasa better? We're all ears." },
  { icon: MessageCircle, title: "General enquiry",  desc: "Questions about listings, sellers, or the platform." },
];

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16 md:py-24">
      {/* Header */}
      <div className="mb-12 text-center">
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-brand">
          We&apos;re listening
        </p>
        <h1 className="font-display text-4xl font-bold text-ink md:text-5xl">
          Say hello
        </h1>
        <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-ink-muted">
          Bug, idea, or just a hi then drop us a message and we&apos;ll get back to you.
          No forms, no tickets, just a message.
        </p>
      </div>

      {/* Message box */}
      <div className="rounded-lg border border-border bg-surface-raised p-8">
        <ContactForm />
      </div>

      {/* What we can help with */}
      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {reasons.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="flex flex-col gap-2 rounded-lg border border-border p-5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-light">
              <Icon size={14} className="text-brand" />
            </div>
            <p className="text-sm font-medium text-ink">{title}</p>
            <p className="text-xs leading-relaxed text-ink-muted">{desc}</p>
          </div>
        ))}
      </div>

      <p className="mt-10 text-center text-sm leading-relaxed text-ink-muted">
        Lhasa is a community project built for Lohit district. Your feedback directly shapes the product — we read every message.
      </p>
    </div>
  );
}
