import { Router } from 'express';
import * as BookController from './books.controller';
import { authenticate, authorizeAdmin } from '../../middlewares/auth.middleware';
import { upload } from '../../services/lib/multer';
import { validate } from '../../middleware/validate';
import { writeLimiter } from '../../middleware/rate-limit';
import { bookIdSchema, createBookSchema, reviewBookSchema } from './books.schemas';

const router = Router();

// Static routes must come before /:id to avoid the dynamic segment swallowing them
router.get('/',         BookController.getApprovedBooks);
router.get('/stats',    BookController.getStats);
router.get('/my',       authenticate, BookController.getMyBooks);
router.get('/pending',  authenticate, authorizeAdmin, BookController.getPendingBooks);

// Dynamic
router.get('/:id',      validate(bookIdSchema, 'params'), BookController.getBookById);

// Write
router.post('/',        authenticate, writeLimiter, upload.array('images'), validate(createBookSchema), BookController.createBook);
router.delete('/:id',   authenticate, validate(bookIdSchema, 'params'), BookController.deleteBook);
router.patch(
  '/:id/review',
  authenticate,
  authorizeAdmin,
  validate(bookIdSchema, 'params'),
  validate(reviewBookSchema),
  BookController.reviewBook,
);

export default router;
