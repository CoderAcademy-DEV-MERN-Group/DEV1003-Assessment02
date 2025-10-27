import { Router } from 'express';
import { requireAdmin, verifyToken } from '../utils/auth';
import {
  adminDeleteReelProgress,
  adminGetAllReels,
  createReelProgress,
  deleteReelProgress,
  getReelProgress,
  updateReelProgress,
} from '../controllers/ReelProgressController';
import { validateReelProgress } from '../utils/validation';

const router = Router();

// User authorized routes
router.get('/', verifyToken, getReelProgress);
router.post('/', verifyToken, validateReelProgress, createReelProgress);
router.patch('/:movieId', verifyToken, validateReelProgress, updateReelProgress);
router.delete('/:movieId', verifyToken, deleteReelProgress);

// Admin authorized routes
router.get('/admin/', verifyToken, requireAdmin, adminGetAllReels);
router.delete(
  '/admin/user/:userId/movie/:movieId',
  verifyToken,
  requireAdmin,
  adminDeleteReelProgress,
);

export default router;
