"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Upload, X, ImagePlus, CheckCircle2 } from "lucide-react";
import { createBook } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";

const CONDITIONS = [
  { value: "LIKE_NEW", label: "Pristine", hint: "Unread or barely opened, spine uncreased" },
  { value: "GOOD", label: "Gently Read", hint: "Visible love, fully intact and readable" },
  { value: "POOR", label: "Well Loved", hint: "Heavy use, may have notes or highlights" },
];

const CATEGORIES = [
  { value: "TEXTBOOK", label: "Textbook" },
  { value: "NOVEL", label: "Novel" },
  { value: "COMPETITIVE", label: "Competitive Exam" },
  { value: "LITERATURE", label: "Literature" },
  { value: "OTHER", label: "Other" },
];

export default function SellPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    author: "",
    price: "",
    description: "",
    sellerNote: "",
    condition: "LIKE_NEW",
    category: "TEXTBOOK",
  });
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login?redirect=/sell");
    }
  }, [isAuthenticated, isLoading, router]);

  const update =
    (key: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const arr = Array.from(files).slice(0, 5);
    if (arr.length < 3) {
      toast.error("Please select at least 3 images");
      return;
    }
    setImages(arr);
    previews.forEach((p) => URL.revokeObjectURL(p));
    setPreviews(arr.map((f) => URL.createObjectURL(f)));
  };

  const removeImage = (index: number) => {
    const next = images.filter((_, i) => i !== index);
    const nextPreviews = previews.filter((_, i) => i !== index);
    URL.revokeObjectURL(previews[index]);
    setImages(next);
    setPreviews(nextPreviews);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name || !form.author || !form.price) {
      toast.error("Please fill in all required fields");
      return;
    }
    if (images.length < 3) {
      toast.error("At least 3 photos are required");
      return;
    }
    if (Number(form.price) <= 0) {
      toast.error("Enter a valid price");
      return;
    }

    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("name", form.name);
      fd.append("author", form.author);
      fd.append("price", form.price);
      fd.append("description", form.description);
      fd.append("sellerNote", form.sellerNote);
      fd.append("condition", form.condition);
      fd.append("category", form.category);
      images.forEach((img) => fd.append("images", img));

      await createBook(fd);
      setSuccess(true);
      toast.success("Book listed! It will go live after admin approval.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to list book");
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-brand border-t-transparent" />
      </div>
    );
  }

  if (success) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-16 text-center">
        <CheckCircle2
          size={56}
          className="mb-4 text-brand"
          strokeWidth={1.5}
        />
        <h2 className="font-display text-2xl font-bold text-ink">
          Book submitted!
        </h2>
        <p className="mt-2 max-w-xs text-sm text-ink-muted">
          Your listing is under review. It will go live once approved, usually
          within 24 hours.
        </p>
        <div className="mt-6 flex gap-3">
          <button
            onClick={() => {
              setSuccess(false);
              setForm({ name: "", author: "", price: "", description: "", sellerNote: "", condition: "LIKE_NEW", category: "TEXTBOOK" });
              setImages([]);
              setPreviews([]);
            }}
            className="rounded border border-border px-5 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-brand-light"
          >
            List another book
          </button>
          <button
            onClick={() => router.push("/dashboard")}
            className="rounded bg-brand px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-hover"
          >
            My Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-8">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-ink">
          List a book
        </h1>
        <p className="mt-1 text-sm text-ink-muted">
          Share your book with readers in Lohit. Free, no commission.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Photos */}
        <div>
          <label className="mb-2 block text-sm font-medium text-ink">
            Photos{" "}
            <span className="font-normal text-ink-muted">(3–5 required)</span>
          </label>

          {previews.length === 0 ? (
            <>
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="flex w-full flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-border bg-surface-raised py-10 text-ink-muted transition-colors hover:border-brand hover:bg-brand-light hover:text-brand"
              >
                <ImagePlus size={32} strokeWidth={1} />
                <div className="text-center">
                  <p className="text-sm font-medium">Tap to add photos</p>
                  <p className="mt-0.5 text-xs">Select 3–5 images of your book</p>
                </div>
              </button>
              <p className="mt-2 text-[11px] leading-relaxed text-ink-subtle">
                Take real photos of your actual copy — front cover, back, and spine.
                Listings with genuine photos get noticed far more than ones with images picked from the internet.
              </p>
            </>
          ) : (
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
                {previews.map((url, i) => (
                  <div
                    key={i}
                    className="group relative aspect-3/4 overflow-hidden rounded border border-border"
                  >
                    <img
                      src={url}
                      alt={`Preview ${i + 1}`}
                      className="h-full w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
                {previews.length < 5 && (
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="flex aspect-3/4 flex-col items-center justify-center rounded border-2 border-dashed border-border text-ink-muted transition-colors hover:border-brand hover:text-brand"
                  >
                    <Upload size={18} strokeWidth={1.5} />
                    <span className="mt-1 text-[10px]">Add</span>
                  </button>
                )}
              </div>
              <p className="text-xs text-ink-muted">
                {images.length}/5 photos added
                {images.length < 3 && (
                  <span className="ml-1 text-red-500">
                    (need {3 - images.length} more)
                  </span>
                )}
              </p>
            </div>
          )}

          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
        </div>

        {/* Book details */}
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink">
              Book title <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={form.name}
              onChange={update("name")}
              placeholder="e.g. Physics Part I — Class 12"
              className="w-full rounded border border-border bg-surface px-4 py-3 text-sm text-ink placeholder:text-ink-muted outline-none transition-all focus:border-brand/50 focus:ring-2 focus:ring-brand/10"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink">
              Author <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={form.author}
              onChange={update("author")}
              placeholder="e.g. NCERT"
              className="w-full rounded border border-border bg-surface px-4 py-3 text-sm text-ink placeholder:text-ink-muted outline-none transition-all focus:border-brand/50 focus:ring-2 focus:ring-brand/10"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink">
                Category
              </label>
              <select
                value={form.category}
                onChange={update("category")}
                className="w-full rounded border border-border bg-surface px-4 py-3 text-sm text-ink outline-none focus:border-brand/50"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink">
                Price (₹) <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                value={form.price}
                onChange={update("price")}
                placeholder="e.g. 150"
                min="1"
                className="w-full rounded border border-border bg-surface px-4 py-3 text-sm text-ink placeholder:text-ink-muted outline-none transition-all focus:border-brand/50 focus:ring-2 focus:ring-brand/10"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-ink">
              Condition
            </label>
            <div className="grid grid-cols-3 gap-2">
              {CONDITIONS.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, condition: c.value }))}
                  className={`rounded border p-3 text-left transition-all ${
                    form.condition === c.value
                      ? "border-brand bg-brand-light text-brand"
                      : "border-border bg-surface-raised text-ink hover:border-brand/30"
                  }`}
                >
                  <p className="text-xs font-semibold">{c.label}</p>
                  <p className="mt-0.5 text-[10px] leading-tight opacity-70">
                    {c.hint}
                  </p>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink">
              Description{" "}
              <span className="font-normal text-ink-muted">(optional)</span>
            </label>
            <textarea
              value={form.description}
              onChange={update("description")}
              placeholder="Any notes about the book edition, missing pages, highlights, etc."
              rows={3}
              className="w-full resize-none rounded border border-border bg-surface px-4 py-3 text-sm text-ink placeholder:text-ink-muted outline-none transition-all focus:border-brand/50 focus:ring-2 focus:ring-brand/10"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink">
              Why are you passing this on?{" "}
              <span className="font-normal text-ink-muted">(optional)</span>
            </label>
            <p className="mb-2 text-[12px] text-ink-subtle">
              Readers love knowing the story behind a book.
            </p>
            <textarea
              value={form.sellerNote}
              onChange={update("sellerNote")}
              placeholder='e.g. "Read this three times. It changed how I think about home."'
              rows={2}
              className="w-full resize-none rounded border border-border bg-surface px-4 py-3 text-[14px] text-ink placeholder:text-ink-muted outline-none transition-all focus:border-brand/50 focus:ring-2 focus:ring-brand/10"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting || images.length < 3}
          className="w-full rounded bg-accent py-3.5 text-sm font-medium text-white transition-colors hover:bg-accent-hover disabled:opacity-50"
        >
          {submitting ? (
            <span className="flex items-center justify-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Submitting…
            </span>
          ) : (
            "Submit for approval"
          )}
        </button>

        <p className="text-center text-xs text-ink-muted">
          Listings are reviewed before going live. Usually approved within 24h.
        </p>
      </form>
    </div>
  );
}
