// List is definitely a thing, we can give each list a description, created at and created by (eventually)

// 5. List model requires:
//    - movies: [mongoose.ObjectId, ref: 'Movie']
//    - listName: String, required, unique
//    - description: String
//    - creator: mongoose.ObjectId, ref: 'User'
//    - Discriminator: ReelCanon (fixed) CustomList (user-created)

import mongoose from 'mongoose';

const { Schema } = mongoose;

// List schema for custom lists created by users
const listSchema = new Schema({
  // array of movie object IDs
  movies: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Movie',
      required: true,
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
  },
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  // check to clarify discriminator section
});

export const List = mongoose.model('List', listSchema);
