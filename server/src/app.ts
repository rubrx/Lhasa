import express from 'express';
import authRouter from './modules/auth/auth.routes';
import bookRouter from './modules/books/books.routes';
import inquiryRouter from './modules/inquiries/inquiries.routes';
import userRouter from './modules/users/user.routes';

const app = express();

// Middleware to parse JSON request bodies
// Without this, req.body will be undefined
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes will be registered here
app.use('/api/auth', authRouter);
app.use('/api/books', bookRouter);
app.use('/api/inquiries', inquiryRouter);
app.use('/api/users', userRouter);

export default app;
