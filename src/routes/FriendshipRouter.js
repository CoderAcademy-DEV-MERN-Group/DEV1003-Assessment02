import { Router } from 'express';
import { verifyToken, requireAdmin } from '../utils/auth';
import {
  getAllFriendships,
  getUserFriendships,
  createFriendship,
  updateFriendship,
  removeFriendship,
} from '../controllers/FriendshipController';

const router = Router();

// Admin route to get all friendships - for admin overview purposes
router.get('/', verifyToken, requireAdmin, getAllFriendships);

// Get list of friends for the authenticated logged in user
router.get('/my-friends', verifyToken, getUserFriendships);

// Get list of friends for a specific user by userId (admin only)
router.get('/:userId', verifyToken, requireAdmin, getUserFriendships);

// Create a friendship
router.post('/', verifyToken, createFriendship);

// Update friendships
router.put('/my-friends/:id', verifyToken, updateFriendship);

// Update friendships for a specific user by userId (admin only)
router.put('/:id', verifyToken, updateFriendship);

// Remove an existing friendship (unfriend)
router.delete('/my-friends/:id', verifyToken, removeFriendship);

// Remove an existing friendship for a specific user by userId (admin only)
router.delete('/:id', verifyToken, requireAdmin, removeFriendship);

export default router;
/*
user profile
friends list
pending friend requests 

  - call this route: '/my-friends'
now we have a list of all friend documents for that user
now split them into pending and accepted
assign accepted to friends component
assign pending to pending requests component

what happens when i accept a friend request? 
one state for accepted
one state for pending
accept pending request
call route that changes to accepted
call /my-friends again to refresh data


if two routes
call /my-friends and my friends only returns documents where accepted is true
seperately call /my-friend-requests which returns documents where accepted is false
assign each to their respective components
call route to update friendship

call two routes again to refresh data
*/

/* get array of all friendships
split into 2 arrays where accepted is true and false
assign each to their respective components

array.flatMap(filter(friendship => friendship.accepted === true)

save it in database
update the friendship arrays 
move friendship that changed to the other array

/* USER ACCEPTING FRIEND REQUEST FLOW
1. user clicks accept on friend request component
2. call route to update friendship document to accepted
3. Either refresh data by calling /my-friends or directly update the state in frontend
cont - by removing friendship from pending state array to accepted state array
*/

/* 
MY FRIENDS = All my friendships pending or otherwise
/my-friends/:id is only a specific friend from my friends
but
that doesn't account for who sent the friend request
if req.user.id === friendship.requesterUserId
then we allow update
otherwise reject
*/
