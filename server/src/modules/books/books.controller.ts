import { Request, Response } from 'express';
import * as BookService from './books.service';

export const createBook = async (req: Request, res: Response) => {
    try {
        const sellerId = req.user!.userId;
        const files = req.files as Express.Multer.File[];
        const book = await BookService.createBook(sellerId, req.body, files);
        return res.status(201).json({ success: true, book });
    } catch (error: any) {
        if (error.message === 'MIN_IMAGES_REQUIRED')
            return res.status(400).json({ success: false, message: 'At least 3 images are required' });
        return res.status(500).json({ success: false, message: 'Failed to create listing' });
    }
};

export const getApprovedBooks = async (_req: Request, res: Response) => {
    try {
        const books = await BookService.getApprovedBooks();
        return res.status(200).json({ success: true, books });
    } catch {
        return res.status(500).json({ success: false, message: 'Failed to load books' });
    }
};

export const getBookById = async (req: Request, res: Response) => {
    try {
        const book = await BookService.getBookById(Number(req.params.id));
        return res.status(200).json({ success: true, book });
    } catch (error: any) {
        if (error.message === 'BOOK_NOT_FOUND')
            return res.status(404).json({ success: false, message: 'Book not found' });
        return res.status(500).json({ success: false, message: 'Failed to load book' });
    }
};

export const getMyBooks = async (req: Request, res: Response) => {
    try {
        const books = await BookService.getMyBooks(req.user!.userId);
        return res.status(200).json({ success: true, books });
    } catch {
        return res.status(500).json({ success: false, message: 'Failed to load your listings' });
    }
};

export const deleteBook = async (req: Request, res: Response) => {
    try {
        await BookService.deleteBook(req.user!.userId, Number(req.params.id));
        return res.status(200).json({ success: true, message: 'Book deleted successfully' });
    } catch (error: any) {
        if (error.message === 'BOOK_NOT_FOUND')
            return res.status(404).json({ success: false, message: 'Book not found' });
        if (error.message === 'UNAUTHORIZED')
            return res.status(403).json({ success: false, message: 'You are not allowed to delete this book' });
        return res.status(500).json({ success: false, message: 'Failed to delete book' });
    }
};

export const reviewBook = async (req: Request, res: Response) => {
    try {
        const { decision, rejectionReason } = req.body;
        const book = await BookService.reviewBook(Number(req.params.id), decision, rejectionReason);
        return res.status(200).json({ success: true, book });
    } catch (error: any) {
        if (error.message === 'REJECTION_REASON_REQUIRED')
            return res.status(400).json({ success: false, message: 'Rejection reason is required' });
        if (error.message === 'BOOK_NOT_FOUND')
            return res.status(404).json({ success: false, message: 'Book not found' });
        return res.status(500).json({ success: false, message: 'Failed to review book' });
    }
};

export const getPendingBooks = async (_req: Request, res: Response) => {
    try {
        const books = await BookService.getPendingBooks();
        return res.status(200).json({ success: true, books });
    } catch {
        return res.status(500).json({ success: false, message: 'Failed to load pending books' });
    }
};
