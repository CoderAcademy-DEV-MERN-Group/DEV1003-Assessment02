import { Schema, model } from 'mongoose';
import Movie from './Movie';

// List schema for custom lists created by users
const listSchema = new Schema(
  {
    // array of movie object IDs
    movies: [Movie.schema],
    listName: {
      type: String,
      required: true,
      minlength: 2,
      trim: true,
    },
    description: {
      type: String,
      maxlength: 1000,
      default: `Custom List for ${this.listName}`,
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

// Composite index to ensure user cannot have duplicate listNames
listSchema.index({ creator: 1, listName: 1 }, { unique: true, sparse: true }); // sparse allows multiple user to have 'null' listName

export default model('List', listSchema);
