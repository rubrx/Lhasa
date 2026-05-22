import { z } from 'zod';

export const createInquirySchema = z.object({
  bookId: z.coerce.number().int().positive('Invalid book ID'),
  message: z.string().min(1, 'Message is required').max(1000).trim(),
});

export const bookIdParamSchema = z.object({
  bookId: z.coerce.number().int().positive('Invalid book ID'),
});
