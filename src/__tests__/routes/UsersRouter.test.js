// Only jest and expect import required, others imported for clarity
import {
  describe,
  it,
  expect,
  beforeAll,
  afterAll,
  beforeEach,
  // afterEach,
  jest,
} from '@jest/globals';
import request from 'supertest';
import { app } from '../../server';
import { setupTestDb, clearTestDb, teardownTestDb } from '../setup/testDb';
import User from '../../models/User';
import { userFixture } from '../setup/fixtures';

let consoleSpy;

beforeAll(async () => {
  await setupTestDb();
  consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterAll(async () => {
  await teardownTestDb();
  consoleSpy.mockRestore();
});

beforeEach(async () => {
  await clearTestDb();
});

// Test endpoint for getting user by url params works correctly
describe('GET /users/:userID endpoint works correctly', () => {
  // Tests that id is used from params to get user profile
  it('should successfully get a user profile by ID', async () => {
    const userData = userFixture();
    const userID = (await User.create(userData)).id;
    const res = await request(app).get(`/users/${userID}`);
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      success: true,
      data: {
        user: {
          _id: userID,
          username: userData.username,
          email: userData.email,
          isAdmin: false,
          reelProgress: [],
        },
      },
    });
  });
  // Tests that a valid but non-existent ID returns 404
  it('should return 404 and message if no user found with given ID', async () => {
    // Valid ID type but doesn't exist in DB
    const fakeID = '64d2f0c2f0c2f0c2f0c2f0c2';
    const res = await request(app).get(`/users/${fakeID}`);
    expect(res.status).toBe(404);
    expect(res.body).toMatchObject({
      success: false,
      message: `User with id ${fakeID} not found`,
    });
  });
  // Tests that invalid ID triggers cast error and is caught by error handling middleware
  it('should trigger cast error and be caught by middleware for invalid id type', async () => {
    // Invalid ID format (not a valid ObjectId)
    const res = await request(app).get('/users/1');
    expect(res.status).toBe(400);
    expect(res.body).toMatchObject({
      success: false,
      message: 'Cast error: value (1) is not valid for _id',
    });
  });
});

// Test endpoint for getting user profile by attached user works correctly
describe('GET /users/my-profile endpoint works correctly', () => {
  it('should successfully get the current user profile when authenticated', async () => {
    const userData = userFixture();
    const createdUser = await User.create(userData);
    // Get JWT token from body of login response
    const { token } = (
      await request(app)
        .post('/auth/login')
        .send({ email: userData.email, password: userData.password })
    ).body;
    // Attach token to header with .set method
    const res = await request(app).get('/users/my-profile').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      success: true,
      data: {
        user: {
          _id: createdUser.id,
          username: userData.username,
          email: userData.email,
          isAdmin: false,
          reelProgress: [],
        },
      },
    });
  });
  // Test for no token provided, should trigger 'verifyToken' middleware
  it('should return 401 and message if no token', async () => {
    const res = await request(app).get('/users/my-profile');
    expect(res.status).toBe(401);
    expect(res.body).toMatchObject({
      success: false,
      message: 'Access denied. No token provided.',
    });
  });
  // Test for invalid token provided, should trigger 'verifyToken' middleware
  it('should return 400 and message if invalid token', async () => {
    const res = await request(app)
      .get('/users/my-profile')
      .set('Authorization', 'Bearer invalidtoken123');
    expect(res.status).toBe(400);
    expect(res.body).toMatchObject({
      success: false,
      message: 'Invalid token',
    });
  });
});

// Test endpoint for updating user profile works for both user and admin
describe('PUT /users/my-profile endpoint works correctly', () => {
  // Test for successful profile update
  it('should successfully update the current user profile when authenticated', async () => {
    const userData = userFixture();
    const user = await User.create(userData);
    // Call login route to get JWT token
    const { token } = (
      await request(app)
        .post('/auth/login')
        .send({ email: userData.email, password: userData.password })
    ).body;
    const updatedData = { username: 'random-name', email: 'random-email@example.com' };
    // Call put request with updated data
    const res = await request(app)
      .put('/users/my-profile')
      .set('Authorization', `Bearer ${token}`)
      .send(updatedData);
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      success: true,
      data: {
        user: {
          _id: user.id,
          username: updatedData.username,
          email: updatedData.email,
        },
      },
    });
  });
  // Test update works for admin updating someone else's profile
  it('should allow admin to update different user profile', async () => {
    // Create admin user and set isAdmin to true
    const adminData = userFixture({ isAdmin: true });
    await User.create(adminData);
    // Create other user to be updated
    const otherUser = await User.create(userFixture());
    // Login as admin to get token
    const { token } = (
      await request(app)
        .post('/auth/login')
        .send({ email: adminData.email, password: adminData.password })
    ).body;
    const updatedData = { username: 'random-name' };
    // Call put request to update other user's profile using userId param
    const res = await request(app)
      .put(`/users/my-profile/${otherUser.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updatedData);
    expect(res.status).toBe(200);
    expect(res.body.data.user).toMatchObject({
      _id: otherUser.id,
      username: updatedData.username,
    });
  });
  // Test for no token provided, should trigger 'verifyToken' middleware
  it('should return 401 and message if no token', async () => {
    const res = await request(app).put('/users/my-profile').send({ username: 'newname' });
    expect(res.status).toBe(401);
    expect(res.body).toMatchObject({
      success: false,
      message: 'Access denied. No token provided.',
    });
  });
  // Test for non admin trying to update another user's profile
  it("should return 403 and message if non-admin tries to update another user's profile", async () => {
    const userData = userFixture();
    await User.create(userData);
    const otherUser = await User.create(userFixture());
    // Login as non-admin user to get token
    const { token } = (
      await request(app)
        .post('/auth/login')
        .send({ email: userData.email, password: userData.password })
    ).body;
    const res = await request(app)
      .put(`/users/my-profile/${otherUser.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ username: 'newname' });
    expect(res.status).toBe(403);
    expect(res.body).toMatchObject({
      success: false,
      message: 'Only admins can update other users than themselves',
    });
  });
});
