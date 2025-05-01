import express, { Router } from 'express';
import * as algorithmController from '../controllers/algorithmController';
import { authenticate } from '../middleware/authMiddleware';

const router: Router = express.Router();

// Public routes
router.get('/', algorithmController.getAllAlgorithms);
router.get('/:id', algorithmController.getAlgorithm);

// Protected routes
router.post('/', authenticate, algorithmController.createAlgorithm);
router.put('/:id', authenticate, algorithmController.updateAlgorithm);
router.delete('/:id', authenticate, algorithmController.deleteAlgorithm);
router.post('/:id/execute', authenticate, algorithmController.executeAlgorithm);

export default router;