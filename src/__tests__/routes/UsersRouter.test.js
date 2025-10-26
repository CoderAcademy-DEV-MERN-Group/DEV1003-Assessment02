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
