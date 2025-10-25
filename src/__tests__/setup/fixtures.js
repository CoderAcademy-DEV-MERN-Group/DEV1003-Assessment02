import { faker } from '@faker-js/faker';
import request from 'supertest';

const { username, email } = faker.internet;

/* Takes optional 'overrides' object to replace any default values, defaults to empty object if not 
provided. Spread operator replaces any default values if key matches, else adds new key/value pairs. */
export const userFixture = (overrides = {}) => ({
  username: username(),
  email: email().toLowerCase(),
  password: 'ExampleStrongPassword1!',
  isAdmin: false,
  ...overrides,
});
// Helper function for user fixture to generate an auth token from login route
export const getAuthToken = async (app, userData) => {
  const { token } = (
    await request(app)
      .post('/auth/login')
      .send({ email: userData.email, password: userData.password })
  ).body;
  return token;
};

export const movieFixture = (overrides = {}) => ({
  // Fill this out after creating movie model
  ...overrides,
});

export const friendshipFixture = (overrides = {}) => ({
  // Fill this out after creating movie model
  ...overrides,
});
