import User from '../models/User';

export const checkAdminOrUser = (req, res, message) => {
  if (req.params.userId && !req.user.isAdmin) {
    res.status(403).json({
      success: false,
      message: `Only admins can ${message}`,
    });
    return { authorized: false, userId: null };
  }

  return { authorized: true, userId: req.params.userId || req.user?.userId };
};

export const getUserOr404 = async (userId, res) => {
  // select with '-' excludes field, exec forces true promise for consistency
  const user = await User.findById(userId).select('-password').exec();
  // Return 404 and message if user not found
  if (!user) {
    res.status(404).json({
      success: false,
      message: userId ? `User with id ${userId} not found` : 'User ID required',
    });
    return null;
  }
  return user;
};
