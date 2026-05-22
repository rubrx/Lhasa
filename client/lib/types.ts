export type UserRole = "ADMIN" | "USER";
export type BookCondition = "LIKE_NEW" | "GOOD" | "POOR";
export type BookCategory =
  | "TEXTBOOK"
  | "NOVEL"
  | "COMPETITIVE"
  | "LITERATURE"
  | "OTHER";
export type BookStatus = "UNSOLD" | "SOLD";
export type AdminCheck = "PENDING" | "APPROVED" | "REJECTED";

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  district: string | null;
  profileImg: string | null;
  role: UserRole;
  createdAt: string;
}

export interface BookSeller {
  id: number;
  name: string;
  district: string;
  phone?: string;
  email?: string;
}

export interface Book {
  id: number;
  name: string;
  author: string;
  price: number;
  description: string | null;
  condition: BookCondition;
  category: BookCategory;
  images: string[];
  status: BookStatus;
  adminCheck: AdminCheck;
  rejectionReason: string | null;
  createdAt: string;
  updatedAt: string;
  sellerId: number;
  Seller: BookSeller;
}

export interface Inquiry {
  id: number;
  message: string;
  isNotified: boolean;
  createdAt: string;
  bookId: number;
  buyerId: number;
  buyer: {
    id: number;
    name: string;
    email: string;
    phone: string;
  };
}
