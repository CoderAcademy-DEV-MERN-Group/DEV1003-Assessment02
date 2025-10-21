// this is one of the two major ones, users are integral

/*
User model requires:
   - username: String, required, unique
   - profilePicture: hard to implement, better to use avatars stored in React if we want to implement it
   - password: hashed.String, required, unique (no hashed passwords should ever be the same anyway due to salting)
     - passwordValidator middleware
     - Schema validation rules:
       - minLength 8
       - 1 upper case
       - 1 lower case
       - 1 number
       - 1 special symbol
   - email: String, required, unique
     - Validation rules:
       - must be valid format
   - isAdmin: Boolean, default: true
   - ReelProgress: Sub-document
     - movie: mongoose.ObjectId, ref: 'Movie'
     - isWatched: Boolean
     - isRated: Boolean
     - watchedAt: Date (timestamps)
   - Ratings: Sub-document
     - movie: mongoose.ObjectId, ref: 'Movie'
     - rating: Number
     - ratedAt: Date (timestamps)
     - updatedAt: Date (timestamps)
*/

import mongoose from 'mongoose';
import { isStrongPassword, isEmail } from 'validator';
import bcrypt from 'bcrypt';

const { Schema } = mongoose;

// const userStatsSchema = new Schema(
//   {
//     leaderboard_position: {
//       type: Number,
//       default: null
//     },
//     reel_progress: {
//       type: Number,
//       min: 0,
//       max: 100,
//       default: 0
//     },
//     reel_score: {
//       type: Number,
//       default: 0
//     },
//     most_watched_genre: {
//       type: String
//     },
//     highest_rated_genre: {
//       type: String
//     },
//   }
// );

// const userMovieSchema = new Schema(
//   {
//     movie_ID: {
//       type: Schema.Types.ObjectId,
//       ref: 'Movie',
//       required: true,
//       unique: true
//     },
//     is_watched: {
//       type: Boolean
//     },
//     rating: {
//       // need to update on ERD
//       type: Number,
//       min: 1,
//       max: 5,
//       default: null
//     },
//     is_scratched: {
//       type: Boolean
//     },
//   },
//   {
//     timestamps: true
//   },
// );

// reel progress subdoc schema (combined with ratings to keep simple for now)
const reelProgressSchema = new mongoose.Schema(
  {
    movie: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Movie',
      required: true,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: null,
    },
    isWatched: {
      type: Boolean,
      default: false,
    },
    isRated: {
      type: Boolean,
      default: false,
    },
  },
  /*
  thinking if we need to add explicit watchedAt timestamp field here to use for leaderboards controller logic?
  as below timestamp: true option, will only create timestamps for when the subdoc is created/modified
  but not explicity when marked as watched
  */
  {
    timestamps: true,
  },
);

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 2,
    trim: true,
  },
  // not implementing profilePicture for now (maybe use avatars in React instead)
  password: {
    type: String,
    required: true,
    validate: {
      validator: (password) =>
        isStrongPassword(password, {
          minLength: 8,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1,
        }),
      message:
        'Password must be at least 8 characters long, and contain: one lowercase letter, one uppercase letter, one number and one special character.',
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: {
      validator: (email) => isEmail(email),
      message: 'Please enter a valid email',
    },
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  reelProgress: {
    type: [reelProgressSchema],
    // added default to empty list for new users starting with no reel progress
    default: [],
  },
  // do we want to include timestamps to track doc for user creation and updates too?
});

// hash pw before doc is saved to db (when pw created or changed)
userSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(12);
    // replace plain text pw with bcrypt hashed pw
    this.password = await bcrypt.hash(this.password, salt);
    return next();
  } catch (error) {
    return next(error);
  }
});

export default mongoose.model('User', userSchema);
export { reelProgressSchema };

// export { userStatsSchema, userMovieSchema };
