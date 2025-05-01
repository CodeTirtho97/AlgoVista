import express, {Router} from 'express';
import { authController } from '../controllers';
import { authenticate } from '../middleware/authMiddleware';

const router: Router = express.Router();

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);

// Protected routes
router.get('/profile', authenticate, authController.getProfile);
router.put('/profile', authenticate, authController.updateProfile);
router.put('/password', authenticate, authController.changePassword);
router.put('/settings', authenticate, authController.updateSettings);

export default router;