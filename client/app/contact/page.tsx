import { Mail, Phone, MapPin, MessageCircle, Bug, Sparkles } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact — Lhasa",
  description: "Get in touch with Lhasa. Report bugs, share feedback, or just say hello.",
};

const reasons = [
  {
    icon: Bug,
    title: "Report a bug",
    desc: "Something broken? Let us know and we'll fix it ASAP.",
  },
  {
    icon: Sparkles,
    title: "Share feedback",
    desc: "Got ideas to make Lhasa better? We're all ears.",
  },
  {
    icon: MessageCircle,
    title: "General enquiry",
    desc: "Questions about listings, sellers, or the platform.",
  },
];

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-16 md:py-24">
      {/* Header */}
      <div className="mb-14 text-center">
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-accent">
          Reach out
        </p>
        <h1 className="font-serif text-4xl font-semibold text-ink md:text-5xl">
          Contact Us
        </h1>
        <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-ink-muted">
          Found a bug, have feedback, or just want to say hi? We&apos;d love to hear from you.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Contact info card */}
        <div className="rounded-3xl border border-border bg-surface-raised p-8">
          <h2 className="mb-6 font-serif text-xl font-semibold text-ink">Get in touch</h2>
          <div className="space-y-5">
            <a
              href="mailto:rubrangsokri07@gmail.com"
              className="group flex items-start gap-4 rounded-2xl border border-border p-4 transition-all duration-200 hover:border-accent/30 hover:bg-accent-light/40"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-light transition-colors duration-200 group-hover:bg-accent">
                <Mail size={18} className="text-accent transition-colors duration-200 group-hover:text-white" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-ink-subtle">Email</p>
                <p className="mt-0.5 break-all text-sm font-medium text-ink">
                  rubrangsokri07@gmail.com
                </p>
                <p className="mt-0.5 text-xs text-ink-muted">We reply within 24 hours</p>
              </div>
            </a>

            <a
              href="tel:+918259906585"
              className="group flex items-start gap-4 rounded-2xl border border-border p-4 transition-all duration-200 hover:border-accent/30 hover:bg-accent-light/40"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-light transition-colors duration-200 group-hover:bg-accent">
                <Phone size={18} className="text-accent transition-colors duration-200 group-hover:text-white" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-ink-subtle">Phone / WhatsApp</p>
                <p className="mt-0.5 text-sm font-medium text-ink">+91 82599 06585</p>
                <p className="mt-0.5 text-xs text-ink-muted">Available 9am – 8pm IST</p>
              </div>
            </a>

            <div className="flex items-start gap-4 rounded-2xl border border-border p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-light">
                <MapPin size={18} className="text-accent" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-ink-subtle">Location</p>
                <p className="mt-0.5 text-sm font-medium text-ink">Lohit district</p>
                <p className="mt-0.5 text-xs text-ink-muted">Arunachal Pradesh, India</p>
              </div>
            </div>
          </div>
        </div>

        {/* Reasons + quick mailto */}
        <div className="flex flex-col gap-6">
          {/* Why contact us */}
          <div className="rounded-3xl border border-border bg-surface-raised p-8">
            <h2 className="mb-5 font-serif text-xl font-semibold text-ink">How can we help?</h2>
            <div className="space-y-4">
              {reasons.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-accent-light">
                    <Icon size={13} className="text-accent" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-ink">{title}</p>
                    <p className="mt-0.5 text-xs leading-relaxed text-ink-muted">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div
            className="flex-1 rounded-3xl p-8"
            style={{ background: "linear-gradient(135deg, #1c1c1a 0%, #2d3d35 100%)" }}
          >
            <p className="font-serif text-xl font-semibold text-surface">
              Quickest way to reach us?
            </p>
            <p className="mt-2 text-sm leading-relaxed text-surface/60">
              Drop us an email — it&apos;s the fastest way to get a response and track your message.
            </p>
            <a
              href="mailto:rubrangsokri07@gmail.com?subject=Lhasa Feedback"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-surface px-5 py-3 text-sm font-semibold text-ink transition-all hover:bg-surface/90"
            >
              <Mail size={14} />
              Send an email
            </a>
          </div>
        </div>
      </div>

      {/* Bottom note */}
      <p className="mt-12 text-center text-sm leading-relaxed text-ink-muted">
        Lhasa is a community project built for Lohit district. Your feedback directly shapes the product — we read every message.
      </p>
    </div>
  );
}
