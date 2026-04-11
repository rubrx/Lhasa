"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Camera, User, Phone, MapPin, Mail, Calendar,
  BookOpen, LogOut, Check, Loader2, ChevronRight,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { updateProfile } from "@/lib/api";
import { toast } from "sonner";
import { cn, cloudinaryOptimize } from "@/lib/utils";

function Field({
  label,
  icon,
  children,
}: {
  label: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 flex items-center gap-1.5 text-[12px] font-semibold uppercase tracking-[0.08em] text-ink-subtle">
        {icon}
        {label}
      </label>
      {children}
    </div>
  );
}

export default function ProfilePage() {
  const { user, isAuthenticated, isLoading, logout, updateUser } = useAuth();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [district, setDistrict] = useState("");
  const [saving, setSaving] = useState(false);
  const [previewImg, setPreviewImg] = useState<string | null>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login?redirect=/profile");
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setPhone(user.phone ?? "");
      setDistrict(user.district ?? "");
    }
  }, [user]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPendingFile(file);
    setPreviewImg(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const result = await updateProfile({
        name: name.trim(),
        phone: phone.trim(),
        district: district.trim(),
        ...(pendingFile && { profileImg: pendingFile }),
      });
      updateUser(result.user);
      setPendingFile(null);
      setPreviewImg(null);
      toast.success("Profile updated");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  if (isLoading || !user) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12">
        <div className="space-y-5">
          <div className="flex items-center gap-4">
            <div className="h-20 w-20 animate-shimmer rounded-full" />
            <div className="space-y-2">
              <div className="h-6 w-40 animate-shimmer rounded-lg" />
              <div className="h-4 w-28 animate-shimmer rounded-lg" />
            </div>
          </div>
          <div className="h-64 animate-shimmer rounded-2xl" />
        </div>
      </div>
    );
  }

  const avatarSrc = previewImg
    ?? (user.profileImg ? cloudinaryOptimize(user.profileImg, 160) : null);

  const joinedDate = new Date(user.createdAt).toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 pb-28 md:pb-12">

      {/* ── Identity header ── */}
      <div className="mb-8 flex flex-col items-center gap-5 text-center sm:flex-row sm:items-start sm:text-left">
        <div className="relative flex-shrink-0">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="group relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-accent ring-4 ring-accent-light transition-all hover:ring-accent/30"
          >
            {avatarSrc ? (
              <Image
                src={avatarSrc}
                alt={user.name}
                fill
                className="object-cover"
                unoptimized={!!previewImg}
              />
            ) : (
              <span className="font-serif text-3xl font-bold text-white">
                {user.name[0]?.toUpperCase()}
              </span>
            )}
            <div className="absolute inset-0 flex items-center justify-center bg-ink/0 transition-all group-hover:bg-ink/35">
              <Camera
                size={18}
                className="text-white opacity-0 drop-shadow-sm transition-opacity group-hover:opacity-100"
              />
            </div>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
          {pendingFile && (
            <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[9px] font-bold text-white shadow">
              ✓
            </span>
          )}
        </div>

        <div>
          <h1 className="font-serif text-2xl font-bold text-ink">{user.name}</h1>
          <p className="mt-0.5 text-[14px] text-ink-muted">{user.email}</p>
          <div className="mt-2 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 sm:justify-start">
            <span
              className={cn(
                "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold",
                user.role === "ADMIN"
                  ? "bg-accent text-white"
                  : "bg-accent-light text-accent"
              )}
            >
              {user.role === "ADMIN" ? "Admin" : "Member"}
            </span>
            {user.district && (
              <span className="flex items-center gap-1 text-[12px] text-ink-muted">
                <MapPin size={11} />
                {user.district}
              </span>
            )}
            <span className="flex items-center gap-1 text-[12px] text-ink-muted">
              <Calendar size={11} />
              Joined {joinedDate}
            </span>
          </div>
        </div>
      </div>

      {/* ── Edit form ── */}
      <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
        <h2 className="mb-5 text-[15px] font-bold text-ink">Edit Profile</h2>
        <div className="space-y-4">
          <Field label="Full Name" icon={<User size={13} />}>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
              className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-[14px] text-ink outline-none transition-all focus:border-accent/50 focus:ring-2 focus:ring-accent/10"
            />
          </Field>
          <Field label="Email" icon={<Mail size={13} />}>
            <input
              value={user.email}
              disabled
              className="w-full cursor-not-allowed rounded-xl border border-border bg-surface-muted px-4 py-2.5 text-[14px] text-ink-muted"
            />
          </Field>
          <Field label="Phone" icon={<Phone size={13} />}>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Your phone number"
              className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-[14px] text-ink outline-none transition-all focus:border-accent/50 focus:ring-2 focus:ring-accent/10"
            />
          </Field>
          <Field label="District" icon={<MapPin size={13} />}>
            <input
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              placeholder="Your district"
              className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-[14px] text-ink outline-none transition-all focus:border-accent/50 focus:ring-2 focus:ring-accent/10"
            />
          </Field>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="mt-6 flex items-center gap-2 rounded-xl bg-accent px-6 py-2.5 text-[14px] font-semibold text-white shadow-sm transition-all hover:bg-accent-hover hover:shadow-md active:scale-95 disabled:opacity-60"
        >
          {saving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
          {saving ? "Saving…" : "Save Changes"}
        </button>
      </div>

      {/* ── My listings link ── */}
      <Link
        href="/dashboard"
        className="mt-4 flex items-center justify-between rounded-2xl border border-border bg-white p-5 shadow-sm transition-all hover:border-border-strong hover:shadow-md"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent-light">
            <BookOpen size={16} className="text-accent" />
          </div>
          <div>
            <p className="text-[14px] font-semibold text-ink">My Listings</p>
            <p className="text-[12px] text-ink-muted">View and manage your book listings</p>
          </div>
        </div>
        <ChevronRight size={16} className="text-ink-subtle" />
      </Link>

      {/* ── Sign out ── */}
      <button
        onClick={handleLogout}
        className="mt-4 flex w-full items-center gap-2.5 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-[14px] font-medium text-red-600 transition-all hover:bg-red-100"
      >
        <LogOut size={15} />
        Sign out of Lhasa
      </button>
    </div>
  );
}
