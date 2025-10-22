import { afterAll, beforeAll, beforeEach, describe, expect, test } from '@jest/globals';
import User from '../../models/User';
import { clearTestDb, setupTestDb, teardownTestDb } from '../setup/testDb';
import { userFixture } from '../setup/fixtures';

// Setup, clear and teardown in memory test MongoDB database. Declare globally to use in all tests.
beforeAll(async () => {
  await setupTestDb();
});

afterAll(async () => {
  await teardownTestDb();
});

beforeEach(async () => {
  await clearTestDb();
});

// Tests for User model schema validation
describe('User Schema validation', () => {
  // Tests creating user with valid data works
  test('Create user with valid data and hash password before saving', async () => {
    const userData = userFixture();
    const testUser = await User.create(userData);
    const keys = ['username', 'email', 'isAdmin'];
    keys.forEach((key) => {
      expect(testUser[key]).toBe(userData[key]);
    });
    expect(testUser.password).not.toBe(userData.password);
    expect(testUser.password.length).toBeGreaterThan(20);
  });
  // Tests for rejecting weak passwords
  const passwordTests = [
    ['too short', 'Ab1!'],
    ['no lowercase', 'ABCD1234!'],
    ['no uppercase', 'abcd1234!'],
    ['no number', 'Abcdefgh!'],
    ['no symbol', 'Abcdefg1'],
  ];
  // Create a test for each invalid password case, '%s' replaced by first element in each array
  test.each(passwordTests)('should reject password for: %s', async (_, password) => {
    const userData = userFixture({ password });
    await expect(User.create(userData)).rejects.toThrow();
  });
  // Test for rejecting incorrect email format
  test('should reject incorrect email format', async () => {
    const userData = userFixture({ email: 'invalid-email' });
    await expect(User.create(userData)).rejects.toThrow();
  });
  // Test for rejecting duplicate usernames
  test('should reject duplicate username', async () => {
    const username = 'duplicateUser';
    const userData1 = userFixture({ username });
    const userData2 = userFixture({ username });

    await User.create(userData1);
    await expect(User.create(userData2)).rejects.toThrow();
  });
  // Test for rejecting duplicate emails
  test('should reject duplicate email', async () => {
    const email = 'someuser@email.com';
    const userData1 = userFixture({ email });
    const userData2 = userFixture({ email });

    await User.create(userData1);
    await expect(User.create(userData2)).rejects.toThrow();
  });
});
