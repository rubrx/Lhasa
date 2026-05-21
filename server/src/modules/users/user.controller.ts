import { Request, Response } from 'express';
import * as UserService from './user.service';

export const getMe = async (req: Request, res: Response) => {
    try {
        const userId = req.user!.userId;
        const user = await UserService.getMe(userId);
        return res.status(200).json({ success: true, user });
    } catch (error: any) {
        if (error.message === 'USER_NOT_FOUND')
            return res.status(404).json({ success: false, message: 'User not found' });
        return res.status(500).json({ success: false, message: 'Failed to load profile' });
    }
};

export const updateMe = async (req: Request, res: Response) => {
    try {
        const userId = req.user!.userId;
        const { name, phone, district } = req.body ?? {};
        const file = req.file as Express.Multer.File | undefined;

        if (phone !== undefined && !/^\d{10}$/.test(phone.trim())) {
            return res.status(400).json({ success: false, message: 'Phone number must be exactly 10 digits' });
        }

        const user = await UserService.updateMe(userId, { name, phone: phone?.trim(), district }, file);
        return res.status(200).json({ success: true, user });
    } catch (error: any) {
        if (error.message === 'PHONE_EXISTS')
            return res.status(409).json({ success: false, message: 'That phone number is already linked to another account. Please use a different number or sign in with email/password.' });
        return res.status(500).json({ success: false, message: 'Failed to update profile' });
    }
};

export const getAllUsers = async (_req: Request, res: Response) => {
    try {
        const users = await UserService.getAllUsers();
        return res.status(200).json({ success: true, users });
    } catch (error: any) {
        return res.status(500).json({ success: false, message: 'Failed to load users' });
    }
};
