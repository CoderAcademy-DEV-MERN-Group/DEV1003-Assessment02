import { Router } from 'express';
import {
  getUserProfile,
  updateUserProfile,
  updateUserPassword,
  deleteUserProfile,
} from '../controllers/UserController';
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
router.put('/:userId', verifyToken, updateUserProfile);

// Update current user password
router.put('/my-profile/update-password', verifyToken, updateUserPassword);

// Update another user's password (admin only - with userId param)
router.put('/:userId/update-password', verifyToken, updateUserPassword);

// Delete current user profile
router.delete('/my-profile', verifyToken, deleteUserProfile);

// Delete another user's profile (admin only - with userId param)
router.delete('/:userId', verifyToken, deleteUserProfile);

export default router;
