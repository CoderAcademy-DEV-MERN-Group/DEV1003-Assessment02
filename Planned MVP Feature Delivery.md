# Overall Delivery Plan

## Proposed Development Schedule

1. Offer the minimum viable product, with core features functional and tested.
2. Readme documentation with planned updates:
   - V.0.1: Core functionality created and tested
     - User authentication/authorisation & profiles
     - Reel Canon with 100 movies
     - Rating system & progress tracking
     - Basic friend system
     - Leaderboard
   - V.0.2: Custom lists implemented
     - User-created custom lists
     - List sharing between friends
     - List subscriptions without friendship
     - List comparison features
   - V.0.3: Recommendation algorithm implemented
     - Smart movie suggestions
     - Friend-based recommendations
     - "Next to watch" features
   - V.0.4: Achievements & Advanced Leaderboards
     - Genre-specific leaderboards (requires back-end aggregation)
     - Challenge system
       - Trophies based on Genre
       - Base trophy implementation for Reel Canon 100%ers
   - V.0.5: Enhanced Social & Notification System
     - Movie discussions
     - User reviews
     - Social interactions
     - Notifications for friend requests
   - V.1.0: Fully functional deployment
     - Real-time notifications
     - Production optimization

## MVP Functionality

1. ReelCanon
   - Models:
     - Movie
     - Director
     - Genre
   - Controllers:
     - Movie
     - Rating
     - List
   - Utils:
     - errorHandler
   - Initial movie data pulled from API added to noSQL database through seed function
     - Will not require further calls for ReelCanon in most scenarios, just maintenance for image url checks
     - Create JSON file with array of 100 movie titles, loop through to iterate fetch requests from either OMDb or TMDb Apis. (Likely TMDb, it's free and allows 1000 requests per day which is more than I foresee us needing, especially for the core functionality)
2. Leaderboard
   - Models:
     - User
       - Ratings sub-document
   - Controllers:
     - LeaderboardController. Leverages:
       - Movie Model
       - User Model
3. User Profile
   - Models:
     - User
     - Friendships
   - Controllers:
     - User
     - Friendships
     - Leaderboard
4. Auth:
   - Utils:
     - Authentication & Authorisation
     - passwordValidator
     - bcrypt or similar for hashing
5. Friend System
   - Friendship model. Leverages:
     - User model
   - Friendship controller
6. Ratings
   - Sub-document in User
   - Controller for CRUD operations and aggregates ratings for ReelCanon

---

## Model requirements

1. Movie model requires:
   - title: String, required
   - director: mongoose.ObjectId, ref: 'Director', required
   - genre: [mongoose.ObjectId, ref: 'Genre'], required
   - year: Number, required
   - posterImage: String, required, unique
   - description: String, required
   - overallRating: Number (aggregate)
2. Director model requires:
   - firstName: String, required
   - lastName: String
3. Genre model requires:
   - genreName: String, required
4. User model requires:
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
5. List model requires:
   - movies: [mongoose.ObjectId, ref: 'Movie']
   - listName: String, required, unique
   - description: String
   - creator: mongoose.ObjectId, ref: 'User'
   - Discriminator: ReelCanon (fixed) CustomList (user-created)
6. Friendship model requires:
   - requester: mongoose.ObjectId, ref: 'User'
   - recipient: mongoose.ObjectId, ref: 'User'
   - status: eNUM (pending, accepted, rejected)

---

## Route Requirements

1. AuthRoutes
   - POST login
   - POST register
   - POST logout
2. FriendshipRoutes
   - GET read friendship record
   - POST create friend request
   - PATCH update accept/reject request
   - DELETE delete friendship record
3. LeaderboardRoutes
   - GET leaderboard ranking (middleware aggregate function)
   - POST PATCH DELETE - not required, but if we want to be pedantic we can lock them behind an admin wall
4. ListRoutes
   - admin protected routes for ReelCanon
     - GET read list
     - POST create list
     - PATCH update list
     - DELETE delete list
5. MovieRoutes
   - GET movies
   - PATCH movie by id (admin updates to fix broken links/incorrect data)
6. RatingRoutes
   - GET ratings by user
   - GET aggregate rating
   - POST add rating
   - PATCH update rating
   - DELETE delete rating
7. UserRoutes
   - GET user profile info
   - PATCH update user info
   - DELETE delete user (protected by currentuser and admin)

## Controller Requirements

1. Auth business logic:
   - login
   - register
   - refreshToken
   - logout
2. Friends:
   - sendRequest
   - acceptRequest
   - rejectRequest
   - getFriends
   - removeFriend
3. Leaderboards:
   - getLeaderboard (aggregate function)
4. List:
   - getList
   - createList (admin/future)
   - updateList (admin/future)
   - deleteList (admin/future)
5. Movie:
   - getMovies (all movies)
   - updateMovie
6. Rating:
   - getRatings (by user)
   - getAggregateRatings (for movies)
   - createRating
   - updateRating
   - deleteRating
7. User:
   - getUser (profile)
   - updateUser
   - deleteUser

---

## Utility Requirements

1. Auth:
   - JWT creation
   - token validation logic
   - Password hashing/verification
2. errorHandler
   - robust error handling
3. validation
   - passwordValidator (same as in schema)
   - emailValidator (same as in schema)
   - objectIdValidator
     - 24 char hex
     - char set (0-9, a-f)
     - length
   - ratingValidator (1-5 check)
