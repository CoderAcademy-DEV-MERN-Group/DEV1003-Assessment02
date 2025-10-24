import mongoose from 'mongoose';

const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Movie title is required'],
      trim: true,
      maxlength: 200,
    },
    year: {
      type: String,
      required: true,
      match: /^\d{4}$/,
    },
    director: {
      type: String,
      required: true,
      trim: true,
    },
    genre: [
      {
        type: String,
        required: true,
        trim: true,
      },
    ],
    plot: {
      type: String,
      maxlength: 1000,
    },
    actors: [
      {
        type: String,
        required: true,
        trim: true,
      },
    ],
    imdbId: {
      type: String,
      required: true,
      unique: true,
      match: /^tt\d+$/, // Validates the id is tt followed by numbers
    },
    poster: {
      type: String,
      required: true,
    },
    isReelCanon: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model('Movie', movieSchema);
