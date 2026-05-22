import { Router } from 'express';
import { register, login, forgotPasswordHandler, resetPasswordHandler, googleLoginHandler } from './auth.controller';
import { validate } from '../../middleware/validate';
import { authLimiter } from '../../middleware/rate-limit';
import { registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema, googleSchema } from './auth.schemas';

const authRouter = Router();

// authLimiter: 10 attempts per 15 minutes per IP — blocks brute-force on all auth endpoints
authRouter.post('/register',        authLimiter, validate(registerSchema),       register);
authRouter.post('/login',           authLimiter, validate(loginSchema),           login);
authRouter.post('/forgot-password', authLimiter, validate(forgotPasswordSchema),  forgotPasswordHandler);
authRouter.post('/reset-password',  authLimiter, validate(resetPasswordSchema),   resetPasswordHandler);
authRouter.post('/google',          authLimiter, validate(googleSchema),          googleLoginHandler);

export default authRouter;
