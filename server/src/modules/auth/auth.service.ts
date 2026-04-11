import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import prisma from '../../services/lib/prisma';

const SALT_ROUNDS = 10;

// ─── Email transporter (configure via env vars) ───────────────────────────
const transporter = nodemailer.createTransport({
    host:   process.env.SMTP_HOST || 'smtp.gmail.com',
    port:   Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

// ─── Register ────────────────────────────────────────────────────────────
export const registerUser = async (data: {
    name: string;
    email: string;
    phone: string;
    password: string;
    district?: string;
}) => {
    const existingEmail = await prisma.user.findUnique({ where: { email: data.email } });
    if (existingEmail) throw new Error('EMAIL_EXISTS');

    const existingPhone = await prisma.user.findUnique({ where: { phone: data.phone } });
    if (existingPhone) throw new Error('PHONE_EXISTS');

    const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS);

    const user = await prisma.user.create({
        data: {
            name: data.name,
            email: data.email,
            phone: data.phone,
            password: hashedPassword,
            district: data.district ?? 'Lohit',
        },
        select: {
            id: true, name: true, email: true, phone: true,
            district: true, role: true, profileImg: true, createdAt: true,
        },
    });

    const token = jwt.sign(
        { userId: user.id, role: user.role },
        process.env.JWT_SECRET as string,
        { expiresIn: '7d' }
    );

    return { user, token };
};

// ─── Login ───────────────────────────────────────────────────────────────
export const loginUser = async (data: { email?: string; phone?: string; password: string }) => {
    if (!data.email && !data.phone) throw new Error('EMAIL_OR_PHONE_REQUIRED');

    const user = await prisma.user.findFirst({
        where: {
            OR: [
                ...(data.email ? [{ email: data.email }] : []),
                ...(data.phone ? [{ phone: data.phone }] : []),
            ],
        },
        select: {
            id: true, name: true, email: true, phone: true,
            password: true, district: true, role: true, profileImg: true, createdAt: true,
        },
    });

    if (!user) throw new Error('INVALID_CREDENTIALS');
    if (!user.password) throw new Error('USE_GOOGLE_LOGIN'); // OAuth-only account

    const isMatch = await bcrypt.compare(data.password, user.password);
    if (!isMatch) throw new Error('INVALID_CREDENTIALS');

    if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET_NOT_DEFINED');

    const token = jwt.sign(
        { userId: user.id, role: user.role },
        process.env.JWT_SECRET as string,
        { expiresIn: '7d' }
    );

    const { password: _, ...safeUser } = user;
    return { user: safeUser, token };
};

// ─── Forgot password ─────────────────────────────────────────────────────
export const forgotPassword = async (email: string) => {
    const user = await prisma.user.findUnique({ where: { email } });
    // Return silently if not found — don't leak whether email is registered
    if (!user || !user.password) return;

    const resetToken = jwt.sign(
        { userId: user.id, purpose: 'reset' },
        process.env.JWT_SECRET as string,
        { expiresIn: '15m' }
    );

    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;

    await transporter.sendMail({
        from: `"Lhasa Books" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
        to: email,
        subject: 'Reset your Lhasa password',
        html: `
            <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px 24px">
                <h2 style="font-size:20px;color:#0a0a0a;margin-bottom:8px">Reset your password</h2>
                <p style="color:#444;line-height:1.6">Hi ${user.name},</p>
                <p style="color:#444;line-height:1.6">Click the button below to reset your password. This link expires in <strong>15 minutes</strong>.</p>
                <a href="${resetUrl}" style="display:inline-block;margin:20px 0;padding:12px 24px;background:#3d6b52;color:#fff;border-radius:10px;text-decoration:none;font-weight:600">Reset password</a>
                <p style="color:#888;font-size:13px">If you didn't request this, you can safely ignore this email.</p>
                <hr style="border:none;border-top:1px solid #e2e2de;margin:24px 0"/>
                <p style="color:#888;font-size:12px">Lhasa · Books. Local. Affordable.</p>
            </div>
        `,
    });
};

// ─── Reset password ───────────────────────────────────────────────────────
export const resetPassword = async (token: string, newPassword: string) => {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
        userId: number;
        purpose: string;
    };

    if (decoded.purpose !== 'reset') throw new Error('INVALID_TOKEN');

    const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);

    await prisma.user.update({
        where: { id: decoded.userId },
        data: { password: hashedPassword },
    });
};

// ─── Google OAuth ─────────────────────────────────────────────────────────
export const googleLogin = async (credential: string) => {
    // credential is a Google access token from useGoogleLogin
    // Fetch user info from Google's userinfo endpoint
    const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${credential}` },
    });

    if (!res.ok) throw new Error('INVALID_GOOGLE_TOKEN');

    const { email, name, sub: googleId, picture } = await res.json() as {
        email: string;
        name: string;
        sub: string;
        picture?: string;
    };

    if (!email) throw new Error('INVALID_GOOGLE_TOKEN');

    // Find by googleId first, then by email (to link existing account)
    let user = await prisma.user.findFirst({
        where: { OR: [{ googleId }, { email }] },
    });

    if (!user) {
        user = await prisma.user.create({
            data: {
                name: name || email.split('@')[0],
                email,
                googleId,
                profileImg: picture ?? null,
            },
        });
    } else if (!user.googleId) {
        // Link Google to existing email/password account
        user = await prisma.user.update({
            where: { id: user.id },
            data: { googleId },
        });
    }

    const token = jwt.sign(
        { userId: user.id, role: user.role },
        process.env.JWT_SECRET as string,
        { expiresIn: '7d' }
    );

    const { password: _, ...safeUser } = user;

    return {
        user: safeUser,
        token,
        needsPhone: !user.phone, // frontend redirects to /complete-profile
    };
};
