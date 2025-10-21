/* eslint-disable no-console, no-await-in-loop */

import { readFileSync } from 'fs';
import mongoose from 'mongoose';
import fetch from 'node-fetch';
import Movie from '../models/Movie.js';

const API_KEY = process.env.OMDB_API_KEY;

// Database environment variable detection for deployment vs local development
const MONGODB_URI =
  process.env.NODE_ENV === 'production' ? process.env.MONGODB_URI : process.env.LOCAL_DB_URI;

const moviesList = JSON.parse(readFileSync('./src/database/movies.json', 'utf8'));

async function getMovieMetadata(imdbId) {
  try {
    const url = `https://www.omdbapi.com/?i=${imdbId}&apikey=${API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.Response === 'False') return null;

    return {
      title: data.Title,
      year: data.Year,
      director: data.Director,
      genre: data.Genre ? data.Genre.split(', ').map((gen) => gen.trim()) : [],
      plot: data.Plot,
      actors: data.Actors ? data.Actors.split(', ').map((act) => act.trim()) : [],
      imdbId,
      poster: data.Poster,
    };
  } catch (error) {
    console.log(`Failed to fetch ${imdbId}: `, error.message);
    return null;
  }
}

async function seedDatabase() {
  try {
    console.log(
      `Connecting to ${
        process.env.NODE_ENV === 'production' ? 'production' : 'development'
      } database...`,
    );

    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB!');

    await Movie.deleteMany({});
    console.log('Clearing existing movies...');

    const movieEntries = Object.entries(moviesList);
    console.log(`Seeding ${movieEntries.length} movies...`);

    let createdCount = 0;
    let errorCount = 0;

    for (let index = 0; index < movieEntries.length; index += 1) {
      const [title, imdbId] = movieEntries[index];

      const movieData = await getMovieMetadata(imdbId);

      if (movieData) {
        try {
          await Movie.create(movieData);
          createdCount += 1;
          console.log(`${index + 1}/${movieEntries.length}: ${title} CREATED`);
        } catch (error) {
          errorCount += 1;
          console.log(`${index + 1}/${movieEntries.length}: ${title} DB ERROR:`, error.message);
        }
      } else {
        errorCount += 1;
        console.log(`${index + 1}/${movieEntries.length}: ${title} FETCH FAILED`);
      }

      // Future proofing: rate limiting to respect OMDb's requests per day limit
      await new Promise((resolve) => {
        setTimeout(resolve, 100);
      });
    }

    console.log(`Seed completed! Created: ${createdCount}, Errors: ${errorCount}`);
  } catch (error) {
    console.error('Seed failed: ', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed.');
  }
}

seedDatabase();
