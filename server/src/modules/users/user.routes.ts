import { Router } from 'express';
import * as UserController from './user.controller';
import { authenticate, authorizeAdmin } from '../../middlewares/auth.middleware';
import { upload } from '../../services/lib/multer';

const router = Router();

// GET  /api/users/me  → getMe
router.get('/me', authenticate, UserController.getMe);

// PATCH /api/users/me → updateMe (supports optional profile image upload)
router.patch('/me', authenticate, upload.single('profileImg'), UserController.updateMe);

// GET  /api/users      → getAllUsers  (admin only)
router.get('/', authenticate, authorizeAdmin, UserController.getAllUsers);

export default router;
