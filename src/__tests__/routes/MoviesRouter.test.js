import { afterAll, beforeAll, beforeEach, describe, expect, it } from '@jest/globals';
import request from 'supertest';
import { clearTestDb, setupTestDb, teardownTestDb } from '../setup/testDb';
import { movieFixture } from '../setup/fixtures';
import { app } from '../../server';
import Movie from '../../models/Movie';
import getAuthToken from '../setup/authHelper';

describe('Movie Routes', () => {
  beforeAll(async () => {
    await setupTestDb();
  });

  afterAll(async () => {
    await teardownTestDb();
  });

  beforeEach(async () => {
    await clearTestDb();
  });

  describe('GET /movies/reel-canon', () => {
    it('should get all movies which are in the Reel Canon', async () => {
      await Movie.create(Array.from({ length: 5 }, () => movieFixture()));
      await Movie.create(movieFixture({ isReelCanon: false }));

      const response = await request(app).get('/movies/reel-canon');

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(5);
      response.body.forEach((movie) => {
        expect(movie).toHaveProperty('title');
        expect(movie).toHaveProperty('year');
        expect(movie).toHaveProperty('director');
        expect(movie).toHaveProperty('imdbId');
        expect(movie.isReelCanon).toBe(true);
      });
    });
  });

  describe('GET /movies/search?query', () => {
    it('should get a movie matching the search query', async () => {
      const movie = await Movie.create(movieFixture());
      const token = await getAuthToken();

      const response = await request(app)
        .get(`/movies/search?title=${movie.title}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.movie.title).toBe(movie.title);
    });
  });
});
