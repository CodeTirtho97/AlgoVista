import express, { Router } from 'express';
import authRoutes from './authRoutes';
import algorithmRoutes from './algorithmRoutes';

const router: Router = express.Router();

// Mount route modules
router.use('/auth', authRoutes);
router.use('/algorithms', algorithmRoutes);

export default router;