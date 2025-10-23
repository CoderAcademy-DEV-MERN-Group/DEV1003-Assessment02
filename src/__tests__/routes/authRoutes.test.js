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

    it('should reject duplicate email', async () => {
      const existingUser = await User.create(userFixture());
      const newUser = userFixture({
        username: 'differentusername',
        email: existingUser.email,
      });

      const response = await request(app).post('/auth/register').send(newUser).expect(409);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toMatch('Email or username already exists');
    });

    it('should reject duplicate username', async () => {
      const existingUser = await User.create(userFixture());
      const newUser = userFixture({
        username: existingUser.username,
        email: 'differenteemail@emal.com',
      });

      const response = await request(app).post('/auth/register').send(newUser).expect(409);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toMatch('Email or username already exists');
    });
  });

  describe('POST /auth/login', () => {
    it('should successfully login with correct credentials', async () => {
      const userData = userFixture();
      await User.create(userData);

      const response = (await request(app).post('/auth/login'))
        .send({
          email: userData.email,
          password: userData.password,
        })
        .expect(200);

      expect(response.body).toMatch
    });
  });
});
