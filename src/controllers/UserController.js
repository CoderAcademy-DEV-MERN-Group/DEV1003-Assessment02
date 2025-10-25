import bcrypt from 'bcrypt';
import User from '../models/User';

// const allowAdminOrUser =
// Get user profile by ID or user object attached to request
export const getUserProfile = async (req, res, next) => {
  try {
    // If userId in params, use it, else use req.user.userId, if req.user not there is undefined
    const userId = req.params.userId || req.user?.userId;
    // select with '-' excludes field, exec forces true promise for consistency
    const user = await User.findById(userId).select('-password').exec();
    // Return 404 and message if user not found
    if (!user) {
      return res.status(404).json({
        success: false,
        message: userId ? `User with id ${userId} not found` : 'User ID required',
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

// Update user profile by ID or optional userId param for admins only
export const updateUserProfile = async (req, res, next) => {
  try {
    // Return 403 if non-admin user tries to update another user's profile
    if (req.params.userId && !req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Only admins can update other users than themselves',
      });
    }
    // User ID will be from params if provided (already checked admin above), else from token
    const userId = req.params.userId || req.user?.userId;
    // findByIdAndUpdate only updates provided fields, { new: true } returns updated document
    // runValidators: true ensures Mongoose schema validators are run on update
    const user = await User.findByIdAndUpdate(userId, req.body, { new: true, runValidators: true })
      .select('-password') // Prevent password update and exclude from response
      .exec();

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

export const updateUserPassword = async (req, res, next) => {
  try {
    // Return 403 if non-admin user tries to update another user's password
    if (req.params.userId && !req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Only admins can update other user passwords',
      });
    }
    // User ID will be from params if provided (already checked admin above), else from token
    const userId = req.params.userId || req.user?.userId;
    const user = await User.findById(userId).exec();
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }
    // For non-admins, verify current password before allowing update
    if (!req.user.isAdmin) {
      const validPassword = await bcrypt.compare(req.body.currentPassword, user.password);
      if (!validPassword) {
        return res.status(401).json({
          success: false,
          message: 'Invalid current password',
        });
      }
    }
    // Update password and save
    user.password = req.body.newPassword;
    await user.save({ validateBeforeSave: true }); // Ensure validators run on save
    return res.status(200).json({
      success: true,
      message: 'Password updated successfully',
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
