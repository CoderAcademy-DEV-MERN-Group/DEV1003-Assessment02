import request from 'supertest';
import mongoose from 'mongoose';
import express from 'express';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from '@jest/globals';
import { app } from '../../server';
import User from '../../models/User';
import { userFixture } from '../setup/fixtures';
import { clearTestDb, setupTestDb, teardownTestDb } from '../setup/testDb';

describe('Auth Routes', () => {
  beforeAll(async () => {
    await setupTestDb();
  });

  afterAll(async () => {
    await teardownTestDb();
  });

  beforeEach(async () => {
    await clearTestDb();
  });

  describe('POST /auth/register', () => {
    it('should register a new user with valid user data', async () => {
      const userData = userFixture();
      const response = await request(app).post('/auth/register').send(userData).expect(201);

      expect(response.body).toMatchObject({
        success: true,
        message: 'User registration complete',
        token: expect.any(String),
        // isAdmin should not be included by default
        user: {
          username: userData.username,
          email: userData.email,
        },
      });
      expect(response.body.user.isAdmin).toBeUndefined();
    });
    it('should reject duplicate email or username', async () => {
      const userData = userFixture();
      await User.create(userData)
      const response = await request(app).post('/auth/register').send(userData).expect(409);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toMatch('Email or username already exists')
    });
  });
});
