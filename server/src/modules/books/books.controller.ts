import { Request, Response } from 'express';
import * as BookService from './books.service';

// CREATE BOOK
export const createBook = async (req: Request, res: Response) => {
    try {
        // req.user.userId → sellerId
        const sellerId = req.user!.userId;

        // req.body → book data
        const bookData = req.body;

        // req.files → uploaded images (multer puts them here)
        const files = req.files as Express.Multer.File[];

        // call BookService.createBook
        const book = await BookService.createBook(sellerId, bookData, files);

        return res.status(201).json({ success: true, book });
    } catch (error: any) {
        // return 201
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const getApprovedBooks = async (req: Request, res: Response) => {
    // simplest one — just call the service, return 200
    try {
        const books = await BookService.getApprovedBooks();

        return res.status(200).json({
            success: true,
            books,
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const getBookById = async (req: Request, res: Response) => {
    // req.params.id → remember to convert to number
    // handle BOOK_NOT_FOUND → 404
    try {
        const bookId = Number(req.params.id);

        const book = await BookService.getBookById(bookId);

        return res.status(200).json({
            success: true,
            book,
        });
    } catch (error: any) {
        if (error.message === 'BOOK_NOT_FOUND') {
            return res.status(404).json({
                success: false,
                message: 'Book not found',
            });
        }

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const getMyBooks = async (req: Request, res: Response) => {
    // req.user.userId
    try {
        const sellerId = req.user!.userId;

        const books = await BookService.getMyBooks(sellerId);

        return res.status(200).json({
            success: true,
            books,
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const deleteBook = async (req: Request, res: Response) => {
    // req.params.id + req.user.userId
    // handle BOOK_NOT_FOUND → 404
    // handle UNAUTHORIZED → 403
    try {
        const bookId = Number(req.params.id);
        const sellerId = req.user!.userId;

        await BookService.deleteBook(bookId, sellerId);

        return res.status(200).json({
            success: true,
            message: 'Book deleted successfully',
        });
    } catch (error: any) {
        if (error.message === 'BOOK_NOT_FOUND') {
            return res.status(404).json({
                success: false,
                message: 'Book not found',
            });
        }

        if (error.message === 'UNAUTHORIZED') {
            return res.status(403).json({
                success: false,
                message: 'You are not allowed to delete this book',
            });
        }

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const reviewBook = async (req: Request, res: Response) => {
    // req.params.id + req.body.decision + req.body.rejectionReason
    // handle REJECTION_REASON_REQUIRED → 400
    // handle BOOK_NOT_FOUND → 404
    try {
        const bookId = Number(req.params.id);
        const { decision, rejectionReason } = req.body;

        const book = await BookService.reviewBook(
            bookId,
            decision,
            rejectionReason
        );

        return res.status(200).json({
            success: true,
            book,
        });
    } catch (error: any) {
        if (error.message === 'REJECTION_REASON_REQUIRED') {
            return res.status(400).json({
                success: false,
                message: 'Rejection reason is required',
            });
        }

        if (error.message === 'BOOK_NOT_FOUND') {
            return res.status(404).json({
                success: false,
                message: 'Book not found',
            });
        }

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};