"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Phone, MessageCircle } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { updateProfile } from "@/lib/api";
import { toast } from "sonner";

export default function CompleteProfilePage() {
  const { user, isAuthenticated, isLoading, updateUser } = useAuth();
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [district, setDistrict] = useState("Lohit");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.push("/login");
    // Already has phone → skip this page
    if (!isLoading && isAuthenticated && user?.phone) router.push("/");
  }, [isLoading, isAuthenticated, user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.length < 10) { toast.error("Enter a valid 10-digit phone number"); return; }

    setSaving(true);
    try {
      const result = await updateProfile({ phone: phone.trim(), district: district.trim() });
      updateUser(result.user);
      toast.success("Profile complete! Welcome to Lhasa.");
      router.push("/");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (isLoading || !user) return null;

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2">
            <Image src="/logo.svg" alt="Lhasa" width={22} height={22} />
            <span className="font-serif text-2xl font-semibold text-ink">Lhasa</span>
          </Link>
          <h1 className="mt-4 font-serif text-2xl font-semibold text-ink">One last step</h1>
          <p className="mt-1 text-sm text-ink-muted">
            Hi {user.name.split(" ")[0]}! Add your WhatsApp number so buyers and sellers can reach you.
          </p>
        </div>

        {/* Why we need this */}
        <div className="mb-5 flex items-start gap-3 rounded-xl border border-accent/25 bg-accent-light px-4 py-3.5">
          <MessageCircle size={16} className="mt-0.5 shrink-0 text-accent" />
          <p className="text-[13px] leading-relaxed text-accent/90">
            Lhasa uses WhatsApp for all buyer–seller contact. Your number is only shown to people interested in your listings.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-border bg-surface-raised p-6 shadow-sm">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink">WhatsApp number</label>
            <div className="relative">
              <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-subtle" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="10-digit mobile number"
                maxLength={10}
                autoComplete="tel"
                className="w-full rounded-xl border border-border bg-surface py-3 pl-10 pr-4 text-sm text-ink placeholder:text-ink-muted outline-none transition-all focus:border-accent focus:ring-2 focus:ring-accent/20"
              />
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink">District</label>
            <input
              type="text"
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              placeholder="e.g. Lohit"
              className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-ink placeholder:text-ink-muted outline-none transition-all focus:border-accent focus:ring-2 focus:ring-accent/20"
            />
          </div>

          <button type="submit" disabled={saving}
            className="w-full rounded-xl bg-accent py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-hover disabled:opacity-50">
            {saving ? "Saving…" : "Complete profile"}
          </button>
        </form>
      </div>
    </div>
  );
}
