import { Request, Response } from 'express';
import { registerUser, loginUser, forgotPassword, resetPassword, googleLogin } from './auth.service';

export const register = async (req: Request, res: Response) => {
    const { name, email, phone, password, district } = req.body;
    try {
        const result = await registerUser({ name, email, phone, password, district });
        res.status(201).json({ success: true, user: result.user, token: result.token });
    } catch (error: any) {
        if (error.message === 'EMAIL_EXISTS') return res.status(409).json({ success: false, message: 'Email already registered' });
        if (error.message === 'PHONE_EXISTS') return res.status(409).json({ success: false, message: 'Phone number already registered' });
        console.error('Registration error', error);
        res.status(500).json({ success: false, message: 'Registration failed' });
    }
};

export const login = async (req: Request, res: Response) => {
    const { email, phone, password } = req.body;
    try {
        const result = await loginUser({ email, phone, password });
        res.status(200).json({ success: true, user: result.user, token: result.token });
    } catch (error: any) {
        if (error.message === 'INVALID_CREDENTIALS') return res.status(401).json({ success: false, message: 'Invalid email or password' });
        if (error.message === 'USE_GOOGLE_LOGIN') return res.status(400).json({ success: false, message: 'This account uses Google sign-in. Please use the Google button.' });
        console.error('Login error', error);
        res.status(500).json({ success: false, message: 'Login failed' });
    }
};

export const forgotPasswordHandler = async (req: Request, res: Response) => {
    const { email } = req.body;
    try {
        await forgotPassword(email);
        // Always return 200 — don't reveal if email exists
        res.status(200).json({ success: true, message: 'If that email is registered, a reset link has been sent.' });
    } catch (error: any) {
        console.error('Forgot password error', error);
        res.status(500).json({ success: false, message: 'Failed to send reset email' });
    }
};

export const resetPasswordHandler = async (req: Request, res: Response) => {
    const { token, password } = req.body;
    try {
        await resetPassword(token, password);
        res.status(200).json({ success: true, message: 'Password reset successfully' });
    } catch (error: any) {
        if (error.name === 'TokenExpiredError') return res.status(400).json({ success: false, message: 'Reset link has expired. Please request a new one.' });
        if (error.name === 'JsonWebTokenError' || error.message === 'INVALID_TOKEN') return res.status(400).json({ success: false, message: 'Invalid reset link' });
        console.error('Reset password error', error);
        res.status(500).json({ success: false, message: 'Failed to reset password' });
    }
};

export const googleLoginHandler = async (req: Request, res: Response) => {
    const { credential } = req.body;
    try {
        const result = await googleLogin(credential);
        res.status(200).json({ success: true, user: result.user, token: result.token, needsPhone: result.needsPhone });
    } catch (error: any) {
        console.error('Google login error', error);
        res.status(401).json({ success: false, message: 'Google sign-in failed' });
    }
};
