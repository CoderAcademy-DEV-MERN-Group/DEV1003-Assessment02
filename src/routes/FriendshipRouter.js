import { Router } from 'express';
import { verifyToken } from '../utils/auth';
import { validateFriendRequest } from '../utils/validation';
import { FriendshipController } from '../controllers/FriendshipController';

const router = Router();

// Create a friend request
router.post('/', verifyToken, validateFriendRequest, FriendshipController.createFriendRequest);

// Accept a friend request
router.patch('/:id/accept', verifyToken, FriendshipController.acceptFriendRequest);

// Reject a friend request
// router.patch('/:id/reject', authenticate, FriendshipController.rejectFriendRequest);

// Remove an existing friendship (unfriend)
router.delete('/:id', verifyToken, FriendshipController.removeFriendship);

// Get the incoming pending friend requests for the authenticated logged in user
router.get('/requests', verifyToken, FriendshipController.getIncomingFriendRequests);

// Get list of friends for the authenticated logged in user
router.get('/friends/:userId?', verifyToken, FriendshipController.listFriends);

export default router;
