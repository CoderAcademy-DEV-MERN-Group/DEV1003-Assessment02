import { Router } from 'express';
import { verifyToken } from '../utils/auth';
import User from '../models/User';

const router = Router();

router.get('/me', verifyToken, async (request, response, next) => {
  try {
    // Request user is added by payload in verifyToken
    const user = await User.findById(request.user.userId).select('-password'); // never shows the password directly

    if (!user) {
      return response.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    return response.status(200).json({
      success: true,
      data: { user },
    });
  } catch (error) {
    return next(error);
  }
});

export default router;
