import { Request, Response, NextFunction } from 'express';
import { registerUser, loginUser, forgotPassword, resetPassword, googleLogin } from './auth.service';

export const register = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, email, phone, password, district } = req.body;
        const result = await registerUser({ name, email, phone, password, district });
        res.status(201).json({ success: true, user: result.user, token: result.token });
    } catch (err) {
        next(err);
    }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, phone, password } = req.body;
        const result = await loginUser({ email, phone, password });
        res.status(200).json({ success: true, user: result.user, token: result.token });
    } catch (err) {
        next(err);
    }
};

export const forgotPasswordHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await forgotPassword(req.body.email);
        res.status(200).json({ success: true, message: 'If that email is registered, a reset link has been sent.' });
    } catch (err) {
        next(err);
    }
};

export const resetPasswordHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await resetPassword(req.body.token, req.body.password);
        res.status(200).json({ success: true, message: 'Password reset successfully' });
    } catch (err) {
        next(err);
    }
};

export const googleLoginHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await googleLogin(req.body.credential);
        res.status(200).json({ success: true, user: result.user, token: result.token, needsPhone: result.needsPhone });
    } catch (err) {
        next(err);
    }
};
