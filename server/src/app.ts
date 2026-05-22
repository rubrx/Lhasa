import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import prisma from './services/lib/prisma';
import { env } from './config/env';
import { corsOptions } from './lib/cors';
import { errorHandler } from './middleware/error';
import { globalLimiter } from './middleware/rate-limit';
import authRouter from './modules/auth/auth.routes';
import bookRouter from './modules/books/books.routes';
import inquiryRouter from './modules/inquiries/inquiries.routes';
import userRouter from './modules/users/user.routes';

const app = express();

// Trust Render's proxy so rate-limit sees the real client IP, not the proxy IP
app.set('trust proxy', 1);

// Security headers — must come before CORS so headers aren't overwritten
app.use(helmet());

// Preflight before anything else, then CORS
// Express 5 requires '/{*path}' instead of '*' for wildcard routes
app.options('/{*path}', cors(corsOptions));
app.use(cors(corsOptions));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Global rate limit — applied to all routes
app.use(globalLimiter);

app.use('/api/auth',      authRouter);
app.use('/api/books',     bookRouter);
app.use('/api/inquiries', inquiryRouter);
app.use('/api/users',     userRouter);

app.get('/health', async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: 'ok', db: 'connected', env: env.NODE_ENV });
  } catch {
    res.status(503).json({ status: 'error', db: 'disconnected' });
  }
});

app.use((_req, res) => {
  res.status(404).json({ success: false, code: 'NOT_FOUND', message: 'Route not found' });
});

app.use(errorHandler);

export default app;
