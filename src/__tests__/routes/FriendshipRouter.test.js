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
import Friendship from '../../models/Friendship';
import { userFixture, getAuthToken, friendshipFixture } from '../setup/fixtures';
import { adminRequest, authenticatedRequest } from '../setup/authHelper';

// set up the empty authHeader variable
let consoleSpy;
let authHeader;
let adminHeader;

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
  authHeader = await authenticatedRequest();
  adminHeader = await adminRequest();
});

// Test admin route for getting all friendships
describe('GET /friendships route for getting all friendships works', () => {
  // Test that it returns a successful response for admin user
  it('should return 200 and list of friendships for admin user', async () => {
    const response = await request(app).get('/friendships').set(adminHeader);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('success', true);
    expect(response.body).toHaveProperty('friendships');
    expect(Array.isArray(response.body.friendships)).toBe(true);
  });
  // Test that it returns a 403 forbidden response for non-admin user
  it('should return 403 for non-admin user', async () => {
    const response = await request(app).get('/friendships').set(authHeader);
    expect(response.status).toBe(403);
    expect(response.body).toHaveProperty('success', false);
    expect(response.body).toHaveProperty('message', 'Admin access required');
  });
});

// Test user route for getting own friendships
describe('GET /friendships/my-friends', () => {
  // Test that it doesn't work without token
  it('should return 401 if no token provided', async () => {
    const response = await request(app).get('/friendships/my-friends');
    expect(response.status).toBe(401);
  });
  // Test that it returns a successful response for authenticated user
  it('should return 200 and list of friendships for authenticated user', async () => {
    const userData = userFixture();
    await User.create(userData);
    const token = await getAuthToken(app, userData);
    const response = await request(app)
      .get('/friendships/my-friends')
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('success', true);
    expect(response.body).toHaveProperty('friendships');
    expect(Array.isArray(response.body.friendships)).toBe(true);
  });
  // Test that admins can access other users' friendships
  it('should allow admin to get friendships for a specific user by userId', async () => {
    const user = await User.create(userFixture());
    const user2 = await User.create(userFixture());
    await Friendship.create(
      friendshipFixture({
        user1: user.id,
        user2: user2.id,
        requesterUserId: user.id,
      }),
    );
    const response = await request(app).get(`/friendships/${user.id}`).set(adminHeader);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('success', true);
    expect(response.body).toHaveProperty('friendships');
    expect(Array.isArray(response.body.friendships)).toBe(true);
    expect(response.body.friendships.length).toBe(1);
  });
});

// Test creating a friendship endpoint works correctly
describe('POST /friendships route for creating a friendship works', () => {
  // Test that it doesn't work without token
  it('should return 401 if no token provided', async () => {
    const response = await request(app).post('/friendships').send({
      recipientUserId: 'someuserid',
    });
    expect(response.status).toBe(401);
  });
  // Test that it returns 400 if recipient user does not exist
  it('should return 400 if recipient user does not exist', async () => {
    const user = userFixture();
    const response = await request(app).post('/friendships').set(authHeader).send({
      recipientUserId: user.id, // Valid user id but not in DB
    });
    expect(response.status).toBe(400);
    expect(response.body).toMatchObject({
      success: false,
      message: 'Provided recipient user does not exist',
    });
  });
  // Test that it returns 400 if recipient user id is missing
  it('should return 400 if recipient user id is missing', async () => {
    const response = await request(app).post('/friendships').set(authHeader).send({});
    expect(response.status).toBe(400);
    expect(response.body).toMatchObject({
      success: false,
      message: 'Provided recipient user does not exist',
    });
  });
  // Test that it creates a friendship successfully
  it('should create a friendship successfully', async () => {
    const user = userFixture();
    const user1 = await User.create(user);
    const token = await getAuthToken(app, user);
    const recipientUser = await User.create(userFixture());
    const sortedUserIds = [user1.id, recipientUser.id].sort();
    const response = await request(app)
      .post('/friendships')
      .set('Authorization', `Bearer ${token}`)
      .send({
        recipientUserId: recipientUser.id,
      });
    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({
      success: true,
      message: 'Friend request sent successfully',
      friendship: {
        user1: sortedUserIds[0],
        user2: sortedUserIds[1],
        requesterUserId: user1.id,
        friendRequestAccepted: false,
      },
    });
  });
});
/*
if we call admin route with params (friendships/:12345) it should return friendships for that user with id 12345
what it was actually doing was returning friendships for the admin not the user with id 12345
but the test was passing because the admin also had no friendships so an empty array was returned either way 
we have no way of testing that the correct user's friendships were returned because both users had no friendships
to fix this, we can create two users, one admin and one regular user
then create a friendship for the regular user
then call the admin route with the regular user's id
now we can check that the returned friendships belong to the regular user
*/
