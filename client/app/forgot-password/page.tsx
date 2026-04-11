"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Mail, CheckCircle } from "lucide-react";
import { forgotPassword } from "@/lib/api";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) { toast.error("Please enter your email"); return; }
    setLoading(true);
    try {
      await forgotPassword(email);
      setSent(true);
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2">
            <Image src="/logo.svg" alt="Lhasa" width={22} height={22} />
            <span className="font-serif text-2xl font-semibold text-ink">Lhasa</span>
          </Link>
        </div>

        {sent ? (
          <div className="rounded-2xl border border-border bg-white p-8 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-accent-light">
              <CheckCircle size={24} className="text-accent" strokeWidth={1.75} />
            </div>
            <h2 className="font-serif text-xl font-semibold text-ink">Check your email</h2>
            <p className="mt-2 text-[14px] leading-relaxed text-ink-muted">
              If <strong>{email}</strong> is registered, you&apos;ll receive a password reset link within a few minutes.
            </p>
            <p className="mt-3 text-[13px] text-ink-subtle">Check your spam folder if you don&apos;t see it.</p>
            <Link
              href="/login"
              className="mt-6 inline-flex items-center gap-2 text-[14px] font-medium text-accent hover:underline"
            >
              <ArrowLeft size={14} /> Back to sign in
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-6 text-center">
              <h1 className="font-serif text-2xl font-semibold text-ink">Forgot password?</h1>
              <p className="mt-1 text-sm text-ink-muted">
                Enter your email and we&apos;ll send a reset link.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-border bg-surface-raised p-6 shadow-sm">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-ink">Email address</label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-subtle" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@email.com"
                    autoComplete="email"
                    className="w-full rounded-xl border border-border bg-surface py-3 pl-10 pr-4 text-sm text-ink placeholder:text-ink-muted outline-none transition-all focus:border-accent focus:ring-2 focus:ring-accent/20"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-accent py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-hover disabled:opacity-50"
              >
                {loading ? "Sending…" : "Send reset link"}
              </button>
            </form>

            <p className="mt-5 text-center text-sm text-ink-muted">
              Remember your password?{" "}
              <Link href="/login" className="font-medium text-accent hover:underline">Sign in</Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
