import mongoose from 'mongoose';
import User from '../models/User';
import Friendship from '../models/Friendship';

// Validation middleware for all user registering, validation for login can happen in route (more basic, instantaneous response)
const validateUserRegistration = async (request, response, next) => {
  try {
    //  Reuse schema validation rules for DRY coding principles
    const tempUser = new User(request.body);
    await tempUser.validate();

    // Checks for unique username and email separately using $or
    const existingUser = await User.findOne({
      $or: [{ email: request.body.email }, { username: request.body.username }],
    });

    if (existingUser) {
      return response.status(409).json({
        success: false,
        message: 'Email or username already exists',
      });
    }

    return next();
  } catch (error) {
    return next(error);
  }
};

// Validation for login requests
const validateLogin = (request, response, next) => {
  const { email, password } = request.body;

  // IF there is no email or password provided, return 400 error
  if (!email || !password) {
    return response.status(400).json({
      success: false,
      message: 'Email and password are required',
    });
  }

  return next();
};

// Validation for friend request
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

export { validateUserRegistration, validateLogin, validateFriendRequest };
