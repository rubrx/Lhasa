import { Request, Response } from 'express';
import * as InquiryService from './inquiries.service';

export const createInquiry = async (req: Request, res: Response) => {
    try {
        const buyerId = req.user!.userId;
        const bookId = Number(req.body.bookId);
        const { message } = req.body;

        const inquiry = await InquiryService.createInquiry(buyerId, bookId, message);

        return res.status(201).json({ success: true, inquiry });
    } catch (error: any) {
        if (error.message === 'BOOK_NOT_FOUND') {
            return res.status(404).json({ success: false, message: 'Book not found' });
        }
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const getBookInquiries = async (req: Request, res: Response) => {
    try {
        const userId = req.user!.userId;
        const bookId = Number(req.params.bookId);

        const inquiries = await InquiryService.getBookInquiries(bookId, userId);

        return res.status(200).json({ success: true, inquiries });
    } catch (error: any) {
        if (error.message === 'BOOK_NOT_FOUND') {
            return res.status(404).json({ success: false, message: 'Book not found' });
        }
        if (error.message === 'UNAUTHORIZED') {
            return res.status(403).json({ success: false, message: 'Access denied' });
        }
        return res.status(500).json({ success: false, message: error.message });
    }
};