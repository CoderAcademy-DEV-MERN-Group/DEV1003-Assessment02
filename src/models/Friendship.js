// friendships will be the most basic version of friendships we can do successfully

// 5. Friend System
//    - Friendship model. Leverages:
//      - User model
//    - Friendship controller

// friendship collection between two users, when user A sends a friend request and userB accepts

import mongoose from 'mongoose';

const { Schema } = mongoose;

const friendshipSchema = new Schema(
  {
    requesterUserId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    recipientUserId: {
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

// added unique index to prevent duplicate friendship requests between the same users
friendshipSchema.index(
  {
    requesterUserId: 1,
    recipientUserId: 1,
  },
  { unique: true },
);

// added index to help with querying a user's friendships (for requester and recipient)
friendshipSchema.index({ requesterUserId: 1 });
friendshipSchema.index({ recipientUserId: 1 });

export default mongoose.model('Friendship', friendshipSchema);
