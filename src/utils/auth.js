// set up JWT token creation

import jwt from 'jsonwebtoken';
import jwtConfig from '../config/config';

const generateToken = (user) => {
  const payload = {
    userId: user.id,
    username: user.username,
    isAdmin: user.isAdmin,
  };

  return jwt.sign(payload, jwtConfig.JWT_SECRET_KEY, {
    expiresIn: '7d',
  });
};

const verifyToken = (request, response, next) => {
  const token = request.header(jwtConfig.TOKEN_HEADER_KEY)?.replace('Bearer', '');

  if (!token) {
    return response.status(401).json({
      success: false,
      message: 'Access denied. No token provided.',
    });
  }

  try {
    const decoded = jwt.verify(token, jwtConfig.JWT_SECRET_KEY);
    request.user = decoded;
    return next();
  } catch {
    return response.status(400).json({
      success: false,
      message: 'Invalid token',
    });
  }
};

export { generateToken, verifyToken };
