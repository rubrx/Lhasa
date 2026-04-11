"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, CheckCircle } from "lucide-react";
import { resetPassword } from "@/lib/api";
import { toast } from "sonner";

function ResetForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || !confirm) { toast.error("Please fill in both fields"); return; }
    if (password.length < 6) { toast.error("Password must be at least 6 characters"); return; }
    if (password !== confirm) { toast.error("Passwords don't match"); return; }
    if (!token) { toast.error("Invalid reset link"); return; }

    setLoading(true);
    try {
      await resetPassword(token, password);
      setDone(true);
      setTimeout(() => router.push("/login"), 2500);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Reset failed. The link may have expired.");
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className="rounded-2xl border border-border bg-white p-8 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-accent-light">
          <CheckCircle size={24} className="text-accent" strokeWidth={1.75} />
        </div>
        <h2 className="font-serif text-xl font-semibold text-ink">Password reset!</h2>
        <p className="mt-2 text-[14px] text-ink-muted">Redirecting you to sign in…</p>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="rounded-2xl border border-border bg-white p-8 text-center shadow-sm">
        <p className="text-[14px] text-ink-muted">Invalid or missing reset link.</p>
        <Link href="/forgot-password" className="mt-4 inline-block text-[14px] font-medium text-accent hover:underline">
          Request a new one
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-border bg-surface-raised p-6 shadow-sm">
      <div>
        <label className="mb-1.5 block text-sm font-medium text-ink">New password</label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Min. 6 characters"
            className="w-full rounded-xl border border-border bg-surface px-4 py-3 pr-11 text-sm text-ink placeholder:text-ink-muted outline-none transition-all focus:border-accent focus:ring-2 focus:ring-accent/20"
          />
          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink">
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-ink">Confirm password</label>
        <input
          type={showPassword ? "text" : "password"}
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          placeholder="Repeat your new password"
          className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-ink placeholder:text-ink-muted outline-none transition-all focus:border-accent focus:ring-2 focus:ring-accent/20"
        />
      </div>
      <button type="submit" disabled={loading}
        className="w-full rounded-xl bg-accent py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-hover disabled:opacity-50">
        {loading ? "Resetting…" : "Reset password"}
      </button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2">
            <Image src="/logo.svg" alt="Lhasa" width={22} height={22} />
            <span className="font-serif text-2xl font-semibold text-ink">Lhasa</span>
          </Link>
          <h1 className="mt-4 font-serif text-2xl font-semibold text-ink">Set new password</h1>
          <p className="mt-1 text-sm text-ink-muted">Choose a strong password for your account.</p>
        </div>
        <Suspense fallback={<div className="h-48 animate-shimmer rounded-2xl" />}>
          <ResetForm />
        </Suspense>
      </div>
    </div>
  );
}
