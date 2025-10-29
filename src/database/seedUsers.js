import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Import the user model
import User from '../models/User';
import Movie from '../models/Movie';

// allow .env access
dotenv.config();

// Dynamic seed script for users, pulling random ids of movies and assigning random ratings,
// should work with existing ids and not fail in dev or prod despite unique movie ids

// Dynamically choose dev or prod database
const DATABASE_URI =
  process.env.NODE_ENV === 'production' ? process.env.DATABASE_URI : process.env.LOCAL_DB_URI;

// Helper to select random amount of movies - uses Fisher-Yates shuffle method, and array of movieIds in database
function pickRandom(moviesArray, count) {
  const copy = [...moviesArray]; // Create copy of moviesArray

  for (let i = 0; i < count && i < copy.length; i += 1) {
    // Choose a random index from remaining movieIds (current i in loop to end of array)
    const swapIndex = i + Math.floor(Math.random() * (copy.length - i));
    // Swap current index with randomly chosen movieId
    [copy[i], copy[swapIndex]] = [copy[swapIndex], copy[i]];
  }
  return copy.slice(0, count); // Return first 'count' number of movieIds from the randomly selected index
}

// Helper to give a random rating 1-5 with 10% chance of null (accurate representation of user activity)
function randomRating() {
  // IF random float is up to 0.9, return random int between 1 - 5 : otherwise null
  return Math.random() < 0.9 ? Math.floor(Math.random() * 5) + 1 : null;
}

async function seedUsers() {
  try {
    console.log(
      `Connecting to ${process.env.NODE_ENV === 'production' ? 'production' : 'development'} database...`,
    );

    // Connect to mongo server, if not available, exit early
    try {
      await mongoose.connect(DATABASE_URI, {
        serverSelectionTimeoutMS: 5000,
      });
    } catch (error) {
      console.error('Database connection failed: ', error);
      process.exit(1);
    }

    console.log('Connected to MongoDB!');

    // Get all ids from movies in movie collection
    const movies = await Movie.find({}, '_id');
    // IF no movies:
    if (!movies.length) {
      console.log('No movies found. Please seed movies first.');
      process.exit(1);
    }

    // Map movie ids to an array
    const movieIds = movies.map((movie) => movie.id);

    console.log(`Found ${movieIds.length} movies in database.`);

    // Array of sample users
    const sampleUsers = [
      { username: 'cinematicAddict', email: 'email@example.com' },
      { username: 'filmFanatic', email: 'email2@example.com' },
      { username: 'reelWatcher', email: 'email3@example.com' },
      { username: 'oldSchoolHollywoodCool', email: 'email4@example.com' },
      { username: 'indieGuru', email: 'email5@example.com' },
      { username: 'AJ', email: 'email6@example.com' },
      { username: 'adminUser', email: 'adminemail@example.com', isAdmin: true },
    ];

    // Promise chain through user array and upsert users: prevents duplicates
    // and protects prod users, no drop all before. Will make a separate
    // drop users script for dev only
    // Promise all runs in parallel, execution is not always sequential
    await Promise.all(
      // Map the sample user data
      sampleUsers.map(async (userData) => {
        // Random amount of watched movies between 1-20 (for brevity)
        const watchedCount = Math.floor(Math.random() * 20) + 1;
        // Pick random movies based on watchedCount
        const watchedMovies = pickRandom(movieIds, watchedCount);

        // Create reelProgress records from watchedMovies array
        const reelProgress = watchedMovies.map((movieId) => ({
          movie: movieId,
          rating: randomRating(),
          isWatched: true,
        }));

        // Set userData for upsert:
        const upsertData = {
          email: userData.email,
          password: 'StrongPassword1!',
          reelProgress,
          // isAdmin is either undefined and left out OR isAdmin is userData.isAdmin
          ...(userData.isAdmin !== undefined && { isAdmin: userData.isAdmin }),
        };

        // Upsert the user (update existing, create if non existent)
        await User.updateOne(
          { username: userData.username },
          {
            $set: { ...upsertData },
          },
          { upsert: true },
        );
        // Logs per user, may be non-sequential due to parallelism
        console.log(`Upserted user: ${userData.username}`);
      }),
    );

    console.log('User seed completed!');
  } catch (error) {
    console.error('Seed failed: ', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed.');
  }
}

seedUsers();
