import { Router } from 'express';
import {
  createMovie,
  deleteMovie,
  getMovie,
  getReelCanon,
  searchMovie,
  updateMoviePosterUrl,
} from '../controllers/MovieController';
import { requireAdmin, verifyToken } from '../utils/auth';

const router = Router();

router.get('/reel-canon', getReelCanon);
router.get('/search', verifyToken, searchMovie);
router.get('/:imdbId', verifyToken, getMovie);
router.post('/', verifyToken, createMovie);
router.patch('/:imdbId', verifyToken, requireAdmin, updateMoviePosterUrl);
router.delete('/:imdbId', verifyToken, deleteMovie);

export default router;
