import { Router } from 'express';
import * as InquiryController from './inquiries.controller';
import { authenticate } from '../../middlewares/auth.middleware';
import { validate } from '../../middleware/validate';
import { writeLimiter } from '../../middleware/rate-limit';
import { createInquirySchema, bookIdParamSchema } from './inquiries.schemas';

const router = Router();

router.post('/',                authenticate, writeLimiter, validate(createInquirySchema), InquiryController.createInquiry);
router.get('/book/:bookId',     authenticate, validate(bookIdParamSchema, 'params'), InquiryController.getBookInquiries);

export default router;
