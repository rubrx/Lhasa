import { Router } from 'express';
import * as UserController from './user.controller';
import { authenticate, authorizeAdmin } from '../../middlewares/auth.middleware';

const router = Router();

// GET  /api/users/me  → getMe
router.get('/me', authenticate, UserController.getMe);

// PATCH /api/users/me → updateMe
router.patch('/me', authenticate, UserController.updateMe);

// GET  /api/users      → getAllUsers  (admin only)
router.get('/', authenticate, authorizeAdmin, UserController.getAllUsers);


export default router;