import { Router } from 'express';
import { verifyToken } from '../utils/auth';
import {
  createReelProgress,
  getReelProgress,
  updateReelProgress,
} from '../controllers/ReelProgressController';

const router = Router();

router.get('/', verifyToken, getReelProgress);
router.post('/', verifyToken, createReelProgress);
router.patch('/:movieId', verifyToken, updateReelProgress);

export default router;
