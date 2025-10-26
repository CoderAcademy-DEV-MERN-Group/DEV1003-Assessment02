// friendships will be the most basic version of friendships we can do successfully

// friendship collection between two users, when user A sends a friend request and userB accepts

import mongoose from 'mongoose';
import { InvalidUserIdError, SelfFriendError } from '../utils/customErrors.js';

const { Schema } = mongoose;

const friendshipSchema = new Schema(
  {
    user1: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    user2: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    // The user who initiated sending the friend request
    requesterUserId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    isAccepted: {
      type: Boolean,
      default: false,
    },
  },
  // Removed enum option for simplicity, can be expanded later
  // friendRequestStatus: {
  //   type: String,
  //   enum: ['pending', 'accepted', 'rejected'],
  //   default: 'pending',
  // },
  {
    timestamps: true,
  },
);

/*
Pre validations for friend requests before saving to the database
  - Checks both userIds are both valid user ObjectIds
  - Checks that userIds are not the same to prevent user from friending themselves
  - Normalises the order of userIds so that (User1, User2) is equivalent to (User2, User1)
*/
friendshipSchema.pre('validate', function ValidateFriendRequests(next) {
  // If either user ObjectId are invalid, skip the rest of the validation
  if (!this.user1 || !this.user2) {
    return next(new InvalidUserIdError());
  }

  // Convert the user ObjectIds to Strings to use for sorting order/comparison
  const user1Id = this.user1.toString();
  const user2Id = this.user2.toString();

  // Invalidates if both userIds are the same to prevent user from self-friending themselves
  if (user1Id === user2Id) {
    this.invalidate('user2Id', 'A user cannot friend request themselves.');
    return next(new SelfFriendError());
  }

  // Sort the order of the userId pairs
  if (user1Id > user2Id) {
    [this.user1, this.user2] = [this.user2, this.user1];
  }
  return next();
});

// Unique index for both user Ids to enforce uniqueness of friendships between two users
friendshipSchema.index(
  {
    user1: 1,
    user2: 1,
  },
  { unique: true },
);

// To help with query indexes to find friendship by user1, user2 and requesterUserId
friendshipSchema.index({ user1: 1 });
friendshipSchema.index({ user2: 1 });
friendshipSchema.index({ requesterUserId: 1 });

export default mongoose.model('Friendship', friendshipSchema);
