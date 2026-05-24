import { Request, Response, NextFunction } from 'express';
import * as BookService from './books.service';

export const createBook = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const sellerId = req.user!.userId;
        const files = req.files as Express.Multer.File[];
        const book = await BookService.createBook(sellerId, req.body, files);
        res.status(201).json({ success: true, book });
    } catch (err) {
        next(err);
    }
};

export const getApprovedBooks = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { search, category, condition, maxPrice, page, limit } = req.query;
        const result = await BookService.getApprovedBooks({
            search: search as string | undefined,
            category: category as any,
            condition: condition as any,
            maxPrice: maxPrice ? Number(maxPrice) : undefined,
            page: page ? Number(page) : undefined,
            limit: limit ? Number(limit) : undefined,
        });
        res.status(200).json({ success: true, ...result });
    } catch (err) {
        next(err);
    }
};

export const getBookById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const book = await BookService.getBookById(Number(req.params.id));
        res.status(200).json({ success: true, book });
    } catch (err) {
        next(err);
    }
};

export const getMyBooks = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const books = await BookService.getMyBooks(req.user!.userId);
        res.status(200).json({ success: true, books });
    } catch (err) {
        next(err);
    }
};

export const deleteBook = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await BookService.deleteBook(req.user!.userId, Number(req.params.id));
        res.status(200).json({ success: true, message: 'Book deleted successfully' });
    } catch (err) {
        next(err);
    }
};

export const reviewBook = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { decision, rejectionReason } = req.body;
        const book = await BookService.reviewBook(Number(req.params.id), decision, rejectionReason);
        res.status(200).json({ success: true, book });
    } catch (err) {
        next(err);
    }
};

export const getPendingBooks = async (_req: Request, res: Response, next: NextFunction) => {
    try {
        const books = await BookService.getPendingBooks();
        res.status(200).json({ success: true, books });
    } catch (err) {
        next(err);
    }
};

export const getStats = async (_req: Request, res: Response, next: NextFunction) => {
    try {
        const stats = await BookService.getStats();
        res.status(200).json({ success: true, ...stats });
    } catch (err) {
        next(err);
    }
};
