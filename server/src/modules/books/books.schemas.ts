import { z } from 'zod';

const CONDITIONS = ['LIKE_NEW', 'GOOD', 'POOR'] as const;
const CATEGORIES = ['TEXTBOOK', 'NOVEL', 'COMPETITIVE', 'LITERATURE', 'OTHER'] as const;
const DECISIONS = ['APPROVED', 'REJECTED'] as const;

export const createBookSchema = z.object({
  name: z.string().min(1, 'Book name is required').max(200).trim(),
  author: z.string().min(1, 'Author is required').max(200).trim(),
  price: z.coerce.number().positive('Price must be greater than 0').max(100000),
  description: z.string().max(2000).trim().optional(),
  sellerNote: z.string().max(500).trim().optional(),
  condition: z.enum(CONDITIONS, { error: `Condition must be one of: ${CONDITIONS.join(', ')}` }),
  category: z.enum(CATEGORIES, { error: `Category must be one of: ${CATEGORIES.join(', ')}` }),
});

export const bookIdSchema = z.object({
  id: z.coerce.number().int().positive('Invalid book ID'),
});

export const reviewBookSchema = z.object({
  decision: z.enum(DECISIONS, { error: 'Decision must be APPROVED or REJECTED' }),
  rejectionReason: z.string().trim().optional(),
});

export const getBooksQuerySchema = z.object({
  search:    z.string().max(200).trim().optional(),
  category:  z.enum(CATEGORIES).optional(),
  condition: z.enum(CONDITIONS).optional(),
  maxPrice:  z.coerce.number().positive().max(1_000_000).optional(),
  page:      z.coerce.number().int().positive().max(1000).default(1),
  limit:     z.coerce.number().int().positive().max(100).default(20),
});
