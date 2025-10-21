import { describe, beforeAll, afterAll, afterEach, test, expect, beforeEach } from '@jest/globals';
import User from '../models/User';
import { setupTestDb, clearTestDb, teardownTestDb } from './setup/testDb';

describe('User Model', () => {
  beforeAll(async () => {
    await setupTestDb();
  });

  afterAll(async () => {
    await teardownTestDb();
  });

  beforeEach(async () => {
    await clearTestDb();
  });

  // // User data to reuse in tests
  // const testUser = {
  //   username: 'testuser',
  //   email: 'testuser@email.com',
  //   password: 'TestUserP@ssword1'
  // };

  // username: {
  //   type: String,
  //   required: true,
  //   unique: true,
  //   minlength: 2,
  //   trim: true,
  //   lowercase: true,
  // },

  // 1. Test that all required fields must be present (username, email, password)
  test('should require username, email and password', async () => {
    await expect(User.create({})).rejects.toThrow();
    await expect(User.create({ username: 'testuser1' })).rejects.toThrow();
    await expect(User.create({ email: 'testuser1@email.com' })).rejects.toThrow();
    await expect(User.create({ password: 'TestUser1P@ssword' })).rejects.toThrow();
  });

  // 2. Test that username must be at least min length of 2 characters
  test('should enforce minimum username length', async () => {


  // Trim whitespace from username

  // Lowercase username before saving

  // Enforce unique username

  // password: {
  //   type: String,
  //   required: true,
  //   validate: {
  //     validator: (password) =>
  //       isStrongPassword(password, {
  //         minLength: 8,
  //         minLowercase: 1,
  //         minUppercase: 1,
  //         minNumbers: 1,
  //         minSymbols: 1,
  //       }),
  //     message:
  //       'Password must be at least 8 characters long, and contain: one lowercase letter, one uppercase letter, one number and one special character.',
  //   },

  // Reject user with weak password

  // Password is hashed before saving

  // email: {
  //   type: String,
  //   required: true,
  //   unique: true,
  //   lowercase: true,
  //   validate: {
  //     validator: (email) => isEmail(email),
  //     message: 'Please enter a valid email',
  //   },

  // Enforce unique email / reject user with duplicate email

  // Reject user with invalid email

  // Lowercase email before saving


  // isAdmin: {
  //   type: Boolean,
  //   default: false,
  // },

  // Default isAdmin to false

  // reelProgress: {
  //   type: [reelProgressSchema],
  //   // added default to empty list for new users starting with no reel progress
  //   default: [],
  // },

  // Default reelProgress to empty array for new users

  // userSchema.pre('save', async function hashPassword(next) {
  //   if (!this.isModified('password')) {
  //     return next();
  //   }

  //   try {
  //     const salt = await bcrypt.genSalt(12);
  //     // replace plain text pw with bcrypt hashed pw
  //     this.password = await bcrypt.hash(this.password, salt);
  //     return next();
  //   } catch (error) {
  //     return next(error);
  //   }
  // });

  // Password is hashed before saving
