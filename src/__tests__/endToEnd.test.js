// End to end testing for current defined endpoints
import { describe, it, expect, beforeAll, afterAll, beforeEach } from '@jest/globals';
import request from 'supertest';
import { app } from '../server';
import {
  setupTestDb,
  clearTestDb,
  teardownTestDb,
  // consoleLogSpy,
  // consoleErrorSpy,
} from './setup/testDb';
import User from '../models/User';
import Movie from '../models/Movie';
import { userFixture, movieFixture, reelProgressFixture, getAuthToken } from './setup/fixtures';
// import { authenticatedRequest, adminRequest } from './setup/authHelper';

// Empty variables to be assigned in beforeAll hooks
// let authHeader;
// let adminHeader;

// Global user variables to be assigned and/or used in tests
let userData = userFixture();
let user;
let userToken;
// let adminUserData = userFixture({ isAdmin: true });
// let adminUser;
// let adminToken;

// Global movie variables to be assigned and/or used in tests
let reelCanon;

beforeAll(async () => {
  await setupTestDb(); // Set up in memory MongoDB database and console spies
  reelCanon = await Movie.create(Array.from({ length: 10 }, () => movieFixture()));
});

beforeEach(async () => {
  // await clearTestDb(); // Clear database before each test
  // authHeader = await authenticatedRequest(); // Get auth header for normal user
  // adminHeader = await adminRequest(); // Get auth header for admin user
});

afterAll(async () => {
  await clearTestDb(); // Clear database after all tests
  await teardownTestDb(); // Teardown in memory MongoDB database and restore console spies
});

// ------------------------------------------------------------------------------------------------
// Tests for creating a new non-admin user and accessing user routes
describe('Creating a new non-admin user and accessing user routes', () => {
  // Create array of invalid data objects to test creating user with invalid data
  const badData = [
    { username: 'a' }, // Too short
    { email: 'notanemail' }, // Invalid email format
    { shortPassword: '123' }, // Too short
    { password: 'ONLYUPPERCASE1!' }, // No lowercase letters
    { password: 'onlylowercase1!' }, // No uppercase letters
    { password: 'NoNumbers!' }, // No numbers
    { password: 'NoSpecialChar1' }, // No special characters
  ];
  // For each invalid data object attempt to register user and expect 400 response
  it.each([badData])('should reject invalid registration data: %o', async (invalidData) => {
    const badUserData = userFixture(invalidData);
    const res = await request(app).post('/auth/register').send(badUserData);
    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body).toHaveProperty('errors');
  });
  // Test valid user registration and update global user variables for use in other tests
  it('should register a new user', async () => {
    // userData = userFixture(); // Assign user data to global variable
    const res = await request(app).post('/auth/register').send(userData);
    expect(res.statusCode).toBe(201);
    expect(res.body).toMatchObject({
      success: true,
      message: 'User registration complete',
      token: expect.any(String),
      user: {
        id: expect.any(String),
        username: userData.username,
        email: userData.email,
      },
    });
    // Verify user is in database
    user = await User.findById(res.body.user.id);
    expect(user).not.toBeNull();
    expect(user.email).toBe(userData.email);
    // Assign token for use in later tests
    userToken = { Authorization: `Bearer ${res.body.token}` };
  });
  // Test accessing a login required route after registration
  it('should allow access to users profile after registration', async () => {
    const res = await request(app).get('/users/my-profile').set(userToken);
    expect(res.statusCode).toBe(200);
    expect(res.body).toMatchObject({
      success: true,
      data: {
        user: {
          username: user.username,
          email: user.email,
          isAdmin: false,
        },
      },
    });
  });
  // Test logging out the user (doesn't appear to do anything right now)
  it('should log out the user', async () => {
    const res = await request(app).post('/auth/logout').set(userToken);
    expect(res.statusCode).toBe(200);
    expect(res.body).toMatchObject({
      success: true,
      message: 'Log out successful',
    });
  });
  // Add tests later to check that token is invalid after logout (requires token blacklist implementation)

  // Add test for login with correct credentials (will only work after logout test works properly)

  // Test user can update their profile
  it('should allow user to update their profile', async () => {
    const updatedData = {
      username: 'updatedusername',
      email: 'updatedemail@example.com',
    };
    const res = await request(app).put('/users/my-profile').set(userToken).send(updatedData);
    expect(res.statusCode).toBe(200);
    expect(res.body).toMatchObject({
      success: true,
      data: {
        user: {
          username: updatedData.username,
          email: updatedData.email,
        },
      },
    });
    // Verify changes in database
    const updatedUser = await User.findById(user.id);
    expect(updatedUser.username).toBe(updatedData.username);
    expect(updatedUser.email).toBe(updatedData.email);
    userData = { ...userData, ...updatedData }; // Update global userData for later tests
  });

  // Test user can update their password
  it('should allow user to update their password', async () => {
    const newPassword = 'NewPassword1!';
    const res = await request(app)
      .put('/users/my-profile/update-password')
      .set(userToken)
      .send({ currentPassword: userData.password, newPassword });
    expect(res.statusCode).toBe(200);
    expect(res.body).toMatchObject({
      success: true,
      message: 'Password updated successfully',
    });
    // Verify user can login with new password
    const loginRes = await request(app).post('/auth/login').send({
      email: userData.email,
      password: newPassword,
    });
    expect(loginRes.statusCode).toBe(200);
    expect(loginRes.body.success).toBe(true);
    // Update global userData with new password for later tests
    userData.password = newPassword;
  });

  // Test user cannot access admin protected routes
  it('should prevent non-admin user from accessing admin routes', async () => {
    // Check 'get all' users route
    let res = await request(app).get('/users').set(userToken);
    expect(res.statusCode).toBe(403);
    // Check 'get user by ID' route
    res = await request(app).get(`/users/${user.id}`).set(userToken);
    expect(res.statusCode).toBe(403);
    // Check 'update user by ID' route
    const username = 'ImAHacker';
    res = await request(app).put(`/users/${user.id}`).set(userToken).send({ username });
    expect(res.statusCode).toBe(403);
    // Check 'delete user by ID' route
    res = await request(app).delete(`/users/${user.id}`).set(userToken);
    expect(res.statusCode).toBe(403);
  });
});

// ------------------------------------------------------------------------------------------------
// Tests for user using friendships endpoints
describe('Accessing friendship endpoints as a non-admin user', () => {
  let otherUserData;
  let otherUser;
  let otherUserToken;

  // Create another user and their token for testing
  beforeAll(async () => {
    otherUserData = userFixture();
    otherUser = await User.create(otherUserData);
    otherUserToken = { Authorization: `Bearer ${await getAuthToken(app, otherUserData)}` };
  });

  // Test sending a friend request
  it('should allow user to send a friend request', async () => {
    const res = await request(app)
      .post('/friendships/request')
      .set(userToken)
      .send({ friendId: otherUser.id });
    expect(res.statusCode).toBe(201);
});

// ------------------------------------------------------------------------------------------------
// Tests for user using movies endpoints
describe('Accessing movie endpoints as a non-admin user', () => {
  it('should allow user to get list of movies', async () => {
    const res = await request(app).get('/movies/reel-canon').set(userToken);
    expect(res.statusCode).toBe(200);
    expect(res.body).toMatchObject({
      success: true,
      movies: expect.any(Array),
    });
    expect(res.body.movies.length).toBe(10); // reelCanon movies created in beforeAll
  });

  // Search for a movie by title
  it('should allow user to search for a movie by title', async () => {
    const movie = reelCanon[0];
    const res = await request(app)
      .get(`/movies/search?title=${encodeURIComponent(movie.title)}`)
      .set(userToken);
    expect(res.statusCode).toBe(200);
    expect(res.body).toMatchObject({
      success: true,
      message: 'Movie found',
      movie: expect.objectContaining({ title: movie.title }),
    });
    //   // Check at least one returned movie matches search title
    //   const matchingMovies = res.body.movies.filter(
    //     (m) => m.title.toLowerCase() === movie.title.toLowerCase(),
    //   );
    //   expect(matchingMovies.length).toBeGreaterThan(0);
  });

  // Check that user can't access admin only movie routes

  // Maybe check user can add and delete movie? currently any user can delete any non canon movie
});

//---------------------------------------------
// Tests for user using reel progress endpoints

// Add movie to reel progress

// Get reel progress

// Update reel progress

// Delete from reel progress

// Can't access admin reel progress endpoints

//---------------------------------------------
// Tests for deleting own profile

// Test user can delete their own profile

// Test that user cannot login after deleting their profile

// Can't access their own routes after deleting their profile

//---------------------------------------------
// Tests for admin user creation and use of user admin endpoints

// Create admin user

// Test admin can access get all users route

// Test admin can access get user by ID route

// Test admin can update user by ID route

// Test admin can delete user by ID route

//---------------------------------------------
// Tests for admin using movie admin endpoints

// Test admin can update a movie poster

//---------------------------------------------
// Tests for admin using reel canon admin endpoints

// Test admin can get all reels

// Test admin can delete other users reels

//---------------------------------------------
// Tests for admin deleting their own profile

// Test admin can delete their own profile

// Test that admin cannot login after deleting their profile

// Test admin cannot access admin routes after deleting their profile

//---------------------------------------------
