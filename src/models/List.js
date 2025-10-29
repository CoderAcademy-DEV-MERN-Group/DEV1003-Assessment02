// List is definitely a thing, we can give each list a description, created at and created by (eventually)

// 5. List model requires:
//    - movies: [mongoose.ObjectId, ref: 'Movie']
//    - listName: String, required, unique
//    - description: String
//    - creator: mongoose.ObjectId, ref: 'User'
//    - Discriminator: ReelCanon (fixed) CustomList (user-created)

import mongoose from 'mongoose';
import Movies from './Movie.js';

const { Schema } = mongoose;

// List schema for custom lists created by users
const listSchema = new Schema(
  {
    // array of movie object IDs
    movies: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Movie',
        // the reel canon will have 100 movies from fixed seeded movies db,
        // users can make their own customlists with selection of these movies
        // required: true,  // should make required true? otherwise empty lists may be created
      },
    ],
    listName: {
      type: String,
      required: true,
      unique: true,
      minlength: 2,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      // should we add min/max length or make default empty string if not required?
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    // check to clarify discriminator section
    // listType: {
    //   type: String,
    //   enum: {
    //     values: ['ReelCanon', 'CustomList'],
    isReelCanon: {
      type: Boolean,
      ref: Movies.Boolean,
    },
  },
  {
    timestamps: true,
  },
);

// Ensure a user cannot create multiple lists with the same name
// Check if customlist is unique per user or if it will be publicly unique
listSchema.index({ creator: 1, listName: 1 }, { unique: true });

// presave hook - prevent the reelcanon movie list from being changed or deleted
listSchema.pre('save', function ValidateReelCannonModification(next) {
  if (this.isReelCanon) {
    if (this.isModified('movies')) {
      const error = error('Reel Canon movie list cannot be modified or deleted');
      return next(error);
    }

export default List = mongoose.model('List', listSchema);
