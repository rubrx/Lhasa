import { Router } from 'express';
import * as InquiryController from './inquiries.controller';
import { authenticate } from '../../middlewares/auth.middleware';

const router = Router();

// POST /api/inquiries         → createInquiry (authenticated buyers)
router.post('/', authenticate, InquiryController.createInquiry);

// GET  /api/inquiries/book/:bookId → getBookInquiries (seller only)
router.get('/book/:bookId', authenticate, InquiryController.getBookInquiries);

export default router;