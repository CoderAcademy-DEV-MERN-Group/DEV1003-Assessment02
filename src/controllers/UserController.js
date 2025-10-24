import { Router } from 'express';
// import { verifyToken } from '../utils/auth';
// import User from '../models/User';

const router = Router();

/*
// pass verifyToken as middleware here, this will validate the token 
router.get('/me', verifyToken, async (request, response, next) => {
  try {

    // Request user is added by payload in verifyToken
    const user = await User.findById(request.user.userId).select('-password'); // never shows the password directly

    // IF there's no matching user:
    if (!user) {
      return response.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // IF the user exists: 
    return response.status(200).json({
      success: true,
      data: { user }, // send whole user object (except password, which is excluded above)
    });
  } catch (error) {
    return next(error);
  }
});
*/
export default router;
