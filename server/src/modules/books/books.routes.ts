import { Router } from 'express';
import * as BookController from './books.controller';
import { authenticate, authorizeAdmin } from '../../middlewares/auth.middleware';
import { upload } from '../../services/lib/multer';
import { validate } from '../../middleware/validate';
import { writeLimiter } from '../../middleware/rate-limit';
import { bookIdSchema, createBookSchema, reviewBookSchema } from './books.schemas';

const router = Router();

// Public
router.get('/',         BookController.getApprovedBooks);
router.get('/:id',      validate(bookIdSchema, 'params'), BookController.getBookById);

// Authenticated
router.get('/my',       authenticate, BookController.getMyBooks);
router.post('/',        authenticate, writeLimiter, upload.array('images'), validate(createBookSchema), BookController.createBook);
router.delete('/:id',   authenticate, validate(bookIdSchema, 'params'), BookController.deleteBook);

// Admin only — must be defined before /:id to avoid route conflict
router.get('/pending',  authenticate, authorizeAdmin, BookController.getPendingBooks);
router.patch(
  '/:id/review',
  authenticate,
  authorizeAdmin,
  validate(bookIdSchema, 'params'),
  validate(reviewBookSchema),
  BookController.reviewBook,
);

export default router;
