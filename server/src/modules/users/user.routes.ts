import { Router } from 'express';
import * as UserController from './user.controller';
import { authenticate, authorizeAdmin } from '../../middlewares/auth.middleware';
import { upload } from '../../services/lib/multer';
import { validate } from '../../middleware/validate';
import { updateMeSchema } from './user.schemas';

const router = Router();

router.get('/me',   authenticate, UserController.getMe);
router.patch('/me', authenticate, upload.single('profileImg'), validate(updateMeSchema), UserController.updateMe);
router.get('/',     authenticate, authorizeAdmin, UserController.getAllUsers);

export default router;
