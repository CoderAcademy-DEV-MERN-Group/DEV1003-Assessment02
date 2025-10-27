import mongoose from 'mongoose';
import Friendship from '../models/Friendship.js';
import User from '../models/User.js';
// import { verifyToken } from '../utils/auth.js';
// getAllFriendships,
// getUserFriendships,
// createFriendship,
// updateFriendship,
// removeFriendship,

export const getAllFriendships = async (request, respond, next) => {
  try {
    // Database query to get all friendships documents
    // Return the list of friendships
  } catch (error) {
    next(error);
  }
};

export const getUserFriendships = async (request, respond, next) => {
  try {
    // Get id from request parameters or user object
    // Database query to get friendships for the specific user
    // Return the list of user's friendships
  } catch (error) {
    next(error);
  }
};

export const createFriendship = async (request, respond, next) => {
  try {
    // Get user id from attached user object in request
    // Get friend id from request body
    // Create new friendship document in the database
    // Return the created friendship
  } catch (error) {
    next(error);
  }
};

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

// Accept a friend request

// Reject a friend request

// Remove an existing friendship (unfriend)

// Get the incoming pending friend requests for the authenticated logged in user

// Get list of friends for the authenticated logged in user
