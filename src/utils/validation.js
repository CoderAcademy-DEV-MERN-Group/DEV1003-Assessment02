import User from '../models/User';

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
      if (existingUser.email === request.body.email) {
        return response.status(409).json({ error: 'Email already exists' });
      }
      if (existingUser.username === request.body.username) {
        return response.status(409).json({ error: 'Username already exists' });
      }
    }

    return next();
  } catch (error) {
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((err) => ({
        field: err.path,
        message: error.message,
      }));
      return response.status(400).json({
        error: 'Validation failed',
        details: errors,
      });
    }
    return next(error);
  }
};

export default validateUserRegistration;
