import { Router } from 'express';
import * as BookController from './books.controller';
import { authenticate, authorizeAdmin } from '../../middlewares/auth.middleware';

const router = Router();

// GET    /                    → getApprovedBooks  (public)
router.get('/', BookController.getApprovedBooks);

// GET    /my                  → getMyBooks        (authenticate)
router.get('/my', authenticate, BookController.getMyBooks);

// GET    /:id                 → getBookById       (public)
router.get('/:id', BookController.getBookById);

// POST   /                    → createBook        (authenticate)
router.post('/', authenticate, BookController.createBook);

// DELETE /:id                 → deleteBook        (authenticate)
router.delete('/:id', authenticate, BookController.deleteBook);

// PATCH  /:id/review          → reviewBook        (authenticate + authorizeAdmin)
router.patch(
    '/:id/review',
    authenticate,
    authorizeAdmin,
    BookController.reviewBook
);

// GET /api/books/pending  → getPendingBooks (admin only)
router.get('/pending', authenticate, authorizeAdmin, BookController.getPendingBooks);

export default router;