/* eslint-disable no-console */
/* Main server module for setting up express app instance, general middleware and routes,
configuration using environment variables and connecting to database. */

import dotenv from 'dotenv';
import helmet from 'helmet';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { databaseConnector } from './config/database';
import {
  FriendshipController,
  LeaderboardController,
  ListController,
  MovieController,
  RatingController,
  UserController,
} from './controllers/index';

dotenv.config(); // Make .env data available for use
const app = express(); // Create the Express app object

// Configure middleware

// Configure some API-friendly request data formatting
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure Helmet settings
app.use(helmet());

// The below is redundant with app.use(helmet()) unless we want to add to directives like defaultSrc
app.use(
  helmet.contentSecurityPolicy({
    directives: { defaultSrc: ["'self'"] },
  }),
);

// Configure CORS settings (allows cross-origin requests from frontend)
app.use(
  cors({
    // Replace with deployed frontend URL when applicable
    origin: ['http://localhost:5000', 'https://deployedApp.com'],
    optionsSuccessStatus: 200,
  }),
);

/* Possibly add rate limiting here later using express-rate-limit package, 
with different rate limit for general and login routes. */

// Render will set env variables for HOST and PORT, will default to localhost:3000 in dev
const HOST = process.env.HOST || 'localhost';
const PORT = process.env.PORT || 3000;

// Attach routes to the app
app.use('/friendships', FriendshipController);
app.use('/leaderboard', LeaderboardController);
app.use('/lists', ListController);
app.use('/movies', MovieController);
app.use('/ratings', RatingController);
app.use('/users', UserController);

/* Connect to database, using different DBs depending on environment
(test uses mongodb-memory-server, handled in test setup) */
const URImap = {
  development: 'mongodb://localhost:27017/movie_db',
  production: process.env.DATABASE_URI,
};
// Default to development if NODE_ENV not set correctly
const databaseURL = URImap[process.env.NODE_ENV] || URImap.development;

// Putting connection in function allows use of async/await, reusability and easy testing
async function connectToDatabase(uri) {
  if (!uri) {
    console.error('Incorrect JS environment specified, database will not be connected.');
    return; // Return to exit function early
  }
  try {
    await databaseConnector(uri);
    console.log('Database connected successfully!');
  } catch (err) {
    console.error(`Some database connection error occurred: ${err}`);
  }
}

// Only connect to database if not in test environment (tests use different db setup)
if (process.env.NODE_ENV !== 'test') await connectToDatabase(databaseURL);

/* Return useful details from the database connection, properties here:
https://mongoosejs.com/docs/api/connection.html */
app.get('/database-health', (req, res) => {
  // Return object with details about current database connection
  res.json({
    // Shows current connection status to MongoDB
    // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
    readyState: mongoose.connection.readyState,
    // Name of the current database being used
    dbName: mongoose.connection.name,
    // Array of all model names registered with current connection
    dbModels: mongoose.connection.modelNames(),
    // Database connection string host (IP address or domain name)
    dbHost: mongoose.connection.host,
    // The port MongoDB is running on
    dbPort: mongoose.connection.port,
    // The username used to connect to the database (null if none)
    dbUser: mongoose.connection.user || null,
  });
});

// Add basic test route
app.get('/', (req, res) => {
  res.json({ message: 'Hello World!' });
});

/* Route to dump all database data (will only be available in development and test environments)
DO NOT USE IN PRODUCTION - EXPOSES ALL DATA TO CLIENT!!! */
if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
  app.get('/databaseDump', async (req, res) => {
    // Get names of all collections in DB
    const collections = await mongoose.connection.db.listCollections().toArray();
    // For each collection, get all their data and add to dumpContainer
    const dumpContainer = {};
    /* Promise.all runs all async tasks concurrently instead of sequentially,
    MongoDB is concurrent so this is faster */
    await Promise.all(
      collections.map(async (collection) => {
        const collectionData = await mongoose.connection.db
          .collection(collection.name)
          .find({})
          .toArray();
        dumpContainer[collection.name] = collectionData;
      }),
    );
    // Confirm in terminal that server returns correct data
    console.log(
      'Dumping all of this data to the client: \n',
      JSON.stringify(dumpContainer, null, 4),
    );
    // Return the data object
    res.json({ data: dumpContainer });
  });
}

// Error-handling middleware (should be last)
// Logs full error on server, sends generic message to client for security
// Implement specific error handling above this later for better client messages
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: 'An unexpected error occurred. Please try again later.' });
});

// Keep 404 route at the bottom, should only trigger if no proceeding route was matched
app.all(/.*/, (req, res) => {
  res.status(404).json({
    message: 'No route with that path found!',
    attemptedPath: req.path,
  });
});

// Export everything needed to run server
export { HOST, PORT, app };
