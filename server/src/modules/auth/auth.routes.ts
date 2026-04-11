import { Router } from 'express';
import { register, login, forgotPasswordHandler, resetPasswordHandler, googleLoginHandler } from './auth.controller';

const authRouter = Router();

authRouter.post('/register',        register);
authRouter.post('/login',           login);
authRouter.post('/forgot-password', forgotPasswordHandler);
authRouter.post('/reset-password',  resetPasswordHandler);
authRouter.post('/google',          googleLoginHandler);

export default authRouter;
