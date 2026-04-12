import express from 'express';
import cors from 'cors';
import prisma from './services/lib/prisma';
import authRouter from './modules/auth/auth.routes';
import bookRouter from './modules/books/books.routes';
import inquiryRouter from './modules/inquiries/inquiries.routes';
import userRouter from './modules/users/user.routes';

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRouter);
app.use('/api/books', bookRouter);
app.use('/api/inquiries', inquiryRouter);
app.use('/api/users', userRouter);

app.get('/health', async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: 'ok', db: 'connected' });
  } catch {
    res.status(500).json({ status: 'error', db: 'disconnected' });
  }
});

export default app;
