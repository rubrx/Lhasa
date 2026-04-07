import { Request, Response } from 'express';
import * as UserService from './user.service';

export const getMe = async (req: Request, res: Response) => {
    try {
        const userId = req.user!.userId;

        const user = await UserService.getMe(userId);

        return res.status(200).json({ success: true, user });
    } catch (error: any) {
        if (error.message === 'USER_NOT_FOUND') {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const updateMe = async (req: Request, res: Response) => {
    try {
        const userId = req.user!.userId;
        const { name, phone, district } = req.body;

        const user = await UserService.updateMe(userId, { name, phone, district });

        return res.status(200).json({ success: true, user });
    } catch (error: any) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

