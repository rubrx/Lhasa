import express from 'express';
import cors from 'cors';
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

export default app;
