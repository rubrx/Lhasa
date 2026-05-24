"use client";

import { useState } from "react";
import { Send, CheckCircle2, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

interface Overrides {
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
  website?: string; // honeypot — never shown to users, bots fill it
}

export default function ContactForm() {
  const { user } = useAuth();

  const [overrides, setOverrides] = useState<Overrides>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const name = overrides.name ?? user?.name ?? "";
  const email = overrides.email ?? user?.email ?? "";
  const phone = overrides.phone ?? user?.phone ?? "";
  const message = overrides.message ?? "";

  function set(field: keyof Overrides) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setOverrides((prev) => ({ ...prev, [field]: e.target.value }));
  }

  async function handleSubmit(e: React.BaseSyntheticEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;

    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, message, website: overrides.website ?? "" }),
      });

      setStatus(res.ok ? "sent" : "error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-light">
          <CheckCircle2 size={28} className="text-brand" />
        </div>
        <div>
          <p className="font-display text-xl font-bold text-ink">Got it, thanks!</p>
          <p className="mt-1 text-sm text-ink-muted">
            We&apos;ll get back to you at{" "}
            <span className="font-medium text-ink">{email}</span> soon.
          </p>
        </div>
        <button
          onClick={() => { setOverrides({}); setStatus("idle"); }}
          className="mt-2 text-sm font-medium text-brand underline-offset-2 hover:underline"
        >
          Send another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {/* Honeypot — hidden from real users, bots fill this in */}
      <input
        type="text"
        name="website"
        aria-hidden="true"
        tabIndex={-1}
        autoComplete="off"
        onChange={(e) => setOverrides((p) => ({ ...p, website: e.target.value }))}
        style={{ display: "none" }}
      />
      {user && (
        <p className="text-xs text-ink-subtle">
          Filled from your account —{" "}
          <span className="text-ink-muted">edit if needed</span>
        </p>
      )}

      <div className="flex gap-3">
        <input
          type="text"
          placeholder="Your name"
          required
          value={name}
          onChange={set("name")}
          className="flex-1 rounded border border-border bg-surface px-4 py-2.5 text-sm text-ink placeholder:text-ink-subtle outline-none focus:border-brand/50 focus:ring-2 focus:ring-brand/10"
        />
        <input
          type="email"
          placeholder="Your email"
          required
          value={email}
          onChange={set("email")}
          className="flex-1 rounded border border-border bg-surface px-4 py-2.5 text-sm text-ink placeholder:text-ink-subtle outline-none focus:border-brand/50 focus:ring-2 focus:ring-brand/10"
        />
      </div>

      {(user?.phone || !user) && (
        <input
          type="tel"
          placeholder="Phone number (optional)"
          value={phone}
          onChange={set("phone")}
          className="w-full rounded border border-border bg-surface px-4 py-2.5 text-sm text-ink placeholder:text-ink-subtle outline-none focus:border-brand/50 focus:ring-2 focus:ring-brand/10"
        />
      )}

      <div className="relative">
        <textarea
          placeholder="What's on your mind? Bug, idea, or just saying hi!"
          value={message}
          onChange={set("message")}
          required
          rows={5}
          className="w-full resize-none rounded border border-border bg-surface px-4 py-3.5 text-sm text-ink placeholder:text-ink-subtle outline-none focus:border-brand/50 focus:ring-2 focus:ring-brand/10"
        />
        <span className="absolute bottom-3 right-3 text-xs text-ink-subtle">
          {message.length > 0 ? `${message.length} chars` : ""}
        </span>
      </div>

      {status === "error" && (
        <p className="text-sm text-red-500">Something went wrong — try again or email us directly.</p>
      )}

      <button
        type="submit"
        disabled={!name.trim() || !email.trim() || !message.trim() || status === "sending"}
        className="flex items-center justify-center gap-2 self-end rounded bg-accent px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-accent-hover hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
      >
        {status === "sending" ? (
          <Loader2 size={15} className="animate-spin" />
        ) : (
          <Send size={15} />
        )}
        {status === "sending" ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
