// Routes for login, registration, logout
import express from 'express';
import validateUserRegistration from '../utils/validation';
import { generateToken } from '../utils/auth';
import User from '../models/User';

const router = express.Router();

// register route works off base route
router.post('/register', validateUserRegistration, async (request, response) => {
  const user = new User(request.body);
});

app.post('/login', (request, response) => {
  response.send('POST request to login page');
});

app.post('/logout', (request, response) => {
  response.send('POST request to logout page');
});
