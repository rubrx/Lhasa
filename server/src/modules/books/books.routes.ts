import { Router } from 'express';
import * as BookController from './books.controller';
import { authenticate, authorizeAdmin } from '../../middlewares/auth.middleware';
import { upload } from '../../services/lib/multer';

const router = Router();

// GET    /                    → getApprovedBooks  (public)
router.get('/', BookController.getApprovedBooks);

// GET    /my                  → getMyBooks        (authenticate)
router.get('/my', authenticate, BookController.getMyBooks);

// GET    /pending             → getPendingBooks   (admin only) — must be before /:id
router.get('/pending', authenticate, authorizeAdmin, BookController.getPendingBooks);

// GET    /:id                 → getBookById       (public)
router.get('/:id', BookController.getBookById);

// POST   /                    → createBook        (authenticate + multer)
router.post('/', authenticate, upload.array('images'), BookController.createBook);

// DELETE /:id                 → deleteBook        (authenticate)
router.delete('/:id', authenticate, BookController.deleteBook);

// PATCH  /:id/review          → reviewBook        (authenticate + authorizeAdmin)
router.patch(
  '/:id/review',
  authenticate,
  authorizeAdmin,
  BookController.reviewBook
);

export default router;
