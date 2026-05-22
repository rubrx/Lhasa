import { Request, Response, NextFunction } from 'express';
import * as InquiryService from './inquiries.service';

export const createInquiry = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const buyerId = req.user!.userId;
        const bookId = Number(req.body.bookId);
        const inquiry = await InquiryService.createInquiry(buyerId, bookId, req.body.message);
        res.status(201).json({ success: true, inquiry });
    } catch (err) {
        next(err);
    }
};

export const getBookInquiries = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const bookId = Number(req.params.bookId);
        const inquiries = await InquiryService.getBookInquiries(bookId, req.user!.userId);
        res.status(200).json({ success: true, inquiries });
    } catch (err) {
        next(err);
    }
};
