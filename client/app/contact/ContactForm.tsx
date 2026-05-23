"use client";

import { useState } from "react";
import { Send, CheckCircle2, Loader2 } from "lucide-react";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!message.trim()) return;

    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });

      setStatus(res.ok ? "sent" : "error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent-light">
          <CheckCircle2 size={28} className="text-accent" />
        </div>
        <div>
          <p className="font-serif text-xl font-semibold text-ink">Got it, thanks!</p>
          <p className="mt-1 text-sm text-ink-muted">
            We&apos;ll get back to you{email ? " at " + email : ""} soon.
          </p>
        </div>
        <button
          onClick={() => {
            setName(""); setEmail(""); setMessage(""); setStatus("idle");
          }}
          className="mt-2 text-sm font-medium text-accent underline-offset-2 hover:underline"
        >
          Send another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex gap-3">
        <input
          type="text"
          placeholder="Your name (optional)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="flex-1 rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-ink placeholder:text-ink-subtle focus:border-accent/50 focus:outline-none focus:ring-2 focus:ring-accent/10"
        />
        <input
          type="email"
          placeholder="Email to reply (optional)"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 rounded-xl border border-border bg-surface px-4 py-2.5 text-sm text-ink placeholder:text-ink-subtle focus:border-accent/50 focus:outline-none focus:ring-2 focus:ring-accent/10"
        />
      </div>

      <div className="relative">
        <textarea
          placeholder="What's on your mind? Bug, idea, or just saying hi — all good."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          rows={5}
          className="w-full resize-none rounded-2xl border border-border bg-surface px-4 py-3.5 text-sm text-ink placeholder:text-ink-subtle focus:border-accent/50 focus:outline-none focus:ring-2 focus:ring-accent/10"
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
        disabled={!message.trim() || status === "sending"}
        className="flex items-center justify-center gap-2 self-end rounded-xl bg-accent px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-accent-hover hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
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
