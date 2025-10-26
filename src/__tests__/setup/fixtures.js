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

// Since most movie data is not covered by default faker functions, I have used random
// and lorem methods, so I can test routes which get multiples.
export const movieFixture = (overrides = {}) => ({
  title: faker.lorem.words(3),
  year: faker.number.int({ min: 1920, max: 2023 }).toString(),
  director: faker.person.fullName(),
  genre: [faker.word.adjective(), faker.word.adjective()],
  plot: faker.lorem.sentences(1).substring(0, 200),
  actors: Array.from({ length: 3 }, () => faker.person.fullName()),
  imdbId: `tt${faker.number.int({ min: 1000000, max: 9999999 })}`,
  poster: faker.image.url(),
  isReelCanon: true,
  ...overrides,
});

export const friendshipFixture = (overrides = {}) => ({
  // Fill this out after creating movie model
  ...overrides,
});
