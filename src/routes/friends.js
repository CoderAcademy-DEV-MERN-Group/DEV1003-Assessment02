// // Routes to get friendship information (status etc)

// import { Router } from 'express';
// import {
//   sendFriendRequest,
//   respondToFriendRequest,
//   getFriendshipStatus,
//   getFriendsList,
// } from '../controllers/friendshipController.js';

// const router = Router();

// // Route to send a friend request
// // POST /friends/request
// router.post('/request', sendFriendRequest);

// // Route to respond to a friend request to accept
// // POST /friends/respond - or PATCH if only updating boolean status?
// router.post('/respond', respondToFriendRequest);

// // Route to get friendship status
// // GET /friends/status
// router.get('/status', getFriendshipStatus);

// // Route to get list of friends
// // GET /friends/list
// router.get('/list/:userId', getFriendsList);

// // Route to unfriend a user
// // DELETE /friends/unfriend
// router.delete('/unfriend', unfriendUser);

// export default router;
