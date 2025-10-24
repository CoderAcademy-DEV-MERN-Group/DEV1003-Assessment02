import { afterAll, beforeAll, beforeEach, describe, expect, it } from '@jest/globals';
import request from 'supertest';
import { clearTestDb, setupTestDb, teardownTestDb } from '../setup/testDb';
import { movieFixture } from '../setup/fixtures';
import { app } from '../../server';
import Movie from '../../models/Movie';
import { authenticatedRequest } from '../setup/authHelper';

describe('Movie Routes', () => {
  // set up the empty authHeader variable
  let authHeader;

  beforeAll(async () => {
    await setupTestDb();
  });

  afterAll(async () => {
    await teardownTestDb();
  });

  // before each request, set the authHeader variable using the authenticatedRequest helper function
  // Check the authHelper file for full functionality and usage details
  beforeEach(async () => {
    await clearTestDb();
    authHeader = await authenticatedRequest();
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
    it('should return a single movie matching the search query if title is unique', async () => {
      const movie = await Movie.create(movieFixture());

      const response = await request(app)
        .get(`/movies/search?title=${movie.title}`)
        .set(authHeader) // This is where the authHelper functions are implemented
        .expect(200);

      expect(response.body.movie.title).toBe(movie.title);
    });

    it('should return an array of movies if title is not unique', async () => {
      const movie = await Movie.create(movieFixture({ title: 'sametitle' }));
      await Movie.create(movieFixture({ title: 'sametitle' }));

      const response = await request(app)
        .get(`/movies/search?title=${movie.title}`)
        .set(authHeader)
        .expect(200);

      expect(response.body.movies.length).toBe(2);
      expect(response.body.movies[0].title).toStrictEqual(response.body.movies[1].title);
    });

    it('should fail if the user is not logged in', async () => {
      const movie = await Movie.create(movieFixture());

      const response = await request(app).get(`/movies/search?title=${movie.title}`).expect(401);

      expect(response.body.message).toBe('Access denied. No token provided.');
    });

    it('should fail if the movie does not exist', async () => {
      await Movie.create(movieFixture());

      const response = await request(app)
        .get('/movies/search?title=wrongtitle')
        .set(authHeader)
        .expect(400);

      expect(response.body.message).toBe('Movie not found');
    });

    it('should fail if the query is not title', async () => {
      const movie = await Movie.create(movieFixture());

      const response = await request(app)
        .get(`/movies/search?someotherquery=${movie.title}`)
        .set(authHeader)
        .expect(400);

      expect(response.body.message).toBe('Title search parameter required');
    });
  });

  describe('POST /movies/', () => {
    it('should create a new movie when authenticated', async () => {
      const movieData = movieFixture();

      const response = (await request(app).post('/movies/'))
        .set(authHeader)
        .send(movieData)
        .expect(201);

      expect(response.body).toMatchObject({
        success: true,
        message: 'Movie created successfully',
        movie: {
          title: movieData.title,
          imdbId: movieData.imdbId,
        },
      });
    });

    it('should fail to create movie when not authenticated', async () => {
      const movieData = movieFixture();

      const response = await request(app).post('/movies/').send(movieData).expect(401);

      expect(response.body).toMatchObject({
        message: 'Access denied. No token provided.',
      });
    });

    it('should fail to create movie with duplicate imdbId', async () => {
      const existingMovie = await Movie.create(movieFixture());
      const duplicateMovieData = movieFixture({ imdbId: existingMovie.imdbId });

      const response = await request(app)
        .post('/movies/')
        .set(authHeader)
        .send(duplicateMovieData)
        .expect(400);

      expect(response.body).toMatchObject({
        success: false,
      });
    });
  });
});
