import { afterAll, beforeAll, beforeEach, describe, expect, test, jest } from '@jest/globals';
import User from '../../models/User';
import { clearTestDb, setupTestDb, teardownTestDb } from '../setup/testDb';
import { userFixture } from '../setup/fixtures';

// Empty variables to be assigned in before hooks
let consoleSpy;

// Runs before all tests in file
beforeAll(async () => {
  await setupTestDb(); // Set up in memory MongoDB database
  // Mock console log and error outputs to prevent cluttering console and catch specific logs if needed
  consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
});
// Runs before each test in file
beforeEach(async () => {
  await clearTestDb(); // Clear database before each test
});
// Runs after all tests in file
afterAll(async () => {
  await teardownTestDb(); // Teardown in memory MongoDB database
  consoleSpy.mockRestore(); // Restore console log and error after tests complete
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
    await expect(User.create(userData)).rejects.toThrow(
      expect.objectContaining({ name: 'ValidationError' }),
    );
  });
  // Test for rejecting incorrect email format
  test('should reject incorrect email format', async () => {
    const userData = userFixture({ email: 'invalid-email' });
    await expect(User.create(userData)).rejects.toThrow(
      expect.objectContaining({ name: 'ValidationError' }),
    );
  });
  // Test for rejecting duplicate usernames
  test('should reject duplicate username', async () => {
    const username = 'duplicateUser';
    const userData1 = userFixture({ username });
    const userData2 = userFixture({ username });

    await User.create(userData1);
    await expect(User.create(userData2)).rejects.toThrow(
      expect.objectContaining({ name: 'MongoServerError' }),
    );
  });
  // Test for rejecting duplicate emails
  test('should reject duplicate email', async () => {
    const email = 'someuser@email.com';
    // Create two user fixtures with identical email
    const [userData1, userData2] = [userFixture({ email }), userFixture({ email })];
    // Add first user to database
    await User.create(userData1);
    // Expect adding second user to throw MongoServerError for duplicate key
    await expect(User.create(userData2)).rejects.toThrow(
      expect.objectContaining({ name: 'MongoServerError' }),
    );
  });
});
