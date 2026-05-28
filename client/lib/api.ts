import { Book, Inquiry, User } from "@/lib/types";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("lhasa_token");
}

function authHeaders(): Record<string, string> {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request<T>(path: string, options: RequestInit & { timeoutMs?: number } = {}): Promise<T> {
  const { timeoutMs = 15_000, ...fetchOptions } = options;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  // Only send credentials when the request carries a JWT — auth is header-based,
  // not cookie-based, so unauthenticated public requests don't need credentials.
  // This avoids forced CORS preflights on simple public GET endpoints.
  const headers = fetchOptions.headers as Record<string, string> | undefined;
  const credentials = headers?.['Authorization'] ? 'include' : 'omit';

  try {
    const response = await fetch(`${BASE_URL}${path}`, {
      ...fetchOptions,
      credentials,
      signal: fetchOptions.signal ?? controller.signal,
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Request failed");
    }
    return data as T;
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") {
      throw new Error("Request timed out — please try again");
    }
    throw err;
  } finally {
    clearTimeout(timer);
  }
}

// ─── Auth ──────────────────────────────────────────────────────────────────

export async function registerUser(payload: {
  name: string;
  email: string;
  phone: string;
  password: string;
  district?: string;
}) {
  return request<{ success: boolean; user: User; token: string }>(
    "/api/auth/register",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }
  );
}

export async function loginUser(payload: {
  email?: string;
  phone?: string;
  password: string;
}) {
  return request<{ success: boolean; user: User; token: string }>(
    "/api/auth/login",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }
  );
}

export async function forgotPassword(email: string) {
  return request<{ success: boolean; message: string }>("/api/auth/forgot-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
}

export async function resetPassword(token: string, password: string) {
  return request<{ success: boolean; message: string }>("/api/auth/reset-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, password }),
  });
}

export async function googleAuth(credential: string) {
  return request<{ success: boolean; user: User; token: string; needsPhone: boolean }>(
    "/api/auth/google",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ credential }),
    }
  );
}

// ─── Users ─────────────────────────────────────────────────────────────────

export async function getMe() {
  return request<{ success: boolean; user: User }>("/api/users/me", {
    headers: authHeaders(),
  });
}

export async function updateProfile(data: {
  name?: string;
  phone?: string;
  district?: string;
  profileImg?: File;
}) {
  // Send as multipart only when there's a file; otherwise JSON is simpler and safer
  if (data.profileImg) {
    const formData = new FormData();
    if (data.name)     formData.append("name",       data.name);
    if (data.phone)    formData.append("phone",      data.phone);
    if (data.district) formData.append("district",   data.district);
    formData.append("profileImg", data.profileImg);

    return request<{ success: boolean; user: User }>("/api/users/me", {
      method: "PATCH",
      headers: authHeaders(),
      body: formData,
    });
  }

  return request<{ success: boolean; user: User }>("/api/users/me", {
    method: "PATCH",
    headers: { ...authHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify({ name: data.name, phone: data.phone, district: data.district }),
  });
}

// ─── Books ─────────────────────────────────────────────────────────────────

export async function getApprovedBooks(params?: {
  search?: string;
  category?: string;
  condition?: string;
  maxPrice?: number;
  page?: number;
  limit?: number;
}) {
  const qs = new URLSearchParams();
  if (params?.search)   qs.set("search",   params.search);
  if (params?.category) qs.set("category", params.category);
  if (params?.condition) qs.set("condition", params.condition);
  if (params?.maxPrice)  qs.set("maxPrice", String(params.maxPrice));
  if (params?.page)      qs.set("page",     String(params.page));
  if (params?.limit)     qs.set("limit",    String(params.limit));
  const query = qs.toString();
  return request<{ success: boolean; books: Book[]; total: number }>(
    `/api/books${query ? `?${query}` : ""}`
  );
}

export async function getBookStats() {
  return request<{ success: boolean; total: number; thisWeek: number }>("/api/books/stats");
}

export async function getBookById(id: number) {
  return request<{ success: boolean; book: Book }>(`/api/books/${id}`);
}

export async function getMyBooks() {
  return request<{ success: boolean; books: Book[] }>("/api/books/my", {
    headers: authHeaders(),
  });
}

export async function createBook(formData: FormData) {
  return request<{ success: boolean; book: Book }>("/api/books", {
    method: "POST",
    // Do NOT set Content-Type — browser sets multipart/form-data with boundary automatically
    headers: authHeaders(),
    body: formData,
    timeoutMs: 180_000, // images upload to Cloudinary server-side; allow 3 min for slow connections
  });
}

export async function deleteBook(bookId: number) {
  return request<{ success: boolean; message: string }>(`/api/books/${bookId}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
}

// ─── Admin ─────────────────────────────────────────────────────────────────

export async function getPendingBooks() {
  return request<{ success: boolean; books: Book[] }>("/api/books/pending", {
    headers: authHeaders(),
  });
}

export async function reviewBook(
  bookId: number,
  decision: "APPROVED" | "REJECTED",
  rejectionReason?: string
) {
  return request<{ success: boolean; book: Book }>(
    `/api/books/${bookId}/review`,
    {
      method: "PATCH",
      headers: { ...authHeaders(), "Content-Type": "application/json" },
      body: JSON.stringify({ decision, rejectionReason }),
    }
  );
}

// ─── Inquiries ─────────────────────────────────────────────────────────────

export async function createInquiry(bookId: number, message: string) {
  return request<{ success: boolean; inquiry: Inquiry }>("/api/inquiries", {
    method: "POST",
    headers: { ...authHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify({ bookId, message }),
  });
}

export async function getBookInquiries(bookId: number) {
  return request<{ success: boolean; inquiries: Inquiry[] }>(
    `/api/inquiries/book/${bookId}`,
    { headers: authHeaders() }
  );
}
