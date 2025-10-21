import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { afterAll, afterEach, beforeAll, describe, expect, test } from '@jest/globals';

import User from '../models/User';

describe('User Schema validation', () => {
  let mongoServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  afterEach(async () => {
    await User.deleteMany({});
  });

  test('Create user with valid data and hash password before saving', async () => {
    const userData = {
      username: 'jesttest',
      email: 'jest@test.com',
      password: 'TestPass123!',
    };

    const testUser = await User.create(userData);

    expect(testUser.username).toBe('jesttest');
    expect(testUser.email).toBe('jest@test.com');
    expect(testUser.password).not.toBe('TestPass123!');
    expect(testUser.password.length).toBeGreaterThan(20);
    expect(testUser.isAdmin).toBe(false);
  });

	test('Should reject weak passwords', async () => {
		const userData = {
			username: 'weakuser',
			email: 'weak@test.com',
			password: 'weak'
		}
	})
});
