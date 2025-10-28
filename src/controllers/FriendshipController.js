// import mongoose from 'mongoose';
import Friendship from '../models/Friendship';
import User from '../models/User';

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
export const getAllFriendships = async (req, respond, next) => {
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
    return next(error);
  }
};
// admin is person 1
// admin sends a req
// admin will be attached to req.user
// to give the req person 2's id they send it in the paramaters (which look like this /:userId)
// so req.params.userId is person 2's user id
// req.user.id is the id of the person sending the req (which is the admin)
// user is person 2

// in the test the admin called the route with person 2s id
// so the admin doesn't want their own friendships they want user 2s

// // Get list of friends for the authenticated logged in user OR
// For a specific user by userId (admin only)
export const getUserFriendships = async (req, respond, next) => {
  try {
    // Get id from req parameters or user object
    const userId = req.params?.userId || req.user.userId;
    // // Database query to get friendships for the specific user
    const friendships = await Friendship.find({
      $or: [{ user1: userId }, { user2: userId }],
    });
    // Return the list of user's friendships
    // Return success message with friendships data if exists for this user
    return respond.status(200).json({
      success: true,
      friendships,
    });
  } catch (error) {
    return next(error);
  }
};

// // Create a friendship
// router.post('/', verifyToken, createFriendship);
export const createFriendship = async (req, res, next) => {
  try {
    // 1. Get user id from attached user object in req (from verifyToken middleware)
    // User.id is the user that is sending the friend req
    const requesterUserId = req.user.userId; // decoded user id from JWT token

    // 2. Get friend id from req body
    const recipientUserId = req.body?.recipientUserId;

    //  Validation check - check recipient user exists
    const recipientUser = await User.findById(recipientUserId).exec();
    if (!recipientUser) {
      return res.status(400).json({
        success: false,
        message: 'Provided recipient user does not exist',
      });
    }
    // Create new friendship document in the database
    const newFriendship = await Friendship.create({
      user1: requesterUserId,
      user2: recipientUserId,
      requesterUserId,
    });
    // Return the created friendship
    return res.status(201).json({
      success: true,
      message: 'Friend request sent successfully',
      friendship: newFriendship,
    });
  } catch (error) {
    return next(error);
  }
};

// Update friendships
// router.put('/my-friends/:id', verifyToken, updateFriendship);
export const updateFriendship = async (req, res, next) => {
  try {
    // Get user1 id from req parameters or attached user object
    const recipientUserId = req.body?.recipientUserId || req.user.userId;
    const requesterUserId = req.body?.requesterUserId || req.params.requesterUserId;
    // Get friendship document by the combination of user1 and user2 ids where requestedUserId is user2

    // Sort id's by smallest id first
    const [user1, user2] = [requesterUserId, recipientUserId].sort();

    // Query the database to find and update the friendship document
    const updatedFriendship = await Friendship.findOneAndUpdate(
      {
        user1,
        user2,
        requesterUserId,
        friendRequestAccepted: false,
      },
      {
        friendRequestAccepted: true,
      },
      {
        new: true, // Return the updated document
      },
    );
    // If returned updated friend request is null, send bad request response
    if (!updatedFriendship) {
      return res.status(400).json({
        success: false,
        message: 'Pending friendship document not found with provided parameters',
      });
    }
    // Else return the updated friendship and success response
    return res.status(200).json({
      success: true,
      message: 'Friend request accepted successfully',
      updatedFriendship,
    });
  } catch (error) {
    return next(error);
  }
};

// // Remove an existing friendship (unfriend)
// router.delete('/my-friends/:id', verifyToken, removeFriendship);
// // Remove an existing friendship for a specific user by userId (admin only)
// router.delete('/:id', verifyToken, requireAdmin, removeFriendship);
export const removeFriendship = async (req, res, next) => {
  try {
    // Get both IDs from req body or params
    const userId = req.body?.userId || req.user.userId;
    const otherUserId = req.body?.otherUserId || req.params.otherUserId;

    // Sort id's by smallest id first
    const [user1, user2] = [userId, otherUserId].sort();

    // Query the database to find and delete the friendship document
    // Returns the deleted document if found, otherwise null
    const deletedFriendship = await Friendship.findOneAndDelete({ user1, user2 });
    // If returned updated friend request is null, send bad request response
    if (!deletedFriendship) {
      return res.status(400).json({
        success: false,
        message: 'Friendship document not found with provided parameters',
      });
    }
    // Else return the deleted friendship and success response
    return res.status(200).json({
      success: true,
      message: 'Friendship document deleted successfully',
      deletedFriendship,
    });
  } catch (error) {
    return next(error);
  }
};

// ----------------------------------------------------------------
// OLD STUFF BELOW

// get authenticated user's ID from req (auth middleware)
// const getAuthenticatedUserId = (req) => {
//     return req.user.id;
// };

// // Create a friend req
// export const createFriendRequest = async (req, respond, next) => {
//     try {
// const requesterUserId = req.user.id;

/*
user profile
friends list
pending friend requests

  - call this route: '/my-friends'
now we have a list of all friend documents for that user
now split them into pending and accepted
assign accepted to friends component
assign pending to pending requests component

what happens when i accept a friend req?
one state for accepted
one state for pending
accept pending req
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
1. user clicks accept on friend req component
2. call route to update friendship document to accepted
3. Either refresh data by calling /my-friends or directly update the state in frontend
cont - by removing friendship from pending state array to accepted state array
*/

/*
MY FRIENDS = All my friendships pending or otherwise
/my-friends/:id is only a specific friend from my friends
but
that doesn't account for who sent the friend req
if req.user.id === friendship.requesterUserId
then we allow update
otherwise reject
*/
