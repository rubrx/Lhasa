import express from 'express';
import authRouter from './modules/auth/auth.routes';

const app = express();

// Middleware to parse JSON request bodies
// Without this, req.body will be undefined
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes will be registered here
app.use('/api/auth', authRouter);


export default app;
