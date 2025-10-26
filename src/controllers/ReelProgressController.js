import Movie from '../models/Movie';
import User from '../models/User';

// CRUD FUNCTIONS FOR REELPROGRESS

// Create reelProgress record (user)
export const createReelProgress = async (request, response, next) => {
  try {
    // set up the userId using JWT token
    const { userId } = request.user;
    // Get movie data from the request body (validated by helper function)
    const reelData = request.body;

    // Check if the movie with supplied id exists
    const movie = await Movie.findById(reelData.movie);
    if (!movie) {
      return response.status(404).json({
        success: false,
        message: 'Movie not found',
      });
    }

    // Check if movie already exists in user's reelProgress
    const existingReelProgress = await User.findOne({
      _id: userId,
      'reelProgress.movie': reelData.movie,
    });

    // IF Movie is already in reelProgress - prevents duplicates
    if (existingReelProgress) {
      return response.status(409).json({
        success: false,
        message: 'Movie already in your reel',
      });
    }

    // Add new record (only if it doesn't exist)
    await User.findByIdAndUpdate(
      userId,
      { $push: { reelProgress: reelData } },
      { new: true, runValidators: true },
    );

    return response.status(201).json({
      success: true,
      message: `${movie.title} added to your Reel Progress`,
      addedMovieId: reelData.movie,
    });
  } catch (error) {
    return next(error);
  }
};

export const getReelProgress = async (request, response, next) => {
  try {
    // attach the user from the JWT
    const { userId } = request.user;

    // Select only the relevant data for the response
    const userData = await User.findById(userId).select(
      'reelProgress.movie reelProgress.rating reelProgress.isWatched',
    );

    // Check the user has reelProgress records
    if (!userData) {
      return response.status(404).json({
        success: false,
        message: 'No Reel Progress records found',
      });
    }

    // Return entire array to the front end
    return response.status(200).json({
      success: true,
      message: 'Reel Progress records found',
      reelProgress: userData.reelProgress, // ← Get the array from first result
    });
  } catch (error) {
    return next(error);
  }
};

// Get a single reelProgress record (user) is not needed for any front end purposes

// Update reelprogress record (rating - user)
export const updateReelProgress = async (request, response, next) => {
  try {
    const { userId } = request.user;
    const { movieId } = request.params;
    const { rating } = request.body;

    // Update the specific movie's rating in the user's reelProgress
    const userReelProgress = await User.findOneAndUpdate(
      {
        _id: userId,
        'reelProgress.movie': movieId,
      },
      {
        $set: {
          'reelProgress.$.rating': rating,
        },
      },
      {
        runValidators: true,
      },
    );

    // If the user has no reel progress record for that movie:
    if (!userReelProgress) {
      return response.status(404).json({
        success: false,
        message: 'Movie not found in your Reel Progress',
      });
    }

    return response.status(200).json({
      success: true,
      message: 'Rating updated',
      newRating: rating,
    });

    // Upon success:
  } catch (error) {
    return next(error);
  }
};

// Delete reelProgress record (user)

// Get reelProgress records (all - admin)

// Get reelProgress single (any-user admin)

// Update reelProgress record (any-user admin)

// Delete reelProgress record (any-user admin)
