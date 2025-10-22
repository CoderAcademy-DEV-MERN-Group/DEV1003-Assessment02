// Routes for login, registration, logout
import { Router } from 'express';
import bcrypt from 'bcrypt';
import { validateUserRegistration, validateLogin } from '../utils/validation';
import User from '../models/User';
import { generateToken } from '../utils/auth';

const router = Router();

// register route works off base route
router.post('/register', validateUserRegistration, async (request, response, next) => {
  try {
    // Get user information from the request body
    const user = new User(request.body);
    // Hashing of password exists as a pre-save hook
    await user.save();

    const token = generateToken(user);

    return response.status(201).json({
      message: 'User registration complete',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        ...(user.isAdmin && { isAdmin: user.isAdmin }), // Only returns isAdmin if it is truthy
      },
    });
  } catch (error) {
    return next(error);
  }
});

router.post('/login', validateLogin, async (request, response, next) => {
  try {
    const { email, password } = request.body;
    const user = await User.findOne({ email });

    if (!user) {
      const error = new Error(`No user account with email ${email} found`);
      error.statusCode = 404;
      return next(error);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      const error = new Error('Invalid password, please try again');
      error.statusCode = 401;
      return next(error);
    }

    const token = generateToken(user);

    return response.status(201).json({
      message: 'Login successful!',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        ...(user.isAdmin && { isAdmin: user.isAdmin }), // Only returns isAdmin if it is truthy
      },
    });
  } catch (error) {
    return next(error);
  }
});

router.post('/logout', (request, response) => {
  response.send('POST request to logout page');
});

export default router;
