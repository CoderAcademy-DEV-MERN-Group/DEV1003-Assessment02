/* eslint-disable consistent-return */
import bcrypt from 'bcrypt';
import User from '../models/User';
// import Friendship from '../models/Friendship';
import { checkAdminOrUser, getUserOr404 } from '../utils/userHelperFunctions';

// Get user profile by ID or user object attached to request
export const getUserProfile = async (req, res, next) => {
  try {
    // If userId in params, use it, else use req.user.userId, if req.user not there is undefined
    const userId = req.params.userId || req.user?.userId;
    // Fetch user or return 404 if not found
    const user = await getUserOr404(userId, res);
    // If user not found, getUserOr404 already sent 404 response, so exit early
    if (!user) return;
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
    // Check if admin or user updating profile
    const { authorized, userId } = checkAdminOrUser(req, res, 'update other user profiles');
    // checkAdminOrUser already sent 403 response if not authorized, so exit early
    if (!authorized) return;
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

// Update user password by ID or optional userId param for admins only
export const updateUserPassword = async (req, res, next) => {
  try {
    // Check if admin or user updating profile
    const { authorized, userId } = checkAdminOrUser(req, res, 'update other user passwords');
    // checkAdminOrUser already sent 403 response if not authorized, so exit early
    if (!authorized) return;
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

// Delete user profile by ID or optional userId param for admins only
export const deleteUserProfile = async (req, res, next) => {
  try {
    // Check if admin or user updating profile
    const { authorized, userId } = checkAdminOrUser(req, res, 'delete other user profiles');
    // checkAdminOrUser already sent 403 response if not authorized, so exit early
    if (!authorized) return;
    // Fetch user or return 404 if not found
    const user = await getUserOr404(userId, res);
    // If user not found, getUserOr404 already sent 404 response, so exit early
    if (!user) return;
    // Implement logic here to handle deleting associated friendships (and any other related data)
    // await Friendship.deleteMany({}).exec();
    await User.findByIdAndDelete(userId).exec();
    return res.status(200).json({
      success: true,
      message: 'User profile deleted successfully',
    });
  } catch (error) {
    return next(error);
  }
};
