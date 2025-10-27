import mongoose from 'mongoose';
import Friendship from '../models/Friendship.js';
import User from '../models/User.js';

// import { verifyToken } from '../utils/auth.js';
// getAllFriendships,
// getUserFriendships,
// createFriendship,
// updateFriendship,
// removeFriendship,

// Notes:
// Payload inside JWT token includes decoded user.id, user.username, user.isAdmin

// // Admin route to get all friendships - for admin overview purposes
// router.get('/', verifyToken, requireAdmin, getAllFriendships);
export const getAllFriendships = async (request, respond, next) => {
  try {
    // Database query to get all friendships documents
    const friendships = await Friendship.find();

    return respond.status(200).json({
      success: true,
      // returns the list of all friendships data
      // If the friendships doc is empty, then return an empty array
      friendships,
    });
  } catch (error) {
    next(error);
  }
};

// // Get list of friends for the authenticated logged in user
// router.get('/my-friends', verifyToken, getUserFriendships);
export const getUserFriendships = async (request, respond, next) => {
  try {
    // Get id from request parameters or user object
    const userId = request.user.id;
    // // Database query to get friendships for the specific user
    const friendships = await Friendship.find({
      $or: [{ user1: userId }, { user2: userId }],
    });
    // if empty return message saying no friendships found for this user
    if (friendships.length === 0) {
      return respond.status(404).json({
        success: false,
        message: 'No friendships found for this user',
      });
    }
    // Return the list of user's friendships
    // Return success message with friendships data if exists for this user
    return respond.status(200).json({
      success: true,
      friendships,
    });
  } catch (error) {
    next(error);
  }
};

// // Create a friendship
// router.post('/', verifyToken, createFriendship);
export const createFriendship = async (request, respond, next) => {
  try {
    // 1. Get user id from attached user object in request (from verifyToken middleware)
    // User.id is the user that is sending the friend request
    const requesterUserId = request.user.id; // decoded user id from JWT token

    // 2. Get friend id from request body
    const { recipientUserId } = request.body;

    // ValidateFriendRequest middleware to complete checks

    // Create new friendship document in the database
    // Return the created friendship
  } catch (error) {
    next(error);
  }
};

// Validation for friend request (was in utils/validation.js)
// Expects requester user to be the authenticated user after logged in with verified token
const validateFriendRequest = async (request, response, next) => {
  try {
    // Derive RequesterUserId from the auth middleware (must be run before this)
    const RequesterUserId = request.user?.id; // || request.body.user1;
    // Determine RecipientUserId from the request body
    const RecipientUserId = request.body.recipientUserId; // || request.body.user2;

    // Checks to ensure both friendRequester and friendRecipient userIds are provided
    if (!RequesterUserId || !RecipientUserId) {
      return response.status(400).json({
        success: false,
        message: 'Both requester and recipient user IDs are required',
      });
    }

    // Checks to ensure both user Ids are valid ObjectId strings
    if (!mongoose.isValidObjectId(RequesterUserId) || !mongoose.isValidObjectId(RecipientUserId)) {
      return response.status(400).json({
        success: false,
        message: 'One of both provided user IDs are invalid',
      });
    }

    // Prevent user from requesting friendship with themselves
    if (RequesterUserId.toString() === RecipientUserId.toString()) {
      return response.status(400).json({
        success: false,
        message: 'Cannot send a friend request to yourself',
      });
    }

    // Check if both users exists
    const [requesterUser, recipientUser] = await Promise.all([
      User.findById(RequesterUserId),
      User.findById(RecipientUserId),
    ]);
    if (!requesterUser || !recipientUser) {
      return response.status(400).json({
        success: false,
        message: 'One or both user IDs provided do not exist',
      });
    }

    // Duplicate check: reuse friendship Model static methods to find unordered pair
    // Friendship.findBetween returns a document if a friendship record exists (isAccepted or pending)
    const friendship = await Friendship.findBetween(requesterUser, recipientUser);
    if (friendship) {
      // If a friendship record exists, check if it's already accepted
      if (friendship.friendRequestAccepted) {
        return response.status(409).json({
          success: false,
          message: 'Friendship already exists between these users',
        });
      }
      return response.status(409).json({
        success: false,
        message: 'A pending friend request already exists between these users',
      });
    }

    return next();
  } catch (error) {
    return next(error);
  }
};

// // Update friendships
// router.put('/my-friends/:id', verifyToken, updateFriendship);
export const updateFriendship = async (request, respond, next) => {
  try {
    // Get friendship id from request parameters or attached user object
    // Get update data from request body (maybe, if only handling changing bool then no need)
    // Update the friendship document in the database
    // Return the updated friendship
  } catch (error) {
    next(error);
  }
};

// // Remove an existing friendship (unfriend)
// router.delete('/my-friends/:id', verifyToken, removeFriendship);
// // Remove an existing friendship for a specific user by userId (admin only)
// router.delete('/:id', verifyToken, requireAdmin, removeFriendship);
export const removeFriendship = async (request, respond, next) => {
  try {
    // Get friendship id from request parameters or attached user object
    // Remove the friendship document from the database
    // Return a success message with the removed friendship (maybe)
  } catch (error) {
    next(error);
  }
};

// ----------------------------------------------------------------
// OLD STUFF BELOW

// get authenticated user's ID from request (auth middleware)
// const getAuthenticatedUserId = (request) => {
//     return request.user.id;
// };

// // Create a friend request
// export const createFriendRequest = async (request, respond, next) => {
//     try {
// const requesterUserId = request.user.id;

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
