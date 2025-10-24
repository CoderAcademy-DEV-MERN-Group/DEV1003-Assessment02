import User from '../models/User';

// Get user profile by ID or user object attached to request
export const getUserProfile = async (req, res, next) => {
  try {
    // If userID in params, use it, else use req.user.userID, if req.user not there is undefined
    const userID = req.params.userID || req.user?.userID;
    // select with '-' excludes field, exec forces true promise for consistency
    const user = await User.findById(userID).select('-password').exec();
    // Return 404 and message if user not found
    if (!user) {
      return res.status(404).json({
        success: false,
        message: userID ? `User with id ${userID} not found` : 'User ID required',
      });
    }
    // Return success message with user data
    return res.status(200).json({
      success: true,
      data: { user },
    });
    // Catch errors and pass to error handling middleware (in server.js)
  } catch (error) {
    return next(error);
  }
};

export const getCurrentUserProfile = async (req, res, next) => {
  try {
    const userID = req.user.userId; // Assuming userID is available in req.user
    const user = await User.findById(userID).select('-password'); // Exclude password

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: { user },
    });
  } catch (error) {
    return next(error);
  }
};

export const updateUserProfile = async (req, res, next) => {
  try {
    const { userID } = req.params;
    const updates = req.body;

    const user = await User.findByIdAndUpdate(userID, updates, { new: true }).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: { user },
    });
  } catch (error) {
    return next(error);
  }
};
/*
// pass verifyToken as middleware here, this will validate the token 
router.get('/me', verifyToken, async (request, response, next) => {
  try {

    // Request user is added by payload in verifyToken
    const user = await User.findById(request.user.userId).select('-password'); // never shows the password directly

    // IF there's no matching user:
    if (!user) {
      return response.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // IF the user exists: 
    return response.status(200).json({
      success: true,
      data: { user }, // send whole user object (except password, which is excluded above)
    });
  } catch (error) {
    return next(error);
  }
});
*/
