// friendships will be the most basic version of friendships we can do successfully

// friendship collection between two users, when user A sends a friend request and userB accepts

import mongoose from 'mongoose';

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

// Normalise userId order before validation so the unique index checks for both inverted combinations
friendshipSchema.pre('validate', function (next) {
  // If either userId is invalid, skip to next validation
  if (!this.user1 || !this.user2) return next();

  const user1Id = this.user1.toString();
  const user2Id = this.user2.toString();

  // Invalidates if both userIds are the same to prevent user from self-friending themselves
  if (user1Id === user2Id) {
    this.invalidate('user2Id', 'A user cannot friend request themselves.');
    next();
  }

  // Sort the order of the userId pairs (so that User1 and User 2 === User2 and User1)
  if (user1Id > user2Id) {
    [this.user1, this.user2] = [this.user2, this.user1];
  }
  return next();
});

// enforce uniqueness for the unordered pair (to prevent duplicate friend requests between same set of users)
friendshipSchema.index(
  {
    user1Id: 1,
    user2Id: 1,
  },
  { unique: true },
);

// added index to help with querying a user's friendships (for requester and recipient)
friendshipSchema.index({ requesterUserId: 1 });
friendshipSchema.index({ recipientUserId: 1 });

export default mongoose.model('Friendship', friendshipSchema);
