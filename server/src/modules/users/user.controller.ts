import { Request, Response, NextFunction } from 'express';
import * as UserService from './user.service';

export const getMe = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await UserService.getMe(req.user!.userId);
        res.status(200).json({ success: true, user });
    } catch (err) {
        next(err);
    }
};

export const updateMe = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, phone, district } = req.body ?? {};
        const file = req.file as Express.Multer.File | undefined;
        const user = await UserService.updateMe(
            req.user!.userId,
            { name, phone: phone?.trim(), district },
            file,
        );
        res.status(200).json({ success: true, user });
    } catch (err) {
        next(err);
    }
};

export const getAllUsers = async (_req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await UserService.getAllUsers();
        res.status(200).json({ success: true, users });
    } catch (err) {
        next(err);
    }
};
