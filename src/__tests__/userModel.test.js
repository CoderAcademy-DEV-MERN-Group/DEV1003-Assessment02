import { afterAll, beforeAll, beforeEach, describe, expect, test } from '@jest/globals';

import User from '../models/User';
import { clearTestDb, setupTestDb, teardownTestDb } from './setup/testDb';

describe('User Schema validation', () => {
  beforeAll(async () => {
    await setupTestDb();
  });

  afterAll(async () => {
    await teardownTestDb();
  });

  beforeEach(async () => {
    await clearTestDb();
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

  test('should reject weak passwords', async () => {
    const userData = {
      username: 'weakuser',
      email: 'weak@test.com',
      password: 'weak',
    };

    await expect(User.create(userData)).rejects.toThrow();
  });

  test('should reject incorrect email format', async () => {
    const userData = {
      username: 'invalidemail',
      email: 'invalid-email-email.com',
      password: 'TestPass123!',
    };

    await expect(User.create(userData)).rejects.toThrow();
  });

  test('should reject duplicate username', async () => {
    const userData1 = {
      username: 'duplicate',
      email: 'email@email.com',
      password: 'PassTest123!',
    };

    const userData2 = {
      username: 'duplicate',
      email: 'email1@email.com',
      password: 'PassTest123!',
    };

    await User.create(userData1);

    await expect(User.create(userData2)).rejects.toThrow();
  });

  test('should reject duplicate email', async () => {
    const userData1 = {
      username: 'originalemail',
      email: 'email@email.com',
      password: 'PassTest123!',
    };

    const userData2 = {
      username: 'duplicateemail',
      email: 'email@email.com',
      password: 'PassTest123!',
    };

    await User.create(userData1);

    await expect(User.create(userData2)).rejects.toThrow();
  });
});
