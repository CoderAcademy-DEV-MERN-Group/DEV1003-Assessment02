import { request } from 'http';
import Movie from '../models/Movie';
import { response } from 'express';

// GET reelCanon movies
export const getReelCanon = async (request, response, next) => {
  try {
    // Find all movies with isReelCanon
    const movies = await Movie.find({ isReelCanon: true });
    return response.json(movies);
    // Pass errors to the error handler
  } catch (error) {
    return next(error);
  }
};

// GET search movies
export const searchMovie = async (request, response, next) => {
  // Search by either title or imdbId ()
  try {
    const { title } = request.query;

    // If no title is supplied
    if (!title) {
      return response.status(400).json({
        success: false,
        message: 'Title search parameter required',
      });
    }

    // Find movie\s with that title
    const movies = await Movie.find({ title });

    // If no movies are found:
    if (movies.length === 0) {
      return response.status(400).json({
        success: false,
        message: 'Movie not found',
      });
    }

    // If only one movie is found:
    if (movies.length === 1) {
      return response.status(200).json({
        success: true,
        message: 'Movie found',
        movie: movies[0],
      });
    }

    // If movie length is over 1 (same title, different movies):
    return response.status(200).json({
      success: true,
      message: `Found ${movies.length} movies with title "${title}"`,
      movies,
    });
  } catch (error) {
    return next(error);
  }
};

// CREATE movie - front end can fetch API data from OMDb, supplies it to this function directly
export const createMovie = async (request, response, next) => {
  try {
    const movieData = request.body;

    const movie = await Movie.create(movieData);

    return response.status(201).json({
      success: true,
      message: 'Movie created successfully',
      movie,
    });
  } catch (error) {
    return next(error);
  }
};

// UPDATE movie (only poster url)
// export const updateMovieUrl = async (request, response, next) => {
//     try {
//         const { imdbId } = request.params
//     }
// }

// DELETE move (flag for isReelCanon checked)
