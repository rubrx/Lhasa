"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { useGoogleLogin } from "@react-oauth/google";
import { registerUser, googleAuth } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z" fill="#34A853"/>
      <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z" fill="#EA4335"/>
    </svg>
  );
}

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", district: "Lohit" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const update = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { name, email, phone, password } = form;
    if (!name || !email || !phone || !password) { toast.error("Please fill in all fields"); return; }
    if (phone.length < 10) { toast.error("Enter a valid 10-digit phone number"); return; }
    if (password.length < 6) { toast.error("Password must be at least 6 characters"); return; }

    setLoading(true);
    try {
      const result = await registerUser(form);
      login(result.token, result.user);
      toast.success("Account created! Welcome to Lhasa.");
      router.push("/");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setGoogleLoading(true);
      try {
        const result = await googleAuth(tokenResponse.access_token);
        login(result.token, result.user);
        if (result.needsPhone) {
          toast.success(`Welcome, ${result.user.name.split(" ")[0]}! Add your WhatsApp number to continue.`);
          router.push("/complete-profile");
        } else {
          toast.success(`Welcome to Lhasa, ${result.user.name.split(" ")[0]}!`);
          router.push("/");
        }
      } catch {
        toast.error("Google sign-in failed. Please try again.");
      } finally {
        setGoogleLoading(false);
      }
    },
    onError: () => toast.error("Google sign-in was cancelled"),
  });

  return (
    <div className="flex min-h-[90vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2">
            <Image src="/logo.svg" alt="Lhasa" width={22} height={22} />
            <span className="font-serif text-2xl font-semibold text-ink">Lhasa</span>
          </Link>
          <h1 className="mt-4 font-serif text-2xl font-semibold text-ink">Create an account</h1>
          <p className="mt-1 text-sm text-ink-muted">Join the Lohit book community</p>
        </div>

        {/* Google */}
        <button
          type="button"
          onClick={() => handleGoogle()}
          disabled={googleLoading}
          className="mb-4 flex w-full items-center justify-center gap-3 rounded-xl border border-border bg-white py-3 text-[14px] font-medium text-ink shadow-sm transition-all hover:bg-surface-muted hover:shadow-md disabled:opacity-60"
        >
          <GoogleIcon />
          {googleLoading ? "Signing in…" : "Continue with Google"}
        </button>

        <div className="mb-4 flex items-center gap-3">
          <div className="h-px flex-1 bg-border" />
          <span className="text-[12px] text-ink-subtle">or register with email</span>
          <div className="h-px flex-1 bg-border" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-border bg-surface-raised p-6 shadow-sm">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink">Full name</label>
            <input type="text" value={form.name} onChange={update("name")} placeholder="Your full name" autoComplete="name"
              className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-ink placeholder:text-ink-muted outline-none transition-all focus:border-accent focus:ring-2 focus:ring-accent/20" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink">Email</label>
            <input type="email" value={form.email} onChange={update("email")} placeholder="you@email.com" autoComplete="email"
              className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-ink placeholder:text-ink-muted outline-none transition-all focus:border-accent focus:ring-2 focus:ring-accent/20" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink">Phone number</label>
            <input type="tel" value={form.phone} onChange={update("phone")} placeholder="10-digit mobile number" autoComplete="tel" maxLength={10}
              className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-ink placeholder:text-ink-muted outline-none transition-all focus:border-accent focus:ring-2 focus:ring-accent/20" />
            <p className="mt-1 text-xs text-ink-muted">Buyers will contact you on this number via WhatsApp.</p>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink">Password</label>
            <div className="relative">
              <input type={showPassword ? "text" : "password"} value={form.password} onChange={update("password")} placeholder="Min. 6 characters" autoComplete="new-password"
                className="w-full rounded-xl border border-border bg-surface px-4 py-3 pr-11 text-sm text-ink placeholder:text-ink-muted outline-none transition-all focus:border-accent focus:ring-2 focus:ring-accent/20" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted transition-colors hover:text-ink">
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <button type="submit" disabled={loading}
            className="w-full rounded-xl bg-ink py-3 text-sm font-medium text-surface transition-colors hover:bg-ink/80 disabled:opacity-50">
            {loading ? "Creating account…" : "Create account"}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-ink-muted">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-accent hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
