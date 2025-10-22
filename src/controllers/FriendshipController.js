import { Router } from 'express';

const router = Router();

export default router;

// import Friendship from '../models/Friendship';
// import User from '../models/User';

// Controller for sending friend request
// Route = POST /friends/request

// export async function sendFriendRequest(request, respond) {
//     try {
//         const { requesterUserId, recipientUserId } = request.body;

//         // Check if user exist

//         // if user B does not exist, return invalid user error

//         // If both users exist, create friendship request

//         // Validate the existing status of friendship between both users

// }

// Controller to respond to a friend request to accept or reject
// Route = POST /friends/respond

// Controller to get friendship status
// Route =GET /friends/status

// Controller to get list of friends
// Route = GET /friends/list/:userId
