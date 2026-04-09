import { Book, Inquiry, User } from "./types";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8081";

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("lhasa_token");
}

function authHeaders(): Record<string, string> {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, options);
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }
  return data as T;
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

// ─── Users ─────────────────────────────────────────────────────────────────

export async function getMe() {
  return request<{ success: boolean; user: User }>("/api/users/me", {
    headers: authHeaders(),
  });
}

// ─── Books ─────────────────────────────────────────────────────────────────

export async function getApprovedBooks() {
  return request<{ success: boolean; books: Book[] }>("/api/books");
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
