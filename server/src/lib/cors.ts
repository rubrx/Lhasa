import type { CorsOptions } from 'cors';
import { env } from '../config/env';

// Origins explicitly listed in FRONTEND_URL env var (comma-separated)
const STATIC_ORIGINS = env.FRONTEND_URL.split(',').map((o) => o.trim());

// Matches any Vercel preview URL for the "lhasa" project:
// e.g. https://lhasa-git-fix-cors-team.vercel.app
//      https://lhasa-abc123def.vercel.app
const VERCEL_PREVIEW_RE = /^https:\/\/lhasa(-[a-z0-9-]+)?\.vercel\.app$/;

function isAllowedOrigin(origin: string): boolean {
  if (STATIC_ORIGINS.includes(origin)) return true;
  if (VERCEL_PREVIEW_RE.test(origin)) return true;
  // Allow any localhost port in non-production (dev + CI)
  if (env.NODE_ENV !== 'production' && /^http:\/\/localhost:\d+$/.test(origin)) return true;
  return false;
}

export const corsOptions: CorsOptions = {
  origin(requestOrigin, callback) {
    // No origin = server-to-server request (curl, Render health checks) — allow
    if (!requestOrigin) return callback(null, true);

    if (isAllowedOrigin(requestOrigin)) return callback(null, true);

    // Returning false blocks the request without logging an unhandled error
    callback(null, false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['X-Request-Id'],
  maxAge: 86400, // cache preflight 24 h — browsers won't re-send OPTIONS every request
};
