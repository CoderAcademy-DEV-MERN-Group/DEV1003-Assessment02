import User from '../models/User';

// Validation middleware for all user registering, validation for login can happen in route (more basic, instantaneous response)
const validateUserRegistration = async (request, response, next) => {
  try {
    //  Reuse schema validation rules for DRY coding principles
    const tempUser = new User(request.body);
    await tempUser.validate();

    // Checks for unique username and email separately using $or
    const existingUser = await User.findOne({
      $or: [{ email: request.body.email }, { username: request.body.username }],
    });

    if (existingUser) {
      return response.status(409).json({
        success: false,
        message: 'Email or username already exists',
      });
    }

    return next();
  } catch (error) {
    return next(error);
  }
};

const validateLogin = (request, response, next) => {
  const { email, password } = request.body;

  // IF there is no email or password provided
  if (!email || !password) {
    return response.status(400).json({
      success: false,
      message: 'Email and password are required',
    });
  }

  return next();
};

// // Validation for friend request existence and duplicates
// const validateFriendRequest = async (req, res, next) => {
//   try {
//     // support either requester/recipient naming or user1/user2
//     const requester = req.body.requesterUserId || req.body.user1;
//     const recipient = req.body.recipientUserId || req.body.user2;

//     // ensures both userIds are provided
//     if (!requester || !recipient) {
//       return next(new InvalidUserIdError());
//     }

//     // ensure valid ObjectIds
//     if (!mongoose.isValidObjectId(requester) || !mongoose.isValidObjectId(recipient)) {
//       return next(new InvalidUserIdError());
//     }

//     // prevent user from requesting friendship with themselves
//     if (requester.toString() === recipient.toString()) {
//       return next(new SelfFriendError());
//     }

//     // ensure users exist
//     const [rUser, rcptUser] = await Promise.all([
//       User.findById(requester),
//       User.findById(recipient),
//     ]);

//     if (!rUser || !rcptUser) {
//       return next(new InvalidUserIdError());
//     }

//     // normalise order to check existing friendship
//     const [a, b] = [requester.toString(), recipient.toString()].sort();
//     const existing = await Friendship.findOne({ user1: a, user2: b });
//     if (existing) {
//       const err = new Error('Friendship already exists between these users');
//       err.statusCode = 409;
//       return next(err);
//     }

//     return next();
//   } catch (error) {
//     return next(error);
//   }
// };

export { validateUserRegistration, validateLogin };
