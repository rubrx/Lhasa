import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100).trim(),
  email: z.string().email('Invalid email address').toLowerCase().trim(),
  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit Indian mobile number'),
  password: z.string().min(8, 'Password must be at least 8 characters').max(128),
  district: z.string().trim().optional(),
});

export const loginSchema = z
  .object({
    email: z.string().email().toLowerCase().trim().optional(),
    phone: z.string().trim().optional(),
    password: z.string().min(1, 'Password is required'),
  })
  .refine((d) => d.email || d.phone, {
    message: 'Provide either email or phone',
    path: ['email'],
  });

export const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address').toLowerCase().trim(),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  password: z.string().min(8, 'Password must be at least 8 characters').max(128),
});

export const googleSchema = z.object({
  credential: z.string().min(1, 'Google credential is required'),
});
