import mongoose from 'mongoose';
import Friendship from '../models/Friendship.js';
import User from '../models/User.js';
import { verifyToken } from '../utils/auth.js';

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
