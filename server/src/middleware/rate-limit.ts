import rateLimit from 'express-rate-limit';

const rateLimitResponse = (message: string) => ({
  success: false,
  code: 'RATE_LIMITED',
  message,
});

// Auth endpoints — tight limit to block brute-force and credential stuffing
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: rateLimitResponse('Too many attempts. Try again in 15 minutes.'),
});

// Write endpoints — moderate limit for form submissions
export const writeLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: rateLimitResponse('Too many requests. Slow down.'),
});

// Global fallback — high ceiling, just blocks hammering
export const globalLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 120,
  standardHeaders: true,
  legacyHeaders: false,
  message: rateLimitResponse('Too many requests.'),
});
