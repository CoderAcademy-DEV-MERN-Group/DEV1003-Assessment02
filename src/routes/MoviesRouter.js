import { Router } from 'express';
import { getReelCanon, searchMovie } from '../controllers/MovieController';

const router = Router();

router.get('/reel-canon', getReelCanon);
router.get('/search', searchMovie);

export default router;
