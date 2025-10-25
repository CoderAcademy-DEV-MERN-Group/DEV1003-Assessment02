import { Router } from 'express';
import { getUserProfile, updateUserProfile } from '../controllers/UserController';
import { verifyToken } from '../utils/auth';
// import User from '../models/User';

const router = Router();

// Get current user profile
router.get('/my-profile', verifyToken, getUserProfile);

// Get user profile by ID (for viewing other users' profiles)
router.get('/:userId', getUserProfile);

// Update current user profile
router.put('/my-profile', verifyToken, updateUserProfile);

// Update another user's profile (admin only - with userId param)
router.put('/my-profile/:userId', verifyToken, updateUserProfile);

// Update current user password
router.put('/my-profile/update-password', async (req, res, next) => {
  // Placeholder response until implemented
  try {
    // Create updateUserPassword fn in UserController to update user password
    return res.status(200).json({
      success: true,
      message: 'User profile route is under construction',
    });
  } catch (error) {
    return next(error);
  }
});

// Delete current user profile
router.delete('/my-profile', async (req, res, next) => {
  // Placeholder response until implemented
  try {
    // Create deleteUserProfile fn in UserController to delete user profile data
    return res.status(200).json({
      success: true,
      message: 'User profile route is under construction',
    });
  } catch (error) {
    return next(error);
  }
});

export default router;
